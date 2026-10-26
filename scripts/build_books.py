#!/usr/bin/env python3
"""Unified entry point to build all 20 28-page illustrated CHRISCO e-books:
1. Christian & Prophetic Shelf: Joseph — 7 Lessons Every Emerging Seer Prophet Must Learn
2. Skill & Learning Shelf: All 19 Practical Digital Skill Course Handbooks
"""

from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    for script in ("scripts/build_joseph_ebook.py", "scripts/build_courses_ebooks.py"):
        print(f"=== Running {script} ===")
        subprocess.run([sys.executable, str(ROOT / script)], check=True, cwd=str(ROOT))
    print("All 20 28-page illustrated e-books built into content/books/ successfully.")


if __name__ == "__main__":
    main()
