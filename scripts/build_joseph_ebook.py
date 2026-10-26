#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the complete 28-page Illustrated Seer Study Edition e-book:
'Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn'
Brand: CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES

Modeled 1:1 on `company book.pdf` with spacious typography, deep Scriptural
explanations, 8 custom vector prophetic diagrams, and 100% real faith photography.
"""

import os
import shutil
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
from joseph_illustrations import ILLUSTRATED_PAGES, render_illustrated_lesson_deep_dive
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
    c.setTitle("Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn | CHRISCO Youth Aflame")
    c.setAuthor("CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES")
    c.setSubject("28-Page Illustrated Prophetic Study from the Life of Joseph (Genesis 37 to 50)")
    c.setCreator("CHRISCO Youth Aflame")

    page_specs = [
        lambda p: render_cover_page(c, PAGE_01_COVER),
        lambda p: render_toc_page(c, PAGE_02_TOC, p),
        lambda p: render_layout_message_two_col(c, PAGE_03_PROLOGUE, p),
        lambda p: render_layout_timeline_portraits(c, PAGE_04_CHAMBERS, p),
        # Lesson 1 (3 spacious pages)
        lambda p: render_layout_sidebar_blue_arch(c, PAGE_05_LESSON1A, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["L1_DEEP"], p),
        lambda p: render_layout_quadrant_split(c, PAGE_06_LESSON1B, p),
        # Lesson 2 (3 spacious pages)
        lambda p: render_layout_blush_sidebar_pillars(c, PAGE_07_LESSON2A, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["L2_DEEP"], p),
        lambda p: render_layout_coral_banner_overlap(c, PAGE_08_LESSON2B, p),
        # Lesson 3 (3 spacious pages)
        lambda p: render_layout_message_two_col(c, PAGE_09_LESSON3A, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["L3_DEEP"], p),
        lambda p: render_layout_full_blue_icons(c, PAGE_10_LESSON3B, p),
        # Lesson 4 (3 spacious pages)
        lambda p: render_layout_sidebar_blue_arch(c, PAGE_11_LESSON4A, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["L4_DEEP"], p),
        lambda p: render_layout_quadrant_split(c, PAGE_12_LESSON4B, p),
        # Lesson 5 (3 spacious pages)
        lambda p: render_layout_blush_sidebar_pillars(c, PAGE_13_LESSON5A, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["L5_DEEP"], p),
        lambda p: render_layout_coral_banner_overlap(c, PAGE_14_LESSON5B, p),
        # Lesson 6 (3 spacious pages)
        lambda p: render_layout_message_two_col(c, PAGE_15_LESSON6A, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["L6_DEEP"], p),
        lambda p: render_layout_full_blue_icons(c, PAGE_16_LESSON6B, p),
        # Lesson 7 (3 spacious pages)
        lambda p: render_layout_sidebar_blue_arch(c, PAGE_17_LESSON7A, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["L7_DEEP"], p),
        lambda p: render_layout_quadrant_split(c, PAGE_18_LESSON7B, p),
        # Epilogue + Daily Watchman Rhythm + Back Cover
        lambda p: render_layout_blush_sidebar_pillars(c, PAGE_19_EPILOGUE, p),
        lambda p: render_illustrated_lesson_deep_dive(c, ILLUSTRATED_PAGES["P27_WATCHMAN"], p),
        lambda p: render_back_cover_contact(c, PAGE_20_CONTACT, p),
    ]

    total = len(page_specs)
    for idx, fn in enumerate(page_specs, start=1):
        fn(idx)
        c.showPage()
        print(f"  Rendered Page {idx:02d}/{total} OK")

    c.save()
    size_kb = os.path.getsize(out_pdf) / 1024.0
    print(f"\nSaved '{out_pdf}' ({size_kb:.1f} KB)")


if __name__ == "__main__":
    gated_dir = os.path.join(ROOT_DIR, "content", "books")
    os.makedirs(gated_dir, exist_ok=True)
    output_path = os.path.join(
        gated_dir,
        "joseph-7-lessons-emerging-seer-prophet.pdf",
    )
    build_ebook(output_path)
