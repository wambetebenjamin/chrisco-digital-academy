"""Prepare the media tree that the publishing workflow restores from cache.

    python tools/promo/media_snapshot.py build      # media/films + media/bundle
    python tools/promo/media_snapshot.py key        # print the cache key suffix

`media/` is git-ignored: it is a staging area for the GitHub Actions cache and
for archive uploads, never committed to history.
"""
from __future__ import annotations

import hashlib
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))

from render import load_courses  # noqa: E402

RENDER = ROOT / "film-render"
MEDIA = ROOT / "media"
FILMS = MEDIA / "films"
BUNDLE = MEDIA / "bundle"
CACHE_KEY = "course-films-media-v2"


def films():
    courses = {c["slug"]: c for c in load_courses()}
    out = []
    for slug, c in courses.items():
        p = RENDER / f"{slug}.mp4"
        if p.exists() and p.stat().st_size > 2_000_000:
            out.append((c, p))
    return out


def build():
    FILMS.mkdir(parents=True, exist_ok=True)
    BUNDLE.mkdir(parents=True, exist_ok=True)
    found = films()
    for c, p in found:
        target = FILMS / p.name
        if not target.exists() or target.stat().st_size != p.stat().st_size:
            target.write_bytes(p.read_bytes())
        z = BUNDLE / f"chrisco-{c['slug']}.zip"
        if not z.exists() or z.stat().st_size < 1_000_000:
            with zipfile.ZipFile(z, "w", zipfile.ZIP_STORED) as zf:
                zf.write(p, f"CHRISCO - {c['title']}.mp4")
    total = sum(p.stat().st_size for p in FILMS.glob("*.mp4"))
    print(f"{len(found)} films staged in media/films ({total / 1e6:.0f} MB), "
          f"{len(list(BUNDLE.glob('*.zip')))} archives")
    return found


def key() -> str:
    """Cache key that changes only when the rendered bytes change."""
    h = hashlib.sha256()
    for p in sorted((RENDER).glob("*.mp4")):
        if p.stat().st_size > 2_000_000:
            h.update(p.name.encode())
            h.update(str(p.stat().st_size).encode())
            with p.open("rb") as f:
                h.update(f.read(1 << 20))
    return f"{CACHE_KEY}-{h.hexdigest()[:12]}"


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "key":
        print(key())
    else:
        build()
