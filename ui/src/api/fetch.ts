import moment from 'moment-timezone';
import { env } from '../config/env';

export async function fetchGet(endpoint: string, headers: Record<string, any> = {}) {
	try {
		let requestHeaders = new Headers({
			...headers,
			'Accept-Language': moment.tz.guess()
		});

		return await fetch(`${env.apiEndpoint}${endpoint}`, { method: 'GET', headers: requestHeaders });
	} catch (e) { console.error(e); }
}

export async function fetchPost(endpoint: string, data: any, headers: Record<string, any> = {}) {
	try {
		let requestHeaders = new Headers({
			...headers,
			'Accept-Language': moment.tz.guess()
		});

		return await fetch(`${env.apiEndpoint}${endpoint}`, { method: 'POST', body: data, headers: requestHeaders });
	} catch (e) { console.error(e); }
}
