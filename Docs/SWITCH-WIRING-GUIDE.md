# Switch Wiring Guide — Runtime Semantics Audit (optional mode)

**Goal:** add an opt-in switch that turns on the Runtime Semantics Audit. When the
switch is **OFF (default), behavior is byte-for-byte identical to today.** When
**ON**, the planner additionally produces the Invariants Ledger + Reviewer Hotlist
and runs the extra validator.

You are adding three small, clearly-marked hooks. The *content* lives entirely in the
three new files; the existing files only gain a gated "if switch ON, also do this"
pointer.

---

## 0. Files to drop in (no edits, just add)

Copy these into **both** skill packages so Claude and Codex stay identical:

```
claude-code/robust-feature-planner/references/runtime-semantics-audit.md
claude-code/robust-feature-planner/assets/runtime-semantics-addendum.md
claude-code/robust-feature-planner/scripts/validate_runtime_semantics.py

openai-codex/robust-feature-planner/references/runtime-semantics-audit.md
openai-codex/robust-feature-planner/assets/runtime-semantics-addendum.md
openai-codex/robust-feature-planner/scripts/validate_runtime_semantics.py
```

(For the raw prompt `.md`, the methodology gets inlined — see step 3.)

---

## 1. Define the switch

**Default: OFF.** Activate when the user's request contains any of:

- Canonical token: `+runtime-audit` or `RUNTIME-AUDIT: ON`
- Natural-language aliases: "runtime audit", "deep runtime", "fundamentals mode",
  "expose your assumptions", "where might you be wrong"

Keep it **manual**. Do **not** advertise auto-triggering in the skill `description`
frontmatter — the heavy path is for serious users who ask for it, not the average
vibe coder.

---

## 2. Hook into `SKILL.md` (Claude and Codex)

Add **two** bounded blocks. Both go inside the Planning Workflow after *Step 6
(Review and Repair)* and before *Step 7 (Deliver)*. The first is always-on (detect &
offer); the second runs only when the switch is ON. Do not change any other step.

**Block A — always on: detect and offer (never auto-run).** This runs on every plan,
including with the switch OFF. It only *offers*; it never produces the audit by
itself.

```markdown
<!-- BEGIN: Runtime Semantics Audit — detect & offer (always on, never auto-runs) -->
### 6a. Offer the Runtime Semantics Audit (only when not already ON)

If the switch is OFF, scan discovery for runtime-risk signals: writes to a
record other paths can also write (money, balances, inventory, counters, status);
background jobs/queues/webhooks/retries; caches, connection pools, or shared
in-memory state; async/await, threads, or workers; or existing locks/transactions/
idempotency in nearby code.

If any appear, deliver the normal plan as usual, then append a one-time offer in
plain language — translate the risk, do not name the jargon, and say why it's being
offered without being asked. Example:

> **Optional deeper check.** While reading your project I noticed <plain reason, e.g.
> "this feature updates the same balance other requests can change at the same
> moment">. When two things happen at once, code like this can quietly do the wrong
> thing — double charges, oversold stock, a number that ends up wrong — and those
> bugs rarely show up in a quick read or basic tests. I can run an optional Runtime
> Semantics Audit: I'll show where my plan is *assuming* the timing, ownership, and
> database behavior work a certain way, flag where I'm most likely wrong, and give
> you a short checklist for a human to verify before merge. It's off by default and I
> haven't run it. Want me to? — reply `+runtime-audit` or "yes, run it".

Offer once only. Never block or delay the plan to ask. If the user accepts, treat the
switch as ON and run step 6b against the plan already delivered. If declined or
ignored, continue normally and do not raise it again.
<!-- END: Runtime Semantics Audit — detect & offer -->
```

**Block B — only when the switch is ON** (either requested up front, or accepted from
the offer above):

```markdown
<!-- BEGIN: Runtime Semantics Audit switch (optional, default OFF) -->
### 6b. Runtime Semantics Audit (only if switch is ON)

This step runs **only** when the request contains an activation token
(`+runtime-audit`, `RUNTIME-AUDIT: ON`), an equivalent phrase ("runtime audit",
"deep runtime", "fundamentals mode"), or the user accepted the 6a offer. If none
apply, skip this step entirely — produce the normal plan with no changes.

When ON:

1. Read `references/runtime-semantics-audit.md` and follow its prime directive:
   expose assumptions, lead with "where I am most likely wrong," never certify.
2. During discovery, also capture the runtime model (execution model, DB isolation
   level in effect, pools/lifetime, delivery semantics, existing guards).
3. After the base plan, append the addendum using
   `assets/runtime-semantics-addendum.md`: a filled **Invariants Ledger** (rows
   ordered blast-radius DESC, confidence ASC) and a ranked **Reviewer Hotlist**.
4. Reproduce the standing caveat verbatim. A green ledger is an invitation to
   review, not a certificate.
5. Apply the added review gates from the reference. If saving Markdown, also run:
   `python scripts/validate_runtime_semantics.py path/to/plan.md --strict`
6. In the final delivery note, point the reader at the Reviewer Hotlist as the diffs
   where a fundamentals-strong human review is non-optional before merge.
<!-- END: Runtime Semantics Audit switch -->
```

The Codex `SKILL.md` gets the **same** blocks (only the surrounding platform wording
differs, exactly as the two packages already differ).

---

## 3. Hook into the raw prompt (`Veedence.co.uk-Robust-Feature-Planning-Prompt.md`)

The raw prompt has no file system, so inline the switch.

**3a.** Add an optional placeholder near `<FEATURE_REQUEST>` / `<PROJECT_CONTEXT>`:

```
<RUNTIME_AUDIT>
OFF   <!-- set to ON to force the runtime-semantics audit (thread safety,
           memory/resource ownership, transaction isolation, ordering) -->
</RUNTIME_AUDIT>
```

**3b.** Add a gated instruction block to the prompt body:

```markdown
IF <RUNTIME_AUDIT> is ON:
After the normal plan, add a "Runtime Semantics Audit" section. Argue against your
own design: expose every assumption about thread/async safety, memory & resource
ownership, transaction isolation, and ordering/delivery. For each, give the runtime
condition under which it breaks and the concrete corruption that follows. Produce:
(a) an Invariants Ledger table — columns: Resource/path | Assumption | Axis |
Confidence (Observed/Inferred/Unknown) | If wrong -> divergence | Diff-level check —
ordered by blast-radius then lowest confidence first; and (b) a ranked Reviewer
Hotlist of the <=5 lowest-confidence, highest-blast items, each with location, the
one runtime question, the evidence that settles it, and blast radius. Reproduce this
caveat verbatim: "A green ledger is an invitation to review, not a certificate."
Lead with where you are most likely wrong. If shared state, writes, or concurrency
exist, "no concerns" is not allowed — state what you'd need to observe and mark it
Unknown.
IF <RUNTIME_AUDIT> is OFF: ignore this block entirely.

ALWAYS (even when OFF): if discovery shows the feature writes to shared records
(money, inventory, counters, status), or involves jobs/queues/webhooks/retries,
caches/pools/shared memory, async/threads, or existing locks/transactions, then after
the normal plan add a one-time, plain-language offer that says what you noticed and
why it matters (e.g. "two things happening at once can double-charge or lose a
number"), notes the audit is optional and not yet run, and tells the user to reply
`+runtime-audit` to run it. Offer once; never block the plan; if accepted, run the
block above against the plan you delivered.
```

---

## 4. (Optional) Wire the switch into the existing validator

Keeps one command for users who want it, without altering default validation.
Add a `--runtime` flag to `validate_plan.py` that defers to the new script:

```python
# in validate_plan.py argument parser
parser.add_argument("--runtime", action="store_true",
                    help="Also run the Runtime Semantics Audit checks (switch ON).")

# after the existing structural checks succeed:
if args.runtime:
    import subprocess, sys, os
    rc = subprocess.call([sys.executable,
        os.path.join(os.path.dirname(__file__), "validate_runtime_semantics.py"),
        args.path] + (["--strict"] if args.strict else []))
    if rc != 0:
        sys.exit(rc)
```

Without `--runtime`, `validate_plan.py` behaves exactly as it does today.

---

## 5. (Optional) Docs

- README "8 Thinking Disciplines" → mention a **9th, opt-in** discipline (Runtime
  Semantics) available via the switch; note it is OFF by default.
- Strengthen the validator caveat line to add: a green Runtime Semantics ledger is an
  *invitation to review, not a certificate*.
- Keep template/reference/validator **identical** across the Claude and Codex
  packages, per the existing contribution rule.

---

## 6. Acceptance test (prove OFF is unchanged, ON adds the audit)

1. **OFF, no risk:** run a request with no token and no concurrency/shared-state
   signals. Output must match current behavior — no audit, no offer. Diff against a
   pre-change run; expect none.
2. **OFF, risk present (the offer):** run a request that touches shared writes / jobs
   / async with no token. Output must be the normal plan **plus** a one-time
   plain-language offer, and must **not** contain the audit itself. Replying
   `+runtime-audit` then produces the full audit against that plan.
3. **ON:** repeat with `+runtime-audit` appended up front. Output must add the
   section, the ledger (≥1 filled row per applicable axis), the Hotlist, and the
   caveat — with no offer (it's already on).
4. **Validator:** `python scripts/validate_runtime_semantics.py plan.md --strict`
   passes on the ON plan; `--self-test` passes; `--scan` flags an ON-worthy plan that
   forgot the section.
