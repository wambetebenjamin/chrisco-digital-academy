#!/usr/bin/env python3
"""Rebuild the CHRISCO Youth Aflame books inside BOOK FOR TODAY.pdf's exact 10-page design.

The reference PDF supplies the A4 master pages, geometry, shapes, colors, ornaments,
image frames, and spacing. All template wording and stock photos are removed/replaced.
The supplied Kenyan church photo is credited under CC BY-SA 4.0. Text uses the
matching Inter body face and the closest full-glyph bold face available in the repo.

Build: python -m pip install -r scripts/youth_aflame_books/requirements.txt
       python scripts/build_youth_aflame_books.py
"""
from pathlib import Path
from collections import Counter
from io import BytesIO
import pymupdf
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / 'BOOK FOR TODAY.pdf'
ASSET = ROOT / 'scripts/youth_aflame_books/assets'
PHOTO = ASSET / 'pefa-east-gate-church.jpg'
INTER = ASSET / 'fonts/Inter-Regular.ttf'
DISPLAY = ROOT / 'scripts/joseph_ebook_assets/fonts/Poppins-Bold.ttf'
W, H = 595.5, 842.25
NAVY = (26/255, 18/255, 101/255)  # sampled from the reference PDF: #1A1265
WHITE = (1, 1, 1)

# Shared footer wording replaces the sample URL and sample author on pages 2–9.
FOOT_LEFT = 'SCRIPTURE  ·  PRAYER  ·  FORMATION'
FOOT_RIGHT = 'CHRISCO YOUTH AFLAME'


def text(page, value, box, *, face='inter', size=14, color=NAVY, align=0,
         lineheight=1.12, min_size=6, overlay=True):
    """Write into a fixed template text area, preserving its alignment and hierarchy."""
    fonts = {'inter': ('AflameInter', str(INTER)), 'display': ('AflameDisplay', str(DISPLAY))}
    name, fontfile = fonts[face]
    rect = pymupdf.Rect(box)
    current = float(size)
    while current >= min_size:
        remain = page.insert_textbox(rect, value, fontname=name, fontfile=fontfile,
                                     fontsize=current, color=color, align=align,
                                     lineheight=lineheight, overlay=overlay)
        if remain >= 0:
            return current
        current -= 0.35
    # Last-resort fit: insert a compact, readable version rather than clip.
    page.insert_textbox(rect, value, fontname=name, fontfile=fontfile,
                        fontsize=min_size, color=color, align=align,
                        lineheight=1.02, overlay=overlay)
    return min_size


def sample_background(image, rect, scale=2):
    """Find the exact flat fill just outside a text span, so redaction leaves no patch."""
    x0, y0, x1, y1 = [int(round(v * scale)) for v in rect]
    samples = []
    # Use the outer border, avoiding most glyph antialiasing pixels.
    for delta in (2, 3, 4):
        yy = (max(0, y0-delta), min(image.height-1, y1+delta))
        for x in range(max(0, x0), min(image.width, x1)):
            for y in yy:
                samples.append(image.getpixel((x, y)))
        xx = (max(0, x0-delta), min(image.width-1, x1+delta))
        for y in range(max(0, y0), min(image.height, y1)):
            for x in xx:
                samples.append(image.getpixel((x, y)))
    if not samples:
        return WHITE
    rgb = Counter(samples).most_common(1)[0][0]
    return tuple(channel / 255 for channel in rgb)


def remove_all_template_copy(page):
    """Erase text only; preserve every original vector, divider, capsule and image frame."""
    pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
    image = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    spans = []
    for block in page.get_text('dict')['blocks']:
        if 'lines' not in block:
            continue
        for line in block['lines']:
            for span in line['spans']:
                if span['text'].strip():
                    spans.append(span)
    for span in spans:
        x0, y0, x1, y1 = span['bbox']
        # Tight bounds avoid cutting through nearby icons or capsule outlines.
        rect = pymupdf.Rect(x0-.30, y0-.24, x1+.30, y1+.24)
        page.add_redact_annot(rect, fill=sample_background(image, span['bbox']), cross_out=False)
    if spans:
        page.apply_redactions(images=0, graphics=0)


def replace_template_photos(page, page_index):
    """Keep each original photo frame/crop, replacing unrelated stock imagery with the licensed photo."""
    photo = Image.open(PHOTO).convert('RGB')
    for n, info in enumerate(page.get_image_info(xrefs=True)):
        xref = info.get('xref', 0)
        if not xref:
            continue
        x0, y0, x1, y1 = info['bbox']
        aspect = max(.35, min(5.0, (x1-x0) / max(1.0, y1-y0)))
        width = 1000
        height = max(220, int(width/aspect))
        # Slightly vary crops among the small image cells while keeping the photo undistorted.
        center_x = (.34, .50, .66, .43, .58)[(page_index+n) % 5]
        center_y = (.42, .50, .58, .46, .54)[(page_index+2*n) % 5]
        crop = ImageOps.fit(photo, (width, height), method=Image.Resampling.LANCZOS,
                            centering=(center_x, center_y))
        buf = BytesIO()
        crop.save(buf, format='JPEG', quality=91, optimize=True)
        page.replace_image(xref, stream=buf.getvalue())


def replace_template_mark(page, page_index):
    # Remove the reference brand's tiny monogram, retaining its clean logo position.
    if page_index == 0:
        box = pymupdf.Rect(405, 53, 458, 94); center = pymupdf.Point(430, 73); radius = 8
    elif page_index == 9:
        box = pymupdf.Rect(42, 50, 106, 100); center = pymupdf.Point(62, 75); radius = 8
    else:
        box = pymupdf.Rect(244, 44, 280, 77); center = pymupdf.Point(262, 60.5); radius = 7
    page.draw_rect(box, color=(1,1,1), fill=(1,1,1), overlay=True)
    page.draw_circle(center, radius, color=NAVY, width=1.6, overlay=True)
    page.draw_circle(center, 1.8, color=NAVY, fill=NAVY, overlay=True)


def brand_footer(page):
    # The page master keeps the circular motif and footer pill; all sample wording is replaced.
    text(page, 'CHRISCO', (276, 48, 350, 72), face='display', size=14,
         color=NAVY, align=1, lineheight=1.0)
    text(page, FOOT_LEFT, (94, 753, 253, 775), face='inter', size=9.0,
         color=WHITE, align=0, lineheight=1.0)
    text(page, FOOT_RIGHT, (395, 753, 530, 775), face='display', size=10.0,
         color=WHITE, align=2, lineheight=1.0)


def add_page1(page, book):
    text(page, 'CHRISCO', (449, 60, 533, 87), face='display', size=14,
         color=NAVY, align=0, lineheight=1.0)
    if book == 1:
        title_lines = [('STOP MAKING OUR', 482, 555, 47), ('GOD LOOK LIKE BAAL!', 549, 626, 42)]
        subtitle = 'A SCRIPTURE-FIRST STUDY OF 1 KINGS 18:27–39'
    else:
        title_lines = [('YOUNG PASTOR', 482, 555, 55), ('10 TRUTHS', 549, 626, 51)]
        subtitle = 'ABOUT YOUR CALLING  ·  SCRIPTURE-GROUNDED MINISTRY GUIDE'
    for value, y0, y1, fs in title_lines:
        text(page, value, (59, y0, 535, y1), face='display', size=fs,
             color=NAVY, align=0, lineheight=1.0, min_size=25)
    text(page, subtitle, (67, 649, 520, 676), face='inter', size=17,
         color=WHITE, align=0, lineheight=1.0, min_size=10)
    text(page, 'Presented by:', (60, 727, 170, 746), face='inter', size=13,
         color=NAVY, lineheight=1.0)
    text(page, 'YOUTH AFLAME', (60, 747, 174, 769), face='display', size=11.5,
         color=NAVY, lineheight=1.0, min_size=8)
    text(page, 'SCRIPTURE  ·  FORMATION  ·  SERVICE', (366, 748, 535, 769),
         face='inter', size=9.5, color=NAVY, align=2, lineheight=1.0, min_size=7)


def add_page2(page, book):
    text(page, 'CHRISCO', (279, 49, 344, 71), face='display', size=13.5,
         color=NAVY, align=1, lineheight=1.0)
    text(page, 'TABLE OF CONTENTS', (120, 219, 475, 266), face='display', size=28,
         color=WHITE, align=1, lineheight=1.0)
    if book == 1:
        items = [
            'Welcome: The God Who Hears', 'Carmel in Context', 'Elijah’s Prayer',
            'The Fire and Its Meaning', 'Fervency Without Performance',
            'Prayer in the Whole Bible', 'A Healthy Practice of Prayer',
            'Reflection and Scripture Guide']
    else:
        items = [
            'Welcome: Following Jesus First', 'Truths 1–4: Cost and Character',
            'Truths 5–8: Family, Team and Unity', 'Truths 9–10: Gratitude and Christ',
            'Endurance in Matthew 24', 'A CHRISCO Youth Aflame Commission',
            'A Rule of Life for Young Pastors', 'Mentors, Reflection and Blessing']
    ys = [296, 353, 411, 469, 527, 585, 643, 700]
    for value, y in zip(items, ys):
        text(page, value, (82, y, 514, y+25), face='inter', size=18.0,
             color=NAVY, align=1, lineheight=1.0, min_size=12)
    brand_footer(page)


def add_page3(page, book):
    text(page, 'WELCOME', (155, 324, 441, 368), face='display', size=29,
         color=WHITE, align=1, lineheight=1.0)
    text(page, 'A word before you begin', (80, 389, 516, 415), face='inter', size=14,
         color=NAVY, align=1, lineheight=1.0)
    if book == 1:
        body = ('God does not need to be awakened, flattered, or forced to hear his children. '
                'Jesus teaches that our Father knows what we need before we ask (Matthew 6:8). '
                'Prayer is worship, dependence, and communion—not a technique for controlling God. '
                'On Carmel, Elijah prayed in the Lord’s covenant name and asked that Israel might '
                'return to God. The fire was a sovereign sign, not a formula for every believer. '
                'This book distinguishes spiritual fervour from pressure while making room for '
                'quiet prayer, tears, cries, stillness, and song.')
    else:
        body = ('Young pastor, follow Christ before you seek a platform. Ministry can be costly, '
                'and Scripture calls leaders to courage, integrity, service, and endurance. But '
                'sacrifice does not mean exploitation; loyalty does not mean silence; and endurance '
                'does not require remaining in danger. These ten truths are invitations to prepare '
                'your heart with Scripture, wise counsel, healthy boundaries, and a life rooted in '
                'Christ. Read every passage in context and let trusted, accountable believers help '
                'you grow.')
    text(page, body, (68, 411, 528, 516), face='inter', size=14.0,
         color=NAVY, align=1, lineheight=1.16, min_size=10)
    brand_footer(page)
    text(page, 'CHRISCO YOUTH AFLAME', (401, 753, 529, 775), face='display', size=9.7,
         color=WHITE, align=2, lineheight=1.0)


def page4_prayer(page):
    text(page, 'THE GOD WHO HEARS', (125, 188, 475, 231), face='display', size=26,
         color=WHITE, align=1, lineheight=1.0, min_size=18)
    cards = [
        ('OUR FATHER', 'Jesus says the Father already knows our needs. We pray in trust, not to wake God (Matthew 6:8–9).', 'left'),
        ('ELIJAH’S PRAYER', '“LORD God of Abraham, Isaac, and Israel”—he asks that the people know and turn (18:36–37).', 'right'),
        ('THE SIGN', 'Fire answered on Carmel so Israel would know the LORD and turn back. It is no prayer formula (18:38).', 'left'),
        ('THE RESPONSE', 'The people fell facedown and confessed, “The LORD, he is the God” (1 Kings 18:39).', 'right')]
    ys = [409, 493, 575, 658]
    for (label, desc, side), y in zip(cards, ys):
        if side == 'left':
            label_box=(59,y,240,y+32); body_box=(250,y-1,538,y+48)
        else:
            label_box=(317,y,537,y+32); body_box=(59,y-1,307,y+48)
        text(page,label,label_box,face='display',size=15.5,color=WHITE,align=1,lineheight=1.0,min_size=10)
        text(page,desc,body_box,face='inter',size=13.4,color=NAVY,
             align=0 if side=='left' else 2,lineheight=1.12,min_size=9)
    brand_footer(page)


def page5_prayer(page):
    text(page, 'PRAYER AND FERVENCY', (88, 78, 510, 123), face='display',
         size=27, color=WHITE, align=1, lineheight=1.0, min_size=18)
    rows = [
        ('PASSION', 'The Psalms cry out, rejoice, lament, and wait. James commends earnest prayer (James 5:16).'),
        ('NO VOLUME TEST', 'A loud prayer may be sincere; a quiet prayer may be fervent. Volume does not measure faith.'),
        ('POSTURE', 'Scripture shows kneeling, standing, raised hands, tears, and silence. No single posture is required.'),
        ('NO SELF-HARM', 'Baal’s prophets cut themselves in a futile rite (1 Kings 18:28). Do not teach harm as a way to make God answer.')]
    ys=[168,282,395,508]
    pill_rights=[362,423,362,485]
    for (label,desc),y,xr in zip(rows,ys,pill_rights):
        text(page,label,(185,y,xr,y+25),face='display',size=15.3,color=WHITE,align=1,lineheight=1.0,min_size=9.5)
        text(page,desc,(185,y+32,529,y+76),face='inter',size=13.1,color=NAVY,align=0,lineheight=1.1,min_size=8.5)
    brand_footer(page)

def page6_prayer(page):
    text(page, 'PRAYER THAT TRUSTS GOD', (100, 164, 500, 205), face='display',
         size=28, color=WHITE, align=1, lineheight=1.0, min_size=18)
    text(page, 'Courage with humility', (150, 194, 445, 235), face='display',
         size=26, color=WHITE, align=1, lineheight=1.0, min_size=16)
    cards=[
        ('ASK WITH TRUST', '“Your Father knoweth what things ye have need of” (Matthew 6:8). Ask plainly; God’s love is not earned by performance.'),
        ('WAIT WITH HOPE', 'Jesus taught persistence (Luke 18:1–8); Paul also received grace rather than removal of his thorn (2 Corinthians 12:8–9).'),
        ('YIELD THE OUTCOME', 'Carmel’s fire was God’s sovereign act. Prayer asks boldly, yet trusts God when the answer is different or delayed.')]
    boxes=[((60,405,265,453),(64,454,265,523)),((330,405,535,453),(330,454,535,523)),((185,584,410,625),(185,626,410,702))]
    for (label,desc),(hb,db) in zip(cards,boxes):
        text(page,label,hb,face='display',size=15.5,color=WHITE,align=1,lineheight=1.0,min_size=10)
        text(page,desc,db,face='inter',size=12.8,color=NAVY,align=1,lineheight=1.12,min_size=8.5)
    brand_footer(page)


def page7_prayer(page):
    text(page,'A BIBLICAL PRAYER LIFE',(110,77,485,122),face='display',size=27,color=WHITE,align=1,lineheight=1.0,min_size=18)
    cells=[
        ('PRAISE','Name God’s goodness (Psalm 145).'),('CONFESSION','Tell the truth; receive mercy (1 John 1:9).'),
        ('LAMENT','Bring grief honestly (Psalm 13).'),('INTERCESSION','Ask for others and act in love (Acts 4:23–35).'),
        ('SILENCE','Wait before the Lord (Psalm 131).'),('THANKSGIVING','Give thanks in every season (1 Thessalonians 5:18).')]
    centers=[(168,246),(421,246),(168,445),(421,445),(168,643),(421,643)]
    for (label,desc),(cx,y) in zip(cells,centers):
        text(page,label,(cx-104,y,cx+104,y+26),face='display',size=15.2,color=WHITE,align=1,lineheight=1.0,min_size=10)
        text(page,desc,(cx-112,y+34,cx+112,y+79),face='inter',size=12.3,color=NAVY,align=1,lineheight=1.12,min_size=8.5)
    brand_footer(page)


def page8_prayer(page):
    text(page,'RETURN TO SCRIPTURE',(115,187,481,231),face='display',size=27,color=WHITE,align=1,lineheight=1.0,min_size=18)
    rows=[
        ('READ CONTEXT','1 Kings 16–19; notice the covenant story.',240,248),
        ('JESUS & PRAYER','Matthew 6:5–13; seek the Father and his kingdom.',289,292),
        ('LAMENT & WAIT','Psalms 13, 22, and 130 give words for waiting.',319,328),
        ('LOVE & TRUTH','Does prayer lead to faith, love, truth, and care?',215,222)]
    for (label,desc,right,body_x),y in zip(rows,[408,454,501,547]):
        text(page,label,(65,y,right,y+27),face='display',size=13.2,color=WHITE,align=1,lineheight=1.0,min_size=8.5)
        text(page,desc,(body_x,y,533,y+27),face='inter',size=12.6,color=NAVY,align=0,lineheight=1.0,min_size=8.2)
    brand_footer(page)

def page9_prayer(page):
    text(page,'A SIMPLE PRAYER PRACTICE',(62,77,535,123),face='display',size=27,color=WHITE,align=1,lineheight=1.0,min_size=17)
    rows=[
        ('READ THE TEXT','Read a short passage slowly; ask what it says about God.',380),
        ('SEEK THE LORD','Name God’s character before bringing your request.',412),
        ('ASK WITH LOVE','Bring needs honestly; pray for others and their wellbeing.',367),
        ('LISTEN & RESPOND','Reflect, seek wise counsel, and take the next loving step.',426)]
    for (label,desc,right),y in zip(rows,[289,402,516,629]):
        text(page,label,(185,y,right,y+28),face='display',size=14.5,color=WHITE,align=1,lineheight=1.0,min_size=9)
        text(page,desc,(185,y+34,490,y+68),face='inter',size=12.5,color=NAVY,align=0,lineheight=1.1,min_size=8)
    brand_footer(page)

def page10_prayer(page):
    text(page,'CHRISCO',(112,56,235,94),face='display',size=19,color=NAVY,lineheight=1.0)
    text(page,'THE LORD',(57,119,485,204),face='display',size=68,color=NAVY,align=0,lineheight=1.0,min_size=35)
    text(page,'HE IS GOD',(57,199,500,287),face='display',size=68,color=NAVY,align=0,lineheight=1.0,min_size=35)
    text(page,'Our God is not Baal.',(59,286,390,317),face='inter',size=20,color=NAVY,lineheight=1.0)
    text(page,'A PRAYER',(80,366,290,396),face='display',size=17,color=WHITE,align=1,lineheight=1.0,min_size=11)
    vals=[
        'CHRISCO YOUTH AFLAME',
        'SCRIPTURE  ·  FORMATION  ·  SERVICE',
        '1 Kings 18:36–39  ·  Matthew 6:8',
        'PEFA EAST GATE · CC BY-SA 4.0']
    ys=[419,465,510,555]
    for idx,(v,y) in enumerate(zip(vals,ys)):
        size=8.2 if idx==3 else 11.3
        text(page,v,(106,y,313,y+24),face='inter',size=size,color=WHITE,lineheight=1.0,min_size=6)
    # A slim navy caption on the lower photo supplies image credit and license.
    page.draw_rect(pymupdf.Rect(60,804,535,832),color=NAVY,fill=NAVY,overlay=True)
    text(page,'Photo: Martin Wainaina, “Pefa East Gate Church - Nakuru” (2020) · CC BY-SA 4.0\ncommons.wikimedia.org/wiki/File:Pefa_East_Gate_Church_-_Nakuru.jpg',
         (65,807,530,830),face='inter',size=7.1,color=WHITE,align=1,lineheight=1.0,min_size=5.8)


def page4_pastor(page):
    text(page,'TRUTHS 1–4',(100,188,495,231),face='display',size=25.5,color=WHITE,align=1,lineheight=1.0,min_size=17)
    cards=[
        ('01  COST','Calling can require time, comfort, and resources. Offer freely; do not accept exploitation.'),
        ('02  PRIVATE BATTLES','Encourage others, but seek trusted support for your own burdens (2 Corinthians 1:3–7).'),
        ('03  LOYALTY','Trust wisely. Disagreement and safe departure are not automatically betrayal.'),
        ('04  MISJUDGED','Listen, keep integrity, and welcome fair accountability (1 Timothy 3:1–7).')]
    ys=[409,493,575,658]
    for (label,desc),y in zip(cards,ys):
        if y in [409,575]: hb=(59,y,240,y+32);db=(250,y-1,538,y+48); side='l'
        else: hb=(317,y,537,y+32);db=(59,y-1,307,y+48);side='r'
        text(page,label,hb,face='display',size=14.6,color=WHITE,align=1,lineheight=1.0,min_size=10)
        text(page,desc,db,face='inter',size=12.7,color=NAVY,align=0 if side=='l' else 2,lineheight=1.12,min_size=8.5)
    brand_footer(page)


def page5_pastor(page):
    text(page,'FAMILY, TEAM & UNITY',(80,78,520,123),face='display',size=26,color=WHITE,align=1,lineheight=1.0,min_size=17)
    rows=[
        ('05  FAMILY','Treat your spouse and children as people, not ministry props; protect their privacy and time.'),
        ('06  MENTORS','Equip emerging leaders; challenge is not automatically rebellion (2 Timothy 2:1–2).'),
        ('07  CALLING','Test your assignment with Scripture, wise counsel, character, and fruit.'),
        ('08  UNITY','Pursue peace and truth; never use unity to silence someone harmed.')]
    pill_rights=[362,423,362,485]
    for (label,desc),y,xr in zip(rows,[168,282,395,508],pill_rights):
        text(page,label,(185,y,xr,y+25),face='display',size=14.6,color=WHITE,align=1,lineheight=1.0,min_size=9)
        text(page,desc,(185,y+32,529,y+78),face='inter',size=12.6,color=NAVY,lineheight=1.1,min_size=8.5)
    brand_footer(page)

def page6_pastor(page):
    text(page,'SERVE WITH COURAGE',(90,164,505,205),face='display',size=27,color=WHITE,align=1,lineheight=1.0,min_size=17)
    text(page,'Christ is the reward',(145,194,450,235),face='display',size=25,color=WHITE,align=1,lineheight=1.0,min_size=16)
    cards=[
        ('09  GRATITUDE','Serve God, not applause. Yet churches should honour work, provide fair support, and share the load.'),
        ('10  ENDURANCE','Christ is your hope, not recognition. Endure faithfully; seek help and safety when needed.'),
        ('THE CROWN','Matthew 24:13 calls disciples to faithfulness amid trial; it does not promise ministry success or require staying in abuse.')]
    boxes=[((60,405,265,453),(64,454,265,523)),((330,405,535,453),(330,454,535,523)),((185,584,410,625),(185,626,410,702))]
    for (label,desc),(hb,db) in zip(cards,boxes):
        text(page,label,hb,face='display',size=15,color=WHITE,align=1,lineheight=1.0,min_size=9.5)
        text(page,desc,db,face='inter',size=12.2,color=NAVY,align=1,lineheight=1.12,min_size=8)
    brand_footer(page)


def page7_pastor(page):
    text(page,'TEN TRUTHS · IN PRACTICE',(100,77,495,122),face='display',size=27,color=WHITE,align=1,lineheight=1.0,min_size=18)
    cells=[
        ('SERVE FREELY','Set wise limits; service is not exploitation.'),
        ('SEEK SUPPORT','A pastor also needs prayer, rest, and care.'),
        ('TRUST WISELY','Be loving without demanding blind allegiance.'),
        ('WELCOME REVIEW','Listen to concerns; use fair processes.'),
        ('CARE FOR FAMILY','Guard their privacy, time, and safety.'),
        ('BUILD OTHERS','Prepare people to lead beyond your shadow.')]
    centers=[(168,246),(421,246),(168,445),(421,445),(168,643),(421,643)]
    for (label,desc),(cx,y) in zip(cells,centers):
        text(page,label,(cx-104,y,cx+104,y+26),face='display',size=14.8,color=WHITE,align=1,lineheight=1.0,min_size=9.5)
        text(page,desc,(cx-112,y+34,cx+112,y+79),face='inter',size=11.9,color=NAVY,align=1,lineheight=1.12,min_size=8)
    brand_footer(page)


def page8_pastor(page):
    text(page,'FAITHFULNESS OVER FAME',(100,187,500,231),face='display',size=27,color=WHITE,align=1,lineheight=1.0,min_size=18)
    rows=[
        ('CHARACTER','Integrity matters more than platform or popularity.',240,248),
        ('ACCOUNTABILITY','Leaders serve under Christ; none is above correction.',289,292),
        ('UNITY','Pursue peace without covering harm or coercion.',319,328),
        ('CHRIST OURS','Let Jesus—not applause—anchor your calling.',215,222)]
    for (label,desc,right,body_x),y in zip(rows,[408,454,501,547]):
        text(page,label,(65,y,right,y+27),face='display',size=13.2,color=WHITE,align=1,lineheight=1.0,min_size=8.5)
        text(page,desc,(body_x,y,533,y+27),face='inter',size=12.4,color=NAVY,lineheight=1.0,min_size=8.2)
    brand_footer(page)

def page9_pastor(page):
    text(page,'A RULE OF LIFE FOR YOUNG PASTORS',(58,77,538,123),face='display',size=25.5,color=WHITE,align=1,lineheight=1.0,min_size=17)
    rows=[
        ('WORD & PRAYER','Read Scripture beyond sermons; pray honestly, including lament.',380),
        ('REST & COMMUNITY','Keep friendships beyond the pulpit and make room for rest.',412),
        ('FAMILY & SAFETY','Respect consent, privacy, safeguarding, and household needs.',367),
        ('MONEY & MENTORS','Use transparent finances and accountable counsel.',426)]
    for (label,desc,right),y in zip(rows,[289,402,516,629]):
        text(page,label,(185,y,right,y+28),face='display',size=13.8,color=WHITE,align=1,lineheight=1.0,min_size=8.5)
        text(page,desc,(185,y+34,490,y+70),face='inter',size=12.4,color=NAVY,lineheight=1.1,min_size=8)
    brand_footer(page)

def page10_pastor(page):
    text(page,'CHRISCO',(112,56,235,94),face='display',size=19,color=NAVY,lineheight=1.0)
    text(page,'CHRIST IS',(57,119,485,204),face='display',size=68,color=NAVY,lineheight=1.0,min_size=35)
    text(page,'YOUR REWARD',(57,199,405,287),face='display',size=58,color=NAVY,lineheight=1.0,min_size=34)
    text(page,'“But he that shall endure unto the end, the same shall be saved.” — Matthew 24:13',(59,286,535,317),face='inter',size=14,color=NAVY,lineheight=1.0,min_size=9)
    text(page,'CALL',(72,366,320,396),face='display',size=14.5,color=WHITE,align=1,lineheight=1.0,min_size=9)
    vals=[
        'FOCUS  ·  ADOM WƆ WIEM',
        '21st Century Reformer: serve with truth and humility.',
        '“Type of Joel 2:28” · Acts 2:16–21; test every word.',
        'THERE ARE PROPHETS · ENB']
    ys=[419,465,510,555]
    for idx,(v,y) in enumerate(zip(vals,ys)):
        size=9.3 if idx in (1,2,3) else 10.8
        face='inter'
        text(page,v,(106,y,343,y+24),face=face,size=size,color=WHITE,lineheight=1.0,min_size=7)
    text(page,'PHOTO: PEFA EAST GATE CHURCH – NAKURU · CC BY-SA 4.0',
         (60,795,535,812),face='inter',size=7.3,color=WHITE,align=1,lineheight=1.0,min_size=5.5)
    page.draw_rect(pymupdf.Rect(60,804,535,832),color=NAVY,fill=NAVY,overlay=True)
    text(page,'Photo: Martin Wainaina, “Pefa East Gate Church - Nakuru” (2020) · CC BY-SA 4.0\ncommons.wikimedia.org/wiki/File:Pefa_East_Gate_Church_-_Nakuru.jpg',
         (65,807,530,830),face='inter',size=7.1,color=WHITE,align=1,lineheight=1.0,min_size=5.8)


def build(book, output):
    doc = pymupdf.open(TEMPLATE)
    if len(doc) != 10:
        raise RuntimeError('Expected the supplied 10-page reference PDF.')
    # Register exact, full-glyph body font and project display font on each page.
    layouts = ([add_page1, add_page2, add_page3, page4_prayer, page5_prayer,
                page6_prayer, page7_prayer, page8_prayer, page9_prayer, page10_prayer]
               if book == 1 else
               [add_page1, add_page2, add_page3, page4_pastor, page5_pastor,
                page6_pastor, page7_pastor, page8_pastor, page9_pastor, page10_pastor])
    for i, page in enumerate(doc):
        remove_all_template_copy(page)
        replace_template_photos(page, i)
        replace_template_mark(page, i)
        if i == 0:
            add_page1(page, book)
        elif i == 1:
            add_page2(page, book)
        elif i == 2:
            add_page3(page, book)
            # Page 3 keeps the same small centered brand and lower navy ribbon.
        else:
            layouts[i](page)
        page.clean_contents()
    doc.set_metadata({
        'title': ('Stop Making Our God Look Like Baal! | CHRISCO Youth Aflame' if book==1
                  else 'Young Pastor: 10 Truths About Your Calling | CHRISCO Youth Aflame'),
        'author': 'CHRISCO Youth Aflame',
        'subject': 'Scripture-first Christian teaching and formation',
        'creator': 'CHRISCO Youth Aflame',
    })
    target = ROOT / 'content/books' / output
    target.parent.mkdir(parents=True, exist_ok=True)
    doc.save(target, garbage=4, deflate=True)
    print(f'Wrote {target} ({len(doc)} pages, {target.stat().st_size/1024:.0f} KB)')


if __name__ == '__main__':
    build(1, 'stop-making-our-god-look-like-baal.pdf')
    build(2, 'young-pastor-10-truths-about-your-calling.pdf')
