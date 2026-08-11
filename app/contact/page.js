import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PageBackdrop from "../components/PageBackdrop"
import ContactForm from "./ContactForm"

export const metadata = {
 title: "Contact",
 description:
 "Get in touch with CHRISCO Digital Academy. Ask a question, enroll in a course or partner with us. We respond fast, usually the same day on WhatsApp.",
}

const infoItems = [
 { icon: "mail", label: "Email", value: "shambetz@gmail.com", color: "lime" },
 { icon: "phone", label: "Phone/WhatsApp", value: "+254 112 272 061", color: "purple" },
 { icon: "pin", label: "Location", value: "Nairobi, Kenya", color: "pink" },
 { icon: "flame", label: "Organisation", value: "CHRISCO Youth Aflame", color: "yellow" },
]

export default function Contact() {
 return (
 <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
 <PageBackdrop image="/images/bg-contact.jpg" position="center 35%" />
 <Navbar />

 {/* HERO */}
 <section style={{ padding: "170px 0 80px", position: "relative" }}>
 <div className="container">
 <span className="eyebrow pink fade-up">Get in touch</span>
 <h1 className="display fade-up fade-up-1" style={{ marginTop: 20, maxWidth: 900 }}>
 Let&apos;s start a <span className="marker pink">conversation.</span>
 </h1>
 <p className="lead fade-up fade-up-2" style={{ marginTop: 22, maxWidth: 640, fontSize: "1.1rem" }}>
 Have a question, want to enroll, or ready to partner? We respond fast, usually the same day on WhatsApp.
 </p>
 </div>
 </section>

 {/* BODY */}
 <section className="band-cream" style={{ padding: "0 0 96px" }}>
 <div className="container">
 <div className="split" style={{ alignItems: "start" }}>
 {/* LEFT: info */}
 <div>
 <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.5rem", marginBottom: 22 }}>
 Contact details
 </h2>
 <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
 {infoItems.map((item, i) => (
 <div key={i} className={`card ${item.color}`} style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
 <span style={{
 width: 52, height: 52, borderRadius: 14,
 background: item.color === "purple" || item.color === "pink" ? "rgba(255,255,255,0.2)" : "var(--ink)",
 color: item.color === "purple" || item.color === "pink" ? "#fff" : "var(--lime)",
 border: "2.5px solid var(--ink)",
 display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
 }}>
 <Icon name={item.icon} size={22} />
 </span>
 <div style={{ minWidth: 0 }}>
 <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 800, marginBottom: 3, opacity: 0.85 }}>
 {item.label}
 </div>
 <div style={{ fontWeight: 800, fontSize: 15, wordBreak: "break-word" }}>
 {item.value}
 </div>
 </div>
 </div>
 ))}
 </div>

 <div style={{ marginTop: 28 }}>
 <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
 Find us online
 </div>
 <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
 {[
 { label: "TikTok", color: "pink" },
 { label: "Instagram", color: "purple" },
 { label: "YouTube", color: "lime" },
 { label: "WhatsApp", color: "yellow" },
 ].map((s, i) => (
 <span key={s.label} className={`sticker ${s.color}`} style={{ fontSize: 11, cursor: "default" }}>{s.label}</span>
 ))}
 </div>
 </div>

 <div className="card ink" style={{ marginTop: 32, padding: "28px 26px", color: "#fff" }}>
 <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", lineHeight: 1.1, marginBottom: 10 }}>
 Prefer WhatsApp?
 </div>
 <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 18 }}>
 Chat with us directly. We reply within minutes during daytime hours.
 </p>
 <a href="https://wa.me/254112272061" className="btn btn-lime" style={{ textDecoration: "none" }}>
 <Icon name="whatsapp" size={16} /> Chat on WhatsApp
 </a>
 </div>
 </div>

 {/* RIGHT: form */}
 <ContactForm />
 </div>
 </div>
 </section>

 <Footer />
 <Chatbot />
 </main>
 )
}
