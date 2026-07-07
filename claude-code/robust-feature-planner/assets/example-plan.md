# Copy-Prompt Button Implementation Plan (Worked Example)

This is the bundled worked example: a real, Small-tier plan for the promotional website that ships
in the planner's own repository. It shows what right-sizing looks like — every required section is
present, and sections that do not apply say so with evidence instead of being padded. It passes
`validate_plan.py --strict`.

## Document Control

- Status: Example (treat as Draft)
- Version: 1.0.0
- Owner: Veedence website maintainer
- Last updated: 2026-07-07
- Depth tier: Small — one static page, no backend, no schema or contract changes
- Scope: Planning only; implementation requires explicit approval
- Evidence baseline: repository state at commit 65a93bb
- Change log: 1.0.0 — first complete plan

## Feature Summary

Add a "Copy the prompt" button to the landing page hero so visitors can copy the full raw planning
prompt to the clipboard in one click, instead of opening the Markdown file and copying it manually.

## Current-State Findings

- Observed: the site is a static Vite + TypeScript build; page composition lives in `src/main.ts`
  and content strings in `src/content.ts`.
- Observed: the raw prompt lives at repository root in
  `Veedence.co.uk-Robust-Feature-Planning-Prompt.md`; the site links to it but does not embed it.
- Observed: no backend, API routes, or database exist in the repository; hosting is a static
  deploy.
- Inferred: the hero call-to-action block is animated by GSAP, so a new button must join the
  existing animation timeline rather than fight it.
- Unknown: clipboard behavior in older Safari and locked-down browsers; needs a manual device
  test.
- Existing tests: none — `npm run check` type-checks only, so no automated test guards the page;
  manual verification carries the regression risk (see R2).
- Not inspected: `dist/` build output and deployment host settings; both are generated or external
  and the change is additive.

## Assumptions And Open Questions

- [ ] A1 — The prompt text can be imported at build time from the Markdown file — risk: an
  embedded copy drifts from the source file — verify with a Vite raw-import spike — resolve in
  Phase 0

## Goals And Non-Goals

### Goals

- A visitor copies the complete, current prompt in one click, with visible success feedback.

### Non-Goals

- No prompt customization, templating, or analytics on copy events.

## Non-Negotiable Design Rules

- Existing navigation, theme persistence, and animations keep working unchanged; the button is
  additive and backward compatible with the current page version.
- The page stays fully static: no network calls, no external scripts.

## Risk And Issue Register

| ID | Risk or issue | Impact | Likelihood | Mitigation | Verification or owner |
|---|---|---|---|---|---|
| R1 | Clipboard API unavailable or denied | Copy silently fails | Medium | Fall back to selecting the prompt text for manual copy | P2.1 manual browser matrix |
| R2 | Embedded prompt drifts from the source Markdown | Visitors copy a stale prompt | Medium | Build-time import from the source file, never a pasted copy | P1.1 acceptance evidence |

## Branch Review And Chosen Architecture

### Option 1 — Conservative

Link the button to the raw Markdown file on the repository host and let visitors copy manually.
No JavaScript and no drift risk, but a worse experience that leaves the page. Touches only the
markup in `src/main.ts`.

### Option 2 — Modular

Import the prompt at build time into `src/content.ts` (the single owner of page content) and add a
small copy module: a `navigator.clipboard` write with a select-text fallback. Clean boundary,
testable, and the page stays static.

### Option 3 — Fastest Acceptable

Hardcode the prompt string directly in `src/main.ts` next to the button handler. Fastest to ship,
but it duplicates the prompt (guaranteeing drift risk R2) and mixes content with composition.

### Chosen Architecture

Option 2. It is the simplest design that removes the drift risk (R2) and isolates the new behavior
in one module. Option 1 was rejected for experience, Option 3 for guaranteed drift. Evidence that
could change this: if the build-time import proves impossible (A1), fall back to Option 1.

## Module Map

| Module | Single responsibility | Owner | Inputs/outputs | Failure isolation |
|---|---|---|---|---|
| prompt-content (in `src/content.ts`) | Owns the embedded prompt text | Site maintainer | Markdown file in, exported string out | Build fails loudly if the source file is missing |
| copy-button (new, small) | Clipboard write and user feedback | Site maintainer | Click in, copied/fallback state out | A copy failure never breaks the rest of the page |

## Data And Persistence Plan

Not applicable. Observed: this is a static site with no database, storage, or server code in the
repository; the feature stores nothing.

## API, Event, And Contract Plan

Not applicable. Observed: no inbound or outbound APIs exist; the Clipboard API is a local browser
capability and no versioned contract is created.

## UI/UX Plan

The button sits in the hero call-to-action group beside the existing links. States: idle ("Copy
the prompt"), success ("Copied"), and failure (a short message with the prompt text pre-selected
for manual copy). Feedback is announced through an aria-live region, the control is
keyboard-focusable, and reduced-motion users get a non-animated state change. Both themes (dark
and light) are checked.

## Security And Privacy Plan

No secrets, tokens, or user data are involved. The clipboard is written only on an explicit user
gesture, which is the browser permission model for clipboard writes; nothing is ever read from the
clipboard. No analytics or third-party calls are added, and the page remains public with no
authorization tiers.

## Failure Isolation And Recovery Plan

The clipboard write is wrapped so rejection (permission denied or unsupported browser) falls back
to selecting the prompt text for manual copy. The user can retry by clicking again, and repeated
copies are idempotent — the same text is written, so duplicate clicks are harmless. No partial
state exists to repair; a page reload fully recovers.

## Operations, Observability, And Support Plan

Static hosting keeps operations minimal: deploy logs on the host confirm each release, and a
post-deploy Lighthouse pass plus a manual copy check act as the smoke test. No metrics or alerting
are added at this tier — a copy failure is user-visible and self-recoverable, which is the
accepted support model for a Small change. Capacity and cost are unaffected: the embedded prompt
adds a few kilobytes to the bundle.

## Rollout, Migration, And Rollback Plan

Ship in one release from the main branch. No migration and no feature flag are needed at this
size; the change is additive. Rollback: revert the commit and redeploy the previous build — the
static host makes rollback a one-step operation.

## Implementation Phases With Checklist Tasks

### Phase 0 — Resolve Blocking Evidence

- [ ] P0.1 Spike the build-time raw import of the prompt Markdown (resolves A1) — a build succeeds
  with the file embedded

### Phase 1 — Content Foundation

- [ ] P1.1 Export the prompt text from `src/content.ts` via build-time import (resolves R2) — the
  rendered string matches the source file byte for byte

### Phase 2 — Button And States

- [ ] P2.1 Add the copy button with clipboard write, select-text fallback, and aria-live feedback
  (resolves R1) — manual matrix: current Chrome, Firefox, Safari, plus a keyboard-only pass
- [ ] P2.2 Join the existing hero animation timeline and verify reduced-motion behavior — visual
  check in both themes

## Validation Plan

- [ ] `npm run check` passes (type safety)
- [ ] Manual copy test on the browser matrix, including the fallback path (resolves R1)
- [ ] Keyboard and screen-reader pass for the new control
- [ ] Dark/light theme and reduced-motion visual checks
- [ ] Post-deploy smoke: copy the prompt from production and diff it against the source file
  (resolves R2)

## Done Criteria

- [ ] A visitor copies the full current prompt in one click with visible confirmation
- [ ] The copied text is byte-identical to the source Markdown file
- [ ] Existing navigation, theme, and animation behavior is unchanged
- [ ] The fallback path works where the Clipboard API is unavailable

## Final Review Note

Inspected: `src/main.ts`, `src/content.ts`, `package.json`, the repository structure (confirming
no backend), and the raw prompt file location. Review gates were run against the planning quality
standard; conditional sections are marked not applicable with evidence. Remaining before
implementation: the A1 build-time import spike and the Safari clipboard verification (R1). This
plan was validated with `validate_plan.py --strict`.
