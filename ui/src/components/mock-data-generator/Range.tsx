import { FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import config from "../../config/config";
import { NormalizedDataType, ValueRange } from "../../types/types";

function Value(
	props: {
		bound: keyof ValueRange,
		value: string,
		dataType: NormalizedDataType,
		disabled: boolean,
		updateRange: (key: keyof ValueRange, newRange: string) => void
	}
) {
	const { bound, value, dataType, disabled, updateRange } = props;
	return (
		<TextField
			value={value}
			onChange={(e) => updateRange(bound, e.target.value)}
			disabled={disabled}
			type={
				dataType === config.NORMALIZED_DATA_TYPES.date
					? 'date'
					: 'number'
			}
			placeholder={dataType}
			style={styles.textField}
			sx={styles.textFieldOverrides}
		/>
	);
}

export default function Range(
	props: {
		range: ValueRange,
		dataType: NormalizedDataType,
		disabled: boolean,
		updateRange: (key: keyof ValueRange, newRange: string) => void
	}
) {
	const { range, dataType, disabled, updateRange } = props;
	return (
		<FormControlLabel
			key={config.VALUE_CONTROLS.RANGE}
			value={config.VALUE_CONTROLS.RANGE}
			label={
				<div style={styles.container}>
					<Typography fontSize={13} marginRight='5px'>Range:</Typography>
					<Value
						bound='lower'
						value={range.lower}
						dataType={dataType}
						disabled={disabled}
						updateRange={updateRange}
					/>
					<Typography fontSize={15} fontWeight='bold' margin='0px 5px 0px'>:</Typography>
					<Value
						bound='upper'
						value={range.upper}
						dataType={dataType}
						disabled={disabled}
						updateRange={updateRange}
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
	textField: {
		width: 110,
		minWith: 110
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