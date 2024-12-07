import { dataDB } from "../database/kysely";
import config from "../config/constants";
import databricksController from './databricksController';

export default {
	getDatabricksSchemas,
	getDatabricksTables,
	getDatabricksTable,
	getPostgresSchemas,
	getPostgresTables,
	getPostgresTable
};

//
// module exports
//

// Databricks

async function getDatabricksSchemas() {
	try {
		const { connection, session } = await databricksController.openConnectionAndSession();

		const operation = await session.getSchemas({ catalogName: config.DATABRICKS_CATALOG });
		const schemata = await operation.fetchAll();
		await operation.close();

		await databricksController.closeConnectionAndSession(connection, session);

		return schemata.map(s => s['TABLE_SCHEM'] as string);
	} catch (e) { throw e; }
}

async function getDatabricksTables(schema: string) {
	try {
		if (typeof schema !== 'string' || !schema) return new Error('Missing or invalid schema');

		const { connection, session } = await databricksController.openConnectionAndSession();

		const operation = await session.getTables({ catalogName: config.DATABRICKS_CATALOG, schemaName: schema });
		const tables = await operation.fetchAll();
		await operation.close();

		await databricksController.closeConnectionAndSession(connection, session);

		return tables.map(s => s['TABLE_NAME'] as string);
	} catch (e) { throw e; }
}

async function getDatabricksTable(schema: string, table: string) {
	try {
		const tableSchema = await databricksController.runQuery(`describe ${config.DATABRICKS_CATALOG}.${schema}.${table}`);
		return tableSchema
			.filter(({ col_name }: { col_name: string }) => (
				typeof col_name === 'string' && col_name.match(/^[0-9a-zA-Z_]+$/)
			))
			.map(({ col_name, data_type }: { col_name: string, data_type: string }) => (
				{ field: col_name, dataType: data_type }
			));
	} catch (e) { throw e; }
}

// Postgres

async function getPostgresSchemas() {
	try {
		let schemas = await dataDB.introspection.getSchemas();
		return schemas.map(s => s.name).sort((a, b) => a.localeCompare(b));
	} catch (e) { throw e; }
}

async function getPostgresTables(schema: string) {
	try {
		let tables = await dataDB.introspection.getTables();
		return tables.filter(t => t.schema === schema).map(t => t.name);
	} catch (e) { throw e; }
}

async function getPostgresTable(schema: string, table: string) {
	try {
		let tables = await dataDB.introspection.getTables();
		let columns = tables.filter(t => t.schema === schema && t.name === table).map(t => t.columns)?.[0] ?? [];
		return columns.map(({ name, dataType }) => ({ field: name, dataType }));
	} catch (e) { throw e; }
}