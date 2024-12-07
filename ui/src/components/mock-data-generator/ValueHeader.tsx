import { Collapse, Typography } from "@mui/material";
import useStore, { useMockDataGeneratorSlice } from "../../state/store";
import * as actions from '../../state/mock-data-generator/actions';
import * as selectors from '../../state/mock-data-generator/selectors';
import ButtonWithTooltip from "components/common/ButtonWithTooltip";
import { Expand, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export default function ValueHeader() {
	const expanded = useMockDataGeneratorSlice(state => state.expanded);
	const hasExpandableFields = useStore(selectors.hasExpandableFields);
	const isExpanded = expanded.size > 0;

	return (
		<div style={styles.header}>
			<Typography color='black' fontSize={13} fontWeight='bold'>Value</Typography>
			{hasExpandableFields &&
				<ButtonWithTooltip
					buttonProps={{
						onClick: isExpanded ? actions.collapseAll : actions.expandAll,
						size: 'small',
						disableRipple: true
					}}
					tooltipProps={{
						title: isExpanded ? 'Collapse all' : 'Expand all'
					}}
					icon={
						isExpanded
							? <KeyboardArrowUp sx={styles.icon} />
							: <KeyboardArrowDown sx={styles.icon} />
					}
				/>
			}
		</div>
	);
}

const styles = {
	header: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	icon: {
		fontSize: 19
	}
};