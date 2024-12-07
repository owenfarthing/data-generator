import { useEffect, useMemo } from "react"
import * as actions from '../../state/mock-data-generator/actions';
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useMockDataGeneratorSlice } from "../../state/store";

export default function Previewer() {
	const schema = useMockDataGeneratorSlice(state => state.schema);
	const sample = useMockDataGeneratorSlice(state => state.sample);

	useEffect(() => actions.generateSample(), []);

	const columns = useMemo(() => {
		return schema.map(({ field }) => ({
			field,
			headerName: field
		}));
	}, [schema]);

	return (
		<div style={styles.table}>
			<DataGridPro
				columns={columns}
				columnHeaderHeight={30}
				rows={sample}
				rowHeight={30}
				getRowId={row => row.__datagrid_id__}
				getRowClassName={(params) => (
					params.indexRelativeToCurrentPage % 2 === 0
						? 'striped'
						: ''
				)}
				hideFooter
				disableColumnMenu
				disableRowSelectionOnClick
			/>
		</div>
	);
}

const styles = {
	table: {
		padding: 5,
		width: '100%',
		height: 'calc(100vh - 245px)'
	}
};