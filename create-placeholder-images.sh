#!/bin/bash

# Erstelle Platzhalterbilder für Spiele
mkdir -p public/images/games

# Verwende curl, um SVG-Platzhalterbilder zu generieren
curl -o public/images/games/sqrxz.png "https://via.placeholder.com/300x200.png?text=Sqrxz"
curl -o public/images/games/gravity-force.png "https://via.placeholder.com/300x200.png?text=Gravity+Force"
curl -o public/images/games/blocky-skies.png "https://via.placeholder.com/300x200.png?text=Blocky+Skies"
curl -o public/images/games/retro-racing.png "https://via.placeholder.com/300x200.png?text=Retro+Racing"
curl -o public/images/games/giana.png "https://via.placeholder.com/300x200.png?text=Giana's+Return"
curl -o public/images/games/powerglove.png "https://via.placeholder.com/300x200.png?text=Powerglove"

echo "Platzhalterbilder für Spiele erstellt."
echo "Ersetze diese durch echte Screenshots, wenn du die Spiele hinzufügst."
