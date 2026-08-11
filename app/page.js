import Link from "next/link"
import Image from "next/image"
import Navbar from "./Navbar"
import Footer from "./components/Footer"
import Chatbot from "./Chatbot"
import PhotoBand from "./components/PhotoBand"
import Icon from "./components/Icon"
import { courses, categories, categoryCounts } from "./data/courses"

const skills = [
  { num: "01", icon: "palette", title: "Graphic Design", desc: "Branding, posters and visual identity with Canva and Adobe tools." },
  { num: "02", icon: "code", title: "Web Development", desc: "Modern websites and apps with HTML, CSS, JavaScript, React & Next.js." },
  { num: "03", icon: "smartphone", title: "Social Media", desc: "Strategy, content creation and growth that gets real engagement." },
  { num: "04", icon: "clapper", title: "Video Editing", desc: "Cinematic edits for YouTube, Reels and events — a skill in demand." },
  { num: "05", icon: "sparkles", title: "Animation", desc: "Motion graphics and animated content that stops the scroll." },
  { num: "06", icon: "robot", title: "AI Expertise", desc: "Leveraging AI tools like ChatGPT for creativity and productivity." },
]

const stats = [
  { value: "500+", label: "Youth Trained" },
  { value: "11", label: "Courses" },
  { value: "5+", label: "Counties" },
  { value: "100%", label: "Practical" },
]

const featured = [courses[4], courses[0], courses[10]] // Freelancing, YouTube Automation, SWE & LLM

const marqueeItems = [
  "Graphic Design", "Web Development", "Video Editing", "Social Media",
  "Python Coding", "AI Tools", "Freelancing", "Digital Marketing",
]

const steps = [
  { num: "01", icon: "search", title: "Browse & Choose", desc: "Pick from 11 practical courses across design, code, marketing, writing, video and AI." },
  { num: "02", icon: "clipboard", title: "Enroll in Minutes", desc: "Send an enrollment request — we confirm on WhatsApp or email within a day." },
  { num: "03", icon: "rocket", title: "Learn & Earn", desc: "Follow the hands-on syllabus, finish your project, earn your certificate — and start earning." },
]

export default function Home() {
  const counts = categoryCounts()

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ================= HERO ================= */}
      <section style={{ padding: "150px 0 120px", position: "relative", overflow: "hidden", background: "var(--navy)" }}>
        {/* Cinematic photo backdrop */}
        <div aria-hidden style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/bg-home.jpg" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 30%", opacity: 0.4 }} />
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(112deg, rgba(0,35,51,0.94) 0%, rgba(0,35,51,0.78) 50%, rgba(1,58,79,0.55) 100%)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(640px 320px at 88% 8%, rgba(0,255,132,0.16), transparent 62%)" }} />
        <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(0deg, var(--paper), transparent)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(255,255,255,0.16)",
              paddingBottom: 20,
              marginBottom: 48,
            }}
          >
            <span className="eyebrow on-dark fade-up">CHRISCO Digital Academy — Nairobi, Kenya</span>
            <span style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }} className="fade-up fade-up-1">
              Under CHRISCO Youth Aflame
            </span>
          </div>

          <div className="hero-grid">
            {/* Category sidebar */}
            <aside className="hero-side" style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
                Explore by Category
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href="/courses"
                    className="pill pill-dark"
                    style={{ justifyContent: "space-between", width: "100%", textDecoration: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <Icon name={cat.icon} size={15} /> {cat.name}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>{counts[cat.name] || 0}</span>
                  </Link>
                ))}
              </div>

              <div
                style={{
                  marginTop: 20,
                  background: "var(--navy)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 18,
                  padding: "20px 18px",
                  color: "#fff",
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", lineHeight: 1 }}>
                  11<span style={{ color: "var(--green)", fontSize: "1rem" }}> courses</span>
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: "8px 0 14px" }}>
                  All built for real income.
                </div>
                <Link href="/courses" className="btn btn-green btn-sm" style={{ textDecoration: "none", width: "100%" }}>
                  Browse All →
                </Link>
              </div>
            </aside>

            {/* Main hero content */}
            <div style={{ minWidth: 0 }}>
              <h1 className="display on-dark fade-up" style={{ fontSize: "clamp(2.6rem, 6vw, 4.8rem)" }}>
                Learn skills
                <br />
                that <span className="outline" style={{ WebkitTextStrokeColor: "rgba(255,255,255,0.85)" }}>pay</span>{" "}
                <span className="accent-bright">for life.</span>
              </h1>

              <p className="lead on-dark fade-up fade-up-1" style={{ maxWidth: 560, marginTop: 26 }}>
                CHRISCO Digital Academy is a modern learning platform for African youth — practical courses in
                design, code, marketing, writing, video and AI, taught by Wambete Benjamin.
              </p>

              <div className="fade-up fade-up-2" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
                <Link href="/courses" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
                  Explore Courses →
                </Link>
                <Link href="/about" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
                  Meet the Founder
                </Link>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 0,
                  borderTop: "1px solid rgba(255,255,255,0.16)",
                  marginTop: 56,
                }}
              >
                {stats.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "22px 24px 22px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.16)",
                      borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.16)" : "none",
                      paddingRight: i % 2 === 0 ? 24 : 0,
                    }}
                  >
                    <div className="stat-num" style={{ color: "#fff" }}>{s.value}</div>
                    <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: 4 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image tile */}
            <div className="fade-up fade-up-1" style={{ minWidth: 0 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    right: -10,
                    width: 120,
                    height: 120,
                    background: "rgba(0,255,132,0.25)",
                    borderRadius: "50%",
                    filter: "blur(50px)",
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow-lg)",
                    aspectRatio: "4/4.4",
                  }}
                >
                  <Image
                    src="/images/hero-tile.jpg"
                    alt="Young learner at CHRISCO Digital Academy"
                    fill
                    priority
                    sizes="(min-width: 1100px) 400px, (min-width: 768px) 45vw, 92vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    className="pill pill-green pill-sm"
                    style={{ position: "absolute", top: 18, left: 18, boxShadow: "0 6px 20px rgba(0,35,51,0.25)" }}
                  >
                    <Icon name="flame" size={13} strokeWidth={2.4} /> 500+ learners
                  </span>
                </div>

                {/* Overlay caption card */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    marginTop: -46,
                    marginLeft: 18,
                    marginRight: 18,
                    background: "var(--navy)",
                    borderRadius: 18,
                    padding: "18px 22px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: "var(--green)",
                      color: "var(--navy)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    WB
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14.5 }}>Wambete Benjamin</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Founder & Lead Instructor</div>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "var(--green)",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
                    Open
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee" style={{ background: "var(--navy)", marginTop: 96 }}>
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "flex" }} aria-hidden={dup === 1}>
              {marqueeItems.map((item, i) => (
                <span key={`${dup}-${i}`} className="marquee-item">
                  {item} <span className="dot">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= SKILLS ================= */}
      <section className="section section-paper">
        <div className="container">
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <span className="eyebrow">What you&apos;ll master</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              Six skill tracks. One mission: <span className="accent">your future.</span>
            </h2>
          </div>

          <div className="grid-3">
            {skills.map((skill, i) => (
              <div key={i} className="card card-hover" style={{ padding: "30px 28px", position: "relative" }}>
                <div className="ghost-num">{skill.num}</div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "var(--green-tint)",
                    color: "var(--green-deep)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon name={skill.icon} size={26} />
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 10 }}>{skill.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65, marginBottom: 20 }}>{skill.desc}</p>
                <Link href="/courses" className="link-arrow" style={{ fontSize: 13 }}>
                  Explore courses <span className="arr">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURSES ================= */}
      <section className="section" style={{ background: "#F4F6F4" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
            <div>
              <span className="eyebrow">Course catalogue</span>
              <h2 className="title" style={{ marginTop: 16 }}>
                Featured courses that <span className="accent">actually pay</span>
              </h2>
            </div>
            <Link href="/courses" className="btn btn-navy" style={{ textDecoration: "none" }}>
              View all 11 courses →
            </Link>
          </div>

          <div className="grid-3">
            {featured.map((course) => (
              <Link
                key={course.id}
                href="/courses"
                className="card card-hover"
                style={{ textDecoration: "none", overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                {/* Card header */}
                <div style={{ background: `linear-gradient(135deg, ${course.color[0]}, ${course.color[1]})`, padding: "28px 26px", position: "relative" }}>
                  <span
                    className="pill pill-sm"
                    style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.92)", border: "none", color: "var(--ink)" }}
                  >
                    {course.category}
                  </span>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.18)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={course.icon} size={30} strokeWidth={1.7} />
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "1.12rem", fontWeight: 800, marginBottom: 8 }}>{course.title}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18, flex: 1 }}>{course.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    <span className="pill pill-soft pill-sm"><Icon name="clock" size={13} strokeWidth={2.2} /> {course.duration}</span>
                    <span className="pill pill-soft pill-sm"><Icon name="star" size={13} strokeWidth={2.2} /> {course.rating}</span>
                    <span className="pill pill-soft pill-sm"><Icon name="users" size={13} strokeWidth={2.2} /> {course.students}</span>
                  </div>
                  <span className="link-arrow" style={{ fontSize: 13.5 }}>
                    View course <span className="arr">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section section-paper">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>How it works</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              From zero to earning — <span className="accent">in 3 steps</span>
            </h2>
          </div>

          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div className="card card-hover" style={{ padding: "34px 30px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.2rem",
                        color: "var(--green-deep)",
                      }}
                    >
                      {step.num}
                    </span>
                    <span style={{ color: "var(--ink)" }}>
                      <Icon name={step.icon} size={30} strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className="hide-mobile"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: -34,
                      zIndex: 2,
                      fontFamily: "var(--font-display)",
                      color: "var(--line-strong)",
                      fontSize: "1.4rem",
                      transform: "translateY(-50%)",
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOUNDER ================= */}
      <section className="section section-navy" style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/bg-about.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 30%", opacity: 0.08 }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">Meet the founder</span>
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", marginTop: 18 }}>
                Wambete <span className="accent-bright">Benjamin</span>
              </h2>
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "14px 0 24px" }}>
                CS Graduate · Designer · Developer · Video Editor · AI Expert
              </p>
              <p className="lead on-dark" style={{ maxWidth: 520 }}>
                Founder of CHRISCO Digital Academy under CHRISCO Youth Aflame. He built this platform so that every
                young person in Africa can learn real, practical digital skills — and turn them into real income.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "28px 0 36px" }}>
                {["Graphic Design", "Web Development", "Video Editing", "Animation", "Social Media", "AI"].map((t) => (
                  <span key={t} className="pill pill-dark pill-sm">{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-green" style={{ textDecoration: "none" }}>
                  Get In Touch →
                </Link>
                <Link href="/about" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
                  Read Our Story
                </Link>
              </div>
            </div>

            <div>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    left: -20,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "rgba(0,255,132,0.18)",
                    filter: "blur(60px)",
                  }}
                />
                <div style={{ position: "relative", aspectRatio: "4/3.2", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Image
                    src="/images/workspace.jpg"
                    alt="Creative workspace — design, code and video"
                    fill
                    sizes="(min-width: 768px) 46vw, 92vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    bottom: 20,
                    background: "rgba(0,35,51,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 16,
                    padding: "14px 18px",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "var(--green)" }}>
                    <Icon name="laptop" size={26} strokeWidth={1.7} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 13.5 }}>7+ skill areas</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>taught hands-on</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <PhotoBand
        eyebrow="Start today"
        title="Ready to build your digital career?"
        body="Real skills. Real income. Real future. Join CHRISCO Digital Academy and start learning this week."
      >
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
