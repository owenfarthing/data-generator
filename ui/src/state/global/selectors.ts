// internal imports
import { State } from 'state/store';
import config from '../../config/config';

const getSlice = (state: State) => state['globalSlice'];

// alerts

export function alertColors(state: State) {
	const alert = getSlice(state).ui.alert?.[0];

	if (!alert || alert instanceof Error) return {};

	let bgcolor, textcolor;
	if (alert.type === 'error') {
		bgcolor = 'error.main';
		textcolor = '#ffffff';
	}
	if (alert.type === 'success') {
		bgcolor = 'success.main';
		textcolor = '#ffffff';
	}
	if (alert.type === 'warning') {
		bgcolor = 'warning.main';
		textcolor = '#ffffff';
	}
	if (alert.type === 'info') {
		bgcolor = 'info.main';
		textcolor = '#ffffff';
	}
	return { bgcolor, textcolor };
}