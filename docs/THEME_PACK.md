# Theme Pack Protocol v1

`theme-pack.json` matches the manifest checked by Pi-Harness `validateThemePackManifest`.

Required: `formatVersion` 1, `id`, `name`, `version`, `author`, `description`, `license`, `compatiblePiHarness`, `preview`, and one to sixteen `variants`.

A variant needs `id` (`^[A-Za-z][A-Za-z0-9]*$`), `skinId`, `name`, `appearance` (`dark` or `light`), `portrait`, `#rrggbb` accent, and integer frame size from 1 to 8192. Asset paths are relative segments. `..`, absolute paths, and remote URLs are rejected.

This protocol does not store the Skin Protocol v1 token map. Those colors stay in `pi-harness-skin.json`.
