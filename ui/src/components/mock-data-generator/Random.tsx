import { FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import config from "config/config";
import { ValueRandom } from "../../types/types";

export default function Random(
	props: {
		random: ValueRandom,
		disabled: boolean,
		updateRandom: (key: keyof ValueRandom, value: number) => void
	}
) {
	const { random, disabled, updateRandom } = props;

	return (
		<FormControlLabel
			key={config.VALUE_CONTROLS.RANDOM}
			value={config.VALUE_CONTROLS.RANDOM}
			label={
				<div style={styles.container}>
					<Typography style={styles.label}>Random:</Typography>
					<Typography style={styles.label} fontWeight='bold'>Length:</Typography>
					<TextField
						value={random.length}
						onChange={(e) => {
							let value = +e.target.value;
							if (value > 0 && value <= 12) {
								updateRandom('length', +e.target.value);
							}
						}}
						disabled={disabled}
						type='number'
						style={{ width: 50, minWidth: 50, marginRight: 10 }}
						sx={styles.textFieldOverrides}
					/>
					<Typography style={styles.label} fontWeight='bold'>Pool:</Typography>
					<TextField
						value={random.pool}
						onChange={(e) => {
							let value = +e.target.value;
							if (value > 0 && value <= 1000) {
								updateRandom('pool', +e.target.value);
							}
						}}
						disabled={disabled}
						type='number'
						style={{ width: 60, minWidth: 60 }}
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
		}
	},
	label: {
		fontSize: 13,
		marginRight: 10
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