# DEVmatrose Website

Eine interaktive Single-Page-Anwendung im Amiga-500-Retro-Design, die Alexander Friedland (alias @ogerly) und seine Firma DEVmatrose vorstellt.

![Bildschirmfoto vom 2025-02-26 13-30-53](https://github.com/user-attachments/assets/f11dbce2-77db-45a5-b3d7-cf914c2268bc)
![Bildschirmfoto vom 2025-02-26 13-30-46](https://github.com/user-attachments/assets/19a4f325-5cf6-4209-8e53-aec2ef3318b0)


## Live-Demo

Die Live-Demo der Anwendung ist hier verfügbar: [https://ogerly.github.io/Devmatrose-website/](https://ogerly.github.io/Devmatrose-website/)

## Über das Projekt

Diese Website verwendet ein authentisches Amiga Workbench Design, um Alexander Friedland und seine Arbeit als Full-Stack-Entwickler und Gründer von DEVmatrose zu präsentieren. Die interaktive Benutzeroberfläche bietet ein voll funktionsfähiges Amiga-OS-ähnliches Erlebnis mit:

- Boot-Animation und Sequenz
- Fenster, die man verschieben, maximieren und schließen kann
- Desktop-Icons zur Navigation
- Amiga-typische Menüs und Design-Elemente
- Simulierte Diskettenlaufwerke mit LED-Animation
- Terminal-Emulator mit grundlegenden Befehlen

## Funktionen

- **About:** Informationen über Alexander Friedland und seinen Werdegang
- **Skills:** Technische Expertise und Fähigkeiten
- **Projekte:** Übersicht über ausgewählte Arbeiten
- **Terminal:** Interaktive CLI für nostalgische Amiga-Fans
- **Kontakt:** Kontaktmöglichkeiten und Links

## Technologien

- Vue.js
- CSS3 mit authentischen Amiga-Stilen
- JavaScript ES6+
- Externe Amiga-Schriftarten

## Installation und Start

```bash
# Repository klonen
git clone https://github.com/ogerly/DEVmatrose-website.git

# Ins Verzeichnis wechseln
cd DEVmatrose-website

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Für Produktionsumgebung bauen
npm run build
```

## Deployment auf GitHub Pages

Das Projekt ist so konfiguriert, dass es automatisch auf GitHub Pages bereitgestellt werden kann:

1. Entweder manuell mit dem Deploy-Skript:
   ```bash
   # Ausführungsrechte für das Skript hinzufügen
   chmod +x deploy.sh
   # Skript ausführen
   ./deploy.sh
   ```

2. Oder durch Push auf den main-Branch, der die GitHub Action auslöst

Nach dem Deployment ist die Website unter `https://[username].github.io/DEVmatrose-website2/` verfügbar.

## Über DEVmatrose

DEVmatrose ist das Unternehmen von Alexander Friedland (@ogerly), spezialisiert auf maßgeschneiderte Softwarelösungen mit Fokus auf innovative und dezentrale Technologien. Mit über 25 Jahren Erfahrung in der Softwareentwicklung bietet DEVmatrose Lösungen in den Bereichen:

- Web- und Desktop-Anwendungen
- Dezentrale Systeme (IPFS, Nostr)
- KI-Integration und Prompt Engineering
- Open-Source-Entwicklung

## Über den Entwickler

Alexander Friedland ist ein erfahrener Softwareentwickler aus Dresden. Seit 1999 entwickelt er Webanwendungen und hat sich auf moderne Technologien wie JavaScript, Vue, IPFS und Nostr spezialisiert. Seine Leidenschaft gilt innovativen Lösungen und dezentralen Systemen.

- GitHub: [@ogerly](https://github.com/ogerly)
- Blog: [imsumpf.blogspot.com](https://imsumpf.blogspot.com)

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).

---

© 2023 Alexander Friedland | DEVmatrose
