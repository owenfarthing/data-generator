import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, RadioGroupProps } from '@mui/material';

interface FormControlGroupProps {
	label: string,
	row?: boolean,
	flex?: boolean,
	value: number | string | undefined,
	controls: { label: string, key: string, disabled?: boolean }[],
	onChange: RadioGroupProps['onChange'],
	compact?: boolean
}

export default function FormControlGroup(props: FormControlGroupProps) {
	const { label, row, flex, value, controls, onChange, compact = false } = props;
	return (
		<FormControl>
			<div style={flex ? styles.container : undefined}>
				<FormLabel style={{ ...styles.formLabel, paddingBottom: flex ? 5 : 0 }}>{label}</FormLabel>
				<RadioGroup
					row={row}
					value={value}
					onChange={onChange}
				>
					{controls.map(({ label, key, disabled }) => (
						<FormControlLabel
							key={key}
							value={key}
							label={label}
							disabled={disabled}
							control={<Radio size='small' />}
							sx={styles.formSx(compact)}
						/>
					))}
				</RadioGroup>
			</div>

		</FormControl>
	);
}

const styles = {
	container: {
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	formLabel: {
		fontSize: 15,
		fontWeight: 'bold',
		margin: 0,
		paddingRight: 10
	},
	formSx: (compact?: boolean) => ({
		height: 25,
		paddingTop: '5px',
		'& .MuiTypography-root': {
			fontSize: compact ? 13 : 15
		},
		'& .MuiRadio-root': {
			padding: compact ? '5px' : undefined
		},
		'& .MuiSvgIcon-root': {
			width: compact ? 17 : undefined,
			height: compact ? 17 : undefined
		}
	})
};