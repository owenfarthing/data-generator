import { FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import config from "config/config";

export default function AutoIncrement(
	props: {
		startingPoint: number,
		disabled: boolean,
		updateStartingPoint: (newStartingPoint: number) => void
	}
) {
	const { startingPoint, disabled, updateStartingPoint } = props;

	return (
		<FormControlLabel
			key={config.VALUE_CONTROLS.INCREMENTAL}
			value={config.VALUE_CONTROLS.INCREMENTAL}
			label={
				<div style={styles.container}>
					<Typography fontSize={13} marginRight='5px'>Auto-incrementing:</Typography>
					<TextField
						value={startingPoint}
						onChange={(e) => updateStartingPoint(+e.target.value)}
						disabled={disabled}
						type='number'
						style={{ width: 80, minWidth: 80 }}
						sx={styles.textFieldOverrides}
					/>
				</div>
			}
			control={<Radio size='small' />}
			sx={styles.form}
		/>
	);
}

const styles = {
	container: {
		width: 'fit-content',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	form: {
		height: 25,
		paddingTop: '5px',
		'& .MuiTypography-root': {
			fontSize: 13
		},
		'& .MuiRadio-root': {
			padding: '5px'
		},
		'& .MuiSvgIcon-root': {
			width: 17,
			height: 17
		},
		'& .MuiFormControlLabel-root': {
			margin: 0
		}
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