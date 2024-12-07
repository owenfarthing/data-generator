import { Divider as MuiDivider, Typography } from "@mui/material";
import { Add, Edit, Save, Storage, Upload } from "@mui/icons-material";

import ButtonWithTooltip from "components/common/ButtonWithTooltip";

import { useMockDataGeneratorSlice } from "../../state/store";
import * as actions from '../../state/mock-data-generator/actions';
import * as downloadActions from '../../state/downloads/actions';
import config from "config/config";
import { useMutation } from "@tanstack/react-query";
import ExportMenu from "components/downloads/ExportMenu";
import StreamingDialog from "components/downloads/StreamingDialog";
import PushSchemaDialog from "./PushSchemaDialog";

const Divider = () => (
	<div style={styles.divider}>
		<MuiDivider orientation='vertical' />
	</div>
);

export default function BuilderToolbar(props: { id: number }) {
	const schemaType = useMockDataGeneratorSlice(state => state.schemaType);
	const schema = useMockDataGeneratorSlice(state => state.schema);
	const showPushSchemaDialog = useMockDataGeneratorSlice(state => state.ui.showPushSchemaDialog);
	const { isPending: isSaving, mutate } = useMutation({
		mutationKey: ['save', 'schema', props.id],
		mutationFn: async () => await actions.saveMockSchema(props.id)
	});

	return (
		<div style={styles.toolbar}>
			<div style={{ ...styles.toolbar, padding: 0, justifyContent: 'flex-start' }}>
				<Typography
					fontSize={15}
					fontWeight='bold'
					fontFamily='Montserrat'
					paddingTop='5px'
					color={
						schemaType === config.SCHEMA_TYPES[0]
							? 'rgba(237, 108, 3, 0.75)'
							: 'rgba(0, 136, 209, 0.75)'
					}
				>
					{schemaType.toUpperCase()}
				</Typography>

				<Divider />

				<Typography fontSize={13} paddingTop='5px' fontWeight='bold'>
					Columns: {schema.length}
				</Typography>
			</div>

			<div style={{ ...styles.toolbar, padding: 0, justifyContent: 'flex-end' }}>
				<ButtonWithTooltip
					buttonProps={{
						onClick: () => mutate(),
						size: 'small',
						variant: 'outlined',
						startIcon: <Save />,
						disabled: isSaving,
						style: styles.button
					}}
					tooltipProps={{
						title: 'Save schema'
					}}
				>
					Save
				</ButtonWithTooltip>

				<Divider />

				<ButtonWithTooltip
					buttonProps={{
						onClick: () => actions.openValueDialog(''),
						size: 'small',
						variant: 'outlined',
						startIcon: <Add />,
						style: { ...styles.button, marginLeft: 0 }
					}}
					tooltipProps={{
						title: 'Add schema field'
					}}
				>
					Add field
				</ButtonWithTooltip>

				<ButtonWithTooltip
					buttonProps={{
						onClick: actions.toggleLoadSchemaDialog,
						size: 'small',
						variant: 'outlined',
						startIcon: <Storage />,
						style: styles.button
					}}
					tooltipProps={{
						title: 'Load schema'
					}}
				>
					Load
				</ButtonWithTooltip>

				<ButtonWithTooltip
					buttonProps={{
						onClick: actions.toggleManualSchemaDialog,
						size: 'small',
						variant: 'outlined',
						startIcon: <Edit />,
						style: styles.button
					}}
					tooltipProps={{
						title: 'Manually create schema'
					}}
				>
					Manual
				</ButtonWithTooltip>

				<Divider />

				<ExportMenu
					download={(rowCount: number) => {
						downloadActions.streamSchemaToExport(props.id, rowCount, schema);
					}}
					disabled={!schema.length}
					buttonStyle={{ ...styles.button, marginLeft: 0 }}
				/>

				<ButtonWithTooltip
					buttonProps={{
						onClick: actions.openPushSchemaDialog,
						disabled: !schema.length,
						size: 'small',
						variant: 'outlined',
						startIcon: <Upload />,
						style: styles.button
					}}
					tooltipProps={{
						title: 'Push schema to database'
					}}
				>
					Push
				</ButtonWithTooltip>
			</div>

			<StreamingDialog />
			{showPushSchemaDialog && <PushSchemaDialog id={props.id} />}
		</div>
	);
}

const styles = {
	button: {
		marginLeft: 5,
		marginTop: 5
	},
	divider: {
		width: 1,
		height: 30,
		margin: '0px 5px 0px'
	},
	toolbar: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '0px 10px 0px',
		height: 35
	}
};