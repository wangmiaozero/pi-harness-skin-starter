# Migrating a skin to a theme pack

Skin Protocol v1 and Theme Pack Protocol v1 stay separate.

| | Skin Protocol v1 | Theme Pack Protocol v1 |
|---|---|---|
| File | `pi-harness-skin.json` | `theme-pack.json` |
| Use | Settings → Theme → Import Skin | Resource Market theme package |
| Colors | Full token map, including `rgba()` | One `#rrggbb` accent per variant |
| Images | PNG, JPEG, WebP under 12 MiB | PNG, JPEG, WebP, plus the theme manifest |

```bash
node scripts/migrate-skin.mjs <skin-directory> <new-theme-directory>
```

The script validates the skin, copies `preview`, `wallpaper`, and `portrait` when they exist, and writes `@example/theme-<skin-id>`. An empty asset map gets a 1×1 `preview.webp` placeholder. The source manifest is not opened for writing.

After migration:

1. Keep importing the original directory when the color tokens must stay active.
2. Run `node scripts/validate-pack.mjs <new-theme-directory>`.
3. Replace the placeholder preview before publishing.
4. A `customTheme` variant passes the manifest check. The current Pi-Harness UI applies a market theme only when the variant id is an existing mascot style.
