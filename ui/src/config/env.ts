export const env = {
	matomoHref:
		window?.__env__?.REACT_APP_MATOMO_HREF ||
		process.env.REACT_APP_MATOMO_HREF ||
		'',
	apiEndpoint:
		window?.__env__?.REACT_APP_API_ENDPOINT ||
		process.env.REACT_APP_API_ENDPOINT
} as const;