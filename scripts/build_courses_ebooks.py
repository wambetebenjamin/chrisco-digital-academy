#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build all 19 CHRISCO Digital Academy / CHRISCO Youth Aflame Course E-Books (`public/books/<slug>.pdf`)
replicating the exact layout, Montserrat typography, cobalt-indigo split panels, cyan-lime ribbons,
3D frosted-glass section dividers, lavender tables, and card systems of `COURSES PDF.pdf`.

Rules enforced across every book:
- Brand: CHRISCO Youth Aflame (CHRISCO Digital Academy) under CHRISCO FELLOWSHIP OF CHURCHES.
- Contacts: Gmail only (chriscoyouthaflame2025@gmail.com & shambetz@gmail.com) — ZERO phone numbers.
- Photos: 100% real, non-AI, watermark-free Pexels photographs of modestly dressed African learners & practitioners.
"""

import hashlib
import os
import re
import sys
from xml.sax.saxutils import escape

from PIL import Image, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, SCRIPT_DIR)

from books_content import BOOKS as NEW_BOOKS
from books_content_original import BOOKS as ORIG_BOOKS

ASSET_DIR = os.path.join(SCRIPT_DIR, "courses_ebook_assets")
FONT_DIR = os.path.join(ASSET_DIR, "fonts")
GRAPHICS_DIR = os.path.join(ASSET_DIR, "graphics")
IMAGES_DIR = os.path.join(ASSET_DIR, "images")
OUT_DIR = os.path.join(REPO_ROOT, "public", "books")
CACHE_DIR = "/tmp/chrisco_courses_pdf_cache"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(CACHE_DIR, exist_ok=True)

W = 595.5
H = 842.2

# Exact palette from COURSES PDF.pdf
COBALT_HEAD = "#313FB3"
COBALT_DEEP = "#152888"
COBALT_PANEL = "#1D2EA8"
LAVENDER_TH = "#D0D3FF"
LAVENDER_CARD = "#EEF0FF"
GRAY_CARD = "#F3F4F8"
CYAN_ACCENT = "#25D0C6"
LIME_ACCENT = "#7CE393"
GOLD_RULE = "#F2C94C"
INK = "#111629"
MUTED = "#4B5268"
WHITE = "#FFFFFF"

PRIMARY_EMAIL = "chriscoyouthaflame2025@gmail.com"
SECONDARY_EMAIL = "shambetz@gmail.com"


def Y(y_top: float) -> float:
    return H - y_top


def register_fonts() -> None:
    mapping = {
        "Montserrat": "Montserrat-Regular.ttf",
        "Montserrat-Medium": "Montserrat-Medium.ttf",
        "Montserrat-SemiBold": "Montserrat-SemiBold.ttf",
        "Montserrat-Bold": "Montserrat-Bold.ttf",
        "Montserrat-Italic": "Montserrat-Italic.ttf",
    }
    for name, fn in mapping.items():
        pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, fn)))
    pdfmetrics.registerFontFamily(
        "Montserrat",
        normal="Montserrat",
        bold="Montserrat-Bold",
        italic="Montserrat-Italic",
        boldItalic="Montserrat-Bold",
    )


def clean_text(s: str) -> str:
    if not s:
        return ""
    s = (
        s.replace("\u2014", ", ")
        .replace("\u2013", " to ")
        .replace(" - ", ", ")
        .replace("\u2019", "'")
        .replace("\u2018", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u00a0", " ")
    )
    return escape(s)


def crop_cached(img_path: str, w_pt: float, h_pt: float, focus=(0.5, 0.35), dpi_scale=2.0) -> str:
    mtime = os.path.getmtime(img_path)
    key = f"{os.path.abspath(img_path)}_{mtime:.2f}_{w_pt:.1f}_{h_pt:.1f}_{focus[0]:.2f}_{focus[1]:.2f}_{dpi_scale:.1f}"
    digest = hashlib.md5(key.encode("utf-8")).hexdigest()[:14]
    out_p = os.path.join(CACHE_DIR, f"c_{digest}.jpg")
    if not os.path.exists(out_p):
        im = Image.open(img_path).convert("RGB")
        tw = max(100, int(round(w_pt * dpi_scale)))
        th = max(100, int(round(h_pt * dpi_scale)))
        fitted = ImageOps.fit(im, (tw, th), method=Image.Resampling.LANCZOS, centering=focus)
        fitted.save(out_p, "JPEG", quality=85, optimize=True)
    return out_p


def plate_cached(plate_name: str) -> str:
    src = os.path.join(GRAPHICS_DIR, plate_name)
    mtime = os.path.getmtime(src)
    key = f"plate_{plate_name}_{mtime:.2f}"
    digest = hashlib.md5(key.encode("utf-8")).hexdigest()[:12]
    out_p = os.path.join(CACHE_DIR, f"p_{digest}.jpg")
    if not os.path.exists(out_p):
        im = Image.open(src).convert("RGB")
        im = im.resize((int(W * 1.85), int(H * 1.85)), Image.Resampling.LANCZOS)
        im.save(out_p, "JPEG", quality=84, optimize=True)
    return out_p


def draw_plate(c: canvas.Canvas, plate_name: str) -> None:
    p = plate_cached(plate_name)
    c.drawImage(p, 0, 0, width=W, height=H, mask=None)


PHOTO_FOCUS = {
    "real_quiet_desk_notes.jpg": (0.5, 0.58),
    "course_woman_desk_notes.jpg": (0.5, 0.44),
    "course_woman_white_blouse_laptop.jpg": (0.5, 0.36),
    "course_podcast_creator.jpg": (0.55, 0.35),
    "course_camera_creator.jpg": (0.5, 0.34),
    "course_abuja_photographer.jpg": (0.5, 0.28),
    "course_pod_apparel.jpg": (0.5, 0.26),
    "course_coding_dual_screen.jpg": (0.5, 0.38),
    "course_coding_developer.jpg": (0.5, 0.32),
    "course_whiteboard_trainer.jpg": (0.5, 0.34),
    "course_exec_pitch_call.jpg": (0.5, 0.36),
    "course_exec_outdoor_laptop.jpg": (0.5, 0.36),
    "real_blazer_journaling.jpg": (0.5, 0.40),
    "real_modest_prayer_journal.jpg": (0.5, 0.48),
    "lesson2_contemplation.jpg": (0.5, 0.34),
    "real_study_pair_side.jpg": (0.5, 0.36),
    "real_lagos_boardroom.jpg": (0.5, 0.35),
    "real_council_sisters.jpg": (0.5, 0.34),
    "real_lagos_celebration_group.jpg": (0.5, 0.34),
    "real_joyful_fellowship_group.jpg": (0.5, 0.35),
    "real_plaid_suit_side.jpg": (0.5, 0.28),
    "real_overcoat_side.jpg": (0.5, 0.42),
    "real_seminar_side.jpg": (0.5, 0.34),
    "real_suited_window_side.jpg": (0.5, 0.32),
}


def draw_photo(c: canvas.Canvas, img_name: str, x: float, y_top: float, w: float, h: float, focus=None, radius: float = 0.0) -> None:
    use_focus = PHOTO_FOCUS.get(img_name, focus if focus is not None else (0.5, 0.35))
    p = crop_cached(os.path.join(IMAGES_DIR, img_name), w, h, focus=use_focus)
    c.saveState()
    if radius > 0:
        path = c.beginPath()
        path.roundRect(x, Y(y_top + h), w, h, radius)
        c.clipPath(path, stroke=0, fill=0)
    c.drawImage(p, x, Y(y_top + h), width=w, height=h, mask=None)
    c.restoreState()


def draw_brand_lockup(c: canvas.Canvas, x: float = 52.0, y_top: float = 56.0, dark_bg: bool = True) -> None:
    """Crisp vector CHRISCO Youth Aflame / CHRISCO Digital Academy emblem matching COURSES PDF.pdf top-left."""
    c.saveState()
    fg = WHITE if dark_bg else COBALT_HEAD
    sub = "#B9D4FF" if dark_bg else COBALT_DEEP
    # Double geometric ring emblem (modeled on COURSES PDF.pdf top-left G-ring icon)
    cx, cy = x + 13.0, Y(y_top + 11.0)
    c.setStrokeColor(HexColor(CYAN_ACCENT))
    c.setLineWidth(2.4)
    c.circle(cx, cy, 11.5, stroke=1, fill=0)
    c.setFillColor(HexColor(LIME_ACCENT))
    c.circle(cx + 4.0, cy + 1.5, 3.6, stroke=0, fill=1)

    c.setFillColor(HexColor(fg))
    c.setFont("Montserrat-Bold", 11.5)
    c.drawString(x + 32.0, Y(y_top + 9.0), "CHRISCO Youth Aflame")
    c.setFillColor(HexColor(sub))
    c.setFont("Montserrat-Medium", 7.3)
    c.drawString(x + 32.0, Y(y_top + 19.5), "CHRISCO DIGITAL ACADEMY  |  CHRISCO FELLOWSHIP OF CHURCHES")
    c.restoreState()


def draw_accent_bar(c: canvas.Canvas, x: float, y_top: float, w: float = 48.0, h: float = 2.4) -> None:
    """Signature cyan-to-lime two-tone accent bar under numbered headings in COURSES PDF.pdf."""
    c.saveState()
    c.setFillColor(HexColor(CYAN_ACCENT))
    c.rect(x, Y(y_top + h), w * 0.62, h, stroke=0, fill=1)
    c.setFillColor(HexColor(LIME_ACCENT))
    c.rect(x + w * 0.62, Y(y_top + h), w * 0.38, h, stroke=0, fill=1)
    c.restoreState()


def draw_page_num(c: canvas.Canvas, pno: int, side: str = "right", on_dark: bool = False) -> None:
    c.saveState()
    c.setFont("Montserrat-Bold", 9.2)
    c.setFillColor(HexColor(WHITE if on_dark else COBALT_HEAD))
    label = f"{pno:02d}"
    if side == "left":
        c.drawString(48.0, Y(808.0), label)
    else:
        c.drawRightString(548.0, Y(808.0), label)
    if not on_dark:
        c.setFont("Montserrat-Medium", 7.4)
        c.setFillColor(HexColor("#7B839E"))
        if side == "left":
            c.drawRightString(548.0, Y(808.0), f"CHRISCO Youth Aflame  |  {PRIMARY_EMAIL}")
        else:
            c.drawString(48.0, Y(808.0), f"CHRISCO Youth Aflame  |  {PRIMARY_EMAIL}")
    c.restoreState()


def style(name: str, font="Montserrat", size=9.6, leading=14.2, color=INK, align=TA_LEFT, after=5.0) -> ParagraphStyle:
    return ParagraphStyle(
        name=name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=HexColor(color),
        alignment=align,
        spaceAfter=after,
    )


def draw_para(c: canvas.Canvas, html: str, st: ParagraphStyle, x: float, y_top: float, w: float, max_h: float = 400.0) -> float:
    p = Paragraph(html, st)
    _, h = p.wrap(w, max_h)
    if h > max_h:
        # Auto-tighten slightly so zero text ever clips or overlaps
        tight = ParagraphStyle(
            name=st.name + "_t",
            parent=st,
            fontSize=max(7.8, st.fontSize - 0.8),
            leading=max(10.8, st.leading - 1.3),
        )
        p = Paragraph(html, tight)
        _, h = p.wrap(w, max_h)
    p.drawOn(c, x, Y(y_top + h))
    return h


def draw_method_icon(c: canvas.Canvas, kind: str, x: float, y_top: float) -> None:
    """Clean cobalt-and-cyan vector icon matching Page 10 of COURSES PDF.pdf."""
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setStrokeColor(HexColor(COBALT_HEAD))
    c.setLineWidth(1.8)
    bx, by = x, Y(y_top + 28.0)
    if kind == "principle":
        c.roundRect(bx, by + 4, 26, 20, 3, stroke=1, fill=0)
        c.setFillColor(HexColor(CYAN_ACCENT))
        c.circle(bx + 13, by + 14, 4.5, stroke=0, fill=1)
    elif kind == "case":
        c.circle(bx + 9, by + 18, 4.5, stroke=0, fill=1)
        c.circle(bx + 20, by + 18, 4.5, stroke=0, fill=1)
        c.roundRect(bx + 3, by + 4, 12, 9, 3, stroke=0, fill=1)
        c.setFillColor(HexColor(CYAN_ACCENT))
        c.roundRect(bx + 15, by + 4, 12, 9, 3, stroke=0, fill=1)
    elif kind == "drill":
        c.roundRect(bx + 2, by + 3, 24, 22, 3, stroke=1, fill=0)
        c.line(bx + 7, by + 17, bx + 21, by + 17)
        c.line(bx + 7, by + 12, bx + 21, by + 12)
        c.setStrokeColor(HexColor(CYAN_ACCENT))
        c.line(bx + 7, by + 7, bx + 16, by + 7)
    else:
        c.circle(bx + 13, by + 14, 11, stroke=1, fill=0)
        c.setStrokeColor(HexColor(CYAN_ACCENT))
        c.circle(bx + 13, by + 14, 6, stroke=1, fill=0)
        c.setFillColor(HexColor(COBALT_HEAD))
        c.circle(bx + 13, by + 14, 2.5, stroke=0, fill=1)
    c.restoreState()


def draw_lavender_table(c: canvas.Canvas, x: float, y_top: float, col_widths, headers, rows, row_h: float = 24.5) -> float:
    """Signature COURSES PDF.pdf table (#D0D3FF header fill, #9BA3EB grid lines, centered/clean Montserrat cells)."""
    total_w = sum(col_widths)
    c.saveState()
    # Header background
    c.setFillColor(HexColor(LAVENDER_TH))
    c.rect(x, Y(y_top + row_h), total_w, row_h, stroke=0, fill=1)

    # Header labels
    cx = x
    for idx, h_txt in enumerate(headers):
        cw = col_widths[idx]
        st_h = style(f"th_{idx}", "Montserrat-Bold", 8.5, 11.0, INK, align=1)
        p = Paragraph(clean_text(h_txt), st_h)
        _, ph = p.wrap(cw - 10, row_h)
        p.drawOn(c, cx + 5, Y(y_top + (row_h + ph) / 2.0 - 1.5))
        cx += cw

    cur_y = y_top + row_h
    for r_idx, row in enumerate(rows):
        # Measure max cell height
        cell_paras = []
        actual_h = row_h
        for c_idx, val in enumerate(row):
            cw = col_widths[c_idx]
            align = 0 if c_idx in (0, 1) and len(str(val)) > 24 else 1
            font = "Montserrat-SemiBold" if c_idx == 0 else "Montserrat"
            st_c = style(f"tc_{r_idx}_{c_idx}", font, 8.2, 11.2, INK, align=align)
            p = Paragraph(clean_text(str(val)), st_c)
            _, ph = p.wrap(cw - 12, 80)
            actual_h = max(actual_h, ph + 9.0)
            cell_paras.append((p, ph, cw))

        if r_idx % 2 == 1:
            c.setFillColor(HexColor("#FAFbff"))
            c.rect(x, Y(cur_y + actual_h), total_w, actual_h, stroke=0, fill=1)

        cx = x
        for p, ph, cw in cell_paras:
            p.drawOn(c, cx + 6, Y(cur_y + (actual_h + ph) / 2.0 - 1.2))
            cx += cw
        cur_y += actual_h

    # Grid borders
    total_h = cur_y - y_top
    c.setStrokeColor(HexColor("#AEB6F0"))
    c.setLineWidth(0.75)
    c.rect(x, Y(cur_y), total_w, total_h, stroke=1, fill=0)

    # Vertical column lines
    vx = x
    for cw in col_widths[:-1]:
        vx += cw
        c.line(vx, Y(y_top), vx, Y(cur_y))

    # Horizontal row lines (re-trace cleanly)
    hy = y_top + row_h
    c.line(x, Y(hy), x + total_w, Y(hy))
    cur_check = y_top + row_h
    for r_idx, row in enumerate(rows[:-1]):
        actual_h = row_h
        for c_idx, val in enumerate(row):
            cw = col_widths[c_idx]
            st_c = style("tmp", "Montserrat-SemiBold" if c_idx == 0 else "Montserrat", 8.2, 11.2, INK)
            _, ph = Paragraph(clean_text(str(val)), st_c).wrap(cw - 12, 80)
            actual_h = max(actual_h, ph + 9.0)
        cur_check += actual_h
        c.line(x, Y(cur_check), x + total_w, Y(cur_check))

    c.restoreState()
    return total_h


# Track-specific real African photo sets (zero AI, zero watermarks, 100% real Pexels photos)
TRACK_META = {
    "youtube-automation": {
        "track": "Video & Creator Economy Track",
        "duration": "8 Weeks",
        "level": "Beginner to Pro",
        "photos": [
            "course_podcast_creator.jpg",
            "course_camera_creator.jpg",
            "course_abuja_photographer.jpg",
            "course_woman_desk_notes.jpg",
            "real_study_pair_side.jpg",
            "real_joyful_fellowship_group.jpg",
            "real_blazer_journaling.jpg",
        ],
    },
    "ai-video-storytelling": {
        "track": "Video & Creative AI Track",
        "duration": "6 Weeks",
        "level": "Beginner",
        "photos": [
            "course_camera_creator.jpg",
            "course_abuja_photographer.jpg",
            "course_podcast_creator.jpg",
            "real_study_pair_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_lagos_celebration_group.jpg",
            "real_quiet_desk_notes.jpg",
        ],
    },
    "python-programming": {
        "track": "Coding & Software Engineering Track",
        "duration": "8 Weeks",
        "level": "Beginner",
        "photos": [
            "course_coding_dual_screen.jpg",
            "course_coding_developer.jpg",
            "real_study_pair_side.jpg",
            "course_woman_desk_notes.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_seminar_side.jpg",
        ],
    },
    "swe-llm-mastery": {
        "track": "Software Engineering & AI Systems Track",
        "duration": "10 Weeks",
        "level": "Intermediate",
        "photos": [
            "course_coding_developer.jpg",
            "course_coding_dual_screen.jpg",
            "course_woman_desk_notes.jpg",
            "real_study_pair_side.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_overcoat_side.jpg",
        ],
    },
    "ai-literacy": {
        "track": "AI & Workplace Productivity Track",
        "duration": "5 Weeks",
        "level": "Beginner",
        "photos": [
            "course_woman_white_blouse_laptop.jpg",
            "course_coding_dual_screen.jpg",
            "real_study_pair_side.jpg",
            "course_woman_desk_notes.jpg",
            "real_lagos_boardroom.jpg",
            "real_blazer_journaling.jpg",
            "real_seminar_side.jpg",
        ],
    },
    "print-on-demand": {
        "track": "Design & Digital Commerce Track",
        "duration": "8 Weeks",
        "level": "Beginner",
        "photos": [
            "course_pod_apparel.jpg",
            "real_blazer_journaling.jpg",
            "course_woman_desk_notes.jpg",
            "course_abuja_photographer.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_quiet_desk_notes.jpg",
        ],
    },
    "communicate-like-a-ceo": {
        "track": "Executive Leadership & Communication Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "photos": [
            "course_exec_pitch_call.jpg",
            "real_seminar_side.jpg",
            "real_council_sisters.jpg",
            "course_whiteboard_trainer.jpg",
            "real_plaid_suit_side.jpg",
            "real_lagos_boardroom.jpg",
            "real_overcoat_side.jpg",
        ],
    },
    "negotiation": {
        "track": "Business Strategy & Deal-Making Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "photos": [
            "real_council_sisters.jpg",
            "real_plaid_suit_side.jpg",
            "course_exec_pitch_call.jpg",
            "real_lagos_boardroom.jpg",
            "real_suited_window_side.jpg",
            "real_joyful_fellowship_group.jpg",
            "real_blazer_journaling.jpg",
        ],
    },
    "personal-branding": {
        "track": "Leadership & Authority Positioning Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "photos": [
            "course_exec_outdoor_laptop.jpg",
            "course_podcast_creator.jpg",
            "real_plaid_suit_side.jpg",
            "course_abuja_photographer.jpg",
            "real_blazer_journaling.jpg",
            "real_lagos_celebration_group.jpg",
            "real_seminar_side.jpg",
        ],
    },
    "networking-secrets": {
        "track": "Leadership & Relationship Capital Track",
        "duration": "5 Weeks",
        "level": "All Levels",
        "photos": [
            "real_joyful_fellowship_group.jpg",
            "real_seminar_side.jpg",
            "real_lagos_celebration_group.jpg",
            "real_council_sisters.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_overcoat_side.jpg",
        ],
    },
    "ghostwriting": {
        "track": "Editorial Writing & Publishing Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "photos": [
            "real_modest_prayer_journal.jpg",
            "real_blazer_journaling.jpg",
            "lesson2_contemplation.jpg",
            "real_quiet_desk_notes.jpg",
            "course_woman_desk_notes.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_seminar_side.jpg",
        ],
    },
    "copywriting": {
        "track": "Persuasive Writing & Conversion Track",
        "duration": "8 Weeks",
        "level": "Beginner to Pro",
        "photos": [
            "real_blazer_journaling.jpg",
            "real_quiet_desk_notes.jpg",
            "course_woman_desk_notes.jpg",
            "real_modest_prayer_journal.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "lesson2_contemplation.jpg",
        ],
    },
    "freelancing": {
        "track": "Independent Consulting & Remote Work Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "photos": [
            "real_overcoat_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "course_exec_outdoor_laptop.jpg",
            "course_exec_pitch_call.jpg",
            "real_blazer_journaling.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_desk_notes.jpg",
        ],
    },
    "content-creation": {
        "track": "Digital Media & Audience Growth Track",
        "duration": "6 Weeks",
        "level": "Beginner",
        "photos": [
            "course_podcast_creator.jpg",
            "course_abuja_photographer.jpg",
            "course_camera_creator.jpg",
            "real_blazer_journaling.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_study_pair_side.jpg",
        ],
    },
    "sales-and-marketing": {
        "track": "Revenue Growth & Go-To-Market Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "photos": [
            "course_whiteboard_trainer.jpg",
            "course_exec_pitch_call.jpg",
            "real_lagos_boardroom.jpg",
            "real_council_sisters.jpg",
            "real_joyful_fellowship_group.jpg",
            "real_plaid_suit_side.jpg",
            "course_woman_desk_notes.jpg",
        ],
    },
    "digital-marketing": {
        "track": "Growth Marketing & Analytics Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "photos": [
            "real_lagos_boardroom.jpg",
            "course_woman_desk_notes.jpg",
            "course_whiteboard_trainer.jpg",
            "real_study_pair_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_council_sisters.jpg",
            "real_blazer_journaling.jpg",
        ],
    },
    "email-marketing": {
        "track": "Retention & Direct Response Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "photos": [
            "course_woman_desk_notes.jpg",
            "real_quiet_desk_notes.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_blazer_journaling.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_modest_prayer_journal.jpg",
        ],
    },
    "affiliate-marketing": {
        "track": "Partner Commerce & Digital Funnels Track",
        "duration": "8 Weeks",
        "level": "Beginner to Pro",
        "photos": [
            "real_study_pair_side.jpg",
            "course_exec_outdoor_laptop.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "course_podcast_creator.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_desk_notes.jpg",
            "real_overcoat_side.jpg",
        ],
    },
    "social-media-marketing": {
        "track": "Brand Community & Social Strategy Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "photos": [
            "real_lagos_celebration_group.jpg",
            "course_podcast_creator.jpg",
            "real_joyful_fellowship_group.jpg",
            "course_camera_creator.jpg",
            "real_council_sisters.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_blazer_journaling.jpg",
        ],
    },
}


def split_cover_title(title: str):
    """Break course title into 2-3 bold display lines matching COURSES PDF.pdf Page 1."""
    clean = title.replace(": ", ":\n")
    words = clean.split()
    lines = []
    cur = ""
    for w in words:
        cand = (cur + " " + w).strip()
        if len(cand) <= 16 or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    if len(lines) == 1:
        lines.append("Course")
        lines.append("Handbook")
    elif len(lines) == 2:
        lines.append("Course Handbook")
    elif len(lines) > 3:
        lines = [lines[0], lines[1], " ".join(lines[2:])]
    return lines


def render_section_divider(c: canvas.Canvas, plate: str, sec_num: str, title_lines, sub_line: str, pno: int) -> None:
    draw_plate(c, plate)
    draw_brand_lockup(c, 52.0, 52.0, dark_bg=True)
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat-Bold", 38.0)
    base_y = 626.0 - max(0, (len(title_lines) - 1) * 38.0)
    c.drawString(96.0, Y(base_y), sec_num)
    ty = base_y + 44.0
    for ln in title_lines:
        c.setFont("Montserrat-Bold", 33.0)
        c.drawString(96.0, Y(ty), ln)
        ty += 38.0
    c.restoreState()
    st_subdiv = style("subdiv", "Montserrat-Medium", 10.4, 14.5, "#C5D8FF")
    draw_para(c, clean_text(sub_line), st_subdiv, 96.0, ty - 22.0, 430.0, 44.0)
    draw_page_num(c, pno, side="right", on_dark=True)
    c.showPage()


def build_single_course_pdf(book: dict) -> str:
    slug = book["slug"]
    title = book["title"]
    subtitle = book["subtitle"]
    promise = book["promise"]
    foreword = book["foreword"]
    chapters = book["chapters"]  # 8 full chapters

    meta = TRACK_META[slug]
    photos = meta["photos"]
    out_path = os.path.join(OUT_DIR, f"{slug}.pdf")

    c = canvas.Canvas(out_path, pagesize=(W, H))
    c.setTitle(f"{title} | CHRISCO Youth Aflame Course Handbook")
    c.setAuthor("CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES")
    c.setSubject(f"CHRISCO Digital Academy Official Course E-Book: {title}")

    # =========================================================================
    # PAGE 01: COVER (Exact COURSES PDF.pdf Page 1)
    # =========================================================================
    draw_plate(c, "plate_cover.jpg")
    draw_brand_lockup(c, 56.0, 56.0, dark_bg=True)

    t_lines = split_cover_title(title)
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    ty = 166.0
    for ln in t_lines:
        sz = 40.0 if len(ln) <= 16 else (33.0 if len(ln) <= 21 else 27.5)
        c.setFont("Montserrat-Bold", sz)
        c.drawString(59.5, Y(ty), ln)
        ty += sz + 9.0

    # Subtitle quote
    st_sub = style("cov_sub", "Montserrat", 14.5, 20.5, "#E8F0FF")
    draw_para(c, f'"{clean_text(subtitle)}"', st_sub, 59.5, ty - 14.0, 445.0, max_h=68.0)
    c.restoreState()

    # Hero real African photograph in the middle window (y=404..672)
    draw_photo(c, photos[0], 0.0, 404.0, W, 268.0, focus=(0.5, 0.32))

    # Footer metadata on cobalt-cyan bottom ribbon
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat", 9.6)
    c.drawString(59.5, Y(774.0), f"{meta['track']}  |  {meta['duration']}  |  {meta['level']}")
    c.drawRightString(536.0, Y(774.0), "Self-Paced Study Edition")
    c.setFont("Montserrat-Bold", 9.8)
    c.drawString(59.5, Y(793.0), "Prepared by CHRISCO Youth Aflame")
    c.setFont("Montserrat", 9.4)
    c.drawString(248.0, Y(793.0), f"  |  {PRIMARY_EMAIL}")
    c.restoreState()
    c.showPage()

    # =========================================================================
    # PAGE 02: COURSE FOREWORD & PROMISE (Exact COURSES PDF.pdf Page 2)
    # =========================================================================
    draw_plate(c, "plate_overview.jpg")
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat-Bold", 38.0)
    c.drawString(59.5, Y(92.0), "Course")
    c.drawString(59.5, Y(136.0), "Foreword")
    c.restoreState()

    # Overlapping vertical African learner/practitioner portrait
    draw_photo(c, photos[1], 59.5, 178.0, 224.0, 248.0, focus=(0.5, 0.28))

    # Right upper box on white panel (below top blue header y=322)
    st_prom_lbl = style("pr_lbl", "Montserrat-Bold", 10.5, 14.0, COBALT_HEAD)
    draw_para(c, "THE PRACTITIONER PROMISE", st_prom_lbl, 312.0, 340.0, 228.0, 24.0)
    draw_accent_bar(c, 312.0, 358.0, 56.0, 2.5)
    st_prom = style("pr_txt", "Montserrat-Medium", 9.6, 14.5, INK)
    draw_para(c, clean_text(promise), st_prom, 312.0, 370.0, 228.0, 120.0)

    # Left column foreword paragraphs (y=446..755)
    st_body = style("fw_b", "Montserrat", 9.5, 14.4, INK, align=TA_LEFT, after=8.0)
    ly = 446.0
    for para in foreword[:2]:
        ly += draw_para(c, clean_text(para), st_body, 59.5, ly, 232.0, 155.0) + 10.0

    # Right column foreword + study approach (y=495..730)
    ry = 495.0
    if len(foreword) > 2:
        ry += draw_para(c, clean_text(foreword[2]), st_body, 312.0, ry, 228.0, 130.0) + 12.0
    study_note = (
        f"Published by <b>CHRISCO Digital Academy</b> under <b>CHRISCO Youth Aflame</b> "
        f"(<i>CHRISCO Fellowship of Churches</i>), this 8-module workbook equips youth and emerging "
        f"leaders with practical, ethical, income-ready skills. Complete every chapter drill in a dedicated "
        f"workbook and reach our mentorship desk anytime at <b>{PRIMARY_EMAIL}</b>."
    )
    ry += draw_para(c, study_note, st_body, 312.0, ry, 228.0, 145.0) + 10.0
    # Signature warm gold horizontal rule from COURSES PDF.pdf Page 2
    c.saveState()
    c.setStrokeColor(HexColor(GOLD_RULE))
    c.setLineWidth(1.6)
    c.line(312.0, Y(min(ry + 6.0, 742.0)), 520.0, Y(min(ry + 6.0, 742.0)))
    c.restoreState()

    draw_page_num(c, 2, side="left", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 03: KEY OUTCOMES (Exact COURSES PDF.pdf Page 3)
    # =========================================================================
    draw_plate(c, "plate_outcomes.jpg")
    draw_photo(c, photos[2], 0.0, 0.0, W, 336.0, focus=(0.5, 0.32))

    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 20.0)
    c.drawString(96.0, Y(384.0), "Key Outcomes")
    c.restoreState()

    outcomes_4 = [
        chapters[0]["takeaways"][0],
        chapters[2]["takeaways"][0],
        chapters[4]["takeaways"][0],
        chapters[7]["takeaways"][0],
    ]
    coords_2x2 = [(96.0, 418.0), (324.0, 418.0), (96.0, 528.0), (324.0, 528.0)]
    for idx, (ox, oy) in enumerate(coords_2x2):
        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat", 27.0)
        c.drawString(ox, Y(oy + 24.0), f"0{idx+1}")
        c.restoreState()
        draw_accent_bar(c, ox, oy + 32.0, 46.0, 2.4)
        st_out = style(f"out_{idx}", "Montserrat-Medium", 9.4, 13.8, INK)
        ch_ref = chapters[idx * 2]
        out_txt = f"<b>{clean_text(ch_ref['title'])}:</b> {clean_text(outcomes_4[idx])}"
        draw_para(c, out_txt, st_out, ox, oy + 42.0, 198.0, 62.0)

    # Bottom synthesis columns (y=652..770)
    syn_left = (
        f"Across <b>{meta['duration']}</b> of structured practice, learners progress from core principles "
        f"to real-world execution. Every module pairs concise frameworks with an immediate hands-on drill "
        f"so knowledge turns into demonstrable competence."
    )
    syn_right = (
        f"Graduates finish with a tangible portfolio deliverable in <b>{clean_text(title)}</b>, ready to "
        f"serve clients, employers, ministries, and communities with excellence and integrity."
    )
    draw_para(c, syn_left, st_body, 96.0, 654.0, 204.0, 118.0)
    draw_para(c, syn_right, st_body, 324.0, 654.0, 204.0, 118.0)

    draw_page_num(c, 3, side="right", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 04: TABLE OF CONTENTS (Exact COURSES PDF.pdf Page 4)
    # =========================================================================
    draw_plate(c, "plate_toc.jpg")
    draw_brand_lockup(c, 56.0, 56.0, dark_bg=True)

    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat-Bold", 41.0)
    c.drawString(119.8, Y(308.0), "Table of")
    c.drawString(119.8, Y(354.0), "Contents")

    toc_rows = [
        ("Course Foreword & Key Outcomes", "02", 448.0),
        ("01  Foundations & Core Mindset", "05", 492.5),
        ("02  Core Frameworks & Strategy", "07", 536.8),
        ("03  Execution & Applied Mastery", "10", 581.5),
        ("04  Scaling, Capstone & Excellence", "12", 625.0),
        ("05  8-Module Syllabus & Drill Matrix", "14", 669.2),
        ("06  90-Day Action Plan & Stewardship", "15", 713.8),
    ]
    for label, pg_str, row_y in toc_rows:
        c.setFont("Montserrat-Medium", 11.2)
        c.drawString(119.8, Y(row_y), label)
        c.setFont("Montserrat-Bold", 11.5)
        c.drawRightString(416.0, Y(row_y), pg_str)
    c.restoreState()

    draw_page_num(c, 4, side="left", on_dark=True)
    c.showPage()

    # =========================================================================
    # PAGE 05: SECTION 01 DIVIDER (plate_div_01.jpg)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_01.jpg",
        "01",
        ["Foundations &", "Core Mindset"],
        f"Module 1: {chapters[0]['title']}  |  Module 2: {chapters[1]['title']}",
        5,
    )

    # =========================================================================
    # PAGE 06: CHAPTERS 1 & 2 DEEP DIVE (Exact COURSES PDF.pdf Page 6)
    # =========================================================================
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()
    draw_photo(c, photos[3], 0.0, 0.0, W, 178.0, focus=(0.5, 0.30))

    ch1, ch2 = chapters[0], chapters[1]
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 16.5)
    c.drawString(72.0, Y(210.0), f"1.1  {ch1['title']}")
    c.restoreState()

    st_ch = style("ch_b", "Montserrat", 9.0, 13.3, INK, align=TA_JUSTIFY, after=5.0)
    y_cur = 222.0
    for p_txt in ch1["body"]:
        y_cur += draw_para(c, clean_text(p_txt), st_ch, 72.0, y_cur, 456.0, 92.0) + 5.0

    # 3 vertical periwinkle bar columns (Example + Practice + Key Takeaways)
    cols_x = [72.0, 230.0, 388.0]
    bar_items = [
        ("Real-World Example", ch1["example"]),
        ("Hands-On Practice", ch1["practice"]),
        ("Core Takeaways", " • ".join(ch1["takeaways"])),
    ]
    max_col_h = 0.0
    for idx, (lbl, txt) in enumerate(bar_items):
        bx = cols_x[idx]
        c.saveState()
        c.setStrokeColor(HexColor("#AEB6F0"))
        c.setLineWidth(2.0)
        c.line(bx, Y(y_cur + 4.0), bx, Y(y_cur + 96.0))
        c.restoreState()
        st_mini = style(f"b1_{idx}", "Montserrat", 8.2, 11.8, INK)
        h_used = draw_para(c, f"<b><font color='{COBALT_HEAD}'>{lbl}:</font></b> {clean_text(txt)}", st_mini, bx + 9.0, y_cur + 2.0, 136.0, 102.0)
        max_col_h = max(max_col_h, h_used)

    y2 = max(y_cur + max_col_h + 18.0, 504.0)
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 16.5)
    c.drawString(72.0, Y(y2), f"1.2  {ch2['title']}")
    c.restoreState()

    y2 += 12.0
    for p_txt in ch2["body"]:
        y2 += draw_para(c, clean_text(p_txt), st_ch, 72.0, y2, 456.0, 88.0) + 5.0

    # Numbered 01 / 02 / 03 alignment columns at bottom (exact Page 6 style)
    y_bot = y2 + 4.0
    ch2_cards = [
        ("Practitioner Case", ch2["example"]),
        ("Action Drill", ch2["practice"]),
        ("Key Standard", " ".join(ch2["takeaways"])),
    ]
    for idx, (head_lbl, body_txt) in enumerate(ch2_cards):
        bx = cols_x[idx]
        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat", 16.5)
        c.drawString(bx, Y(y_bot + 14.0), f"0{idx+1}")
        c.restoreState()
        draw_accent_bar(c, bx, y_bot + 19.0, 38.0, 2.0)
        st_c2 = style(f"c2_{idx}", "Montserrat", 8.0, 11.4, INK)
        draw_para(c, f"<b><font color='{COBALT_HEAD}'>{head_lbl}</font></b><br/>{clean_text(body_txt)}", st_c2, bx, y_bot + 25.0, 142.0, 96.0)

    draw_page_num(c, 6, side="left", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 07: SECTION 02 DIVIDER (plate_div_02.jpg)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_02.jpg",
        "02",
        ["Core Frameworks", "& Strategy"],
        f"Module 3: {chapters[2]['title']}  |  Module 4: {chapters[3]['title']}",
        7,
    )

    # =========================================================================
    # PAGE 08: CHAPTER 3 DEEP DIVE & 2x2 METHODOLOGY CARDS (Exact Page 10)
    # =========================================================================
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()

    ch3 = chapters[2]
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 18.0)
    c.drawString(72.0, Y(68.0), f"2.1  {ch3['title']}")
    c.restoreState()

    yc = 82.0
    for p_txt in ch3["body"]:
        yc += draw_para(c, clean_text(p_txt), st_ch, 72.0, yc, 456.0, 95.0) + 6.0

    # 2x2 Soft-Lavender Cards (matching Page 10 of COURSES PDF.pdf)
    card_y = yc + 8.0
    cards_data = [
        ("principle", "Core Principle", ch3["takeaways"][0]),
        ("case", "Field Case Study", ch3["example"]),
        ("drill", "Applied Exercise", ch3["practice"]),
        ("standard", "Mastery Check", " • ".join(ch3["takeaways"][1:])),
    ]
    card_w, card_h = 222.0, 128.0
    for idx, (ic_kind, c_title, c_txt) in enumerate(cards_data):
        cx = 72.0 if idx % 2 == 0 else 306.0
        cy = card_y if idx < 2 else card_y + card_h + 10.0
        c.saveState()
        c.setFillColor(HexColor(LAVENDER_CARD))
        c.roundRect(cx, Y(cy + card_h), card_w, card_h, 6.0, stroke=0, fill=1)
        c.restoreState()
        draw_method_icon(c, ic_kind, cx + 14.0, cy + 12.0)
        st_ct = style(f"ct_{idx}", "Montserrat-Bold", 10.0, 13.0, COBALT_HEAD)
        draw_para(c, c_title, st_ct, cx + 50.0, cy + 16.0, card_w - 62.0, 26.0)
        st_cb = style(f"cb_{idx}", "Montserrat", 8.3, 12.0, INK)
        draw_para(c, clean_text(c_txt), st_cb, cx + 14.0, cy + 48.0, card_w - 28.0, 74.0)

    # Bottom Agenda / Step-by-Step Execution Sequence (y = card_y + 2*card_h + 32)
    ag_y = card_y + 2 * card_h + 32.0
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 16.5)
    c.drawString(72.0, Y(ag_y), "2.2  Three-Step Execution Rhythm")
    c.restoreState()

    steps = [
        ("Step 1", "Prepare & Frame", ch3["takeaways"][0], "Audit your current approach before acting."),
        ("Step 2", "Execute Deliberately", ch3["takeaways"][1] if len(ch3["takeaways"]) > 1 else ch3["practice"], "Focus on clarity, calm pace, and measurable value."),
        ("Step 3", "Review & Refine", ch3["takeaways"][2] if len(ch3["takeaways"]) > 2 else ch3["example"], "Record outcomes and sharpen one habit per rep."),
    ]
    sy = ag_y + 18.0
    for s_num, s_head, s_left, s_right in steps:
        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat", 15.0)
        c.drawString(72.0, Y(sy + 14.0), s_num)
        c.restoreState()
        draw_accent_bar(c, 72.0, sy + 20.0, 44.0, 2.0)
        st_s = style("sts", "Montserrat", 8.3, 11.8, INK)
        draw_para(c, f"<b><font color='{COBALT_HEAD}'>{s_head}</font></b><br/>{clean_text(s_left)}", st_s, 138.0, sy + 2.0, 188.0, 44.0)
        draw_para(c, f"<b>Practice Focus</b><br/>{clean_text(s_right)}", st_s, 344.0, sy + 2.0, 184.0, 44.0)
        sy += 48.0

    draw_page_num(c, 8, side="right", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 09: CHAPTER 4 DEEP DIVE (plate_bottom_wave.jpg - Exact Page 7)
    # =========================================================================
    draw_plate(c, "plate_bottom_wave.jpg")
    ch4 = chapters[3]

    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 18.0)
    c.drawString(82.0, Y(68.0), f"2.3  {ch4['title']}")
    c.restoreState()

    y4 = 84.0
    for p_txt in ch4["body"]:
        y4 += draw_para(c, clean_text(p_txt), st_ch, 82.0, y4, 442.0, 100.0) + 6.0

    # 01 / 02 / 03 Takeaways grid
    y4 += 6.0
    for idx, tk in enumerate(ch4["takeaways"][:3]):
        tx = 82.0 + idx * 150.0
        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat", 18.0)
        c.drawString(tx, Y(y4 + 16.0), f"0{idx+1}")
        c.restoreState()
        draw_accent_bar(c, tx, y4 + 22.0, 38.0, 2.2)
        st_tk = style(f"tk4_{idx}", "Montserrat-Medium", 8.5, 12.2, INK)
        draw_para(c, clean_text(tk), st_tk, tx, y4 + 30.0, 136.0, 58.0)

    y4_sub = max(y4 + 98.0, 326.0)
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 16.5)
    c.drawString(82.0, Y(y4_sub), "2.4  Real-World Case & Lab Assignment")
    c.restoreState()

    # Two wide periwinkle-bar blocks before bottom cobalt wave (starts at y=515)
    for idx, (lbl, content) in enumerate([("Practitioner Case Study", ch4["example"]), ("Your Practical Assignment", ch4["practice"])]):
        bx = 82.0 if idx == 0 else 314.0
        c.saveState()
        c.setStrokeColor(HexColor("#AEB6F0"))
        c.setLineWidth(2.2)
        c.line(bx, Y(y4_sub + 14.0), bx, Y(y4_sub + 122.0))
        c.restoreState()
        st_b4 = style(f"b4_{idx}", "Montserrat", 8.6, 12.6, INK)
        draw_para(c, f"<b><font color='{COBALT_HEAD}'>{lbl}</font></b><br/>{clean_text(content)}", st_b4, bx + 10.0, y4_sub + 12.0, 202.0, 118.0)

    # Inspiring takeaway inside the bottom cobalt-ribbon wave (y=585..720)
    st_wave = style("wv_q", "Montserrat-Medium", 13.0, 19.5, WHITE)
    draw_para(
        c,
        f'<b>CHRISCO Youth Aflame Study Principle:</b> "{clean_text(ch4["takeaways"][0])} '
        f'Consistent execution in small daily assignments builds authority that cannot be faked."',
        st_wave,
        82.0,
        595.0,
        430.0,
        120.0,
    )
    draw_page_num(c, 9, side="right", on_dark=True)
    c.showPage()

    # =========================================================================
    # PAGE 10: SECTION 03 DIVIDER (plate_div_04.jpg)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_04.jpg",
        "03",
        ["Execution &", "Applied Mastery"],
        f"Module 5: {chapters[4]['title']}  |  Module 6: {chapters[5]['title']}",
        10,
    )

    # =========================================================================
    # PAGE 11: CHAPTERS 5 & 6 FEATURE SPLIT CARDS (Exact COURSES PDF.pdf Page 18)
    # =========================================================================
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()

    for idx, ch_obj in enumerate([chapters[4], chapters[5]]):
        top_y = 58.0 if idx == 0 else 432.0
        sec_tag = "3.1" if idx == 0 else "3.2"
        ph_file = photos[4 if idx == 0 else 5]

        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat-Bold", 17.0)
        c.drawString(72.0, Y(top_y), f"{sec_tag}  {ch_obj['title']}")
        c.restoreState()

        cy = top_y + 13.0
        for p_txt in ch_obj["body"]:
            cy += draw_para(c, clean_text(p_txt), st_ch, 72.0, cy, 456.0, 88.0) + 5.0

        # Horizontal Photo + Cobalt Callout Box (matching Page 18 of COURSES PDF.pdf)
        box_y = cy + 6.0
        box_h = 136.0
        draw_photo(c, ph_file, 72.0, box_y, 232.0, box_h, focus=(0.5, 0.32))
        c.saveState()
        c.setFillColor(HexColor(COBALT_PANEL))
        c.rect(304.0, Y(box_y + box_h), 224.0, box_h, stroke=0, fill=1)
        c.restoreState()
        draw_accent_bar(c, 318.0, box_y + 14.0, 42.0, 2.2)
        st_wbox = style(f"wb_{idx}", "Montserrat", 8.1, 11.6, WHITE)
        card_html = (
            f"<b>Case:</b> {clean_text(ch_obj['example'])}<br/><br/>"
            f"<b>Action Drill:</b> {clean_text(ch_obj['practice'])}"
        )
        draw_para(c, card_html, st_wbox, 318.0, box_y + 22.0, 196.0, box_h - 28.0)

    draw_page_num(c, 11, side="left", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 12: SECTION 04 DIVIDER (plate_div_05.jpg)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_05.jpg",
        "04",
        ["Scaling, Capstone", "& Excellence"],
        f"Module 7: {chapters[6]['title']}  |  Module 8: {chapters[7]['title']}",
        12,
    )

    # =========================================================================
    # PAGE 13: CHAPTERS 7 & 8 + LAVENDER RUBRIC TABLE (plate_top_banner.jpg)
    # =========================================================================
    draw_plate(c, "plate_top_banner.jpg")
    ch7, ch8 = chapters[6], chapters[7]

    # Top Cobalt-Ribbon Banner text (y=85..320)
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat-Bold", 18.5)
    c.drawString(72.0, Y(92.0), f"4.1  {ch7['title']}")
    c.restoreState()

    st_banner = style("bn_p", "Montserrat", 9.3, 13.8, WHITE, align=TA_LEFT, after=6.0)
    by = 108.0
    for p_txt in ch7["body"]:
        by += draw_para(c, clean_text(p_txt), st_banner, 72.0, by, 448.0, 92.0) + 5.0
    by += draw_para(
        c,
        f"<b>Field Example:</b> {clean_text(ch7['example'])}  |  <b>Drill:</b> {clean_text(ch7['practice'])}",
        st_banner,
        72.0,
        by,
        448.0,
        74.0,
    )

    # Lower White Panel: Chapter 8 Capstone + Lavender Self-Assessment Table (y=396..775)
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 17.5)
    c.drawString(72.0, Y(402.0), f"4.2  {ch8['title']} (Capstone)")
    c.restoreState()

    cy8 = 416.0
    for p_txt in ch8["body"]:
        cy8 += draw_para(c, clean_text(p_txt), st_ch, 72.0, cy8, 456.0, 88.0) + 5.0

    rubric_rows = [
        ("1. Clarity & Preparation", ch7["takeaways"][0], "Needs Draft", " Confident & Ready"),
        ("2. Execution Quality", ch8["takeaways"][0], "In Practice", "Portfolio-Grade"),
        ("3. Real-World Proof", ch8["practice"], "Planned", "Completed & Reviewed"),
        ("4. Consistency Habit", ch8["takeaways"][-1], "Occasional", "Weekly Discipline"),
    ]
    draw_lavender_table(
        c,
        72.0,
        cy8 + 8.0,
        [124.0, 196.0, 66.0, 70.0],
        ["Competency Area", "Capstone Standard", "Starting", "Target Mastery"],
        rubric_rows,
        row_h=24.0,
    )

    draw_page_num(c, 13, side="right", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 14: 8-MODULE SYLLABUS & LEARNER REFLECTION CARDS (Pages 9 & 21 style)
    # =========================================================================
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()

    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 18.5)
    c.drawString(64.0, Y(64.0), "5.1  Complete 8-Module Practice Matrix")
    c.restoreState()

    st_lead = style("m_ld", "Montserrat", 9.2, 13.5, MUTED)
    draw_para(
        c,
        f"Use this checklist to track every hands-on assignment in <b>{clean_text(title)}</b> from Module 1 to your final project:",
        st_lead,
        64.0,
        78.0,
        468.0,
        32.0,
    )

    mod_rows = []
    for idx, ch_item in enumerate(chapters, 1):
        mod_rows.append((f"Module 0{idx}", ch_item["title"], ch_item["takeaways"][0]))

    tbl_h = draw_lavender_table(
        c,
        64.0,
        112.0,
        [68.0, 172.0, 228.0],
        ["Module", "Focus Topic", "Core Deliverable & Principle"],
        mod_rows,
        row_h=23.5,
    )

    # Selected Learner Reflections (matching Page 17 & Page 21 of COURSES PDF.pdf)
    ref_y = 112.0 + tbl_h + 24.0
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 16.5)
    c.drawString(64.0, Y(ref_y), "5.2  Applied Fellowship Reflections")
    c.restoreState()

    ref_cards = [
        (
            photos[6],
            f'"{clean_text(chapters[0]["example"])}"',
            "CHRISCO Youth Aflame Cohort Case Note  |  Module 01",
        ),
        (
            photos[1],
            f'"{clean_text(chapters[7]["example"])}"',
            "CHRISCO Digital Academy Capstone Highlight  |  Module 08",
        ),
    ]
    rc_y = ref_y + 14.0
    for idx, (r_img, r_quote, r_attr) in enumerate(ref_cards):
        c.saveState()
        c.setFillColor(HexColor(GRAY_CARD))
        c.roundRect(64.0, Y(rc_y + 92.0), 468.0, 92.0, 6.0, stroke=0, fill=1)
        c.restoreState()
        if idx == 0:
            draw_photo(c, r_img, 424.0, rc_y + 8.0, 98.0, 76.0, focus=(0.5, 0.25), radius=4.0)
            tx_x = 78.0
        else:
            draw_photo(c, r_img, 74.0, rc_y + 8.0, 98.0, 76.0, focus=(0.5, 0.25), radius=4.0)
            tx_x = 186.0
        st_rq = style(f"rq_{idx}", "Montserrat-Italic", 8.4, 12.2, INK)
        h_q = draw_para(c, r_quote, st_rq, tx_x, rc_y + 12.0, 332.0, 56.0)
        st_ra = style(f"ra_{idx}", "Montserrat-Bold", 8.0, 11.0, COBALT_HEAD)
        draw_para(c, r_attr, st_ra, tx_x, rc_y + 14.0 + h_q, 332.0, 20.0)
        rc_y += 102.0

    draw_page_num(c, 14, side="left", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 15: 90-DAY ACTION ROADMAP & FOLLOW-UP PLAN (Pages 24 & 25 style)
    # =========================================================================
    draw_plate(c, "plate_top_banner.jpg")

    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat-Bold", 24.0)
    c.drawString(72.0, Y(102.0), "06  90-Day Action Roadmap")
    c.restoreState()
    draw_para(
        c,
        f"True mastery in <b>{clean_text(title)}</b> is measured by what you build, ship, and steward "
        f"after finishing the lessons. Follow this structured 90-day implementation plan developed by "
        f"<b>CHRISCO Youth Aflame</b> (under <b>CHRISCO Fellowship of Churches</b>) to turn study into fruitfulness.",
        style("rd_top", "Montserrat", 10.2, 15.6, WHITE),
        72.0,
        124.0,
        438.0,
        140.0,
    )

    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 17.5)
    c.drawString(72.0, Y(402.0), "6.1  Four-Stage Post-Course Milestones")
    c.restoreState()

    milestones = [
        ("Days 1 to 14: Foundation Sprint", f"Complete Modules 1 to 4 drills and document your baseline specimen in {title}."),
        ("Days 15 to 30: First Live Output", f"Complete Modules 5 to 8 and ship your first real capstone deliverable: {chapters[7]['practice']}"),
        ("Days 31 to 60: Feedback & Iteration", "Share your work with a mentor, peer, or real client/community audience and refine weak points."),
        ("Days 61 to 90: Service & Multiplication", "Use your skill to serve your church, business, or clients faithfully and mentor one younger learner."),
    ]
    m_pos = [(72.0, 420.0), (312.0, 420.0), (72.0, 520.0), (312.0, 520.0)]
    for idx, ((mx, my), (m_head, m_body)) in enumerate(zip(m_pos, milestones)):
        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat", 17.0)
        c.drawString(mx, Y(my + 15.0), f"0{idx+1}")
        c.restoreState()
        draw_accent_bar(c, mx, my + 20.0, 42.0, 2.2)
        st_m = style(f"ms_{idx}", "Montserrat", 8.3, 12.0, INK)
        draw_para(c, f"<b><font color='{COBALT_HEAD}'>{m_head}</font></b><br/>{clean_text(m_body)}", st_m, mx, my + 27.0, 214.0, 68.0)

    # Follow-Up Support Table at bottom (matching Page 25 of COURSES PDF.pdf)
    draw_lavender_table(
        c,
        72.0,
        626.0,
        [118.0, 152.0, 186.0],
        ["Follow-Up Stage", "CHRISCO Support Channel", "Contact & Cadence"],
        [
            ("Workbook Review", "CHRISCO Digital Academy Desk", PRIMARY_EMAIL),
            ("Capstone Submission", "CHRISCO Youth Aflame Mentors", SECONDARY_EMAIL),
            ("Peer Accountability", "CHRISCO Fellowship Study Hubs", "Monthly Cohort Check-In"),
        ],
        row_h=24.5,
    )

    draw_page_num(c, 15, side="right", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 16: BACK COVER (Exact COURSES PDF.pdf Page 26 — Gmail Only!)
    # =========================================================================
    draw_plate(c, "plate_back_cover.jpg")
    draw_brand_lockup(c, 59.5, 56.0, dark_bg=True)

    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat", 35.0)
    c.drawString(59.5, Y(498.0), "Equipping")
    c.drawString(59.5, Y(542.0), "Youth, Elevating")
    c.drawString(59.5, Y(586.0), "Purpose")

    # Vertical cyan divider lines matching Page 26 of COURSES PDF.pdf
    c.setStrokeColor(HexColor(CYAN_ACCENT))
    c.setLineWidth(1.5)
    c.line(59.5, Y(646.0), 59.5, Y(708.0))
    c.line(316.0, Y(646.0), 316.0, Y(708.0))

    # Left contact block (Brand & Umbrella Fellowship — ZERO phone numbers)
    c.setFont("Montserrat-Bold", 10.5)
    c.drawString(72.0, Y(658.0), "CHRISCO Youth Aflame")
    c.setFont("Montserrat", 9.3)
    c.drawString(72.0, Y(676.0), "CHRISCO Digital Academy")
    c.drawString(72.0, Y(694.0), "Under CHRISCO FELLOWSHIP OF CHURCHES")

    # Right contact block (Gmail contacts ONLY)
    c.setFont("Montserrat-Bold", 10.5)
    c.drawString(328.0, Y(658.0), "Official Gmail Contacts")
    c.setFont("Montserrat", 9.5)
    c.drawString(328.0, Y(676.0), PRIMARY_EMAIL)
    c.drawString(328.0, Y(694.0), SECONDARY_EMAIL)

    # Clean white bottom strip (y=755..805)
    c.setFillColor(HexColor(INK))
    c.setFont("Montserrat", 8.4)
    c.drawString(59.5, Y(768.0), f"Official Course E-Book for {title} ({meta['track']}).")
    c.drawString(59.5, Y(783.0), "Prepared by CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES.")
    c.drawString(59.5, Y(798.0), f"For course guidance or mentorship, email {PRIMARY_EMAIL}.")
    c.setFont("Montserrat-Bold", 8.8)
    c.drawRightString(536.0, Y(798.0), "CHRISCO Youth Aflame")
    c.restoreState()

    c.showPage()
    c.save()
    return out_path


def main() -> None:
    register_fonts()
    # Combine all 19 courses (preserving unique slugs)
    by_slug = {}
    for b in ORIG_BOOKS:
        by_slug[b["slug"]] = b
    for b in NEW_BOOKS:
        by_slug[b["slug"]] = b

    assert len(by_slug) == 19, f"Expected 19 courses, got {len(by_slug)}"
    total_kb = 0.0
    for idx, (slug, book) in enumerate(sorted(by_slug.items()), 1):
        out_p = build_single_course_pdf(book)
        kb = os.path.getsize(out_p) / 1024.0
        total_kb += kb
        print(f"  [{idx:02d}/19] Built {slug}.pdf ({kb:.1f} KB)")
    print(f"\nCompleted all 19 Course E-Books! Total combined size: {total_kb/1024.0:.2f} MB")


if __name__ == "__main__":
    main()
