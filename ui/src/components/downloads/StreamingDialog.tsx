import { useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

import Dialog from '../common/Dialog';
import config from '../../config/config';

import { useDownloadsSlice } from '../../state/store';
import * as actions from '../../state/downloads/actions';

export default function StreamingDialog() {
	const progress = useDownloadsSlice(state => state.streaming.progress);
	const status = useDownloadsSlice(state => state.streaming.status);
	const showStreamingDialog = useDownloadsSlice(state => state.streaming.show);
	const inProgress = status === config.STREAMING_STATUSES.IN_PROGRESS;

	useEffect(() => {
		return actions.closeStreamingDialog;
	}, []);

	return (
		<Dialog
			open={showStreamingDialog}
			title={
				inProgress
					? 'Generating...'
					: 'Mock Data Generation Complete!'
			}
			primaryLabel=''
			primaryAction={() => { }}
			onClose={actions.closeStreamingDialog}
			width={500}
		>
			<Typography fontSize={15}>
				{inProgress
					? <>Your mock data is generating. Once it completes, you can find it on the <b>Downloads</b> page.</>
					: <>Your mock data has generated. You can find it on the <b>Downloads</b> page.</>
				}
			</Typography>

			<>
				{inProgress &&
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Box sx={{ width: '100%', mr: 1 }}>
							<LinearProgress variant='determinate' value={progress} />
						</Box>
						<Box sx={{ minWidth: 35 }}>
							<Typography variant='body2' color='text.secondary'>{`${progress}%`}</Typography>
						</Box>
					</Box>
				}
			</>
		</Dialog>
	);
}