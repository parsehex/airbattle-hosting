import {
	runCommand,
	runCommandOutput,
	symlink,
	copy,
	fileExists,
} from './lib.js';
import path from 'path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
	try {
		const nodeVersion = await runCommandOutput('node', ['--version']);
		if (!nodeVersion.includes('v12')) {
			await runCommand('nvm', ['use', '12']);
		}

		await runCommand('git', ['pull', '--recurse-submodules'], { cwd: root });

		const gamesJsonExists = await fileExists(
			path.join(root, 'ab-frontend/games.json')
		);
		const gamesJsonSymExists = await fileExists(path.join(root, 'games.json'));
		if (!gamesJsonExists) {
			await copy(
				path.join(root, 'ab-frontend/games.json.example'),
				path.join(root, 'ab-frontend/games.json')
			);
		}
		if (!gamesJsonSymExists) {
			await symlink(
				path.join(root, 'ab-frontend/games.json'),
				path.join(root, 'games.json')
			);
		}

		const envExists = await fileExists(path.join(root, 'ab-server/.env'));
		const envSymExists = await fileExists(path.join(root, '.env.server'));
		if (!envExists) {
			await copy(
				path.join(root, 'ab-server/.env.example'),
				path.join(root, 'ab-server/.env')
			);
		}
		if (!envSymExists) {
			await symlink(
				path.join(root, 'ab-server/.env'),
				path.join(root, '.env.server')
			);
		}

		// await runCommand('npm', ['install'], { cwd: path.join(root, 'ab-frontend') });
		// await runCommand('npm', ['run', 'build'], { cwd: path.join(root, 'ab-frontend') });
		// await runCommand('npm', ['install'], { cwd: path.join(root, 'ab-server') });
		// await runCommand('npm', ['run', 'build'], { cwd: path.join(root, 'ab-server') });

		await runCommand('npm', ['install'], { cwd: path.join(root, 'ab-bot') });
		await runCommand('npm', ['run', 'build'], {
			cwd: path.join(root, 'ab-bot'),
		});

		console.log('Setup complete.');
		console.log(
			'You can now start the application by running `npm run start`.'
		);
		process.exit(0);
	} catch (err) {
		console.error('Error starting application:', err);
		process.exit(1);
	}
})();
