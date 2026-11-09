# @example/pet-split-pet-part

Part package. `piHarness.partOf` is the identifier. Without that field, this directory would be a main package.

It has clip files only. It does not include `pet-pack.json`. Pi-Harness does not list it in the Market and rejects installing it on its own. The main package `@example/pet-split-pet` downloads it and merges `clips/wave`.

Publish this package and the main package at the same version. Keep each tarball under about 200MB. The public registry rejects a larger payload with HTTP 413.
