import commonConstants from 'common/constants';

const config = {
	...commonConstants,
	DATABRICKS_CATALOG: 'hive_metastore',
	PORT: process.env.PORT,
	SECURE_PORT: process.env.SECURE_PORT
} as const;

export default config;
