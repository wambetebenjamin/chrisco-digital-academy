"""Cinematic surface helpers for the TikTok-template film.

The first pass filled shapes with flat hex colours, which is what made the
frame read as vector clip-art. Everything here exists to replace a flat fill
with something that has a light source: vertical gradients, bevels, specular
sweeps, soft shadows, bloom, volumetric rays, grain and a vignette.
"""
from __future__ import annotations

import math

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

W, H = 1080, 1920


# ---------------------------------------------------------------------------
# gradients
# ---------------------------------------------------------------------------
def vgrad(size, top, bottom, ease=1.0) -> Image.Image:
    """Vertical ramp between two colours."""
    w, h = size
    col = np.zeros((h, 1, 3), dtype=np.float32)
    for c in range(3):
        t = np.linspace(0, 1, h) ** ease
        col[:, 0, c] = top[c] + (bottom[c] - top[c]) * t
    arr = np.repeat(col, w, axis=1).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def diag_grad(size, a, b, angle=45.0) -> Image.Image:
    """Diagonal ramp — reads much less 'printed' than a vertical one."""
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ang = math.radians(angle)
    t = (xx * math.cos(ang) + yy * math.sin(ang))
    t = (t - t.min()) / max(1e-6, (t.max() - t.min()))
    out = np.zeros((h, w, 3), dtype=np.float32)
    for c in range(3):
        out[..., c] = a[c] + (b[c] - a[c]) * t
    return Image.fromarray(out.astype(np.uint8), "RGB")


def radial(size, centre, radius, inner, outer) -> Image.Image:
    """Radial ramp, for discs and glows."""
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt((xx - centre[0]) ** 2 + (yy - centre[1]) ** 2) / max(1.0, radius)
    d = np.clip(d, 0, 1)
    out = np.zeros((h, w, 3), dtype=np.float32)
    for c in range(3):
        out[..., c] = inner[c] + (outer[c] - inner[c]) * d
    return Image.fromarray(out.astype(np.uint8), "RGB")


# ---------------------------------------------------------------------------
# depth: shadow, bevel, specular
# ---------------------------------------------------------------------------
def soft_shadow(mask: Image.Image, blur: int = 28, offset=(0, 14),
                opacity: int = 120) -> Image.Image:
    """Black drop shadow from an alpha mask."""
    a = mask.split()[3] if mask.mode == "RGBA" else mask.convert("L")
    sh = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    sh.putalpha(a.filter(ImageFilter.GaussianBlur(blur)))
    sh = ImageChops.multiply(sh, Image.new("RGBA", mask.size, (0, 0, 0, opacity)))
    return sh.transform(mask.size, Image.AFFINE,
                        (1, 0, -offset[0], 0, 1, -offset[1]))


def inner_bevel(mask: Image.Image, width: int = 10, light=(255, 255, 240),
                dark=(0, 0, 0), strength: float = 0.55) -> Image.Image:
    """Lit top-left edge, shadowed bottom-right edge — reads as extruded."""
    # accept either an L alpha mask or an RGBA image
    a = mask.split()[3] if mask.mode == "RGBA" else mask.convert("L")
    shrunk = a.filter(ImageFilter.MinFilter(width * 2 + 1))
    edge = ImageChops.subtract(a, shrunk)          # inner rim
    # split the rim by direction using two offset copies
    up = edge.transform(a.size, Image.AFFINE, (1, 0, 0, 0, 1, width * 2))
    left = edge.transform(a.size, Image.AFFINE, (1, 0, width * 2, 0, 1, 0))
    dn = edge.transform(a.size, Image.AFFINE, (1, 0, 0, 0, 1, -width * 2))
    rt = edge.transform(a.size, Image.AFFINE, (1, 0, -width * 2, 0, 1, 0))
    lit = ImageChops.lighter(up, left).filter(ImageFilter.GaussianBlur(width * 0.6))
    shade = ImageChops.lighter(dn, rt).filter(ImageFilter.GaussianBlur(width * 0.6))
    out = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    lay = Image.new("RGBA", mask.size, light + (255,))
    lay.putalpha(lit.point(lambda v: int(v * strength)))
    out = Image.alpha_composite(out, lay)
    lay2 = Image.new("RGBA", mask.size, dark + (255,))
    lay2.putalpha(shade.point(lambda v: int(v * strength * 0.85)))
    return Image.alpha_composite(out, lay2)


def specular_band(size, pos: float, width: int = 190, tilt: float = 0.42,
                  peak: int = 165) -> Image.Image:
    """A diagonal specular streak, the kind an anamorphic lens throws."""
    w, h = size
    band = Image.new("L", (w * 2, h * 2), 0)
    d = ImageDraw.Draw(band)
    cx = int(w * pos)
    for i in range(-width, width, 3):
        a = int(peak * (1 - abs(i) / width) ** 2.4)
        d.line([(cx + i, 0), (cx + i + int(h * tilt), h * 2)], fill=a, width=5)
    band = band.crop((0, 0, w, h))
    lay = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    lay.putalpha(band)
    return lay


# ---------------------------------------------------------------------------
# atmosphere
# ---------------------------------------------------------------------------
def volumetric_rays(size, seed=0, count=9) -> Image.Image:
    """Soft god-rays fanning from the top, as a white alpha layer."""
    w, h = size
    im = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(im)
    ox, oy = w * 0.5, -h * 0.18
    for i in range(count):
        a = math.radians(-58 + i * (116 / max(1, count - 1)) + (seed % 7) * 1.7)
        spread = math.radians(2.2 + 1.7 * math.sin(i * 2.1 + seed))
        length = h * 1.7
        pts = [(ox, oy),
               (ox + math.cos(a - spread) * length, oy + math.sin(a - spread) * length),
               (ox + math.cos(a + spread) * length, oy + math.sin(a + spread) * length)]
        d.polygon(pts, fill=int(26 + 16 * math.sin(i * 1.9 + seed)))
    im = im.filter(ImageFilter.GaussianBlur(38))
    lay = Image.new("RGBA", (w, h), (255, 250, 235, 255))
    lay.putalpha(im)
    return lay


def bokeh_field(size, seed=0, count=30) -> Image.Image:
    """Out-of-focus highlights: instant depth of field."""
    w, h = size
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    rng = np.random.default_rng(seed)
    for i in range(count):
        cx = float(rng.uniform(0, w))
        cy = float(rng.uniform(0, h))
        r = float(rng.uniform(14, 74))
        a = int(rng.uniform(18, 54))
        warm = rng.random() > 0.45
        col = (255, 238, 206, a) if warm else (210, 228, 255, a)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    return lay.filter(ImageFilter.GaussianBlur(15))


def vignette(amount: float = 0.42) -> Image.Image:
    """Darkened corners as a multiply mask."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx = (xx - W / 2) / (W / 2)
    ny = (yy - H / 2) / (H / 2)
    d = np.sqrt(nx ** 2 + ny ** 2) / 1.4142
    v = 1.0 - amount * np.clip(d, 0, 1) ** 2.1
    return Image.fromarray((v * 255).astype(np.uint8), "L")


def grain_layers(n=6, strength=9) -> list:
    """A few grayscale noise plates, cycled per frame so it shimmers."""
    out = []
    rng = np.random.default_rng(4)
    for _ in range(n):
        noise = rng.normal(0, strength, (H // 2, W // 2)).astype(np.float32)
        img = Image.fromarray((128 + noise).clip(0, 255).astype(np.uint8), "L")
        out.append(img.resize((W, H), Image.BILINEAR))
    return out


# ---------------------------------------------------------------------------
# optics
# ---------------------------------------------------------------------------
def bloom(img: Image.Image, threshold=196, radius=26, gain=1.5) -> Image.Image:
    """Bloom only the bright pixels, the way a real lens halates."""
    a = np.asarray(img).astype(np.float32)
    lum = a.max(axis=2)
    mask = np.clip((lum - threshold) / max(1.0, 255 - threshold), 0, 1)
    bright = (a * mask[..., None]).astype(np.uint8)
    b = Image.fromarray(bright, "RGB").filter(ImageFilter.GaussianBlur(radius))
    b = Image.blend(b, b.filter(ImageFilter.GaussianBlur(radius * 3)), 0.5)
    b = Image.eval(b, lambda v: min(255, int(v * gain)))
    return ImageChops.screen(img, b)


def anamorphic_flare(img: Image.Image, y: float, x: float = 0.5,
                     strength: float = 0.5) -> Image.Image:
    """Horizontal blue streak across the frame — the anamorphic tell."""
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for i in range(-14, 15):
        a = int(46 * strength * (1 - abs(i) / 15) ** 2)
        d.line([(0, y + i * 3), (W, y + i * 3)], fill=(120, 190, 255, a), width=3)
    lay = lay.filter(ImageFilter.GaussianBlur(16))
    return Image.alpha_composite(img.convert("RGBA"), lay).convert("RGB")


def chromatic(img: Image.Image, amount: int = 3) -> Image.Image:
    """Split the red and blue channels slightly at the edges."""
    r, g, b = img.split()
    r = r.transform(r.size, Image.AFFINE, (1, 0, -amount, 0, 1, 0))
    b = b.transform(b.size, Image.AFFINE, (1, 0, amount, 0, 1, 0))
    return Image.merge("RGB", (r, g, b))


def tone(img: Image.Image, lift=(8, 4, -4), gamma=1.02) -> Image.Image:
    """Split-tone: warm the highlights, cool the shadows, gently."""
    a = np.asarray(img).astype(np.float32) / 255.0
    a = np.power(a, gamma)
    a[..., 0] = np.clip(a[..., 0] + lift[0] / 255.0 * (1 - a[..., 0]), 0, 1)
    a[..., 1] = np.clip(a[..., 1] + lift[1] / 255.0 * (1 - a[..., 1]), 0, 1)
    a[..., 2] = np.clip(a[..., 2] + lift[2] / 255.0 * a[..., 2], 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8), "RGB")


def motion_blur(img: Image.Image, dist: int, angle=90.0) -> Image.Image:
    """Cheap directional blur by averaging three offset copies."""
    if dist < 2:
        return img
    dx = int(math.cos(math.radians(angle)) * dist)
    dy = int(math.sin(math.radians(angle)) * dist)
    acc = img.convert("RGB").copy()
    n = 1
    for f in (-1.0, -0.5, 0.5, 1.0):
        shifted = Image.new("RGB", img.size, (0, 0, 0))
        shifted.paste(img, (int(dx * f), int(dy * f)))
        acc = ImageChops.add(acc, shifted)
        n += 1
    return Image.eval(acc, lambda v: v // n)
