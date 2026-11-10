# Pet packs

`pet-pack.json` follows the Pi-Harness pet loader.

Required: `id`, `name`, `nameEn`, `author`, `version`, `license`, `baseWidth`, `baseHeight`, `fps`, and `clips`. At most 256 clips. Each clip has at most 1024 frames. A frame file is `<clip-directory-name>_001.webp` and must be a real WebP.

`idle` or `defaultAnimation` is required. `agentStateMapping` may point `thinking`, `running`, and `success` at declared clips.

The pack contains no JavaScript and no npm scripts.

## Main package and part packages

A package is a main package when `package.json` has no `piHarness.partOf`. A part package sets `partOf` to the main package name. That field is the only marker. Package names are not special-cased. Pi-Harness lists both, and a part can be downloaded on its own.

`piHarness.parts` is optional. When the main package lists part names there, installing the main package also downloads those parts. Leave `parts` unset when each part should be a separate download. The two fields cannot both be set. Parts do not use npm `dependencies`. A main package can list at most 8 parts.

```json
{
  "piHarness": {
    "kind": "pet",
    "compatible": ">=2.4.0",
    "partOf": "@piharness/pet-companion"
  }
}
```

The main `pet-pack.json` lists only the clips that ship in the main package. A part contains `clips/` and `clip-pack.json`, and does not contain `pet-pack.json`. `clip-pack.json` uses the same clip objects as `pet-pack.json`. Installing the part copies those clips into the installed main pet and adds them to that pet's manifest. If the main pet is not installed yet, Pi-Harness installs the main package first. The pet id does not change. Uninstalling the part removes only its clips.

`examples/split-pet` and `examples/split-pet-part` are the working example. Their names use `@example` so they are not official Market packages. A published pair uses `@piharness/pet-...` in `partOf`.

Keep each published tarball under about 200MB. The public registry rejects a larger payload with HTTP 413. Publish the main package and each part on its own. A part does not have to share the main package version unless `parts` makes the main install download it.
