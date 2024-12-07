import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './types';
import { getPool } from '../utils/pgPool';
import { Pool } from 'pg';

export const webappDB = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: getPool() as Pool
	}),
	log(event) {
		if (event.level === 'query') {
			console.log(event.query.sql);
			console.log(event.query.parameters);
		}
	}
}).withSchema('public');

export const dataDB = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: getPool(false) as Pool
	}),
	log(event) {
		if (event.level === 'query') {
			console.log(event.query.sql);
			console.log(event.query.parameters);
		}
	}
}).withSchema('public');