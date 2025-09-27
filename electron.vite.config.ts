import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const tailwindPath = resolve(__dirname, './tailwind.config.js');

const config: import('electron-vite').UserConfig = {
  main: {
		build: {
			lib: { entry: resolve(__dirname, './electron/main/index.ts') }
		}
  },
  preload: {
		build: {
			lib: { entry: resolve(__dirname, './electron/preload/index.ts') },
		}
	},
  renderer: {
		root: resolve(__dirname, './electron/ui'),
		// @ts-ignore
		plugins: [vue(), tailwind(tailwindPath), autoprefixer()],
		build: {
			outDir: resolve(__dirname, 'out/ui'),
			rollupOptions: {
				input: resolve(__dirname, './electron/ui/index.html')
			}
		},
		resolve: { 
			preserveSymlinks: true
		}
  },
};

export default config;
