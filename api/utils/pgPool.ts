import { Pool } from 'pg';
import dbConfig from '../config/database';

// defaults to 10 max clients
const webappPool = new Pool(dbConfig.APP_PG_POOL_CONFIG);
const dataPool = new Pool(dbConfig.DATA_PG_POOL_CONFIG);

webappPool.on('connect', (client) => {
	client.query(`SET search_path TO datagen`);
});

export async function query(text: string, params: any, webapp = true) {
	try {
		return webapp
			? await webappPool.query(text, params)
			: await dataPool.query(text, params);
	} catch (e) { throw e; }
}

export async function getClient(webapp = true) {
	try {
		return webapp
			? await webappPool.connect()
			: await dataPool.connect();
	} catch (e) { throw e; }
}

export function getPool(webapp = true) {
	try {
		return webapp ? webappPool : dataPool;
	} catch (e) { throw e; }
}
