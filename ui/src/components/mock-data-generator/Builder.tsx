import { DataGridPro, GridCellParams, GridColDef } from "@mui/x-data-grid-pro";
import BuilderToolbar from "./BuilderToolbar";
import LoadSchemaDialog from "./LoadSchemaDialog";
import ManualSchemaDialog from "./ManualSchemaDialog";
import ActionCell from "./ActionCell";
import ValueDialog from "./ValueDialog";

import useStore, { useMockDataGeneratorSlice } from "../../state/store";
import * as actions from '../../state/mock-data-generator/actions';
import * as selectors from '../../state/mock-data-generator/selectors';
import { NormalizedDataType, NormalizedSchemaRow } from "../../types/types";
import ValueCell from "./ValueCell";
import DataTypeCell from "./DataTypeCell";
import FieldCell from "./FieldCell";
import { Menu } from "@mui/icons-material";
import { useEffect } from "react";
import ValueHeader from "./ValueHeader";
import ProcessDialog from "components/common/ProcessDialog";

const getCellClassName = (params: GridCellParams) => {
	if (params.colDef.field === 'field') {
		return 'italic';
	} else {
		return '';
	}
};

function ReorderIcon() {
	return (
		<div style={styles.reorderContainer}>
			<Menu sx={{ height: 30, fontSize: 20 }} />
		</div>
	);
}

const COLUMNS: GridColDef[] = [
	{
		field: 'field',
		headerName: 'Field',
		renderCell: (params) => <FieldCell field={params.value} />,
		sortable: false,
		width: 300
	},
	{
		field: 'dataType',
		headerName: 'Data Type',
		renderCell: (params: GridCellParams<NormalizedSchemaRow, NormalizedDataType>) => (
			<DataTypeCell dataType={params.value} />
		),
		sortable: false
	},
	{
		field: 'value',
		headerName: 'Value',
		renderHeader: () => <ValueHeader />,
		renderCell: (params: GridCellParams<NormalizedSchemaRow>) => <ValueCell row={params.row} />,
		sortable: false,
		flex: 1
	},
	{
		field: 'actions',
		headerName: '',
		renderCell: (params) => <ActionCell field={params.row.field} />,
		sortable: false,
		width: 60
	}
];

export default function Builder(props: { id: number }) {
	const schema = useMockDataGeneratorSlice(state => state.schema);
	const processId = useMockDataGeneratorSlice(state => state.processId);
	const showManualSchemaDialog = useMockDataGeneratorSlice(state => state.ui.showManualSchemaDialog);
	const selectedSchemaRow = useStore(selectors.selectedSchemaRow);
	let existingFields = schema.map(s => s.field).filter(f => f !== selectedSchemaRow?.field);

	useEffect(() => {
		// Collapse all rows
		const autoSave = () => actions.saveMockSchema(props.id);
		let autoSaveInterval: NodeJS.Timeout = setInterval(autoSave, 10000);
		return () => clearInterval(autoSaveInterval);
	}, [props.id]);

	return (
		<div>
			<BuilderToolbar id={props.id} />

			<div style={styles.table}>
				<DataGridPro
					rows={schema}
					getRowId={(row) => row.field}
					getRowHeight={() => 'auto'}
					getCellClassName={getCellClassName}
					getRowClassName={(params) => (
						params.indexRelativeToCurrentPage % 2 === 0
							? 'striped'
							: ''
					)}
					rowReordering
					onRowOrderChange={actions.reorderRows}
					columns={COLUMNS}
					columnHeaderHeight={30}
					hideFooter
					disableColumnMenu
					sx={styles.overrides}
					slots={{
						rowReorderIcon: ReorderIcon,
					}}
				/>
			</div>

			<LoadSchemaDialog />
			{showManualSchemaDialog && <ManualSchemaDialog />}
			{selectedSchemaRow && (
				<ValueDialog
					selectedRow={selectedSchemaRow}
					existingFields={existingFields}
					onConfirm={actions.updateRow}
					onClose={actions.closeValueDialog}
				/>
			)}
			{processId != null && (
				<ProcessDialog
					id={processId}
					inProgressTitle='Pushing...'
					finishedTitle='Mock Data Pushed to Database!'
					inProgressDesc='Your mock data is being pushed to the selected table. Please wait.'
					finishedDesc='Your mock data has been pushed. Please verify in the selected table.'
					onClose={() => actions.updateProcessId(null)}
				/>
			)}
		</div>
	);
}

const styles = {
	overrides: {
		'& .MuiDataGrid-rowReorderCell--draggable': {
			color: '#7A7A7A'
		}
	},
	reorderContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		height: '100%'
	},
	table: {
		padding: 5,
		width: '100%',
		height: 'calc(100vh - 285px)'
	}
};