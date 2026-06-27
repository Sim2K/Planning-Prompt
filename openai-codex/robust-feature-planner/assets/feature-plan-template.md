# <Feature Name> Implementation Plan

## Document Control

- Status: Draft
- Owner: <Owner or team>
- Last updated: <YYYY-MM-DD>
- Scope: Planning only; implementation requires explicit approval
- Evidence baseline: <Commit, branch, environment, or inspection date>

## Feature Summary

<User outcome, business value, boundaries, and proposed direction.>

## Current-State Findings

- Observed: <Finding and evidence>
- Inferred: <Inference, supporting evidence, and confidence>
- Unknown: <Unknown, risk, and verification task>

## Assumptions And Open Questions

- [ ] <Assumption or question — risk — owner/source — decision deadline>

## Goals And Non-Goals

### Goals

- <Measurable outcome>

### Non-Goals

- <Explicitly excluded behavior>

## Non-Negotiable Design Rules

- <Invariant, compatibility boundary, security rule, or critical flow to preserve>

## Risk And Issue Register

| Risk or issue | Impact | Likelihood | Mitigation | Verification or owner |
|---|---|---|---|---|
| <Risk> | <Impact> | <Likelihood> | <Mitigation> | <Task or owner> |

## Branch Review And Chosen Architecture

### Option 1 — Conservative

<Design, benefits, costs, regression surface, and rollback characteristics.>

### Option 2 — Modular/Scalable

<Design, benefits, costs, regression surface, and rollback characteristics.>

### Option 3 — Fastest Acceptable

<Design, benefits, costs, regression surface, and rollback characteristics.>

### Chosen Architecture

<Decision, reasons, rejected branches, tradeoffs, and evidence that could change the decision.>

## Module Map

| Module | Single responsibility | Owner | Inputs/outputs | Failure isolation |
|---|---|---|---|---|
| <Module> | <Responsibility> | <Owner> | <Narrow contract> | <Behavior> |

## Data And Persistence Plan

<Existing relationships, proposed changes, constraints, indexes, access policies, retention,
transactions, migration order, backfill, reconciliation, repair, and rollback. Use “Not applicable”
with evidence when no persistence work is required.>

## API, Event, And Contract Plan

<Inbound/outbound/admin/sync interfaces; auth; versions; payloads; errors; idempotency; pagination;
ordering; limits; compatibility; and contract tests. Use “Not applicable” with evidence when no
contract work is required.>

## UI/UX Plan

<Placement, setup, permissions, validation, loading/empty/disabled/error/success states,
accessibility, responsiveness, health/history, testing, and recovery. Use “Not applicable” with
evidence when no UI work is required.>

## Security And Privacy Plan

<Authentication, authorization, isolation, least privilege, secrets, rotation, consent, retention,
audit, redaction, abuse controls, and security tests.>

## Failure Isolation And Recovery Plan

<Failure behavior, retries, timeouts, duplicate handling, partial writes, degradation, replay,
reconciliation, operator actions, and user/admin messaging.>

## Operations, Observability, And Support Plan

<Logs, metrics, traces, correlation, dashboards, alerts, diagnostics, health, quotas, admin tools,
runbooks, and support ownership.>

## Rollout, Migration, And Rollback Plan

<Flags, compatible deployment order, migration/backfill, cohorts, smoke checks, stop criteria,
rollback/roll-forward, repair, cleanup, and removal.>

## Implementation Phases With Checklist Tasks

### Phase 0 — Resolve Blocking Evidence

- [ ] <Resolve an unknown or decision gate — acceptance evidence>

### Phase 1 — Contracts And Foundations

- [ ] <Create the compatibility-safe foundation — acceptance evidence>

### Phase 2 — Core Implementation

- [ ] <Implement one module or vertical slice — acceptance evidence>

### Phase 3 — Integration And UX

- [ ] <Connect modules without placing optional work on the critical path — acceptance evidence>

### Phase 4 — Rollout And Cleanup

- [ ] <Stage release, verify, and remove temporary paths — acceptance evidence>

## Validation Plan

- [ ] Static, formatting, and type checks
- [ ] Unit and invariant tests
- [ ] Integration and contract tests
- [ ] Authorization, isolation, privacy, and abuse tests
- [ ] Failure-mode, retry, replay, and partial-write tests
- [ ] UI, accessibility, and responsive checks
- [ ] Migration, backfill, reconciliation, and rollback checks
- [ ] End-to-end smoke, observability, and staged-release checks

## Done Criteria

- [ ] <User-visible outcome and acceptance criterion>
- [ ] <Compatibility and non-regression criterion>
- [ ] <Security and privacy criterion>
- [ ] <Operational readiness and recovery criterion>
- [ ] <Rollout, documentation, and cleanup criterion>

## Final Review Note

<Name the inspected evidence, review gates completed, and validation still required before
implementation.>
