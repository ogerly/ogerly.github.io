# GitHub Pages Deployment

## Empfohlene Methode: GitHub Actions

Die einfachste Methode, um diese Website zu deployen, ist GitHub Actions. Die Konfiguration ist bereits in `.github/workflows/deploy.yml` vorhanden.

1. Pushe Änderungen in den main-Branch:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

2. GitHub Actions wird automatisch ausgeführt und den Build auf den gh-pages-Branch deployen.

3. In den Repository-Einstellungen unter "Pages" wähle den gh-pages-Branch als Quelle.

Diese Methode erfordert keine separaten Tokens oder externe Repositories.

## Für fortgeschrittene Nutzer: Manuelles Deployment

Du kannst die Website auch manuell mit dem folgenden Befehl deployen:

```bash
npm run build
npm run deploy
```

## Wichtig: Base-URL

Stelle sicher, dass die Base-URL in `vite.config.js` korrekt eingestellt ist:
- Für Projekt-Seiten: `base: '/DEVmatrose-website/'`
- Für User-Seiten: `base: '/'` (nur wenn das Repository ogerly.github.io heißt)
