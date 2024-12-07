// external imports
import { DBSQLClient } from '@databricks/sql';
import IDBSQLClient, { ConnectionOptions } from '@databricks/sql/dist/contracts/IDBSQLClient';
import IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession';

// internal imports
import { DatabricksSession } from '../types/databricks';

const DATABRICKS_CONNECTION_OPTIONS: ConnectionOptions = {
	host: process.env.DATABRICKS_HOST ?? '',
	path: process.env.DATABRICKS_HTTP_PATH ?? '',
	token: process.env.DATABRICKS_TOKEN ?? ''
};

export default {
	runQuery,
	openConnectionAndSession,
	closeConnectionAndSession
};

async function runQuery(sql: string): Promise<any[]> {
	try {
		const { connection, session } = await openConnectionAndSession();

		const operation = await session.executeStatement(sql);
		const result = await operation.fetchAll();
		await operation.close();

		await closeConnectionAndSession(connection, session);

		return result;
	} catch (e) { throw e; }
}

async function openConnectionAndSession(): Promise<DatabricksSession> {
	try {
		const client = new DBSQLClient();
		const connection = await client.connect(DATABRICKS_CONNECTION_OPTIONS);
		const session = await connection.openSession();

		return { connection, session };
	} catch (e) { throw e; }
}

async function closeConnectionAndSession(connection: IDBSQLClient, session: IDBSQLSession) {
	try {
		await session.close();
		await connection.close();
	} catch (e) { throw e; }
}