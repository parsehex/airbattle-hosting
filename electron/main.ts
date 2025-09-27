import { app, BrowserWindow, ipcMain } from 'electron';
import rememberWindowState, { loadWindowState } from './window-state.js';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { processes, startProcess } from './process.js';

let mainWindow: BrowserWindow | null = null;

const backendPath = resolve(__dirname, '../../ab-server/app-bin');
const botsPath = resolve(__dirname, "../../ab-bot/app-bin");

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateGameMode(gameMode: string): void {
	const envPath = resolve(__dirname, '../../ab-server/.env');
	const envContent = readFileSync(envPath, 'utf8');
	const lines = envContent.split('\n');

	// Find the line with SERVER_TYPE
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('SERVER_TYPE=')) {
			console.log(i);
			lines[i] = `SERVER_TYPE="${gameMode}"`;
			break;
		}
	}

	writeFileSync(envPath, lines.join('\n'), 'utf8');
	console.log(`Set game mode to: ${gameMode}`);
}

const createMainWindow = async () => {
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
			preload: resolve(__dirname, '../preload/preload.mjs'),
			sandbox: false
		},
	});

	mainWindow.loadURL('http://localhost:3501');

	return mainWindow;
};

ipcMain.on('restart-app', () => {
	app.relaunch();
	app.exit();
});

let currentBotCount = 10; // default

ipcMain.on('set-bot-count', async (event, num: number) => {
  console.log(`Updating bots: ${num}`);
  currentBotCount = num;

  // Kill existing bots if running
  if (processes['bots']) {
    processes['bots'].kill("SIGKILL");
    delete processes['bots'];
		await delay(1500);
  }

  // Restart with new bot count
  const botsArgs = [
    "--ws=ws://127.0.0.1:3501",
    "--type=distribute",
    "--character=Aggressive",
    "--flag=rainbow",
    `--num=${currentBotCount}`
  ];

  startProcess(botsPath, 'bots', botsArgs);
});

ipcMain.on('set-game-mode', async (event, gameMode: string) => {
  console.log(`Switching game mode to: ${gameMode}`);

  updateGameMode(gameMode);

  if (processes['bots']) {
    processes['bots'].kill("SIGKILL");
    processes['bots'] = null;
  }
  if (processes['server']) {
    processes['server'].kill("SIGKILL");
    processes['server'] = null;
  }

  startProcess(backendPath, 'server');

  await delay(1500);
	mainWindow?.reload();
  await delay(1500);

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
	console.log('Starting backend', backendPath);
	const win = await createMainWindow();
	rememberWindowState(win);

	startProcess(backendPath, 'server');

	await delay(1500);

	win?.reload();
	win?.show();

	await delay(5000)

	const botsArgs = [
		"--ws=ws://127.0.0.1:3501",
		"--type=distribute",
		"--character=Aggressive",
		"--flag=rainbow",
		"--num=10"
	];

	startProcess(botsPath, 'bots', botsArgs);
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
