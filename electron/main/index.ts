import { app, BrowserWindow } from 'electron';
import rememberWindowState, { loadWindowState } from './window-state.js';
import { resolve } from 'path';
import { processes } from './process.js';
import { paths } from './constants.js';
import { startServer } from './ab-server/index.js';
import { startBots } from './ab-bot/index.js';
import { setWindow } from './window.js';
import { delay } from './utils.js';
import { initIPC } from './ipc.js';

let mainWindow: BrowserWindow | null = null;

const createMainWindow = async () => {
	process.env.IS_ELECTRON = 'true';

	const windowState = loadWindowState({
		width: 1200,
		height: 800,
	});
	const win = new BrowserWindow({
		show: false,
		width: windowState.width,
		minWidth: 600,
		height: windowState.height,
		minHeight: 400,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: paths.preload,
			sandbox: false,
		},
	});
	mainWindow = win;
	setWindow(win);

	win.loadURL('http://localhost:3501');

	return win;
};

let uiWindow: BrowserWindow | null = null;

const createUIWindow = () => {
	uiWindow = new BrowserWindow({
		width: 400,
		height: 600,
		minWidth: 300,
		minHeight: 400,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: paths.preload,
			sandbox: false,
		},
		show: true,
		autoHideMenuBar: true,
	});

	if (mainWindow) {
		const { x, y, width, height } = mainWindow.getBounds();
		const uiY = y + (height - 600) / 2;
		uiWindow.setPosition(x + width, uiY);
	}

	if (process.env.NODE_ENV === 'development') {
		uiWindow.loadURL('http://localhost:5173');
	} else {
		uiWindow.loadFile(resolve(__dirname, '../ui/index.html'));
	}
};

app.on('ready', async () => {
	initIPC();

	const win = await createMainWindow();
	rememberWindowState(win);

	startServer();

	await delay(1500);

	win?.reload();
	createUIWindow();
	win?.show();

	await delay(5000);

	startBots();
});

app.on('before-quit', () => {
	const procNames = Object.keys(processes);
	for (const name of procNames) {
		const process = processes[name];
		process?.kill('SIGKILL');
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
