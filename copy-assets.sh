#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Kopiere Assets in den dist-Ordner...${NC}"

# Verzeichnisse erstellen
mkdir -p dist/cursor
mkdir -p dist/ttf
mkdir -p dist/screens

# Prüfe und kopiere die Assets
# Cursor
if [ -d "public/cursor" ]; then
    cp -r "public/cursor/"* dist/cursor/ 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Cursor-Dateien kopiert"
    else
        echo -e "${YELLOW}⚠${NC} Keine Cursor-Dateien gefunden oder Fehler beim Kopieren"
        # Erstelle einen Platzhaltercursor
        touch dist/cursor/amiga-arrow.cur
        echo -e "${YELLOW}⚠${NC} Platzhalter für cursor/amiga-arrow.cur erstellt"
    fi
else
    echo -e "${YELLOW}⚠${NC} Cursor-Verzeichnis fehlt"
    # Erstelle einen Platzhaltercursor
    touch dist/cursor/amiga-arrow.cur
    echo -e "${YELLOW}⚠${NC} Platzhalter für cursor/amiga-arrow.cur erstellt"
fi

# Schriftarten
if [ -d "public/ttf" ]; then
    cp -r "public/ttf/"* dist/ttf/ 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Schriftarten kopiert"
    else
        echo -e "${YELLOW}⚠${NC} Keine Schriftarten gefunden oder Fehler beim Kopieren"
        # Lade Schriftarten automatisch herunter
        echo "Lade Schriftarten herunter..."
        curl -s -o "dist/ttf/topaz.ttf" https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/Topaz_a500_v1.0.ttf
        curl -s -o "dist/ttf/TopazPlus.ttf" https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/TopazPlus_a1200_v1.0.ttf
        echo -e "${GREEN}✓${NC} Schriftarten heruntergeladen"
    fi
else
    echo -e "${YELLOW}⚠${NC} Schriftarten-Verzeichnis fehlt"
    # Lade Schriftarten automatisch herunter
    echo "Lade Schriftarten herunter..."
    curl -s -o "dist/ttf/topaz.ttf" https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/Topaz_a500_v1.0.ttf
    curl -s -o "dist/ttf/TopazPlus.ttf" https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/TopazPlus_a1200_v1.0.ttf
    echo -e "${GREEN}✓${NC} Schriftarten heruntergeladen"
fi

# Screens
if [ -d "public/screens" ]; then
    cp -r "public/screens/"* dist/screens/ 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Screen-Dateien kopiert"
    else
        echo -e "${YELLOW}⚠${NC} Keine Screen-Dateien gefunden oder Fehler beim Kopieren"
    fi
else
    echo -e "${YELLOW}⚠${NC} Screens-Verzeichnis fehlt"
fi

# Favicon
if [ -f "public/favicon.ico" ]; then
    cp "public/favicon.ico" dist/ 2>/dev/null
    echo -e "${GREEN}✓${NC} Favicon kopiert"
else
    echo -e "${YELLOW}⚠${NC} Favicon fehlt"
fi

# Erstelle eine .nojekyll-Datei
touch dist/.nojekyll
echo -e "${GREEN}✓${NC} .nojekyll-Datei erstellt"

echo -e "\n${GREEN}Assets wurden in den dist-Ordner kopiert${NC}"
