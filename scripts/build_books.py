#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate professional, human-written PDF course books for CHRISCO Digital Academy.

Multi-page, designed like real workbooks - cover, foreword, TOC, chapters with
examples, exercises and takeaways, running footers and page numbers.

Each course is given an "educative theme": a colour palette chosen by subject
area (Business, AI & Tech, Video, Marketing, Writing) so the library looks like
a real, varied set of study guides rather than one repeated template.
"""
import os
from fpdf import FPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "books")
os.makedirs(OUT, exist_ok=True)

# ---- Ugandan contact details (shown on every book) -------------------------
EMAIL = "shambetz@gmail.com"
WA1 = "+256 763 393 021"
WA2 = "+256 755 467 513"
WA_LINK = "256763393021"
CONTACT_LINE = f"{EMAIL}  -  WhatsApp {WA1} / {WA2}"

# ---- Neutral ink colours (shared across all themes) ------------------------
INK = (17, 32, 40)
MUTED = (95, 110, 118)
LINE = (222, 230, 227)
PAPER = (255, 255, 255)

# ---- Educative themes: (dark, accent-readable, bright-accent) ---------------
# dark   -> cover background + big headings
# accent -> labels/rules on white paper (must stay readable)
# bright -> decorative shapes / lines on the dark cover
THEMES = {
    "teal":   {"dark": (0, 35, 51),   "accent": (0, 153, 79),   "bright": (0, 200, 110)},
    "ocean":  {"dark": (12, 42, 71),  "accent": (18, 110, 170), "bright": (0, 170, 232)},
    "plum":   {"dark": (44, 26, 62),  "accent": (124, 58, 173), "bright": (168, 104, 224)},
    "ember":  {"dark": (58, 30, 20),  "accent": (196, 86, 34),  "bright": (240, 128, 60)},
    "forest": {"dark": (20, 46, 33),  "accent": (28, 122, 70),  "bright": (44, 176, 104)},
    "berry":  {"dark": (58, 20, 45),  "accent": (178, 42, 108), "bright": (226, 74, 150)},
}

# slug -> (theme key, subject label printed on the cover)
THEME_BY_SLUG = {
    "communicate-like-a-ceo": ("ocean", "Business & Leadership"),
    "negotiation":            ("ocean", "Business & Leadership"),
    "personal-branding":      ("ocean", "Business & Leadership"),
    "networking-secrets":     ("ocean", "Business & Leadership"),
    "ai-literacy":            ("plum",  "AI & Technology"),
    "python-programming":     ("plum",  "AI & Technology"),
    "swe-llm-mastery":        ("plum",  "AI & Technology"),
    "ai-video-storytelling":  ("ember", "Video & Creative"),
    "youtube-automation":     ("ember", "Video & Creative"),
    "content-creation":       ("forest", "Marketing"),
    "sales-and-marketing":    ("forest", "Marketing"),
    "digital-marketing":      ("forest", "Marketing"),
    "copywriting":            ("forest", "Marketing"),
    "email-marketing":        ("forest", "Marketing"),
    "affiliate-marketing":    ("forest", "Marketing"),
    "social-media-marketing": ("forest", "Marketing"),
    "ghostwriting":           ("berry", "Writing & Commerce"),
    "print-on-demand":        ("berry", "Writing & Commerce"),
    "freelancing":            ("berry", "Writing & Commerce"),
}


def tint(rgb, amount=0.90):
    """Lighten an rgb colour towards white (for soft box backgrounds)."""
    return tuple(int(c + (255 - c) * amount) for c in rgb)


def resolve_theme(slug):
    key, label = THEME_BY_SLUG.get(slug, ("teal", "Digital Skills"))
    th = dict(THEMES[key])
    th["box"] = tint(th["accent"], 0.90)
    th["label"] = label
    return th


def T(s):
    """Make text safe for the Latin-1 core fonts."""
    return (s.replace("\u2019", "'").replace("\u2018", "'")
             .replace("\u201c", '"').replace("\u201d", '"')
             .replace("\u2013", "-").replace("\u2014", "-")
             .replace("\u2026", "...").replace("\u2192", "->")
             .replace("\u00a0", " ").replace("\u20a6", "UGX ").replace("\u2022", "-"))


class Book(FPDF):
    def __init__(self, title, theme):
        super().__init__("P", "mm", "A4")
        self.book_title = title
        self.th = theme
        self.set_auto_page_break(True, margin=22)
        self.set_margins(22, 20, 22)

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-15)
        self.set_draw_color(*LINE)
        self.line(22, self.get_y(), 188, self.get_y())
        self.set_y(-13)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 6, T(self.book_title), align="L")
        self.set_y(-13)
        # small accent dot + brand on the right
        self.set_text_color(*self.th["accent"])
        self.cell(0, 6, T("CHRISCO Digital Academy   -   " + str(self.page_no())), align="R")


def cover(pdf, b):
    th = pdf.th
    pdf.add_page()
    pdf.set_fill_color(*th["dark"])
    pdf.rect(0, 0, 210, 297, "F")

    # decorative concentric rings, bottom-right (subtle, educative motif)
    pdf.set_draw_color(*th["bright"])
    pdf.set_line_width(0.4)
    for r in (26, 40, 54, 68):
        pdf.ellipse(196 - r, 250 - r, r * 2, r * 2)
    pdf.set_line_width(0.2)

    # bright accent band
    pdf.set_fill_color(*th["bright"])
    pdf.rect(0, 120, 210, 2, "F")
    pdf.rect(22, 40, 26, 5, "F")

    # brand line
    pdf.set_xy(22, 30)
    pdf.set_text_color(*th["bright"])
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 6, T("CHRISCO DIGITAL ACADEMY"))

    # subject chip
    label = th["label"].upper()
    pdf.set_font("Helvetica", "B", 9)
    chip_w = pdf.get_string_width(T(label)) + 10
    pdf.set_fill_color(*th["bright"])
    pdf.set_xy(22, 52)
    pdf.rect(22, 52, chip_w, 7, "F")
    pdf.set_text_color(*th["dark"])
    pdf.set_xy(22, 52)
    pdf.cell(chip_w, 7, T(label), align="C")

    # series line
    pdf.set_xy(22 + chip_w + 4, 52)
    pdf.set_text_color(200, 214, 220)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 7, T("The Practical Handbook Series"))

    # title
    pdf.set_xy(22, 68)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 34)
    pdf.multi_cell(166, 13, T(b["title"]))

    # subtitle
    pdf.ln(4)
    pdf.set_x(22)
    pdf.set_text_color(*th["bright"])
    pdf.set_font("Helvetica", "BI", 15)
    pdf.multi_cell(166, 8, T(b["subtitle"]))

    # promise
    pdf.set_xy(22, 135)
    pdf.set_text_color(210, 222, 228)
    pdf.set_font("Times", "", 13)
    pdf.multi_cell(160, 7, T(b["promise"]))

    # study-guide meta line
    n = len(b["chapters"])
    pdf.set_xy(22, 176)
    pdf.set_text_color(*th["bright"])
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, T(f"{n} CHAPTERS   -   SELF-STUDY GUIDE   -   PRACTICAL EXERCISES"))

    # author block bottom
    pdf.set_xy(22, 250)
    pdf.set_draw_color(*th["bright"])
    pdf.line(22, 248, 60, 248)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 7, T("Wambete Benjamin"), ln=1)
    pdf.set_x(22)
    pdf.set_text_color(195, 208, 214)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, T("Founder, CHRISCO Digital Academy  -  Jinja & Buikwe, Uganda  -  2026 Edition"))


def front_matter(pdf, b):
    th = pdf.th
    pdf.add_page()
    pdf.set_text_color(*INK)
    pdf.set_font("Helvetica", "B", 20)
    pdf.multi_cell(0, 9, T(b["title"]))
    pdf.set_font("Helvetica", "I", 12)
    pdf.set_text_color(*MUTED)
    pdf.ln(1)
    pdf.multi_cell(0, 7, T(b["subtitle"]))
    pdf.ln(6)
    pdf.set_font("Times", "", 10.5)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(0, 6, T(
        "Published by CHRISCO Digital Academy under CHRISCO Youth Aflame, Jinja & Buikwe, Uganda. "
        "First edition, 2026. Written by Wambete Benjamin. This handbook is provided free to learners "
        "of the CHRISCO community hubs and may be shared for educational, non-commercial use. "
        f"Contact: {CONTACT_LINE}."))
    pdf.ln(8)
    pdf.set_draw_color(*LINE); pdf.line(22, pdf.get_y(), 188, pdf.get_y()); pdf.ln(8)
    pdf.set_font("Helvetica", "B", 15)
    pdf.set_text_color(*th["dark"])
    pdf.cell(0, 8, T("A note before you begin"), ln=1)
    pdf.ln(2)
    pdf.set_font("Times", "", 12)
    pdf.set_text_color(*INK)
    for para in b["foreword"]:
        pdf.multi_cell(0, 6.4, T(para))
        pdf.ln(3)


def toc(pdf, b):
    th = pdf.th
    pdf.add_page()
    pdf.set_text_color(*th["dark"])
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 10, T("Contents"), ln=1)
    pdf.ln(4)
    for i, ch in enumerate(b["chapters"], 1):
        pdf.set_x(22)
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(*th["accent"])
        pdf.cell(14, 8, T(f"{i:02d}"), ln=0)
        pdf.set_text_color(*INK)
        pdf.set_font("Helvetica", "", 12)
        pdf.multi_cell(152, 8, T(ch["title"]))
    pdf.ln(4)
    pdf.set_draw_color(*LINE); pdf.line(22, pdf.get_y(), 188, pdf.get_y()); pdf.ln(6)

    # "How to use this book" study-guide note in a soft themed box
    pdf.set_fill_color(*th["box"])
    start_y = pdf.get_y()
    pdf.set_left_margin(28)
    pdf.set_x(28)
    pdf.set_text_color(*th["accent"])
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(0, 6, T("HOW TO USE THIS BOOK"), ln=1)
    pdf.set_x(28)
    pdf.set_text_color(*INK)
    pdf.set_font("Times", "", 11.5)
    pdf.multi_cell(154, 6, T(
        "Read one chapter at a time. Don't just read - do the 'Try This' exercise in each chapter before you "
        "move on, and keep your answers in a notebook. The 'In Practice' stories show how the idea works in "
        "real life. By the last page you should have real work to show, not just notes."))
    end_y = pdf.get_y()
    pdf.set_left_margin(22)
    pdf.set_fill_color(*th["accent"])
    pdf.rect(22, start_y - 2, 2.4, (end_y - start_y) + 4, "F")


def box(pdf, label, text, accent):
    pdf.ln(3)
    th = pdf.th
    pdf.set_fill_color(*th["box"])
    start_y = pdf.get_y()
    pdf.set_left_margin(28)
    pdf.set_x(28)
    pdf.set_text_color(*accent)
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(0, 6, T(label), ln=1)
    pdf.set_x(28)
    pdf.set_text_color(*INK)
    pdf.set_font("Times", "", 11.5)
    pdf.multi_cell(154, 6, T(text))
    end_y = pdf.get_y()
    pdf.set_left_margin(22)
    pdf.set_fill_color(*accent)
    pdf.rect(22, start_y - 2, 2.4, (end_y - start_y) + 4, "F")
    pdf.ln(3)


def chapter(pdf, i, ch):
    th = pdf.th
    pdf.add_page()
    # numbered circle badge
    y0 = pdf.get_y()
    pdf.set_fill_color(*th["accent"])
    pdf.ellipse(22, y0, 12, 12, "F")
    pdf.set_xy(22, y0)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(12, 12, T(f"{i:02d}"), align="C")
    pdf.set_xy(38, y0 - 1)
    pdf.set_text_color(*th["accent"])
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, T(f"CHAPTER {i:02d}"), ln=1)
    pdf.set_xy(38, y0 + 5)
    pdf.set_text_color(*th["dark"])
    pdf.set_font("Helvetica", "B", 20)
    pdf.multi_cell(150, 8.5, T(ch["title"]))
    pdf.ln(1)
    pdf.set_draw_color(*th["accent"]); pdf.set_line_width(0.6)
    pdf.line(22, pdf.get_y(), 46, pdf.get_y()); pdf.set_line_width(0.2)
    pdf.ln(5)
    pdf.set_font("Times", "", 12)
    pdf.set_text_color(*INK)
    for para in ch["body"]:
        pdf.multi_cell(0, 6.4, T(para))
        pdf.ln(3)
    if ch.get("example"):
        box(pdf, "IN PRACTICE", ch["example"], accent=th["dark"])
    if ch.get("practice"):
        box(pdf, "TRY THIS", ch["practice"], accent=th["accent"])
    if ch.get("takeaways"):
        pdf.ln(2)
        pdf.set_font("Helvetica", "B", 10.5)
        pdf.set_text_color(*th["dark"])
        pdf.cell(0, 7, T("Key takeaways"), ln=1)
        pdf.set_font("Times", "", 11.5)
        pdf.set_text_color(*INK)
        for t in ch["takeaways"]:
            y0 = pdf.get_y()
            pdf.set_fill_color(*th["accent"])
            pdf.ellipse(23, y0 + 2.2, 1.6, 1.6, "F")
            pdf.set_x(28)
            pdf.multi_cell(160, 6, T(t))


def closing(pdf):
    th = pdf.th
    pdf.add_page()
    pdf.set_fill_color(*th["dark"])
    pdf.rect(0, 0, 210, 297, "F")
    # subtle rings top-left
    pdf.set_draw_color(*th["bright"])
    pdf.set_line_width(0.4)
    for r in (20, 32, 44):
        pdf.ellipse(10 - r, 20 - r, r * 2, r * 2)
    pdf.set_line_width(0.2)
    pdf.set_xy(22, 60)
    pdf.set_text_color(*th["bright"])
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, T("KEEP GOING"), ln=1)
    pdf.set_x(22)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 26)
    pdf.multi_cell(166, 12, T("Skills pay for life. Now go use them."))
    pdf.set_xy(22, 120)
    pdf.set_text_color(210, 222, 228)
    pdf.set_font("Times", "", 13)
    pdf.multi_cell(160, 7, T(
        "Finishing the reading is not the goal - finishing the project is. Pick the one exercise in this book "
        "that scared you most and do it this week. Then bring your work to your CHRISCO facilitator or post it "
        "online. That single habit - shipping real work - is what separates the youth who earn from the youth "
        "who only dream."))
    pdf.set_xy(22, 250)
    pdf.set_draw_color(*th["bright"]); pdf.line(22, 248, 60, 248)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 7, T("CHRISCO Digital Academy"), ln=1)
    pdf.set_x(22)
    pdf.set_text_color(195, 208, 214)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6, T(f"Jinja & Buikwe, Uganda  -  {EMAIL}\n"
                           f"WhatsApp {WA1}  /  {WA2}  -  Under CHRISCO Youth Aflame  -  Founder: Wambete Benjamin"))


def build(b):
    theme = resolve_theme(b["slug"])
    pdf = Book(b["title"], theme)
    cover(pdf, b)
    front_matter(pdf, b)
    toc(pdf, b)
    for i, ch in enumerate(b["chapters"], 1):
        chapter(pdf, i, ch)
    closing(pdf)
    path = os.path.join(OUT, b["slug"] + ".pdf")
    pdf.output(path)
    print("wrote", path, "[", theme["label"], "]", os.path.getsize(path) // 1024, "KB")


from books_content import BOOKS as NEW_BOOKS  # noqa: E402
from books_content_original import BOOKS as ORIGINAL_BOOKS  # noqa: E402

ALL_BOOKS = NEW_BOOKS + ORIGINAL_BOOKS

if __name__ == "__main__":
    import sys
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which == "new":
        target = NEW_BOOKS
    elif which == "original":
        target = ORIGINAL_BOOKS
    else:
        target = ALL_BOOKS
    for b in target:
        build(b)
    print("done:", len(target), "books")
