"use client"
import { useState } from "react"
import emailjs from "@emailjs/browser"
import Icon from "../components/Icon"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState("")

  async function handleSubmit() {
    if (!form.name || !form.message) {
      setErr("Please add your name and a message.")
      return
    }
    setSending(true)
    setErr("")
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: form.message,
      }, PUBLIC_KEY)
      setSent(true)
    } catch {
      setErr("Failed to send. Please email shambetz@gmail.com directly.")
    }
    setSending(false)
  }

  return (
    <div className="card" style={{ padding: "36px 32px", background: "#fff" }}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <span style={{ display: "inline-flex", width: 84, height: 84, borderRadius: 22, background: "var(--lime)", color: "var(--ink)", alignItems: "center", justifyContent: "center", marginBottom: 18, border: "3px solid var(--ink)", boxShadow: "6px 6px 0 0 var(--ink)" }}>
            <Icon name="checkCircle" size={42} strokeWidth={1.8} />
          </span>
          <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 10 }}>
            Message sent.
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 24 }}>
            We will get back to you soon. Asante for reaching out to CHRISCO Digital Academy.
          </p>
          <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }) }} className="btn btn-purple btn-sm" style={{ cursor: "pointer" }}>
            Send another message
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{
              width: 48, height: 48, borderRadius: 14, background: "var(--purple)", color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              border: "3px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)",
            }}>
              <Icon name="mail" size={22} />
            </span>
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.4rem" }}>
              Send a message
            </h2>
          </div>

          <div className="field">
            <label>Full name</label>
            <input className="input" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Email address</label>
            <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Phone/WhatsApp</label>
            <input className="input" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>Your message</label>
            <textarea className="input" rows={5} placeholder="Tell us what you need help with..." style={{ resize: "none" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>

          {err && <div className="sticker pink" style={{ marginBottom: 14, fontSize: 11 }}>⚠ {err}</div>}

          <button onClick={handleSubmit} disabled={sending} className="btn btn-lime btn-lg btn-block" style={{ cursor: sending ? "default" : "pointer" }}>
            {sending ? "Sending..." : "Send Message"}
          </button>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 16 }}>
            Prefer email? Write to us at <a href="mailto:shambetz@gmail.com" style={{ color: "var(--purple)", fontWeight: 800, textDecoration: "none" }}>shambetz@gmail.com</a>
          </p>
        </>
      )}
    </div>
  )
}
