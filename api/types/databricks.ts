import IDBSQLClient from '@databricks/sql/dist/contracts/IDBSQLClient';
import IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession';

export interface DatabricksSession {
	connection: IDBSQLClient,
	session: IDBSQLSession
}