// external imports
import axios, { AxiosError } from 'axios';

// internal imports
import * as storeUtilities from '../storeUtilities';
import config from '../../config/config';
import { GlobalSlice } from 'state/storeTypes';
import { Alert, AlertOverrides } from 'types/types';

const INFO_ALERT_TIMEOUT = 2000;
const ERROR_ALERT_TIMEOUT = 5000;

const getState = storeUtilities.getStateBuilder<GlobalSlice>('globalSlice');
const setState = storeUtilities.setStateBuilder<GlobalSlice>('globalSlice');

const FALLBACK_ERROR_MESSAGE = 'An unknown error has occurred.';

// public methods

// @param alert can be type Error, object like { type, message, title }, or falsey
// type is one of 'success', 'error', 'warning', 'info'.
// message and title are strings.

// @param overrides is object with properties messageOverride and/or titleOverride, both strings
export function setAlert(alert: Alert, overrides: AlertOverrides = {}) {
	const { doNotDismiss, messageOverride = '', titleOverride = '' } = overrides;
	const isError = alert instanceof Error || alert?.type === 'error';
	let result: Alert = undefined;

	if (alert instanceof Error) {
		if (axios.isAxiosError(alert)) {
			result = {
				title: 'Error from our servers:',
				message: handleAxiosError(alert),
				type: 'error',
			};
		} else {
			result = {
				title: alert.name,
				message: alert.message,
				type: 'error',
			};
		}
	} else if (alert?.type) {
		const { type, message, title } = alert;
		result = { type, message, title };
	}

	if (result) {
		if (messageOverride) {
			result.message = messageOverride;
		}
		if (titleOverride) {
			result.title = titleOverride;
		}
	}

	setState((state) => {
		if (state.ui.alert.length) state.ui.alert?.pop();
		state.ui.alert.unshift(result);
	});

	if (!doNotDismiss) {
		setTimeout(
			() => {
				setState(state => {
					state.ui.alert?.pop();
				})
			},
			isError ? ERROR_ALERT_TIMEOUT : INFO_ALERT_TIMEOUT
		);
	}
}

// private methods

function makeHashOrUserMessageError({ hashCode, userMessage }: { hashCode?: string, userMessage?: string }) {
	let message = '';
	if (userMessage) {
		message = userMessage + ' ';
	}
	if (hashCode) {
		message += `Please reference code ${hashCode} if you wish to create a ticket regarding this issue.`;
	}

	return message;
}

function handleAxiosError(error: AxiosError) {
	let finalMessage: string;
	const res = error?.response;
	if (res) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		if ([502, 503, 504].includes(res.status)) {
			finalMessage = `Temporarily unable to access our server.`;
		} else if (res.data?.hashCode || res.data?.userMessage) {
			finalMessage = makeHashOrUserMessageError(res.data || {});
		} else {
			finalMessage = FALLBACK_ERROR_MESSAGE;
		}
	} else if (error.request) {
		finalMessage = 'Unable to contact server.';
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser
	} else {
		// Something happened in setting up the request that triggered an Error
		finalMessage = 'Request configured incorrectly';
	}
	return finalMessage;
}
