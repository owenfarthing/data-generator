import config from '../../config/config';
import * as apiRoutes from '../../api/routes';
import {
	Delimiter, MockDataGeneratorTab, NormalizedDataType,
	NormalizedSchemaRow, PendingSchema, Schema, ValueType
} from '../../types/types';
import * as mockDataGenerator from 'common/mockDataGenerator';

import * as STORE_UTILITIES from '../storeUtilities';
import { MockDataGeneratorSlice } from '../../state/storeTypes';
import * as utils from '../../utils/utils';
import { GridRowOrderChangeParams } from '@mui/x-data-grid-pro';

const getState = STORE_UTILITIES.getStateBuilder<MockDataGeneratorSlice>('mockDataGeneratorSlice');
const setState = STORE_UTILITIES.setStateBuilder<MockDataGeneratorSlice>('mockDataGeneratorSlice');

// public methods

export function updateTab(newTab: MockDataGeneratorTab) {
	setState(state => { state.selectedTab = newTab; });
}

export async function loadMockSchema(id: number) {
	try {
		let res = await apiRoutes.getMockSchema(id);
		if (res?.data) {
			setState(state => {
				state.schemaName = res.data.name;
				state.schemaType = res.data.schema_type;
				state.schema = res.data.schema;
				state.previousSchema = res.data.schema;
				state.lastSaved = utils.formatDate(res.data.updated_at) ?? '-';
			});
		}
		return res;
	} catch (e) { console.error(e); }
}

export async function saveMockSchema(id: number) {
	try {
		const { schema, previousSchema } = getState();

		if (isSchemaEqual(schema, previousSchema)) return;

		let res = await apiRoutes.saveMockSchema(id, { schema });
		if (res?.data?.updated_at) {
			setState(state => {
				state.previousSchema = JSON.parse(JSON.stringify(schema));
				state.lastSaved = utils.formatDate(res.data.updated_at) ?? '-';
			});
		}
	} catch (e) { console.error(e); }
}

export function parseSchema(
	schema: string,
	raw: boolean,
	delimiter: Delimiter
) {
	const schemaType = getState().schemaType;
	let pendingSchema: PendingSchema = { columns: [], error: 'Missing required schema type.' };

	if (raw) {
		pendingSchema = utils.getColumnsFromRaw(schema, schemaType, delimiter);
	} else {
		switch (schemaType) {
			case config.SCHEMA_TYPES[0]:
				break;
			case config.SCHEMA_TYPES[1]:
				pendingSchema = utils.getColumnsFromPostgresSchema(schema);
				break;
			default:
				break;
		}
	}

	return pendingSchema;
}

export function reorderRows(params: GridRowOrderChangeParams) {
	const { row, oldIndex, targetIndex } = params;
	setState(state => {
		state.schema.splice(oldIndex, 1);
		state.schema.splice(targetIndex, 0, row as NormalizedSchemaRow);
	});
}

export function deleteRow(field: string) {
	setState(state => {
		let rowIndex = state.schema.findIndex(s => s.field === field);
		if (rowIndex !== -1) state.schema.splice(rowIndex, 1);
	});
}

export function confirmLoadedSchema(schema: Schema) {
	setState(state => {
		state.schema = normalizeSchema(schema);
		state.ui.showLoadSchemaDialog = false;
	});
}

export function confirmManualSchema(pendingSchema: PendingSchema) {
	if (pendingSchema.error) return;

	setState(state => {
		state.schema = normalizeSchema(pendingSchema.columns);
		state.ui.showManualSchemaDialog = false;
	});
}

export function generateSample() {
	const schema = getState().schema;
	let sample = mockDataGenerator.generateMockSample(schema);
	let sampleWithIds = sample.map((s, i) => ({ ...s, __datagrid_id__: i }));
	setState(state => { state.sample = sampleWithIds; });
}

export function updateRow(newFieldName: string, newDataType: NormalizedDataType, newValue: ValueType) {
	let cleanedOptions = JSON.parse(JSON.stringify(newValue.options));
	Object.keys(cleanedOptions).forEach(key => {
		if (!cleanedOptions[key].length) delete cleanedOptions[key];
	});

	setState(state => {
		let row = state.schema.find(s => s.field === state.selectedField);
		if (row) {
			// Update existing field
			row.field = newFieldName;
			row.dataType = newDataType;
			row.value = {
				...newValue,
				options: cleanedOptions
			};
		} else {
			// Create new field
			state.schema.push({
				field: newFieldName,
				dataType: newDataType,
				value: newValue
			});
		}
		state.selectedField = null;
	});
}

export function updateProcessId(id: number | null) {
	setState(state => { state.processId = id; });
}

export function toggleExpanded(field: string) {
	setState(state => { state.expanded.set(field, !state.expanded.get(field)); })
}

export function expandAll() {
	setState(state => {
		state.schema.forEach(({ field, value }) => {
			if (value.control === config.VALUE_CONTROLS.OPTIONS) {
				state.expanded.set(field, true);
			}
		});
	});
}

export function collapseAll() {
	setState(state => { state.expanded.clear(); });
}

export function toggleLoadSchemaDialog() {
	setState(state => { state.ui.showLoadSchemaDialog = !state.ui.showLoadSchemaDialog; });
}

export function toggleManualSchemaDialog() {
	setState(state => { state.ui.showManualSchemaDialog = !state.ui.showManualSchemaDialog; });
}

export function openPushSchemaDialog() {
	setState(state => { state.ui.showPushSchemaDialog = true; });
}

export function closePushSchemaDialog() {
	setState(state => { state.ui.showPushSchemaDialog = false; });
}

export function openValueDialog(field: string) {
	setState(state => { state.selectedField = field; });
}

export function closeValueDialog() {
	setState(state => { state.selectedField = null; });
}

export function toggleSaveSchemaDialog() {
	setState(state => { state.ui.showSaveSchemaDialog = !state.ui.showSaveSchemaDialog; });
}

// private methods

function normalizeSchema(schema: Schema): NormalizedSchemaRow[] {
	return schema.map(s => {
		let normalizedDataType = utils.getNormalizedDataType(s.dataType);
		let defaultValue = utils.getDefaultColumnValue(normalizedDataType);
		return {
			...s,
			dataType: normalizedDataType,
			value: defaultValue
		};
	});
}

function isSchemaEqual(schema: NormalizedSchemaRow[], prevSchema: NormalizedSchemaRow[]) {
	return schema.length === prevSchema.length
		&& schema.every((row, i) => utils.isDeepEqual(row, prevSchema[i]));
}