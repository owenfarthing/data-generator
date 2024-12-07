import moment from "moment-timezone";
import config from "config/config";
import { format } from "sql-formatter";
import {
	Delimiter, NormalizedDataType, PendingSchema,
	Schema, SchemaType, ValueRange, ValueType
} from "../types/types";

export function getColumnsFromPostgresSchema(schema: string | undefined): PendingSchema {
	let columns: Schema = [];

	if (!schema) return { columns, error: 'Missing schema.' };

	let trimmedSchema = schema.trim();
	if (!trimmedSchema.startsWith('CREATE TABLE IF NOT EXISTS') || !trimmedSchema.endsWith(')')) {
		return { columns, error: 'Invalid schema.' };
	}

	let formattedSql = '';
	try {
		formattedSql = format(trimmedSchema, { language: 'postgresql' });
	} catch (e) { return { columns, error: 'Invalid SQL.' }; }

	let schemaLines = formattedSql.split('\n').map(l => l.trim());
	let constraintsIndex = schemaLines.findIndex(l => l.startsWith('CONSTRAINT'));
	schemaLines.slice(1, constraintsIndex).forEach(line => {
		let formattedLine = line.replace(',', '');
		let lineParts = formattedLine.split(' ');
		let field = lineParts[0];
		let dataType = lineParts[1];
		if (!!field && !!dataType && dataType in config.POSTGRES_DATA_TYPES) {
			columns.push({ field, dataType });
		}
	});

	return { columns };
}

export function getColumnsFromRaw(schema: string, schemaType: SchemaType, delimiter: Delimiter) {
	if (delimiter === config.DELIMITERS[1]) schema = schema.replace(', ', ',');
	let columns = schema.trim().split(delimiter).map(c => ({ field: c, dataType: config.DEFAULT_DATA_TYPE[schemaType] }));
	let invalidFields: string[] = [];
	columns.forEach(({ field }) => {
		if (field.length > 50 || !field.match('^[A-Za-z][A-Z-a-z0-9_]*$')) {
			invalidFields.push(`"${field}"`);
		}
	});

	return {
		columns: invalidFields.length ? [] : columns,
		error: invalidFields.length
			? `The following fields are invalid: ${invalidFields.join(', ')}.`
			: undefined
	};
}

export function getNormalizedDataType(dataType: string) {
	switch (dataType) {
		case config.DATABRICKS_DATA_TYPES.boolean:
		case config.POSTGRES_DATA_TYPES.bool:
			return config.NORMALIZED_DATA_TYPES.boolean;
		case config.DATABRICKS_DATA_TYPES.date:
		case config.POSTGRES_DATA_TYPES.timestamp:
			return config.NORMALIZED_DATA_TYPES.date;
		case config.DATABRICKS_DATA_TYPES.bigint:
		case config.DATABRICKS_DATA_TYPES.int:
		case config.DATABRICKS_DATA_TYPES.smallint:
		case config.POSTGRES_DATA_TYPES.int4:
		case config.POSTGRES_DATA_TYPES.integer:
			return config.NORMALIZED_DATA_TYPES.integer;
		case config.DATABRICKS_DATA_TYPES.double:
		case config.DATABRICKS_DATA_TYPES.float:
		case config.POSTGRES_DATA_TYPES.numeric:
			return config.NORMALIZED_DATA_TYPES.decimal;
		default:
			if (dataType.startsWith(config.DATABRICKS_DATA_TYPES.decimal)) {
				return config.NORMALIZED_DATA_TYPES.decimal;
			} else {
				return config.NORMALIZED_DATA_TYPES.text;
			}
	}
}

export function getDefaultColumnValue(dataType: NormalizedDataType) {
	let value = getInitialColumnValue();

	switch (dataType) {
		case config.NORMALIZED_DATA_TYPES.boolean:
			// true or false
			value.control = config.VALUE_CONTROLS.OPTIONS;
			value.options = { item0: [...config.BOOLEAN_OPTIONS] };
			break;
		case config.NORMALIZED_DATA_TYPES.date:
			value.control = config.VALUE_CONTROLS.RANGE;
			value.range = getDefaultDateRange();
			break;
		case config.NORMALIZED_DATA_TYPES.decimal:
			value.control = config.VALUE_CONTROLS.RANGE;
			value.range = getDefaultDecimalRange();
			break;
		case config.NORMALIZED_DATA_TYPES.integer:
			value.control = config.VALUE_CONTROLS.RANGE;
			value.range = getDefaultIntegerRange();
			break;
		default:
			// random 8-character string from a pool of 100 options
			value.control = config.VALUE_CONTROLS.RANDOM;
			value.random = {
				length: 8,
				pool: 100
			};
			break;
	}

	return value;
}

export function getInitialColumnValue(): ValueType {
	return {
		control: config.VALUE_CONTROLS.RANDOM,
		range: {
			lower: '',
			upper: ''
		},
		options: {},
		startingPoint: 1,
		random: {
			length: 0,
			pool: 0
		},
		includeNull: false,
		nullRatio: 1
	};
}

export function getInitialRange(dataType: NormalizedDataType): ValueRange {
	switch (dataType) {
		case config.NORMALIZED_DATA_TYPES.date:
			return getDefaultDateRange();
		case config.NORMALIZED_DATA_TYPES.decimal:
			return getDefaultDecimalRange();
		case config.NORMALIZED_DATA_TYPES.integer:
			return getDefaultIntegerRange();
		default:
			return { lower: '', upper: '' };
	}
}

export function getDefaultDateRange(): ValueRange {
	const getFormattedNumber = (n: number) => (n < 10 ? `0${n}` : `${n}`);
	// between one year ago and today
	let today = new Date();
	let year = today.getFullYear();
	let month = getFormattedNumber(today.getMonth());
	let day = getFormattedNumber(today.getDay());
	return {
		lower: `${year - 1}-${month}-${day}`,
		upper: `${year}-${month}-${day}`
	};
}

export function getDefaultDecimalRange(): ValueRange {
	return { lower: '0', upper: '100000' };
}

export function getDefaultIntegerRange(): ValueRange {
	return { lower: '0', upper: '10' };
}

export function formatDate(
	date: string | null | undefined,
	hideTime?: boolean,
	longYear?: boolean,
	timezone?: string
) {
	let newDate = (date) ? new Date(date) : new Date();

	// if Date(date) doesn't parse correctly we pass the raw string into moment
	if (newDate.toString().toLowerCase() === 'invalid date') {
		return date;
	}

	let format = (hideTime) ? ((longYear) ? 'MM/DD/YYYY' : 'MM/DD/YY') : 'MM/DD/YYYY HH:mm';
	let tz = timezone || moment.tz.guess();
	let returnDate = moment(newDate).tz(tz).format(format);

	if (!hideTime) {
		const tzAbbrev = moment.tz(tz).format('z');
		returnDate = returnDate + ' ' + tzAbbrev;
	}

	return returnDate;
}

export function isDeepEqual(object1: Record<any, any> | null, object2: Record<any, any> | null) {
	if (!object1 || !object2) return object1 === object2;

	const objKeys1 = Object.keys(object1);
	const objKeys2 = Object.keys(object2);

	if (objKeys1.length !== objKeys2.length) return false;

	for (var key of objKeys1) {
		const value1 = object1[key];
		const value2 = object2[key];

		const isObjects = isObject(value1) && isObject(value2);

		if ((isObjects && !isDeepEqual(value1, value2)) ||
			(!isObjects && value1 !== value2)
		) {
			return false;
		}
	}

	return true;
}

// private methods

function isObject(object: any) {
	return object != null && typeof object === 'object';
}