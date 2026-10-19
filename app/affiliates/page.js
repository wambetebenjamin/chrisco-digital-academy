import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import Link from "next/link"
import AffiliatesClient from "./AffiliatesClient"

export const metadata = {
  title: "Affiliate Programme",
  description:
    "Share CHRISCO Digital Academy and earn a share of every confirmed enrolment. Create your referral link, share it on WhatsApp and track the sign ups that come through it.",
}

const benefits = [
  { icon: "send", title: "Your own link", desc: "A short code that credits every sign up and enrolment to you." },
  { icon: "chart", title: "Simple tracking", desc: "Open the affiliates page any time to see the sign ups on your link." },
  { icon: "cash", title: "Clear payouts", desc: "Confirmed enrolments are paid out on an agreed schedule." },
  { icon: "users", title: "Made for students", desc: "Learners, alumni and tutors can all share and earn." },
]

export default function Affiliates() {
  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-home.jpg" position="center 30%" />
      <Navbar />

      <PhotoHero
        eyebrow="Affiliate programme"
        title={
          <>
            Share what you <span className="accent-bright">learn.</span>
          </>
        }
        titleStyle={{ maxWidth: 820 }}
        lead="Every learner, alumnus and tutor can share CHRISCO Digital Academy with their own link. When someone joins through it, the enrolment is credited to you."
      >
        <div className="fade-up fade-up-2" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
          {["Free to join", "No follower minimum", "Works on every device"].map((p) => (
            <span key={p} className="pill pill-soft pill-sm">
              <Icon name="checkCircle" size={13} strokeWidth={2.2} /> {p}
            </span>
          ))}
        </div>
      </PhotoHero>

      <section className="section-frost" style={{ padding: "48px 0 20px" }}>
        <div className="container">
          <div className="grid-4">
            {benefits.map((b) => (
              <div key={b.title} className="card" style={{ padding: "22px 20px" }}>
                <span className="tutor-req-ico" style={{ marginBottom: 14 }}>
                  <Icon name={b.icon} size={18} strokeWidth={1.9} />
                </span>
                <h3 style={{ fontSize: "0.98rem", fontWeight: 800, marginBottom: 6 }}>{b.title}</h3>
                <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AffiliatesClient />

      <PhotoBand
        centered
        eyebrow="Questions"
        title="Need a poster, caption or price list to share?"
        body="Ask us and we will send you ready-made artwork and copy for WhatsApp and social media, with your link included."
      >
        <Link href="/contact" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
          Contact the Academy →
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
