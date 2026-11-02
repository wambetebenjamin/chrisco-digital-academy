import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PhotoHero from "../components/PhotoHero"
import PhotoBand from "../components/PhotoBand"
import Link from "next/link"
import AffiliatesClient from "./AffiliatesClient"

export const metadata = {
  title: "Affiliate Programme | CHRISCO Digital Academy",
  description:
    "Share CHRISCO Digital Academy and earn a share of every confirmed enrolment. Create your referral link, share it on WhatsApp, and track sign-ups.",
}

const benefits = [
  { title: "Personal Referral Link", desc: "A short code that credits every sign-up and confirmed enrolment to you." },
  { title: "Transparent Tracking", desc: "Open the affiliates page any time to view sign-ups recorded on your link." },
  { title: "Clear Payouts", desc: "Confirmed enrolments are paid out on an agreed schedule." },
  { title: "Open to Learners & Alumni", desc: "Students, alumni, and tutors across CHRISCO Youth Aflame can share and earn." },
]

export default function Affiliates() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      <Navbar />

      <PhotoHero
        image="/images/bg-home.jpg"
        eyebrow="CHRISCO Youth Aflame Digital Academy · Community Referral Programme"
        title="Affiliate & Referral Programme"
        lead="Every learner, alumnus, and tutor can share CHRISCO Digital Academy with their own referral link. When someone joins through it, the enrolment is credited to you."
      />

      <section style={{ background: "#FFFFFF", padding: "56px 0 16px" }}>
        <div className="container">
          <div className="grid-4" style={{ gap: 20 }}>
            {benefits.map((b) => (
              <div key={b.title} style={{ background: "#F5F7FA", padding: "24px 22px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0B1D51", marginBottom: 6 }}>{b.title}</h3>
                <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AffiliatesClient />

      <PhotoBand
        centered
        eyebrow="Affiliate Support"
        title="Need Official Course Details or Merch Catalogues to Share?"
        body="Contact our team at CHRISCO Youth Aflame and we will share official course summaries and product codes for your fellowship or campus group."
      >
        <Link href="/contact" className="btn btn-amber" style={{ textDecoration: "none" }}>
          Contact the Academy
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
