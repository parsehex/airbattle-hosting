import { BotsConfig } from 'electron/types.js';
import { processes, startProcess } from '../process.js';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { paths } from '../constants.js';

function getArgs(cfg: BotsConfig) {
	const botsArgs = [
		'--ws=ws://127.0.0.1:3501',
		'--type=random',
		`--character=${cfg.botCharacter}`,
		'--flag=rainbow',
		`--num=${cfg.botCount}`,
	];
	if (cfg.noIdle) botsArgs.push('--noIdle');
	return botsArgs;
}

const configPath = path.join(app.getPath('userData'), 'bots-config.json');

function loadConfig(): BotsConfig {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(data);
      return {
        botCount: parsed.botCount ?? 10,
        botCharacter: parsed.botCharacter ?? 'Aggressive',
        noIdle: parsed.noIdle ?? false,
      };
    }
  } catch (e) {
    console.error('Failed to load bots config:', e);
  }
  return {
    botCount: 10,
    botCharacter: 'Aggressive',
    noIdle: false,
  };
}

function saveConfig(cfg: BotsConfig) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2), 'utf8');
    console.log('Bots config saved');
  } catch (e) {
    console.error('Failed to save bots config:', e);
  }
}

const initialConfig = loadConfig();
let currentBotCount = initialConfig.botCount;
let currentBotCharacter = initialConfig.botCharacter;
let currentNoIdle = initialConfig.noIdle;

export function getConfig(): BotsConfig {
	return {
		botCharacter: currentBotCharacter,
		botCount: currentBotCount,
		noIdle: currentNoIdle,
	};
}
export function setConfig(cfg: BotsConfig) {
	currentBotCharacter = cfg.botCharacter;
	currentBotCount = cfg.botCount;
	currentNoIdle = cfg.noIdle;
  saveConfig(cfg);
}

export function startBots(args?: string[]) {
	if (!args) args = getArgs(getConfig());
	const { botsBin, botsDist } = paths;
	if (fs.existsSync(botsDist)) {
		startProcess('node', 'bots', [botsDist, ...args]);
	} else {
		startProcess(botsBin, 'bots', args);
	}
}

export function restartBots(botsConfig?: BotsConfig) {
	if (!botsConfig) return;

	const count = botsConfig.botCount;
	const character = botsConfig.botCharacter;
	const noIdle = botsConfig.noIdle;

	currentBotCount = count;
	currentBotCharacter = character;
	currentNoIdle = noIdle;
  saveConfig(botsConfig);

	console.log(`Restarting bots with count: ${count}, character: ${character}`);

	if (processes['bots']) {
		processes['bots'].kill('SIGKILL');
		processes['bots'] = null;
	}

	startBots(getArgs(botsConfig));
}
