#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== DEVmatrose Website - Vollständiger Deploy-Prozess ===${NC}"

# 1. Schriftarten herunterladen (falls nötig)
echo -e "\n${YELLOW}1. Bereite Schriftarten vor...${NC}"
./setup-fonts.sh

# 2. Build erstellen
echo -e "\n${YELLOW}2. Erstelle Build...${NC}"
npm run build

# 3. Assets kopieren
echo -e "\n${YELLOW}3. Kopiere Assets...${NC}"
./copy-assets.sh

# 4. Teste den Build (optional)
echo -e "\n${YELLOW}4. Möchtest du den Build lokal testen?${NC} (Y/n) "
read -r response
if [[ "$response" != "n" && "$response" != "N" ]]; then
    # Führe Test für 10 Sekunden aus
    echo -e "${YELLOW}Starte lokalen Server für 10 Sekunden...${NC}"
    echo -e "Öffne http://localhost:3000 in deinem Browser"
    (sleep 10 && kill $$ &) && npx serve dist || true
fi

# 5. Deployment auf GitHub Pages
echo -e "\n${YELLOW}5. Auf GitHub Pages deployen?${NC} (Y/n) "
read -r response
if [[ "$response" != "n" && "$response" != "N" ]]; then
    echo -e "\n${YELLOW}Deploye auf GitHub Pages...${NC}"
    
    # In das Build-Verzeichnis wechseln
    cd dist

    # Git initialisieren, wenn es noch nicht existiert
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}Initialisiere Git Repository...${NC}"
        git init
    fi

    # Git konfigurieren
    git checkout -B gh-pages
    git add -A
    
    # Commit erstellen
    echo -e "${YELLOW}Erstelle Commit...${NC}"
    git commit -m "Deploy auf GitHub Pages - $(date +'%d.%m.%Y %H:%M')"

    # Push zu GitHub Pages-Branch
    echo -e "${YELLOW}Pushe zu GitHub Pages...${NC}"
    echo -e "${YELLOW}Bitte stelle sicher, dass du Zugriff auf das Repository hast!${NC}"
    git push -f git@github.com:ogerly/DEVmatrose-website2.git gh-pages:gh-pages

    # Zurück zum ursprünglichen Verzeichnis
    cd -

    echo -e "\n${GREEN}Deployment abgeschlossen! Überprüfe deine Seite unter:${NC}"
    echo -e "${GREEN}https://ogerly.github.io/DEVmatrose-website2/${NC}"
else
    echo -e "\n${YELLOW}Deployment übersprungen.${NC}"
fi

echo -e "\n${GREEN}Prozess abgeschlossen!${NC}"
