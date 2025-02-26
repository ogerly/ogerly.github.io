# Nostr Client Setup

Der NostrOS-Client ist ein Amiga-Stil-Chat-Client für das Nostr-Protokoll, integriert in die DEVmatrose-Website.

## Installation

1. Nostr-Tools installieren:
   ```bash
   npm install nostr-tools
   ```

2. Nostr Client testen:
   - Öffne die DEVmatrose-Website
   - Klicke auf das NostrOS-Icon auf dem Desktop
   - Der Nostr-Client wird im Amiga-Stil geöffnet

## Funktionen

- Erstellung eines neuen Nostr-Schlüsselpaars
- Laden eines vorhandenen privaten Schlüssels
- Verbindung zu 5 Standard-Nostr-Relays:
  - wss://relay.damus.io
  - wss://relay.nostr.info
  - wss://nostr-pub.wellorder.net
  - wss://nostr.fmt.wiz.biz
  - wss://relay.nostr.band
- Senden und Empfangen von Nachrichten

## Sicherheitshinweise

- Private Schlüssel werden NUR auf dem Client gespeichert
- Es findet keine serverseitige Speicherung statt
- Private Schlüssel sollten sicher aufbewahrt werden

## Hinweise zur Weiterentwicklung

- Unterstützung für zusätzliche Relay-Server
- Profilbearbeitung
- Direktnachrichten-Funktion
- Medienanhänge
