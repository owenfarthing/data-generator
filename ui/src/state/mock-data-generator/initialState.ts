import config from '../../config/config';
import { MockDataGeneratorSlice } from '../../state/storeTypes';

const mockDataGeneratorSlice: MockDataGeneratorSlice = Object.freeze({
	selectedTab: config.MOCK_DATA_GENERATOR_TABS.BUILD,
	schemaType: config.SCHEMA_TYPES[0],
	schemaName: '-',
	lastSaved: '-',
	schema: [],
	previousSchema: [],
	sample: [],
	expanded: new Map(),
	selectedField: null,
	processId: null,
	ui: {
		showLoadSchemaDialog: false,
		showManualSchemaDialog: false,
		showSaveSchemaDialog: false,
		showPushSchemaDialog: false
	}
});

export default mockDataGeneratorSlice;