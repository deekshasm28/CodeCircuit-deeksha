import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

// Optional: Error handlers (left shortened)
const configHorizonsViteErrorHandler = `/* your vite overlay error handler here */`;
const configHorizonsRuntimeErrorHandler = `/* your runtime error handler here */`;
const configHorizonsConsoleErrroHandler = `/* your console error handler here */`;
const configWindowFetchMonkeyPatch = `/* your fetch monkey patch here */`;

const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		return {
			html,
			tags: [
				{ tag: 'script', attrs: { type: 'module' }, children: configHorizonsRuntimeErrorHandler, injectTo: 'head' },
				{ tag: 'script', attrs: { type: 'module' }, children: configHorizonsViteErrorHandler, injectTo: 'head' },
				{ tag: 'script', attrs: { type: 'module' }, children: configHorizonsConsoleErrroHandler, injectTo: 'head' },
				{ tag: 'script', attrs: { type: 'module' }, children: configWindowFetchMonkeyPatch, injectTo: 'head' },
			],
		};
	},
};

console.warn = () => {};
const logger = createLogger();
const loggerError = logger.error;
logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) return;
	loggerError(msg, options);
};

export default defineConfig({
	base: '/', // ✅ for Netlify
	customLogger: logger,
	plugins: [react(), addTransformIndexHtml],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
