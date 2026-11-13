"""The TikTok-template card, rebuilt with cinematic lighting.

Keeps the client's layout — three dots, display-serif headline, yellow ringed
portrait, blue disc, signal glyph, magenta bar — but every element is lit
rather than flat-filled, the background is graded photography instead of a
white wash, and the headline is set large enough to read on a phone at a
glance.
"""
from __future__ import annotations

import math

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

import cinema as C
from tiktok import (
    BAR, BLUE, FRAME, MAGENTA, NAVY, RADIUS, RING, W, H, YELLOW,
    display, sans, wrap_centred,
)

# a richer grade than the flat palette: the ring is lit gold, not flat yellow
GOLD_HI = (255, 236, 150)
GOLD_LO = (196, 138, 8)
BLUE_HI = (86, 158, 255)
BLUE_LO = (0, 40, 110)
MAG_HI = (255, 74, 176)
MAG_LO = (150, 0, 74)
INK = (12, 22, 54)


# ---------------------------------------------------------------------------
# text
# ---------------------------------------------------------------------------
def headline_layers(text, max_size=142, min_size=84, max_w=920, max_lines=3):
    """Fit the headline to the widest readable size, centred, as line layers."""
    chosen = None
    for size in range(max_size, min_size - 1, -2):
        f = display(size, weight=500, opsz=96)
        lines = wrap_centred(text, f, max_w)
        if len(lines) <= max_lines:
            chosen = (f, lines)
            break
    f, lines = chosen or (display(min_size, 500, 96), wrap_centred(text, display(min_size, 500, 96), max_w))

    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    space = probe.textlength(" ", font=f)
    out = []
    for ln in lines:
        w = sum(probe.textlength(c, font=f) for c in ln) + space * 0.04 * max(0, len(ln) - 1)
        lay = Image.new("RGBA", (int(w) + 70, int(f.size * 1.22)), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay)
        x = (lay.width - w) / 2
        for ch in ln:
            d.text((x, 0), ch, font=f, fill=(255, 255, 255, 255))
            x += probe.textlength(ch, font=f) + space * 0.04
        out.append(lay.crop(lay.getbbox() or (0, 0, lay.width, lay.height)))
    return f, out


def paint_headline(layer: Image.Image, t: float, idx: int, appear: float,
                   leave: float, dur: float) -> Image.Image | None:
    """Give one headline line a gradient fill, bevel, shadow and entrance."""
    kin = max(0.0, min(1.0, (t - appear - idx * 0.10) / 0.52))
    kout = max(0.0, min(1.0, (t - (dur - leave - idx * 0.04)) / 0.40))
    a = (1 - (1 - kin) ** 4) * (1 - kout ** 2)
    if a <= 0.01:
        return None

    # lit ink: warm white crown falling to solar gold at the baseline, so the
    # type reads as metal catching the key light rather than flat paint
    grad = C.vgrad(layer.size, (255, 253, 246), (255, 206, 116), ease=1.15)
    ink = Image.new("RGBA", layer.size, (255, 255, 255, 255))
    ink.paste(grad, (0, 0))
    ink.putalpha(layer.split()[3])

    # a tight dark halo under each glyph separates it from any backdrop
    halo = layer.copy()
    halo.putalpha(layer.split()[3].filter(ImageFilter.GaussianBlur(9)))
    halo = Image.new("RGBA", layer.size, (4, 8, 24, 255)).convert("RGBA")
    halo.putalpha(layer.split()[3].filter(ImageFilter.GaussianBlur(9))
                  .point(lambda v: int(v * 0.92)))

    # bevel + drop shadow give the type physical thickness
    bev = C.inner_bevel(layer, width=5, light=(255, 255, 255), dark=(150, 92, 10),
                        strength=0.50)
    sh = C.soft_shadow(layer, blur=26, offset=(0, 14), opacity=170)
    out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    out = Image.alpha_composite(out, sh)
    out = Image.alpha_composite(out, halo)
    out = Image.alpha_composite(out, ink)
    out = Image.alpha_composite(out, bev)

    # a specular pass crosses the type once, shortly after it lands
    ks = max(0.0, min(1.0, (t - appear - 0.35) / 0.85))
    if 0.01 < ks < 0.99:
        band = C.specular_band(layer.size, pos=ks, width=110, tilt=0.9, peak=190)
        masked = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        masked.paste(band, (0, 0), layer.split()[3])
        out = Image.alpha_composite(out, Image.composite(
            masked, Image.new("RGBA", layer.size, (0, 0, 0, 0)),
            band.split()[3].point(lambda v: int(v * 0.7))))

    if a < 1:
        out.putalpha(out.split()[3].point(lambda v: int(v * a)))
    return out


# ---------------------------------------------------------------------------
# set pieces
# ---------------------------------------------------------------------------
def build_ring() -> tuple:
    """Gold ring with a bright inner lip and a dark outer edge."""
    x0, y0, x1, y1 = FRAME
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle((x0, y0, x1 - 1, y1 - 1),
                                           radius=RADIUS, fill=255)
    inner = Image.new("L", (W, H), 0)
    ImageDraw.Draw(inner).rounded_rectangle(
        (x0 + RING, y0 + RING, x1 - RING - 1, y1 - RING - 1),
        radius=RADIUS - RING + 6, fill=255)
    ring_mask = ImageChops.subtract(mask, inner)

    gold = C.diag_grad((W, H), (255, 226, 120), (188, 128, 4), angle=118)
    gold_im = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    gold_im.paste(gold, (0, 0))
    gold_im.putalpha(ring_mask)

    bev = C.inner_bevel(mask, width=RING // 2, light=GOLD_HI, dark=(120, 74, 0),
                        strength=0.85)
    bev.putalpha(ImageChops.multiply(bev.split()[3], ring_mask))
    layered = Image.alpha_composite(gold_im, bev)

    shadow = C.soft_shadow(mask, blur=40, offset=(0, 26), opacity=110)
    return layered, shadow, ring_mask


def build_disc() -> tuple:
    """Blue badge: radial-lit sphere with rim light and contact shadow."""
    dr = 112
    size = dr * 2 + 12
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((6, 6, size - 6, size - 6), fill=255)

    body = C.radial((size, size), (size * 0.36, size * 0.30), size * 0.78,
                    BLUE_HI, (0, 18, 58))
    im = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    im.paste(body, (0, 0))
    im.putalpha(mask)

    # rim light along the lower-right
    rim = C.soft_shadow(mask, blur=6, offset=(6, 6), opacity=0)
    rim = Image.new("RGBA", (size, size), (120, 190, 255, 150))
    rm = ImageChops.subtract(mask, mask.transform(mask.size, Image.AFFINE,
                                                  (1, 0, 7, 0, 1, 7)))
    rim.putalpha(rm.filter(ImageFilter.GaussianBlur(3)))

    # text
    f = sans(50, 700)
    lines = wrap_centred("THIS WEEK ONLY!", f, int(dr * 1.55))
    lab = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(lab)
    lh = int(f.size * 1.14)
    yy = (size - lh * len(lines)) / 2
    for ln in lines:
        tw = d.textlength(ln, font=f)
        d.text(((size - tw) / 2, yy), ln, font=f, fill=(255, 255, 255, 255))
        yy += lh

    im = Image.alpha_composite(im, rim)
    im = Image.alpha_composite(im, lab)
    sh = C.soft_shadow(mask, blur=26, offset=(0, 16), opacity=120)
    return im, sh, mask


def build_bar(text) -> tuple:
    """Magenta bar with a sweet gradient, gloss top edge and inner shadow."""
    x0, y0, x1, _ = BAR
    w, h = x1 - x0, H - y0
    mask = Image.new("L", (w, h + 90), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h + 89), radius=56,
                                           fill=255)
    grad = C.vgrad((w, h + 90), (255, 62, 164), (176, 0, 88), ease=1.2)
    im = Image.new("RGBA", (w, h + 90), (255, 255, 255, 255))
    im.paste(grad, (0, 0))
    im.putalpha(mask)

    gloss = Image.new("RGBA", (w, h + 90), (0, 0, 0, 0))
    ImageDraw.Draw(gloss).rounded_rectangle(
        (10, 8, w - 11, 74), radius=34, fill=(255, 255, 255, 46))
    gloss = gloss.filter(ImageFilter.GaussianBlur(9))
    im = Image.alpha_composite(im, Image.composite(
        gloss, Image.new("RGBA", gloss.size, (0, 0, 0, 0)), mask))

    # leave a real gutter on both sides: the sparkle cluster owns the left edge
    gutter = 118
    max_w = w - gutter * 2
    size = 44
    while size > 24:
        f = sans(size, 600)
        lines = wrap_centred(text, f, max_w)
        if len(lines) <= 2:
            break
        size -= 2
    lines = wrap_centred(text, f, max_w)[:2]
    lab = Image.new("RGBA", (w, h + 90), (0, 0, 0, 0))
    d = ImageDraw.Draw(lab)
    lh = int(f.size * 1.30)
    yy = 36
    for ln in lines:
        tw = d.textlength(ln, font=f)
        x = gutter + (max_w - tw) / 2
        d.text((x, yy + 3), ln, font=f, fill=(60, 0, 26, 130))
        d.text((x, yy), ln, font=f, fill=(255, 255, 255, 255))
        yy += lh
    im = Image.alpha_composite(im, lab)
    sh = C.soft_shadow(mask, blur=34, offset=(0, 20), opacity=125)
    return im, sh, mask


def build_glyph(h: int = 224) -> list:
    """Signal arcs that draw themselves on, with a glow pass."""
    w = int(h * 1.02)
    frames = []
    for i in range(14):
        k = i / 13
        ss = 4
        im = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        cx, cy = int(w * ss * 0.02), int(h * ss * 0.94)
        for idx, (r, th) in enumerate(((0.94, 0.155), (0.60, 0.155))):
            kk = max(0.0, min(1.0, k * 1.3 - idx * 0.25))
            if kk <= 0:
                continue
            rr = h * ss * r
            d.arc((cx - rr, cy - rr, cx + rr, cy + rr), start=100,
                  end=100 + 288 * kk, fill=(30, 96, 210, 255),
                  width=int(h * ss * th))
        out = im.resize((w, h), Image.LANCZOS)
        bb = out.getbbox()
        out = out.crop(bb) if bb else out
        frames.append(out)
    return frames


def build_sparkles() -> list:
    """Sparkle cluster with a soft additive glow, cycled for twinkle."""
    out = []
    for i in range(12):
        ph = i / 12 * math.tau
        lay = Image.new("RGBA", (240, 240), (0, 0, 0, 0))
        for j, (size, ox, oy) in enumerate(((96, 4, 6), (58, 66, 78),
                                            (40, 8, 120), (26, 104, 22))):
            k = 0.80 + 0.20 * math.sin(ph + j * 1.6)
            s = int(size * k)
            sp = _star(s, (255, 214, 96))
            glow = _star(int(s * 1.7), (255, 186, 40))
            glow = glow.filter(ImageFilter.GaussianBlur(s * 0.20))
            lay.alpha_composite(glow, (ox - int(s * 0.35), oy - int(s * 0.35)))
            lay.alpha_composite(sp, (ox, oy))
        out.append(lay)
    return out


def _star(size, colour) -> Image.Image:
    k = 4
    R = size * k * 0.5
    im = Image.new("RGBA", (size * k, size * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = cy = size * k / 2
    tips = [(cx, cy - R), (cx + R, cy), (cx, cy + R), (cx - R, cy)]
    for i in range(4):
        a, b = tips[i], tips[(i + 1) % 4]
        ang = math.radians(45 + 90 * i)
        c = (cx + math.cos(ang) * R * 0.15, cy + math.sin(ang) * R * 0.15)
        pts = []
        for j in range(13):
            u = j / 12
            pts.append(((1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u ** 2 * b[0],
                        (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u ** 2 * b[1]))
        d.polygon(pts, fill=colour + (255,))
    return im.resize((size, size), Image.LANCZOS)


# ---------------------------------------------------------------------------
# background: graded photography, not a white wash
# ---------------------------------------------------------------------------
def grade_background(src: Image.Image, seed: int = 0) -> tuple:
    """Turn a still into a cinematic backdrop + its depth layers."""
    img = src.convert("RGB").resize((W, H), Image.LANCZOS)
    img = img.filter(ImageFilter.GaussianBlur(11))

    # duotone: pull toward deep navy in the shadows, warm cream in the lights
    g = img.convert("L")
    shadow = Image.new("RGB", (W, H), (10, 18, 46))
    light = Image.new("RGB", (W, H), (255, 238, 214))
    duo = Image.composite(light, shadow, g)
    img = Image.blend(img, duo, 0.42)
    img = ImageEnhance.Color(img).enhance(1.34)
    img = ImageEnhance.Contrast(img).enhance(1.12)

    # darken the top so the headline always sits on shadow, brighten the middle
    curtain = Image.new("L", (W, H), 0)
    dc = ImageDraw.Draw(curtain)
    for y in range(H):
        if y < 60:
            a = 168
        elif y < 700:
            a = int(168 - 88 * (y - 60) / 640)
        elif y < 860:
            a = int(80 - 44 * (y - 700) / 160)
        elif y > 1660:
            a = int(60 * (y - 1660) / 260)
        else:
            a = 26
        dc.line([(0, y), (W, y)], fill=max(0, a))
    curtain = curtain.filter(ImageFilter.GaussianBlur(26))
    dark = Image.new("RGB", (W, H), (6, 10, 30))
    img = Image.composite(dark, img, curtain)

    rays = C.volumetric_rays((W, H), seed=seed)
    img = Image.alpha_composite(img.convert("RGBA"), rays).convert("RGB")
    img = Image.alpha_composite(img.convert("RGBA"),
                                C.bokeh_field((W, H), seed=seed + 3)).convert("RGB")
    return img


# ---------------------------------------------------------------------------
# the card
# ---------------------------------------------------------------------------
class Card:
    """Prebuilt plates for one card, so per-frame work stays cheap."""

    def __init__(self, spec, dur, seed=0):
        self.dur = dur
        self.headline_text = spec["headline"]
        self.bar_text = spec["bar"]

        bg_src = Image.open(spec["bg"]).convert("RGB")
        self.bg = grade_background(bg_src, seed).resize((int(W * 1.18), int(H * 1.18)),
                                                        Image.LANCZOS)

        fw = FRAME[2] - FRAME[0] - RING * 2
        fh = FRAME[3] - FRAME[1] - RING * 2
        inner_src = Image.open(spec["inner"]).convert("RGB")
        inner = _cover(inner_src, (int(fw * 1.22), int(fh * 1.22)))
        inner = ImageEnhance.Color(inner).enhance(1.10)
        inner = ImageEnhance.Contrast(inner).enhance(1.06)
        self.inner = inner
        self.inner_mask = _rmask((fw, fh), RADIUS - RING + 8)

        self.ring, self.ring_shadow, self.ring_mask = build_ring()
        self.disc, self.disc_shadow, self.disc_mask = build_disc()
        self.bar, self.bar_shadow, self.bar_mask = build_bar(self.bar_text)
        self.glyph = build_glyph()
        self.sparkles = build_sparkles()
        self.f, self.headlines = headline_layers(self.headline_text)
        self.dots = _dots()

    # ---------------------------------------------------------------- paint
    def paint(self, t: float, animate=True) -> Image.Image:
        d = max(0.4, self.dur)
        k = max(0.0, min(1.0, t / d))

        # --- backdrop: slow parallax push
        bw, bh = self.bg.size
        bz = 1.0 + (0.10 * k if animate else 0.0)
        cw, ch = int(W * bz), int(H * bz)
        bx, by = (bw - cw) // 2, (bh - ch) // 2
        out = self.bg.crop((bx, by, bx + cw, by + ch)).resize((W, H), Image.BICUBIC)
        out = out.convert("RGBA")

        # --- inner footage: ken burns + a light sweep across the subject
        fw = FRAME[2] - FRAME[0] - RING * 2
        fh = FRAME[3] - FRAME[1] - RING * 2
        direction = 1 if int(d) % 2 else -1
        prog = k if direction > 0 else 1 - k
        zoom = 1.0 + (0.10 * k if animate else 0.0)
        z = 1.0 + (0.09 * k if animate else 0.0)
        cw2 = int(fw * (1.14 + 0.08 * prog) * z)
        ch2 = int(fh * (1.14 + 0.08 * prog) * z)
        iw, ih = self.inner.size
        cw2, ch2 = min(cw2, iw), min(ch2, ih)
        span_x, span_y = max(0, iw - cw2), max(0, ih - ch2)
        ix = int(span_x * (0.10 + 0.80 * prog))
        iy = int(span_y * (0.5 + 0.28 * math.sin(k * math.pi + direction)))
        tile = self.inner.crop((ix, iy, ix + cw2, iy + ch2))
        tile = tile.resize((fw, fh), Image.LANCZOS).convert("RGBA")
        # travelling highlight inside the frame
        sw = max(0.0, min(1.0, (t - 0.6) / 1.7)) if animate else 2.0
        if 0.02 < sw < 0.98:
            band = C.specular_band((fw, fh), pos=sw, width=150, tilt=0.55, peak=95)
            tile = Image.alpha_composite(tile, band)
        out.paste(tile, (FRAME[0] + RING, FRAME[1] + RING), self.inner_mask)

        # --- ring: shadow, gold body, travelling sheen
        out = Image.alpha_composite(out, self.ring_shadow)
        out = Image.alpha_composite(out, self.ring)
        if animate and 0.10 < k < 0.96:
            sh = C.specular_band((W, H), pos=(k - 0.1) / 0.86, width=170,
                                 tilt=0.35, peak=150)
            sheen = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            sheen.paste(sh, (0, 0), self.ring_mask)
            out = Image.alpha_composite(out, Image.composite(
                sheen, Image.new("RGBA", (W, H), (0, 0, 0, 0)),
                sh.split()[3].point(lambda v: int(v * 0.55))))

        # --- glyph
        gk = max(0.0, min(1.0, (t - 0.20) / 0.70)) if animate else 1.0
        gi = min(len(self.glyph) - 1, max(0, int(round(gk * (len(self.glyph) - 1)))))
        g = self.glyph[gi]
        if 0 < gk < 1:
            g = g.copy()
            g.putalpha(g.split()[3].point(lambda v: int(v * min(1, gk * 1.8))))
        gpos = (FRAME[2] - int(g.width * 0.58), FRAME[1] - int(g.height * 0.28))
        out = _over(out, g, gpos)

        # --- disc: spring in, then breathe
        sk = 1.0
        if animate:
            p = max(0.0, min(1.0, (t - 0.32) / 0.58))
            sk = 1 + 1.55 * (p - 1) ** 3 + 1.55 * (p - 1) ** 2
        if sk > 0.03:
            sc = 0.62 + 0.38 * sk
            dw, dh = int(self.disc.width * sc), int(self.disc.height * sc)
            disc = self.disc.resize((dw, dh), Image.BICUBIC)
            shadow = self.disc_shadow.resize((dw, dh), Image.BICUBIC)
            cx = FRAME[0] + 120 - dw // 2
            cy = FRAME[1] + 336 - dh // 2 + int(4 * math.sin(t * 1.7))
            out.alpha_composite(shadow, (cx, cy))
            out.alpha_composite(disc, (cx, cy))

        # --- bar: slides up, holds, leaves
        if animate:
            p = max(0.0, min(1.0, (t - 0.40) / 0.62))
            bk = 1 + 1.9 * (p - 1) ** 3 + 1.9 * (p - 1) ** 2
            q = max(0.0, min(1.0, (t - (d - 0.72)) / 0.45))
            off = int((1 - bk) * 300 + (q ** 2) * 340)
        else:
            off = 0
        bx0, by0, _, _ = BAR
        out.alpha_composite(self.bar_shadow, (bx0, by0 + off))
        out.alpha_composite(self.bar, (bx0, by0 + off))

        # --- sparkles twinkle over the bar's edge
        sp = self.sparkles[int((t * 6) % len(self.sparkles))]
        out.alpha_composite(sp, (bx0 - 52, by0 + off + 2))

        # --- three dots: the template's signature, now with a lit gradient
        for d_i, cell in enumerate(self.dots):
            p = max(0.0, min(1.0, (t - 0.06 - d_i * 0.07) / 0.42)) if animate else 1.0
            if p <= 0.02:
                continue
            e = 1 + 2.0 * (p - 1) ** 3 + 1.4 * (p - 1) ** 2
            sc = 0.45 + 0.55 * e
            nw, nh = max(1, int(cell.width * sc)), max(1, int(cell.height * sc))
            dot = cell.resize((nw, nh), Image.BICUBIC)
            cx = W // 2 + (d_i - 1) * 56 - nw // 2
            cy = 176 + int(4 * math.sin(t * 1.5 + d_i * 0.9))
            out = _over(out, dot, (cx, cy))

        # --- headline: the hero, on its own scrim so it never fights the plate
        n = len(self.headlines)
        total_h = sum(h.height for h in self.headlines) + 10 * (n - 1)
        bottom = FRAME[1] - 96
        y = bottom - total_h
        pad = 62
        hk = max(0.0, min(1.0, (t - 0.05) / 0.55)) if animate else 1.0
        plate = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        pd = ImageDraw.Draw(plate)
        top, bot = y - pad, y + total_h + pad
        for yy in range(max(0, top), min(H, bot)):
            # solid in the middle of the block, feathered at both ends
            e = min(1.0, min(yy - top, bot - yy) / 70.0)
            a = int(206 * e * hk)
            pd.line([(0, yy), (W, yy)], fill=(4, 7, 22, a))
        # widen it into a soft horizontal falloff
        plate = plate.filter(ImageFilter.GaussianBlur(34))
        out.alpha_composite(plate)
        # a second, tighter pass right under the letters for hard contrast
        core = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(core).rounded_rectangle(
            (150, y - 30, W - 150, y + total_h + 26), radius=60,
            fill=(3, 5, 18, int(120 * hk)))
        core = core.filter(ImageFilter.GaussianBlur(26))
        out.alpha_composite(core)
        for i, lay in enumerate(self.headlines):
            painted = paint_headline(lay, t, i, appear=0.12, leave=0.95, dur=d)
            if painted is None:
                continue
            float_y = int(2.2 * math.sin(t * 1.2 + i * 0.7))
            out.alpha_composite(painted, (int((W - painted.width) / 2), y + float_y))
            y += lay.height + 10
        return out.convert("RGB")


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------
def _dots() -> list:
    """One lit magenta dot per cell: radial body plus a specular pin-light."""
    out = []
    d = 30
    size = d + 14
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((7, 7, size - 7, size - 7), fill=255)
    body = C.radial((size, size), (size * 0.38, size * 0.34), size * 0.72,
                    (255, 96, 182), (156, 0, 78))
    im = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    im.paste(body, (0, 0))
    im.putalpha(mask)
    spec = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(spec).ellipse((size * 0.32, size * 0.28, size * 0.52, size * 0.44),
                                 fill=(255, 236, 246, 190))
    spec = spec.filter(ImageFilter.GaussianBlur(2.5))
    im = Image.alpha_composite(im, spec)
    out.append(im)
    return out * 3 if False else [im, im, im]


def _cover(img, size):
    tw, th = size
    sw, sh = img.size
    s = max(tw / sw, th / sh)
    r = img.resize((max(1, int(sw * s)), max(1, int(sh * s))), Image.LANCZOS)
    x, y = (r.width - tw) // 2, (r.height - th) // 2
    return r.crop((x, y, x + tw, y + th))


def _rmask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1),
                                        radius=radius, fill=255)
    return m


def _over(base: Image.Image, layer: Image.Image, pos) -> Image.Image:
    """Draw `layer` at `pos` with an additive bloom halo behind it."""
    glow = layer.copy().filter(ImageFilter.GaussianBlur(18))
    glow = Image.eval(glow, lambda v: min(255, int(v * 1.6)))
    base = base.copy()
    base.alpha_composite(glow, pos)
    base.alpha_composite(layer, pos)
    return base
