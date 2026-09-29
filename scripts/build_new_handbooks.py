#!/usr/bin/env python3
"""Generate branded, self-contained HTML course handbooks for the new CHRISCO courses.
These are the downloadable study books learners can read offline."""
import os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "courses")
os.makedirs(OUT, exist_ok=True)

COURSES = [
    {
        "slug": "communicate-like-a-ceo", "title": "Communicate Like a CEO",
        "tag": "Speak like the 1% elite", "cat": "Business", "dur": "6 Weeks", "level": "All Levels",
        "intro": "Communication is the number-one skill that separates leaders from followers. In this course you learn to speak with the authority, clarity and presence of a top CEO — so people listen, trust and follow you.",
        "modules": [
            ("Executive presence & mindset", "Build the inner confidence and self-image of a leader before you say a single word."),
            ("Speaking with clarity & authority", "Structure your thoughts and speak in clear, powerful, concise sentences."),
            ("Body language & vocal power", "Use posture, eye contact, pace and tone to command any room."),
            ("Public speaking & presentations", "Plan and deliver talks and pitches that move people to action."),
            ("Persuasive, confident messaging", "Frame your ideas so they land — influence without pressure."),
            ("Handling difficult conversations", "Give feedback, say no, and handle conflict with calm authority."),
            ("Communicating on camera & online", "Show up powerfully on video calls, livestreams and social."),
            ("Final project — Deliver a CEO-level talk", "Record and deliver a 3-minute leadership talk and get feedback."),
        ],
        "outcome": "You will speak, present and lead with the confidence and polish of the top 1%.",
    },
    {
        "slug": "negotiation", "title": "Master Negotiation",
        "tag": "Negotiate like the world's best", "cat": "Business", "dur": "6 Weeks", "level": "All Levels",
        "intro": "Everything in life is a negotiation — your salary, your rates, your deals, your relationships. Learn the proven strategies of the world's best negotiators to get what you're worth without conflict.",
        "modules": [
            ("Negotiation psychology & mindset", "Understand what really drives every negotiation and how to stay in control."),
            ("Preparation & knowing your worth", "Do the homework that wins deals before they begin."),
            ("Anchoring & framing", "Set the terms and shape how the other side sees the deal."),
            ("Tactical empathy & listening", "Use listening as a weapon to uncover what the other side truly wants."),
            ("Handling objections & pushback", "Turn 'no' into 'yes' calmly and confidently."),
            ("Salary, rates & business deals", "Ask for more money and better terms — and get them."),
            ("Closing win-win agreements", "Lock in deals that both sides feel good about."),
            ("Final project — Live negotiation simulation", "Run a full negotiation role-play and debrief your wins."),
        ],
        "outcome": "You will confidently negotiate money, deals and opportunities like a professional.",
    },
    {
        "slug": "ai-video-storytelling", "title": "AI Video Storytelling",
        "tag": "Make videos & stories with AI", "cat": "Video", "dur": "6 Weeks", "level": "Beginner",
        "intro": "Stories sell, teach and go viral. Learn to use AI tools to create videos and stories fast, then package them for every platform and every audience.",
        "modules": [
            ("Story fundamentals that hook attention", "The story structures that keep people watching to the end."),
            ("AI tools for video creation", "The best AI apps for scripts, visuals, voice and editing."),
            ("Scriptwriting with AI", "Write compelling scripts in minutes using smart prompts."),
            ("Generating visuals, voice & music", "Create images, voiceovers and soundtracks with AI."),
            ("Editing & short-form formats", "Cut punchy videos for reels, shorts and TikTok."),
            ("Packaging for TikTok, Reels, YouTube & X", "Format, caption and title videos for each platform."),
            ("Storytelling for different audiences", "Adapt one story for youth, business, and general audiences."),
            ("Final project — Publish an AI story series", "Produce and post a 3-part AI video story."),
        ],
        "outcome": "You will create and publish professional AI-powered video stories for any audience.",
    },
    {
        "slug": "personal-branding", "title": "Personal Branding: Visibility Is Currency",
        "tag": "Stand out — visibility is currency", "cat": "Business", "dur": "6 Weeks", "level": "All Levels",
        "intro": "In today's world, the people who are seen win. Learn to build a magnetic personal brand that makes you stand out, get remembered, and attract opportunities.",
        "modules": [
            ("Personal brand foundations", "Discover what a personal brand is and why visibility is currency."),
            ("Finding your niche & unique voice", "Identify what makes you different and valuable."),
            ("Positioning & messaging", "Craft a clear message that makes people 'get' you instantly."),
            ("Building a standout online presence", "Optimise your profiles so you look like the go-to person."),
            ("Content that grows your authority", "Post content that builds trust and grows your following."),
            ("Networking your brand", "Get your name into the right rooms and conversations."),
            ("Monetizing your personal brand", "Turn visibility into clients, jobs and income."),
            ("Final project — Launch your brand kit", "Build your bio, profiles and first content plan."),
        ],
        "outcome": "You will have a clear, standout personal brand that opens doors.",
    },
    {
        "slug": "ai-literacy", "title": "AI Literacy for Work & Productivity",
        "tag": "AI basics for work & productivity", "cat": "Business", "dur": "5 Weeks", "level": "Beginner",
        "intro": "AI is the new electricity. This beginner course teaches you to use everyday AI tools to work faster, study smarter and get more done — no tech background needed.",
        "modules": [
            ("What AI is (and isn't)", "Understand AI in plain language and what it can do for you."),
            ("The essential AI toolkit", "The free and low-cost AI tools every young person should know."),
            ("Writing effective prompts", "Ask AI the right way to get great results every time."),
            ("AI for writing & research", "Draft, summarise and research in a fraction of the time."),
            ("AI for images, docs & data", "Create graphics, documents and simple analysis with AI."),
            ("Automating everyday tasks", "Save hours by letting AI handle repetitive work."),
            ("Using AI responsibly & safely", "Stay accurate, ethical and safe with your data."),
            ("Final project — Your AI productivity workflow", "Build a personal AI routine for work or study."),
        ],
        "outcome": "You will use AI confidently and productively in daily work and study.",
    },
    {
        "slug": "content-creation", "title": "Content Creation Mastery",
        "tag": "Create content that grows brands", "cat": "Marketing", "dur": "6 Weeks", "level": "Beginner",
        "intro": "Content is how brands and creators grow. Learn to plan and create scroll-stopping photos, videos, captions and carousels consistently — even with just a phone.",
        "modules": [
            ("Content strategy & planning", "Decide what to post, why, and for whom."),
            ("Creating with just a phone", "Shoot great content with the device in your pocket."),
            ("Photo & video basics", "Lighting, framing and editing that look professional."),
            ("Writing captions that convert", "Hook readers and drive action with words."),
            ("Design tools & templates", "Create clean graphics fast with free tools."),
            ("Batching & a content calendar", "Create a week of content in one sitting."),
            ("Growing & engaging an audience", "Turn viewers into a loyal community."),
            ("Final project — A 30-day content plan", "Build a full month of ready-to-post content."),
        ],
        "outcome": "You will create consistent, high-quality content for yourself or clients.",
    },
    {
        "slug": "sales-and-marketing", "title": "Sales & Marketing Full Course",
        "tag": "Sell and market anything", "cat": "Marketing", "dur": "8 Weeks", "level": "All Levels",
        "intro": "The complete guide to attracting customers and closing sales. Master both marketing (getting attention) and sales (turning attention into income).",
        "modules": [
            ("Marketing fundamentals", "The core principles behind every successful business."),
            ("Understanding your customer", "Know exactly who you serve and what they want."),
            ("Building an irresistible offer", "Package your product so people want to buy."),
            ("Digital marketing channels", "Use social, content and ads to reach customers."),
            ("The psychology of selling", "Understand why people buy — and how to help them decide."),
            ("Sales conversations & closing", "Pitch, handle objections and close with confidence."),
            ("Funnels, follow-up & retention", "Keep customers coming back and referring others."),
            ("Final project — Full go-to-market plan", "Build a complete plan to launch and sell an offer."),
        ],
        "outcome": "You will confidently market and sell any product or service.",
    },
    {
        "slug": "networking-secrets", "title": "Networking Like the Top 1%",
        "tag": "Network like the top 1% (even as an introvert)", "cat": "Business", "dur": "5 Weeks", "level": "All Levels",
        "intro": "Your network is your net worth. Learn to build genuine, powerful relationships that open doors — even if you're shy or introverted.",
        "modules": [
            ("The networking mindset", "Rethink networking as giving value, not asking favours."),
            ("Networking as an introvert", "Build a strong network without draining yourself."),
            ("Crafting your intro & story", "Introduce yourself in a way people remember."),
            ("Online networking (LinkedIn & X)", "Connect with the right people from anywhere."),
            ("Adding value first", "Become someone others want to know and help."),
            ("Building real relationships", "Turn contacts into genuine, lasting connections."),
            ("Following up & staying memorable", "Nurture relationships so they pay off over time."),
            ("Final project — Your 90-day network plan", "Map and start building your key relationships."),
        ],
        "outcome": "You will build a powerful network that creates real opportunities.",
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title} — CHRISCO Digital Academy</title>
<style>
  :root {{
    --teal:#002333; --green:#00FF84; --green-deep:#00994f;
    --ink:#06202E; --paper:#FAFAF6; --muted:#5f6e76; --line:#E3E9E7;
  }}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif; background:var(--paper); color:var(--ink); line-height:1.7; }}
  .wrap {{ max-width:820px; margin:0 auto; padding:0 22px 80px; }}
  header.hero {{ background:var(--teal); color:#fff; padding:56px 22px 46px; }}
  .hero-inner {{ max-width:820px; margin:0 auto; }}
  .brand {{ font-size:13px; letter-spacing:.16em; text-transform:uppercase; color:var(--green); font-weight:700; }}
  h1 {{ font-size:clamp(2rem,5vw,3rem); line-height:1.05; margin:14px 0 10px; font-weight:800; letter-spacing:-.02em; }}
  .tag {{ color:rgba(255,255,255,.82); font-size:1.05rem; }}
  .meta {{ display:flex; gap:10px; flex-wrap:wrap; margin-top:22px; }}
  .pill {{ border:1px solid rgba(255,255,255,.28); color:#fff; border-radius:999px; padding:7px 16px; font-size:13px; font-weight:600; }}
  .pill.green {{ background:var(--green); color:var(--teal); border-color:var(--green); }}
  section {{ margin-top:44px; }}
  h2 {{ font-size:1.5rem; font-weight:800; letter-spacing:-.01em; margin-bottom:14px; }}
  h2 .bar {{ display:inline-block; width:26px; height:4px; background:var(--green); border-radius:3px; margin-right:12px; vertical-align:middle; }}
  .lead {{ font-size:1.08rem; color:#243b45; }}
  .module {{ background:#fff; border:1px solid var(--line); border-radius:18px; padding:20px 22px; margin-bottom:14px; box-shadow:0 1px 2px rgba(0,0,0,.03); }}
  .module .n {{ display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:9px; background:var(--teal); color:var(--green); font-weight:800; font-size:14px; margin-right:12px; }}
  .module h3 {{ display:inline; font-size:1.1rem; font-weight:700; }}
  .module p {{ margin-top:10px; color:var(--muted); }}
  .callout {{ background:var(--teal); color:#fff; border-radius:22px; padding:30px 28px; }}
  .callout .green {{ color:var(--green); }}
  .cta {{ display:inline-block; margin-top:18px; background:var(--green); color:var(--teal); text-decoration:none; font-weight:800; padding:14px 26px; border-radius:999px; }}
  footer {{ margin-top:56px; border-top:1px solid var(--line); padding-top:24px; color:var(--muted); font-size:14px; text-align:center; }}
  @media print {{ .cta {{ display:none; }} body {{ background:#fff; }} }}
</style>
</head>
<body>
  <header class="hero">
    <div class="hero-inner">
      <div class="brand">CHRISCO Digital Academy · Course Handbook</div>
      <h1>{title}</h1>
      <p class="tag">{tag}</p>
      <div class="meta">
        <span class="pill green">{cat}</span>
        <span class="pill">{level}</span>
        <span class="pill">{dur}</span>
        <span class="pill">Certificate included</span>
      </div>
    </div>
  </header>

  <div class="wrap">
    <section>
      <h2><span class="bar"></span>About this course</h2>
      <p class="lead">{intro}</p>
    </section>

    <section>
      <h2><span class="bar"></span>What you'll learn</h2>
      {modules}
    </section>

    <section>
      <div class="callout">
        <h2 style="color:#fff"><span class="bar"></span>By the end</h2>
        <p><span class="green">Outcome:</span> {outcome}</p>
        <a class="cta" href="https://wa.me/254112272061">Enroll on WhatsApp →</a>
      </div>
    </section>

    <footer>
      <strong>CHRISCO Digital Academy</strong> — under CHRISCO Youth Aflame · Jinja &amp; Buikwe, Uganda<br/>
      Email: shambetz@gmail.com · WhatsApp: +254 112 272 061 · Founder: Wambete Benjamin<br/>
      © 2026 CHRISCO Digital Academy — practical skills that pay for life.
    </footer>
  </div>
</body>
</html>
"""

MOD_TPL = '<div class="module"><span class="n">{i}</span><h3>{name}</h3><p>{desc}</p></div>'

for c in COURSES:
    mods = "\n      ".join(
        MOD_TPL.format(i=i + 1, name=html.escape(m[0]), desc=html.escape(m[1]))
        for i, m in enumerate(c["modules"])
    )
    doc = TEMPLATE.format(
        title=html.escape(c["title"]), tag=html.escape(c["tag"]), cat=c["cat"],
        level=c["level"], dur=c["dur"], intro=html.escape(c["intro"]),
        modules=mods, outcome=html.escape(c["outcome"]),
    )
    path = os.path.join(OUT, c["slug"] + ".html")
    with open(path, "w") as f:
        f.write(doc)
    print("wrote", path)

print("done:", len(COURSES), "handbooks")
