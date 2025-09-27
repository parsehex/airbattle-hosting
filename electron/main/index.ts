import { app, BrowserWindow, ipcMain } from 'electron';
import rememberWindowState, { loadWindowState } from './window-state.js';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { processes, startProcess } from './process.js';
import { Config } from '../types.js';

let mainWindow: BrowserWindow | null = null;

const backendPath = resolve(__dirname, '../../ab-server/app-bin');
const botsPath = resolve(__dirname, "../../ab-bot/app-bin");
const envPath = resolve(__dirname, '../../ab-server/.env');
const preloadPath = resolve(__dirname, '../preload/index.mjs')

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateEnvConfig(config: Config) {
	let envContent = readFileSync(envPath, 'utf8');
	let lines = envContent.split('\n');
	let changed = false;

	// SERVER_TYPE
	let gameModeFound = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('SERVER_TYPE=')) {
			gameModeFound = true;
			const commented = lines[i].startsWith('#');
			if (lines[i].includes(config.gameMode) && !commented) continue;
			lines[i] = `SERVER_TYPE="${config.gameMode}"`;
			changed = true;
			break;
		}
	}
	if (!gameModeFound) {
		lines.push(`SERVER_TYPE="${config.gameMode}"`);
		changed = true;
	}

	// UPGRADES_FEVER_SCHEDULE
	// TODO doesn't have effect
	let upgradesFeverFound = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('UPGRADES_FEVER_SCHEDULE=')) {
			if (config.upgradesFever) {
				const commented = lines[i].startsWith('#');
				if (lines[i].includes('0 0 0 0 10079') && !commented) continue;
				lines[i] = `UPGRADES_FEVER_SCHEDULE="0 0 0 0 10079"`;
				changed = true;
			} else {
				lines.splice(i, 1); // Remove the line
				changed = true;
			}
			upgradesFeverFound = true;
			break;
		}
	}
	if (!upgradesFeverFound && config.upgradesFever) {
		lines.push(`UPGRADES_FEVER_SCHEDULE="0 0 0 0 10079"`);
		changed = true;
	}

	// CTF_EXTRA_SPAWNS
	let ctfExtraSpawnsFound = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('CTF_EXTRA_SPAWNS=')) {
			if (config.ctfExtraSpawns) {
				const commented = lines[i].startsWith('#');
				if (lines[i].includes('true') && !commented) continue;
				lines[i] = `CTF_EXTRA_SPAWNS=true`;
				changed = true;
			} else {
				lines.splice(i, 1); // Remove the line
				changed = true;
			}
			ctfExtraSpawnsFound = true;
			break;
		}
	}
	if (!ctfExtraSpawnsFound && config.ctfExtraSpawns) {
		lines.push(`CTF_EXTRA_SPAWNS=true`);
		changed = true;
	}

	if (changed) {
		writeFileSync(envPath, lines.join('\n'), 'utf8');
		console.log(`Updated .env config: Game mode: ${config.gameMode}, Upgrades Fever: ${config.upgradesFever}, CTF Extra Spawns: ${config.ctfExtraSpawns}`);
	}
	return changed;
}

function readEnvConfig(): Config {
	const envContent = readFileSync(envPath, 'utf8');
	const lines = envContent.split('\n');

	let gameMode: string = 'FFA'; // Default
	let upgradesFever: boolean = false; // Default
	let ctfExtraSpawns: boolean = false; // Default

	for (const line of lines) {
		if (line.startsWith('SERVER_TYPE=')) {
			gameMode = line.split('=')[1].replace(/"/g, '');
		} else if (line.startsWith('UPGRADES_FEVER_SCHEDULE=')) {
			upgradesFever = true;
		} else if (line.startsWith('CTF_EXTRA_SPAWNS=')) {
			ctfExtraSpawns = true;
		}
	}

	return { gameMode, botCount: currentBotCount, upgradesFever, ctfExtraSpawns };
}

ipcMain.handle('get-config', async () => {
	 return readEnvConfig();
});

const createMainWindow = async () => {
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
			preload: preloadPath,
			sandbox: false
		},
	});

	mainWindow.loadURL('http://localhost:3501');

	return mainWindow;
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
			preload: preloadPath,
			sandbox: false
		},
		show: true,
		autoHideMenuBar: true,
	});

	if (process.env.NODE_ENV === 'development') {
		uiWindow.loadURL('http://localhost:5173');
	} else {
		uiWindow.loadFile(resolve(__dirname, '../ui/index.html'));
	}
};

ipcMain.on('restart-app', () => {
	app.relaunch();
	app.exit();
});

let currentBotCount = 10;

ipcMain.on('set-config', async (event, config: Config) => {
	 console.log(`Setting config - Game mode: ${config.gameMode}, Bot count: ${config.botCount}, Upgrades Fever: ${config.upgradesFever}, CTF Extra Spawns: ${config.ctfExtraSpawns}`);

	 const { gameMode, botCount, upgradesFever, ctfExtraSpawns } = config;
	const changedBots = currentBotCount !== botCount;
	 currentBotCount = botCount;

	 const doRestartServer = updateEnvConfig(config);

  if (processes['bots'] && (doRestartServer || changedBots)) {
    processes['bots'].kill("SIGKILL");
    processes['bots'] = null;
  }

  if (doRestartServer) {
		if (processes['server']) {
			processes['server'].kill("SIGKILL");
			processes['server'] = null;
		}

		startProcess(backendPath, 'server');

		await delay(1500);
		mainWindow?.reload();
		await delay(1500);
  }

	if (!changedBots) return;

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

	// Read initial config and set currentBotCount
	const initialConfig = readEnvConfig();
	currentBotCount = initialConfig.botCount; // Ensure currentBotCount is initialized

	startProcess(backendPath, 'server');

	await delay(1500);

	win?.reload();
	win?.show();
	createUIWindow();

	await delay(5000)

	const botsArgs = [
		"--ws=ws://127.0.0.1:3501",
		"--type=distribute",
		"--character=Aggressive",
		"--flag=rainbow",
		`--num=${currentBotCount}` // Use currentBotCount for initial bot process
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
