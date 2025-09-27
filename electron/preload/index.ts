import { contextBridge, ipcRenderer } from 'electron';
import { Config } from '../types.js';

console.log('Preload ran');

const setConfig = (config: Config): void => {
	ipcRenderer.send('set-config', config);
};

const getConfig = (): Promise<Config> => {
  return ipcRenderer.invoke('get-config');
};

contextBridge.exposeInMainWorld('electron', {
	setConfig,
	getConfig,
	ipcRendererOn: ipcRenderer.on.bind(ipcRenderer),
	ipcRendererRemoveListener: ipcRenderer.removeListener.bind(ipcRenderer)
});

window.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('.playoptions')) {
		(document.querySelector('.playoptions') as HTMLDivElement).style.display = 'none';
	}
});
