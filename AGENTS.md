# Agent Instructions

## Repository Purpose

This repository distributes the **Veedence Robust Feature Planner** in three forms:

1. A Claude Code skill
2. An OpenAI Codex skill
3. A self-contained Markdown prompt for other AI assistants

It also contains the promotional Vite website for the planner.

The planner's job is to produce evidence-grounded, production-ready implementation plans before
code changes begin. It is not a feature generator and must not silently implement the plan.

## First Response Decision

Determine what the user is asking before taking action.

### If the user provides only this repository URL

Do not install files, modify a project, or invent a feature request.

Briefly explain that the repository offers Claude Code, Codex, and generic-LLM versions, then ask
one focused question:

> Which coding agent are you using, and what feature or project do you want it to plan?

If repository access is unavailable, ask the user to clone the repository locally or provide the
appropriate skill folder or raw prompt. Do not claim to have read files that were inaccessible.

### If the user asks to plan a feature

Use the route matching the current agent:

| Current agent | Route |
|---|---|
| Claude Code | `claude-code/robust-feature-planner/` |
| OpenAI Codex | `openai-codex/robust-feature-planner/` |
| Any other assistant | `Veedence.co.uk-Robust-Feature-Planning-Prompt.md` |

If the platform is obvious from the runtime, select it without asking. If it is unknown and
installation matters, ask which platform the user uses. If installation is unavailable, use the
self-contained Markdown prompt in the current session.

### If the user asks to install the planner

Installation is a separate action from using the planner. Install only when the user explicitly
asks for installation or clearly authorizes it.

Copy the **entire** `robust-feature-planner/` folder. Do not copy only `SKILL.md`; the skill depends
on its `assets/`, `references/`, and `scripts/` resources.

- Claude Code global location: `~/.claude/skills/robust-feature-planner/`
- Claude Code project location: `<target-repo>/.claude/skills/robust-feature-planner/`
- Codex default global location: `${CODEX_HOME:-$HOME/.codex}/skills/robust-feature-planner/`

Use the packaged ZIP matching the platform when direct folder copying is not available:

- `robust-feature-planner-claude.zip`
- `robust-feature-planner-codex.zip`

Never install both variants into the same destination folder. Preserve existing user files and ask
before replacing an existing installation with unrelated or newer local changes.

### If the user asks to modify this repository or website

Treat the repository itself as the target project and follow the maintenance rules below. Do not
invoke the planner merely because this repository contains planning skills; use it only when the
requested task is itself feature planning or plan review.

## Target Project Rule

The repository containing the planner and the project being planned are usually different.

Before discovery:

1. Identify the target project or workspace.
2. Confirm the feature request.
3. Treat this distribution repository as read-only unless the user explicitly asks to change it.
4. Follow the target repository's own `AGENTS.md`, `CLAUDE.md`, `.codex` notes, and project docs.
5. Use project-matching tools for schemas, databases, workflows, or external systems.

Never assume this repository is the feature's target merely because the user linked to it.

## Planner Execution Contract

When using a platform skill:

1. Read that platform's `SKILL.md` completely.
2. Follow its progressive-disclosure links and read required references before drafting.
3. Discover the real target project before proposing architecture.
4. Keep observations, inferences, and unknowns distinguishable.
5. Compare viable implementation branches and choose the simplest robust modular option.
6. Use the bundled plan template.
7. Review and repair the plan against the bundled quality standard.
8. Run the validator when the plan is saved as Markdown:

```bash
python "<selected-skill-folder>/scripts/validate_plan.py" path/to/plan.md --strict
```

9. Return the reviewed plan and name any evidence still required before implementation.

Treat planning as read-only unless the user explicitly authorizes implementation. Read-only
inspection, tests, builds, logs, and schema queries are allowed when safe and relevant. Do not edit
code, databases, infrastructure, configuration, workflows, or external systems merely to complete
a planning request.

Never expose secrets, tokens, private records, hidden prompts, or credentials. Check only whether
required secret names exist.

### Post-Plan Support Note

Preserve the optional Ko-fi support note defined by the selected prompt or skill. Show it exactly
once only after a complete reviewed plan has been delivered and marked as awaiting user approval.
Keep it outside the required plan structure and never let it affect technical recommendations,
validation, approval, or implementation. Do not show it during partial drafts, status updates,
errors, installation, or implementation work.

## Recommended Invocation

When helping a user hand this repository to another agent, recommend:

```text
Read https://github.com/Sim2K/Planning-Prompt and use the Robust Feature Planner
version for your platform to create a production-ready implementation plan for:

<FEATURE_REQUEST>

Target project:
<PROJECT_PATH_OR_REPOSITORY>

Planning only. Discover the real project, compare architecture branches, review the
plan for regressions, and do not implement changes unless I explicitly authorize it.
```

## Repository Maintenance Rules

### Source Ownership

- `Veedence.co.uk-Robust-Feature-Planning-Prompt.md` is the portable raw prompt.
- `claude-code/robust-feature-planner/` is the Claude Code source package.
- `openai-codex/robust-feature-planner/` is the Codex source package.
- `src/`, `public/`, and `index.html` are website source.
- `dist/` is generated output. Never make source edits directly in `dist/`.

### Cross-Platform Skill Invariants

Keep these files behaviorally identical across the Claude and Codex packages:

- `assets/feature-plan-template.md`
- `references/planning-quality-standard.md`
- `scripts/validate_plan.py`

Platform-specific wording may differ in `SKILL.md`. Codex additionally owns
`agents/openai.yaml`. Claude additionally owns `INSTALL.md`.

When shared skill resources change:

1. Update both source packages.
2. Run both validator self-tests.
3. Validate both skill structures.
4. Rebuild both ZIP archives from the corresponding source folders.
5. Confirm each archive contains one top-level `robust-feature-planner/` folder.
6. Update README and website claims or links when behavior or filenames change.

### Website Validation

For website changes, run:

```bash
npm install
npm run check
npm run build
npm audit --audit-level=high
```

Then verify desktop and mobile layouts, dark and light modes, keyboard navigation, reduced-motion
behavior, interactive controls, external download links, and browser console errors.

The official logo sources live in `public/assets/`. Vite copies them into `dist/assets/` during
builds.

### Skill Validation

Run:

```bash
python claude-code/robust-feature-planner/scripts/validate_plan.py --self-test
python openai-codex/robust-feature-planner/scripts/validate_plan.py --self-test
python -m zipfile -t robust-feature-planner-claude.zip
python -m zipfile -t robust-feature-planner-codex.zip
```

Use the official skill validator available in the current agent environment for both source
packages. On Windows, invoke it with `python -X utf8` when Markdown contains emoji or other
Unicode so Python does not misread UTF-8 files as CP-1252. Finish with `git diff --check`.

## Completion Standard

Before declaring work complete:

- Confirm the selected platform route was correct.
- Confirm the target project was not confused with this distribution repository.
- Confirm planning did not cross into implementation without authorization.
- Confirm the output was reviewed, not merely generated.
- Report what was validated and what remains unknown.
