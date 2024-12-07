import { useEffect, useState } from 'react';
import { FormControlLabel, Paper, Switch, TextField, Typography } from '@mui/material';

import { Delimiter, PendingSchema } from '../../types/types';
import config from '../../config/config';
import FormControlGroup from '../common/FormControlGroup';
import Dialog from '../common/Dialog';

import { useMockDataGeneratorSlice } from '../../state/store';
import * as actions from '../../state/mock-data-generator/actions';

const DELIMITER_OPTIONS = [
	{ key: config.DELIMITERS[0], label: 'New line' },
	{ key: config.DELIMITERS[1], label: 'Comma' }
];

function Instructions(
	props: {
		schemaType: typeof config.SCHEMA_TYPES[number],
		raw: boolean,
		delimiter: Delimiter
	}
) {
	const { schemaType, raw, delimiter } = props;
	let delimiterLabel = DELIMITER_OPTIONS.find(o => o.key === delimiter)?.label?.toLowerCase() ?? '';
	if (raw) {
		return (
			<Typography style={styles.instruction}>
				Enter a list of {delimiterLabel.replace(' ', '-')}-separated column names.
			</Typography>
		);
	}

	switch (schemaType) {
		case config.SCHEMA_TYPES[0]:
			return (
				<>
					<div style={styles.command}>
						<Typography style={styles.instruction}>1. In <b>Databricks</b>, create a new notebook on your cluster and run the following command:</Typography>
						<Paper elevation={0} style={styles.paper}>
							<Typography style={{ ...styles.instruction, margin: 0 }} fontWeight='bold' >describe [table name];</Typography>
						</Paper>
					</div>
					<Typography style={styles.instruction}>2. Export the results of this command to a CSV file and upload the file below.</Typography>
				</>
			);
		case config.SCHEMA_TYPES[1]:
			return (
				<>
					<Typography style={styles.instruction}>1. In <b>pgAdmin</b>, select your table in the navigation bar on the left.</Typography>
					<Typography style={styles.instruction}>2. Select the <b>SQL</b> tab.</Typography>
					<Typography style={styles.instruction}>3. Copy the <b>CREATE TABLE</b> statement from the generated SQL.</Typography>
					<Typography style={styles.instruction}>4. Paste into the textbox below.</Typography>
				</>
			);
		default:
			return <></>;
	}
}

export default function SchemaDialog() {
	const schemaType = useMockDataGeneratorSlice(state => state.schemaType);
	const [input, setInput] = useState('');
	const [raw, setRaw] = useState(false);
	const [rawDelimiter, setRawDelimiter] = useState<Delimiter>(config.DELIMITERS[0]);
	const [pendingSchema, setPendingSchema] = useState<PendingSchema>({ columns: [] });
	const [showError, setShowError] = useState(false);
	const error = !pendingSchema.columns.length || !!pendingSchema.error;

	useEffect(() => { if (!error) setShowError(false); }, [error]);

	const parseSchema = (schema: string) => {
		return actions.parseSchema(schema, raw, rawDelimiter);
	};

	const onInputChange = (value: string) => {
		setPendingSchema(parseSchema(value));
		setInput(value);
	};

	const onDelimiterChange = (value: Delimiter) => {
		setPendingSchema(parseSchema(value));
		setRawDelimiter(value);
	};

	const resetInput = () => {
		setInput('');
		setPendingSchema({ columns: [] });
		setShowError(false);
	};

	return (
		<Dialog
			open={true}
			title='Manually create a schema'
			primaryLabel='Confirm'
			primaryAction={() => actions.confirmManualSchema(pendingSchema)}
			disabled={!!error}
			secondaryLabel='Cancel'
			secondaryAction={actions.toggleManualSchemaDialog}
			onClose={actions.toggleManualSchemaDialog}
			width={850}
		>
			<div>
				<div style={styles.toolbar}>
					<div style={{ ...styles.toolbar, justifyContent: 'flex-start' }}>
						<FormControlLabel
							control={
								<Switch
									size='small'
									checked={raw}
									onChange={(e) => {
										resetInput();
										setRaw(e.target.checked);
									}}
								/>
							}
							label={<Typography marginLeft='2px' fontSize={15} fontWeight={raw ? 'bold' : 'normal'}>Raw</Typography>}
							style={{ marginLeft: 5, marginTop: 5 }}
						/>
					</div>

					<div style={{ ...styles.toolbar, justifyContent: 'flex-end' }}>
						{raw &&
							<FormControlGroup
								label='Delimiter:'
								value={rawDelimiter}
								controls={DELIMITER_OPTIONS}
								onChange={(e) => {
									let value = e.target.value as typeof config.DELIMITERS[number];
									onDelimiterChange(value);
								}}
								row
								compact
								flex
							/>
						}
					</div>
				</div>

				<Instructions schemaType={schemaType} raw={raw} delimiter={rawDelimiter} />

				{(raw || schemaType === config.SCHEMA_TYPES[1]) &&
					<TextField
						value={input}
						style={styles.textField}
						sx={styles.textFieldOverrides}
						multiline
						rows={5}
						placeholder={`Paste ${raw ? 'fields' : 'schema definition'} here...`}
						onChange={(e) => onInputChange(e.target.value)}
						onBlur={() => setShowError(true)}
						error={!!error && !!showError}
					/>
				}

				{!!pendingSchema.error &&
					<Typography style={styles.error} color='error.main'>{pendingSchema.error}</Typography>
				}
			</div>
		</Dialog>
	);
}

const styles = {
	command: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	error: {
		fontSize: 15,
		fontStyle: 'italic'
	},
	instruction: {
		fontSize: 15,
		fontStyle: 'italic',
		marginLeft: 10
	},
	paper: {
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		width: 'fit-content',
		padding: '0px 5px 0px',
		marginLeft: 5
	},
	textField: {
		width: '100%',
		marginTop: 10
	},
	textFieldOverrides: {
		'& .MuiInputBase-root': {
			fontSize: '15px'
		}
	},
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 40
	}
};