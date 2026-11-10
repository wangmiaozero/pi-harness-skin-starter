# Pi-Harness Custom Skin Starter

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

This standalone skin project can be given to Codex or Pi for generation, then imported directly into [Pi-Harness](https://github.com/wangmiaozero/pi-harness).

## Quick start

1. Use this repository as a template, or download and extract it.
2. Open the project directory with Codex or Pi.
3. Copy the prompt below, replace its final line with your preferred theme, and send it.
4. After the AI finishes and validates the project, open **Settings → Theme → Import Skin** in Pi-Harness and select the project directory.

## Copy-and-run prompt

Use the copy button in the upper-right corner of the code block:

```text
Create a complete custom skin in the current project that can be imported directly into Pi-Harness.

Requirements:
1. First read AGENTS.md, SKIN_BRIEF.md, skin.schema.json, and pi-harness-skin.json in full.
2. Modify only the current skin project. Do not modify the Pi-Harness application or create files outside this project.
3. Generate these assets:
   - assets/wallpaper.webp: a 16:9 application wallpaper that keeps text readable on translucent panels.
   - assets/portrait.webp: a portrait-oriented character image with a transparent background and generous safe margins; omit it if the design has no character.
   - assets/preview.webp: a 16:10 theme-card preview that accurately represents the final skin.
4. Update pi-harness-skin.json to match the images: set a unique kebab-case id, name, version, light/dark appearance, relative asset paths, and a complete set of color tokens.
5. Images must be PNG, JPEG, or WebP and each file must be smaller than 12 MiB. Do not use remote URLs, SVG, CSS, JavaScript, HTML, fonts, or executable files.
6. When finished, validate the project against skin.schema.json, verify that every asset exists at the referenced path, and report the final file list and validation results.

My theme: a snow-covered Ming imperial court, using vermilion, ink black, and gilded gold, with a dignified and restrained Ming official; no modern buildings, neon lights, or cyberpunk elements.
```

Only the final `My theme` line needs to be rewritten. You can also put more detailed design constraints in `SKIN_BRIEF.md`.

## Expected output

```text
pi-harness-skin.json
assets/
├── wallpaper.webp
├── portrait.webp
└── preview.webp
```

- `wallpaper.webp`: 16:9 application wallpaper.
- `portrait.webp`: optional portrait-oriented character image with a transparent background.
- `preview.webp`: 16:10 theme-selection card preview.
- `pi-harness-skin.json`: skin metadata, asset paths, and color tokens.

## Import the skin

1. Start Pi-Harness.
2. Open **Settings → Theme**.
3. Click **Import Skin**.
4. Select the project directory containing `pi-harness-skin.json`.
5. Select the new custom skin card to enable it.

## Update the skin

Keep the `id` in `pi-harness-skin.json` unchanged. After updating images, colors, or the version number, import the same project directory again. Pi-Harness safely replaces the installed copy.

## Manifest example

```json
{
  "$schema": "./skin.schema.json",
  "schemaVersion": 1,
  "id": "my-custom-skin",
  "name": "My Custom Skin",
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

See `skin.schema.json` for the complete field constraints. The `id` may contain only lowercase letters, numbers, and hyphens. Do not change it after publishing, or Pi-Harness will treat the result as a different skin.

## Security and asset limits

- Only PNG, JPEG, and WebP files inside the project are supported.
- Each image must be smaller than 12 MiB.
- Asset paths must be relative and cannot contain `..`, be absolute, or resolve through a symbolic link outside the project.
- External CSS, JavaScript, SVG, HTML, fonts, and network URLs are not supported.
- Pi-Harness copies only validated manifests and bitmap assets; it does not execute code from skin projects.

## Theme and pet packs

Skin Protocol v1 stays at this repository root. `pi-harness-skin.json` and `skin.schema.json` are still imported from **Settings → Theme → Import Skin**. Theme Pack Protocol v1 cannot store the full color-token map, so a theme package does not replace that import.

Create an independent package:

```bash
node scripts/create-theme.mjs my-theme --out ../my-theme
node scripts/create-pet.mjs my-pet --out ../my-pet
node scripts/migrate-skin.mjs . ../theme-my-custom-skin
```

`migrate-skin.mjs` reads the skin and writes a new directory. It does not change `pi-harness-skin.json`. The generated package name is `@example/theme-<id>`. `--official` changes the name to `@piharness/...` and does not grant publish permission. Market accepts only `^@piharness/(theme|pet)-[a-z0-9][a-z0-9-]*$`.

Templates live in `templates/theme` and `templates/pet`. Skills live in `skills/`. Commands and the token limitation are documented in `docs/DEVELOPMENT.md` and `docs/MIGRATION.md`.

A package without `piHarness.partOf` is a main package. A part package sets that field to the main package name, ships `clip-pack.json`, and can be installed on its own. The example is `examples/split-pet` and `examples/split-pet-part`.

