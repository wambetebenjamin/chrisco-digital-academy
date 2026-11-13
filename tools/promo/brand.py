"""CHRISCO Digital Academy — film design system.

One place for palette, typography, layout metrics and the small drawing
helpers every scene uses. Everything renders at 1080 x 1920 (9:16), which is
the master frame for the course films.
"""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
FPS = 30

# --- palette (from COLOR-SYSTEM.md) -----------------------------------------
INK = (6, 32, 46)
TEAL = (0, 35, 51)
TEAL_SOFT = (7, 52, 72)
GREEN = (0, 255, 132)
GREEN_DEEP = (0, 184, 101)
GREEN_DARK = (0, 138, 76)
PAPER = (250, 250, 246)
MIST = (244, 247, 244)
SLATE = (235, 240, 237)
HAIRLINE = (227, 233, 231)
WHITE = (255, 255, 255)
MUTED = (108, 126, 134)
MUTED_LIGHT = (170, 186, 191)

FONT_DIR = Path(__file__).resolve().parent / "fonts"
_FONTS = {
    "black": FONT_DIR / "ArchivoBlack-Regular.ttf",
    "archivo": FONT_DIR / "Archivo.ttf",
    "inter": FONT_DIR / "Inter.ttf",
}


def font(kind: str = "archivo", size: int = 48, weight: int | None = None,
         width_axis: int | None = None) -> ImageFont.FreeTypeFont:
    """Load one of the three brand faces at a variable weight/width."""
    f = ImageFont.truetype(str(_FONTS[kind]), size)
    if kind == "archivo" and (weight is not None or width_axis is not None):
        f.set_variation_by_axes([weight if weight is not None else 600,
                                 width_axis if width_axis is not None else 100])
    elif kind == "inter" and weight is not None:
        f.set_variation_by_axes([14, weight])
    return f


# --- easing ------------------------------------------------------------------
def clamp(x, lo=0.0, hi=1.0):
    return lo if x < lo else hi if x > hi else x


def ease_out_cubic(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in_out_cubic(x):
    x = clamp(x)
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def ease_out_quint(x):
    x = clamp(x)
    return 1 - (1 - x) ** 5


def ease_in_cubic(x):
    x = clamp(x)
    return x ** 3


def ease_out_back(x, s=1.32):
    x = clamp(x)
    return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2


def seg(t, start, dur):
    """Normalised 0..1 progress of a sub-animation starting at `start`."""
    if dur <= 0:
        return 1.0 if t >= start else 0.0
    return clamp((t - start) / dur)


# --- text helpers ------------------------------------------------------------
def wrap(text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    for word in words:
        trial = f"{cur} {word}".strip()
        if probe.textlength(trial, font=fnt) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def longest_word(fnt, text: str) -> float:
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    return max((probe.textlength(w, font=fnt) for w in text.split()), default=0)


def fit(text: str, max_w: int, max_h: int, kind="black", start=170, floor=64,
        line_gap=0.92, weight=None, tracking: int = 0):
    """Largest font size whose *rendered* lines all fit the box."""
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    size = start
    while size > floor:
        fnt = font(kind, size, weight=weight)
        lines = wrap(text, fnt, max_w)
        lh = size * line_gap
        widest = max((probe.textlength(ln, font=fnt) + tracking * len(ln)
                      for ln in lines), default=0)
        # a single unbreakable word must also fit
        if lh * len(lines) <= max_h and widest <= max_w - 8:
            return size, lines, fnt
        size -= 4
    fnt = font(kind, floor, weight=weight)
    lines = wrap(text, fnt, max_w)
    return floor, lines, fnt


def text_layer(text: str, fnt, fill, tracking: int = 0, line_gap: float = 0.94,
               lines: list[str] | None = None, align: str = "left",
               shadow: bool = False, max_w: int | None = None) -> Image.Image:
    """Render text to a tight RGBA layer (cached once per scene)."""
    lines = lines if lines is not None else [text]
    lh = int(fnt.size * line_gap)
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    widths = []
    for ln in lines:
        if tracking:
            widths.append(sum(probe.textlength(c, font=fnt) + tracking for c in ln) - tracking)
        else:
            widths.append(probe.textlength(ln, font=fnt))
    w = int(max(widths)) + 8
    h = lh * len(lines) + int(fnt.size * 0.5)
    layer = Image.new("RGBA", (max(w, 4), max(h, 4)), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i, ln in enumerate(lines):
        lw = widths[i]
        x = 0 if align == "left" else (w - lw) / 2 if align == "center" else w - lw
        y = i * lh
        if shadow:
            d.text((x + 3, y + 6), ln, font=fnt, fill=(6, 32, 46, 96))
        if tracking:
            cx = x
            for ch in ln:
                d.text((cx, y), ch, font=fnt, fill=fill)
                cx += probe.textlength(ch, font=fnt) + tracking
        else:
            d.text((x, y), ln, font=fnt, fill=fill)
    return layer


def paste_clip(base: Image.Image, layer: Image.Image, xy, reveal: float = 1.0,
               axis: str = "y", ease=None) -> None:
    """Paste `layer` with a wipe reveal (mask-style) — the signature motion."""
    if reveal <= 0.002:
        return
    a = ease(reveal) if ease else reveal
    x, y = int(round(xy[0])), int(round(xy[1]))
    if a >= 0.999:
        base.alpha_composite(layer, (x, y))
        return
    lw, lh = layer.size
    if axis == "y":
        cut = max(1, int(lh * a))
        base.alpha_composite(layer.crop((0, lh - cut, lw, lh)), (x, y + lh - cut))
    else:
        cut = max(1, int(lw * a))
        base.alpha_composite(layer.crop((0, 0, cut, lh)), (x, y))


def tracked_label(text: str, size=30, fill=MUTED, tracking=6, weight=600):
    return text_layer(text.upper(), font("archivo", size, weight=weight), fill,
                      tracking=tracking, line_gap=1.0)


# --- shapes ------------------------------------------------------------------
def pill(draw: ImageDraw.ImageDraw, box, fill=None, outline=None, width=2, radius=None):
    radius = radius if radius is not None else box[3] - box[1]
    draw.rounded_rectangle(box, radius=int(radius), fill=fill, outline=outline,
                           width=width)


def rule(draw, xy, w, color=HAIRLINE, thickness=2):
    x, y = xy
    draw.rectangle((x, y, x + w, y + thickness - 1), fill=color)


def radial_glow(size, color, alpha=42, power=2.2):
    """Soft radial light blob, cached by callers."""
    w, h = size
    small = (max(4, w // 8), max(4, h // 8))
    img = Image.new("L", small, 0)
    px = img.load()
    cx, cy = small[0] / 2, small[1] / 2
    rx, ry = cx, cy
    for yy in range(small[1]):
        for xx in range(small[0]):
            dx = abs(xx - cx) / rx
            dy = abs(yy - cy) / ry
            d = (dx * dx + dy * dy) ** 0.5
            v = max(0.0, 1.0 - d) ** power
            px[xx, yy] = int(255 * v)
    img = img.resize((w, h), Image.BICUBIC)
    if alpha != 255:
        img = img.point(lambda v: int(v * alpha / 255))
    layer = Image.new("RGBA", (w, h), color + (0,))
    layer.putalpha(img)
    return layer


# --- photo treatment ---------------------------------------------------------
def cover(img: Image.Image, size, zoom=1.0, focus=(0.5, 0.5)) -> Image.Image:
    """Center/focus-crop to `size` at the given zoom (fast, integer crop)."""
    tw, th = size
    sw, sh = img.size
    scale = max(tw / sw, th / sh) * zoom
    nw, nh = max(tw, int(sw * scale + 0.5)), max(th, int(sh * scale + 0.5))
    resample = Image.BICUBIC if scale < 1.6 else Image.BILINEAR
    out = img.resize((nw, nh), resample)
    fx, fy = focus
    x = int((nw - tw) * clamp(fx))
    y = int((nh - th) * clamp(fy))
    return out.crop((x, y, x + tw, y + th))


def duotone(img: Image.Image, dark=TEAL, light=None, strength=0.72) -> Image.Image:
    """Cinematic teal wash that also hides upscaling softness."""
    light = light or (208, 224, 219)
    g = img.convert("L")
    duo = Image.merge("RGB", (
        g.point(lambda v: int(dark[0] + (light[0] - dark[0]) * v / 255)),
        g.point(lambda v: int(dark[1] + (light[1] - dark[1]) * v / 255)),
        g.point(lambda v: int(dark[2] + (light[2] - dark[2]) * v / 255)),
    ))
    return Image.blend(img.convert("RGB"), duo, strength)


def grain_tile(seed=7, size=(540, 960), alpha=16) -> Image.Image:
    import random
    rnd = random.Random(seed)
    n = Image.new("L", size)
    px = n.load()
    for y in range(size[1]):
        for x in range(size[0]):
            px[x, y] = rnd.randint(96, 160)
    n = n.filter(ImageFilter.GaussianBlur(0.6))
    layer = Image.new("RGBA", size, (255, 255, 255, 0))
    layer.putalpha(n.point(lambda v: int(abs(v - 128) * alpha / 128)))
    return layer


def vignette(size=(540, 960), strength=150):
    w, h = size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    pad_x, pad_y = int(w * 0.06), int(h * 0.04)
    d.rounded_rectangle((pad_x, pad_y, w - pad_x, h - pad_y), radius=int(w * 0.2),
                        fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(90))
    inv = mask.point(lambda v: int((255 - v) * strength / 255))
    layer = Image.new("RGBA", (w, h), (0, 12, 20, 0))
    layer.putalpha(inv)
    return layer


def soft_shadow(size, radius=48, spread=46, alpha=90):
    w, h = size
    pad = spread * 2
    sh = Image.new("L", (w + pad, h + pad), 0)
    ImageDraw.Draw(sh).rounded_rectangle((pad, pad, pad + w, pad + h),
                                         radius=radius, fill=255)
    sh = sh.filter(ImageFilter.GaussianBlur(spread * 0.62))
    sh = sh.point(lambda v: int(v * alpha / 255))
    layer = Image.new("RGBA", sh.size, (0, 18, 26, 0))
    layer.putalpha(sh)
    return layer


# --- paths -------------------------------------------------------------------
ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
OUT = Path(os.environ.get("CHRISCO_FILM_OUT", str(ROOT / "film-render")))


# --- QR ---------------------------------------------------------------
def qr_plate(url: str, px: int = 300, fg=TEAL, bg=WHITE, pad: int = 22):
    """A scannable QR on a rounded plate, drawn at `px` modules square."""
    try:
        import segno
    except Exception:
        return None
    q = segno.make_qr(url, error="h")
    tmp = Path("/tmp") / "chrisco_qr.png"
    q.save(str(tmp), scale=6, border=0, dark=_hex(fg), light=_hex(bg))
    code = Image.open(tmp).convert("RGB").resize((px, px), Image.NEAREST)
    plate = Image.new("RGBA", (px + pad * 2, px + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(plate).rounded_rectangle(
        (0, 0, plate.width - 1, plate.height - 1), radius=34, fill=bg + (255,))
    plate.paste(code, (pad, pad))
    return plate


def _hex(c):
    return "#%02X%02X%02X" % c[:3]
