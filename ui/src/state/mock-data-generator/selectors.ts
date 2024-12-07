import { State } from 'state/store';
import { getInitialColumnValue } from '../../utils/utils';
import config from 'config/config';

const getSlice = (state: State) => state['mockDataGeneratorSlice'];

export function hasExpandableFields(state: State) {
	const schema = getSlice(state).schema;
	return schema.some(({ value }) => value.control === config.VALUE_CONTROLS.OPTIONS);
}

export function selectedSchemaRow(state: State) {
	const { schema, selectedField } = getSlice(state);
	if (selectedField == null) return null;
	return schema.find(s => s.field === selectedField)
		?? { field: selectedField, dataType: config.NORMALIZED_DATA_TYPES.text, value: getInitialColumnValue() };
}