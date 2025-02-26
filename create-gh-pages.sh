#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Erstelle gh-pages Branch für GitHub Pages ===${NC}"

# Build erstellen
npm run build

# Assets kopieren
./copy-assets.sh

# In das Build-Verzeichnis wechseln
cd dist

# Git initialisieren
rm -rf .git
git init

# Wichtige Datei für GitHub Pages
touch .nojekyll

# Git konfigurieren
git checkout -b main
git add .
git commit -m "Initial GitHub Pages commit"

# Umwandlung in gh-pages Branch
git branch -m gh-pages

# Push zu GitHub mit Force-Option
echo -e "${YELLOW}Pushe zu GitHub Pages...${NC}"
echo -e "${YELLOW}Gib deine GitHub-Anmeldeinformationen ein, wenn dazu aufgefordert wird.${NC}"

# Alternativ mit HTTPS URL (einfacher für erste Einrichtung)
git push -f https://github.com/ogerly/DEVmatrose-website2.git gh-pages

echo -e "\n${GREEN}Branch erstellt und gepusht. Überprüfe nun die GitHub Pages-Einstellungen:${NC}"
echo -e "${GREEN}https://github.com/ogerly/DEVmatrose-website2/settings/pages${NC}"
