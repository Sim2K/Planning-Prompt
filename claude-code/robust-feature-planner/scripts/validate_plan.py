#!/usr/bin/env python3
"""Structurally validate a robust feature implementation plan.

Checks structure, ordering, placeholders, option comparison, checklists,
section substance, section-scoped coverage, and ID traceability. Structural
validation only: a passing plan proves the required structure and markers
exist, not that the plan is correct. A green run is an invitation to review,
not a certificate.

Python 3.8+. No third-party dependencies.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path


REQUIRED_SECTIONS = [
    "Document Control",
    "Feature Summary",
    "Current-State Findings",
    "Assumptions And Open Questions",
    "Goals And Non-Goals",
    "Non-Negotiable Design Rules",
    "Risk And Issue Register",
    "Branch Review And Chosen Architecture",
    "Module Map",
    "Data And Persistence Plan",
    "API, Event, And Contract Plan",
    "UI/UX Plan",
    "Security And Privacy Plan",
    "Failure Isolation And Recovery Plan",
    "Operations, Observability, And Support Plan",
    "Rollout, Migration, And Rollback Plan",
    "Implementation Phases With Checklist Tasks",
    "Validation Plan",
    "Done Criteria",
    "Final Review Note",
]

PLACEHOLDER_PATTERNS = [
    r"<FEATURE_REQUEST>",
    r"<PROJECT_CONTEXT>",
    r"<Feature Name>",
    r"<YYYY-MM-DD>",
    r"\[TODO(?:\:|\])",
]

# Coverage topics are checked inside the sections where they must live, not
# document-wide. Sections explicitly marked "Not applicable" are exempt; if
# every candidate section is not applicable, the topic is skipped.
SCOPED_COVERAGE = {
    "compatibility": (
        (
            "Non-Negotiable Design Rules",
            "Data And Persistence Plan",
            "API, Event, And Contract Plan",
            "Rollout, Migration, And Rollback Plan",
        ),
        ("compatib", "version"),
    ),
    "duplicate safety": (
        (
            "Data And Persistence Plan",
            "API, Event, And Contract Plan",
            "Failure Isolation And Recovery Plan",
        ),
        ("idempoten", "duplicate", "dedup"),
    ),
    "permission behavior": (
        (
            "Security And Privacy Plan",
            "API, Event, And Contract Plan",
            "Data And Persistence Plan",
            "UI/UX Plan",
        ),
        ("authoriz", "permission", "tenant"),
    ),
    "failure recovery": (
        (
            "Failure Isolation And Recovery Plan",
            "Operations, Observability, And Support Plan",
        ),
        ("retry", "replay", "repair", "reconcil"),
    ),
    "rollback": (
        ("Rollout, Migration, And Rollback Plan",),
        ("rollback", "roll back", "roll-back"),
    ),
    "observability": (
        ("Operations, Observability, And Support Plan",),
        ("log", "metric", "trace", "alert"),
    ),
}

TABLE_SECTIONS = ("Risk And Issue Register", "Module Map")

# Deliberately strong signals only. Common planning vocabulary such as
# "transaction", "idempotency", or "retry" appears in every good plan and
# would make this note meaningless noise.
RUNTIME_RISK_PATTERNS = [
    r"\bmutex\b",
    r"\bsemaphore\b",
    r"\brace condition",
    r"\bdeadlock",
    r"\bisolation level",
    r"read committed",
    r"repeatable read",
    r"\bserializable\b",
    r"\bfor update\b",
    r"advisory lock",
    r"\bconnection pool",
    r"shared (?:mutable |in-memory )?state",
    r"lost update",
    r"write skew",
    r"\bconcurrent writ",
]

RUNTIME_AUDIT_HEADING = re.compile(r"(?im)^#{1,6}\s+.*runtime semantics audit")

EVIDENCE_HINT = re.compile(
    r"`[^`\n]+`"
    r"|\b\w[\w./\\-]*\.(?:py|ts|tsx|js|jsx|mjs|go|rs|java|rb|php|cs|kt|swift"
    r"|sql|proto|yml|yaml|json|toml|ini|md)\b"
)


@dataclass
class Result:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    @property
    def valid(self) -> bool:
        return not self.errors


def normalize_heading(value: str) -> str:
    value = re.sub(r"[`*_]", "", value)
    return re.sub(r"\s+", " ", value).strip().casefold()


def section_map(text: str) -> tuple[list[str], dict[str, str]]:
    matches = list(re.finditer(r"(?m)^##\s+(.+?)\s*$", text))
    order: list[str] = []
    sections: dict[str, str] = {}
    for index, match in enumerate(matches):
        name = normalize_heading(match.group(1))
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        order.append(name)
        sections[name] = text[start:end]
    return order, sections


def prose_without_code(text: str) -> str:
    """Remove code where angle-bracket syntax may be intentional."""
    without_fences = re.sub(r"(?ms)^```.*?^```\s*$", "", text)
    return re.sub(r"`[^`\n]+`", "", without_fences)


def is_not_applicable(body: str) -> bool:
    return "not applicable" in body.casefold()


def table_data_rows(body: str) -> list[str]:
    rows = [line for line in body.splitlines() if line.strip().startswith("|")]
    return [row for row in rows[2:] if set(row.strip()) - set("|-: \t")]


def validate_text(text: str, strict: bool = False) -> Result:
    result = Result()
    order, sections = section_map(text)
    required = [normalize_heading(name) for name in REQUIRED_SECTIONS]

    if not re.search(r"(?m)^#\s+\S", text):
        result.errors.append("Missing a level-one plan title.")

    missing = [name for name, key in zip(REQUIRED_SECTIONS, required) if key not in sections]
    if missing:
        result.errors.append("Missing required sections: " + ", ".join(missing))

    positions = [order.index(key) for key in required if key in order]
    if positions != sorted(positions):
        result.errors.append("Required sections are not in the expected order.")

    for name, key in zip(REQUIRED_SECTIONS, required):
        if key in sections and not sections[key].strip():
            result.errors.append(
                f"Section '{name}' is empty; write content or 'Not applicable' with evidence."
            )

    for name in TABLE_SECTIONS:
        body = sections.get(normalize_heading(name), "")
        if body.strip() and not table_data_rows(body) and not is_not_applicable(body):
            result.errors.append(
                f"{name} needs at least one filled table row or an explicit "
                "'Not applicable' with evidence."
            )

    for pattern in PLACEHOLDER_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE):
            result.errors.append(f"Unresolved placeholder matched: {pattern}")

    prose = prose_without_code(text)
    unresolved = sorted(set(re.findall(r"<[^<>\r\n]+>", prose)))
    if unresolved:
        preview = ", ".join(unresolved[:5])
        suffix = "" if len(unresolved) <= 5 else f" (+{len(unresolved) - 5} more)"
        result.warnings.append(f"Possible unresolved template placeholders: {preview}{suffix}")

    branch_key = normalize_heading("Branch Review And Chosen Architecture")
    branch = sections.get(branch_key, "")
    branch_matches = list(re.finditer(r"(?m)^###\s+(.+?)\s*$", branch))
    option_headings = []
    for index, match in enumerate(branch_matches):
        heading = match.group(1)
        if re.search(r"\b(chosen|decision|recommend)", heading, flags=re.IGNORECASE):
            continue
        option_headings.append(heading)
        end = branch_matches[index + 1].start() if index + 1 < len(branch_matches) else len(branch)
        option_body = branch[match.end():end]
        if not EVIDENCE_HINT.search(option_body):
            result.warnings.append(
                f"Option '{heading}' cites no concrete project evidence "
                "(a `path`, file, or module)."
            )
    if len(option_headings) < 3 and not re.search(
        r"fewer than three|only (?:one|two) viable|hard constraint",
        branch,
        flags=re.IGNORECASE,
    ):
        result.errors.append(
            "Branch review needs at least three option headings or an explicit viability constraint."
        )
    if not re.search(r"(?im)^###\s+.*(?:chosen|decision|recommend)", branch):
        result.errors.append("Branch review is missing a clearly marked chosen architecture.")

    for section_name in (
        "Implementation Phases With Checklist Tasks",
        "Validation Plan",
        "Done Criteria",
    ):
        content = sections.get(normalize_heading(section_name), "")
        if not re.search(r"(?m)^-\s+\[\s\]\s+\S", content):
            result.errors.append(f"{section_name} needs at least one unchecked checklist task.")

    current_state = sections.get(normalize_heading("Current-State Findings"), "")
    for label in ("Observed", "Inferred", "Unknown"):
        if not re.search(rf"\b{label}\b", current_state, flags=re.IGNORECASE):
            result.warnings.append(f"Current-State Findings does not label any {label} evidence.")
    if current_state.strip() and "test" not in current_state.casefold():
        result.warnings.append(
            "Current-State Findings does not name existing test coverage for the touched flows."
        )

    for topic, (section_names, terms) in SCOPED_COVERAGE.items():
        bodies = [
            sections[normalize_heading(name)]
            for name in section_names
            if normalize_heading(name) in sections
        ]
        applicable = [body for body in bodies if body.strip() and not is_not_applicable(body)]
        if bodies and not applicable:
            continue
        haystack = " ".join(applicable).casefold()
        if bodies and not any(term in haystack for term in terms):
            result.warnings.append(
                f"No explicit coverage of {topic} in: " + ", ".join(section_names) + "."
            )

    register = sections.get(normalize_heading("Risk And Issue Register"), "")
    if register.strip() and not is_not_applicable(register):
        risk_ids = sorted(set(re.findall(r"\bR\d+\b", register)))
        if not risk_ids:
            result.warnings.append("Risk register entries lack stable IDs (R1, R2, ...).")
        else:
            remainder = text.replace(register, "")
            orphans = [rid for rid in risk_ids if not re.search(rf"\b{rid}\b", remainder)]
            if orphans:
                result.warnings.append(
                    "Risk IDs never referenced outside the register: " + ", ".join(orphans) + "."
                )
    assumptions = sections.get(normalize_heading("Assumptions And Open Questions"), "")
    if (
        assumptions.strip()
        and not is_not_applicable(assumptions)
        and not re.search(r"\bA\d+\b", assumptions)
    ):
        result.warnings.append("Assumptions lack stable IDs (A1, A2, ...).")
    phases = sections.get(normalize_heading("Implementation Phases With Checklist Tasks"), "")
    if re.search(r"(?m)^-\s+\[\s\]", phases) and not re.search(r"\bP\d+\.\d+\b", phases):
        result.warnings.append("Implementation tasks lack stable IDs (P1.1, P1.2, ...).")

    if not RUNTIME_AUDIT_HEADING.search(text):
        hits = []
        for pattern in RUNTIME_RISK_PATTERNS:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                hits.append(match.group(0))
        if hits:
            result.notes.append(
                "Runtime-risk signals found (" + ", ".join(sorted(set(hits))[:6])
                + ") but no Runtime Semantics Audit section; consider `+runtime-audit`."
            )

    if strict and result.warnings:
        result.errors.extend(f"Strict: {warning}" for warning in result.warnings)
        result.warnings.clear()

    return result


def merge_runtime_checks(result: Result, text: str) -> None:
    """Merge Runtime Semantics Audit checks into the base result."""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    try:
        from validate_runtime_semantics import validate as validate_runtime
    except ImportError as error:
        result.errors.append(
            f"Runtime: validate_runtime_semantics.py could not be loaded ({error})."
        )
        return
    runtime_errors, runtime_warnings = validate_runtime(text)
    result.errors.extend("Runtime: " + message for message in runtime_errors)
    result.warnings.extend("Runtime: " + message for message in runtime_warnings)


def make_self_test_plan() -> str:
    bodies = {
        "Document Control": (
            "- Status: Draft\n- Version: 0.1.0\n- Owner: team-data\n"
            "- Last updated: 2026-01-01\n"
            "- Depth tier: Standard; user-facing export with a background worker\n"
            "- Evidence baseline: commit abc1234\n"
            "- Change log: 0.1.0 initial draft\n"
            "- Scope: Planning only; implementation requires explicit approval"
        ),
        "Feature Summary": "Users export their account data as CSV from the settings page.",
        "Current-State Findings": (
            "- Observed: export route exists in `src/api/export.py`.\n"
            "- Inferred: worker pool size is 4 based on `worker.cfg`.\n"
            "- Unknown: production rate limits; verify with the ops team.\n"
            "- Existing tests: `tests/test_export.py` guards the happy path; "
            "no test covers oversized exports."
        ),
        "Assumptions And Open Questions": (
            "- [ ] A1 - Production rate limits are unknown - risk: export throttling - "
            "verify with ops - resolve before Phase 1"
        ),
        "Goals And Non-Goals": (
            "### Goals\n\n- Users download a complete CSV in under a minute.\n\n"
            "### Non-Goals\n\n- No scheduled or recurring exports."
        ),
        "Non-Negotiable Design Rules": (
            "- The existing export API contract stays versioned and backward compatible."
        ),
        "Risk And Issue Register": (
            "| ID | Risk or issue | Impact | Likelihood | Mitigation | Verification or owner |\n"
            "|---|---|---|---|---|---|\n"
            "| R1 | Large exports time out | High | Medium | Stream rows in batches | P1.2 load test |"
        ),
        "Branch Review And Chosen Architecture": (
            "### Option 1 - Conservative\n\n"
            "Extend the synchronous path in `export_service.py`; lowest migration risk.\n\n"
            "### Option 2 - Modular\n\n"
            "Add a queued `export_worker.py` with a narrow job contract; clearest boundaries.\n\n"
            "### Option 3 - Fastest Acceptable\n\n"
            "Reuse the report generator in `report_job.py`; shortest safe path.\n\n"
            "### Chosen Architecture\n\n"
            "Option 2: isolates long-running work; rejected 1 (timeouts) and 3 (coupled "
            "contract). New evidence on rate limits could change this."
        ),
        "Module Map": (
            "| Module | Single responsibility | Owner | Inputs/outputs | Failure isolation |\n"
            "|---|---|---|---|---|\n"
            "| export_worker | Builds the CSV file | team-data | Job record in, file out "
            "| Fails without blocking the UI |"
        ),
        "Data And Persistence Plan": (
            "Reuse the `exports` table; add a status index. A unique constraint on the job "
            "key prevents duplicate jobs (dedup). Retention: files purged after 30 days. "
            "Migration order is additive and roll-forward safe."
        ),
        "API, Event, And Contract Plan": (
            "POST /exports stays on v1 and remains backward compatible. Requests carry an "
            "idempotency key; list endpoints use cursor pagination; errors use the shared "
            "envelope."
        ),
        "UI/UX Plan": (
            "Settings page gains an Export button with loading, empty, disabled, error, and "
            "success states, visible only with the export permission."
        ),
        "Security And Privacy Plan": (
            "Authorization: owner-only access with tenant isolation enforced by row "
            "policies. No new secrets. Each export writes an audit log entry; logs are "
            "redacted."
        ),
        "Failure Isolation And Recovery Plan": (
            "Worker retries with backoff, dead-letters after 5 attempts, and supports "
            "replay from the job table. Partial files are deleted by a repair task."
        ),
        "Operations, Observability, And Support Plan": (
            "Structured logs with correlation IDs, export metrics, traces, and an alert on "
            "failure rate. Capacity: at most 10 concurrent exports; storage cost capped by "
            "retention."
        ),
        "Rollout, Migration, And Rollback Plan": (
            "Feature flag per cohort; staged release with smoke checks. Rollback: disable "
            "the flag; the additive migration needs no reversal."
        ),
        "Implementation Phases With Checklist Tasks": (
            "### Phase 0 - Resolve Blocking Evidence\n\n"
            "- [ ] P0.1 Confirm production rate limits with ops (resolves A1) - written "
            "confirmation\n\n"
            "### Phase 1 - Core Implementation\n\n"
            "- [ ] P1.1 Add the exports status index - migration applied in staging\n"
            "- [ ] P1.2 Stream large exports in batches (resolves R1) - load test evidence"
        ),
        "Validation Plan": (
            "- [ ] Unit and integration tests for the worker\n"
            "- [ ] Failure-mode test: retry, replay, and partial-file cleanup\n"
            "- [ ] Staged rollout smoke check and rollback drill"
        ),
        "Done Criteria": (
            "- [ ] User downloads a complete CSV from settings\n"
            "- [ ] Export API v1 consumers see no contract change"
        ),
        "Final Review Note": (
            "Inspected: export routes, worker config, and the exports schema. All review "
            "gates were run. Remaining before implementation: production rate limits (A1)."
        ),
    }
    parts = ["# Example Implementation Plan"]
    for name in REQUIRED_SECTIONS:
        parts.append(f"## {name}\n\n{bodies[name]}")
    return "\n\n".join(parts)


def set_section_body(plan: str, name: str, body: str) -> str:
    pattern = re.compile(rf"(?ms)(^##\s+{re.escape(name)}\s*\n\n?).*?(?=^##\s|\Z)")
    replacement = body + ("\n\n" if body else "")
    return pattern.sub(lambda match: match.group(1) + replacement, plan, count=1)


def build_self_test_cases() -> list[tuple[str, str, bool, str]]:
    base = make_self_test_plan()
    two_options = (
        "### Option 1 - Conservative\n\nExtend `export_service.py`.\n\n"
        "### Option 2 - Modular\n\nAdd `export_worker.py`.\n\n"
        "### Chosen Architecture\n\nOption 2."
    )
    no_chosen = (
        "### Option 1 - Conservative\n\nExtend `export_service.py`.\n\n"
        "### Option 2 - Modular\n\nAdd `export_worker.py`.\n\n"
        "### Option 3 - Fastest Acceptable\n\nReuse `report_job.py`."
    )
    vague_options = (
        "### Option 1 - Conservative\n\nSmallest change.\n\n"
        "### Option 2 - Modular\n\nClear boundaries.\n\n"
        "### Option 3 - Fastest Acceptable\n\nShortest path.\n\n"
        "### Chosen Architecture\n\nOption 2."
    )
    swapped = (
        base.replace("## Feature Summary", "@@TMP@@")
        .replace("## Goals And Non-Goals", "## Feature Summary")
        .replace("@@TMP@@", "## Goals And Non-Goals")
    )
    return [
        ("valid plan passes strict", base, True, ""),
        (
            "missing section is caught",
            base.replace("## Validation Plan\n", "## Validation Notes\n", 1),
            False,
            "Missing required sections",
        ),
        ("out-of-order sections are caught", swapped, False, "expected order"),
        (
            "unresolved placeholder is caught",
            base + "\n\n<FEATURE_REQUEST>",
            False,
            "Unresolved placeholder",
        ),
        (
            "empty section is caught",
            set_section_body(base, "Feature Summary", ""),
            False,
            "is empty",
        ),
        (
            "empty risk register table is caught",
            set_section_body(base, "Risk And Issue Register", "Risks are tracked elsewhere."),
            False,
            "table row",
        ),
        (
            "fewer than three options is caught",
            set_section_body(base, "Branch Review And Chosen Architecture", two_options),
            False,
            "three option",
        ),
        (
            "missing chosen architecture is caught",
            set_section_body(base, "Branch Review And Chosen Architecture", no_chosen),
            False,
            "chosen architecture",
        ),
        (
            "evidence-free options are flagged",
            set_section_body(base, "Branch Review And Chosen Architecture", vague_options),
            False,
            "no concrete project evidence",
        ),
        (
            "missing checklist tasks are caught",
            set_section_body(base, "Validation Plan", "Tests will be run."),
            False,
            "checklist task",
        ),
        (
            "missing rollback coverage is caught",
            set_section_body(
                base,
                "Rollout, Migration, And Rollback Plan",
                "Deploy from main; revert the release commit and redeploy the previous "
                "build if needed.",
            ),
            False,
            "rollback",
        ),
    ]


def self_test() -> int:
    cases = build_self_test_cases()
    failures = []
    for description, plan, should_pass, fragment in cases:
        result = validate_text(plan, strict=True)
        if result.valid != should_pass:
            failures.append(
                f"{description}: expected valid={should_pass}, got errors={result.errors}"
            )
        elif not should_pass and fragment and not any(
            fragment in error for error in result.errors
        ):
            failures.append(f"{description}: no error mentions '{fragment}': {result.errors}")
    if failures:
        print("Self-test failed.", file=sys.stderr)
        for failure in failures:
            print("  " + failure, file=sys.stderr)
        return 1
    print(f"Self-test passed ({len(cases)} cases).")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", type=Path, nargs="?", help="Markdown plan to validate")
    parser.add_argument("--strict", action="store_true", help="Treat coverage warnings as errors")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    parser.add_argument(
        "--runtime",
        action="store_true",
        help="Also validate the Runtime Semantics Audit addendum (merged into this output)",
    )
    parser.add_argument("--self-test", action="store_true", help="Run built-in validator tests")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.self_test:
        return self_test()
    if args.plan is None:
        print("error: provide a plan path or --self-test", file=sys.stderr)
        return 2
    try:
        text = args.plan.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        print(f"error: cannot read {args.plan}: {error}", file=sys.stderr)
        return 2

    result = validate_text(text, strict=False)
    if args.runtime:
        merge_runtime_checks(result, text)
    if args.strict and result.warnings:
        result.errors.extend(f"Strict: {warning}" for warning in result.warnings)
        result.warnings.clear()

    payload = {
        "path": str(args.plan),
        "valid": result.valid,
        "errors": result.errors,
        "warnings": result.warnings,
        "notes": result.notes,
    }
    if args.json:
        print(json.dumps(payload, indent=2))
    else:
        status = "PASS" if result.valid else "FAIL"
        print(f"{status}: {args.plan}")
        for error in result.errors:
            print(f"ERROR: {error}")
        for warning in result.warnings:
            print(f"WARNING: {warning}")
        for note in result.notes:
            print(f"NOTE: {note}")
    return 0 if result.valid else 1


if __name__ == "__main__":
    raise SystemExit(main())
