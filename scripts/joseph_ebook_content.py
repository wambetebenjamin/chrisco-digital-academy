#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Complete 20-page curated content for:
'Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn'
Brand: CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES
"""

import os
from ebook_engine import ROYAL_MID, CORAL_ACCENT, CREAM_TEXT

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "joseph_ebook_assets", "images")


def IMG(name: str) -> str:
    return os.path.join(ASSETS, name)


# ---------------------------------------------------------------------------
# PAGE 1: COVER
# ---------------------------------------------------------------------------
PAGE_01_COVER = {
    "brand_name": "CHRISCO Youth Aflame",
    "brand_umbrella": "UNDER CHRISCO FELLOWSHIP OF CHURCHES",
    "photo": IMG("cover_regal_leader.jpg"),
    "photo_focus": (0.35, 0.22),
    "title_lines": [
        ("JOSEPH:", CORAL_ACCENT, 50.0),
        ("7 LESSONS", CREAM_TEXT, 48.0),
        ("FOR SEERS", CORAL_ACCENT, 48.0),
    ],
    "kicker_inside": "EVERY EMERGING SEER PROPHET MUST LEARN",
    "pill_text": "SEER EDITION",
    "subtitle_html": (
        "<b>CHRISCO Youth Aflame</b><br/>"
        "Under <b>CHRISCO FELLOWSHIP OF CHURCHES</b><br/>"
        "A Scripture anchored prophetic study on dreams, process, hidden integrity, "
        "and appointed fulfillment."
    ),
}

# ---------------------------------------------------------------------------
# PAGE 2: TABLE OF CONTENTS
# ---------------------------------------------------------------------------
PAGE_02_TOC = {
    "entries": [
        ("01", "After The Dream", "Prologue & The Four Chambers", "p. 03"),
        ("02", "Lesson 1: Sight Before Capacity", "Destination Revealed Before Maturity", "p. 05"),
        ("03", "Lesson 2: Solitude of Sight", "When Revelation Separates Before It Establishes", "p. 07"),
        ("04", "Lesson 3: Faithful in the Pit", "Why Painful Process Is Not Abandonment", "p. 09"),
        ("05", "Lesson 4: Private Integrity", "Hidden Restraint Protecting Public Destiny", "p. 11"),
        ("06", "Lesson 5: Forged for Government", "How Delay Constructs the Prophetic Vessel", "p. 13"),
        ("07", "Lesson 6: Revelation & Wisdom", "Joining Spiritual Sight to Strategy", "p. 15"),
        ("08", "Lesson 7: Preserved for Many", "Why the Dream Extends Beyond Yourself", "p. 17"),
        ("09", "The Dream Survives", "Benediction & CHRISCO Youth Aflame", "p. 19"),
    ]
}

# ---------------------------------------------------------------------------
# PAGE 3: PROLOGUE (PART I)
# ---------------------------------------------------------------------------
PAGE_03_PROLOGUE = {
    "badge_text": "01",
    "title_lines": [
        ("AFTER THE", ROYAL_MID),
        ("DREAM", ROYAL_MID),
        ("BEGINS", CORAL_ACCENT),
    ],
    "photo": IMG("prologue_upward_joy.jpg"),
    "photo_focus": (0.48, 0.30),
    "spotlight_html": [
        '<b>"Until the time that his word came to pass, the word of the LORD tested him."</b> <i>(Psalm 105:19)</i>',
        '"It is doubtful whether God can bless a man greatly until He has hurt him deeply." <b>(A.W. Tozer)</b>',
    ],
    "left_col": [
        "<b>Most prophetic people love Joseph because of the dreams.</b> Yet when we read Genesis 37 through 50 carefully, we discover a sobering mystery: Joseph's deepest lessons were not found inside the dream. They were found in what happened <i>after</i> the dream.",
        "That is where many emerging seer prophets quietly struggle. Dreams feel electric. Open visions feel weighty. Night encounters and sudden knowings feel undeniably powerful. Yet the real prophetic journey rarely begins in the moment heaven speaks; it begins the morning after heaven speaks, when ordinary life suddenly stops making sense.",
        "Joseph stands as one of Scripture's clearest prophetic blueprints because he shows us what happens when God reveals something unmistakably real, and then intentionally permits time, pressure, betrayal, and hidden process to forge the messenger before fulfilling the message.",
    ],
    "right_col": [
        "In Hebrew, a seer (<i>ro'eh</i> or <i>chozeh</i>) is one given spiritual perception to behold what God is framing before it appears in history. At seventeen, Joseph saw sheaves bowing and stars aligning (<i>Genesis 37:7 to 9</i>). His sight was accurate, yet his soul was still unseasoned.",
        'Psalm 105:17 to 19 pulls back the curtain behind his pain: <i>"He sent a man before them, Joseph, who was sold as a slave. They hurt his feet with fetters, he was laid in irons. Until the time that his word came to pass, the word of the LORD tested him."</i> Notice that! The prophetic word itself became the furnace that refined him.',
        "Across these pages from <b>CHRISCO Youth Aflame</b> under <b>CHRISCO FELLOWSHIP OF CHURCHES</b>, we walk through seven foundational lessons every emerging seer prophet must learn from Joseph so your gift does not outrun your character and your faith does not faint in the pit.",
    ],
}

# ---------------------------------------------------------------------------
# PAGE 4: PROLOGUE (PART II)
# ---------------------------------------------------------------------------
PAGE_04_CHAMBERS = {
    "title_big": "THE FOUR",
    "title_sub": "CHAMBERS",
    "stages": [
        {
            "photo": IMG("chamber1_blue_coat.jpg"),
            "focus": (0.5, 0.22),
            "html": (
                "<b>1. Hebron: The Coat &amp; Sight</b><br/>"
                "<i>Genesis 37:3 to 11 (Age 17)</i><br/>"
                "Favored by his father and awakened by night dreams, Joseph receives genuine "
                "revelation without yet possessing relational wisdom or governmental maturity."
            ),
        },
        {
            "photo": IMG("chamber2_golden_light.jpg"),
            "focus": (0.5, 0.25),
            "html": (
                "<b>2. Dothan: The Empty Pit</b><br/>"
                "<i>Genesis 37:23 to 28</i><br/>"
                "Stripped of his robe and cast into a waterless cistern by envious brothers. "
                "External badges of favor are removed so only the living word of God remains."
            ),
        },
        {
            "photo": IMG("lesson4_private_word.jpg"),
            "focus": (0.5, 0.25),
            "html": (
                "<b>3. House &amp; Dungeon: Restraint</b><br/>"
                "<i>Genesis 39:1 to 40:23</i><br/>"
                "Serving Potiphar in purity and stewarding prisoners in chains. Hidden holiness "
                "and quiet administration build an unshakable internal throne."
            ),
        },
        {
            "photo": IMG("lesson6_executive_suit.jpg"),
            "focus": (0.5, 0.20),
            "html": (
                "<b>4. Palace: Signet &amp; Granaries</b><br/>"
                "<i>Genesis 41:38 to 45:8 (Age 30+)</i><br/>"
                "Summoned in a single hour before Pharaoh, revelation marries governmental "
                "strategy to preserve nations and heal the very family that sold him."
            ),
        },
    ],
}

# ---------------------------------------------------------------------------
# PAGE 5: LESSON 01 (PART I)
# ---------------------------------------------------------------------------
PAGE_05_LESSON1A = {
    "sidebar_top_label_1": "Lesson",
    "sidebar_top_label_2": "Number",
    "badge_number": "01",
    "photo": IMG("lesson1_vision_classroom.jpg"),
    "photo_focus": (0.56, 0.28),
    "sidebar_items": [
        (
            "Core Thesis",
            "God may show you something long before you are ready to carry it.",
        ),
        (
            "Anchor Texts",
            "<i>Genesis 37:5 to 9</i><br/><i>Habakkuk 2:2 to 3</i><br/><i>Isaiah 46:10</i>",
        ),
        (
            "Prophetic Span",
            "Thirteen years stood between Joseph's teenage dream in Hebron and Pharaoh's signet ring.",
        ),
        (
            "Seer Maxim",
            '"Sight awakens hunger; vision introduces the classroom."',
        ),
    ],
    "card_title_lines": [
        ("SIGHT BEFORE", CREAM_TEXT),
        ("CAPACITY", CORAL_ACCENT),
    ],
    "card_paragraphs": [
        "<b>Joseph saw rulership early. The dream was real. The timing was not.</b> God often reveals destination before capacity, not to frustrate you and never to mock your present smallness, but because spiritual sight awakens holy hunger and the vision itself introduces the process.",
        "Many emerging seers receive genuine revelation from the Holy Spirit and immediately assume manifestation must happen next week. Because a vision appears complete in the spirit, the young prophet mistakes <i>clarity</i> for <i>immediacy</i>. David was anointed king in Bethlehem while still smelling of sheepfolds (<i>1 Samuel 16:13</i>), yet years of caves preceded Hebron's crown.",
        'Joseph teaches otherwise: <b>the dream came early; the maturity came later; and the distance between those two became the classroom.</b> As Isaiah 46:10 declares, God reveals <i>"the end from the beginning."</i> He shows the harvest first so you will endure the plowing.',
    ],
}

# ---------------------------------------------------------------------------
# PAGE 6: LESSON 01 (PART II)
# ---------------------------------------------------------------------------
PAGE_06_LESSON1B = {
    "title_lines": [
        ("VISION,", ROYAL_MID),
        ("HUNGER &", ROYAL_MID),
        ("MATURITY", CORAL_ACCENT),
    ],
    "top_left_notes": [
        "<b>Why Heaven Reveals Early:</b> If God waited until you felt qualified to show you His purpose, fear and ordinariness would shrink your appetite. Revelation stretches the wineskin of expectation before grace fills it.",
        '<i>"Write the vision and make it plain on tablets... For the vision is yet for an appointed time (moed); though it tarries, wait for it; because it will surely come."</i> <b>(Habakkuk 2:2 to 3)</b>',
    ],
    "blue_panel_heading": "Voices of Wisdom",
    "blue_panel_items": [
        '"God never hurries. There are no deadlines against which He must work. Only to know this is to quiet our spirits and relax our nerves."<br/><b>A.W. Tozer</b>',
        '"God\'s training is for now, not presently. His purpose is for this minute, not for something in the future."<br/><b>Oswald Chambers</b>',
        '"Premature platform is the cruelest judgment a gifted youth can suffer; hidden preparation is the Father\'s mercy."<br/><b>Watchman Nee</b> (paraphrased)',
    ],
    "coral_head_1": "WORD ANCHOR",
    "coral_body_1": [
        '<i>"There we were, binding sheaves in the field. Then behold, my sheaf arose and also stood upright; and indeed your sheaves stood all around and bowed down to my sheaf."</i> <b>(Genesis 37:7)</b>',
        '<i>"Also it is not good for a soul to be without knowledge, and he who hastens with his feet misses the way."</i> <b>(Proverbs 19:2)</b>',
    ],
    "coral_head_2": "SEER FORMATION",
    "coral_body_2": [
        "When heaven shows you future authority, do not rush to announce a title. Record the revelation prayerfully, ask the Lord what virtues that future weight requires, and enroll willingly in today's humble assignments (<i>Luke 16:10</i>).",
    ],
    "photo": IMG("lesson1_journaling.jpg"),
    "photo_focus": (0.45, 0.30),
}

# ---------------------------------------------------------------------------
# PAGE 7: LESSON 02 (PART I)
# ---------------------------------------------------------------------------
PAGE_07_LESSON2A = {
    "pillars": [
        "<b>1. Discern Who Can Carry Your Dream</b><br/><i>Genesis 37:5, 9</i>",
        "<b>2. Guard Quietness of Heart</b><br/><i>Luke 2:19</i>",
        "<b>3. Refuse Offense Toward Critics</b><br/><i>Proverbs 19:11</i>",
        "<b>4. Let Solitude Deepen Prayer</b><br/><i>Jeremiah 15:17</i>",
        "<b>5. Anchor Identity in the Father</b><br/><i>Psalm 27:10</i>",
    ],
    "photo": IMG("lesson2_sunlit_solitude.jpg"),
    "photo_focus": (0.48, 0.25),
    "title_lines": [
        ("LESSON 02:", ROYAL_MID),
        ("SOLITUDE", CORAL_ACCENT),
    ],
    "body_paragraphs": [
        '<b>Revelation can isolate you before it establishes you.</b> Joseph\'s dreams immediately created tension around him. Scripture notes twice that his brothers <i>"hated him even more for his dreams and for his words"</i> (<i>Genesis 37:8</i>), while even his father Jacob rebuked him publicly before silently keeping the matter in mind (<i>Genesis 37:10 to 11</i>).',
        "The very thing God showed him became the thing others misunderstood. As an emerging seer, you begin seeing clearly, sensing atmospheres deeply, and perceiving spiritual realities that those around you do not yet discern. Suddenly, what feels completely natural to your spirit feels strange, threatening, or presumptuous to everyone else.",
        "Sometimes spiritual sight itself creates separation before it creates validation. Do not panic when familiar circles stop applauding. God intentionally uses seasons of misunderstanding to wean the prophet off human approval and root your confidence wholly in Him.",
    ],
}

# ---------------------------------------------------------------------------
# PAGE 8: LESSON 02 (PART II)
# ---------------------------------------------------------------------------
PAGE_08_LESSON2B = {
    "banner_lines": [
        ("WHEN SIGHT", CREAM_TEXT),
        ("SEPARATES", CREAM_TEXT),
    ],
    "photo": IMG("lesson2_contemplation.jpg"),
    "photo_focus": (0.5, 0.25),
    "points_html": [
        '<b>The Nickname of Mockery</b><br/>In Genesis 37:19, his brothers sneered: <i>"Look, this dreamer (master of dreams) is coming!"</i> Cynicism often mocks prophetic sight right before God sets destiny in motion.',
        '<b>Not Every Ear Is an Altar</b><br/>Young Samuel ministered under Eli when <i>"the word of the LORD was rare"</i> (<i>1 Samuel 3:1</i>). Mary <i>"kept all these things and pondered them in her heart"</i> (<i>Luke 2:19</i>). Learn what to pray into and what to keep sealed.',
        '<b>Sanctified Consecration</b><br/>Jeremiah confessed: <i>"I did not sit in the assembly of the mockers, nor did I rejoice; I sat alone because of Your hand"</i> (<i>Jeremiah 15:17</i>). Solitude with God is never rejection; it is consecration.',
        "<b>Refusing Prophetic Elitism</b><br/>Isolation can either make a seer bitter and proud, or tender and prayerful. Never despise those who cannot yet see; you are being separated <i>from</i> them today so you can serve them tomorrow.",
        '<b>Ravenhill\'s Charge</b><br/><i>"Other men may, you cannot... A prophet is forged in lonely places where only the voice of God keeps him company."</i> <b>(Leonard Ravenhill)</b>',
    ],
}

# ---------------------------------------------------------------------------
# PAGE 9: LESSON 03 (PART I)
# ---------------------------------------------------------------------------
PAGE_09_LESSON3A = {
    "badge_text": "03",
    "title_lines": [
        ("LESSON 03:", ROYAL_MID),
        ("FAITHFUL IN", ROYAL_MID),
        ("THE PIT", CORAL_ACCENT),
    ],
    "photo": IMG("lesson3_sanctuary_surrender.jpg"),
    "photo_focus": (0.5, 0.25),
    "spotlight_html": [
        '<b>"The LORD was with Joseph, and he was a successful man... in the house of his master the Egyptian."</b> <i>(Genesis 39:2)</i>',
        '"I have learned to kiss the wave that throws me against the Rock of Ages." <b>(Charles H. Spurgeon)</b>',
    ],
    "left_col": [
        "<b>Not every painful season means you missed God.</b> Look closely at Genesis 37:13 to 17: Jacob sent Joseph to check on his brothers at Shechem. When Joseph could not find them, he did not turn back; he pressed on another fourteen miles to Dothan in pure filial obedience. And what met his obedience? He was stripped, thrown into a pit, sold for twenty shekels of silver, enslaved, falsely accused, and imprisoned.",
        'Many prophetic people wrongly assume that sudden warfare, closed doors, or painful detours prove they took a wrong turn or misheard heaven. Adversity triggers false guilt in the unseasoned seer: <i>"Did I imagine the word? Has God forsaken me?"</i>',
    ],
    "right_col": [
        '<b>Joseph proves something liberating: you can be squarely inside the center of God\'s will and still walk through dark, confusing valleys.</b> Process is never proof of divine abandonment. Four times in Genesis 39 (verses 2, 3, 21, and 23), while Joseph was a bought slave and then a framed prisoner, the Holy Spirit repeated one thunderous refrain: <i>"The LORD was with Joseph!"</i>',
        'Peter echoes this law of the Kingdom: <i>"Beloved, do not think it strange concerning the fiery trial which is to try you, as though some strange thing happened to you"</i> (<i>1 Peter 4:12</i>). Sometimes the pit is not a detour away from the promise; it is the exact vehicle carrying you toward Egypt.',
    ],
}

# ---------------------------------------------------------------------------
# PAGE 10: LESSON 03 (PART II)
# ---------------------------------------------------------------------------
PAGE_10_LESSON3B = {
    "photo": IMG("lesson3_bible_hands.jpg"),
    "photo_focus": (0.5, 0.45),
    "coral_title_lines": [
        ("TESTED BY", CREAM_TEXT),
        ("THE WORD", CREAM_TEXT),
    ],
    "coral_epigraph": '"But He knows the way that I take; when He has tested me, I shall come forth as gold." (Job 23:10)',
    "icon_items": [
        {
            "icon": "eye",
            "html": '<b>Presence in the Pit</b><br/><i>Acts 7:9 to 10:</i> "The patriarchs, becoming envious, sold Joseph into Egypt. But God was with him."',
        },
        {
            "icon": "shield",
            "html": "<b>Pressed, Never Crushed</b><br/><i>2 Corinthians 4:8 to 9:</i> Hard pressed on every side, perplexed, yet never forsaken by the Author of vision.",
        },
        {
            "icon": "book",
            "html": "<b>The Word Refines</b><br/><i>Psalm 105:19:</i> Heaven's promise tests every competing motive until pure faith remains.",
        },
        {
            "icon": "growth",
            "html": "<b>Endurance Perfected</b><br/><i>James 1:2 to 4:</i> Patience must finish its work so the seer becomes mature and lacking nothing.",
        },
        {
            "icon": "compass",
            "html": "<b>Sovereign Geography</b><br/><i>Romans 8:28:</i> Ishmaelite caravans meant for ruin became God's paid transport into destiny.",
        },
        {
            "icon": "crown",
            "html": '<b>Tozer\'s Certainty</b><br/>"When I understand that everything happening to me is to make me more Christlike, anxiety dissolves."',
        },
    ],
}

# ---------------------------------------------------------------------------
# PAGE 11: LESSON 04 (PART I)
# ---------------------------------------------------------------------------
PAGE_11_LESSON4A = {
    "sidebar_top_label_1": "Lesson",
    "sidebar_top_label_2": "Number",
    "badge_number": "04",
    "photo": IMG("lesson4_private_word.jpg"),
    "photo_focus": (0.5, 0.25),
    "sidebar_items": [
        (
            "Core Thesis",
            "Your private integrity protects your prophetic future.",
        ),
        (
            "Anchor Texts",
            "<i>Genesis 39:7 to 12</i><br/><i>Psalm 24:3 to 4</i><br/><i>Luke 16:10</i>",
        ),
        (
            "Testing Arena",
            "Potiphar's house, far from Hebron, unseen by family, pressured daily.",
        ),
        (
            "Warning",
            "Prophetic gifting without consecrated character engineers its own collapse.",
        ),
    ],
    "card_title_lines": [
        ("PRIVATE", CREAM_TEXT),
        ("INTEGRITY", CORAL_ACCENT),
    ],
    "card_paragraphs": [
        "<b>Before Joseph governed a nation, he governed himself.</b> Before public authority came private restraint. Before national influence came internal discipline. Potiphar's house mattered every bit as much as Pharaoh's palace, because if Joseph had fallen in Potiphar's bedroom, he would never have stood before Pharaoh's throne.",
        'Day after day, far from his father\'s eyes in a foreign culture where nobody from Canaan would ever find out, Potiphar\'s wife pressed him. Listen to the anchor of Joseph\'s refusal in <i>Genesis 39:9</i>: <b>"How then can I do this great wickedness, and sin against God?"</b> Notice his vertical consciousness! Integrity is living before the audience of One when every human eye is absent.',
        "Scripture warns us through Balaam (<i>Numbers 22</i>) and Samson (<i>Judges 16</i>): men can possess breathtaking spiritual sight and supernatural gifting while rotting inwardly. Joseph understood that hidden decisions shape visible destiny, and the unseen inner life determines what heaven can safely entrust to you later.",
    ],
}

# ---------------------------------------------------------------------------
# PAGE 12: LESSON 04 (PART II)
# ---------------------------------------------------------------------------
PAGE_12_LESSON4B = {
    "title_lines": [
        ("HIDDEN", ROYAL_MID),
        ("LIFE &", ROYAL_MID),
        ("DESTINY", CORAL_ACCENT),
    ],
    "top_left_notes": [
        "<b>Losing Your Coat to Keep Your Calling:</b> Twice Joseph lost a garment: in Dothan to envy, and in Potiphar's house to purity (<i>Genesis 39:12</i>). Better to lose status, comfort, and reputation than to stain the garment of your conscience.",
        '<i>"Who may ascend into the hill of the LORD? He who has clean hands and a pure heart."</i> <b>(Psalm 24:3 to 4)</b>',
    ],
    "blue_panel_heading": "Watchmen's Counsel",
    "blue_panel_items": [
        '"What a man is on his knees before God, that he is, and no more."<br/><b>Robert Murray M\'Cheyne</b>',
        '"Men are God\'s method. The Church is looking for better methods; God is looking for better men, men of holy character."<br/><b>E.M. Bounds</b>',
        '"Character is not forged in crisis; crisis merely exposes what secret habits have silently built for years."<br/><b>St. John Chrysostom</b> (adapted)',
    ],
    "coral_head_1": "WORD ANCHOR",
    "coral_body_1": [
        '<i>"He who is faithful in what is least is faithful also in much; and he who is unjust in what is least is unjust also in much."</i> <b>(Luke 16:10)</b>',
        '<i>"Keep your heart with all diligence, for out of it spring the issues of life."</i> <b>(Proverbs 4:23)</b>',
    ],
    "coral_head_2": "THE SECRET ALTAR",
    "coral_body_2": [
        "Guard your eyes, your finances, your tongue, and your motives behind closed doors. If you cleanse yourself as a vessel of honor (<i>2 Timothy 2:21</i>), no false accusation can cancel heaven's appointment.",
    ],
    "photo": IMG("lesson4_serene_prayer.jpg"),
    "photo_focus": (0.5, 0.25),
}

# ---------------------------------------------------------------------------
# PAGE 13: LESSON 05 (PART I)
# ---------------------------------------------------------------------------
PAGE_13_LESSON5A = {
    "pillars": [
        "<b>1. Administrative Order</b><br/><i>Genesis 39:22 to 23</i>",
        "<b>2. Unbroken Endurance</b><br/><i>Hebrews 10:36</i>",
        "<b>3. Emotional Stability</b><br/><i>Proverbs 16:32</i>",
        "<b>4. Servant Attentiveness</b><br/><i>Genesis 40:6 to 7</i>",
        "<b>5. Surrendered Timing</b><br/><i>Genesis 41:1</i>",
    ],
    "photo": IMG("lesson5_statesman_vest.jpg"),
    "photo_focus": (0.5, 0.20),
    "title_lines": [
        ("LESSON 05:", ROYAL_MID),
        ("GOVERNMENT", CORAL_ACCENT),
    ],
    "body_paragraphs": [
        "<b>Delay is often building government.</b> Joseph was not simply waiting in the king's prison; he was <i>becoming</i>. To natural eyes, the dungeon looked like wasted youth and stalled promise. Yet beneath the surface, heaven was constructing administration, endurance, restraint, wisdom, and emotional stability.",
        'Notice what happened even after Joseph accurately interpreted the chief butler\'s dream and pleaded to be remembered: <i>"Yet the chief butler did not remember Joseph, but forgot him. Then it came to pass, at the end of two full years, that Pharaoh had a dream"</i> (<i>Genesis 40:23 to 41:1</i>). Two additional silent years!',
        "Your season may feel far slower than expected, <b>but slow does not mean stagnant.</b> Delay carries deep structural engineering. God is never merely preparing the promise; He is preparing the governmental vessel strong enough to carry it without breaking.",
    ],
}

# ---------------------------------------------------------------------------
# PAGE 14: LESSON 05 (PART II)
# ---------------------------------------------------------------------------
PAGE_14_LESSON5B = {
    "banner_lines": [
        ("DELAY BUILDS", CREAM_TEXT),
        ("CAPACITY", CREAM_TEXT),
    ],
    "photo": IMG("lesson5_diligent_steward.jpg"),
    "photo_focus": (0.5, 0.25),
    "points_html": [
        '<b>Stewarding Royal Prisoners</b><br/>Joseph was placed in the <i>"place where the king\'s prisoners were confined"</i> (<i>Genesis 39:20</i>). Under the Cupbearer and Baker, he learned Egyptian court protocol, economics, and statecraft before ever entering the palace!',
        '<b>Compassion Under Chains</b><br/>In <i>Genesis 40:6 to 7</i>, Joseph noticed two fellow prisoners looked sad and asked, <i>"Why do you look so sad today?"</i> Mature prophets still see others\' pain while carrying their own.',
        '<b>Rule Over Your Own Spirit</b><br/><i>Proverbs 16:32</i> declares: <i>"He who is slow to anger is better than the mighty, and he who rules his spirit than he who takes a city."</i> Internal government precedes national government.',
        '<b>Roots Before Branches</b><br/><i>Isaiah 37:31</i> promises that the remnant shall <i>"take root downward, and bear fruit upward."</i> Deep winters drive roots down to underground rivers.',
        '<b>Austin Sparks\' Insight</b><br/><i>"God is much more concerned with the worker than with the work; when the vessel is formed, the work flows effortlessly."</i> <b>(T. Austin Sparks)</b>',
    ],
}

# ---------------------------------------------------------------------------
# PAGE 15: LESSON 06 (PART I)
# ---------------------------------------------------------------------------
PAGE_15_LESSON6A = {
    "badge_text": "06",
    "title_lines": [
        ("LESSON 06:", ROYAL_MID),
        ("REVELATION", ROYAL_MID),
        ("& WISDOM", CORAL_ACCENT),
    ],
    "photo": IMG("lesson6_strategic_council.jpg"),
    "photo_focus": (0.5, 0.22),
    "spotlight_html": [
        '<b>"Can we find such a one as this, a man in whom is the Spirit of God?... There is no one as discerning and wise as you."</b> <i>(Genesis 41:38 to 39)</i>',
        '"Knowledge sees the fact; wisdom sees what to do next." <b>(Charles H. Spurgeon)</b>',
    ],
    "left_col": [
        '<b>Interpretation requires both revelation and wisdom.</b> When Joseph stood shaved and freshly clothed before Pharaoh in Genesis 41, he demonstrated the summit of mature prophetic function. First, he gave all glory to God: <i>"It is not in me; God will give Pharaoh an answer of peace"</i> (<i>Genesis 41:16</i>).',
        "Second, he accurately decoded the seven fat and lean cows and the seven full and blighted heads of grain: seven years of unprecedented abundance followed by seven years of consuming famine (<i>Genesis 41:25 to 32</i>). Many emerging seers would have dropped the microphone right at verse 32, thrilled simply to have predicted a famine!",
    ],
    "right_col": [
        "<b>Look at Genesis 41:33 to 36: Joseph did not stop at prediction; he pivoted into governmental wisdom!</b> He laid out a five part national economic blueprint: appoint a discerning overseer, commission regional officers, levy twenty percent of Egypt's harvest during the seven plenteous years, store grain under royal seal in every city, and create a reserve against ruin.",
        'Like the sons of Issachar who <i>"had understanding of the times, to know what Israel ought to do"</i> (<i>1 Chronicles 12:32</i>), mature seers refuse to leave people fearful over raw revelation. <b>Many see. Few steward. Joseph teaches both, and that union of revelation and wisdom saved an empire.</b>',
    ],
}

# ---------------------------------------------------------------------------
# PAGE 16: LESSON 06 (PART II)
# ---------------------------------------------------------------------------
PAGE_16_LESSON6B = {
    "photo": IMG("lesson6_executive_suit.jpg"),
    "photo_focus": (0.5, 0.22),
    "coral_title_lines": [
        ("SEE CLEARLY,", CREAM_TEXT),
        ("STEWARD WELL", CREAM_TEXT),
    ],
    "coral_epigraph": '"It is the glory of God to conceal a matter, but the glory of kings is to search out a matter." (Proverbs 25:2)',
    "icon_items": [
        {
            "icon": "eye",
            "html": "<b>1. Pure Reception</b><br/><i>Genesis 40:8; 41:16:</i> Acknowledge that interpretations belong to God alone, free from ego or flattery.",
        },
        {
            "icon": "book",
            "html": "<b>2. Separate Sight &amp; Meaning</b><br/><i>Acts 21:4, 11 to 14:</i> Never confuse accurate raw revelation with human assumptions about application.",
        },
        {
            "icon": "compass",
            "html": '<b>3. Discern Appointed Seasons</b><br/><i>Ecclesiastes 8:5:</i> "A wise man\'s heart discerns both time and judgment." Timing governs action.',
        },
        {
            "icon": "growth",
            "html": '<b>4. Architect Practical Strategy</b><br/><i>Genesis 41:34 to 36:</i> Ask, "Lord, what concrete stewardship does this revelation require right now?"',
        },
        {
            "icon": "shield",
            "html": "<b>5. Deliver with Peace</b><br/><i>Daniel 2:20 to 22:</i> Even weighty warnings should carry redemptive counsel rather than panic.",
        },
        {
            "icon": "people",
            "html": "<b>6. Build Lasting Granaries</b><br/><i>Proverbs 24:3 to 4:</i> Through wisdom a house is built, and by understanding its chambers are filled.",
        },
    ],
}

# ---------------------------------------------------------------------------
# PAGE 17: LESSON 07 (PART I)
# ---------------------------------------------------------------------------
PAGE_17_LESSON7A = {
    "sidebar_top_label_1": "Lesson",
    "sidebar_top_label_2": "Number",
    "badge_number": "07",
    "photo": IMG("lesson7_community_joy.jpg"),
    "photo_focus": (0.5, 0.25),
    "sidebar_items": [
        (
            "Core Thesis",
            "The dream was never only about Joseph.",
        ),
        (
            "Anchor Texts",
            "<i>Genesis 45:5 to 8</i><br/><i>Genesis 50:20</i><br/><i>1 Peter 4:10</i>",
        ),
        (
            "Redemptive Arc",
            "One teenager's dream preserved Israel's twelve tribes and the Messianic line.",
        ),
        (
            "Heart Test",
            "True maturity forgives betrayers because it sees God's larger tapestry.",
        ),
    ],
    "card_title_lines": [
        ("BEYOND", CREAM_TEXT),
        ("YOURSELF", CORAL_ACCENT),
    ],
    "card_paragraphs": [
        "<b>The dream was never only about Joseph.</b> At seventeen, the dream felt intensely personal: <i>my</i> sheaf standing upright, <i>my</i> elevation, <i>my</i> vindication. Yet when fulfillment arrived twenty two years later as his starving brothers bowed in Egypt, Joseph did not gloat or retaliate. He wept aloud and unveiled heaven's true motive.",
        'Listen to <i>Genesis 45:5, 7</i>: <b>"But now, do not therefore be grieved or angry with yourselves because you sold me here; for God sent me before you to preserve life... to preserve a posterity for you in the earth, and to save your lives by a great deliverance."</b>',
        "Family was healed. Egypt and surrounding nations survived famine. Salvation history, the covenant line leading to Christ, was preserved! God often shows prophetic people visions that feel deeply personal, yet the revelation is preparing them to serve a redemptive purpose infinitely larger than themselves.",
    ],
}

# ---------------------------------------------------------------------------
# PAGE 18: LESSON 07 (PART II)
# ---------------------------------------------------------------------------
PAGE_18_LESSON7B = {
    "title_lines": [
        ("SERVING", ROYAL_MID),
        ("NATIONS &", ROYAL_MID),
        ("HISTORY", CORAL_ACCENT),
    ],
    "top_left_notes": [
        '<b>From Manasseh to Ephraim:</b> Joseph named his sons <i>Manasseh</i> ("God has made me forget all my toil") and <i>Ephraim</i> ("God has caused me to be fruitful in the land of my affliction," <i>Genesis 41:51 to 52</i>). Forgiveness unlocked generational fruitfulness!',
        '<i>"For who knows whether you have come to the kingdom for such a time as this?"</i> <b>(Esther 4:14)</b>',
    ],
    "blue_panel_heading": "Kingdom Voices",
    "blue_panel_items": [
        '"Aim at heaven and you will get earth \'thrown in\': aim at earth and you will get neither."<br/><b>C.S. Lewis</b>',
        '"Every gift of God is given not as a trophy for the shelf, but as bread to be broken for a hungry generation."<br/><b>A.W. Tozer</b> (paraphrased)',
        '"The measure of prophetic stature is never how many bow to you, but how many live because you obeyed God."<br/><b>CHRISCO Youth Aflame</b>',
    ],
    "coral_head_1": "WORD ANCHOR",
    "coral_body_1": [
        '<i>"But as for you, you meant evil against me; but God meant it for good, in order to bring it about as it is this day, to save many people alive."</i> <b>(Genesis 50:20)</b>',
        '<i>"As each one has received a gift, minister it to one another, as good stewards of the manifold grace of God."</i> <b>(1 Peter 4:10)</b>',
    ],
    "coral_head_2": "LARGER PURPOSE",
    "coral_body_2": [
        "Let God purge self promotion from your sight. The dream may begin with you, but its fulfillment belongs to families, churches, cities, and nations awaiting deliverance.",
    ],
    "photo": IMG("lesson7_generational_victory.jpg"),
    "photo_focus": (0.5, 0.25),
}

# ---------------------------------------------------------------------------
# PAGE 19: EPILOGUE & COMMISSIONING
# ---------------------------------------------------------------------------
PAGE_19_EPILOGUE = {
    "pillars": [
        "<b>The Dream Does Not Die in the Pit</b><br/><i>Genesis 37:24</i>",
        "<b>The Dream Does Not Die in Prison</b><br/><i>Genesis 39:20 to 21</i>",
        "<b>Silence Is Never Cancellation</b><br/><i>Genesis 41:1</i>",
        "<b>Process Preserves the Promise</b><br/><i>Psalm 105:19</i>",
        "<b>Appointed Time Will Surely Come</b><br/><i>Habakkuk 2:3</i>",
    ],
    "photo": IMG("portrait_smiling_youth.jpg"),
    "photo_focus": (0.5, 0.22),
    "title_lines": [
        ("THE DREAM", ROYAL_MID),
        ("SURVIVES", CORAL_ACCENT),
    ],
    "body_paragraphs": [
        "<b>Joseph teaches emerging seer prophets something unshakable.</b> A real dream from God is not always followed by immediate fulfillment. Sometimes it is followed by process. Sometimes by silence. Sometimes by betrayal. Sometimes by years you do not fully understand.",
        "<b>But if the Lord truly spoke: the dream does not die in the pit. The dream does not die in prison. The dream survives the process. Because what God reveals, He also knows how to preserve until the appointed time!</b>",
        '<i>"He who calls you is faithful, who also will do it"</i> (<i>1 Thessalonians 5:24</i>). <b>Prophetic Prayer:</b> <i>Lord of Joseph, purify my sight, anchor my secret integrity, steady my heart through every hidden season, wed revelation to wisdom within me, and make my life bread for generations. In Jesus\' mighty name, Amen.</i>',
    ],
}

# ---------------------------------------------------------------------------
# PAGE 20: BACK COVER / MINISTRY & EMAIL CONTACT (NO PHONE NUMBERS)
# ---------------------------------------------------------------------------
PAGE_20_CONTACT = {
    "contact_rows": [
        (
            "globe",
            "MINISTRY & FELLOWSHIP",
            "CHRISCO Youth Aflame",
            "Under CHRISCO FELLOWSHIP OF CHURCHES",
        ),
        (
            "mail",
            "FOR MORE INFORMATION",
            "chriscoyouthaflame2025@gmail.com",
            "Ministry, discipleship & fellowship inquiries",
        ),
        (
            "mail",
            "REACH OUT TO US",
            "shambetz@gmail.com",
            "Connect with our leadership & editorial team",
        ),
    ],
    "location_html": (
        "<b>CHRISCO Youth Aflame</b><br/>"
        "Under CHRISCO FELLOWSHIP OF CHURCHES. Reach out by email anytime."
    ),
    "bottom_big_1": "CHRISCO",
    "bottom_big_2": "YOUTH AFLAME",
    "benediction_html": (
        '<i>"Being confident of this very thing, that He who has begun a good work in you '
        'will complete it until the day of Jesus Christ."</i> <b>(Philippians 1:6)</b>'
    ),
}
