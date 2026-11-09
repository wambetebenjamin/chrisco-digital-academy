"""
Wambete Benjamin — CV, replicating the collage layout of the supplied
resume.pdf (Canva "ripped paper" template), rebuilt in the CHRISCO palette.

Geometry taken from the reference PDF, in points on A4 (595.5 x 842.25):
    left column  x = 48, width 207
    right column x = 322, width 207
    section bars 207 x 43.1, three per column
    name         Archivo Black, rotated 4.65 deg, white offset shadow
    labels       18.9 pt, rotated 1.52 deg

Run:  python cv/build_resume.py
Out:  assets/Wambete-Benjamin-Resume.pdf
"""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
FONTS = ROOT / "tools" / "promo" / "fonts"
IMG = HERE / "assets"
OUT = ROOT / "assets" / "Wambete-Benjamin-Resume.pdf"

W, H = 595.5, 842.25

# ---------------------------------------------------------------- palette
PAPER = (250, 248, 243)
INK = (26, 24, 21)
SOFT = (92, 86, 76)
BLOOD = (122, 46, 42)
BLOOD_DK = (94, 33, 30)
TINT = (233, 222, 214)
WHITE = (255, 255, 255)

# ---------------------------------------------------------------- geometry
LX, LW = 48.0, 207.0
RX, RW = 322.0, 207.0
RIGHT_EDGE = RX + RW            # 529
NAME_ROT = 4.65
LABEL_ROT = 1.52
BAR_H = 43.1

CONF = {
    "first": "WAMBETE",
    "last": "BENJAMIN",
    "role": "GRAPHIC DESIGNER",
    "email": "shambetz@gmail.com",
    "phone": "+256 763 393 021",
    "about": "Designer and builder working across brand identity, print and "
             "social. I design the identity and then build the thing it lives "
             "on, so a brand ships as a working product, not a folder of files.",
}

SKILLS = [
    ("Brand Identity", 0.92),
    ("Print & Merchandise", 0.90),
    ("Editorial Layout", 0.88),
    ("Social & Campaign", 0.90),
    ("Web & Product Design", 0.85),
]

TOOLS = ["Figma · Photoshop · Illustrator · Canva",
         "CapCut · InDesign · After Effects",
         "Next.js · React · Tailwind CSS",
         "Python · Supabase · Git · FFmpeg"]

WORK = [
    ("Founder, designer & developer", "CHRISCO Digital Academy", "2024 – Present", [
        "Designed the brand: wordmark, palette, type system.",
        "Built the platform: 19 courses, library, shop.",
        "Laid out and published 20 print-ready guides.",
        "Produced the launch film and poster artwork.",
    ]),
    ("Graphic designer", "Freelance & community projects", "2023 – Present", [
        "Brand and campaign visuals for small businesses.",
        "Posters, flyers, thumbnails, social kits.",
        "Report and evidence-pack design.",
    ]),
]

EDUCATION = [
    ("Self-directed study", "Design, typography & front-end development"),
]

SELECTED = [
    ("CHRISCO Digital Academy", "Platform, brand system, 19 courses"),
    ("20 published guides", "Editorial layout and cover series"),
    ("Launch film", "Script, motion graphics, edit"),
    ("Merchandise system", "3 collections, print specs"),
]


class Doc(FPDF):
    def header(self) -> None:
        pass

    def footer(self) -> None:
        pass


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = Doc(orientation="P", unit="pt", format=(W, H))
    pdf.set_auto_page_break(False)
    pdf.add_font("Archivo", "", str(FONTS / "Archivo.ttf"))
    pdf.add_font("Black", "", str(FONTS / "ArchivoBlack-Regular.ttf"))
    pdf.add_font("Inter", "", str(FONTS / "Inter.ttf"))
    pdf.add_page()

    # ============================================================ paper stack
    pdf.set_fill_color(*PAPER)
    pdf.rect(0, 0, W, H, style="F")

    # crumpled paper over the whole sheet
    pdf.image(str(IMG / "wrinkle.png"), x=-40, y=0, w=W + 90, h=H, keep_aspect_ratio=False)
    # torn kraft, top-left (same slot as the template)
    pdf.image(str(IMG / "torn-corner.png"), x=-140, y=-178, w=510, h=650)
    # gingham strip, top-right
    pdf.image(str(IMG / "gingham.png"), x=182, y=-141, w=496, h=245)
    # graph paper, bottom-right
    pdf.image(str(IMG / "graph.png"), x=266, y=588, w=352, h=292)
    # kraft wedge behind the ring only (left edge, mid page)
    pdf.image(str(IMG / "torn-corner.png"), x=-118, y=250, w=300, h=420)
    # torn paper ring, top-left
    pdf.image(str(IMG / "ring.png"), x=35.6, y=83.8, w=241, h=241)

    # decorative marks
    pdf.image(str(IMG / "star.png"), x=494, y=24, w=61, h=60)
    pdf.image(str(IMG / "star.png"), x=-24, y=612, w=62, h=61)
    pdf.image(str(IMG / "clip.png"), x=49.6, y=82.6, w=52, h=87)

    # ============================================================ monogram
    cx, cy, r = 35.6 + 120.5, 83.8 + 120.5, 106.0
    pdf.set_fill_color(*BLOOD)
    pdf.ellipse(cx - r, cy - r, 2 * r, 2 * r, style="F")
    pdf.set_font("Black", "", 60)
    pdf.set_text_color(*PAPER)
    pdf.set_xy(cx - 60, cy - 29)
    pdf.cell(120, 58, "WB", align="C")

    # ============================================================ name
    def fit_size(text: str, max_w: float, start: float, floor: float = 26.0) -> float:
        size = start
        while size > floor:
            pdf.set_font("Black", "", size)
            if pdf.get_string_width(text) <= max_w:
                break
            size -= 0.5
        return size

    NAME_MAX_W = RIGHT_EDGE - 297.0 - 6.0    # keep it inside the right margin

    def shadowed(text: str, x: float, base_y: float, size: float,
                 rot: float, color=BLOOD, off: float = 3.0) -> None:
        pdf.set_font("Black", "", size)
        pdf.set_text_color(*WHITE)
        with pdf.rotation(rot, x, base_y):
            pdf.set_xy(x + off, base_y - size * 0.80 + off)
            pdf.cell(max_w_hack, size * 1.2, text)
        pdf.set_text_color(*color)
        with pdf.rotation(rot, x, base_y):
            pdf.set_xy(x, base_y - size * 0.80)
            pdf.cell(max_w_hack, size * 1.2, text)

    max_w_hack = 400

    s1 = fit_size(CONF["first"], NAME_MAX_W, 68)
    s2 = fit_size(CONF["last"], NAME_MAX_W, 68)
    ns = min(s1, s2)

    shadowed(CONF["first"], 340, 160, ns, NAME_ROT)
    shadowed(CONF["last"], 297, 228, ns, NAME_ROT)

    # ============================================================ role bar
    ROLE_Y, ROLE_H = 247.0, 72.2
    pdf.set_fill_color(*BLOOD)
    pdf.rect(306.6, ROLE_Y, 219.4, ROLE_H, style="F")
    rs = 20.9
    pdf.set_font("Black", "", rs)
    while pdf.get_string_width(CONF["role"]) > 219.4 - 26 and rs > 11:
        rs -= 0.4
        pdf.set_font("Black", "", rs)
    tw = pdf.get_string_width(CONF["role"])
    pdf.set_text_color(*PAPER)
    with pdf.rotation(LABEL_ROT, 306.6 + 219.4 / 2, ROLE_Y + ROLE_H / 2):
        pdf.set_xy(306.6 + (219.4 - tw) / 2, ROLE_Y + ROLE_H / 2 - rs * 0.42)
        pdf.cell(tw + 2, rs, CONF["role"])

    # ============================================================ section bars
    def bar(x: float, y: float, label: str, w: float = LW) -> None:
        pdf.set_fill_color(*BLOOD)
        pdf.rect(x, y, w, BAR_H, style="F")
        size = 18.9
        pad = 18.0
        pdf.set_font("Black", "", size)
        while pdf.get_string_width(label) > w - pad and size > 9.0:
            size -= 0.3
            pdf.set_font("Black", "", size)
        tw = pdf.get_string_width(label)
        pdf.set_text_color(*PAPER)
        with pdf.rotation(LABEL_ROT, x + w / 2, y + BAR_H / 2):
            pdf.set_xy(x + (w - tw) / 2, y + BAR_H / 2 - size * 0.42)
            pdf.cell(tw + 2, size, label)

    # ============================================================ LEFT column
    bar(LX, 359.0, "ABOUT ME")
    pdf.set_font("Inter", "", 11.0)
    pdf.set_text_color(*INK)
    pdf.set_xy(LX + 0.3, 416.0)
    pdf.multi_cell(LW, 13.4, CONF["about"], align="L")
    about_end = pdf.get_y()

    SK_Y = max(about_end + 12, 505.0)
    bar(LX, SK_Y, "SKILLS")

    py = SK_Y + BAR_H + 16.0
    for name, val in SKILLS:
        pdf.set_font("Inter", "", 11.4)
        pdf.set_text_color(*INK)
        pdf.set_xy(LX + 1.4, py)
        pdf.cell(LW, 11, name)
        pdf.set_fill_color(*TINT)
        pdf.rect(LX + 0.8, py + 14.2, LW, 11.0, style="F",
                 round_corners=True, corner_radius=5.5)
        pdf.set_fill_color(*BLOOD)
        pdf.rect(LX + 0.8, py + 14.2, LW * val, 11.0, style="F",
                 round_corners=True, corner_radius=5.5)
        py += 27.5

    TO_Y = py + 4.0
    bar(LX, TO_Y, "TOOLS")
    ty = TO_Y + BAR_H + 14.0
    pdf.set_font("Inter", "", 10.4)
    pdf.set_text_color(*INK)
    for line in TOOLS:
        if ty > H - 34:
            break
        pdf.set_xy(LX + 1.4, ty)
        pdf.cell(LW, 11.6, line)
        ty += 14.6

    # ============================================================ RIGHT column
    WORK_Y = 376.0
    bar(RX, WORK_Y, "WORK EXPERIENCE")

    wy = WORK_Y + BAR_H + 16.0
    for title, org, when, bullets in WORK:
        pdf.set_font("Archivo", "", 12.2)
        pdf.set_text_color(*BLOOD_DK)
        pdf.set_xy(RX + 0.9, wy)
        pdf.cell(RW, 13, title)
        wy += 13.5
        pdf.set_font("Inter", "", 10.9)
        pdf.set_text_color(*SOFT)
        pdf.set_xy(RX + 0.9, wy)
        pdf.cell(RW, 12, org)
        pdf.set_xy(RX + 0.9 + pdf.get_string_width(org) + 8, wy)
        pdf.cell(RW, 12, when)
        wy += 15.0
        for b in bullets:
            pdf.set_font("Inter", "", 10.3)
            pdf.set_text_color(*INK)
            pdf.set_xy(RX + 2.0, wy)
            pdf.cell(8, 11.6, "\u2022")
            pdf.set_xy(RX + 10.0, wy)
            pdf.multi_cell(RW - 10.0, 11.6, b, align="L")
            wy = pdf.get_y() + 2.4
        wy += 7.0

    ED_Y = wy + 8.0
    bar(RX, ED_Y, "EDUCATION")
    ey = ED_Y + BAR_H + 16.0
    for title, detail in EDUCATION:
        pdf.set_font("Archivo", "", 12.0)
        pdf.set_text_color(*BLOOD_DK)
        pdf.set_xy(RX + 0.9, ey)
        pdf.cell(RW, 13, title)
        pdf.set_font("Inter", "", 10.6)
        pdf.set_text_color(*SOFT)
        pdf.set_xy(RX + 0.9, ey + 13)
        pdf.cell(RW, 12, detail)
        ey += 31.0

    # contact block: after education, but never overrunning the page foot
    CONTACT_Y = H - 74.0
    pdf.set_fill_color(*BLOOD)
    pdf.rect(RX - 6, CONTACT_Y, 216, 66, style="F")
    pdf.set_font("Inter", "", 11.2)
    pdf.set_text_color(*PAPER)
    # icons drawn as vectors (the text font has no phone / mail glyphs)
    def icon_disc(x: float, y: float, d: float = 15.0) -> None:
        pdf.set_fill_color(*INK)
        pdf.ellipse(x, y, d, d, style="F")

    def icon_phone(x: float, y: float, d: float = 15.0) -> None:
        icon_disc(x, y, d)
        cx0, cy0 = x + d / 2, y + d / 2
        # handset: a bar with a fat cap at each end, set at 45 deg
        with pdf.rotation(45, cx0, cy0):
            pdf.set_fill_color(*PAPER)
            pdf.rect(cx0 - 4.2, cy0 - 1.05, 8.4, 2.1, style="F",
                     round_corners=True, corner_radius=1.05)
            pdf.rect(cx0 - 5.0, cy0 - 2.6, 3.1, 5.2, style="F",
                     round_corners=True, corner_radius=1.4)
            pdf.rect(cx0 + 1.9, cy0 - 2.6, 3.1, 5.2, style="F",
                     round_corners=True, corner_radius=1.4)

    def icon_mail(x: float, y: float, d: float = 15.0) -> None:
        icon_disc(x, y, d)
        pdf.set_draw_color(*PAPER)
        pdf.set_line_width(0.75)
        bx, by, bw, bh = x + 3.4, y + 4.6, d - 6.8, d - 9.2
        pdf.rect(bx, by, bw, bh)
        pdf.line(bx + 0.2, by + 0.4, bx + bw / 2, by + bh * 0.58)
        pdf.line(bx + bw - 0.2, by + 0.4, bx + bw / 2, by + bh * 0.58)

    for i, line in enumerate([CONF["phone"], CONF["email"]]):
        yy = CONTACT_Y + 14 + i * 24
        (icon_phone if i == 0 else icon_mail)(RX + 6, yy)
        pdf.set_text_color(*PAPER)
        pdf.set_font("Inter", "", 11.2)
        pdf.set_xy(RX + 30, yy + 2.0)
        pdf.cell(175, 13, line)

    # selected work below contact if room, else above — reference puts it last
    SW_Y = CONTACT_Y + 66 + 8.0
    if SW_Y + 22 * len(SELECTED) < H - 12:
        sy = SW_Y + 4.0
        for name, detail in SELECTED:
            pdf.set_font("Inter", "", 10.0)
            pdf.set_text_color(*INK)
            pdf.set_xy(RX + 0.9, sy)
            pdf.cell(RW, 10.6, "\u2022  " + name)
            pdf.set_text_color(*SOFT)
            pdf.set_xy(RX + 8.9, sy + 9.4)
            pdf.cell(RW - 8.9, 9.6, detail)
            sy += 20.0

    pdf.output(str(OUT))
    print(f"wrote {OUT}  ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
