---
name: create-pet
description: Create an independent Pi-Harness pet npm package. Use when the user asks for a desktop pet pack, pet-pack.json, or animation frames for Pi-Harness.
---

# Create a pet pack

1. Read `AGENTS.md`. Do not edit the Pi-Harness application.
2. Choose a kebab-case slug. The pet id inside `pet-pack.json` uses that slug. The default package name is `@example/pet-<slug>`.
3. Use `--official` only when the user explicitly owns `@pi-harness`.
4. Run `node scripts/create-pet.mjs <slug> --out <new-directory>`.
5. Replace the sample frames with real WebP files named `<clip>_001.webp`, `<clip>_002.webp`, and so on. Frame counts in the manifest must match the files.
6. Keep `idle` and map `thinking`, `running`, and `success` in `agentStateMapping`.
7. Set `fps` from 1 to 60. Durations, when present, must be one per frame and between 16 and 10000.
8. Run `node scripts/validate-pack.mjs <directory>` and `node scripts/preview-pack.mjs <directory>`.
9. Run `node scripts/pack-check.mjs <directory> --write --out <tarball-directory>`.
10. Report the pet id, package name, frame count, and tarball. Do not run `npm publish`.
11. Leave `piHarness.partOf` unset unless the user asked for a part package. A part package sets `partOf` to the main package name, omits `pet-pack.json`, and contains only its `clips/`. The main package lists that name in `piHarness.parts`. Copy the shape from `examples/split-pet` and `examples/split-pet-part`.
