"use client"
import { useState } from "react"
import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import emailjs from "@emailjs/browser"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

const infoItems = [
  { icon: "✉", label: "Email", value: "shambetz@gmail.com", href: "mailto:shambetz@gmail.com" },
  { icon: "✆", label: "Phone & WhatsApp", value: "+254 112 272 061", href: "https://wa.me/254112272061" },
  { icon: "⌖", label: "Location", value: "Nairobi, Kenya", href: null },
  { icon: "⛪", label: "Organisation", value: "CHRISCO Youth Aflame", href: "/about" },
]

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.message) return
    setSending(true)
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: form.message,
      }, PUBLIC_KEY)
      setSent(true)
    } catch {
      alert("Failed to send. Please email shambetz@gmail.com directly.")
    }
    setSending(false)
  }

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: "150px 0 64px" }}>
        <div className="container">
          <span className="eyebrow fade-up">Get in touch</span>
          <h1 className="display fade-up fade-up-1" style={{ maxWidth: 820, marginTop: 20 }}>
            Let&apos;s start a <span className="accent">conversation</span>
          </h1>
          <p className="lead fade-up fade-up-2" style={{ maxWidth: 560, marginTop: 24 }}>
            Have a question, want to enroll, or ready to partner? We respond fast — usually the same day on
            WhatsApp.
          </p>
        </div>
      </section>

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
                        fontSize: "1.35rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
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
                  Chat on WhatsApp →
                </a>
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="card" style={{ padding: "40px 36px", boxShadow: "var(--shadow-md)" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ fontSize: "3.6rem", marginBottom: 14 }}>🎉</div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)", marginBottom: 10 }}>
                    Message sent!
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 24 }}>
                    We&apos;ll get back to you soon. Thank you for reaching out to CHRISCO Digital Academy.
                  </p>
                  <button onClick={() => setSent(false)} className="btn btn-navy btn-sm" style={{ cursor: "pointer" }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 13,
                        background: "var(--green-tint)",
                        color: "var(--green-deep)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      ✉
                    </span>
                    <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.3rem", color: "var(--ink)" }}>
                      Send a message
                    </h2>
                  </div>

                  <div className="field">
                    <label>Full name *</label>
                    <input className="input" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Email address</label>
                    <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Phone / WhatsApp</label>
                    <input className="input" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Your message *</label>
                    <textarea className="input" rows={5} placeholder="Tell us what you need help with..." style={{ resize: "none" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>

                  <button onClick={handleSubmit} disabled={sending} className="btn btn-green btn-lg btn-block" style={{ cursor: sending ? "default" : "pointer" }}>
                    {sending ? "Sending..." : "Send Message →"}
                  </button>
                  <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 16 }}>
                    Prefer email? Write to us at <Link href="mailto:shambetz@gmail.com" style={{ color: "var(--green-deep)", fontWeight: 600, textDecoration: "none" }}>shambetz@gmail.com</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
