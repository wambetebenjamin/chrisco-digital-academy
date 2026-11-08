# rea-video: what it does, and whether it will make our videos nicer

Evaluated 2026-11-05 against our own shipped film,
`v1/content-creation-mastery.mp4` (88.6 s, 1080×1920, 30 fps).

Repo: <https://github.com/JuneYaooo/rea-video> — Apache-2.0, Python, 4.3k stars.

## The short version

**rea-video does not make videos.** It watches a video and writes a report on how
that video was made. It has no renderer, no timeline, no output video. Every
subcommand is `decompose`, `probe`, `summary`, `review`, `remake-plan`,
`remake-run` — analysis and planning.

So it will not, by itself, make our videos nicer. What it can do is tell us, shot
by shot, why an existing video looks good, so we can copy the *reason* instead of
the *look*. That is worth having, but it is a different thing from a render
pipeline — and we already have a working render pipeline (`tools/promo/`).

## What it actually is

A forensics CLI that answers, per shot: **was this filmed, AI-generated, rendered
in code, a screen capture, or a still image set in motion?** Then it plans how to
remake it.

Pipeline: split into shots → gather evidence (frame cadence, sensor noise,
duplicate-frame patterns, AIGC metadata tags, face/hand/text cues, BPM and key)
→ decide → plan the remake. It can optionally call a vision model (Gemini, Doubao,
any OpenAI-compatible endpoint) to improve the calls.

## What I ran

```bash
rea-video decompose v1/content-creation-mastery.mp4 --out rea-out/chrisco --lang en --no-vlm
```

Took **72 seconds**, no GPU, no API key, fully offline. Output was ~19 MB:
`breakdown.json`, `report.html`, `report.md`, `storyboard.jpg`, per-shot contact
sheets, per-shot first/last frames, `audio.png`, and a packaging timeline.

### Setup notes for this box

- `apt` has no ffmpeg and the PyPI wheels ship `ffmpeg` but not `ffprobe`, which
  the tool requires. What worked: `pip install ffmpeg-binaries` (static ffmpeg
  6.0 from johnvansickle), then symlink its `ffmpeg` and `ffprobe` onto PATH.
  The `imageio-ffmpeg` build is ffmpeg 9 and **fails** — it dropped
  `-print_format`, which `rea_video/media.py` uses.
- Stem separation (Demucs/UVR model, 67 MB) and face detection (YuNet) try to
  download on first run and both failed here on TLS. The run continued anyway
  with those two features degraded. Fine for evaluation; worth fixing for real use.

## What it got right

**Shot boundaries: essentially exact.** We know the ground truth, because our
renderer cuts on narration beats driven by `vo/*/meta.json`.

| ours (s) | detected (s) | delta |
|---|---|---|
| 0.00 | 0.00 | 0.00 |
| 11.24 | 10.97 | −0.27 |
| 20.68 | 20.40 | −0.28 |
| 28.30 | 28.00 | −0.30 |
| 35.60 | 35.33 | −0.27 |
| 42.91 | 42.60 | −0.31 |
| 52.29 | 52.00 | −0.29 |
| 63.64 | 63.37 | −0.27 |
| 81.41 | 81.10 | −0.31 |

Mean error **0.26 s**, max 0.31 s — and the error is a *consistent* offset, not
noise. It found all 9 cuts with zero misses and zero false cuts.

**Audio structure: correct.** It identified voice + one continuous music bed, and
called the voice speech rather than singing (sustained-pitch ratio 0.23). It read
the tempo as 127.6 BPM in A minor. Its own audio layer reported **0 sound
effects**, which matches our renderer, which mixes exactly two inputs: the VO
wavs and `music/bed.mp3`.

**Rhythm diagnosis: correct and useful.** "5.4 cuts per minute, 9.84 s average
shot" and "25% of cuts land on a beat (chance: about 29%)". Our cuts are driven by
narration beats, not the music — so it correctly concluded the edit is not
beat-synced. That is exactly the kind of observation that would improve our next
film.

## What it got wrong

**1. It misread the whole film as AI-generated video.** Verdict: "AI-generated
video 100%", confidence 0.68.

We know this is wrong. Every shot is a **real photograph** (`hero-tile.jpg`,
`bg-home.jpg`, `courses/*.jpg`) composited inside a code-drawn card: gold ring,
blue disc, magenta caption bar, display-serif headline. The correct label is
`still_motion`, which is in the tool's own label set.

The tell is in its own evidence string: *"Duplicate frames follow a 24→30 pattern
(23%, period 4)"*. That is our Ken Burns push on a still, quantised to 30 fps. The
tool treats a 24→30 pull-up as a strong AI-video signature, and this film trips
it. It also scored `kenburns_score=0` and `local_motion_ratio=0` on every shot —
which is the *correct* observation, and contradicts its own AI-video call. The two
signals were not reconciled.

**2. Corrections do not stick.** Its `review` → `apply-review` loop lets an agent
(or a VLM) look at frames and override the call. I answered all 9 shots with
`still_motion 0.97 / code_render 0.03` and evidence. The tool reported
**"merged 9/9; changed 0"** — it ingested the answers and then outvoted them.

The arithmetic, from `classify._log_pool`:

```python
det_w = DET_WEIGHT["still_motion"] = 1.4      # tools barely flagged still_motion
VLM_WEIGHT = 0.7

tools:  log(1.4*0.6*log(0.0084+1e-4) + 0.7*log(0.97+1e-3))   -> still_motion -7.73
                                                               ai_video     -8.42
```

The tools had given `still_motion` only 0.0084 — a floor value, from a group it
never seriously considered. A 1.4 weight applied to that floor beats a 0.97 agent
call at 0.7 weight. A confident, correct, frame-by-frame human review cannot
override a near-zero detector prior.

This is not a bug I hit by accident — it is the documented design. The source
comment says the weight is tuned so a confident-but-wrong VLM cannot override
frame-rate evidence. The cost is that a *correct* reviewer also cannot override
it. For a video type the heuristics do not have a model for — like ours — the
review loop is decorative.

**3. It invented 4 stickers and then 4 sound effects.** The packaging layer found
four "static stickers" and anchored four `ding`s to them. I opened the crops: they
are rectangular patches of the blurred background photograph. Nothing appears
there. The verdict line nevertheless advertises **"+4 sound effects"**. Same
pattern: low confidence (`confidence: "low"`) presented as fact in the summary.

**4. The lighting block is fiction.** "Coloured ambient light (RGB lights / neon),
key light frontal, from below... ratio 1.1:1". Our plates are stock photographs of
a film crew and a laptop. It is confidently describing a lighting setup that does
not exist, because the block is written for the case where the picture is real
footage — and that branch fired from a wrong base label.

## What this means for us

**Not a renderer.** It will not replace or improve `tools/promo/`. There is no
video output at all.

**Not a reviewer for our own films.** We already know how our films were made; we
wrote the renderer. Running forensics on our own output tells us nothing we do not
have in `render_tiktok.py`, and on this film it is actively wrong in a way it will
not accept correction for.

**Genuinely useful for one thing: auditing other people's videos.** This is what
it is built for and where its numbers are strong — shot boundaries at 0.26 s, real
audio structure, cut rhythm, beat alignment. If we want to know why a competitor's
or a reference video holds attention, this gets us the shot list, the pacing and
the audio skeleton in ~70 s on CPU for free. Hand-check the labels; keep the
measurements.

**Where it could actually help the films:**

- Pacing audit before we render: feed it a reference video, get cuts-per-minute and
  average shot length, then match our `plan_cards()` beat structure to it.
- Audio diagnosis: its "25% of cuts land on a beat (chance 29%)" is a real, useful
  finding about our film. Our cuts follow narration and ignore the music. Worth
  deciding deliberately rather than by default.
- `capsule` / `remake-plan` export JSON for a sibling repo (`capsule-cinema`) that
  does generate video — but that path needs paid model APIs and a different
  toolchain, and is not in this repo.

## The bigger thing this exposed

Reading our own film back through an outside tool surfaced something the site
review did not: **the film is still on the rejected palette.**

`tools/promo/tiktok.py` lines 27–31:

```python
NAVY = (9, 51, 114)        # headline ink
BLUE = (0, 84, 180)        # disc + signal glyph
MAGENTA = (228, 0, 120)    # dots + caption bar
YELLOW = (228, 192, 24)    # frame ring
```

Navy, blue, magenta, yellow-gold — the header comment literally says *"palette,
sampled from the reference"*. That is the reference that got us into the Kibra
problem, and it is the opposite of the site's bone/ink/oxblood editorial palette.
The film also uses a gold ring, which is the "shiny gold" that was explicitly
rejected, plus magenta and cyan in `mini3d.py` (`MAGENTA`, `GOLD`, `CYAN`, `LIME`).

So: the site and the film no longer look like the same organisation. If the films
are going to sit on that site, this needs re-theming next — and rea-video will not
help with that, because retheming is a render problem.

## Recommendation

1. **Do not adopt it as a production dependency.** It cannot render, and its core
   call is wrong on exactly our kind of video.
2. **Do use it as an analysis tool on reference videos**, with the label calls
   ignored and the timing/audio measurements trusted. The setup cost here was a
   couple of symlinks.
3. **Re-theme the film palette to match the site** — that is the change that will
   actually make our videos look better, and it is ours to make.
