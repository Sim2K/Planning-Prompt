#!/usr/bin/env python3
"""Rebuild both skill ZIP archives from their source folders.

Each archive contains exactly one top-level robust-feature-planner/ directory,
as required by the install instructions. Run scripts/check_sync.py afterwards.

Run from anywhere: python scripts/build_zips.py
"""

from __future__ import annotations

import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PACKAGES = {
    "robust-feature-planner-claude.zip": ROOT / "claude-code" / "robust-feature-planner",
    "robust-feature-planner-codex.zip": ROOT / "openai-codex" / "robust-feature-planner",
}


def package_files(source: Path) -> list[Path]:
    return sorted(
        path
        for path in source.rglob("*")
        if path.is_file()
        and "__pycache__" not in path.parts
        and path.suffix not in (".pyc", ".pyo")
    )


def main() -> int:
    for zip_name, source in PACKAGES.items():
        target = ROOT / zip_name
        files = package_files(source)
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
            for path in files:
                arcname = "robust-feature-planner/" + path.relative_to(source).as_posix()
                archive.write(path, arcname)
        print(f"built {zip_name} ({len(files)} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
