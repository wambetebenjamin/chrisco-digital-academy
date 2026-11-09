"""
Builds Wambete Benjamin's one-page CV in the "ripped paper / collage" style
of the supplied Canva template, but as a real vector PDF with selectable text
(recruiters and ATS systems can read it; a Canva export of a collage cannot).

Run:  python build_cv.py
Out:  ../assets/Wambete-Benjamin-CV.pdf
"""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

HERE = Path(__file__).resolve().parent
FONTS = HERE.parent / "tools" / "promo" / "fonts"
OUT = HERE.parent / "assets" / "Wambete-Benjamin-CV.pdf"

# ---------------------------------------------------------------- palette
# Paper and ink. No gradients, no glow, no gold — print colours only.
PAPER = (250, 248, 243)      # page
PAPER_DEEP = (238, 232, 220)  # second sheet, slightly toned
INK = (26, 24, 21)           # near-black type
INK_SOFT = (92, 86, 76)      # secondary type
RULE = (198, 189, 172)       # hairlines
BLOOD = (122, 46, 42)        # the one accent
MOSS = (63, 74, 60)
OCHRE = (117, 84, 26)

A4 = (210.0, 297.0)
M = 15.0  # page margin

# ---------------------------------------------------------------- config
# Everything a recruiter might query lives here, so it is one place to correct.
CONF = {
    "name": "WAMBETE BENJAMIN",
    "role": "GRAPHIC DESIGNER  ·  WEB & PRODUCT DESIGNER",
    "email": "shambetz@gmail.com",
    "phone": "+254 112 272 061",
    "phone_alt": "+256 755 467 513",
    "location": "Jinja, Uganda",
    "status": "Open to opportunities",
    # Dates below are the most likely thing to need correcting.
    "chrisco_from": "2024", "chrisco_to": "Present",
    "freelance_from": "2023", "freelance_to": "Present",
}


class CV(FPDF):
    def header(self) -> None:
        pass

    def footer(self) -> None:
        pass


def torn_edge(pdf: CV, x: float, y: float, w: float, h: float, seed: int) -> None:
    """A torn-paper edge: a ragged line rather than a clean rule."""
    import math
    import random

    rnd = random.Random(seed)
    pdf.set_line_width(0.5)
    pdf.set_draw_color(*RULE)
    pts: list[tuple[float, float]] = []
    steps = max(6, int(h / 2.2))
    for i in range(steps + 1):
        yy = y + h * i / steps
        jag = (math.sin(i * 1.7 + seed) * 1.1) + rnd.uniform(-0.9, 0.9)
        pts.append((x + jag, yy))
    for i in range(len(pts) - 1):
        pdf.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])


def tape(pdf: CV, cx: float, cy: float, w: float = 16.0, h: float = 6.0,
         angle: float = 0.0) -> None:
    """A strip of washi tape, rendered as a flat tinted band with a hairline."""
    with pdf.rotation(angle, cx, cy):
        pdf.set_fill_color(226, 216, 198)
        pdf.rect(cx - w / 2, cy - h / 2, w, h, style="F")
        pdf.set_draw_color(203, 192, 172)
        pdf.set_line_width(0.3)
        pdf.rect(cx - w / 2, cy - h / 2, w, h, style="F")


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)

    pdf = CV(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(False)
    pdf.set_margins(M, M, M)

    # fonts -------------------------------------------------------------
    pdf.add_font("Archivo", "", str(FONTS / "Archivo.ttf"))
    pdf.add_font("ArchivoB", "", str(FONTS / "ArchivoBlack-Regular.ttf"))
    pdf.add_font("Inter", "", str(FONTS / "Inter.ttf"))

    pdf.add_page()
    pdf.set_fill_color(*PAPER)
    pdf.rect(0, 0, A4[0], A4[1], style="F")

    # ---------------------------------------------------------------- masthead
    pdf.set_fill_color(*INK)
    pdf.rect(0, 0, A4[0], 46, style="F")

    # monogram block (letterhead mark, not a borrowed logo)
    pdf.set_fill_color(*BLOOD)
    pdf.rect(M, 11.5, 19, 19, style="F")
    pdf.set_font("ArchivoB", "", 15)
    pdf.set_text_color(*PAPER)
    pdf.set_xy(M, 15.4)
    pdf.cell(19, 11, "WB", align="C")

    pdf.set_text_color(*PAPER)
    pdf.set_font("ArchivoB", "", 25)
    pdf.set_xy(M + 26, 11.0)
    pdf.cell(120, 11, CONF["name"])

    pdf.set_font("Inter", "", 9.6)
    pdf.set_text_color(214, 205, 189)
    pdf.set_xy(M + 26.4, 22.4)
    pdf.cell(140, 6, CONF["role"])

    # contact line, right aligned inside the masthead
    pdf.set_font("Inter", "", 8.4)
    pdf.set_text_color(198, 189, 172)
    contact = [
        CONF["email"],
        CONF["phone"],
        CONF["location"],
        CONF["status"],
    ]
    yy = 12.0
    for c in contact:
        pdf.set_xy(A4[0] - M - 62, yy)
        pdf.cell(62, 4.6, c, align="R")
        yy += 5.4

    # thin blood rule under the masthead
    pdf.set_fill_color(*BLOOD)
    pdf.rect(0, 46, A4[0], 1.2, style="F")

    # a quiet torn paper lip under the masthead: one ragged edge, low amplitude,
    # enough to read as ripped stock without turning into a scribble
    import math
    import random
    _rnd = random.Random(11)
    pdf.set_line_width(0.6)
    pdf.set_draw_color(206, 197, 180)
    _prev = None
    for i in range(0, 121):
        xx = A4[0] * i / 120
        yy = 47.9 + math.sin(i * 0.42) * 0.55 + math.sin(i * 1.9) * 0.28 + _rnd.uniform(-0.25, 0.25)
        if _prev:
            pdf.line(_prev[0], _prev[1], xx, yy)
        _prev = (xx, yy)

    # ---------------------------------------------------------------- intro
    y = 57.0
    pdf.set_text_color(*BLOOD)
    pdf.set_font("Archivo", "", 7.8)
    pdf.set_xy(M, y)
    # real letter-spacing, not spaces between letters: an ATS must still read "PROFILE"
    pdf.set_char_spacing(0.9)
    pdf.cell(40, 4, "PROFILE")
    pdf.set_char_spacing(0)
    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.3)
    pdf.line(M + 20, y + 2.2, A4[0] - M, y + 2.2)

    y += 7.5
    pdf.set_text_color(*INK)
    pdf.set_font("Inter", "", 9.5)
    profile = (
        "Designer and builder. I make brands, print and social visuals, and the "
        "websites they live on — so a visual identity ships as working product "
        "rather than a folder of files. Over the past year I designed and built "
        "CHRISCO Digital Academy, a 19-course learning platform for young people "
        "in Jinja, including its branding, 20 published guides and a launch film."
    )
    pdf.set_xy(M, y)
    pdf.multi_cell(A4[0] - 2 * M, 4.5, profile, align="L")

    # ---------------------------------------------------------------- columns
    LEFT_X = M
    LEFT_W = 87.0
    RIGHT_X = M + 95.0
    RIGHT_W = A4[0] - M - RIGHT_X
    COL_TOP = pdf.get_y() + 10.0

    def section_head(x: float, w: float, yy: float, label: str) -> float:
        pdf.set_font("ArchivoB", "", 8.2)
        pdf.set_text_color(*INK)
        pdf.set_xy(x, yy)
        pdf.cell(w, 5, label.upper())
        pdf.set_draw_color(*BLOOD)
        pdf.set_line_width(0.9)
        pdf.line(x, yy + 5.6, x + 12, yy + 5.6)
        pdf.set_draw_color(*RULE)
        pdf.set_line_width(0.3)
        pdf.line(x + 12, yy + 5.6, x + w, yy + 5.6)
        return yy + 9.5

    def body_text(x: float, w: float, yy: float, lines: list[str],
                  size: float = 8.6, lh: float = 4.1,
                  gap: float = 1.6) -> float:
        pdf.set_font("Inter", "", size)
        pdf.set_text_color(*INK_SOFT)
        for ln in lines:
            pdf.set_xy(x, yy)
            pdf.multi_cell(w, lh, ln, align="L")
            yy = pdf.get_y() + gap
        return yy

    def role(x: float, w: float, yy: float, title: str, org: str,
             when: str, bullets: list[str]) -> float:
        pdf.set_font("Archivo", "", 8.9)
        pdf.set_text_color(*INK)
        pdf.set_xy(x, yy)
        pdf.cell(w, 4.4, title)
        pdf.set_font("Inter", "", 7.4)
        pdf.set_text_color(*OCHRE)
        pdf.set_xy(x, yy)
        pdf.cell(w, 4.4, when, align="R")
        yy += 4.2
        pdf.set_font("Inter", "", 7.9)
        pdf.set_text_color(*BLOOD)
        pdf.set_xy(x, yy)
        pdf.cell(w, 4.0, org)
        yy += 4.6
        for b in bullets:
            pdf.set_font("Inter", "", 8.2)
            pdf.set_text_color(*INK_SOFT)
            pdf.set_xy(x, yy)
            pdf.multi_cell(w, 3.9, b, align="L")
            yy = pdf.get_y() + 1.4
        return yy + 2.6

    DIV_BOTTOM = 258.0  # provisional; refined after both columns are measured

    # vertical torn divider between the columns: the same ripped edge, standing up
    import math as _m
    import random as _r
    _rnd = _r.Random(23)
    _dvx = LEFT_X + LEFT_W + 5.0
    pdf.set_line_width(0.5)
    pdf.set_draw_color(*RULE)
    _prev = None
    _steps = 96
    for _i in range(_steps + 1):
        _yy = COL_TOP - 1.5 + (DIV_BOTTOM - COL_TOP) * _i / _steps
        _xx = _dvx + _m.sin(_i * 1.1) * 0.45 + _rnd.uniform(-0.3, 0.3)
        if _prev:
            pdf.line(_prev[0], _prev[1], _xx, _yy)
        _prev = (_xx, _yy)

    # ---- left column ---------------------------------------------------
    ly = section_head(LEFT_X, LEFT_W, COL_TOP, "What I do")
    ly = body_text(LEFT_X, LEFT_W, ly, [
        "Brand identity — marks, palettes, type systems and the rules that keep "
        "them consistent.",
        "Print and merchandise — garment artwork, placement specs, print-ready "
        "files for screen and DTG.",
        "Social and campaign visuals — ad sets, carousels, posters, thumbnails.",
        "Editorial layout — guides, workbooks and long-form documents.",
        "Web and product design — page layout, components, design systems.",
        "Front-end build — turning those designs into responsive, working sites.",
        "Motion and video — short-form edits, motion graphics, launch films.",
    ], gap=2.2)

    ly = section_head(LEFT_X, LEFT_W, ly + 3.0, "Tools")
    ly = body_text(LEFT_X, LEFT_W, ly, [
        "Figma · Adobe Photoshop · Illustrator · Canva",
        "Next.js · React · Tailwind CSS · HTML / CSS",
        "Python · Supabase · Git",
        "CapCut · After Effects · FFmpeg",
    ], size=8.0, gap=1.4)

    ly = section_head(LEFT_X, LEFT_W, ly + 3.0, "Education")
    pdf.set_font("Archivo", "", 8.9)
    pdf.set_text_color(*INK)
    pdf.set_xy(LEFT_X, ly)
    pdf.cell(LEFT_W, 4.4, "Self-directed, continuous")
    ly += 4.4
    pdf.set_font("Inter", "", 8.2)
    pdf.set_text_color(*INK_SOFT)
    pdf.set_xy(LEFT_X, ly)
    pdf.multi_cell(LEFT_W, 3.9,
                   "Design fundamentals, typography and front-end development, "
                   "studied and applied through live client-style projects.",
                   align="L")
    ly = pdf.get_y() + 3.0

    ly = section_head(LEFT_X, LEFT_W, ly + 2.0, "Languages")
    pdf.set_font("Inter", "", 8.2)
    pdf.set_text_color(*INK_SOFT)
    pdf.set_xy(LEFT_X, ly)
    pdf.cell(LEFT_W, 4.0, "English — fluent (written and spoken)")
    pdf.set_xy(LEFT_X, ly + 4.4)
    pdf.cell(LEFT_W, 4.0, "Luganda — native")

    # ---- right column --------------------------------------------------
    ry = section_head(RIGHT_X, RIGHT_W, COL_TOP, "Experience")

    ry = role(RIGHT_X, RIGHT_W, ry,
              "Founder, designer and developer",
              "CHRISCO Digital Academy — CHRISCO Youth Aflame",
              f"{CONF['chrisco_from']} — {CONF['chrisco_to']}", [
                  "Designed the full brand: wordmark, editorial palette "
                  "(bone, ink, oxblood), type system and component library.",
                  "Built the platform end to end in Next.js and React — 19 course "
                  "pages, library, shop, dashboard and a course-helper chat.",
                  "Wrote and published 20 downloadable guides, each laid out as a "
                  "print-ready PDF.",
                  "Produced the launch film (1080×1920) and its poster artwork — "
                  "script, narration, motion graphics and edit.",
                  "Designed a merchandise system with three collections, a "
                  "garment palette and per-product print placements.",
              ])

    ry = role(RIGHT_X, RIGHT_W, ry,
              "Graphic design and digital content",
              "Freelance and community projects",
              f"{CONF['freelance_from']} — {CONF['freelance_to']}", [
                  "Brand and campaign visuals for small businesses and youth "
                  "programmes.",
                  "Poster, flyer, thumbnail and social-kit design, delivered "
                  "print-ready or platform-sized.",
                  "Document and report design — proposals, one-pagers and "
                  "evidence packs for grant applications.",
              ])

    ry = section_head(RIGHT_X, RIGHT_W, ry + 1.5, "Selected work")

    pdf.set_font("Inter", "", 8.2)
    pdf.set_text_color(*INK_SOFT)
    works = [
        ("CHRISCO Digital Academy", "Platform, brand system, 19 courses"),
        ("20 published guides", "Editorial layout, cover series, PDF output"),
        ("Launch film", "Script, motion graphics, edit, 1080×1920"),
        ("Merchandise system", "3 collections, garment palette, print specs"),
        ("Brand refresh", "Full visual identity and site re-theme"),
    ]
    for name, detail in works:
        pdf.set_font("Archivo", "", 8.3)
        pdf.set_text_color(*INK)
        pdf.set_xy(RIGHT_X, ry)
        pdf.cell(RIGHT_W, 4.0, name)
        ry += 4.0
        pdf.set_font("Inter", "", 7.9)
        pdf.set_text_color(*INK_SOFT)
        pdf.set_xy(RIGHT_X, ry)
        pdf.cell(RIGHT_W, 3.6, detail)
        ry += 5.4

    # re-draw the divider now that both columns' true depths are known
    pdf.set_fill_color(*PAPER)
    pdf.rect(_dvx - 3.0, COL_TOP - 4.0, 6.0, 250.0, style="F")
    _depth = max(ry, ly)
    _prev = None
    pdf.set_line_width(0.5)
    pdf.set_draw_color(*RULE)
    for _i in range(0, 121):
        _yy = COL_TOP - 1.5 + (_depth + 2.0 - COL_TOP) * _i / 120
        _xx = _dvx + _m.sin(_i * 1.1) * 0.45 + _rnd.uniform(-0.3, 0.3)
        if _prev:
            pdf.line(_prev[0], _prev[1], _xx, _yy)
        _prev = (_xx, _yy)

    # ---------------------------------------------------------------- footer
    fy = 278.0

    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.3)
    pdf.line(M, fy, A4[0] - M, fy)

    pdf.set_font("Archivo", "", 7.6)
    pdf.set_text_color(*INK)
    pdf.set_xy(M, fy + 3.0)
    pdf.cell(70, 4, "PORTFOLIO AND WORK")

    pdf.set_font("Inter", "", 8.0)
    pdf.set_text_color(*INK_SOFT)
    pdf.set_xy(M, fy + 7.4)
    pdf.cell(150, 4, "References and a full portfolio are available on request.")

    pdf.set_font("Inter", "", 7.6)
    pdf.set_text_color(*INK_SOFT)
    pdf.set_xy(A4[0] - M - 70, fy + 7.4)
    pdf.cell(70, 4, "shambetz@gmail.com  ·  +254 112 272 061", align="R")

    pdf.output(str(OUT))
    print(f"wrote {OUT}  ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
