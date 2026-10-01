# Pi-Harness skin agent instructions

- Only modify this skin project. Never edit the Pi-Harness application repository.
- Keep `pi-harness-skin.json` compatible with `skin.schema.json` and `schemaVersion: 1`.
- Use lowercase kebab-case for `id`; never change the id after users import the skin.
- Assets must be local PNG, JPEG, or WebP files under `assets/`.
- Do not add JavaScript, CSS, SVG, remote URLs, executable files, or embedded HTML.
- Keep each image below 12 MiB. Prefer WebP for wallpapers and PNG/WebP for transparent portraits.
- Wallpaper must keep application text readable behind translucent panels.
- Portrait art must use transparent background and generous safe margins.
- Preview should be 16:10 and accurately represent the final wallpaper, portrait, and color tokens.
- Finish by validating every referenced asset path and summarizing manifest/token changes.
