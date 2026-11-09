# Pet packs

`pet-pack.json` follows the Pi-Harness pet loader.

Required: `id`, `name`, `nameEn`, `author`, `version`, `license`, `baseWidth`, `baseHeight`, `fps`, and `clips`. At most 256 clips. Each clip has at most 1024 frames. A frame file is `<clip-directory-name>_001.webp` and must be a real WebP.

`idle` or `defaultAnimation` is required. `agentStateMapping` may point `thinking`, `running`, and `success` at declared clips.

The pack contains no JavaScript and no npm scripts.

## Main package and part packages

A package is a main package when `package.json` has no `piHarness.partOf`. Pi-Harness lists and installs main packages. A part package sets `partOf` to the main package name. That field is the only marker. Package names are not special-cased.

The main package lists those part names in `piHarness.parts`. The two fields cannot both be set. Parts do not use npm `dependencies`.

```json
{
  "piHarness": {
    "kind": "pet",
    "compatible": ">=2.4.0",
    "parts": ["@piharness/pet-companion-part"]
  }
}
```

```json
{
  "piHarness": {
    "kind": "pet",
    "compatible": ">=2.4.0",
    "partOf": "@piharness/pet-companion"
  }
}
```

The main `pet-pack.json` lists every clip, including clips that ship in a part. A part directory contains `clips/` and does not contain `pet-pack.json`. Installing the main package downloads each part and copies those clip directories into the same pet. The pet id does not change. The Market does not show a part package.

`examples/split-pet` and `examples/split-pet-part` are the working example. Their names use `@example` so they are not official Market packages. A published pair uses `@piharness/pet-...` in `parts` and `partOf`.

Keep each published tarball under about 200MB. The public registry rejects a larger payload with HTTP 413. Publish the main package and its parts at the same version.
