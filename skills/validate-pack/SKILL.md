---
name: validate-pack
description: Validate a Pi-Harness skin, theme pack, or pet pack. Use when the user asks to check a manifest, asset path, license, or whether a pack can be packed.
---

# Validate a pack

1. Detect the directory. `pi-harness-skin.json` is Skin Protocol v1. `theme-pack.json` is Theme Pack Protocol v1. `pet-pack.json` is the existing pet protocol.
2. Run `node scripts/validate-pack.mjs <directory>`.
3. Confirm the result checks package name, manifest version, relative paths, image or WebP bytes, licenses, `compatiblePiHarness`, the npm `files` list, symlinks, and npm scripts.
4. Run `node scripts/contract-check.mjs` when the sibling Pi-Harness checkout is available. A failure means the starter rules no longer match Core.
5. A package under `@example` can be valid and still be rejected by Market. Market accepts only `^@piharness/(theme|pet)-[a-z0-9][a-z0-9-]*$`.
6. Do not delete the root skin files to make a theme pack pass.
