"""Render the miniature 3D course promo (tilt-shift, kinetic cuts, SFX).

    python tools/promo/render_mini.py --slug content-creation-mastery

Five beats follow the client's timeline. Narration is the existing measured
take; Foley is synthesised here (clinks, sledgehammer, rocket swooshes) so the
cut points actually land.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))

import mini3d as M  # noqa: E402
import mini_scene as S  # noqa: E402
from brand import font  # noqa: E402

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
VO_DIR = HERE / "vo"
OUT_DIR = ROOT / "film-render"
FFMPEG = os.environ.get("FFMPEG_BIN", "/home/user/tools/ffmpeg")
W, H, FPS = 1080, 1920, 30

# --- the five beats, from the client's timeline -------------------------
# (start, end, overlay line, camera key)
BEATS = [
    (0.0, 3.4, "STUCK IN YOUR CAREER?", "problem"),
    (3.4, 7.6, "LEARN STEP BY STEP.", "build"),
    (7.6, 11.6, "UNLOCK EXPERT SECRETS.", "unlock"),
    (11.6, 15.4, "LAUNCH YOUR FUTURE.", "launch"),
    (15.4, None, "MASTER CONTENT MARKETING TODAY!", "climax"),
]

CAM_KEYS = {
    # (pos, target, focal) — far enough back that the laptop reads as an
    # object on a desk, with the desk visible around it
    "problem": ((0, 21.0, 30.0), (0, 6.2, 0.4), 1850),
    "build":   ((7.0, 21.5, 30.5), (0, 6.6, 0.4), 1850),
    "unlock":  ((-6.0, 20.0, 28.0), (0, 6.0, 1.0), 1800),
    "launch":  ((0, 19.5, 27.0), (0, 8.0, 1.2), 1780),
    "climax":  ((0, 20.5, 28.5), (0, 6.4, 0.8), 1820),
}


def plan_beats(meta, total):
    """Five beats: cuts on the narration's own section boundaries."""
    cand = [0.0,
            meta["hook"]["duration"] * 0.62,
            meta["curriculum"]["offset"] + meta["curriculum"]["duration"] * 0.34,
            meta["outcomes"]["offset"],
            meta["proof"]["offset"]]
    cut = []
    for c in cand:
        c = round(c, 2)
        if 0 <= c < total - 1.4 and (not cut or c > cut[-1] + 1.0):
            cut.append(c)
    for frac in (0.22, 0.44, 0.66, 0.82):
        if len(cut) >= 5:
            break
        c = round(total * frac, 2)
        if c > cut[-1] + 1.0 and c < total - 1.0:
            cut.append(c)
    while len(cut) < 5:
        cut.append(round(min(total - 0.8, cut[-1] + 2.0), 2))
    cut = sorted(cut)[:5]
    out = []
    for i in range(5):
        start = cut[i] if i < len(cut) else cut[-1]
        end = cut[i + 1] if i + 1 < len(cut) else None
        out.append((start, end, BEATS[i][2], BEATS[i][3]))
    return out


def lerp(a, b, k):
    return tuple(x + (y - x) * k for x, y in zip(a, b))


def camera_for(t: float) -> M.Cam:
    """Camera that follows the beats, with a slow drift inside each."""
    idx = len(BEATS) - 1
    for i, (s, e, _, _) in enumerate(BEATS):
        if e is None or t < e:
            idx = i
            break
    start = BEATS[idx][0]
    end = BEATS[idx][1] or (start + 4.0)
    k = min(1.0, max(0.0, (t - start) / max(0.4, end - start)))
    key = BEATS[idx][3]
    pos0, tgt0, f0 = CAM_KEYS[key]
    # gentle push-in + orbit within the beat
    nxt = BEATS[min(idx + 1, len(BEATS) - 1)][3]
    if nxt != key and k > 0.7:
        p1, g1, f1 = CAM_KEYS[nxt]
        kk = (k - 0.7) / 0.3
        pos = lerp(pos0, p1, kk * 0.55)
        tgt = lerp(tgt0, g1, kk * 0.55)
        foc = f0 + (f1 - f0) * kk * 0.55
    else:
        pos, tgt, foc = pos0, tgt0, f0
    drift = 0.9 * math.sin(t * 0.7)
    pos = (pos[0] + drift, pos[1] - k * 0.6, pos[2] - k * 0.9)
    foc = foc * (1.0 + 0.05 * k)
    return M.Cam(pos=pos, target=tgt, focal=foc)


# ---------------------------------------------------------------------------
# overlay type
# ---------------------------------------------------------------------------
def overlay(img: Image.Image, text: str, t_in: float, beat_idx: int,
            n_beats: int, is_last=False) -> Image.Image:
    """Bold sans overlay with a spring-in and a highlight plate."""
    lay = img.convert("RGBA")
    size = 92
    while size > 54:
        f = font("archivo", size, weight=800)
        lines = wrap(text, f, 900)
        if len(lines) <= 2 or (len(lines) <= 3 and size <= 76):
            break
        size -= 4
    lines = wrap(text, f, 900)
    total_h = int(f.size * 1.06) * len(lines)
    y0 = H - 430 - total_h
    for i, ln in enumerate(lines):
        k = min(1.0, max(0.0, (t_in - 0.12 - i * 0.08) / 0.42))
        if k <= 0:
            continue
        e = 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2
        lay2 = Image.new("RGBA", (W, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay2)
        tw = d.textlength(ln, font=f)
        x = (W - tw) / 2
        d.text((x + 4, 8), ln, font=f, fill=(20, 16, 40, 150))
        d.text((x, 4), ln, font=f, fill=(255, 255, 255, int(255 * min(1, k * 1.4))))
        lay2 = lay2.rotate(0)
        lay.alpha_composite(lay2, (0, y0 + i * int(f.size * 1.06) + int(28 * (1 - e))))
    # progress dots, so the five-beat structure reads
    n = n_beats
    for i in range(n):
        cx = W // 2 + (i - (n - 1) / 2) * 42
        on = i <= beat_idx
        d2 = ImageDraw.Draw(lay)
        r = 8 if on else 6
        d2.ellipse((cx - r, H - 150, cx + r, H - 150 + 2 * r),
                   fill=(255, 255, 255, 235) if on else (255, 255, 255, 90))
    if is_last:
        d3 = ImageDraw.Draw(lay)
        f2 = font("archivo", 44, weight=700)
        tag = "chrisco-digital-academy.vercel.app"
        tw = d3.textlength(tag, font=f2)
        d3.rounded_rectangle(((W - tw) / 2 - 28, H - 120, (W + tw) / 2 + 28, H - 48),
                             radius=36, fill=(255, 255, 255, 240))
        d3.text(((W - tw) / 2, H - 106), tag, font=f2, fill=(30, 26, 70))
    return lay.convert("RGB")


def wrap(text, f, max_w):
    words, lines, cur = text.split(), [], ""
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    for w in words:
        trial = f"{cur} {w}".strip()
        if probe.textlength(trial, font=f) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:3]


# ---------------------------------------------------------------------------
# foley
# ---------------------------------------------------------------------------
SR = 48000


def _env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1.0, t / max(a, 1e-4)) * np.exp(-t / max(d, 1e-4))


def sfx_clink(dur=0.35):
    n = int(SR * dur)
    t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 2400 * t) * 0.4 + np.sin(2 * np.pi * 3700 * t) * 0.25
         + np.sin(2 * np.pi * 5200 * t) * 0.15)
    return (y * _env(n, 0.002, 0.09)).astype(np.float32)


def sfx_smash(dur=0.9):
    n = int(SR * dur)
    rng = np.random.default_rng(7)
    noise = rng.standard_normal(n).astype(np.float32)
    y = noise * _env(n, 0.001, 0.22) * 0.55
    t = np.arange(n) / SR
    y += np.sin(2 * np.pi * 90 * t) * _env(n, 0.004, 0.30) * 0.7
    return y.astype(np.float32)


def sfx_whoosh(dur=0.7, up=True):
    n = int(SR * dur)
    rng = np.random.default_rng(11)
    noise = rng.standard_normal(n).astype(np.float32)
    t = np.arange(n) / n
    env = np.sin(np.pi * t) ** 2
    # sweeping band emphasis
    out = np.zeros(n, dtype=np.float32)
    seg = max(1, n // 40)
    for i in range(0, n, seg):
        f = 300 + 4200 * (i / n if up else 1 - i / n)
        x = noise[i:i + seg]
        out[i:i + seg] = x * np.sin(2 * np.pi * f * (np.arange(len(x)) / SR)).astype(np.float32)
    return (out * env * 0.5).astype(np.float32)


def sfx_stamp(dur=0.6):
    n = int(SR * dur)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 70 * t) * _env(n, 0.002, 0.16) * 0.9
    rng = np.random.default_rng(3)
    y += rng.standard_normal(n).astype(np.float32) * _env(n, 0.001, 0.05) * 0.35
    return y.astype(np.float32)


def write_wav(path: Path, y: np.ndarray):
    import wave
    y = np.clip(y, -1, 1)
    pcm = (y * 32767).astype(np.int16)
    st = np.stack([pcm, pcm], 1).reshape(-1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(st.tobytes())


# ---------------------------------------------------------------------------
# render
# ---------------------------------------------------------------------------
def render_film(slug: str, out_path: Path, crf=19, preset="medium", log=print):
    global BEATS
    meta = json.loads((VO_DIR / slug / "meta.json").read_text())
    total = round(max(v["offset"] + v["duration"] for v in meta.values()) + 1.2, 2)
    # the last beat must run to the end of the narration
    beats = plan_beats(meta, total)

    log(f"  beats: " + "  ".join(f"{b[0]:.1f}s" for b in beats))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-c:v", "libx264", "-preset", preset, "-crf", str(crf),
           "-profile:v", "high", "-level", "4.2", "-pix_fmt", "yuv420p",
           "-x264-params", "keyint=60:min-keyint=30:scenecut=40",
           "-movflags", "+faststart", "-an", str(out_path)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.time()
    frames = int(round(total * FPS))

    for n in range(frames):
        t = n / FPS
        scene = S.build(t, beats)
        cam = camera_for(t)
        img, glow = M.render(scene, cam)
        img = M.add_glow(img, glow, 32)
        img = M.tilt_shift(img, 24, (0.20, 0.66))

        # which beat are we in
        bi = len(beats) - 1
        for i, b in enumerate(beats):
            if b[1] is None or t < b[1]:
                bi = i
                break
        local = t - beats[bi][0]
        img = overlay(img, beats[bi][2], local, bi, len(beats),
                      is_last=(bi == len(beats) - 1))

        # kinetic cut: a 2-frame flash + push at every boundary
        for b in beats[1:]:
            if 0 <= (t - b[0]) < 0.10:
                k = 1 - (t - b[0]) / 0.10
                img = Image.blend(img, Image.new("RGB", (W, H), (255, 255, 255)), 0.55 * k)

        proc.stdin.write(img.tobytes())
        if (n + 1) % 240 == 0:
            log(f"  {n + 1} frames  ({t:5.1f}s / {total:.1f}s)  {time.time() - t0:5.1f}s")
    proc.stdin.close()
    proc.wait()
    if proc.returncode:
        raise RuntimeError("ffmpeg video encode failed")
    log(f"  video done: {out_path.name}  {frames} frames in {time.time() - t0:.1f}s")

    mix_audio(slug, out_path, beats, total, log)
    return out_path, total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default="content-creation-mastery")
    ap.add_argument("--crf", type=int, default=19)
    ap.add_argument("--preset", default="medium")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    out = Path(a.out) if a.out else OUT_DIR / f"{a.slug}-mini3d.mp4"
    print(f"▶ miniature promo → {out.name}")
    render_film(a.slug, out, crf=a.crf, preset=a.preset)


if __name__ == "__main__":
    main()


def mix_audio(slug: str, out_path: Path, beats, total: float, log=print):
    """Narration + synthesised foley + music bed, mastered to -14 LUFS."""
    meta = json.loads((VO_DIR / slug / "meta.json").read_text())
    # ---------------- audio: narration + synthesised foley + bed -------------
    n_total = int(SR * total)
    mix = np.zeros(n_total, dtype=np.float32)

    def place(y, at, gain=1.0):
        i = int(at * SR)
        if i >= n_total:
            return
        j = min(n_total, i + len(y))
        mix[i:j] += y[:j - i] * gain

    # narration segments, at their measured offsets
    import wave
    for key in ("hook", "curriculum", "outcomes", "proof", "cta"):
        p = VO_DIR / slug / f"{key}.wav"
        if not p.exists():
            continue
        with wave.open(str(p), "rb") as w:
            raw = w.readframes(w.getnframes())
            ch = w.getnchannels()
            a = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
            if ch > 1:
                a = a.reshape(-1, ch).mean(1)
        place(a, meta[key]["offset"] + 0.55, 1.0)

    # foley hits, keyed to the beats
    place(sfx_clink(), beats[0][0] + 0.35, 0.55)
    place(sfx_clink(), beats[0][0] + 0.75, 0.35)
    if len(beats) > 1:
        place(sfx_whoosh(0.6), beats[1][0] - 0.15, 0.5)
        place(sfx_clink(), beats[1][0] + 0.6, 0.45)
        place(sfx_clink(), beats[1][0] + 1.5, 0.35)
    if len(beats) > 2:
        place(sfx_smash(), beats[2][0] + 0.45, 0.75)
        place(sfx_whoosh(0.8), beats[2][0] + 0.3, 0.4)
    if len(beats) > 3:
        for i in range(3):
            place(sfx_whoosh(0.55), beats[3][0] + 0.2 + i * 0.28, 0.42)
    place(sfx_stamp(), beats[-1][0] + 0.55, 0.8)

    # music bed
    bed = HERE / "music" / "bed.mp3"
    if bed.exists():
        raw = subprocess.run([FFMPEG, "-v", "quiet", "-i", str(bed),
                              "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                             capture_output=True).stdout
        b = np.frombuffer(raw, dtype=np.float32)
        if len(b):
            reps = int(np.ceil(n_total / len(b)))
            b = np.tile(b, reps)[:n_total]
            mix += b * 0.22

    # master
    peak = float(np.max(np.abs(mix))) or 1.0
    mix = mix / peak * 0.92
    wav_out = out_path.with_suffix(".mini.wav")
    write_wav(wav_out, mix)

    mux = out_path.with_suffix(".mux.mp4")
    subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
                    "-i", str(out_path), "-i", str(wav_out),
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", "-shortest", str(mux)], check=True)
    mux.replace(out_path)
    wav_out.unlink(missing_ok=True)
    log(f"  audio mixed → {out_path.name} ({out_path.stat().st_size / 1e6:.1f} MB)")
