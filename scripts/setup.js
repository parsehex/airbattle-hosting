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
		if (!nodeVersion.includes('v22')) {
			await runCommand('nvm', ['use', '22']);
		}

		const oldHash = (await runCommandOutput('git', ['rev-parse', 'HEAD'], { cwd: root })).trim();

		await runCommand('git', ['pull', '--recurse-submodules'], { cwd: root });

		const newHash = (await runCommandOutput('git', ['rev-parse', 'HEAD'], { cwd: root })).trim();
		const changedFiles = oldHash !== newHash 
			? await runCommandOutput('git', ['diff', '--name-only', oldHash, newHash], { cwd: root }) 
			: '';

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

		const projects = ['ab-frontend', 'ab-server', 'ab-bot'];
		for (const project of projects) {
			const projectPath = path.join(root, project);
			const hasChanges = changedFiles.split('\n').some(file => file === project || file.startsWith(`${project}/`));
			const hasNodeModules = await fileExists(path.join(projectPath, 'node_modules'));
			const hasDist = await fileExists(path.join(projectPath, 'dist'));

			if (hasChanges || !hasNodeModules || !hasDist) {
				console.log(`\nBuilding ${project}...`);
				await runCommand('npm', ['install'], { cwd: projectPath });
				await runCommand('npm', ['run', 'build'], { cwd: projectPath });
			} else {
				console.log(`\nSkipping ${project} (no changes detected and build outputs exist).`);
			}
		}

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
