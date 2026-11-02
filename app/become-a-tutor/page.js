import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PhotoHero from "../components/PhotoHero"
import PhotoBand from "../components/PhotoBand"
import { org, tutor } from "../data/org"
import TutorApplicationForm from "./TutorApplicationForm"

export const metadata = {
  title: "Become a Tutor | CHRISCO Digital Academy",
  description:
    "Teach with CHRISCO Digital Academy, the learning platform of CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International. Share your practical digital skill with young people across Africa.",
}

const openings = [
  { title: "Design & Branding", desc: "Graphic design, print on demand, and visual identity." },
  { title: "Software & Data", desc: "Front-end, back-end, Python, AI, and data skills." },
  { title: "Marketing & Sales", desc: "Digital marketing, content strategy, copywriting, and sales." },
  { title: "Video & Animation", desc: "Video editing, YouTube automation, and motion graphics." },
  { title: "Business & Career", desc: "Communication, negotiation, freelancing, and personal branding." },
  { title: "AI & Productivity", desc: "AI literacy, prompt engineering, and workflow automation." },
]

const requirements = [
  { title: "A practical skill", desc: "You work actively in the field you want to teach, with real projects to demonstrate." },
  { title: "Heart for young people", desc: "You enjoy explaining concepts clearly and patiently to beginners." },
  { title: "Reliability", desc: "You can hold a schedule, prepare lessons, and review student work on time." },
  { title: "Integrity", desc: "You uphold the Christian values of CHRISCO Youth Aflame and the fellowship." },
]

const support = [
  "A structured course outline you can adapt, with slides and practical project briefs",
  "Onboarding on our teaching method and cohort tools",
  "Part-time and flexible scheduling, online or in person",
  "Your classes promoted under the CHRISCO Youth Aflame Digital Academy programme",
  "Learner enrolment and student support coordinated by the academy",
  "Official tutor recognition on every course you lead",
]

const steps = [
  { num: "01", title: "Apply", desc: "Submit the application form below with the track you want to teach and your practical experience." },
  { num: "02", title: "Short Conversation", desc: "We meet online to discuss your track, syllabus, and schedule availability." },
  { num: "03", title: "Sample Lesson", desc: "Deliver one 30-minute practical session so we can experience how you teach beginners." },
  { num: "04", title: "Onboarding", desc: "Receive your course materials and begin mentoring a student cohort." },
]

export default function BecomeATutor() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      <Navbar />

      <PhotoHero
        image="/images/bg-about.jpg"
        eyebrow="CHRISCO Youth Aflame Digital Academy · Teach With Us"
        title="Become a Tutor"
        lead={`Teach what you already do. ${org.academy} is the learning platform of ${org.programme}, operating under ${org.umbrella}, and we welcome working practitioners to lead our digital skill tracks.`}
      />

      {/* OPEN TRACKS */}
      <section style={{ background: "#FFFFFF", padding: "64px 0" }}>
        <div className="container">
          <div style={{ maxWidth: 640, marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
              Open Tracks
            </div>
            <h2 className="title">Where We Need Tutors</h2>
            <p className="lead" style={{ marginTop: 12 }}>
              You need a practical skill you can demonstrate and the patience to break it down step by step for a beginner.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 20 }}>
            {openings.map((o) => (
              <div key={o.title} style={{ background: "#F5F7FA", padding: "26px 24px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0B1D51", marginBottom: 8 }}>{o.title}</h3>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.65 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE ASK / WHAT WE GIVE */}
      <section style={{ background: "#F5F7FA", padding: "64px 0" }}>
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
                What You Need
              </div>
              <h2 className="title">Four Qualities We Look For</h2>
              <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
                {requirements.map((r) => (
                  <div key={r.title} style={{ background: "#FFFFFF", padding: "20px 22px" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0B1D51", marginBottom: 4 }}>{r.title}</div>
                    <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "32px 28px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
                What We Provide
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0B1D51", marginBottom: 16 }}>
                You Teach. We Coordinate the Rest.
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
                {support.map((point) => (
                  <li key={point} style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
                    • {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#FFFFFF", padding: "64px 0" }}>
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
              How It Works
            </div>
            <h2 className="title">From Application to First Class</h2>
          </div>

          <div className="grid-4" style={{ gap: 20 }}>
            {steps.map((step) => (
              <div key={step.num} style={{ background: "#F5F7FA", padding: "26px 24px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#003896", marginBottom: 8 }}>
                  STEP {step.num}
                </div>
                <h3 style={{ fontSize: "1.02rem", fontWeight: 700, color: "#0B1D51", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANISATION NOTE & DIRECT APPLICATION */}
      <section style={{ background: "#F5F7FA", padding: "64px 0 80px" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ background: "#0B1D51", color: "#FFFFFF", padding: "26px 28px", marginBottom: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F8C90E", marginBottom: 6 }}>
              Who You Will Be Teaching With
            </div>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.88)", lineHeight: 1.7 }}>
              <strong>{org.academy}</strong> is the learning platform of <strong>{org.programme}</strong>, operating
              under <strong>{org.umbrella}</strong>. All courses and learning handbooks are published under the{" "}
              {org.programme} programme, and every tutor is approved by the academy before leading a cohort.
            </p>
          </div>

          <TutorApplicationForm />
        </div>
      </section>

      <PhotoBand
        centered
        eyebrow="Ready to Teach?"
        title="Share Your Skill With the Next Generation"
        body={`Our ${tutor.role.toLowerCase()} reviews every tutor application and responds within a few days.`}
      >
        <Link href="/contact" className="btn btn-amber" style={{ textDecoration: "none" }}>
          Contact the Academy
        </Link>
        <Link href="/courses" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
          View All 19 Courses
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
