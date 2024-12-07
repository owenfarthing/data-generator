import { Delete, Settings } from "@mui/icons-material";

import * as actions from '../../state/mock-data-generator/actions';
import ButtonWithTooltip from "components/common/ButtonWithTooltip";

export default function ActionCell(props: { field: string }) {
	return (
		<div style={styles.container}>
			<ButtonWithTooltip
				buttonProps={{
					onClick: () => actions.openValueDialog(props.field),
					size: 'small',
					style: { borderRadius: 0 }
				}}
				tooltipProps={{
					title: 'Configure'
				}}
				icon={<Settings sx={styles.icon} />}
			/>

			<ButtonWithTooltip
				buttonProps={{
					onClick: () => actions.deleteRow(props.field),
					size: 'small',
					style: { borderRadius: 0 }
				}}
				tooltipProps={{
					title: 'Delete'
				}}
				icon={<Delete sx={styles.icon} />}
			/>
		</div>
	);
}

const styles = {
	container: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		height: '100%'
	},
	icon: {
		fontSize: '19px'
	}
};