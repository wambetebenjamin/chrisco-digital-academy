#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate professional, human-written PDF course books for CHRISCO Digital Academy.
Multi-page, designed like real workbooks — cover, foreword, TOC, chapters with
examples, exercises and takeaways, running footers and page numbers."""
import os
from fpdf import FPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "books")
os.makedirs(OUT, exist_ok=True)

TEAL = (0, 35, 51)
GREEN = (0, 153, 79)
GREEN_BRIGHT = (0, 200, 110)
INK = (17, 32, 40)
MUTED = (95, 110, 118)
LINE = (222, 230, 227)
BOXBG = (240, 247, 244)
CREAM = (250, 249, 245)


def T(s):
    """Make text safe for the Latin-1 core fonts."""
    return (s.replace("\u2019", "'").replace("\u2018", "'")
             .replace("\u201c", '"').replace("\u201d", '"')
             .replace("\u2013", "-").replace("\u2014", "-")
             .replace("\u2026", "...").replace("\u2192", "->")
             .replace("\u00a0", " ").replace("\u20a6", "UGX ").replace("\u2022", "-"))


class Book(FPDF):
    def __init__(self, title):
        super().__init__("P", "mm", "A4")
        self.book_title = title
        self.set_auto_page_break(True, margin=22)
        self.set_margins(22, 20, 22)
        self.chapter_mode = False

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
        self.cell(0, 6, str(self.page_no()), align="R")


def cover(pdf, b):
    pdf.add_page()
    pdf.set_fill_color(*TEAL)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_fill_color(*GREEN_BRIGHT)
    pdf.rect(0, 120, 210, 2, "F")
    pdf.rect(22, 40, 26, 5, "F")
    # brand
    pdf.set_xy(22, 30)
    pdf.set_text_color(*GREEN_BRIGHT)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 6, T("CHRISCO DIGITAL ACADEMY"))
    pdf.set_xy(22, 52)
    pdf.set_text_color(200, 214, 209)
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 6, T("The Practical Handbook Series"))
    # title
    pdf.set_xy(22, 66)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 34)
    pdf.multi_cell(166, 13, T(b["title"]))
    # subtitle
    pdf.ln(4)
    pdf.set_x(22)
    pdf.set_text_color(*GREEN_BRIGHT)
    pdf.set_font("Helvetica", "BI", 15)
    pdf.multi_cell(166, 8, T(b["subtitle"]))
    # promise
    pdf.set_xy(22, 135)
    pdf.set_text_color(210, 224, 219)
    pdf.set_font("Times", "", 13)
    pdf.multi_cell(160, 7, T(b["promise"]))
    # author block bottom
    pdf.set_xy(22, 250)
    pdf.set_draw_color(*GREEN_BRIGHT)
    pdf.line(22, 248, 60, 248)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 7, T("Wambete Benjamin"), ln=1)
    pdf.set_x(22)
    pdf.set_text_color(190, 206, 201)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, T("Founder, CHRISCO Digital Academy  -  Jinja & Buikwe, Uganda  -  2026 Edition"))


def front_matter(pdf, b):
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
        "Contact: shambetz@gmail.com  -  WhatsApp +254 112 272 061."))
    pdf.ln(8)
    pdf.set_draw_color(*LINE); pdf.line(22, pdf.get_y(), 188, pdf.get_y()); pdf.ln(8)
    pdf.set_font("Helvetica", "B", 15)
    pdf.set_text_color(*TEAL)
    pdf.cell(0, 8, T("A note before you begin"), ln=1)
    pdf.ln(2)
    pdf.set_font("Times", "", 12)
    pdf.set_text_color(*INK)
    for para in b["foreword"]:
        pdf.multi_cell(0, 6.4, T(para))
        pdf.ln(3)


def toc(pdf, b):
    pdf.add_page()
    pdf.set_text_color(*TEAL)
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 10, T("Contents"), ln=1)
    pdf.ln(4)
    for i, ch in enumerate(b["chapters"], 1):
        pdf.set_x(22)
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(*GREEN)
        pdf.cell(14, 8, T(f"{i:02d}"), ln=0)
        pdf.set_text_color(*INK)
        pdf.set_font("Helvetica", "", 12)
        pdf.multi_cell(152, 8, T(ch["title"]))
    pdf.ln(2)
    pdf.set_draw_color(*LINE); pdf.line(22, pdf.get_y(), 188, pdf.get_y())


def box(pdf, label, text, accent=GREEN):
    pdf.ln(3)
    x, y = pdf.get_x(), pdf.get_y()
    pdf.set_font("Times", "", 11.5)
    # measure height roughly by rendering into a temp multi_cell using split
    pdf.set_fill_color(*BOXBG)
    pdf.set_draw_color(*accent)
    start_y = pdf.get_y()
    pdf.set_xy(22, start_y)
    # left accent bar drawn after we know height; render text first in a cell block
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
    # background + bar
    pdf.set_fill_color(*accent)
    pdf.rect(22, start_y - 2, 2.4, (end_y - start_y) + 4, "F")
    pdf.ln(3)


def chapter(pdf, i, ch):
    pdf.add_page()
    pdf.set_text_color(*GREEN)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 7, T(f"CHAPTER {i:02d}"), ln=1)
    pdf.set_text_color(*TEAL)
    pdf.set_font("Helvetica", "B", 21)
    pdf.multi_cell(0, 9.5, T(ch["title"]))
    pdf.ln(1)
    pdf.set_draw_color(*GREEN); pdf.set_line_width(0.6)
    pdf.line(22, pdf.get_y(), 46, pdf.get_y()); pdf.set_line_width(0.2)
    pdf.ln(5)
    pdf.set_font("Times", "", 12)
    pdf.set_text_color(*INK)
    for para in ch["body"]:
        pdf.multi_cell(0, 6.4, T(para))
        pdf.ln(3)
    if ch.get("example"):
        box(pdf, "IN PRACTICE", ch["example"], accent=TEAL)
    if ch.get("practice"):
        box(pdf, "TRY THIS", ch["practice"], accent=GREEN)
    if ch.get("takeaways"):
        pdf.ln(2)
        pdf.set_font("Helvetica", "B", 10.5)
        pdf.set_text_color(*TEAL)
        pdf.cell(0, 7, T("Key takeaways"), ln=1)
        pdf.set_font("Times", "", 11.5)
        pdf.set_text_color(*INK)
        for t in ch["takeaways"]:
            y0 = pdf.get_y()
            pdf.set_fill_color(*GREEN)
            pdf.ellipse(23, y0 + 2.2, 1.6, 1.6, "F")
            pdf.set_x(28)
            pdf.multi_cell(160, 6, T(t))


def closing(pdf):
    pdf.add_page()
    pdf.set_fill_color(*TEAL)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_xy(22, 60)
    pdf.set_text_color(*GREEN_BRIGHT)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, T("KEEP GOING"), ln=1)
    pdf.set_x(22)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 26)
    pdf.multi_cell(166, 12, T("Skills pay for life. Now go use them."))
    pdf.set_xy(22, 120)
    pdf.set_text_color(210, 224, 219)
    pdf.set_font("Times", "", 13)
    pdf.multi_cell(160, 7, T(
        "Finishing the reading is not the goal - finishing the project is. Pick the one exercise in this book "
        "that scared you most and do it this week. Then bring your work to your CHRISCO facilitator or post it "
        "online. That single habit - shipping real work - is what separates the youth who earn from the youth "
        "who only dream."))
    pdf.set_xy(22, 250)
    pdf.set_draw_color(*GREEN_BRIGHT); pdf.line(22, 248, 60, 248)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 7, T("CHRISCO Digital Academy"), ln=1)
    pdf.set_x(22)
    pdf.set_text_color(190, 206, 201)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6, T("Jinja & Buikwe, Uganda  -  shambetz@gmail.com  -  WhatsApp +254 112 272 061\n"
                           "Under CHRISCO Youth Aflame  -  Founder: Wambete Benjamin"))


def build(b):
    pdf = Book(b["title"])
    cover(pdf, b)
    front_matter(pdf, b)
    toc(pdf, b)
    for i, ch in enumerate(b["chapters"], 1):
        chapter(pdf, i, ch)
    closing(pdf)
    path = os.path.join(OUT, b["slug"] + ".pdf")
    pdf.output(path)
    print("wrote", path, os.path.getsize(path) // 1024, "KB")


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
