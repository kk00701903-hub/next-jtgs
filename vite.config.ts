import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: https://kk00701903-hub.github.io/next-jtgs/
export default defineConfig({
  plugins: [react()],
  base: '/next-jtgs/',
})
