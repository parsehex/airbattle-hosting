import { resolve } from 'path';

export const paths = {
	serverBin: resolve(__dirname, '../../ab-server/app-bin'),
	botsBin: resolve(__dirname, '../../ab-bot/app-bin'),
	serverDist: resolve(__dirname, '../../ab-server/dist/app.js'),
	botsDist: resolve(__dirname, '../../ab-bot/dist/app.js'),
	env: resolve(__dirname, '../../ab-server/.env'),
	preload: resolve(__dirname, '../preload/index.mjs')
}
