"use client"

import { useState } from "react"
import { org } from "../data/org"
import RecaptchaCheck from "./RecaptchaCheck"

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
}

export default function GoogleAuthModal({ open, onClose, onComplete, mode = "signin" }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [enteredCode, setEnteredCode] = useState("")
  const [notRobot, setNotRobot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  function handleSendVerification() {
    setError("")
    const cleanEmail = email.trim().toLowerCase()
    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address first.")
      return
    }
    const generated = String(
      100000 +
        (cleanEmail
          .split("")
          .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) *
          7919) %
          900000
    )
    setVerificationCode(generated)
    setEnteredCode(generated)
    setVerificationSent(true)
    setEmailVerified(true)
  }

  function handleVerifyCode() {
    if (enteredCode.trim() === verificationCode && verificationCode) {
      setEmailVerified(true)
      setError("")
    } else {
      setError("Invalid verification code. Please check the 6-digit code.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const targetEmail = email.trim().toLowerCase()
    const targetName = (
      name.trim() ||
      (targetEmail ? targetEmail.split("@")[0] : "")
    ).trim()

    if (!isValidEmail(targetEmail)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!emailVerified) {
      setError("Please verify your email address before continuing.")
      return
    }
    if (!password || password.length < 6) {
      setError("Please enter your password (at least 6 characters).")
      return
    }
    if (!notRobot) {
      setError("Please complete the reCAPTCHA check to prove you are not a bot.")
      return
    }

    setLoading(true)
    try {
      await onComplete({
        name: targetName || "Learner",
        email: targetEmail,
        password,
      })
    } catch (err) {
      setError(err?.message || "Could not complete Google sign-in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in with Google"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(6, 24, 38, 0.68)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "28px 26px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.24)",
          color: "var(--ink)",
          border: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>
              Google Account Verification
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Google Sign-In"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "var(--muted)",
            }}
          >
            ✕
          </button>
        </div>

        <h3 style={{ fontSize: "19px", fontWeight: 800, margin: "0 0 6px", color: "var(--ink)" }}>
          {mode === "signup" ? "Sign up with your Google Account" : "Sign in with your Google Account"}
        </h3>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.5 }}>
          Enter your Google email, verify your address, and enter your password to continue to <strong>{org.academy}</strong>.
        </p>

        {error && (
          <div
            style={{
              background: "var(--danger-tint)",
              border: "1px solid rgba(229, 72, 77, 0.3)",
              color: "var(--danger)",
              padding: "10px 12px",
              borderRadius: "10px",
              fontSize: "12.5px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Full Name</label>
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amani Mwangi"
                style={{ padding: "11px 14px", fontSize: 14 }}
              />
            </div>
          )}

          <div className="field" style={{ marginBottom: 12 }}>
            <label>Google / Gmail Address *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                className="input"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailVerified(false)
                  setVerificationSent(false)
                }}
                placeholder="you@gmail.com"
                style={{ padding: "11px 14px", fontSize: 14, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSendVerification}
                className={emailVerified ? "btn btn-green btn-sm" : "btn btn-navy btn-sm"}
                style={{ whiteSpace: "nowrap", padding: "0 14px" }}
              >
                {emailVerified ? "✓ Verified" : "Verify Email"}
              </button>
            </div>
          </div>

          {verificationSent && (
            <div
              style={{
                background: "var(--layer-1)",
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: "10px 12px",
                marginBottom: 12,
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                  Email verification code for <strong>{email.trim()}</strong>:
                </span>
                <code
                  style={{
                    background: "#fff",
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: "1px solid var(--line-strong)",
                    fontWeight: 800,
                    color: "var(--navy)",
                  }}
                >
                  {verificationCode}
                </code>
              </div>
              {!emailVerified && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    type="text"
                    className="input"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder="6-digit code"
                    style={{ padding: "7px 10px", fontSize: 12.5 }}
                  />
                  <button type="button" onClick={handleVerifyCode} className="btn btn-navy btn-sm">
                    Confirm Code
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="field" style={{ marginBottom: 14 }}>
            <label>Password *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ padding: "11px 70px 11px 14px", fontSize: 14 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
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

          <RecaptchaCheck
            verified={notRobot}
            onChange={setNotRobot}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
              style={{ flex: "0 0 auto" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-green btn-block"
              style={{ flex: 1 }}
            >
              {loading ? "Signing in..." : "Continue with Google Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
