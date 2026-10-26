"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "./Icon"
import ShareBookBar from "./ShareBookBar"
import { registerEmailForBooks } from "../lib/bookGateClient"

export default function BookGateModal({ book, onClose, onUnlocked }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [updatesOptIn, setUpdatesOptIn] = useState(false)
  const [website, setWebsite] = useState("") // Anti-bot honeypot
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [unlocked, setUnlocked] = useState(false)

  if (!book) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    const res = await registerEmailForBooks({
      name,
      email,
      privacyConsent,
      updatesOptIn,
      website,
      bookTitle: book.title,
      bookSlug: book.slug,
    })
    setSubmitting(false)

    if (!res.ok) {
      setError(res.error || "Please check your details and try again.")
      return
    }

    setUnlocked(true)
    if (onUnlocked) onUnlocked(res.reader, book)
    if (book.downloadPath && typeof window !== "undefined") {
      window.open(book.downloadPath, "_blank")
    }
  }

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Register by email to download ${book.title}`}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        {/* Header */}
        <div
          style={{
            background: book.shelf === "christian" ? "#010C80" : "var(--navy)",
            padding: "26px 28px 22px",
            color: "#fff",
            display: "flex",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 68,
              height: 94,
              borderRadius: 10,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(0,0,0,0.32)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
          >
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="80px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <span
              className="pill pill-sm"
              style={{
                background: book.shelf === "christian" ? "#FA3F26" : "var(--green)",
                color: book.shelf === "christian" ? "#fff" : "var(--navy)",
                border: "none",
                marginBottom: 8,
              }}
            >
              {book.shelfLabel}
            </span>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.25 }}>
              {book.title}
            </h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 4 }}>
              {book.pages} Spacious Pages · {book.illustrations} Visual Diagrams · Free Online PDF
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          {!unlocked ? (
            <form onSubmit={handleSubmit} noValidate>
              <p style={{ fontSize: 13.8, color: "var(--body)", lineHeight: 1.65, marginBottom: 16 }}>
                Online book downloads require one-time <strong>email registration</strong>. Once verified, your browser unlocks all{" "}
                <strong>Christian &amp; Faith Books</strong> and <strong>Skill &amp; Learning Handbooks</strong>.
              </p>

              {error && (
                <div
                  role="alert"
                  style={{
                    background: "var(--danger-tint)",
                    border: "1px solid rgba(229,72,77,0.35)",
                    color: "var(--danger)",
                    padding: "10px 14px",
                    borderRadius: 10,
                    fontSize: 13,
                    marginBottom: 14,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Honeypot anti-bot field (hidden from real humans) */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="reader-website-hp">Leave this field blank</label>
                <input
                  id="reader-website-hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="reader-name">First / Full Name (Optional)</label>
                <input
                  id="reader-name"
                  className="input"
                  placeholder="e.g. Grace Nakato"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="reader-email">Email Address *</label>
                <input
                  id="reader-email"
                  className="input"
                  type="email"
                  required
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Vigilant Unbundled Data Protection Consent */}
              <div
                style={{
                  background: "var(--layer-1)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  marginBottom: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.8, lineHeight: 1.55, color: "var(--ink)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    style={{ marginTop: 3, accentColor: "var(--navy)" }}
                  />
                  <span>
                    <strong>Data Protection Consent *:</strong> I have read and agree to the{" "}
                    <Link href="/privacy" style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                      Privacy &amp; Data Protection Policy
                    </Link>{" "}
                    and consent to my email being used to verify access for online book downloads. We never sell or share your email.
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.4, lineHeight: 1.5, color: "var(--muted)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={updatesOptIn}
                    onChange={(e) => setUpdatesOptIn(e.target.checked)}
                    style={{ marginTop: 3, accentColor: "var(--navy)" }}
                  />
                  <span>
                    Optional: Send me occasional notifications when new Christian books or course handbooks are published (unsubscribe anytime).
                  </span>
                </label>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-green"
                  style={{ flex: 1, cursor: "pointer" }}
                >
                  <Icon name="download" size={16} />
                  {submitting ? "Verifying Email..." : "Register & Download PDF"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                  style={{ cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>

              <div style={{ marginTop: 14, textAlign: "center", fontSize: 12.5, color: "var(--muted)" }}>
                Already have a student account?{" "}
                <Link href="/sign-in" style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                  Sign in here
                </Link>
              </div>
            </form>
          ) : (
            <div>
              <div
                style={{
                  background: "var(--green-tint)",
                  border: "1px solid rgba(25,135,84,0.25)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Icon name="checkCircle" size={26} style={{ color: "var(--green-deep)" }} />
                <div>
                  <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5 }}>
                    Email Verified — Your Download Has Started!
                  </div>
                  <div style={{ fontSize: 12.8, color: "var(--body)" }}>
                    If your browser blocked the new tab,{" "}
                    <a
                      href={book.downloadPath}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--green-deep)", fontWeight: 700 }}
                    >
                      click here to open the PDF directly
                    </a>
                    .
                  </div>
                </div>
              </div>

              <ShareBookBar book={book} />

              <div style={{ marginTop: 18, textAlign: "right" }}>
                <button type="button" onClick={onClose} className="btn btn-navy btn-sm" style={{ cursor: "pointer" }}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
