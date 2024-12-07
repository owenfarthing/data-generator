import { format } from 'sql-formatter';
import { NormalizedDataType, SchemaType } from '../types/types';
import config from '../config/constants';

export function formatSql(sql: string = '', params: readonly unknown[] = []) {
	try {
		for (let i = 0; i < params.length; i++) {
			let key = `$${i + 1}`;
			let value = params[i];
			let formattedValue = getFormattedValue(value);
			sql = sql.replace(key, formattedValue);
		}

		let formattedSql = sql;
		if (sql) formattedSql = format(sql, { tabWidth: 3, keywordCase: 'upper', logicalOperatorNewline: 'after' });
		return formattedSql;
	} catch (e) {
		// Fail silently
	}
}

export function getRawDataType(schemaType: SchemaType, dataType: NormalizedDataType) {
	if (schemaType === config.SCHEMA_TYPES[0]) {
		// Databricks
		switch (dataType) {
			case config.NORMALIZED_DATA_TYPES.boolean:
				return config.DATABRICKS_DATA_TYPES.boolean;
			case config.NORMALIZED_DATA_TYPES.date:
				return config.DATABRICKS_DATA_TYPES.date;
			case config.NORMALIZED_DATA_TYPES.decimal:
				return config.DATABRICKS_DATA_TYPES.double;
			case config.NORMALIZED_DATA_TYPES.integer:
				return config.DATABRICKS_DATA_TYPES.int;
			default:
				return config.DATABRICKS_DATA_TYPES.string;
		}
	} else {
		// Postgres
		switch (dataType) {
			case config.NORMALIZED_DATA_TYPES.boolean:
				return config.POSTGRES_DATA_TYPES.bool;
			case config.NORMALIZED_DATA_TYPES.date:
				return config.POSTGRES_DATA_TYPES.timestamp;
			case config.NORMALIZED_DATA_TYPES.decimal:
				return config.POSTGRES_DATA_TYPES.numeric;
			case config.NORMALIZED_DATA_TYPES.integer:
				return config.POSTGRES_DATA_TYPES.integer;
			default:
				return config.POSTGRES_DATA_TYPES.text;
		}
	}
}

// private methods

function getFormattedValue(value: any) {
	switch (typeof value) {
		case 'string':
			return `'${value}'`;
		case 'number':
			return `${value}`;
		case 'object':
			if (Array.isArray(value)) {
				if (typeof value[0] === 'number') {
					return `(${value.map(v => `${v}`).join(', ')})`;
				} else {
					return `(${value.map(v => `'${v}'`).join(', ')})`;
				}
			} else {
				return JSON.stringify(value);
			}
		default:
			return '';
	}
}