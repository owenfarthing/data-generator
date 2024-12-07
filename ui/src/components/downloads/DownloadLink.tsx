import { CloudDownload } from '@mui/icons-material';
import { LinearProgress, Link, Typography } from '@mui/material';
import config from '../../config/config';
import * as actions from '../../state/downloads/actions';
import { StreamingStatus } from '../../types/types';

interface DownloadLinkProps {
	download: {
		id: number,
		status: StreamingStatus,
		progress: number,
		total: number,
		location: string
	}
}

export default function DownloadLink(props: DownloadLinkProps) {
	const { id, status, progress, total } = props.download;
	const progressPercentage = total === 0 ? 0 : Math.round((progress / total) * 100);

	return (
		<>
			{status === config.STREAMING_STATUSES.SUCCESS
				? (
					<div style={styles.container}>

						<Typography fontSize={15}>
							<Link style={{ cursor: 'pointer' }} onClick={() => actions.downloadExportedData(id)}>
								<CloudDownload sx={styles.icon} />
								Download
							</Link>
						</Typography>
					</div>
				)
				:
				<LinearProgress
					variant='determinate'
					value={progressPercentage}
					style={{ width: '100%' }}
				/>
			}
		</>

	);
}

const styles = {
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		fontSize: 19,
		marginRight: '5px'
	}
};