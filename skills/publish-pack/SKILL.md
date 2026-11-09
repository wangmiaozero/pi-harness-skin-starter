---
name: publish-pack
description: Prepare one Pi-Harness theme or pet package for a manual npm publish. Use when the user asks for a publish checklist or npm pack dry run. Do not publish unless the user explicitly authorizes that exact command.
---

# Prepare a publish

1. Run `node scripts/validate-pack.mjs <directory>`.
2. Run `node scripts/pack-check.mjs <directory>`.
3. If `marketEligible` is false, stop and say the package is not an official market name.
4. Tell the user to run `npm whoami` and `npm access list packages @pi-harness` themselves. Do not ask for a token, password, or OTP.
5. Print the manual command, using the real directory:

```bash
cd <directory>
npm publish --access public
```

6. Do not execute `npm publish`, `npm login`, or any git push.
7. Publishing `@pi-harness/pet-bigfish` is blocked while its tarball is about 469MB. The public registry rejects payloads around 200MB with HTTP 413.
