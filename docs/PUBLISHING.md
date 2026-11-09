# Publishing

Validate, then dry-run:

```bash
node scripts/validate-pack.mjs <pack-directory>
node scripts/pack-check.mjs <pack-directory>
```

Market installs only packages whose names match:

```text
^@pi-harness/(theme|pet)-[a-z0-9][a-z0-9-]*$
```

`@example/...` packages are for local checks. They are not official.

Before publishing, the logged-in account must be allowed to publish `@pi-harness`. Check that with `npm whoami` and `npm access list packages @pi-harness`. Then, inside that one package directory:

```bash
npm publish --access public
```

Do not run that command from this starter repository. Do not add install scripts. A published name is not reusable as a different package, and versions older than 72 hours cannot be removed.
