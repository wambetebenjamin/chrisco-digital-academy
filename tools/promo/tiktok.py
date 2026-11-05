"""TikTok-carousel template engine, after the client's reference film.

The reference is a still photo collage with type over it, not a scene-sequence
film. This module rebuilds that grammar exactly — bright airy photo, three dots,
thin display serif headline, thick rounded yellow frame around the footage,
blue "THIS WEEK ONLY!" disc, blue signal glyph, magenta caption bar — and keeps
it on screen for the whole narration, swapping the inner footage and the bar
copy in step with the voice.

Palette is sampled from the reference frames, not invented.
"""
from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
FONT_DIR = HERE / "fonts"

W, H = 1080, 1920

# --- palette, sampled from the reference --------------------------------
NAVY = (9, 51, 114)        # headline ink
BLUE = (0, 84, 180)        # disc + signal glyph
MAGENTA = (228, 0, 120)    # dots + caption bar
YELLOW = (228, 192, 24)    # frame ring
WHITE = (255, 255, 255)
PAPER = (247, 245, 244)

# --- frame geometry, measured on the 2160x3840 reference -----------------
FRAME = (192, 763, 890, 1695)   # outer box of the yellow ring
RING = 46                       # ring thickness
RADIUS = 74                     # outer corner radius
BAR = (192, 1733, 890, 1920)    # magenta caption bar (runs off the bottom)
BAR_TOP = 1733

_SERIF = FONT_DIR / "BodoniModa.ttf"


# ---------------------------------------------------------------------------
# fonts
# ---------------------------------------------------------------------------
def display(size: int, weight: int = 400, opsz: int = 24) -> ImageFont.FreeTypeFont:
    """High-contrast display serif for the headline block."""
    f = ImageFont.truetype(str(_SERIF), size)
    try:
        f.set_variation_by_axes([opsz, weight])
    except Exception:
        pass
    return f


def sans(size: int, weight: int = 600) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONT_DIR / "Archivo.ttf"), size)
    try:
        f.set_variation_by_axes([weight, 100])
    except Exception:
        pass
    return f


# ---------------------------------------------------------------------------
# photo helpers
# ---------------------------------------------------------------------------
def cover(img: Image.Image, size) -> Image.Image:
    """Crop-to-fill, the way object-fit: cover would behave."""
    tw, th = size
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = max(1, round(sw * scale)), max(1, round(sh * scale))
    r = img.convert("RGB").resize((nw, nh), Image.LANCZOS)
    x, y = (nw - tw) // 2, (nh - th) // 2
    return r.crop((x, y, x + tw, y + th))


def wash(img: Image.Image, amount: float = 0.62) -> Image.Image:
    """Scrim a photo toward white: the reference background is very airy."""
    return Image.blend(img.convert("RGB"), Image.new("RGB", img.size, WHITE), amount)


def soft_bg(img: Image.Image, amount: float = 0.62, blur: int = 9) -> Image.Image:
    """Background treatment: softly blurred then washed toward white.

    Blurring first means the upscale from a 960px source cannot show, and it
    reproduces the reference's out-of-focus, high-key backdrop.
    """
    b = img.convert("RGB").filter(ImageFilter.GaussianBlur(blur))
    return Image.blend(b, Image.new("RGB", b.size, WHITE), amount)


def lift(img: Image.Image, amount: float = 0.10) -> Image.Image:
    """Slight brightening for the inner footage so it reads through the frame."""
    return Image.blend(img.convert("RGB"), Image.new("RGB", img.size, WHITE), amount)


# ---------------------------------------------------------------------------
# shapes
# ---------------------------------------------------------------------------
def sparkle(size: int, colour, waist: float = 0.16) -> Image.Image:
    """Chunky four-point star with concave sides, like the reference's clip-art.

    Each arm is a tip at radius R; between neighbouring tips the outline is a
    quadratic curve pulled in to `waist * R`, which is what gives the sparkle
    its pressed-in, clip-art silhouette rather than a spiky asterisk.
    """
    k = 4
    R = size * k * 0.5
    im = Image.new("RGBA", (size * k, size * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = cy = size * k / 2
    tips = [(cx, cy - R), (cx + R, cy), (cx, cy + R), (cx - R, cy)]
    ctrl_r = R * waist
    pts = []
    for i in range(4):
        a = tips[i]
        b = tips[(i + 1) % 4]
        ang = math.radians(45 + 90 * i)
        c = (cx + math.cos(ang) * ctrl_r, cy + math.sin(ang) * ctrl_r)
        for j in range(13):
            u = j / 12
            x = (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u ** 2 * b[0]
            y = (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u ** 2 * b[1]
            pts.append((x, y))
    d.polygon(pts, fill=colour + (255,))
    out = im.resize((size, size), Image.LANCZOS)
    bb = out.getbbox()
    return out.crop(bb) if bb else out


def signal_glyph(h: int = 210, colour=BLUE) -> Image.Image:
    """Two nested ~290 degree arcs opening to the bottom-left, as in the reference."""
    w = int(h * 1.0)
    k = 4  # supersample
    im = Image.new("RGBA", (w * k, h * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx, cy = int(w * k * 0.02), int(h * k * 0.94)
    for r, thick in ((0.92, 0.15), (0.60, 0.15)):
        rr = h * k * r
        d.arc((cx - rr, cy - rr, cx + rr, cy + rr), start=100, end=172,
              fill=colour + (255,), width=int(h * k * thick))
    out = im.resize((w, h), Image.LANCZOS)
    bb = out.getbbox()
    return out.crop(bb) if bb else out


def rounded_mask(size, radius) -> Image.Image:
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1),
                                        radius=radius, fill=255)
    return m


# ---------------------------------------------------------------------------
# text layout
# ---------------------------------------------------------------------------
def wrap_centred(text: str, f, max_w: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    for word in words:
        trial = f"{cur} {word}".strip()
        if probe.textlength(trial, font=f) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def fit_headline(text, max_size=104, min_size=70, max_w=800, target_h=380):
    """Largest size whose wrapped block still fits the space above the frame."""
    best = None
    for size in range(max_size, min_size - 1, -2):
        f = display(size, weight=400, opsz=96)
        lines = wrap_centred(text, f, max_w)
        h = int(f.size * 0.92) * len(lines)
        if h <= target_h:
            return f, lines
        best = (f, lines)
    return best


def tracked_block(lines, f, colour, tracking=0.06, line_gap=1.02, stroke=0):
    """Render centred lines of tracked caps into one RGBA layer."""
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    space = probe.textlength(" ", font=f)
    widths = []
    for ln in lines:
        widths.append(sum(probe.textlength(ch, font=f) for ch in ln)
                      + space * tracking * max(0, len(ln) - 1))
    bw = int(max(widths)) + 40
    line_h = int(f.size * line_gap)
    bh = int(line_h * len(lines)) + int(f.size * 0.4)
    layer = Image.new("RGBA", (bw + 8, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    y = 0
    for ln, wdt in zip(lines, widths):
        # centre on the true ink extent, then advance by the glyph width only:
        # the tracking was already added to `wdt`, so adding it here as well
        # made every line render wider than it measured and overrun itself.
        x = (layer.width - wdt) / 2
        for ch in ln:
            d.text((x, y), ch, font=f, fill=colour + (255,), stroke_width=stroke,
                   stroke_fill=colour + (255,))
            x += probe.textlength(ch, font=f)
        y += line_h
    return layer


# ---------------------------------------------------------------------------
# the frame
# ---------------------------------------------------------------------------
@dataclass
class Card:
    """One full-bleed slide of the reference template."""
    bg: Image.Image        # airy background photo, already 1080x1920
    inner: Image.Image     # inner footage, already cropped to the frame
    headline: list[str]    # headline lines, caps
    bar: str               # caption bar copy
    badge: str = "THIS WEEK ONLY!"
    dots: bool = True
    show_frame: bool = True


def build_card(card: Card) -> Image.Image:
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(frame)

    # airy background
    frame.alpha_composite(card.bg.convert("RGBA"))

    if card.dots:
        n, r, gap, top = 3, 14, 23, 162
        total = n * r * 2 + (n - 1) * gap
        x = (W - total) / 2
        for _ in range(n):
            d.ellipse((x, top, x + r * 2, top + r * 2), fill=MAGENTA + (255,))
            x += r * 2 + gap

    # headline: thin display serif, tight, centred
    hf, lines = fit_headline(card.headline, max_size=104, min_size=64,
                             max_w=800, target_h=392)
    head = tracked_block(lines, hf, NAVY, tracking=0.045, line_gap=0.92)
    ink = head.getbbox() or (0, 0, head.width, head.height)
    head = head.crop(ink)
    head_bottom = FRAME[1] - 101          # reference: type ends 101px above frame
    frame.alpha_composite(head, (int((W - head.width) / 2), head_bottom - head.height))

    if card.show_frame:
        x0, y0, x1, y1 = FRAME
        # yellow ring drawn as a rounded rect outline
        d.rounded_rectangle((x0, y0, x1 - 1, y1 - 1), radius=RADIUS,
                            outline=YELLOW + (255,), width=RING)
        # inner footage, inset by the ring
        ix0, iy0 = x0 + RING, y0 + RING
        iw, ih = (x1 - x0) - RING * 2, (y1 - y0) - RING * 2
        inner = card.inner.convert("RGB").resize((iw, ih), Image.LANCZOS)
        frame.paste(inner, (ix0, iy0),
                    rounded_mask((iw, ih), RADIUS - RING + 6))

        # signal glyph riding the top-right corner
        sig = signal_glyph(210)
        frame.alpha_composite(sig, (x1 - int(sig.width * 0.62),
                                    y0 - int(sig.height * 0.30)))

        # blue disc badge on the left edge
        if card.badge:
            dr = 105
            cx, cy = x0 + 118, y0 + 330
            d.ellipse((cx - dr, cy - dr, cx + dr, cy + dr), fill=BLUE + (255,))
            bf = sans(52, weight=700)
            blines = wrap_centred(card.badge, bf, int(dr * 1.5))
            blk = tracked_block(blines, bf, WHITE, tracking=0.0, line_gap=1.12)
            frame.alpha_composite(blk, (int(cx - blk.width / 2),
                                        int(cy - blk.height / 2)))

    # magenta caption bar, bleeding off the bottom
    bx0, by0, bx1, by1 = BAR
    d.rounded_rectangle((bx0, by0, bx1 - 1, by1 + 60), radius=54,
                        fill=MAGENTA + (255,))
    bf = sans(38, weight=500)
    blines = wrap_centred(card.bar, bf, 560)
    blk = tracked_block(blines, bf, WHITE, tracking=0.0, line_gap=1.22)
    frame.alpha_composite(blk, (int(bx0 + 118 + (bx1 - bx0 - 236 - blk.width) / 2),
                                int(by0 + 26)))
    # sparkle cluster over the bar's left edge
    # sparkle cluster overhanging the bar's left edge, as in the reference
    for size, ox, oy in ((92, -56, 4), (54, 22, 74), (38, -22, 118), (26, 66, 20)):
        frame.alpha_composite(sparkle(size, YELLOW), (bx0 + ox, by0 + oy))
    return frame.convert("RGB")


# ---------------------------------------------------------------------------
# motion
# ---------------------------------------------------------------------------
def ken_burns(img: Image.Image, size, t: float, dur: float,
              zoom: float = 0.07) -> Image.Image:
    """Slow push-in, so stills do not read as dead frames."""
    k = min(1.0, max(0.0, t / max(dur, 1e-3)))
    scale = 1.0 + zoom * (1 - k) ** 1.6
    w, h = img.size
    cw, ch = int(w / scale), int(h / scale)
    x = (w - cw) // 2
    y = (h - ch) // 2
    return img.crop((x, y, x + cw, y + ch)).resize(size, Image.LANCZOS)


def crossfade(a: Image.Image, b: Image.Image, k: float) -> Image.Image:
    return Image.blend(a, b, max(0.0, min(1.0, k)))
