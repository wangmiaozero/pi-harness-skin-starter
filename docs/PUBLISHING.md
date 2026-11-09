# Publishing

Validate, then dry-run:

```bash
node scripts/validate-pack.mjs <pack-directory>
node scripts/pack-check.mjs <pack-directory>
```

Market installs only packages whose names match:

```text
^@piharness/(theme|pet)-[a-z0-9][a-z0-9-]*$
```

`@example/...` packages are for local checks. They are not official.

Before publishing, the logged-in account must be allowed to publish `@piharness`. Check that with `npm whoami` and `npm access list packages @piharness`. Then, inside that one package directory:

```bash
npm publish --access public
```

Do not run that command from this starter repository. Do not add install scripts. A published name is not reusable as a different package, and versions older than 72 hours cannot be removed.

A part package has `piHarness.partOf`. Publish it separately, at the same version as its main package, and keep each tarball under about 200MB. Pi-Harness installs the main package and merges the parts. See `docs/PET_PACK.md` and `examples/split-pet`.
