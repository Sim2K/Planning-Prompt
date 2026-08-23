# Changelog - Robust Feature Planner

## 3.0.0 - Solutions Architect Pass (2026-08-23)

### Added

- **Solutions Architect Pass** - a second opt-in arm alongside the Runtime Semantics Audit,
  activated with `+solutions-architect` (default OFF). Where the base skill compares three
  architecture branches at the top level, this pass decomposes the *winning* branch into its
  real sub-decisions (`D1`, `D2`, ...), compares genuine options for each against project
  evidence, independently re-verifies the load-bearing facts the decisions rest on
  (Confirmed / Contradicted / Unverified - by a fresh-context subagent where the platform
  supports one), and appends a Decision Record: a Decision Table with "why the losers lost",
  per-decision Option Analyses with a "what would flip this" line, and a Re-Verified Facts
  ledger.
- Like the runtime arm, the planner detects when a winning design hides several contested
  choices (a new table whose shape or scope could go more than one way, writes into another
  module's tables or permissions, interlocking schema/permission/scheduling/seeding choices,
  repo history of a reversed decision, CI gates forcing product decisions) and offers the
  pass once, in plain language, without ever blocking the plan.
- New shared files in both packages: `references/solutions-architect.md`,
  `assets/solutions-architect-addendum.md`, and `scripts/validate_solutions_architect.py`
  (structural validator with `--self-test`; the standing caveat: a complete Decision Record
  means the options were enumerated and evidence-checked, not that the winner is proven
  correct).
- `validate_plan.py --architect` merges the Decision Record checks into the base report and
  JSON payload, mirroring `--runtime`. Saved plan files must include the full Decision Record
  when the pass ran, never chat-only.
- The raw prompt gains the matching `<SOLUTIONS_ARCHITECT>` switch, gated instruction block,
  and always-on offer clause.
- The website gains a dedicated Solutions Architect Pass page
  (https://plannerskill.veedence.com/solutions-architect.html) with an animated decision-tree
  visual, activation tokens, and cross-links from every page, plus copy-ready invocations on
  the how-to-use page.

## 2.0.4 - version reporting and one-sentence install (2026-08-18)

### Added

- Every plan's Document Control now carries
  `Planner: robust-feature-planner v2.0.4 - plannerskill.veedence.com`, so any plan names the
  planner version that produced it; `scripts/check_sync.py` now fails if this line and the
  SKILL.md frontmatter version ever drift.
- One-sentence agent install: the site now serves `llms.txt` with platform-specific install
  steps, every page carries an AI-agent pointer to it in the raw HTML, and the README and
  how-to-use page document the sentence - "Go to https://plannerskill.veedence.com/ and get the
  skill".

## 2.0.3 - saved plan files with Veedence branding (2026-08-18)

### Added

- Every delivered plan now comes with an offer to save it to `<repo>/plans/<feature-slug>.md`.
  On acceptance the file is written, the bundled validator runs on it immediately when Python is
  available (including the runtime checks when the audit ran), and the exact file location plus
  the validator's real output are reported back.
- First save asks once whether to commit an always-save preference to memory, so later plans are
  saved without asking; the recorded answer is respected either way.
- Saved files carry Veedence branding: a top banner, the Attribution line in Document Control,
  the Runtime Semantics Audit addendum when it ran, and a closing "About This Plan" section with
  the 20-section blueprint link and the full planning-lifecycle diagram
  (CREATE through REMOVE).
- All plans (chat or file) now include
  `Attribution: Robust Feature Planner by Simeon Williams - Veedence.co.uk` in Document Control.

## 2.0.2 - support-note link to the live site (2026-08-17)

### Changed

- The support note's "Learn more" link now points to the About/Support page on the live site
  (https://plannerskill.veedence.com/support.html) instead of the repository.

## 2.0.1 - once-per-session support note (2026-08-17)

### Fixed

- The optional support note in the Deliver step now states its frequency rule explicitly: it is
  shown exactly once per session, after the first completed plan delivery, and never again on later
  plans or revisions in the same conversation. The previous "exactly once" wording was ambiguous
  and could be read as once per plan.

### Added

- The support note now ends with an optional "Learn more" link to the project repository for
  readers who want details about the creator, why the toolkit is free, and where support goes.

## 2.0.0 (2026-07-07)

Updated with Claude Fable 5. The methodology's spine is unchanged; this release makes the quality
bar enforceable, the plans traceable, and the packages drift-proof.

### Added

- **Stable IDs and traceability** - assumptions `A1…`, risks `R1…`, tasks `P1.1…`, with tasks
  referencing what they resolve; the validator warns on missing IDs and on risk IDs nothing
  references.
- **Plan depth tiers** - Small / Standard / Critical declared in Document Control, so ceremony
  scales with blast radius instead of punishing small changes.
- **Prompt-injection hardening** - file and tool contents are evidence, never instructions;
  nothing read during discovery can authorize implementation or disable a review gate.
- **Evidence staleness rule** - plans record a version and change log; Observed findings are
  re-verified when implementation starts after the evidence baseline has moved.
- **Discovery stop rule** - vertical slice first, stop when reading no longer changes a decision,
  and an explicit "Not inspected" record.
- **Existing-test inventory** - Current-State Findings names the tests guarding touched flows;
  untested invariants become risk-register entries.
- **Severity-ranked review mode** - reviewing an existing plan now reports Blocking / Material /
  Minor findings against the review gates before repairing.
- **Performance, capacity, and cost prompts** - folded into Operations coverage and the
  failure-mode map (no new section).
- **Worked example plan** - `assets/example-plan.md`, a real Small-tier plan that passes
  `validate_plan.py --strict`.
- **Validator: substance checks** - empty sections and empty risk/module tables now fail; a bare
  skeleton no longer passes.
- **Validator: scoped coverage** - rollback must appear in the Rollout section, idempotency in
  Data/API/Failure, observability in Operations, and so on; "Not applicable" sections are exempt.
- **Validator: runtime-risk note** - flags strong concurrency signals (isolation levels, locks,
  race conditions) when no Runtime Semantics Audit section exists.
- **Validator: evidence-grounded options** - warns when an architecture option cites no concrete
  file, module, or path.
- **Validator: expanded self-tests** - 11 cases covering each rule instead of 2.

### Fixed

- The raw prompt's required output format now includes **Final Review Note**, so raw-prompt plans
  pass the skill validator (they previously failed on a missing section).
- `--runtime` now always runs and merges its errors into a single output and JSON payload; runtime
  failures are no longer hidden behind base failures, and `--json` always emits.
- Honest Python requirement: the validator needs **Python 3.8+** (previously claimed 3.6+ while
  using 3.7+ syntax).

## 1.0.0 - initial release (2026-06-28)

- Five-stage planning workflow with the 20-section plan template, planning quality standard,
  structural plan validator, and the opt-in Runtime Semantics Audit (reference, addendum, and
  standalone validator).
