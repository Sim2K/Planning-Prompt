<div align="center">

# 🧭 Veedence Robust Feature Planner

#### Created through a collaboration between **Z.ai GLM 5.2** × **Codex 5.5**

### 🌐 Check it out!→ **[plan-prompt.netlify.app](https://plan-prompt.netlify.app/)** — the full interactive experience.

### Plan before AI builds — as a **prompt**, a **Claude Code skill**, an **OpenAI Codex skill**, and an interactive website.

Turn vague feature requests into evidence-grounded, production-ready implementation plans. Discover the real system first, map failure modes, compare architectures, and return a checklist-driven plan with rollback baked in — **no code changes, no assumptions from memory, no “AI, just make me a feature” gamble.**

<br>

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Markdown](https://img.shields.io/badge/Markdown-✓-083CA1.svg?logo=markdown&logoColor=white)
![Stack Agnostic](https://img.shields.io/badge/Stack-Agnostic-2EA44F.svg)
![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757.svg?logo=anthropic&logoColor=white)
![Codex](https://img.shields.io/badge/OpenAI%20Codex-Skill-10A37F.svg?logo=openai&logoColor=white)
![Works With](https://img.shields.io/badge/Also%20Works-GPT%20%7C%20Gemini%20%7C%20Cursor-8A2BE2.svg)
![Website](https://img.shields.io/badge/Website-Vite%20%7C%20TypeScript%20%7C%20GSAP-38E881.svg)

<br>

**Three ways to use the same discipline, one polished place to understand it.** Copy-paste the prompt into any LLM, *or* install the packaged skill in Claude Code or Codex for a template, a quality standard, and an automated plan validator.

</div>

---

## 📑 Table of Contents

| | Section | | Section |
|:---:|:---|:---:|:---|
| 🎯 | [What Is This?](#-what-is-this) | 🌐 | [Promotional Website](#-promotional-website) |
| 🧰 | [Three Ways To Use It](#-three-ways-to-use-it) | 📝 | [The Raw Prompt (Any LLM)](#-the-raw-prompt-any-llm) |
| 🧠 | [Prompt vs. Skill — Which Should I Use?](#-prompt-vs-skill--which-should-i-use) | 🛡️ | [What It Enforces](#%EF%B8%8F-what-it-enforces) |
| ⚡ | [Claude Code Skill](#-claude-code-skill) | 🤖 | [Codex Skill](#-openai-codex-skill) |
| ✅ | [The Plan Validator](#-the-plan-validator) | ❓ | [FAQ](#-faq) |
| 🗺️ | [The Output Blueprint](#%EF%B8%8F-the-output-blueprint) | 📁 | [Repo Structure](#-repo-structure) |

---

## 🎯 What Is This?

Ask an AI to *"plan this feature"* and you usually get a confident to-do list that **skips discovery, ignores failure modes, and quietly assumes your stack.** Weeks later you discover it forgot idempotency, missed a rollback, or assumed a schema that doesn't exist.

This project packages a single, opinionated discipline that fixes that — available in three forms:

1. 🔎 **Discover the real project first** — read actual code, schema, and config; never guess from memory.
2. 🧱 **Design modularly** — every module owns one responsibility and talks through a narrow, typed contract.
3. 💥 **Plan for failure** — what fails open vs. closed, what retries, what alerts, what can be replayed or repaired.
4. 🛡️ **Treat security, UX, and rollout as first-class** — not afterthoughts bolted on at the end.

> 💡 **The result:** a plan that's safe to execute in real production, modular enough to evolve, and explicit about how it avoids regressions.

---

## 🌐 Promotional Website

> 🟢 **Live site:** **[plan-prompt.netlify.app](https://plan-prompt.netlify.app/)** — the cinematic, interactive home for the planner. Source for the site lives in this repo (`src/`, `public/`, `index.html`).

This repository now includes a premium, responsive landing page that explains why **pre-planning beats asking AI to immediately build a feature**. It carries Veedence's green/violet identity into a more cinematic product experience with:

- A production-focused prompt-first vs. plan-first comparison
- The five-stage Veedence planning method and eight thinking disciplines
- Direct links to the Claude Code skill, Codex skill, and raw Markdown prompt
- Persistent dark and light modes
- GSAP/ScrollTrigger motion, Lenis smooth scrolling, and reduced-motion fallbacks
- Accessible navigation, keyboard focus, mobile layouts, and static-host-friendly output

### Run it locally

```bash
npm install
npm run dev
```

### Validate and build

```bash
npm run check
npm run build
npm run preview
```

The production build is written to `dist/`. Vite uses relative asset paths so the output can be hosted from a subdirectory such as GitHub Pages.

---

## 🧰 Three Ways To Use It

| | 📝 Raw Prompt | 🧭 Claude Code Skill | 🤖 Codex Skill |
|:--|:--|:--|:--|
| **Best for** | Any LLM, one-off plans | Claude Code users, repeat work | OpenAI Codex users |
| **Setup** | Copy-paste into chat | Drop into `skills/` folder | Drop into `skills/` folder |
| **Plan template** | Embedded in prompt | Bundled, auto-applied | Bundled, auto-applied |
| **Quality standard** | Embedded in prompt | Bundled reference doc | Bundled reference doc |
| **Automated validator** | ✗ (manual) | ✅ (`validate_plan.py`) | ✅ (`validate_plan.py`) |
| **Auto-triggers on intent** | ✗ | ✅ matches your goal | ✅ matches your goal |
| **Location in repo** | [`Veedence.co.uk-…Prompt.md`](./Veedence.co.uk-Robust-Feature-Planning-Prompt.md) | [`/claude-code`](./claude-code/robust-feature-planner/) | [`/openai-codex`](./openai-codex/robust-feature-planner/) |
| **Download** | `.md` file | [`.zip`](./robust-feature-planner-claude.zip) | [`.zip`](./robust-feature-planner-codex.zip) |

---

## 🧠 Prompt vs. Skill — Which Should I Use?

<details open>
<summary><b>Use the <b>skill</b> if you plan features regularly in Claude Code or Codex.</b></summary>

The skill is the prompt *plus* superpowers: it **auto-triggers** when you describe a planning task, **applies a structured plan template** so output is always consistent, is guided by a **quality-standard reference** that prevents blind spots, and can run an **automated validator** that catches missing sections, unresolved placeholders, and missing coverage before you ever act on the plan.

</details>

<details>
<summary><b>Use the <b>raw prompt</b> if you're in ChatGPT, Gemini, Cursor, or any other LLM.</b></summary>

The raw prompt is fully self-contained and works in any model. It encodes the same discipline — discover, map, compare, review — as plain text you paste into a chat. You lose auto-triggering and the automated validator, but you keep the entire planning methodology. It's also the foundation the skills were built from.

</details>

> 🪜 **New here?** Read the [raw prompt](./Veedence.co.uk-Robust-Feature-Planning-Prompt.md) first to understand the thinking, then install the skill for your tool to use it on autopilot.

---

## ⚡ Claude Code Skill

The packaged skill for [Claude Code](https://claude.com/claude-code). Once installed, Claude plans features like a senior engineer — and can validate the plan structurally.

### Install (2 options)

<details open>
<summary><b>👉 Option A — one-click download (recommended)</b></summary>

1. Download **[`robust-feature-planner-claude.zip`](./robust-feature-planner-claude.zip)**.
2. Unzip it. You'll get a `robust-feature-planner/` folder.
3. Copy that folder into your skills directory:
   - **Global (all projects):** `~/.claude/skills/robust-feature-planner/`
   - **One project:** `<repo>/.claude/skills/robust-feature-planner/`
4. Restart Claude Code.

> On Windows, `~` is `C:\Users\<you>\`. Full step-by-step (incl. PowerShell) is in [`claude-code/robust-feature-planner/INSTALL.md`](./claude-code/robust-feature-planner/INSTALL.md).

</details>

<details>
<summary>👉 Option B — clone this repo</summary>

```bash
git clone https://github.com/<your-user>/Planning-Prompt.git
# Global install:
cp -r "Planning-Prompt/claude-code/robust-feature-planner" ~/.claude/skills/
```

</details>

### Use it

Just describe your goal — Claude Code triggers the skill automatically:

> Plan a feature that lets users export their account data as a CSV.

Or invoke it explicitly: `/robust-feature-planner`

The skill is **read-only by design** — it produces a plan and won't change your code unless you explicitly authorize implementation.

📁 **Skill source:** [`claude-code/robust-feature-planner/`](./claude-code/robust-feature-planner/) · 📄 [`INSTALL.md`](./claude-code/robust-feature-planner/INSTALL.md) · 📄 [`SKILL.md`](./claude-code/robust-feature-planner/SKILL.md)

---

## 🤖 OpenAI Codex Skill

The same skill, packaged for **OpenAI Codex**. It uses the identical plan template, quality standard, and validator — the only differences are the Codex agent manifest (`agents/openai.yaml`) and Codex's skill-invocation syntax.

### Install

1. Download **[`robust-feature-planner-codex.zip`](./robust-feature-planner-codex.zip)** (or clone the repo).
2. Unzip to get `robust-feature-planner/`.
3. Drop it into your Codex skills directory (follow your Codex setup's skill-install path).
4. Invoke via Codex's skill reference, e.g. `Use $robust-feature-planner to create a production-ready implementation plan for this feature.`

📁 **Skill source:** [`openai-codex/robust-feature-planner/`](./openai-codex/robust-feature-planner/) · 📄 [`SKILL.md`](./openai-codex/robust-feature-planner/SKILL.md) · 📄 [`agents/openai.yaml`](./openai-codex/robust-feature-planner/agents/openai.yaml)

> 📌 Both skills share **identical** plan template, quality-standard reference, and validator. The `SKILL.md` differs only in minor platform wording (the Claude version references `CLAUDE.md`); Codex additionally ships the `agents/openai.yaml` manifest. The methodology and output are the same.

---

## 📝 The Raw Prompt (Any LLM)

The original, self-contained prompt. Works in **ChatGPT, Gemini, Cursor, Copilot Chat**, or any LLM — no install required.

📄 **[`Veedence.co.uk-Robust-Feature-Planning-Prompt.md`](./Veedence.co.uk-Robust-Feature-Planning-Prompt.md)**

### Use it in 3 steps

1. **Open the prompt** and copy the contents of the code block.
2. **Fill in two placeholders:**

```text
<FEATURE_REQUEST>
Describe the feature here.
</FEATURE_REQUEST>

<PROJECT_CONTEXT>
Stack, goals, constraints, roles, services, deadlines, or files to inspect.
(Leave blank to let the AI discover the project itself.)
</PROJECT_CONTEXT>
```

3. **Send it.** You'll get a complete plan following the [output blueprint](#-the-output-blueprint) below.

> 🎁 **Pro tip:** Leave `<PROJECT_CONTEXT>` blank on purpose. The prompt is designed to *discover* the project — and forcing the AI to investigate often surfaces things you'd have forgotten to mention.

---

## 🛡️ What It Enforces

Both skills and the raw prompt encode the same non-negotiable quality bar:

### 🧱 Modularity & Non-Regression
Each module owns **one responsibility** and communicates through typed helpers or narrow APIs. Optional integrations, external calls, webhooks, and workers **must be able to fail without breaking core product behavior.**

### 💥 Explicit Failure Behavior
What **fails open vs. closed**, what's retried, what's logged, what alerts, what's visible to users/admins, and what can be **replayed or repaired.**

### 📜 Contracts Designed For Change
**Versioning**, backwards compatibility, **idempotency**, pagination/cursors, ordering, deduplication, redaction, and schema evolution.

### 🔐 Security & Privacy From The Start
Auth, authorization, tenant/user isolation, least privilege, secret storage, **key rotation/revocation**, audit logs, **redacted logs**, retention, and safe browser exposure.

### 📡 Operations & Safe Rollout
Logs, metrics, traces, retries, replay, backfill, reconciliation, health checks, alerting — plus feature flags, migration strategy, backwards-compatible deploy order, **rollback path**, and staged release.

### 🧠 The 8 Thinking Disciplines
Before writing the plan, eight private maps are built — current-state, dependency, lifecycle, failure-mode, options (≥3 viable), contracts, UX states, and validation — surfacing only evidence, tradeoffs, and decisions (never raw chain-of-thought).

---

## 🗺️ The Output Blueprint

Every plan follows the same predictable structure. Implementation tasks use markdown checkboxes (`- [ ]`) — ready to drop into a tracker, PR, or project board.

<details>
<summary><b>📖 Expand the 20-section blueprint</b></summary>

```
 1. Title                          11. Data And Persistence Plan *
 2. Document Control               12. API, Event, And Contract Plan *
 3. Feature Summary                13. UI/UX Plan *
 4. Current-State Findings         14. Security And Privacy Plan
 5. Assumptions & Open Questions   15. Failure Isolation And Recovery Plan
 6. Goals And Non-Goals            16. Operations, Observability, And Support
 7. Non-Negotiable Design Rules    17. Rollout, Migration, And Rollback Plan
 8. Risk And Issue Register        18. Implementation Phases With Checklist Tasks
 9. Branch Review & Architecture   19. Validation Plan
10. Module Map                     20. Done Criteria + Final Review Note
```
*Sections 11–13 are **conditional** — included only when that kind of work is involved, so a logic refactor isn't padded with a fake "API Plan." See the template: [`assets/feature-plan-template.md`](./claude-code/robust-feature-planner/assets/feature-plan-template.md).

</details>

### The planning lifecycle

The prompt plans the **entire** lifecycle — including the unglamorous stages (disable, recover, audit, migrate, remove) that most plans skip and most incidents come from:

```
 CREATE ─▶ READ ─▶ UPDATE ─▶ DELETE ─▶ SYNC ─▶ RETRY ─▶ DISABLE ─▶ RECOVER ─▶ AUDIT ─▶ MIGRATE ─▶ REMOVE
```

---

## ✅ The Plan Validator

Both skills ship a Python validator (`scripts/validate_plan.py`) that structurally checks any generated plan. It catches:

- ❌ Missing or out-of-order required sections
- ❌ Unresolved template placeholders (`<FEATURE_REQUEST>`, `<TODO>`, etc.)
- ❌ Fewer than 3 compared architecture options (with no stated constraint)
- ⚠️ Missing evidence labels (Observed / Inferred / Unknown)
- ⚠️ No explicit coverage of compatibility, idempotency, permissions, rollback, observability…

```bash
# Validate a plan (treat coverage warnings as errors with --strict)
python scripts/validate_plan.py path/to/plan.md --strict

# Run the built-in self-test
python scripts/validate_plan.py --self-test
```

> ⚠️ Linter success is **structural** validation only — it does not prove architectural correctness. See [`scripts/validate_plan.py`](./claude-code/robust-feature-planner/scripts/validate_plan.py).

<details>
<summary><b>📋 Built-in review checklist (the gates the validator + skill enforce)</b></summary>

- [ ] Discovers the actual project structure before designing.
- [ ] Captures assumptions, open questions, risks, and issues **before** the final design.
- [ ] Compares **at least 3 implementation options** before choosing one.
- [ ] Chooses the **simplest robust modular** architecture.
- [ ] Makes non-regression and failure isolation explicit.
- [ ] Defines module ownership and communication contracts.
- [ ] Covers inbound/outbound/sync APIs, jobs, webhooks, callbacks, realtime flows where relevant.
- [ ] Covers versioning, auth, scopes, idempotency, pagination, filtering, ordering, redaction, compatibility.
- [ ] Uses the discovered data model — never assumes payloads.
- [ ] Covers UI/UX setup, disabled states, guidance, test actions, health, and recovery.
- [ ] Covers security, privacy, tenant isolation, secret rotation, audit, retention, redacted logs.
- [ ] Covers logs, retries, replay, backfill, reconciliation, diagnostics, quotas, alerts.
- [ ] Orders implementation phases by dependency; includes validation and done criteria.

Full version in [`references/planning-quality-standard.md`](./claude-code/robust-feature-planner/references/planning-quality-standard.md).

</details>

---

## ❓ FAQ

<details>
<summary><b>What's the difference between the prompt and the skill?</b></summary>

The **prompt** is the raw text you paste into any LLM — fully self-contained, works everywhere. The **skill** is that same prompt repackaged for an AI coding agent (Claude Code / Codex), adding: auto-triggering on intent, a bundled plan template, a bundled quality-standard reference, and an automated plan validator. The methodology is identical; the skill just makes it faster and more consistent.

</details>

<details>
<summary><b>Why does the filename say "Veedence.co.uk"?</b></summary>

The prompt is published by **Veedence** as a reusable planning discipline for real software projects. The content stays deliberately stack-agnostic, so the Veedence name identifies its publisher without tying it to one framework, product, or codebase.

</details>

<details>
<summary><b>Are the two skills different in what they produce?</b></summary>

**No.** They share identical plan template, quality standard, and validator. The only platform-specific file is Codex's `agents/openai.yaml` manifest. Pick the one matching your tool — or install both if you use both tools.

</details>

<details>
<summary><b>Will the skill change my code?</b></summary>

**No.** The skill's first instruction is to treat the task as **read-only planning** unless you explicitly authorize implementation. It produces a plan, not a diff.

</details>

<details>
<summary><b>Does this only work for a specific stack?</b></summary>

**No.** It's deliberately stack-agnostic. It discovers your actual stack (frontend, backend, DB, storage, auth, external services, deploy path) from your repo and tools, rather than assuming one.

</details>

<details>
<summary><b>Do I need Python?</b></summary>

Only for the **optional** plan validator. The skill produces full plans without it; it just runs the quality checks manually instead. Python 3.6+ if you want the validator.

</details>

---

## 📁 Repo Structure

```
Planning Prompt/
├── README.md                                  ← you are here
├── AGENTS.md                                  ← AI-agent routing, safety and validation contract
├── Veedence.co.uk-Robust-Feature-Planning-Prompt.md   ← 📝 the raw prompt (any LLM)
├── index.html                                 ← 🌐 website entry + SEO metadata
├── package.json                               ← Vite, TypeScript, GSAP and Lenis
├── vite.config.ts                             ← static-host-friendly build config
├── public/assets/                             ← official Veedence logo + mark
├── src/
│   ├── main.ts                                ← semantic page composition
│   ├── content.ts                             ← toolkit, method and map content
│   ├── theme.ts                               ← persisted dark/light mode
│   ├── navigation.ts                          ← responsive menu + section state
│   ├── motion.ts                              ← GSAP, ScrollTrigger and Lenis
│   └── styles/                                ← tokens, layout, sections, responsive rules
│
├── claude-code/                               ← 🧭 Claude Code skill package
│   └── robust-feature-planner/
│       ├── SKILL.md                           ← skill entry point (frontmatter + workflow)
│       ├── INSTALL.md                         ← step-by-step install guide
│       ├── assets/feature-plan-template.md    ← the 20-section plan skeleton
│       ├── references/planning-quality-standard.md  ← discovery matrix + review gates
│       └── scripts/validate_plan.py           ← structural plan validator
│
├── openai-codex/                              ← 🤖 OpenAI Codex skill package
│   └── robust-feature-planner/
│       ├── SKILL.md
│       ├── agents/openai.yaml                 ← Codex agent manifest (platform-specific)
│       ├── assets/feature-plan-template.md
│       ├── references/planning-quality-standard.md
│       └── scripts/validate_plan.py
│
├── robust-feature-planner-claude.zip          ← ⬇️ one-click download (Claude Code)
└── robust-feature-planner-codex.zip           ← ⬇️ one-click download (Codex)
```

---

## 🤝 Contributing & License

This discipline improves every time someone uses it on a messier real-world project and finds a gap. If you spot one:

1. **Open an issue** describing the situation the prompt/skill didn't handle well.
2. **Open a PR** — keep new instructions in the same imperative, stack-agnostic style, and remember the **template, reference, and validator stay identical** across the Claude and Codex packages; only `SKILL.md` platform wording and Codex's `agents/openai.yaml` differ.

**Created and offered by Simeon Williams from [Veedence](https://veedence.co.uk).** If you want to take your vibe coding to the next level, email [hello@Veedence.co.uk](mailto:hello@Veedence.co.uk).

**License:** MIT — copy it, adapt it, bake it into your team's playbook, ship products with it. Attribution appreciated but not required.

---

## ☕🍫 Buy Simeon a Hot Chocolate

If the Veedence Robust Feature Planner has helped you create a safer, clearer plan, please consider [getting Simeon a hot chocolate on Ko-fi](https://ko-fi.com/sim2k).

Simeon doesn't drink coffee — even though he probably needs it after staying up late vibe coding things like this to help others. Support is **never required**, but it genuinely helps. If you do contribute, please leave a message; it will be read. 🌙💚

### [☕🍫 Get Simeon a Hot Chocolate →](https://ko-fi.com/sim2k)

---

<div align="center">

**⭐ If this saved your team a production incident, give it a star.**

*Plan like the person who'll be on-call for it.*

</div>
