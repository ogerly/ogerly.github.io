#!/bin/bash

# Verzeichnis erstellen
mkdir -p "DEVmatrose - Company/public/ttf"

# Schriftart herunterladen, falls sie noch nicht existiert
if [ ! -f "DEVmatrose - Company/public/ttf/topaz.ttf" ]; then
  echo "Topaz-Schriftart wird heruntergeladen..."
  curl -o "DEVmatrose - Company/public/ttf/topaz.ttf" https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/Topaz_a500_v1.0.ttf
  echo "Download abgeschlossen"
fi

if [ ! -f "DEVmatrose - Company/public/ttf/TopazPlus.ttf" ]; then
  echo "TopazPlus-Schriftart wird heruntergeladen..."
  curl -o "DEVmatrose - Company/public/ttf/TopazPlus.ttf" https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/TopazPlus_a1200_v1.0.ttf
  echo "Download abgeschlossen"
fi

echo "Schriftarten wurden eingerichtet"
