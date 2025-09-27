import { execFile, ChildProcess } from "child_process";
import { app } from "electron";
import { basename, dirname, resolve } from "path";

export const processes: Record<string, ChildProcess | null> = {};

export function startProcess(binPath: string, name?: string, args: string[] = [], cwd = ''): ChildProcess {
	if (!name) name = basename(binPath);

	let proc: ChildProcess;
	if (binPath === 'node' && args.length > 0) {
		const scriptPath = args[0];
		const scriptArgs = args.slice(1);
		cwd = dirname(scriptPath);
		if (scriptPath.includes('dist')) {
			cwd = resolve(cwd, '..');
		}
		proc = execFile('node', [scriptPath, ...scriptArgs], {
			cwd,
			windowsHide: true,
			killSignal: 'SIGKILL',
		});
	} else {
		cwd = dirname(binPath);
		if (binPath.includes('dist')) {
			cwd = resolve(cwd, '..');
		}
		proc = execFile(binPath, args, {
			cwd,
			windowsHide: true,
			killSignal: 'SIGKILL',
		});
	}
	processes[name] = proc;

	proc.stdout?.on("data", (data) => {
		process.stdout.write(`[${name}] ${data}`);
	});

	proc.stderr?.on("data", (data) => {
		process.stderr.write(`[${name}] ${data}`);
	});

	proc.on("exit", (code, signal) => {
		console.log(`${name} exited with code ${code}, signal ${signal}`);
		if (signal !== 'SIGKILL' && (name === 'server' || name === 'backend')) app.quit();
	});

	proc.stdin?.end();

	return proc;
}
