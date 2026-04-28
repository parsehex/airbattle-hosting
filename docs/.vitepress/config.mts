import { defineConfig } from 'vitepress'
import tailwind from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Air-Battle Docs",
  description: "Documentation for the Air-Battle project.",
  base: '/docs/',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/docs/assets/favicon.png' }],
    ['link', { rel: 'preload', href: '/docs/assets/montserrat-semibold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    ['link', { rel: 'preload', href: '/docs/assets/montserrat-bold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
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
  appearance: 'force-dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Docs Home', link: '/docs/' },
      { text: 'Main Site', link: '/' },
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
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/getting-started' },
          { text: 'About Air-Battle', link: '/about' },
          { text: 'Where to Play', link: '/where-to-play' },
          { text: 'Setting Up', link: '/setup' },
          { text: 'Hosting a Public Server', link: '/hosting' },
          { text: 'License Info', link: '/license' },
          { text: 'What\'s Different', link: '/differences' },
        ]
      },
      {
        text: 'The Game',
        items: [
          { text: 'Aircraft', link: '/game/aircraft' },
          { text: 'Game Modes', link: '/game/modes' },
          { text: 'Controls', link: '/game/controls' },
          { text: 'Upgrades & Items', link: '/game/upgrades' },
        ]
      },
      {
        text: 'Server Reference',
        items: [
          { text: 'Configuration Options', link: '/server/options' },
          { text: 'In-Game Commands', link: '/server/commands' },
          { text: 'Management', link: '/server/management' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/parsehex/airbattle-hosting' }
    ]
  }
})
