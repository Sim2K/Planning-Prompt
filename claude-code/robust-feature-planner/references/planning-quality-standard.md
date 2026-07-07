# Planning Quality Standard

Use this reference to discover the system, choose an architecture, and review the final plan.

## Contents

1. Evidence discipline
2. Discovery matrix
3. Discovery scope and stop rule
4. Design maps
5. Architecture selection
6. Plan depth tiers
7. Conditional coverage
8. Task quality and traceability
9. Reviewing an existing plan
10. Final review gates

## Evidence Discipline

Classify material statements:

- **Observed**: verified in repository files, tools, logs, schemas, tests, or authoritative docs.
- **Inferred**: strongly suggested by evidence but not directly verified.
- **Unknown**: unavailable, ambiguous, inconsistent, or outside current access.

Attach a source path, symbol, schema object, tool result, or command to important observations when
practical. For each risky inference or unknown, state:

1. The assumption being made
2. The failure or rework it could cause
3. The exact inspection, owner decision, test, or spike needed to resolve it
4. The implementation phase that must wait for resolution

Record the evidence baseline (commit, branch, environment, or inspection date) in Document Control.
A plan ages: if implementation or re-review starts after the baseline has moved, re-verify the
Observed findings the chosen architecture depends on and record the differences before executing.

Inventory the existing automated tests that guard the flows the feature touches. A touched
invariant with no test coverage is a risk-register entry, not a footnote.

## Discovery Matrix

Inspect only relevant layers, but explicitly record whether each was checked or not applicable.

| Layer | Discover | Regression questions |
|---|---|---|
| Product | Users, jobs, critical flows, service levels | Which current behavior must remain unchanged? |
| Repository | Instructions, architecture, ownership, packages, tests | Where are the established extension seams? |
| UI | Routes, navigation, state, forms, accessibility, responsive behavior | Which loading, empty, error, disabled, success, and recovery states exist? |
| API | Routes, handlers, schemas, auth, errors, clients | Which callers and versions depend on current contracts? |
| Domain | Business rules, invariants, transactions, side effects | Where can partial work violate an invariant? |
| Data | Tables, relationships, indexes, policies, retention, read models | Can deployment, backfill, and rollback stay compatible? |
| Async | Queues, schedulers, webhooks, workers, retries | How are duplicates, ordering, poison events, and replay handled? |
| Integrations | Providers, limits, credentials, signatures, outages | Can the provider fail without blocking the core product? |
| Security | Identity, authorization, tenancy, secrets, audit, privacy | Could access cross a user, role, or tenant boundary? |
| Operations | Logs, metrics, traces, health, alerts, admin tools | Can support diagnose and repair failures safely? |
| Delivery | Environments, flags, migrations, deploy order, rollback | Which mixed-version states occur during rollout? |

## Discovery Scope And Stop Rule

Trace the feature's vertical slice first: entry point, boundary, domain logic, persistence, and
output. Widen only where the dependency map demands it.

Stop discovering when additional reading no longer changes a design decision. Then make the
boundary honest: list what was deliberately not inspected — and why skipping it is safe — as scoped
Unknowns in Current-State Findings.

Under-discovery produces guesses dressed as findings; unbounded discovery produces a stale plan and
an exhausted session. Both are failures.

## Design Maps

### Current-State Map

Trace where data enters, transforms, persists, leaves the system, and becomes visible. Include
ownership and trust boundaries.

### Dependency Map

Identify affected modules, consumers, data objects, permissions, jobs, external systems, tests,
documentation, deployment steps, and support processes. Separate direct dependencies from
possible blast-radius dependencies.

### Lifecycle Map

Cover applicable create, read, update, delete, sync, retry, disable, recover, audit, migrate,
deprecate, and removal behavior. Include cleanup of flags, compatibility shims, stale data, and
temporary migration paths.

### Failure-Mode Map

Consider invalid input, unauthenticated and unauthorized access, tenant confusion, timeout,
network loss, provider outage, rate limit, duplicate delivery, reordering, partial write, stale
schema, corrupt data, concurrency, backlog growth, cost or quota exhaustion, deploy failure,
rollback, and operator error.

For each material failure, decide:

- Fail open or closed, and why
- Retry policy, backoff, limits, and dead-letter behavior
- User/admin visibility
- Logging, metrics, alert threshold, and redaction
- Replay, reconciliation, repair, or compensation path

### Contract Map

Cover relevant inbound APIs, outbound calls, webhooks, callbacks, jobs, events, realtime channels,
batch imports/exports, media/file flows, and admin/configuration APIs.

Specify ownership, version, authentication, authorization, scopes, headers, request/response or
event shape, validation, status/error envelope, timeouts, idempotency, pagination, filtering,
sorting, ordering, deduplication, rate limits, redaction, compatibility, and contract tests.

### UX Map

Identify who configures, uses, approves, monitors, and recovers the feature. Plan navigation,
prerequisites, forms, validation, permission-aware controls, loading, empty, disabled, error,
success, confirmation, health, history, test/preview, and recovery states. Include accessibility,
responsive behavior, destructive-action safeguards, and common mistakes.

### Validation Map

Layer checks from cheapest to most realistic: formatting/static checks, type checks, unit tests,
integration tests, contract tests, authorization and tenant-isolation tests, failure-mode tests,
UI/accessibility checks, migration/backfill checks, end-to-end smoke tests, observability checks,
performance/capacity checks, staged-release checks, and rollback/repair drills.

## Architecture Selection

Compare at least three viable branches unless a hard constraint rules them out. Evaluate:

- Product and requirement fit
- Simplicity and number of new moving parts
- Compatibility and regression surface
- Security and privacy exposure
- Failure isolation and recovery
- Operational burden and observability
- Migration and rollout risk
- Reversibility
- Delivery effort
- Expected future change cost

Ground every option in discovered evidence: name the real files, modules, contracts, or tools it
would touch. An option that cites no evidence is a cosmetic variant, not a branch.

Choose the simplest robust modular design, not automatically the smallest diff or most scalable
design. Give each module one responsibility, a named owner, and a narrow interface. Keep optional
integrations off the critical path where possible.

## Plan Depth Tiers

Declare a depth tier in Document Control after discovery, with a one-line justification:

- **Small** — one module or page, no schema or contract changes, trivially reversible. Keep every
  required section, but compress the ones that do not apply into "Not applicable" with evidence.
- **Standard** — multiple modules, a contract or schema change, or a background job. Full template
  depth.
- **Critical** — money, tenancy, security boundaries, irreversible migrations, or shared-state
  concurrency. Full depth; strongly consider the Runtime Semantics Audit.

Right-sizing is part of the quality bar: a padded plan for a small change trains readers to skim,
and a skimmed plan protects nothing.

## Conditional Coverage

### Data and Persistence

Use discovered relationships rather than designing from the most obvious record alone. Define
ownership, constraints, indexes, access policies/RLS, transaction boundaries, retention,
archival/deletion, audit events, read models, schema evolution, backfill, deduplication,
reconciliation, repair, migration order, mixed-version behavior, and rollback.

### APIs and Integrations

Include concrete request/response or event examples when they reduce ambiguity. Design initial and
incremental sync, cursors, signature verification, token rotation/revocation, timeout budgets,
retry ownership, replay safety, provider quotas, webhook acknowledgement, and deprecation.

### Security and Privacy

Cover authentication, object/operation authorization, least privilege, tenant/user isolation,
secret storage, browser exposure, key rotation, consent, minimization, retention, deletion,
auditability, log redaction, abuse/rate limiting, and threat-focused tests.

### Operations and Support

Define structured logs, correlation IDs, metrics, traces, health checks, delivery/request history,
dashboards, alert ownership and thresholds, diagnostics, safe admin controls, replay/backfill,
reconciliation, runbook updates, quotas, and capacity limits.

Define performance and capacity expectations where relevant: latency budgets, expected data
growth, quota and rate-limit exhaustion, and the cost ceiling of expensive dependencies (external
APIs, storage, model calls).

### Rollout and Removal

Define flags/config gates, backwards-compatible deployment order, expand/migrate/contract stages,
staged cohorts, smoke checks, stop criteria, rollback, roll-forward, data repair, flag cleanup,
compatibility-shim removal, and feature decommissioning.

## Task Quality And Traceability

Every implementation task should identify:

- The component, module, schema object, or contract being changed
- The responsibility or behavior being introduced
- Dependencies and ordering constraints
- Compatibility and failure-isolation requirements
- Expected validation or acceptance evidence

Use stable IDs throughout the plan: assumptions `A1, A2, …`, risks `R1, R2, …`, tasks
`P<phase>.<n>` (for example `P1.2`). Make tasks reference what they resolve — "(resolves A2, R1)" —
so coverage is traceable in both directions. A risk that no task, test, or explicit non-goal
references is an uncovered risk, never silence.

Avoid tasks such as “update backend” or “add tests.” Split work along stable ownership boundaries,
not arbitrary file counts.

## Reviewing An Existing Plan

Preserve the plan's intent, trace its claims against the project evidence, then report findings
ranked by severity before repairing anything:

- **Blocking** — executing the plan as written would cause production damage, a regression, or a
  security/tenancy breach; or a required decision rests on evidence that does not exist.
- **Material** — a gap that invalidates a section: missing failure behavior, untraceable risk,
  assumed schema, absent rollback, unverified compatibility.
- **Minor** — clarity, consistency, or completeness issues that do not change the design.

Each finding cites the review gate or evidence it violates and states the repaired text. After
repair, rerun the structural validator and these gates. Do not expand scope merely to fill every
section; use explicit non-applicability where justified.

## Final Review Gates

- [ ] Project instructions and the real stack were inspected before design.
- [ ] Observations, inferences, unknowns, risks, and verification tasks are distinguishable.
- [ ] The evidence baseline is recorded and current, or re-verification is planned before implementation.
- [ ] Existing tests guarding the touched flows are named; untested invariants appear in the risk register.
- [ ] Goals, non-goals, invariants, and critical flows are explicit.
- [ ] At least three viable branches were compared, or the constraint preventing this is stated.
- [ ] Every branch option is grounded in discovered evidence, not presented as a cosmetic variant.
- [ ] The chosen architecture is the simplest robust modular option.
- [ ] The plan declares a depth tier justified by discovery; non-applicable sections say so with evidence.
- [ ] Every module has one responsibility, one owner, and one narrow interface.
- [ ] Optional and external dependencies cannot break the core flow.
- [ ] Every material failure defines open/closed behavior, retry, visibility, telemetry, and repair.
- [ ] Every write defines authorization, validation, duplicate handling, and partial-failure safety.
- [ ] Every read/sync defines permissions, pagination, filtering, ordering, and stale-data behavior.
- [ ] Contracts define versioning, compatibility, errors, rate limits, redaction, and tests.
- [ ] Data work defines constraints, indexes, policies, retention, migration, backfill, and rollback.
- [ ] Secrets define storage, access, rotation/revocation, and redaction.
- [ ] User and admin flows include loading, empty, disabled, error, success, and recovery states.
- [ ] Operations include useful telemetry, diagnostics, alert ownership, replay, and reconciliation — plus performance, capacity, and cost expectations where relevant.
- [ ] Rollout order supports mixed versions and includes stop, rollback, and repair paths.
- [ ] Tasks are dependency-ordered, scoped, assignable, and paired with acceptance evidence.
- [ ] Assumptions, risks, and tasks carry stable IDs, and every material risk traces to a task, test, or explicit non-goal.
- [ ] Validation covers security, failure modes, migrations, smoke tests, and rollback where relevant.
- [ ] The final note names inspected evidence, completed review gates, and remaining verification.
