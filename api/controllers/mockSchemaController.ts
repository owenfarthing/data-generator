// external imports
import { sql } from 'kysely';
import { UpdateObjectExpression } from 'kysely/dist/cjs/parser/update-set-parser';
import csvStringify from 'csv-stringify/lib/sync';
import path from 'path';
import stream, { Stream, Writable } from 'stream';
import * as mockDataGenerator from 'common/mockDataGenerator';

// internal imports
import { createS3 } from '../utils/aws/s3';
import { NormalizedDataType, NormalizedSchemaRow, SchemaType, User } from '../types/types';
import { webappDB } from '../database/kysely';
import { DB } from '../database/types';
import downloadController from './downloadController';
import processController from './processController';
import config from '../config/constants';
import databricksController from './databricksController';
import IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession';
import { DatabricksSession } from '../types/databricks';
import postgresController from './postgresController';
import { getRawDataType } from '../utils/sqlUtils';

const uuid = require('uuid');

const UNQUOTED_DATATYPES: NormalizedDataType[] = [
	config.NORMALIZED_DATA_TYPES.boolean,
	config.NORMALIZED_DATA_TYPES.decimal,
	config.NORMALIZED_DATA_TYPES.integer
];

export default {
	createSchema,
	getSchema,
	getSchemas,
	saveSchema,
	deleteSchema,
	streamSchemaToDatabase,
	streamSchemaToExport
};

async function createSchema(
	user: User,
	params: {
		name: string,
		schemaType: SchemaType
	}
) {
	try {
		const { name, schemaType } = params;

		if (!name || name.length > 100) return new Error('Invalid schema name');

		return await webappDB
			.insertInto('schemas')
			.columns(['name', 'schema_type', 'schema', 'created_by', 'created_at', 'updated_at'])
			.values({
				name,
				schema_type: schemaType,
				schema: JSON.stringify([]),
				created_by: user.cacid,
				created_at: sql`now()`,
				updated_at: sql`now()`
			})
			.returning('id')
			.executeTakeFirst();
	} catch (e) { throw e; }
}

async function getSchema(user: User, id: number) {
	try {
		if (!id) return new Error('Missing required id');

		return await webappDB
			.selectFrom('schemas')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirstOrThrow(() => new Error('Schema not found'));
	} catch (e) { throw e; }
}

async function getSchemas(user: User, schemaType: SchemaType) {
	try {
		return await webappDB
			.selectFrom('schemas')
			.select(['id', 'name', 'schema_type', 'created_by', 'created_at', 'updated_at'])
			.where('schema_type', '=', schemaType)
			.execute();
	} catch (e) { throw e; }
}

async function saveSchema(
	user: User,
	id: number,
	params: {
		name?: string,
		schema?: NormalizedSchemaRow[]
	}
) {
	try {
		const { name, schema } = params;
		return await webappDB
			.updateTable('schemas')
			.set(() => {
				let updates: UpdateObjectExpression<DB, 'schemas', 'schemas'> = {};
				if (name) updates.name = name;
				if (schema) updates.schema = JSON.stringify(schema);
				if (!Object.keys(updates).length) return new Error('No updates');
				updates.updated_at = sql`now()`;
				return updates;
			})
			.where('id', '=', id)
			.returning('updated_at')
			.executeTakeFirst();
	} catch (e) { throw e; }
}

async function deleteSchema(user: User, id: number) {
	try {
		let schema = await webappDB
			.selectFrom('schemas')
			.select('created_by')
			.where('id', '=', id)
			.executeTakeFirstOrThrow(() => new Error('Could not find schema'));

		if (schema.created_by !== user.cacid) return new Error('User can only delete their own schemas');

		await webappDB.deleteFrom('schemas').where('id', '=', id).execute();
	} catch (e) { throw e; }
}

async function streamSchemaToDatabase(
	user: User,
	schemaId: number,
	params: {
		rowCount: number,
		schema: NormalizedSchemaRow[],
		targetSchema: string,
		targetTable: string,
		createNewTable: boolean,
		replaceData: boolean
	}
) {
	try {
		const { rowCount, schema, targetSchema, targetTable, createNewTable, replaceData } = params;

		if (createNewTable && replaceData) {
			return new Error('Invalid parameters');
		}

		let schemaInfo = await webappDB
			.selectFrom('schemas')
			.select('schema_type')
			.where('id', '=', schemaId)
			.executeTakeFirstOrThrow(() => new Error('Could not find schema'));
		let schemaType = schemaInfo.schema_type as SchemaType;

		if (createNewTable) {
			await createTableFromSchema(schemaType, targetSchema, targetTable, schema);
		}

		if (replaceData) {
			await deleteExistingData(schemaType, targetSchema, targetTable);
		}

		// Record initial process data
		let processRow = await processController.createProcess(user, rowCount);
		if (processRow?.id) {
			streamSchemaToDatabaseAsync(processRow.id, { ...params, schemaType })
				.catch((e) => { throw e; });
		}

		return { processId: processRow?.id };
	} catch (e) { throw e; }
}

async function streamSchemaToExport(
	user: User,
	schemaId: number,
	params: {
		rowCount: number,
		schema?: NormalizedSchemaRow[]
	}
) {
	try {
		let schemaInfo = await webappDB
			.selectFrom('schemas')
			.select(['name', 'schema', 'schema_type'])
			.where('id', '=', schemaId)
			.executeTakeFirstOrThrow(() => new Error('Could not find schema'));

		// Record initial upload status
		let filename = `${schemaInfo.name} Results.csv`;
		let s3Filename = `${uuid.v4()}${path.extname(filename)}`;
		let downloadId = await downloadController.beginDownload(user, schemaId, filename, s3Filename);
		let schema = params.schema ?? JSON.parse(JSON.stringify(schemaInfo.schema)) as NormalizedSchemaRow[];

		if (downloadId) {
			streamSchemaToExportAsync(downloadId, s3Filename, params.rowCount, schema)
				.catch((e) => { throw e; });
		}

		return { downloadId };
	} catch (e) { throw e; }
}

// private methods

async function createTableFromSchema(
	schemaType: SchemaType,
	targetSchema: string,
	targetTable: string,
	schema: NormalizedSchemaRow[]
) {
	try {
		let formattedSchema = schema.map(row => {
			let rawDataType = getRawDataType(schemaType, row.dataType);
			return `${row.field} ${rawDataType}`;
		}).join(',\n');

		let createTableSql = `
		create table if not exists {table}(
			${formattedSchema}
		)`;

		if (schemaType === config.SCHEMA_TYPES[0]) {
			let databricksSql = createTableSql
				.replace('{table}', `${config.DATABRICKS_CATALOG}.${targetSchema}.${targetTable}`);
			await databricksController.runQuery(databricksSql);
		} else {
			let postgresSql = createTableSql.replace('{table}', `${targetSchema}.${targetTable}`);
			await postgresController.runQuery(postgresSql);
		}
	} catch (e) { throw e; }
}

async function deleteExistingData(schemaType: SchemaType, targetSchema: string, targetTable: string) {
	try {
		if (schemaType === config.SCHEMA_TYPES[0]) {
			await databricksController.runQuery(
				`delete from ${config.DATABRICKS_CATALOG}.${targetSchema}.${targetTable}`
			);
		} else {
			await postgresController.runQuery(
				`delete from ${targetSchema}.${targetTable}`
			);
		}
	} catch (e) { throw e; }
}

async function streamSchemaToDatabaseAsync(
	processId: number,
	params: {
		rowCount: number,
		schema: NormalizedSchemaRow[],
		schemaType: SchemaType,
		targetSchema: string,
		targetTable: string
	}
) {
	try {
		const { rowCount, schema, schemaType, targetSchema, targetTable } = params;

		const readStream = mockDataGenerator.generateMockStream(schema, rowCount, false);
		if (!readStream) return new Error('Failed to generate data stream');

		// Open Databricks session if necessary
		let connection: DatabricksSession['connection'], session: DatabricksSession['session'];
		if (schemaType === config.SCHEMA_TYPES[0]) {
			let databricksConnectionInfo = await databricksController.openConnectionAndSession();
			connection = databricksConnectionInfo.connection;
			session = databricksConnectionInfo.session;
		}

		let streamedRows = 0;
		const writeStream: Writable = new stream.Writable({
			objectMode: true,
			write: async (chunk, _, callback) => {
				try {
					if (schemaType === config.SCHEMA_TYPES[0]) {
						await streamToDatabricks(chunk, schema, targetSchema, targetTable, session);
					} else {
						await streamToPostgres(chunk, schema, targetSchema, targetTable);
					}

					streamedRows += Math.min(100, rowCount - streamedRows);
					await processController.updateProcess(processId, streamedRows);
					callback();
				} catch (e) { throw e; }
			}
		});

		writeStream.on('finish', async () => {
			if (schemaType === config.SCHEMA_TYPES[0]) {
				await databricksController.closeConnectionAndSession(connection!, session!);
			}
		});

		writeStream.on('error', (e) => { throw e; });

		readStream.pipe(writeStream);
	} catch (e) {
		let errorMsg = e instanceof Error
			? e.message
			: 'An error occurred while executing this process';
		await processController.abortProcess(processId, errorMsg);
		throw e;
	}
}

async function streamSchemaToExportAsync(
	downloadId: number,
	s3Filename: string,
	rowCount: number,
	schema: NormalizedSchemaRow[]
) {
	try {
		await downloadController.updateDownloadProgress(downloadId, 0, rowCount);

		//
		// Stream results
		//
		const readStream = mockDataGenerator.generateMockStream(schema, rowCount);

		if (!readStream) return new Error('Failed to generate data stream');

		const transformStream = new stream.Transform({
			objectMode: true,
			transform(chunk, _, callback) {
				callback(
					null,
					// Format results to csv
					csvStringify(chunk)
				);
			}
		});

		// Used to pipe query data to S3 upload
		const passThroughStream = new stream.PassThrough();

		stream.pipeline(
			readStream,
			transformStream,
			passThroughStream,
			(e) => { if (e) throw e; }
		);

		// Record upload progress
		let readRows = 0;
		readStream.on('data', async () => {
			readRows += Math.min(100, rowCount - readRows);
			await downloadController.updateDownloadProgress(downloadId, readRows);
		});

		// Define upload stream
		let fileSize = 0;
		const uploadStream = (stream: Stream) => {
			const s3 = createS3();

			if (!s3 || !process.env.S3_BUCKET || !process.env.S3_BUCKET_PREFIX) {
				return new Error('Missing required S3 info');
			}

			const params = {
				Bucket: process.env.S3_BUCKET,
				Key: `${process.env.S3_BUCKET_PREFIX}/${s3Filename}`,
				Body: stream
			};

			const manager = s3.upload(params);
			// Track file size
			manager.on('httpUploadProgress', (progress) => {
				fileSize = progress.loaded;
			});
			return manager.promise();
		};

		// Begin uploading
		await uploadStream(passThroughStream);
		// Finish uploading
		await downloadController.finishDownload(downloadId, fileSize);
	} catch (e) {
		// Update upload status in the event of an error
		await downloadController.abortDownload(downloadId);
		throw e;
	}
}

async function streamToDatabricks(
	chunk: any,
	schema: NormalizedSchemaRow[],
	targetSchema: string,
	targetTable: string,
	session: IDBSQLSession
) {
	try {
		let databricksSql = getStreamingSql(chunk, schema);
		let finalSql = databricksSql.replace('{table}', `${config.DATABRICKS_CATALOG}.${targetSchema}.${targetTable}`);
		const operation = await session.executeStatement(finalSql);
		await operation.fetchAll();
		await operation.close();
	} catch (e) { throw e; }
}

async function streamToPostgres(
	chunk: any,
	schema: NormalizedSchemaRow[],
	targetSchema: string,
	targetTable: string
) {
	try {
		let postgresSql = getStreamingSql(chunk, schema);
		await postgresController.runQuery(postgresSql.replace('{table}', `${targetSchema}.${targetTable}`));
	} catch (e) { throw e; }
}

function getStreamingSql(chunk: any, schema: NormalizedSchemaRow[]) {
	// Build base SQL
	let columns = schema.map(s => s.field);
	let unquotedColumns = schema
		.filter(s => UNQUOTED_DATATYPES.includes(s.dataType))
		.map(s => s.field);
	let sql = `
	insert into {table}
	(${columns.join(', ')})
	values
	`;

	// Construct value rows
	let values: string[] = [];
	if (Array.isArray(chunk)) {
		chunk.forEach((row: Record<string, number | string>) => {
			let value: Array<number | string> = [];
			Object.keys(row).forEach(key => {
				if (unquotedColumns.includes(key)) {
					value.push(row[key]);
				} else {
					value.push(`'${row[key]}'`);
				}
			});
			values.push(`(${value.join(', ')})`);
		});
	}

	sql += values.join(',\n');
	return sql;
}