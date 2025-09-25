import { app, BrowserWindow, ipcMain } from 'electron';
import rememberWindowState, { loadWindowState } from './window-state.js';
import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
import { processes, startProcess } from './process.js';
import { src as preloadSrc } from './preload.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let mainWindow = null;

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Writes a preload script that exposes an electron API
async function writePreloadScript(content) {
	await fs.writeFile(path.resolve(__dirname, '../../../preload.js'), content);
}

const createMainWindow = async () => {
	await writePreloadScript(preloadSrc);

	// Flag that we’re running in Electron.
	process.env.IS_ELECTRON = 'true';

	const windowState = loadWindowState({
		width: 1200,
		height: 800,
	});
	mainWindow = new BrowserWindow({
		show: false,
		width: windowState.width,
		minWidth: 600,
		height: windowState.height,
		minHeight: 400,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.resolve(__dirname, '../../../preload.js'),
		},
	});

	mainWindow.loadURL('http://localhost:3501')

	return mainWindow;
};

ipcMain.on('restart-app', () => {
	app.relaunch();
	app.exit();
});

let currentBotCount = 10; // default

ipcMain.on('set-bot-count', async (event, num) => {
  console.log(`Updating bots: ${num}`);
  currentBotCount = num;

  // Kill existing bots if running
  if (processes['bots']) {
    processes['bots'].kill("SIGKILL");
    delete processes['bots'];
		await delay(1500);
  }

  // Restart with new bot count
  const botsPath = path.resolve(__dirname, "../ab-bot/app-bin");
  const botsArgs = [
    "--ws=ws://127.0.0.1:3501",
    "--type=distribute",
    "--character=Aggressive",
    "--flag=rainbow",
    `--num=${currentBotCount}`
  ];

  startProcess(botsPath, 'bots', botsArgs);
});

app.on('ready', async () => {
	const binPath = path.resolve(__dirname, '../ab-server/app-bin');
	console.log('Starting backend', binPath);
	const win = await createMainWindow();
	rememberWindowState(win);

	startProcess(binPath, 'server');

	await delay(5000)

	const botsPath = path.resolve(__dirname, "../ab-bot/app-bin");
	const botsArgs = [
		"--ws=ws://127.0.0.1:3501",
		"--type=distribute",
		"--character=Aggressive",
		"--flag=rainbow",
		"--num=10"
	];
	
	startProcess(botsPath, 'bots', botsArgs);

	win?.reload();
	win?.show();
});

app.on("before-quit", () => {
	const procNames = Object.keys(processes);
	for (const name of procNames) {
		const process = processes[name];
		process?.kill("SIGKILL");
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
