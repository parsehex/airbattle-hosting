import { Config } from './types';

declare global {
  interface Window {
    electron: {
      setConfig: (config: Config) => void;
      getConfig: () => Promise<Config>;
      ipcRendererOn: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
      ipcRendererRemoveListener: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
    };
  }
}
