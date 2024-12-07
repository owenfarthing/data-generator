// internal imports
import * as api from './api';
import * as fetchApi from './fetch';
import { Callback, ErrorCallback, NormalizedDataType, NormalizedSchemaRow, SchemaType } from '../types/types';

const API_ENDPOINTS = {
	DATABRICKS: '/databricks',
	DOWNLOADS: '/downloads',
	ME: '/me',
	MOCK: '/mock',
	OPTIONS: '/options',
	POSTGRES: '/postgres',
	PROCESSES: '/processes',
	SCHEMAS: '/schemas',
	TABLES: '/tables'
} as const;

export function getDownloads(callback: Callback, error: ErrorCallback) {
	api.performGet(API_ENDPOINTS.DOWNLOADS, callback, error);
}

export function getDownloadsById(data: { downloadIds: number[] }, callback: Callback, error: ErrorCallback) {
	api.performPost(API_ENDPOINTS.DOWNLOADS, data, callback, error);
}

export function getDownload(id: number, callback: Callback, error: ErrorCallback) {
	api.performGet(`${API_ENDPOINTS.ME}${API_ENDPOINTS.DOWNLOADS}/${id}`, callback, error);
}

export function downloadExportedData(id: number) {
	return fetchApi.fetchPost(
		`${API_ENDPOINTS.ME}${API_ENDPOINTS.DOWNLOADS}/${id}/download`,
		{},
		{ 'Content-Type': 'text/csv' }
	);
}

export function streamSchemaToDatabase(
	id: number,
	data: {
		rowCount: number,
		schema: NormalizedSchemaRow[],
		targetSchema: string,
		targetTable: string,
		createNewTable: boolean,
		replaceData: boolean
	}
) {
	return api.performAsyncPost(`${API_ENDPOINTS.ME}${API_ENDPOINTS.SCHEMAS}/${id}/stream`, data);
}

export function streamSchemaToExport(
	id: number,
	data: {
		rowCount: number,
		schema?: NormalizedSchemaRow[]
	},
	callback: Callback,
	error: ErrorCallback
) {
	api.performPost(
		`${API_ENDPOINTS.ME}${API_ENDPOINTS.SCHEMAS}/${id}/export`,
		data,
		callback,
		error
	);
}

export function createMockSchema(data: { name: string, schemaType: SchemaType }) {
	return api.performAsyncPost(`${API_ENDPOINTS.MOCK}${API_ENDPOINTS.SCHEMAS}`, data);
}

export function getMockSchema(id: number) {
	return api.performAsyncGet(`${API_ENDPOINTS.MOCK}${API_ENDPOINTS.SCHEMAS}/schema/${id}`);
}

export function getMockSchemas(schemaType: SchemaType) {
	return api.performAsyncGet(`${API_ENDPOINTS.MOCK}${API_ENDPOINTS.SCHEMAS}/${schemaType}`);
}

export function saveMockSchema(id: number, data: { name?: string, schema?: NormalizedSchemaRow[] }) {
	return api.performAsyncPut(`${API_ENDPOINTS.MOCK}${API_ENDPOINTS.SCHEMAS}/${id}`, data);
}

export function deleteMockSchema(id: number) {
	return api.performAsyncDelete(`${API_ENDPOINTS.MOCK}${API_ENDPOINTS.SCHEMAS}/${id}`);
}

export function pollProcess(id: number) {
	return api.performAsyncGet(`${API_ENDPOINTS.ME}${API_ENDPOINTS.PROCESSES}/${id}`);
}

export function getDatabricksSchemas() {
	return api.performAsyncGet(`${API_ENDPOINTS.SCHEMAS}${API_ENDPOINTS.DATABRICKS}`);
}

export function getDatabricksTables(schema: string) {
	return api.performAsyncGet(`${API_ENDPOINTS.TABLES}${API_ENDPOINTS.DATABRICKS}/${schema}`);
}

export function getDatabricksTable(schema: string, table: string) {
	return api.performAsyncGet(`${API_ENDPOINTS.TABLES}${API_ENDPOINTS.DATABRICKS}/${schema}/${table}`);
}

export function getPostgresSchemas() {
	return api.performAsyncGet(`${API_ENDPOINTS.SCHEMAS}${API_ENDPOINTS.POSTGRES}`);
}

export function getPostgresTables(schema: string) {
	return api.performAsyncGet(`${API_ENDPOINTS.TABLES}${API_ENDPOINTS.POSTGRES}/${schema}`);
}

export function getPostgresTable(schema: string, table: string) {
	return api.performAsyncGet(`${API_ENDPOINTS.TABLES}${API_ENDPOINTS.POSTGRES}/${schema}/${table}`);
}

export function getValueOptions(dataType: NormalizedDataType) {
	return api.performAsyncGet(`${API_ENDPOINTS.OPTIONS}/${dataType}`);
}