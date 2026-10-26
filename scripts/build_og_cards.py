#!/usr/bin/env python3
"""
Builds WhatsApp / Open Graph / X social preview cards (1200x630 + 600x600 square)
using ONLY verified real photographs and rendered PDF cover thumbnails.
Saved as baseline RGB JPEGs (< 220 KB) for 100% WhatsApp link-preview compatibility.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS_DIR = os.path.join(ROOT, "public", "book-covers")
COURSES_IMG_DIR = os.path.join(ROOT, "public", "images", "courses")
JOSEPH_IMG_DIR = os.path.join(ROOT, "scripts", "joseph_ebook_assets", "images")
PUBLIC_IMG_DIR = os.path.join(ROOT, "public", "images")
OUT_BOOKS = os.path.join(ROOT, "public", "og", "books")
OUT_MERCH = os.path.join(ROOT, "public", "og", "merch")
OUT_ROOT = os.path.join(ROOT, "public", "og")

FONT_DIR = os.path.join(ROOT, "scripts", "courses_ebook_assets", "fonts")
F_BOLD = os.path.join(FONT_DIR, "Montserrat-Bold.ttf")
F_SEMI = os.path.join(FONT_DIR, "Montserrat-SemiBold.ttf")
F_MED = os.path.join(FONT_DIR, "Montserrat-Medium.ttf")

BOOKS = [
    {
        "slug": "joseph-7-lessons-emerging-seer-prophet",
        "shelf": "christian",
        "badge": "CHRISTIAN & FAITH LIBRARY",
        "title": "Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn",
        "subtitle": "Scripture-anchored study on dreams, character, private integrity, and appointed fulfillment.",
        "meta": "28 Pages  |  8 Diagrams  |  CHRISCO Youth Aflame",
        "bg_photo": os.path.join(JOSEPH_IMG_DIR, "fellowship_circle_bright.jpg"),
    },
    {
        "slug": "youtube-automation",
        "shelf": "learning",
        "badge": "VIDEO & CONTENT TRACK",
        "title": "YouTube Automation: Course Handbook",
        "subtitle": "Build, systematize, and monetize faceless and creator-led YouTube channels step by step.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "ai-video-storytelling",
        "shelf": "learning",
        "badge": "VIDEO & STORYTELLING TRACK",
        "title": "AI Video Storytelling: Course Handbook",
        "subtitle": "Script, storyboard, edit, and produce compelling visual narratives that hold audience attention.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "python-programming",
        "shelf": "learning",
        "badge": "CODING & ENGINEERING TRACK",
        "title": "Python Programming: Course Handbook",
        "subtitle": "Master Python fundamentals, data structures, automation scripts, and real-world software builds.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "swe-llm-mastery",
        "shelf": "learning",
        "badge": "SOFTWARE & AI SYSTEMS TRACK",
        "title": "Software Engineering & LLM Mastery",
        "subtitle": "Design reliable APIs, retrieval pipelines, evaluation harnesses, and production web software.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "ai-literacy",
        "shelf": "learning",
        "badge": "DIGITAL FLUENCY TRACK",
        "title": "AI Literacy: Course Handbook",
        "subtitle": "Practical prompt engineering, research verification, workflow automation, and ethical judgment.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "print-on-demand",
        "shelf": "learning",
        "badge": "E-COMMERCE & BRANDING TRACK",
        "title": "Print on Demand: Course Handbook",
        "subtitle": "Launch profitable apparel and merchandise collections from niche research to fulfillment.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "communicate-like-a-ceo",
        "shelf": "learning",
        "badge": "LEADERSHIP & CAREER TRACK",
        "title": "Communicate Like a CEO: Handbook",
        "subtitle": "Executive presence, structured persuasive speaking, boardroom clarity, and leadership briefs.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "negotiation",
        "shelf": "learning",
        "badge": "BUSINESS & LEADERSHIP TRACK",
        "title": "Negotiation Mastery: Course Handbook",
        "subtitle": "Prepare BATNAs, anchor value confidently, navigate objections, and close win-win agreements.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "personal-branding",
        "shelf": "learning",
        "badge": "CAREER & VISIBILITY TRACK",
        "title": "Personal Branding: Course Handbook",
        "subtitle": "Build authentic professional authority, proof-of-work portfolios, and trusted industry presence.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "networking-secrets",
        "shelf": "learning",
        "badge": "CAREER & RELATIONSHIPS TRACK",
        "title": "Networking Secrets: Course Handbook",
        "subtitle": "Cultivate genuine mentor, peer, and client relationships through value-first outreach.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "ghostwriting",
        "shelf": "learning",
        "badge": "WRITING & PUBLISHING TRACK",
        "title": "Ghostwriting: Course Handbook",
        "subtitle": "Capture executive voices, structure long-form articles and books, and run retainer workflows.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "copywriting",
        "shelf": "learning",
        "badge": "WRITING & CONVERSION TRACK",
        "title": "Copywriting: Course Handbook",
        "subtitle": "Customer research, persuasive headlines, landing pages, email sequences, and ethical conversion.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "freelancing",
        "shelf": "learning",
        "badge": "INDEPENDENT INCOME TRACK",
        "title": "Freelancing: Course Handbook",
        "subtitle": "Package high-value digital services, win global and local clients, price projects, and deliver.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "content-creation",
        "shelf": "learning",
        "badge": "CREATOR ECONOMY TRACK",
        "title": "Content Creation: Course Handbook",
        "subtitle": "Plan content pillars, batch-film multi-platform series, and turn audiences into communities.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "sales-and-marketing",
        "shelf": "learning",
        "badge": "REVENUE & GROWTH TRACK",
        "title": "Sales and Marketing: Course Handbook",
        "subtitle": "Position offers clearly, build repeatable pipelines, conduct discovery calls, and close deals.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "digital-marketing",
        "shelf": "learning",
        "badge": "GROWTH MARKETING TRACK",
        "title": "Digital Marketing: Course Handbook",
        "subtitle": "Full-funnel search, content, paid acquisition, analytics attribution, and ROI optimization.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "email-marketing",
        "shelf": "learning",
        "badge": "RETENTION & CRM TRACK",
        "title": "Email Marketing: Course Handbook",
        "subtitle": "Grow permission-based subscriber lists, automate welcome flows, and write high-trust campaigns.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "affiliate-marketing",
        "shelf": "learning",
        "badge": "PARTNERSHIP MARKETING TRACK",
        "title": "Affiliate Marketing: Course Handbook",
        "subtitle": "Select vetted products, publish honest comparison reviews, and build recurring referral income.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
    {
        "slug": "social-media-marketing",
        "shelf": "learning",
        "badge": "SOCIAL GROWTH TRACK",
        "title": "Social Media Marketing: Handbook",
        "subtitle": "Design platform-native campaigns, short-form hooks, community engagement, and analytics reports.",
        "meta": "28 Pages  |  8 Visual Diagrams  |  CHRISCO Digital Academy",
    },
]


def fit_cover(im, w, h, focus=(0.5, 0.3)):
    im = im.convert("RGB")
    iw, ih = im.size
    scale = max(w / iw, h / ih)
    nw, nh = int(iw * scale + 0.5), int(ih * scale + 0.5)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = int((nw - w) * focus[0])
    top = int((nh - h) * focus[1])
    left = max(0, min(nw - w, left))
    top = max(0, min(nh - h, top))
    return im.crop((left, top, left + w, top + h))


def wrap_lines(draw, text, font, max_w, max_lines=3):
    words = text.split()
    lines = []
    cur = []
    for w in words:
        cand = " ".join(cur + [w])
        bbox = draw.textbbox((0, 0), cand, font=font)
        if bbox[2] - bbox[0] <= max_w:
            cur.append(w)
        else:
            if cur:
                lines.append(" ".join(cur))
            cur = [w]
    if cur:
        lines.append(" ".join(cur))
    return lines[:max_lines]


def save_whatsapp_jpeg(im, out_path, max_kb=210):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    rgb = im.convert("RGB")
    for q in (84, 78, 72, 66):
        rgb.save(out_path, "JPEG", quality=q, optimize=True, progressive=False)
        if os.path.getsize(out_path) <= max_kb * 1024:
            break


def build_book_card(b):
    slug = b["slug"]
    is_christian = b["shelf"] == "christian"
    cover_path = os.path.join(COVERS_DIR, f"{slug}.jpg")
    bg_path = b.get("bg_photo") or os.path.join(COURSES_IMG_DIR, f"{slug}.jpg")
    if not os.path.exists(bg_path):
        bg_path = os.path.join(PUBLIC_IMG_DIR, "bg-courses.jpg")

    # 1. 1200 x 630 Landscape Social / WhatsApp Rich Card
    W, H = 1200, 630
    bg = fit_cover(Image.open(bg_path), W, H, focus=(0.5, 0.25)).filter(ImageFilter.GaussianBlur(radius=8))

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    base_rgba = (4, 14, 92, 224) if is_christian else (11, 22, 56, 226)
    odraw.rectangle([0, 0, W, H], fill=base_rgba)

    # Top accent bar
    accent = (250, 63, 38, 255) if is_christian else (46, 211, 117, 255)
    odraw.rectangle([0, 0, W, 10], fill=accent)

    card = Image.alpha_composite(bg.convert("RGBA"), overlay)

    # Book Cover on Left (346 x 490)
    cov_w, cov_h = 346, 490
    cov_x, cov_y = 66, 72

    # Soft shadow behind book cover
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        [cov_x + 12, cov_y + 16, cov_x + cov_w + 12, cov_y + cov_h + 16],
        radius=16,
        fill=(0, 0, 0, 135),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=14))
    card = Image.alpha_composite(card, shadow)

    cover_im = Image.open(cover_path).convert("RGB").resize((cov_w, cov_h), Image.Resampling.LANCZOS)
    mask = Image.new("L", (cov_w, cov_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, cov_w, cov_h], radius=14, fill=255)
    card.paste(cover_im, (cov_x, cov_y), mask)

    # Subtle white frame around cover
    cdraw = ImageDraw.Draw(card)
    cdraw.rounded_rectangle(
        [cov_x, cov_y, cov_x + cov_w, cov_y + cov_h],
        radius=14,
        outline=(255, 255, 255, 95),
        width=2,
    )

    # Right-side Typography
    tx = 462
    max_tw = W - tx - 64

    f_badge = ImageFont.truetype(F_BOLD, 16)
    f_title = ImageFont.truetype(F_BOLD, 40 if len(b["title"]) > 38 else 44)
    f_sub = ImageFont.truetype(F_MED, 21)
    f_meta = ImageFont.truetype(F_SEMI, 17)
    f_cta = ImageFont.truetype(F_BOLD, 18)

    # Pill badge
    badge_txt = b["badge"]
    bb = cdraw.textbbox((0, 0), badge_txt, font=f_badge)
    bw = (bb[2] - bb[0]) + 32
    bh = 36
    by = 86
    pill_fill = (250, 63, 38, 255) if is_christian else (46, 211, 117, 255)
    pill_ink = (255, 255, 255, 255) if is_christian else (6, 26, 40, 255)
    cdraw.rounded_rectangle([tx, by, tx + bw, by + bh], radius=18, fill=pill_fill)
    cdraw.text((tx + 16, by + 8), badge_txt, font=f_badge, fill=pill_ink)

    # Title
    ty = by + bh + 24
    t_lines = wrap_lines(cdraw, b["title"], f_title, max_tw, max_lines=3)
    for line in t_lines:
        cdraw.text((tx, ty), line, font=f_title, fill=(255, 255, 255, 255))
        ty += 52

    # Subtitle
    ty += 10
    s_lines = wrap_lines(cdraw, b["subtitle"], f_sub, max_tw, max_lines=3)
    for line in s_lines:
        cdraw.text((tx, ty), line, font=f_sub, fill=(214, 224, 245, 255))
        ty += 31

    # Meta line
    cdraw.text((tx, 466), b["meta"], font=f_meta, fill=(165, 232, 195, 255) if not is_christian else (255, 206, 196, 255))

    # CTA Pill at bottom right
    cta_txt = "Sign In to Download & Save PDF"
    cb = cdraw.textbbox((0, 0), cta_txt, font=f_cta)
    cw = (cb[2] - cb[0]) + 40
    ch = 48
    cy = 508
    cta_fill = (255, 255, 255, 255)
    cta_ink = (1, 12, 128, 255) if is_christian else (11, 26, 62, 255)
    cdraw.rounded_rectangle(
        [tx, cy, tx + min(cw, max_tw), cy + ch],
        radius=24,
        fill=cta_fill,
    )
    cdraw.text((tx + 20, cy + 13), cta_txt, font=f_cta, fill=cta_ink)

    save_whatsapp_jpeg(card, os.path.join(OUT_BOOKS, f"{slug}.jpg"), max_kb=195)

    # 2. 600 x 600 Square WhatsApp Chat Fallback Card
    SQ = 600
    sq_bg = fit_cover(Image.open(bg_path), SQ, SQ, focus=(0.5, 0.25)).filter(ImageFilter.GaussianBlur(radius=10))
    sq_ov = Image.new("RGBA", (SQ, SQ), base_rgba)
    sq_card = Image.alpha_composite(sq_bg.convert("RGBA"), sq_ov)
    sc_w, sc_h = 356, 504
    sc_x, sc_y = (SQ - sc_w) // 2, (SQ - sc_h) // 2
    sq_cov = Image.open(cover_path).convert("RGB").resize((sc_w, sc_h), Image.Resampling.LANCZOS)
    sq_mask = Image.new("L", (sc_w, sc_h), 0)
    ImageDraw.Draw(sq_mask).rounded_rectangle([0, 0, sc_w, sc_h], radius=14, fill=255)
    sq_card.paste(sq_cov, (sc_x, sc_y), sq_mask)
    ImageDraw.Draw(sq_card).rounded_rectangle([sc_x, sc_y, sc_x + sc_w, sc_y + sc_h], radius=14, outline=(255, 255, 255, 110), width=2)
    save_whatsapp_jpeg(sq_card, os.path.join(OUT_BOOKS, f"{slug}-sq.jpg"), max_kb=125)


def build_site_banner(filename, bg_img_path, badge, title, subtitle, sample_covers):
    W, H = 1200, 630
    bg = fit_cover(Image.open(bg_img_path), W, H, focus=(0.5, 0.22)).filter(ImageFilter.GaussianBlur(radius=6))
    ov = Image.new("RGBA", (W, H), (6, 24, 44, 216))
    od = ImageDraw.Draw(ov)
    od.rectangle([0, 0, W, 10], fill=(46, 211, 117, 255))
    card = Image.alpha_composite(bg.convert("RGBA"), ov)
    draw = ImageDraw.Draw(card)

    f_badge = ImageFont.truetype(F_BOLD, 16)
    f_title = ImageFont.truetype(F_BOLD, 44)
    f_sub = ImageFont.truetype(F_MED, 22)
    f_cta = ImageFont.truetype(F_BOLD, 18)

    tx = 68
    max_tw = 640 if sample_covers else 1060

    bb = draw.textbbox((0, 0), badge, font=f_badge)
    bw = (bb[2] - bb[0]) + 32
    draw.rounded_rectangle([tx, 84, tx + bw, 120], radius=18, fill=(46, 211, 117, 255))
    draw.text((tx + 16, 92), badge, font=f_badge, fill=(6, 26, 40, 255))

    ty = 148
    for line in wrap_lines(draw, title, f_title, max_tw, max_lines=3):
        draw.text((tx, ty), line, font=f_title, fill=(255, 255, 255, 255))
        ty += 54

    ty += 12
    for line in wrap_lines(draw, subtitle, f_sub, max_tw, max_lines=3):
        draw.text((tx, ty), line, font=f_sub, fill=(214, 226, 245, 255))
        ty += 32

    cta = "CHRISCO Youth Aflame  |  CHRISCO Fellowship of Churches"
    draw.text((tx, 520), cta, font=f_cta, fill=(154, 236, 189, 255))

    if sample_covers:
        positions = [(748, 92), (918, 128)]
        for (cx, cy), cslug in zip(positions, sample_covers[:2]):
            cp = os.path.join(COVERS_DIR, f"{cslug}.jpg")
            if os.path.exists(cp):
                cw, ch = 220, 312
                cim = Image.open(cp).convert("RGB").resize((cw, ch), Image.Resampling.LANCZOS)
                cmask = Image.new("L", (cw, ch), 0)
                ImageDraw.Draw(cmask).rounded_rectangle([0, 0, cw, ch], radius=12, fill=255)
                card.paste(cim, (cx, cy), cmask)
                draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=12, outline=(255, 255, 255, 120), width=2)

    save_whatsapp_jpeg(card, os.path.join(OUT_ROOT, filename), max_kb=195)


def build_merch_cards():
    merch_dir = os.path.join(ROOT, "public", "merch")
    if not os.path.isdir(merch_dir):
        return 0
    count = 0
    for fn in sorted(os.listdir(merch_dir)):
        if not fn.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        src = os.path.join(merch_dir, fn)
        W, H = 1200, 630
        bg = Image.new("RGB", (W, H), (14, 24, 42))
        draw = ImageDraw.Draw(bg)
        draw.rectangle([0, 0, W, 10], fill=(46, 211, 117))
        im = Image.open(src).convert("RGBA")
        # Fit product cleanly on left/center
        im.thumbnail((520, 520), Image.Resampling.LANCZOS)
        ix = 88 + (520 - im.width) // 2
        iy = (H - im.height) // 2
        bg.paste(im.convert("RGB"), (ix, iy), im.split()[3] if im.mode == "RGBA" else None)

        f_badge = ImageFont.truetype(F_BOLD, 16)
        f_title = ImageFont.truetype(F_BOLD, 38)
        f_sub = ImageFont.truetype(F_MED, 21)

        tx = 640
        draw.rounded_rectangle([tx, 140, tx + 245, 176], radius=18, fill=(46, 211, 117))
        draw.text((tx + 18, 148), "CHRISCO PURSUE SHOP", font=f_badge, fill=(6, 26, 40))
        draw.text((tx, 206), "Official Fellowship", font=f_title, fill=(255, 255, 255))
        draw.text((tx, 256), "Scripture Apparel", font=f_title, fill=(255, 255, 255))
        draw.text((tx, 330), "Sizes S to XXL  |  KSh & UGX", font=f_sub, fill=(205, 220, 242))
        draw.text((tx, 366), "Order by code on WhatsApp", font=f_sub, fill=(154, 236, 189))

        out_name = os.path.splitext(fn)[0] + ".jpg"
        save_whatsapp_jpeg(bg, os.path.join(OUT_MERCH, out_name), max_kb=130)
        count += 1
    return count


def main():
    for b in BOOKS:
        build_book_card(b)
    build_site_banner(
        "default.jpg",
        os.path.join(PUBLIC_IMG_DIR, "bg-home.jpg"),
        "CHRISCO DIGITAL ACADEMY",
        "Learn Practical Digital Skills & Faith Wisdom for Life",
        "19 Illustrated Digital Skill Courses, Christian Study Books, Certificates & Student Dashboard.",
        ["joseph-7-lessons-emerging-seer-prophet", "python-programming"],
    )
    build_site_banner(
        "library.jpg",
        os.path.join(PUBLIC_IMG_DIR, "bg-courses.jpg"),
        "CHRISCO DIGITAL LIBRARY",
        "Christian Books & 19 Course Handbooks",
        "Sign in with Google or Email to download and save PDF books to your Dashboard.",
        ["joseph-7-lessons-emerging-seer-prophet", "communicate-like-a-ceo"],
    )
    build_site_banner(
        "courses.jpg",
        os.path.join(PUBLIC_IMG_DIR, "bg-about.jpg"),
        "19 PRACTICAL TRACKS",
        "Explore 19 Practical Digital Skills Courses",
        "Coding, AI Literacy, Video Storytelling, Executive Communication, Marketing, Freelancing & Copywriting.",
        ["swe-llm-mastery", "youtube-automation"],
    )
    build_site_banner(
        "shop.jpg",
        os.path.join(PUBLIC_IMG_DIR, "bg-cta.jpg"),
        "PURSUE COLLECTION",
        "CHRISCO Youth Aflame Official Merchandise",
        "Heavyweight tees, hoodies, polos, caps, and totes anchored in purpose and Scripture.",
        [],
    )
    merch_count = build_merch_cards()
    print(f"Generated {len(BOOKS)} book OG preview pairs, {merch_count} merch OG cards, + 4 site OG banners in public/og/")


if __name__ == "__main__":
    main()
