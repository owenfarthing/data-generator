// external imports
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';

// internal imports
import storeConfig from './storeConfig';
import globalSlice from './global/initialState';
import downloadsSlice from './downloads/initialState';
import mockDataGeneratorSlice from './mock-data-generator/initialState';

import { GlobalSlice, DownloadsSlice, MockDataGeneratorSlice } from './storeTypes';

type StoreConfigImport = typeof import('./storeConfig').default;
export type StoreConfig = StoreConfigImport['SLICES'];

export const initialState = {
	[storeConfig.SLICES.DOWNLOAD]: downloadsSlice,
	[storeConfig.SLICES.GLOBAL]: globalSlice,
	[storeConfig.SLICES.MOCK_DATA_GENERATOR]: mockDataGeneratorSlice
} satisfies Record<StoreConfig[keyof StoreConfig], unknown>;
export type State = typeof initialState;

// store
const useStore = create(
	immer(() => ({ ...initialState }))
);
// enable use of Map with Zustand + Immer state
enableMapSet();

export default useStore;

// utilities
export function resetStore() {
	Object.values(storeConfig.SLICES).forEach(slice => {
		if (slice !== storeConfig.SLICES.GLOBAL) resetStoreSlice(slice);
	});
}

export function resetStoreSlice(slice: StoreConfig[keyof StoreConfig]) {
	useStore.setState((state) => {
		let writableSlice = state[slice];
		let initialSlice = initialState[slice];
		writableSlice = initialSlice;
	});
}

export function useGlobalSlice<T>(selector: (state: GlobalSlice) => T): T {
	return useStore(state => selector(state[storeConfig.SLICES.GLOBAL]));
}

export function useDownloadsSlice<T>(selector: (state: DownloadsSlice) => T): T {
	return useStore(state => selector(state[storeConfig.SLICES.DOWNLOAD]));
}

export function useMockDataGeneratorSlice<T>(selector: (state: MockDataGeneratorSlice) => T): T {
	return useStore(state => selector(state[storeConfig.SLICES.MOCK_DATA_GENERATOR]));
}