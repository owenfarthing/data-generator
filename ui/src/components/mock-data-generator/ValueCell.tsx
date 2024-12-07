import { Link, Paper, Typography } from "@mui/material";
import config from "config/config";
import { NormalizedSchemaRow } from "../../types/types";

import { useMockDataGeneratorSlice } from "../../state/store";
import * as actions from '../../state/mock-data-generator/actions';

function Container(props: { value: string }) {
	return (
		<Paper elevation={0} style={styles.paper}>
			<Typography fontSize={13} padding='0px 5px 0px' lineHeight='22px'>
				{props.value}
			</Typography>
		</Paper>
	);
}

export default function ValueCell(props: { row: NormalizedSchemaRow }) {
	const { field, dataType, value } = props.row;
	const { control, options, random, range, startingPoint, includeNull } = value;
	const expanded = useMockDataGeneratorSlice(state => state.expanded);
	const isExpanded = Boolean(expanded.get(field));
	let elements: JSX.Element[] = [];
	let optionSets = Object.keys(options);
	let displayDataType = dataType === config.NORMALIZED_DATA_TYPES.text ? 'string' : dataType;

	switch (control) {
		case config.VALUE_CONTROLS.INCREMENTAL:
			elements.push(
				<Typography key='boolean' fontSize={13} fontStyle='italic'>
					An auto-incrementing <b>{displayDataType}</b> with a starting point of <b>{startingPoint}</b>
				</Typography>
			);
			break;
		case config.VALUE_CONTROLS.OPTIONS:
			elements.push(
				<div key='options' style={styles.column}>
					<Typography fontSize={13} fontStyle='italic'>
						A random <b>{displayDataType}</b> selected from the following distinct {optionSets.length > 1 ? 'combinations of options' : 'options'}:
					</Typography>

					{isExpanded && (
						<>
							{optionSets.map((key, i) => (
								<div key={i} style={styles.row}>
									{optionSets.length > 1 && (
										<Typography fontSize={13} fontWeight='bold' fontStyle='italic' marginRight='5px'>
											Set #{i + 1}:
										</Typography>
									)}
									{options[key].map((v, j) => (
										<div key={j} style={styles.row}>
											<Container value={v} />
											{j < options[key].length - 1 && ','}
										</div>
									))}
								</div>
							))}
						</>
					)}

					<Link
						onClick={() => actions.toggleExpanded(field)}
						style={styles.link}
					>
						Show {isExpanded ? 'less' : 'more'}
					</Link>
				</div >
			);
			break;
		case config.VALUE_CONTROLS.RANDOM:
			elements.push(
				<Typography key='random' fontSize={13} fontStyle='italic'>
					A string of length <b>{random.length}</b> selected from a random pool of size <b>{random.pool}</b>
				</Typography>
			);
			break;
		case config.VALUE_CONTROLS.RANGE:
			elements.push(
				<div key='range' style={styles.row}>
					<Typography fontSize={13} fontStyle='italic' marginRight='2px'>
						A random <b>{displayDataType}</b> between
					</Typography>
					<Container value={range.lower} />
					<Typography fontSize={13} fontStyle='italic' margin='0px 2px 0px'>and</Typography>
					<Container value={range.upper} />
				</div>
			);
			break;
		default:
			return <></>;
	}

	if (includeNull) {
		elements.push(
			<Typography
				key='include-null'
				style={styles.includesNull}
				color='error.main'
			>
				Includes null
			</Typography>
		);
	}

	return (
		<div style={styles.column}>
			{elements}
		</div>
	);
}

const styles = {
	column: {
		display: 'flex',
		flexDirection: 'column' as const,
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	includesNull: {
		fontSize: 13,
		fontStyle: 'italic',
		lineHeight: '15px',
		paddingBottom: '5px'
	},
	link: {
		lineHeight: '15px',
		paddingBottom: '5px',
		fontSize: 12,
		fontStyle: 'italic',
		cursor: 'pointer'
	},
	paper: {
		width: 'fit-content',
		margin: 2,
		backgroundColor: '#f5f5f5',
		border: '1px solid rgba(0, 0, 0, 0.25)'
	},
	row: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
};