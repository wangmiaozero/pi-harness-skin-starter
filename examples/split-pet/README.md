# @example/pet-split-pet

Main pet package. It has no `piHarness.partOf`, so Pi-Harness treats it as the package to install and show.

`piHarness.parts` names the child package. The `wave` clip is not in this directory. Installing this package downloads `@example/pet-split-pet-part` and merges `clips/wave` into the same pet. The pet id stays `split-pet`.

This example uses `@example` names. A package published to the Market uses `@pi-harness/pet-...` in both `parts` and `partOf`. The template does not grant that scope.
