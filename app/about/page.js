import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import Reveal from "../components/Reveal"
import AccentShapes from "../components/AccentShapes"

export const metadata = {
  title: "About Us",
  description:
    "CHRISCO Digital Academy is a youth-focused learning platform under CHRISCO Youth Aflame, founded by Wambete Benjamin — bridging the digital divide with practical, affordable digital skills training across Africa.",
}

const stats = [
  { number: "500+", label: "Youth Trained" },
  { number: "19", label: "Courses Available" },
  { number: "2", label: "Districts (Jinja & Buikwe)" },
  { number: "100%", label: "Practical Skills" },
]

const founderTags = [
  { icon: "cap", label: "CS Graduate" },
  { icon: "palette", label: "Designer" },
  { icon: "code", label: "Developer" },
  { icon: "clapper", label: "Video Editor" },
  { icon: "robot", label: "AI Expert" },
]

const values = [
  { icon: "globe", title: "Accessible", desc: "Affordable, beginner-friendly learning for every young person in Africa." },
  { icon: "wrench", title: "Practical", desc: "Every course ends with a real project you can show — and sell." },
  { icon: "users", title: "Mentorship", desc: "Learn directly from a founder who works in these fields every day." },
  { icon: "flame", title: "Community", desc: "Join a growing family of young creators, coders and entrepreneurs." },
]

export default function About() {
  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-about.jpg" position="center 35%" />
      <Navbar />

      {/* HERO */}
      <PhotoHero
        image="/images/bg-about.jpg"
        eyebrow="About us"
        title={
          <>
            Building Africa&apos;s <span className="outline" style={{ WebkitTextStrokeColor: "rgba(255,255,255,0.85)" }}>digital</span>{" "}
            <span className="accent-bright">future.</span>
          </>
        }
        titleStyle={{ maxWidth: 900 }}
        lead="CHRISCO Digital Academy is a youth-focused learning platform under CHRISCO Youth Aflame — equipping young Africans with practical digital skills that open real doors."
      />

      {/* STATS */}
      <section className="section-veil" style={{ padding: "56px 0 44px" }}>
        <div className="container">
          <div
            className="fade-up fade-up-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 0,
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "26px 24px 26px 0",
                  borderRight: i % 2 === 0 ? "1px solid var(--line)" : "none",
                  borderBottom: i < 2 ? "1px solid var(--line)" : "none",
                }}
              >
                <div className="stat-num" style={{ color: "var(--green-deep)" }}>{s.number}</div>
                <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section section-frost">
        <div className="container">
          <div className="split">
            <div>
              <span className="eyebrow">Who we are</span>
              <h2 className="title" style={{ marginTop: 16 }}>
                Born from a passion to see <span className="accent">youth thrive</span>
              </h2>
              <p className="lead" style={{ marginTop: 22 }}>
                We exist to bridge the digital divide. Too many young people have talent and ambition — but not the
                practical skills to turn them into income. CHRISCO Digital Academy fixes that.
              </p>
              <p className="lead" style={{ marginTop: 16 }}>
                Founded by <strong style={{ color: "var(--ink)" }}>Wambete Benjamin</strong> — a Computer Science
                graduate with hands-on expertise in graphic design, web development, video editing, animation,
                social media and AI.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
                {founderTags.map((t) => (
                  <span key={t.label} className="pill pill-soft">
                    <Icon name={t.icon} size={14} strokeWidth={2.1} /> {t.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ position: "relative" }}>
                <div className="zoom-media shine" style={{ position: "relative", aspectRatio: "4/3.4", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "var(--shadow-lg)" }}>
                  <Image
                    src="/images/hero-tile.jpg"
                    alt="Learner at CHRISCO Digital Academy"
                    fill
                    loading="lazy"
                    quality={80}
                    sizes="(min-width: 768px) 46vw, 92vw"
                    style={{ objectFit: "cover", filter: "saturate(1.15) contrast(1.04)" }}
                  />
                </div>
                <span
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    background: "var(--navy)",
                    color: "#fff",
                    fontFamily: "var(--font-head)",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "8px 16px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Icon name="pin" size={13} strokeWidth={2.2} /> Made in Uganda
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section section-frost-alt">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Our purpose</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              Mission & <span className="accent">vision</span>
            </h2>
          </div>

          <div className="grid-2" style={{ alignItems: "stretch" }}>
            <div style={{ background: "var(--navy)", borderRadius: "var(--radius-xl)", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "rgba(0,255,132,0.12)", top: -80, right: -80, filter: "blur(50px)" }} />
              <span style={{ display: "inline-flex", width: 62, height: 62, borderRadius: 18, background: "rgba(0,255,132,0.14)", color: "var(--green)", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Icon name="target" size={30} strokeWidth={1.7} />
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--green)", fontSize: "1.3rem", marginBottom: 16 }}>OUR MISSION</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "1.02rem" }}>
                To bridge the digital divide by providing accessible, affordable and practical digital education to
                youth across Uganda and beyond.
              </p>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-xl)", padding: "48px 40px", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ display: "inline-flex", width: 62, height: 62, borderRadius: 18, background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Icon name="globe" size={30} strokeWidth={1.7} />
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontSize: "1.3rem", marginBottom: 16 }}>OUR VISION</h3>
              <p style={{ color: "var(--body)", lineHeight: 1.8, fontSize: "1.02rem" }}>
                A generation of digitally empowered African youth creating solutions, building businesses and leading
                transformation across the continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section section-frost">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: 56 }}>
            <span className="eyebrow">What we stand for</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              The values behind <span className="accent">every course</span>
            </h2>
          </div>
          <div className="grid-4">
            {values.map((v, i) => (
              <Reveal key={i} variant="up" delay={i * 90} className="card card-hover card-frost shine" style={{ padding: "30px 26px" }}>
                <span style={{ display: "inline-flex", width: 52, height: 52, borderRadius: 15, background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={v.icon} size={24} />
                </span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: "var(--navy)", color: "rgba(255,255,255,0.78)" }}>
        <div className="kenburns-media" aria-hidden>
          <div className="kenburns-slow" style={{ position: "absolute", inset: 0 }}>
            <Image
              src="/images/bg-courses.jpg"
              alt=""
              fill
              loading="lazy"
              quality={78}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 40%", filter: "saturate(1.15) contrast(1.04)" }}
            />
          </div>
        </div>
        <div aria-hidden className="scrim-band" />
        <div aria-hidden className="aurora" style={{ opacity: 0.4 }} />
        <AccentShapes variant="soft" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="split" style={{ alignItems: "center" }}>
            <Reveal variant="left">
              <span className="eyebrow on-dark">Founder & lead instructor</span>
              <h2 className="display on-dark" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", marginTop: 18, textShadow: "0 2px 24px rgba(0,18,28,0.45)" }}>
                Wambete <span className="accent-bright">Benjamin</span>
              </h2>
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "14px 0 22px" }}>
                CS Graduate · Designer · Developer · AI Expert
              </p>
              <p className="lead on-dark" style={{ maxWidth: 540, color: "rgba(255,255,255,0.9)", textShadow: "0 1px 16px rgba(0,18,28,0.5)" }}>
                Passionate about equipping African youth with digital skills that open real doors and transform
                lives. Founded CHRISCO Digital Academy to make quality digital education accessible to every young
                person in Africa.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "28px 0 36px" }}>
                {["Graphic Design", "Web Development", "Video Editing", "Animations", "Social Media", "AI"].map((t) => (
                  <span key={t} className="pill pill-dark pill-sm">{t}</span>
                ))}
              </div>
              <Link href="/contact" className="btn btn-green" style={{ textDecoration: "none" }}>
                Get In Touch →
              </Link>
            </Reveal>
            <Reveal variant="right" delay={120}>
              <div style={{ position: "relative" }}>
                <div className="zoom-media shine" style={{ position: "relative", aspectRatio: "4/3.2", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 28px 64px rgba(0,18,28,0.45)" }}>
                  <Image
                    src="/images/workspace.jpg"
                    alt="Wambete Benjamin's creative workspace"
                    fill
                    loading="lazy"
                    quality={80}
                    sizes="(min-width: 768px) 46vw, 92vw"
                    style={{ objectFit: "cover", filter: "saturate(1.15) contrast(1.04)" }}
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
                  }}
                >
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 13.5 }}>Founded under</div>
                  <div style={{ fontSize: 11.5, color: "var(--green)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Icon name="flame" size={13} strokeWidth={2.2} /> CHRISCO Youth Aflame
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <PhotoBand
        eyebrow="Join the movement"
        title={
          <>
            Your future is digital.
            <br /> Let&apos;s build it together.
          </>
        }
      >
        <Link href="/courses" className="btn btn-green" style={{ textDecoration: "none" }}>Explore Courses →</Link>
        <a href="https://wa.me/254112272061" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
          <Icon name="whatsapp" size={16} /> WhatsApp Us
        </a>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
