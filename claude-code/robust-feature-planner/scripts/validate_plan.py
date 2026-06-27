#!/usr/bin/env python3
"""Structurally validate a robust feature implementation plan."""

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

STRICT_COVERAGE = {
    "evidence classification": ("observed", "inferred", "unknown"),
    "compatibility": ("compatib", "version"),
    "duplicate safety": ("idempoten", "duplicate", "dedup"),
    "permission behavior": ("authoriz", "permission", "tenant"),
    "failure recovery": ("retry", "replay", "repair", "reconcil"),
    "rollback": ("rollback", "roll back", "roll-back"),
    "observability": ("log", "metric", "trace", "alert"),
}


@dataclass
class Result:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

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
    branch_headings = re.findall(r"(?m)^###\s+(.+?)\s*$", branch)
    option_headings = [
        heading
        for heading in branch_headings
        if not re.search(r"\b(chosen|decision|recommend)", heading, flags=re.IGNORECASE)
    ]
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

    lower_text = text.casefold()
    for topic, alternatives in STRICT_COVERAGE.items():
        if not any(term in lower_text for term in alternatives):
            result.warnings.append(f"No explicit coverage found for {topic}.")

    if strict and result.warnings:
        result.errors.extend(f"Strict: {warning}" for warning in result.warnings)
        result.warnings.clear()

    return result


def make_self_test_plan() -> str:
    sections: list[str] = ["# Example Implementation Plan"]
    for name in REQUIRED_SECTIONS:
        body = "Concrete project evidence and decision."
        if name == "Current-State Findings":
            body = "Observed: route. Inferred: owner. Unknown: production limit."
        elif name == "Branch Review And Chosen Architecture":
            body = (
                "### Option A\nConservative.\n\n"
                "### Option B\nModular.\n\n"
                "### Option C\nFastest acceptable.\n\n"
                "### Chosen Architecture\nOption B."
            )
        elif name in {
            "Implementation Phases With Checklist Tasks",
            "Validation Plan",
            "Done Criteria",
        }:
            body = "- [ ] Verify the implementation and acceptance evidence."
        sections.append(f"## {name}\n\n{body}")
    sections.append(
        "Compatibility and version strategy. Authorization and tenant permissions. "
        "Idempotency and duplicate handling. Retry, replay, repair, and reconciliation. "
        "Rollback. Logs, metrics, traces, and alerts."
    )
    return "\n\n".join(sections)


def self_test() -> int:
    valid = validate_text(make_self_test_plan(), strict=True)
    invalid = validate_text("# Incomplete\n\n- [ ] vague", strict=True)
    if not valid.valid or invalid.valid:
        print("Self-test failed.", file=sys.stderr)
        print(json.dumps({"valid": valid.__dict__, "invalid": invalid.__dict__}, indent=2))
        return 1
    print("Self-test passed.")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", type=Path, nargs="?", help="Markdown plan to validate")
    parser.add_argument("--strict", action="store_true", help="Treat coverage warnings as errors")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
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

    result = validate_text(text, strict=args.strict)
    payload = {
        "path": str(args.plan),
        "valid": result.valid,
        "errors": result.errors,
        "warnings": result.warnings,
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
    return 0 if result.valid else 1


if __name__ == "__main__":
    raise SystemExit(main())
