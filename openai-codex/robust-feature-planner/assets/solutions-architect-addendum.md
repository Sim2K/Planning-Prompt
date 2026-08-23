<!--
Solutions Architect Pass - output addendum (the Decision Record).
Appended to the plan ONLY when the switch is ON.
Replace every <…> placeholder. Unresolved <…> placeholders fail validation.
List only genuinely contested sub-decisions - do not pad with uncontested choices.
Keep the number of Decision Table rows, Option Analyses entries, and D# IDs in step.
-->

## Solutions Architect Decision Record

> ⚠️ **Solutions Architect Pass - read before trusting it.** This record lists the sub-decisions inside the chosen architecture, the options compared for each, and why the losers lost. A complete Decision Record means the options were **enumerated and evidence-checked, not that the winner is proven correct**. Treat every decision resting on `Inferred` or `Unknown` facts - and every `Contradicted` or `Unverified` spot-check - as open until a human confirms the cited evidence.

**Chosen branch decomposed:** <branch name from Branch Review> into <N> sub-decisions. Verification mode: <fresh-context subagent | inline adversarial re-read>.

### Decision Table

> One row per contested sub-decision. Confidence is the weakest fact the decision rests on.

| ID | Sub-decision | Chosen option | Losing options → why they lost | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- |
| D1 | <the decision in one line> | <what will be built> | <option B - concrete cited reason it lost; option C - concrete cited reason> | <files/migrations/policies read> | <Observed\|Inferred\|Unknown> |
| D2 | <…> | <…> | <…> | <…> | <…> |
| D3 | <…> | <…> | <…> | <…> | <…> |

### Option Analyses

> Per decision: the real options, what killed the losers, and what would flip the winner.

#### D1 - <sub-decision title>

- **Option A (chosen): <name>.** <what gets built; the evidence that supports it>.
- **Option B: <name>.** Rejected: <concrete reason citing project evidence>.
- **Option C: <name>.** Rejected: <concrete reason citing project evidence>.
- **What would flip this:** <the evidence that, if found, overturns the choice>.

#### D2 - <sub-decision title>

- **Option A (chosen): <…>.** <…>
- **Option B: <…>.** Rejected: <…>.
- **Option C: <…>.** Rejected: <…>.
- **What would flip this:** <…>.

### Re-Verified Facts

> The load-bearing facts behind the decisions, independently spot-checked - not carried forward from discovery notes on trust.

| Fact the decisions rest on | Re-checked where | Result | Decisions affected |
| --- | --- | --- | --- |
| <the claim, in one line> | <file/policy/migration re-opened> | <Confirmed\|Contradicted\|Unverified> | <D1, D3> |
| <…> | <…> | <…> | <…> |

Every decision above is referenced from the plan body (architecture, design rules, tasks, or risks). Any decision resting on a `Contradicted` or `Unverified` fact is open - re-confirm the evidence before implementation.
