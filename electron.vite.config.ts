import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import tailwindcss from "@tailwindcss/vite";

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
		plugins: [vue(), tailwindcss()],
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
