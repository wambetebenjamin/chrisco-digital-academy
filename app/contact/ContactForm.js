"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { org } from "../data/org"
import { useAuth } from "../AuthProvider"
import { submitAcademyIntake } from "../lib/intakeClient"
import RecaptchaCheck from "../components/RecaptchaCheck"

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
}

export default function ContactForm() {
  const { user, profile } = useAuth() || {}
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [notRobot, setNotRobot] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (user || profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile?.name || user?.user_metadata?.name || user?.name || "",
        email: prev.email || user?.email || profile?.email || "",
      }))
    }
  }, [user, profile])

  async function handleSubmit() {
    setError("")
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please fill in your full name and message.")
      return
    }
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!notRobot) {
      setError("Please complete the reCAPTCHA check to prove you are not a bot.")
      return
    }
    setSending(true)
    try {
      await submitAcademyIntake({
        action: "contact",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        user_id: user?.id || null,
      })
      setSent(true)
      setForm({ name: "", email: "", phone: "", message: "" })
      setNotRobot(false)
    } catch {
      setError(`Failed to send. Please email ${org.email} directly.`)
    }
    setSending(false)
  }

  return (
    <div style={{ background: "#F5F7FA", padding: "36px 32px" }}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "32px 16px" }}>
          <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 700, color: "#0B1D51", marginBottom: 10 }}>
            Message Sent!
          </h3>
          <p style={{ color: "#334155", fontSize: 14.5, marginBottom: 24 }}>
            Our team at CHRISCO Youth Aflame will respond to your inquiry shortly.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="btn btn-navy btn-sm"
            style={{ cursor: "pointer" }}
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 4 }}>
              Direct Inquiry
            </div>
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.35rem", color: "#0B1D51" }}>
              Send a Message
            </h2>
          </div>

          {error && (
            <div style={{ background: "#FEECEC", color: "#B91C1C", padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div className="field">
            <label>Full name *</label>
            <input className="input" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Email address *</label>
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

          <RecaptchaCheck
            verified={notRobot}
            onChange={setNotRobot}
          />

          <button type="button" onClick={handleSubmit} disabled={sending} className="btn btn-primary btn-lg btn-block" style={{ cursor: sending ? "default" : "pointer" }}>
            {sending ? "Sending..." : "Send Message"}
          </button>
          <p style={{ fontSize: 12.5, color: "#475569", textAlign: "center", marginTop: 14 }}>
            Or email directly: <Link href={`mailto:${org.email}`} style={{ color: "#003896", fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>{org.email}</Link>
          </p>
        </>
      )}
    </div>
  )
}
