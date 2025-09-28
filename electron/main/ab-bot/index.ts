import { BotsConfig } from 'electron/types.js';
import { processes, startProcess } from '../process.js';
import { existsSync } from 'fs';
import { paths } from '../constants.js';

function getArgs(cfg: BotsConfig) {
	const botsArgs = [
		'--ws=ws://127.0.0.1:3501',
		'--type=distribute',
		`--character=${cfg.botCharacter}`,
		'--flag=rainbow',
		`--num=${cfg.botCount}`,
	];
	if (cfg.noIdle) botsArgs.push('--noIdle');
	return botsArgs;
}

let currentBotCount = 10;
let currentBotCharacter = 'Aggressive';
let currentNoIdle = false;

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
}

export function startBots(args?: string[]) {
	if (!args) args = getArgs(getConfig());
	const { botsBin, botsDist } = paths;
	if (existsSync(botsDist)) {
		startProcess('node', 'bots', [botsDist, ...args]);
	} else {
		startProcess(botsBin, 'bots', args);
	}
}

export function restartBots(botsConfig?: BotsConfig) {
	if (!botsConfig) return;
	
	const count = botsConfig ? botsConfig.botCount : currentBotCount;
	const character = botsConfig ? botsConfig.botCharacter : currentBotCharacter;
	const noIdle = botsConfig ? botsConfig.noIdle : currentNoIdle;
	
	currentBotCount = count;
	currentBotCharacter = character;
	currentNoIdle = noIdle;

	console.log(`Restarting bots with count: ${count}, character: ${character}`);

	if (processes['bots']) {
		processes['bots'].kill('SIGKILL');
		processes['bots'] = null;
	}

	startBots(getArgs(botsConfig));
}
