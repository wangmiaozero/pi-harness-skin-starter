---
name: publish-pack
description: Prepare one Pi-Harness theme or pet pack for the official GitHub market. Use when the user asks how to submit a pack. Do not publish a release or push unless the user explicitly authorizes that exact command.
---

# Prepare a market pack

1. Run `node scripts/validate-pack.mjs <directory>`.
2. Run `node scripts/pack-check.mjs <directory>`.
3. If `marketEligible` is false, stop. An `@example` name can be valid and still stay out of the official market.
4. Tell the user to open a pull request that adds only that pack directory to `wangmiaozero/pi-Harness-packages`.
5. Do not run `npm publish`, `npm login`, or `git push`.
6. A package without `piHarness.partOf` is a main package. A part package sets `partOf` to the main package name and includes `clip-pack.json`. Each one is its own ZIP. Keep each ZIP under 650 MiB compressed.
