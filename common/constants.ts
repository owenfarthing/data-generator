'use strict';

const config = {
	APP_NAME: 'Data Generator',
	DATABRICKS_DATA_TYPES: {
		bigint: 'bigint',
		boolean: 'boolean',
		date: 'date',
		decimal: 'decimal',
		double: 'double',
		float: 'float',
		int: 'int',
		smallint: 'smallint',
		string: 'string'
	},
	NORMALIZED_DATA_TYPES: {
		boolean: 'boolean',
		date: 'date',
		decimal: 'decimal',
		integer: 'integer',
		text: 'text'
	},
	POSTGRES_DATA_TYPES: {
		bool: 'bool',
		character: 'character',
		int4: 'int4',
		integer: 'integer',
		numeric: 'numeric',
		text: 'text',
		timestamp: 'timestamp'
	},
	SCHEMA_TYPES: ['Databricks', 'Postgres'],
	STREAMING_STATUSES: {
		IN_PROGRESS: 0,
		SUCCESS: 1,
		FAILURE: 2
	},
	VALUE_CONTROLS: {
		INCREMENTAL: 'incremental',
		OPTIONS: 'options',
		RANDOM: 'random',
		RANGE: 'range'
	}
} as const;

export default config;