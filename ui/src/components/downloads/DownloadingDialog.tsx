import { useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

import Dialog from '../common/Dialog';

import { useDownloadsSlice } from '../../state/store';
import * as actions from '../../state/downloads/actions';

export default function DownloadingDialog() {
	const progress = useDownloadsSlice(state => state.downloading.progress);
	const total = useDownloadsSlice(state => state.downloading.total);
	const showDownloadingDialog = useDownloadsSlice(state => state.downloading.show);
	let progressPercentage = Math.min(Math.round((progress / total) * 100), 100);
	let displayProgress = isNaN(progressPercentage) ? 100 : progressPercentage;

	useEffect(() => {
		return actions.closeDownloadingDialog;
	}, []);

	return (
		<Dialog
			open={showDownloadingDialog}
			title='Downloading...'
			primaryLabel=''
			primaryAction={() => { }}
			onClose={actions.closeDownloadingDialog}
			width={500}
		>
			<Typography fontSize={15}>Downloading file...</Typography>

			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Box sx={{ width: '100%', mr: 1 }}>
					<LinearProgress variant='determinate' value={displayProgress} />
				</Box>
				<Box sx={{ minWidth: 35 }}>
					<Typography variant='body2' color='text.secondary'>{`${displayProgress}%`}</Typography>
				</Box>
			</Box>
		</Dialog>
	);
}