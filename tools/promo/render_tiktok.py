"""Render the content-marketing film in the client's TikTok-carousel template.

    python tools/promo/render_tiktok.py --slug content-creation-mastery

Reuses the measured narration in `vo/<slug>/` (same voice, same script) and
lays it under six template cards. Everything on screen is content-marketing
only — no other course, no campus statistics.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))

import tiktok as T  # noqa: E402
from render import (  # noqa: E402
    FFMPEG, FPS, H, W, build_audio, vo_durations, load_courses,
)
import tiktok_motion as M  # noqa: E402

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
IMG = ROOT / "public" / "images"
VO_DIR = HERE / "vo"
OUT_DIR = ROOT / "film-render"
FADE = 0.55


# ---------------------------------------------------------------------------
# the film: six cards, content marketing only
# ---------------------------------------------------------------------------
CARDS = [
    dict(
        headline="UNLOCK THE POWER OF CONTENT MARKETING!",
        bar="Turn attention into customers — no big budget needed!",
        bg=IMG / "hero-tile.jpg",
        inner=IMG / "courses" / "content-creation.jpg",
    ),
    dict(
        headline="CONSISTENCY BEATS TALENT.",
        bar="The accounts that grow are the most reliable!",
        bg=IMG / "courses" / "content-creation.jpg",
        inner=IMG / "bg-home.jpg",
    ),
    dict(
        headline="KNOW WHO YOU ARE TALKING TO.",
        bar="Content strategy and planning come first!",
        bg=IMG / "cat-marketing.jpg",
        inner=IMG / "bg-courses.jpg",
    ),
    dict(
        headline="JUST A PHONE IS ENOUGH.",
        bar="Photo and video basics that look expensive!",
        bg=IMG / "workspace.jpg",
        inner=IMG / "cat-video.jpg",
    ),
    dict(
        headline="CAPTIONS THAT CONVERT.",
        bar="Design tools and templates that keep you on brand!",
        bg=IMG / "bg-cta.jpg",
        inner=IMG / "cat-design.jpg",
    ),
    dict(
        headline="BATCH A MONTH IN ONE AFTERNOON.",
        bar="Plan, shoot, write and schedule it all at once!",
        bg=IMG / "bg-about.jpg",
        inner=IMG / "cat-writing.jpg",
    ),
    dict(
        headline="A 30-DAY PLAN READY TO PUBLISH.",
        bar="Know what to post, when to post, and why it works!",
        bg=IMG / "bg-courses.jpg",
        inner=IMG / "bg-home.jpg",
    ),
    dict(
        headline="REAL POSTS. REAL FEEDBACK.",
        bar="Publish every week and fix what is not working!",
        bg=IMG / "hero-tile.jpg",
        inner=IMG / "cat-marketing.jpg",
    ),
    dict(
        headline="STOP GUESSING. START POSTING.",
        bar="Enrol today at CHRISCO Digital Academy!",
        bg=IMG / "courses" / "digital-marketing.jpg",
        inner=IMG / "courses" / "content-creation.jpg",
    ),
]


# ---------------------------------------------------------------------------
# card raster (built once, animated per frame)
# ---------------------------------------------------------------------------
def build_card_image(spec) -> Image.Image:
    bg = T.soft_bg(T.cover(Image.open(spec["bg"]), (W, H)), 0.70, 11)
    inner = T.lift(T.cover(Image.open(spec["inner"]), (700, 900)), 0.05)
    return T.build_card(T.Card(bg=bg, inner=inner,
                               headline=spec["headline"], bar=spec["bar"]))


def plan_cards(meta) -> list[dict]:
    """Cut points follow the narration: a new card lands on each script beat."""
    hook = meta["hook"]["duration"]
    curr = meta["curriculum"]
    out = meta["outcomes"]
    proof = meta["proof"]
    cta = meta["cta"]["offset"]

    starts = [0.0, hook * 0.54]
    for f in (0.0, 0.24, 0.47, 0.70):
        starts.append(curr["offset"] + curr["duration"] * f)
    starts.append(out["offset"])
    starts.append(proof["offset"])
    starts.append(cta)
    starts.sort()
    cards = []
    for i, st in enumerate(starts):
        cards.append({"start": st,
                      "end": starts[i + 1] if i + 1 < len(starts) else None})
    return cards


# ---------------------------------------------------------------------------
# render
# ---------------------------------------------------------------------------
def render_film(course, out_path: Path, crf=19, preset="medium", log=print):
    slug = course["slug"]
    vo = vo_durations(slug)
    meta = json.loads((VO_DIR / slug / "meta.json").read_text())
    total = round(max(v["offset"] + v["duration"] for v in meta.values()) + 1.15, 2)

    log(f"  building {len(CARDS)} animated cards")
    plan = plan_cards(meta)
    plates = [M.build_layers(spec, (plan[i]["end"] or total) - plan[i]["start"] + M.PUSH)
              for i, spec in enumerate(CARDS)]

    out_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264", "-preset", preset, "-crf", str(crf),
        "-profile:v", "high", "-level", "4.2", "-pix_fmt", "yuv420p",
        "-x264-params", "keyint=60:min-keyint=30:scenecut=40",
        "-movflags", "+faststart", "-an", str(out_path),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.time()
    frames = int(round(total * FPS))

    for n in range(frames):
        t = n / FPS
        i = len(plan) - 1
        for k, c in enumerate(plan):
            if c["end"] is None or t < c["end"]:
                i = k
                break
        c = plan[i]
        local = t - c["start"]
        img = M.paint_card(plates[i], local)

        # carousel push: the current card leaves by sliding up while the next
        # one rides in from below. No crossfade, so two headlines never mix.
        if i + 1 < len(plan) and c["end"] is not None:
            to = c["end"] - t
            if 0 < to < M.PUSH:
                p = M.ease_in_out_cubic(1 - to / M.PUSH)
                nxt = M.paint_card(plates[i + 1], 0.0, animate=False)
                canvas = Image.new("RGB", (W, H), (255, 255, 255))
                canvas.paste(img, (0, -int(H * p)))
                canvas.paste(nxt, (0, H - int(H * p)))
                # soft seam where the two cards meet
                seam = int(H - H * p)
                if 0 <= seam < H:
                    d = ImageDraw.Draw(canvas)
                    d.rectangle((0, seam - 3, W, seam + 3), fill=(255, 255, 255))
                img = canvas

        proc.stdin.write(img.tobytes())
        if (n + 1) % 300 == 0:
            log(f"  {n + 1} frames  ({t:5.1f}s / {total:.1f}s)  "
                f"{time.time() - t0:5.1f}s elapsed")
    proc.stdin.close()
    proc.wait()
    if proc.returncode:
        raise RuntimeError("ffmpeg video encode failed")
    log(f"  video done: {out_path.name}  {frames} frames in {time.time() - t0:.1f}s")

    # audio: the measured narration, unchanged, over the music bed
    vo_paths = {k: (VO_DIR / slug / f"{k}.wav").resolve()
                for k in ("hook", "curriculum", "outcomes", "proof", "cta")}
    bed = HERE / "music" / "bed.mp3"
    wav = out_path.with_suffix(".mix.wav")
    seq = _seq_for_audio(slug)
    build_audio(seq, vo_paths, total, bed if bed.exists() else None, wav, slug)
    mux = out_path.with_suffix(".mux.mp4")
    subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
                    "-i", str(out_path), "-i", str(wav),
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", "-shortest", str(mux)], check=True)
    mux.replace(out_path)
    wav.unlink(missing_ok=True)
    log(f"  audio mixed → {out_path.name} ({out_path.stat().st_size / 1e6:.1f} MB)")
    return out_path, total


def _seq_for_audio(slug):
    """Scene list whose starts reproduce the measured narration offsets."""
    meta = json.loads((VO_DIR / slug / "meta.json").read_text())
    seq = []
    cursor = 0.0
    for key in ("hook", "curriculum", "outcomes", "proof", "cta"):
        if key not in meta:
            continue
        start = meta[key]["offset"]
        # build_audio places a clip at scene_start + VO_LEAD (0.55)
        lead = 0.55
        gap = max(0.0, start - lead - cursor)
        if gap > 0.001:
            seq.append({"vo": None, "dur": gap})
            cursor += gap
        seq.append({"vo": key, "dur": meta[key]["duration"]})
        cursor += meta[key]["duration"]
    return seq


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default="content-creation-mastery")
    ap.add_argument("--crf", type=int, default=19)
    ap.add_argument("--preset", default="medium")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    courses = load_courses()
    course = next((c for c in courses if c["slug"] == args.slug), None)
    if course is None:
        sys.exit(f"unknown slug {args.slug}")
    out = Path(args.out) if args.out else OUT_DIR / f"{course['slug']}-tiktok.mp4"
    print(f"▶ {course['id']:02d} {course['title']}  →  {out.name}")
    render_film(course, out, crf=args.crf, preset=args.preset)


if __name__ == "__main__":
    main()
