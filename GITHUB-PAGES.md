# Deployment auf GitHub Pages

Diese Anleitung erklärt, wie du das DEVmatrose-Website-Projekt auf GitHub Pages deployst.

## Deployment über GitHub Actions (empfohlen)

Das Repository ist bereits mit GitHub Actions konfiguriert, die automatisch bei jedem Push auf den main-Branch ausgeführt werden.

1. Pushe deine Änderungen in den main-Branch:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

2. Nach einigen Minuten wird die GitHub Action ausgeführt und die Website auf den gh-pages Branch deployt.

3. Aktiviere GitHub Pages in den Repository-Einstellungen:
   - Gehe zu: `https://github.com/ogerly/DEVmatrose-website/settings/pages`
   - Wähle als Source: "Deploy from a branch"
   - Wähle den Branch: "gh-pages"
   - Klicke auf "Save"

4. Deine Website sollte nun unter `https://ogerly.github.io/DEVmatrose-website/` verfügbar sein.

## Manuelles Deployment

Du kannst die Website auch manuell deployen:

```bash
npm run build      # Erstellt die optimierten Dateien
npm run deploy     # Deployt auf den gh-pages Branch
```

## Lokales Testen

Vor dem Deployment kannst du die Website lokal testen:

```bash
npm run build      # Baut die Website
npm run preview    # Startet einen lokalen Server für den Build
```

## Fehlerbehebung

Wenn das Deployment fehlschlägt:

1. Überprüfe die GitHub Action-Logs: `https://github.com/ogerly/DEVmatrose-website/actions`
2. Stelle sicher, dass GitHub Pages korrekt eingerichtet ist
3. Überprüfe, ob der gh-pages Branch existiert
4. Überprüfe die Pfade in vite.config.js (base: '/DEVmatrose-website/')
