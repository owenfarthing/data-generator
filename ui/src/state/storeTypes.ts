import { Alert, MockDataGeneratorTab, NormalizedSchemaRow, SchemaType, StreamingStatus } from '../types/types';

export interface DownloadsSlice {
	downloads: any[],
	progressInterval: ReturnType<typeof setInterval> | null,
	loading: boolean,
	streaming: {
		show: boolean,
		progress: number,
		status: StreamingStatus,
		interval: ReturnType<typeof setInterval> | null
	},
	downloading: {
		show: boolean,
		progress: number,
		total: number
	}
}

export interface GlobalSlice {
	ui: {
		alert: Alert[]
	}
}

export interface MockDataGeneratorSlice {
	selectedTab: MockDataGeneratorTab,
	schemaType: SchemaType,
	schemaName: string,
	lastSaved: string,
	schema: NormalizedSchemaRow[],
	previousSchema: NormalizedSchemaRow[],
	sample: any[],
	expanded: Map<string, boolean>,
	selectedField: string | null,
	processId: number | null,
	ui: {
		showLoadSchemaDialog: boolean,
		showManualSchemaDialog: boolean,
		showSaveSchemaDialog: boolean,
		showPushSchemaDialog: boolean
	}
}