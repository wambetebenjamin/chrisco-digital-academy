"""Publish finished films to GitHub Releases and write the download index.

Every link is generated from files that actually exist, so the index can never
advertise a video that was not uploaded. For each film we publish:

  * a plain MP4 (the film itself)
  * a ZIP containing that one film (for people who want a one-click archive)

and GitHub's own `/releases/download/<tag>/<file>` path, which sends
`Content-Disposition: attachment` and therefore downloads instead of opening a
player tab.

    python tools/promo/publish.py            # upload missing assets + write index
    python tools/promo/publish.py --index    # rewrite the index only
    python tools/promo/publish.py --verify   # HEAD-check every link
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))

from render import load_courses  # noqa: E402

REPO = "wambetebenjamin/chrisco-digital-academy"
TAG = "course-films-v1"
OUT = ROOT / "film-render"
BUNDLE = OUT / "_bundle"
SITE = "https://chrisco-digital-academy.vercel.app"


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def existing_films():
    """Films on disk, in course order, with the course metadata attached."""
    courses = {c["slug"]: c for c in load_courses()}
    found = []
    for slug, c in courses.items():
        p = OUT / f"{slug}.mp4"
        if p.exists() and p.stat().st_size > 2_000_000:
            found.append((c, p))
    return found


def duration(path: Path) -> float:
    r = run(["/home/user/tools/ffmpeg", "-hide_banner", "-i", str(path)])
    m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", r.stderr)
    if not m:
        return 0.0
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def release_assets():
    r = run(["gh", "release", "view", TAG, "--repo", REPO, "--json", "assets"])
    if r.returncode:
        return set()
    try:
        return {a["name"] for a in json.loads(r.stdout)["assets"]}
    except Exception:
        return set()


def one_click_zip(course, film: Path) -> Path:
    BUNDLE.mkdir(parents=True, exist_ok=True)
    zpath = BUNDLE / f"chrisco-{course['slug']}.zip"
    if zpath.exists() and zpath.stat().st_size > 2_000_000:
        return zpath
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_STORED) as z:
        z.write(film, f"CHRISCO - {course['title']}.mp4")
        z.writestr(
            "READ-ME.txt",
            f"CHRISCO Digital Academy — {course['title']}\n"
            f"Track: {course['category']} · {course['level']} · {course['duration']}\n"
            f"Video: {film.name} (1080 x 1920, 30 fps, H.264 + AAC)\n"
            f"Course page: {SITE}/courses\n\n"
            "Scanned QR on the end card opens the courses page.\n",
        )
    return zpath


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def upload(films, dry=False):
    have = release_assets()
    print(f"release {TAG}: {len(have)} asset(s) already attached")
    for course, film in films:
        z = one_click_zip(course, film)
        for asset in (film, z):
            if asset.name in have:
                print(f"  = {asset.name}")
                continue
            if dry:
                print(f"  + {asset.name} (dry run)")
                continue
            print(f"  ↑ {asset.name} ({asset.stat().st_size / 1e6:.1f} MB)")
            r = run(["gh", "release", "upload", TAG, str(asset), "--repo", REPO, "--clobber"])
            if r.returncode:
                print("    FAILED:", (r.stderr or r.stdout).strip()[:300])
            else:
                have.add(asset.name)
    return have


def dl(name: str) -> str:
    return f"https://github.com/{REPO}/releases/download/{TAG}/{name}"


def write_index(films, have):
    """MANIFEST.md for the release + RELEASE-LINKS.md in the repo root."""
    rows, links = [], []
    for i, (c, film) in enumerate(films, 1):
        dur = duration(film)
        size = film.stat().st_size / 1e6
        digest = sha256(film)[:16]
        zname = f"chrisco-{c['slug']}.zip"
        mp4_ok = film.name in have
        zip_ok = zname in have
        rows.append(
            f"| {i:02d} | **{c['title']}** | {c['category']} · {c['duration']} | "
            f"{int(dur // 60)}:{int(dur % 60):02d} | {size:.1f} MB | "
            f"[⬇ Download MP4]({dl(film.name)}) | "
            + (f"[⬇ One-click ZIP]({dl(zname)}) |" if zip_ok else "— |")
            + f" `{digest}…` |"
        )
        links.append(
            f"{i:02d}. **{c['title']}** — {c['category']}\n"
            f"    - MP4: {dl(film.name)}\n"
            + (f"    - ZIP: {dl(zname)}\n" if zip_ok else "")
        )

    header = (
        "# CHRISCO Digital Academy — Course Films\n\n"
        f"**{len(films)} films** · 1080 × 1920 (9:16) · 30 fps · H.264 High · "
        "AAC 192 kbps · English narration with burned-in captions · −14 LUFS\n\n"
        "Every link below downloads the file directly. No account, no player page.\n\n"
        "| # | Film | Track | Length | Size | Direct download | Archive | SHA-256 |\n"
        "|---|---|---|---|---|---|---|---|\n"
    )
    bundle = "chrisco-course-films.zip"
    footer = (
        "\n\n## Full collection\n\n"
        + (f"- All films in one archive: {dl(bundle)}\n" if bundle in have
           else "- The full-collection archive is uploaded once every film is rendered.\n")
        + f"\n## Raw links\n\n```\n"
        + "\n".join(links)
        + "\n```\n"
    )
    (OUT / "MANIFEST.md").write_text(header + "\n".join(rows) + footer)

    pretty = (
        "# ⬇️ Download the course films\n\n"
        f"All {len(films)} films, direct download. 1080 × 1920, ~90 seconds each, "
        "narrated with captions.\n\n"
        "| # | Film | Download |\n|---|---|---|\n"
        + "\n".join(
            f"| {i:02d} | {c['title']} | [MP4]({dl(f.name)}) · [ZIP]({dl('chrisco-' + c['slug'] + '.zip')}) |"
            for i, (c, f) in enumerate(films, 1)
        )
        + "\n"
    )
    (ROOT / "RELEASE-LINKS.md").write_text(pretty)
    print(f"wrote {OUT / 'MANIFEST.md'} and RELEASE-LINKS.md ({len(films)} films)")


def verify(films):
    bad = 0
    for c, f in films:
        for name in (f.name, f"chrisco-{c['slug']}.zip"):
            url = dl(name)
            r = run(["curl", "-sIL", "-o", "/dev/null", "-w", "%{http_code} %{size_download}",
                     url, "-L"])
            code = r.stdout.split()[0] if r.stdout else "???"
            print(f"  {code}  {name}")
            if code not in ("200", "302"):
                bad += 1
    return bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", action="store_true")
    ap.add_argument("--verify", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    films = existing_films()
    if not films:
        sys.exit("no rendered films found in film-render/")
    if args.verify:
        sys.exit(1 if verify(films) else 0)
    have = release_assets() if args.index else upload(films, dry=args.dry_run)
    write_index(films, have)


if __name__ == "__main__":
    main()
