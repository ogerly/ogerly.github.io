#!/bin/bash

# Farben für die Ausgabe
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== DEVmatrose Website - Build-Test ===${NC}"

# Prüfe, ob der dist-Ordner existiert
if [ ! -d "dist" ]; then
    echo -e "${RED}Der dist-Ordner existiert nicht! Führe zuerst 'npm run build' aus.${NC}"
    exit 1
fi

# Prüfe, ob kritische Dateien vorhanden sind
echo -e "\n${YELLOW}Prüfe kritische Dateien:${NC}"

if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓${NC} index.html gefunden"
else
    echo -e "${RED}✗${NC} index.html fehlt!"
fi

if ls dist/assets/*.js 1>/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} JavaScript-Dateien gefunden"
else
    echo -e "${RED}✗${NC} JavaScript-Dateien fehlen!"
fi

if ls dist/assets/*.css 1>/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} CSS-Dateien gefunden"
else
    echo -e "${RED}✗${NC} CSS-Dateien fehlen!"
fi

# Überprüfe, ob die Schriftarten vorhanden sind
echo -e "\n${YELLOW}Prüfe Assets:${NC}"
if [ -f "dist/ttf/topaz.ttf" ]; then
    echo -e "${GREEN}✓${NC} Topaz-Schriftart gefunden"
else
    echo -e "${RED}✗${NC} Topaz-Schriftart fehlt!"
fi

if [ -f "dist/ttf/TopazPlus.ttf" ]; then
    echo -e "${GREEN}✓${NC} TopazPlus-Schriftart gefunden"
else
    echo -e "${RED}✗${NC} TopazPlus-Schriftart fehlt!"
fi

if [ -f "dist/cursor/amiga-arrow.cur" ]; then
    echo -e "${GREEN}✓${NC} Amiga-Cursor gefunden"
else
    echo -e "${RED}✗${NC} Amiga-Cursor fehlt!"
fi

if [ -f "dist/screens/bootscreen.png" ]; then
    echo -e "${GREEN}✓${NC} Boot-Screen gefunden"
else
    echo -e "${RED}✗${NC} Boot-Screen fehlt!"
fi

# Starte einen Server zum Testen
echo -e "\n${YELLOW}Starte lokalen Server für den Build...${NC}"
echo -e "Öffne http://localhost:3000 in deinem Browser\n"
echo -e "${YELLOW}Drücke Strg+C, um den Server zu beenden${NC}"

# Prüfe, ob serve installiert ist
if ! command -v npx &>/dev/null; then
    echo -e "${RED}npx ist nicht installiert. Installiere es mit 'npm install -g npx'${NC}"
    exit 1
fi

# Starte den Server
npx serve dist
