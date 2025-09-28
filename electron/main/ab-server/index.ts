import { paths } from '../constants.js';
import { existsSync } from 'fs';
import { startProcess } from '../process.js';

export function startServer() {
	const { serverBin, serverDist } = paths;
	if (existsSync(serverBin)) {
		console.log('Starting backend', serverBin);
		startProcess(serverBin, 'server');
	} else {
		console.log('Starting backend', serverDist);
		startProcess('node', 'server', [serverDist]);
	}
}