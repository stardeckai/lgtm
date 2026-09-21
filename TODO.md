# TODO

Deferred work, with the evidence that put it here. Newest at the top. Remove an item when it lands.

- **Harvest real positives for `mocks-seam-under-test`.** It has 10 real positives in the corpus, 4 held out;
  six prompt variants in round three could not separate the "stub feeds a fact the real code carries" negatives
  from the positives, and every held-out number for it rests on four cases. Pinned at 0.84 / 0.90 meanwhile.
- **Send `it.each` / `test.each` rows with sibling names.** `sibling_tests` carries names only, so a sibling whose
  name is a table template hides the refusing clauses in its rows; `happy-path-only-of-risky-boundary` has one
  real negative at 0.71 for exactly that reason, and it pins the fit at 0.80.
- **Real cases for the diff checks.** `changed-in-lockstep` and `regression-does-not-distinguish` have no real
  case at all; they need a PR-based harvest (before/after pairs), a different procedure from the block harvest.
- **Real positives for `setup-dominates`, `broad-snapshot`, `impossible-fixture`.** One real positive each.
- **`assertion-weaker-than-name` at the pin fires on three real train negatives** (0.84, 0.83, 0.69); the
  held-out side is clean. Read those three against the check before the next refit.
- **Fit the high-confidence line instead of stacking margins.** The fit adds one step above the last clean
  point and the high line adds 0.15 on top; fitting the high line directly and putting the worth-a-look line
  under it would give recall back at the line that counts.
- **Batching several blocks of one file into a request** is the only lever left on token cost; it changes the
  question shape and needs a live corpus rerun.
- **`changed-in-lockstep` is off by default** (`optIn`) until it has real positives: 9 real negatives, 1 real
  positive. `regression-does-not-distinguish` came back on after 41 real cases and a rewording (real held-out AUC
  0.94); its first full-branch `--diff` run on a fresh branch is still worth reading end to end.
- **`impossible-fixture` is off by default** (`optIn`) until a wording round against its real cases: 3 real
  positives (0.44, 0.45 and one at 0.23) rank under two real negatives (0.61, 0.70). The shape itself is rare:
  2 positives in 3,256 scored blocks and 45 files read across four open-source repos.
