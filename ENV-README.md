# Umgebungsvariablen für NostrOS

## Einrichtung

1. Erstelle eine `.env`-Datei im Projektstammverzeichnis:

```
VITE_NOSTR_USER_NAME=deinNutzername
VITE_NOSTR_PUBLIC_KEY=deinÖffentlicherSchlüssel
VITE_NOSTR_PRIVATE_KEY=deinPrivaterSchlüssel
```

2. Diese Umgebungsvariablen werden beim Starten der App automatisch geladen.

## Sicherheitshinweise

- Die `.env`-Datei wird nicht in das Git-Repository aufgenommen (sie ist in `.gitignore` aufgeführt)
- **WARNUNG**: Speichere niemals private Schlüssel in Produktionsumgebungen oder öffentlich zugänglichen Dateien
- Diese Methode eignet sich nur für lokale Entwicklung und Tests

## Automatisches Login

Wenn die Umgebungsvariablen gesetzt sind, versucht der NostrOS-Client automatisch einzuloggen,
ohne dass ein manuelles Ausfüllen der Login-Formulare notwendig ist.
