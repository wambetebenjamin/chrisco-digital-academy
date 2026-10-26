import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import CoursesExplorer from "./CoursesExplorer"
import { courses } from "../data/courses"
import { getBookByCourse } from "../data/booksCatalogue"
import { resolveServerOrigin, buildSocialMetadata } from "../lib/siteOrigin"

export const dynamic = "force-dynamic"

export async function generateMetadata({ searchParams }) {
  const origin = await resolveServerOrigin()
  const sp = (await searchParams) || {}
  const courseId = sp.course ? String(sp.course) : ""
  const matchedCourse = courseId
    ? courses.find((c) => String(c.id) === courseId)
    : null
  const matchedBook = matchedCourse ? getBookByCourse(matchedCourse) : null

  if (matchedCourse && matchedBook) {
    return buildSocialMetadata({
      origin,
      title: `${matchedCourse.title} Course & 28-Page Handbook`,
      description: `${matchedCourse.desc} Enroll free or sign in with Google/Email to download & save the 28-page illustrated handbook.`,
      path: `/courses?course=${matchedCourse.id}`,
      bannerPath: matchedBook.ogImage,
      squarePath: matchedBook.ogSquareImage,
    })
  }

  return buildSocialMetadata({
    origin,
    title: "19 Practical Digital Skills Courses | CHRISCO Digital Academy",
    description:
      "Browse 19 practical, income-focused digital courses in coding, AI literacy, marketing, writing, video, and leadership. Beginner-friendly, certificate included.",
    path: "/courses",
    bannerPath: "/og/courses.jpg",
  })
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
        eyebrow="Course catalogue, 19 courses"
        title={
          <>
            Learn skills that <span className="accent-bright">actually pay</span>
          </>
        }
        titleStyle={{ maxWidth: 780 }}
        lead="Practical digital courses designed for African youth, real skills, real income, from anywhere on the continent. Pick a category, choose a course, and start this week."
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
        body="WhatsApp us and we'll help you choose the right path for your goals, free and fast."
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
