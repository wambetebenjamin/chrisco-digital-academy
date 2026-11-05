#!/usr/bin/env python3
import pathlib, re, json, textwrap, math, subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

# Paths
BASE = pathlib.Path("/home/user/chrisco-digital-academy")
COURSES_JS = BASE / "app/data/courses.js"
BOOKS_DIR = BASE / "content/books"
COURSE_IMG_DIR = BASE / "public/images/courses"
OUT_DIR = BASE / "public/videos/tiktok"
OUT_DIR.mkdir(parents=True, exist_ok=True)
TMP_DIR = pathlib.Path("/tmp/video_gen")
TMP_DIR.mkdir(parents=True, exist_ok=True)

FFMPEG = str(__import__("imageio_ffmpeg").get_ffmpeg_exe())

# Load courses via parsing JS (simple regex)
text = COURSES_JS.read_text()
# Extract each course block
# We will parse with a more robust approach: split by "icon:"
import re

course_pattern = re.compile(
    r'\{\s*id:\s*(\d+),.*?title:\s*"([^"]+)".*?category:\s*"([^"]+)".*?level:\s*"([^"]+)".*?duration:\s*"([^"]+)".*?rating:\s*"([^"]+)".*?students:\s*"([^"]+)".*?objectives:\s*\[(.*?)\].*?desc:\s*"([^"]+)".*?syllabus:\s*\[(.*?)\].*?for:\s*"([^"]+)"',
    re.DOTALL
)

courses = []
for m in course_pattern.finditer(text):
    cid, title, cat, lvl, dur, rating, students, obj_raw, desc, syl_raw, for_raw = m.groups()
    objs = re.findall(r'"([^"]+)"', obj_raw)
    syl = re.findall(r'"([^"]+)"', syl_raw)
    courses.append({
        "id": int(cid),
        "title": title,
        "category": cat,
        "level": lvl,
        "duration": dur,
        "rating": rating,
        "students": students,
        "objectives": objs,
        "desc": desc,
        "syllabus": syl,
        "for": for_raw,
        "img": f"/images/courses/{title.lower().replace(' ', '-').replace(':', '').replace('&', '').replace('--', '-').strip()}.jpg"
    })

# Taglines from pdf forewords (extracted earlier)
taglines = {
    "YouTube Automation": "Build faceless channels that earn while you sleep.",
    "Python Programming": "Learn to code from zero and build real, useful tools.",
    "Print on Demand": "Sell custom-designed products worldwide, with zero inventory.",
    "Ghostwriting": "Get paid well to write, while someone else takes the credit.",
    "Freelancing": "Turn your skills into online income, from anywhere in Africa.",
    "Digital Marketing": "Grow any business online, with strategy, not guesswork.",
    "Copywriting": "Write words that sell, and get paid for every one.",
    "Email Marketing": "Build a list and turn subscribers into loyal customers.",
    "Affiliate Marketing": "Earn commissions promoting products you don't have to make.",
    "Social Media Marketing": "Grow brands and businesses on the platforms people live on.",
    "SWE & LLM Mastery": "Build real, AI-powered software with modern engineering.",
    "Communicate Like a CEO": "Speak with the clarity, calm and authority of the top 1%.",
    "Master Negotiation": "Win better deals, raise your rates, and keep the relationship.",
    "AI Video Storytelling": "Turn ideas into videos that hook, move and travel across every feed.",
    "Personal Branding: Visibility Is Currency": "Become the name people remember, trust and call first.",
    "AI Literacy for Work & Productivity": "Use AI tools to work faster, learn quicker and get more done.",
    "Content Creation Mastery": "Create content people stop for, with nothing but a phone.",
    "Sales & Marketing Full Course": "Attract customers, pitch with confidence, and close the sale.",
    "Networking Like the Top 1%": "Build relationships that open doors, even if you're an introvert.",
}

# Ensure img paths exist, fallback to category
import pathlib as pl
for c in courses:
    # fix img mapping: use actual file if exists
    slug = c["title"].lower().replace(" ", "-").replace(":", "").replace("&", "").replace("  ", " ").strip()
    # handle special: Personal Branding slug
    candidates = list(COURSE_IMG_DIR.glob("*"))
    # try to find matching file by title lower without punctuation
    found = None
    for p in candidates:
        if p.stem.replace("-", " ").lower() in c["title"].lower() or c["title"].lower().split(":")[0].lower() in p.stem.replace("-", " ").lower():
            found = p
            break
    # direct try
    direct = COURSE_IMG_DIR / f"{slug}.jpg"
    if direct.exists():
        c["img_path"] = direct
    elif found:
        c["img_path"] = found
    else:
        # fallback to category image
        cat_map = {
            "Business": BASE / "public/images/cat-business.jpg",
            "Marketing": BASE / "public/images/cat-marketing.jpg",
            "Coding": BASE / "public/images/cat-coding.jpg",
            "Writing": BASE / "public/images/cat-writing.jpg",
            "Design": BASE / "public/images/cat-design.jpg",
            "Video": BASE / "public/images/cat-video.jpg",
            "Career": BASE / "public/images/cat-career.jpg",
        }
        c["img_path"] = cat_map.get(c["category"], BASE / "public/images/hero-tile.jpg")
    # tagline
    c["tagline"] = taglines.get(c["title"], c["desc"])
    print(f"{c['id']}: {c['title']} -> {c['img_path']} exists={c['img_path'].exists()}")

# Fonts
font_dir = pathlib.Path("/usr/share/fonts/truetype/dejavu")
bold_path = font_dir / "DejaVuSans-Bold.ttf"
regular_path = font_dir / "DejaVuSans.ttf"
# Fallback
if not bold_path.exists():
    bold_path = regular_path

def load_font(size, bold=True):
    p = bold_path if bold else regular_path
    try:
        return ImageFont.truetype(str(p), size)
    except:
        return ImageFont.load_default()

# Colors from template
COLOR_BG = (255, 255, 255)
COLOR_NAVY = (13, 32, 86)  # title
COLOR_DOTS = (225, 12, 122)  # magenta dots
COLOR_YELLOW = (255, 214, 0)  # yellow frame
COLOR_BLUE = (11, 71, 218)  # blue circle/wifi
COLOR_MAGENTA = (215, 0, 98)  # bottom
COLOR_MAGENTA_DARK = (197, 0, 88)
COLOR_TEXT_DARK = (6, 20, 8)
COLOR_MUTED = (90, 106, 94)

W, H = 1080, 1920

def draw_rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)

def create_poster(course, out_path):
    # Create base
    img = Image.new("RGB", (W, H), COLOR_BG)
    draw = ImageDraw.Draw(img, "RGBA")

    # Faint background image (course image at low opacity, blurred)
    try:
        bg = Image.open(course["img_path"]).convert("RGB")
        # crop to 1080x1920 covering
        # resize to fill
        bg_ratio = bg.width / bg.height
        target_ratio = W / H
        if bg_ratio > target_ratio:
            # wider, fit height
            new_h = H
            new_w = int(new_h * bg_ratio)
            bg = bg.resize((new_w, new_h), Image.LANCZOS)
            # crop center
            left = (new_w - W)//2
            bg = bg.crop((left, 0, left+W, H))
        else:
            new_w = W
            new_h = int(new_w / bg_ratio)
            bg = bg.resize((new_w, new_h), Image.LANCZOS)
            top = (new_h - H)//2
            bg = bg.crop((0, top, W, top+H))
        bg = bg.filter(ImageFilter.GaussianBlur(radius=18))
        # overlay with white at 0.85 opacity
        white = Image.new("RGB", (W, H), (255, 255, 255))
        img_bg = Image.blend(bg, white, 0.88)
        # also add subtle gradient overlay
        img.paste(img_bg, (0,0))
        # Add faint people overlay at top/bottom like template: we already blended
    except Exception as e:
        print(f"bg fail {course['title']}: {e}")

    # Re-create draw after paste
    draw = ImageDraw.Draw(img, "RGBA")

    # Top dots
    dot_y = 95
    dot_r = 13
    dot_gap = 18
    dot_colors = [COLOR_DOTS, COLOR_DOTS, COLOR_DOTS]
    total_w = 3*(dot_r*2) + 2*dot_gap
    start_x = (W - total_w)//2
    for i in range(3):
        x = start_x + i*(dot_r*2 + dot_gap) + dot_r
        draw.ellipse((x-dot_r, dot_y-dot_r, x+dot_r, dot_y+dot_r), fill=COLOR_DOTS)

    # Title area: "UNLOCK THE POWER OF" + course title
    # Use large navy text, centered
    # We'll create two-part title: first two lines smaller, last line course title bigger
    # Example: UNLOCK / THE POWER / OF DIGITAL MARKETING!
    title_font_small = load_font(44, bold=True)
    title_font_large = load_font(62, bold=True)
    title_font_course = load_font(50, bold=True)

    # Decide course display title: uppercase, trim
    raw_title = course["title"].upper()
    # Handle long titles: remove extra suffixes like " Mastery" for display? Keep but wrap
    # For Personal Branding: use "PERSONAL BRANDING"
    # Keep full title for wrapping — only trim very long suffixes with smaller font
    display_course = raw_title
    # Ensure not too long
    # Build lines
    lines = []
    # We want:
    # UNLOCK
    # THE POWER OF
    # <COURSE LINE 1>
    # <COURSE LINE 2 if needed>
    lines.append(("UNLOCK", title_font_small))
    lines.append(("THE POWER", title_font_small))
    # For OF + course: we need to handle
    # Put "OF" with course first word? Template has OF DIGITAL MARKETING! on one line.
    # We'll do "OF" + course on same styling as course?
    # Simpler: line "OF" + first course word? But we will just make course title 1-2 lines
    course_title_font = title_font_course
    # Wrap course title if too wide
    max_w = W - 120
    # Simple wrapping: split by words and fit
    words = display_course.split()
    cur = ""
    course_lines = []
    for w in words:
        test = cur + (" " if cur else "") + w
        bbox = draw.textbbox((0,0), test, font=course_title_font)
        w_width = bbox[2]-bbox[0]
        if w_width > max_w and cur:
            course_lines.append(cur)
            cur = w
        else:
            cur = test
    if cur:
        course_lines.append(cur)
    # If course_lines >2, reduce font
    if len(course_lines) > 2:
        course_title_font = load_font(42, bold=True)
        # re-wrap
        words = display_course.split()
        cur = ""
        course_lines = []
        for w in words:
            test = cur + (" " if cur else "") + w
            bbox = draw.textbbox((0,0), test, font=course_title_font)
            w_width = bbox[2]-bbox[0]
            if w_width > max_w and cur:
                course_lines.append(cur)
                cur = w
            else:
                cur = test
        if cur:
            course_lines.append(cur)

    # Now draw all title lines centered, starting y
    y = 145
    for txt, font in [("UNLOCK", title_font_small), ("THE POWER OF", title_font_small)]:
        bbox = draw.textbbox((0,0), txt, font=font)
        tw = bbox[2]-bbox[0]
        th = bbox[3]-bbox[1]
        x = (W - tw)//2
        draw.text((x, y), txt, fill=COLOR_NAVY, font=font)
        y += th + 6
    for line in course_lines:
        # Add exclamation
        txt = line + ("!" if line == course_lines[-1] else "")
        bbox = draw.textbbox((0,0), txt, font=course_title_font)
        tw = bbox[2]-bbox[0]
        th = bbox[3]-bbox[1]
        x = (W - tw)//2
        draw.text((x, y), txt, fill=COLOR_NAVY, font=font)
        y += th + 8

    # Yellow frame
    frame_w = 840
    frame_h = 980
    frame_x = (W - frame_w)//2
    frame_y = y + 36  # after title
    # Ensure frame_y not too low
    if frame_y < 560:
        frame_y = 560
    frame_radius = 34
    draw_rounded_rect(draw, (frame_x, frame_y, frame_x+frame_w, frame_y+frame_h), radius=frame_radius, fill=COLOR_YELLOW)
    # inner image area with padding
    pad = 16
    inner_x0 = frame_x + pad
    inner_y0 = frame_y + pad
    inner_x1 = frame_x + frame_w - pad
    inner_y1 = frame_y + frame_h - pad
    inner_w = inner_x1 - inner_x0
    inner_h = inner_y1 - inner_y0
    inner_radius = 22
    # Load course image and paste
    try:
        cimg = Image.open(course["img_path"]).convert("RGB")
        # crop to fill inner aspect
        target_ratio = inner_w / inner_h
        src_ratio = cimg.width / cimg.height
        if src_ratio > target_ratio:
            # crop width
            new_h = inner_h
            new_w = int(new_h * src_ratio)
            cimg = cimg.resize((new_w, new_h), Image.LANCZOS)
            left = (new_w - inner_w)//2
            cimg = cimg.crop((left, 0, left+inner_w, inner_h))
        else:
            new_w = inner_w
            new_h = int(new_w / src_ratio)
            cimg = cimg.resize((new_w, new_h), Image.LANCZOS)
            top = (new_h - inner_h)//2
            cimg = cimg.crop((0, top, inner_w, top+inner_h))
        # Create rounded mask
        mask = Image.new("L", (inner_w, inner_h), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.rounded_rectangle((0,0,inner_w,inner_h), radius=inner_radius, fill=255)
        # Paste with mask
        img.paste(cimg, (inner_x0, inner_y0), mask)
    except Exception as e:
        print(f"inner image fail {course['title']}: {e}")
        # fill with muted
        draw.rounded_rectangle((inner_x0, inner_y0, inner_x1, inner_y1), radius=inner_radius, fill=(230,230,230))

    # Blue wifi icon top right overlapping
    wifi_cx = frame_x + frame_w - 18
    wifi_cy = frame_y + 38
    # Draw blue rounded shape background for icon? In template it's a blue curved arrow with gap
    # We'll draw 3 arcs: outer, middle, inner
    # Use thick stroke
    wifi_r1, wifi_r2, wifi_r3 = 46, 32, 18
    # Outer arc: 90 degrees, rotated -45 to 45? In template it's top-right curve like signal
    # Simplified: draw arcs using ellipse
    # We'll draw 3 thick arcs with stroke 10
    for r in [wifi_r1, wifi_r2, wifi_r3]:
        # draw arc from 200 to 340 degrees
        bbox = (wifi_cx - r, wifi_cy - r, wifi_cx + r, wifi_cy + r)
        draw.arc(bbox, start=200, end=350, fill=COLOR_BLUE, width=13)
    # Add small arrow tip at end of outer arc
    # draw a small triangle near 340 deg
    import math as m
    ang = math.radians(340)
    tx = wifi_cx + wifi_r1 * m.cos(ang)
    ty = wifi_cy + wifi_r1 * m.sin(ang)
    # arrow head
    draw.polygon([(tx-12, ty-8), (tx+8, ty-10), (tx+6, ty+12)], fill=COLOR_BLUE)

    # Blue circle THIS WEEK ONLY! left overlapping
    circ_d = 172
    circ_r = circ_d//2
    circ_cx = frame_x + 6
    circ_cy = frame_y + 170
    # draw circle with shadow
    draw.ellipse((circ_cx-circ_r, circ_cy-circ_r, circ_cx+circ_r, circ_cy+circ_r), fill=COLOR_BLUE)
    # text inside
    small_font = load_font(22, bold=True)
    mid_font = load_font(20, bold=True)
    # 3 lines centered
    texts = ["THIS", "WEEK", "ONLY!"]
    ty = circ_cy - 30
    for t in texts:
        bbox = draw.textbbox((0,0), t, font=small_font)
        tw = bbox[2]-bbox[0]
        x = circ_cx - tw//2
        draw.text((x, ty), t, fill=(255,255,255), font=small_font)
        ty += 28

    # Sparkles bottom left near frame
    sparkle_x = frame_x + 26
    sparkle_y = frame_y + frame_h + 22
    # draw 3 sparkles (star shapes)
    def draw_star(cx, cy, r, fill):
        points = []
        for i in range(8):
            ang = m.radians(i * 45)
            rad = r if i % 2 == 0 else r*0.4
            x = cx + rad * m.cos(ang)
            y = cy + rad * m.sin(ang)
            points.append((x,y))
        draw.polygon(points, fill=fill)
    draw_star(sparkle_x, sparkle_y, 22, COLOR_YELLOW)
    draw_star(sparkle_x+34, sparkle_y+22, 14, COLOR_YELLOW)
    draw_star(sparkle_x+18, sparkle_y+44, 9, (255,255,255))

    # Bottom magenta rectangle
    mag_w = 900
    mag_h = 380
    mag_x = (W - mag_w)//2
    # Position: just below frame with gap, but ensure within H
    mag_y = frame_y + frame_h + 54
    if mag_y + mag_h > H - 26:
        mag_y = H - mag_h - 26
    mag_radius = 28
    draw_rounded_rect(draw, (mag_x, mag_y, mag_x+mag_w, mag_y+mag_h), radius=mag_radius, fill=COLOR_MAGENTA)
    # Inside magenta: content
    # We need to show: course tagline, what you'll learn bullets, and footer CTA
    # Let's layout:
    # Top small label: CHRISCO DIGITAL ACADEMY • 8 WEEKS • BEGINNER
    # Title again? Tagline italic
    # Bullets: 3 objectives
    # Bottom: ENROLL NOW + icons
    inner_pad = 28
    cx = mag_x + inner_pad
    cy = mag_y + 22
    # Label
    label_font = load_font(15, bold=True)
    label_text = f"CHRISCO DIGITAL ACADEMY  •  {course['duration'].upper()}  •  {course['level'].upper()}"
    # truncate if too long
    bbox = draw.textbbox((0,0), label_text, font=label_font)
    if bbox[2]-bbox[0] > mag_w - 2*inner_pad:
        label_font = load_font(13, bold=True)
    draw.text((cx, cy), label_text, fill=(255,255,255), font=label_font)
    cy += 32
    # Tagline (italic style simulated)
    tag = course["tagline"]
    # wrap tag to fit
    tag_font = load_font(18, bold=False)
    # wrap
    max_tag_w = mag_w - 2*inner_pad
    words = tag.split()
    line = ""
    tag_lines = []
    for w in words:
        test = line + (" " if line else "") + w
        bbox = draw.textbbox((0,0), test, font=tag_font)
        if bbox[2]-bbox[0] > max_tag_w and line:
            tag_lines.append(line)
            line = w
        else:
            line = test
    if line:
        tag_lines.append(line)
    # limit to 2 lines
    tag_lines = tag_lines[:2]
    for l in tag_lines:
        # use italic by skew? just draw normal with lighter
        draw.text((cx, cy), f'"{l}"', fill=(255, 230, 240), font=tag_font)
        cy += 24
    cy += 8
    # Bullets: objectives
    bullet_font = load_font(16, bold=False)
    bullet_title_font = load_font(15, bold=True)
    draw.text((cx, cy), "WHAT YOU'LL LEARN:", fill=(255,255,255), font=bullet_title_font)
    cy += 24
    # Use syllabus first 3 as "what you\'ll learn" when objectives are mismatched (syllabus is more accurate per PDF)
    learn_items = course["syllabus"][:3] if len(course.get("syllabus",[]))>=3 else course["objectives"][:3]
    for obj in learn_items:
        # bullet char
        bullet = "✓  " + obj
        # wrap bullet to fit
        # measure
        max_bull_w = mag_w - 2*inner_pad - 12
        # wrap
        words = bullet.split()
        bline = ""
        first = True
        for w in words:
            test = bline + (" " if bline else "") + w
            bbox = draw.textbbox((0,0), test, font=bullet_font)
            if bbox[2]-bbox[0] > max_bull_w and bline:
                # draw current line
                draw.text((cx+8, cy), bline.strip(), fill=(255,255,255), font=bullet_font)
                cy += 20
                bline = w
                first = False
            else:
                bline = test
        if bline:
            draw.text((cx+8, cy), bline.strip(), fill=(255,255,255), font=bullet_font)
            cy += 20
        # spacing between bullets
        cy += 2
        if cy > mag_y + mag_h - 58:
            break
    # Bottom CTA bar inside magenta: pill button
    # Place at bottom
    btn_y = mag_y + mag_h - 62
    btn_h = 48
    btn_w = 340
    btn_x = mag_x + (mag_w - btn_w)//2
    draw_rounded_rect(draw, (btn_x, btn_y, btn_x+btn_w, btn_y+btn_h), radius=24, fill=(255,255,255))
    btn_font = load_font(18, bold=True)
    btn_text = "ENROLL NOW  →"
    bbox = draw.textbbox((0,0), btn_text, font=btn_font)
    tw = bbox[2]-bbox[0]
    th = bbox[3]-bbox[1]
    bx = btn_x + (btn_w - tw)//2
    by = btn_y + (btn_h - th)//2 -2
    draw.text((bx, by), btn_text, fill=COLOR_MAGENTA, font=btn_font)

    # Small footer text under button
    footer_font = load_font(12, bold=False)
    footer = "chriscoyouthaflame2025@gmail.com  •  WhatsApp"
    bbox = draw.textbbox((0,0), footer, font=footer_font)
    fx = (W - (bbox[2]-bbox[0]))//2
    fy = btn_y + btn_h + 12
    draw.text((fx, fy), footer, fill=(255, 220, 230), font=footer_font)

    # Optional: add subtle shadow under frame
    # Save
    img = img.convert("RGB")
    img.save(out_path, "JPEG", quality=95, optimize=True)
    print(f"Poster saved {out_path}")

# Generate music
def generate_background_music(path, duration=10):
    # Generate a pleasant lo-fi chord loop using numpy
    import numpy as np, wave, struct
    sr = 44100
    t = np.linspace(0, duration, int(sr*duration), endpoint=False)
    # Chord progression: C - G - Am - F, each 2.5s, with gentle arpeggio
    # Frequencies (equal temperament)
    # C4=261.63, E4=329.63, G4=392.00
    # G3=196.00, B3=246.94, D4=293.66
    # A3=220.00, C4=261.63, E4=329.63
    # F3=174.61, A3=220.00, C4=261.63
    chords = [
        (261.63, 329.63, 392.00, 130.81), # C + bass C2
        (196.00, 246.94, 293.66, 98.00),  # G
        (220.00, 261.63, 329.63, 110.00), # Am
        (174.61, 220.00, 261.63, 87.31),  # F
    ]
    chord_dur = duration / len(chords)
    signal = np.zeros_like(t)
    for i, (f1,f2,f3, bass) in enumerate(chords):
        start = int(i*chord_dur*sr)
        end = int((i+1)*chord_dur*sr) if i < len(chords)-1 else len(t)
        seg_t = t[start:end] - t[start]
        # ADSR envelope: attack 0.05, decay 0.1, sustain 0.7, release 0.2
        # Simple: linear fade in/out 0.08s + sustain
        env = np.ones(end-start)
        fade = int(0.08*sr)
        # attack
        env[:fade] = np.linspace(0,1,fade)
        env[-fade:] = np.linspace(1,0,fade)
        # gentle tremolo or filter: sine 5Hz subtle
        # Generate chord with soft sine + slight second harmonic
        chord = (0.22*np.sin(2*np.pi*f1*seg_t) + 0.18*np.sin(2*np.pi*f2*seg_t) + 0.16*np.sin(2*np.pi*f3*seg_t) + 0.14*np.sin(2*np.pi*bass*seg_t*0.5))
        # add second harmonic quiet
        chord += 0.06*np.sin(2*np.pi*f1*2*seg_t) + 0.05*np.sin(2*np.pi*f2*2*seg_t)
        # add high shimmer
        chord *= env
        # low-pass feel: smooth
        signal[start:end] += chord
    # Add subtle hi-hat-like tick every beat (2 per second)
    # simple clicks at 1.0, 1.5, 2.0 etc with filtered noise
    # We'll add soft percussive ticks
    bpm = 88
    beat = 60/bpm
    for b in np.arange(0, duration, beat/2):
        idx = int(b*sr)
        if idx < len(signal)-200:
            # short burst of filtered noise + 4000Hz
            n = np.random.randn(400)*0.02
            n = np.convolve(n, np.ones(10)/10, mode='same')
            signal[idx:idx+400] += n * np.exp(-np.linspace(0,5,400))
    # Normalize and add light reverb via simple delay
    signal = signal / np.max(np.abs(signal)) * 0.68
    # simple delay reverb: 0.18s delay at 0.18 volume
    delay = int(0.18*sr)
    signal[delay:] += 0.18 * signal[:-delay]
    signal = signal / np.max(np.abs(signal)) * 0.78
    # Stereo: duplicate with slight delay for width
    stereo = np.stack([signal, np.roll(signal, int(0.015*sr))], axis=1)
    stereo = (stereo * 32767).astype(np.int16)
    # Write wav
    with wave.open(str(path), 'w') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(stereo.tobytes())
    print(f"Music saved {path}")

# Create shared music
music_path = TMP_DIR / "bg_music.wav"
generate_background_music(music_path, duration=10)

# Generate posters and videos
for course in courses:
    slug = course["title"].lower().replace(" ", "-").replace(":", "").replace("&", "").replace("'", "").replace('"', '').replace("--", "-")
    slug = re.sub(r'[^a-z0-9-]', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    # ensure unique
    poster_path = TMP_DIR / f"{slug}.jpg"
    video_path = OUT_DIR / f"{slug}.mp4"
    short_title = course["title"][:40]
    print(f"\n=== Generating {course['title']} -> {slug}")
    create_poster(course, poster_path)
    # Create video from poster + music
    # Use ffmpeg: loop image 10s, add audio, encode
    # Add zoompan for subtle motion
    # Command: ffmpeg -loop 1 -i poster.jpg -i bg_music.wav -c:v libx264 -t 10 -r 30 -pix_fmt yuv420p -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,zoompan=d=1:s=1080x1920:fps=30" etc simplified to static
    # We'll just create 10s video with image loop and audio, plus slight zoom
    cmd = [
        FFMPEG, "-y",
        "-loop", "1", "-i", str(poster_path),
        "-i", str(music_path),
        "-c:v", "libx264", "-t", "10", "-r", "30",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=white,zoompan=d=1:s=1080x1920:fps=30",
        "-c:a", "aac", "-b:a", "128k",
        "-shortest",
        "-movflags", "+faststart",
        str(video_path)
    ]
    # Alternative simpler without zoompan for compatibility
    simple_cmd = [
        FFMPEG, "-y",
        "-loop", "1", "-i", str(poster_path),
        "-i", str(music_path),
        "-c:v", "libx264", "-t", "10", "-r", "30",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1080:1920",
        "-b:v", "2500k", "-maxrate", "3000k",
        "-c:a", "aac", "-b:a", "128k",
        "-shortest",
        "-movflags", "+faststart",
        str(video_path)
    ]
    # Try simple first
    result = subprocess.run(simple_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("ffmpeg error:", result.stderr[:500])
    else:
        sz = video_path.stat().st_size
        print(f"Video saved {video_path} size {sz/1024:.1f}KB")
    # Also copy template-like? break after 1 for test? Remove for full
    # if course["id"] == 3: break

print("DONE")
