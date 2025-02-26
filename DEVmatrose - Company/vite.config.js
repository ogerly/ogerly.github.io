import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/DEVmatrose-website2/', // GitHub Pages Repository-Name
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // Stellen Sie sicher, dass die Schriftarten und Cursor richtig kopiert werden
    assetsInlineLimit: 0
  }
})
