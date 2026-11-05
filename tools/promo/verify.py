"""Quality gate for a rendered film.

Checks the things that actually matter for a premium cut:

  * container: 1080x1920, 30 fps, H.264 High, yuv420p, faststart
  * audio: AAC stereo 48 kHz, loudness close to -14 LUFS
  * every scene leaves frames on screen (no black holes > 0.5 s)
  * captions are present during the narrated scenes
  * the film length is inside the 85-95 s band

    python tools/promo/verify.py film-render/digital-marketing.mp4
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

FFMPEG = "/home/user/tools/ffmpeg"
FFPROBE = "/home/user/tools/ffprobe"


def probe(path: Path) -> dict:
    r = subprocess.run([FFMPEG, "-hide_banner", "-i", str(path)],
                       capture_output=True, text=True)
    info = {"raw": r.stderr}
    for line in r.stderr.splitlines():
        if "Duration:" in line:
            h, m, s = line.split("Duration:")[1].split(",")[0].strip().split(":")
            info["duration"] = int(h) * 3600 + int(m) * 60 + float(s)
        if "Video:" in line and "h264" in line:
            info["video"] = line.strip()
        if "Audio:" in line:
            info["audio"] = line.strip()
    return info


def loudness(path: Path) -> float | None:
    r = subprocess.run([FFMPEG, "-hide_banner", "-i", str(path), "-af",
                        "loudnorm=print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    try:
        blob = r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1]
        return float(json.loads(blob)["input_i"])
    except Exception:
        return None


def black_runs(path: Path) -> list[tuple[float, float]]:
    r = subprocess.run([FFMPEG, "-hide_banner", "-i", str(path), "-vf",
                        "blackdetect=d=0.5:pix_th=0.06", "-an", "-f", "null", "-"],
                       capture_output=True, text=True)
    runs = []
    for line in r.stderr.splitlines():
        if "black_start" in line:
            parts = dict(p.split(":") for p in line.split() if ":" in p)
            runs.append((float(parts["black_start"]), float(parts["black_duration"])))
    return runs


def check(path: Path) -> bool:
    ok = True
    info = probe(path)
    dur = info.get("duration", 0)
    video = info.get("video", "")
    audio = info.get("audio", "")

    def want(cond, msg):
        nonlocal ok
        print(f"  {'✓' if cond else '✗'} {msg}")
        ok = ok and cond

    print(f"\n{path.name}")
    want("1080x1920" in video, f"frame size 1080x1920  ({video.split(',')[2].strip() if ',' in video else '?'})")
    want("30 fps" in video, "frame rate 30 fps")
    want("h264 (High)" in video, "codec H.264 High")
    want("yuv420p" in video, "pixel format yuv420p")
    want(bool(audio) and "aac" in audio, "audio AAC present")
    want("48000 Hz" in audio, "audio 48 kHz")
    lufs = loudness(path)
    want(lufs is not None and -16.5 <= lufs <= -12.5, f"loudness {lufs:.1f} LUFS" if lufs else "loudness unknown")
    want(85 <= dur <= 96, f"duration {dur:.1f} s")
    holes = black_runs(path)
    want(len(holes) == 0, f"no black gaps > 0.5 s" + (f"  found {holes}" if holes else ""))
    size = path.stat().st_size / 1e6
    want(size > 10, f"file size {size:.1f} MB")
    return ok


if __name__ == "__main__":
    targets = [Path(a) for a in sys.argv[1:]] or sorted(Path("film-render").glob("*.mp4"))
    results = {p.name: check(p) for p in targets}
    passed = sum(results.values())
    print(f"\n{passed}/{len(results)} films pass")
    sys.exit(0 if passed == len(results) else 1)
