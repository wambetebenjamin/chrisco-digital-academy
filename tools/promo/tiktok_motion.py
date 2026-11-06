"""Animated renderer for the TikTok-carousel template.

The first pass collapsed every card into one flat still and crossfaded stills,
which meant two headlines dissolved into each other and both became unreadable.
This renderer keeps the card in layers and drives them independently:

    background → legibility veil → inner footage → yellow ring → signal
    → disc badge → headline lines → magenta bar → sparkles → glint

Cards advance with a vertical push (the carousel gesture), so a headline is
always travelling with its own card and never overlaps the next one. Text is
scheduled to be fully gone before the push starts.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

import tiktok as T
from tiktok import (
    BAR, BLUE, FRAME, H, MAGENTA, NAVY, RADIUS, RING, W, YELLOW,
    display, sans, rounded_mask,
)

PUSH = 0.62          # seconds the carousel push takes
FADE = 0.55          # text in/out duration


# ---------------------------------------------------------------------------
# easing
# ---------------------------------------------------------------------------
def clamp01(x: float) -> float:
    return 0.0 if x < 0 else (1.0 if x > 1 else x)


def ease_out_quint(x: float) -> float:
    x = clamp01(x)
    return 1 - (1 - x) ** 5


def ease_out_back(x: float, s: float = 1.55) -> float:
    x = clamp01(x)
    return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2


def ease_in_out_cubic(x: float) -> float:
    x = clamp01(x)
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def seg(t: float, start: float, dur: float) -> float:
    return clamp01((t - start) / dur) if dur > 0 else float(t >= start)


# ---------------------------------------------------------------------------
# card layers
# ---------------------------------------------------------------------------
@dataclass
class CardLayers:
    bg: Image.Image                 # oversized, for parallax zoom
    inner: Image.Image              # oversized, for ken burns
    inner_mask: Image.Image
    veil: Image.Image
    ring: Image.Image
    disc: Image.Image
    headline: list[Image.Image]     # one layer per line
    bar: Image.Image
    sparkles: list[Image.Image]     # twinkle variants
    glyph: list[Image.Image]        # sweep variants
    glint: list[Image.Image]
    dots: Image.Image
    headline_mask: Image.Image = field(default_factory=lambda: Image.new("L", (W, H), 0))
    dur: float = 0.0


def _oversize(img: Image.Image, box, zoom: float = 1.14) -> Image.Image:
    w, h = box
    return T.cover(img, (int(w * zoom), int(h * zoom)))


def _text_lines(lines, f, colour, tracking=0.045, line_gap=0.92):
    """One RGBA layer per line, so lines can stagger independently."""
    out = []
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    space = probe.textlength(" ", font=f)
    for ln in lines:
        w = sum(probe.textlength(c, font=f) for c in ln) + space * tracking * max(0, len(ln) - 1)
        layer = Image.new("RGBA", (int(w) + 56, int(f.size * line_gap) + 24), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        x = (layer.width - w) / 2
        for ch in ln:
            d.text((x, 0), ch, font=f, fill=colour + (255,))
            x += probe.textlength(ch, font=f) + space * tracking
        out.append(layer.crop(layer.getbbox() or (0, 0, layer.width, layer.height)))
    return out


def _fit_lines(text, f_factory, max_w, target_lines=3, lo=58, hi=104):
    for size in range(hi, lo - 1, -2):
        f = f_factory(size)
        lines = T.wrap_centred(text, f, max_w)
        if len(lines) <= target_lines:
            return f, lines
    return f_factory(lo), T.wrap_centred(text, f_factory(lo), max_w)


def _veil() -> Image.Image:
    """Soft white curtain behind the headline so thin serif stays readable."""
    v = Image.new("L", (1, H), 0)
    d = ImageDraw.Draw(v)
    for y in range(H):
        if y < 60:
            a = 96
        elif y < 620:
            a = 128 - int(62 * (y - 60) / 560)
        elif y < 780:
            a = 66 - int(40 * (y - 620) / 160)
        else:
            a = 0
        d.point((0, y), fill=max(0, a))
    return v.resize((W, H))


def build_layers(spec: dict, dur: float) -> CardLayers:
    fw = FRAME[2] - FRAME[0] - RING * 2
    fh = FRAME[3] - FRAME[1] - RING * 2

    bg_src = Image.open(spec["bg"]).convert("RGB")
    bg_src = bg_src.filter(ImageFilter.GaussianBlur(7))
    # warm wash instead of flat white: the reference backdrop is creamy, not grey
    bg_src = Image.blend(bg_src, Image.new("RGB", bg_src.size, (255, 247, 240)), 0.62)
    bg_src = ImageEnhance.Color(bg_src).enhance(1.28)
    bg_src = ImageEnhance.Brightness(bg_src).enhance(1.06)
    bg = _oversize(bg_src, (W, H), 1.16)

    inner_src = Image.open(spec["inner"]).convert("RGB")
    inner_src = ImageEnhance.Color(inner_src).enhance(1.12)
    inner_src = ImageEnhance.Contrast(inner_src).enhance(1.05)
    inner = _oversize(inner_src, (fw, fh), 1.14)
    inner_mask = rounded_mask((fw, fh), RADIUS - RING + 6).resize((fw, fh))

    # yellow ring + a one-off shine that the renderer sweeps
    ring = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(ring).rounded_rectangle(
        (FRAME[0], FRAME[1], FRAME[2] - 1, FRAME[3] - 1),
        radius=RADIUS, outline=YELLOW + (255,), width=RING)

    # headline: fit so it never exceeds three lines and never touches the frame
    hf, hlines = _fit_lines(spec["headline"], lambda s: display(s, 400, 96),
                            800, target_lines=3, lo=58, hi=100)
    head = _text_lines(hlines, hf, NAVY)

    # disc badge
    dr = 105
    disc = Image.new("RGBA", (dr * 2 + 8, dr * 2 + 8), (0, 0, 0, 0))
    dd = ImageDraw.Draw(disc)
    dd.ellipse((4, 4, 4 + dr * 2, 4 + dr * 2), fill=BLUE + (255,))
    bf = sans(50, 700)
    blines = T.wrap_centred(spec.get("badge", "THIS WEEK ONLY!"), bf, int(dr * 1.5))
    blk = T.tracked_block(blines, bf, (255, 255, 255), tracking=0.0, line_gap=1.16)
    disc.alpha_composite(blk, (int(4 + dr - blk.width / 2), int(4 + dr - blk.height / 2)))

    # magenta bar, two lines max so the copy stays legible
    bx0, by0, bx1, _ = BAR
    bar_h = H - by0
    bar = Image.new("RGBA", (bx1 - bx0, bar_h), (0, 0, 0, 0))
    ImageDraw.Draw(bar).rounded_rectangle(
        (0, 0, bx1 - bx0 - 1, bar_h + 80), radius=54, fill=MAGENTA + (255,))
    bf2, bl2 = _fit_lines(spec["bar"], lambda s: sans(s, 500), 520,
                          target_lines=2, lo=26, hi=40)
    blk2 = T.tracked_block(bl2, bf2, (255, 255, 255), tracking=0.0, line_gap=1.24)
    bar.alpha_composite(blk2, (int((bar.width - blk2.width) / 2), 34))

    sparkles = []
    for i in range(10):
        s = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
        base = ((92, 0, 0), (54, 96, 74), (38, 40, 120), (26, 128, 30))
        phase = i / 10 * math.tau
        for j, (size, ox, oy) in enumerate(base):
            k = 0.82 + 0.18 * math.sin(phase + j * 1.7)
            sp = T.sparkle(int(size * k), YELLOW)
            s.alpha_composite(sp, (ox, oy))
        sparkles.append(s)

    glyph = []
    for i in range(12):
        glyph.append(_glyph_sweep(210, i / 11))

    glints = []
    for i in range(8):
        a = int(64 * math.sin(math.pi * i / 7))
        glints.append(_glint(a))

    dots = Image.new("RGBA", (W, 220), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dots)
    r, gap, top = 14, 23, 162
    total = 3 * r * 2 + 2 * gap
    x = (W - total) / 2
    for _ in range(3):
        dd.ellipse((x, top, x + r * 2, top + r * 2), fill=MAGENTA + (255,))
        x += r * 2 + gap

    # mask of where the headline ink sits, for the sheen pass
    htotal = sum(h.height for h in head) + 6 * (len(head) - 1)
    htop = FRAME[1] - 96 - htotal
    hmask = Image.new("L", (W, H), 0)
    yy = htop
    for lay in head:
        alpha = lay.split()[3]
        hmask.paste(alpha, (int((W - lay.width) / 2), yy))
        yy += lay.height + 6

    return CardLayers(bg=bg, inner=inner, inner_mask=inner_mask, veil=_veil(),
                      ring=ring, disc=disc, headline=head, bar=bar,
                      sparkles=sparkles, glyph=glyph, glint=glints,
                      dots=dots, headline_mask=hmask, dur=dur)


def _glyph_sweep(h: int, k: float) -> Image.Image:
    """Signal arcs that draw themselves on as `k` goes 0 → 1."""
    k = clamp01(k)
    w = int(h * 1.0)
    ss = 4
    im = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx, cy = int(w * ss * 0.02), int(h * ss * 0.94)
    span = 288 * k
    for idx, (r, thick) in enumerate(((0.92, 0.15), (0.60, 0.15))):
        kk = clamp01(k * 1.25 - idx * 0.22)
        if kk <= 0:
            continue
        rr = h * ss * r
        d.arc((cx - rr, cy - rr, cx + rr, cy + rr), start=100, end=100 + 288 * kk,
              fill=BLUE + (255,), width=int(h * ss * thick))
    out = im.resize((w, h), Image.LANCZOS)
    bb = out.getbbox()
    return out.crop(bb) if bb else out


def _glint(alpha: int) -> Image.Image:
    """Diagonal light band that sweeps once per card."""
    band = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(band)
    for i in range(-260, 260, 4):
        a = int(alpha * (1 - abs(i) / 260) ** 2)
        d.line([(i, 0), (i + 420, H)], fill=a, width=6)
    return Image.merge("RGBA", (Image.new("L", (W, H), 255),) * 3 + (band,))


# ---------------------------------------------------------------------------
# per-card composition
# ---------------------------------------------------------------------------
def paint_card(L: CardLayers, t: float, animate: bool = True) -> Image.Image:
    d = L.dur or 1.0
    out = Image.new("RGB", (W, H), (255, 255, 255))

    # --- background: slow parallax push, opposite to the inner footage
    k = clamp01(t / d)
    bz = 1.0 + 0.085 * k if animate else 1.0
    bw, bh = L.bg.size
    cw, ch = int(W * bz), int(H * bz)
    bx = (bw - cw) // 2
    by = (bh - ch) // 2
    out.paste(L.bg.crop((bx, by, bx + cw, by + ch)).resize((W, H), Image.BICUBIC))

    # --- legibility veil
    out = Image.composite(Image.new("RGB", (W, H), (255, 255, 255)), out, L.veil)

    # --- inner footage: ken burns, alternating direction per card
    iw, ih = L.inner.size
    fw = FRAME[2] - FRAME[0] - RING * 2
    fh = FRAME[3] - FRAME[1] - RING * 2
    direction = 1 if int(d) % 2 else -1
    travel = 0.10 * k if direction > 0 else 0.10 * (1 - k)
    zoom = 1.0 + 0.075 + (0.075 * k if animate else 0.0)
    cw2 = int(fw * (zoom - 0.11 + travel))
    ch2 = int(fh * (zoom - 0.11 + travel))
    # drift the crop across the available overscan so the shot actually moves
    span_x, span_y = iw - cw2, ih - ch2
    ix = int(span_x * (0.15 + 0.7 * (k if direction > 0 else 1 - k)))
    iy = int(span_y * (0.5 + 0.32 * math.sin(k * math.pi + direction)))
    tile = L.inner.crop((ix, iy, ix + cw2, iy + ch2)).resize(L.inner_mask.size, Image.BICUBIC)
    out.paste(tile, (FRAME[0] + RING, FRAME[1] + RING), L.inner_mask)

    # --- yellow ring, with a shine that travels down it
    out.paste(L.ring, (0, 0), L.ring)
    if animate and 0.15 < k < 0.95:
        shine = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(shine).rounded_rectangle(
            (FRAME[0], FRAME[1], FRAME[2] - 1, FRAME[3] - 1), radius=RADIUS,
            outline=(255, 255, 255, 90), width=10)
        out.paste(shine, (0, 0), shine)

    # --- signal glyph, drawing itself on then breathing
    gk = seg(t, 0.25, 0.75) if animate else 1.0
    gi = min(len(L.glyph) - 1, max(0, int(round(gk * (len(L.glyph) - 1)))))
    g = L.glyph[gi]
    out.paste(g, (FRAME[2] - int(g.width * 0.55), FRAME[1] - int(g.height * 0.26)), g)

    # --- disc badge: springs in, then breathes
    if animate:
        sk = ease_out_back(seg(t, 0.34, 0.55))
    else:
        sk = 1.0
    if sk > 0.02:
        sc = 0.55 + 0.45 * sk
        bw2, bh2 = int(L.disc.width * sc), int(L.disc.height * sc)
        disc = L.disc.resize((bw2, bh2), Image.BICUBIC)
        cx = FRAME[0] + 118 - int(bw2 / 2) + int(14 * (1 - sk))
        cy = FRAME[1] + 330 - int(bh2 / 2)
        out.paste(disc, (cx, cy), disc)

    # --- headline: lines rise and fade in staggered, then lift out
    n = len(L.headline)
    total_h = sum(h.height for h in L.headline) + int(6 * (n - 1))
    bottom = FRAME[1] - 96
    y = bottom - total_h
    for i, line in enumerate(L.headline):
        if animate:
            kin = seg(t, 0.18 + i * 0.09, 0.55)
            kout = seg(t, d - 0.95 - i * 0.05, 0.4)
            a = ease_out_quint(kin) * (1 - ease_in_out_cubic(kout))
            rise = int(46 * (1 - ease_out_quint(kin))) - int(30 * ease_in_out_cubic(kout))
        else:
            a, rise = 1.0, 0
        if a > 0.01:
            lay = line.copy()
            lay.putalpha(lay.split()[3].point(lambda v: int(v * a)))
            # idle float so even a held headline is alive
            float_y = int(2.4 * math.sin(t * 1.35 + i * 0.8))
            out.paste(lay, (int((W - lay.width) / 2), y + rise + float_y), lay)
        y += line.height + 6

    # --- headline sheen: a soft light passes through the type once per card
    sk2 = seg(t, 0.55, 1.5) if animate else 2.0
    if 0.02 < sk2 < 0.98:
        band = Image.new("L", (W, H), 0)
        bd = ImageDraw.Draw(band)
        cx = int(-260 + (W + 520) * sk2)
        for i in range(-200, 200, 6):
            a2 = int(58 * (1 - abs(i) / 200) ** 2)
            bd.line([(cx + i, 200), (cx + i + 180, 760)], fill=a2, width=8)
        hi = Image.new("RGB", (W, H), (255, 250, 235))
        mask = Image.composite(band, Image.new("L", (W, H), 0),
                               L.headline_mask)
        out = Image.composite(hi, out, mask.point(lambda v: int(v * 0.55)))

    # --- magenta bar: slides up, then leaves
    if animate:
        bkin = ease_out_back(seg(t, 0.42, 0.6))
        bkout = ease_in_out_cubic(seg(t, d - 0.75, 0.45))
        boff = int((1 - bkin) * 260 + bkout * 300)
    else:
        boff = 0
    bx0, by0, _, _ = BAR
    out.paste(L.bar, (bx0, by0 + boff), L.bar)

    # --- sparkles, twinkling over the bar's left edge
    si = int((t * 5) % len(L.sparkles))
    sp = L.sparkles[si]
    out.paste(sp, (bx0 - 56, by0 + boff + 4), sp)

    # --- glint sweep
    if animate:
        gk2 = seg(t, d * 0.42, 0.85)
        if 0.001 < gk2 < 0.999:
            gi2 = min(len(L.glint) - 1, max(0, int(round(gk2 * (len(L.glint) - 1)))))
            gl = L.glint[gi2]
            out.paste(gl, (int(-W * 0.6 + W * 1.3 * gk2), 0), gl)

    # --- dots pop in staggered, then float
    for i in range(3):
        if animate:
            pk = ease_out_back(seg(t, 0.1 + i * 0.07, 0.45))
        else:
            pk = 1.0
        if pk <= 0.02:
            continue
        r = 14
        cell = L.dots.crop((int((W - (3 * 28 + 46)) / 2) + i * (28 + 23) - 4, 156,
                            int((W - (3 * 28 + 46)) / 2) + i * (28 + 23) + 32, 200))
        sc = 0.4 + 0.6 * pk
        nw, nh = max(1, int(cell.width * sc)), max(1, int(cell.height * sc))
        c2 = cell.resize((nw, nh), Image.BICUBIC)
        x = int((W - (3 * 28 + 46)) / 2) + i * (28 + 23) - 4 + (cell.width - nw) // 2
        y = 156 + (cell.height - nh) // 2 + int(3 * math.sin(t * 1.6 + i))
        out.paste(c2, (x, y), c2)
    return out
