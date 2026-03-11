import { defineConfig } from 'vitepress'
import tailwind from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Air-Battle Docs",
  description: "Documentation for the Air-Battle project.",
  base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/favicon.png' }],
    ['link', { rel: 'preload', href: '/assets/montserrat-semibold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    ['link', { rel: 'preload', href: '/assets/montserrat-bold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
  ],
  vite: {
    plugins: [
      // tsconfigPaths(),

      tailwind(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../', import.meta.url))
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Docs Home', link: '/' },
      { text: 'Main Site', link: 'https://air-battle.net' },
    ],
    lastUpdated: {
      text: 'Last Updated',
    },
    externalLinkIcon: true,
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        items: [
          { text: 'Set Up Server', link: '/getting-started' },
          { text: 'Sharing the Server', link: '/external-sharing' },
          { text: 'Management Commands', link: '/server/management' },
          { text: 'In-Game Commands', link: '/server/commands' },
          { text: 'Server Options', link: '/server/options' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/parsehex/airbattle-hosting' }
    ]
  }
})
