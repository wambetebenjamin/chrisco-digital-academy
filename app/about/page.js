import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import { org, tutor } from "../data/org"

export const metadata = {
  title: "About Us",
  description:
    "CHRISCO Digital Academy is the learning platform of CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International, bridging the digital divide with practical, affordable digital skills training across Africa.",
}

const stats = [
  { number: "500+", label: "Youth Trained" },
  { number: "19", label: "Courses Available" },
  { number: "2", label: "Districts (Jinja & Buikwe)" },
  { number: "100%", label: "Practical Skills" },
]

const tutorTags = [
  { icon: "cap", label: "CS Graduate" },
  { icon: "palette", label: "Designer" },
  { icon: "code", label: "Developer" },
  { icon: "clapper", label: "Video Editor" },
  { icon: "robot", label: "AI Expert" },
]

const values = [
  { icon: "globe", title: "Accessible", desc: "Affordable, beginner-friendly learning for every young person in Africa." },
  { icon: "wrench", title: "Practical", desc: "Every course ends with a real project you can show, and sell." },
  { icon: "users", title: "Mentorship", desc: "Learn directly from tutors who work in these fields every day." },
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
        lead="CHRISCO Digital Academy is a youth-focused learning platform under CHRISCO Youth Aflame, equipping young Africans with practical digital skills that open real doors."
      />

      {/* STATS */}
      <section style={{ padding: "72px 0 0" }}>
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
                <div className="stat-num" style={{ color: "var(--ink)" }}>{s.number}</div>
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
                We exist to bridge the digital divide. Too many young people have talent and ambition, but not the
                practical skills to turn them into income. CHRISCO Digital Academy fixes that.
              </p>
              <p className="lead" style={{ marginTop: 16 }}>
                CHRISCO Digital Academy is the learning platform of{" "}
                <strong style={{ color: "var(--ink)" }}>CHRISCO Youth Aflame</strong>, operating under{" "}
                <strong style={{ color: "var(--ink)" }}>CHRISCO Fellowship of Churches International</strong>. Our
                tutors are working practitioners in graphic design, web development, video editing, animation,
                social media and AI.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
                {tutorTags.map((t) => (
                  <span key={t.label} className="pill pill-soft">
                    <Icon name={t.icon} size={14} strokeWidth={2.1} /> {t.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", aspectRatio: "4/3.4", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow-md)" }}>
                  <Image
                    src="/images/hero-tile.jpg"
                    alt="Learner at CHRISCO Digital Academy"
                    fill
                    sizes="(min-width: 768px) 46vw, 92vw"
                    style={{ objectFit: "cover" }}
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
      <section id="mission" className="section section-frost-alt" style={{ scrollMarginTop: 128 }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Our purpose</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              Mission & <span className="accent">vision</span>
            </h2>
          </div>

          <div className="grid-2" style={{ alignItems: "stretch" }}>
            <div style={{ background: "var(--navy)", borderRadius: "var(--radius-xl)", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
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
              <div key={i} className="card card-hover" style={{ padding: "30px 26px" }}>
                <span style={{ display: "inline-flex", width: 52, height: 52, borderRadius: 15, background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={v.icon} size={24} />
                </span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TUTOR */}
      <section id="tutor" className="section section-navy" style={{ scrollMarginTop: 128 }}>
        <div className="container">
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">Meet our tutor</span>
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", marginTop: 18 }}>
                Taught by people who <span className="accent-bright">do the work.</span>
              </h2>
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "14px 0 22px" }}>
                {tutor.role}, CHRISCO Youth Aflame
              </p>
              <p className="lead on-dark" style={{ maxWidth: 540 }}>
                Our lead tutor is a Computer Science graduate who works daily in design, development, video and AI,
                and teaches the same practical workflows our learners use on real projects. The academy is run by
                CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "28px 0 36px" }}>
                {["Graphic Design", "Web Development", "Video Editing", "Animations", "Social Media", "AI"].map((t) => (
                  <span key={t} className="pill pill-dark pill-sm">{t}</span>
                ))}
              </div>
              <Link href="/contact" className="btn btn-green" style={{ textDecoration: "none" }}>
                Get In Touch →
              </Link>
            </div>
            <div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", aspectRatio: "4/3.2", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Image
                    src="/images/workspace.jpg"
                    alt="The CHRISCO tutor workspace"
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
                  }}
                >
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 13.5 }}>Operated by</div>
                  <div style={{ fontSize: 11.5, color: "var(--green)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Icon name="flame" size={13} strokeWidth={2.2} /> CHRISCO Youth Aflame
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
                    under CHRISCO Fellowship of Churches International
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BECOME A TUTOR */}
      <section className="section section-frost-alt" style={{ scrollMarginTop: 128 }}>
        <div className="container">
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow">Teach with us</span>
              <h2 className="title" style={{ marginTop: 16 }}>
                Want to become a <span className="accent">tutor?</span>
              </h2>
              <p className="lead" style={{ marginTop: 20, maxWidth: 520 }}>
                CHRISCO Youth Aflame is always looking for practitioners who can teach what they do. If you work in
                design, development, marketing, video, data or AI, you can lead a course with us.
              </p>
              <ul className="tutor-points">
                {[
                  "Teach part-time, online or in person in Jinja and Buikwe",
                  "We help you shape the syllabus, slides and assessments",
                  "Your classes are delivered under the CHRISCO Youth Aflame brand",
                  "Every tutor is vetted and approved by the academy",
                ].map((point) => (
                  <li key={point}>
                    <Icon name="checkCircle" size={16} strokeWidth={2} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
                <Link href="/become-a-tutor" className="btn btn-green" style={{ textDecoration: "none" }}>
                  Apply to Teach
                </Link>
                <a href="https://wa.me/254112272061" className="btn btn-outline" style={{ textDecoration: "none" }}>
                  <Icon name="whatsapp" size={16} /> Ask a Question
                </a>
              </div>
            </div>
            <div className="card" style={{ padding: "30px 28px" }}>
              <span className="eyebrow" style={{ fontSize: 11 }}>Who we are looking for</span>
              <div className="tutor-req-grid">
                {[
                  { icon: "wrench", title: "Practical skill", desc: "You do the work, not just talk about it." },
                  { icon: "users", title: "Heart for youth", desc: "Patience and clarity with beginners." },
                  { icon: "clipboard", title: "Reliable", desc: "You can hold a schedule and follow a syllabus." },
                  { icon: "shield", title: "Integrity", desc: "You uphold the values of the fellowship." },
                ].map((r) => (
                  <div key={r.title} className="tutor-req">
                    <span className="tutor-req-ico"><Icon name={r.icon} size={17} strokeWidth={1.9} /></span>
                    <div>
                      <div className="tutor-req-title">{r.title}</div>
                      <div className="tutor-req-desc">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
