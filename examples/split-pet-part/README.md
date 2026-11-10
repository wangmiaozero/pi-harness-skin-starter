# @example/pet-split-pet-part

Part package. `piHarness.partOf` names the main package. Without that field, this directory would be a main package.

It has `clips/` and `clip-pack.json`. It does not include `pet-pack.json`. Pi-Harness lists it in the Market. Installing it merges `clips/wave` into the installed `@example/pet-split-pet`. If that pet is missing, Pi-Harness installs the main package first.

This directory is one action pack. Keep its ZIP under 650 MiB compressed.
