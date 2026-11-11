#!/usr/bin/env python3
"""Build two illustrated, Scripture-first CHRISCO Youth Aflame study books.

Install dependencies: python -m pip install reportlab pillow
The layout intentionally echoes BOOK FOR TODAY.pdf (A4 portrait, navy pill
headers, cream geometric shapes, photographic bands, floral/star accents and
branded footer), while using original text and illustrations.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase.pdfmetrics import stringWidth
from PIL import Image, ImageOps
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "books"
ASSETS = Path(__file__).resolve().parent / "youth_aflame_books" / "assets"
PHOTO = ASSETS / "pefa-east-gate-church.jpg"
FONTS = ROOT / "scripts" / "joseph_ebook_assets" / "fonts"
W, H = 595.5, 842.25
NAVY = HexColor('#20156D')
BLUE = HexColor('#3147A7')
CREAM = HexColor('#F1F0E4')
PALE = HexColor('#F8F7F1')
INK = HexColor('#211F2E')
MUTED = HexColor('#625F70')
CORAL = HexColor('#F36E5B')
GOLD = HexColor('#E7B14E')

for name, file in [('Poppins','Poppins-Regular.ttf'),('Poppins-Bold','Poppins-Bold.ttf'),('Poppins-Medium','Poppins-Medium.ttf'),('Poppins-Italic','Poppins-Italic.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS/file)))
pdfmetrics.registerFontFamily('Poppins', normal='Poppins', bold='Poppins-Bold', italic='Poppins-Italic', boldItalic='Poppins-Bold')

BOOK1 = {
 'title':'STOP MAKING OUR GOD LOOK LIKE BAAL!', 'subtitle':'Prayer, the God Who Hears, and the Fire on Carmel',
 'strap':'A SCRIPTURE-FIRST STUDY OF 1 KINGS 18:20–40',
 'intro':'A careful, pastoral study of biblical prayer, spiritual fervour, discernment, and the character of the living God.',
 'filename':'stop-making-our-god-look-like-baal.pdf',
 'pages':[
('Welcome: Return to the Text','A pastoral invitation',[
'Prayer is one of the most intimate privileges of Christian life. It is also an area where sincerity can be confused with performance, and inherited habits can go untested. This book asks a pointed question: do our practices proclaim the God revealed in Scripture, or do they suggest that God must be manipulated into noticing us?',
'The title is deliberately arresting, but its purpose is not to shame worshippers or to police how people express emotion. It is a call to examine what our actions teach about God. Tears, loud cries, kneeling, raised hands, silence, and long seasons of intercession may all be sincere. None is a universal measure of faith. Scripture—not spectacle—must be our authority.',
'Our anchor is 1 Kings 18:20–40. Read the whole account before proceeding. Notice the covenant crisis, the rival altars, Elijah’s public prayer, the fire, and the people’s confession. We will also read Jesus’ teaching on prayer, the Psalms, the apostles, and passages about pastoral character. The goal is not a technique for producing fire. The goal is to know and honour the God who hears.'
], 'KEY TEXT  |  “The LORD, he is the God.” — 1 Kings 18:39 (KJV)', True),
('How to Use This Study','Read slowly; test every claim',[
'Keep a Bible open. The references are invitations to read whole passages, not decorative proof-texts. Where a statement in this book is interpretation rather than the direct wording of Scripture, compare it with the text and discuss it with mature, accountable believers.',
'Each section offers a central teaching, a pastoral application, and a question for personal or group reflection. A leader may teach one section at a time, pausing for prayer and honest conversation. Do not pressure participants to disclose private trauma, finances, or spiritual experiences.',
'This book uses short quotations from the King James Version (KJV), a public-domain English translation, and otherwise gives references or paraphrases. Translation choices can differ. For close study, compare several trusted translations and consult the surrounding chapter.'
], 'A GOOD RULE  |  Let clear Scripture interpret dramatic experience.', False),
('Read Scripture in Context','Observation, interpretation, application',[
'Begin with observation: what does the passage actually say? Note who is speaking, what happens before and after, repeated words, contrasts, and the audience. For 1 Kings 18, read at least chapters 16–19. The fire is one moment in a wider narrative of covenant disloyalty, prophetic courage, divine provision, and Israel’s response.',
'Move to interpretation: what did the passage mean within its first setting and within the Bible’s larger story? Distinguish the narrator’s description from a command for every believer. Elijah’s altar, the water, and the public sign belong to a particular prophetic confrontation; the passage does not command Christians to recreate them.',
'Then consider application: what does this reveal about God, human faithfulness, and our worship now? Application should follow the meaning rather than replace it. A passage can correct manipulative prayer teaching without condemning every loud or embodied prayer. Read neighboring verses, compare Scripture with Scripture, and welcome wise communal discernment.'
], 'READ  |  1 Kings 16–19; Matthew 6:5–13; Acts 17:11.', False),
('Carmel in Context','1 Kings 16–18: more than a contest',[
'The scene on Mount Carmel is not an isolated lesson about prayer volume. Israel’s covenant life has been compromised under Ahab, who marries Jezebel and promotes Baal worship (1 Kings 16:29–33). The drought announced by Elijah is a judgement sign within the covenant story (17:1; compare Deuteronomy 11:16–17). The land’s dependence on rain makes the contest over who is truly God immediate and public.',
'Before Carmel, God sustains Elijah through ravens and a widow at Zarephath (1 Kings 17). The widow’s flour and oil do not fail; her son is restored to life. These episodes establish that the Lord is not a regional weather-spirit whose power Elijah controls. The Lord speaks, provides, gives life, and acts beyond Israel’s borders.',
'At Carmel, the issue is divided allegiance: “How long halt ye between two opinions?” (18:21). The people’s silence matters. The contest aims to expose the false claim that Baal can answer and to call Israel back to covenant loyalty. Read the drought, the widow story, and Carmel together: the narrative is about the Lord’s identity and Israel’s return, not a reproducible prayer formula.'
], 'REFLECT  |  What question does Elijah ask Israel in 1 Kings 18:21?', False),
('Read the Whole Story','A guided walk through 1 Kings 18:20–40',[
'Verses 20–24 set out the public test. The prophets of Baal prepare a bull and call on their god. Elijah proposes that the God who answers by fire be acknowledged as God. Verses 25–29 report the Baal prophets’ cries and rituals from morning until the evening offering. The narrator gives the verdict: “there was neither voice, nor any to answer, nor any that regarded.”',
'Verses 30–35 turn to Elijah. He repairs the Lord’s altar, uses twelve stones that recall Israel’s tribes, prepares the offering, and has water poured over it three times. The details underline that the outcome cannot be explained as an unnoticed spark. The soaked offering is not proof that every genuine prayer must end in a miracle; it intensifies this unique public sign.',
'In verses 36–37 Elijah prays at the time of the evening offering. He names the Lord as God of Abraham, Isaac, and Israel, says he has acted at God’s word, and asks for an answer so the people will know the Lord has turned their hearts back. Verse 38 tells of fire. Verse 39 records the people’s confession. Verse 40 concludes with judgement on Baal’s prophets in this ancient covenant setting; it is not a warrant for Christians to harm religious opponents.'
], 'NOTICE  |  The text itself gives the prayer’s purpose: that Israel may know the Lord and turn back.', False),
('The Prophets of Baal','Ritual, desperation, and the narrator’s verdict',[
'Baal’s prophets cry out, leap around the altar, and later cut themselves “after their manner” until blood flows (1 Kings 18:26–29). Their activity grows more intense, but the narrator repeats that there is no voice, answer, or attention. Elijah’s taunt in verse 27 exposes the absurdity of a deity imagined as sleeping, travelling, or occupied and therefore needing to be roused.',
'The scene contrasts the Lord with an idol, not emotional people with calm people. The prophets’ self-injury belongs to a futile ritual system; it must not be equated simplistically with a Christian who cries, trembles, dances, or prays loudly. We should not ridicule people’s bodies or presume to know the state of another person’s heart from outward expression alone.',
'The sharp question for the church is theological: what picture of God does a practice communicate? If leaders teach that a person must injure themselves, exhaust themselves, or perform a particular movement to force God to hear, the practice falsely presents God as reluctant or controllable. Such teaching needs correction. But intensity by itself does not prove manipulation.'
], 'PASTORAL CARE  |  Never encourage cutting, hitting, choking, forced fasting, or any self-injury as prayer.', False),
('Elijah’s Prayer','Brief does not mean effortless',[
'Elijah begins, “LORD God of Abraham, Isaac, and of Israel” (1 Kings 18:36). He addresses the covenant God by name and history. His prayer is rooted in who God has revealed himself to be—not in a secret formula, a performance, or Elijah’s own power.',
'He says, “let it be known this day that thou art God in Israel, and that I am thy servant, and that I have done all these things at thy word.” The prayer’s focus is God’s identity and word. Elijah does not claim to be a spiritual technician; he identifies himself as a servant acting in obedience.',
'He asks God to hear him so the people may know the Lord and that the Lord has “turned their heart back again” (18:37). The desired outcome is renewed allegiance. The prayer is short in the narrative, but it follows a whole day of public confrontation, altar repair, preparation, and obedience. Its brevity is no basis for a rule that prayer should always be brief. Nor does Scripture say Elijah felt nothing. The text simply records what he said.'
], 'READ ALOUD  |  1 Kings 18:36–37. Mark each reference to God, the servant, and the people.', False),
('Fire from Heaven','A sovereign sign, not a spiritual recipe',[
'Fire consumes the offering, wood, stones, dust, and water in the trench (1 Kings 18:38). The sign is deliberately overwhelming. Israel falls on its face and confesses that the Lord alone is God (18:39). The scene displays divine sovereignty: the Lord answers freely and decisively in a particular moment of covenant history.',
'We must not turn the event into a promise that a properly worded prayer always produces a spectacular answer. Biblical signs point beyond themselves. The fire authenticates the Lord’s claim in the contest; it does not establish a method by which later believers can compel God. Jesus’ followers may ask boldly, yet the New Testament also portrays faithful believers who suffer, wait, and die without the requested earthly outcome (2 Corinthians 12:7–10; Hebrews 11:35–40).',
'The right response to Carmel is worship and repentance, not copying the fire. Christian prayer is shaped by God’s character, the teaching of Jesus, and the Spirit’s work. The extraordinary sign reminds us that God can act; it does not permit us to accuse every person who lacks a miracle of weak faith.'
], 'KEEP TOGETHER  |  God is powerful to answer; God is free in how and when he answers.', False),
('The Living God Is Not an Idol','What Scripture says about God hearing',[
'The Bible repeatedly distinguishes the living God from idols that have mouths but do not speak, ears but do not hear, and hands but do not act (Psalm 115:4–8; Isaiah 46:5–7). The contrast is not that God is a bigger version of a human ruler who can be flattered into action. God is the creator, covenant Lord, and Father who knows and cares.',
'Jesus says, “your Father knoweth what things ye have need of, before ye ask him” (Matthew 6:8). The next verses teach disciples to pray “Our Father,” to honour God’s name, seek God’s kingdom, ask for daily bread, forgiveness, and deliverance (6:9–13). God’s prior knowledge does not make prayer pointless. Prayer is relationship and dependence, not information supplied to an unaware deity.',
'“God is not deaf, distracted, asleep, or travelling” is a faithful summary of the biblical contrast, provided it is not used to promise that every request will be granted on our timetable. The Psalms include the painful question “How long?” (Psalm 13). The same Scriptures that affirm God hears also teach lament, waiting, and trust.'
], 'KEY TEXTS  |  Psalm 34:15; Matthew 6:8–13; 1 Peter 5:7.', False),
('Matthew 6: Prayer Without Performance','Jesus corrects showmanship, not sincerity',[
'Matthew 6:5–8 belongs to Jesus’ Sermon on the Mount. He warns against praying to be seen and against empty, repetitive babbling as though many words compel a hearing. He is not condemning public prayer—Jesus himself prays publicly—nor every repeated phrase. He is exposing prayer performed for reputation or used as a technique to manipulate God.',
'Jesus teaches a private place of prayer and calls God “your Father.” The “Our Father” that follows is plural: disciples pray as a community. Its petitions re-centre us on God’s name and kingdom, daily dependence, reconciliation, and protection. Prayer forms people who desire God’s will; it is not a lever for making God serve our agenda.',
'Compare this passage with 1 Kings 18. Elijah’s public prayer is not showmanship because the narrator presents it as obedience and witness; Jesus’ warning is about the heart and purpose of religious action. The same outward act—praying aloud—can be humble intercession or self-promotion. Discernment asks what Scripture says, what the act communicates, and whether it builds love and faithfulness.'
], 'PRACTICE  |  Pray the Lord’s Prayer slowly, pausing after each petition.', False),
('Fervency, Volume, and the Body','A biblical balance',[
'The Bible contains quiet trust (Psalm 131), cries of distress (Psalms 22 and 130), shouted praise (Psalm 47), groaning (Romans 8:23, 26), tears (Hebrews 5:7), and extended intercession (Luke 6:12). Scripture makes room for different temperaments, circumstances, cultures, and physical abilities. There is no single biblical volume for prayer.',
'James 5:16 commends the earnest prayer of a righteous person; its force is about committed, effective prayer, not decibels or bodily strain. 1 Thessalonians 5:17 calls believers to pray continually, not to remain in a physically exhausting posture without interruption. Raised hands (1 Timothy 2:8), kneeling (Ephesians 3:14), standing (Mark 11:25), and prostration (Matthew 26:39) appear in Scripture, each without becoming a compulsory technique.',
'We can be fervent without being theatrical, and expressive without being manipulative. Tears do not prove spiritual maturity; composure does not prove spiritual coldness. Loudness can help a gathered congregation pray together, while silence can help a grieving person speak honestly to God. The test is not whether a posture looks dramatic but whether the practice is truthful, loving, safe, and consistent with Scripture.'
], 'REMEMBER  |  Biblical freedom is not a licence to shame, coerce, or injure.', False),
('Perseverance When the Answer Is Delayed','Persistence is trust, not pressure',[
'Jesus tells the parable of the persistent widow so that disciples “ought always to pray, and not to faint” (Luke 18:1–8). The contrast is between an unjust judge and the God who hears his people; the point is not that God is reluctant and must be worn down. Persistence expresses dependence and hope while we wait.',
'Paul asks three times for his “thorn” to be removed. God answers, “My grace is sufficient for thee” (2 Corinthians 12:8–9). The answer is not the requested removal, yet Paul is not dismissed or abandoned. The Gospels also show Jesus praying in Gethsemane, surrendering his desire to the Father’s will (Matthew 26:36–46). Prayer may include asking, lamenting, waiting, receiving help, and entrusting the outcome to God.',
'When a prayer is not answered as hoped, do not tell a suffering person that they failed to shout enough, fast enough, or believe enough. Such claims add burdens Scripture does not add. Offer presence, practical help, medical or mental-health care when needed, and prayer that makes room for lament. Faithfulness is not measured by whether a miracle happened on demand.'
], 'PASTORAL WORD  |  “The LORD is nigh unto them that are of a broken heart.” — Psalm 34:18', False),
('Prayer Across the Bible','Many voices; one faithful God',[
'Abraham intercedes for a city (Genesis 18:22–33); Hannah pours out her soul in anguish (1 Samuel 1:9–18); David prays praise, confession, complaint, and trust across the Psalms; Solomon asks for wisdom (1 Kings 3:5–14); Daniel confesses and pleads for mercy (Daniel 9). These prayers do not share one emotional register or length.',
'Jesus withdraws to pray (Luke 5:16), gives thanks (John 11:41–42), intercedes for his disciples (John 17), and cries out in anguish on the cross (Matthew 27:46). The early church prays together, asks for boldness, and shares material support (Acts 4:23–35). Paul prays for wisdom, love, endurance, and hope in churches (Ephesians 1:15–23; 3:14–21; Colossians 1:9–14).',
'The variety should make us more generous with one another. A young believer’s halting words, a child’s brief prayer, an elder’s familiar liturgy, and a community’s loud song can all be sincere. No single biblical example should be made into a universal posture. Learn from the whole canon and keep Christ at the centre.'
], 'STUDY  |  Compare Hannah’s prayer (1 Samuel 1:9–18) with Jesus’ prayer (Matthew 26:36–46).', False),
('Discernment: Passion or Pressure?','Questions for leaders and congregations',[
'Ask first: Is the practice taught clearly from Scripture, in context, without claiming more than the text says? Does it honour God as Father and Lord, or imply God is manipulated by a sound, gesture, amount of pain, or leader’s command? Does it direct people to Christ and love of neighbour, or to a leader’s control and reputation?',
'Ask whether participation is genuinely voluntary. Can someone pray quietly, sit down, step out, or decline a public testimony without being called faithless? Are children and vulnerable adults protected from forced touch, restraint, sleep deprivation, public humiliation, and pressure to disclose? Is money, medication, or access to family being controlled in the name of prayer?',
'Passion may be loud and joyful, or quiet and steady. Pressure is revealed by coercion, fear, self-harm, false promises, and punishment for honest questions. A church can correct harmful teaching without mocking culture or condemning every unfamiliar expression. Speak with humility; protect people; name the specific behaviour and its effect.'
], 'RED FLAGS  |  “Hurt yourself”; “God must answer if you do this”; “never question me.”', False),
('A Healthy Practice of Prayer','A simple, adaptable pattern',[
'1. Be still: take a comfortable posture, or move if that helps you focus. 2. Attend to Scripture: read a short passage slowly. 3. Adore: name what the passage reveals about God. 4. Confess: tell the truth without self-hatred and receive the promise of mercy (1 John 1:9). 5. Ask: bring concrete needs for yourself and others. 6. Listen: leave space for reflection, while testing impressions against Scripture and wise counsel. 7. Act: identify a loving next step.',
'This pattern is a help, not a law. A person in emergency may simply cry “Lord, help me.” A parent may pray in brief moments between tasks. A congregation may sing, kneel, stand, or remain seated. A person with chronic pain, disability, trauma, or limited energy may adapt every step. No posture or duration earns God’s attention.',
'Where prayer includes fasting, teach its biblical purpose and make health exceptions; never pressure people to put health at risk. Where prayer includes laying on of hands, ask consent. Where a person is in crisis, prayer should accompany—never replace—appropriate medical, safeguarding, and practical support.'
], 'TRY  |  Read Psalm 23; pray one sentence from each phrase that speaks to you.', False),
('Leading Prayer Safely and Honestly','Care is part of spiritual leadership',[
'Leaders should explain the purpose of a prayer gathering, offer more than one way to participate, and avoid announcing that God has guaranteed a specific outcome. Do not promise healing in exchange for money or accuse someone of hidden sin because symptoms continue. Pray with compassion and refer people to qualified clinicians when health needs arise.',
'Ask before touching someone, especially when laying on hands or praying with children. Never restrain, strike, shake, or force a person into a posture. A person who is overwhelmed may need a quiet space, water, a trusted companion, and time—not a crowd pressing in. Establish clear safeguarding procedures and follow local law and church policy.',
'If a practice has caused harm, listen to those affected, acknowledge what happened, stop the harmful conduct, and seek accountable pastoral and professional help. Do not spiritualise abuse as “persecution” or “rebellion.” Servant leadership makes room for questions and protects the vulnerable (Mark 10:42–45; 1 Peter 5:2–3).'
], 'LEADER CHECK  |  Does this gathering make honest prayer and safe choice possible?', False),
('Seven-Day Scripture and Prayer Journey','A week of returning to the God who hears',[
'Day 1 — Psalm 23: name God’s care; pray for daily trust. Day 2 — Matthew 6:5–13: pray the Lord’s Prayer; notice its order. Day 3 — 1 Kings 18:20–39: mark the story’s purpose and the people’s response. Day 4 — Psalm 13: practise lament without rushing to easy answers.',
'Day 5 — Luke 18:1–8: ask what persistent prayer means in Jesus’ parable. Day 6 — 2 Corinthians 12:7–10: pray honestly about a burden and receive the promise of grace. Day 7 — Acts 4:23–35: pray for courage and for practical generosity in your community.',
'Each day, take five to fifteen minutes—or adapt the time. Read the text, write one observation, one question, and one response. If you miss a day, begin again without guilt. Invite a trusted friend to share what they learned, but keep private what should remain private. The purpose is not to complete a spiritual challenge perfectly; it is to attend to God and become more faithful in love.'
], 'JOURNAL PROMPT  |  What does today’s passage reveal about God, and what faithful response follows?', False),
('Group Discussion & Examination','Questions for a church, youth group, or ministry team',[
'1. What details in 1 Kings 18:20–40 are easy to miss when we focus only on the fire? 2. How does Matthew 6:5–13 correct prayer performed for attention? 3. Which biblical prayer forms give you freedom to be honest with God? 4. What language in our community might imply that God is reluctant or can be controlled?',
'5. How can we distinguish intense but voluntary worship from pressure or harm? 6. What should a leader do when someone is injured or emotionally overwhelmed during a prayer gathering? 7. How can we pray for healing while refusing to blame a person whose condition remains? 8. What practical act of care should accompany our prayers this week?',
'Personal examination: Have I judged another person’s faith by their volume, posture, tears, or silence? Have I used spiritual authority to pressure someone? Do I believe God’s love is earned by how dramatically I pray? If correction is needed, seek trusted, accountable counsel and take a specific step toward repair.'
], 'GROUP COVENANT  |  We will read in context, honour consent, protect the vulnerable, and speak truth with grace.', False),
('Closing Prayer','A prayer of trust and discernment',[
'Father, you are the living God, faithful to your word and full of compassion. Thank you that you know our needs before we ask, and that you invite us to come near through Jesus Christ. Forgive us when we have treated prayer as performance, when we have judged another person’s expression, or when we have used authority to control.',
'Teach us to pray with honesty, courage, patience, and love. Give comfort to those who wait, practical help to those in need, wisdom to leaders, and protection to anyone who is vulnerable. Let our worship honour you and let our lives reflect the mercy we ask from you. Give us freedom to be quiet or joyful, to lament or give thanks, always testing our ways by Scripture and walking in the way of Christ. Amen.',
'“The LORD is nigh unto all them that call upon him, to all that call upon him in truth.” — Psalm 145:18 (KJV).'
], 'THE LORD, HE IS GOD.  |  1 Kings 18:39', False),
('Image Credits & Scripture Note','About this edition',[
'Cover and section photograph: “Pefa East Gate Church - Nakuru” (2021), by Pefa East Gate Church - Nakuru, Wikimedia Commons, CC BY-SA 4.0. Source: https://commons.wikimedia.org/wiki/File:Pefa.jpg. License: https://creativecommons.org/licenses/by-sa/4.0/. The photograph is cropped for layout; no watermark was added. Attribution is provided here, and the image remains under its original license.',
'All decorative altar, flame, sunburst, and book motifs in this publication are original vector artwork created for this edition. No claim is made that the photograph depicts the events or people described in 1 Kings 18.',
'Scripture quotations marked KJV are from the King James Version. Biblical interpretations are offered as a teaching aid and should be checked against the full text. This resource is for Christian education and pastoral formation; it does not replace qualified mental-health, medical, legal, or safeguarding support.'
], 'CHRISCO YOUTH AFLAME  |  Scripture · Formation · Service', False),
]}

TRUTHS = [
('Ministry Will Cost You Personally','Sacrifice without exploitation',[
'Jesus says discipleship involves taking up the cross (Mark 8:34–35), and Paul describes costly service (2 Corinthians 11:23–28). Calling may require inconvenient hours, travel, study, hospitality, or financial generosity. But “sacrifice” is not permission for an institution to demand unpaid labour without limit, to seize a minister’s family resources, or to call every boundary selfishness.',
'Christian sacrifice is freely offered to God and neighbour; manipulation extracts it for a leader’s comfort. Pastors need rest, fair compensation where possible, honest budgets, shared responsibility, and time with family. Jesus withdrew to pray and rest with his disciples (Mark 6:31). A sustainable ministry honours both service and creaturely limits.',
'Ask: What is genuinely mine to offer in this season? What belongs to my household or other responsibilities? Who can help me discern whether this request is faithful service or unhealthy pressure? A calling does not erase the need for wise stewardship.'
], 'READ  |  Mark 6:30–32; 1 Timothy 5:17–18.'),
('You Will Encourage Others While Fighting Your Own Battles','The pastor is also a person in need of grace',[
'Paul comforted others with the comfort he himself had received (2 Corinthians 1:3–7). That does not mean ministers must pretend to be well or preach certainty while secretly collapsing. Biblical ministry includes weakness, lament, and asking others for prayer (Romans 15:30; 2 Corinthians 12:7–10). A pastor’s credibility does not depend on a flawless private life.',
'Build a trustworthy circle beyond the people you lead: peers, supervisors, a spiritual director, a counsellor, and appropriate medical care. Confidentiality has limits when someone is in danger; know your safeguarding and referral procedures. Do not make congregants responsible for carrying the pastor’s unprocessed pain or use the pulpit to disclose another person’s story.',
'You may serve while grieving, but you are not required to serve without support. Rest, treatment, and temporary leave can be faithful stewardship. Encouraging others includes modelling truthful help-seeking.'
], 'PRACTICE  |  Name one trusted person you can contact before crisis.'),
('Loyalty Will Be Tested','Trust wisely; do not demand blind allegiance',[
'Jesus experienced abandonment, and Paul knew the pain of companions leaving (2 Timothy 4:9–16). Betrayal is real. Yet the claim that people who question or leave are automatically disloyal can become a tool of control. Christian loyalty is first loyalty to Christ and truth; leaders are accountable, and followers may raise concerns or make a safe departure.',
'Build trust through clear expectations, shared decisions, financial transparency, and fair processes for disagreement. When conflict occurs, distinguish a personal slight from a safeguarding concern, theological difference, or legitimate report of misconduct. Do not retaliate, threaten curses, or recruit the congregation to punish a critic.',
'Grieve losses without becoming suspicious of everyone. Jesus entrusted himself to the Father while still forming a community of disciples. Wise boundaries do not cancel love; they make honest relationships safer.'
], 'READ  |  Matthew 18:15–20; Galatians 2:11–14.'),
('Your Character and Motives May Be Misjudged','Stay truthful; welcome accountability',[
'Jesus was misunderstood and falsely accused (Mark 3:20–22; Luke 7:33–34). Scripture also warns leaders to maintain a good reputation and be above reproach (1 Timothy 3:1–7; Titus 1:5–9). These truths belong together: criticism can be unfair, but a leader must not use “misunderstood” to evade a serious, evidence-based concern.',
'Respond to allegations through fair, documented, accountable processes. Listen before defending. Correct errors, apologize where needed, and protect those who report harm. Where accusations are false, seek appropriate counsel and answer with verifiable facts rather than threats or public shaming. Do not attempt to investigate abuse alone or promise absolute secrecy where safety is at stake.',
'Motives matter, but others cannot always see them. Let patterns of humility, integrity, transparent finances, and consistent care support your words. Character is formed in hidden decisions long before it is tested in public.'
], 'LEADER CHECK  |  Is there an independent, safe way for people to raise concerns?'),
('Your Family Needs Care and Protection','Calling includes the household, not only the platform',[
'Ministry affects spouses, children, parents, and close friends. They may be asked to host, travel, wait, or accept public attention. But family members are not ministry props. A spouse’s consent matters; children deserve privacy and protection; no one should be forced to perform spirituality or provide unpaid labour to prove support for a calling.',
'1 Timothy 3:4–5 speaks of household care in leadership qualifications, while Ephesians 6:4 warns parents not to provoke their children. These passages do not demand a perfect family; they underline responsibility. Set boundaries around photographs, personal stories, criticism, online exposure, and ministry hours. Make a plan for complaints directed at family members and take threats seriously.',
'When a family member is harmed, respond as a caregiver, not as a public-relations manager. Seek appropriate pastoral, professional, or legal support. A healthy church shares the work so one household is not required to carry the whole vision.'
], 'PRACTICE  |  Schedule protected, ordinary time with the people closest to you.'),
('Those You Raise May Challenge You','Develop people who can think and lead',[
'Paul mentored Timothy and Titus, and Jesus prepared disciples who would carry the work beyond his earthly ministry. Healthy succession means others grow in wisdom, responsibility, and courage. A student who raises a concern, develops a distinct gift, or takes another assignment is not automatically an enemy.',
'Competition and undermining can occur, but leaders should test facts rather than label dissent as rebellion. Clarify roles, share credit, create transparent decision-making, and address conflict directly. If there is misconduct, use fair procedures. If someone is ready to lead elsewhere, bless their growth rather than using access, money, or spiritual threats to keep them dependent.',
'Equip people to serve Christ, not to become extensions of your personality. The church belongs to Christ. A leader’s fruit includes the ability to prepare others and release responsibility with humility.'
], 'READ  |  Numbers 11:24–30; 2 Timothy 2:1–2.'),
('Not Everyone Will Celebrate Your Calling','Seek discernment, not applause or immunity',[
'Jesus’ hometown questioned him (Mark 6:1–6), and prophets were not always welcomed. Opposition does not by itself prove that a person is right; popularity does not prove that they are wrong. A calling should be tested through Scripture, character, community discernment, gifts, wise counsel, and observable fruit—not solely by a private impression or by resistance from critics.',
'Some people may misunderstand your assignment; others may see a real blind spot. Listen for truth even when it arrives imperfectly. Keep trusted advisers who are free to disagree. Avoid announcing that all criticism is persecution or that your vision cannot be questioned because God gave it to you.',
'Faithfulness is not the same as universal approval. You can continue a sound assignment without retaliating, exaggerating your authority, or silencing others. Humility keeps the calling under Christ’s lordship.'
], 'DISCERN  |  Who can correct you without fear of losing relationship or livelihood?'),
('Division Is a Serious Battle','Pursue peace without concealing harm',[
'Paul urges believers to maintain unity and put away destructive speech (Ephesians 4:1–6, 25–32). Division can be fuelled by gossip, factions, envy, and careless leadership. But unity is not a demand to hide abuse, silence victims, or avoid necessary disagreement. Biblical peace is joined to truth, justice, repentance, and care.',
'Address conflict early. Speak directly where safe; use impartial mediation for disputes; record important decisions; avoid triangulation and public speculation. When there is a safeguarding allegation, follow policy and report to appropriate authorities rather than treating it as a private disagreement to be smoothed over.',
'A leader serves unity by modelling repentance, fairness, and patient listening. Do not call every boundary “division.” Sometimes people need distance to be safe. Reconciliation may be a hope, but it cannot be forced or substituted for accountability.'
], 'READ  |  Romans 12:18; James 3:13–18.'),
('Gratitude Is Not Guaranteed','Serve without entitlement; receive care too',[
'Jesus healed ten lepers and only one returned to give thanks (Luke 17:11–19). Ministry can include unseen work and disappointing responses. Service offered only for applause becomes fragile. Jesus teaches giving without making public recognition the motive (Matthew 6:1–4). The reward is not a guarantee of comfort or acclaim; it is faithful life before God.',
'At the same time, churches should not romanticise neglect. Workers deserve fair support, honest appreciation, rest, and practical care (1 Timothy 5:17–18; Galatians 6:6). “Serve God, not applause” must never be used to excuse financial opacity, chronic overwork, or contempt for staff and volunteers.',
'Practise gratitude both ways: name others’ contributions, share credit, and let people express thanks without making it a debt. Create sustainable systems so ministry does not depend on one person’s hidden exhaustion.'
], 'REFLECT  |  Can you receive appreciation without needing it, and ask for help without shame?'),
('Let Christ Be Your Reward','Endurance rooted in grace',[
'Paul counts all things loss compared with knowing Christ (Philippians 3:7–14). This is not a promise that betrayal or hardship cannot wound a minister. It is a confession that Christ is of greater worth than status. Ministry shaped by the cross depends on grace, community, and hope—not on public recognition.',
'Matthew 24:13 says, “he that shall endure unto the end, the same shall be saved.” In context, Jesus warns disciples about deception, persecution, lawlessness, and the need to remain faithful (Matthew 24:4–14). It is not a guarantee of ministry success, immunity from suffering, or a command to remain in an abusive role. Endurance means persevering in allegiance to Christ; seeking safety and help may be part of that faithfulness.',
'Keep your identity larger than your title. Sabbath, friendship, worship, repentance, and ordinary service protect the heart from turning a ministry assignment into a personal throne. The crown is Christ himself, and the final outcome belongs to God.'
], 'KEY TEXTS  |  Philippians 3:7–14; Matthew 24:4–14; 1 Peter 5:4.'),
]

BOOK2 = {
 'title':'YOUNG PASTOR', 'subtitle':'10 Compelling Truths About Your Calling',
 'strap':'A SCRIPTURE-GROUNDED FIELD GUIDE FOR EMERGING LEADERS',
 'intro':'A pastoral formation guide to sacrifice, character, conflict, family, endurance, and Christ-centred ministry.',
 'filename':'young-pastor-10-truths-about-your-calling.pdf'
}

def esc(s):
    return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('\n','<br/>')
def rounded(c,x,y,w,h,r,fill):
    c.setFillColor(fill); c.roundRect(x,y,w,h,r,stroke=0,fill=1)
def star(c,x,y,size,color=NAVY):
    c.saveState(); c.setStrokeColor(color); c.setLineWidth(1.3)
    c.line(x-size,y,x+size,y); c.line(x,y-size,x,y+size)
    c.line(x-size*.68,y-size*.68,x+size*.68,y+size*.68); c.line(x-size*.68,y+size*.68,x+size*.68,y-size*.68)
    c.setFillColor(color); c.circle(x,y,1.8,stroke=0,fill=1); c.restoreState()
def pill(c, text, x, y, maxw, fs=10):
    text=text.upper(); size=fs
    while stringWidth(text,'Poppins-Bold',size)>maxw-28 and size>7: size-=.3
    w=min(maxw,stringWidth(text,'Poppins-Bold',size)+28)
    rounded(c,x,y,w,25,12,NAVY); c.setFillColor(white); c.setFont('Poppins-Bold',size); c.drawCentredString(x+w/2,y+8,text)
def footer(c,n,total):
    rounded(c,35,20,W-70,24,12,NAVY)
    c.setFillColor(white); c.setFont('Poppins',7.2); c.drawString(47,28,'CHRISCO YOUTH AFLAME  ·  SCRIPTURE · FORMATION · SERVICE')
    c.setFont('Poppins-Bold',7.2); c.drawRightString(W-47,28,f'{n:02d} / {total:02d}')
def cover(c, book, volume, total):
    c.setFillColor(white); c.rect(0,0,W,H,fill=1,stroke=0)
    # top-right brand label, as on the reference template
    rounded(c,385,785,165,28,14,NAVY); c.setFillColor(white); c.setFont('Poppins-Bold',10); c.drawCentredString(467,794,'CHRISCO YOUTH AFLAME')
    # photograph framed as a wide hero band
    if PHOTO.exists():
        c.drawImage(ImageReader(str(PHOTO)),58,420,width=480,height=315,preserveAspectRatio=True,anchor='c',mask='auto')
    c.setFillColor(CREAM); p=c.beginPath(); p.moveTo(0,400); p.lineTo(182,506); p.lineTo(W,385); p.lineTo(W,0); p.lineTo(0,0); p.close(); c.drawPath(p,fill=1,stroke=0)
    # tall template rail and ring
    c.setFillColor(NAVY); c.rect(58,572,12,270,fill=1,stroke=0); c.setFillColor(white); c.circle(64,577,10,fill=1,stroke=0); c.setStrokeColor(NAVY); c.setLineWidth(2); c.circle(64,577,8,fill=0,stroke=1)
    star(c,535,382,12,NAVY)
    c.setFillColor(NAVY); c.setFont('Poppins-Bold',12); c.drawString(60,363,volume.upper())
    title=book['title']
    fs=34 if len(title)<31 else 27
    words=title.split(' '); lines=[]; line=''
    for word in words:
        test=(line+' '+word).strip()
        if stringWidth(test,'Poppins-Bold',fs)>475 and line: lines.append(line); line=word
        else: line=test
    if line: lines.append(line)
    y=318
    for ln in lines:
        c.setFillColor(NAVY); c.setFont('Poppins-Bold',fs); c.drawString(60,y,ln); y-=fs+3
    suby=y-6
    rounded(c,60,suby-11,475,31,14,NAVY)
    c.setFillColor(white); sfs=9.5
    while stringWidth(book['subtitle'],'Poppins',sfs)>450 and sfs>7: sfs-=.2
    c.setFont('Poppins',sfs); c.drawCentredString(297.5,suby,book['subtitle'])
    c.setFillColor(INK); c.setFont('Poppins-Bold',8); c.drawString(62,suby-65,book['strap'])
    c.setFillColor(MUTED); c.setFont('Poppins',8); c.drawString(62,suby-91,'A CHRISCO YOUTH AFLAME TEACHING RESOURCE')
    c.setStrokeColor(NAVY); c.setLineWidth(.8); c.line(62,suby-104,245,suby-104)
    c.setFillColor(MUTED); c.setFont('Poppins',7.5); c.drawString(62,suby-124,'SCRIPTURE FIRST  ·  PASTORAL CARE  ·  CHRIST CENTRED')

def toc(c, book, titles, page_no, total):
    c.setFillColor(PALE); c.rect(0,0,W,H,fill=1,stroke=0)
    header(c,'Table of Contents', 'A GUIDE THROUGH THIS BOOK')
    c.setFillColor(INK); c.setFont('Poppins-Bold',9)
    y=697
    for i,title in enumerate(titles):
        if y<90: break
        c.setFillColor(NAVY); c.circle(60,y+3,3,fill=1,stroke=0)
        c.setFillColor(INK); c.setFont('Poppins-Medium',9.1); c.drawString(73,y,title[:75])
        c.setStrokeColor(HexColor('#D8D5E2')); c.setDash(1,2); c.line(75+min(stringWidth(title[:75],'Poppins-Medium',9.1),400),y+2,520,y+2); c.setDash()
        c.setFillColor(MUTED); c.setFont('Poppins',8); c.drawRightString(535,y,'›')
        y-=25
    if PHOTO.exists(): c.drawImage(ImageReader(str(PHOTO)),380,57,width=140,height=86,preserveAspectRatio=True,anchor='c',mask='auto')
    c.setFillColor(NAVY); c.setFont('Poppins-Italic',9); c.drawString(58,55,'“The LORD, he is the God.”  —  1 Kings 18:39')
    footer(c,page_no,total)

def header(c,title,kicker=None):
    c.setFillColor(white); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(NAVY); c.setFont('Poppins-Bold',9); c.drawString(38,806,'CHRISCO YOUTH AFLAME')
    c.setFillColor(MUTED); c.setFont('Poppins',7); c.drawRightString(W-39,806,'STUDY EDITION')
    if kicker:
        c.setFillColor(MUTED); c.setFont('Poppins-Bold',7.2); c.drawString(48,765,kicker.upper())
    pill(c,title,40,725,W-80,11.2)
    star(c,W-47,717,8,CORAL)
    # thin color band evoking image dividers in the source booklet
    c.setFillColor(CREAM); c.rect(0,0,W,8,fill=1,stroke=0)
def photo_strip_path():
    strip=Path('/tmp/chrisco-youth-aflame-photo-strip.jpg')
    if PHOTO.exists() and not strip.exists():
        with Image.open(PHOTO) as image:
            ImageOps.fit(image.convert('RGB'),(1515,375),method=Image.Resampling.LANCZOS,centering=(0.5,0.42)).save(strip,quality=90)
    return strip if strip.exists() else PHOTO

def draw_symbol(c,kind,x,y):
    c.saveState(); c.setFillColor(CREAM); c.circle(x,y,26,fill=1,stroke=0); c.setStrokeColor(NAVY); c.setLineWidth(1.6)
    if kind=='flame':
        p=c.beginPath(); p.moveTo(x,y-14); p.curveTo(x-16,y-3,x-5,y+5,x-3,y+16); p.curveTo(x+10,y+7,x+13,y-3,x,y-14); p.close(); c.setFillColor(CORAL); c.drawPath(p,fill=1,stroke=0)
        p=c.beginPath(); p.moveTo(x,y-9); p.curveTo(x-6,y-1,x-2,y+3,x+2,y+8); p.curveTo(x+7,y+1,x+4,y-6,x,y-9); p.close(); c.setFillColor(GOLD); c.drawPath(p,fill=1,stroke=0)
    elif kind=='book':
        c.line(x,y-13,x,y+13); c.roundRect(x-17,y-13,16,26,3,fill=0,stroke=1); c.roundRect(x+1,y-13,16,26,3,fill=0,stroke=1); c.line(x-13,y+5,x-4,y+5); c.line(x+5,y+5,x+13,y+5)
    else:
        c.circle(x,y,15,fill=0,stroke=1); c.line(x-11,y,x+11,y); c.line(x,y-11,x,y+11); c.line(x-8,y-8,x+8,y+8); c.line(x-8,y+8,x+8,y-8)
    c.restoreState()
def render_text_page(c, page, book, page_no, total, index):
    title, kicker, paragraphs, aside, *rest = page
    hero = rest[0] if rest else False
    header(c,title,kicker)
    if hero and PHOTO.exists():
        c.drawImage(ImageReader(str(photo_strip_path())),45,575,width=505,height=125,mask='auto')
        ytop=560
    else:
        draw_symbol(c, 'flame' if index%3==0 else ('book' if index%3==1 else 'star'), 76,672)
        ytop=685
    # A small intro/quote plaque mimics the capsule/card rhythm of the supplied book.
    if aside:
        rounded(c,119,ytop-28,420,36,16,CREAM)
        st=Paragraph(f'<b>{esc(aside)}</b>',ParagraphStyle('aside',fontName='Poppins-Bold',fontSize=8.2,leading=10,textColor=NAVY,alignment=TA_CENTER))
        _,ah=st.wrap(394,30); st.drawOn(c,132,ytop-24-(ah-10)/2)
        y=ytop-55
    else: y=ytop-22
    style=ParagraphStyle('body',fontName='Poppins',fontSize=10.0,leading=15.6,textColor=INK,spaceAfter=13,alignment=TA_LEFT)
    # Mix full-width welcome pages with balanced two-column content pages.
    split=(len(paragraphs)>2)
    colw=242 if split else 490; gap=27; leftx=55; rightx=leftx+colw+gap
    col=0; x=leftx; cy=y
    split_at=len(paragraphs)
    if split:
        total_words=sum(len(t.split()) for t in paragraphs); running=0
        for i,txt in enumerate(paragraphs[:-1],start=1):
            running+=len(txt.split())
            if abs(running-total_words/2)<abs(sum(len(t.split()) for t in paragraphs[:split_at])-total_words/2):
                split_at=i
    for i,txt in enumerate(paragraphs):
        if split and i==split_at:
            col=1; x=rightx; cy=y
        para=Paragraph(esc(txt),style)
        _,ph=para.wrap(colw,cy-75)
        if cy-ph < 64:
            # compact gracefully when a long page approaches the footer
            compact=ParagraphStyle('compact',parent=style,fontSize=9.2,leading=14.0,spaceAfter=10)
            para=Paragraph(esc(txt),compact); _,ph=para.wrap(colw,cy-66)
        para.drawOn(c,x,cy-ph); cy-=ph+style.spaceAfter
    footer(c,page_no,total)

def render_back(c, book, page_no,total, credits):
    c.setFillColor(CREAM); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(0,0,16,H,fill=1,stroke=0)
    star(c,510,730,16,NAVY)
    c.setFillColor(NAVY); c.setFont('Poppins-Bold',10); c.drawString(55,760,'CHRISCO YOUTH AFLAME')
    c.setFont('Poppins-Bold',31); c.drawString(55,686,'Go deeper.')
    c.drawString(55,646,'Stay in Scripture.')
    c.setFillColor(INK); c.setFont('Poppins',11)
    intro=Paragraph(esc(book['intro']),ParagraphStyle('end',fontName='Poppins',fontSize=11,leading=17,textColor=INK))
    _,h=intro.wrap(435,150); intro.drawOn(c,58,592-h)
    rounded(c,55,467,440,42,20,NAVY)
    c.setFillColor(white); c.setFont('Poppins-Bold',10); c.drawCentredString(275,483,'SCRIPTURE  ·  FORMATION  ·  SERVICE')
    c.setFillColor(MUTED); c.setFont('Poppins',8.5); c.drawString(58,430,'A resource for personal study, youth ministry, and pastoral formation.')
    if PHOTO.exists(): c.drawImage(ImageReader(str(PHOTO)),62,120,width=470,height=250,preserveAspectRatio=True,anchor='c',mask='auto')
    c.setFillColor(NAVY); c.setFont('Poppins-Bold',9); c.drawString(58,83,'IMAGE ATTRIBUTION & SCRIPTURE NOTES')
    c.setFillColor(INK); c.setFont('Poppins',7.2)
    y=68
    for line in credits:
        c.drawString(58,y,line[:110]); y-=10
    footer(c,page_no,total)

def make_book(book,pages,volume):
    allpages=list(pages)
    toc_titles=[p[0] for p in allpages]
    # Standardized 10-page-template-inspired front matter.
    total=1+1+1+len(allpages)+1
    target=OUT/book['filename']; target.parent.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(target),pagesize=(W,H),pageCompression=1)
    c.setTitle(book['title']+' | '+book['subtitle']+' | CHRISCO Youth Aflame')
    c.setAuthor('CHRISCO Youth Aflame'); c.setSubject(book['intro']); c.setCreator('CHRISCO Youth Aflame')
    cover(c,book,volume,total); c.showPage()
    toc(c,book,toc_titles,2,total); c.showPage()
    welcome=('A word before you begin','WELCOME TO THIS STUDY',[
        book['intro'],
        'This book is designed to be read with an open Bible and a teachable heart. It aims to encourage passionate faith while refusing claims that Scripture does not make. We distinguish the biblical text from our applications, and we make room for careful questions, emotional honesty, and responsible pastoral care.',
        'Use the discussion prompts with a trusted group. No one should be pressured to disclose private matters or to imitate another person’s prayer style. Read in context, welcome correction, and let Christ—not charisma, spectacle, or status—be the centre.'
    ],'READ FIRST  |  Let the whole counsel of Scripture shape the lesson.',False)
    render_text_page(c,welcome,book,3,total,0); c.showPage()
    for i,p in enumerate(allpages,start=1):
        render_text_page(c,p,book,i+3,total,i); c.showPage()
    credits=[
      'Cover photograph: Pefa East Gate Church - Nakuru (2021), Pefa East Gate Church - Nakuru, Wikimedia Commons.',
      'File: https://commons.wikimedia.org/wiki/File:Pefa.jpg  ·  License: CC BY-SA 4.0.',
      'https://creativecommons.org/licenses/by-sa/4.0/  ·  Photo cropped; no watermark added.',
      'Original decorative vector artwork. KJV quotations are public domain; read cited passages in context.'
    ]
    render_back(c,book,total,total,credits); c.showPage(); c.save()
    print(f'Wrote {target} ({total} pages, {target.stat().st_size/1024:.0f} KB)')

if __name__=='__main__':
    make_book(BOOK1,BOOK1['pages'],'BOOK ONE')
    second=[]
    second.append(('Before You Lead','Calling begins with following Jesus',[
      'A pastoral title is not a private possession or proof of spiritual superiority. In the New Testament, leadership is service under Christ, tested by character, doctrine, care, and accountability. Aspiring pastors should grow in Scripture, prayer, humility, and the ordinary responsibilities of community life.',
      'The ten truths that follow are realities to discern, not a script predicting that every pastor will experience every hardship in exactly the same way. Ministry is costly, but abuse is not a calling. Endurance matters, but staying in danger is not the measure of faith. A leader should never be isolated from wise counsel or made unaccountable by claims of special revelation.',
      'The KJV text of Matthew 24:13 is included in its context near the end. Jesus’ words call disciples to faithfulness amid deception and persecution; they are not a guarantee that every ministry assignment succeeds or that a pastor must remain in an unsafe role.'
    ],'FOUNDATION  |  Follow Christ before you seek a platform.',False))
    for i,(title,sub,paras,aside) in enumerate(TRUTHS,1):
        second.append((f'{i:02d} · {title}',f'TRUTH {i:02d}  |  {sub}',paras,aside, i in (1,5,10)))
        second.append((f'{i:02d} · Put It into Practice',f'FORMATION & REFLECTION  |  TRUTH {i:02d}',[
          f'Bring this truth into your actual ministry context. Read the cited passages in full, name what is within your responsibility, and distinguish it from what you cannot control. Ask a mature, accountable person to help you assess your next step. The goal is not to brace for inevitable enemies; it is to become a servant who is both courageous and teachable.',
          'Reflect: What part of this teaching challenges an assumption I have carried? Is there a boundary, apology, conversation, referral, or practical change I need to make? Who could be harmed if I apply this lesson carelessly? What would love of God and neighbour require here?',
          'Prayer: Lord Jesus, make me faithful without making me hard; humble without making me silent in the face of harm; courageous without making me controlling. Teach me to receive correction, serve with wisdom, protect those entrusted to my care, and find my worth in you. Amen.'
        ],'ONE NEXT STEP  |  Choose a faithful action—not a dramatic performance.',False))
    second.extend([
      ('Endure in Context','Matthew 24:13 and faithful perseverance',[
        '“But he that shall endure unto the end, the same shall be saved.” — Matthew 24:13 (KJV). Read Matthew 24:4–14 around this verse. Jesus warns of false messiahs, deception, persecution, betrayal, lawlessness, and the cooling of love. In that setting, endurance means continuing in faithful allegiance to Christ through trial and refusing deception and lawlessness.',
        'This verse is not a promise that a minister will avoid burnout, that a church project will prosper, or that a person must remain in a harmful institution. Christian endurance is not denial. The wider Bible calls believers to seek help, flee danger when appropriate, report wrongdoing, and care for one another. Perseverance may include rest, treatment, a change of role, or a safe exit from abuse.',
        'Pastors need the ordinary means of grace: Scripture, prayer, fellowship, wise accountability, rest, and care. The final hope belongs to God. We serve faithfully without pretending we control the outcome.'
      ],'READ IN CONTEXT  |  Matthew 24:4–14; Hebrews 12:1–3.',False),
      ('A Rule of Life for Young Pastors','Keep the calling human and Christ-centred',[
        'WORD: make time for Scripture beyond sermon preparation. PRAYER: speak honestly to God, including lament and silence. REST: keep a weekly rhythm of rest as far as circumstances allow. COMMUNITY: maintain friendships with people who are not your audience. ACCOUNTABILITY: invite trusted leaders to ask about character, money, power, and wellbeing.',
        'FAMILY & FRIENDS: protect commitments and respect the choices of those close to you. LEARNING: continue theological and practical formation; know when to refer beyond your expertise. SAFETY: follow safeguarding policy, obtain consent, keep appropriate records, and report concerns through the right channels. FINANCES: handle church and personal funds transparently, with shared oversight.',
        'This list is not a scorecard of holiness. Adapt it to your season and responsibilities. When you fall short, do not hide; seek help, repair what you can, and begin again in grace.'
      ],'ROOTED  |  Colossians 2:6–7; Mark 6:31.',False),
      ('Questions for Mentors and Ministry Teams','Build leaders, not dependency',[
        'What does this young leader believe calling means? Can they name limits without fear? Who supervises them, and is that relationship genuinely accountable? Are finances, workload, and decision-making transparent? Do family members have privacy and meaningful choice? How are complaints and safeguarding reports handled?',
        'Do not treat every disagreement as rebellion or every hardship as proof of anointing. Invite honest feedback. Make succession and delegation possible. Pay attention to mental and physical wellbeing. Encourage professional support where appropriate. A mentor’s role is not to control a younger leader’s future but to help them grow in wisdom and service.',
        'A healthy ministry culture can name harm, correct mistakes, honour work, and remain centred on Christ. It gives emerging leaders both responsibility and support, both encouragement and truthful limits.'
      ],'MENTORING AIM  |  Equip people to serve faithfully beyond your shadow.',False),
      ('A CHRISCO Youth Aflame Commission','Focus · reform · Spirit-formed witness',[
        'The ministry language supplied for this book includes: “There are Prophets and there’s ENB”; “Adom wɔ wiem”; “Focus”; “21st Century Reformer”; and “Type of Joel 2:28.” These expressions are included as a ministry signature and aspiration. “ENB” is retained as provided, without assigning it an explanation not supplied by the ministry.',
        'Joel 2:28–32 is part of Peter’s explanation of Pentecost in Acts 2:16–21. The promise speaks of the Spirit poured out on all kinds of people—sons and daughters, young and old, servants—and calls hearers to the Lord. It is not a licence for an individual to claim authority beyond Scripture or to avoid testing. Prophetic speech is to be weighed (1 Corinthians 14:29; 1 Thessalonians 5:19–22).',
        'Let “Focus” mean attention to Christ and Scripture; let “21st Century Reformer” mean courageous service that builds up rather than dominates; and let “Type of Joel 2:28” point to hope for a Spirit-filled people, not a superior rank. May the work be known by truth, humility, justice, compassion, and accountable love.'
      ],'COMMISSION  |  Acts 2:16–21; 1 Corinthians 14:29.',False),
      ('Closing Blessing','Faithful in the hidden places',[
        'May Christ be your pattern and your reward. May Scripture correct and comfort you. May you find companions who tell the truth in love. May your home be treated with honour, your body with care, and your gifts with gratitude. May you serve without needing applause and receive help without shame.',
        'When you are misunderstood, keep your heart soft and your boundaries wise. When you must repent, do so clearly. When others suffer, do not offer easy explanations where compassion is needed. When the work is heavy, share it. When danger is real, seek safety. When the way is uncertain, ask for wisdom.',
        '“The chief Shepherd” will appear, and the faithful are promised an unfading crown (1 Peter 5:1–4). Until then, shepherd willingly, not for dishonest gain or domination, but as an example to the flock. The church belongs to Jesus. Amen.'
      ],'BLESSING  |  1 Peter 5:1–4.',False),
      ('Image Credits & Scripture Note','About this edition',[
        'Cover and section photograph: “Pefa East Gate Church - Nakuru” (2021), by Pefa East Gate Church - Nakuru, Wikimedia Commons, CC BY-SA 4.0. Source: https://commons.wikimedia.org/wiki/File:Pefa.jpg. License: https://creativecommons.org/licenses/by-sa/4.0/. The photograph is cropped for layout; no watermark was added.',
        'Decorative vector motifs are original artwork. Scripture quotations marked KJV are from the King James Version. The lesson “10 truths” is a pastoral teaching outline, not a prophecy that every listed experience must occur. Seek qualified professional support for medical, mental-health, legal, or safeguarding needs.'
      ],'CHRISCO YOUTH AFLAME  |  Scripture · Formation · Service',False)
    ])
    make_book(BOOK2,second,'BOOK TWO')
