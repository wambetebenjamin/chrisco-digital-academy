#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build all 19 CHRISCO Digital Academy / CHRISCO Youth Aflame Course E-Books
(`content/books/<slug>.pdf`) as spacious, deeply explained, 28-page Illustrated
Course Handbooks replicating `COURSES PDF.pdf`.

Key guarantees:
- 28 spacious pages per book (2 full pages for EVERY one of the 8 chapters — NEVER squeezed!).
- Detailed plain-English explanations + 8 custom vector explanatory diagrams per book
  + 100% real, non-AI, watermark-free Pexels photographs of modestly dressed Africans.
- Brand: CHRISCO Youth Aflame (CHRISCO Digital Academy) under CHRISCO FELLOWSHIP OF CHURCHES.
- Contacts: Gmail only (chriscoyouthaflame2025@gmail.com & shambetz@gmail.com) — ZERO phone numbers.
"""

import hashlib
import os
import sys
from xml.sax.saxutils import escape

from PIL import Image, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
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
OUT_DIR = os.path.join(REPO_ROOT, "content", "books")
CACHE_DIR = "/tmp/chrisco_courses_pdf_cache_28p"
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
LAVENDER_BORDER = "#B6BEF2"
GRAY_CARD = "#F4F5FA"
CYAN_ACCENT = "#25D0C6"
LIME_ACCENT = "#7CE393"
GOLD_RULE = "#F2C94C"
INK = "#111629"
MUTED = "#4B5268"
WHITE = "#FFFFFF"

PRIMARY_EMAIL = "chriscoyouthaflame2025@gmail.com"
SECONDARY_EMAIL = "shambetz@gmail.com"

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

TRACK_META = {
    "youtube-automation": {
        "track": "Video & Creator Economy Track",
        "duration": "8 Weeks",
        "level": "Beginner to Pro",
        "domain_noun": "channel system",
        "photos": [
            "course_podcast_creator.jpg",
            "course_camera_creator.jpg",
            "course_abuja_photographer.jpg",
            "course_woman_desk_notes.jpg",
            "real_study_pair_side.jpg",
            "real_joyful_fellowship_group.jpg",
            "real_blazer_journaling.jpg",
            "course_woman_white_blouse_laptop.jpg",
        ],
    },
    "ai-video-storytelling": {
        "track": "Video & Creative AI Track",
        "duration": "6 Weeks",
        "level": "Beginner",
        "domain_noun": "visual story",
        "photos": [
            "course_camera_creator.jpg",
            "course_abuja_photographer.jpg",
            "course_podcast_creator.jpg",
            "real_study_pair_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_lagos_celebration_group.jpg",
            "real_quiet_desk_notes.jpg",
            "real_blazer_journaling.jpg",
        ],
    },
    "python-programming": {
        "track": "Coding & Software Engineering Track",
        "duration": "8 Weeks",
        "level": "Beginner",
        "domain_noun": "Python program",
        "photos": [
            "course_coding_dual_screen.jpg",
            "course_coding_developer.jpg",
            "real_study_pair_side.jpg",
            "course_woman_desk_notes.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_seminar_side.jpg",
            "course_exec_outdoor_laptop.jpg",
        ],
    },
    "swe-llm-mastery": {
        "track": "Software Engineering & AI Systems Track",
        "duration": "10 Weeks",
        "level": "Intermediate",
        "domain_noun": "production AI feature",
        "photos": [
            "course_coding_developer.jpg",
            "course_coding_dual_screen.jpg",
            "course_woman_desk_notes.jpg",
            "real_study_pair_side.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_overcoat_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
        ],
    },
    "ai-literacy": {
        "track": "AI & Workplace Productivity Track",
        "duration": "5 Weeks",
        "level": "Beginner",
        "domain_noun": "AI workflow",
        "photos": [
            "course_woman_white_blouse_laptop.jpg",
            "course_coding_dual_screen.jpg",
            "real_study_pair_side.jpg",
            "course_woman_desk_notes.jpg",
            "real_lagos_boardroom.jpg",
            "real_blazer_journaling.jpg",
            "real_seminar_side.jpg",
            "course_exec_outdoor_laptop.jpg",
        ],
    },
    "print-on-demand": {
        "track": "Design & Digital Commerce Track",
        "duration": "8 Weeks",
        "level": "Beginner",
        "domain_noun": "merchandise storefront",
        "photos": [
            "course_pod_apparel.jpg",
            "real_blazer_journaling.jpg",
            "course_woman_desk_notes.jpg",
            "course_abuja_photographer.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_quiet_desk_notes.jpg",
            "real_study_pair_side.jpg",
        ],
    },
    "communicate-like-a-ceo": {
        "track": "Executive Leadership & Communication Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "domain_noun": "executive message",
        "photos": [
            "course_exec_pitch_call.jpg",
            "real_seminar_side.jpg",
            "real_council_sisters.jpg",
            "course_whiteboard_trainer.jpg",
            "real_plaid_suit_side.jpg",
            "real_lagos_boardroom.jpg",
            "real_overcoat_side.jpg",
            "real_suited_window_side.jpg",
        ],
    },
    "negotiation": {
        "track": "Business Strategy & Deal-Making Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "domain_noun": "negotiation agreement",
        "photos": [
            "real_council_sisters.jpg",
            "real_plaid_suit_side.jpg",
            "course_exec_pitch_call.jpg",
            "real_lagos_boardroom.jpg",
            "real_suited_window_side.jpg",
            "real_joyful_fellowship_group.jpg",
            "real_blazer_journaling.jpg",
            "real_seminar_side.jpg",
        ],
    },
    "personal-branding": {
        "track": "Leadership & Authority Positioning Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "domain_noun": "authority reputation",
        "photos": [
            "course_exec_outdoor_laptop.jpg",
            "course_podcast_creator.jpg",
            "real_plaid_suit_side.jpg",
            "course_abuja_photographer.jpg",
            "real_blazer_journaling.jpg",
            "real_lagos_celebration_group.jpg",
            "real_seminar_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
        ],
    },
    "networking-secrets": {
        "track": "Leadership & Relationship Capital Track",
        "duration": "5 Weeks",
        "level": "All Levels",
        "domain_noun": "trusted relationship network",
        "photos": [
            "real_joyful_fellowship_group.jpg",
            "real_seminar_side.jpg",
            "real_lagos_celebration_group.jpg",
            "real_council_sisters.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_overcoat_side.jpg",
            "real_plaid_suit_side.jpg",
        ],
    },
    "ghostwriting": {
        "track": "Editorial Writing & Publishing Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "domain_noun": "client manuscript",
        "photos": [
            "real_modest_prayer_journal.jpg",
            "real_blazer_journaling.jpg",
            "lesson2_contemplation.jpg",
            "real_quiet_desk_notes.jpg",
            "course_woman_desk_notes.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_seminar_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
        ],
    },
    "copywriting": {
        "track": "Persuasive Writing & Conversion Track",
        "duration": "8 Weeks",
        "level": "Beginner to Pro",
        "domain_noun": "conversion copy asset",
        "photos": [
            "real_blazer_journaling.jpg",
            "real_quiet_desk_notes.jpg",
            "course_woman_desk_notes.jpg",
            "real_modest_prayer_journal.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "lesson2_contemplation.jpg",
            "course_exec_outdoor_laptop.jpg",
        ],
    },
    "freelancing": {
        "track": "Independent Consulting & Remote Work Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "domain_noun": "client service practice",
        "photos": [
            "real_overcoat_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "course_exec_outdoor_laptop.jpg",
            "course_exec_pitch_call.jpg",
            "real_blazer_journaling.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_desk_notes.jpg",
            "real_council_sisters.jpg",
        ],
    },
    "content-creation": {
        "track": "Digital Media & Audience Growth Track",
        "duration": "6 Weeks",
        "level": "Beginner",
        "domain_noun": "content engine",
        "photos": [
            "course_podcast_creator.jpg",
            "course_abuja_photographer.jpg",
            "course_camera_creator.jpg",
            "real_blazer_journaling.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_study_pair_side.jpg",
            "course_woman_desk_notes.jpg",
        ],
    },
    "sales-and-marketing": {
        "track": "Revenue Growth & Go-To-Market Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "domain_noun": "customer acquisition system",
        "photos": [
            "course_whiteboard_trainer.jpg",
            "course_exec_pitch_call.jpg",
            "real_lagos_boardroom.jpg",
            "real_council_sisters.jpg",
            "real_joyful_fellowship_group.jpg",
            "real_plaid_suit_side.jpg",
            "course_woman_desk_notes.jpg",
            "course_exec_outdoor_laptop.jpg",
        ],
    },
    "digital-marketing": {
        "track": "Growth Marketing & Analytics Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "domain_noun": "digital campaign",
        "photos": [
            "real_lagos_boardroom.jpg",
            "course_woman_desk_notes.jpg",
            "course_whiteboard_trainer.jpg",
            "real_study_pair_side.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_council_sisters.jpg",
            "real_blazer_journaling.jpg",
            "course_exec_pitch_call.jpg",
        ],
    },
    "email-marketing": {
        "track": "Retention & Direct Response Track",
        "duration": "6 Weeks",
        "level": "All Levels",
        "domain_noun": "subscriber sequence",
        "photos": [
            "course_woman_desk_notes.jpg",
            "real_quiet_desk_notes.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_blazer_journaling.jpg",
            "course_exec_outdoor_laptop.jpg",
            "real_lagos_boardroom.jpg",
            "real_modest_prayer_journal.jpg",
            "real_study_pair_side.jpg",
        ],
    },
    "affiliate-marketing": {
        "track": "Partner Commerce & Digital Funnels Track",
        "duration": "8 Weeks",
        "level": "Beginner to Pro",
        "domain_noun": "recommendation funnel",
        "photos": [
            "real_study_pair_side.jpg",
            "course_exec_outdoor_laptop.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "course_podcast_creator.jpg",
            "real_lagos_celebration_group.jpg",
            "course_woman_desk_notes.jpg",
            "real_overcoat_side.jpg",
            "real_blazer_journaling.jpg",
        ],
    },
    "social-media-marketing": {
        "track": "Brand Community & Social Strategy Track",
        "duration": "8 Weeks",
        "level": "All Levels",
        "domain_noun": "community growth calendar",
        "photos": [
            "real_lagos_celebration_group.jpg",
            "course_podcast_creator.jpg",
            "real_joyful_fellowship_group.jpg",
            "course_camera_creator.jpg",
            "real_council_sisters.jpg",
            "course_woman_white_blouse_laptop.jpg",
            "real_blazer_journaling.jpg",
            "course_abuja_photographer.jpg",
        ],
    },
}


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


def crop_cached(img_path: str, w_pt: float, h_pt: float, focus=(0.5, 0.35), dpi_scale=1.9) -> str:
    mtime = os.path.getmtime(img_path)
    key = f"{os.path.abspath(img_path)}_{mtime:.2f}_{w_pt:.1f}_{h_pt:.1f}_{focus[0]:.2f}_{focus[1]:.2f}_{dpi_scale:.1f}"
    digest = hashlib.md5(key.encode("utf-8")).hexdigest()[:14]
    out_p = os.path.join(CACHE_DIR, f"c_{digest}.jpg")
    if not os.path.exists(out_p):
        im = Image.open(img_path).convert("RGB")
        tw = max(100, int(round(w_pt * dpi_scale)))
        th = max(100, int(round(h_pt * dpi_scale)))
        fitted = ImageOps.fit(im, (tw, th), method=Image.Resampling.LANCZOS, centering=focus)
        fitted.save(out_p, "JPEG", quality=84, optimize=True)
    return out_p


def plate_cached(plate_name: str) -> str:
    src = os.path.join(GRAPHICS_DIR, plate_name)
    mtime = os.path.getmtime(src)
    key = f"plate_{plate_name}_{mtime:.2f}"
    digest = hashlib.md5(key.encode("utf-8")).hexdigest()[:12]
    out_p = os.path.join(CACHE_DIR, f"p_{digest}.jpg")
    if not os.path.exists(out_p):
        im = Image.open(src).convert("RGB")
        im = im.resize((int(W * 1.8), int(H * 1.8)), Image.Resampling.LANCZOS)
        im.save(out_p, "JPEG", quality=84, optimize=True)
    return out_p


def fill_white(c: canvas.Canvas) -> None:
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()


def draw_plate(c: canvas.Canvas, plate_name: str) -> None:
    c.drawImage(plate_cached(plate_name), 0, 0, width=W, height=H, mask=None)


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
    c.saveState()
    fg = WHITE if dark_bg else COBALT_HEAD
    sub = "#B9D4FF" if dark_bg else COBALT_DEEP
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


def draw_accent_bar(c: canvas.Canvas, x: float, y_top: float, w: float = 48.0, h: float = 2.5) -> None:
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
        c.drawString(52.0, Y(808.0), label)
    else:
        c.drawRightString(543.5, Y(808.0), label)
    if not on_dark:
        c.setFont("Montserrat-Medium", 7.5)
        c.setFillColor(HexColor("#7B839E"))
        if side == "left":
            c.drawRightString(543.5, Y(808.0), f"CHRISCO Youth Aflame  |  {PRIMARY_EMAIL}")
        else:
            c.drawString(52.0, Y(808.0), f"CHRISCO Youth Aflame  |  {PRIMARY_EMAIL}")
    c.restoreState()


def style(name: str, font="Montserrat", size=10.0, leading=15.6, color=INK, align=TA_LEFT, after=6.0) -> ParagraphStyle:
    return ParagraphStyle(
        name=name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=HexColor(color),
        alignment=align,
        spaceAfter=after,
    )


def draw_para(c: canvas.Canvas, html: str, st: ParagraphStyle, x: float, y_top: float, w: float, max_h: float = 420.0) -> float:
    p = Paragraph(html, st)
    _, h = p.wrap(w, max_h)
    if h > max_h:
        tight = ParagraphStyle(
            name=st.name + "_t",
            parent=st,
            fontSize=max(8.4, st.fontSize - 0.8),
            leading=max(12.2, st.leading - 1.4),
        )
        p = Paragraph(html, tight)
        _, h = p.wrap(w, max_h)
    p.drawOn(c, x, Y(y_top + h))
    return h


def draw_arrow_right(c: canvas.Canvas, x1: float, x2: float, y_top: float, color: str = CYAN_ACCENT) -> None:
    c.saveState()
    c.setStrokeColor(HexColor(color))
    c.setFillColor(HexColor(color))
    c.setLineWidth(2.2)
    yy = Y(y_top)
    c.line(x1, yy, x2 - 6, yy)
    path = c.beginPath()
    path.moveTo(x2, yy)
    path.lineTo(x2 - 8, yy + 4.5)
    path.lineTo(x2 - 8, yy - 4.5)
    path.close()
    c.drawPath(path, stroke=0, fill=1)
    c.restoreState()


def draw_chapter_vector_illustration(
    c: canvas.Canvas,
    mod_idx: int,
    ch: dict,
    course_title: str,
    domain_noun: str,
    x: float,
    y_top: float,
    w: float,
    h: float,
) -> None:
    """Draw a spacious, custom vector explanatory diagram illustrating the chapter's mental model."""
    c.saveState()
    c.setFillColor(HexColor(LAVENDER_CARD))
    c.roundRect(x, Y(y_top + h), w, h, 12.0, stroke=0, fill=1)
    c.setStrokeColor(HexColor(LAVENDER_BORDER))
    c.setLineWidth(1.0)
    c.roundRect(x, Y(y_top + h), w, h, 12.0, stroke=1, fill=0)

    # Top label inside diagram frame
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 8.5)
    c.drawString(x + 18.0, Y(y_top + 22.0), f"VISUAL CONCEPT DIAGRAM  •  MODULE 0{mod_idx}: {ch['title'].upper()[:46]}")
    c.restoreState()
    draw_accent_bar(c, x + 18.0, y_top + 28.0, 62.0, 2.2)

    tks = ch.get("takeaways", [])
    t0 = tks[0] if len(tks) > 0 else ch["title"]
    t1 = tks[1] if len(tks) > 1 else "Apply structured daily practice"
    t2 = tks[2] if len(tks) > 2 else "Verify output against real user value"

    kind = (mod_idx - 1) % 4

    if kind == 0:
        # ARCHETYPE 0: 3-Stage Process Architecture Pipeline (Understand -> Build -> Verify)
        bw = (w - 64.0) / 3.0
        bh = h - 58.0
        by = y_top + 42.0
        stages = [
            ("STAGE 01  •  INPUT", "Clarify Principle", t0, WHITE, INK),
            ("STAGE 02  •  PROCESS", "Deliberate Execution", t1, WHITE, INK),
            ("STAGE 03  •  OUTPUT", f"Working {domain_noun.title()}", t2, COBALT_PANEL, WHITE),
        ]
        for i, (tag, head, desc, bg, fg) in enumerate(stages):
            bx = x + 18.0 + i * (bw + 14.0)
            c.saveState()
            c.setFillColor(HexColor(bg))
            c.roundRect(bx, Y(by + bh), bw, bh, 10.0, stroke=0, fill=1)
            if bg == WHITE:
                c.setStrokeColor(HexColor(COBALT_HEAD))
                c.setLineWidth(1.0)
                c.roundRect(bx, Y(by + bh), bw, bh, 10.0, stroke=1, fill=0)
            c.setFillColor(HexColor(CYAN_ACCENT if i < 2 else LIME_ACCENT))
            c.roundRect(bx + 10.0, Y(by + 26.0), bw - 20.0, 16.0, 8.0, stroke=0, fill=1)
            c.setFillColor(HexColor(COBALT_DEEP))
            c.setFont("Montserrat-Bold", 7.2)
            c.drawCentredString(bx + bw / 2.0, Y(by + 20.5), tag)
            c.restoreState()

            st_h = style(f"dh0_{i}", "Montserrat-Bold", 9.2, 12.5, fg if bg != WHITE else COBALT_HEAD, TA_CENTER, 4)
            st_d = style(f"dd0_{i}", "Montserrat", 8.3, 12.2, fg, TA_CENTER, 0)
            yh = draw_para(c, clean_text(head), st_h, bx + 8.0, by + 35.0, bw - 16.0, 30.0)
            draw_para(c, clean_text(desc), st_d, bx + 8.0, by + 39.0 + yh, bw - 16.0, bh - 48.0 - yh)
            if i < 2:
                draw_arrow_right(c, bx + bw + 2.0, bx + bw + 12.0, by + bh / 2.0, COBALT_HEAD)

    elif kind == 1:
        # ARCHETYPE 1: 3-Tier Mastery Pyramid (Foundation -> Repeatable System -> Compounding Result)
        tiers = [
            ("TIER 03  •  MASTERY", t2, 250.0, COBALT_PANEL, WHITE),
            ("TIER 02  •  CONSISTENCY", t1, 345.0, "#DDE2FF", INK),
            ("TIER 01  •  FOUNDATION", t0, w - 40.0, WHITE, INK),
        ]
        ty = y_top + 42.0
        th = (h - 62.0) / 3.0 - 5.0
        for i, (tag, txt, tw, bg, fg) in enumerate(tiers):
            tx = x + (w - tw) / 2.0
            c.saveState()
            c.setFillColor(HexColor(bg))
            c.roundRect(tx, Y(ty + th), tw, th, 8.0, stroke=0, fill=1)
            if bg != COBALT_PANEL:
                c.setStrokeColor(HexColor(COBALT_HEAD))
                c.setLineWidth(1.0)
                c.roundRect(tx, Y(ty + th), tw, th, 8.0, stroke=1, fill=0)
            c.restoreState()
            tag_col = LIME_ACCENT if bg == COBALT_PANEL else COBALT_HEAD
            st_t = style(f"pyr_{i}", "Montserrat", 8.5, 12.2, fg, TA_CENTER, 0)
            draw_para(
                c,
                f"<b><font color='{tag_col}'>{tag}:</font></b>  {clean_text(txt)}",
                st_t,
                tx + 12.0,
                ty + 9.0,
                tw - 24.0,
                th - 12.0,
            )
            ty += th + 7.0

    elif kind == 2:
        # ARCHETYPE 2: Common Beginner Trap vs Practitioner Standard (Side-by-Side Visual Contrast)
        cw = (w - 52.0) / 2.0
        ch_h = h - 56.0
        cy = y_top + 42.0
        cols = [
            (
                "COMMON BEGINNER MISTAKE",
                "Rushing without structure, copying surface trends blindly, and skipping hands-on testing before moving to the next topic.",
                f"Outcome: Fragile {domain_noun} that stalls under real conditions.",
                WHITE,
                INK,
                "#E05252",
            ),
            (
                "PRACTITIONER STANDARD",
                f"{t0} Paired with {t1.lower() if len(t1) > 3 else t1}",
                f"Outcome: Reliable {domain_noun} ready for real clients & growth.",
                COBALT_PANEL,
                WHITE,
                CYAN_ACCENT,
            ),
        ]
        for i, (head, main_txt, foot_txt, bg, fg, badge) in enumerate(cols):
            cx = x + 18.0 + i * (cw + 16.0)
            c.saveState()
            c.setFillColor(HexColor(bg))
            c.roundRect(cx, Y(cy + ch_h), cw, ch_h, 10.0, stroke=0, fill=1)
            if bg == WHITE:
                c.setStrokeColor(HexColor("#D9DCEB"))
                c.setLineWidth(1.1)
                c.roundRect(cx, Y(cy + ch_h), cw, ch_h, 10.0, stroke=1, fill=0)
            c.setFillColor(HexColor(badge))
            c.roundRect(cx + 12.0, Y(cy + 28.0), cw - 24.0, 18.0, 9.0, stroke=0, fill=1)
            c.setFillColor(HexColor(WHITE if i == 0 else COBALT_DEEP))
            c.setFont("Montserrat-Bold", 7.4)
            c.drawCentredString(cx + cw / 2.0, Y(cy + 21.8), head)
            c.restoreState()

            st_m = style(f"cm_{i}", "Montserrat", 8.5, 12.6, fg, TA_LEFT, 6)
            st_f = style(f"cf_{i}", "Montserrat-Bold", 8.2, 11.8, LIME_ACCENT if i == 1 else "#B43C3C", TA_LEFT, 0)
            uh = draw_para(c, clean_text(main_txt), st_m, cx + 14.0, cy + 36.0, cw - 28.0, ch_h - 68.0)
            draw_para(c, clean_text(foot_txt), st_f, cx + 14.0, cy + 42.0 + uh, cw - 28.0, 32.0)

    else:
        # ARCHETYPE 3: 4-Step Continuous Feedback & Mastery Loop
        bw = (w - 54.0) / 2.0
        bh = (h - 64.0) / 2.0
        quads = [
            ("01  •  FRAME", t0),
            ("02  •  EXECUTE", ch["practice"]),
            ("03  •  MEASURE", t1),
            ("04  •  REFINE", t2),
        ]
        for i, (q_tag, q_txt) in enumerate(quads):
            qx = x + 18.0 + (i % 2) * (bw + 18.0)
            qy = y_top + 42.0 + (i // 2) * (bh + 10.0)
            is_hi = i in (1, 3)
            c.saveState()
            c.setFillColor(HexColor(COBALT_PANEL if is_hi else WHITE))
            c.roundRect(qx, Y(qy + bh), bw, bh, 9.0, stroke=0, fill=1)
            if not is_hi:
                c.setStrokeColor(HexColor(COBALT_HEAD))
                c.setLineWidth(1.0)
                c.roundRect(qx, Y(qy + bh), bw, bh, 9.0, stroke=1, fill=0)
            c.restoreState()
            fg = WHITE if is_hi else INK
            tag_c = LIME_ACCENT if is_hi else COBALT_HEAD
            st_q = style(f"fq_{i}", "Montserrat", 8.1, 11.6, fg, TA_LEFT, 0)
            draw_para(
                c,
                f"<b><font color='{tag_c}'>{q_tag}</font></b><br/>{clean_text(q_txt)}",
                st_q,
                qx + 12.0,
                qy + 8.0,
                bw - 24.0,
                bh - 14.0,
            )


def draw_lavender_table(c: canvas.Canvas, x: float, y_top: float, col_widths, headers, rows, row_h: float = 26.0) -> float:
    total_w = sum(col_widths)
    c.saveState()
    c.setFillColor(HexColor(LAVENDER_TH))
    c.rect(x, Y(y_top + row_h), total_w, row_h, stroke=0, fill=1)

    cx = x
    for idx, h_txt in enumerate(headers):
        cw = col_widths[idx]
        st_h = style(f"th_{idx}", "Montserrat-Bold", 8.8, 11.5, INK, align=TA_CENTER)
        p = Paragraph(clean_text(h_txt), st_h)
        _, ph = p.wrap(cw - 10, row_h)
        p.drawOn(c, cx + 5, Y(y_top + (row_h + ph) / 2.0 - 1.5))
        cx += cw

    cur_y = y_top + row_h
    row_heights = []
    for r_idx, row in enumerate(rows):
        cell_paras = []
        actual_h = row_h
        for c_idx, val in enumerate(row):
            cw = col_widths[c_idx]
            align = TA_LEFT if c_idx in (0, 1) and len(str(val)) > 22 else TA_CENTER
            font = "Montserrat-SemiBold" if c_idx == 0 else "Montserrat"
            st_c = style(f"tc_{r_idx}_{c_idx}", font, 8.6, 12.2, INK, align=align)
            p = Paragraph(clean_text(str(val)), st_c)
            _, ph = p.wrap(cw - 14, 95)
            actual_h = max(actual_h, ph + 11.0)
            cell_paras.append((p, ph, cw))
        row_heights.append(actual_h)

        if r_idx % 2 == 1:
            c.setFillColor(HexColor("#FAFBFF"))
            c.rect(x, Y(cur_y + actual_h), total_w, actual_h, stroke=0, fill=1)

        cx = x
        for p, ph, cw in cell_paras:
            p.drawOn(c, cx + 7, Y(cur_y + (actual_h + ph) / 2.0 - 1.4))
            cx += cw
        cur_y += actual_h

    total_h = cur_y - y_top
    c.setStrokeColor(HexColor("#AEB6F0"))
    c.setLineWidth(0.8)
    c.rect(x, Y(cur_y), total_w, total_h, stroke=1, fill=0)

    vx = x
    for cw in col_widths[:-1]:
        vx += cw
        c.line(vx, Y(y_top), vx, Y(cur_y))

    hy = y_top + row_h
    c.line(x, Y(hy), x + total_w, Y(hy))
    for rh in row_heights[:-1]:
        hy += rh
        c.line(x, Y(hy), x + total_w, Y(hy))

    c.restoreState()
    return total_h


def split_cover_title(title: str):
    words = title.split()
    lines, cur = [], ""
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
        lines.extend(["Course", "Handbook"])
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
    draw_para(c, clean_text(sub_line), st_subdiv, 96.0, ty - 22.0, 430.0, 46.0)
    draw_page_num(c, pno, side="right", on_dark=True)
    c.showPage()


def render_chapter_spread(
    c: canvas.Canvas,
    mod_num: int,
    sec_label: str,
    ch: dict,
    course_title: str,
    meta: dict,
    photo_name: str,
    page_a: int,
    page_b: int,
) -> None:
    """Render TWO spacious, unhurried, deeply explained & illustrated pages for a single chapter."""
    domain_noun = meta["domain_noun"]

    # -------------------------------------------------------------------------
    # PAGE A: Deep-Dive Concept Explanation + Custom Vector Illustration
    # -------------------------------------------------------------------------
    fill_white(c)

    # Top subtle module eyebrow + large Cobalt Title
    c.saveState()
    c.setFillColor(HexColor(CYAN_ACCENT))
    c.roundRect(68.0, Y(74.0), 116.0, 20.0, 10.0, stroke=0, fill=1)
    c.setFillColor(HexColor(COBALT_DEEP))
    c.setFont("Montserrat-Bold", 8.0)
    c.drawCentredString(68.0 + 58.0, Y(67.2), f"MODULE 0{mod_num}  •  PART 1")

    title_str = f"{sec_label}  {ch['title']}"
    tsz = 19.5
    while pdfmetrics.stringWidth(title_str, "Montserrat-Bold", tsz) > 460.0 and tsz > 14.5:
        tsz -= 0.5
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", tsz)
    c.drawString(68.0, Y(108.0), title_str)
    c.restoreState()
    draw_accent_bar(c, 68.0, 117.0, 64.0, 2.6)

    # Spacious 10.1pt prose paragraphs + expanded "Why This Matters in Practice" deep-dive paragraph
    st_prose = style(f"chp_{mod_num}", "Montserrat", 10.1, 16.0, INK, align=TA_JUSTIFY, after=10.0)
    yc = 134.0
    for para in ch["body"]:
        yc += draw_para(c, clean_text(para), st_prose, 68.0, yc, 460.0, 145.0) + 10.0

    # Deep-dive pedagogical unpacking so the learner understands the 'why' and 'how' without rush
    tks = ch.get("takeaways", [])
    deep_unpack = (
        f"<b>Why This Principle Matters in Depth:</b> Many learners read about <i>{clean_text(ch['title'].lower())}</i> "
        f"at a surface level, yet struggle when building a real {clean_text(domain_noun)}. Notice the underlying logic: "
        f"when you anchor your work around the rule that <b>{clean_text(tks[0].lower() if tks else ch['title'].lower())}</b>, "
        f"you remove guesswork and build repeatable confidence. Take time to study the visual concept diagram below "
        f"before moving to the worked case study on the next page."
    )
    yc += draw_para(c, deep_unpack, st_prose, 68.0, yc, 460.0, 130.0) + 16.0

    # Custom Vector Concept Diagram filling the spacious lower canvas (h = 228..255 pt)
    diag_y = max(yc, 470.0)
    diag_h = max(205.0, 764.0 - diag_y)
    draw_chapter_vector_illustration(
        c,
        mod_num,
        ch,
        course_title,
        domain_noun,
        68.0,
        diag_y,
        460.0,
        diag_h,
    )

    draw_page_num(c, page_a, side="left" if page_a % 2 == 0 else "right", on_dark=False)
    c.showPage()

    # -------------------------------------------------------------------------
    # PAGE B: Real Practitioner Photo + Worked Field Case + Step-by-Step Lab
    # -------------------------------------------------------------------------
    fill_white(c)

    # Top Real African Practitioner Banner + Cobalt Case Header
    draw_photo(c, photo_name, 68.0, 56.0, 216.0, 186.0)
    c.saveState()
    c.setFillColor(HexColor(COBALT_PANEL))
    c.rect(284.0, Y(242.0), 244.0, 186.0, stroke=0, fill=1)
    c.setFillColor(HexColor(LIME_ACCENT))
    c.setFont("Montserrat-Bold", 8.2)
    c.drawString(302.0, Y(78.0), f"MODULE 0{mod_num}  •  WORKED CASE STUDY")
    c.restoreState()
    draw_accent_bar(c, 302.0, 85.0, 48.0, 2.2)

    st_case = style(f"cs_{mod_num}", "Montserrat", 9.3, 14.5, WHITE, align=TA_LEFT, after=6.0)
    draw_para(
        c,
        f"<b>Real-World Scenario:</b><br/>{clean_text(ch['example'])}",
        st_case,
        302.0,
        96.0,
        210.0,
        138.0,
    )

    # Unpacking the Case Lesson (spacious 10pt explanation)
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 15.5)
    c.drawString(68.0, Y(274.0), "How to Apply This Lesson Step by Step")
    c.restoreState()

    unpack_case = (
        f"Look closely at why the example above succeeded: instead of waiting for perfect conditions, "
        f"the practitioner focused on one concrete deliverable and tested it in the real world. "
        f"Use the guided assignment below to build the exact same muscle in your own <b>{clean_text(course_title)}</b> workbook."
    )
    uh = draw_para(c, unpack_case, st_prose, 68.0, 288.0, 460.0, 95.0)

    # Guided Lab Card (Lavender Soft Box with generous padding)
    lab_y = 298.0 + uh
    lab_h = 176.0
    c.saveState()
    c.setFillColor(HexColor(LAVENDER_CARD))
    c.roundRect(68.0, Y(lab_y + lab_h), 460.0, lab_h, 12.0, stroke=0, fill=1)
    c.setStrokeColor(HexColor(COBALT_HEAD))
    c.setLineWidth(1.2)
    c.line(68.0 + 18.0, Y(lab_y + 42.0), 528.0 - 18.0, Y(lab_y + 42.0))
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 11.2)
    c.drawString(88.0, Y(lab_y + 28.0), f"HANDS-ON LAB ASSIGNMENT  •  MODULE 0{mod_num}")
    c.restoreState()

    st_lab = style(f"lb_{mod_num}", "Montserrat-Medium", 9.8, 15.2, INK, align=TA_LEFT, after=8.0)
    lab_html = (
        f"<b>Your Practical Task:</b> {clean_text(ch['practice'])}<br/><br/>"
        f"<b>Self-Check Before Moving On:</b> Write down what worked, what felt unclear, and one specific "
        f"improvement you will make on your second repetition. Competence comes from completed reps, never passive reading."
    )
    draw_para(c, lab_html, st_lab, 88.0, lab_y + 52.0, 420.0, lab_h - 62.0)

    # Spacious 01 / 02 / 03 Key Takeaways Strip at bottom (modeled on Page 6/7 of COURSES PDF.pdf)
    tk_y = lab_y + lab_h + 28.0
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 14.5)
    c.drawString(68.0, Y(tk_y), f"Module 0{mod_num} Key Takeaways")
    c.restoreState()

    for idx, tk_txt in enumerate(tks[:3]):
        tx = 68.0 + idx * 158.0
        ty_box = tk_y + 14.0
        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat", 20.0)
        c.drawString(tx, Y(ty_box + 18.0), f"0{idx+1}")
        c.restoreState()
        draw_accent_bar(c, tx, ty_box + 25.0, 42.0, 2.4)
        st_tk = style(f"tk_{mod_num}_{idx}", "Montserrat-Medium", 9.2, 13.8, INK)
        draw_para(c, clean_text(tk_txt), st_tk, tx, ty_box + 34.0, 142.0, 95.0)

    draw_page_num(c, page_b, side="left" if page_b % 2 == 0 else "right", on_dark=False)
    c.showPage()


def build_single_course_pdf(book: dict) -> str:
    slug = book["slug"]
    title = book["title"]
    subtitle = book["subtitle"]
    promise = book["promise"]
    foreword = book["foreword"]
    chapters = book["chapters"]

    meta = TRACK_META[slug]
    photos = meta["photos"]
    out_path = os.path.join(OUT_DIR, f"{slug}.pdf")

    c = canvas.Canvas(out_path, pagesize=(W, H))
    c.setTitle(f"{title} | CHRISCO Youth Aflame 28-Page Illustrated Course Handbook")
    c.setAuthor("CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES")
    c.setSubject(f"CHRISCO Digital Academy Official Illustrated Course E-Book: {title}")

    # =========================================================================
    # PAGE 01: COVER
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

    st_sub = style("cov_sub", "Montserrat", 14.5, 20.5, "#E8F0FF")
    draw_para(c, f'"{clean_text(subtitle)}"', st_sub, 59.5, ty - 14.0, 445.0, max_h=68.0)
    c.restoreState()

    draw_photo(c, photos[0], 0.0, 404.0, W, 268.0)

    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat", 9.6)
    c.drawString(59.5, Y(774.0), f"{meta['track']}  |  {meta['duration']}  |  {meta['level']}")
    c.drawRightString(536.0, Y(774.0), "28-Page Illustrated Edition")
    c.setFont("Montserrat-Bold", 9.8)
    c.drawString(59.5, Y(793.0), "Prepared by CHRISCO Youth Aflame")
    c.setFont("Montserrat", 9.4)
    c.drawString(248.0, Y(793.0), f"  |  {PRIMARY_EMAIL}")
    c.restoreState()
    c.showPage()

    # =========================================================================
    # PAGE 02: COURSE FOREWORD & PROMISE
    # =========================================================================
    draw_plate(c, "plate_overview.jpg")
    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat-Bold", 38.0)
    c.drawString(59.5, Y(92.0), "Course")
    c.drawString(59.5, Y(136.0), "Foreword")
    c.restoreState()

    draw_photo(c, photos[1], 59.5, 178.0, 224.0, 248.0)

    st_prom_lbl = style("pr_lbl", "Montserrat-Bold", 10.5, 14.0, COBALT_HEAD)
    draw_para(c, "THE PRACTITIONER PROMISE", st_prom_lbl, 312.0, 340.0, 228.0, 24.0)
    draw_accent_bar(c, 312.0, 358.0, 56.0, 2.5)
    st_prom = style("pr_txt", "Montserrat-Medium", 9.8, 15.0, INK)
    draw_para(c, clean_text(promise), st_prom, 312.0, 370.0, 228.0, 120.0)

    st_body = style("fw_b", "Montserrat", 9.8, 15.0, INK, align=TA_LEFT, after=8.0)
    ly = 446.0
    for para in foreword[:2]:
        ly += draw_para(c, clean_text(para), st_body, 59.5, ly, 232.0, 160.0) + 10.0

    ry = 495.0
    if len(foreword) > 2:
        ry += draw_para(c, clean_text(foreword[2]), st_body, 312.0, ry, 228.0, 130.0) + 12.0
    study_note = (
        f"Published by <b>CHRISCO Digital Academy</b> under <b>CHRISCO Youth Aflame</b> "
        f"(<i>CHRISCO Fellowship of Churches</i>), this expanded 28-page illustrated handbook "
        f"unpacks every module in spacious detail with visual diagrams, real East African case studies, "
        f"and step-by-step labs. Reach our mentorship desk anytime at <b>{PRIMARY_EMAIL}</b>."
    )
    ry += draw_para(c, study_note, st_body, 312.0, ry, 228.0, 150.0) + 10.0
    c.saveState()
    c.setStrokeColor(HexColor(GOLD_RULE))
    c.setLineWidth(1.6)
    c.line(312.0, Y(min(ry + 6.0, 748.0)), 520.0, Y(min(ry + 6.0, 748.0)))
    c.restoreState()

    draw_page_num(c, 2, side="left", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 03: KEY OUTCOMES
    # =========================================================================
    draw_plate(c, "plate_outcomes.jpg")
    draw_photo(c, photos[2], 0.0, 0.0, W, 336.0)

    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 20.5)
    c.drawString(96.0, Y(384.0), "Key Learning Outcomes")
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
        st_out = style(f"out_{idx}", "Montserrat-Medium", 9.5, 14.0, INK)
        ch_ref = chapters[idx * 2]
        out_txt = f"<b>{clean_text(ch_ref['title'])}:</b> {clean_text(outcomes_4[idx])}"
        draw_para(c, out_txt, st_out, ox, oy + 42.0, 198.0, 64.0)

    syn_left = (
        f"Across <b>{meta['duration']}</b> of structured practice, each of the 8 modules is given "
        f"a dedicated two-page spread: first unpacking the concept visually, then walking through "
        f"a real field scenario and hands-on lab."
    )
    syn_right = (
        f"By Module 08, you will have built and verified a complete <b>{clean_text(meta['domain_noun'])}</b> "
        f"ready to serve employers, clients, ministries, and communities with excellence."
    )
    draw_para(c, syn_left, st_body, 96.0, 654.0, 204.0, 118.0)
    draw_para(c, syn_right, st_body, 324.0, 654.0, 204.0, 118.0)

    draw_page_num(c, 3, side="right", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 04: TABLE OF CONTENTS (28-Page Map)
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
        ("01  Foundations & Core Mindset (Modules 1 to 2)", "05", 492.5),
        ("02  Core Frameworks & Strategy (Modules 3 to 4)", "10", 536.8),
        ("03  Execution & Applied Mastery (Modules 5 to 6)", "15", 581.5),
        ("04  Scaling & Capstone Project (Modules 7 to 8)", "20", 625.0),
        ("05  Complete Syllabus & Fellowship Reflections", "25", 669.2),
        ("06  90-Day Action Plan & Stewardship", "27", 713.8),
    ]
    for label, pg_str, row_y in toc_rows:
        c.setFont("Montserrat-Medium", 10.6)
        c.drawString(119.8, Y(row_y), label)
        c.setFont("Montserrat-Bold", 11.2)
        c.drawRightString(416.0, Y(row_y), pg_str)
    c.restoreState()

    draw_page_num(c, 4, side="left", on_dark=True)
    c.showPage()

    # =========================================================================
    # SECTION 01 (P05) + MODULES 1 & 2 (P06-P09)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_01.jpg",
        "01",
        ["Foundations &", "Core Mindset"],
        f"Module 01: {chapters[0]['title']}  |  Module 02: {chapters[1]['title']}",
        5,
    )
    render_chapter_spread(c, 1, "1.1", chapters[0], title, meta, photos[3], 6, 7)
    render_chapter_spread(c, 2, "1.2", chapters[1], title, meta, photos[4], 8, 9)

    # =========================================================================
    # SECTION 02 (P10) + MODULES 3 & 4 (P11-P14)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_02.jpg",
        "02",
        ["Core Frameworks", "& Strategy"],
        f"Module 03: {chapters[2]['title']}  |  Module 04: {chapters[3]['title']}",
        10,
    )
    render_chapter_spread(c, 3, "2.1", chapters[2], title, meta, photos[5], 11, 12)
    render_chapter_spread(c, 4, "2.2", chapters[3], title, meta, photos[6], 13, 14)

    # =========================================================================
    # SECTION 03 (P15) + MODULES 5 & 6 (P16-P19)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_04.jpg",
        "03",
        ["Execution &", "Applied Mastery"],
        f"Module 05: {chapters[4]['title']}  |  Module 06: {chapters[5]['title']}",
        15,
    )
    render_chapter_spread(c, 5, "3.1", chapters[4], title, meta, photos[7], 16, 17)
    render_chapter_spread(c, 6, "3.2", chapters[5], title, meta, photos[0], 18, 19)

    # =========================================================================
    # SECTION 04 (P20) + MODULES 7 & 8 (P21-P24)
    # =========================================================================
    render_section_divider(
        c,
        "plate_div_05.jpg",
        "04",
        ["Scaling, Capstone", "& Excellence"],
        f"Module 07: {chapters[6]['title']}  |  Module 08: {chapters[7]['title']}",
        20,
    )
    render_chapter_spread(c, 7, "4.1", chapters[6], title, meta, photos[2], 21, 22)
    render_chapter_spread(c, 8, "4.2", chapters[7], title, meta, photos[5], 23, 24)

    # =========================================================================
    # PAGE 25: COMPLETE 8-MODULE PRACTICE & SELF-AUDIT MATRIX (Spacious Full Page)
    # =========================================================================
    fill_white(c)
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 17.8)
    c.drawString(64.0, Y(72.0), "5.1  Complete 8-Module Practice & Competency Matrix")
    c.restoreState()
    draw_accent_bar(c, 64.0, 82.0, 62.0, 2.5)

    draw_para(
        c,
        f"Review every module in <b>{clean_text(title)}</b> using the table below. Check off each module only after "
        f"you have completed its hands-on assignment and verified your work against the core principle.",
        style("m25_ld", "Montserrat", 9.8, 15.0, MUTED),
        64.0,
        96.0,
        468.0,
        48.0,
    )

    mod_rows = [
        (f"Module 0{idx}", ch_item["title"], ch_item["takeaways"][0], "Completed  [   ]")
        for idx, ch_item in enumerate(chapters, 1)
    ]
    tbl_h = draw_lavender_table(
        c,
        64.0,
        152.0,
        [68.0, 146.0, 174.0, 80.0],
        ["Module", "Focus Topic", "Core Principle", "Workbook Check"],
        mod_rows,
        row_h=30.0,
    )

    # Bottom Capstone Readiness Note
    ready_y = max(152.0 + tbl_h + 24.0, 565.0)
    c.saveState()
    c.setFillColor(HexColor(LAVENDER_CARD))
    c.roundRect(64.0, Y(ready_y + 130.0), 468.0, 130.0, 12.0, stroke=0, fill=1)
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 12.0)
    c.drawString(84.0, Y(ready_y + 30.0), "CAPSTONE PORTFOLIO STANDARD")
    c.restoreState()
    draw_para(
        c,
        f"Before graduating from this handbook, combine all eight modules into one finished, shareable "
        f"<b>{clean_text(meta['domain_noun'])}</b>: <i>{clean_text(chapters[7]['practice'])}</i> "
        f"When ready for mentor feedback, email your work to <b>{PRIMARY_EMAIL}</b>.",
        style("cap25", "Montserrat", 9.6, 15.0, INK),
        84.0,
        ready_y + 42.0,
        428.0,
        78.0,
    )

    draw_page_num(c, 25, side="right", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 26: FELLOWSHIP REFLECTIONS & STUDY DISCIPLINES (Spacious Full Page)
    # =========================================================================
    draw_plate(c, "plate_bottom_wave.jpg")
    c.saveState()
    c.setFillColor(HexColor(COBALT_HEAD))
    c.setFont("Montserrat-Bold", 20.0)
    c.drawString(68.0, Y(72.0), "5.2  Applied Fellowship Case Reflections")
    c.restoreState()
    draw_accent_bar(c, 68.0, 82.0, 62.0, 2.5)

    draw_para(
        c,
        "Real transformation happens when learners turn theory into consistent service. Reflect on these "
        "cohort case highlights from across East Africa as you prepare your own project:",
        style("rf26_ld", "Montserrat", 9.8, 15.0, MUTED),
        68.0,
        96.0,
        460.0,
        44.0,
    )

    ref_cards = [
        (photos[6], f'"{clean_text(chapters[0]["example"])}"', "Cohort Case Reflection  |  Starting Strong in Module 01"),
        (photos[3], f'"{clean_text(chapters[3]["example"])}"', "Mid-Course Breakthrough  |  Applying Strategy in Module 04"),
        (photos[1], f'"{clean_text(chapters[7]["example"])}"', "Capstone Completion  |  Shipping Real Work in Module 08"),
    ]
    rc_y = 148.0
    for idx, (r_img, r_quote, r_attr) in enumerate(ref_cards):
        c.saveState()
        c.setFillColor(HexColor(GRAY_CARD))
        c.roundRect(68.0, Y(rc_y + 106.0), 460.0, 106.0, 8.0, stroke=0, fill=1)
        c.restoreState()
        if idx % 2 == 0:
            draw_photo(c, r_img, 412.0, rc_y + 11.0, 104.0, 84.0, radius=6.0)
            tx_x = 84.0
        else:
            draw_photo(c, r_img, 80.0, rc_y + 11.0, 104.0, 84.0, radius=6.0)
            tx_x = 198.0
        st_rq = style(f"rq26_{idx}", "Montserrat-Italic", 9.0, 13.6, INK)
        hq = draw_para(c, r_quote, st_rq, tx_x, rc_y + 14.0, 314.0, 66.0)
        st_ra = style(f"ra26_{idx}", "Montserrat-Bold", 8.3, 11.5, COBALT_HEAD)
        draw_para(c, r_attr, st_ra, tx_x, rc_y + 18.0 + hq, 314.0, 22.0)
        rc_y += 116.0

    draw_para(
        c,
        f'<b>Stewardship Principle:</b> "Whatever your hand finds to do, do it with excellence, integrity, and '
        f'faithfulness so your skill becomes a blessing to many."',
        style("wv26", "Montserrat-Medium", 12.5, 19.0, WHITE),
        68.0,
        595.0,
        445.0,
        115.0,
    )

    draw_page_num(c, 26, side="left", on_dark=True)
    c.showPage()

    # =========================================================================
    # PAGE 27: 90-DAY ACTION ROADMAP & FOLLOW-UP PLAN
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
        style("rd_top", "Montserrat", 10.2, 15.8, WHITE),
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
        ("Days 1 to 14: Foundation Sprint", f"Complete Modules 1 to 4 labs and document your baseline specimen in {title}."),
        ("Days 15 to 30: First Live Output", f"Complete Modules 5 to 8 and ship your first real capstone deliverable: {chapters[7]['practice']}"),
        ("Days 31 to 60: Feedback & Iteration", "Share your work with a mentor, peer, or real client/community audience and refine weak points."),
        ("Days 61 to 90: Service & Multiplication", "Use your skill to serve your church, business, or clients faithfully and mentor one younger learner."),
    ]
    m_pos = [(72.0, 420.0), (312.0, 420.0), (72.0, 520.0), (312.0, 520.0)]
    for idx, ((mx, my), (m_head, m_body)) in enumerate(zip(m_pos, milestones)):
        c.saveState()
        c.setFillColor(HexColor(COBALT_HEAD))
        c.setFont("Montserrat", 17.5)
        c.drawString(mx, Y(my + 15.0), f"0{idx+1}")
        c.restoreState()
        draw_accent_bar(c, mx, my + 20.0, 42.0, 2.2)
        st_m = style(f"ms_{idx}", "Montserrat", 8.6, 12.6, INK)
        draw_para(c, f"<b><font color='{COBALT_HEAD}'>{m_head}</font></b><br/>{clean_text(m_body)}", st_m, mx, my + 27.0, 214.0, 70.0)

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
        row_h=25.0,
    )

    draw_page_num(c, 27, side="right", on_dark=False)
    c.showPage()

    # =========================================================================
    # PAGE 28: BACK COVER (Gmail Only!)
    # =========================================================================
    draw_plate(c, "plate_back_cover.jpg")
    draw_brand_lockup(c, 59.5, 56.0, dark_bg=True)

    c.saveState()
    c.setFillColor(HexColor(WHITE))
    c.setFont("Montserrat", 35.0)
    c.drawString(59.5, Y(498.0), "Equipping")
    c.drawString(59.5, Y(542.0), "Youth, Elevating")
    c.drawString(59.5, Y(586.0), "Purpose")

    c.setStrokeColor(HexColor(CYAN_ACCENT))
    c.setLineWidth(1.5)
    c.line(59.5, Y(646.0), 59.5, Y(708.0))
    c.line(316.0, Y(646.0), 316.0, Y(708.0))

    c.setFont("Montserrat-Bold", 10.5)
    c.drawString(72.0, Y(658.0), "CHRISCO Youth Aflame")
    c.setFont("Montserrat", 9.3)
    c.drawString(72.0, Y(676.0), "CHRISCO Digital Academy")
    c.drawString(72.0, Y(694.0), "Under CHRISCO FELLOWSHIP OF CHURCHES")

    c.setFont("Montserrat-Bold", 10.5)
    c.drawString(328.0, Y(658.0), "Official Gmail Contacts")
    c.setFont("Montserrat", 9.5)
    c.drawString(328.0, Y(676.0), PRIMARY_EMAIL)
    c.drawString(328.0, Y(694.0), SECONDARY_EMAIL)

    c.setFillColor(HexColor(INK))
    c.setFont("Montserrat", 8.4)
    c.drawString(59.5, Y(768.0), f"Official 28-Page Illustrated Course E-Book for {title} ({meta['track']}).")
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
        print(f"  [{idx:02d}/19] Built 28-page {slug}.pdf ({kb:.1f} KB)")
    print(f"\nCompleted all 19 28-Page Illustrated Course E-Books! Total combined size: {total_kb/1024.0:.2f} MB")


if __name__ == "__main__":
    main()
