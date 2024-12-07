import { NormalizedDataType } from "../../types/types";
import config from '../../config/config';
import { Typography } from "@mui/material";

export default function DataTypeCell(props: { dataType: NormalizedDataType | undefined }) {
	const getColor = () => {
		switch (props.dataType) {
			case config.NORMALIZED_DATA_TYPES.boolean:
				return 'rgba(211, 48, 47, 0.75)';
			case config.NORMALIZED_DATA_TYPES.date:
				return 'rgba(237, 108, 3, 0.75)';
			case config.NORMALIZED_DATA_TYPES.decimal:
			case config.NORMALIZED_DATA_TYPES.integer:
				return 'rgba(0, 136, 209, 0.75)';
			default:
				return 'rgba(47, 124, 49, 0.75)';
		}
	};

	return (
		<div style={styles.container}>
			<Typography color={getColor()} fontWeight='bold' textAlign='center' fontSize={13}>
				{props.dataType?.toUpperCase() ?? ''}
			</Typography>
		</div>
	);
}

const styles = {
	container: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: '100%'
	}
};