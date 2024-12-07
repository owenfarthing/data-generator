import { useReducer, useState } from "react";
import {
	Checkbox, Divider, FormControlLabel, RadioGroup,
	TextField, ToggleButton, ToggleButtonGroup, Typography
} from "@mui/material";

import Dialog from "components/common/Dialog";
import {
	BooleanType, NormalizedDataType, NormalizedSchemaRow,
	ValueControl, ValueRandom, ValueRange, ValueType
} from "../../types/types";
import config from "config/config";
import Range from "./Range";
import OptionsControl from "./OptionsControl";
import { getDefaultColumnValue } from "../../utils/utils";
import Random from "./Random";
import BooleanOptions from "./BooleanOptions";
import AutoIncrement from "./AutoIncrement";

export default function ValueDialog(
	props: {
		selectedRow: NormalizedSchemaRow,
		existingFields: string[],
		onConfirm: (newFieldName: string, newDataType: NormalizedDataType, newValue: ValueType) => void,
		onClose: () => void
	}
) {
	const { selectedRow, existingFields, onConfirm, onClose } = props;
	const [fieldName, setFieldName] = useState(selectedRow.field);
	const [dataType, setDataType] = useState(selectedRow.dataType);
	const [state, setState] = useReducer((state: ValueType, newState: Partial<ValueType>) => {
		return { ...state, ...newState };
	}, selectedRow.value);

	const updateRange = (key: keyof ValueRange, newRange: string) => {
		if (state.range) {
			setState({
				range: {
					...state.range,
					[key]: newRange
				}
			})
		}
	};

	const addOptions = (id: string) => {
		setState({ options: { ...state.options, [id]: [] } });
	};

	const addOption = (id: string, newOption: string) => {
		setState({
			options: {
				...state.options,
				[id]: [...(state.options[id] ?? []), newOption]
			}
		});
	};

	const deleteOption = (id: string, index: number) => {
		if (state.options) {
			let existingOptions = [...(state.options[id] ?? [])];
			if (existingOptions.length) {
				existingOptions.splice(index, 1);
				if (existingOptions.length) {
					setState({
						options: {
							...state.options,
							[id]: existingOptions
						}
					});
				} else {
					let newOptions = { ...state.options };
					delete newOptions[id];
					setState({ options: newOptions });
				}
			}
		}
	};

	const updateRandom = (key: keyof ValueRandom, value: number) => {
		setState({ random: { ...state.random, [key]: value } });
	};

	const updateStartingPoint = (newStartingPoint: number) => {
		setState({ startingPoint: newStartingPoint });
	};

	const updateBooleanOptions = (updatedOptions: BooleanType[]) => {
		setState({ options: { 'item0': updatedOptions as string[] } });
	};

	const updateIncludeNull = (value: boolean) => {
		setState({ includeNull: value });
	};

	const getControls = () => {
		const controlTypes = config.VALUE_CONTROLS_CONFIG[dataType];
		let controls: JSX.Element[] = [];

		controlTypes.forEach((c: ValueControl) => {
			switch (c) {
				case config.VALUE_CONTROLS.INCREMENTAL:
					controls.push(
						<AutoIncrement
							key='auto-increment'
							startingPoint={state.startingPoint}
							disabled={state.control !== c}
							updateStartingPoint={updateStartingPoint}
						/>
					);
					break;
				case config.VALUE_CONTROLS.OPTIONS:
					if (dataType === config.NORMALIZED_DATA_TYPES.boolean) {
						controls.push(
							<BooleanOptions
								key='boolean'
								options={state.options}
								disabled={state.control !== c}
								updateBooleanOptions={updateBooleanOptions}
							/>
						);
					} else {
						controls.push(
							<OptionsControl
								key='options'
								options={state.options}
								dataType={dataType}
								disabled={state.control !== c}
								addOptions={addOptions}
								addOption={addOption}
								deleteOption={deleteOption}
							/>
						);
					}

					break;
				case config.VALUE_CONTROLS.RANDOM:
					controls.push(
						<Random
							key='random'
							random={state.random}
							disabled={state.control !== c}
							updateRandom={updateRandom}
						/>
					);
					break;
				case config.VALUE_CONTROLS.RANGE:
					controls.push(
						<Range
							key='range'
							range={state.range}
							dataType={dataType}
							disabled={state.control !== c}
							updateRange={updateRange}
						/>
					);
					break;
				default:
					break;
			}
		});

		return controls;
	};

	return (
		<Dialog
			open={true}
			title='Configure value'
			primaryLabel='Configure'
			primaryAction={() => onConfirm(fieldName, dataType, state)}
			disabled={!fieldName || existingFields?.includes(fieldName)}
			secondaryLabel='Cancel'
			secondaryAction={onClose}
			onClose={onClose}
			width={500}
		>
			<div style={styles.fieldName}>
				<Typography fontSize={13} marginRight='5px'>Field Name:</Typography>
				<TextField
					value={fieldName}
					onChange={(e) => setFieldName(e.target.value)}
					placeholder='Field name'
					style={{ width: 150, minWidth: 150 }}
					sx={styles.textFieldOverrides}
				/>
			</div>

			<ToggleButtonGroup
				color='primary'
				value={dataType}
				exclusive
				onChange={(_, value) => {
					setDataType(value);
					setState(getDefaultColumnValue(value));
				}}
			>
				{Object.values(config.NORMALIZED_DATA_TYPES).map(d => (
					<ToggleButton key={d} value={d} size='small' sx={{ height: 25 }}>{d}</ToggleButton>
				))}
			</ToggleButtonGroup>

			<RadioGroup
				value={state.control}
				onChange={(e) => {
					let value = e.target.value as ValueControl;
					let updates: Partial<ValueType> = { control: value };
					if (value === config.VALUE_CONTROLS.INCREMENTAL) updates.includeNull = false;
					setState(updates);
				}}
				style={styles.radioGroup}
			>
				{getControls()}
			</RadioGroup>

			<div style={styles.checkboxContainer}>
				<FormControlLabel
					label={<Typography fontSize={13} fontWeight={state.includeNull ? 'bold' : ''}>Include null</Typography>}
					control={
						<Checkbox
							value={Boolean(state.includeNull)}
							checked={Boolean(state.includeNull)}
							onChange={(e) => updateIncludeNull(e.target.checked)}
							disabled={state.control === config.VALUE_CONTROLS.INCREMENTAL}
							style={styles.checkbox}
							sx={styles.checkboxSx}
							size='small'
						/>
					}
					style={{ margin: 0 }}
				/>

				{state.includeNull &&
					<>
						<div style={{ width: 2, height: 20, padding: '0px 5px 0px' }}>
							<Divider orientation='vertical' />
						</div>

						<div style={styles.nullRatioContainer}>
							<Typography fontSize={13} marginRight='5px'>Percentage:</Typography>
							<TextField
								value={state.nullRatio}
								onChange={(e) => {
									let value = +e.target.value;
									if (value > 0 && value <= 100) {
										setState({ nullRatio: +e.target.value });
									}
								}}
								type='number'
								InputProps={{
									endAdornment: <Typography fontSize={13}>%</Typography>
								}}
								style={styles.textField}
								sx={styles.textFieldOverrides}
							/>
						</div>
					</>
				}
			</div>
		</Dialog>
	);
}

const styles = {
	checkbox: {
		padding: 0,
		marginRight: 5
	},
	checkboxContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	checkboxSx: {
		'& .MuiSvgIcon-root': {
			width: 17,
			height: 17
		}
	},
	fieldName: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginBottom: 5
	},
	formLabel: {
		fontSize: 15
	},
	nullRatioContainer: {
		width: 175,
		display: 'flex',
		alignItems: 'center'
	},
	radioGroup: {
		marginTop: 10,
		paddingLeft: 5
	},
	textField: {
		width: 80,
		minWith: 80
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