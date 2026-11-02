import Link from "next/link"
import Navbar from "./Navbar"
import Footer from "./components/Footer"
import Chatbot from "./Chatbot"
import UcuHeroSlider from "./components/UcuHeroSlider"
import Icon from "./components/Icon"
import { courses, categories, categoryCounts, imageFor } from "./data/courses"
import { org, tutor } from "./data/org"

const SCHOOL_CARDS = [
  {
    name: "Business",
    schoolTitle: "School of Business, Freelancing & Sales",
    color: "#E60914",
    image: "/images/cat-business.jpg",
    summary:
      "Client acquisition, global freelancing platforms, high-ticket sales, affiliate systems, and contract negotiation.",
  },
  {
    name: "Coding & Tech",
    schoolTitle: "School of Coding & Software Engineering",
    color: "#084EC8",
    image: "/images/cat-coding.jpg",
    summary:
      "Python automation, modern full-stack web applications, software engineering workflows, and LLM integration.",
  },
  {
    name: "Design",
    schoolTitle: "School of Graphic Design & Print-on-Demand",
    color: "#38A128",
    image: "/images/cat-design.jpg",
    summary:
      "Brand identity, church and commercial poster systems, typography, and global print-on-demand e-commerce.",
  },
  {
    name: "Video & AI",
    schoolTitle: "School of Video Production & AI Media",
    color: "#EE6816",
    image: "/images/cat-video.jpg",
    summary:
      "YouTube automation, AI video storytelling, prompt engineering literacy, and short-form content production.",
  },
  {
    name: "Marketing",
    schoolTitle: "School of Digital & Growth Marketing",
    color: "#D99B00",
    image: "/images/cat-marketing.jpg",
    summary:
      "Full-funnel digital campaigns, social media growth systems, conversion funnels, and lifecycle email marketing.",
  },
  {
    name: "Writing",
    schoolTitle: "School of Copywriting & Editorial Publishing",
    color: "#E60914",
    image: "/images/cat-writing.jpg",
    summary:
      "Direct-response copywriting, executive ghostwriting, landing page persuasion, and digital book publishing.",
  },
  {
    name: "Career",
    schoolTitle: "School of Executive Leadership & Career Growth",
    color: "#084EC8",
    image: "/images/cat-career.jpg",
    summary:
      "Personal branding, high-trust professional networking, and executive communication for young Christian leaders.",
  },
]

const JOURNEY_CARDS = [
  {
    title: "Join CHRISCO Digital Academy",
    eyebrow: "19 Free Practical Courses",
    color: "#E60914",
    image: "/images/bg-home.jpg",
    desc: "Enroll free of charge in any of our 19 practical digital tracks and build a real portfolio that opens doors.",
    cta: "Apply Now",
    href: "/sign-up",
  },
  {
    title: "e-Learning & PDF Library",
    eyebrow: "20 Free Textbooks & Handbooks",
    color: "#084EC8",
    image: "/images/bg-courses.jpg",
    desc: "Download 19 step-by-step course handbooks plus our dedicated Christian & Faith youth leadership book shelf.",
    cta: "Open e-Learning",
    href: "/library",
  },
  {
    title: "AI, Voice & SEO Studio",
    eyebrow: "Hands-On Innovation Lab",
    color: "#38A128",
    image: "/images/hero-tile.jpg",
    desc: "Practice prompt engineering with Open-Higgsfield, spoken narration with VoiceStudio, and live Open-SEO audits.",
    cta: "Launch Studio",
    href: "/studio",
  },
  {
    title: "Teens AI & Projects Bootcamp",
    eyebrow: "3 Nov – 11 Dec 2026 (5 Weeks)",
    color: "#EE6816",
    image: "/images/workspace.jpg",
    desc: "Holiday practical bootcamp for teens: AI Prompt Engineering, Coding, Graphic Design, Video & App Building.",
    cta: "Apply Now",
    href: "https://forms.gle/ChriscoTeensAIBootcamp",
    external: true,
  },
]

const RESEARCH_AND_STUDIO_ITEMS = [
  {
    date: "OPEN-HIGGSFIELD ENGINE • AI PROMPT LAB",
    color: "#E60914",
    image: "/images/courses/ai-video-storytelling.jpg",
    title: "Camera-Aware Visual Prompt Engineering & Multi-Shot Storyboard Direction Across 19 Courses",
    href: "/studio",
  },
  {
    date: "VOICESTUDIO NARRATOR • AUDIO HANDBOOKS",
    color: "#084EC8",
    image: "/images/courses/ai-literacy.jpg",
    title: "Neural Spoken-Word Study Narration & Custom Voice Profiles for All 20 Academy Books",
    href: "/studio",
  },
  {
    date: "OPEN-SEO WORKSPACE • TECHNICAL AUDIT",
    color: "#38A128",
    image: "/images/courses/digital-marketing.jpg",
    title: "100-Point Technical SEO Grader, SERP CTR Simulator & Automated JSON-LD Schema Generator",
    href: "/studio",
  },
  {
    date: "CHRISTIAN BOOKS SHELF • YOUTH DISCIPLESHIP",
    color: "#EE6816",
    image: "/images/campus-student-focus.jpg",
    title: "Walking in Wisdom: A Christian Youth Guide to Purpose, Integrity & Digital Stewardship",
    href: "/library/walking-in-wisdom",
  },
]

const TESTIMONIALS = [
  {
    name: "Brian Mwangi",
    school: "School of Coding & Software Engineering (Python & SWE/LLM Mastery)",
    color: "#E60914",
    image: "/images/campus-student-focus.jpg",
    quote:
      "Joining CHRISCO Digital Academy transformed how I build software. Within weeks of completing the Python and SWE/LLM modules, I automated client workflows and delivered my first paid web application.",
  },
  {
    name: "Grace Wanjiku",
    school: "School of Business & Digital Marketing (Freelancing & Social Media)",
    color: "#084EC8",
    image: "/images/bg-about.jpg",
    quote:
      "The step-by-step PDF handbooks and practical assignments helped me package my social media and copywriting services clearly. I now manage digital retainers for local businesses in Nairobi.",
  },
  {
    name: "Kevin Otieno",
    school: "School of Video Production & AI Media (YouTube Automation & AI Video)",
    color: "#38A128",
    image: "/images/hero-tile.jpg",
    quote:
      "Using the Open-Higgsfield Prompt Studio and VoiceStudio narrator on the portal, I launched a faceless educational channel and elevated our youth ministry media production.",
  },
]

const COUNCIL_UNITS = [
  {
    num: "01",
    color: "#E60914",
    title: "Curriculum & Practical Syllabus Board",
    desc: "Designing project-based modules and real-world deliverables across all 19 courses.",
    href: "/courses",
  },
  {
    num: "02",
    color: "#084EC8",
    title: "AI, Voice & SEO Innovation Lab",
    desc: "Maintaining Open-Higgsfield, VoiceStudio narration, and Open-SEO technical workspaces.",
    href: "/studio",
  },
  {
    num: "03",
    color: "#38A128",
    title: "Christian Youth Discipleship & Ethics",
    desc: "Anchoring practical digital mastery in Biblical character under CHRISCO Youth Aflame.",
    href: "/library?shelf=christian",
  },
  {
    num: "04",
    color: "#EE6816",
    title: "Teens AI & Projects Bootcamp Directorate",
    desc: "Running the 5-week November–December holiday bootcamp for teens ages 13–19.",
    href: "#teens-bootcamp",
  },
  {
    num: "05",
    color: "#D99B00",
    title: "Digital Repository & Book Publishing",
    desc: "Curating 20 free downloadable PDF handbooks and audio-narrated study guides.",
    href: "/library",
  },
  {
    num: "06",
    color: "#0B1D51",
    title: "Central & Eastern District Outreach",
    desc: "Equipping over 500 young people across church districts with mentorship and skills.",
    href: "/about",
  },
]

const NEWS_ARTICLES = [
  {
    date: "NOVEMBER 2, 2026",
    category: "ADMISSIONS & BOOTCAMP",
    color: "#E60914",
    image: "/posters/teens-ai-bootcamp-official.png",
    title: "Registration Now Open for the 5-Week Teens AI & Projects Bootcamp (3 Nov – 11 Dec 2026)",
    excerpt:
      "Teens and parents can now register online via our official Google Form for 5 weeks of hands-on AI Prompt Engineering, Coding, Design, Video Production, and App Building.",
    href: "https://forms.gle/ChriscoTeensAIBootcamp",
    external: true,
  },
  {
    date: "OCTOBER 28, 2026",
    category: "AI & INNOVATION STUDIO",
    color: "#084EC8",
    image: "/images/courses/swe-llm-mastery.jpg",
    title: "CHRISCO Digital Academy Integrates Open-Higgsfield, VoiceStudio & Open-SEO Workspaces",
    excerpt:
      "Learners across all 19 courses now have browser-native access to camera-aware AI prompt engineering, neural voice narration, and 100-point SEO auditing.",
    href: "/studio",
  },
  {
    date: "OCTOBER 20, 2026",
    category: "DIGITAL LIBRARY",
    color: "#38A128",
    image: "/images/campus-library-mentorship.jpg",
    title: "All 20 Christian & Digital Skill Handbooks Available for Free PDF Download",
    excerpt:
      "Our dual-shelf digital repository pairs 19 complete course textbooks with our Christian youth leadership book shelf at zero cost.",
    href: "/library",
  },
  {
    date: "OCTOBER 14, 2026",
    category: "PURSUE COLLECTION",
    color: "#EE6816",
    image: "/images/cat-design.jpg",
    title: "Official PURSUE Studio Apparel Collection Supports Free Youth Digital Training",
    excerpt:
      "Explore 29 studio-crafted hoodies, tees, caps, mugs, and totes that directly sponsor free internet data, mentorship, and learning devices.",
    href: "/shop",
  },
]

const PARTNERS = [
  { name: "CHRISCO Fellowship of Churches Int'l", badge: "Parent Fellowship", color: "#0B1D51" },
  { name: "CHRISCO Youth Aflame", badge: "Central & Eastern Districts", color: "#E60914" },
  { name: "Open-Higgsfield Studio", badge: "AI Prompt Lab", color: "#084EC8" },
  { name: "VoiceStudio Neural Audio", badge: "Book Narration", color: "#38A128" },
  { name: "Open-SEO Audit Engine", badge: "Technical SEO", color: "#EE6816" },
  { name: "Chatwoot Live Desk", badge: "24/7 Student Support", color: "#D99B00" },
]

export default function Home() {
  const counts = categoryCounts()

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", background: "#F7F6F1" }}>
      <Navbar />

      {/* ================= 1. UCU-STYLE FULL-WIDTH PHOTOGRAPHIC HERO SLIDER ================= */}
      <UcuHeroSlider />

      {/* ================= 2. UCU-STYLE 3-COLUMN ADMISSIONS & WELCOME STRIP ================= */}
      <section
        aria-label="Admissions and Student Pathways"
        style={{
          background: "#0B1D51",
          borderBottom: "4px solid #E60914",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          }}
        >
          {/* Box 1: Call for Applications */}
          <div
            style={{
              background: "#E60914",
              color: "#FFFFFF",
              padding: "30px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#F8C90E",
                  marginBottom: 8,
                }}
              >
                NOVEMBER – DECEMBER 2026 INTAKE
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.45rem",
                  lineHeight: 1.2,
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                Call for Applications
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.92)", margin: 0 }}>
                We are now accepting applications for all 19 free digital courses and the 5-week Teens AI &amp; Projects Bootcamp.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/sign-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#0B1D51",
                  color: "#F8C90E",
                  border: "2px solid #F8C90E",
                  padding: "9px 18px",
                  borderRadius: 6,
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Apply Now →
              </Link>
              <a
                href="https://forms.gle/ChriscoTeensAIBootcamp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FFFFFF",
                  color: "#0B1D51",
                  padding: "9px 16px",
                  borderRadius: 6,
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Teens Google Form →
              </a>
            </div>
          </div>

          {/* Box 2: Teens & Regional Cohorts (matches UCU International Students slot) */}
          <div
            style={{
              background: "#003896",
              color: "#FFFFFF",
              padding: "30px 28px",
              borderLeft: "1px solid rgba(255,255,255,0.14)",
              borderRight: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#F8C90E",
                  marginBottom: 8,
                }}
              >
                CENTRAL &amp; EASTERN DISTRICTS + ONLINE
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.45rem",
                  lineHeight: 1.2,
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                Youth &amp; Teens Cohorts
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                CHRISCO Digital Academy welcomes youth across our church districts in Kenya and online learners across East Africa.
              </p>
            </div>
            <div>
              <a
                href="#teens-bootcamp"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#F8C90E",
                  fontFamily: "var(--font-head)",
                  fontSize: 13.5,
                  fontWeight: 800,
                  textDecoration: "none",
                  borderBottom: "2px solid #F8C90E",
                  paddingBottom: 2,
                }}
              >
                read more →
              </a>
            </div>
          </div>

          {/* Box 3: Prospective Students */}
          <div
            style={{
              background: "#38A128",
              color: "#FFFFFF",
              padding: "30px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                7 PRACTICAL SCHOOLS • 19 COURSES
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.45rem",
                  lineHeight: 1.2,
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                Prospective Students
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.92)", margin: 0 }}>
                Interested in joining CHRISCO Digital Academy? Explore our 19 free courses, 20 PDF handbooks, and AI Studio.
              </p>
            </div>
            <div>
              <Link
                href="/courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#0B1D51",
                  color: "#FFFFFF",
                  padding: "9px 18px",
                  borderRadius: 6,
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. UCU-STYLE "WHY CHRISCO DIGITAL ACADEMY" SPLIT SECTION ================= */}
      <section
        id="teens-bootcamp"
        style={{
          padding: "clamp(64px, 9vw, 108px) 0",
          background: "#FFFFFF",
          borderBottom: "3px solid #084EC8",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 44,
              alignItems: "stretch",
            }}
          >
            {/* Left Column: UCU-style 2 side-by-side tall visual cards (Official Poster + Campus Lab Showcase) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 18,
                alignItems: "stretch",
              }}
            >
              {/* Card A: Official Uploaded Teens AI & Projects Bootcamp Poster */}
              <div
                style={{
                  background: "#0B1D51",
                  borderRadius: 10,
                  border: "3px solid #E60914",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ position: "relative", background: "#003896", padding: 10 }}>
                  <img
                    src="/posters/teens-ai-bootcamp-official.png"
                    alt="CHRISCO Youth Aflame Digital Academy — Teens AI & Projects Bootcamp (3rd Nov - 11th Dec 2026)"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: 6,
                    }}
                  />
                </div>
                <div style={{ padding: "16px 18px", background: "#0B1D51", color: "#FFFFFF" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 10.5,
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#F8C90E",
                      marginBottom: 4,
                    }}
                  >
                    OFFICIAL BOOTCAMP POSTER
                  </div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
                    Teens AI &amp; Projects Bootcamp (3 Nov – 11 Dec)
                  </div>
                  <a
                    href="https://forms.gle/ChriscoTeensAIBootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "10px 14px",
                      background: "#E60914",
                      color: "#FFFFFF",
                      borderRadius: 6,
                      fontFamily: "var(--font-head)",
                      fontSize: 12.5,
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    Register via Google Form →
                  </a>
                </div>
              </div>

              {/* Card B: Campus Digital Lab & Video Highlight (matches UCU second tall visual card) */}
              <div
                style={{
                  background: "#003896",
                  borderRadius: 10,
                  border: "3px solid #F8C90E",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    minHeight: 280,
                    flex: 1,
                    backgroundImage: "url('/images/campus-library-mentorship.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 18,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(11,29,81,0.12) 0%, rgba(11,29,81,0.86) 100%)",
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 1, color: "#FFFFFF" }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: "#38A128",
                        color: "#FFFFFF",
                        padding: "4px 10px",
                        borderRadius: 4,
                        fontFamily: "var(--font-head)",
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      HANDS-ON MENTORSHIP
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        lineHeight: 1.25,
                        color: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      Practical Labs, 20 PDF Handbooks &amp; AI Studio
                    </h3>
                  </div>
                </div>

                <div style={{ padding: "16px 18px", background: "#003896", color: "#FFFFFF" }}>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.88)", margin: "0 0 12px" }}>
                    Every course combines guided mentorship with real-world portfolio projects and free PDF textbooks.
                  </p>
                  <Link
                    href="/studio"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "10px 14px",
                      background: "#F8C90E",
                      color: "#0B1D51",
                      borderRadius: 6,
                      fontFamily: "var(--font-head)",
                      fontSize: 12.5,
                      fontWeight: 900,
                      textDecoration: "none",
                    }}
                  >
                    Explore AI &amp; Voice Studio →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: UCU-style "Why CHRISCO Digital Academy" + 6 Bullet Links + Stat Counters + Apply Now */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#E60914",
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 28, height: 3, background: "#E60914", display: "inline-block" }} />
                A CENTRE OF EXCELLENCE IN DIGITAL SKILLS
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.85rem, 3.2vw, 2.65rem)",
                  lineHeight: 1.12,
                  color: "#0B1D51",
                  marginBottom: 18,
                }}
              >
                Why CHRISCO Digital Academy
              </h2>

              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "#1E293B", marginBottom: 14 }}>
                CHRISCO Digital Academy is the practical digital training platform of{" "}
                <strong>CHRISCO Youth Aflame</strong>, operating under{" "}
                <strong>CHRISCO Fellowship of Churches International</strong>. Founded to bridge the gap between
                classroom theory and real-world digital livelihoods, we equip young people across our church districts
                and online with high-demand technical, creative, and entrepreneurial skills.
              </p>

              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", marginBottom: 22 }}>
                Every learner receives 100% free access to 19 structured courses, 20 downloadable PDF handbooks, neural
                audio study guides, and direct mentorship from Lead Tutor <strong>{tutor.name}</strong>.
              </p>

              {/* UCU-style 2-Column Bulleted Programme Links (6 items) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "10px 20px",
                  padding: "18px 20px",
                  background: "#F7F6F1",
                  borderLeft: "5px solid #084EC8",
                  borderRadius: "0 8px 8px 0",
                  marginBottom: 26,
                }}
              >
                {[
                  { label: "Coding, Python & SWE/LLM", href: "/courses?category=Coding%20%26%20Tech", color: "#084EC8" },
                  { label: "Graphic Design & Print-on-Demand", href: "/courses?category=Design", color: "#E60914" },
                  { label: "AI Literacy & Video Storytelling", href: "/courses?category=Video%20%26%20AI", color: "#38A128" },
                  { label: "Digital, Social & Email Marketing", href: "/courses?category=Marketing", color: "#EE6816" },
                  { label: "Freelancing, Sales & Affiliates", href: "/courses?category=Business", color: "#0B1D51" },
                  { label: "Copywriting, Books & CEO Comms", href: "/courses?category=Writing", color: "#D99B00" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 9,
                      fontFamily: "var(--font-head)",
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: "#0B1D51",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* UCU-style Large Counters + Apply Now Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                  paddingTop: 18,
                  borderTop: "2px solid #DCE3F0",
                }}
              >
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.35rem",
                        lineHeight: 1,
                        color: "#E60914",
                      }}
                    >
                      19
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#0B1D51",
                        marginTop: 4,
                      }}
                    >
                      Programmes &amp; Courses
                    </div>
                  </div>

                  <div style={{ borderLeft: "2px solid #DCE3F0", paddingLeft: 24 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.35rem",
                        lineHeight: 1,
                        color: "#084EC8",
                      }}
                    >
                      500+
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#0B1D51",
                        marginTop: 4,
                      }}
                    >
                      Youth Trained
                    </div>
                  </div>

                  <div style={{ borderLeft: "2px solid #DCE3F0", paddingLeft: 24 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.35rem",
                        lineHeight: 1,
                        color: "#38A128",
                      }}
                    >
                      20
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#0B1D51",
                        marginTop: 4,
                      }}
                    >
                      Free PDF Books
                    </div>
                  </div>
                </div>

                <Link
                  href="/sign-up"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#E60914",
                    color: "#FFFFFF",
                    padding: "13px 26px",
                    borderRadius: 6,
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Apply Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. UCU-STYLE "TO THE JOURNEY AHEAD / GAIN VALUABLE KNOWLEDGE AND EXPERIENCE" 4-CARD BAND ================= */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 96px) 0",
          background: "#0B1D51",
          color: "#FFFFFF",
          borderBottom: "4px solid #F8C90E",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#F8C90E",
                marginBottom: 8,
              }}
            >
              To the Journey Ahead
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                lineHeight: 1.15,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Gain Valuable Knowledge and Experience
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 22,
            }}
          >
            {JOURNEY_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#FFFFFF",
                  color: "#0B1D51",
                  borderRadius: 10,
                  overflow: "hidden",
                  borderTop: `6px solid ${card.color}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      height: 175,
                      backgroundImage: `url('${card.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: 12,
                        background: card.color,
                        color: "#FFFFFF",
                        padding: "4px 10px",
                        borderRadius: 4,
                        fontFamily: "var(--font-head)",
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {card.eyebrow}
                    </span>
                  </div>
                  <div style={{ padding: "20px 20px 14px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 18,
                        fontWeight: 900,
                        color: "#0B1D51",
                        marginBottom: 8,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p style={{ fontSize: 13.8, lineHeight: 1.6, color: "#334155", margin: 0 }}>{card.desc}</p>
                  </div>
                </div>

                <div style={{ padding: "0 20px 20px" }}>
                  {card.external ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 16px",
                        background: card.color,
                        color: "#FFFFFF",
                        borderRadius: 6,
                        fontFamily: "var(--font-head)",
                        fontSize: 12.5,
                        fontWeight: 800,
                        textDecoration: "none",
                      }}
                    >
                      {card.cta} →
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 16px",
                        background: card.color,
                        color: "#FFFFFF",
                        borderRadius: 6,
                        fontFamily: "var(--font-head)",
                        fontSize: 12.5,
                        fontWeight: 800,
                        textDecoration: "none",
                      }}
                    >
                      {card.cta} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. UCU-STYLE "OUR RESEARCH / EXPLORE OUR DIGITAL STUDIO & REPOSITORY" SECTION ================= */}
      <section
        style={{
          padding: "clamp(64px, 8.5vw, 100px) 0",
          background: "#F7F6F1",
          borderBottom: "3px solid #DCE3F0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 38,
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#E60914",
                  marginBottom: 8,
                }}
              >
                Our Research, Books &amp; Innovation
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 2.8vw, 2.4rem)",
                  lineHeight: 1.15,
                  color: "#0B1D51",
                  marginBottom: 10,
                }}
              >
                Explore Our Digital Studio &amp; Book Repository
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", margin: 0 }}>
                At CHRISCO Digital Academy, we pair practical curriculum handbooks with open-source AI, Voice, and SEO
                laboratories so students learn by publishing real work.
              </p>
            </div>
            <Link
              href="/studio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#003896",
                color: "#FFFFFF",
                padding: "11px 20px",
                borderRadius: 6,
                fontFamily: "var(--font-head)",
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Read More →
            </Link>
          </div>

          {/* 4-Card Research & Studio Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 22,
              marginBottom: 32,
            }}
          >
            {RESEARCH_AND_STUDIO_ITEMS.map((item) => (
              <article
                key={item.title}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: "1px solid #DCE3F0",
                  borderTop: `5px solid ${item.color}`,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      height: 170,
                      backgroundImage: `url('${item.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: "18px 20px" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: item.color,
                        marginBottom: 8,
                      }}
                    >
                      {item.date}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 16,
                        fontWeight: 800,
                        lineHeight: 1.4,
                        color: "#0B1D51",
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div style={{ padding: "0 20px 18px" }}>
                  <Link
                    href={item.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--font-head)",
                      fontSize: 13,
                      fontWeight: 800,
                      color: item.color,
                      textDecoration: "none",
                    }}
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* UCU-style 2 Institutional Repository Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/studio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#003896",
                color: "#FFFFFF",
                border: "2px solid #0B1D51",
                padding: "13px 24px",
                borderRadius: 6,
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              <Icon name="sparkles" size={16} /> CHRISCO AI, Voice &amp; SEO Studio →
            </Link>

            <Link
              href="/library"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#E60914",
                color: "#FFFFFF",
                border: "2px solid #E60914",
                padding: "13px 24px",
                borderRadius: 6,
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              <Icon name="book" size={16} /> CHRISCO Digital Institutional Book Repository (20 PDFs) →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 6. UCU-STYLE "WE ARE OPEN FOR OPPORTUNITIES! + SCHOOLS & FACULTIES" GRID ================= */}
      <section
        style={{
          padding: "clamp(64px, 8.5vw, 100px) 0",
          background: "#FFFFFF",
          borderBottom: "3px solid #003896",
        }}
      >
        <div className="container">
          {/* Top Callout Banner matching UCU "We Are Open For Opportunities!" */}
          <div
            style={{
              background: "linear-gradient(125deg, #0B1D51 0%, #003896 60%, #084EC8 100%)",
              border: "3px solid #F8C90E",
              borderRadius: 12,
              padding: "clamp(24px, 4vw, 38px)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 44,
            }}
          >
            <div style={{ maxWidth: 680 }}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#F8C90E",
                  marginBottom: 6,
                }}
              >
                We Are Open For Opportunities!
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 2.7vw, 2.25rem)",
                  lineHeight: 1.18,
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                Schools &amp; Practical Faculties at CHRISCO Digital Academy
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                We have 19 free practical programmes across 7 specialised schools designed to prepare you for remote
                work, entrepreneurship, software engineering, and digital ministry.
              </p>
            </div>
            <Link
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#E60914",
                color: "#FFFFFF",
                border: "2px solid #F8C90E",
                padding: "13px 24px",
                borderRadius: 6,
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              View All 19 Programmes →
            </Link>
          </div>

          {/* 7 Schools & Faculties Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {SCHOOL_CARDS.map((school) => {
              const schoolCourses = courses.filter((c) => c.category === school.name)
              return (
                <div
                  key={school.name}
                  style={{
                    background: "#F7F6F1",
                    borderRadius: 10,
                    border: "1px solid #DCE3F0",
                    borderTop: `6px solid ${school.color}`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        height: 175,
                        backgroundImage: `url('${school.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background: school.color,
                          color: "#FFFFFF",
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontFamily: "var(--font-head)",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {counts[school.name] || schoolCourses.length} Programmes
                      </span>
                    </div>

                    <div style={{ padding: "20px 22px 14px" }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-head)",
                          fontSize: 18,
                          fontWeight: 900,
                          color: "#0B1D51",
                          marginBottom: 8,
                        }}
                      >
                        {school.schoolTitle}
                      </h3>
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#334155", marginBottom: 14 }}>
                        {school.summary}
                      </p>

                      {/* Course list inside this school */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                        {schoolCourses.map((c) => (
                          <Link
                            key={c.id}
                            href={`/courses?category=${encodeURIComponent(school.name)}&course=${encodeURIComponent(c.id)}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "7px 10px",
                              background: "#FFFFFF",
                              border: "1px solid #E2E8F0",
                              borderRadius: 6,
                              fontFamily: "var(--font-head)",
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: "#0B1D51",
                              textDecoration: "none",
                            }}
                          >
                            <span>• {c.title}</span>
                            <span style={{ color: school.color, fontSize: 11, fontWeight: 800 }}>{c.duration}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "0 22px 20px" }}>
                    <Link
                      href={`/courses?category=${encodeURIComponent(school.name)}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontFamily: "var(--font-head)",
                        fontSize: 13,
                        fontWeight: 800,
                        color: school.color,
                        textDecoration: "none",
                      }}
                    >
                      Explore {school.name} School →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= 7. UCU-STYLE REGIONAL REACH ("SPREAD ACROSS DISTRICTS") + "TESTIMONIALS" SECTION ================= */}
      <section
        style={{
          padding: "clamp(64px, 8.5vw, 100px) 0",
          background: "#003896",
          color: "#FFFFFF",
          borderBottom: "4px solid #E60914",
        }}
      >
        <div className="container">
          {/* Regional Reach Header (matches UCU "Spread over 5 regions / We Are One Of The Largest...") */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
              alignItems: "center",
              paddingBottom: 48,
              marginBottom: 48,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#F8C90E",
                  marginBottom: 8,
                }}
              >
                Spread Across 2 CHRISCO Districts &amp; Online Across East Africa
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 3vw, 2.4rem)",
                  lineHeight: 1.15,
                  color: "#FFFFFF",
                  marginBottom: 14,
                }}
              >
                We Are One Of The Most Practical Faith-Anchored Digital Academies
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                Operating under CHRISCO Fellowship of Churches International, our cohorts bring hands-on digital labs,
                holiday teen bootcamps, and 24/7 online e-learning to youth across Central District, Eastern District,
                Nairobi, and beyond.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              {[
                { title: "Central District Hub", sub: "Youth Aflame Training Centres", color: "#E60914" },
                { title: "Eastern District Hub", sub: "Regional Practical Bootcamps", color: "#38A128" },
                { title: "Nairobi Teens Cohort", sub: "3 Nov – 11 Dec 2026 Intake", color: "#EE6816" },
                { title: "Online e-Learning", sub: "19 Courses • 20 Free PDF Books", color: "#F8C90E" },
              ].map((hub) => (
                <div
                  key={hub.title}
                  style={{
                    background: "#0B1D51",
                    borderLeft: `5px solid ${hub.color}`,
                    padding: "16px 18px",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, color: "#FFFFFF" }}>
                    {hub.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)", marginTop: 4 }}>{hub.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section (matches UCU 3 Student Testimonial Cards) */}
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 36px" }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#F8C90E",
                marginBottom: 6,
              }}
            >
              Testimonials
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.7rem, 2.8vw, 2.3rem)",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Voices From Our Students &amp; Youth Cohorts
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "#FFFFFF",
                  color: "#0B1D51",
                  borderRadius: 10,
                  borderTop: `6px solid ${t.color}`,
                  padding: "26px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 18,
                }}
              >
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#1E293B", fontStyle: "italic", margin: 0 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 14, borderTop: "1px solid #E2E8F0" }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `3px solid ${t.color}`,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 15.5, color: "#0B1D51" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: t.color, marginTop: 2 }}>{t.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 8. UCU-STYLE "UPCOMING EVENTS" + "OFFICE OF THE LEAD TUTOR & MENTORSHIP COUNCIL" ================= */}
      <section
        style={{
          padding: "clamp(64px, 8.5vw, 100px) 0",
          background: "#F7F6F1",
          borderBottom: "3px solid #DCE3F0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* Left Column: Upcoming Events (matches UCU Upcoming Events with Flyer + Date/Time/Venue) */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#E60914",
                  marginBottom: 6,
                }}
              >
                Academy Calendar
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.65rem, 2.6vw, 2.2rem)",
                  color: "#0B1D51",
                  marginBottom: 22,
                }}
              >
                Upcoming Events
              </h2>

              {/* Event Card 1: Teens AI & Projects Bootcamp */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: "2px solid #0B1D51",
                  borderTop: "6px solid #E60914",
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  }}
                >
                  <div style={{ background: "#003896", padding: 12, display: "flex", alignItems: "center" }}>
                    <img
                      src="/posters/teens-ai-bootcamp-official.png"
                      alt="Teens AI & Projects Bootcamp Event Poster"
                      style={{ width: "100%", height: "auto", borderRadius: 6, display: "block" }}
                    />
                  </div>
                  <div style={{ padding: "22px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          background: "#E60914",
                          color: "#FFFFFF",
                          padding: "3px 10px",
                          borderRadius: 4,
                          fontFamily: "var(--font-head)",
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        FEATURED HOLIDAY BOOTCAMP
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-head)",
                          fontSize: 18,
                          fontWeight: 900,
                          color: "#0B1D51",
                          marginBottom: 12,
                        }}
                      >
                        Teens AI &amp; Projects Bootcamp (5-Week Practical Cohort)
                      </h3>

                      <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "#334155", marginBottom: 16 }}>
                        <div>
                          <strong style={{ color: "#0B1D51" }}>Date:</strong> 3rd November – 11th December 2026
                        </div>
                        <div>
                          <strong style={{ color: "#0B1D51" }}>Time:</strong> Mon – Fri, 9:00 AM – 4:00 PM EAT
                        </div>
                        <div>
                          <strong style={{ color: "#0B1D51" }}>Venue:</strong> CHRISCO Youth Aflame Digital Hubs &amp; Live Online
                        </div>
                        <div>
                          <strong style={{ color: "#0B1D51" }}>Tracks:</strong> AI Prompt Engineering, Coding, Graphic Design, Video &amp; App Building
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a
                        href="https://forms.gle/ChriscoTeensAIBootcamp"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#38A128",
                          color: "#FFFFFF",
                          padding: "9px 16px",
                          borderRadius: 6,
                          fontFamily: "var(--font-head)",
                          fontSize: 12.5,
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        Register on Google Form →
                      </a>
                      <Link
                        href="/courses/ai-literacy"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#084EC8",
                          color: "#FFFFFF",
                          padding: "9px 16px",
                          borderRadius: 6,
                          fontFamily: "var(--font-head)",
                          fontSize: 12.5,
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        View Syllabus →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Card 2: Weekly Saturday Portfolio & Freelancing Clinic */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: "1px solid #DCE3F0",
                  borderLeft: "6px solid #084EC8",
                  padding: "18px 22px",
                }}
              >
                <div style={{ fontFamily: "var(--font-head)", fontSize: 11, fontWeight: 800, color: "#084EC8", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  WEEKLY PRACTICAL LAB • OPEN TO ALL ENROLLED STUDENTS
                </div>
                <h3 style={{ fontFamily: "var(--font-head)", fontSize: 16.5, fontWeight: 900, color: "#0B1D51", margin: "6px 0 8px" }}>
                  Saturday Digital Portfolio, GitHub &amp; Freelance Pitch Review
                </h3>
                <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>
                  <strong>Date:</strong> Every Saturday &nbsp;|&nbsp; <strong>Time:</strong> 9:00 AM – 1:00 PM EAT &nbsp;|&nbsp; <strong>Venue:</strong> Online &amp; District Hubs
                </div>
              </div>
            </div>

            {/* Right Column: Office of the Lead Tutor + Numbered 01-06 Academy Mentorship Council (matches UCU Vice Chancellor + Senate) */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#084EC8",
                  marginBottom: 6,
                }}
              >
                Academic Leadership &amp; Governance
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.65rem, 2.6vw, 2.2rem)",
                  color: "#0B1D51",
                  marginBottom: 22,
                }}
              >
                Office of the Lead Tutor
              </h2>

              {/* Lead Tutor Profile Box (matches UCU Office of the Vice Chancellor card) */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: "1px solid #DCE3F0",
                  borderTop: "6px solid #003896",
                  padding: "22px",
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
                  <img
                    src="/images/bg-contact.jpg"
                    alt={tutor.name}
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 10,
                      objectFit: "cover",
                      border: "3px solid #F8C90E",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#E60914",
                      }}
                    >
                      {tutor.role} • {tutor.Badge}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        color: "#0B1D51",
                        margin: "4px 0",
                      }}
                    >
                      {tutor.name}
                    </h3>
                    <div style={{ fontSize: 13, color: "#334155" }}>
                      CHRISCO Youth Aflame Digital Academy • Central &amp; Eastern Districts
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 13.8, lineHeight: 1.65, color: "#334155", marginBottom: 16 }}>
                  {tutor.bio}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    paddingTop: 12,
                    borderTop: "1px solid #E2E8F0",
                  }}
                >
                  <Link href="/about" style={{ fontFamily: "var(--font-head)", fontSize: 12.5, fontWeight: 800, color: "#084EC8", textDecoration: "none" }}>
                    Read More →
                  </Link>
                  <Link href="/become-a-tutor" style={{ fontFamily: "var(--font-head)", fontSize: 12.5, fontWeight: 800, color: "#E60914", textDecoration: "none" }}>
                    Become a Tutor →
                  </Link>
                  <Link href="/contact" style={{ fontFamily: "var(--font-head)", fontSize: 12.5, fontWeight: 800, color: "#38A128", textDecoration: "none" }}>
                    Contact Office →
                  </Link>
                </div>
              </div>

              {/* Academy Mentorship & Curriculum Council (matches UCU Senate 01-06 numbered list) */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: "1px solid #DCE3F0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#0B1D51",
                    color: "#F8C90E",
                    padding: "13px 18px",
                    fontFamily: "var(--font-head)",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Academy Mentorship &amp; Curriculum Council (01 – 06)
                </div>

                <div>
                  {COUNCIL_UNITS.map((unit) => (
                    <Link
                      key={unit.num}
                      href={unit.href}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "13px 18px",
                        borderBottom: "1px solid #E2E8F0",
                        textDecoration: "none",
                        color: "#0B1D51",
                      }}
                    >
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: unit.color,
                          color: "#FFFFFF",
                          fontFamily: "var(--font-display)",
                          fontSize: 13,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {unit.num}
                      </span>
                      <div>
                        <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, color: "#0B1D51" }}>
                          {unit.title}
                        </div>
                        <div style={{ fontSize: 12.5, color: "#475569", marginTop: 2 }}>{unit.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. UCU-STYLE "APPLY FOR ADMISSION" BANNER + "A GLIMPSE OF CHRISCO DIGITAL ACADEMY" ================= */}
      <section
        style={{
          padding: "clamp(56px, 7.5vw, 88px) 0",
          background: "linear-gradient(125deg, #0B1D51 0%, #003896 55%, #084EC8 100%)",
          color: "#FFFFFF",
          borderBottom: "4px solid #F8C90E",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 36,
              alignItems: "center",
            }}
          >
            {/* Left: Apply for Admission */}
            <div>
              <span
                style={{
                  display: "inline-block",
                  background: "#E60914",
                  color: "#FFFFFF",
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontFamily: "var(--font-head)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                ADMISSIONS OPEN • 100% FREE TUITION
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.85rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.15,
                  color: "#FFFFFF",
                  marginBottom: 14,
                }}
              >
                Apply for Admission to CHRISCO Digital Academy
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", marginBottom: 22 }}>
                Create your free learner account to enroll in any of our 19 practical digital courses, download 20 PDF
                handbooks, or register a teen for the 3rd November – 11th December 2026 Teens AI &amp; Projects Bootcamp.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/sign-up"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#E60914",
                    color: "#FFFFFF",
                    border: "2px solid #F8C90E",
                    padding: "13px 24px",
                    borderRadius: 6,
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Apply for Admission →
                </Link>
                <a
                  href="https://forms.gle/ChriscoTeensAIBootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#38A128",
                    color: "#FFFFFF",
                    padding: "13px 22px",
                    borderRadius: 6,
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Teens Bootcamp Google Form →
                </a>
              </div>
            </div>

            {/* Right: "A Glimpse of CHRISCO Digital Academy" Visual Showcase (matches UCU "A Glimpse of UCU") */}
            <div
              style={{
                background: "#0B1D51",
                borderRadius: 12,
                border: "3px solid #F8C90E",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 240,
                  backgroundImage: "url('/images/workspace.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(11, 29, 81, 0.45)",
                  }}
                />
                <Link
                  href="/studio"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#E60914",
                    color: "#FFFFFF",
                    border: "2px solid #F8C90E",
                    padding: "14px 24px",
                    borderRadius: 999,
                    fontFamily: "var(--font-head)",
                    fontSize: 13.5,
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                  }}
                >
                  <Icon name="play" size={16} /> A Glimpse of CHRISCO Digital Academy
                </Link>
              </div>
              <div
                style={{
                  padding: "16px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 800, color: "#F8C90E" }}>
                  LEARN • BUILD • IMPACT — Inside Our Practical Digital Labs
                </span>
                <Link
                  href="/courses"
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    textDecoration: "none",
                  }}
                >
                  Browse All 19 Courses →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. UCU-STYLE "LATEST NEWS & ARTICLES" (4-CARD GRID) + "OUR PARTNERS" STRIP ================= */}
      <section
        style={{
          padding: "clamp(64px, 8.5vw, 100px) 0",
          background: "#FFFFFF",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 36,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#E60914",
                  marginBottom: 6,
                }}
              >
                Campus Updates &amp; Announcements
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 2.8vw, 2.4rem)",
                  color: "#0B1D51",
                  margin: 0,
                }}
              >
                Latest News &amp; Articles
              </h2>
            </div>

            <Link
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#0B1D51",
                color: "#FFFFFF",
                padding: "10px 18px",
                borderRadius: 6,
                fontFamily: "var(--font-head)",
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              View All Updates →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))",
              gap: 22,
              marginBottom: 64,
            }}
          >
            {NEWS_ARTICLES.map((news) => (
              <article
                key={news.title}
                style={{
                  background: "#F7F6F1",
                  borderRadius: 10,
                  border: "1px solid #DCE3F0",
                  borderTop: `5px solid ${news.color}`,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      height: 180,
                      backgroundImage: `url('${news.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: "18px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontFamily: "var(--font-head)",
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: news.color,
                        marginBottom: 8,
                      }}
                    >
                      <span>{news.date}</span>
                      <span>•</span>
                      <span>{news.category}</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 16,
                        fontWeight: 900,
                        lineHeight: 1.38,
                        color: "#0B1D51",
                        marginBottom: 10,
                      }}
                    >
                      {news.title}
                    </h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#334155", margin: 0 }}>{news.excerpt}</p>
                  </div>
                </div>

                <div style={{ padding: "0 20px 18px" }}>
                  {news.external ? (
                    <a
                      href={news.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 13,
                        fontWeight: 800,
                        color: news.color,
                        textDecoration: "none",
                      }}
                    >
                      Read More →
                    </a>
                  ) : (
                    <Link
                      href={news.href}
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 13,
                        fontWeight: 800,
                        color: news.color,
                        textDecoration: "none",
                      }}
                    >
                      Read More →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* UCU-style "Our Partners" Institutional Strip */}
          <div
            style={{
              borderTop: "2px solid #DCE3F0",
              paddingTop: 40,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#084EC8",
                  marginBottom: 4,
                }}
              >
                Institutional Fellowship &amp; Open-Source Ecosystem
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.45rem",
                  color: "#0B1D51",
                  margin: 0,
                }}
              >
                Our Partners &amp; Platforms
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              {PARTNERS.map((p) => (
                <div
                  key={p.name}
                  style={{
                    background: "#F7F6F1",
                    border: "1px solid #DCE3F0",
                    borderTop: `4px solid ${p.color}`,
                    borderRadius: 8,
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 13.5, color: "#0B1D51" }}>
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 11,
                      fontWeight: 800,
                      color: p.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: 4,
                    }}
                  >
                    {p.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
