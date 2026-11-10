# Preview

```bash
node scripts/preview-pack.mjs <pack-directory>
```

The command reads `theme-pack.json` or `pet-pack.json` and the files they name. It writes `<pack>/.preview/index.html` with those bytes embedded. Open that file locally. No npm account, registry, or model key is used.

A missing manifest file or a missing asset exits with an error. `.preview/` is not part of the pack ZIP.
