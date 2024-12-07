import { Typography } from "@mui/material";

export default function FieldCell(props: { field: string }) {
	return (
		<div style={styles.container}>
			<Typography fontSize={13} fontStyle='italic'>{props.field}</Typography>
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