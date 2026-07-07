#!/usr/bin/env python3
"""Verify the Claude and Codex skill packages have not drifted apart.

Checks that:
  1. every shared file is byte-identical across both packages,
  2. both SKILL.md files declare the same version,
  3. both distribution ZIPs exactly match their source folders
     (one top-level robust-feature-planner/ directory, same bytes).

Run from anywhere: python scripts/check_sync.py
Exit codes: 0 = in sync, 1 = drift found.
"""

from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLAUDE = ROOT / "claude-code" / "robust-feature-planner"
CODEX = ROOT / "openai-codex" / "robust-feature-planner"

SHARED_FILES = [
    "CHANGELOG.md",
    "assets/feature-plan-template.md",
    "assets/runtime-semantics-addendum.md",
    "assets/example-plan.md",
    "references/planning-quality-standard.md",
    "references/runtime-semantics-audit.md",
    "scripts/validate_plan.py",
    "scripts/validate_runtime_semantics.py",
]

ZIPS = {
    "robust-feature-planner-claude.zip": CLAUDE,
    "robust-feature-planner-codex.zip": CODEX,
}


def skill_version(package: Path) -> str | None:
    text = (package / "SKILL.md").read_text(encoding="utf-8")
    match = re.search(r"(?m)^version:\s*(\S+)", text)
    return match.group(1) if match else None


def check_shared_files() -> list[str]:
    problems = []
    for relative in SHARED_FILES:
        claude_file = CLAUDE / relative
        codex_file = CODEX / relative
        for path in (claude_file, codex_file):
            if not path.is_file():
                problems.append(f"missing shared file: {path.relative_to(ROOT)}")
        if claude_file.is_file() and codex_file.is_file():
            if claude_file.read_bytes() != codex_file.read_bytes():
                problems.append(f"shared file differs between packages: {relative}")
    return problems


def check_versions() -> list[str]:
    claude_version = skill_version(CLAUDE)
    codex_version = skill_version(CODEX)
    if claude_version is None or codex_version is None:
        return ["SKILL.md is missing a 'version:' frontmatter line in one or both packages."]
    if claude_version != codex_version:
        return [f"SKILL.md versions differ: claude={claude_version}, codex={codex_version}"]
    return []


def check_zip(zip_name: str, source: Path) -> list[str]:
    zip_path = ROOT / zip_name
    if not zip_path.is_file():
        return [f"missing archive: {zip_name} (run scripts/build_zips.py)"]
    expected = {
        "robust-feature-planner/" + path.relative_to(source).as_posix(): path.read_bytes()
        for path in sorted(source.rglob("*"))
        if path.is_file()
        and "__pycache__" not in path.parts
        and path.suffix not in (".pyc", ".pyo")
    }
    problems = []
    with zipfile.ZipFile(zip_path) as archive:
        entries = {info.filename for info in archive.infolist() if not info.is_dir()}
        for name in sorted(expected.keys() - entries):
            problems.append(f"{zip_name} is missing {name}")
        for name in sorted(entries - expected.keys()):
            problems.append(f"{zip_name} contains unexpected entry {name}")
        for name in sorted(expected.keys() & entries):
            if archive.read(name) != expected[name]:
                problems.append(f"{zip_name} entry {name} is stale")
    if problems:
        problems.append(f"rebuild with: python scripts/build_zips.py")
    return problems


def main() -> int:
    problems = check_shared_files() + check_versions()
    for zip_name, source in ZIPS.items():
        problems.extend(check_zip(zip_name, source))
    if problems:
        print("OUT OF SYNC:")
        for problem in problems:
            print("  - " + problem)
        return 1
    version = skill_version(CLAUDE)
    print(f"In sync: {len(SHARED_FILES)} shared files identical, "
          f"both packages at version {version}, both ZIPs match their sources.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
