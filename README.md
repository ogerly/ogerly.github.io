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
tulex@pop-os:~/Entwicklung/Projekte/DEVmatrose-website$ tree
.
├── assets
│   └── amiga-theme.css
├── cypress
│   ├── e2e
│   │   └── example.cy.js
│   ├── fixtures
│   │   └── example.json
│   ├── jsconfig.json
│   └── support
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
├── DEPLOYMENT.md
├── EMULATOR-SETUP.md
├── ENV-README.md
├── eslint.config.js
├── GITHUB-PAGES.md
├── IMAGE-GUIDE.md
├── index.html
├── jsconfig.json
├── LAST-STANDING.md
├── main.js
├── NOSTR-SETUP.md
├── package.json
├── package-lock.json
├── PAT-INSTRUCTIONS.md
├── PROJEKT-STATUS.md
├── public
│   ├── cors-proxy.html
│   ├── cursor
│   │   ├── Alternate Select.cur
│   │   ├── amiga-arrow.cur
│   │   ├── Busy.cur
│   │   ├── Diagonal Resize 1.cur
│   │   ├── Diagonal Resize 2.cur
│   │   ├── Help Select.cur
│   │   ├── Horizontal Resize.cur
│   │   ├── Link Select.cur
│   │   ├── Move.cur
│   │   ├── Normal Select.cur
│   │   ├── Text Select.cur
│   │   ├── Unavailable.cur
│   │   ├── Vertical Resize.cur
│   │   └── Working in Background.cur
│   ├── favicon.ico
│   ├── games
│   ├── images
│   │   ├── games
│   │   │   ├── blocky-skies.png
│   │   │   ├── giana.png
│   │   │   ├── gravity-force.png
│   │   │   ├── powerglove.png
│   │   │   ├── retro-racing.png
│   │   │   └── sqrxz.png
│   │   └── icons
│   │       ├── about.png
│   │       ├── blog.png
│   │       ├── contact.png
│   │       ├── games.png
│   │       ├── nostr.png
│   │       ├── projects.png
│   │       ├── skills.png
│   │       └── terminal.png
│   ├── js
│   │   └── emulatorjs
│   │       └── data
│   ├── logo-devmatrose.png
│   ├── roms
│   ├── screens
│   │   ├── ty_microknight_1.png
│   │   ├── ty_microknight_2.png
│   │   ├── ty_microknightplus_1.png
│   │   ├── ty_microknightplus_2.png
│   │   ├── ty_mosoul_1.png
│   │   ├── ty_mosoul_2.png
│   │   ├── ty_potnoodle_1.png
│   │   ├── ty_potnoodle_2.png
│   │   ├── ty_topaz1200_1.png
│   │   ├── ty_topaz1200_2.png
│   │   ├── ty_topaz500_1.png
│   │   ├── ty_topaz500_2.png
│   │   ├── ty_topazplus1200_1.png
│   │   ├── ty_topazplus1200_2.png
│   │   ├── ty_topazplus500_1.png
│   │   └── ty_topazplus500_2.png
│   └── ttf
│       ├── MicroKnightPlus_v1.0.ttf
│       ├── MicroKnight_v1.0.ttf
│       ├── mO'sOul_v1.0.ttf
│       ├── P0T-NOoDLE_v1.0.ttf
│       ├── Topaz_a1200_v1.0.ttf
│       ├── Topaz_a500_v1.0.ttf
│       ├── TopazPlus_a1200_v1.0.ttf
│       ├── TopazPlus_a500_v1.0.ttf
│       └── topaz.ttf
├── README.md
├── server
│   └── cors-proxy.js
├── server.py
├── src
│   ├── App.vue
│   ├── App.vue (ergänzen)
│   ├── assets
│   │   ├── amiga-theme.css
│   │   ├── amiga-theme.css (ergänzen)
│   │   ├── app-styles.css
│   │   ├── base.css
│   │   ├── data
│   │   │   └── games.js
│   │   ├── logo-devmatrose.svg
│   │   ├── logo.svg
│   │   ├── main.css
│   │   └── placeholder-styles.css
│   ├── components
│   │   ├── AboutComponent.vue
│   │   ├── BlogPreview.vue
│   │   ├── BlogWindow.vue
│   │   ├── BootSequence.vue
│   │   ├── ContactComponent.vue
│   │   ├── DesktopIcon.vue
│   │   ├── FolderIcon.vue
│   │   ├── GamesWindow.vue
│   │   ├── icons
│   │   │   ├── IconCommunity.vue
│   │   │   ├── IconDocumentation.vue
│   │   │   ├── IconEcosystem.vue
│   │   │   ├── IconSupport.vue
│   │   │   └── IconTooling.vue
│   │   ├── NostrAmigaClientSimple.vue
│   │   ├── NostrAmigaClient.vue
│   │   ├── NostrWindow.vue
│   │   ├── ProjectsComponent.vue
│   │   ├── SkillsComponent.vue
│   │   ├── TerminalComponent.vue
│   │   ├── __tests__
│   │   │   └── HelloWorld.spec.js
│   │   ├── TextComponent.vue
│   │   ├── TheWelcome.vue
│   │   ├── WelcomeItem.vue
│   │   ├── WorkbenchDesktop.vue
│   │   ├── WorkbenchMenuBar.vue
│   │   └── WorkbenchWindow.vue
│   ├── main.js
│   ├── mixins
│   │   ├── blogFolderMixin.js
│   │   └── gamesFolderMixin.js
│   ├── router
│   │   └── index.js
│   ├── stores
│   │   ├── blogStore.js
│   │   ├── counter.js
│   │   ├── menuStore.js
│   │   ├── systemStore.js
│   │   └── windowStore.js
│   ├── utils
│   │   ├── rssParser.js
│   │   └── textUtils.js
│   └── views
│       ├── AboutView.vue
│       └── HomeView.vue
├── vite.config.js
└── vitest.config.js
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
