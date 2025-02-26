# Einrichtung des Amiga-Emulators

Um den Amiga-Emulator auf deiner Website einzurichten, benötigst du folgende Komponenten:

## 1. EmulatorJS

EmulatorJS ist ein auf RetroArch basierender JavaScript-Emulator, der viele Plattformen unterstützt, einschließlich Amiga.

### Installation:

1. Besuche [https://github.com/emulatorjs/emulatorjs](https://github.com/emulatorjs/emulatorjs)
2. Lade die Dateien herunter und entpacke sie
3. Kopiere folgende Dateien in das Verzeichnis `public/js/emulatorjs/`:
   - emulator.js
   - emulator-ui.js
   - Den gesamten `data`-Ordner

## 2. Kickstart ROM

Für die Emulation von Amiga benötigst du ein Kickstart ROM:

1. Lege das Kickstart ROM `kick13.rom` (Version 1.3) in das Verzeichnis `public/roms/` ab
2. **WICHTIG**: Das ROM muss legal erworben sein, z.B. durch den Kauf von Amiga Forever

## 3. Spieledateien (ADF)

Kopiere die ADF-Dateien der Spiele in das Verzeichnis `public/games/`. Stelle sicher, dass du nur Public Domain oder Open-Source-Spiele verwendest:

- sqrxz.adf
- gravity-force.adf
- blocky-skies.adf
- retro-racing.adf
- giana.adf
- powerglove.adf

## 4. Vorschaubilder

Lege für jedes Spiel ein Vorschaubild im PNG-Format in das Verzeichnis `public/images/games/` ab.

## 5. Rechtliche Hinweise

- Verwende nur ROMs, die du legal erworben hast
- Biete keine urheberrechtlich geschützten Spiele an
- Verwende nur Public Domain, Freeware oder Open-Source-Spiele

## 6. Testen

Nach der Installation kannst du die Emulation testen, indem du auf das Games-Icon auf dem Desktop klickst und ein Spiel auswählst.
