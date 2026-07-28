import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages: https://kk00701903-hub.github.io/next-jtgs/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '주유소 관리시스템',
        short_name: 'JTGS',
        description: 'JETTE Supply Control · FASS',
        theme_color: '#1A3A6B',
        background_color: '#F1F5F9',
        display: 'standalone',
        start_url: '/next-jtgs/',
        scope: '/next-jtgs/',
        lang: 'ko',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
      },
    }),
  ],
  base: '/next-jtgs/',
})
