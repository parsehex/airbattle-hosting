import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Air-Battle',
  description: 'A community-driven fork of AIRMASH — multiplayer aerial combat in your browser.',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/favicon.png' }],
  ],
  themeConfig: {
    // No nav, sidebar, or search — this is a standalone landing page
  },
})
