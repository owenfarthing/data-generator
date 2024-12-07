import { FormControlLabel, Radio, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import { NormalizedDataType, ValueOptions } from "../../types/types";
import Options from "./Options";
import ButtonWithTooltip from "components/common/ButtonWithTooltip";
import config from "config/config";

export default function OptionsControl(
	props: {
		options: ValueOptions,
		dataType: NormalizedDataType,
		disabled: boolean,
		addOptions: (id: string) => void,
		addOption: (id: string, option: string) => void,
		deleteOption: (id: string, index: number) => void
	}
) {
	const { options, dataType, disabled, addOptions, addOption, deleteOption } = props;

	return (
		<>
			<FormControlLabel
				key={config.VALUE_CONTROLS.OPTIONS}
				value={config.VALUE_CONTROLS.OPTIONS}
				label={<Typography fontSize={13} marginRight='5px'>Options:</Typography>}
				control={<Radio size='small' />}
				sx={styles.form}
			/>

			<div style={styles.container}>
				{Object.keys(options).map((key, i) => (
					<Options
						key={key}
						index={i}
						id={key}
						options={options[key]}
						dataType={dataType}
						disabled={disabled}
						addOption={addOption}
						deleteOption={deleteOption}
					/>
				))}

				<ButtonWithTooltip
					buttonProps={{
						onClick: () => addOptions(`item${Object.keys(options).length}`),
						startIcon: <Add />,
						disabled: disabled || (dataType !== config.NORMALIZED_DATA_TYPES.text && Object.keys(options).length > 0),
						size: 'small',
						variant: 'outlined',
						style: styles.button
					}}
					tooltipProps={{
						title: 'New item'
					}}
				>
					Add
				</ButtonWithTooltip>
			</div>
		</>
	);
}

const styles = {
	button: {
		height: 25,
		marginTop: 5
	},
	container: {
		width: 'fit-content',
		display: 'flex',
		flexDirection: 'column' as const,
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginLeft: 10
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
	}
};