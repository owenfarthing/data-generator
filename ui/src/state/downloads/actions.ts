import { AxiosResponse } from 'axios';

import { setAlert } from '../global/actions';
import * as apiRoutes from '../../api/routes';
import * as storeUtilities from '../storeUtilities';
import config from '../../config/config';
import { DownloadsSlice } from 'state/storeTypes';
import { NormalizedSchemaRow } from 'types/types';

const { IN_PROGRESS, SUCCESS, FAILURE } = config.STREAMING_STATUSES;

const getState = storeUtilities.getStateBuilder<DownloadsSlice>('downloadsSlice');
const setState = storeUtilities.setStateBuilder<DownloadsSlice>('downloadsSlice');

// public methods

export function streamSchemaToExport(schemaId: number, rowCount: number, schema?: NormalizedSchemaRow[]) {
	setState(state => { state.streaming.show = true; });

	const callback = ({ data }: AxiosResponse) => {
		setState(state => {
			state.streaming.interval = setInterval(
				() => getDownloadProgress(data.downloadId),
				10000
			);
		});
	};

	apiRoutes.streamSchemaToExport(schemaId, { rowCount, schema }, callback, streamingErrorCallback);
}

export async function downloadExportedData(id: number) {
	let fileHandle: FileSystemFileHandle;
	let download = getState().downloads.find(d => d.id === id);

	if (download) {
		try {
			fileHandle = await window.showSaveFilePicker({
				suggestedName: download.filename,
				types: [{ description: 'CSV file', accept: { 'text/csv': ['.csv'] } }]
			});
		} catch (e) {
			// DOM will throw an error if the user closes the file save picker
			return;
		}

		try {
			setState(state => {
				state.downloading.total = parseInt(state.downloads.find(d => d.id === id)?.file_size ?? '0');
				if (state.downloading.total > 0) state.downloading.show = true;
			});

			let writableStream = await fileHandle.createWritable();
			let response = await apiRoutes.downloadExportedData(id);
			let reader = response?.body?.getReader();

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					let byteLength = 0;
					try { byteLength = new TextDecoder().decode(value).length; } catch (e) { }

					if (done) {
						closeDownloadingDialog();
						setAlert({ type: 'info', message: 'Download complete!' });
						break;
					}

					await writableStream.write(value);
					setState(state => {
						if (state.downloading.show) state.downloading.progress += byteLength;
					});
				}
			}

			await writableStream.close();
		} catch (e) {
			setAlert({ type: 'error', message: 'An error occurred while downloading.' })
			console.error(e);
		}
	}
}

export function loadDownloads() {
	setState(state => { state.loading = true; });

	const callback = ({ data }: AxiosResponse) => {
		setState(state => {
			state.downloads = data;
			state.progressInterval = setInterval(updateProgress, 10000);
			state.loading = false;
		});
	};

	const errorCallback = (e: Error) => {
		if (e) console.error(e);
		setState(state => { state.loading = false; });
		setAlert({ type: 'error', message: 'An error occurred while loading downloads.' });
	};

	apiRoutes.getDownloads(callback, errorCallback);
}

export function updateProgress() {
	const downloads = getState().downloads;
	const inProgressIds = downloads.filter(d => d.status === IN_PROGRESS).map(d => d.id);

	if (!inProgressIds.length) {
		clearProgressInterval();
		return;
	}

	const callback = ({ data }: AxiosResponse) => {
		setState(state => {
			data.forEach((updatedRow: any) => {
				let oldRowIndex = state.downloads.findIndex(d => d.id === updatedRow.id);
				state.downloads.splice(oldRowIndex, 1, { ...updatedRow });
			});
		});

		if (!data.filter((d: any) => d.status === IN_PROGRESS).length) clearProgressInterval();
	};

	const errorCallback = (e: Error) => {
		console.error(e);
		setAlert({ type: 'error', message: 'An error occurred while tracking your in-progress uploads.' });
	};

	apiRoutes.getDownloadsById({ downloadIds: inProgressIds }, callback, errorCallback);
}

export function clearProgressInterval() {
	setState(state => {
		if (state.progressInterval) clearInterval(state.progressInterval);
		state.progressInterval = null;
	});
}

export function closeStreamingDialog() {
	setState(state => {
		if (state.streaming.interval) clearInterval(state.streaming.interval);
		state.streaming = {
			show: false,
			progress: 0,
			status: 0,
			interval: null
		};
	});
}

export function closeDownloadingDialog() {
	setState(state => {
		state.downloading = {
			show: false,
			progress: 0,
			total: 0
		};
	});
}

// private methods

function getDownloadProgress(downloadId: number) {
	const callback = ({ data }: AxiosResponse) => {
		const streamingInterval = getState().streaming.interval;
		if (data && streamingInterval != null) {
			const { progress, total, status } = data;

			switch (status) {
				case IN_PROGRESS:
					setState(state => {
						state.streaming.progress = total === 0
							? 0
							: Math.round((progress / total) * 100);
					});
					break;
				case SUCCESS:
					setState(state => {
						clearInterval(streamingInterval);
						state.streaming.interval = null;
						state.streaming.status = status;
					});
					break;
				case FAILURE:
					closeStreamingDialog();
					setAlert({ type: 'error', message: `An error occurred while exporting this schema.` });
					break;
				default:
					break;
			}
		}
	};

	apiRoutes.getDownload(downloadId, callback, streamingErrorCallback);
}

function streamingErrorCallback(e: Error) {
	console.error(e);
	closeStreamingDialog();
	setAlert({ type: 'error', message: `An error occurred while exporting this schema.` });
}