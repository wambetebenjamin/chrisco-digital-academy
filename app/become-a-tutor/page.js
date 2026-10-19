import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import { org, tutor } from "../data/org"

export const metadata = {
  title: "Become a Tutor",
  description:
    "Teach with CHRISCO Digital Academy, the learning platform of CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International. Share your practical digital skill with young people across Africa.",
}

const openings = [
  { icon: "palette", title: "Design & Branding", desc: "Graphic design, print on demand, visual identity." },
  { icon: "code", title: "Software & Data", desc: "Front-end, back-end, Python, AI and data skills." },
  { icon: "chart", title: "Marketing & Sales", desc: "Digital marketing, content, copywriting and sales." },
  { icon: "clapper", title: "Video & Animation", desc: "Editing, YouTube automation, motion graphics." },
  { icon: "briefcase", title: "Business & Career", desc: "Communication, negotiation, freelancing, branding." },
  { icon: "robot", title: "AI & Productivity", desc: "AI literacy, prompt craft and workflow automation." },
]

const requirements = [
  { icon: "wrench", title: "A practical skill", desc: "You work in the field you want to teach, with real projects to show." },
  { icon: "users", title: "Heart for young people", desc: "You enjoy explaining things clearly to complete beginners." },
  { icon: "clipboard", title: "Reliability", desc: "You can hold a schedule, prepare lessons and give feedback on time." },
  { icon: "shield", title: "Integrity", desc: "You uphold the values of CHRISCO Youth Aflame and the fellowship." },
]

const support = [
  "A ready course outline you can adapt, with slides and project briefs",
  "Onboarding on our teaching method and class tools",
  "Part-time and flexible scheduling, online or in person",
  "Your classes promoted under the CHRISCO Youth Aflame brand",
  "Learner enrolment and WhatsApp support handled by the academy",
  "A tutor acknowledgement on every course you lead",
]

const steps = [
  { num: "01", icon: "send", title: "Apply", desc: "Send a short message with the skill you want to teach and your experience." },
  { num: "02", icon: "users", title: "A short conversation", desc: "We meet online to talk through your track and availability." },
  { num: "03", icon: "play", title: "Teach a sample class", desc: "Deliver one 30 minute session so we can see you teach, not just your CV." },
  { num: "04", icon: "checkCircle", title: "Get onboarded", desc: "Sign the tutor agreement, receive your materials and start with a cohort." },
]

export default function BecomeATutor() {
  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-about.jpg" position="center 35%" />
      <Navbar />

      <PhotoHero
        eyebrow="Teach with us"
        title={
          <>
            Become a <span className="accent-bright">tutor.</span>
          </>
        }
        titleStyle={{ maxWidth: 820 }}
        lead={`Teach what you already do. CHRISCO Digital Academy is the learning platform of ${org.programme}, operating under ${org.umbrella}, and we are always looking for practitioners to lead our tracks.`}
      >
        <div className="fade-up fade-up-2" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
          <a href="https://wa.me/254112272061" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
            <Icon name="whatsapp" size={17} /> Apply on WhatsApp
          </a>
          <Link href="/contact" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
            Send a Message
          </Link>
        </div>
      </PhotoHero>

      {/* OPEN TRACKS */}
      <section className="section-frost" style={{ padding: "56px 0 72px" }}>
        <div className="container">
          <div style={{ maxWidth: 620, marginBottom: 40 }}>
            <span className="eyebrow">Open tracks</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              Where we need <span className="accent">tutors</span>
            </h2>
            <p className="lead" style={{ marginTop: 16 }}>
              You do not need a teaching certificate. You need a skill you can demonstrate and the patience to
              break it down for a beginner.
            </p>
          </div>

          <div className="grid-3">
            {openings.map((o) => (
              <div key={o.title} className="card card-hover" style={{ padding: "26px 24px" }}>
                <span className="tutor-req-ico" style={{ marginBottom: 16 }}>
                  <Icon name={o.icon} size={19} strokeWidth={1.9} />
                </span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 8 }}>{o.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE ASK / WHAT WE GIVE */}
      <section className="section section-frost-alt">
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            <div>
              <span className="eyebrow">What you need</span>
              <h2 className="title" style={{ marginTop: 16 }}>
                Four things we look for
              </h2>
              <div className="tutor-req-grid" style={{ marginTop: 28 }}>
                {requirements.map((r) => (
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

            <div className="card" style={{ padding: "30px 28px" }}>
              <span className="eyebrow" style={{ fontSize: 11 }}>What we provide</span>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "12px 0 18px" }}>
                You teach. We handle the rest.
              </h3>
              <ul className="tutor-points">
                {support.map((point) => (
                  <li key={point}>
                    <Icon name="checkCircle" size={16} strokeWidth={2} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-frost">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 48px" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>How it works</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              From application to <span className="accent">first class</span>
            </h2>
          </div>

          <div className="grid-4">
            {steps.map((step) => (
              <div key={step.num} className="card" style={{ padding: "26px 24px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "var(--green-deep)" }}>
                    {step.num}
                  </span>
                  <Icon name={step.icon} size={24} strokeWidth={1.7} />
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANISATION NOTE */}
      <section className="section-tight section-frost-deep">
        <div className="container">
          <div className="tutor-org">
            <span className="tutor-req-ico"><Icon name="flame" size={18} strokeWidth={1.9} /></span>
            <div>
              <div className="tutor-org-title">Who you would be teaching with</div>
              <p className="tutor-org-body">
                {org.academy} is the learning platform of {org.programme}, operating under {org.umbrella}. All
                courses, materials and certificates are issued under the {org.programme} brand, and every tutor is
                approved by the academy before leading a cohort.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PhotoBand
        centered
        eyebrow="Ready to teach?"
        title="Share your skill with the next generation."
        body={`Send us a short message about what you teach. Our ${tutor.role.toLowerCase()} reviews every application and replies within a few days.`}
      >
        <a href="https://wa.me/254112272061" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
          <Icon name="whatsapp" size={17} /> Apply on WhatsApp
        </a>
        <Link href="/contact" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
          Contact the Academy →
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
