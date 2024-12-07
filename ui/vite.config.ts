import { defineConfig, loadEnv, UserConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_']);

	return {
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				api: path.resolve(__dirname, './src/api'),
				components: path.resolve(__dirname, './src/components'),
				config: path.resolve(__dirname, './src/config'),
			},
			// https://github.com/vitejs/vite/discussions/15268 and https://vitejs.dev/config/shared-options.html#resolve-mainfields
			mainFields: ['browser'],
		},
		build: {
			outDir: 'build',
		},
		define: {
			'process.env': env,
			global: 'globalThis', // replace references to Node.js global with globalThis, which is available in browser environments
		},
		plugins: [
			nodePolyfills({
				include: ['util'],
			}),
			react(),
		]
	} as UserConfig;
});
