# DEVmatrose-Website - Deployment-Checkliste

## Vor dem Deployment

1. **Konfiguration prüfen**
   - [ ] `vite.config.js`: Überprüfe, ob `base: '/DEVmatrose-website/'` korrekt eingestellt ist
   - [ ] Stelle sicher, dass alle Assets relativen Pfaden oder korrekten absoluten Pfaden verwenden

2. **Assets vorbereiten**
   - [ ] Überprüfe, ob alle benötigten Dateien in `/public` vorhanden sind:
     - [ ] `/public/ttf/topaz.ttf` und `/public/ttf/TopazPlus.ttf`
     - [ ] `/public/cursor/amiga-arrow.cur`
     - [ ] `/public/screens/bootscreen.png`
     - [ ] `/public/favicon.ico`

3. **Font-Pfade überprüfen**
   - [ ] In `src/assets/amiga-theme.css`: Die Font-URLs sollten auf `/DEVmatrose-website/ttf/` verweisen

## Build-Prozess

1. **Assets vorbereiten**
   ```bash
   ./setup-fonts.sh  # Lädt Schriftarten herunter, falls nötig
   ```

2. **Build ausführen**
   ```bash
   npm run build
   ```

3. **Assets kopieren**
   ```bash
   ./copy-assets.sh  # Kopiert Dateien aus /public in dist/
   ```

4. **Lokalen Test durchführen**
   ```bash
   ./test-build.sh  # Startet einen lokalen Server für das dist-Verzeichnis
   ```
   Überprüfe folgende Punkte im Browser:
   - [ ] Bootscreen wird angezeigt
   - [ ] Schriftarten werden korrekt geladen (keine 404-Fehler)
   - [ ] Cursors werden korrekt angezeigt
   - [ ] Alle Fenster können geöffnet und verwendet werden

## Vollständiges Deployment

Für ein vollständiges Deployment mit allen Schritten:

```bash
./deploy-full.sh
```

Dieses Skript führt dich durch den gesamten Prozess mit Optionen zum Testen und Deployment.

## Nach dem Deployment

1. **Website testen**
   - [ ] Öffne https://ogerly.github.io/DEVmatrose-website/
   - [ ] Überprüfe die Browser-Konsole auf Fehler
   - [ ] Teste alle Funktionen der Website

2. **Problembehebung**
   - Bei 404-Fehlern: Überprüfe die Asset-Pfade und die base-URL
   - Bei weißem Bildschirm: Überprüfe JavaScript-Fehler in der Browser-Konsole
   - Bei fehlenden Schriftarten: Überprüfe, ob die Schriftarten korrekt kopiert wurden
