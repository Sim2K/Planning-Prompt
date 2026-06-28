<!--
Runtime Semantics Audit — output addendum.
Appended to the plan ONLY when the switch is ON.
Replace every <…> placeholder. Unresolved <…> placeholders fail validation.
Delete any axis subsection that genuinely does not apply, but state why in the row notes
rather than silently dropping a mandatory axis (thread/async, ownership, tx-isolation).
-->

## Runtime Semantics Audit

> ⚠️ **Runtime Semantics Audit — read before trusting it.** This ledger lists where the plan's assumptions about thread safety, memory/resource ownership, and transaction isolation could diverge from the runtime. A complete, green ledger is an **invitation to review, not a certificate** of correctness — it proves the assumptions were written down, not that they are true. Treat every `Inferred` and `Unknown` row as an open question for a human who knows the fundamentals.

**Runtime model discovered:** execution=<event-loop|thread-pool|multiprocess|workers>, DB default isolation=<level + Observed/Inferred/Unknown>, pools/lifetime=<…>, delivery semantics=<at-least-once|exactly-once|ordered|n/a>, existing guards=<locks/unique constraints/idempotency keys/version columns or "none found">.

### Invariants Ledger

> Ordered by blast-radius DESC, confidence ASC. Most dangerous, least-certain row first.

| Resource / path | Assumption | Axis | Confidence | If wrong → divergence | Diff-level check |
| --- | --- | --- | --- | --- | --- |
| <resource> | <one-line assumption> | <thread/async\|ownership\|tx-isolation\|ordering/other> | <Observed\|Inferred\|Unknown> | <runtime condition → concrete corruption> | <what the reviewer looks for in the code> |
| <resource> | <…> | <…> | <…> | <…> | <…> |
| <resource> | <…> | <…> | <…> | <…> | <…> |

### Reviewer Hotlist

> The lowest-confidence, highest-blast items from the ledger. Read these diffs closely.

1. **<location / file / contract>** — Question: <the one runtime question>. Settles it: <test/trace/code read>. Blast radius: <what breaks in prod>.
2. **<location>** — Question: <…>. Settles it: <…>. Blast radius: <…>.
3. **<location>** — Question: <…>. Settles it: <…>. Blast radius: <…>.

These are the diffs where a senior, fundamentals-strong review is **non-optional** before merge.
