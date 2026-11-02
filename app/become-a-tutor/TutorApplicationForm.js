"use client"

import { useEffect, useState } from "react"
import Icon from "../components/Icon"
import { org, whatsappLink } from "../data/org"
import { useAuth } from "../AuthProvider"
import { submitAcademyIntake } from "../lib/intakeClient"
import RecaptchaCheck from "../components/RecaptchaCheck"

const TRACK_OPTIONS = [
  "Design & Branding",
  "Software & Data",
  "Marketing & Sales",
  "Video & Animation",
  "Business & Career",
  "AI & Productivity",
]

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
}

export default function TutorApplicationForm({ initialTrack = "" }) {
  const { user, profile } = useAuth() || {}
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [track, setTrack] = useState(initialTrack || TRACK_OPTIONS[0])
  const [experience, setExperience] = useState("")
  const [notRobot, setNotRobot] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user || profile) {
      if (!name) setName(profile?.name || user?.user_metadata?.name || user?.name || "")
      if (!email) setEmail(user?.email || profile?.email || "")
    }
  }, [user, profile])

  useEffect(() => {
    if (initialTrack) setTrack(initialTrack)
  }, [initialTrack])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !experience.trim()) {
      setError("Please fill in your name, email address, and teaching experience.")
      return
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!notRobot) {
      setError("Please complete the reCAPTCHA check to prove you are not a bot.")
      return
    }
    setSending(true)
    setError("")
    try {
      await submitAcademyIntake({
        action: "tutor_application",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        track,
        course_title: track,
        message: `Tutor Application (${track}): ${experience.trim()}`,
        user_id: user?.id || null,
      })
      setSent(true)
      setNotRobot(false)
    } catch {
      setError(`Could not submit application. Please email ${org.email}.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div id="tutor-application-form" className="card" style={{ padding: "36px 32px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
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
            flexShrink: 0,
          }}
        >
          <Icon name="send" size={20} />
        </span>
        <div>
          <span className="eyebrow" style={{ fontSize: 11 }}>Tutor Onboarding</span>
          <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.35rem", color: "var(--ink)" }}>
            Apply to Teach a Track
          </h3>
        </div>
      </div>

      <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
        Share the track you would like to lead and a brief summary of your practical experience.
      </p>

      {sent ? (
        <div style={{ textAlign: "center", padding: "24px 10px" }}>
          <span style={{ display: "inline-flex", width: 68, height: 68, borderRadius: "50%", background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Icon name="checkCircle" size={34} strokeWidth={1.7} />
          </span>
          <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.35rem", color: "var(--ink)", marginBottom: 6 }}>
            Tutor Application Submitted!
          </h4>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
            Thank you, <strong>{name}</strong>. Our academic team will review your application for the <strong>{track}</strong> track and get in touch with you.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                setSent(false)
                setExperience("")
              }}
              className="btn btn-navy btn-sm"
              style={{ cursor: "pointer" }}
            >
              Submit another application
            </button>
            <a
              href={whatsappLink(
                `Hi ${org.programme}, I just submitted my Tutor Application for the ${track} track (Name: ${name}).`
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-green btn-sm"
              style={{ textDecoration: "none" }}
            >
              <Icon name="whatsapp" size={15} /> Follow up on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: "var(--danger-tint)", border: "1px solid rgba(229,72,77,0.3)", color: "var(--danger)", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div className="field">
              <label>Full name *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Amani Mwangi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email address *</label>
              <input
                type="email"
                className="input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div className="field">
              <label>Phone / WhatsApp *</label>
              <input
                type="tel"
                className="input"
                placeholder="+254 7xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Teaching track *</label>
              <select
                className="input"
                value={track}
                onChange={(e) => setTrack(e.target.value)}
              >
                {TRACK_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Your practical experience &amp; portfolio links *</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Tell us about your practical experience in this track, links to projects you have shipped, and why you want to teach..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              style={{ resize: "none" }}
              required
            />
          </div>

          <RecaptchaCheck
            verified={notRobot}
            onChange={setNotRobot}
          />

          <button
            type="submit"
            disabled={sending}
            className="btn btn-green btn-lg btn-block"
            style={{ cursor: sending ? "default" : "pointer" }}
          >
            {sending ? "Submitting Application..." : "Submit Tutor Application →"}
          </button>
        </form>
      )}
    </div>
  )
}
