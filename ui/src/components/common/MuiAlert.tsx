// extenal imports	
import { Alert, AlertTitle, Snackbar } from '@mui/material';

// internal imports
import { alertColors } from '../../state/global/selectors';
import { setAlert } from '../../state/global/actions';
import useStore, { useGlobalSlice } from '../../state/store';

export function MuiAlert() {
	const alert = useGlobalSlice((state) => state.ui.alert?.[0]);
	const { bgcolor, textcolor } = useStore(alertColors);

	if (!alert || alert instanceof Error) {
		return <></>;
	} else {
		const { type, title, message } = alert;

		return (
			<Snackbar
				open={!!alert}
				sx={{ minWidth: 300 }}
			>
				<Alert
					onClose={() => setAlert({ type: undefined })}
					severity={type}
					sx={{
						width: '100%',
						bgcolor,
						color: textcolor,
						'& .MuiAlert-icon': {
							color: textcolor,
							alignItems: 'center',
						},
						'& .MuiAlertTitle-root': {
							color: textcolor,
						},
					}}
				>
					{title ? <AlertTitle>{title}</AlertTitle> : null}
					{message}
				</Alert>
			</Snackbar>
		);
	}
}
