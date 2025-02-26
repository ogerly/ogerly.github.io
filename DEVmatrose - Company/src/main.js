import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// Create app with no size constraints
const app = createApp(App)

// Mount the app
app.mount('#app')

// Set title
document.title = 'Alexander Friedland - DEVmatrose Workbench'

// Fix paths for GitHub Pages
const basePath = import.meta.env.BASE_URL || '/'

// Set favicon with correct path
const favicon = document.querySelector('link[rel="icon"]')
if (favicon) {
  favicon.href = `${basePath}favicon.ico`
}

// Setze die CSS-Variable für den Basispfad, damit die Schriftarten korrekt geladen werden
document.documentElement.style.setProperty('--base-path', basePath)

// Remove default styles that might interfere
document.body.style.padding = '0'
document.body.style.margin = '0'
document.body.style.overflow = 'hidden'

// Aktiviere den benutzerdefinierten Cursor, da wir jetzt eine Cursor-Datei haben
document.body.style.cursor = `url(${basePath}cursor/amiga-arrow.cur), default`
