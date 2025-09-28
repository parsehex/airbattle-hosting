import { ServerConfig } from 'electron/types.js';
import { readFileSync, writeFileSync } from 'fs';
import { paths } from '../constants.js';

export function readEnvConfig(): ServerConfig {
	const envContent = readFileSync(paths.env, 'utf8');
	const lines = envContent.split('\n');

	let gameMode: string = 'FFA';
	let upgradesFever: boolean = false;
	let ctfExtraSpawns: boolean = false;

	for (const line of lines) {
		if (line.startsWith('SERVER_TYPE=')) {
			gameMode = line.split('=')[1].replace(/"/g, '');
		} else if (line.startsWith('UPGRADES_FEVER_SCHEDULE=')) {
			upgradesFever = true;
		} else if (line.startsWith('CTF_EXTRA_SPAWNS=')) {
			ctfExtraSpawns = true;
		}
	}

	return { 
		gameMode,
		upgradesFever,
		ctfExtraSpawns,
	};
}

export function updateEnvConfig(cfg: ServerConfig) {
	let envContent = readFileSync(paths.env, 'utf8');
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
		writeFileSync(paths.env, lines.join('\n'), 'utf8');
		console.log(`Updated .env config: Game mode: ${cfg.gameMode}, Upgrades Fever: ${cfg.upgradesFever}, CTF Extra Spawns: ${cfg.ctfExtraSpawns}`);
	}
	return changed;
}