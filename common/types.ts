import config from "./constants";

export type NormalizedDataType = keyof typeof config.NORMALIZED_DATA_TYPES;

export interface NormalizedSchemaRow {
	field: string,
	dataType: NormalizedDataType,
	value: ValueType
}

export type SchemaType = typeof config.SCHEMA_TYPES[number];

export type StreamingStatus = typeof config.STREAMING_STATUSES[keyof typeof config.STREAMING_STATUSES];

export type ValueControl = typeof config.VALUE_CONTROLS[
	keyof typeof config.VALUE_CONTROLS
];

export type ValueOptions = Record<string, string[]>;

export interface ValueRandom {
	length: number,
	pool: number
}

export interface ValueRange {
	upper: string,
	lower: string
}

export interface ValueType {
	control: ValueControl,
	range: ValueRange,
	options: ValueOptions,
	startingPoint: number,
	random: ValueRandom,
	includeNull: boolean,
	nullRatio: number
}