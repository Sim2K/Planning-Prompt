#!/usr/bin/env python3
"""
validate_solutions_architect.py

Standalone STRUCTURAL validator for the optional Solutions Architect Pass
addendum (the Decision Record).

It does NOT modify or depend on the base validate_plan.py. Run it on its own,
or through validate_plan.py's --architect flag, which merges these checks into
one report.

What it checks (structure only):
  - the "Solutions Architect Decision Record" section exists
  - the standing caveat is present
  - the Decision Table has >= 1 filled data row with all required cells non-empty
  - the "Losing options -> why they lost" and "Evidence" cells are never blank
  - confidence cells are Observed / Inferred / Unknown
  - decision IDs look like D1, D2, ... and match the Option Analyses entries
  - the Option Analyses subsection exists and is non-empty
  - the Re-Verified Facts table exists with results Confirmed / Contradicted /
    Unverified
  - no unresolved <...> placeholders remain

WHAT IT DOES NOT DO: prove any chosen option is right. A fully passing Decision
Record means the options were ENUMERATED AND EVIDENCE-CHECKED, not that the
winner is proven correct.

Python 3.6+. No third-party dependencies.

Exit codes: 0 = pass, 1 = structural errors found, 2 = usage error.
"""

import argparse
import re
import sys

CAVEAT_MARKER = "enumerated and evidence-checked"
RECORD_HEADING = re.compile(r'^(#{1,6})\s+.*solutions architect', re.IGNORECASE)
TABLE_HEADING = re.compile(r'^(#{1,6})\s+.*decision table', re.IGNORECASE)
ANALYSES_HEADING = re.compile(r'^(#{1,6})\s+.*option analys', re.IGNORECASE)
FACTS_HEADING = re.compile(r'^(#{1,6})\s+.*re-verified facts', re.IGNORECASE)
CONFIDENCE_VALUES = {"observed", "inferred", "unknown"}
RESULT_VALUES = {"confirmed", "contradicted", "unverified"}
DECISION_ID = re.compile(r'\bD\d+\b')
PLACEHOLDER = re.compile(r'<[^>\n]{1,80}>')

# Column role detection by header substring.
TABLE_ROLE_PATTERNS = {
    "id": ["id"],
    "decision": ["sub-decision", "decision"],
    "chosen": ["chosen"],
    "losers": ["losing", "why they lost", "losers"],
    "evidence": ["evidence"],
    "confidence": ["confidence"],
}
TABLE_REQUIRED_NONEMPTY = ["decision", "chosen", "losers", "evidence"]

FACTS_ROLE_PATTERNS = {
    "fact": ["fact"],
    "where": ["re-checked", "where"],
    "result": ["result"],
    "affected": ["decisions affected", "affected"],
}
FACTS_REQUIRED_NONEMPTY = ["fact", "where", "result"]


def get_section(lines, heading_re):
    """Return (start, end) line indices for the section under the first heading
    matching heading_re, stopping at the next heading of equal-or-higher level."""
    start = None
    level = None
    for i, line in enumerate(lines):
        m = heading_re.match(line.strip())
        if m and start is None:
            start = i
            level = len(m.group(1))
            continue
        if start is not None:
            hm = re.match(r'^(#{1,6})\s+', line.strip())
            if hm and len(hm.group(1)) <= level:
                return start, i
    if start is not None:
        return start, len(lines)
    return None, None


def parse_table(block_lines):
    """Parse the first markdown table in block_lines. Returns (headers, rows)."""
    table = [ln for ln in block_lines if ln.strip().startswith("|")]
    if len(table) < 3:
        return None, None
    def cells(row):
        return [c.strip() for c in row.strip().strip("|").split("|")]
    headers = cells(table[0])
    # table[1] is the --- separator; data rows follow
    rows = [cells(r) for r in table[2:] if set(r.strip()) - set("|-: ")]
    return headers, rows


def map_roles(headers, patterns):
    roles = {}
    for idx, h in enumerate(headers):
        hl = h.lower()
        for role, needles in patterns.items():
            if role in roles:
                continue
            if any(n in hl for n in needles):
                roles[role] = idx
    return roles


def cell(row, roles, role):
    if role not in roles:
        return ""
    idx = roles[role]
    return row[idx] if idx < len(row) else ""


def validate(text):
    errors, warnings = [], []
    lines = text.splitlines()

    r_start, r_end = get_section(lines, RECORD_HEADING)
    if r_start is None:
        errors.append("Missing section: 'Solutions Architect Decision Record'.")
        return errors, warnings
    section = lines[r_start:r_end]
    section_text = "\n".join(section)

    if CAVEAT_MARKER not in section_text.lower():
        errors.append(
            "Missing standing caveat ('enumerated and evidence-checked, not that "
            "the winner is proven correct')."
        )

    leftover = PLACEHOLDER.findall(section_text)
    if leftover:
        sample = ", ".join(sorted(set(leftover))[:5])
        errors.append("Unresolved placeholders in addendum: {}".format(sample))

    table_ids = set()
    t_start, t_end = get_section(lines, TABLE_HEADING)
    if t_start is None:
        errors.append("Missing 'Decision Table' subsection.")
    else:
        headers, rows = parse_table(lines[t_start:t_end])
        if not headers or not rows:
            errors.append("Decision Table has no filled data rows.")
        else:
            roles = map_roles(headers, TABLE_ROLE_PATTERNS)
            missing_roles = [r for r in ("id", "decision", "chosen", "losers",
                                         "evidence", "confidence") if r not in roles]
            if missing_roles:
                errors.append("Decision Table header missing columns for: {}.".format(
                    ", ".join(missing_roles)))
            for n, row in enumerate(rows, 1):
                for role in TABLE_REQUIRED_NONEMPTY:
                    if role in roles and not cell(row, roles, role):
                        errors.append(
                            "Decision Table row {}: '{}' cell is blank.".format(n, role))
                id_val = cell(row, roles, "id")
                id_match = DECISION_ID.search(id_val)
                if id_match:
                    table_ids.add(id_match.group(0))
                elif "id" in roles:
                    warnings.append(
                        "Decision Table row {}: ID '{}' is not a stable D# ID.".format(
                            n, id_val))
                conf = cell(row, roles, "confidence").lower()
                if conf and conf not in CONFIDENCE_VALUES:
                    errors.append(
                        "Decision Table row {}: confidence '{}' not "
                        "Observed/Inferred/Unknown.".format(n, cell(row, roles, "confidence")))

    a_start, a_end = get_section(lines, ANALYSES_HEADING)
    if a_start is None:
        errors.append("Missing 'Option Analyses' subsection.")
    else:
        body = lines[a_start + 1:a_end]
        analysis_ids = set()
        for ln in body:
            hm = re.match(r'^#{1,6}\s+(.*)$', ln.strip())
            if hm:
                m = DECISION_ID.search(hm.group(1))
                if m:
                    analysis_ids.add(m.group(0))
        entries = [ln for ln in body
                   if re.match(r'^\s*([-*]|\d+\.)\s+\S', ln) or re.match(r'^#{1,6}\s+\S', ln)]
        if not entries:
            errors.append("Option Analyses has no entries.")
        if "what would flip" not in "\n".join(body).lower():
            warnings.append(
                "Option Analyses missing a 'What would flip this' line for the winners.")
        if table_ids and analysis_ids:
            unanalysed = sorted(table_ids - analysis_ids)
            orphaned = sorted(analysis_ids - table_ids)
            if unanalysed:
                warnings.append(
                    "Decision Table IDs with no Option Analyses entry: {}.".format(
                        ", ".join(unanalysed)))
            if orphaned:
                warnings.append(
                    "Option Analyses IDs missing from the Decision Table: {}.".format(
                        ", ".join(orphaned)))

    f_start, f_end = get_section(lines, FACTS_HEADING)
    if f_start is None:
        errors.append("Missing 'Re-Verified Facts' subsection.")
    else:
        headers, rows = parse_table(lines[f_start:f_end])
        if not headers or not rows:
            errors.append("Re-Verified Facts has no filled data rows.")
        else:
            roles = map_roles(headers, FACTS_ROLE_PATTERNS)
            missing_roles = [r for r in ("fact", "where", "result") if r not in roles]
            if missing_roles:
                errors.append("Re-Verified Facts header missing columns for: {}.".format(
                    ", ".join(missing_roles)))
            for n, row in enumerate(rows, 1):
                for role in FACTS_REQUIRED_NONEMPTY:
                    if role in roles and not cell(row, roles, role):
                        errors.append(
                            "Re-Verified Facts row {}: '{}' cell is blank.".format(n, role))
                res = cell(row, roles, "result").lower()
                if res and res not in RESULT_VALUES:
                    errors.append(
                        "Re-Verified Facts row {}: result '{}' not "
                        "Confirmed/Contradicted/Unverified.".format(n, cell(row, roles, "result")))
                if res == "contradicted":
                    warnings.append(
                        "Re-Verified Facts row {}: a Contradicted fact - confirm the "
                        "decisions resting on it were re-opened.".format(n))

    return errors, warnings


GOOD_SAMPLE = """## Solutions Architect Decision Record
> enumerated and evidence-checked, not that the winner is proven correct
### Decision Table
| ID | Sub-decision | Chosen option | Losing options -> why they lost | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- |
| D1 | queue row granularity | one row per group | per-recipient rows -> 50x write volume per migrations/0042; per-batch -> loses per-send audit trail required by audit_log.sql | supabase/migrations/0042_queue.sql | Observed |
### Option Analyses
#### D1 - queue row granularity
- **Option A (chosen): one row per group.** Matches existing announce queue shape.
- **Option B: per-recipient rows.** Rejected: write volume evidence in 0042.
- **Option C: per-batch blob.** Rejected: audit requires per-send rows.
- **What would flip this:** a requirement for per-recipient delivery receipts.
### Re-Verified Facts
| Fact the decisions rest on | Re-checked where | Result | Decisions affected |
| --- | --- | --- | --- |
| announce write policy requires announce.manage | policies/announcements.sql | Confirmed | D1 |
"""

BAD_SAMPLE = """## Solutions Architect Decision Record
### Decision Table
| ID | Sub-decision | Chosen option | Losing options -> why they lost | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- |
| D1 | queue row granularity | one row per group | | | Maybe |
"""


def self_test():
    e1, _ = validate(GOOD_SAMPLE)
    e2, _ = validate(BAD_SAMPLE)
    ok = (not e1) and bool(e2)
    print("self-test: good sample errors = {} (expect 0)".format(len(e1)))
    print("self-test: bad  sample errors = {} (expect >0)".format(len(e2)))
    print("self-test:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser(
        description="Validate a Solutions Architect Decision Record (structural only).")
    p.add_argument("path", nargs="?", help="Path to the plan / addendum markdown file.")
    p.add_argument("--strict", action="store_true", help="Treat warnings as errors.")
    p.add_argument("--self-test", action="store_true", help="Run built-in samples and exit.")
    args = p.parse_args()

    print("NOTE: structural validation only. A complete Decision Record means the "
          "options were ENUMERATED AND EVIDENCE-CHECKED, not that the winner is "
          "proven correct.\n")

    if args.self_test:
        return self_test()
    if not args.path:
        p.error("path is required unless --self-test is used.")
    try:
        with open(args.path, encoding="utf-8") as f:
            text = f.read()
    except OSError as exc:
        print("Cannot read {}: {}".format(args.path, exc))
        return 2

    errors, warnings = validate(text)

    for w in warnings:
        print("WARN: " + w)
    for e in errors:
        print("ERROR: " + e)

    if args.strict:
        errors = errors + warnings
    if errors:
        print("\nFAIL: {} issue(s).".format(len(errors)))
        return 1
    print("\nPASS (structure). The record shows the options were compared - "
          "confirm the cited evidence before trusting the winners.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
