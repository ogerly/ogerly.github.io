import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // WICHTIG: base muss dem GitHub Repository-Namen entsprechen
  // Bei Änderung des Repository-Namens muss dieser Wert angepasst werden
  base: '/DEVmatrose-website2/', 
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  build: {
    outDir: 'dist', // Output direkt im dist-Verzeichnis
    emptyOutDir: true,
    
    // Stellt sicher, dass keine Assets inlined werden (wichtig für Schriftarten)
    assetsInlineLimit: 0,
    
    // Verbesserte Asset-Handhabung
    rollupOptions: {
      output: {
        // Weniger kryptische Dateinamen für einfachere Fehlersuche
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  
  // Optimiere die CSS-Handhabung
  css: {
    devSourcemap: true // Hilft bei der Fehlersuche in CSS
  }
})
