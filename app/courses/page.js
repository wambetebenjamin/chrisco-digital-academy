import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import CoursesExplorer from "./CoursesExplorer"

export const metadata = {
  title: "Courses",
  description:
    "Browse 11 practical, income-focused digital courses — graphic design, coding, marketing, writing, video and AI. Beginner-friendly, certificate included, online and in-person in Kenya.",
}

const heroPills = [
  { icon: "clock", label: "8-week courses" },
  { icon: "trophy", label: "Certificate included" },
  { icon: "laptop", label: "Online & in-person" },
]

export default function Courses() {
  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: "150px 0 64px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow fade-up">Course catalogue — 11 courses</span>
              <h1 className="display fade-up fade-up-1" style={{ maxWidth: 780, marginTop: 20 }}>
                Learn skills that <span className="accent">actually pay</span>
              </h1>
            </div>
            <div className="fade-up fade-up-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {heroPills.map((p) => (
                <span key={p.label} className="pill pill-soft pill-sm">
                  <Icon name={p.icon} size={13} strokeWidth={2.2} /> {p.label}
                </span>
              ))}
            </div>
          </div>
          <p className="lead fade-up fade-up-2" style={{ maxWidth: 640, marginTop: 22 }}>
            Practical digital courses designed for African youth — real skills, real income, from anywhere on the
            continent. Pick a category, choose a course, and start this week.
          </p>
        </div>
      </section>

      {/* Interactive catalogue (client island) */}
      <CoursesExplorer />

      {/* CTA */}
      <section className="section section-green" style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <span className="eyebrow on-green" style={{ justifyContent: "center" }}>Need guidance?</span>
            <h2 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", marginTop: 14 }}>
              Not sure which course to pick?
            </h2>
            <p style={{ marginTop: 16, fontWeight: 500, color: "rgba(0,35,51,0.75)", fontSize: "1.02rem" }}>
              WhatsApp us and we&apos;ll help you choose the right path for your goals — free and fast.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
              <a href="https://wa.me/254112272061" className="btn btn-navy btn-lg" style={{ textDecoration: "none" }}>
                <Icon name="whatsapp" size={17} /> WhatsApp Us
              </a>
              <Link href="/contact" className="btn btn-outline btn-lg" style={{ textDecoration: "none", borderColor: "var(--navy)", color: "var(--navy)" }}>
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
