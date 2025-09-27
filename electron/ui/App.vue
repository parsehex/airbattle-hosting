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
	<div class="airbattle-panel">
		<div class="airbattle-config-section">
			<span>Game Mode:</span>
			<select class="airbattle-select" v-model="config.gameMode">
				<option v-for="mode in gameModes" :key="mode" :value="mode">{{ mode }}</option>
			</select>

			<span>Bots:</span>
			<input type="number" class="airbattle-input-number" min="0" v-model.number="config.botCount" />

			<div class="airbattle-checkbox-container">
				<input type="checkbox" id="upgradesFeverCheckbox" v-model="config.upgradesFever" />
				<label for="upgradesFeverCheckbox">Upgrades Fever</label>
			</div>

			<div class="airbattle-checkbox-container">
				<input type="checkbox" id="ctfExtraSpawnsCheckbox" v-model="config.ctfExtraSpawns" />
				<label for="ctfExtraSpesCheckbox">Spawns</label>
			</div>

			<button class="airbattle-button" @click="applyConfig">Apply</button>
		</div>
	</div>
</template>

<style>
.airbattle-panel {
	position: fixed;
	top: 10px;
	right: 10px;
	z-index: 99999;
	background: rgba(0,0,0,0.25);
	color: white;
	padding: 12px;
	border-radius: 6px;
	font-size: 14px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	min-width: 150px;
}
.airbattle-config-section {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
.airbattle-select {
	padding: 4px;
	border-radius: 3px;
	border: none;
}
.airbattle-input-number {
	width: 80px;
	padding: 4px;
}
.airbattle-checkbox-container {
	display: flex;
	align-items: center;
	gap: 5px;
}
.airbattle-button {
	cursor: pointer;
	padding: 6px 12px;
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 3px;
	margin-top: 8px;
}
</style>
