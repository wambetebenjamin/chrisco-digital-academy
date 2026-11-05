# 🎬 Course Films

Nineteen vertical promo films — one per course — rendered from the same course
data the website uses.

- **Format** — 1080 × 1920 (9:16), 30 fps, H.264 High profile, AAC 192 kbps
- **Length** — about 90 seconds each
- **Audio** — English narration, word-accurate burned-in captions, original music bed
- **Delivery** — GitHub Releases (assets), not the repository, to keep the repo light

## Where the files are

Rendered films and their assets live in the `course-films-v1` release:

```
https://github.com/wambetebenjamin/chrisco-digital-academy/releases/tag/course-films-v1
```

## Publishing (and why not from the sandbox)

GitHub's asset upload host (`uploads.github.com`) is unreachable from the agent
sandbox, so the films are published by running:

```bash
python tools/promo/media_snapshot.py build   # stage films + one-click zips
python tools/promo/publish.py                # upload anything missing
python tools/promo/publish.py --verify       # HEAD-check every download link
```

`publish.py` reads what is actually on disk, uploads only what the release does
not already have, and rewrites `RELEASE-LINKS.md` from the files it verified —
so a link in the docs can never point at an asset that was not uploaded.

## Quality gate

```bash
python tools/promo/verify.py film-render/digital-marketing.mp4
```

Checks container/codec/frame size, AAC 48 kHz, loudness (−14 LUFS ±2),
duration (85–96 s), and rejects any film with a black gap longer than 0.5 s.

## Rebuilding

```bash
# 1. print the narration scripts (one take per course)
python tools/promo/batch.py texts

# 2. put each take at tools/promo/vo/<slug>/narration.mp3, then:
python tools/promo/batch.py align          # word-align + split into scenes
python tools/promo/batch.py render         # render every film
python tools/promo/batch.py render python-programming   # or just one
python tools/promo/batch.py package        # zip + MANIFEST.md
python tools/promo/batch.py status
```

Requirements: `ffmpeg` (set `FFMPEG_BIN` if it is not on `PATH`), Pillow, NumPy,
and optionally `segno` for the QR end card.

## How a film is built

| Step | File | What it does |
| --- | --- | --- |
| Design system | `tools/promo/brand.py` | Palette, type, layout metrics, drawing helpers |
| Scenes | `tools/promo/scenes.py` | Nine frame generators (cold open → hook → title → syllabus → outcome → montage → proof → CTA → outro) |
| Compositor | `tools/promo/render.py` | Cross-fades, captions, grain/vignette, ffmpeg pipe, audio graph |
| Narration | `tools/promo/build_vo.py` | Script assembly, energy-based forced alignment, scene splits |
| Copy | `tools/promo/copy.py` | Hand-written hook, outcome, narration and CTA per course |

Every film is a pure function of course data plus time, so a re-render always
produces the same frames.

## Note on course copy

The `objectives` arrays in `app/data/courses.js` are misaligned with their
courses (for example *Digital Marketing* lists HTML/CSS objectives). The films
are written from each course's own `desc` and `syllabus`, which are correct.
