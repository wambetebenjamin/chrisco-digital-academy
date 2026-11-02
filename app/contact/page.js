import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import ContactForm from "./ContactForm"
import { org } from "../data/org"

export const metadata = {
  title: "Contact Us | CHRISCO Digital Academy",
  description:
    "Get in touch with CHRISCO Digital Academy — ask a question, enroll in a course, or partner with CHRISCO Youth Aflame.",
}

export default function Contact() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      <Navbar />

      <PhotoHero
        image="/images/bg-contact.jpg"
        eyebrow="CHRISCO Youth Aflame · CHRISCO Fellowship of Churches International"
        title="Contact CHRISCO Digital Academy"
        lead="Have a question about our 19 courses, the Teens AI & Projects Bootcamp, or our books? Reach out to our team and we will respond promptly."
      />

      <section style={{ background: "#FFFFFF", padding: "64px 0 88px" }}>
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            {/* LEFT: Institutional Contact Details */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
                Academy Desk
              </div>
              <h2 className="title" style={{ marginBottom: 22 }}>
                Contact Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#F5F7FA", padding: "22px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                    Email Address
                  </div>
                  <a
                    href={`mailto:${org.email}`}
                    style={{ fontWeight: 700, color: "#0B1D51", fontSize: 15, textDecoration: "none", wordBreak: "break-word" }}
                  >
                    {org.email}
                  </a>
                </div>

                <div style={{ background: "#F5F7FA", padding: "22px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                    Direct Voice &amp; WhatsApp Desk
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <a
                      href={`tel:${org.phoneE164}`}
                      aria-label="Call CHRISCO Digital Academy"
                      className="btn btn-navy btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      <Icon name="phone" size={15} /> Call Desk
                    </a>
                    <a
                      href={org.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Message CHRISCO Digital Academy on WhatsApp"
                      className="btn btn-primary btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      <Icon name="whatsapp" size={15} /> WhatsApp Desk
                    </a>
                  </div>
                </div>

                <div style={{ background: "#F5F7FA", padding: "22px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                    Organisation &amp; Districts
                  </div>
                  <div style={{ fontWeight: 700, color: "#0B1D51", fontSize: 15 }}>
                    {org.programme} ({org.umbrella})
                  </div>
                  <div style={{ fontSize: 13.5, color: "#334155", marginTop: 4 }}>
                    Operating across Jinja &amp; Buikwe Districts, Uganda, and online across East Africa.
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
