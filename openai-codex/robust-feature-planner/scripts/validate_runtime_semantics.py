#!/usr/bin/env python3
"""
validate_runtime_semantics.py

Standalone STRUCTURAL validator for the optional Runtime Semantics Audit addendum.

It does NOT modify or depend on the base validate_plan.py. Run it on its own, or
wire it into validate_plan.py behind a --runtime flag (see SWITCH-WIRING-GUIDE.md).

What it checks (structure only):
  - the "Runtime Semantics Audit" section exists
  - the standing caveat is present
  - the Invariants Ledger has >= 1 filled data row, all six roles non-empty
  - the "If wrong -> divergence" and "Diff-level check" cells are never blank
  - confidence cells are Observed / Inferred / Unknown
  - the Reviewer Hotlist exists and is non-empty
  - no unresolved <...> placeholders remain
  - (--scan) if a plan shows concurrency keywords but no audit section, flag it

WHAT IT DOES NOT DO: prove any assumption is true. A fully passing addendum is an
INVITATION TO REVIEW, NOT A CERTIFICATE of correctness.

Python 3.6+. No third-party dependencies.

Exit codes: 0 = pass, 1 = structural errors found, 2 = usage error.
"""

import argparse
import re
import sys

CAVEAT_MARKER = "invitation to review, not a certificate"
AUDIT_HEADING = re.compile(r'^(#{1,6})\s+.*runtime semantics audit', re.IGNORECASE)
HOTLIST_HEADING = re.compile(r'^(#{1,6})\s+.*reviewer hotlist', re.IGNORECASE)
LEDGER_HEADING = re.compile(r'^(#{1,6})\s+.*invariants ledger', re.IGNORECASE)
CONFIDENCE_VALUES = {"observed", "inferred", "unknown"}
PLACEHOLDER = re.compile(r'<[^>\n]{1,80}>')

TRIGGER_KEYWORDS = [
    r'\block\b', r'\bmutex\b', r'\bthread', r'\bgoroutine', r'\basync\b', r'\bawait\b',
    r'\bconcurren', r'\brace condition', r'\btransaction', r'\bisolation\b',
    r'read committed', r'repeatable read', r'serializable', r'\batomic',
    r'\bconnection pool', r'\bidempoten', r'for update', r'shared mutable', r'shared state',
]

# Column role detection by header substring.
ROLE_PATTERNS = {
    "resource": ["resource", "path"],
    "assumption": ["assumption"],
    "axis": ["axis"],
    "confidence": ["confidence", "evidence"],
    "divergence": ["if wrong", "divergence"],
    "check": ["diff-level", "check", "reviewer"],
}
REQUIRED_NONEMPTY_ROLES = ["resource", "assumption", "confidence", "divergence", "check"]


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


def map_roles(headers):
    roles = {}
    for idx, h in enumerate(headers):
        hl = h.lower()
        for role, needles in ROLE_PATTERNS.items():
            if role in roles:
                continue
            if any(n in hl for n in needles):
                roles[role] = idx
    return roles


def validate(text):
    errors, warnings = [], []
    lines = text.splitlines()

    a_start, a_end = get_section(lines, AUDIT_HEADING)
    if a_start is None:
        errors.append("Missing section: 'Runtime Semantics Audit'.")
        return errors, warnings
    section = lines[a_start:a_end]
    section_text = "\n".join(section)

    if CAVEAT_MARKER not in section_text.lower():
        errors.append("Missing standing caveat ('invitation to review, not a certificate').")

    leftover = PLACEHOLDER.findall(section_text)
    if leftover:
        sample = ", ".join(sorted(set(leftover))[:5])
        errors.append("Unresolved placeholders in addendum: {}".format(sample))

    l_start, l_end = get_section(lines, LEDGER_HEADING)
    if l_start is None:
        errors.append("Missing 'Invariants Ledger' subsection.")
    else:
        headers, rows = parse_table(lines[l_start:l_end])
        if not headers or not rows:
            errors.append("Invariants Ledger has no filled data rows.")
        else:
            roles = map_roles(headers)
            missing_roles = [r for r in ("resource", "assumption", "confidence",
                                         "divergence", "check") if r not in roles]
            if missing_roles:
                errors.append("Ledger header missing columns for: {}.".format(
                    ", ".join(missing_roles)))
            for n, row in enumerate(rows, 1):
                for role in REQUIRED_NONEMPTY_ROLES:
                    if role in roles:
                        idx = roles[role]
                        val = row[idx] if idx < len(row) else ""
                        if not val:
                            errors.append("Ledger row {}: '{}' cell is blank.".format(n, role))
                if "confidence" in roles:
                    idx = roles["confidence"]
                    val = (row[idx] if idx < len(row) else "").lower()
                    if val and val not in CONFIDENCE_VALUES:
                        errors.append(
                            "Ledger row {}: confidence '{}' not Observed/Inferred/Unknown.".format(n, row[idx]))

    h_start, h_end = get_section(lines, HOTLIST_HEADING)
    if h_start is None:
        errors.append("Missing 'Reviewer Hotlist' subsection.")
    else:
        body = [ln for ln in lines[h_start + 1:h_end]
                if re.match(r'^\s*([-*]|\d+\.)\s+\S', ln)]
        if not body:
            errors.append("Reviewer Hotlist has no ranked entries.")
        if "non-optional" not in "\n".join(lines[h_start:h_end]).lower():
            warnings.append("Reviewer Hotlist missing the 'non-optional' senior-review line.")

    return errors, warnings


def scan_for_missing_audit(text):
    """Heuristic: concurrency keywords present but no audit section -> warn/err."""
    has_audit = AUDIT_HEADING.search(text) is not None
    hits = [k for k in TRIGGER_KEYWORDS if re.search(k, text, re.IGNORECASE)]
    if hits and not has_audit:
        return ["Plan shows runtime-risk keywords ({}) but has no Runtime Semantics "
                "Audit section. Run with the switch ON.".format(
                    ", ".join(sorted({h.strip('\\b') for h in hits}))[:120])]
    return []


GOOD_SAMPLE = """## Runtime Semantics Audit
> invitation to review, not a certificate
### Invariants Ledger
| Resource / path | Assumption | Axis | Confidence | If wrong -> divergence | Diff-level check |
| --- | --- | --- | --- | --- | --- |
| accounts.balance | decrement atomic | tx-isolation | Inferred | concurrent RMW at READ COMMITTED loses update -> overdraw | look for FOR UPDATE / atomic UPDATE |
### Reviewer Hotlist
1. **services/ledger.py** - Question: is the debit guarded? Settles it: integration test under load. Blast radius: double-spend.
These are the diffs where review is **non-optional** before merge.
"""

BAD_SAMPLE = """## Runtime Semantics Audit
### Invariants Ledger
| Resource / path | Assumption | Axis | Confidence | If wrong -> divergence | Diff-level check |
| --- | --- | --- | --- | --- | --- |
| accounts.balance | decrement atomic | tx-isolation | Maybe | | |
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
    p = argparse.ArgumentParser(description="Validate a Runtime Semantics Audit addendum (structural only).")
    p.add_argument("path", nargs="?", help="Path to the plan / addendum markdown file.")
    p.add_argument("--scan", action="store_true",
                   help="Only check whether concurrency keywords appear without an audit section.")
    p.add_argument("--strict", action="store_true", help="Treat warnings as errors.")
    p.add_argument("--self-test", action="store_true", help="Run built-in samples and exit.")
    args = p.parse_args()

    print("NOTE: structural validation only. A green addendum is an INVITATION TO "
          "REVIEW, not a certificate of correctness.\n")

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

    if args.scan:
        errors, warnings = scan_for_missing_audit(text), []
    else:
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
    print("\nPASS (structure). Now hand the Hotlist to a human who knows the fundamentals.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
