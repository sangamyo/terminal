import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// three.js / R3F are only reached through the lazy `import('./three/Scene')`,
// so they land in their own chunk and never block the terminal's first paint.
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from /<repo>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH || '/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1400,
  },
})
