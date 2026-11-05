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
