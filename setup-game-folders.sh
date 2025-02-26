#!/bin/bash

# Erstelle Ordnerstruktur für Spiele-Emulator
mkdir -p public/js/emulatorjs/data
mkdir -p public/games
mkdir -p public/images/games
mkdir -p public/roms

echo "Ordnerstruktur für Amiga-Spiele erstellt:"
echo "- public/js/emulatorjs/data/ (für Emulator-Dateien)"
echo "- public/games/ (für ADF-Spieldateien)"
echo "- public/images/games/ (für Spielevorschaubilder)"
echo "- public/roms/ (für Kickstart-ROM)"

echo ""
echo "Als Nächstes musst du Folgendes tun:"
echo "1. EmulatorJS herunterladen von: https://github.com/emulatorjs/emulatorjs"
echo "2. Emulator-Dateien in public/js/emulatorjs/ kopieren"
echo "3. Kickstart-ROM (kick13.rom) in public/roms/ ablegen"
echo "4. ADF-Spieldateien in public/games/ kopieren"
echo "5. Thumbnails für Spiele in public/images/games/ ablegen"

echo ""
echo "HINWEIS: Stelle sicher, dass du nur Public Domain oder Open-Source-Spiele verwendest."
echo "        Das Kickstart-ROM muss legal erworben sein."
