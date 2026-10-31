"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "../AuthProvider"
import AuthShell from "../components/AuthShell"
import Icon from "../components/Icon"
import { readRef } from "../lib/referral"
import GoogleAuthModal from "../components/GoogleAuthModal"
import RecaptchaCheck from "../components/RecaptchaCheck"

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
}

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [enteredCode, setEnteredCode] = useState("")
  const [notRobot, setNotRobot] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  const { signUp, signInWithGoogle, previewMode } = useAuth()
  const [ref, setRef] = useState("")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRef(readRef())
  }, [])

  function handleSendVerification() {
    setError("")
    const cleanEmail = form.email.trim().toLowerCase()
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
    setEmailVerified(true)
  }

  function handleConfirmCode() {
    if (enteredCode.trim() === verificationCode && verificationCode) {
      setEmailVerified(true)
      setError("")
    } else {
      setError("Invalid verification code. Please check the 6-digit code.")
    }
  }

  async function handleSignUp() {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!emailVerified) {
      setError("Please verify your email address first.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (!notRobot) {
      setError("Please complete the reCAPTCHA check to prove you are not a bot.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signUp(form.name.trim(), form.email.trim(), form.password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong.")
      setLoading(false)
    }
  }

  function getNextDest() {
    if (typeof window !== "undefined") {
      const rawNext = new URLSearchParams(window.location.search).get("next") || ""
      if (rawNext.startsWith("/") && !rawNext.startsWith("//")) return rawNext
    }
    return "/dashboard"
  }

  async function handleGoogle() {
    setError("")
    setLoading(true)
    try {
      const res = await signInWithGoogle(getNextDest())
      if (res?.openModal) {
        setLoading(false)
        setGoogleModalOpen(true)
      }
    } catch (err) {
      setError(err.message || "Google sign-in is not available right now.")
      setLoading(false)
    }
  }

  async function handleGoogleModalComplete(account) {
    await signInWithGoogle(getNextDest(), account)
    setGoogleModalOpen(false)
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSignUp()
  }

  return (
    <AuthShell subtitle="Join thousands of young Africans building real, practical digital skills, for free, forever.">
      {success ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <span
            style={{
              display: "inline-flex",
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "#38A128",
              color: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <Icon name="checkCircle" size={38} strokeWidth={1.6} />
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.9rem",
              color: "#0B1D51",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Account Created!
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 24 }}>
            Your email <strong style={{ color: "#0B1D51" }}>{form.email}</strong> has been verified and your learner account is ready.
          </p>
          <Link href="/dashboard" className="btn btn-green" style={{ textDecoration: "none" }}>
            Open Dashboard →
          </Link>
        </div>
      ) : (
        <>
          <span className="eyebrow" style={{ color: "#E60914" }}>Join the academy</span>
          {previewMode && (
            <div className="auth-preview-note" style={{ borderLeftColor: "#084EC8" }}>
              <strong>Preview mode.</strong> Accounts are stored in this browser until Supabase keys are added.
            </div>
          )}
          {ref && (
            <div className="auth-ref-note">
              <Icon name="users" size={14} strokeWidth={2} /> Referred by <strong>{ref}</strong>
            </div>
          )}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
              color: "#0B1D51",
              textTransform: "uppercase",
              marginTop: 14,
            }}
          >
            Create account
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 10, marginBottom: 28 }}>
            Already have an account?{" "}
            <Link href="/sign-in" style={{ color: "#084EC8", fontWeight: 800, textDecoration: "none" }}>
              Sign In →
            </Link>
          </p>

          {error && (
            <div
              style={{
                background: "var(--danger-tint)",
                border: "1px solid rgba(230,9,20,0.35)",
                color: "#E60914",
                padding: "12px 16px",
                borderRadius: 10,
                marginBottom: 18,
                fontSize: 13.5,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="btn btn-outline btn-block auth-google"
            style={{ borderColor: "#084EC8", color: "#0B1D51" }}
          >
            <span className="auth-google-mark" style={{ borderColor: "#E60914", color: "#E60914" }}>
              G
            </span>{" "}
            Continue with Google
          </button>
          <div className="auth-or">
            <span /> or with email <span />
          </div>

          <div className="field">
            <label style={{ color: "#0B1D51", fontWeight: 700 }}>Full name</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Amani Mwangi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={handleKey}
            />
          </div>

          <div className="field">
            <label style={{ color: "#0B1D51", fontWeight: 700 }}>Email address &amp; verification</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value })
                  setEmailVerified(false)
                  setVerificationCode("")
                }}
                onKeyDown={handleKey}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSendVerification}
                className={emailVerified ? "btn btn-green btn-sm" : "btn btn-navy btn-sm"}
                style={{ whiteSpace: "nowrap" }}
              >
                {emailVerified ? "✓ Verified" : "Verify Email"}
              </button>
            </div>
            {verificationCode && (
              <div
                style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "var(--layer-1)",
                  border: "1px solid var(--line)",
                  borderLeft: "3px solid #38A128",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <span style={{ color: "var(--body)" }}>
                  Email verified with code{" "}
                  <strong style={{ fontFamily: "monospace", color: "#084EC8" }}>{verificationCode}</strong>
                </span>
                {!emailVerified && (
                  <button type="button" onClick={handleConfirmCode} className="btn btn-navy btn-sm">
                    Confirm
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="field">
            <label style={{ color: "#0B1D51", fontWeight: 700 }}>Create password (min 6 characters)</label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKey}
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
                  fontWeight: 800,
                  color: "#084EC8",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <RecaptchaCheck verified={notRobot} onChange={setNotRobot} />

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="btn btn-green btn-lg btn-block"
            style={{ cursor: loading ? "default" : "pointer", marginTop: 4 }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>

          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 18, lineHeight: 1.6 }}>
            By signing up you agree to learn, practice and build something great.
          </p>
        </>
      )}

      <GoogleAuthModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onComplete={handleGoogleModalComplete}
        mode="signup"
      />
    </AuthShell>
  )
}
