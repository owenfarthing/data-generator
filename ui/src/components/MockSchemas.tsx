// extenal imports
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataGridPro, GridColDef, GridRowSelectionModel, GridValueGetterParams } from '@mui/x-data-grid-pro';

// internal imports
import config from '../config/config';
import * as utils from '../utils/utils';
import * as apiRoutes from '../api/routes';
import { SchemaType } from '../types/types';
import ButtonWithTooltip from './common/ButtonWithTooltip';
import CreateMockSchemaDialog from './mock-schemas/CreateMockSchemaDialog';
import { Add, Delete, Edit, ExitToApp } from '@mui/icons-material';
import ExportMenu from './downloads/ExportMenu';

import * as downloadActions from '../state/downloads/actions';
import StreamingDialog from './downloads/StreamingDialog';

const formatDate = (params: GridValueGetterParams) => utils.formatDate(params.value, true, true);

const COLUMNS: GridColDef[] = [
	{ field: 'name', headerName: 'Name', flex: 1 },
	{ field: 'schema_type', headerName: 'Type' },
	{ field: 'created_by', headerName: 'Creator', width: 150 },
	{ field: 'created_at', headerName: 'Created', valueGetter: formatDate, width: 120 },
	{ field: 'updated_at', headerName: 'Last Updated', valueGetter: formatDate, width: 120 }
];

export default function MockSchemas() {
	const [schemaType, setSchemaType] = useState<SchemaType>(config.SCHEMA_TYPES[0]);
	const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const navigate = useNavigate();

	// queries
	const { data: schemas, isLoading, refetch } = useQuery({
		queryKey: ['schemas', schemaType.toLowerCase()],
		queryFn: async () => await apiRoutes.getMockSchemas(schemaType)
	});
	const { isPending: isDeleting, mutateAsync: deleteSchema } = useMutation({
		mutationKey: ['schemas', 'delete', selectedIds[0]],
		mutationFn: async () => {
			await apiRoutes.deleteMockSchema(+selectedIds[0]!);
			setSelectedIds([]);
		}
	});

	let selectedRow = schemas?.data?.find((s: any) => s.id === +selectedIds[0]);

	const onSelectRow = (newRows: GridRowSelectionModel) => {
		setSelectedIds(newRows);
	};

	const loadSchema = () => {
		if (!selectedIds[0]) return;
		navigate(`/data/${selectedIds[0]}`);
	};

	return (
		<>
			<div>
				<Paper elevation={0} style={styles.paper}>
					<div style={styles.toolbar}>
						<div style={{ ...styles.toolbarSide, justifyContent: 'flex-start' }}>
							<ToggleButtonGroup
								color='primary'
								value={schemaType}
								exclusive
								onChange={(_, value) => setSchemaType(value)}
							>
								{config.SCHEMA_TYPES.map(t => (
									<ToggleButton key={t} value={t} size='small' sx={{ height: 25 }}>{t}</ToggleButton>
								))}
							</ToggleButtonGroup>
						</div>

						<div style={{ ...styles.toolbarSide, justifyContent: 'flex-end' }}>
							<ButtonWithTooltip
								buttonProps={{
									onClick: () => {
										setSelectedIds([]);
										setShowCreateDialog(true);
									},
									startIcon: <Add />,
									size: 'small',
									variant: 'outlined'
								}}
								tooltipProps={{
									title: 'Create schema'
								}}
							>
								Create
							</ButtonWithTooltip>

							<ButtonWithTooltip
								buttonProps={{
									onClick: () => setShowCreateDialog(true),
									startIcon: <Edit />,
									style: { marginLeft: 5 },
									disabled: !selectedIds[0],
									size: 'small',
									variant: 'outlined'
								}}
								tooltipProps={{
									title: 'Rename schema'
								}}
							>
								Rename
							</ButtonWithTooltip>

							<ButtonWithTooltip
								buttonProps={{
									onClick: loadSchema,
									startIcon: <ExitToApp />,
									style: { marginLeft: 5 },
									disabled: !selectedIds[0],
									size: 'small',
									variant: 'outlined'
								}}
								tooltipProps={{
									title: 'Load schema'
								}}
							>
								Load
							</ButtonWithTooltip>

							<ButtonWithTooltip
								buttonProps={{
									onClick: async () => {
										await deleteSchema();
										refetch();
									},
									startIcon: <Delete />,
									style: { marginLeft: 5 },
									disabled: isDeleting || !selectedIds[0],
									size: 'small',
									variant: 'outlined'
								}}
								tooltipProps={{
									title: 'Delete schema'
								}}
							>
								Delete
							</ButtonWithTooltip>

							<ExportMenu
								download={(rowCount: number) => {
									downloadActions.streamSchemaToExport(+selectedIds[0], rowCount);
								}}
								disabled={!selectedIds[0]}
								buttonStyle={{ marginLeft: 5 }}
							/>
						</div>
					</div>

					<div style={styles.table}>
						<DataGridPro
							loading={isLoading}
							columns={COLUMNS}
							columnHeaderHeight={30}
							rows={schemas?.data ?? []}
							rowHeight={30}
							getRowClassName={(params) => (
								params.indexRelativeToCurrentPage % 2 === 0
									? 'striped'
									: ''
							)}
							getCellClassName={() => 'pointer'}
							rowSelectionModel={selectedIds}
							onRowSelectionModelChange={onSelectRow}
							onRowDoubleClick={loadSchema}
							hideFooter
							disableColumnMenu
						/>
					</div>
				</Paper>

				{showCreateDialog && (
					<CreateMockSchemaDialog
						id={+selectedIds[0]}
						existingName={selectedRow?.name ?? ''}
						schemaType={schemaType}
						onUpdate={() => refetch()}
						onClose={() => setShowCreateDialog(false)}
					/>
				)}
			</div>

			<StreamingDialog />
		</>
	);
}

const styles = {
	paper: {
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		border: '1px solid #EAEDF1'
	},
	table: {
		width: '100%',
		height: 'calc(100vh - 200px)',
		padding: 5
	},
	toolbar: {
		width: '100%',
		height: 30,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '5px 5px 0px'
	},
	toolbarSide: {
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	}
};