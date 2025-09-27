import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload ran');

const setBotCount = (num: number): void => {
	ipcRenderer.send('set-bot-count', num);
};

contextBridge.exposeInMainWorld('electron', {
	setBotCount,
	ipcRendererOn: ipcRenderer.on.bind(ipcRenderer),
	ipcRendererRemoveListener: ipcRenderer.removeListener.bind(ipcRenderer)
});

// Inject simple UI once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
	const panel = document.createElement('div');
	panel.style.position = 'fixed';
	panel.style.top = '10px';
	panel.style.right = '10px';
	panel.style.zIndex = '99999';
	panel.style.background = 'rgba(0,0,0,0.7)';
	panel.style.color = 'white';
	panel.style.padding = '8px';
	panel.style.borderRadius = '6px';
	panel.style.fontSize = '14px';
	panel.style.display = 'flex';
	panel.style.gap = '6px';
	panel.style.alignItems = 'center';

	const label = document.createElement('span');
	label.textContent = 'Bots:';

	const input = document.createElement('input');
	input.type = 'number';
	input.min = '0';
	input.value = '10';
	input.style.width = '50px';

	const button = document.createElement('button');
	button.textContent = 'Apply';
	button.style.cursor = 'pointer';

	button.onclick = () => {
		const num = parseInt(input.value, 10) || 0;
		setBotCount(num);
	};

	panel.appendChild(label);
	panel.appendChild(input);
	panel.appendChild(button);
	document.body.appendChild(panel);
});
