#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== GitHub Pages Deployment Debug Tool ===${NC}"

# 1. Prüfe, ob das Repo korrekt eingerichtet ist
echo -e "\n${YELLOW}1. Prüfe Git-Konfiguration${NC}"
if [ -d ".git" ]; then
  echo -e "${GREEN}✓${NC} Git Repository ist vorhanden"
  git remote -v
  echo -e "\nStelle sicher, dass die Remote-URL korrekt ist."
else
  echo -e "${RED}✗${NC} Git Repository ist nicht initialisiert"
fi

# 2. Prüfe dist-Verzeichnis
echo -e "\n${YELLOW}2. Prüfe dist-Verzeichnis${NC}"
if [ -d "dist" ]; then
  echo -e "${GREEN}✓${NC} dist-Verzeichnis existiert"
  echo -e "Anzahl der Dateien: $(find dist -type f | wc -l)"
  
  if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓${NC} index.html vorhanden"
  else
    echo -e "${RED}✗${NC} index.html fehlt im dist-Verzeichnis"
  fi
else
  echo -e "${RED}✗${NC} dist-Verzeichnis nicht gefunden - führe 'npm run build' aus"
fi

# 3. Teste die SSH-Verbindung zu GitHub
echo -e "\n${YELLOW}3. Teste SSH-Verbindung zu GitHub${NC}"
ssh -T git@github.com 2>&1 | grep -q "success"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} SSH-Verbindung zu GitHub funktioniert"
else
  echo -e "${RED}✗${NC} SSH-Verbindung zu GitHub hat Probleme"
  echo -e "Versuche, mit HTTPS zu pushen:"
  echo -e "git push -f https://github.com/ogerly/DEVmatrose-website2.git gh-pages"
fi

# 4. Prüfe GitHub Pages Status
echo -e "\n${YELLOW}4. GitHub Pages Status${NC}"
echo -e "Öffne diese URL, um den Status der GitHub Pages zu prüfen:"
echo -e "${GREEN}https://github.com/ogerly/DEVmatrose-website2/settings/pages${NC}"
echo -e "Es kann bis zu 10 Minuten dauern, bis Änderungen live sind."

# 5. Vorschlag für manuelle Behebung
echo -e "\n${YELLOW}5. Manuelles Deployment${NC}"
echo -e "Wenn alles andere fehlschlägt, versuche diesen Befehl:"
echo -e "cd dist && git init && git checkout -b gh-pages && git add . && git commit -m 'Manual deploy' && git push -f https://github.com/ogerly/DEVmatrose-website2.git gh-pages"
