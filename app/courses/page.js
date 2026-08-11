import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
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
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-courses.jpg" position="center 30%" />
      <Navbar />

      {/* HERO */}
      <PhotoHero
        image="/images/bg-courses.jpg"
        eyebrow="Course catalogue — 11 courses"
        title={
          <>
            Learn skills that <span className="accent-bright">actually pay</span>
          </>
        }
        titleStyle={{ maxWidth: 780 }}
        lead="Practical digital courses designed for African youth — real skills, real income, from anywhere on the continent. Pick a category, choose a course, and start this week."
      >
        <div className="fade-up fade-up-2" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
          {heroPills.map((p) => (
            <span key={p.label} className="pill pill-soft pill-sm">
              <Icon name={p.icon} size={13} strokeWidth={2.2} /> {p.label}
            </span>
          ))}
        </div>
      </PhotoHero>

      {/* Interactive catalogue (client island) */}
      <CoursesExplorer />

      {/* CTA */}
      <PhotoBand
        centered
        eyebrow="Need guidance?"
        title="Not sure which course to pick?"
        body="WhatsApp us and we'll help you choose the right path for your goals — free and fast."
      >
        <a href="https://wa.me/254112272061" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
          <Icon name="whatsapp" size={17} /> WhatsApp Us
        </a>
        <Link href="/contact" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
          Contact Us →
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
