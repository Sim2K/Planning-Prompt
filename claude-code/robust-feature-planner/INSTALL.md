# Installing the Robust Feature Planner (Claude Code)

This package is a **Claude Code Skill**. Once installed, Claude Code can plan features the way a
senior engineer would — discover the real system first, map failure modes, compare architectures,
and return a checklist-driven, rollback-safe plan.

## Requirements

- **Claude Code** CLI (or the Claude Code extension in your IDE).
- *(Optional)* **Python 3.6+** — only needed if you want Claude to run the structural plan
  validator (`scripts/validate_plan.py`). The skill works fully without it; validation then runs
  as manual checks.

## Choose your install scope

| Scope | Location | Who gets it |
|:---|:---|:---|
| **Personal (global)** | `~/.claude/skills/robust-feature-planner/` | You, in every project |
| **Project (shared)** | `<repo>/.claude/skills/robust-feature-planner/` | Anyone who clones this repo |

> On Windows, `~` is your user folder, e.g. `C:\Users\<you>\.claude\skills\`.

## Option A — Personal (recommended)

Install once and use it in any project.

**macOS / Linux:**
```bash
mkdir -p ~/.claude/skills
cp -r robust-feature-planner ~/.claude/skills/
```

**Windows (Git Bash / PowerShell):**
```bash
mkdir -p ~/.claude/skills
cp -r robust-feature-planner ~/.claude/skills/
```

## Option B — Project (shared with your team)

Drop it into a repository so everyone working there gets it automatically.

```bash
mkdir -p .claude/skills
cp -r robust-feature-planner .claude/skills/
```

Commit the folder. Anyone who clones the repo and opens Claude Code in it gets the skill.

## Verify it loaded

Start (or restart) Claude Code and ask:

> Do you have a `robust-feature-planner` skill?

You should get a confirmation. You can also invoke it directly with the slash command:

```
/robust-feature-planner
```

## Use it

Either invoke it explicitly, or just describe your goal — Claude Code will trigger the skill
automatically when it matches. Examples:

> Plan a feature that lets users export their account data as a CSV.

> Review this existing implementation plan and tell me what's missing.
> *(then paste the plan, or point Claude at the file)*

> Compare 3 architectures for adding real-time notifications to our app.

The skill is **read-only by design**: it produces a plan and will not change your code unless you
explicitly authorize implementation.

## Updating later

This folder is the whole skill. To update, replace the folder contents and restart Claude Code.
To remove it, delete the folder and restart.

## Troubleshooting

- **Skill not found after install:** Restart Claude Code so it rescans the skills directories.
- **Validator not running:** Ensure `python --version` works (or `python3`). The skill still
  produces plans without it; it just validates manually.
- **Slash command not appearing:** Confirm `SKILL.md` (not `INSTALL.md`) sits at
  `…/skills/robust-feature-planner/SKILL.md` — the folder name must match the skill's `name`.
