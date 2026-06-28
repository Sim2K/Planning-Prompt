# Runtime Semantics Audit (Optional Mode)

> **This reference is loaded ONLY when the Runtime Semantics Audit switch is ON.**
> When the switch is OFF, ignore this file entirely and plan exactly as the base
> skill does. Nothing here changes default behavior.

Most plans describe *what* the system should do. They rarely state the invisible,
non-local properties that decide whether the code is actually correct at runtime:
**thread/async safety, memory and resource ownership, and transaction isolation.**
These don't appear in a function signature or a quick read. They emerge only from
how the code meets the scheduler, the connection pool, and concurrent callers — and
they are exactly the properties an AI writes confidently and *cannot reliably tell
you where it got wrong.*

This mode exists to fix one thing: **force the agent to expose its runtime
assumptions instead of burying them, and shape the output so a fundamentals-strong
human can audit them fast.** It does not manufacture that human. It points them at
the right diff.

---

## Prime directive

When this mode is ON, the agent argues **against** its own design.

1. **Expose, don't reassure.** Lead with *"here is where I am most likely wrong,"*
   never *"here is proof I am right."* The output is a witness statement against the
   code, not a defense of it.
2. **State the divergence point.** For every runtime assumption, name the exact
   runtime condition under which it breaks and the concrete corruption that follows.
   An assumption with no stated failure is not an assumption — it is a hope. Remove
   it or complete it.
3. **A green ledger is an invitation to review, not a certificate.** Passing the
   validator means the agent *wrote its assumptions down*, not that they are true.
   Reproduce the standing caveat (below) verbatim in the plan.
4. **Silence is not an answer.** If the feature touches shared mutable state, writes,
   async/concurrent paths, caches, queues, pools, or transactions, "no concurrency
   concerns" is **not** an acceptable output. State instead what you would need to
   *observe in the runtime* to be sure, and mark it `Unknown`.

---

## Auto-detect and offer (never auto-run)

The switch stays **manual**. But the planner should *notice* when a feature is the
kind that usually needs this audit and **offer** it in plain language — without
running it. The user always decides.

**When to offer.** During discovery, if any of these signals appear, raise the offer
once (and only if the switch is currently OFF):

- the feature writes to the same record/row that other paths can also write (money,
  balances, inventory, counters, status flags)
- background jobs, queues, webhooks, schedulers, or retries are involved
- caches, connection pools, or shared in-memory state are touched
- async/await, threads, workers, or "happens at the same time" behavior exists
- locks, transactions, or idempotency already appear in the surrounding code

**How to offer — layman's terms, explain the *why*.** Translate the risk; don't name
the jargon. Deliver the normal plan as usual, then append a short offer like:

> **Optional deeper check.** While reading your project I noticed
> *<plain reason — e.g., "this feature updates the same account balance that other
> requests can change at the same moment">*. When two things happen at once, code
> like this can quietly do the wrong thing — double charges, oversold stock, a number
> that ends up wrong — and those bugs rarely show up in a quick read or basic tests.
> I can run an optional **Runtime Semantics Audit**: I'll lay out exactly where my
> plan is *assuming* the timing, ownership, and database behavior work a certain way,
> flag where I'm most likely wrong, and give you a short checklist for a human to
> verify before merge. It's off by default and I haven't run it. Want me to? — reply
> `+runtime-audit` or "yes, run it".

**Rules for the offer.** Make it once, not repeatedly. Never block or delay the normal
plan to ask. If the user accepts (`+runtime-audit`, "yes, run it", or similar), treat
the switch as ON for this plan and produce the full audit below against the plan you
already delivered. If the user ignores or declines it, continue normally and do not
raise it again.

---

## The axes to audit

Cover each axis that applies. The first three are mandatory whenever shared state,
writes, or concurrency exist. The fourth is the catch-all — **do not stop at three
if the runtime offers more ways to diverge.**

1. **Thread / async safety** — what actually runs concurrently; shared mutable state;
   re-entrancy; single-threaded-event-loop vs thread-pool vs multiprocess
   assumptions; objects/clients/sessions assumed safe to share across tasks or
   threads; callback re-entrancy.
2. **Memory & resource ownership / lifetime** — who creates, owns, and
   closes/frees/returns each connection, handle, buffer, lock, subscription, file, or
   session; ownership transfer across `await`/thread boundaries; use-after-close,
   double-close, leaks. *(Stack-agnostic: in garbage-collected languages this is
   resource-handle and lifetime ownership — the pooled connection, the open cursor,
   the held lock — not manual memory.)*
3. **Transaction isolation & atomicity** — the isolation level **actually in effect**
   (not assumed); read-modify-write races; what is atomic vs. what needs an explicit
   transaction; lost updates, phantoms, write skew; the gap between "the DB
   transaction" and "the business operation that must be all-or-nothing."
4. **Ordering, visibility & delivery, and other runtime divergences** — happens-before
   / memory-visibility, event ordering, at-least-once vs exactly-once, idempotency as
   the antidote; plus any other nondeterminism the runtime introduces (clock skew,
   timezone/locale, floating-point, GC pauses affecting timeouts, signal handling,
   retries changing side-effect counts).

---

## Discovery you must do first (so labels mean something)

Every ledger row is theatre unless the runtime model was actually inspected. Before
writing the ledger, discover and record (Observed / Inferred / Unknown):

- **Execution model** — event loop, thread pool, multiprocess, worker concurrency,
  max in-flight requests per resource.
- **Database isolation** — the *default* isolation level and every place it is
  overridden; advisory/row locks; `SELECT … FOR UPDATE` usage.
- **Pools & lifetime** — connection/object pool config; per-request vs shared
  client/session lifetime.
- **Delivery semantics** — queue/webhook guarantees (at-least-once? ordered?
  exactly-once?) and existing idempotency mechanisms.
- **Existing guards** — locks, unique constraints, idempotency keys, optimistic
  version columns already protecting the invariants you are about to touch.

Regression question for this layer: *Which existing invariants are protected only by
the current concurrency assumptions, and does this change widen who runs
concurrently?*

---

## The Invariants Ledger (required output)

One row per shared/mutable resource or concurrent path. **Order rows by
`blast-radius DESC, confidence ASC`** — the most dangerous, least-certain assumption
goes first. Money, data corruption, and security come before cosmetics.

Each row must fill **all six** columns. A row missing the "If wrong → divergence" or
"Diff-level check" column is invalid.

| Column | What it states |
| --- | --- |
| **Resource / path** | The concrete thing: a column, a cache entry, a pool, a handler, a counter, a session. |
| **Assumption** | The runtime-semantics belief the design relies on, in one line. |
| **Axis** | thread/async · ownership/lifetime · tx-isolation · ordering/other. |
| **Confidence** | `Observed` / `Inferred` / `Unknown` (reuse the base evidence discipline). |
| **If wrong → divergence** | The exact runtime condition that breaks it **and** the concrete corruption. *"Two concurrent requests at READ COMMITTED → read-modify-write loses an update → balance overdrawn."* |
| **Diff-level check** | What the human reviewer looks for in the eventual code to confirm or refute it: the lock, the `FOR UPDATE`, the idempotency key, the per-request session, the ownership transfer. |

Minimum content rule: if any mandatory axis applies to the feature, produce **at
least one row per applicable axis**, or explicitly state why that axis is `Unknown`
and what observation would resolve it.

---

## Reviewer Hotlist (required output)

The base skill ends with "what I inspected." This mode adds "what *you* must inspect,
and where." Produce a **ranked** list of the up-to-5 lowest-confidence, highest-blast
items pulled from the ledger. Each entry states:

- **Location** — file / module / contract where it will live (best known).
- **The one runtime question** the reviewer must answer.
- **Evidence that settles it** — the test, trace, or code read that turns `Unknown`
  into `Observed`.
- **Blast radius** — what breaks in production if it is wrong.

Close the Hotlist with one line, verbatim:

> These are the diffs where a senior, fundamentals-strong review is **non-optional**
> before merge.

---

## Standing caveat (reproduce verbatim in the plan)

> ⚠️ **Runtime Semantics Audit — read before trusting it.** This ledger lists where
> the plan's assumptions about thread safety, memory/resource ownership, and
> transaction isolation could diverge from the runtime. A complete, green ledger is
> an **invitation to review, not a certificate** of correctness — it proves the
> assumptions were written down, not that they are true. Treat every `Inferred` and
> `Unknown` row as an open question for a human who knows the fundamentals.

---

## Added review gates (when this mode is ON)

- [ ] Every shared mutable resource and concurrent path has a ledger row with a
      confidence label and a stated "if wrong → divergence."
- [ ] The transaction isolation level actually in effect is stated (`Observed`), and
      every concurrent read-modify-write is either proven safe or assigned a named
      guard (lock / `FOR UPDATE` / idempotency key / atomic op / version column).
- [ ] Resource/memory ownership — who creates, owns, and closes/frees, and across
      which async/thread boundaries — is defined for the connections, handles, locks,
      and sessions the feature touches.
- [ ] The Reviewer Hotlist names the lowest-confidence items ranked by blast radius,
      each with the diff-level check the human must perform.
- [ ] The standing caveat is reproduced verbatim; nothing in the plan implies the
      ledger certifies correctness.

---

## Anti-patterns (auto-fail the spirit of this mode)

- "No concurrency concerns." — Not allowed when shared state/writes/async exist;
  state what you'd need to observe instead and mark `Unknown`.
- Listing only the assumptions you are confident in. — The weakest rows lead.
- A divergence column that says "may cause issues." — Name the runtime condition and
  the concrete corruption, or delete the row.
- Wording that reads as reassurance ("this is safe because…"). — Reframe as "this is
  safe **only if** … ; here is how to check."
