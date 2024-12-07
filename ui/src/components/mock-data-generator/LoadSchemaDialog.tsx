import { useState } from 'react';
import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import * as apiRoutes from '../../api/routes';
import CustomSelect from '../common/CustomSelect';
import Dialog from '../common/Dialog';

import config from 'config/config';

import { useMockDataGeneratorSlice } from '../../state/store';
import * as actions from '../../state/mock-data-generator/actions';

export default function SchemaDialog() {
	const schemaType = useMockDataGeneratorSlice(state => state.schemaType);
	const show = useMockDataGeneratorSlice(state => state.ui.showLoadSchemaDialog);
	const [schema, setSchema] = useState('');
	const [table, setTable] = useState('');

	// queries
	const { data: schemas, isLoading: isLoadingSchemas, error: schemaError } = useQuery({
		enabled: show,
		queryKey: ['schemas', schemaType.toLowerCase()],
		queryFn: async () => {
			return schemaType === config.SCHEMA_TYPES[0]
				? await apiRoutes.getDatabricksSchemas()
				: await apiRoutes.getPostgresSchemas();
		}
	});
	const { data: tables, isLoading: isLoadingTables, error: tableError } = useQuery({
		enabled: show && !!schema,
		queryKey: ['tables', schemaType.toLowerCase(), schema],
		queryFn: async () => {
			return schemaType === config.SCHEMA_TYPES[0]
				? await apiRoutes.getDatabricksTables(schema)
				: await apiRoutes.getPostgresTables(schema);
		}
	});
	const { data: columns, isLoading: isLoadingColumns, error: columnError } = useQuery({
		enabled: show && !!schema && !!table,
		queryKey: ['tables', schemaType.toLowerCase(), schema, table],
		queryFn: async () => {
			return schemaType === config.SCHEMA_TYPES[0]
				? await apiRoutes.getDatabricksTable(schema, table)
				: await apiRoutes.getPostgresTable(schema, table);
		}
	});

	return (
		<Dialog
			open={show}
			title={`Load a ${schemaType} schema`}
			primaryLabel={isLoadingColumns ? 'Please wait' : 'Confirm'}
			primaryAction={() => actions.confirmLoadedSchema(columns?.data)}
			disabled={!columns?.data?.length}
			secondaryLabel='Cancel'
			secondaryAction={actions.toggleLoadSchemaDialog}
			onClose={actions.toggleLoadSchemaDialog}
			width={850}
		>
			<div>
				<Typography style={styles.instruction}>1. Select a schema.</Typography>
				<Typography style={styles.instruction}>2. Select a table from the chosen schema.</Typography>

				<div style={styles.select}>
					<CustomSelect
						variant='standard'
						label='Schema:'
						value={schema}
						options={schemas?.data}
						onChange={(e) => setSchema(e.target.value + '')}
						loading={isLoadingSchemas}
						activeBold
						selectStyles={{ width: 200 }}
					/>
				</div>

				<div style={styles.select}>
					<CustomSelect
						variant='standard'
						label='Table:'
						value={table}
						options={tables?.data}
						onChange={(e) => setTable(e.target.value + '')}
						loading={isLoadingTables}
						disabled={!schema}
						activeBold
						selectStyles={{ width: 200 }}
					/>
				</div>

				<Typography style={styles.error} color='error.main'>
					{(schemaError ?? tableError ?? columnError)?.message ?? ''}
				</Typography>
			</div>
		</Dialog>
	);
}

const styles = {
	error: {
		fontSize: 15,
		fontStyle: 'italic'
	},
	instruction: {
		fontSize: 15,
		fontStyle: 'italic',
		marginLeft: 10
	},
	select: {
		width: 300,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
};