# Anleitung zum Hochladen auf GitHub

Folge diesen Schritten, um dein OwlyApp-Projekt auf dein GitHub-Repository hochzuladen:

## 1. Repository initialisieren (falls noch nicht geschehen)

```bash
git init
```

## 2. Dateien zum Staging-Bereich hinzufügen

```bash
git add .
```

## 3. Füge dein GitHub-Repository als Remote hinzu

```bash
git remote add origin https://github.com/SteF-agh/owlyapp.git
```

## 4. Committe die Änderungen

```bash
git commit -m "Initiales Commit: OwlyApp für Englischlernen"
```

## 5. Ändere den Branch-Namen auf main (falls nötig)

```bash
git branch -M main
```

## 6. Push zum GitHub-Repository

```bash
git push -u origin main
```

## Wichtige Hinweise

- Der `.gitignore` ist bereits eingerichtet und ignoriert sensible Dateien wie `.env`
- Stelle sicher, dass du deine API-Schlüssel nicht versehentlich hochlädst
- Auf GitHub kannst du unter "Settings" > "Pages" die Einstellungen für GitHub Pages konfigurieren, um deine App zu veröffentlichen

## Weitere Schritte

- Du kannst zusätzliche Screenshots im `screenshots`-Ordner hochladen und diese in der README.md verlinken
- In den Repository-Einstellungen kannst du Themen und eine Beschreibung hinzufügen, um deine App besser auffindbar zu machen