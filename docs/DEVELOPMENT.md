# Development

Skin Protocol v1 stays at the repository root: `pi-harness-skin.json`, `skin.schema.json`, and `assets/`. Pi-Harness imports that directory from Settings → Theme → Import Skin. Do not change `id` after it has been imported.

Theme and pet packages are created outside that root:

```bash
node scripts/create-theme.mjs my-theme --out ../my-theme
node scripts/create-pet.mjs my-pet --out ../my-pet
```

`--official` sets the package name to `@piharness/theme-<slug>` or `@piharness/pet-<slug>`. It does not log in and it does not grant the scope.

Convert a skin without editing it:

```bash
node scripts/migrate-skin.mjs . ../theme-my-custom-skin
```

The generated theme pack copies the accent and bitmaps. The original skin remains the color-token import.

`examples/split-pet` is a main pet package. `examples/split-pet-part` sets `piHarness.partOf` and can be installed on its own. Validate each directory:

```bash
node scripts/validate-pack.mjs examples/split-pet
node scripts/validate-pack.mjs examples/split-pet-part
```
