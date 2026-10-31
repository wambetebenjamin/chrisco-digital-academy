import Link from "next/link"
import Image from "next/image"
import Navbar from "./Navbar"
import Footer from "./components/Footer"
import Chatbot from "./Chatbot"
import PhotoBand from "./components/PhotoBand"
import Icon from "./components/Icon"
import { courses, categories, categoryCounts, imageFor } from "./data/courses"
import { org, tutor } from "./data/org"

const skills = [
  {
    num: "01",
    icon: "palette",
    title: "Graphic Design",
    color: "#E60914",
    desc: "Branding, posters and visual identity with Canva and Adobe tools.",
  },
  {
    num: "02",
    icon: "code",
    title: "Web Development",
    color: "#084EC8",
    desc: "Modern websites and apps with HTML, CSS, JavaScript, React & Next.js.",
  },
  {
    num: "03",
    icon: "smartphone",
    title: "Social Media",
    color: "#38A128",
    desc: "Strategy, content creation and growth that gets real engagement.",
  },
  {
    num: "04",
    icon: "clapper",
    title: "Video Editing",
    color: "#EE6816",
    desc: "Cinematic edits for YouTube, Reels and events, a skill in demand.",
  },
  {
    num: "05",
    icon: "layers",
    title: "Animation",
    color: "#D99B00",
    desc: "Motion graphics and animated content that stops the scroll.",
  },
  {
    num: "06",
    icon: "robot",
    title: "AI Expertise",
    color: "#0B1D51",
    desc: "Leveraging AI tools like ChatGPT for creativity and productivity.",
  },
]

const stats = [
  { value: "500+", label: "Youth Trained", color: "#F8C90E" },
  { value: "19", label: "Courses", color: "#EE6816" },
  { value: "2", label: "Districts", color: "#38A128" },
  { value: "100%", label: "Practical", color: "#FFFFFF" },
]

const featured = [
  { ...courses[4], posterColor: "#E60914" },  // Freelancing -> Poster Red
  { ...courses[0], posterColor: "#084EC8" },  // YouTube Automation -> Poster Royal Blue
  { ...courses[10], posterColor: "#38A128" }, // SWE & LLM -> Poster Leaf Green
]

const steps = [
  {
    num: "01",
    icon: "search",
    title: "Browse & Choose",
    color: "#E60914",
    desc: "Pick from 19 practical courses across business, design, code, marketing, writing, video and AI.",
  },
  {
    num: "02",
    icon: "clipboard",
    title: "Enroll in Minutes",
    color: "#084EC8",
    desc: "Send an enrollment request, we confirm on WhatsApp or email within a day.",
  },
  {
    num: "03",
    icon: "rocket",
    title: "Learn & Build",
    color: "#38A128",
    desc: "Follow the hands-on syllabus, finish your real-world project portfolio, and start earning.",
  },
]

const CATEGORY_POSTER_COLORS = [
  "#E60914", // Red
  "#084EC8", // Royal Blue
  "#38A128", // Leaf Green
  "#EE6816", // Flame Orange
  "#D99B00", // Golden Yellow
  "#E60914", // Red
  "#084EC8", // Royal Blue
]

export default function Home() {
  const counts = categoryCounts()

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", background: "#F7F6F1" }}>
      <Navbar />

      {/* ================= HERO (POSTER ROYAL BLUE & DEEP NAVY STAGE) ================= */}
      <section
        style={{
          padding: "clamp(116px, 15vw, 160px) 0 clamp(60px, 8vw, 92px)",
          position: "relative",
          overflow: "hidden",
          background: "#003896",
          borderBottom: "4px solid #F8C90E",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(125deg, #0B1D51 0%, #003896 58%, #084EC8 100%)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(255,255,255,0.22)",
              paddingBottom: 18,
              marginBottom: 42,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 12.5,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#F8C90E",
              }}
            >
              CHRISCO YOUTH <span style={{ color: "#EE6816" }}>AFLAME</span> DIGITAL ACADEMY
            </span>
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 12.5,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#FFFFFF",
              }}
            >
              • LEARN | BUILD | IMPACT
            </span>
          </div>

          <div className="hero-grid">
            {/* Category sidebar — clean white poster sheet with hairline dividers */}
            <aside className="hero-side" style={{ minWidth: 0 }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 12,
                  border: "1px solid #DCE3F0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#0B1D51",
                    color: "#F8C90E",
                    padding: "12px 16px",
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: 11.5,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Explore by Category
                </div>
                <div>
                  {categories.map((cat, idx) => {
                    const cColor = CATEGORY_POSTER_COLORS[idx % CATEGORY_POSTER_COLORS.length]
                    return (
                      <Link
                        key={cat.name}
                        href={`/courses?category=${encodeURIComponent(cat.name)}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 16px",
                          borderBottom: "1px solid #E5E9F2",
                          textDecoration: "none",
                          color: "#0B1D51",
                          fontWeight: 700,
                          fontSize: 13.5,
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: cColor,
                              color: "#FFFFFF",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon name={cat.icon} size={13} />
                          </span>
                          <span style={{ color: cColor, fontWeight: 800 }}>{cat.name}</span>
                        </span>
                        <span style={{ color: "#0B1D51", fontWeight: 800, fontSize: 12 }}>
                          {counts[cat.name] || 0}
                        </span>
                      </Link>
                    )
                  })}
                </div>
                <div style={{ padding: "14px 16px", background: "#F7F6F1" }}>
                  <Link
                    href="/courses"
                    className="btn btn-amber btn-sm"
                    style={{ textDecoration: "none", width: "100%", fontWeight: 900 }}
                  >
                    Browse All 19 Courses →
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main hero content */}
            <div style={{ minWidth: 0 }}>
              <h1
                className="display on-dark"
                style={{ fontSize: "clamp(2.5rem, 5.8vw, 4.5rem)", lineHeight: 1.02 }}
              >
                <span style={{ color: "#F8C90E" }}>Learn skills</span>
                <br />
                that pay <span style={{ color: "#EE6816" }}>for life.</span>
              </h1>

              <p
                className="lead on-dark"
                style={{ maxWidth: 560, marginTop: 22, color: "rgba(255,255,255,0.92)" }}
              >
                CHRISCO Digital Academy is a practical learning platform for African youth — hands-on courses in
                design, code, marketing, writing, video and AI, taught by our tutors at CHRISCO Youth Aflame.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
                <Link href="/courses" className="btn btn-amber btn-lg" style={{ textDecoration: "none" }}>
                  Explore Courses →
                </Link>
                <Link href="/sign-up" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
                  Apply Free →
                </Link>
                <Link href="/about#tutor" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
                  Meet Our Tutor
                </Link>
              </div>

              {/* Stats — divided with crisp white poster lines */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 0,
                  borderTop: "1px solid rgba(255,255,255,0.24)",
                  marginTop: 48,
                }}
              >
                {stats.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "20px 24px 20px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.24)",
                      borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.24)" : "none",
                      paddingLeft: i % 2 === 1 ? 24 : 0,
                    }}
                  >
                    <div className="stat-num" style={{ color: s.color }}>{s.value}</div>
                    <div
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.85)",
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image frame — clean poster frame, no floating AI badge */}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "3px solid #FFFFFF",
                  background: "#FFFFFF",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "4/4.3" }}>
                  <Image
                    src="/images/hero-tile.jpg"
                    alt="Young learner at CHRISCO Digital Academy"
                    fill
                    priority
                    sizes="(min-width: 1100px) 400px, (min-width: 768px) 45vw, 92vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    background: "#FFFFFF",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderTop: "3px solid #E60914",
                  }}
                >
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "#E60914",
                      color: "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="cap" size={19} strokeWidth={1.9} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, color: "#0B1D51" }}>
                      CHRISCO Youth Aflame
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>500+ youth trained across East Africa</div>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#38A128",
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    Open
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4-ITEM POSTER INFO BAR (RED, BLUE, GREEN, ORANGE) ================= */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="factstrip">
            {[
              { icon: "rocket", title: "Hands-on portfolio", desc: "Build real digital projects" },
              { icon: "laptop", title: "Online & in-person", desc: "Learn from anywhere" },
              { icon: "wrench", title: "Project-based", desc: "Learn by building real work" },
              { icon: "whatsapp", title: "Fast support", desc: "Same-day help on WhatsApp" },
            ].map((f) => (
              <div key={f.title} className="factstrip-item">
                <span className="factstrip-ico"><Icon name={f.icon} size={18} strokeWidth={2} /></span>
                <div>
                  <div className="factstrip-title">{f.title}</div>
                  <div className="factstrip-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OFFICIAL TEENS AI & PROJECTS BOOTCAMP POSTER ================= */}
      <section className="section" style={{ background: "#F7F6F1", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: 460,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "2px solid #084EC8",
                  background: "#FFFFFF",
                }}
              >
                <Image
                  src="/posters/teens-ai-bootcamp-official.png"
                  alt="CHRISCO Youth Aflame Digital Academy — Teens AI & Projects Bootcamp Poster"
                  width={736}
                  height={920}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#0B1D51",
                }}
              >
                CHRISCO YOUTH <span style={{ color: "#EE6816" }}>AFLAME</span> DIGITAL ACADEMY • LEARN | BUILD | IMPACT
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4.2vw, 3.1rem)",
                  lineHeight: 1.04,
                  textTransform: "uppercase",
                  marginTop: 10,
                }}
              >
                <span style={{ color: "#E60914" }}>TEENS AI &amp;</span>
                <br />
                <span style={{ color: "#084EC8" }}>PROJECTS BOOTCAMP!</span>
              </h2>

              <p style={{ fontSize: 16, fontWeight: 600, color: "#111827", lineHeight: 1.6, marginTop: 14 }}>
                Fun AI learning &amp; creative digital projects designed for young minds.
              </p>

              {/* Exact Poster White Feature Sheet with Horizontal Dividers */}
              <div className="poster-sheet" style={{ marginTop: 20, marginBottom: 20 }}>
                <div className="poster-row">
                  <span className="poster-circle-ico" style={{ background: "#E60914" }}>
                    <Icon name="robot" size={20} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#E60914" }}>
                      • Learning AI &amp; Projects:
                    </div>
                    <div style={{ fontSize: 14, color: "#111827", marginTop: 2 }}>
                      Teen-friendly tools, prompts &amp; hands-on builds
                    </div>
                  </div>
                </div>

                <div className="poster-row">
                  <span className="poster-circle-ico" style={{ background: "#084EC8" }}>
                    <Icon name="laptop" size={20} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#084EC8" }}>
                      • Access to Digital Media:
                    </div>
                    <div style={{ fontSize: 14, color: "#111827", marginTop: 2 }}>
                      Laptop/tablet/phone required
                    </div>
                  </div>
                </div>

                <div className="poster-row">
                  <span className="poster-circle-ico" style={{ background: "#38A128" }}>
                    <Icon name="users" size={20} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#38A128" }}>
                      • Physical &amp; Team Activities:
                    </div>
                    <div style={{ fontSize: 14, color: "#111827", marginTop: 2 }}>
                      Dates &amp; venues to be communicated
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Poster 4-Item Info Strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  background: "#FFFFFF",
                  border: "1px solid #DCE3F0",
                  borderRadius: 999,
                  padding: "12px 18px",
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid #DCE3F0", paddingRight: 8 }}>
                  <span style={{ color: "#E60914", fontWeight: 900 }}>
                    <Icon name="clock" size={18} />
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", lineHeight: 1.25 }}>
                    3 Nov –<br />11 Dec 2026
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid #DCE3F0", paddingRight: 8 }}>
                  <span style={{ color: "#084EC8", fontWeight: 900 }}>
                    <Icon name="clock" size={18} />
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", lineHeight: 1.25 }}>
                    6<br />Weeks
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid #DCE3F0", paddingRight: 8 }}>
                  <span style={{ color: "#38A128", fontWeight: 900 }}>
                    <Icon name="users" size={18} />
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", lineHeight: 1.25 }}>
                    Ages<br />13+
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#EE6816", fontWeight: 900 }}>
                    <Icon name="globe" size={18} />
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", lineHeight: 1.25 }}>
                    Online<br />Classes
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href="/courses" className="btn btn-amber" style={{ textDecoration: "none", fontWeight: 900 }}>
                  Explore Courses &amp; Enroll →
                </Link>
                <Link href="/studio" className="btn btn-navy" style={{ textDecoration: "none" }}>
                  Open AI Prompt &amp; Voice Studio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SIX SKILL TRACKS (CLEAN POSTER SHEET, NO AI CARDS) ================= */}
      <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div style={{ maxWidth: 640, marginBottom: 42 }}>
            <span className="eyebrow" style={{ color: "#E60914" }}>What you&apos;ll master</span>
            <h2 className="title" style={{ marginTop: 12 }}>
              Six skill tracks. One mission: <span style={{ color: "#084EC8" }}>your future.</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              background: "#FFFFFF",
              border: "1px solid #DCE3F0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {skills.map((skill, i) => (
              <div
                key={skill.num}
                style={{
                  padding: "26px 24px",
                  borderBottom: "1px solid #DCE3F0",
                  borderRight: "1px solid #DCE3F0",
                  borderTop: `4px solid ${skill.color}`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: skill.color,
                    color: "#FFFFFF",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={skill.icon} size={22} />
                </span>
                <div>
                  <h3 style={{ fontSize: "1.12rem", fontWeight: 800, color: skill.color, marginBottom: 6 }}>
                    • {skill.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.6, marginBottom: 12 }}>
                    {skill.desc}
                  </p>
                  <Link
                    href="/courses"
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#0B1D51",
                      textDecoration: "none",
                    }}
                  >
                    Explore courses <span style={{ color: skill.color }}>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURSES (POSTER RED, BLUE, GREEN) ================= */}
      <section className="section" style={{ background: "#F7F6F1", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
            <div>
              <span className="eyebrow" style={{ color: "#EE6816" }}>Course catalogue</span>
              <h2 className="title" style={{ marginTop: 12 }}>
                Featured courses that <span style={{ color: "#38A128" }}>actually pay</span>
              </h2>
            </div>
            <Link href="/courses" className="btn btn-navy" style={{ textDecoration: "none" }}>
              View all 19 courses →
            </Link>
          </div>

          <div className="grid-3">
            {featured.map((course) => (
              <Link
                key={course.id}
                href={`/courses?course=${course.id}`}
                style={{
                  textDecoration: "none",
                  background: "#FFFFFF",
                  border: "1px solid #DCE3F0",
                  borderTop: `5px solid ${course.posterColor}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#0B1D51" }}>
                  <Image
                    src={imageFor(course)}
                    alt={course.title}
                    fill
                    sizes="(min-width: 1200px) 380px, (min-width: 768px) 45vw, 92vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: course.posterColor,
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "4px 12px",
                      borderRadius: 999,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {course.category}
                  </span>
                </div>

                <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: course.posterColor,
                        color: "#FFFFFF",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={course.icon} size={18} />
                    </span>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: course.posterColor }}>
                        {course.title}
                      </h3>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                        {course.level} · {course.duration}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13.8, color: "#1E293B", lineHeight: 1.6, marginBottom: 18, flex: 1 }}>
                    {course.desc}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid #E5E9F2",
                      paddingTop: 14,
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: "#0B1D51",
                    }}
                  >
                    <span>{course.students} learners · ★ {course.rating}</span>
                    <span style={{ color: course.posterColor }}>Open course →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TWO DEDICATED BOOK SHELVES (CLEAN DIVIDED SHEET) ================= */}
      <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div style={{ maxWidth: 680, marginBottom: 36 }}>
            <span className="eyebrow" style={{ color: "#E60914" }}>CHRISCO Online Library</span>
            <h2 className="display" style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", color: "#0B1D51", marginTop: 12 }}>
              <span style={{ color: "#E60914" }}>Christian Books</span> &amp;{" "}
              <span style={{ color: "#084EC8" }}>Course Handbooks.</span>
            </h2>
            <p style={{ color: "#1E293B", fontSize: 15.5, lineHeight: 1.7, marginTop: 10 }}>
              Sign in to read, save, and download Christian books and practical course handbooks from your Dashboard.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              background: "#FFFFFF",
              border: "1px solid #DCE3F0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Shelf A: Christian & Faith Books (Poster Red & Orange) */}
            <div
              style={{
                padding: "32px 28px",
                borderTop: "5px solid #E60914",
                borderRight: "1px solid #DCE3F0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span className="poster-circle-ico" style={{ background: "#E60914" }}>
                    <Icon name="flame" size={20} />
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 13, color: "#E60914", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Christian &amp; Faith Shelf
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.4rem", color: "#0B1D51", marginBottom: 10 }}>
                  Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn
                </h3>
                <p style={{ fontSize: 14.2, color: "#1E293B", lineHeight: 1.7, marginBottom: 22 }}>
                  A biblical study from Genesis 37 to 50 on dreams, character, private integrity, and appointed fulfillment, published by CHRISCO Youth Aflame.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href="/library/joseph-7-lessons-emerging-seer-prophet"
                  className="btn btn-red btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Open &amp; Share Christian Book →
                </Link>
                <Link
                  href="/library?shelf=christian"
                  className="btn btn-outline btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Christian Shelf
                </Link>
              </div>
            </div>

            {/* Shelf B: Digital Skill & Learning Books (Poster Royal Blue & Green) */}
            <div
              style={{
                padding: "32px 28px",
                borderTop: "5px solid #084EC8",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span className="poster-circle-ico" style={{ background: "#084EC8" }}>
                    <Icon name="cap" size={20} />
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 13, color: "#084EC8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Skill &amp; Learning Shelf
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.4rem", color: "#0B1D51", marginBottom: 10 }}>
                  19 Illustrated Digital Skill Course Handbooks
                </h3>
                <p style={{ fontSize: 14.2, color: "#1E293B", lineHeight: 1.7, marginBottom: 22 }}>
                  Practical study guides for Python, AI, YouTube Automation, Executive Communication, Copywriting, Print on Demand, and 13 more digital tracks.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href="/library?shelf=learning"
                  className="btn btn-navy btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Browse All 19 Learning Books →
                </Link>
                <Link
                  href="/library"
                  className="btn btn-outline-green btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Full Library
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TUTOR (POSTER ROYAL BLUE & GOLDEN YELLOW) ================= */}
      <section
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#003896",
          color: "#FFFFFF",
          borderBottom: "4px solid #EE6816",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark" style={{ color: "#F8C90E" }}>Meet our tutor</span>
              <h2 className="display on-dark" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", marginTop: 16 }}>
                Taught by people who <span style={{ color: "#F8C90E" }}>do the work.</span>
              </h2>
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#EE6816", margin: "14px 0 22px" }}>
                {tutor.role}, CHRISCO Youth Aflame
              </p>
              <p className="lead on-dark" style={{ maxWidth: 520, color: "rgba(255,255,255,0.9)" }}>
                Every class is led by our lead tutor: a Computer Science graduate who works daily in design,
                development, video and AI. CHRISCO Digital Academy is a learning platform of CHRISCO Youth Aflame,
                operating under CHRISCO Fellowship of Churches International.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "24px 0 32px" }}>
                {[
                  { name: "Graphic Design", bg: "#E60914" },
                  { name: "Web Development", bg: "#084EC8" },
                  { name: "Video Editing", bg: "#EE6816" },
                  { name: "Animation", bg: "#38A128" },
                  { name: "Social Media", bg: "#F8C90E", text: "#0B1D51" },
                  { name: "AI", bg: "#0B1D51" },
                ].map((t) => (
                  <span
                    key={t.name}
                    style={{
                      background: t.bg,
                      color: t.text || "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 800,
                      padding: "6px 14px",
                      borderRadius: 999,
                    }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-amber" style={{ textDecoration: "none" }}>
                  Get In Touch →
                </Link>
                <Link href="/become-a-tutor" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
                  Become a Tutor
                </Link>
              </div>
            </div>

            <div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "3px solid #FFFFFF",
                  background: "#FFFFFF",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image
                    src="/images/workspace.jpg"
                    alt="Creative workspace, design, code and video"
                    fill
                    sizes="(min-width: 768px) 46vw, 92vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    background: "#FFFFFF",
                    color: "#0B1D51",
                    padding: "14px 18px",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    borderTop: "3px solid #38A128",
                  }}
                >
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "#38A128",
                      color: "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="laptop" size={20} strokeWidth={1.9} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#38A128", fontSize: 14 }}>
                      7+ Practical Skill Tracks
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>Hands-on project mentorship</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (3-ITEM POSTER SHEET: RED, BLUE, GREEN) ================= */}
      <section className="section" style={{ background: "#F7F6F1" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 44px" }}>
            <span className="eyebrow" style={{ justifyContent: "center", color: "#E60914" }}>How it works</span>
            <h2 className="title" style={{ marginTop: 12 }}>
              From zero to earning <span style={{ color: "#084EC8" }}>in 3 steps</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              background: "#FFFFFF",
              border: "1px solid #DCE3F0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={step.num}
                style={{
                  padding: "30px 26px",
                  borderRight: i < steps.length - 1 ? "1px solid #DCE3F0" : "none",
                  borderTop: `5px solid ${step.color}`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: step.color,
                    color: "#FFFFFF",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <h3 style={{ fontSize: "1.12rem", fontWeight: 800, color: step.color, marginBottom: 8 }}>
                    • {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.68 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <PhotoBand
        eyebrow="Start today"
        title="Ready to build your digital career?"
        body="Real skills. Real income. Real future. Join CHRISCO Digital Academy and start learning this week."
      >
        <Link href="/sign-up" className="btn btn-amber btn-lg" style={{ textDecoration: "none" }}>
          Create Free Account →
        </Link>
        <a href="https://wa.me/254112272061" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
          <Icon name="whatsapp" size={17} /> WhatsApp Us
        </a>
        <Link href="/courses" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
          Browse Courses →
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
