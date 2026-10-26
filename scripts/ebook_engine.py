#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Exact vector & typographic layout engine modeled 1:1 on `company book.pdf`.

Reproduces the exact A4 canvas (595.5 x 842.25 pt), fonts (Lilita One + Poppins),
color palette (#010A83, #002C86, #FF331E, #FF4D3B, #F8F7F1, #FFF9F2, #FFF9F9, #1C0000),
and geometric primitives (4-petal pinwheels, 2x2 circle clusters, skewed rounded
cards, arch-masked photographs, white-ringed circular portraits, coral pill
dividers, and vector icon badges) of `company book.pdf`.
"""

import math
import os
import hashlib
from PIL import Image, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

W = 595.50
H = 842.25
KAPPA = 0.5522847498307936

# Exact color tokens extracted from `company book.pdf`
WHITE = "#FFFFFF"
BLUSH = "#FFF9F9"
CREAM_SHAPE = "#F8F7F1"
ROYAL_DARK = "#010A83"
ROYAL_MID = "#002C86"
INDIGO_MUTE = "#3E4194"
CORAL_CARD = "#FF331E"
CORAL_ACCENT = "#FF4D3B"
LIGHT_PILL = "#ECEEEF"
CREAM_TEXT = "#FFF9F2"
CREAM_WARM = "#FFF4E8"
INK_DARK = "#1C0000"

CACHE_DIR = "/tmp/joseph_ebook_crop_cache"
os.makedirs(CACHE_DIR, exist_ok=True)


def Y(top_y: float) -> float:
    """Convert top-down y coordinate (0 at top) to ReportLab bottom-up y."""
    return H - top_y


def register_ebook_fonts(font_dir: str) -> None:
    pdfmetrics.registerFont(TTFont("LilitaOne", os.path.join(font_dir, "LilitaOne-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins", os.path.join(font_dir, "Poppins-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-Italic", os.path.join(font_dir, "Poppins-Italic.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-Medium", os.path.join(font_dir, "Poppins-Medium.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-SemiBold", os.path.join(font_dir, "Poppins-SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-SemiBoldItalic", os.path.join(font_dir, "Poppins-SemiBoldItalic.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-Bold", os.path.join(font_dir, "Poppins-Bold.ttf")))

    pdfmetrics.registerFontFamily(
        "Poppins",
        normal="Poppins",
        bold="Poppins-Bold",
        italic="Poppins-Italic",
        boldItalic="Poppins-SemiBoldItalic",
    )


def fill_page(c: canvas.Canvas, hex_color: str = WHITE) -> None:
    c.saveState()
    c.setFillColor(HexColor(hex_color))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()


def draw_circle(c: canvas.Canvas, cx: float, cy_top: float, r: float, fill_hex: str) -> None:
    c.saveState()
    c.setFillColor(HexColor(fill_hex))
    c.circle(cx, Y(cy_top), r, stroke=0, fill=1)
    c.restoreState()


def draw_circle_grid_2x2(c: canvas.Canvas, x: float, y_top: float, total_size: float, fill_hex: str) -> None:
    """Draw a 2x2 tangent solid circle cluster inside (x, y_top, total_size, total_size)."""
    r = total_size / 4.0
    c.saveState()
    c.setFillColor(HexColor(fill_hex))
    for row in range(2):
        for col in range(2):
            cx = x + r + col * (2 * r)
            cy = y_top + r + row * (2 * r)
            c.circle(cx, Y(cy), r, stroke=0, fill=1)
    c.restoreState()


def draw_pinwheel(c: canvas.Canvas, x: float, y_top: float, total_size: float, fill_hex: str) -> None:
    """Draw the exact 4-petal rotational quarter-circle pinwheel from `company book.pdf`."""
    r = total_size / 2.0
    cx = x + r
    cy = y_top + r
    c.saveState()
    c.setFillColor(HexColor(fill_hex))

    # Top-left quadrant: wedge centered at (cx, y_top), sweeping West (180) to South (270)
    c.wedge(cx - r, Y(y_top + r), cx + r, Y(y_top - r), 180, 90, stroke=0, fill=1)

    # Top-right quadrant: wedge centered at (x + 2r, cy), sweeping North (90) to West (180)
    c.wedge(x + r, Y(cy + r), x + 3 * r, Y(cy - r), 90, 90, stroke=0, fill=1)

    # Bottom-right quadrant: wedge centered at (cx, y_top + 2r), sweeping East (0) to North (90)
    c.wedge(cx - r, Y(y_top + 3 * r), cx + r, Y(y_top + r), 0, 90, stroke=0, fill=1)

    # Bottom-left quadrant: wedge centered at (x, cy), sweeping South (270) to East (360)
    c.wedge(x - r, Y(cy + r), x + r, Y(cy - r), 270, 90, stroke=0, fill=1)

    c.restoreState()


def draw_totem_strip(c: canvas.Canvas, x: float, y_top: float, size: float, pairs: int = 4) -> None:
    """Vertical alternating 2x2 coral circles + royal-blue 4-petal pinwheel strip (Pages 6 & 10)."""
    cur_y = y_top
    for _ in range(pairs):
        draw_circle_grid_2x2(c, x, cur_y, size, CORAL_ACCENT)
        cur_y += size
        draw_pinwheel(c, x, cur_y, size, ROYAL_DARK)
        cur_y += size


def build_rounded_path(c: canvas.Canvas, x: float, y_top: float, w: float, h: float, radii=(0, 0, 0, 0)):
    """Build a clockwise vector path with independent corner radii (tl, tr, br, bl) in top-down space."""
    rtl, rtr, rbr, rbl = [float(r) for r in radii]
    # Clamp radii safely
    max_r = min(w, h)
    rtl = min(rtl, max_r)
    rtr = min(rtr, max_r)
    rbr = min(rbr, max_r)
    rbl = min(rbl, max_r)

    # Prevent adjacent corner sum overflow
    if rtl + rtr > w:
        scale = w / (rtl + rtr)
        rtl *= scale
        rtr *= scale
    if rbl + rbr > w:
        scale = w / (rbl + rbr)
        rbl *= scale
        rbr *= scale
    if rtl + rbl > h:
        scale = h / (rtl + rbl)
        rtl *= scale
        rbl *= scale
    if rtr + rbr > h:
        scale = h / (rtr + rbr)
        rtr *= scale
        rbr *= scale

    p = c.beginPath()
    # Start top edge after top-left corner
    p.moveTo(x + rtl, Y(y_top))
    p.lineTo(x + w - rtr, Y(y_top))
    if rtr > 0:
        p.curveTo(
            x + w - rtr + KAPPA * rtr, Y(y_top),
            x + w, Y(y_top + rtr - KAPPA * rtr),
            x + w, Y(y_top + rtr),
        )
    p.lineTo(x + w, Y(y_top + h - rbr))
    if rbr > 0:
        p.curveTo(
            x + w, Y(y_top + h - rbr + KAPPA * rbr),
            x + w - rbr + KAPPA * rbr, Y(y_top + h),
            x + w - rbr, Y(y_top + h),
        )
    p.lineTo(x + rbl, Y(y_top + h))
    if rbl > 0:
        p.curveTo(
            x + rbl - KAPPA * rbl, Y(y_top + h),
            x, Y(y_top + h - rbl + KAPPA * rbl),
            x, Y(y_top + h - rbl),
        )
    p.lineTo(x, Y(y_top + rtl))
    if rtl > 0:
        p.curveTo(
            x, Y(y_top + rtl - KAPPA * rtl),
            x + rtl - KAPPA * rtl, Y(y_top),
            x + rtl, Y(y_top),
        )
    p.close()
    return p


def draw_rounded_box(
    c: canvas.Canvas,
    x: float,
    y_top: float,
    w: float,
    h: float,
    radii=(0, 0, 0, 0),
    fill_hex: str = None,
    stroke_hex: str = None,
    stroke_w: float = 1.0,
) -> None:
    c.saveState()
    p = build_rounded_path(c, x, y_top, w, h, radii)
    do_fill = 1 if fill_hex else 0
    do_stroke = 1 if stroke_hex else 0
    if fill_hex:
        c.setFillColor(HexColor(fill_hex))
    if stroke_hex:
        c.setStrokeColor(HexColor(stroke_hex))
        c.setLineWidth(stroke_w)
    c.drawPath(p, stroke=do_stroke, fill=do_fill)
    c.restoreState()


def draw_skewed_card(
    c: canvas.Canvas,
    x: float,
    y_top: float,
    w: float,
    h: float,
    radius: float,
    lean_right_deg: float,
    fill_hex: str,
) -> None:
    """Draw a rounded parallelogram card leaning right at top (matching Pages 1 & 2 of `company book.pdf`)."""
    c.saveState()
    c.setFillColor(HexColor(fill_hex))
    # Bottom-left corner at (x, Y(y_top + h)), shear +x as +y increases (towards top of page)
    tan_a = math.tan(math.radians(lean_right_deg))
    c.translate(x, Y(y_top + h))
    c.transform(1, 0, tan_a, 1, 0, 0)
    c.roundRect(0, 0, w, h, radius, stroke=0, fill=1)
    c.restoreState()


def _prepare_cropped_image(img_path: str, w_pt: float, h_pt: float, focus=(0.5, 0.3)) -> str:
    """Crop image cleanly to target aspect ratio at ~200 DPI and cache on /tmp (invalidated on mtime)."""
    mtime = os.path.getmtime(img_path)
    key = f"{os.path.abspath(img_path)}_{mtime:.3f}_{w_pt:.1f}_{h_pt:.1f}_{focus[0]:.2f}_{focus[1]:.2f}"
    digest = hashlib.md5(key.encode("utf-8")).hexdigest()[:14]
    out_path = os.path.join(CACHE_DIR, f"crop_{digest}.jpg")
    if not os.path.exists(out_path):
        im = Image.open(img_path).convert("RGB")
        scale = 2.6  # ~187-200 DPI crisp print quality with compact PDF size
        tw = max(120, int(round(w_pt * scale)))
        th = max(120, int(round(h_pt * scale)))
        fitted = ImageOps.fit(im, (tw, th), method=Image.Resampling.LANCZOS, centering=focus)
        fitted.save(out_path, "JPEG", quality=91, optimize=True)
    return out_path


def draw_clipped_photo(
    c: canvas.Canvas,
    img_path: str,
    x: float,
    y_top: float,
    w: float,
    h: float,
    radii=(0, 0, 0, 0),
    focus=(0.5, 0.3),
) -> None:
    cropped = _prepare_cropped_image(img_path, w, h, focus=focus)
    c.saveState()
    p = build_rounded_path(c, x, y_top, w, h, radii)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(cropped, x, Y(y_top + h), width=w, height=h, mask=None)
    c.restoreState()


def draw_circular_portrait(
    c: canvas.Canvas,
    img_path: str,
    cx: float,
    cy_top: float,
    r: float,
    ring_hex: str = CREAM_SHAPE,
    ring_w: float = 5.5,
    focus=(0.5, 0.25),
) -> None:
    cropped = _prepare_cropped_image(img_path, 2 * r, 2 * r, focus=focus)
    c.saveState()
    p = c.beginPath()
    p.circle(cx, Y(cy_top), r)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(cropped, cx - r, Y(cy_top + r), width=2 * r, height=2 * r, mask=None)
    c.restoreState()

    if ring_w > 0:
        c.saveState()
        c.setStrokeColor(HexColor(ring_hex))
        c.setLineWidth(ring_w)
        c.circle(cx, Y(cy_top), r, stroke=1, fill=0)
        c.restoreState()


def draw_display_lines(
    c: canvas.Canvas,
    lines,
    x: float,
    y_top_first_baseline: float,
    font_name: str = "LilitaOne",
    size: float = 52.0,
    line_step: float = 48.0,
    align: str = "left",
) -> None:
    """Draw multi-line display titles where each item is (text, hex_color) or (text, hex_color, custom_size)."""
    c.saveState()
    cur_y = y_top_first_baseline
    for item in lines:
        if len(item) == 3:
            txt, col, sz = item
        else:
            txt, col = item
            sz = size
        c.setFont(font_name, sz)
        c.setFillColor(HexColor(col))
        if align == "right":
            c.drawRightString(x, Y(cur_y), txt)
        elif align == "center":
            c.drawCentredString(x, Y(cur_y), txt)
        else:
            c.drawString(x, Y(cur_y), txt)
        cur_y += line_step
    c.restoreState()


def make_style(
    name: str,
    font: str = "Poppins",
    size: float = 11.2,
    leading: float = 16.8,
    color: str = INK_DARK,
    align: int = TA_LEFT,
    space_after: float = 7.0,
) -> ParagraphStyle:
    return ParagraphStyle(
        name=name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=HexColor(color),
        alignment=align,
        spaceAfter=space_after,
    )


def draw_paragraphs_box(
    c: canvas.Canvas,
    items,
    x: float,
    y_top: float,
    w: float,
    max_h: float,
    label: str = "box",
) -> float:
    """Render a list of (html_text, ParagraphStyle) inside (x, y_top, w, max_h) with strict overflow check."""
    cur_y = y_top
    total_used = 0.0
    for idx, (html_text, style) in enumerate(items):
        para = Paragraph(html_text, style)
        pw, ph = para.wrap(w, max_h + 500)
        para.drawOn(c, x, Y(cur_y + ph))
        step = ph + (style.spaceAfter if idx < len(items) - 1 else 0.0)
        cur_y += step
        total_used += step
    if total_used > max_h + 1.5:
        raise ValueError(
            f"TEXT OVERFLOW in [{label}]: used {total_used:.1f}pt > max {max_h:.1f}pt (by {total_used - max_h:.1f}pt)"
        )
    return total_used


def draw_vector_icon(c: canvas.Canvas, kind: str, cx: float, cy_top: float, size: float, hex_color: str = CREAM_TEXT) -> None:
    """Draw crisp geometric line/solid icons inside Page 8 & Page 10 icon badges."""
    c.saveState()
    col = HexColor(hex_color)
    c.setStrokeColor(col)
    c.setFillColor(col)
    c.setLineWidth(2.0)
    c.setLineCap(1)
    c.setLineJoin(1)
    cy = Y(cy_top)
    s = size * 0.5

    if kind == "eye":
        # Prophetic Sight eye + pupil
        p = c.beginPath()
        p.moveTo(cx - s, cy)
        p.curveTo(cx - s * 0.45, cy + s * 0.72, cx + s * 0.45, cy + s * 0.72, cx + s, cy)
        p.curveTo(cx + s * 0.45, cy - s * 0.72, cx - s * 0.45, cy - s * 0.72, cx - s, cy)
        p.close()
        c.drawPath(p, stroke=1, fill=0)
        c.circle(cx, cy, s * 0.28, stroke=0, fill=1)

    elif kind == "shield":
        # Shield + cross (matching Page 8 top-right icon!)
        p = c.beginPath()
        p.moveTo(cx, cy + s * 0.95)
        p.lineTo(cx + s * 0.82, cy + s * 0.62)
        p.curveTo(cx + s * 0.82, cy - s * 0.18, cx + s * 0.42, cy - s * 0.68, cx, cy - s * 0.95)
        p.curveTo(cx - s * 0.42, cy - s * 0.68, cx - s * 0.82, cy - s * 0.18, cx - s * 0.82, cy + s * 0.62)
        p.close()
        c.drawPath(p, stroke=1, fill=0)
        c.setLineWidth(2.4)
        c.line(cx, cy + s * 0.35, cx, cy - s * 0.35)
        c.line(cx - s * 0.35, cy, cx + s * 0.35, cy)

    elif kind == "book":
        # Open Scripture / Scroll
        c.roundRect(cx - s * 0.9, cy - s * 0.65, s * 1.8, s * 1.3, 3, stroke=1, fill=0)
        c.line(cx, cy - s * 0.65, cx, cy + s * 0.65)
        for dy in (0.3, 0.0, -0.3):
            c.line(cx - s * 0.65, cy + s * dy, cx - s * 0.2, cy + s * dy)
            c.line(cx + s * 0.2, cy + s * dy, cx + s * 0.65, cy + s * dy)

    elif kind == "growth":
        # Rising bars + upward arrow (matching Page 8 mid-left icon!)
        bw = s * 0.32
        c.rect(cx - s * 0.78, cy - s * 0.75, bw, s * 0.48, stroke=0, fill=1)
        c.rect(cx - s * 0.22, cy - s * 0.75, bw, s * 0.78, stroke=0, fill=1)
        c.rect(cx + s * 0.34, cy - s * 0.75, bw, s * 1.10, stroke=0, fill=1)
        c.line(cx - s * 0.75, cy - s * 0.05, cx + s * 0.55, cy + s * 0.78)
        c.line(cx + s * 0.22, cy + s * 0.78, cx + s * 0.55, cy + s * 0.78)
        c.line(cx + s * 0.55, cy + s * 0.45, cx + s * 0.55, cy + s * 0.78)

    elif kind == "compass":
        # Concentric timing / governance dial (matching Page 8 mid-right icon!)
        c.circle(cx, cy, s * 0.92, stroke=1, fill=0)
        c.setLineWidth(1.4)
        c.circle(cx, cy, s * 0.62, stroke=1, fill=0)
        c.setLineWidth(2.0)
        c.line(cx, cy, cx, cy + s * 0.42)
        c.line(cx, cy, cx + s * 0.34, cy - s * 0.18)

    elif kind == "crown":
        # Royal signet / stars crown (matching Page 8 bottom-left icon!)
        p = c.beginPath()
        p.moveTo(cx - s * 0.82, cy - s * 0.45)
        p.lineTo(cx - s * 0.88, cy + s * 0.32)
        p.lineTo(cx - s * 0.38, cy - s * 0.05)
        p.lineTo(cx, cy + s * 0.58)
        p.lineTo(cx + s * 0.38, cy - s * 0.05)
        p.lineTo(cx + s * 0.88, cy + s * 0.32)
        p.lineTo(cx + s * 0.82, cy - s * 0.45)
        p.close()
        c.drawPath(p, stroke=1, fill=1)
        c.line(cx - s * 0.82, cy - s * 0.72, cx + s * 0.82, cy - s * 0.72)

    elif kind == "people":
        # Three figures community (matching Page 8 bottom-right icon!)
        c.circle(cx, cy + s * 0.38, s * 0.26, stroke=0, fill=1)
        p = c.beginPath()
        p.moveTo(cx - s * 0.45, cy - s * 0.72)
        p.curveTo(cx - s * 0.45, cy - s * 0.05, cx + s * 0.45, cy - s * 0.05, cx + s * 0.45, cy - s * 0.72)
        p.close()
        c.drawPath(p, stroke=0, fill=1)
        for dx in (-0.58, 0.58):
            c.circle(cx + s * dx, cy + s * 0.25, s * 0.20, stroke=0, fill=1)
            p2 = c.beginPath()
            p2.moveTo(cx + s * (dx - 0.32), cy - s * 0.72)
            p2.curveTo(cx + s * (dx - 0.32), cy - s * 0.18, cx + s * (dx + 0.32), cy - s * 0.18, cx + s * (dx + 0.32), cy - s * 0.72)
            p2.close()
            c.drawPath(p2, stroke=0, fill=1)

    elif kind == "globe":
        c.circle(cx, cy, s * 0.88, stroke=1, fill=0)
        c.ellipse(cx - s * 0.44, cy - s * 0.88, cx + s * 0.44, cy + s * 0.88, stroke=1, fill=0)
        c.line(cx - s * 0.88, cy, cx + s * 0.88, cy)
        c.line(cx - s * 0.76, cy + s * 0.42, cx + s * 0.76, cy + s * 0.42)
        c.line(cx - s * 0.76, cy - s * 0.42, cx + s * 0.76, cy - s * 0.42)

    elif kind == "phone":
        p = c.beginPath()
        p.moveTo(cx - s * 0.55, cy + s * 0.65)
        p.curveTo(cx - s * 0.75, cy + s * 0.15, cx - s * 0.15, cy - s * 0.75, cx + s * 0.65, cy - s * 0.55)
        p.lineTo(cx + s * 0.75, cy - s * 0.22)
        p.lineTo(cx + s * 0.35, cy - s * 0.05)
        p.lineTo(cx + s * 0.18, cy - s * 0.25)
        p.curveTo(cx - s * 0.08, cy - s * 0.12, cx - s * 0.12, cy - s * 0.08, cx - s * 0.25, cy + s * 0.18)
        p.lineTo(cx - s * 0.05, cy + s * 0.35)
        p.lineTo(cx - s * 0.22, cy + s * 0.75)
        p.close()
        c.drawPath(p, stroke=0, fill=1)

    elif kind == "mail":
        c.roundRect(cx - s * 0.88, cy - s * 0.58, s * 1.76, s * 1.16, 2.5, stroke=0, fill=1)
        c.setStrokeColor(HexColor(CORAL_CARD))
        c.setLineWidth(2.0)
        c.line(cx - s * 0.82, cy + s * 0.52, cx, cy - s * 0.12)
        c.line(cx + s * 0.82, cy + s * 0.52, cx, cy - s * 0.12)

    elif kind == "pin":
        p = c.beginPath()
        p.moveTo(cx, cy - s * 0.95)
        p.curveTo(cx + s * 0.68, cy - s * 0.22, cx + s * 0.72, cy + s * 0.2, cx + s * 0.72, cy + s * 0.32)
        p.curveTo(cx + s * 0.72, cy + s * 0.76, cx + s * 0.38, cy + s * 0.98, cx, cy + s * 0.98)
        p.curveTo(cx - s * 0.38, cy + s * 0.98, cx - s * 0.72, cy + s * 0.76, cx - s * 0.72, cy + s * 0.32)
        p.curveTo(cx - s * 0.72, cy + s * 0.2, cx - s * 0.68, cy - s * 0.22, cx, cy - s * 0.95)
        p.close()
        c.drawPath(p, stroke=0, fill=1)
        c.setFillColor(HexColor(ROYAL_DARK))
        c.circle(cx, cy + s * 0.30, s * 0.28, stroke=0, fill=1)

    c.restoreState()


def draw_subtle_page_tag(c: canvas.Canvas, page_num: int, dark_bg: bool = False) -> None:
    """Subtle editorial page indicator & brand mark in bottom margin that never intrudes on layout."""
    c.saveState()
    col = HexColor("#9BA6C8" if dark_bg else "#9A9FA8")
    c.setFillColor(col)
    c.setFont("Poppins-Medium", 7.8)
    c.drawString(42, 16, "CHRISCO YOUTH AFLAME  •  CHRISCO FELLOWSHIP OF CHURCHES")
    c.setFont("Poppins-Bold", 8.2)
    c.drawRightString(W - 42, 16, f"{page_num:02d}")
    c.restoreState()
