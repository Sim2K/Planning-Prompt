# Solutions Architect Pass (Optional Mode)

> **This reference is loaded ONLY when the Solutions Architect switch is ON.**
> When the switch is OFF, ignore this file entirely and plan exactly as the base
> skill does. Nothing here changes default behavior.

The base skill compares three architecture branches - Conservative, Modular/Scalable,
Fastest Acceptable. That comparison is real, but it operates at the top level. Once a
branch wins, the decisions that actually sink implementations live *inside* it: how a
new table is shaped, who is allowed to perform a write, when a value is resolved
versus snapshotted, what scope a setting lives at, whether data is seeded or
defaulted in code. The base template records those choices as prose inside "Chosen
Architecture", with the alternatives never enumerated - so the losing options are
never named, never checked against the code, and get re-litigated by the next
developer.

This mode exists to fix one thing: **decompose the winning branch into its real
sub-decisions, compare genuine options for each against project evidence, and record
why the losers lost - so the reasoning survives in the plan instead of dying in the
conversation.**

The pass is a worker, not a standard. Its output is a decision document - an *input*
to the plan. It does not replace the plan template, the risk register, the phased
tasks, the validation plan, or any base review gate. A Decision Record on its own
would fail the base validator, and that is correct.

---

## Prime directive

When this mode is ON, the agent decides at the right altitude and shows its work.

1. **Decompose before deciding.** Name the discrete sub-decisions inside the chosen
   branch before writing the design as prose. A design paragraph that quietly settles
   five contested choices is five unexamined decisions, not one examined one.
2. **Options are real or they are noise.** Each option must name what would actually
   be built differently - a different row shape, a different writer, a different
   scope. Cosmetic variants of the same idea do not count as options.
3. **Re-verify, don't trust.** Every load-bearing fact a decision rests on must be
   re-checked in the project itself - the file re-opened, the policy re-read, the
   migration re-traced - not carried forward from discovery notes on trust. The
   checker who did not write the brief sees what the author cannot.
4. **Losers get obituaries.** Every rejected option gets a concrete, evidence-cited
   reason it lost. "Rejected: worse" is not a reason. The rejection reasons are the
   most valuable part of the record - they are what stops a settled choice being
   re-opened by someone who never saw the evidence.
5. **Chosen is not correct.** A complete Decision Record proves the options were
   enumerated and evidence-checked, not that the winner is right. Every decision
   names the evidence that would overturn it.

---

## Auto-detect and offer (never auto-run)

The switch stays **manual**. But the planner should *notice* when a feature is the
kind whose winning branch hides several contested choices, and **offer** the pass in
plain language - without running it. The user always decides.

**When to offer.** During discovery and branch comparison, if any of these signals
appear, raise the offer once (and only if the switch is currently OFF):

- the chosen branch introduces a new table, queue, or contract whose shape, scope, or
  granularity could reasonably go more than one way
- the feature writes into another module's tables, permissions, or events - or its
  natural design would fail the other module's authorization rules
- the design must settle several interlocking choices at once (schema shape +
  permission model + scheduling + seeding, or similar)
- repository history or decision docs show a similar choice was made before and later
  reversed or migrated
- infrastructure gates (CI checks, migration rules, seeding constraints) could force
  a different product decision than the obvious one

**How to offer - layman's terms, explain the *why*.** Translate the risk; don't name
the jargon. Deliver the normal plan as usual, then append a short offer like:

> **Optional design deep-dive.** While planning this I noticed
> *<plain reason - e.g., "the winning design quietly settles several smaller choices:
> how the new table is shaped, who is allowed to write to it, and when the audience
> is decided - and each could be built more than one way">*. My plan picks one way
> for each, but only the top-level design was compared against alternatives. I can
> run an optional **Solutions Architect Pass**: break the chosen design into its
> individual decisions, compare real options for each against your actual code,
> double-check the facts each choice rests on, and give you a Decision Record showing
> why every losing option lost - so nobody re-litigates a settled choice later. It's
> off by default and I haven't run it. Want me to? - reply `+solutions-architect` or
> "yes, run it".

**Rules for the offer.** Make it once, not repeatedly. Never block or delay the
normal plan to ask. If the user accepts (`+solutions-architect`, "yes, run it", or
similar), treat the switch as ON for this plan and produce the full pass below
against the plan already delivered. If the user ignores or declines it, continue
normally and do not raise it again.

---

## The decomposition

A sub-decision earns a slot when choosing wrong would force a schema, contract,
permission, or data migration later - or create a support incident that a different
choice would have avoided. Give each one a stable ID (`D1`, `D2`, ...) so plan tasks
and risks can reference it, matching the base `A#`/`R#`/`P#.#` discipline.

Typical axes (a checklist, not a limit):

- **Data shape and granularity** - one row per recipient or one per group; wide or
  narrow; append-only or mutable.
- **Snapshot vs. resolve** - is a value (audience, price, permission) captured when
  queued or computed when acted on?
- **Write ownership** - who actually performs the insert into whose table, and under
  whose authorization?
- **Seed vs. default** - is configuration seeded per tenant at creation or defaulted
  in code until customized?
- **Scope level** - tenant, sub-tenant, per-site, per-user; the axis most often
  retro-fitted by painful migrations.
- **Permission model** - a new permission (and everything its seeding implies) or
  reuse of an existing one?
- **Delivery and scheduling** - synchronous, queued, cron, event-driven; who retries.
- **Integration seam** - direct call, definer function, bus event, shared table; how
  coupled the modules become.

If a genuinely contested axis is missing from this list, add it. If an axis does not
apply, skip it silently - the Decision Record lists real decisions, not a filled-in
checklist.

---

## Per-decision method

For each sub-decision:

1. **Enumerate three genuinely different options.** If only two viable options exist,
   say why - the same constraint rule as the base branch comparison. Options must
   differ in what gets built, not in how it is described.
2. **Validate every option against evidence actually read** - name the files,
   migrations, policies, CI scripts, or docs that make it viable or kill it. An
   option nobody checked is a guess wearing a label.
3. **Join facts across modules deliberately.** The killers usually live in the join:
   the write policy in one module versus who actually holds the permission in
   another; a CI seeding gate versus the cost of a new permission; an event that a
   design wants to consume but that nothing publishes. Ask for each option: *what
   fact in a different module or layer could make this fail?*
4. **Mine the repository's own history for precedent.** A prior migration that
   retro-fitted scope, a decisions doc, a note that a table stayed empty in
   production - these are evidence about which option survives contact with reality.
5. **Kill the losers with cited reasons** and record for the winner: *what evidence,
   if it turned up, would flip this decision.*

---

## Independent re-verification

Every Decision Record row is theatre unless the facts under it were re-checked.

- Before deciding, re-open the files behind each load-bearing fact rather than
  trusting discovery notes - authors trust facts they gathered themselves an hour
  earlier, and that trust is exactly the failure mode this step removes.
- Where the platform supports subagents or parallel sessions, prefer a fresh-context
  agent for this verification: a checker who did not write the brief re-reads the
  same files with different eyes. Where it does not, perform an explicit adversarial
  re-read inline - open the file again and try to *disprove* the recorded fact.
- Record each spot-check as **Confirmed**, **Contradicted**, or **Unverified**. A
  `Contradicted` fact re-opens every decision that rests on it. An `Unverified`
  load-bearing fact is named in the final delivery note as open.
- The pass is **read-only**, exactly like the base skill. Verification means
  reading, tracing, and running safe read-only checks - never editing.

---

## The Decision Record (required output)

Produced from `assets/solutions-architect-addendum.md`. Three parts, all required:

1. **Decision Table** - one row per sub-decision: ID, the decision, the chosen
   option, the losing options with why they lost, the evidence cited, and the
   confidence of the weakest fact it rests on (Observed / Inferred / Unknown).
2. **Option Analyses** - per decision, the enumerated options with their evidence and
   rejection reasons, plus the "what would flip this" line for the winner.
3. **Re-Verified Facts** - the load-bearing facts that were independently
   spot-checked, where they were re-checked, and the result
   (Confirmed / Contradicted / Unverified).

---

## Handoff back to the base plan

- Every `D#` must be referenced from the plan - in the Chosen Architecture, a
  design rule, a task, or a risk. A decision no part of the plan depends on is
  either not a decision or not recorded honestly.
- Decisions with `Unknown` confidence or `Unverified` facts become risk-register
  entries or open questions with verification tasks, per the base discipline.
- If the pass runs after a plan was already delivered and flips a decision, amend
  the plan, bump the plan version, and record the change in Document Control - the
  base revision rule applies.
- The plan remains the deliverable and must still pass every base review gate and
  the base validator. The Decision Record is an appendix, never a substitute.

---

## Standing caveat (reproduce verbatim in the plan)

> ⚠️ **Solutions Architect Pass - read before trusting it.** This record lists the
> sub-decisions inside the chosen architecture, the options compared for each, and
> why the losers lost. A complete Decision Record means the options were
> **enumerated and evidence-checked, not that the winner is proven correct**. Treat
> every decision resting on `Inferred` or `Unknown` facts - and every
> `Contradicted` or `Unverified` spot-check - as open until a human confirms the
> cited evidence.

---

## Added review gates (when this mode is ON)

- [ ] Every contested sub-decision inside the chosen branch has a Decision Table row
      with a stable `D#` ID, a chosen option, and named losing options.
- [ ] Every rejected option has a concrete rejection reason citing project evidence -
      no "rejected: worse", no uncited kills.
- [ ] Every load-bearing fact behind a decision was independently re-verified and
      recorded as Confirmed / Contradicted / Unverified; no decision rests silently
      on a Contradicted fact.
- [ ] Every `D#` is referenced from the plan body (architecture, design rule, task,
      or risk), and every flipped decision bumped the plan version.
- [ ] The standing caveat is reproduced verbatim; nothing in the record implies the
      chosen options are certified correct.

---

## Anti-patterns (auto-fail the spirit of this mode)

- Three phrasings of the same design presented as three options. - Options must
  differ in what gets built.
- "Rejected: more complex." - Name the complexity and the evidence; complexity
  compared to what, at what cost?
- Re-using discovery notes as verification. - Verification means the file was
  opened again, by fresh eyes where possible.
- A Decision Record that disagrees with the plan silently. - If a decision flips,
  the plan changes and its version bumps; the two never coexist in conflict.
- Decisions whose IDs nothing in the plan references. - Unwired decisions are
  decoration.
- Padding the record with uncontested choices to look thorough. - Fewer, real
  decisions beat a filled-in checklist.
