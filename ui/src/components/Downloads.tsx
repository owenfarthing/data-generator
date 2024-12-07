import { useEffect } from 'react';
import { Paper } from '@mui/material';
import { DataGridPro, GridColDef, GridValueGetterParams } from '@mui/x-data-grid-pro';

import DownloadingDialog from './downloads/DownloadingDialog';
import DownloadLink from './downloads/DownloadLink';
import * as utils from '../utils/utils';
import config from '../config/config';

import { useDownloadsSlice } from '../state/store';
import * as actions from '../state/downloads/actions';

const getFileSize = (params: GridValueGetterParams) => {
	if (params.row.status === config.STREAMING_STATUSES.IN_PROGRESS) return 'In Progress';
	let formattedValue = parseInt(params.value);
	let exp = (formattedValue / Math.pow(1024, 3) < 1) ? 2 : 3;
	let unit = exp === 2 ? ' MB' : ' GB';
	return `${Math.round(formattedValue / Math.pow(1024, exp) * 10) / 10}`.toLocaleString() + unit;
};

const COLUMNS: GridColDef[] = [
	{
		headerName: '',
		field: 'link',
		align: 'center',
		width: 150,
		renderCell: (params) => <DownloadLink download={params.row} />
	},
	{
		headerName: 'File',
		headerAlign: 'center',
		field: 'filename',
		flex: 1
	},
	{
		headerName: 'S3 Location',
		headerAlign: 'center',
		field: 's3_filename',
		flex: 1,
		valueGetter: (params) => `/datagen/${params.value}`
	},
	{
		headerName: 'Records',
		headerAlign: 'center',
		field: 'total',
		align: 'right',
		width: 80,
		valueGetter: (params) => params.value?.toLocaleString()
	},
	{
		headerName: 'Size',
		headerAlign: 'center',
		field: 'file_size',
		align: 'right',
		valueGetter: getFileSize
	},
	{
		headerName: 'Date Generated',
		headerAlign: 'center',
		field: 'created_at',
		align: 'right',
		width: 180,
		valueGetter: (params) => utils.formatDate(params.value)
	}
];

export default function Downloads() {
	const downloads = useDownloadsSlice(state => state.downloads);
	const loading = useDownloadsSlice(state => state.loading);

	useEffect(() => {
		actions.loadDownloads();
		return actions.clearProgressInterval;
	}, []);

	return (
		<div>
			<Paper elevation={0} style={styles.paper}>
				<div style={styles.container}>
					<div style={styles.table}>
						<DataGridPro
							loading={loading}
							columns={COLUMNS}
							columnHeaderHeight={34}
							rows={downloads}
							rowHeight={34}
							getRowClassName={(params) =>
								(params.indexRelativeToCurrentPage % 2 === 0)
									? 'striped'
									: ''
							}
							getCellClassName={(params) => params.colDef.field === 's3_filename' ? 'italic' : ''}
							disableRowSelectionOnClick
							disableColumnMenu
							disableMultipleRowSelection
							hideFooter
						/>
					</div>
				</div>
			</Paper>

			<DownloadingDialog />
		</div>
	);
}

const styles = {
	container: {
		overflowY: 'hidden' as const,
		scroll: 'hidden',
		width: '100%'
	},
	icon: {
		fontSize: 20,
		color: '#888888'
	},
	paper: {
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		border: '1px solid #EAEDF1'
	},
	table: {
		height: 'calc(100vh - 170px)',
		width: '100%'
	}
};