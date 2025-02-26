import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// Router-Import entfernen
// import router from './router'

import './assets/amiga-theme.css'
import './assets/app-styles.css'

// Create app with no size constraints
const app = createApp(App)

// Pinia verwenden
app.use(createPinia())
// Router nicht mehr verwenden
// app.use(router)

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

// Remove default styles that might interfere
document.body.style.padding = '0'
document.body.style.margin = '0'
document.body.style.overflow = 'hidden'
