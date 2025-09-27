import { contextBridge, ipcRenderer } from 'electron';
import { Config } from './types.js';

console.log('Preload ran');

const setConfig = (config: Config): void => {
	ipcRenderer.send('set-config', config);
};

const getConfig = (): Promise<Config> => {
  return ipcRenderer.invoke('get-config');
};

contextBridge.exposeInMainWorld('electron', {
	setConfig,
	getConfig,
	ipcRendererOn: ipcRenderer.on.bind(ipcRenderer),
	ipcRendererRemoveListener: ipcRenderer.removeListener.bind(ipcRenderer)
});

// Inject simple UI once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('.playoptions'))
		(document.querySelector('.playoptions') as HTMLDivElement).style.display = 'none';

	const panel = document.createElement('div');
	panel.style.position = 'fixed';
	panel.style.top = '10px';
	panel.style.right = '10px';
	panel.style.zIndex = '99999';
	panel.style.background = 'rgba(0,0,0,0.25)';
	panel.style.color = 'white';
	panel.style.padding = '12px';
	panel.style.borderRadius = '6px';
	panel.style.fontSize = '14px';
	panel.style.display = 'flex';
	panel.style.flexDirection = 'column';
	panel.style.gap = '8px';
	panel.style.minWidth = '150px';

	// Configuration Section
	const configSection = document.createElement('div');
	configSection.style.display = 'flex';
	configSection.style.flexDirection = 'column';
	configSection.style.gap = '8px';

	// Game Mode Controls
	const gameModeLabel = document.createElement('span');
	gameModeLabel.textContent = 'Game Mode:';
	configSection.appendChild(gameModeLabel);

	const gameModeSelect = document.createElement('select');
	gameModeSelect.style.padding = '4px';
	gameModeSelect.style.borderRadius = '3px';
	gameModeSelect.style.border = 'none';

	const gameModes = ['FFA', 'CTF', 'BTR'];
	gameModes.forEach(mode => {
		const option = document.createElement('option');
		option.value = mode;
		option.textContent = mode;
		if (mode === 'FFA') option.selected = true; // Default to current mode
		gameModeSelect.appendChild(option);
	});

	configSection.appendChild(gameModeSelect);

	// Bot Count Controls
	const botLabel = document.createElement('span');
	botLabel.textContent = 'Bots:';
	configSection.appendChild(botLabel);

	const botInput = document.createElement('input');
	botInput.type = 'number';
	botInput.min = '0';
	botInput.value = '10';
	botInput.style.width = '80px';
	botInput.style.padding = '4px';
	configSection.appendChild(botInput);

	// Upgrades Fever Checkbox
	const upgradesFeverContainer = document.createElement('div');
	upgradesFeverContainer.style.display = 'flex';
	upgradesFeverContainer.style.alignItems = 'center';
	upgradesFeverContainer.style.gap = '5px';

	const upgradesFeverCheckbox = document.createElement('input');
	upgradesFeverCheckbox.type = 'checkbox';
	upgradesFeverCheckbox.id = 'upgradesFeverCheckbox';
	upgradesFeverContainer.appendChild(upgradesFeverCheckbox);

	const upgradesFeverLabel = document.createElement('label');
	upgradesFeverLabel.htmlFor = 'upgradesFeverCheckbox';
	upgradesFeverLabel.textContent = 'Upgrades Fever';
	upgradesFeverContainer.appendChild(upgradesFeverLabel);
	configSection.appendChild(upgradesFeverContainer);

	// CTF Extra Spawns Checkbox
	const ctfExtraSpawnsContainer = document.createElement('div');
	ctfExtraSpawnsContainer.style.display = 'flex';
	ctfExtraSpawnsContainer.style.alignItems = 'center';
	ctfExtraSpawnsContainer.style.gap = '5px';

	const ctfExtraSpawnsCheckbox = document.createElement('input');
	ctfExtraSpawnsCheckbox.type = 'checkbox';
	ctfExtraSpawnsCheckbox.id = 'ctfExtraSpawnsCheckbox';
	ctfExtraSpawnsContainer.appendChild(ctfExtraSpawnsCheckbox);

	const ctfExtraSpawnsLabel = document.createElement('label');
	ctfExtraSpawnsLabel.htmlFor = 'ctfExtraSpawnsCheckbox';
	ctfExtraSpawnsLabel.textContent = 'Spawns';
	ctfExtraSpawnsContainer.appendChild(ctfExtraSpawnsLabel);
	configSection.appendChild(ctfExtraSpawnsContainer);

	// Apply Button
	const applyButton = document.createElement('button');
	applyButton.textContent = 'Apply';
	applyButton.style.cursor = 'pointer';
	applyButton.style.padding = '6px 12px';
	applyButton.style.backgroundColor = '#007bff';
	applyButton.style.color = 'white';
	applyButton.style.border = 'none';
	applyButton.style.borderRadius = '3px';
	applyButton.style.marginTop = '8px';

	applyButton.onclick = () => {
		const gameMode = gameModeSelect.value;
		const botCount = parseInt(botInput.value, 10) || 0;
		const upgradesFever = upgradesFeverCheckbox.checked;
		const ctfExtraSpawns = ctfExtraSpawnsCheckbox.checked;
		setConfig({ gameMode, botCount, upgradesFever, ctfExtraSpawns });
	};

	configSection.appendChild(applyButton);

	panel.appendChild(configSection);
	document.body.appendChild(panel);

	// Initialize UI with current config
	getConfig().then((config: Config) => {
		gameModeSelect.value = config.gameMode;
		botInput.value = config.botCount.toString();
		upgradesFeverCheckbox.checked = config.upgradesFever;
		ctfExtraSpawnsCheckbox.checked = config.ctfExtraSpawns;
	});
});
