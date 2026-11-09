# Pet packs

`pet-pack.json` follows the Pi-Harness pet loader.

Required: `id`, `name`, `nameEn`, `author`, `version`, `license`, `baseWidth`, `baseHeight`, `fps`, and `clips`. At most 256 clips. Each clip has at most 1024 frames. A frame file is `<clip-directory-name>_001.webp` and must be a real WebP.

`idle` or `defaultAnimation` is required. `agentStateMapping` may point `thinking`, `running`, and `success` at declared clips.

The pack contains no JavaScript and no npm scripts.
