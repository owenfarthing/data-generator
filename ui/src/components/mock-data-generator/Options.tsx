import { useState } from "react";
import { Divider, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { Add, Clear } from "@mui/icons-material";

import config from "../../config/config";
import { NormalizedDataType } from "../../types/types";

function Option(
	props: {
		id: string,
		index: number,
		option: string,
		onDelete: (id: string, index: number) => void
	}
) {
	return (
		<Paper elevation={0} style={styles.paper}>
			<div style={styles.option}>
				<Typography fontSize={13} paddingLeft='5px'>
					{props.option}
				</Typography>
				<IconButton
					onClick={() => props.onDelete(props.id, props.index)}
					disableRipple
					style={{ padding: 5 }}
				>
					<Clear sx={{ fontSize: 14 }} />
				</IconButton>
			</div>
		</Paper>
	);
}

export default function Options(
	props: {
		id: string,
		index: number,
		options?: string[],
		dataType: NormalizedDataType,
		disabled: boolean,
		addOption: (id: string, option: string) => void,
		deleteOption: (id: string, index: number) => void
	}
) {
	const { id, index, options = [], dataType, disabled } = props;
	const [input, setInput] = useState('');

	const getInputType = () => {
		switch (dataType) {
			case config.NORMALIZED_DATA_TYPES.decimal:
			case config.NORMALIZED_DATA_TYPES.integer:
				return 'number';
			default:
				return dataType;
		}
	};

	const addOption = () => {
		props.addOption(id, input);
		setInput('');
	};

	return (
		<div style={styles.container}>
			<div style={styles.divider}>
				<Divider />
			</div>

			<div style={styles.optionContainer}>
				<Typography fontSize={13} fontStyle='italic' fontWeight='bold' marginRight='5px'>
					Set #{index + 1}:
				</Typography>

				{options.map((o: string, i: number) => (
					<Option id={id} key={i} index={i} option={o} onDelete={props.deleteOption} />
				))}
			</div>

			{!disabled && (
				<TextField
					value={input}
					onKeyDown={(e) => {
						if (e.key === 'Enter') addOption();
					}}
					onChange={(e) => setInput(e.target.value)}
					type={getInputType()}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									onMouseDown={addOption}
									disableRipple
									style={{ padding: 0 }}
									disabled={!input}
								>
									<Add sx={{ fontSize: 16 }} />
								</IconButton>
							</InputAdornment>
						),
					}}
					placeholder={dataType}
					style={styles.textField}
					sx={styles.textFieldOverrides}
				/>
			)}
		</div>
	);
}

const styles = {
	container: {
		width: 'fit-content',
		display: 'flex',
		flexDirection: 'column' as const,
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginBottom: 2
	},
	divider: {
		width: 200,
		height: 2,
		padding: '5px 0px 5px'
	},
	option: {
		width: 'fit-content',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	optionContainer: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginBottom: 2
	},
	paper: {
		width: 'fit-content',
		margin: 2,
		backgroundColor: '#f5f5f5',
		border: '1px solid rgba(0, 0, 0, 0.25)'
	},
	textField: {
		width: 150,
		minWith: 150
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