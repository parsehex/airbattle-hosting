<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { Config, ServerConfig, BotsConfig } from '../types.js';

declare const electron: {
  setServerConfig: (config: ServerConfig) => void;
  getConfig: () => Promise<Config>;
  restartBots: (botConfig: BotsConfig) => void;
};

const config = reactive<Config>({
	gameMode: 'FFA',
	botCount: 10,
	upgradesFever: false,
	ctfExtraSpawns: false,
	botCharacter: 'Aggressive',
	noIdle: false,
});

const gameModes = ['FFA', 'CTF', 'BTR'];

const characters = [
	'Goli',
	'Mohawk',
	'Tornado',
	'Prowler',
	'Default',
	'Aggressive',
	'Shy',
	'Protective'
];

onMounted(async () => {
	const currentConfig = await electron.getConfig();
	Object.assign(config, currentConfig);
});

const applyServerConfig = () => {
  const serverConfig: ServerConfig = {
    gameMode: config.gameMode,
    upgradesFever: config.upgradesFever,
    ctfExtraSpawns: config.ctfExtraSpawns
  };
  electron.setServerConfig(serverConfig);
};

const restartBotsFunc = () => {
  electron.restartBots({ botCount: config.botCount, botCharacter: config.botCharacter, noIdle: config.noIdle });
};
</script>

<template>
  <div class="h-screen w-screen bg-black/25 text-white p-3 text-sm flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <span class="font-bold text-base">Server Settings</span>
      <span>Game Mode:</span>
      <select class="w-full p-1 rounded border-0" v-model="config.gameMode">
        <option v-for="mode in gameModes" :key="mode" :value="mode">{{ mode }}</option>
      </select>
      <div class="flex items-center gap-1">
        <input type="checkbox" id="upgradesFeverCheckbox" v-model="config.upgradesFever" />
        <label for="upgradesFeverCheckbox">Upgrades Fever</label>
      </div>
      <div class="flex items-center gap-1">
        <input type="checkbox" id="ctfExtraSpawnsCheckbox" v-model="config.ctfExtraSpawns" />
        <label for="ctfExtraSpawnsCheckbox">CTF Extra Spawns</label>
      </div>
      <button class="w-full cursor-pointer px-3 py-1.5 bg-blue-500 text-white border-0 rounded mt-2" @click="applyServerConfig">Save and Restart Server</button>
      <span class="font-bold text-base">Bots Settings</span>
      <span>Bot Count:</span>
      <input type="number" class="w-full p-1" min="0" v-model.number="config.botCount" />
      <span>Bot Character:</span>
      <select class="w-full p-1 rounded border-0" v-model="config.botCharacter">
        <option v-for="char in characters" :key="char" :value="char">{{ char }}</option>
      </select>
      <div class="flex items-center gap-1">
        <input type="checkbox" id="noIdleCheckbox" v-model="config.noIdle" />
        <label for="noIdleCheckbox">No Idle</label>
      </div>
      <button class="w-full cursor-pointer px-3 py-1.5 bg-green-500 text-white border-0 rounded mt-1" @click="restartBotsFunc">Save and Restart Bots</button>
    </div>
  </div>
</template>
