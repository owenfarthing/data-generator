import { PoolConfig } from 'pg';

const APP_PG_POOL_CONFIG: PoolConfig = {
	user: process.env.APP_PG_USER,
	password: process.env.APP_PG_PASSWORD,
	database: process.env.APP_PG_DATABASE,
	host: process.env.APP_PG_HOST,
	port: +(process.env.PG_PORT ?? '8990'),
};

const DATA_PG_POOL_CONFIG: PoolConfig = {
	user: process.env.DATA_PG_USER,
	password: process.env.DATA_PG_PASSWORD,
	database: process.env.DATA_PG_DATABASE,
	host: process.env.DATA_PG_HOST,
	port: +(process.env.PG_PORT ?? '8990'),
};

export default {
	APP_PG_POOL_CONFIG,
	DATA_PG_POOL_CONFIG
};