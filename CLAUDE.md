# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read AGENTS.md first

[AGENTS.md](AGENTS.md) is the authoritative contract for this repo. It defines how to route a
request (Claude skill / Codex skill / raw prompt), the planner's read-only execution contract, the
"target project is not this repo" rule, and the maintenance checklist. This file adds the
architecture and command detail; it does not replace it.

## What this repository is

A **distribution repo**, not an application. It ships one methodology — the Veedence Robust Feature
Planner — in four artefacts that must stay consistent with each other:

| Artefact | Path |
|---|---|
| Claude Code skill package | `claude-code/robust-feature-planner/` |
| OpenAI Codex skill package | `openai-codex/robust-feature-planner/` |
| Portable single-file prompt | `Veedence.co.uk-Robust-Feature-Planning-Prompt.md` |
| Promotional website | `index.html` + `src/` + `public/` → `dist/` |

The two ZIPs at the repo root are **build outputs** of the skill folders (`scripts/build_zips.py`),
not sources. `dist/` is Vite output. Never hand-edit either.

## The parity invariant (most important architectural constraint)

The Claude and Codex packages are deliberate near-duplicates. `scripts/check_sync.py` enforces
three things and fails CI otherwise:

1. Twelve shared files are **byte-identical** across both packages — `CHANGELOG.md`, `LICENSE`,
   `assets/{feature-plan-template,runtime-semantics-addendum,solutions-architect-addendum,example-plan}.md`,
   `references/{planning-quality-standard,runtime-semantics-audit,solutions-architect}.md`,
   `scripts/{validate_plan,validate_runtime_semantics,validate_solutions_architect}.py`.
2. Both `SKILL.md` files declare the same `version:` in frontmatter **and** the same version in the
   body's `Planner: robust-feature-planner v… ` Document Control line.
3. Each ZIP byte-matches its source folder, with exactly one top-level `robust-feature-planner/`.

Only `SKILL.md` prose may diverge. Claude additionally owns `INSTALL.md`; Codex additionally owns
`agents/openai.yaml`.

**Consequence:** a one-line fix to a validator or template is never a one-file edit. Change both
copies, bump both versions, add the identical CHANGELOG entry to both, rebuild both ZIPs, then run
`check_sync.py`.

## The plan contract

`scripts/validate_plan.py` is the executable definition of a valid plan: `REQUIRED_SECTIONS` lists
20 headings that must be present **and in order**, plus placeholder detection, ≥3 compared
architecture options, stable-ID traceability (`A#`/`R#`/`P#.#`), and section-scoped coverage
(rollback must appear in the Rollout section, idempotency in Data/API/Failure, etc. — not
document-wide). Editing that list, `assets/feature-plan-template.md`, or
`references/planning-quality-standard.md` changes the contract in three places at once; they must
move together, and `assets/example-plan.md` must still pass `--strict`.

Two opt-in arms layer on top, each with its own reference, addendum asset, and validator, each
default-OFF with a detect-and-offer step in `SKILL.md`: the Runtime Semantics Audit
(`+runtime-audit`, merged via `validate_plan.py --runtime`) and the Solutions Architect Pass
(`+solutions-architect`, merged via `validate_plan.py --architect`).

Validation is **structural only** — passing proves the shape, not the correctness. Keep that
framing in any docs or website copy you touch.

## Website architecture

Vite multi-page app, TypeScript strict, no framework. Four entries are declared in
`vite.config.ts` (`index`, `runtime-semantics`, `support`, `how-to-use`); adding a page means
adding it there too. Each HTML file is a near-empty shell with SEO/`ai-instructions` meta; the
matching `src/<page>.ts` writes the whole DOM as one template literal into `#app`, then calls the
shared initialisers.

- `src/content.ts` — shared copy data (`DOWNLOADS`, `METHOD_STEPS`, `THINKING_MAPS`,
  `PLAN_SECTIONS`) interpolated by the page modules. Content changes belong here, not in markup.
- `src/theme.ts` / `navigation.ts` / `motion.ts` / `copy.ts` — dark-light toggle persisted to
  `localStorage`, responsive menu, GSAP + ScrollTrigger + Lenis (all motion no-ops under
  `prefers-reduced-motion`), clipboard blocks with a select-and-Ctrl+C fallback.
- `src/styles/` — cascade order matters: `tokens → global → layout → sections → responsive`,
  imported in that sequence from each page entry.
- `base: "./"` — the build must stay portable to any static host, so keep asset references
  relative.
- `public/llms.txt` carries install instructions for agents that visit the live site; it duplicates
  the ZIP URLs and paths, so update it when filenames or install locations change.

## Commands

Website:

```bash
npm install && npm run check && npm run build
```

`npm run dev` serves on `127.0.0.1:5173` (strict port); `npm run preview` on `4173`.
`npm run check` is `tsc --noEmit` and also runs as the first half of `build`.

Skill packages — the full gate, mirrored by `.github/workflows/validate.yml`:

```bash
python claude-code/robust-feature-planner/scripts/validate_plan.py --self-test
python openai-codex/robust-feature-planner/scripts/validate_plan.py --self-test
python claude-code/robust-feature-planner/scripts/validate_runtime_semantics.py --self-test
python openai-codex/robust-feature-planner/scripts/validate_runtime_semantics.py --self-test
python claude-code/robust-feature-planner/scripts/validate_solutions_architect.py --self-test
python openai-codex/robust-feature-planner/scripts/validate_solutions_architect.py --self-test
python claude-code/robust-feature-planner/scripts/validate_plan.py claude-code/robust-feature-planner/assets/example-plan.md --strict
python openai-codex/robust-feature-planner/scripts/validate_plan.py openai-codex/robust-feature-planner/assets/example-plan.md --strict
python scripts/check_sync.py
```

Rebuild the ZIPs after any skill-package change, before `check_sync.py`:

```bash
python scripts/build_zips.py
```

Single checks while iterating:

```bash
python claude-code/robust-feature-planner/scripts/validate_plan.py path/to/plan.md --strict --runtime
```

Add `--json` for machine-readable output. On Windows use `python -X utf8 …` — these Markdown files
contain emoji, and CP-1252 decoding will fail.

## Repo-specific gotchas

- `Docs/` is gitignored (`/Docs/`) and holds the promo campaign source, its own Python build and
  validation scripts, and generated PDFs/PNGs. It is not part of the shipped product.
- `LINKEDIN-POST.md` and `REDDIT-POST.md` are gitignored private drafts despite sitting at the root.
- README, `public/llms.txt`, and the website copy all restate version numbers, filenames, and claims
  about what the validator enforces. When behaviour changes, sweep all three.
