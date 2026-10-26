#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""10 exact page layout templates modeled 1:1 on Pages 1-10 of `company book.pdf`."""

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas

from ebook_engine import (
    W,
    H,
    Y,
    WHITE,
    BLUSH,
    CREAM_SHAPE,
    ROYAL_DARK,
    ROYAL_MID,
    INDIGO_MUTE,
    CORAL_CARD,
    CORAL_ACCENT,
    LIGHT_PILL,
    CREAM_TEXT,
    CREAM_WARM,
    INK_DARK,
    fill_page,
    draw_circle,
    draw_circle_grid_2x2,
    draw_pinwheel,
    draw_totem_strip,
    draw_rounded_box,
    draw_skewed_card,
    draw_clipped_photo,
    draw_circular_portrait,
    draw_display_lines,
    make_style,
    draw_paragraphs_box,
    draw_vector_icon,
    draw_subtle_page_tag,
)


# ---------------------------------------------------------------------------
# 1. COVER PAGE (Exact Page 1 of `company book.pdf`)
# ---------------------------------------------------------------------------
def render_cover_page(c: canvas.Canvas, data: dict) -> None:
    fill_page(c, WHITE)

    # Subtle cream geometric motifs (top-left pinwheel + mid-right 2x2 circles)
    draw_pinwheel(c, 34.0, 59.5, 233.6, CREAM_SHAPE)
    draw_circle_grid_2x2(c, 414.3, 318.2, 310.0, CREAM_SHAPE)

    # Top-right overlapping dual-circle brand logo + brand name & umbrella fellowship
    draw_circle(c, 326.0, 92.4, 21.5, CORAL_CARD)
    draw_circle(c, 348.0, 92.4, 21.5, ROYAL_DARK)
    c.saveState()
    c.setFont("Poppins-Bold", 14.8)
    c.setFillColor(HexColor(ROYAL_MID))
    c.drawString(380.0, Y(91.0), data["brand_name"])
    if data.get("brand_umbrella"):
        c.setFont("Poppins-SemiBold", 7.5)
        c.setFillColor(HexColor(CORAL_CARD))
        c.drawString(380.0, Y(104.5), data["brand_umbrella"])
    c.restoreState()

    # Hero portrait photo (arch-top-left)
    draw_clipped_photo(
        c,
        data["photo"],
        x=48.0,
        y_top=151.8,
        w=298.0,
        h=415.0,
        radii=(185, 42, 18, 18),
        focus=data.get("photo_focus", (0.5, 0.55)),
    )

    # Overlapping skewed Royal Blue title block
    draw_skewed_card(
        c,
        x=232.0,
        y_top=322.0,
        w=322.0,
        h=198.0,
        radius=28.0,
        lean_right_deg=6.0,
        fill_hex=ROYAL_DARK,
    )

    # Main LilitaOne display title inside skewed blue block
    draw_display_lines(
        c,
        lines=data["title_lines"],
        x=256.0,
        y_top_first_baseline=374.0,
        font_name="LilitaOne",
        size=44.0,
        line_step=44.0,
        align="left",
    )

    # Subtitle strip tucked inside bottom of royal blue block
    c.saveState()
    c.setFont("Poppins-SemiBold", 8.4)
    c.setFillColor(HexColor(CREAM_TEXT))
    c.drawString(250.0, Y(503.0), data["kicker_inside"])
    c.restoreState()

    # Coral edition pill badge overlapping bottom of photo
    draw_rounded_box(
        c,
        x=48.0,
        y_top=529.0,
        w=298.0,
        h=89.5,
        radii=(44.75, 44.75, 44.75, 44.75),
        fill_hex=CORAL_CARD,
    )
    c.saveState()
    c.setFont("LilitaOne", 31.0)
    c.setFillColor(HexColor(BLUSH))
    c.drawCentredString(48.0 + 149.0, Y(585.0), data["pill_text"])
    c.restoreState()

    # Bottom-left geometric strip: Coral circles + Indigo pinwheel + Coral circles
    draw_circle_grid_2x2(c, 56.0, 665.8, 90.0, CORAL_ACCENT)
    draw_pinwheel(c, 146.0, 667.2, 87.0, INDIGO_MUTE)
    draw_circle_grid_2x2(c, 233.0, 664.4, 90.0, CORAL_ACCENT)

    # Bottom-right description
    st_desc = make_style(
        "cover_desc",
        font="Poppins",
        size=10.6,
        leading=16.8,
        color=INK_DARK,
        align=TA_RIGHT,
        space_after=0,
    )
    draw_paragraphs_box(
        c,
        [(data["subtitle_html"], st_desc)],
        x=330.0,
        y_top=658.0,
        w=216.0,
        max_h=126.0,
        label="Cover subtitle",
    )


# ---------------------------------------------------------------------------
# 2. TABLE OF CONTENTS PAGE (Exact Page 2 of `company book.pdf`, zero dashes)
# ---------------------------------------------------------------------------
def render_toc_page(c: canvas.Canvas, data: dict, page_num: int = 2) -> None:
    fill_page(c, WHITE)

    # Cream circle clusters top-right & bottom-left
    draw_circle_grid_2x2(c, 330.5, 0.0, 310.0, CREAM_SHAPE)
    draw_circle_grid_2x2(c, -130.6, 693.6, 310.0, CREAM_SHAPE)

    # Stacked Coral pinwheels along left edge
    draw_pinwheel(c, -64.9, 88.2, 221.7, CORAL_ACCENT)
    draw_pinwheel(c, -64.9, 310.0, 221.7, CORAL_ACCENT)

    # TABLE OF / CONTENTS header
    draw_display_lines(
        c,
        lines=[
            ("TABLE OF", CORAL_ACCENT, 64.0),
            ("CONTENTS", ROYAL_MID, 57.5),
        ],
        x=546.0,
        y_top_first_baseline=126.0,
        line_step=62.0,
        align="right",
    )

    # Skewed Royal Blue TOC card
    draw_skewed_card(
        c,
        x=166.0,
        y_top=222.0,
        w=390.0,
        h=574.0,
        radius=30.0,
        lean_right_deg=3.8,
        fill_hex=ROYAL_DARK,
    )

    entries = data["entries"]  # list of (num_str, title_line1, title_line2, page_str)
    start_y = 262.0
    row_step = 58.0

    for idx, (num_str, t1, t2, pg_str) in enumerate(entries):
        ry = start_y + idx * row_step
        # Follow the subtle skew slope from top row to bottom row (no dashes)
        dx = (len(entries) - 1 - idx) * 3.4
        c.saveState()

        # Big bold number in Coral Accent (clean, zero dashes)
        c.setFont("Poppins-Bold", 25.0)
        c.setFillColor(HexColor(CORAL_ACCENT))
        c.drawString(214.0 + dx, Y(ry + 20.0), num_str)

        # Two-line chapter title + subtitle
        c.setFont("Poppins-Bold", 11.6)
        c.setFillColor(HexColor(CREAM_TEXT))
        c.drawString(268.0 + dx, Y(ry + 6.0), t1)

        c.setFont("Poppins", 9.4)
        c.setFillColor(HexColor("#D2DBFF"))
        c.drawString(268.0 + dx, Y(ry + 21.0), t2)

        # Page number aligned cleanly along the right margin inside skewed card
        c.setFont("Poppins-Bold", 10.6)
        c.setFillColor(HexColor(CORAL_ACCENT))
        c.drawRightString(532.0 + dx, Y(ry + 6.0), pg_str)
        c.restoreState()

    draw_subtle_page_tag(c, page_num, dark_bg=False)


# ---------------------------------------------------------------------------
# 3. LAYOUT A: EDITORIAL MESSAGE + ARCH PHOTO + TWO-COLUMN DEEP PROSE (Page 3)
# ---------------------------------------------------------------------------
def render_layout_message_two_col(c: canvas.Canvas, data: dict, page_num: int) -> None:
    fill_page(c, WHITE)

    # Cream 2x2 circle motifs behind upper-right and lower-left
    draw_circle_grid_2x2(c, 313.2, 183.6, 310.0, CREAM_SHAPE)
    draw_circle_grid_2x2(c, -95.4, 360.9, 310.0, CREAM_SHAPE)

    # Top-left Coral corner-rounded badge (with subtle chapter label if provided)
    draw_rounded_box(
        c,
        x=56.0,
        y_top=52.0,
        w=62.0,
        h=58.0,
        radii=(0, 0, 28, 0),
        fill_hex=CORAL_ACCENT,
    )
    if data.get("badge_text"):
        c.saveState()
        c.setFont("Poppins-Bold", 15.0)
        c.setFillColor(HexColor(CREAM_TEXT))
        c.drawCentredString(56.0 + 30.0, Y(87.0), data["badge_text"])
        c.restoreState()

    # Right-aligned 3-line LilitaOne header
    draw_display_lines(
        c,
        lines=data["title_lines"],
        x=538.0,
        y_top_first_baseline=104.0,
        size=46.0,
        line_step=45.0,
        align="right",
    )

    # Arch-top-right photo on mid-left + Royal Blue arch accent block at its bottom-right
    draw_clipped_photo(
        c,
        data["photo"],
        x=56.0,
        y_top=216.0,
        w=248.0,
        h=264.0,
        radii=(0, 170, 0, 0),
        focus=data.get("photo_focus", (0.5, 0.25)),
    )
    draw_rounded_box(
        c,
        x=304.0,
        y_top=402.0,
        w=58.0,
        h=78.0,
        radii=(0, 36, 0, 0),
        fill_hex=ROYAL_DARK,
    )

    # Signature ornament pair on mid-right: Royal Blue 2x2 circles + Coral pinwheel
    draw_circle_grid_2x2(c, 382.0, 224.0, 68.0, ROYAL_DARK)
    draw_pinwheel(c, 450.0, 224.0, 68.0, CORAL_ACCENT)

    # Featured Scripture / Quotation callout right below the ornament pair
    if data.get("spotlight_html"):
        draw_rounded_box(
            c,
            x=374.0,
            y_top=308.0,
            w=166.0,
            h=172.0,
            radii=(14, 14, 14, 14),
            fill_hex="#F4F6FC",
            stroke_hex=ROYAL_MID,
            stroke_w=1.0,
        )
        st_spot = make_style(
            f"spot_{page_num}",
            font="Poppins-Italic",
            size=9.0,
            leading=13.5,
            color=ROYAL_MID,
            align=TA_LEFT,
            space_after=5.0,
        )
        draw_paragraphs_box(
            c,
            [(p, st_spot) for p in data["spotlight_html"]],
            x=385.0,
            y_top=319.0,
            w=144.0,
            max_h=154.0,
            label=f"Page {page_num} spotlight",
        )

    # Two-column justified deep prose across the lower half
    st_col = make_style(
        f"col_{page_num}",
        font="Poppins",
        size=9.1,
        leading=13.4,
        color=INK_DARK,
        align=TA_JUSTIFY,
        space_after=5.2,
    )
    draw_paragraphs_box(
        c,
        [(p, st_col) for p in data["left_col"]],
        x=56.0,
        y_top=494.0,
        w=230.0,
        max_h=304.0,
        label=f"Page {page_num} left_col",
    )
    draw_paragraphs_box(
        c,
        [(p, st_col) for p in data["right_col"]],
        x=308.0,
        y_top=494.0,
        w=230.0,
        max_h=304.0,
        label=f"Page {page_num} right_col",
    )

    draw_subtle_page_tag(c, page_num, dark_bg=False)


# ---------------------------------------------------------------------------
# 4. LAYOUT B: LEFT SIDEBAR + CORAL-BACKED ARCH PHOTO + CURVED BLUE CARD (Page 4)
# ---------------------------------------------------------------------------
def render_layout_sidebar_blue_arch(c: canvas.Canvas, data: dict, page_num: int) -> None:
    fill_page(c, WHITE)

    # Bottom-left Cream 2x2 circle cluster
    draw_circle_grid_2x2(c, 52.0, 560.0, 240.0, CREAM_SHAPE)

    # Top-right Coral rectangle + Arch-top-right photo (so Coral peeks out at top-right)
    draw_rounded_box(
        c,
        x=214.0,
        y_top=68.0,
        w=381.5,
        h=300.0,
        radii=(0, 0, 0, 0),
        fill_hex=CORAL_CARD,
    )
    draw_clipped_photo(
        c,
        data["photo"],
        x=206.0,
        y_top=64.0,
        w=346.0,
        h=304.0,
        radii=(0, 188, 0, 0),
        focus=data.get("photo_focus", (0.5, 0.25)),
    )

    # Left sidebar header + Coral pill badge + 3 structured callout blocks
    c.saveState()
    c.setFont("Poppins-Bold", 17.5)
    c.setFillColor(HexColor(ROYAL_MID))
    c.drawString(54.0, Y(88.0), data["sidebar_top_label_1"])
    c.drawString(54.0, Y(110.0), data["sidebar_top_label_2"])
    c.restoreState()

    draw_rounded_box(
        c,
        x=54.0,
        y_top=124.0,
        w=126.0,
        h=56.0,
        radii=(13, 13, 13, 13),
        fill_hex=CORAL_CARD,
    )
    c.saveState()
    c.setFont("Poppins-Bold", 30.0)
    c.setFillColor(HexColor(CREAM_TEXT))
    c.drawCentredString(54.0 + 63.0, Y(163.0), data["badge_number"])
    c.restoreState()

    # Sidebar metadata items
    st_sb_head = make_style(
        f"sbh_{page_num}",
        font="Poppins-Bold",
        size=11.5,
        leading=15.0,
        color=ROYAL_MID,
        align=TA_LEFT,
        space_after=2.0,
    )
    st_sb_val = make_style(
        f"sbv_{page_num}",
        font="Poppins",
        size=9.6,
        leading=13.8,
        color=ROYAL_MID,
        align=TA_LEFT,
        space_after=11.0,
    )
    sb_items = []
    for k_title, k_body in data["sidebar_items"]:
        sb_items.append((k_title, st_sb_head))
        sb_items.append((k_body, st_sb_val))

    draw_paragraphs_box(
        c,
        sb_items,
        x=54.0,
        y_top=198.0,
        w=136.0,
        max_h=580.0,
        label=f"Page {page_num} sidebar",
    )

    # Bottom-right Deep Royal Blue curved-bottom-left card
    draw_rounded_box(
        c,
        x=206.0,
        y_top=372.0,
        w=348.0,
        h=430.0,
        radii=(0, 0, 0, 142),
        fill_hex=ROYAL_DARK,
    )

    draw_display_lines(
        c,
        lines=data["card_title_lines"],
        x=528.0,
        y_top_first_baseline=426.0,
        size=38.0,
        line_step=38.0,
        align="right",
    )

    st_card_body = make_style(
        f"cb_{page_num}",
        font="Poppins",
        size=9.0,
        leading=13.3,
        color=CREAM_TEXT,
        align=TA_JUSTIFY,
        space_after=5.5,
    )
    draw_paragraphs_box(
        c,
        [(p, st_card_body) for p in data["card_paragraphs"]],
        x=266.0,
        y_top=478.0,
        w=262.0,
        max_h=282.0,
        label=f"Page {page_num} blue_card",
    )

    draw_subtle_page_tag(c, page_num, dark_bg=False)


# ---------------------------------------------------------------------------
# 5. LAYOUT C: QUADRANT SPLIT — TITLE/QUOTE + BLUE CURVE + CORAL BLOCK + PHOTO (Page 5)
# ---------------------------------------------------------------------------
def render_layout_quadrant_split(c: canvas.Canvas, data: dict, page_num: int) -> None:
    fill_page(c, WHITE)

    # Subtle Cream 2x2 circle clusters on upper-left
    draw_circle_grid_2x2(c, -60.0, -40.0, 220.0, CREAM_SHAPE)
    draw_circle_grid_2x2(c, 32.0, 228.0, 236.0, CREAM_SHAPE)

    # Top-left 3-line LilitaOne heading
    draw_display_lines(
        c,
        lines=data["title_lines"],
        x=46.0,
        y_top_first_baseline=88.0,
        size=44.0,
        line_step=43.0,
        align="left",
    )

    # Key Quotation / Thesis beneath top-left heading
    st_tl = make_style(
        f"tl_{page_num}",
        font="Poppins",
        size=9.5,
        leading=14.2,
        color=INK_DARK,
        align=TA_LEFT,
        space_after=6.0,
    )
    draw_paragraphs_box(
        c,
        [(p, st_tl) for p in data["top_left_notes"]],
        x=46.0,
        y_top=198.0,
        w=246.0,
        max_h=190.0,
        label=f"Page {page_num} top_left",
    )

    # Top-right Royal Blue curved-bottom-left panel
    draw_rounded_box(
        c,
        x=314.0,
        y_top=0.0,
        w=281.5,
        h=390.0,
        radii=(0, 0, 0, 155),
        fill_hex=ROYAL_DARK,
    )
    c.saveState()
    c.setFont("Poppins-Bold", 20.0)
    c.setFillColor(HexColor(BLUSH))
    c.drawRightString(556.0, Y(56.0), data["blue_panel_heading"])
    c.restoreState()

    st_bp = make_style(
        f"bp_{page_num}",
        font="Poppins",
        size=9.2,
        leading=13.5,
        color=CREAM_TEXT,
        align=TA_RIGHT,
        space_after=7.5,
    )
    draw_paragraphs_box(
        c,
        [(p, st_bp) for p in data["blue_panel_items"]],
        x=376.0,
        y_top=74.0,
        w=180.0,
        max_h=272.0,
        label=f"Page {page_num} blue_panel",
    )

    # Bottom-left full-bleed Coral panel with two rich sub-sections
    draw_rounded_box(
        c,
        x=0.0,
        y_top=404.0,
        w=312.0,
        h=404.0,
        radii=(0, 0, 0, 0),
        fill_hex=CORAL_CARD,
    )

    c.saveState()
    c.setFont("Poppins-Bold", 20.5)
    c.setFillColor(HexColor(CREAM_TEXT))
    c.drawString(44.0, Y(444.0), data["coral_head_1"])
    c.restoreState()

    st_coral = make_style(
        f"cor_{page_num}",
        font="Poppins",
        size=9.3,
        leading=13.8,
        color=CREAM_TEXT,
        align=TA_JUSTIFY,
        space_after=5.0,
    )
    used1 = draw_paragraphs_box(
        c,
        [(p, st_coral) for p in data["coral_body_1"]],
        x=44.0,
        y_top=456.0,
        w=244.0,
        max_h=148.0,
        label=f"Page {page_num} coral_1",
    )

    sec2_head_y = max(622.0, 456.0 + used1 + 26.0)
    c.saveState()
    c.setFont("Poppins-Bold", 20.5)
    c.setFillColor(HexColor(CREAM_TEXT))
    c.drawString(44.0, Y(sec2_head_y), data["coral_head_2"])
    c.restoreState()

    draw_paragraphs_box(
        c,
        [(p, st_coral) for p in data["coral_body_2"]],
        x=44.0,
        y_top=sec2_head_y + 12.0,
        w=244.0,
        max_h=796.0 - (sec2_head_y + 12.0),
        label=f"Page {page_num} coral_2",
    )

    # Bottom-right Arch-top-right Photo
    draw_clipped_photo(
        c,
        data["photo"],
        x=312.0,
        y_top=404.0,
        w=252.0,
        h=404.0,
        radii=(0, 172, 0, 0),
        focus=data.get("photo_focus", (0.5, 0.25)),
    )

    draw_subtle_page_tag(c, page_num, dark_bg=False)


# ---------------------------------------------------------------------------
# 6. LAYOUT D: VERTICAL TOTEM + ROYAL-BLUE 4-STAGE PORTRAIT TIMELINE (Page 6)
# ---------------------------------------------------------------------------
def render_layout_timeline_portraits(c: canvas.Canvas, data: dict, page_num: int) -> None:
    fill_page(c, WHITE)

    # Left alternating Coral circles + Royal Blue pinwheel totem strip
    draw_totem_strip(c, 46.0, 82.0, 84.0, pairs=4)

    # Main Royal Blue rounded-left panel
    draw_rounded_box(
        c,
        x=154.0,
        y_top=52.0,
        w=352.0,
        h=744.0,
        radii=(72, 0, 0, 72),
        fill_hex=ROYAL_DARK,
    )

    # Right Cream + Coral vertical edge bands
    draw_rounded_box(c, 506.0, 52.0, 58.0, 744.0, radii=(0, 0, 0, 0), fill_hex=CREAM_SHAPE)
    draw_rounded_box(c, 564.0, 52.0, 31.5, 744.0, radii=(0, 0, 0, 0), fill_hex=CORAL_CARD)

    # Vertical timeline spine line behind circular portraits
    c.saveState()
    c.setStrokeColor(HexColor(CREAM_SHAPE))
    c.setLineWidth(3.0)
    c.line(432.0, 0, 432.0, H)
    c.restoreState()

    # Header inside blue panel (stays cleanly left of vertical spine x=432)
    draw_display_lines(
        c,
        lines=[
            (data["title_big"], CREAM_TEXT, 52.0),
            (data["title_sub"], CORAL_ACCENT, 34.0),
        ],
        x=194.0,
        y_top_first_baseline=120.0,
        line_step=42.0,
        align="left",
    )

    # 4 stages with white-ringed circular portraits
    start_cy = 258.0
    step_cy = 144.0
    st_stage = make_style(
        f"stg_{page_num}",
        font="Poppins",
        size=9.1,
        leading=13.2,
        color=CREAM_TEXT,
        align=TA_RIGHT,
        space_after=2.0,
    )

    for idx, stage in enumerate(data["stages"]):
        cy = start_cy + idx * step_cy
        draw_circular_portrait(
            c,
            stage["photo"],
            cx=432.0,
            cy_top=cy,
            r=46.0,
            ring_hex=CREAM_SHAPE,
            ring_w=5.5,
            focus=stage.get("focus", (0.5, 0.25)),
        )
        draw_paragraphs_box(
            c,
            [(stage["html"], st_stage)],
            x=174.0,
            y_top=cy - 44.0,
            w=196.0,
            max_h=105.0,
            label=f"Page {page_num} stage_{idx+1}",
        )

    draw_subtle_page_tag(c, page_num, dark_bg=False)


# ---------------------------------------------------------------------------
# 7. LAYOUT E: CORAL TOP BANNER + TALL PHOTO + OVERLAPPING BLUE GUIDE CARD (Page 7)
# ---------------------------------------------------------------------------
def render_layout_coral_banner_overlap(c: canvas.Canvas, data: dict, page_num: int) -> None:
    fill_page(c, WHITE)

    # Left vertical Coral accent stripe (stops cleanly above subtle footer)
    c.saveState()
    c.setStrokeColor(HexColor(CORAL_CARD))
    c.setLineWidth(7.0)
    c.line(58.0, H - 806.0, 58.0, H)
    c.restoreState()

    # Top-right Coral banner
    draw_rounded_box(
        c,
        x=112.0,
        y_top=0.0,
        w=483.5,
        h=172.0,
        radii=(0, 0, 0, 0),
        fill_hex=CORAL_CARD,
    )
    draw_display_lines(
        c,
        lines=data["banner_lines"],
        x=548.0,
        y_top_first_baseline=78.0,
        size=47.0,
        line_step=47.0,
        align="right",
    )

    # Large right-side feature photo with sweeping bottom-left curve
    draw_clipped_photo(
        c,
        data["photo"],
        x=112.0,
        y_top=172.0,
        w=483.5,
        h=614.0,
        radii=(0, 0, 0, 175),
        focus=data.get("photo_focus", (0.5, 0.25)),
    )

    # Overlapping Left Royal Blue rounded card
    draw_rounded_box(
        c,
        x=30.0,
        y_top=222.0,
        w=308.0,
        h=578.0,
        radii=(36, 36, 36, 36),
        fill_hex=ROYAL_MID,
    )

    # 2x2 Coral circle cluster straddling lower-right edge of blue card
    draw_circle_grid_2x2(c, 304.0, 596.0, 74.0, CORAL_ACCENT)

    st_item = make_style(
        f"ov_{page_num}",
        font="Poppins",
        size=9.2,
        leading=13.5,
        color=CREAM_TEXT,
        align=TA_LEFT,
        space_after=8.0,
    )
    draw_paragraphs_box(
        c,
        [(p, st_item) for p in data["points_html"]],
        x=54.0,
        y_top=248.0,
        w=246.0,
        max_h=528.0,
        label=f"Page {page_num} overlap_points",
    )

    draw_subtle_page_tag(c, page_num, dark_bg=False)


# ---------------------------------------------------------------------------
# 8. LAYOUT F: FULL ROYAL-BLUE PAGE + ARCH PHOTO + CORAL CARD + 6 ICONS (Page 8)
# ---------------------------------------------------------------------------
def render_layout_full_blue_icons(c: canvas.Canvas, data: dict, page_num: int) -> None:
    fill_page(c, ROYAL_DARK)

    # Top Arch-top-right Photo
    draw_clipped_photo(
        c,
        data["photo"],
        x=56.0,
        y_top=42.0,
        w=483.5,
        h=338.0,
        radii=(24, 192, 24, 24),
        focus=data.get("photo_focus", (0.5, 0.28)),
    )

    # Overlapping Vibrant Coral rounded banner card
    draw_rounded_box(
        c,
        x=76.0,
        y_top=296.0,
        w=416.0,
        h=168.0,
        radii=(26, 26, 26, 26),
        fill_hex=CORAL_CARD,
    )

    draw_display_lines(
        c,
        lines=data["coral_title_lines"],
        x=108.0,
        y_top_first_baseline=358.0,
        size=45.0,
        line_step=44.0,
        align="left",
    )

    if data.get("coral_epigraph"):
        st_epi = make_style(
            f"epi_{page_num}",
            font="Poppins-Italic",
            size=9.3,
            leading=13.4,
            color=CREAM_WARM,
            align=TA_LEFT,
            space_after=0,
        )
        draw_paragraphs_box(
            c,
            [(data["coral_epigraph"], st_epi)],
            x=108.0,
            y_top=416.0,
            w=362.0,
            max_h=40.0,
            label=f"Page {page_num} coral_epigraph",
        )

    # 2x3 Grid of 6 Coral icon badges + rich takeaways
    st_grid = make_style(
        f"grd_{page_num}",
        font="Poppins",
        size=8.9,
        leading=13.0,
        color=CREAM_TEXT,
        align=TA_LEFT,
        space_after=0,
    )
    col_xs = [56.0, 312.0]
    row_ys = [492.0, 594.0, 696.0]

    for idx, item in enumerate(data["icon_items"]):
        r_idx = idx // 2
        c_idx = idx % 2
        bx = col_xs[c_idx]
        by = row_ys[r_idx]

        draw_rounded_box(
            c,
            x=bx,
            y_top=by,
            w=46.0,
            h=46.0,
            radii=(10, 10, 10, 10),
            fill_hex=CORAL_CARD,
        )
        draw_vector_icon(c, item["icon"], bx + 23.0, by + 23.0, 24.0, CREAM_TEXT)

        draw_paragraphs_box(
            c,
            [(item["html"], st_grid)],
            x=bx + 58.0,
            y_top=by - 2.0,
            w=186.0,
            max_h=92.0,
            label=f"Page {page_num} icon_{idx+1}",
        )

    draw_subtle_page_tag(c, page_num, dark_bg=True)


# ---------------------------------------------------------------------------
# 9. LAYOUT G: BLUSH BASE + LEFT BLUE PILLAR SIDEBAR + ARCH PHOTO + PROSE (Page 9)
# ---------------------------------------------------------------------------
def render_layout_blush_sidebar_pillars(c: canvas.Canvas, data: dict, page_num: int) -> None:
    fill_page(c, BLUSH)

    # Cream 2x2 circle motifs top-left & bottom-right
    draw_circle_grid_2x2(c, 62.0, -70.0, 330.0, CREAM_SHAPE)
    draw_circle_grid_2x2(c, 260.0, 510.0, 340.0, CREAM_SHAPE)

    # Left tall Deep Royal Blue rounded-right sidebar
    draw_rounded_box(
        c,
        x=0.0,
        y_top=52.0,
        w=198.0,
        h=740.0,
        radii=(0, 32, 32, 0),
        fill_hex=ROYAL_DARK,
    )

    # 5 Coral horizontal pill bars + centered white pillars inside sidebar
    st_pil = make_style(
        f"pil_{page_num}",
        font="Poppins",
        size=9.5,
        leading=13.6,
        color=CREAM_TEXT,
        align=TA_CENTER,
        space_after=0,
    )
    start_py = 96.0
    step_py = 132.0
    for idx, pil_html in enumerate(data["pillars"]):
        py = start_py + idx * step_py
        draw_rounded_box(
            c,
            x=61.0,
            y_top=py,
            w=76.0,
            h=12.0,
            radii=(6, 6, 6, 6),
            fill_hex=CORAL_CARD,
        )
        draw_paragraphs_box(
            c,
            [(pil_html, st_pil)],
            x=18.0,
            y_top=py + 20.0,
            w=162.0,
            max_h=96.0,
            label=f"Page {page_num} pillar_{idx+1}",
        )

    # Top-right Arch-top-right Photo
    draw_clipped_photo(
        c,
        data["photo"],
        x=236.0,
        y_top=52.0,
        w=308.0,
        h=266.0,
        radii=(0, 152, 0, 0),
        focus=data.get("photo_focus", (0.5, 0.25)),
    )

    # Mid-right two-tone LilitaOne heading
    draw_display_lines(
        c,
        lines=data["title_lines"],
        x=544.0,
        y_top_first_baseline=374.0,
        size=46.0,
        line_step=45.0,
        align="right",
    )

    # Right prose exposition in Royal Blue
    st_prose = make_style(
        f"prs_{page_num}",
        font="Poppins",
        size=9.7,
        leading=14.6,
        color=ROYAL_MID,
        align=TA_JUSTIFY,
        space_after=6.5,
    )
    draw_paragraphs_box(
        c,
        [(p, st_prose) for p in data["body_paragraphs"]],
        x=236.0,
        y_top=440.0,
        w=308.0,
        max_h=300.0,
        label=f"Page {page_num} prose",
    )

    # Bottom-right 2x2 Coral circle motif
    draw_circle_grid_2x2(c, 480.0, 744.0, 62.0, CORAL_ACCENT)

    draw_subtle_page_tag(c, page_num, dark_bg=False)


# ---------------------------------------------------------------------------
# 10. BACK COVER / MINISTRY & CONTACT PAGE (Exact Page 10 of `company book.pdf`)
# ---------------------------------------------------------------------------
def render_back_cover_contact(c: canvas.Canvas, data: dict, page_num: int = 20) -> None:
    fill_page(c, BLUSH)

    # Subtle Cream circle clusters
    draw_circle_grid_2x2(c, -110.0, -80.0, 320.0, CREAM_SHAPE)
    draw_circle_grid_2x2(c, 280.0, 540.0, 350.0, CREAM_SHAPE)

    # Right vertical alternating Coral circles + Royal Blue pinwheel totem strip
    draw_totem_strip(c, 474.0, 84.0, 62.0, pairs=4)

    # Bottom sweeping Coral arch-right card
    draw_rounded_box(
        c,
        x=56.0,
        y_top=432.0,
        w=468.0,
        h=356.0,
        radii=(0, 236, 0, 68),
        fill_hex=CORAL_CARD,
    )

    # Top Deep Royal Blue rounded contact card
    draw_rounded_box(
        c,
        x=56.0,
        y_top=80.0,
        w=396.0,
        h=366.0,
        radii=(30, 30, 30, 30),
        fill_hex=ROYAL_DARK,
    )

    # 3 Contact rows inside Royal Blue card
    rows = data["contact_rows"]
    row_y = 126.0
    for icon_kind, label, val_line1, val_line2 in rows:
        draw_circle(c, 122.0, row_y + 18.0, 20.0, CORAL_ACCENT)
        draw_vector_icon(c, icon_kind, 122.0, row_y + 18.0, 20.0, CREAM_TEXT)
        c.saveState()
        c.setFont("Poppins-Bold", 14.5)
        c.setFillColor(HexColor(CREAM_TEXT))
        c.drawString(158.0, Y(row_y + 11.0), label)
        c.setFont("Poppins", 11.8)
        c.drawString(158.0, Y(row_y + 29.0), val_line1)
        if val_line2:
            c.setFont("Poppins-Italic", 9.8)
            c.setFillColor(HexColor("#C9D4FF"))
            c.drawString(158.0, Y(row_y + 44.0), val_line2)
        c.restoreState()
        row_y += 88.0

    # Overlapping Light Pill Card with Royal Blue Location Pin Circle
    draw_rounded_box(
        c,
        x=102.0,
        y_top=394.0,
        w=308.0,
        h=108.0,
        radii=(32, 32, 32, 32),
        fill_hex=LIGHT_PILL,
    )
    draw_circle(c, 174.0, 448.0, 36.0, ROYAL_DARK)
    draw_vector_icon(c, "pin", 174.0, 448.0, 34.0, CREAM_TEXT)

    st_loc = make_style(
        "back_loc",
        font="Poppins-Medium",
        size=11.0,
        leading=15.8,
        color=ROYAL_MID,
        align=TA_LEFT,
        space_after=0,
    )
    draw_paragraphs_box(
        c,
        [(data["location_html"], st_loc)],
        x=224.0,
        y_top=418.0,
        w=172.0,
        max_h=74.0,
        label="Back location",
    )

    # Huge Display Brand Title on Coral Bottom Card
    draw_display_lines(
        c,
        lines=[
            (data["bottom_big_1"], CREAM_WARM, 66.0),
            (data["bottom_big_2"], CREAM_WARM, 42.0),
        ],
        x=102.0,
        y_top_first_baseline=606.0,
        line_step=52.0,
        align="left",
    )

    st_ben = make_style(
        "back_ben",
        font="Poppins-Medium",
        size=10.5,
        leading=15.5,
        color=CREAM_WARM,
        align=TA_LEFT,
        space_after=0,
    )
    draw_paragraphs_box(
        c,
        [(data["benediction_html"], st_ben)],
        x=102.0,
        y_top=682.0,
        w=356.0,
        max_h=88.0,
        label="Back benediction",
    )

    draw_subtle_page_tag(c, page_num, dark_bg=False)
