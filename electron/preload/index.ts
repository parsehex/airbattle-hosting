import { contextBridge, ipcRenderer } from 'electron';
import { Config, ServerConfig, BotsConfig } from '../types.js';

console.log('Preload ran');

const setServerConfig = (config: ServerConfig): void => {
  ipcRenderer.send('set-server-config', config);
};

const restartBots = (botConfig: BotsConfig): void => {
  ipcRenderer.send('restart-bots', botConfig);
};

const getConfig = (): Promise<Config> => {
  return ipcRenderer.invoke('get-config');
};

contextBridge.exposeInMainWorld('electron', {
  setServerConfig,
  restartBots,
	getConfig,
	ipcRendererOn: ipcRenderer.on.bind(ipcRenderer),
	ipcRendererRemoveListener: ipcRenderer.removeListener.bind(ipcRenderer)
});

window.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('.playoptions')) {
		(document.querySelector('.playoptions') as HTMLDivElement).style.display = 'none';
	}
});
