import { AlertColor } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import config from "config/config";
export * from 'common/types';

// alerts
export type Alert =
	{
		type?: AlertColor | undefined,
		message?: string,
		title?: string
	}
	| AxiosError
	| Error
	| undefined;

export interface AlertOverrides {
	doNotDismiss?: boolean,
	messageOverride?: string,
	titleOverride?: string
}


// axios
export type Callback = (res: AxiosResponse) => void;
export type ErrorCallback = (e: AxiosError) => void;

// frontend
export type MockDataGeneratorTab = typeof config.MOCK_DATA_GENERATOR_TABS[
	keyof typeof config.MOCK_DATA_GENERATOR_TABS
];
export type BooleanType = typeof config.BOOLEAN_OPTIONS[keyof typeof config.BOOLEAN_OPTIONS];
export type Delimiter = typeof config.DELIMITERS[number];
export interface PendingSchema {
	columns: Schema,
	error?: string
}
export type Schema = {
	field: string,
	dataType: string
}[];