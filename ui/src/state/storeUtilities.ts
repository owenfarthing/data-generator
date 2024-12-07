import useStore, { StoreConfig as StoreConfigType } from './store';

export function getStateBuilder<T>(slice: StoreConfigType[keyof StoreConfigType]) {
	return (): T => {
		return useStore.getState()[slice] as T;
	}
}

export function setStateBuilder<T>(slice: StoreConfigType[keyof StoreConfigType]) {
	return (arg: ((state: T) => T | void) | Partial<T>) => {
		useStore.setState(state => {
			let writableSlice = state[slice];

			if (typeof arg === 'function') {
				const ret = arg(writableSlice as T);

				if (ret !== undefined) {
					writableSlice = { ...writableSlice, ...ret };
				}
			} else {
				writableSlice = { ...writableSlice, ...arg };
			}
		});
	}
}