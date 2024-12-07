import { useState } from 'react';
import { Checkbox, Collapse, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';

import * as apiRoutes from '../../api/routes';
import CustomSelect from '../common/CustomSelect';
import Dialog from '../common/Dialog';
import config from 'config/config';

import { useMockDataGeneratorSlice } from '../../state/store';
import * as actions from '../../state/mock-data-generator/actions';

export default function PushSchemaDialog(props: { id: number }) {
	const schema = useMockDataGeneratorSlice(state => state.schema);
	const schemaType = useMockDataGeneratorSlice(state => state.schemaType);
	const [targetSchema, setTargetSchema] = useState('');
	const [targetTable, setTargetTable] = useState('');
	const [rowCount, setRowCount] = useState(1000);
	const [createNewTable, setCreateNewTable] = useState(false);
	const [replaceData, setReplaceData] = useState(false);

	// queries
	const { data: schemas, isLoading: isLoadingSchemas, error: schemaError } = useQuery({
		queryKey: ['schemas', schemaType.toLowerCase()],
		queryFn: async () => {
			return schemaType === config.SCHEMA_TYPES[0]
				? await apiRoutes.getDatabricksSchemas()
				: await apiRoutes.getPostgresSchemas();
		}
	});
	const { data: tables, isLoading: isLoadingTables, error: tableError } = useQuery({
		enabled: !!targetSchema,
		queryKey: ['tables', schemaType.toLowerCase(), targetSchema],
		queryFn: async () => {
			return schemaType === config.SCHEMA_TYPES[0]
				? await apiRoutes.getDatabricksTables(targetSchema)
				: await apiRoutes.getPostgresTables(targetSchema);
		}
	});
	const { mutate: pushSchema, isPending: isPushing, error: pushError } = useMutation({
		mutationKey: ['stream', schemaType.toLowerCase(), targetSchema, targetTable],
		mutationFn: async () => {
			try {
				let processRow = await apiRoutes.streamSchemaToDatabase(
					props.id,
					{
						rowCount,
						schema,
						targetSchema,
						targetTable,
						createNewTable,
						replaceData
					}
				);
				actions.closePushSchemaDialog();
				actions.updateProcessId(processRow.data.processId);
			} catch (e) { console.error(e); }
		}
	});

	return (
		<Dialog
			open={true}
			title={`Push to ${schemaType}...`}
			primaryLabel={isPushing ? 'Pushing' : 'Confirm'}
			primaryAction={() => pushSchema()}
			disabled={!targetTable || !targetSchema || rowCount == null || isPushing}
			secondaryLabel='Cancel'
			secondaryAction={actions.closePushSchemaDialog}
			onClose={actions.closePushSchemaDialog}
			width={600}
		>
			<div>
				<Typography style={styles.instruction}>1. Select a target schema:</Typography>
				<div style={styles.select}>
					<CustomSelect
						variant='standard'
						value={targetSchema}
						options={schemas?.data}
						onChange={(e) => {
							setTargetSchema(e.target.value + '');
							setTargetTable('');
						}}
						loading={isLoadingSchemas || isPushing}
						selectStyles={{ width: 200 }}
					/>
				</div>

				<Collapse in={!!targetSchema}>
					<Typography style={styles.instruction}>2. Select a target table from the chosen schema:</Typography>

					<div style={styles.checkboxContainer}>
						<Checkbox
							checked={createNewTable}
							onChange={(e) => {
								setCreateNewTable(e.target.checked);
								setTargetTable('');
							}}
							disabled={replaceData}
							style={styles.checkbox}
							sx={styles.checkboxSx}
							size='small'
						/>
						<Typography fontSize={13} fontStyle='italic'>
							Create a new table from this schema if it doesn't exist
						</Typography>
					</div>

					{createNewTable
						? (
							<TextField
								value={targetTable}
								onChange={(e) => setTargetTable(e.target.value)}
								disabled={!targetSchema}
								style={{ width: 200, minWidth: 200 }}
								sx={styles.textFieldOverrides}
							/>
						) : (
							<div style={styles.select}>
								<CustomSelect
									variant='standard'
									value={targetTable}
									options={tables?.data}
									onChange={(e) => setTargetTable(e.target.value + '')}
									loading={isLoadingTables}
									disabled={!targetSchema || isPushing}
									selectStyles={{ width: 200 }}
								/>
							</div>
						)
					}
				</Collapse>

				<Collapse in={!!targetSchema && !!targetTable}>
					<Typography style={styles.instruction}>3. Specify data parameters:</Typography>
					<div style={styles.row}>
						<div style={styles.textContainer}>
							<Typography fontSize={13} fontWeight='bold' marginRight='5px'>Row Count:</Typography>
							<TextField
								value={rowCount}
								onChange={(e) => setRowCount(+e.target.value)}
								disabled={isPushing}
								type='number'
								style={{ width: 80, minWidth: 80 }}
								sx={styles.textFieldOverrides}
							/>
						</div>

						{!createNewTable &&
							<div style={{ ...styles.checkboxContainer, marginLeft: 10, padding: '10px 0px 0px 5px' }}>
								<Checkbox
									checked={replaceData}
									onChange={(e) => setReplaceData(e.target.checked)}
									style={styles.checkbox}
									sx={styles.checkboxSx}
									size='small'
								/>
								<Typography fontSize={13} fontStyle='italic'>
									Replace existing data
								</Typography>
							</div>
						}
					</div>
				</Collapse>

				<Typography style={styles.error} color='error.main'>
					{(schemaError ?? tableError ?? pushError)?.message ?? ''}
				</Typography>
			</div>
		</Dialog>
	);
}

const styles = {
	checkboxContainer: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	checkbox: {
		padding: 0,
		marginRight: 5
	},
	checkboxSx: {
		'& .MuiSvgIcon-root': {
			width: 17,
			height: 17
		}
	},
	error: {
		fontSize: 15,
		fontStyle: 'italic',
		marginTop: 5
	},
	instruction: {
		marginTop: 5,
		fontSize: 15,
		fontStyle: 'italic',
		lineHeight: '25px'
	},
	row: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	select: {
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	textContainer: {
		width: 'fit-content',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10
	},
	textFieldOverrides: {
		'& .MuiInputBase-root': {
			fontSize: '13px'
		},
		'& .MuiInputBase-input': {
			padding: '5px'
		}
	}
};