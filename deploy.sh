#!/usr/bin/env sh

# Abbrechen bei Fehlern
set -e

# Build erstellen (im Root-Verzeichnis, da sich das Projekt dort befindet)
npm run build

# Assets in den dist-Ordner kopieren
bash copy-assets.sh

# In das Build-Verzeichnis wechseln
cd dist

# CNAME-Datei erstellen, falls eine benutzerdefinierte Domain verwendet wird
# echo 'www.devmatrose.de' > CNAME

# .nojekyll-Datei erstellen, um die Jekyll-Verarbeitung auf GitHub Pages zu verhindern
touch .nojekyll

# Git initialisieren, wenn es noch nicht existiert
if [ ! -d ".git" ]; then
  git init
fi

# Git konfigurieren
git checkout -B main
git add -A
git commit -m 'Deploy auf GitHub Pages'

# Push zur User Page
echo "Pushe zu ogerly.github.io Repository..."
git push -f git@github.com:ogerly/ogerly.github.io.git main:main

# Zurück zum ursprünglichen Verzeichnis
cd -

echo "Deployment abgeschlossen! Überprüfe deine Seite unter https://ogerly.github.io/"
