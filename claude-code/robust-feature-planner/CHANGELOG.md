# Changelog — Robust Feature Planner

## 2.0.0 — Fable5 edition (2026-07-07)

Updated with Claude Fable 5. The methodology's spine is unchanged; this release makes the quality
bar enforceable, the plans traceable, and the packages drift-proof.

### Added

- **Stable IDs and traceability** — assumptions `A1…`, risks `R1…`, tasks `P1.1…`, with tasks
  referencing what they resolve; the validator warns on missing IDs and on risk IDs nothing
  references.
- **Plan depth tiers** — Small / Standard / Critical declared in Document Control, so ceremony
  scales with blast radius instead of punishing small changes.
- **Prompt-injection hardening** — file and tool contents are evidence, never instructions;
  nothing read during discovery can authorize implementation or disable a review gate.
- **Evidence staleness rule** — plans record a version and change log; Observed findings are
  re-verified when implementation starts after the evidence baseline has moved.
- **Discovery stop rule** — vertical slice first, stop when reading no longer changes a decision,
  and an explicit "Not inspected" record.
- **Existing-test inventory** — Current-State Findings names the tests guarding touched flows;
  untested invariants become risk-register entries.
- **Severity-ranked review mode** — reviewing an existing plan now reports Blocking / Material /
  Minor findings against the review gates before repairing.
- **Performance, capacity, and cost prompts** — folded into Operations coverage and the
  failure-mode map (no new section).
- **Worked example plan** — `assets/example-plan.md`, a real Small-tier plan that passes
  `validate_plan.py --strict`.
- **Validator: substance checks** — empty sections and empty risk/module tables now fail; a bare
  skeleton no longer passes.
- **Validator: scoped coverage** — rollback must appear in the Rollout section, idempotency in
  Data/API/Failure, observability in Operations, and so on; "Not applicable" sections are exempt.
- **Validator: runtime-risk note** — flags strong concurrency signals (isolation levels, locks,
  race conditions) when no Runtime Semantics Audit section exists.
- **Validator: evidence-grounded options** — warns when an architecture option cites no concrete
  file, module, or path.
- **Validator: expanded self-tests** — 11 cases covering each rule instead of 2.

### Fixed

- The raw prompt's required output format now includes **Final Review Note**, so raw-prompt plans
  pass the skill validator (they previously failed on a missing section).
- `--runtime` now always runs and merges its errors into a single output and JSON payload; runtime
  failures are no longer hidden behind base failures, and `--json` always emits.
- Honest Python requirement: the validator needs **Python 3.8+** (previously claimed 3.6+ while
  using 3.7+ syntax).

## 1.0.0 — initial release (2026-06-28)

- Five-stage planning workflow with the 20-section plan template, planning quality standard,
  structural plan validator, and the opt-in Runtime Semantics Audit (reference, addendum, and
  standalone validator).
