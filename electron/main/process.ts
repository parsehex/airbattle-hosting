import { execFile, ChildProcess } from "child_process";
import { app } from "electron";
import { basename, dirname } from "path";

export const processes: Record<string, ChildProcess | null> = {};

export function startProcess(binPath: string, name?: string, args: string[] = []): ChildProcess {
	if (!name) name = basename(binPath);
	const proc = execFile(binPath, args, {
		cwd: dirname(binPath),
		windowsHide: true,
		killSignal: 'SIGKILL',
	});
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
