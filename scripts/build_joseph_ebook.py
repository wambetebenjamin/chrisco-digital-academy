#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the complete 20-page curated e-book:
'Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn'
Brand: Chrisco Youth Aflame

Modeled 1:1 on the exact structure, fonts (Lilita One + Poppins), color palette,
and page layouts of `company book.pdf`.
"""

import os
import sys
from reportlab.pdfgen import canvas

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, SCRIPT_DIR)

from ebook_engine import W, H, register_ebook_fonts
from ebook_layouts import (
    render_cover_page,
    render_toc_page,
    render_layout_message_two_col,
    render_layout_sidebar_blue_arch,
    render_layout_quadrant_split,
    render_layout_timeline_portraits,
    render_layout_coral_banner_overlap,
    render_layout_full_blue_icons,
    render_layout_blush_sidebar_pillars,
    render_back_cover_contact,
)
from joseph_ebook_content import (
    PAGE_01_COVER,
    PAGE_02_TOC,
    PAGE_03_PROLOGUE,
    PAGE_04_CHAMBERS,
    PAGE_05_LESSON1A,
    PAGE_06_LESSON1B,
    PAGE_07_LESSON2A,
    PAGE_08_LESSON2B,
    PAGE_09_LESSON3A,
    PAGE_10_LESSON3B,
    PAGE_11_LESSON4A,
    PAGE_12_LESSON4B,
    PAGE_13_LESSON5A,
    PAGE_14_LESSON5B,
    PAGE_15_LESSON6A,
    PAGE_16_LESSON6B,
    PAGE_17_LESSON7A,
    PAGE_18_LESSON7B,
    PAGE_19_EPILOGUE,
    PAGE_20_CONTACT,
)


def build_ebook(out_pdf: str) -> None:
    font_dir = os.path.join(SCRIPT_DIR, "joseph_ebook_assets", "fonts")
    register_ebook_fonts(font_dir)

    c = canvas.Canvas(out_pdf, pagesize=(W, H))
    c.setTitle("Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn — Chrisco Youth Aflame")
    c.setAuthor("Chrisco Youth Aflame")
    c.setSubject("Prophetic Blueprint from the Life of Joseph (Genesis 37-50)")
    c.setCreator("Chrisco Youth Aflame Editorial Studio")

    pages = [
        (lambda: render_cover_page(c, PAGE_01_COVER)),
        (lambda: render_toc_page(c, PAGE_02_TOC, 2)),
        (lambda: render_layout_message_two_col(c, PAGE_03_PROLOGUE, 3)),
        (lambda: render_layout_timeline_portraits(c, PAGE_04_CHAMBERS, 4)),
        (lambda: render_layout_sidebar_blue_arch(c, PAGE_05_LESSON1A, 5)),
        (lambda: render_layout_quadrant_split(c, PAGE_06_LESSON1B, 6)),
        (lambda: render_layout_blush_sidebar_pillars(c, PAGE_07_LESSON2A, 7)),
        (lambda: render_layout_coral_banner_overlap(c, PAGE_08_LESSON2B, 8)),
        (lambda: render_layout_message_two_col(c, PAGE_09_LESSON3A, 9)),
        (lambda: render_layout_full_blue_icons(c, PAGE_10_LESSON3B, 10)),
        (lambda: render_layout_sidebar_blue_arch(c, PAGE_11_LESSON4A, 11)),
        (lambda: render_layout_quadrant_split(c, PAGE_12_LESSON4B, 12)),
        (lambda: render_layout_blush_sidebar_pillars(c, PAGE_13_LESSON5A, 13)),
        (lambda: render_layout_coral_banner_overlap(c, PAGE_14_LESSON5B, 14)),
        (lambda: render_layout_message_two_col(c, PAGE_15_LESSON6A, 15)),
        (lambda: render_layout_full_blue_icons(c, PAGE_16_LESSON6B, 16)),
        (lambda: render_layout_sidebar_blue_arch(c, PAGE_17_LESSON7A, 17)),
        (lambda: render_layout_quadrant_split(c, PAGE_18_LESSON7B, 18)),
        (lambda: render_layout_blush_sidebar_pillars(c, PAGE_19_EPILOGUE, 19)),
        (lambda: render_back_cover_contact(c, PAGE_20_CONTACT, 20)),
    ]

    for idx, render_fn in enumerate(pages, start=1):
        render_fn()
        c.showPage()
        print(f"  Rendered Page {idx:02d}/20 OK")

    c.save()
    size_kb = os.path.getsize(out_pdf) / 1024.0
    print(f"\nSaved '{out_pdf}' ({size_kb:.1f} KB)")


if __name__ == "__main__":
    output_path = os.path.join(
        ROOT_DIR,
        "Joseph-7-Lessons-Every-Emerging-Seer-Prophet-Must-Learn.pdf",
    )
    build_ebook(output_path)
