#!/usr/bin/env python3
"""Optimise the site photography for the web.

Two jobs:

1. `ingest`  — take the high-resolution source shots in `public/images/src/`,
   crop them to the aspect ratio the layout actually uses, give them a punchy
   (but still natural) grade, and write compact progressive JPEGs into
   `public/images/`.
2. `grade`   — give the photos that are already in `public/images/` the same
   vibrance/contrast lift so the whole set feels consistent.

Run:  python3 scripts/optimize_images.py
"""
import os
import sys
from PIL import Image, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "images")
SRC = os.path.join(IMG, "src")

# filename -> (aspect ratio w/h, max width, focal point 0..1 vertical)
INGEST = {
    "hero-home.jpg":  ("bg-home.jpg",    16 / 9,  1920, 0.45),
    "bg-courses.jpg": ("bg-courses.jpg", 16 / 9,  1920, 0.45),
    "bg-cta.jpg":     ("bg-cta.jpg",     16 / 9,  1920, 0.45),
    "bg-about.jpg":   ("bg-about.jpg",   16 / 9,  1920, 0.45),
    "hero-tile.jpg":  ("hero-tile.jpg",  4 / 5,   1100, 0.42),
}

# Photos already in public/images that only need the grade pass.
GRADE_ONLY = ["bg-contact.jpg", "workspace.jpg", "cat-coding.jpg", "cat-design.jpg",
              "cat-marketing.jpg", "cat-video.jpg", "cat-writing.jpg"]


def grade(im, saturation=1.14, contrast=1.07, brightness=1.05, sharpen=True):
    """Lift vibrance/contrast so the photo stays lively under a light scrim."""
    im = ImageEnhance.Color(im).enhance(saturation)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Brightness(im).enhance(brightness)
    if sharpen:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=3))
    return im


def crop_ratio(im, ratio, focal=0.5):
    w, h = im.size
    cur = w / h
    if cur > ratio:                       # too wide -> trim the sides
        nw = int(round(h * ratio))
        x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    elif cur < ratio:                     # too tall -> trim around the focal point
        nh = int(round(w / ratio))
        y = int(round((h - nh) * focal))
        y = max(0, min(y, h - nh))
        im = im.crop((0, y, w, y + nh))
    return im


def save(im, path, max_w, quality=80):
    if im.width > max_w:
        im = im.resize((max_w, int(round(im.height * max_w / im.width))), Image.LANCZOS)
    im.convert("RGB").save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    return os.path.getsize(path)


def main():
    total = 0
    if os.path.isdir(SRC):
        for src_name, (out_name, ratio, max_w, focal) in INGEST.items():
            src = os.path.join(SRC, src_name)
            if not os.path.exists(src):
                print("skip (missing source):", src_name)
                continue
            im = Image.open(src).convert("RGB")
            im = crop_ratio(im, ratio, focal)
            im = grade(im)
            size = save(im, os.path.join(IMG, out_name), max_w)
            total += size
            print(f"ingest  {src_name:16s} -> {out_name:16s} {size/1024:7.1f} KB")

    for name in GRADE_ONLY:
        path = os.path.join(IMG, name)
        if not os.path.exists(path):
            continue
        im = Image.open(path).convert("RGB")
        im = grade(im, saturation=1.12, contrast=1.05, brightness=1.04)
        max_w = 1600 if name.startswith("cat-") else 1920
        size = save(im, path, max_w)
        total += size
        print(f"grade   {name:16s} {size/1024:7.1f} KB")

    print(f"\ntotal image payload: {total/1024:.1f} KB")


if __name__ == "__main__":
    sys.exit(main())
