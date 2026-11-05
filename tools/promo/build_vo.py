"""Narration pipeline: text assembly, forced alignment, segment splitting.

The speech generator gives us audio but no word timings, so we recover them by
aligning the *known* script against the audio envelope:

  1. decode to 8 kHz mono, measure energy every 10 ms
  2. classify voiced / silent above an adaptive noise floor
  3. build a cumulative "speech weight" curve (pauses cost ~4%)
  4. map each character of the normalised script onto that curve

That yields ~±60 ms per word, which is all a caption highlight needs. From the
word times we cut the single narration take into the four scene segments the
compositor expects (hook, curriculum, outcomes, proof).

    python tools/promo/build_vo.py text youtube-automation
    python tools/promo/build_vo.py align youtube-automation
    python tools/promo/build_vo.py all
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from copy import COPY  # noqa: E402

FFMPEG = os.environ.get("FFMPEG_BIN", "/home/user/tools/ffmpeg")
VO = HERE / "vo"
SR = 8000
HOP = SR // 100  # 10 ms
KEYS = ("hook", "curriculum", "outcomes", "proof", "cta")
PAUSE_WEIGHT = 0.055


def section_text(slug: str) -> dict:
    """Every narrated section of the film, in scene order."""
    c = COPY[slug]
    out = {k: c["narration"][k].strip() for k in KEYS if k != "cta"}
    out["cta"] = c["cta"].strip()
    return out


def narration_text(slug: str) -> str:
    return " ".join(section_text(slug)[k] for k in KEYS)


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def decode(path: Path) -> np.ndarray:
    raw = subprocess.run(
        [FFMPEG, "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1",
         "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def energy_db(y: np.ndarray) -> np.ndarray:
    n = len(y) // HOP
    frames = y[:n * HOP].reshape(n, HOP)
    rms = np.sqrt(np.mean(frames.astype(np.float64) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(rms + 1e-9)


def voicing(db: np.ndarray) -> np.ndarray:
    floor = float(np.percentile(db, 15))
    peak = float(np.percentile(db, 97))
    thresh = floor + max(6.0, (peak - floor) * 0.20)
    voiced = db > thresh
    # close 1-2 frame gaps (plosives, soft consonants)
    v = voiced.astype(np.int8)
    for gap in (1, 2):
        idx = np.where(np.diff(v) != 0)[0]
        for i in range(len(idx) - 1):
            a, b = idx[i], idx[i + 1]
            if v[a] == 0 and (b - a) <= gap:
                v[a + 1:b + 1] = 1
    # drop isolated blips shorter than 3 frames
    idx = np.where(np.diff(v) != 0)[0]
    bounds = np.concatenate(([0], idx + 1, [len(v)]))
    for a, b in zip(bounds[:-1], bounds[1:]):
        if v[a] == 1 and (b - a) < 3:
            v[a:b] = 0
    return v.astype(bool)


def align_words(audio: Path, text: str):
    y = decode(audio)
    dur = len(y) / SR
    db = energy_db(y)
    v = voicing(db)
    frames = len(v)
    weight = np.where(v, 1.0, PAUSE_WEIGHT)
    cum = np.cumsum(weight)
    total = float(cum[-1])
    nchars = len(norm(text))
    if nchars == 0:
        return [], dur

    # normalised char index for every word of the original text
    words, pos, ci = [], 0, 0
    for m in re.finditer(r"[A-Za-z0-9']+", text):
        w = m.group(0)
        words.append({"word": w, "start_char": ci, "end_char": ci + len(norm(w))})
        ci += len(norm(w))
        pos += 1

    frac = cum / total
    times = np.arange(frames) * HOP / SR

    def t_at(char_idx: float) -> float:
        target = char_idx / nchars
        j = int(np.searchsorted(frac, target))
        j = min(j, frames - 1)
        return float(times[j])

    out = []
    for w in words:
        s = t_at(w["start_char"])
        e = t_at(max(w["end_char"], w["start_char"] + 0.5))
        e = max(e, s + 0.10)
        out.append((w["word"], round(s, 3), round(min(e, dur), 3)))
    return out, dur


def segment_bounds(words, keys_text):
    """Cut points between the narration sections, snapped to word edges."""
    counts = [len(re.findall(r"[A-Za-z0-9']+", keys_text[k])) for k in KEYS]
    bounds, acc = [], 0
    for c in counts[:-1]:
        acc += c
        bounds.append(acc)
    picks = []
    for b in bounds:
        picks.append(words[b - 1][2])  # end of the last word of the section
    return picks


def build(slug: str, src: Path):
    text = narration_text(slug)
    words, dur = align_words(src, text)
    if not words:
        raise SystemExit(f"no speech found in {src}")
    sections = section_text(slug)
    cuts = segment_bounds(words, sections)

    # segment audio: [start, end] with a little air either side
    starts = [0.0] + [c + 0.16 for c in cuts]
    ends = [c + 0.30 for c in cuts] + [dur]
    meta = {}
    out_dir = VO / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    for key, s, e in zip(KEYS, starts, ends):
        s = max(0.0, s)
        e = min(dur, e)
        wav = out_dir / f"{key}.wav"
        subprocess.run([FFMPEG, "-y", "-v", "error", "-i", str(src),
                        "-ss", f"{s:.3f}", "-to", f"{e:.3f}",
                        "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", str(wav)],
                       check=True)
        meta[key] = {"duration": round(e - s, 3), "offset": round(s, 3)}

    # words relative to each segment, for caption sync
    idx = 0
    for key, s in zip(KEYS, starts):
        n = len(re.findall(r"[A-Za-z0-9']+", sections[key]))
        seg_words = []
        for w, ws, we in words[idx:idx + n]:
            seg_words.append([w, round(max(0.0, ws - s), 3), round(max(0.05, we - s), 3)])
        (out_dir / f"{key}.words.json").write_text(json.dumps(seg_words))
        idx += n
    (out_dir / "meta.json").write_text(json.dumps(meta, indent=2))
    return meta, dur


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return
    cmd = args[0]
    slugs = ([p.name for p in sorted(VO.glob("*/narration.mp3"), key=lambda p: p.stat().st_mtime)]
             if args[1:] in ([], ["all"]) else
             [s for s in args[1:] if (VO / s / "narration.mp3").exists()])
    if cmd == "text":
        target = args[1] if len(args) > 1 else None
        if target in (None, "all"):
            for slug in sorted(COPY):
                print(f"=== {slug} ===\n{narration_text(slug)}\n")
        else:
            print(narration_text(target))
        return
    if cmd == "align":
        for slug in slugs:
            meta, dur = build(slug, VO / slug / "narration.mp3")
            total = sum(v["duration"] for v in meta.values())
            print(f"{slug:44s} take={dur:6.2f}s  segments={total:6.2f}s  "
                  + "  ".join(f"{k}={v['duration']:.1f}" for k, v in meta.items()))
        return
    print(__doc__)


if __name__ == "__main__":
    main()
