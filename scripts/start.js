import { runCommand, runCommandOutput, runConcurrent } from './lib.js';
import path from 'path';
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
	try {
		const nodeVersion = await runCommandOutput('node', ['--version']);
		if (!nodeVersion.includes('v12')) {
			await runCommand('nvm', ['use', '12']);
		}

		await runConcurrent([
			() => runCommand('npm', ['run', 'start'], { cwd: path.join(root, 'ab-server') }),
			// () => runCommand('npm', ['run', 'start', '--', '--ws=ws://127.0.0.1:3501', '--num=12'], { cwd: path.join(root, 'ab-bot') }),
		]);
	} catch (err) {
		console.error('Error starting application:', err);
		process.exit(1);
	}
})();
