"""Editorial copy for the 19 CHRISCO course films.

`hook_display`  — on-screen kinetic type (short, all caps, 3-5 lines)
`outcome_lines` — the green poster quote
`narration`     — spoken script, one string per scene group
`cta`           — closing call to action paragraph

Each course's narration is kept under 1500 characters (one speech call) and
written from the course `desc` + `syllabus` in app/data/courses.js, never from
the misaligned `objectives` arrays.
"""
from __future__ import annotations

ACADEMY = "CHRISCO Digital Academy"

COPY = {
    "youtube-automation": {
        "hook_display": ["WHAT IF YOUR", "CHANNEL MADE", "MONEY WHILE", "YOU SLEEP?"],
        "outcome_lines": ["A CHANNEL", "THAT PAYS YOU", "WHILE YOU SLEEP"],
        "cta": "Your channel can start this week. Enrol today at CHRISCO Digital Academy, where skills pay.",
        "narration": {
            "hook": "What if your channel could earn while you sleep, without your face on camera? That is YouTube automation. And it is a system, not luck.",
            "curriculum": "Over eight weeks you go from a blank channel to a monetised machine. You pick a profitable niche, research and script videos, produce voiceover and footage, then optimise titles, thumbnails and search.",
            "outcomes": "You finish with a faceless channel launched, a production routine you can repeat, and a clear plan to reach monetisation, outsource the work and scale.",
            "proof": "This is CHRISCO Digital Academy. Nineteen practical courses, seven tracks, and one hundred percent hands on, built for youth in Jinja, in Buikwe, and across Africa.",
        },
    },
    "python-programming": {
        "hook_display": ["THE LANGUAGE", "BEHIND THE APPS", "AND THE AI", "YOU USE DAILY"],
        "outcome_lines": ["READ CODE", "WITHOUT FEAR.", "SHIP A REAL TOOL."],
        "cta": "Python is week one of a new career. Enrol today at CHRISCO Digital Academy, where African youth learn skills that actually pay.",
        "narration": {
            "hook": "It is the language behind your favourite apps, the artificial intelligence you use every day, and the automation that quietly saves companies thousands of hours.",
            "curriculum": "In eight weeks you write real code. Syntax and variables. Conditions and loops. Functions and modules. Files and data. Then your first API, and an automation script that does actual work.",
            "outcomes": "You finish able to read code without fear, solve problems with logic instead of guesswork, and ship a small Python tool you built from nothing.",
            "proof": "No theory for its own sake. At CHRISCO Digital Academy you learn by building, with nineteen practical courses across seven skill tracks.",
        },
    },
    "print-on-demand": {
        "hook_display": ["DESIGN ONCE.", "SELL FOREVER.", "NO INVENTORY.", "NO SHIPPING."],
        "outcome_lines": ["A LIVE STORE.", "ART THAT PRINTS.", "SALES ON REPEAT."],
        "cta": "Turn a design into a business. Enrol today at CHRISCO Digital Academy, where young African creators learn to earn.",
        "narration": {
            "hook": "Design once, sell forever. No stock sitting in your room, no shipping to chase, no upfront capital. Just artwork that people want to wear and hang on their walls.",
            "curriculum": "Over eight weeks you choose a niche that actually sells, prepare artwork that is truly print ready, set up your store on Redbubble, and write listings that convert browsers into buyers.",
            "outcomes": "You finish with a live store, a small catalogue of print ready designs, and a marketing routine that keeps sales moving month after month.",
            "proof": "This is CHRISCO Digital Academy, the learning platform of CHRISCO Youth Aflame. Seven tracks, nineteen courses, one hundred percent practical.",
        },
    },
    "ghostwriting": {
        "hook_display": ["SOME OF THE", "BEST PAID WRITERS", "NEVER GET", "A BYLINE"],
        "outcome_lines": ["A PORTFOLIO", "THAT WINS", "REPEAT CLIENTS"],
        "cta": "Your words can pay your bills. Enrol today at CHRISCO Digital Academy and start writing for money.",
        "narration": {
            "hook": "Some of the highest paid writers in the world never get a byline. Their words appear under someone else's name, in blogs, books, scripts and social feeds.",
            "curriculum": "In eight weeks you learn to find clients and pitch them, to write in another person's voice, and to master blogs, articles, social posts and YouTube scripts. Then pricing, and contracts that protect you.",
            "outcomes": "You finish with a portfolio that proves range, a pitch that gets replies, and the confidence to charge professional rates for work you already know how to do.",
            "proof": "CHRISCO Digital Academy trains African youth in the skills that pay. Nineteen courses, seven tracks, and real projects from day one.",
        },
    },
    "freelancing": {
        "hook_display": ["YOUR SKILL", "IS WORTH MONEY.", "GET YOUR", "FIRST CLIENT"],
        "outcome_lines": ["A LIVE PROFILE.", "REAL CLIENTS.", "REPEAT INCOME."],
        "cta": "Stop waiting to be hired. Enrol today at CHRISCO Digital Academy and build your own income.",
        "narration": {
            "hook": "Your skill is already worth money. The only thing standing between you and your first paying client is a system, and that is exactly what this course builds.",
            "curriculum": "Over eight weeks you package a service you can sell today, set up on Fiverr and Upwork, create a profile that wins attention, price your work properly, land your first client and deliver like a professional.",
            "outcomes": "You finish with a live profile, a pricing model that respects your time, and a repeatable way to win clients and keep them coming back.",
            "proof": "CHRISCO Digital Academy is built for youth who cannot wait ten years for an opportunity. Seven tracks. Nineteen courses. Skills that pay now.",
        },
    },
    "digital-marketing": {
        "hook_display": ["YOUR PHONE IS", "A STUDIO.", "YOUR LAPTOP IS", "A BUSINESS."],
        "outcome_lines": ["PLAN IT. RUN IT.", "PROVE IT WORKED."],
        "cta": "Marketing is the skill every business is willing to pay for. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Your phone is already a studio. Your laptop is already a business. What is missing is the strategy that turns attention into customers.",
            "curriculum": "In eight weeks you learn search engine optimisation, content marketing, social advertising, Google Ads basics, email marketing, and analytics, then bring all of it together in one full campaign.",
            "outcomes": "You finish able to plan a campaign end to end, spend a small budget like a professional, and prove the results with numbers a client understands.",
            "proof": "This is CHRISCO Digital Academy. Nineteen practical courses across business, design, coding, marketing, writing, video and career.",
        },
    },
    "copywriting": {
        "hook_display": ["WORDS SELL.", "ONE SENTENCE", "CAN MOVE", "A MILLION"],
        "outcome_lines": ["WRITE COPY", "THAT CONVERTS", "ON COMMAND"],
        "cta": "Every business needs words that sell. Be the person who writes them. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Words sell. A bad line costs a brand a fortune, and the right sentence moves product off the shelf. Copywriting is persuasion with a purpose and a deadline.",
            "curriculum": "Over eight weeks you study the psychology of persuasion, headlines that stop a scroll, email copy, social media copy, long sales pages, and writing that ranks in search.",
            "outcomes": "You finish with a portfolio of copy that converts, and the process behind every line, so you can repeat results for any client in any industry.",
            "proof": "CHRISCO Digital Academy. Seven skill tracks, nineteen courses, and a portfolio at the end of every one of them.",
        },
    },
    "email-marketing": {
        "hook_display": ["THE ONLY", "AUDIENCE", "YOU ACTUALLY", "OWN"],
        "outcome_lines": ["A LIST. A FUNNEL.", "REVENUE YOU", "CAN MEASURE."],
        "cta": "Build an audience you own. Enrol today at CHRISCO Digital Academy and start marketing that compounds.",
        "narration": {
            "hook": "The only audience you truly own lives in your inbox, not in an algorithm that can change overnight. Email is still the highest returning channel in marketing.",
            "curriculum": "In eight weeks you build a list ethically, choose the right platform, write emails people actually open, automate welcome sequences, segment and personalise, then read the analytics that matter.",
            "outcomes": "You finish with a working funnel, an automated sequence that runs while you sleep, and reporting that ties opens and clicks to real revenue.",
            "proof": "CHRISCO Digital Academy teaches the channels that pay. Nineteen courses, seven tracks, and projects you can show an employer or a client.",
        },
    },
    "affiliate-marketing": {
        "hook_display": ["EARN ON", "PRODUCTS YOU", "DID NOT EVEN", "CREATE"],
        "outcome_lines": ["HONEST CONTENT.", "TRACKED CLICKS.", "REAL COMMISSION."],
        "cta": "Promote what you believe in and get paid for it. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "You can earn commission on products you did not create, do not stock, and never have to ship, if you understand the system behind affiliate marketing.",
            "curriculum": "Over eight weeks you choose a niche, find the right programs, build your platform, create content that converts honestly, use search to bring free traffic, and grow an email list underneath it all.",
            "outcomes": "You finish with a live campaign, content that sells without spamming anyone, and tracking that shows exactly which clicks turn into commission.",
            "proof": "This is CHRISCO Digital Academy. Practical, income focused training for African youth across seven tracks and nineteen courses.",
        },
    },
    "social-media-marketing": {
        "hook_display": ["EVERY BRAND IS", "FIGHTING FOR", "THREE SECONDS", "OF ATTENTION"],
        "outcome_lines": ["GROW A BRAND.", "REPORT THE NUMBERS.", "GET PAID FOR IT."],
        "cta": "Every business needs someone who understands the feed. Be that person. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Every brand on earth is fighting for three seconds of attention. The people who know how to win those three seconds never run out of work.",
            "curriculum": "In eight weeks you cover platform strategy, content planning, creating with just a phone, marketing on Instagram and Facebook, growth on TikTok and YouTube, insights, and paid advertising basics.",
            "outcomes": "You finish able to grow a page for a real brand, report the numbers that matter, and walk into a business with a plan they can say yes to.",
            "proof": "CHRISCO Digital Academy. Seven tracks. Nineteen courses. A hundred percent hands on, from Jinja and Buikwe to the rest of Africa.",
        },
    },
    "swe-llm-mastery": {
        "hook_display": ["SOFTWARE PAID.", "AI PAYS MORE.", "LEARN BOTH", "TOGETHER."],
        "outcome_lines": ["AN AI APP", "DEPLOYED.", "AN ENGINEER'S HABITS."],
        "cta": "The builders of the next decade will be engineers who understand AI. Start today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Software engineering paid well for a decade. Add large language models and you are suddenly building the thing every company is now trying to hire for.",
            "curriculum": "Over eight weeks you cover engineering fundamentals, how large language models actually work, prompt engineering that holds up in production, building with APIs, AI powered apps, then testing and deployment.",
            "outcomes": "You finish with an AI application deployed and working, plus the engineering habits that let you keep building after the course ends.",
            "proof": "CHRISCO Digital Academy teaches what the market is hiring for right now. Nineteen courses across seven tracks, built for African youth.",
        },
    },
    "communicate-like-a-ceo": {
        "hook_display": ["PEOPLE DECIDE", "WHO YOU ARE", "IN SECONDS", "BEFORE YOU SPEAK"],
        "outcome_lines": ["COMMAND A ROOM.", "HANDLE THE HARD", "QUESTION."],
        "cta": "Your voice is a career skill. Train it. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "People decide who you are in seconds, long before you finish your sentence. Communication is not a soft skill. It decides whether your ideas get funded.",
            "curriculum": "In six weeks you work on executive presence, speaking with clarity and authority, body language and vocal power, public speaking, persuasive messaging, and the conversations everyone else avoids.",
            "outcomes": "You finish able to command a room, answer the hard question without losing composure, and deliver a talk at the level of a chief executive.",
            "proof": "CHRISCO Digital Academy. Nineteen practical courses, seven tracks, and real skills you use the same day you learn them.",
        },
    },
    "master-negotiation": {
        "hook_display": ["EVERYTHING", "IS NEGOTIATED.", "MOST PEOPLE", "LEAVE MONEY."],
        "outcome_lines": ["HOLD YOUR PRICE.", "CLOSE THE DEAL.", "KEEP THE RELATIONSHIP."],
        "cta": "Negotiation is a skill you can learn in weeks and use for life. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Everything is negotiated. Your salary, your rates, your rent, even what your children will eat tonight. Most people leave money on the table because nobody taught them how.",
            "curriculum": "Over six weeks you study negotiation psychology, preparation and knowing your worth, anchoring and framing, tactical empathy, handling objections and deadlock, then closing agreements that last.",
            "outcomes": "You finish able to prepare a negotiation properly, stay steady under pressure, and close a deal that both sides are happy to honour.",
            "proof": "CHRISCO Digital Academy. Seven tracks, nineteen courses, and skills that pay from the first conversation.",
        },
    },
    "ai-video-storytelling": {
        "hook_display": ["ONE PERSON", "CAN NOW MAKE", "A STUDIO", "LEVEL STORY"],
        "outcome_lines": ["A STORY SERIES", "PUBLISHED.", "A PIPELINE", "YOU REPEAT."],
        "cta": "Learn to make films with AI before everyone else does. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "One person can now produce a story that looks like a studio made it. AI has not replaced storytellers, it has given every storyteller a crew.",
            "curriculum": "In six weeks you learn story structure that holds attention, the AI tools for video creation, scripting with AI, generating visuals, voice and music, editing, and packaging for TikTok, Reels, YouTube and X.",
            "outcomes": "You finish with a published AI story series and a repeatable pipeline, so every new story takes hours instead of weeks.",
            "proof": "This is CHRISCO Digital Academy. Nineteen practical courses across seven tracks, from design and code to video and AI.",
        },
    },
    "personal-branding-visibility-is-currency": {
        "hook_display": ["INVISIBILITY", "IS EXPENSIVE.", "VISIBILITY", "IS CURRENCY."],
        "outcome_lines": ["A BRAND KIT.", "A MESSAGE", "PEOPLE REMEMBER."],
        "cta": "Become known for what you do. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Invisibility is expensive. Opportunities do not go to the most talented person in the room, they go to the person everyone remembers.",
            "curriculum": "Over six weeks you build the foundations of a personal brand, find your niche and your voice, sharpen your positioning and messaging, build an online presence, and create content that grows your authority.",
            "outcomes": "You finish with a brand kit launched and messaging that makes people remember you, plus a way to turn that visibility into actual opportunities.",
            "proof": "CHRISCO Digital Academy. Seven tracks, nineteen courses, and a team that teaches visibility as a business skill.",
        },
    },
    "ai-literacy-for-work-productivity": {
        "hook_display": ["AI WILL NOT", "TAKE YOUR JOB.", "SOMEONE USING AI", "MIGHT."],
        "outcome_lines": ["PROMPTS THAT WORK.", "HOURS BACK", "EVERY WEEK."],
        "cta": "Get fluent in AI in five weeks. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "AI will not take your job. Someone using AI will. The gap is not talent, it is fluency, and fluency can be learned in a few focused weeks.",
            "curriculum": "In five weeks you cover what AI is and what it is not, the essential toolkit, prompts that produce usable output, AI for writing and research, AI for images, documents and data, and automating everyday tasks responsibly.",
            "outcomes": "You finish with a personal AI workflow that gives you hours back every week, and the good judgement to know when not to trust it.",
            "proof": "CHRISCO Digital Academy. Nineteen courses across seven tracks, for youth who want to work smarter, not longer.",
        },
    },
    "content-creation-mastery": {
        "hook_display": ["CONSISTENCY", "BEATS TALENT.", "POST LIKE A", "PROFESSIONAL."],
        "outcome_lines": ["A THIRTY DAY", "PLAN READY", "TO PUBLISH."],
        "cta": "Stop guessing what to post. Enrol today at CHRISCO Digital Academy and build a content system.",
        "narration": {
            "hook": "Consistency beats talent. The accounts that grow are not the most creative, they are the most reliable, and reliability is a system you can learn.",
            "curriculum": "In six weeks you build content strategy and planning, create with just a phone, master photo and video basics, write captions that convert, use design tools and templates, batch your work, and grow an engaged audience.",
            "outcomes": "You finish with a thirty day content plan ready to publish, and the workflow to keep producing without burning out.",
            "proof": "CHRISCO Digital Academy. Seven skill tracks, nineteen courses, and a project at the end of every one.",
        },
    },
    "sales-marketing-full-course": {
        "hook_display": ["MARKETING GETS", "ATTENTION.", "SALES TURNS IT", "INTO MONEY."],
        "outcome_lines": ["A GO TO MARKET", "PLAN. AND THE", "CONFIDENCE TO CLOSE."],
        "cta": "Learn the two skills every business lives on. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Marketing gets attention. Sales turns attention into money. Most people learn one and wonder why the business never grows. This course teaches both.",
            "curriculum": "Over eight weeks you cover marketing fundamentals, understanding your customer, building an irresistible offer, digital channels, the psychology of selling, sales conversations and closing, then funnels, follow up and retention.",
            "outcomes": "You finish with a complete go to market plan, and a sales conversation you can run with confidence instead of fear.",
            "proof": "CHRISCO Digital Academy. Nineteen practical courses across seven tracks, built to make African youth employable and self employed.",
        },
    },
    "networking-like-the-top-1": {
        "hook_display": ["YOUR NET WORTH", "GROWS WITH", "YOUR NETWORK."],
        "outcome_lines": ["A NINETY DAY", "NETWORK PLAN.", "REAL INTRODUCTIONS."],
        "cta": "Relationships are the shortest route to opportunity. Enrol today at CHRISCO Digital Academy.",
        "narration": {
            "hook": "Your net worth grows with your network. The top one percent do not treat relationships as luck, they treat them as a skill, and even introverts can learn it.",
            "curriculum": "In five weeks you build the networking mindset, learn to network as an introvert, craft your introduction and your story, work LinkedIn and X properly, lead with value, and follow up so people remember you.",
            "outcomes": "You finish with a ninety day network plan, a story worth telling, and introductions that actually turn into opportunities.",
            "proof": "CHRISCO Digital Academy. Seven tracks, nineteen courses, and skills that open doors across Africa and beyond.",
        },
    },
}
