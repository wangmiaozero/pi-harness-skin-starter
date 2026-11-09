# Pi-Harness Starter für benutzerdefinierte Skins

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja-JP.md">日本語</a> ·
  <a href="README.ko-KR.md">한국어</a> ·
  <a href="README.ru-RU.md">Русский</a> ·
  <a href="README.fr-FR.md">Français</a> ·
  <a href="README.de-DE.md">Deutsch</a>
</p>

Dieses eigenständige Skin-Projekt kann von Codex oder Pi erzeugt und anschließend direkt in [Pi-Harness](https://github.com/wangmiaozero/pi-harness) importiert werden. Der Skin-Protocol-v1-Import bleibt erhalten. Theme- und Pet-npm-Pakete sowie die Migration stehen in [README.md](README.md).

## Schnellstart

1. Verwenden Sie dieses Repository als Vorlage oder laden Sie es herunter und entpacken Sie es.
2. Öffnen Sie das Projektverzeichnis mit Codex oder Pi.
3. Kopieren Sie den folgenden Prompt, ersetzen Sie die letzte Zeile durch Ihr gewünschtes Thema und senden Sie ihn ab.
4. Öffnen Sie nach der Generierung und Validierung in Pi-Harness **Einstellungen → Thema → Skin importieren** und wählen Sie das Projektverzeichnis aus.

## Prompt zum Kopieren

Verwenden Sie die Kopierschaltfläche oben rechts im Codeblock:

```text
Erstelle im aktuellen Projekt einen vollständigen benutzerdefinierten Skin, der direkt in Pi-Harness importiert werden kann.

Anforderungen:
1. Lies zuerst AGENTS.md, SKIN_BRIEF.md, skin.schema.json und pi-harness-skin.json vollständig.
2. Ändere ausschließlich das aktuelle Skin-Projekt. Ändere nicht die Pi-Harness-Anwendung und erstelle keine Dateien außerhalb dieses Projekts.
3. Erzeuge folgende Ressourcen:
   - assets/wallpaper.webp: ein 16:9-Anwendungshintergrund, auf dem Text über transparenten Flächen gut lesbar bleibt.
   - assets/portrait.webp: ein hochformatiges Charakterbild mit transparentem Hintergrund und großzügigem Sicherheitsabstand; kann entfallen, wenn das Design keine Figur enthält.
   - assets/preview.webp: eine 16:10-Vorschaukarte, die das endgültige Design genau wiedergibt.
4. Passe pi-harness-skin.json an die Bilder an: eindeutige id in kebab-case, Name, Version, helles/dunkles Erscheinungsbild, relative Ressourcenpfade und vollständige Farbwerte.
5. Bilder dürfen nur PNG, JPEG oder WebP sein; jede Datei muss kleiner als 12 MiB sein. Externe URLs, SVG, CSS, JavaScript, HTML, Schriftarten und ausführbare Dateien sind nicht zulässig.
6. Validiere das fertige Projekt gegen skin.schema.json, prüfe, ob jede referenzierte Ressource unter dem richtigen Pfad vorhanden ist, und gib die endgültige Dateiliste sowie die Validierungsergebnisse aus.

Mein Thema: ein verschneiter kaiserlicher Hof der Ming-Dynastie in Zinnoberrot, Tuscheschwarz und Gold, mit einem würdevollen, zurückhaltenden Ming-Beamten; keine moderne Architektur, Neonlichter oder Cyberpunk-Elemente.
```

Nur die letzte Zeile `Mein Thema` muss angepasst werden. Ausführlichere Designvorgaben können Sie auch in `SKIN_BRIEF.md` eintragen.

## Erwartete Dateien

```text
pi-harness-skin.json
assets/
├── wallpaper.webp
├── portrait.webp
└── preview.webp
```

- `wallpaper.webp`: 16:9-Anwendungshintergrund.
- `portrait.webp`: optionales hochformatiges Charakterbild mit transparentem Hintergrund.
- `preview.webp`: 16:10-Vorschau für die Designauswahl.
- `pi-harness-skin.json`: Designmetadaten, Ressourcenpfade und Farbwerte.

## Skin importieren

1. Starten Sie Pi-Harness.
2. Öffnen Sie **Einstellungen → Thema**.
3. Klicken Sie auf **Skin importieren**.
4. Wählen Sie das Projektverzeichnis aus, das `pi-harness-skin.json` enthält.
5. Wählen Sie die neue Karte des benutzerdefinierten Skins aus, um ihn zu aktivieren.

## Skin aktualisieren

Lassen Sie die `id` in `pi-harness-skin.json` unverändert. Importieren Sie nach Änderungen an Bildern, Farben oder Versionsnummer dasselbe Projektverzeichnis erneut. Pi-Harness ersetzt die installierte Kopie sicher.

## Manifestbeispiel

```json
{
  "$schema": "./skin.schema.json",
  "schemaVersion": 1,
  "id": "my-custom-skin",
  "name": "Mein benutzerdefiniertes Design",
  "version": "1.0.0",
  "appearance": "dark",
  "assets": {
    "preview": "assets/preview.webp",
    "wallpaper": "assets/wallpaper.webp",
    "portrait": "assets/portrait.webp"
  },
  "tokens": {
    "window": "#111318",
    "workspace": "#1b1f27",
    "textPrimary": "#f3f5f7",
    "accent": "#6f9df4"
  }
}
```

Alle Feldbeschränkungen finden Sie in `skin.schema.json`. Die `id` darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten. Ändern Sie sie nach der Veröffentlichung nicht, da Pi-Harness das Ergebnis sonst als anderes Design behandelt.

## Sicherheit und Ressourcenlimits

- Unterstützt werden nur PNG-, JPEG- und WebP-Dateien innerhalb des Projekts.
- Jedes Bild muss kleiner als 12 MiB sein.
- Ressourcenpfade müssen relativ sein und dürfen weder `..` noch absolute Pfade oder symbolische Links außerhalb des Projekts verwenden.
- Externe CSS-, JavaScript-, SVG-, HTML- und Schriftdateien sowie Netzwerk-URLs werden nicht unterstützt.
- Pi-Harness kopiert nur validierte Manifeste und Bitmap-Ressourcen; Code aus Designprojekten wird nicht ausgeführt.
