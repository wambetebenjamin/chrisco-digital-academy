import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PhotoHero from "../components/PhotoHero"
import PhotoBand from "../components/PhotoBand"
import { org, tutor } from "../data/org"

export const metadata = {
  title: "About Us | CHRISCO Digital Academy",
  description:
    "CHRISCO Digital Academy is the learning platform of CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International, bridging the digital divide with practical, affordable digital skills training across Africa.",
}

const stats = [
  { number: "500+", label: "Youth Trained" },
  { number: "19", label: "Practical Courses" },
  { number: "2", label: "Districts (Jinja & Buikwe)" },
  { number: "100%", label: "Practical Skills" },
]

const values = [
  {
    title: "Accessible",
    desc: "Affordable, beginner-friendly digital skills training for young people across Jinja, Buikwe, and online across Africa.",
  },
  {
    title: "Practical",
    desc: "Every course ends with a real project that learners can publish, demonstrate, and use to earn income.",
  },
  {
    title: "Mentorship",
    desc: "Direct guidance from working practitioners in graphic design, web development, video editing, animation, social media, and AI.",
  },
  {
    title: "Community",
    desc: "A supportive fellowship of young creators, software builders, and digital entrepreneurs growing together.",
  },
]

const requirements = [
  { title: "Practical skill", desc: "You work actively in the discipline you teach and can demonstrate real projects." },
  { title: "Heart for youth", desc: "Patience and clarity when guiding complete beginners step by step." },
  { title: "Reliable", desc: "You hold a consistent schedule, prepare lessons, and review student work on time." },
  { title: "Integrity", desc: "You uphold the Christian character and values of CHRISCO Youth Aflame." },
]

export default function About() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      <Navbar />

      <PhotoHero
        image="/images/bg-about.jpg"
        eyebrow="CHRISCO Youth Aflame · CHRISCO Fellowship of Churches International"
        title="About CHRISCO Digital Academy"
        lead="CHRISCO Digital Academy is the learning platform of CHRISCO Youth Aflame, equipping young Africans with practical digital skills that open real doors."
      />

      {/* STATS BAND */}
      <section style={{ background: "#0B1D51", color: "#FFFFFF", padding: "36px 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(26px, 3vw, 34px)",
                    fontWeight: 800,
                    color: "#F8C90E",
                    lineHeight: 1.1,
                  }}
                >
                  {s.number}
                </div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={{ background: "#FFFFFF", padding: "76px 0" }}>
        <div className="container">
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 8 }}>
                Who We Are
              </div>
              <h2 className="title">
                Born From a Passion to See Youth Thrive
              </h2>
              <p className="lead" style={{ marginTop: 18 }}>
                We exist to bridge the digital divide. Too many young people have talent and ambition, but not the
                practical skills to turn them into income. CHRISCO Digital Academy fixes that.
              </p>
              <p className="lead" style={{ marginTop: 14 }}>
                <strong>{org.academy}</strong> is the learning platform of <strong>{org.programme}</strong>, operating
                under <strong>{org.umbrella}</strong> across Jinja and Buikwe districts in Uganda and online across
                East Africa. Our tutors are working practitioners in graphic design, web development, video editing,
                animation, social media, and AI.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                {["CS Graduate", "Graphic Designer", "Web Developer", "Video Editor", "AI Practitioner"].map((label) => (
                  <div
                    key={label}
                    style={{
                      background: "#F5F7FA",
                      padding: "10px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0B1D51",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ position: "relative", aspectRatio: "4/3.2", width: "100%", overflow: "hidden" }}>
                <Image
                  src="/images/hero-tile.jpg"
                  alt="Learners at CHRISCO Digital Academy"
                  fill
                  sizes="(min-width: 768px) 46vw, 92vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section id="mission" style={{ background: "#F5F7FA", padding: "76px 0", scrollMarginTop: 128 }}>
        <div className="container">
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
              Our Purpose
            </div>
            <h2 className="title">Mission &amp; Vision</h2>
          </div>

          <div className="grid-2" style={{ gap: 28 }}>
            <div style={{ background: "#0B1D51", color: "#FFFFFF", padding: "40px 36px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#F8C90E", marginBottom: 10 }}>
                Our Mission
              </div>
              <h3 style={{ fontFamily: "var(--font-head)", color: "#FFFFFF", fontSize: "1.35rem", fontWeight: 700, marginBottom: 14 }}>
                Bridging the Digital Divide
              </h3>
              <p style={{ color: "rgba(255,255,255,0.88)", lineHeight: 1.75, fontSize: 15 }}>
                To bridge the digital divide by providing accessible, affordable, and practical digital education to
                youth across Africa and beyond.
              </p>
            </div>

            <div style={{ background: "#FFFFFF", padding: "40px 36px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 10 }}>
                Our Vision
              </div>
              <h3 style={{ fontFamily: "var(--font-head)", color: "#0B1D51", fontSize: "1.35rem", fontWeight: 700, marginBottom: 14 }}>
                A Digitally Empowered Generation
              </h3>
              <p style={{ color: "#334155", lineHeight: 1.75, fontSize: 15 }}>
                A generation of digitally empowered African youth creating solutions, building businesses, and leading
                transformation across the continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section style={{ background: "#FFFFFF", padding: "76px 0" }}>
        <div className="container">
          <div style={{ maxWidth: 620, marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
              What We Stand For
            </div>
            <h2 className="title">The Values Behind Every Course</h2>
          </div>

          <div className="grid-4" style={{ gap: 24 }}>
            {values.map((v) => (
              <div key={v.title} style={{ background: "#F5F7FA", padding: "28px 24px" }}>
                <h3 style={{ fontSize: "1.08rem", fontWeight: 700, color: "#0B1D51", marginBottom: 10 }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.65 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD TUTOR */}
      <section id="tutor" style={{ background: "#0B1D51", color: "#FFFFFF", padding: "76px 0", scrollMarginTop: 128 }}>
        <div className="container">
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#F8C90E", marginBottom: 8 }}>
                {tutor.role} · {org.programme}
              </div>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "#FFFFFF", fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.2 }}>
                Taught by People Who Do the Work
              </h2>
              <p style={{ color: "rgba(255,255,255,0.88)", lineHeight: 1.75, fontSize: 15, marginTop: 18, maxWidth: 560 }}>
                Our lead tutor is a Computer Science graduate who works daily in graphic design, web development,
                video editing, animation, social media, and AI, teaching the same practical workflows our learners use
                on real projects.
              </p>
              <p style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.75, fontSize: 14.5, marginTop: 14, maxWidth: 560 }}>
                The academy is operated by <strong>{org.programme}</strong> under <strong>{org.umbrella}</strong>.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
                <Link href="/contact" className="btn btn-amber" style={{ textDecoration: "none" }}>
                  Get In Touch
                </Link>
                <Link href="/courses" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
                  Browse All 19 Courses
                </Link>
              </div>
            </div>

            <div>
              <div style={{ position: "relative", aspectRatio: "4/3.1", width: "100%", overflow: "hidden" }}>
                <Image
                  src="/images/workspace.jpg"
                  alt="The CHRISCO tutor workspace"
                  fill
                  sizes="(min-width: 768px) 46vw, 92vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BECOME A TUTOR */}
      <section style={{ background: "#F5F7FA", padding: "76px 0" }}>
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 8 }}>
                Teach With Us
              </div>
              <h2 className="title">Want to Become a Tutor?</h2>
              <p className="lead" style={{ marginTop: 16, maxWidth: 540 }}>
                CHRISCO Youth Aflame welcomes practitioners who can teach what they do. If you work in design,
                software development, marketing, video, data, or AI, you can lead a cohort with us.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 28px", display: "grid", gap: 10 }}>
                {[
                  "Teach part-time, online or in person",
                  "We help you shape the syllabus, slides, and practical project briefs",
                  "Classes are delivered under the CHRISCO Youth Aflame Digital Academy programme",
                  "Every tutor is vetted and approved by the academy before leading a cohort",
                ].map((point) => (
                  <li key={point} style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.6 }}>
                    • {point}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/become-a-tutor" className="btn btn-primary" style={{ textDecoration: "none" }}>
                  Apply to Teach
                </Link>
                <Link href="/contact" className="btn btn-outline" style={{ textDecoration: "none" }}>
                  Ask a Question
                </Link>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "32px 28px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 16 }}>
                Who We Are Looking For
              </div>
              <div style={{ display: "grid", gap: 18 }}>
                {requirements.map((r) => (
                  <div key={r.title}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0B1D51", marginBottom: 4 }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>
                      {r.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PhotoBand
        eyebrow="CHRISCO Youth Aflame Digital Academy"
        title="Ready to Start Learning Practical Digital Skills?"
        body="Explore our 19 practical courses across 7 skill tracks or reach out to our team for guidance on the best track for your goals."
      >
        <Link href="/courses" className="btn btn-amber" style={{ textDecoration: "none" }}>
          Explore 19 Courses
        </Link>
        <Link href="/contact" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
          Contact Us
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
