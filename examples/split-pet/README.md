# @example/pet-split-pet

Main pet package. It has no `piHarness.partOf`, so Pi-Harness installs it as its own pet.

The `wave` clip is not in this directory. It lives in `@example/pet-split-pet-part`. That package is listed separately. Installing it adds `clips/wave` to this pet. The pet id stays `split-pet`.

This example uses `@example` names. A package published to the Market uses `@piharness/pet-...` in `partOf`. The template does not grant that scope.
