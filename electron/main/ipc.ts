import { app, ipcMain } from 'electron';
import { readEnvConfig, updateEnvConfig } from './ab-server/config.js';
import { BotsConfig, ServerConfig } from 'electron/types.js';
import { restartBots } from './ab-bot/index.js';
import { startServer } from './ab-server/index.js';
import { processes } from './process.js';
import { delay } from './utils.js';
import { getWindow } from './window.js';

export function initIPC() {
	ipcMain.handle('get-config', async () => {
		 return readEnvConfig();
	});
	
	ipcMain.on('set-server-config', async (event, serverConfig: ServerConfig) => {
		console.log(`Setting server config - Game mode: ${serverConfig.gameMode}, Upgrades Fever: ${serverConfig.upgradesFever}, CTF Extra Spawns: ${serverConfig.ctfExtraSpawns}`);
	
		const doRestartServer = updateEnvConfig(serverConfig);
		if (!doRestartServer) return;
	
		if (processes['bots']) {
			processes['bots'].kill("SIGKILL");
			processes['bots'] = null;
		}
		if (processes['server']) {
			processes['server'].kill("SIGKILL");
			processes['server'] = null;
		}
	
		startServer();
	
		await delay(1500);
		getWindow()?.reload();
		await delay(1500);
	
		restartBots();
	});
	
	ipcMain.on('restart-app', () => {
		app.relaunch();
		app.exit();
	});
	
	ipcMain.on('restart-bots', (e, botConfig: BotsConfig) => {
		restartBots(botConfig);
	});
}