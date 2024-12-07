import { FormControlLabel, Radio, Typography } from "@mui/material";
import CustomSelect from "components/common/CustomSelect";
import { BooleanType, ValueOptions } from "../../types/types";
import config from "config/config";

export default function BooleanOptions(
	props: {
		options: ValueOptions,
		disabled: boolean,
		updateBooleanOptions: (newOptions: BooleanType[]) => void
	}
) {
	const { options, disabled, updateBooleanOptions } = props;
	return (
		<FormControlLabel
			key={config.VALUE_CONTROLS.OPTIONS}
			value={config.VALUE_CONTROLS.OPTIONS}
			label={
				<div style={styles.select}>
					<Typography fontSize={13} marginRight='5px'>Options:</Typography>
					<CustomSelect
						multi
						value={options['item0']}
						options={Object.values(config.BOOLEAN_OPTIONS)}
						onChange={(e) => {
							let value = e.target.value as BooleanType[];
							updateBooleanOptions(value);
						}}
						disabled={disabled}
						compact
						selectStyles={{
							height: 30
						}}
					/>
				</div>}
			control={<Radio size='small' />}
			sx={styles.form}
		/>
	);
}

const styles = {
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
	select: {
		width: 120,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
};