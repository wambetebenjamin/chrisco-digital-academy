"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "./Icon"
import ShareBookBar from "./ShareBookBar"
import GoogleAuthModal from "./GoogleAuthModal"
import { useAuth } from "../AuthProvider"

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
}

export default function BookGateModal({ book, intent = "download", onClose, onUnlocked }) {
  const { signUp, signIn, signInWithGoogle, saveBook } = useAuth() || {}
  const [mode, setMode] = useState("signup") // "signup" | "signin"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [website, setWebsite] = useState("") // Anti-bot honeypot
  const [submitting, setSubmitting] = useState(false)
  const [googleOpen, setGoogleOpen] = useState(false)
  const [error, setError] = useState("")
  const [unlocked, setUnlocked] = useState(false)

  if (!book) return null

  const nextPath = book.sharePath || "/dashboard#books"
  const nextUrl = encodeURIComponent(nextPath)

  function finishUnlock(cleanEmail) {
    if (saveBook && book.slug) {
      saveBook(book.slug, cleanEmail)
    }
    setUnlocked(true)
    if (onUnlocked) onUnlocked({ authenticated: true, email: cleanEmail }, book)
    if (intent !== "save" && book.downloadPath && typeof window !== "undefined") {
      window.open(book.downloadPath, "_blank")
    }
  }

  async function handleGoogleClick() {
    setError("")
    setSubmitting(true)
    try {
      const res = await signInWithGoogle(nextPath)
      if (res?.openModal) {
        setSubmitting(false)
        setGoogleOpen(true)
      }
    } catch (err) {
      setError(err?.message || "Google sign-in is unavailable right now.")
      setSubmitting(false)
    }
  }

  async function handleGoogleComplete(account) {
    await signInWithGoogle(null, account)
    setGoogleOpen(false)
    finishUnlock(account.email)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (website && String(website).trim() !== "") {
      setError("Invalid submission.")
      return
    }

    const cleanEmail = email.trim().toLowerCase()
    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address.")
      return
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name to create your account.")
        return
      }
      if (!password || password.length < 6) {
        setError("Please create a password with at least 6 characters.")
        return
      }
      if (!privacyConsent) {
        setError("Please agree to the Privacy & Data Protection Policy before creating an account.")
        return
      }
    } else if (!password) {
      setError("Please enter your account password.")
      return
    }

    setSubmitting(true)
    try {
      if (mode === "signup") {
        await signUp(name.trim(), cleanEmail, password)
      } else {
        await signIn(cleanEmail, password)
      }
      finishUnlock(cleanEmail)
    } catch (err) {
      setError(err?.message || "Unable to complete authentication. Please check your details.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div
        className="overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Create an account or sign in to download ${book.title}`}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 550 }}>
          {/* Header */}
          <div
            style={{
              background: book.shelf === "christian" ? "#010C80" : "var(--navy)",
              padding: "24px 28px 20px",
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
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.14rem", lineHeight: 1.25 }}>
                {book.title}
              </h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 4 }}>
                {book.pages} Pages · PDF
              </p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "22px 28px 26px" }}>
            {!unlocked ? (
              <form onSubmit={handleSubmit} noValidate>
                {/* Google Authentication Button */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={submitting}
                  className="btn btn-outline btn-block auth-google"
                  style={{ width: "100%", justifyContent: "center", marginBottom: 14, cursor: "pointer" }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  Continue with Google
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 14px" }}>
                  <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                  <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    or use email
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                </div>

                {/* Mode Toggle Tabs */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    background: "var(--layer-1)",
                    padding: 5,
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    marginBottom: 14,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup")
                      setError("")
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 9,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      background: mode === "signup" ? "var(--navy)" : "transparent",
                      color: mode === "signup" ? "#fff" : "var(--ink)",
                    }}
                  >
                    Create Free Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin")
                      setError("")
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 9,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      background: mode === "signin" ? "var(--navy)" : "transparent",
                      color: mode === "signin" ? "#fff" : "var(--ink)",
                    }}
                  >
                    Sign In to Account
                  </button>
                </div>

                <p style={{ fontSize: 13.2, color: "var(--body)", lineHeight: 1.55, marginBottom: 14 }}>
                  Sign in to {intent === "save" ? "save this book to" : "download this PDF and save it in"} your Dashboard.
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

                {/* Honeypot anti-bot field */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                  <label htmlFor="account-website-hp">Leave this field blank</label>
                  <input
                    id="account-website-hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {mode === "signup" && (
                  <div className="field">
                    <label htmlFor="gate-full-name">Full Name *</label>
                    <input
                      id="gate-full-name"
                      className="input"
                      placeholder="e.g. Grace Nakato"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="gate-email">Email Address *</label>
                  <input
                    id="gate-email"
                    className="input"
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="gate-password">
                    {mode === "signup" ? "Create Password (min 6 characters) *" : "Account Password *"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="gate-password"
                      className="input"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: 68 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--muted)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div
                    style={{
                      background: "var(--layer-1)",
                      border: "1px solid var(--line)",
                      borderRadius: 12,
                      padding: "11px 14px",
                      marginBottom: 16,
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.6, lineHeight: 1.5, color: "var(--ink)", cursor: "pointer" }}>
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
                        and consent to creating my learner account.
                      </span>
                    </label>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-green"
                    style={{ flex: 1, cursor: "pointer" }}
                  >
                    <Icon name={intent === "save" ? "bookmark" : "download"} size={16} />
                    {submitting
                      ? mode === "signup"
                        ? "Creating Account..."
                        : "Signing In..."
                      : mode === "signup"
                        ? intent === "save"
                          ? "Create Account & Save Book"
                          : "Create Account & Download PDF"
                        : intent === "save"
                          ? "Sign In & Save Book"
                          : "Sign In & Download PDF"}
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

                <div style={{ marginTop: 14, textAlign: "center", fontSize: 12.3, color: "var(--muted)" }}>
                  Prefer the full page?{" "}
                  <Link href={`/sign-up?next=${nextUrl}`} style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                    Full Sign Up
                  </Link>{" "}
                  ·{" "}
                  <Link href={`/sign-in?next=${nextUrl}`} style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                    Full Sign In
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
                      Signed In &amp; Saved to Your Dashboard!
                    </div>
                    <div style={{ fontSize: 12.8, color: "var(--body)" }}>
                      This book is now saved in your{" "}
                      <Link href="/dashboard#books" style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                        Student Dashboard
                      </Link>
                      . You can also{" "}
                      <a
                        href={book.downloadPath}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--green-deep)", fontWeight: 700 }}
                      >
                        open the 28-page PDF directly
                      </a>
                      .
                    </div>
                  </div>
                </div>

                <ShareBookBar book={book} />

                <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <Link href="/dashboard#books" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
                    Open Dashboard Books Vault →
                  </Link>
                  <button type="button" onClick={onClose} className="btn btn-navy btn-sm" style={{ cursor: "pointer" }}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <GoogleAuthModal
        open={googleOpen}
        onClose={() => setGoogleOpen(false)}
        onComplete={handleGoogleComplete}
        mode={mode}
      />
    </>
  )
}
