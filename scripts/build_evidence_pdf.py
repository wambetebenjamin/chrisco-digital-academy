#!/usr/bin/env python3
"""Build a one-page MTN Changemakers project-evidence PDF for CHRISCO Digital Academy."""
import os, sys
from PIL import Image
from fpdf import FPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "images")
TMP = os.path.join(ROOT, "scripts", ".tmp_pdf")
os.makedirs(TMP, exist_ok=True)

# ---- brand palette ----
TEAL = (0, 35, 51)        # #002333
INK  = (6, 32, 46)        # #06202E
GREEN_DEEP = (0, 150, 80) # readable green for text
GREEN = (0, 255, 132)     # #00FF84 accent
PAPER = (250, 250, 246)
MUTED = (95, 110, 118)
LINE = (210, 220, 216)

LIVE_URL = os.environ.get("LIVE_URL", "chrisco-digital-academy.vercel.app")
REPO_URL = "github.com/wambetebenjamin/chrisco-digital-academy"

def crop_to(src, dst, ratio):
    """Center-crop image to width/height ratio and save."""
    im = Image.open(src).convert("RGB")
    w, h = im.size
    target = ratio
    cur = w / h
    if cur > target:      # too wide -> crop width
        nw = int(h * target); x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:                 # too tall -> crop height
        nh = int(w / target); y = (h - nh) // 2
        im = im.crop((0, y, w, y + nh))
    im.save(dst, quality=88)
    return dst

pdf = FPDF(orientation="P", unit="mm", format="A4")
pdf.set_auto_page_break(False)
pdf.add_page()
W = 210

# ---- background paper ----
pdf.set_fill_color(*PAPER)
pdf.rect(0, 0, 210, 297, "F")

# ================= HEADER BAND =================
pdf.set_fill_color(*TEAL)
pdf.rect(0, 0, 210, 36, "F")
# green accent bar
pdf.set_fill_color(*GREEN)
pdf.rect(0, 36, 210, 1.6, "F")

pdf.set_text_color(255, 255, 255)
pdf.set_font("Helvetica", "B", 20)
pdf.set_xy(14, 8)
pdf.cell(150, 8, "CHRISCO DIGITAL ACADEMY")
pdf.set_text_color(*GREEN)
pdf.set_font("Helvetica", "B", 9)
pdf.set_xy(14, 18)
pdf.cell(180, 5, "MTN CHANGEMAKERS  -  PROJECT EVIDENCE  (Education + Economic Empowerment)")
pdf.set_text_color(210, 225, 220)
pdf.set_font("Helvetica", "", 8.5)
pdf.set_xy(14, 24.5)
pdf.cell(180, 5, "Youth digital & economic-empowerment hubs in Jinja & Buikwe, Uganda  -  under CHRISCO Youth Aflame")

# ================= HERO IMAGE =================
hero = crop_to(os.path.join(IMG, "workspace.jpg"), os.path.join(TMP, "hero.jpg"), 210/58)
pdf.image(hero, x=0, y=37.6, w=210, h=52)
# translucent caption strip
pdf.set_fill_color(*TEAL)
pdf.rect(0, 82.2, 210, 7.4, "F")
pdf.set_text_color(*GREEN)
pdf.set_font("Helvetica", "B", 8.5)
pdf.set_xy(14, 83.6)
pdf.cell(120, 4.5, ("Live platform:  " + LIVE_URL))
pdf.set_text_color(200, 215, 210)
pdf.set_font("Helvetica", "", 8)
pdf.set_xy(120, 83.6)
pdf.cell(80, 4.5, ("Source:  " + REPO_URL), align="R")

y = 94
# ================= ABOUT =================
pdf.set_text_color(*INK)
pdf.set_font("Helvetica", "B", 11)
pdf.set_xy(14, y)
pdf.cell(180, 6, "The project at a glance")
y += 7
pdf.set_text_color(*MUTED)
pdf.set_font("Helvetica", "", 9.2)
pdf.set_xy(14, y)
about = ("CHRISCO Digital Academy is a fully-built, operational online learning platform that equips young people "
         "with practical, income-generating digital AND economic-empowerment skills. The 19-course curriculum, "
         "books, videos and website already exist. MTN Foundation's in-kind support (laptops, tablets, projector, "
         "internet, furniture) turns it into physical youth hubs in JINJA & BUIKWE - teaching youth to earn, to "
         "build websites, to manage their money, and to keep studying offline via a study app + PDF books.")
pdf.multi_cell(182, 4.7, about)
y = pdf.get_y() + 3

# ================= PLATFORM PREVIEW (3 thumbs) =================
pdf.set_text_color(*INK)
pdf.set_font("Helvetica", "B", 11)
pdf.set_xy(14, y)
pdf.cell(180, 6, "Inside the platform")
y += 7.5
thumbs = [("cat-coding.jpg", "Coding & AI"), ("cat-design.jpg", "Design"), ("cat-marketing.jpg", "Marketing")]
tw = 58.0; gap = 4.0; tx = 14
for fn, lab in thumbs:
    tp = crop_to(os.path.join(IMG, fn), os.path.join(TMP, "t_" + fn), tw/34)
    pdf.image(tp, x=tx, y=y, w=tw, h=34)
    pdf.set_fill_color(*TEAL)
    pdf.rect(tx, y + 34, tw, 6, "F")
    pdf.set_text_color(*GREEN)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_xy(tx, y + 35.1)
    pdf.cell(tw, 4, lab, align="C")
    tx += tw + gap
y += 44

# ================= STATS =================
stats = [("500+", "Youth trained"), ("19", "Courses live"), ("100%", "Practical / project-based"), ("7", "Skill tracks")]
bw = 44.5; gap = 3.0; bx = 14
pdf.set_draw_color(*LINE)
for num, lab in stats:
    pdf.set_fill_color(255, 255, 255)
    pdf.rect(bx, y, bw, 17, "DF")
    pdf.set_text_color(*GREEN_DEEP)
    pdf.set_font("Helvetica", "B", 15)
    pdf.set_xy(bx, y + 2.5)
    pdf.cell(bw, 7, num, align="C")
    pdf.set_text_color(*MUTED)
    pdf.set_font("Helvetica", "", 7.4)
    pdf.set_xy(bx, y + 10.5)
    pdf.cell(bw, 4, lab, align="C")
    bx += bw + gap
y += 22

# ================= COURSES =================
pdf.set_text_color(*INK)
pdf.set_font("Helvetica", "B", 11)
pdf.set_xy(14, y)
pdf.cell(180, 6, "19 courses - incl. new economic-empowerment skills")
y += 7
courses = ["Communicate Like a CEO", "Master Negotiation", "Personal Branding", "AI Literacy",
           "Networking (Top 1%)", "AI Video Storytelling", "Content Creation", "Sales & Marketing",
           "Python & SWE + AI", "Web Development", "Freelancing", "+ 8 more"]
pdf.set_font("Helvetica", "", 9)
col_x = [14, 80, 146]; rows = 4
for i, c in enumerate(courses):
    cx = col_x[i // rows]
    ry = y + (i % rows) * 5.2
    pdf.set_fill_color(*GREEN)
    pdf.ellipse(cx, ry + 1.4, 1.6, 1.6, "F")
    pdf.set_text_color(*INK)
    pdf.set_xy(cx + 3.5, ry)
    pdf.cell(60, 4.5, c)
y += rows * 5.2 + 2

# ================= WHY IT QUALIFIES =================
pdf.set_text_color(*INK)
pdf.set_font("Helvetica", "B", 11)
pdf.set_xy(14, y)
pdf.cell(180, 6, "Why it fits Changemakers")
y += 6.8
points = [
    "Education + economic empowerment - skills that create real youth income in Jinja & Buikwe.",
    "In-kind equipment only (no cash): laptops, tablets, projector, internet - total UGX 19.0M (< 20M).",
    "Teaches money management, website-building + an offline study app so no-internet youth keep learning.",
    "Sustainable: existing 19-course curriculum, books & videos + train-the-trainer + graduate mentorship.",
]
pdf.set_font("Helvetica", "", 9)
for p in points:
    pdf.set_fill_color(*GREEN)
    pdf.rect(14, y + 1.3, 2, 2, "F")
    pdf.set_text_color(*MUTED)
    pdf.set_xy(18, y)
    pdf.multi_cell(178, 4.6, p)
    y = pdf.get_y() + 1.2

# ================= FOOTER BAND =================
fy = 281
pdf.set_fill_color(*TEAL)
pdf.rect(0, fy, 210, 16, "F")
pdf.set_fill_color(*GREEN)
pdf.rect(0, fy, 210, 1.2, "F")
pdf.set_text_color(255, 255, 255)
pdf.set_font("Helvetica", "B", 8.5)
pdf.set_xy(14, fy + 3)
pdf.cell(180, 4, "Wambete Benjamin  -  Founder, CHRISCO Digital Academy / CHRISCO Youth Aflame")
pdf.set_text_color(190, 210, 205)
pdf.set_font("Helvetica", "", 8)
pdf.set_xy(14, fy + 8)
pdf.cell(180, 4, "Email: shambetz@gmail.com   -   MTN Changemakers 2026  -  Jinja & Buikwe, Uganda")

out = os.path.join(ROOT, "MTN-Changemakers-Project-Evidence.pdf")
pdf.output(out)
print("WROTE", out, os.path.getsize(out), "bytes")
