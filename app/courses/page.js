import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PhotoHero from "../components/PhotoHero"
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
      "Browse 19 practical, income-focused digital courses in coding, AI literacy, marketing, writing, design, video, and leadership at CHRISCO Digital Academy.",
    path: "/courses",
    bannerPath: "/og/courses.jpg",
  })
}

export default function Courses() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      <Navbar />

      <PhotoHero
        image="/images/bg-courses.jpg"
        eyebrow="CHRISCO Youth Aflame Digital Academy · 19 Courses Across 7 Skill Tracks"
        title="19 Practical Digital Skills Courses"
        lead="Practical digital courses designed for young people across Africa — real skills, guided mentorship, and portfolio projects you can apply immediately."
      />

      <CoursesExplorer />

      <PhotoBand
        centered
        eyebrow="Course Guidance"
        title="Not Sure Which Course to Pick?"
        body="Contact our team at CHRISCO Youth Aflame and we will help you choose the right learning track for your goals."
      >
        <Link href="/contact" className="btn btn-amber" style={{ textDecoration: "none" }}>
          Contact the Academy
        </Link>
        <Link href="/library" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
          Browse Course Handbooks
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
