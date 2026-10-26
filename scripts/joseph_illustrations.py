#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Spacious deep-dive exposition & custom vector prophetic diagram pages
for the 28-page Illustrated Seer Study Edition of:
'Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn'
Modeled strictly on `company book.pdf` palette & LilitaOne + Poppins typography.
"""

from xml.sax.saxutils import escape
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
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
    INK_DARK,
    fill_page,
    draw_rounded_box,
    draw_circle,
    draw_pinwheel,
    make_style,
    draw_paragraphs_box,
    draw_subtle_page_tag,
)


def _draw_arrow_h(c: canvas.Canvas, x1: float, x2: float, y_top: float, color: str) -> None:
    c.saveState()
    c.setStrokeColor(HexColor(color))
    c.setFillColor(HexColor(color))
    c.setLineWidth(2.2)
    yy = Y(y_top)
    c.line(x1, yy, x2 - 6, yy)
    p = c.beginPath()
    p.moveTo(x2, yy)
    p.lineTo(x2 - 8, yy + 4.5)
    p.lineTo(x2 - 8, yy - 4.5)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def _draw_diagram_box(c: canvas.Canvas, diagram_kind: str, nodes: list, x: float, y_top: float, w: float, h: float) -> None:
    """Draw spacious, crisp vector prophetic diagram inside a soft blush/royal frame."""
    draw_rounded_box(c, x, y_top, w, h, radii=(18, 18, 18, 18), fill_hex=BLUSH)
    c.saveState()
    c.setStrokeColor(HexColor("#FFD8D1"))
    c.setLineWidth(1.2)
    c.roundRect(x, Y(y_top + h), w, h, 18, stroke=1, fill=0)
    c.restoreState()

    if diagram_kind == "bridge":
        # 4-stage timeline bridge from Early Sight -> Hidden Process -> Vessel Capacity -> Throne Fulfillment
        box_w = 106.0
        gap = (w - 40.0 - 4 * box_w) / 3.0
        bx = x + 20.0
        by = y_top + 44.0
        bh = h - 66.0
        for idx, (tag, title, desc) in enumerate(nodes[:4]):
            bg = ROYAL_DARK if idx in (0, 3) else WHITE
            fg = WHITE if idx in (0, 3) else INK_DARK
            badge_col = CORAL_CARD if idx in (1, 2) else CORAL_ACCENT
            draw_rounded_box(c, bx, by, box_w, bh, radii=(14, 14, 14, 14), fill_hex=bg)
            if bg == WHITE:
                c.saveState()
                c.setStrokeColor(HexColor(ROYAL_MID))
                c.setLineWidth(1.2)
                c.roundRect(bx, Y(by + bh), box_w, bh, 14, stroke=1, fill=0)
                c.restoreState()
            draw_rounded_box(c, bx + 12, by + 12, box_w - 24, 20, radii=(10, 10, 10, 10), fill_hex=badge_col)
            c.saveState()
            c.setFont("Poppins-Bold", 7.8)
            c.setFillColor(HexColor(WHITE))
            c.drawCentredString(bx + box_w / 2.0, Y(by + 25.0), tag)
            c.restoreState()

            st_t = make_style(f"dt_{idx}", "Poppins-Bold", 8.8, 12.0, fg, TA_CENTER, 3)
            st_d = make_style(f"dd_{idx}", "Poppins", 7.8, 11.2, fg if bg != WHITE else "#323854", TA_CENTER, 0)
            draw_paragraphs_box(c, [(f"<b>{escape(title)}</b>", st_t), (escape(desc), st_d)], bx + 8, by + 40, box_w - 16, bh - 48)
            if idx < 3:
                _draw_arrow_h(c, bx + box_w + 3, bx + box_w + gap - 3, by + bh / 2.0, CORAL_CARD)
            bx += box_w + gap

    elif diagram_kind == "contrast":
        # Two-column Prophetic Contrast Architecture (Counterfeit/Trap vs God's Way)
        col_w = (w - 52.0) / 2.0
        for idx, (header, items, is_good) in enumerate(nodes[:2]):
            cx = x + 18.0 + idx * (col_w + 16.0)
            cy = y_top + 42.0
            ch = h - 58.0
            bg = ROYAL_DARK if is_good else WHITE
            fg = WHITE if is_good else INK_DARK
            head_bg = CORAL_CARD if not is_good else "#1D2FA8"
            draw_rounded_box(c, cx, cy, col_w, ch, radii=(16, 16, 16, 16), fill_hex=bg)
            if not is_good:
                c.saveState()
                c.setStrokeColor(HexColor(CORAL_CARD))
                c.setLineWidth(1.3)
                c.roundRect(cx, Y(cy + ch), col_w, ch, 16, stroke=1, fill=0)
                c.restoreState()
            draw_rounded_box(c, cx + 14, cy + 12, col_w - 28, 24, radii=(12, 12, 12, 12), fill_hex=head_bg)
            c.saveState()
            c.setFont("Poppins-Bold", 8.6)
            c.setFillColor(HexColor(WHITE))
            c.drawCentredString(cx + col_w / 2.0, Y(cy + 27.5), header)
            c.restoreState()

            st_li = make_style(f"cli_{idx}", "Poppins", 8.3, 12.6, fg, TA_LEFT, 5)
            paras = [(f"•  {escape(it)}", st_li) for it in items]
            draw_paragraphs_box(c, paras, cx + 16, cy + 46, col_w - 32, ch - 54)

    elif diagram_kind == "roots":
        # Iceberg / Tree Root-to-Fruit Diagram (Hidden Depth Below -> Visible Fruit Above)
        mid_y = y_top + h * 0.50
        # Above-ground sky zone
        draw_rounded_box(c, x + 18, y_top + 40, w - 36, (h - 56) * 0.46, radii=(14, 14, 4, 4), fill_hex=WHITE)
        # Below-ground deep royal foundation zone
        draw_rounded_box(c, x + 18, mid_y + 4, w - 36, (h - 56) * 0.50, radii=(4, 4, 14, 14), fill_hex=ROYAL_DARK)
        # Coral horizon line
        c.saveState()
        c.setStrokeColor(HexColor(CORAL_CARD))
        c.setLineWidth(2.6)
        c.line(x + 18, Y(mid_y + 2), x + w - 18, Y(mid_y + 2))
        c.restoreState()

        above_lbl, above_txt = nodes[0]
        below_lbl, below_txt = nodes[1]
        st_ab_h = make_style("abh", "Poppins-Bold", 9.6, 13.0, ROYAL_MID, TA_LEFT, 3)
        st_ab_b = make_style("abb", "Poppins", 8.6, 13.0, INK_DARK, TA_LEFT, 0)
        draw_paragraphs_box(c, [(escape(above_lbl), st_ab_h), (escape(above_txt), st_ab_b)], x + 34, y_top + 50, w - 68, (h - 56) * 0.40)

        st_bl_h = make_style("blh", "Poppins-Bold", 9.6, 13.0, CORAL_ACCENT, TA_LEFT, 3)
        st_bl_b = make_style("blb", "Poppins", 8.6, 13.0, WHITE, TA_LEFT, 0)
        draw_paragraphs_box(c, [(escape(below_lbl), st_bl_h), (escape(below_txt), st_bl_b)], x + 34, mid_y + 14, w - 68, (h - 56) * 0.42)

    elif diagram_kind == "ripples":
        # Concentric Kingdom Ripple Circles (Left visual) + 3 Stage Labels (Right)
        cx = x + 112.0
        cy = y_top + h * 0.56
        for r, col in [(74, "#DCE2FF"), (54, "#8E9CF5"), (35, ROYAL_MID), (17, CORAL_CARD)]:
            draw_circle(c, cx, cy, r, col)
        c.saveState()
        c.setFont("Poppins-Bold", 7.2)
        c.setFillColor(HexColor(WHITE))
        c.drawCentredString(cx, Y(cy + 2.5), "JOSEPH")
        c.restoreState()

        rx = x + 204.0
        ry = y_top + 38.0
        rw = w - 220.0
        for idx, (ring_lbl, ring_desc) in enumerate(nodes[:3]):
            draw_rounded_box(c, rx, ry, rw, 52.0, radii=(10, 10, 10, 10), fill_hex=WHITE if idx != 2 else ROYAL_DARK)
            fg = WHITE if idx == 2 else INK_DARK
            hd = CORAL_ACCENT if idx == 2 else ROYAL_MID
            st_r = make_style(f"rp_{idx}", "Poppins", 8.2, 11.8, fg, TA_LEFT, 0)
            draw_paragraphs_box(
                c,
                [(f"<b><font color='{hd}'>{escape(ring_lbl)}:</font></b> {escape(ring_desc)}", st_r)],
                rx + 12,
                ry + 7,
                rw - 24,
                40.0,
            )
            ry += 58.0

    # Diagram header pill at top-left of diagram card
    c.saveState()
    c.setFont("Poppins-Bold", 8.5)
    c.setFillColor(HexColor(CORAL_CARD))
    c.drawString(x + 20.0, Y(y_top + 25.0), "ILLUSTRATED PROPHETIC FRAMEWORK")
    c.restoreState()


def render_illustrated_lesson_deep_dive(c: canvas.Canvas, spec: dict, page_num: int) -> None:
    """Spacious deep-dive page with LilitaOne heading, unhurried 10.2pt teaching prose,
    custom vector prophetic illustration, and practical journal exercise."""
    fill_page(c, WHITE)
    draw_pinwheel(c, 488.0, 34.0, 72.0, CREAM_SHAPE)

    # Top kicker badge + Title
    draw_rounded_box(c, 48.0, 44.0, 168.0, 24.0, radii=(12, 12, 12, 12), fill_hex=CORAL_CARD)
    c.saveState()
    c.setFont("Poppins-Bold", 8.5)
    c.setFillColor(HexColor(WHITE))
    c.drawCentredString(48.0 + 84.0, Y(59.0), spec["kicker"])

    from reportlab.pdfbase import pdfmetrics
    title_sz = 27.5
    while pdfmetrics.stringWidth(spec["title"], "LilitaOne", title_sz) > 496.0 and title_sz > 18.0:
        title_sz -= 0.5
    c.setFont("LilitaOne", title_sz)
    c.setFillColor(HexColor(ROYAL_DARK))
    c.drawString(48.0, Y(102.0), spec["title"])
    c.restoreState()

    # Spacious 10.2pt body explanation (never squeezed!)
    st_body = make_style(
        "deep_body",
        font="Poppins",
        size=10.1,
        leading=16.0,
        color=INK_DARK,
        align=TA_JUSTIFY,
        space_after=9.0,
    )
    paras = [(p, st_body) for p in spec["paragraphs"]]
    used_h = draw_paragraphs_box(c, paras, 48.0, 118.0, 499.0, 250.0)

    # Custom Vector Prophetic Diagram in the middle
    diag_y = max(374.0, 124.0 + used_h + 12.0)
    diag_h = 222.0
    _draw_diagram_box(c, spec["diagram_kind"], spec["diagram_nodes"], 48.0, diag_y, 499.0, diag_h)

    # Bottom Prayerful Reflection & Study Exercise Card
    bot_y = diag_y + diag_h + 18.0
    bot_h = 772.0 - bot_y
    draw_rounded_box(c, 48.0, bot_y, 499.0, bot_h, radii=(16, 16, 16, 16), fill_hex=ROYAL_DARK)
    c.saveState()
    c.setFont("LilitaOne", 15.5)
    c.setFillColor(HexColor(CORAL_ACCENT))
    c.drawString(68.0, Y(bot_y + 28.0), spec["reflection_title"])
    c.restoreState()

    st_ref = make_style("ref_b", "Poppins", 9.5, 14.8, WHITE, TA_LEFT, 5.0)
    draw_paragraphs_box(
        c,
        [(p, st_ref) for p in spec["reflection_points"]],
        68.0,
        bot_y + 38.0,
        459.0,
        bot_h - 48.0,
    )

    draw_subtle_page_tag(c, page_num, dark_bg=False)


ILLUSTRATED_PAGES = {
    "L1_DEEP": {
        "kicker": "LESSON 01  •  IN DEPTH",
        "title": "UNDERSTANDING SIGHT VS CAPACITY",
        "paragraphs": [
            "Why does God reveal a calling in seed form years before He grants the platform? In Scripture, vision is heaven's compass, while process is heaven's quarry. When seventeen year old Joseph saw sheaves bowing in Genesis 37, the revelation was pure, yet his emotional and administrative muscles were still untrained. Had Joseph ascended to Egypt's prime ministership at seventeen, the weight of national power would have crushed him.",
            "Every emerging seer must distinguish between the authenticity of a vision and the timing of its appointment. Habakkuk 2:3 teaches that true revelation speaks toward an appointed end: though it lingers, wait for it. Waiting is never wasted time when God is enlarging the vessel to match the measure of what you saw.",
        ],
        "diagram_kind": "bridge",
        "diagram_nodes": [
            ("STAGE 01", "Early Sight", "God plants authentic prophetic vision to awaken holy hunger (Gen 37)."),
            ("STAGE 02", "Hidden Quarry", "Obscurity, service, and testing strip pride from the gift (Gen 39)."),
            ("STAGE 03", "Enlarged Vessel", "Character, empathy, and stewardship catch up to revelation (Gen 40)."),
            ("STAGE 04", "Appointed Seat", "God entrusts public authority without destroying the messenger (Gen 41)."),
        ],
        "reflection_title": "PERSONAL SEER STUDY & JOURNAL EXERCISE",
        "reflection_points": [
            "<b>1. Examine Your Timeline:</b> Write down one promise or burden God showed you early in your walk. Instead of asking 'Why hasn't it happened yet?', ask 'What character muscle is the Holy Spirit building in me right now to carry it safely?'",
            "<b>2. Anchor Scripture for Meditation:</b> Read 1 Samuel 16:13 alongside 2 Samuel 5:4 and trace how David grew between Samuel's oil in Bethlehem and the throne in Hebron.",
        ],
    },
    "L2_DEEP": {
        "kicker": "LESSON 02  •  IN DEPTH",
        "title": "SACRED CONSECRATION VS ISOLATION",
        "paragraphs": [
            "Not every season of aloneness is the same. When prophetic sight separates you from familiar applause, the enemy tempts you toward wounded withdrawal, suspicion, or spiritual pride. Yet the Holy Spirit invites you into something altogether different: consecrated solitude where your ear is tuned to the Father's whisper without bitterness toward people.",
            "Look at Jesus in Luke 5:16, withdrawing into quiet places to pray before returning in compassion to heal multitudes. Solitude with God softens the heart; carnal isolation hardens it. Joseph could weep with genuine love over the very brothers who envied him because his quiet years were spent in God's presence rather than nursing resentment.",
        ],
        "diagram_kind": "contrast",
        "diagram_nodes": [
            (
                "CARNAL BITTER ISOLATION",
                [
                    "Rehearses offenses and despises people who did not understand your dream",
                    "Breeds spiritual elitism ('nobody sees like I see')",
                    "Cuts off godly counsel, fellowship, and pastoral accountability",
                ],
                False,
            ),
            (
                "SACRED PROPHETIC SOLITUDE",
                [
                    "Anchors identity in the Father's love rather than human applause (Luke 2:19)",
                    "Keeps a tender, forgiving spirit toward critics and family",
                    "Guards confidential revelation in prayer until God's appointed hour",
                ],
                True,
            ),
        ],
        "reflection_title": "HEART CHECK FOR EMERGING SEERS",
        "reflection_points": [
            "<b>1. Guarding Speech & Spirit:</b> Has misunderstanding ever made you defensive or eager to prove you heard God? Bring every misunderstood word to the Lord in quiet prayer and release the need for human vindication.",
            "<b>2. Fellowship Balance:</b> Stay planted in humble church fellowship under spiritual covering while cultivating deep personal stillness before Scripture.",
        ],
    },
    "L3_DEEP": {
        "kicker": "LESSON 03  •  IN DEPTH",
        "title": "HOW THE WORD REFINES THE MESSENGER",
        "paragraphs": [
            "Psalm 105:19 gives one of the most illuminating verses in the entire Old Testament: 'Until the time that his word came to pass, the word of the LORD tested him.' Notice that the prophetic promise itself acted like a silversmith's fire. Every contradiction between Joseph's chains and Joseph's dream forced a deeper decision: Will I trust God's character when my surroundings look like the exact opposite of what He spoke?",
            "In Scripture, pits and prisons do not cancel God's covenant; they purify our motives. Like gold tried seven times in a furnace, faith that survives Dothan's cistern and Egypt's dungeon emerges unshakable, humble, and anchored in God Himself rather than comfort.",
        ],
        "diagram_kind": "bridge",
        "diagram_nodes": [
            ("PROMISE", "God Speaks", "Heaven imparts a living word of future purpose and redemption."),
            ("CONTRADICTION", "The Pit Season", "Circumstances appear to move backward instead of forward."),
            ("PURIFICATION", "Motives Refined", "Selfish ambition burns away; pure trust in God remains (Job 23:10)."),
            ("VINDICATION", "Gold Emerges", "The messenger carries proven spiritual authority in God's hour."),
        ],
        "reflection_title": "WALKING FAITHFULLY THROUGH HARD SEASONS",
        "reflection_points": [
            "<b>1. Separate Pain from Rejection:</b> A difficult season is never proof that God forgot His word. Four times in Genesis 39 Scripture testifies: 'The LORD was with Joseph' right inside servitude and prison.",
            "<b>2. Steward Today's Assignment:</b> Serve with excellence right where you stand today, trusting heaven with tomorrow's open door.",
        ],
    },
    "L4_DEEP": {
        "kicker": "LESSON 04  •  IN DEPTH",
        "title": "THE ARCHITECTURE OF HIDDEN INTEGRITY",
        "paragraphs": [
            "Like a cedar of Lebanon whose underground root system stretches deeper than its visible branches, a prophet's public longevity is determined entirely below the waterline of human sight. In Potiphar's house, nobody from Jacob's tent was watching Joseph. There were no elders, no peers, and no applause. Yet Joseph refused compromise immediately because he lived consciously before the eyes of God: 'How then can I do this great wickedness, and sin against God?' (Genesis 39:9).",
            "Charisma can open a room overnight, but only holiness keeps a vessel trustworthy across decades. Every private 'no' to temptation in your youth builds spiritual granite for the future responsibilities God plans to place in your hands.",
        ],
        "diagram_kind": "roots",
        "diagram_nodes": [
            (
                "VISIBLE PUBLIC MINISTRY (ABOVE THE SURFACE)",
                "Accurate counsel, trusted leadership, spiritual weight before leaders, and lasting fruitfulness that blesses communities without scandal.",
            ),
            (
                "UNSEEN PRIVATE INTEGRITY (BELOW THE SURFACE)",
                "Fear of the Lord behind closed doors, purity of eyes and heart, financial honesty, truthfulness in speech, and instant obedience when nobody sees (Psalm 24:3 to 4).",
            ),
        ],
        "reflection_title": "CONSECRATING THE SECRET ALTAR",
        "reflection_points": [
            "<b>1. Daily Integrity Audit:</b> Are your private habits on your phone, in your finances, and in your speech aligned with the future calling you are praying for?",
            "<b>2. Prayer of Psalm 139:23 to 24:</b> 'Search me, O God, and know my heart; try me, and know my anxieties; and see if there is any wicked way in me, and lead me in the way everlasting.'",
        ],
    },
    "L5_DEEP": {
        "kicker": "LESSON 05  •  IN DEPTH",
        "title": "WHY GOD BUILDS GOVERNMENT IN OBSCURITY",
        "paragraphs": [
            "Two full years passed after Joseph interpreted the chief butler's dream (Genesis 41:1). To human impatience, those twenty four months look like an unnecessary delay. Yet in God's economy, prison administration was graduate school for national governance. Managing royal detainees under the prison keeper taught Joseph logistics, discernment of people, emotional steadiness, and servant leadership.",
            "God never rushes the foundation of a tall building. When Pharaoh finally summoned Joseph, there was no panic, no self pity, and no flattery in him. Deep delay had forged deep capacity so he could step from dungeon shadows into national responsibility in a single morning.",
        ],
        "diagram_kind": "roots",
        "diagram_nodes": [
            (
                "GOVERNMENTAL CAPACITY IN PHARAOH'S COURT",
                "Calmness before kings, fourteen year economic foresight, national grain logistics, and unshakeable emotional poise under pressure (Genesis 41).",
            ),
            (
                "HIDDEN TRAINING IN POTIPHAR'S HOUSE & PRISON",
                "Faithful administration of another man's estate, compassionate care for fellow prisoners, unbroken patience through two silent years, and total dependence on God.",
            ),
        ],
        "reflection_title": "EMBRACING TRAINING IN HIDDEN SEASONS",
        "reflection_points": [
            "<b>1. Practical Skills Alongside Prayer:</b> Like Joseph learning administration and language in Egypt, sharpen your communication, planning, and stewardship skills alongside your prayer life.",
            "<b>2. Patience Under Delay:</b> Trust Isaiah 37:31: seasons that take root downward are preparing abundant fruit upward.",
        ],
    },
    "L6_DEEP": {
        "kicker": "LESSON 06  •  IN DEPTH",
        "title": "MARRYING PURE REVELATION TO WISDOM",
        "paragraphs": [
            "One of the greatest dangers in prophetic ministry is confusing raw revelation with wise application. In Acts 21:4, disciples accurately sensed through the Spirit that Paul would face chains in Jerusalem and urged him not to go, yet Paul knew God's appointed timing required him to go! Accurate sight still requires heavenly wisdom to know what to say, when to act, and how to build.",
            "In Genesis 41, Joseph modeled both wings of mature prophetic ministry: first, crystal clear interpretation ('seven years of plenty followed by seven years of famine', verses 25 to 32), and second, Spirit breathed strategic counsel ('appoint overseers and store one fifth of the harvest in every city', verses 33 to 36). Revelation diagnoses; wisdom builds.",
        ],
        "diagram_kind": "contrast",
        "diagram_nodes": [
            (
                "WING 01: PURE REVELATION (WHAT GOD SHOWS)",
                [
                    "Discerns spiritual reality and upcoming seasons accurately",
                    "Gives all credit to God alone without ego (Genesis 41:16)",
                    "Never adds human exaggeration to what heaven actually showed",
                ],
                True,
            ),
            (
                "WING 02: PRACTICAL WISDOM (HOW WE STEWARD)",
                [
                    "Translates spiritual insight into orderly, redemptive action (Gen 41:33)",
                    "Protects people from fear and builds practical solutions",
                    "Honors timing, counsel, and accountable leadership (Prov 24:3)",
                ],
                True,
            ),
        ],
        "reflection_title": "PRACTICING WISE PROPHETIC STEWARDSHIP",
        "reflection_points": [
            "<b>1. Two Part Question in Prayer:</b> Whenever God shows you a burden or insight, pause and ask: (a) 'Lord, what does this mean?' and (b) 'Lord, am I meant to pray silently, seek counsel, or offer a constructive solution?'",
            "<b>2. Edification Standard:</b> Measure every spoken word by 1 Corinthians 14:3: edification, exhortation, and comfort.",
        ],
    },
    "L7_DEEP": {
        "kicker": "LESSON 07  •  IN DEPTH",
        "title": "FROM ONE DREAMER TO MANY NATIONS",
        "paragraphs": [
            "In our youth, spiritual gifts can easily feel centered around personal destiny: my calling, my anointing, my vindication. By Genesis 45 and Genesis 50, Joseph stood completely healed of self centeredness. Looking into the eyes of the brothers who sold him, he declared twice: 'God sent me before you to preserve life... to save your lives by a great deliverance' (Genesis 45:5, 7).",
            "God's prophetic gifts are always given as bread for hungry multitudes, never as a crown for human pride. Joseph's obedience preserved Egypt from starvation, reconciled Jacob's fractured household, and protected the covenant lineage through which Jesus Christ the Messiah entered the world.",
        ],
        "diagram_kind": "ripples",
        "diagram_nodes": [
            ("INNER RING (PERSONAL HEALING)", "Forgiveness replaces trauma; Manasseh and Ephraim testify that God turns pain into fruitfulness."),
            ("MIDDLE RING (FAMILY & CHURCH)", "Fractured brothers are restored around one table in Goshen without vengeance (Genesis 45)."),
            ("OUTER RING (NATIONS & HISTORY)", "Multitudes are fed in famine and the Messianic promise is preserved for all generations (Gen 50:20)."),
        ],
        "reflection_title": "LIVING FOR GENERATIONAL FRUITFULNESS",
        "reflection_points": [
            "<b>1. Release Every Debt:</b> Unforgiveness narrows prophetic sight; forgiveness unlocks generational authority. Release every person who misunderstood or wounded your journey.",
            "<b>2. Servant Heart:</b> Ask the Lord daily: 'Who did You design my gift to feed, strengthen, and preserve?'",
        ],
    },
    "P27_WATCHMAN": {
        "kicker": "PRACTICAL APPENDIX  •  DAILY WALK",
        "title": "THE EMERGING SEER'S DAILY RHYTHM",
        "paragraphs": [
            "Prophetic maturity is built through quiet, faithful habits practiced week after week in Scripture, prayer, local church accountability, and humble service. Use this four part daily rhythm to steward what God shows you with sobriety, purity, and scriptural balance.",
        ],
        "diagram_kind": "bridge",
        "diagram_nodes": [
            ("01 SCRIPTURE", "Daily Word", "Test every dream and impression by the written Word of God first."),
            ("02 JOURNAL", "Record Clearly", "Write date, exact imagery, Scripture echoes, and prayer points humbly."),
            ("03 COVERING", "Submit Wisely", "Walk in local church fellowship and mature pastoral accountability."),
            ("04 SERVICE", "Obey Today", "Practice integrity, kindness, and excellence in daily work and family."),
        ],
        "reflection_title": "SEVEN POINT CONSECRATION COVENANT",
        "reflection_points": [
            "<b>• Word Over Sensation:</b> Scripture is my final authority above every dream, vision, or feeling (2 Peter 1:19).",
            "<b>• Character Over Platform:</b> I choose hidden holiness in Potiphar's house over premature applause.",
            "<b>• Love Over Pride:</b> Every gift from heaven will be stewarded in humility to serve Christ's body and preserve many lives.",
        ],
    },
}
