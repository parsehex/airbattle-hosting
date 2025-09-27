import { resolve } from 'node:path';

const config: import('electron-vite').UserConfig = {
  main: {
		build: {
			lib: { entry: './electron/main/index.ts' }
		}
  },
  preload: {
		build: {
			lib: { entry: './electron/preload/index.ts' }
		}
  },
  renderer: {
		root: resolve(__dirname, './ab-frontend/dist'),
		build: {
			rollupOptions: { input: resolve(__dirname, './ab-frontend/dist/index.html') }
		}
  }
};

export default config;