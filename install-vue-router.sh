#!/bin/bash
# Script zum Installieren von vue-router

# Überprüfen, ob NPM installiert ist
if ! [ -x "$(command -v npm)" ]; then
  echo 'Fehler: npm ist nicht installiert.' >&2
  exit 1
fi

# Vue Router installieren
echo "Installiere vue-router..."
npm install vue-router@4

# Status prüfen
if [ $? -eq 0 ]; then
  echo "✓ Vue Router wurde erfolgreich installiert!"
  echo "Du kannst jetzt 'npm run build' ausführen."
else
  echo "✗ Bei der Installation ist ein Fehler aufgetreten."
  echo "Bitte führe 'npm install vue-router@4' manuell aus."
fi
