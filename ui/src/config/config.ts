// internal imports
import commonConstants from 'common/constants';

const config = {
	...commonConstants,
	BOOLEAN_OPTIONS: ['True', 'False'],
	DEFAULT_DATA_TYPE: {
		[commonConstants.SCHEMA_TYPES[0]]: commonConstants.DATABRICKS_DATA_TYPES.string,
		[commonConstants.SCHEMA_TYPES[1]]: commonConstants.POSTGRES_DATA_TYPES.text
	},
	DELIMITERS: ['\n', ','],
	MOCK_DATA_GENERATOR_TABS: {
		BUILD: 1,
		PREVIEW: 2
	},
	VALUE_CONTROLS_CONFIG: {
		[commonConstants.NORMALIZED_DATA_TYPES.boolean]: [commonConstants.VALUE_CONTROLS.OPTIONS],
		[commonConstants.NORMALIZED_DATA_TYPES.date]: [commonConstants.VALUE_CONTROLS.RANGE, commonConstants.VALUE_CONTROLS.OPTIONS],
		[commonConstants.NORMALIZED_DATA_TYPES.decimal]: [commonConstants.VALUE_CONTROLS.RANGE, commonConstants.VALUE_CONTROLS.OPTIONS],
		[commonConstants.NORMALIZED_DATA_TYPES.integer]: [commonConstants.VALUE_CONTROLS.INCREMENTAL, commonConstants.VALUE_CONTROLS.RANGE, commonConstants.VALUE_CONTROLS.OPTIONS],
		[commonConstants.NORMALIZED_DATA_TYPES.text]: [commonConstants.VALUE_CONTROLS.RANDOM, commonConstants.VALUE_CONTROLS.OPTIONS]
	}
} as const;

export default config;
