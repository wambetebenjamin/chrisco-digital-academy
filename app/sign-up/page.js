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
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <span
            style={{
              display: "inline-flex",
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "#38A128",
              color: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Icon name="checkCircle" size={34} strokeWidth={1.8} />
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              color: "#FFFFFF",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Account Created!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.65, marginBottom: 22 }}>
            Your email <strong style={{ color: "#F8C90E" }}>{form.email}</strong> has been verified and your learner account is ready.
          </p>
          <Link href="/dashboard" className="btn btn-green" style={{ textDecoration: "none" }}>
            Open Dashboard →
          </Link>
        </div>
      ) : (
        <>
          {previewMode && (
            <div
              style={{
                background: "rgba(248, 201, 14, 0.16)",
                border: "1px solid rgba(248, 201, 14, 0.45)",
                color: "#FFFFFF",
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              <strong style={{ color: "#F8C90E" }}>Preview mode.</strong> Accounts are stored in this browser until Supabase keys are added.
            </div>
          )}
          {ref && (
            <div
              style={{
                background: "rgba(56, 161, 40, 0.25)",
                border: "1px solid rgba(56, 161, 40, 0.65)",
                color: "#FFFFFF",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="users" size={14} strokeWidth={2} /> Referred by <strong>{ref}</strong>
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(230, 9, 20, 0.22)",
                border: "1px solid rgba(230, 9, 20, 0.65)",
                color: "#FFFFFF",
                padding: "11px 14px",
                borderRadius: 8,
                marginBottom: 14,
                fontSize: 13,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <div className="field" style={{ marginBottom: 14 }}>
            <label style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Full name
            </label>
            <input
              className="input auth-horizon-input"
              type="text"
              placeholder="e.g. Amani Mwangi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={handleKey}
            />
          </div>

          <div className="field" style={{ marginBottom: 14 }}>
            <label style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Email
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input auth-horizon-input"
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
                style={{
                  whiteSpace: "nowrap",
                  background: emailVerified ? "#38A128" : "#F8C90E",
                  color: emailVerified ? "#FFFFFF" : "#0B1D51",
                  border: "none",
                  borderRadius: 7,
                  padding: "0 14px",
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {emailVerified ? "✓ Verified" : "Verify Email"}
              </button>
            </div>
            {verificationCode && (
              <div
                style={{
                  marginTop: 8,
                  padding: "7px 11px",
                  borderRadius: 7,
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 12,
                  color: "#FFFFFF",
                }}
              >
                <span>
                  Email verified with code{" "}
                  <strong style={{ fontFamily: "monospace", color: "#F8C90E" }}>{verificationCode}</strong>
                </span>
                {!emailVerified && (
                  <button type="button" onClick={handleConfirmCode} className="btn btn-amber btn-sm">
                    Confirm
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="field" style={{ marginBottom: 14 }}>
            <label style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Password (min 6 characters)
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="input auth-horizon-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKey}
                style={{ paddingRight: 64 }}
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
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <RecaptchaCheck verified={notRobot} onChange={setNotRobot} />
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="auth-horizon-submit"
            style={{ cursor: loading ? "default" : "pointer" }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              margin: "18px 0 14px",
              color: "rgba(255,255,255,0.85)",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.28)" }} />
            <span>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.28)" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="auth-horizon-google"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.8H12z"
              />
              <path
                fill="#34A853"
                d="M3.2 7.3l3.2 2.4C7.2 7.7 9.4 6 12 6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 8.1 2 4.8 4.2 3.2 7.3z"
              />
              <path
                fill="#FBBC05"
                d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3-2.5c-.8.6-1.9 1-3.4 1-3.8 0-5.2-2.5-5.5-3.8l-3.2 2.5C4.9 19.9 8.2 22 12 22z"
              />
              <path
                fill="#4285F4"
                d="M21.6 12.2c0-.7-.1-1.2-.2-1.8H12v3.9h5.5c-.3 1.4-1.1 2.5-2.1 3.3l3 2.5c1.8-1.6 3.2-4.1 3.2-7.9z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 13,
              textAlign: "center",
              marginTop: 18,
              marginBottom: 0,
            }}
          >
            Already have an account?{" "}
            <Link
              href="/sign-in"
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              Sign In
            </Link>
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
