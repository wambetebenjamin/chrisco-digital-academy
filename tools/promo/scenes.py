"""Frame generators for the CHRISCO course films.

Every scene is a pure function of local time `t` (seconds) that returns an RGB
frame of the master size (1080 x 1920). Expensive artwork is built once per
scene in `prepare_*` and closed over by the draw callable, so rendering a frame
is only compositing + a few ImageDraw calls.

At 30 fps a 90 s film is 2700 frames; each course film runs in ~5 minutes on
two cores.
"""
from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

from brand import (
    FPS, GREEN, GREEN_DARK, GREEN_DEEP, HAIRLINE, H, INK, MIST, MUTED, MUTED_LIGHT,
    PAPER, PUBLIC, SLATE, TEAL, TEAL_SOFT, WHITE, W, clamp, cover, duotone,
    ease_in_out_cubic, ease_out_back, ease_out_cubic, ease_out_quint, fit, font,
    grain_tile, paste_clip, pill, qr_plate, radial_glow, rule, seg, soft_shadow,
    text_layer,
    tracked_label, vignette, wrap,
)


# ---------------------------------------------------------------------------
# scene contract
# ---------------------------------------------------------------------------
@dataclass
class Scene:
    name: str
    dur: float
    draw: object          # callable(t_local) -> Image.Image (RGB)
    overlay: object = None  # optional static RGBA layer
    fade: float = 0.32    # cross-fade + dip handled by the compositor
    cap_y: int | None = 1462   # caption anchor; None = no captions this scene


def _scratch():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def _bg(color=PAPER) -> Image.Image:
    base = Image.new("RGB", (W, H), color)
    return base


def _bg_rgba(color=PAPER) -> Image.Image:
    return Image.new("RGBA", (W, H), color + (255,))


# ---------------------------------------------------------------------------
# shared chrome
# ---------------------------------------------------------------------------
_BRAND_RULE = None
_BRAND_TAG = None
_GRAIN = None
_VIGNETTE = None


def grain():
    global _GRAIN
    if _GRAIN is None:
        _GRAIN = grain_tile(seed=11, size=(W, H), alpha=15)
    return _GRAIN


def vignette_layer():
    global _VIGNETTE
    if _VIGNETTE is None:
        _VIGNETTE = vignette(size=(W, H), strength=120)
    return _VIGNETTE


def brand_tag(dark=True):
    """Tiny 'CHRISCO DIGITAL ACADEMY · 2026' tag pinned to the safe area."""
    global _BRAND_TAG
    if _BRAND_TAG is None:
        _BRAND_TAG = tracked_label("CHRISCO Digital Academy", size=26,
                                   fill=MUTED_LIGHT if dark else MUTED, tracking=7)
    return _BRAND_TAG


def brand_footer(frame: Image.Image, t, ink_col=INK, accent=GREEN_DEEP, opacity=1.0):
    """Hairline + wordmark at the bottom of every scene, steady across the film."""
    d = ImageDraw.Draw(frame, "RGBA")
    a = int(255 * clamp(opacity))
    d.line((72, 1758, 1008, 1758), fill=ink_col + (int(38 * clamp(opacity)),), width=1)
    tag = text_layer("CHRISCO", font("black", 30), ink_col + (a,), tracking=2,
                     line_gap=1.0)
    frame.alpha_composite(tag, (72, 1786))
    words = text_layer("YOUTH AFLAME  ·  DIGITAL ACADEMY",
                       font("archivo", 21, weight=600),
                       (ink_col[0], ink_col[1], ink_col[2], int(a * 0.6)),
                       tracking=4, line_gap=1.0)
    frame.alpha_composite(words, (int(72 + tag.width + 26), 1795))


def punch(text, size, fill=INK, tracking=0, weight=800, kind="archivo"):
    return text_layer(text, font(kind, size, weight=weight), fill, tracking=tracking,
                      line_gap=1.02)


# ---------------------------------------------------------------------------
# 1. COLD OPEN — brand sting (real time 0.0 - 2.1)
# ---------------------------------------------------------------------------
def build_cold_open(course, duration=2.1):
    base = Image.new("RGB", (W, H), TEAL)
    d = ImageDraw.Draw(base)
    for i in range(H):
        v = i / H
        col = (int(0 + 4 * v), int(35 + 18 * v), int(51 + 22 * v))
        d.line((0, i, W, i), fill=col)
    glow = radial_glow((760, 760), GREEN, alpha=26)
    base.paste(glow, (int(W / 2 - 380), 620), glow)

    mark = text_layer("CHRISCO", font("black", 168), PAPER, tracking=4, line_gap=1.0)
    sub = text_layer("DIGITAL ACADEMY", font("archivo", 44, weight=700), GREEN,
                     tracking=16, line_gap=1.0)
    line_a = text_layer("YOUTH AFLAME  ·  JINJA  &  BUIKWE", font("archivo", 24, weight=600),
                        (198, 214, 220), tracking=6, line_gap=1.0)
    idx = text_layer(f"{course['id']:02d} / 19  ·  {course['category'].upper()} TRACK",
                     font("archivo", 25, weight=700), GREEN, tracking=7, line_gap=1.0)

    def draw(t):
        frame = base.convert("RGBA")
        reveal = seg(t, 0.06, 0.62)
        paste_clip(frame, mark, (W / 2 - mark.width / 2, 806), reveal,
                   ease=ease_out_quint)
        a = seg(t, 0.62, 0.42)
        if a > 0:
            lw = int(420 * ease_out_cubic(a))
            ImageDraw.Draw(frame).line((W / 2 - lw / 2, 1032, W / 2 + lw / 2, 1032),
                                       fill=GREEN + (int(200 * a),), width=3)
        sub_layer = sub.copy()
        if a > 0:
            sub_layer.putalpha(sub_layer.split()[3].point(lambda v: int(v * a)))
            frame.alpha_composite(sub_layer, (int(W / 2 - sub.width / 2), 1064))
        if t > 1.2:
            k = seg(t, 1.2, 0.5)
            lay = idx.copy()
            lay.putalpha(lay.split()[3].point(lambda v: int(v * k * 210)))
            frame.alpha_composite(lay, (int(W / 2 - idx.width / 2), 1140))
        lay = line_a.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * 150)))
        frame.alpha_composite(lay, (int(W / 2 - line_a.width / 2), 1600))
        return frame

    return Scene("cold-open", duration, draw, fade=0.5, cap_y=None)


# ---------------------------------------------------------------------------
# 2. HOOK — the promise, over treated photography (2.1 - 12.1)
# ---------------------------------------------------------------------------
def build_hook(course, duration=10.0, hook_lines=None):
    hook_lines = hook_lines or []
    photo = Image.open(PUBLIC / course["img"].lstrip("/")).convert("RGB")
    photo = cover(photo, (int(W * 1.06), int(H * 1.06)))
    photo = duotone(photo, TEAL, (196, 214, 208), 0.80)
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scrim)
    for i in range(H):
        v = i / H
        a = int(234 * clamp((v - 0.10) / 0.62) ** 1.15) if v > 0.10 else 0
        sd.line((0, i, W, i), fill=(0, 26, 38, a))

    # hook copy: short, kinetic, one idea per line
    size, lines, fnt = fit(" ".join(hook_lines), 892, 720, kind="black", start=112,
                          floor=58, line_gap=0.96)
    headline = text_layer("", fnt, PAPER, lines=lines, line_gap=0.96, shadow=True)
    accent = text_layer("", fnt, GREEN, lines=lines, line_gap=0.96, shadow=True)

    kicker = tracked_label("CHRISCO COURSE FILM", size=26, fill=(190, 208, 212),
                           tracking=8)

    total_words = sum(len(l.split()) for l in lines)
    per_line = duration * 0.62 / max(1, len(lines))
    line_h = size * 0.96

    # pre-scaled zoom ladder: 20 steps is below the eye's threshold at 30 fps
    ladder = []
    for i in range(20):
        z = 1.0 + 0.045 * (i / 19)
        tw, th = int(W / z), int(H / z)
        small = cover(photo, (tw, th), zoom=z, focus=(0.5, 0.42))
        ladder.append(small.resize((W, H), Image.BILINEAR))

    def draw(t):
        k = ease_out_cubic(seg(t, 0, duration))
        img = ladder[min(len(ladder) - 1, int(k * (len(ladder) - 1) + 0.5))]
        frame = img.convert("RGBA")
        frame.alpha_composite(scrim)
        lay = kicker.copy()
        a = seg(t, 0.25, 0.5)
        lay.putalpha(lay.split()[3].point(lambda v: int(v * a * 210)))
        frame.alpha_composite(lay, (84, int(300 + 18 * (1 - ease_out_cubic(a)))))

        y0 = 372
        for i, _ln in enumerate(lines):
            start = 0.55 + i * min(0.42, per_line * 0.42)
            rev = seg(t, start, 0.44)
            if rev <= 0:
                continue
            band = (0, int(i * line_h), headline.width, int((i + 1) * line_h) + 6)
            src = (accent if (i == len(lines) - 1 and len(lines) > 1) else headline).crop(band)
            y = y0 + i * line_h - 16 * (1 - ease_out_cubic(rev))
            lay = src.copy()
            lay.putalpha(lay.split()[3].point(lambda v: int(v * clamp(rev * 1.5))))
            frame.alpha_composite(lay, (84, int(y)))

        # scrub counter: category · level · weeks
        meta = tracked_label(f"{course['category']}   ·   {course['level']}   ·   "
                             f"{course['duration']}", size=27, fill=GREEN, tracking=5)
        lay = meta.copy()
        a2 = seg(t, 1.1, 0.6)
        lay.putalpha(lay.split()[3].point(lambda v: int(v * a2 * 235)))
        frame.alpha_composite(lay, (84, 1296))
        brand_footer(frame, t, ink_col=PAPER, opacity=seg(t, 1.4, 0.6))
        return frame

    return Scene("hook", duration, draw, fade=0.55, cap_y=1462)


# ---------------------------------------------------------------------------
# 3. TITLE — the poster beat (12.1 - 18.6)
# ---------------------------------------------------------------------------
def build_title(course, duration=6.5):
    c1 = tuple(int(course["color"][0][i:i + 2], 16) for i in (1, 3, 5))
    base = Image.new("RGBA", (W, H), TEAL + (255,))
    d = ImageDraw.Draw(base)
    # editorial slabs
    d.rectangle((0, 0, W, 26), fill=c1 + (255,))
    d.rectangle((0, H - 26, W, H), fill=GREEN + (255,))
    glow = radial_glow((900, 900), c1, alpha=60, power=2.0)
    base.alpha_composite(glow, (int(W / 2 - 450), 700))

    title = course["title"]
    size, lines, fnt = fit(title, 928, 700, kind="black", start=182, floor=84,
                           line_gap=0.93)
    title_layer = text_layer("", fnt, PAPER, lines=lines, line_gap=0.93)
    lh = size * 0.93
    chips = [course["category"], course["level"], course["duration"]]
    chip_layers = []
    for c in chips:
        f = font("archivo", 30, weight=700)
        lbl = text_layer(c.upper(), f, PAPER, tracking=3, line_gap=1.0)
        lay = Image.new("RGBA", (lbl.width + 76, 74), (0, 0, 0, 0))
        pill(ImageDraw.Draw(lay), (0, 0, lbl.width + 74, 72), outline=GREEN + (255,),
             width=3, radius=36)
        lay.alpha_composite(lbl, (37, (74 - lbl.height) // 2 + 2))
        chip_layers.append(lay)

    label = tracked_label(f"COURSE {course['id']:02d} OF 19", size=30, fill=GREEN,
                          tracking=10)
    arrow = text_layer("↓  SCROLL TO ENROL", font("archivo", 26, weight=700),
                       (196, 214, 220), tracking=5)

    def draw(t):
        frame = base.copy()
        a = seg(t, 0.05, 0.5)
        lay = label.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * a)))
        frame.alpha_composite(lay, (94, 300))
        y0 = 520
        for i in range(len(lines)):
            rev = seg(t, 0.18 + i * 0.13, 0.72)
            src = title_layer.crop((0, i * lh, title_layer.width, int((i + 1) * lh) + 8))
            lay = src.copy()
            lay.putalpha(lay.split()[3].point(lambda v: int(v * clamp(rev * 1.7))))
            frame.alpha_composite(lay, (94, int(y0 + i * lh + 60 * (1 - ease_out_quint(rev)))))
        y = y0 + len(lines) * lh + 54
        x = 94
        y = y0 + len(lines) * lh + 46
        x = 94
        for i, lay in enumerate(chip_layers):
            k = seg(t, 0.95 + i * 0.12, 0.5)
            if k > 0:
                s = lay.copy()
                s.putalpha(s.split()[3].point(lambda v: int(v * k)))
                frame.alpha_composite(s, (x, int(y + 40 * (1 - ease_out_cubic(k)))))
                x += lay.width + 16
        lay = arrow.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 1.4, 0.6) * 190)))
        frame.alpha_composite(lay, (96, 1600))
        brand_footer(frame, t, ink_col=PAPER, opacity=seg(t, 1.0, 0.6))
        return frame

    return Scene("title", duration, draw, fade=0.45, cap_y=None)


# ---------------------------------------------------------------------------
# 4. SYLLABUS — "what you will build", six beats (18.6 - 34.6)
# ---------------------------------------------------------------------------
def build_syllabus(course, duration=16.0):
    steps = course["syllabus"][:6]
    base = _bg_rgba(PAPER)
    d = ImageDraw.Draw(base)
    d.rectangle((0, 0, W, 18), fill=TEAL + (255,))
    head = text_layer("WHAT YOU", font("black", 92), INK, line_gap=0.94)
    head2 = text_layer("WILL BUILD", font("black", 92), INK, line_gap=0.94)
    accent_bar = Image.new("RGBA", (168, 14), GREEN + (255,))
    kicker = tracked_label("THE CURRICULUM", size=27, fill=GREEN_DEEP, tracking=9)
    step_font = font("archivo", 46, weight=700)
    step_layers, num_layers = [], []
    for i, s in enumerate(steps):
        lines = wrap(s, step_font, 700)
        step_layers.append(text_layer("", step_font, INK, lines=lines, line_gap=1.06))
        num_layers.append(text_layer(f"{i + 1:02d}", font("black", 54), TEAL,
                                     line_gap=1.0))
    track = Image.new("RGBA", (4, 700), HAIRLINE + (255,))

    def draw(t):
        frame = base.copy()
        frame.alpha_composite(kicker, (84, 250))
        paste_clip(frame, head, (84, 320), seg(t, 0.1, 0.55), ease=ease_out_quint)
        paste_clip(frame, head2, (84, 406), seg(t, 0.24, 0.55), ease=ease_out_quint)
        frame.alpha_composite(accent_bar, (86, 512))
        frame.alpha_composite(track, (150, 620))
        growth = ease_in_out_cubic(seg(t, 0.4, 0.7))
        d2 = ImageDraw.Draw(frame)
        d2.rectangle((150, 620, 153, int(620 + 700 * growth)), fill=GREEN_DEEP + (255,))
        y = 600
        spacing = 136
        for i, lay in enumerate(step_layers):
            start = 0.6 + i * 0.52
            k = seg(t, start, 0.5)
            if k > 0:
                # node dot
                r = int(16 * ease_out_back(k))
                cy = y + 30
                d2.ellipse((152 - r, cy - r, 152 + r, cy + r), fill=GREEN_DEEP + (255,))
                num = num_layers[i].copy()
                num.putalpha(num.split()[3].point(lambda v: int(v * clamp(k * 1.4))))
                frame.alpha_composite(num, (98, y - 4))
                body = lay.copy()
                body.putalpha(body.split()[3].point(lambda v: int(v * clamp(k * 1.5))))
                frame.alpha_composite(body, (214, int(y + 34 * (1 - ease_out_cubic(k)))))
            y += spacing
        brand_footer(frame, t, opacity=seg(t, 0.8, 0.6))
        return frame

    return Scene("syllabus", duration, draw, fade=0.4, cap_y=1584)


# ---------------------------------------------------------------------------
# 5. OUTCOMES — a quote-as-poster in green (34.6 - 43.6)
# ---------------------------------------------------------------------------
def build_outcomes(course, duration=9.0):
    base = _bg_rgba(GREEN)
    dark = Image.new("RGBA", (W, H), TEAL + (255,))
    text = " ".join(course["outcome_lines"])
    size, lines, fnt = fit(text, 912, 620, kind="black", start=96, floor=64,
                           line_gap=0.98)
    lh = int(size * 0.98)
    quote_layer = text_layer("", fnt, TEAL, lines=lines, line_gap=0.98)
    mark = text_layer("“", font("black", 240), TEAL, line_gap=1.0)
    kicker = tracked_label("WHAT YOU WILL BE ABLE TO DO", size=26, fill=TEAL, tracking=8)
    from_course = text_layer(course["title"], font("archivo", 38, weight=700), TEAL,
                             tracking=1)

    def draw(t):
        # diagonal wipe: teal -> green
        frame = dark.copy()
        wipe = ease_in_out_cubic(seg(t, 0.0, 0.55))
        if wipe > 0:
            cut = int(H * 1.6 * wipe)
            layer = base.crop((0, 0, W, min(H, cut)))
            frame.alpha_composite(layer, (0, 0))
        lay = kicker.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 0.45, 0.5))))
        frame.alpha_composite(lay, (84, 330))
        frame.alpha_composite(mark, (58, 372))
        y0 = 700
        for i in range(len(lines)):
            rev = seg(t, 0.6 + i * 0.22, 0.6)
            if rev <= 0:
                continue
            src = quote_layer.crop((0, i * lh, quote_layer.width, int((i + 1) * lh) + 10))
            lay = src.copy()
            lay.putalpha(lay.split()[3].point(lambda v: int(v * clamp(rev * 1.6))))
            frame.alpha_composite(lay, (84, int(y0 + i * lh + 40 * (1 - ease_out_quint(rev)))))
        d = ImageDraw.Draw(frame)
        w = int(360 * ease_out_cubic(seg(t, 0.9, 0.6)))
        if w:
            d.line((86, int(y0 + len(lines) * lh + 70), int(86 + w), int(y0 + len(lines) * lh + 70)),
                   fill=TEAL + (220,), width=6)
        lay = from_course.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 1.2, 0.6) * 230)))
        frame.alpha_composite(lay, (86, int(y0 + len(lines) * lh + 108)))
        brand_footer(frame, t, ink_col=TEAL, opacity=seg(t, 0.9, 0.6))
        return frame

    return Scene("outcomes", duration, draw, fade=0.4, cap_y=1500)


# ---------------------------------------------------------------------------
# 6. RHYTHM — three-up montage of the track (43.6 - 51.6)
# ---------------------------------------------------------------------------
def build_montage(course, duration=8.0):
    alt = {"Business": ["bg-cta.jpg", "workspace.jpg"],
           "Marketing": ["bg-home.jpg", "cat-brand.jpg"],
           "Coding": ["workspace.jpg", "bg-contact.jpg"],
           "Writing": ["bg-about.jpg", "bg-courses.jpg"],
           "Design": ["hero-tile.jpg", "bg-cta.jpg"],
           "Video": ["bg-courses.jpg", "bg-home.jpg"],
           "Career": ["bg-contact.jpg", "workspace.jpg"]}
    imgs = [PUBLIC / course["img"].lstrip("/")]
    cat_img = PUBLIC / f"images/cat-{course['category'].lower()}.jpg"
    if cat_img.exists():
        imgs.append(cat_img)
    pool = alt.get(course["category"], []) + ["workspace.jpg", "bg-home.jpg",
                                              "bg-courses.jpg", "bg-about.jpg",
                                              "bg-cta.jpg", "hero-tile.jpg",
                                              "bg-contact.jpg"]
    for name in pool:
        imgs.append(PUBLIC / "images" / name)
    # de-duplicate by *image content* (the course art and track art are often
    # the same photograph cropped differently), then take the first three
    def fingerprint(path):
        try:
            with Image.open(path) as im:
                return im.convert("L").resize((16, 16), Image.BILINEAR).tobytes()
        except Exception:
            return b""

    seen, picked = set(), []
    for p in imgs:
        if not p.exists():
            continue
        fp = fingerprint(p)
        if fp in seen:
            continue
        seen.add(fp)
        picked.append(p)
    imgs = picked[:3]
    tiles = []
    for i, p in enumerate(imgs[:3]):
        im = Image.open(p).convert("RGB")
        im = cover(im, (980, 660), zoom=1.0, focus=(0.5, 0.45))
        tiles.append(duotone(im, TEAL, (206, 222, 216), 0.42 if i == 0 else 0.62))
    labels = ["THE WORK", "THE SKILL", "THE BUSINESS"]
    base = _bg_rgba(MIST)
    kicker = tracked_label("FROM SKILL TO INCOME", size=27, fill=GREEN_DEEP, tracking=9)
    title = text_layer("THIS IS THE WORK", font("black", 78), INK, line_gap=0.95)

    card_h, card_w = 494, 980
    cards = []
    for i, tile in enumerate(tiles):
        tw, th = card_w, card_h
        card = Image.new("RGBA", (tw + 8, th + 8), (0, 0, 0, 0))
        mask = Image.new("L", (tw, th), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, tw, th), radius=40, fill=255)
        card.paste(tile.resize((tw, th), Image.BILINEAR), (4, 4), mask)
        ImageDraw.Draw(card).rounded_rectangle((4, 4, tw + 4, th + 4), radius=40,
                                               outline=WHITE + (200,), width=3)
        lbl = text_layer(labels[i % len(labels)], font("archivo", 30, weight=800),
                         PAPER, tracking=6)
        chip = Image.new("RGBA", (lbl.width + 64, 66), (0, 0, 0, 0))
        ImageDraw.Draw(chip).rounded_rectangle((0, 0, lbl.width + 64, 66),
                                               radius=33, fill=TEAL + (228,))
        chip.alpha_composite(lbl, (32, 17))
        card.alpha_composite(chip, (36, 36))
        cards.append(card)

    def draw(t):
        frame = base.copy()
        frame.alpha_composite(kicker, (72, 250))
        paste_clip(frame, title, (72, 300), seg(t, 0.05, 0.5), ease=ease_out_quint)
        shift = (t / duration) * 190
        for i, card in enumerate(cards):
            y = 520 + i * (card_h - 96) - shift * (0.6 + 0.2 * i)
            if y > H or y < -card_h:
                continue
            k = seg(t, 0.25 + i * 0.18, 0.7)
            if k <= 0:
                continue
            a = int(255 * clamp(k * 1.4))
            c = card.copy()
            if a < 255:
                c.putalpha(c.split()[3].point(lambda v: int(v * a / 255)))
            slide = int(36 * (1 - ease_out_cubic(k)))
            frame.alpha_composite(c, (int((W - card.width) / 2), int(y + slide)))
        brand_footer(frame, t, opacity=seg(t, 0.6, 0.6))
        return frame

    return Scene("montage", duration, draw, fade=0.4, cap_y=1584)


# ---------------------------------------------------------------------------
# 7. PROOF — numbers band (51.6 - 56.6)
# ---------------------------------------------------------------------------
_STATS = [
    ("19", "PRACTICAL COURSES"),
    ("7", "SKILL TRACKS"),
    ("8", "WEEKS TO A PROJECT"),
    ("100%", "HANDS-ON"),
]


def build_proof(course, duration=5.0):
    base = _bg_rgba(INK)
    d = ImageDraw.Draw(base)
    for i in range(H):
        v = i / H
        d.line((0, i, W, i), fill=(int(6 + 8 * v), int(32 + 14 * v), int(46 + 14 * v)))
    glow = radial_glow((900, 700), GREEN, alpha=22)
    base.alpha_composite(glow, (-120, 500))
    kicker = tracked_label("WHY CHRISCO", size=27, fill=GREEN, tracking=9)
    head = text_layer("SKILLS THAT", font("black", 96), PAPER, line_gap=0.93)
    head2 = text_layer("PAY THE BILLS", font("black", 96), GREEN, line_gap=0.93)
    big = font("black", 176)
    small = font("archivo", 28, weight=700)

    def draw(t):
        frame = base.copy()
        frame.alpha_composite(kicker, (84, 300))
        paste_clip(frame, head, (84, 368), seg(t, 0.05, 0.5), ease=ease_out_quint)
        paste_clip(frame, head2, (84, 456), seg(t, 0.16, 0.5), ease=ease_out_quint)
        y = 690
        for i, (val, label) in enumerate(_STATS):
            k = seg(t, 0.45 + i * 0.16, 0.55)
            if k <= 0:
                continue
            row = Image.new("RGBA", (940, 200), (0, 0, 0, 0))
            rd = ImageDraw.Draw(row)
            rd.line((0, 176, 940, 176), fill=(120, 150, 160, 90), width=2)
            num = text_layer(val, big, PAPER, line_gap=1.0)
            row.alpha_composite(num, (0, 0))
            lab = text_layer(label, small, GREEN, tracking=6, line_gap=1.0)
            row.alpha_composite(lab, (int(num.width) + 34, 118))
            row.putalpha(row.split()[3].point(lambda v: int(v * clamp(k * 1.5))))
            frame.alpha_composite(row, (84, int(y + 60 * (1 - ease_out_cubic(k)))))
            y += 188
        brand_footer(frame, t, ink_col=PAPER, opacity=seg(t, 0.6, 0.6))
        return frame

    return Scene("proof", duration, draw, fade=0.4, cap_y=1584)


# ---------------------------------------------------------------------------
# 8. CTA — the closing card (56.6 - 66.6)
# ---------------------------------------------------------------------------
def build_cta(course, duration=9.0):
    base = _bg_rgba(GREEN)
    dark = Image.new("RGBA", (W, H), TEAL + (255,))
    logo = text_layer("CHRISCO", font("black", 74), TEAL, tracking=2, line_gap=1.0)
    logo_sub = tracked_label("DIGITAL ACADEMY", size=24, fill=TEAL, tracking=8)
    head = text_layer("ENROL TODAY", font("black", 118), TEAL, line_gap=0.92)
    body_lines = wrap(course["cta"], font("archivo", 40, weight=600), 880)
    body = text_layer("", font("archivo", 40, weight=600), TEAL, lines=body_lines,
                      line_gap=1.12)
    cta_bar = Image.new("RGBA", (880, 132), (0, 0, 0, 0))
    pill(ImageDraw.Draw(cta_bar), (0, 0, 878, 130), fill=TEAL + (255,), radius=65)
    cta_txt = text_layer("ENROL AT CHRISCO DIGITAL ACADEMY",
                         font("archivo", 32, weight=800), GREEN, tracking=4)
    cta_bar.alpha_composite(cta_txt, (int((880 - cta_txt.width) / 2), 40))
    foot = tracked_label("JINJA  ·  BUIKWE  ·  UGANDA  ·  ALL OF AFRICA", size=23,
                         fill=TEAL, tracking=5)
    qr = qr_plate("https://chrisco-digital-academy.vercel.app/courses", px=250,
                  fg=TEAL, bg=WHITE, pad=18)
    scan = text_layer("SCAN TO ENROL", font("archivo", 22, weight=800), TEAL,
                      tracking=6, line_gap=1.0)

    def draw(t):
        frame = dark.copy()
        wipe = ease_in_out_cubic(seg(t, 0.0, 0.6))
        if wipe > 0:
            frame.alpha_composite(base.crop((0, 0, W, int(H * wipe))), (0, 0))
            frame.alpha_composite(base.crop((0, int(H * wipe), W, H)), (0, int(H * wipe)))
            if wipe < 1:
                pass
        frame.alpha_composite(logo, (84, 300))
        lay = logo_sub.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 0.4, 0.5) * 200)))
        frame.alpha_composite(lay, (88, 386))
        paste_clip(frame, head, (84, 620), seg(t, 0.35, 0.6), ease=ease_out_quint)
        lay = body.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 0.8, 0.6) * 235)))
        frame.alpha_composite(lay, (84, 800))
        k = seg(t, 1.1, 0.5)
        if k > 0:
            s = cta_bar.copy()
            s.putalpha(s.split()[3].point(lambda v: int(v * k)))
            frame.alpha_composite(s, (100, int(1100 + 40 * (1 - ease_out_cubic(k)))))
        lay = foot.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 1.4, 0.6) * 190)))
        frame.alpha_composite(lay, (88, 1290))
        if qr is not None:
            k = seg(t, 1.7, 0.6)
            if k > 0:
                q = qr.copy()
                q.putalpha(q.split()[3].point(lambda v: int(v * k)))
                qx, qy = int((W - qr.width) / 2), int(1420 + 40 * (1 - ease_out_cubic(k)))
                frame.alpha_composite(q, (qx, qy))
                lab = scan.copy()
                lab.putalpha(lab.split()[3].point(lambda v: int(v * k * 220)))
                frame.alpha_composite(lab, (int((W - scan.width) / 2), qy + qr.height + 20))
        return frame

    return Scene("cta", duration, draw, fade=0.5, cap_y=None)


# ---------------------------------------------------------------------------
# 9. OUTRO — 19 posters wall + endline (last ~6 s)
# ---------------------------------------------------------------------------
def build_outro(course, duration=6.0):
    base = _bg_rgba(TEAL)
    courses = json.loads(
        (Path(__file__).resolve().parent / "courses.json").read_text())
    # 4 x 5 grid of mini posters, each tinted with its own course colour
    cols, rows = 4, 5
    cw, ch = 250, 340
    gx, gy = 14, 14
    wall = Image.new("RGBA", (cols * cw + (cols - 1) * gx, rows * ch + (rows - 1) * gy),
                     (0, 0, 0, 0))
    wd = ImageDraw.Draw(wall)
    order = sorted(courses, key=lambda c: 0 if c["id"] == course["id"] else 1)
    for i, c in enumerate(order[:cols * rows]):
        x = (i % cols) * (cw + gx)
        y = (i // cols) * (ch + gy)
        col = tuple(int(c["color"][0][j:j + 2], 16) for j in (1, 3, 5))
        wd.rounded_rectangle((x, y, x + cw, y + ch), radius=26,
                             fill=(8, 44, 60, 255), outline=col + (150,), width=2)
        num = text_layer(f"{c['id']:02d}", font("black", 58), col, line_gap=1.0)
        wall.alpha_composite(num, (x + 22, y + 20))
        tsize = 26
        tf = font("archivo", tsize, weight=800)
        tl = wrap(c["title"].upper(), tf, cw - 44)
        lay = text_layer("", tf, PAPER, lines=tl, line_gap=1.08)
        wall.alpha_composite(lay, (x + 22, y + 108))
        cat = text_layer(c["category"].upper(), font("archivo", 19, weight=700),
                         (166, 192, 198), tracking=2)
        wall.alpha_composite(cat, (x + 22, y + ch - 58))
    # no rotation: keeps the 4-up grid exactly inside the 1080 frame

    head = text_layer("19 COURSES.", font("black", 96), PAPER, line_gap=0.94)
    head2 = text_layer("ONE ACADEMY.", font("black", 96), GREEN, line_gap=0.94)
    sub_lines = wrap("Business  ·  Design  ·  Coding  ·  Marketing  ·  Writing  ·  "
                     "Video  ·  Career", font("archivo", 30, weight=600), 900)
    sub = text_layer("", font("archivo", 30, weight=600), (198, 214, 220),
                     lines=sub_lines, line_gap=1.3)
    brandline = text_layer("CHRISCO YOUTH AFLAME  ·  DIGITAL ACADEMY",
                           font("archivo", 26, weight=700), GREEN, tracking=7)

    def draw(t):
        frame = base.copy()
        # wall rises from the bottom
        rise = ease_out_cubic(seg(t, 0.0, 1.4))
        scroll = 130 * clamp(t / max(0.1, duration))
        wy = int(792 + 360 * (1 - rise) - scroll)
        wl = wall.copy()
        wl.putalpha(wl.split()[3].point(lambda v: int(v * 215)))
        frame.alpha_composite(wl, (int((W - wall.width) / 2), wy))
        # dissolve the wall into the background at the bottom edge
        edge = Image.new("RGBA", (W, 240), (0, 0, 0, 0))
        ed = ImageDraw.Draw(edge)
        for i in range(240):
            ed.line((0, i, W, i), fill=(0, 35, 51, int(255 * (i / 240) ** 1.5)))
        frame.alpha_composite(edge, (0, H - 240))
        veil = Image.new("RGBA", (W, H), (0, 30, 44, 0))
        vd = ImageDraw.Draw(veil)
        for i in range(700):
            a = 255 if i < 600 else int(255 * (700 - i) / 100.0)
            vd.line((0, i, W, i), fill=(0, 30, 44, a))
        frame.alpha_composite(veil)
        paste_clip(frame, head, (78, 232), seg(t, 0.2, 0.6), ease=ease_out_quint)
        paste_clip(frame, head2, (78, 324), seg(t, 0.34, 0.6), ease=ease_out_quint)
        lay = sub.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 0.6, 0.6) * 225)))
        frame.alpha_composite(lay, (80, 452))
        lay = brandline.copy()
        lay.putalpha(lay.split()[3].point(lambda v: int(v * seg(t, 0.9, 0.6) * 235)))
        frame.alpha_composite(lay, (80, 548))
        return frame

    return Scene("outro", duration, draw, fade=0.5, cap_y=None)
