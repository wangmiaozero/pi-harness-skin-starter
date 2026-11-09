---
name: create-theme
description: Create an independent Pi-Harness theme npm package from the skin starter template. Use when the user asks to create a Pi-Harness theme pack, theme-pack.json, or a market theme.
---

# Create a theme pack

1. Read `AGENTS.md`. Do not edit the Pi-Harness application. Do not change the root skin id in `pi-harness-skin.json`.
2. Choose a kebab-case slug. The theme id uses that slug. The default package name is `@example/theme-<slug>`.
3. Use `--official` only when the user explicitly owns `@pi-harness`. A matching name does not grant publish permission.
4. Run `node scripts/create-theme.mjs <slug> --out <new-directory>`. Refuse if the directory exists.
5. Put real wallpaper and portrait files under `assets/` and point `theme-pack.json` at them. Keep paths relative.
6. Set `accent` to `#rrggbb`. Full color tokens stay in Skin Protocol v1; do not delete `pi-harness-skin.json` to represent them.
7. Use an existing mascot style id for `variants[].id` only when the theme must drive a built-in Pi-Harness style. Otherwise leave `customTheme` and say that the current app will not apply an unknown style id.
8. Run `node scripts/validate-pack.mjs <directory>` and `node scripts/preview-pack.mjs <directory>`.
9. Run `node scripts/pack-check.mjs <directory> --write --out <tarball-directory>`.
10. Report the directory, package name, whether it is market-eligible, and the tarball path. Do not run `npm publish`.
