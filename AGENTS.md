# Skin Starter agent instructions

This repository holds two compatible protocols. Do not collapse them into one package.

## Skin Protocol v1

- Keep the root `pi-harness-skin.json` compatible with `skin.schema.json` and `schemaVersion: 1`.
- Never change `id` after a user has imported the skin.
- Skin images belong under `assets/` and must be PNG, JPEG, or WebP, each below 12 MiB.
- A skin directory that Pi-Harness imports must not contain JavaScript, CSS, SVG, remote URLs, or HTML.
- Wallpaper text must stay readable. Portraits need a transparent background and safe margins.
- Preview images are 16:10 and must match the skin.

## Theme and pet packs

- Create packs with `scripts/create-theme.mjs` and `scripts/create-pet.mjs`.
- Those scripts, skills, and docs are starter tools. They are not imported as a skin.
- Generated packs must stay valid under Theme Pack Protocol v1 or the existing pet-pack protocol.
- A package is a main package unless `piHarness.partOf` names its main package. A part package is shown in the Market and can be installed alone; it merges into that pet. `piHarness.parts` is optional and means the main install also downloads those parts. Do not invent a second marker or hardcode package names.
- Do not add npm scripts or executable files to a generated pack.
- `@piharness` in a generated name does not grant Market publishing rights.
- Migrate with `scripts/migrate-skin.mjs`. Leave the source `pi-harness-skin.json` in place.

## Scope

- Do not edit the Pi-Harness application repository from this project.
- Do not publish npm, log in, or push git unless the user explicitly asks for that command.
- Validate with `scripts/validate-pack.mjs` and `scripts/contract-check.mjs` before finishing a pack change.
