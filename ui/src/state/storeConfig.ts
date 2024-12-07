const storeConfig = {
	SLICES: {
		DOWNLOAD: 'downloadsSlice',
		GLOBAL: 'globalSlice',
		MOCK_DATA_GENERATOR: 'mockDataGeneratorSlice'
	}
} as const;

export default Object.freeze(storeConfig);