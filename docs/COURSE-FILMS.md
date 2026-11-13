# 🎬 Course Films

Nineteen vertical promo films — one per course — rendered from the same course
data the website uses.

- **Format** — 1080 × 1920 (9:16), 30 fps, H.264 High profile, AAC 192 kbps
- **Length** — about 90 seconds each
- **Audio** — English narration, word-accurate burned-in captions, original music bed
- **Delivery** — committed under `/v1` in this repository, served raw by GitHub

## Where the files are

Finished films live in `/v1` at the repository root, one MP4 plus one poster
frame per course:

```
v1/<slug>.mp4
v1/posters/<slug>.jpg
```

The download URL is the raw URL for that path:

```
https://raw.githubusercontent.com/wambetebenjamin/chrisco-digital-academy/<ref>/v1/<slug>.mp4
```

`<ref>` is the branch (`arena/5440d692-chrisco-digital-academy`) or a commit SHA.
Pin a SHA when you want a link that can never change.

### Why raw URLs, and why they download

GitHub serves committed `.mp4` files as `Content-Type: application/octet-stream`
with `X-Content-Type-Options: nosniff`. Browsers therefore **download** the file
instead of opening a player — which is what the request asked for. A release
asset would work the same way, but GitHub's upload host (`uploads.github.com`)
is unreachable from the agent sandbox, so committing under `/v1` is the path
that actually works end to end.

Film files are excluded from normal development because `/film-render/` is
ignored; `/v1/` is explicitly un-ignored so finished films can be committed.

## Publishing a film

```bash
python tools/promo/verify.py film-render/<slug>.mp4   # quality gate
cp film-render/<slug>.mp4 v1/<slug>.mp4
ffmpeg -ss 5 -i v1/<slug>.mp4 -frames:v 1 -q:v 3 v1/posters/<slug>.jpg
git add v1/<slug>.mp4 v1/posters/<slug>.jpg && git commit -m "Add <title> film" && git push
```

`python tools/promo/publish.py --index` still writes a manifest of whatever is
staged, and `RELEASE-LINKS.md` records the raw URLs that were verified.

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
