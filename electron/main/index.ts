import { app, BrowserWindow, ipcMain } from 'electron';
import rememberWindowState, { loadWindowState } from './window-state.js';
import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { processes, startProcess } from './process.js';
import { Config, ServerConfig, BotsConfig } from '../types.js';

let mainWindow: BrowserWindow | null = null;

const serverBinPath = resolve(__dirname, '../../ab-server/app-bin');
const botsBinPath = resolve(__dirname, '../../ab-bot/app-bin');
const serverDistPath = resolve(__dirname, '../../ab-server/dist/app.js');
const botsDistPath = resolve(__dirname, '../../ab-bot/dist/app.js');
const envPath = resolve(__dirname, '../../ab-server/.env');
const preloadPath = resolve(__dirname, '../preload/index.mjs')

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function startServer() {
	if (existsSync(serverBinPath)) {
		console.log('Starting backend', serverBinPath);
    startProcess(serverBinPath, 'server');
  } else {
		console.log('Starting backend', serverDistPath);
    startProcess('node', 'server', [serverDistPath]);
  }
}

function startBots(args: string[]) {
  if (existsSync(botsDistPath)) {
    startProcess('node', 'bots', [botsDistPath, ...args]);
  } else {
    startProcess(botsBinPath, 'bots', args);
  }
}

function updateEnvConfig(cfg: ServerConfig) {
	let envContent = readFileSync(envPath, 'utf8');
	let lines = envContent.split('\n');
	let changed = false;

	// SERVER_TYPE
	let gameModeFound = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('SERVER_TYPE=')) {
			gameModeFound = true;
			const commented = lines[i].startsWith('#');
			if (lines[i].includes(cfg.gameMode) && !commented) continue;
			lines[i] = `SERVER_TYPE="${cfg.gameMode}"`;
			changed = true;
			break;
		}
	}
	if (!gameModeFound) {
		lines.push(`SERVER_TYPE="${cfg.gameMode}"`);
		changed = true;
	}

	// UPGRADES_FEVER_SCHEDULE
	let upgradesFeverFound = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('UPGRADES_FEVER_SCHEDULE=')) {
			if (cfg.upgradesFever) {
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
	if (!upgradesFeverFound && cfg.upgradesFever) {
		lines.push(`UPGRADES_FEVER_SCHEDULE="0 0 0 0 10079"`);
		changed = true;
	}

	// CTF_EXTRA_SPAWNS
	let ctfExtraSpawnsFound = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('CTF_EXTRA_SPAWNS=')) {
			if (cfg.ctfExtraSpawns) {
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
	if (!ctfExtraSpawnsFound && cfg.ctfExtraSpawns) {
		lines.push(`CTF_EXTRA_SPAWNS=true`);
		changed = true;
	}

	if (changed) {
		writeFileSync(envPath, lines.join('\n'), 'utf8');
		console.log(`Updated .env config: Game mode: ${cfg.gameMode}, Upgrades Fever: ${cfg.upgradesFever}, CTF Extra Spawns: ${cfg.ctfExtraSpawns}`);
	}
	return changed;
}

function readEnvConfig(): Config {
	const envContent = readFileSync(envPath, 'utf8');
	const lines = envContent.split('\n');

	let gameMode: string = 'FFA';
	let upgradesFever: boolean = false;
	let ctfExtraSpawns: boolean = false;
	const botCharacter: string = 'Aggressive';

	for (const line of lines) {
		if (line.startsWith('SERVER_TYPE=')) {
			gameMode = line.split('=')[1].replace(/"/g, '');
		} else if (line.startsWith('UPGRADES_FEVER_SCHEDULE=')) {
			upgradesFever = true;
		} else if (line.startsWith('CTF_EXTRA_SPAWNS=')) {
			ctfExtraSpawns = true;
		}
	}

	return { gameMode, botCount: currentBotCount, upgradesFever, ctfExtraSpawns, botCharacter };
}

function restartBots(botsConfig?: BotsConfig) {
  const count = botsConfig ? botsConfig.botCount : currentBotCount;
  const character = botsConfig ? botsConfig.botCharacter : currentBotCharacter;

  if (botsConfig) {
    currentBotCount = count;
    currentBotCharacter = character;
  }

  console.log(`Restarting bots with count: ${count}, character: ${character}`);

  if (processes['bots']) {
    processes['bots'].kill("SIGKILL");
    processes['bots'] = null;
  }

  const botsArgs = [
    "--ws=ws://127.0.0.1:3501",
    "--type=distribute",
    `--character=${character}`,
    "--flag=rainbow",
    `--num=${count}`
  ];

  startBots(botsArgs);
}

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
	mainWindow?.reload();
	await delay(1500);

	restartBots();
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

ipcMain.on('restart-app', () => {
	app.relaunch();
	app.exit();
});

let currentBotCount = 10;
let currentBotCharacter = 'Aggressive';

ipcMain.on('restart-bots', (e, botConfig: BotsConfig) => {
	restartBots(botConfig);
});

app.on('ready', async () => {
	const win = await createMainWindow();
	rememberWindowState(win);

	// Read initial config and set currentBotCount
	const initialConfig = readEnvConfig();
	currentBotCount = initialConfig.botCount; // Ensure currentBotCount is initialized
	currentBotCharacter = initialConfig.botCharacter;

	startServer();

	await delay(1500);

	win?.reload();
	createUIWindow();
	win?.show();

	await delay(5000)

	const botsArgs = [
		"--ws=ws://127.0.0.1:3501",
		"--type=distribute",
		`--character=${currentBotCharacter}`,
		"--flag=rainbow",
		`--num=${currentBotCount}` // Use currentBotCount for initial bot process
	];

	startBots(botsArgs);
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
