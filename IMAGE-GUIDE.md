# Leitfaden für Bilder und Platzhalter

## Platzhalter für Bilder

Für diese Anwendung nutzen wir [placehold.co](https://placehold.co/) zum Generieren von Platzhalterbildern während der Entwicklung.

### Beispiel URLs

Hier sind einige Beispiel-Formate, die du verwenden kannst:

- Einfacher Platzhalter: `https://placehold.co/300x200`
- Mit Farben: `https://placehold.co/300x200/2b65ad/ffffff` (Hintergrund/Text)
- Mit Text: `https://placehold.co/300x200/2b65ad/ffffff?text=DEVmatrose`
- Mit Schriftart: `https://placehold.co/300x200/2b65ad/ffffff?text=DEVmatrose&font=open+sans`

### Generieren aller Platzhalter

Das Script `generate-placeholders.sh` erstellt alle benötigten Platzhalterbilder für die Anwendung:

```bash
chmod +x generate-placeholders.sh
./generate-placeholders.sh
```

## Bilder in der Anwendung

### Verzeichnisstruktur

- `/public/images/games/` - Spielbilder
- `/public/images/icons/` - Desktop-Icons
- `/public/` - Allgemeine Bilder (Logo, Favicon)

### Vite und Bilder

Bei Verwendung von Vite gibt es zwei Hauptmethoden, um Bilder einzubinden:

#### 1. Bilder im public-Verzeichnis

```html
<img src="/images/games/sqrxz.png" alt="Sqrxz" />
```

#### 2. Bilder importieren (für Verarbeitung durch Vite)

```vue
<script setup>
import logo from '../assets/logo-devmatrose.png';
</script>

<template>
  <img :src="logo" alt="Logo" />
</template>
```

### Fallbacks für fehlende Bilder

Die Anwendung enthält Fallbacks für fehlende Bilder:

```html
<img 
  src="/path/to/image.jpg" 
  alt="Bild" 
  onerror="this.onerror=null; this.src='https://placehold.co/300x200/2b65ad/ffffff?text=Fehlendes+Bild';" 
/>
```

## Eigene Bilder hinzufügen

Ersetze einfach die Platzhalterbilder in den entsprechenden Verzeichnissen mit deinen eigenen Bildern unter Beibehaltung des gleichen Dateinamens.
