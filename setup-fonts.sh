#!/bin/bash

# Erstelle Verzeichnis für Schriftarten, falls es noch nicht existiert
mkdir -p public/ttf

# Lade die Topaz-Schriftarten herunter
echo "Lade Topaz-Schriftarten herunter..."

# Original Topaz A500
curl -s -o public/ttf/topaz.ttf https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/Topaz_a500_v1.0.ttf

# TopazPlus A1200 (hat bessere Unterstützung für Umlaute)
curl -s -o public/ttf/TopazPlus.ttf https://cdn.jsdelivr.net/gh/rewtnull/amigafonts/ttf/TopazPlus_a1200_v1.0.ttf

echo "Schriftarten wurden erfolgreich installiert!"
echo "Original Topaz: public/ttf/topaz.ttf"
echo "TopazPlus (mit besserer Umlaut-Unterstützung): public/ttf/TopazPlus.ttf"

# Erstelle eine CSS-Datei mit @font-face Definitionen
cat > public/ttf/fonts.css << 'EOF'
/* Amiga Schriftarten */
@font-face {
  font-family: 'Topaz';
  src: url('topaz.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'TopazPlus';
  src: url('TopazPlus.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* Verwendungshinweis:
   Für Texte ohne deutsche Umlaute: font-family: 'Topaz', monospace;
   Für Texte mit deutschen Umlauten: font-family: 'TopazPlus', 'Topaz', monospace;
*/
EOF

echo "CSS-Datei mit Font-Definitionen erstellt: public/ttf/fonts.css"
