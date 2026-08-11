import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import ContactForm from "./ContactForm"

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with CHRISCO Digital Academy — ask a question, enroll in a course or partner with us. We respond fast, usually the same day on WhatsApp.",
}

const infoItems = [
  { icon: "mail", label: "Email", value: "shambetz@gmail.com" },
  { icon: "phone", label: "Phone & WhatsApp", value: "+254 112 272 061" },
  { icon: "pin", label: "Location", value: "Nairobi, Kenya" },
  { icon: "flame", label: "Organisation", value: "CHRISCO Youth Aflame" },
]

export default function Contact() {
  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-contact.jpg" position="center 35%" />
      <Navbar />

      {/* HERO */}
      <PhotoHero
        image="/images/bg-contact.jpg"
        eyebrow="Get in touch"
        title={
          <>
            Let&apos;s start a <span className="accent-bright">conversation</span>
          </>
        }
        titleStyle={{ maxWidth: 820 }}
        lead="Have a question, want to enroll, or ready to partner? We respond fast — usually the same day on WhatsApp."
      />

      {/* BODY */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            {/* LEFT — info */}
            <div>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.4rem", color: "var(--ink)", marginBottom: 22 }}>
                Contact details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {infoItems.map((item, i) => (
                  <div key={i} className="card card-hover" style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, textDecoration: "none", color: "inherit" }}>
                    <span
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 15,
                        background: "var(--green-tint)",
                        color: "var(--green-deep)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={item.icon} size={22} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15, wordBreak: "break-word" }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
                  Find us online
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Facebook", "Instagram", "YouTube", "LinkedIn"].map((s) => (
                    <span key={s} className="pill pill-soft pill-sm" style={{ cursor: "default" }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 36, background: "var(--navy)", borderRadius: "var(--radius-lg)", padding: "26px 26px", color: "#fff" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", lineHeight: 1.2, marginBottom: 8 }}>
                  Prefer WhatsApp?
                </div>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
                  Chat with us directly — we reply fast.
                </p>
                <a href="https://wa.me/254112272061" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
                  <Icon name="whatsapp" size={15} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* RIGHT — form (client island) */}
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
