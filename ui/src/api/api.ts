// extenal imports	
import axios, { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment-timezone';

// internal imports
import config from '../config/config';
import { env } from '../config/env';

const CancelToken = axios.CancelToken;
const defaultErrorCB = (e: AxiosError) => console.error(e);

type Callback = (res: AxiosResponse) => void;
type ErrorCallback = (e: AxiosError) => void;

//global error interceptor
axios.interceptors.response.use(
	(response) => {
		// Do something with response data
		return response;
	},
	function (error) {
		if (error.response && error.response.status === 401) {
			window.location.href = env.apiEndpoint + config.LOGIN_ENDPOINT;
		} else if (error.response && error.response.status === 403 && window.location.hash !== '#/unauthorized') {
			window.location.href = '#/unauthorized';
		}
		// Do something with response error
		return Promise.reject(error);
	}
);

//global request interceptor
axios.interceptors.request.use(
	(config) => {
		// add client time zone to headers
		config.headers['Accept-Language'] = moment.tz.guess();
		return config;
	}, function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

axios.defaults.baseURL = env.apiEndpoint;

export function performDelete(
	endpoint: string,
	callback: Callback,
	errorCallback?: ErrorCallback,
	options?: any
) {
	return axios.delete(endpoint, options)
		.then(callback)
		.catch(errorCallback || defaultErrorCB);
}

export function performAsyncDelete(endpoint: string, options?: any) {
	return axios.delete(endpoint, options);
}

export function performPostWithConfig(
	endpoint: string,
	config: any,
	data: any,
	callback: Callback,
	errorCallback?: ErrorCallback
) {
	axios.post(endpoint, data, config)
		.then(callback)
		.catch(interceptCancelledRequestException(errorCallback || defaultErrorCB));
}

export function performPost(
	endpoint: string,
	data: any,
	callback: Callback,
	errorCallback?: ErrorCallback
) {
	const source = CancelToken.source();
	axios.post(endpoint, data, { cancelToken: source.token })
		.then(callback)
		.catch(interceptCancelledRequestException(errorCallback || defaultErrorCB));
	return source;
}

export function performAsyncPost(endpoint: string, data: any) {
	return axios.post(endpoint, data);
}

export function performGet(
	endpoint: string,
	callback: Callback,
	errorCallback?: ErrorCallback,
	options?: any
) {
	return axios.get(endpoint, options)
		.then(callback)
		.catch(errorCallback || defaultErrorCB);
}

export function performAsyncGet(endpoint: string, options?: any) {
	return axios.get(endpoint, options);
}

export function performPut(
	endpoint: string,
	callback: Callback,
	errorCallback?: ErrorCallback,
	options?: any
) {
	return axios.put(endpoint, options)
		.then(callback)
		.catch(errorCallback || defaultErrorCB);
}

export function performAsyncPut(endpoint: string, options?: any) {
	return axios.put(endpoint, options);
}

// private functions

function interceptCancelledRequestException(callback: ErrorCallback) {
	return (exception: AxiosError) => {
		if (axios.isCancel(exception)) {
			// TODO
		} else if (callback) {
			callback(exception);
		}
	};
}

