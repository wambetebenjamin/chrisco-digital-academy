"""Compositor: stitches scenes, VO, captions and the film grade into an MP4.

    python tools/promo/render.py --slug digital-marketing --preview 5

Renders frames in-process and pipes rawvideo straight into ffmpeg, so no
intermediate PNG sequence ever touches disk.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))

import brand  # noqa: E402
import scenes  # noqa: E402
from scenes import grain, vignette_layer  # noqa: E402
from brand import (  # noqa: E402
    FPS, GREEN, H, ROOT, TEAL, WHITE, W, clamp, ease_out_cubic, font, text_layer,
)
from copy import COPY  # noqa: E402

HERE = Path(__file__).resolve().parent
FFMPEG = os.environ.get("FFMPEG_BIN", "/home/user/tools/ffmpeg")
VO_DIR = HERE / "vo"
OUT_DIR = ROOT / "film-render"

WORDS_PER_SEC = 2.62  # measured from the generated narration, refined by timing.json


# ---------------------------------------------------------------------------
# film spec
# ---------------------------------------------------------------------------
def course_slug(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def load_courses():
    data = json.loads((HERE / "courses.json").read_text())
    out = []
    for c in data:
        slug = course_slug(c["title"])
        out.append({**c, "slug": slug, "copy": COPY[slug]})
    return out


def probe_meta(slug):
    """Measured duration + audio fingerprint per chunk (see build_vo.py)."""
    path = HERE / "vo" / slug / "meta.json"
    if path.exists():
        return json.loads(path.read_text())
    return {}


def word_timings(slug, key):
    """Real per-word start/end times measured by charset alignment."""
    path = HERE / "vo" / slug / f"{key}.words.json"
    if path.exists():
        return json.loads(path.read_text())
    return None


def vo_durations(slug):
    """Measured narration lengths (seconds) per chunk, else a text estimate."""
    meta = probe_meta(slug)
    if meta:
        return {k: v["duration"] for k, v in meta.items()}
    c = COPY[slug]
    n = c["narration"]
    est = {}
    for k in ("hook", "curriculum", "outcomes", "proof"):
        words = len(n[k].split())
        est[k] = round(words / WORDS_PER_SEC, 2)
    return est


def plan_film(course, vo):
    """Scene lengths derived from narration so the edit breathes around VO."""
    hook = max(11.0, vo["hook"] + 2.8)
    syl = max(20.0, vo["curriculum"] + 4.6)
    out = max(10.0, vo["outcomes"] + 2.8)
    proof = max(7.0, vo["proof"] + 2.4)
    seq = [
        ("cold", 3.0, None),
        ("hook", round(hook, 2), "hook"),
        ("title", 7.0, None),
        ("syllabus", round(syl, 2), "curriculum"),
        ("outcomes", round(out, 2), "outcomes"),
        ("montage", 10.0, None),
        ("proof", round(proof, 2), "proof"),
        ("cta", round(max(9.0, vo.get("cta", 5.0) + 3.4), 2), "cta"),
        ("outro", 6.0, None),
    ]
    # trim / pad so every film lands near 90 s without touching VO safety
    total = sum(s[1] for s in seq)
    target = 90.0
    delta = target - total
    if abs(delta) > 0.5:
        pull = delta / 4
        seq[5] = ("montage", max(7.0, round(seq[5][1] + pull, 2)), None)
        seq[7] = ("cta", max(9.0, round(seq[7][1] + pull, 2)), None)
        seq[8] = ("outro", max(5.0, round(seq[8][1] + pull, 2)), None)
        seq[0] = ("cold", max(2.6, round(seq[0][1] + pull * 0.4, 2)), None)
    return seq


def build_scenes(course):
    vo = vo_durations(course["slug"])
    seq = plan_film(course, vo)
    builders = {
        "cold": lambda d: scenes.build_cold_open(course, d),
        "hook": lambda d: scenes.build_hook(course, d, course["copy"]["hook_display"]),
        "title": lambda d: scenes.build_title(course, d),
        "syllabus": lambda d: scenes.build_syllabus(course, d),
        "outcomes": lambda d: scenes.build_outcomes(
            {**course, "outcome_lines": course["copy"]["outcome_lines"]}, d),
        "montage": lambda d: scenes.build_montage(course, d),
        "proof": lambda d: scenes.build_proof(course, d),
        "cta": lambda d: scenes.build_cta(
            {**course, "cta": course["copy"]["cta"]}, d),
        "outro": lambda d: scenes.build_outro(course, d),
    }
    out = []
    for name, dur, vo_key in seq:
        out.append({"scene": builders[name](dur), "vo": vo_key, "dur": dur})
    return out, vo


# ---------------------------------------------------------------------------
# captions
# ---------------------------------------------------------------------------
CAP_FONT_SIZE = 58
CAP_MAX_W = 900


def caption_groups(text: str):
    """Split narration into short caption chunks (≤ 2 lines, ~7 words)."""
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    groups = []
    for s in sentences:
        words = s.split()
        while len(words) > 8:
            cut = 8
            # prefer breaking after a comma
            for i in range(8, 3, -1):
                if words[i - 1].endswith(","):
                    cut = i
                    break
            groups.append(words[:cut])
            words = words[cut:]
        if words:
            groups.append(words)
    return groups


def syllables(word: str) -> int:
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w:
        return 1
    groups = re.findall(r"[aeiouy]+", w)
    n = len(groups)
    if w.endswith("e") and n > 1 and not w.endswith(("le", "ee")):
        n -= 1
    return max(1, n)


def timed_groups(text: str, duration: float, lead=0.12, tail=0.25, measured=None):
    """Word weights → absolute times within the clip (measured wins)."""
    groups = caption_groups(text)
    if measured:
        flat_measured = measured
        k = 0
        out = []
        for g in groups:
            words = []
            for w in g:
                if k >= len(flat_measured):
                    words.append((w, duration, duration))
                    k += 1
                    continue
                _, s0, s1 = flat_measured[k]
                words.append((w, s0, s1))
                k += 1
            out.append({"words": words, "start": words[0][1],
                        "end": words[-1][2]})
        return out
    weights = [[syllables(w) + 0.35 for w in g] for g in groups]
    flat = [w for g in weights for w in g]
    total = sum(flat) or 1
    span = max(0.5, duration - lead - tail)
    t = lead
    out = []
    for g, ws in zip(groups, weights):
        words = []
        for w, wt in zip(g, ws):
            d = span * wt / total
            words.append((w, t, t + d))
            t += d
        out.append({"words": words, "start": words[0][1], "end": words[-1][2]})
    return out


def build_caption_line(words, active_idx, accent_from=None):
    """Draw one caption line into an RGBA layer, highlight word `active_idx`."""
    f = font("archivo", CAP_FONT_SIZE, weight=800)
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    space = probe.textlength(" ", font=f)
    widths = [probe.textlength(w, font=f) for w in words]
    total = sum(widths) + space * (len(words) - 1)
    layer = Image.new("RGBA", (int(total) + 16, int(CAP_FONT_SIZE * 1.7)), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x = 8
    for i, w in enumerate(words):
        spoken = accent_from is None or i >= accent_from
        col = GREEN if (i == active_idx and spoken) else (WHITE if spoken else (198, 214, 212))
        d.text((x + 2, 12), w, font=f, fill=(0, 18, 26, 170), stroke_width=0)
        d.text((x, 10), w, font=f, fill=col, stroke_width=0)
        x += widths[i] + space
    return layer


def caption_frame(t, groups, y_center=1462):
    """Return an RGBA overlay for time `t` inside a VO clip."""
    active = None
    for i, g in enumerate(groups):
        if g["start"] - 0.05 <= t <= g["end"] + 0.35:
            active = i
            break
    if active is None:
        return None
    g = groups[active]
    words = [w for w, _, _ in g["words"]]
    wi = 0
    for i, (_, s, e) in enumerate(g["words"]):
        if t >= s:
            wi = i
    fade = clamp((t - g["start"]) / 0.16)
    f = font("archivo", CAP_FONT_SIZE, weight=800)
    lines = caption_split(words, f, CAP_MAX_W)
    small = [w for ln in lines for w in ln]
    # highlight index maps through the split
    idx = small.index(words[wi]) if words[wi] in small else 0
    layers = []
    for li, ln in enumerate(lines):
        start_i = sum(len(x) for x in lines[:li])
        local_active = idx - start_i if start_i <= idx < start_i + len(ln) else None
        layers.append(build_caption_line(ln, local_active))
    pad_x, pad_y, gap = 34, 16, 6
    total_h = sum(int(l.height * 0.72) for l in layers) + gap * (len(layers) - 1)
    total_w = max(l.width for l in layers)
    y = y_center - total_h / 2
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    plate = Image.new("RGBA", (int(total_w + pad_x * 2), int(total_h + pad_y * 2)),
                      (0, 0, 0, 0))
    ImageDraw.Draw(plate).rounded_rectangle(
        (0, 0, plate.width - 1, plate.height - 1), radius=26,
        fill=(0, 30, 44, 196))
    overlay.alpha_composite(plate, (int((W - plate.width) / 2), int(y - pad_y)))
    for lay in layers:
        lay = lay.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * fade)))
        overlay.alpha_composite(lay, (int((W - lay.width) / 2), int(y)))
        y += int(lay.height * 0.72) + gap
    return overlay


def caption_split(words, f, max_w):
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    space = probe.textlength(" ", font=f)
    lines, cur, cw = [], [], 0.0
    for w in words:
        ww = probe.textlength(w, font=f)
        add = ww if not cur else ww + space
        if cw + add > max_w and cur:
            lines.append(cur)
            cur, cw = [w], ww
        else:
            cur.append(w)
            cw += add
    if cur:
        lines.append(cur)
    return lines


# ---------------------------------------------------------------------------
# compositing
# ---------------------------------------------------------------------------
def compose(frames_scenes, t):
    """Resolve scene + crossfade at absolute time t."""
    acc = 0.0
    for i, sc in enumerate(frames_scenes):
        dur = sc["dur"]
        if t < acc + dur or i == len(frames_scenes) - 1:
            local = clamp(t - acc, 0, dur)
            frame = sc["scene"].draw(local)
            if frame.mode != "RGBA":
                frame = frame.convert("RGBA")
            fade = sc["scene"].fade
            # fade in from previous scene
            if i > 0 and local < fade:
                prev = frames_scenes[i - 1]["scene"]
                prev_t = frames_scenes[i - 1]["dur"] - 0.001
                back = prev.draw(prev_t).convert("RGBA")
                k = local / fade
                frame = Image.blend(back, frame, ease_out_cubic(k))
            # fade out into next
            if i < len(frames_scenes) - 1 and dur - local < fade:
                nxt = frames_scenes[i + 1]["scene"]
                k = (dur - local) / fade
                fore = nxt.draw(0.0).convert("RGBA")
                frame = Image.blend(fore, frame, ease_out_cubic(k))
            return frame, sc
        acc += dur
    return frames_scenes[-1]["scene"].draw(0).convert("RGBA"), frames_scenes[-1]


def total_duration(seq):
    return sum(s["dur"] for s in seq)


def progress_bar(frame, t, total):
    d = ImageDraw.Draw(frame, "RGBA")
    w = int((W - 0) * clamp(t / total))
    d.rectangle((0, 0, w, 6), fill=GREEN + (235,))
    d.rectangle((w, 0, W, 6), fill=(255, 255, 255, 26))


def finish_plate():
    """Grain + vignette merged once: one composite per frame, not two."""
    plate = grain().copy()
    plate.alpha_composite(vignette_layer())
    return plate


_PLATE = None


def render_frames(seq, total, on_frame, start_t=0.0, end_t=None):
    end_t = total if end_t is None else end_t
    global _PLATE
    if _PLATE is None:
        _PLATE = finish_plate()
    n0 = int(round(start_t * FPS))
    n1 = int(round(end_t * FPS))
    for n in range(n0, n1):
        t = n / FPS
        frame, sc = compose(seq, t)
        frame = frame.convert("RGBA")
        frame.alpha_composite(_PLATE)
        if sc["vo"]:
            groups = sc["_groups"].get(sc["vo"])
            if groups:
                local = t - _scene_start(seq, t) - VO_LEAD
                lay = caption_frame(local, groups)
                if lay is not None:
                    frame.alpha_composite(lay)
        progress_bar(frame, t, total)
        on_frame(frame.convert("RGB"), n, t)


VO_LEAD = 0.55


def _scene_start(seq, t):
    acc = 0.0
    for sc in seq:
        if t < acc + sc["dur"]:
            return acc
        acc += sc["dur"]
    return acc


# ---------------------------------------------------------------------------
# audio
# ---------------------------------------------------------------------------
def build_audio(seq, vo_paths, total_s, bed_path, out_path, slug):
    """Mix VO chunks at their scene starts over the music bed, then master."""
    inputs = []
    chains = []
    labels = []
    i = 0
    for sc in seq:
        key = sc["vo"]
        if not key:
            continue
        p = vo_paths.get(key)
        if not p or not Path(p).exists():
            continue
        start = _scene_start(seq, _first_t_of(seq, sc)) + VO_LEAD
        inputs += ["-i", str(p)]
        ms = int(round(start * 1000))
        chains.append(
            f"[{i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,"
            f"highpass=f=85,equalizer=f=180:t=q:w=1:g=1.5,"
            f"acompressor=threshold=0.12:ratio=2.4:attack=8:release=180,"
            f"volume=1.0,adelay={ms}|{ms}[vo{i}]")
        labels.append(f"[vo{i}]")
        i += 1
    if bed_path and Path(bed_path).exists():
        inputs += ["-stream_loop", "-1", "-i", str(bed_path)]
        bed_idx = i
        chains.append(
            f"[{bed_idx}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,"
            f"atrim=0:{total_s:.3f},volume=0.30[bed]")
        labels.append("[bed]")
    mix = "".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=longest[mixed]"
    chains.append(mix)
    chains.append(
        f"[mixed]loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.94,"
        f"atrim=0:{total_s:.3f}[out]")
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *inputs,
           "-filter_complex", ";".join(chains), "-map", "[out]",
           "-c:a", "pcm_s16le", "-ar", "48000", str(out_path)]
    subprocess.run(cmd, check=True)
    return out_path


def _first_t_of(seq, target):
    acc = 0.0
    for sc in seq:
        if sc is target:
            return acc
        acc += sc["dur"]
    return acc


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------
def prepare(seq_with_oc, course):
    vo = vo_durations(course["slug"])
    for sc in seq_with_oc:
        sc["_groups"] = {}
        key = sc["vo"]
        if not key:
            continue
        text = course["copy"]["narration"].get(key) or course["copy"]["cta"]
        sc["_groups"][key] = timed_groups(text, vo[key],
                                          measured=word_timings(course["slug"], key))
    return seq_with_oc


def render_film(course, out_path, preview=None, crf=20, preset="slow", log=print,
                audio=True):
    seq, vo = build_scenes(course)
    seq = prepare(seq, course)
    total = total_duration(seq)
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    t0 = time.time()
    frames = 0
    if preview:
        end = min(total, preview)
        target = out_path.with_suffix(".preview.mp4")
    else:
        end = total
        target = out_path

    cmd = [
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264", "-preset", preset, "-crf", str(crf),
        "-profile:v", "high", "-level", "4.2", "-pix_fmt", "yuv420p",
        "-x264-params", "keyint=60:min-keyint=30:scenecut=40",
        "-movflags", "+faststart",
        "-an",
        str(target),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    def on_frame(img, n, t):
        nonlocal frames
        proc.stdin.write(img.tobytes())
        frames += 1
        if frames % 300 == 0:
            log(f"  {frames} frames  ({t:5.1f}s / {end:.1f}s)  "
                f"{time.time() - t0:5.1f}s elapsed")

    render_frames(seq, total, on_frame, 0, end)
    proc.stdin.close()
    proc.wait()
    if proc.returncode:
        raise RuntimeError("ffmpeg video encode failed")
    log(f"  video done: {target.name}  {frames} frames in {time.time() - t0:.1f}s")

    if audio and not preview:
        vo_paths = {k: (VO_DIR / course["slug"] / f"{k}.wav").resolve()
                    for k in ("hook", "curriculum", "outcomes", "proof", "cta")}
        bed = HERE / "music" / "bed.mp3"
        mix_path = out_path.with_suffix(".mux.mp4")
        wav = out_path.with_suffix(".mix.wav")
        build_audio(seq, vo_paths, total, bed if bed.exists() else None, wav,
                    course["slug"])
        subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
                        "-i", str(target), "-i", str(wav),
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                        "-movflags", "+faststart", "-shortest", str(mix_path)],
                       check=True)
        mix_path.replace(target)
        wav.unlink(missing_ok=True)
        log(f"  audio mixed → {target.name} ({target.stat().st_size/1e6:.1f} MB)")
    return target, total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default=None, help="course slug, or all")
    ap.add_argument("--preview", type=float, default=None,
                    help="seconds of preview (fast, no audio)")
    ap.add_argument("--crf", type=int, default=19)
    ap.add_argument("--preset", default="medium")
    ap.add_argument("--no-audio", action="store_true")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    courses = load_courses()
    if args.slug and args.slug != "all":
        courses = [c for c in courses if c["slug"] == args.slug]
        if not courses:
            sys.exit(f"unknown slug {args.slug}")
    for c in courses:
        out = Path(args.out) if args.out else OUT_DIR / f"{c['slug']}.mp4"
        print(f"▶ {c['id']:02d} {c['title']}  →  {out.name}")
        render_film(c, out, preview=args.preview, crf=args.crf,
                    preset=args.preset, audio=not args.no_audio)


if __name__ == "__main__":
    main()
