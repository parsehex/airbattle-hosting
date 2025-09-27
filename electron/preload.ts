import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload ran');

const setBotCount = (num: number): void => {
	ipcRenderer.send('set-bot-count', num);
};

const setGameMode = (gameMode: string): void => {
	ipcRenderer.send('set-game-mode', gameMode);
};

contextBridge.exposeInMainWorld('electron', {
	setBotCount,
	setGameMode,
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

	// Game Mode Section
	const gameModeSection = document.createElement('div');
	gameModeSection.style.display = 'flex';
	gameModeSection.style.flexDirection = 'column';
	gameModeSection.style.gap = '4px';

	const gameModeLabel = document.createElement('span');
	gameModeLabel.textContent = 'Game Mode:';
	gameModeSection.appendChild(gameModeLabel);
	
	const gameModeControls = document.createElement('div');
	gameModeControls.style.display = 'flex';
	gameModeControls.style.gap = '4px';
	gameModeControls.style.alignItems = 'center';
	gameModeSection.appendChild(gameModeControls);

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

	const gameModeButton = document.createElement('button');
	gameModeButton.textContent = 'Switch Mode';
	gameModeButton.style.cursor = 'pointer';
	gameModeButton.style.padding = '4px 8px';
	gameModeButton.style.marginTop = '4px';

	gameModeButton.onclick = () => {
		const selectedMode = gameModeSelect.value;
		setGameMode(selectedMode);
	};

	gameModeControls.appendChild(gameModeSelect);
	gameModeControls.appendChild(gameModeButton);

	// Bot Count Section
	const botSection = document.createElement('div');
	botSection.style.display = 'flex';
	botSection.style.flexDirection = 'column';
	botSection.style.gap = '4px';

	const botLabel = document.createElement('span');
	botLabel.textContent = 'Bots:';
	botSection.appendChild(botLabel);

	const botControls = document.createElement('div');
	botControls.style.display = 'flex';
	botControls.style.gap = '4px';
	botControls.style.alignItems = 'center';

	const botInput = document.createElement('input');
	botInput.type = 'number';
	botInput.min = '0';
	botInput.value = '10';
	botInput.style.width = '60px';
	botInput.style.padding = '4px';

	const botButton = document.createElement('button');
	botButton.textContent = 'Apply';
	botButton.style.cursor = 'pointer';
	botButton.style.padding = '4px 8px';

	botButton.onclick = () => {
		const num = parseInt(botInput.value, 10) || 0;
		setBotCount(num);
	};

	botControls.appendChild(botInput);
	botControls.appendChild(botButton);
	botSection.appendChild(botControls);

	panel.appendChild(gameModeSection);
	panel.appendChild(botSection);
	document.body.appendChild(panel);
});
