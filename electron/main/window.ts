import { BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

export function getWindow() {
	return mainWindow;
}
export function setWindow(win: BrowserWindow) {
	mainWindow = win;
}