#!/usr/bin/env python3
"""Studio-grade merchandise mockup renderer.

Produces every 1200x1500 (4:5) product image in public/merch/ from the clean,
line-free studio garment photographs in public/merch/source/studio/ and the
supplied artwork in public/merch/source/art/.

Run with:
    .venv/bin/python scripts/build_merch_mockups.py
"""
from __future__ import annotations

import os
import sys
from functools import lru_cache

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "merch")
SRC = os.path.join(OUT, "source")
STUDIO = os.path.join(SRC, "studio")
ART = os.path.join(SRC, "art")

W, H = 1200, 1500

PALETTE = {
    "cocoa": (90, 66, 50),
    "cream": (239, 230, 212),
    "ink": (25, 26, 28),
    "chalk": (246, 244, 239),
    "sand": (216, 204, 178),
    "teal": (18, 50, 66),
}


def frame_seamless(
    img: Image.Image,
    crop_box: tuple[int, int, int, int] | None = None,
    scale_fit: float = 0.96,
    y_bias: float = 0.50,
    pad: int = 36,
) -> Image.Image:
    """Frame a studio garment photograph onto a 1200x1500 (4:5) studio canvas."""
    rgb = img.convert("RGB")
    if crop_box is not None:
        rgb = rgb.crop(crop_box)
    ih, iw = rgb.height, rgb.width
    s = min((W * scale_fit) / iw, (H * scale_fit) / ih)
    nw, nh = int(round(iw * s)), int(round(ih * s))
    resized = np.asarray(rgb.resize((nw, nh), Image.LANCZOS), dtype=np.float32)

    x0 = (W - nw) // 2
    y0 = int(round((H - nh) * y_bias))

    tl = np.median(resized[:12, :12], axis=(0, 1))
    tr = np.median(resized[:12, -12:], axis=(0, 1))
    bl = np.median(resized[-12:, :12], axis=(0, 1))
    br = np.median(resized[-12:, -12:], axis=(0, 1))
    top_c = 0.5 * (tl + tr)
    bot_c = 0.5 * (bl + br)

    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    ext = np.broadcast_to(top_c[None, None, :] * (1 - yy) + bot_c[None, None, :] * yy, (H, W, 3)).copy()

    ext[y0:y0 + nh, x0:x0 + nw] = resized
    top_edge = np.median(resized[:6, :, :], axis=0)
    bot_edge = np.median(resized[-6:, :, :], axis=0)

    if y0 > 0:
        t = np.linspace(0, 1, y0, dtype=np.float32)[:, None, None]
        ext[:y0, x0:x0 + nw] = top_c[None, None, :] * (1 - t) + top_edge[None, :, :] * t
    if y0 + nh < H:
        rem = H - (y0 + nh)
        t = np.linspace(0, 1, rem, dtype=np.float32)[:, None, None]
        ext[y0 + nh:, x0:x0 + nw] = bot_edge[None, :, :] * (1 - t) + bot_c[None, None, :] * t
    if x0 > 0:
        t = np.linspace(0, 1, x0, dtype=np.float32)[None, :, None]
        for y in range(H):
            c_left = ext[y, x0]
            ext[y, :x0] = ext[y, 0][None, :] * (1 - t[0]) + c_left[None, :] * t[0]
    if x0 + nw < W:
        rem = W - (x0 + nw)
        t = np.linspace(0, 1, rem, dtype=np.float32)[None, :, None]
        for y in range(H):
            c_right = ext[y, x0 + nw - 1]
            ext[y, x0 + nw:] = c_right[None, :] * (1 - t[0]) + ext[y, -1][None, :] * t[0]

    ext_blur = np.asarray(
        Image.fromarray(np.clip(ext, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(28)),
        dtype=np.float32,
    )

    p = min(pad, nw // 6, nh // 6)
    fx = np.ones(nw, dtype=np.float32)
    fy = np.ones(nh, dtype=np.float32)
    ramp = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, p, dtype=np.float32))
    fx[:p], fx[-p:] = ramp, ramp[::-1]
    fy[:p], fy[-p:] = ramp, ramp[::-1]
    alpha = (fy[:, None] * fx[None, :])[..., None]

    ext_blur[y0:y0 + nh, x0:x0 + nw] = ext_blur[y0:y0 + nh, x0:x0 + nw] * (1 - alpha) + resized * alpha
    return Image.fromarray(np.clip(ext_blur, 0, 255).astype(np.uint8), "RGB")


# --------------------------------------------------------------------------
# Artwork preparation
# --------------------------------------------------------------------------
def unwhite(img: Image.Image) -> Image.Image:
    """Key out the flat outer backdrop of an artwork and keep the ink as RGBA."""
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    corners = np.concatenate([
        rgb[:10, :10].reshape(-1, 3), rgb[:10, -10:].reshape(-1, 3),
        rgb[-10:, :10].reshape(-1, 3), rgb[-10:, -10:].reshape(-1, 3),
    ])
    bg = np.median(corners, axis=0)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    alpha = np.clip((dist - 0.055) / 0.085, 0, 1)
    out = np.dstack([rgb, alpha[..., None]])
    return Image.fromarray((out * 255).astype(np.uint8), "RGBA")


def crop_art(img: Image.Image, pad: int = 8) -> Image.Image:
    a = np.asarray(img.split()[-1], dtype=np.uint8)
    ys, xs = np.where(a > 12)
    if len(xs) == 0:
        return img
    return img.crop((
        max(int(xs.min()) - pad, 0),
        max(int(ys.min()) - pad, 0),
        min(int(xs.max()) + pad, img.width),
        min(int(ys.max()) + pad, img.height),
    ))


def tighten(img: Image.Image, max_gap_ratio: float = 0.11) -> Image.Image:
    """Collapse oversized vertical whitespace between stacked artwork rows."""
    a = np.asarray(img.split()[-1], dtype=np.uint8)
    rows = (a > 12).any(axis=1)
    if not rows.any():
        return img
    idx = np.where(rows)[0]
    top, bottom = int(idx[0]), int(idx[-1]) + 1
    height = bottom - top
    max_gap = max(8, int(height * max_gap_ratio))

    bands, start, gap = [], None, 0
    for y in range(top, bottom):
        if rows[y]:
            if start is None:
                start = y
            gap = 0
        elif start is not None:
            gap += 1
            if gap > max_gap:
                bands.append((start, y - gap + 1))
                start = None
    if start is not None:
        bands.append((start, bottom))
    if len(bands) < 2:
        return img

    pieces = [img.crop((0, b0, img.width, b1)) for b0, b1 in bands]
    gap_px = int(height * 0.045)
    out = Image.new("RGBA", (img.width, sum(p.height for p in pieces) + gap_px * (len(pieces) - 1)), (0, 0, 0, 0))
    y = 0
    for p in pieces:
        out.paste(p, (0, y), p)
        y += p.height + gap_px
    return out


@lru_cache(maxsize=32)
def load_art(name: str) -> Image.Image:
    path = os.path.join(ART, name + ".png")
    if not os.path.exists(path):
        path = os.path.join(SRC, name + ".png")
    art = unwhite(Image.open(path).convert("RGB"))
    art = crop_art(art)
    art = tighten(art)
    return crop_art(art)


# --------------------------------------------------------------------------
# Studio garment templates & compositing
# --------------------------------------------------------------------------
@lru_cache(maxsize=8)
def studio_tee_template(colour: str) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return (canvas_rgb, garment_mask, fabric_shade) for a 1200x1500 studio tee."""
    if colour == "chalk":
        base_img = frame_seamless(
            Image.open(os.path.join(STUDIO, "blank-tee-chalk.jpg")),
            scale_fit=0.96,
            pad=28,
        )
        arr = np.asarray(base_img, dtype=np.float32).copy()
        lum = arr.mean(axis=2)
        mask = np.zeros_like(lum)
        mask[160:1290, 60:1140] = 1.0
        shade = np.clip(lum / 242.0, 0.72, 1.06)
        return arr, mask, shade

    # Dark studio tee template (from blank-tee-ink.jpg) has a pixel-perfect alpha mask (lum < 130)
    base_img = frame_seamless(
        Image.open(os.path.join(STUDIO, "blank-tee-ink.jpg")),
        crop_box=(116, 0, 704, 547),
        scale_fit=0.96,
        pad=24,
    )
    arr = np.asarray(base_img, dtype=np.float32).copy()
    lum = arr.mean(axis=2)
    box = np.zeros_like(lum)
    box[200:1232, 70:1130] = 1.0
    mask = np.clip((132.0 - lum) / 34.0, 0.0, 1.0) * box
    mask = np.asarray(
        Image.fromarray((mask * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.4)),
        dtype=np.float32,
    ) / 255.0
    shade = np.clip(lum / 40.0, 0.35, 1.55)
    if colour == "cocoa":
        cocoa_rgb = np.array([92.0, 64.0, 46.0], dtype=np.float32)[None, None, :] * (0.42 + 0.58 * shade[..., None])
        arr = arr * (1 - mask[..., None]) + np.clip(cocoa_rgb, 0, 255) * mask[..., None]
        return arr, mask, np.clip(0.75 + 0.25 * shade, 0.65, 1.12)
    if colour == "sand":
        # Map dark cotton folds softly to warm Sand (#DED1B8)
        sand_shade = np.clip(0.80 + 0.20 * ((lum - 36.0) / 28.0), 0.72, 1.06)
        sand_rgb = np.array([222.0, 210.0, 186.0], dtype=np.float32)[None, None, :] * sand_shade[..., None]
        arr = arr * (1 - mask[..., None]) + np.clip(sand_rgb, 0, 255) * mask[..., None]
        return arr, mask, sand_shade
    return arr, mask, np.clip(0.75 + 0.25 * shade, 0.65, 1.12)


@lru_cache(maxsize=4)
def studio_tote_template(colour: str) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return (canvas_rgb, garment_mask, fabric_shade) for a 1200x1500 studio tote."""
    base_img = frame_seamless(
        Image.open(os.path.join(STUDIO, "blank-tote-sand.jpg")),
        crop_box=(110, 0, 710, 547),
        scale_fit=0.95,
        pad=32,
    )
    arr = np.asarray(base_img, dtype=np.float32).copy()
    # Studio backdrop is neutral grey (R - B == 0), while natural canvas has R - B >= 15 everywhere
    diff_warm = arr[..., 0] - arr[..., 2]
    lum = arr.mean(axis=2)
    box = np.zeros_like(lum)
    box[250:1220, 210:985] = 1.0
    raw_mask = (np.clip((diff_warm - 11.0) / 5.0, 0.0, 1.0) * box * 255).astype(np.uint8)
    m_img = Image.fromarray(raw_mask, "L").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
    mask = np.asarray(m_img, dtype=np.float32) / 255.0
    shade = np.clip(lum / 225.0, 0.72, 1.08)
    if colour == "teal":
        teal_rgb = np.array([18.0, 54.0, 72.0], dtype=np.float32)[None, None, :] * (0.28 + 0.72 * shade[..., None])
        arr = arr * (1 - mask[..., None]) + np.clip(teal_rgb, 0, 255) * mask[..., None]
    return arr, mask, shade


def composite_print(
    canvas: np.ndarray,
    mask: np.ndarray,
    shade: np.ndarray,
    art: Image.Image,
    box: tuple[int, int, int, int],
    scale: float = 1.0,
) -> Image.Image:
    out = canvas.copy()
    pcx, pcy, pw, ph = box
    ratio = min((pw * scale) / art.width, (ph * scale) / art.height)
    nw, nh = max(2, int(round(art.width * ratio))), max(2, int(round(art.height * ratio)))
    piece = art.resize((nw, nh), Image.LANCZOS)
    px0, py0 = pcx - nw // 2, pcy - nh // 2

    arr = np.asarray(piece, dtype=np.float32) / 255.0
    a = arr[..., 3:4] * mask[py0:py0 + nh, px0:px0 + nw][..., None]
    local_shade = shade[py0:py0 + nh, px0:px0 + nw][..., None]
    ink = arr[..., :3] * 255.0 * np.clip(0.68 + 0.32 * local_shade, 0.55, 1.08)
    region = out[py0:py0 + nh, px0:px0 + nw]
    out[py0:py0 + nh, px0:px0 + nw] = region * (1 - a) + ink * a
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


def save_out(img: Image.Image, out_name: str) -> None:
    img.convert("RGB").save(os.path.join(OUT, out_name), format="PNG", compress_level=6)
    print("rendered", out_name)


# Direct studio renders: (out_name, studio_file, crop_box, scale_fit, pad)
DIRECT_JOBS = [
    # ---- PURSUE collection ----
    ("tshirt-cocoa.png", "pursue-tee-cocoa.jpg", None, 0.96, 32),
    ("tshirt-cream.png", "pursue-tee-cream.jpg", None, 0.96, 32),
    ("tshirt-ink.png", "pursue-tee-ink.jpg", None, 0.96, 32),
    ("tshirt-chalk.png", "pursue-tee-chalk.jpg", None, 0.96, 32),
    ("hoodie-cocoa.png", "pursue-hoodie-cocoa.jpg", None, 0.96, 32),
    ("hoodie-cream.png", "pursue-hoodie-cream.jpg", None, 0.96, 32),
    ("polo-cocoa.png", "pursue-polo-cocoa.jpg", None, 0.96, 32),
    ("polo-chalk.png", "pursue-polo-chalk.jpg", None, 0.96, 32),
    ("cap-cocoa.png", "pursue-cap-cocoa.jpg", None, 0.96, 32),
    ("tote-sand.png", "pursue-tote-sand.jpg", None, 0.96, 32),
    ("mug-cream.png", "pursue-mug-cream.jpg", None, 0.96, 32),
    ("journal-cocoa.png", "pursue-journal-cocoa.jpg", None, 0.96, 32),
    # ---- Faith affirmations ----
    ("tshirt-faith.png", "faith-tee-chalk.jpg", None, 0.96, 32),
    ("tshirt-chosen.png", "chosen-tee-ink.jpg", (116, 0, 704, 547), 0.96, 24),
    ("hoodie-ink.png", "bestill-hoodie-ink.jpg", None, 0.96, 32),
    ("cap-chalk.png", "anchored-cap-chalk.jpg", (60, 0, 760, 547), 0.94, 36),
    ("tote-grace.png", "grace-tote-sand.jpg", (110, 0, 710, 547), 0.95, 32),
    ("mug-chalk.png", "risen-mug-chalk.jpg", (60, 0, 760, 547), 0.94, 36),
    ("journal-cream.png", "wonderfully-journal-cream.jpg", None, 0.96, 32),
    # ---- Scripture statements (direct studio items) ----
    ("tshirt-overtake.png", "overtake-tee-ink.jpg", None, 0.94, 32),
    ("hoodie-recover.png", "recover-hoodie-cream.jpg", None, 0.94, 28),
    ("polo-crest.png", "pursue-polo-crest.jpg", None, 0.96, 32),
    ("cap-overtake.png", "overtake-cap-ink.jpg", None, 0.92, 36),
    ("mug-overtake.png", "overtake-mug-cream.jpg", None, 0.92, 34),
]

# Studio template + artwork jobs: (garment_type, colour, art_name, out_name, scale)
COMPOSITE_JOBS = [
    # ---- Scripture statements ----
    ("tee", "cocoa", "art-presence", "tshirt-presence.png", 0.92),
    ("tee", "cocoa", "art-walkbyfaith", "tshirt-walkbyfaith.png", 0.92),
    ("tee", "cocoa", "art-nowtime", "tshirt-nowtime.png", 0.92),
    ("tee", "cocoa", "art-fishers", "tshirt-fishers.png", 0.94),
    ("tote", "teal", "art-walkbyfaith", "tote-walkbyfaith.png", 0.94),
    # ---- Design drops ----
    ("tee", "chalk", "art-confess", "tshirt-confess.png", 0.90),
    ("tee", "chalk", "art-christfest", "tshirt-christfest.png", 0.95),
    ("tee", "chalk", "art-media", "tshirt-media.png", 0.90),
    ("tee", "chalk", "art-bethechurch", "tshirt-bethechurch.png", 0.94),
    ("tee", "chalk", "art-jesusmadeus", "tshirt-jesusmadeus.png", 0.90),
    ("tee", "sand", "art-walkbyfaith-min", "tshirt-walkscript.png", 0.90),
]


def main() -> int:
    for out_name, studio_file, crop_box, scale_fit, pad in DIRECT_JOBS:
        src_img = Image.open(os.path.join(STUDIO, studio_file))
        framed = frame_seamless(src_img, crop_box=crop_box, scale_fit=scale_fit, pad=pad)
        save_out(framed, out_name)

    for garment_type, colour, art_name, out_name, scale in COMPOSITE_JOBS:
        art = load_art(art_name)
        if garment_type == "tee":
            canvas, mask, shade = studio_tee_template(colour)
            box = (600, 620, 410, 470) if colour == "chalk" else (600, 650, 400, 460)
        elif garment_type == "tote":
            canvas, mask, shade = studio_tote_template(colour)
            box = (595, 965, 390, 430)
        else:
            raise ValueError(f"Unknown garment_type: {garment_type}")
        out_img = composite_print(canvas, mask, shade, art, box, scale=scale)
        save_out(out_img, out_name)

    return 0


if __name__ == "__main__":
    sys.exit(main())
