import {
	runCommand,
	runCommandOutput,
	symlink,
	copy,
	fileExists,
} from './lib.js';
import path from 'path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const isForce = args.includes('--force') || args.includes('-f');

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

		const envSrvExists = await fileExists(path.join(root, 'ab-server/.env'));
		const envSrvSymExists = await fileExists(path.join(root, '.env.server'));
		if (!envSrvExists) {
			await copy(
				path.join(root, 'ab-server/.env.example'),
				path.join(root, 'ab-server/.env')
			);
		}
		if (!envSrvSymExists) {
			await symlink(
				path.join(root, 'ab-server/.env'),
				path.join(root, '.env.server')
			);
		}

		const envBotsExists = await fileExists(path.join(root, 'ab-bot/.env'));
		const envBotsSymExists = await fileExists(path.join(root, '.env.bots'));
		if (!envBotsExists) {
			await copy(
				path.join(root, '.env.bots.example'),
				path.join(root, 'ab-bot/.env')
			);
		}
		if (!envBotsSymExists) {
			await symlink(
				path.join(root, 'ab-bot/.env'),
				path.join(root, '.env.bots')
			);
		}

		const rebuiltProjects = [];
		const projects = ['ab-frontend', 'ab-server', 'ab-bot'];
		for (const project of projects) {
			const projectPath = path.join(root, project);
			const hasChanges = changedFiles.split('\n').some(file => file === project || file.startsWith(`${project}/`));
			const hasNodeModules = await fileExists(path.join(projectPath, 'node_modules'));
			const hasDist = await fileExists(path.join(projectPath, 'dist'));

			if (isForce || hasChanges || !hasNodeModules || !hasDist) {
				console.log(`\nBuilding ${project}...`);
				await runCommand('npm', ['install'], { cwd: projectPath });
				await runCommand('npm', ['run', 'build'], { cwd: projectPath });
				rebuiltProjects.push(project);
			} else {
				console.log(`\nSkipping ${project} (no changes detected and build outputs exist).`);
			}
		}

		const rootProjects = [
			{ name: 'landing', command: 'landing:build', outPath: 'landing/.vitepress/dist' }
		];
		let rootDependenciesInstalled = false;

		for (const project of rootProjects) {
			const hasChanges = changedFiles.split('\n').some(file => file === project.name || file.startsWith(`${project.name}/`));
			const hasDist = await fileExists(path.join(root, project.outPath));

			if (isForce || hasChanges || !hasDist) {
				if (!rootDependenciesInstalled) {
					const hasRootNodeModules = await fileExists(path.join(root, 'node_modules'));
					if (isForce || !hasRootNodeModules || changedFiles.includes('package.json') || changedFiles.includes('package-lock.json')) {
						console.log('\nInstalling root dependencies...');
						await runCommand('npm', ['install'], { cwd: root });
					}
					rootDependenciesInstalled = true;
				}
				console.log(`\nBuilding ${project.name}...`);
				await runCommand('npm', ['run', project.command], { cwd: root });
				rebuiltProjects.push(project.name);
			} else {
				console.log(`\nSkipping ${project.name} (no changes detected and build outputs exist).`);
			}
		}

		if (rebuiltProjects.includes('ab-server')) {
			console.log('\nRestarting user services (ab-server, ab-bot)...');
			try {
				await runCommand('systemctl', ['--user', 'restart', 'ab-server', 'ab-bot']);
				console.log('Services restarted successfully.');
			} catch (err) {
				console.error('Failed to restart services. Ensure systemd user services are running if you are using them.', err);
			}
		} else if (rebuiltProjects.includes('ab-bot')) {
			console.log('\nRestarting ab-bot service...');
			try {
				await runCommand('systemctl', ['--user', 'restart', 'ab-bot']);
				console.log('Bot service restarted successfully.');
			} catch (err) {
				console.error('Failed to restart ab-bot service.', err);
			}
		}

		if (rebuiltProjects.length > 0) {
			const summaryPath = path.join(root, 'ab-server/update-summary.json');
			fs.writeFileSync(summaryPath, JSON.stringify({ rebuiltProjects }, null, 2));
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
