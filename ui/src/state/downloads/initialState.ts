import config from '../../config/config';
import { DownloadsSlice } from 'state/storeTypes';

const downloadsSlice: DownloadsSlice = Object.freeze({
	downloads: [],
	progressInterval: null,
	loading: false,
	streaming: {
		show: false,
		progress: 0,
		status: config.STREAMING_STATUSES.IN_PROGRESS,
		interval: null
	},
	downloading: {
		show: false,
		progress: 0,
		total: 0
	}
});

export default downloadsSlice;