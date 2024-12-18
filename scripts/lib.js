import { spawn } from 'child_process';
import fs from 'fs';

// function to symlink
export async function symlink(target, link) {
	return new Promise((resolve, reject) => {
		fs.symlink(target, link, 'junction', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function fileExists(file) {
	return new Promise((resolve) => {
		fs.access(file, fs.constants.F_OK, (err) => {
			resolve(!err);
		});
	});
}

export async function copy(source, dest) {
	return new Promise((resolve, reject) => {
		fs.copyFile(source, dest, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function runCommand(command, args, options = {}) {
  console.log(`Running: ${command} ${args.join(' ')}`);
	// const isWindows = process.platform === 'win32';
	// if (isWindows && command === 'npm') {
  //   command = process.env.COMSPEC || 'cmd.exe';
  //   args = ['/c', 'npm'].concat(args);
  // }

  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
			killSignal: 'SIGKILL',
			windowsHide: true,
			windowsVerbatimArguments: true,
      ...options
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully completed: ${command}`);
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command}`));
      }
    });

    proc.on('error', (err) => {
      console.error(`Error running ${command}:`, err);
      reject(err);
    });
  });
}

// function to run and get the output of a command
export async function runCommandOutput(command, args, options = {}) {
	// console.log(`Running: ${command} ${args.join(' ')}`);
	return new Promise((resolve, reject) => {
		const proc = spawn(command, args, {
			stdio: 'pipe',
			shell: true,
			...options
		});
		let output = '';
		proc.stdout.on('data', (data) => {
			output += data;
		});
		proc.on('close', (code) => {
			if (code === 0) {
				// console.log(`Successfully completed: ${command}`);
				resolve(output);
			} else {
				reject(new Error(`Command failed with exit code ${code}: ${command}`));
			}
		});
		proc.on('error', (err) => {
			console.error(`Error running ${command}:`, err);
			reject(err);
		});
	});
}

// function to rewrite a line in a file
export async function rewriteFile(file, lineMatch, newLine) {
	const data = fs.readFileSync(file, 'utf8').split('\n');
	const index = data.findIndex((line) => line.match(lineMatch));
	if (index === -1) {
		console.error(`Could not find line matching: ${lineMatch}`);
		return;
	}
	data[index] = newLine;
	fs.writeFileSync(file, data.join('\n'));
}

export async function runConcurrent(commands, maxConcurrent = 3) {
  const running = new Set();
  const results = [];

  for (const cmd of commands) {
    if (running.size >= maxConcurrent) {
      await Promise.race(running);
    }

    const promise = (async () => {
      try {
        const result = await cmd();
        running.delete(promise);
        return result;
      } catch (err) {
        running.delete(promise);
        throw err;
      }
    })();

    running.add(promise);
    results.push(promise);
  }

  return Promise.all(results);
}

// function to rewrite json by taking a file and a function that takes the json object and returns the new json object
export async function rewriteJson(file, rewrite) {
	const data = fs.readFileSync(file, 'utf8');
	const json = JSON.parse(data);
	const newJson = rewrite(json);
	fs.writeFileSync(file, JSON.stringify(newJson, null, 2));
}

export function isCommandAvailable(command) {
	return new Promise((resolve) => {
		const proc = spawn('command', ['-v', command]);
		proc.on('close', (code) => {
			resolve(code === 0);
		});
	});
}
