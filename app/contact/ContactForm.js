"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Icon from "../components/Icon"
import { org } from "../data/org"
import { useAuth } from "../AuthProvider"
import { submitAcademyIntake } from "../lib/intakeClient"
import AutoReplyReceipt from "../components/AutoReplyReceipt"

export default function ContactForm() {
  const { user, profile } = useAuth() || {}
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [receipt, setReceipt] = useState(null)

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
    if (!form.name || !form.message) return
    setSending(true)
    try {
      const res = await submitAcademyIntake({
        action: "contact",
        name: form.name,
        email: form.email || org.email,
        phone: form.phone,
        message: form.message,
        user_id: user?.id || null,
      })
      setReceipt(res?.auto_reply || null)
      setSent(true)
    } catch {
      alert(`Failed to send. Please email ${org.email} directly.`)
    }
    setSending(false)
  }

  return (
    <div className="card" style={{ padding: "40px 36px", boxShadow: "var(--shadow-md)" }}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "24px 10px" }}>
          <span style={{ display: "inline-flex", width: 76, height: 76, borderRadius: "50%", background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <Icon name="checkCircle" size={40} strokeWidth={1.6} />
          </span>
          <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)", marginBottom: 10 }}>
            We Have Received Your Message!
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
            Your contact details and inquiry have been saved to our database, and an automated confirmation response from <strong>{org.email}</strong> has been generated below.
          </p>
          {receipt && <AutoReplyReceipt receipt={receipt} />}
          <div style={{ marginTop: 22 }}>
            <button
              onClick={() => {
                setSent(false)
                setReceipt(null)
                setForm((prev) => ({ ...prev, message: "" }))
              }}
              className="btn btn-navy btn-sm"
              style={{ cursor: "pointer" }}
            >
              Send another message
            </button>
          </div>
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
              }}
            >
              <Icon name="mail" size={20} />
            </span>
            <div>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.3rem", color: "var(--ink)" }}>
                Send a message
              </h2>
              <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
                Instant confirmation from <strong>{org.email}</strong>
              </p>
            </div>
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
            {sending ? "Saving & Sending..." : "Send Message →"}
          </button>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 16 }}>
            Prefer email? Write to us at <Link href={`mailto:${org.email}`} style={{ color: "var(--green-deep)", fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>{org.email}</Link>
          </p>
        </>
      )}
    </div>
  )
}
