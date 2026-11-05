"""Batch driver for the 19 course films.

    python tools/promo/batch.py texts            # print narration for TTS
    python tools/promo/batch.py align            # word-align every take
    python tools/promo/batch.py render [slugs]   # render films (resumable)
    python tools/promo/batch.py package          # zip + checksums for release
    python tools/promo/batch.py status
"""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
import time
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))

from copy import COPY  # noqa: E402
from render import load_courses, render_film, OUT_DIR  # noqa: E402
from build_vo import build, section_text, KEYS  # noqa: E402

OUT_DIR = ROOT / "film-render"


def texts():
    for c in load_courses():
        print(f"\n### {c['slug']}\n" + " ".join(section_text(c["slug"])[k] for k in KEYS))


def align_all():
    ok, missing = [], []
    for c in load_courses():
        src = HERE / "vo" / c["slug"] / "narration.mp3"
        if not src.exists():
            missing.append(c["slug"])
            continue
        meta, dur = build(c["slug"], src)
        total = sum(v["duration"] for v in meta.values())
        ok.append(c["slug"])
        print(f"{c['slug']:44s} take={dur:6.2f}s segments={total:6.2f}s")
    print(f"\naligned {len(ok)}/{len(ok) + len(missing)}")
    if missing:
        print("missing narration:", ", ".join(missing))


def render(slugs, preset="medium", crf=19):
    courses = load_courses()
    todo = [c for c in courses if not slugs or c["slug"] in slugs]
    t0 = time.time()
    for i, c in enumerate(todo, 1):
        out = OUT_DIR / f"{c['slug']}.mp4"
        if out.exists() and out.stat().st_size > 5_000_000:
            print(f"[{i}/{len(todo)}] skip {c['slug']} (already rendered)")
            continue
        print(f"[{i}/{len(todo)}] {c['title']} → {out.name}", flush=True)
        t1 = time.time()
        target, total = render_film(c, out, preset=preset, crf=crf,
                                    log=lambda m: print(m, flush=True))
        print(f"      {total:.1f}s film in {time.time() - t1:.0f}s "
              f"({target.stat().st_size / 1e6:.1f} MB)", flush=True)
    print(f"batch finished in {(time.time() - t0) / 60:.1f} min")


def package():
    films = sorted(OUT_DIR.glob("*.mp4"))
    films = [f for f in films if "preview" not in f.name and f.stat().st_size > 5_000_000]
    if not films:
        print("nothing to package")
        return
    courses = {c["slug"]: c for c in load_courses()}
    lines = ["# CHRISCO Digital Academy — Course Films", "",
             "19 vertical films · 1080 × 1920 · 30 fps · H.264 High + AAC 192k · "
             "English narration with burned-in captions", "",
             "| # | Film | Track | Length | Size | SHA-256 |", "|---|---|---|---|---|---|"]
    for f in films:
        dur = float(subprocess.run(
            ["/home/user/tools/ffmpeg", "-v", "error", "-i", str(f),
             "-f", "null", "-"], capture_output=True, text=True).stderr or 0)
        size = f.stat().st_size
        digest = hashlib.sha256(f.read_bytes()).hexdigest()
        c = courses.get(f.stem, {})
        lines.append(f"| {c.get('id','')} | {f.name} | {c.get('category','')} | "
                     f"{dur:.1f} MB | {size/1e6:.1f} MB | `{digest[:16]}…` |")
    (OUT_DIR / "MANIFEST.md").write_text("\n".join(lines) + "\n")
    zpath = OUT_DIR / "chrisco-course-films.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_STORED) as z:
        for f in films:
            z.write(f, f.name)
        z.write(OUT_DIR / "MANIFEST.md", "MANIFEST.md")
    print(f"zipped {len(films)} films → {zpath.name} ({zpath.stat().st_size/1e6:.0f} MB)")


def status():
    for c in load_courses():
        vo = (HERE / "vo" / c["slug"] / "meta.json").exists()
        w = HERE / "vo" / c["slug"] / "narration.mp3"
        film = OUT_DIR / f"{c['slug']}.mp4"
        size = f"{film.stat().st_size/1e6:5.1f} MB" if film.exists() else "     —"
        print(f"{c['id']:02d} {c['slug']:44s} vo={'yes' if vo else '—':3s} "
              f"take={'yes' if w.exists() else '—':3s} film={size}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "texts":
        texts()
    elif cmd == "align":
        align_all()
    elif cmd == "render":
        render(sys.argv[2:])
    elif cmd == "package":
        package()
    else:
        status()
