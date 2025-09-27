<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { Config } from '../types.js';

declare const electron: {
	setConfig: (config: Config) => void;
	getConfig: () => Promise<Config>;
};

const config = reactive<Config>({
	gameMode: 'FFA',
	botCount: 10,
	upgradesFever: false,
	ctfExtraSpawns: false,
});

const gameModes = ['FFA', 'CTF', 'BTR'];

onMounted(async () => {
	const currentConfig = await electron.getConfig();
	Object.assign(config, currentConfig);
});

const applyConfig = () => {
	electron.setConfig(JSON.parse(JSON.stringify(config)));
};
</script>

<template>
	<div class="h-screen w-screen bg-black/25 text-white p-3 text-sm flex flex-col gap-2">
		<div class="flex flex-col gap-2">
			<span>Game Mode:</span>
			<select class="w-full p-1 rounded border-0" v-model="config.gameMode">
				<option v-for="mode in gameModes" :key="mode" :value="mode">{{ mode }}</option>
			</select>

			<span>Bots:</span>
			<input type="number" class="w-full p-1" min="0" v-model.number="config.botCount" />

			<div class="flex items-center gap-1">
				<input type="checkbox" id="upgradesFeverCheckbox" v-model="config.upgradesFever" />
				<label for="upgradesFeverCheckbox">Upgrades Fever</label>
			</div>

			<div class="flex items-center gap-1">
				<input type="checkbox" id="ctfExtraSpawnsCheckbox" v-model="config.ctfExtraSpawns" />
				<label for="ctfExtraSpawnsCheckbox">CTF Extra Spawns</label>
			</div>

			<button class="w-full cursor-pointer px-3 py-1.5 bg-blue-500 text-white border-0 rounded mt-2" @click="applyConfig">Apply</button>
		</div>
	</div>
</template>
