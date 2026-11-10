# Publishing

Validate the pack, then check the files that would go into its ZIP:

```bash
node scripts/validate-pack.mjs <pack-directory>
node scripts/pack-check.mjs <pack-directory>
```

`node scripts/pack-check.mjs <pack-directory> --write` writes `<directory>-v<version>.zip` next to the pack. That ZIP is the file GitHub Releases hosts for one pack. It is not an npm tarball.

Market installs only packages whose names match:

```text
^@piharness/(theme|pet)-[a-z0-9][a-z0-9-]*$
```

`@example/...` packages are for local checks. They are not official, and using `--official` only changes the name. It does not list the pack.

Official packs live in [pi-Harness-packages](https://github.com/wangmiaozero/pi-Harness-packages). Send a pull request that adds one pack directory. After it is reviewed and merged to `main`, GitHub Actions publishes that directory's ZIP and updates the market catalog. Do not send the Skin Starter project itself as a pack.

A part package has `piHarness.partOf` and `clip-pack.json`. It is a separate directory and a separate ZIP. Pi-Harness shows it in the Market. Installing it merges those clips into the main pet. See `docs/PET_PACK.md` and `examples/split-pet`.

Keep each ZIP under 650 MiB compressed and 750 MiB unpacked. Raise `package.json` `version` before replacing a pack that was already published. The same version with different files is rejected.
