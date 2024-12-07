import config from "./constants";
import { NormalizedDataType, NormalizedSchemaRow, ValueOptions, ValueRandom, ValueRange } from "./types";
import stream from 'stream';

const CHUNK_SIZE = 100;

// module exports

export function generateMockSample(schema: NormalizedSchemaRow[]) {
	if (!schema.length) return [];
	let optionsMap = new Map<string, ValueOptions>();
	let autoIncrementMap = new Map<string, number>();
	generateOptionsAndIds(schema, optionsMap, autoIncrementMap);
	return generateChunk(schema, optionsMap, autoIncrementMap, CHUNK_SIZE, 100);
}

export function generateMockStream(schema: NormalizedSchemaRow[], rowCount: number, includeHeaders = true) {
	if (!schema.length) return;

	let optionsMap = new Map<string, ValueOptions>();
	let autoIncrementMap = new Map<string, number>();
	generateOptionsAndIds(schema, optionsMap, autoIncrementMap);

	let progress = 0;
	let headersSet = false;
	let headers = {};
	schema.forEach(s => { headers[s.field] = s.field; });
	return new stream.Readable({
		objectMode: true,
		read() {
			let chunkSize = Math.min(CHUNK_SIZE, rowCount - progress);
			let chunk = generateChunk(schema, optionsMap, autoIncrementMap, chunkSize, rowCount, includeHeaders && !headersSet);
			headersSet = true;
			this.push(chunk);
			progress += chunkSize;
			if (progress >= rowCount) this.push(null);
		}
	});
}

// private methods

function generateChunk(
	schema: NormalizedSchemaRow[],
	optionsMap: Map<string, ValueOptions>,
	autoIncrementMap: Map<string, number>,
	chunkSize: number,
	rowCount: number,
	includeHeaders: boolean = false
) {
	let rows: Record<string, number | string>[] = [];
	if (includeHeaders) {
		let headers = {};
		schema.forEach(s => { headers[s.field] = s.field; });
		rows.push(headers);
	}

	for (let i = 0; i < chunkSize; i++) {
		let row: Record<string, number | string> = {};
		schema.forEach(({ field, dataType, value }) => {
			const { control, includeNull, range, nullRatio } = value;

			if (includeNull && pickNull(rowCount, nullRatio)) {
				row[field] = 'null';
			} else {
				switch (control) {
					case config.VALUE_CONTROLS.INCREMENTAL:
						let autoIncrement = autoIncrementMap.get(field)!;
						row[field] = autoIncrement;
						autoIncrementMap.set(field, autoIncrement + 1);
						break;
					case config.VALUE_CONTROLS.OPTIONS:
					case config.VALUE_CONTROLS.RANDOM:
						let options = optionsMap.get(field) ?? {};
						row[field] = randomOption(dataType, options);
						break;
					case config.VALUE_CONTROLS.RANGE:
						row[field] = randomRange(range, dataType);
						break;
					default:
						row[field] = 'null';
						break;
				}
			}
		});
		rows.push(row);
	}

	return rows;
}

function generateOptionsAndIds(
	schema: NormalizedSchemaRow[],
	optionsMap: Map<string, ValueOptions>,
	autoIncrementMap: Map<string, number>
) {
	schema.forEach(({ field, value }) => {
		const { control, options, random, startingPoint } = value;

		switch (control) {
			case config.VALUE_CONTROLS.INCREMENTAL:
				autoIncrementMap.set(field, startingPoint);
				break;
			case config.VALUE_CONTROLS.OPTIONS:
				optionsMap.set(field, options);
				break;
			case config.VALUE_CONTROLS.RANDOM:
				optionsMap.set(field, {
					item0: randomPool(random)
				});
				break;
			default:
				break;
		}
	});
}

function randomNumber(limit: number) {
	return Math.random() * limit + 1;
}

function randomOption(dataType: NormalizedDataType, options: ValueOptions) {
	let value = '';
	Object.keys(options).forEach((key, i) => {
		let keyOptions = options[key];
		value += keyOptions[Math.floor(Math.random() * keyOptions.length)];
	});

	switch (dataType) {
		case config.NORMALIZED_DATA_TYPES.boolean:
			return value.toLowerCase();
		case config.NORMALIZED_DATA_TYPES.decimal:
		case config.NORMALIZED_DATA_TYPES.integer:
			return parseNumber(value, dataType);
		case config.NORMALIZED_DATA_TYPES.date:
		case config.NORMALIZED_DATA_TYPES.text:
			return value;
		default:
			return 'null';
	}
}

function randomPool(random: ValueRandom) {
	let options: string[] = [];
	for (let i = 0; i < random.pool; i++) { options.push(randomString(random.length)); }
	return options;
}

function randomRange(range: ValueRange, dataType: NormalizedDataType) {
	if (dataType === config.NORMALIZED_DATA_TYPES.date) {
		return randomRangeDate(range);
	} else {
		return randomRangeNumber(range, dataType);
	}
}

function randomRangeDate(range: ValueRange) {
	const { lower, upper } = range;
	let startDate = new Date(lower);
	let endDate = new Date(upper);
	if (isValidDate(startDate) && isValidDate(endDate)) {
		let random = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
		return random.toISOString().split('T')[0];
	} else {
		return 'null';
	}
}

function randomRangeNumber(range: ValueRange, dataType: NormalizedDataType) {
	const { lower, upper } = range;
	let lowerParsed = parseNumber(lower, dataType);
	let upperParsed = parseNumber(upper, dataType);
	if (isNaN(lowerParsed) || isNaN(upperParsed)) {
		return 'null';
	} else {
		let value = Math.random() * upperParsed + lowerParsed;
		return dataType === config.NORMALIZED_DATA_TYPES.decimal
			? Math.round(value * 100) / 100
			: Math.round(value);
	}
}

function randomString(length: number) {
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return str;
}

function parseNumber(value: string, dataType: NormalizedDataType) {
	return dataType === config.NORMALIZED_DATA_TYPES.decimal
		? parseFloat(value)
		: parseInt(value);
}

function isValidDate(date: any) {
	return !!date && date.toString().toLowerCase() !== 'invalid date';
}

function pickNull(rowCount: number, nullRatio: number) {
	return Math.floor(randomNumber(rowCount)) <= (rowCount * (nullRatio / 100));
}