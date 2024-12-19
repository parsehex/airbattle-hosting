import { defineConfig } from 'vitepress'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import postcss from 'postcss'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

const tailwindPath = path.resolve(__dirname, '../../tailwind.config.js')
console.log('tailwindPath', tailwindPath);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Airbattle Hosting",
  description: "",
  base: process.env.NODE_ENV === 'production' ? '/airbattle-hosting/' : '/',
  vite: {
    css: {
      postcss: {
        plugins: [
          // postcss(),
          // tsconfigPaths(),

          tailwind(tailwindPath),
          // postcss(),
          autoprefixer(),
          // postcss(),
        ]
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../', import.meta.url))
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
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
