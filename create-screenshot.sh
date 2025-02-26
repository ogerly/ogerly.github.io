#!/bin/bash

# Dieses Skript erstellt einen Screenshot der Anwendung und speichert ihn im Repository
# Benötigt: Firefox und imagemagick

# Starten Sie den Dev-Server, wenn er noch nicht läuft
echo "Stelle sicher, dass der Dev-Server läuft (npm run dev)..."

# Warten Sie einen Moment
sleep 2

# Öffnen Sie die Anwendung in Firefox
firefox http://localhost:5173 &
FIREFOX_PID=$!

# Warten Sie, bis die Seite vollständig geladen ist
echo "Warte 5 Sekunden, bis die Seite geladen ist..."
sleep 5

# Screenshot erstellen
echo "Erstelle Screenshot..."
import -window root -crop 1280x720+0+0 screenshot.png

# Browser schließen
kill $FIREFOX_PID

echo "Screenshot erstellt: screenshot.png"
echo "Bitte überprüfe den Screenshot und benenne ihn bei Bedarf um."
