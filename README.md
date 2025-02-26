# DEVmatrose Website

Eine moderne Entwickler-Website im Retro-Amiga-Design. Diese Website demonstriert Frontend-Entwicklung mit Vue.js und eine nostalgische Benutzeroberfläche inspiriert vom klassischen Amiga Workbench.

## Features

- 🖥️ Authentisches Amiga OS Look-and-Feel
- 🚀 Vue.js Framework für reaktive UI-Komponenten
- 📱 Vollständig responsive Darstellung
- ⚡ Optimiert mit Vite für schnelles Development und Build
- 🎨 Pixelgenaue Nachbildung der Amiga-UI-Elemente
- 🔄 Interaktive Fenster mit Drag & Drop

## Entwicklung

### Setup

```bash
# Abhängigkeiten installieren
npm install
```

### Lokaler Entwicklungsserver

```bash
# Startet den Entwicklungsserver mit Hot-Reload
npm run dev
```

### Build für Produktion

```bash
# Erstellt optimierte Produktionsdateien
npm run build

# Vorschau des Builds
npm run preview
```

### Deployment auf GitHub Pages

Die Website wird automatisch via GitHub Actions auf GitHub Pages deployed, wenn Änderungen in den `main`-Branch gepusht werden.

Alternativ kannst du manuell deployen:
```bash
npm run deploy
```

Für detaillierte Informationen zum Deployment siehe [GITHUB-PAGES.md](./GITHUB-PAGES.md).

## Projektstruktur

```
/
├── public/               # Statische Assets
│   ├── cursor/           # Amiga-Cursor-Dateien
│   ├── screens/          # Bootscreen und andere Bildschirme
│   ├── ttf/              # Amiga-Schriftarten (Topaz)
│   └── favicon.ico       # Website Favicon
├── src/
│   ├── assets/           # Projektassets
│   │   ├── amiga-theme.css  # Amiga-spezifische Styles
│   │   └── main.css      # Haupt-CSS
│   ├── components/       # Vue-Komponenten
│   │   ├── AboutWindow.vue
│   │   ├── SkillsWindow.vue
│   │   ├── ProjectsWindow.vue
│   │   ├── TerminalWindow.vue
│   │   └── ContactWindow.vue
│   ├── App.vue          # Haupt-App-Komponente
│   └── main.js          # App-Einstiegspunkt
└── vite.config.js       # Vite-Konfiguration
```

## Anpassung des Base Path

Wenn sich die URL deines GitHub-Repositories ändert, musst du den Base Path in `vite.config.js` aktualisieren:

```js
export default defineConfig({
  // Ändere dies entsprechend deinem Repository-Namen
  base: '/DEVmatrose-website/',
  // ...
})
```

## Lizenz

[MIT](https://choosealicense.com/licenses/mit/)
