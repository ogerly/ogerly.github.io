#!/bin/bash

echo "Installiere gh-pages Paket für einfaches Deployment..."
npm install --save-dev gh-pages

echo "Überprüfe ob das Paket installiert wurde..."
if npm list gh-pages --depth=0 2>/dev/null | grep -q "gh-pages"; then
  echo "✅ gh-pages wurde erfolgreich installiert!"
  echo "Du kannst nun 'npm run deploy' verwenden, um auf GitHub Pages zu deployen."
  echo "Hinweis: Stelle sicher, dass du vorher 'npm run build' ausgeführt hast."
else
  echo "❌ Fehler: gh-pages konnte nicht installiert werden!"
  echo "Versuche es manuell: npm install --save-dev gh-pages"
fi
