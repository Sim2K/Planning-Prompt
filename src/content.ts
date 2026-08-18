export const DOWNLOADS = [
  {
    id: "claude",
    index: "01",
    eyebrow: "Claude Code",
    title: "Planner skill for Claude",
    description:
      "Drop the skill into Claude Code and turn feature-planning requests into a repeatable, reviewed workflow.",
    detail: "SKILL.md · template · standard · validator",
    href: "https://github.com/Sim2K/Planning-Prompt/blob/main/robust-feature-planner-claude.zip",
    cta: "Get the Claude skill",
  },
  {
    id: "codex",
    index: "02",
    eyebrow: "OpenAI Codex",
    title: "Planner skill for Codex",
    description:
      "Install the Codex-native package with invocation metadata, progressive disclosure, and the same quality gates.",
    detail: "Codex manifest · template · standard · validator",
    href: "https://github.com/Sim2K/Planning-Prompt/blob/main/robust-feature-planner-codex.zip",
    cta: "Get the Codex skill",
  },
  {
    id: "prompt",
    index: "03",
    eyebrow: "Any capable LLM",
    title: "The raw planning prompt",
    description:
      "No installation required. Copy the complete methodology into ChatGPT, Gemini, Cursor, Copilot, or your preferred assistant.",
    detail: "One Markdown file · stack agnostic · read-only",
    href: "https://github.com/Sim2K/Planning-Prompt/blob/main/Veedence.co.uk-Robust-Feature-Planning-Prompt.md",
    cta: "Read the raw prompt",
  },
] as const;

export const THINKING_MAPS = [
  ["01", "Current state", "Trace where data enters, changes, persists, and becomes visible."],
  ["02", "Dependencies", "Find every module, service, table, permission, job, and UI path at risk."],
  ["03", "Lifecycle", "Plan create, read, update, delete, retry, recover, migrate, and remove."],
  ["04", "Failure modes", "Design for timeouts, duplicates, partial writes, outages, and rollback."],
  ["05", "Options", "Compare conservative, modular, and fastest-acceptable architecture branches."],
  ["06", "Contracts", "Define APIs, events, auth, errors, idempotency, pagination, and compatibility."],
  ["07", "Experience", "Cover setup, loading, empty, disabled, error, success, and recovery states."],
  ["08", "Validation", "Build a ladder from static checks to smoke tests and rollback drills."],
] as const;

export const METHOD_STEPS = [
  {
    number: "01",
    verb: "Discover",
    title: "Read the real system",
    body: "Ground the work in repository instructions, nearby code, schemas, tools, tests, and deployment reality.",
    output: "Observed / inferred / unknown",
  },
  {
    number: "02",
    verb: "Map",
    title: "Expose the blast radius",
    body: "Trace dependencies, lifecycle states, failure paths, contracts, user journeys, and validation needs.",
    output: "Eight connected maps",
  },
  {
    number: "03",
    verb: "Branch",
    title: "Compare before choosing",
    body: "Test at least three viable implementation directions against simplicity, safety, cost, and reversibility.",
    output: "A defensible decision",
  },
  {
    number: "04",
    verb: "Design",
    title: "Make the work executable",
    body: "Give every module one responsibility and one narrow interface, then order tasks by real dependencies.",
    output: "A 20-section blueprint",
  },
  {
    number: "05",
    verb: "Review",
    title: "Close the quiet gaps",
    body: "Trace risks to decisions, tasks, tests, or explicit non-goals. Repair missing rollback and recovery paths.",
    output: "A plan ready to build",
  },
] as const;

export const PLAN_SECTIONS = [
  "Current-state findings",
  "Assumptions & open questions",
  "Goals & non-goals",
  "Risk & issue register",
  "Architecture branch review",
  "Module ownership map",
  "Data & persistence",
  "API, event & contracts",
  "UI/UX states",
  "Security & privacy",
  "Failure isolation",
  "Operations & support",
  "Rollout & migration",
  "Rollback & repair",
  "Phased checklist tasks",
  "Validation ladder",
] as const;
