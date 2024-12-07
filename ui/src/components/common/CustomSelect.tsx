// extenal imports	
import { MenuItem, Select, SelectProps, Typography } from '@mui/material';
import { ValueLabel } from '../../types/types';
import { useEffect, useState } from 'react';

interface CustomSelectProps {
	variant?: SelectProps['variant'],
	label?: string,
	value: any,
	placeholder?: string,
	customError?: boolean,
	options: ValueLabel<any>[] | any[],
	multi?: boolean,
	hasLabels?: boolean,
	loading?: boolean,
	disabled?: boolean,
	errorsEnabled?: boolean,
	onChange: SelectProps['onChange'],
	itemRenderer?: (value: any) => string,
	compact?: boolean,
	activeBold?: boolean,
	selectStyles?: Record<string, number | string>,
	menuItemStyles?: Record<string, number | string>
}

export default function CustomSelect(props: CustomSelectProps) {
	const {
		variant, multi, hasLabels, placeholder, label, value, options = [],
		loading, disabled, errorsEnabled, customError, onChange, compact, activeBold,
		selectStyles = {}, menuItemStyles = {}, itemRenderer = null
	} = props;
	const error = customError === undefined ? !value : customError;
	const [showError, setShowError] = useState(false);
	const fontSize = compact ? '13px' : '15px';

	useEffect(() => { if (!error) setShowError(false); }, [error]);

	const getRawValue = () => {
		if (multi) {
			return value ?? [];
		} else {
			return value ?? '';
		}
	};

	const getDisplayValue = (v: any) => {
		if (typeof itemRenderer === 'function') return itemRenderer(v);

		if (!hasLabels) return v;

		if (Array.isArray(v)) {
			return v.map(val =>
				options.find(o => o.value === val)?.label ?? ''
			);
		} else {
			return options.find(o => o.value === v)?.label ?? '';
		}
	};

	const renderValue = (v: any) => {
		if (loading) return 'Loading...';

		const displayValue = getDisplayValue(v);

		if (multi && displayValue.length) return displayValue.join(', ');
		if (!multi && displayValue) return displayValue;

		return placeholder ?? 'Select';
	};

	return (
		<>
			{label &&
				<Typography style={styles.label(Boolean(!!value && activeBold), fontSize)}>
					{label}
				</Typography>
			}

			<Select
				variant={variant}
				displayEmpty
				multiple={multi}
				value={getRawValue()}
				renderValue={renderValue}
				disabled={disabled}
				onChange={onChange}
				onBlur={() => setShowError(true)}
				error={showError && errorsEnabled && error}
				style={{ ...styles.select, ...selectStyles }}
				sx={styles.selectOverrides(fontSize)}
				MenuProps={{
					PaperProps: {
						sx: {
							maxHeight: 300
						}
					},
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left'
					},
					transformOrigin: {
						vertical: 'top',
						horizontal: 'left'
					}
				}}
			>
				{options.map((o, j) => (
					<MenuItem
						key={j}
						value={o?.value ?? o}
						style={{ ...styles.menuItem(fontSize), ...menuItemStyles }}
					>
						{itemRenderer ? itemRenderer(o.value) : o?.label ?? o}
					</MenuItem>
				))}
			</Select>
		</>
	);
}

const styles = {
	label: (active: boolean, fontSize: number | string) => ({
		fontSize,
		fontWeight: active ? 'bold' : 'normal',
		paddingTop: 4,
		paddingRight: 10
	}),
	select: (width: number | string) => ({
		width: width ?? 180,
		minWith: width ?? 180
	}),
	selectOverrides: (fontSize: number | string) => ({
		backgroundColor: '#ffffff',
		'& .MuiSelect-select': {
			fontSize,
			paddingLeft: '5px'
		}
	}),
	menuItem: (fontSize: number | string) => ({
		fontSize
	})
};