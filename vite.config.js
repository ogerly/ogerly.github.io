import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // Bei User Page (ogerly.github.io): base: '/'
  // Bei Project Page (ogerly.github.io/DEVmatrose-website): base: '/DEVmatrose-website/'
  base: '',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  build: {
    outDir: 'dist', // Output direkt im dist-Verzeichnis
    emptyOutDir: true,
    
    // Stellt sicher, dass keine Assets inlined werden (wichtig für Schriftarten)
    assetsInlineLimit: 0,
    
    // Verbesserte Asset-Handhabung
    rollupOptions: {
      // Stelle sicher, dass nostr-tools korrekt verarbeitet wird
      external: ['nostr-tools'],
      output: {
        // Weniger kryptische Dateinamen für einfachere Fehlersuche
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Behandle die externen Bibliotheken korrekt im Build-Prozess
        globals: {
          'nostr-tools': 'NostrTools'
        }
      }
    }
  },
  
  // Optimiere die CSS-Handhabung
  css: {
    devSourcemap: true // Hilft bei der Fehlersuche in CSS
  },
  
  optimizeDeps: {
    // Füge nostr-tools zur Optimierung hinzu
    include: ['nostr-tools']
  }
})
