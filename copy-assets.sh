#!/bin/bash

# Verzeichnisse erstellen
mkdir -p dist/cursor
mkdir -p dist/ttf
mkdir -p dist/screens

# Kopiere die Assets
cp DEVmatrose\ -\ Company/public/cursor/* dist/cursor/ 2>/dev/null || echo "Keine Cursor-Dateien gefunden"
cp DEVmatrose\ -\ Company/public/ttf/* dist/ttf/ 2>/dev/null || echo "Keine Schriftart-Dateien gefunden"
cp DEVmatrose\ -\ Company/public/screens/* dist/screens/ 2>/dev/null || echo "Keine Screen-Dateien gefunden"
cp DEVmatrose\ -\ Company/public/favicon.ico dist/ 2>/dev/null || echo "Keine Favicon-Datei gefunden"

echo "Assets wurden in den dist-Ordner kopiert"
