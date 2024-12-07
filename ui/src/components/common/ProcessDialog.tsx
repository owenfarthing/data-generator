import { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import Dialog from '../common/Dialog';
import * as apiRoutes from '../../api/routes';
import * as globalActions from '../../state/global/actions';

export default function ProcessDialog(
	props: {
		id: number,
		inProgressTitle: string,
		finishedTitle: string,
		inProgressDesc: string,
		finishedDesc: string,
		onClose: () => void
	}
) {
	const { id, inProgressTitle, finishedTitle, inProgressDesc, finishedDesc, onClose } = props;
	const [progress, setProgress] = useState(0);
	let inProgress = progress < 100;

	useQuery({
		enabled: id != null,
		queryKey: ['process', id],
		queryFn: async () => {
			try {
				const process = await apiRoutes.pollProcess(id);
				const { progress, total, error } = process.data;
				if (error) {
					globalActions.setAlert({ type: 'error', message: error });
					onClose();
				} else {
					setProgress(Math.round((progress / total) * 100));
				}
				return process;
			} catch (e) {
				if (e instanceof Error) globalActions.setAlert(e);
				onClose();
				console.error(e);
			}
		},
		refetchInterval: 5000,
		retry: false
	});

	return (
		<Dialog
			open={true}
			title={inProgress ? inProgressTitle : finishedTitle}
			primaryLabel=''
			primaryAction={() => { }}
			onClose={onClose}
			width={550}
		>
			<Typography fontSize={15}>
				{inProgress ? inProgressDesc : finishedDesc}
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