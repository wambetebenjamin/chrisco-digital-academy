"use client"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../AuthProvider"
import AuthShell from "../components/AuthShell"
import GoogleAuthModal from "../components/GoogleAuthModal"
import RecaptchaCheck from "../components/RecaptchaCheck"

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
}

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [notRobot, setNotRobot] = useState(false)
  const [error, setError] = useState("")
  const [forgotSent, setForgotSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  const { signIn, signInWithGoogle, previewMode } = useAuth()

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
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
    setLoading(true)
    setError("")
    try {
      await signIn(form.email.trim(), form.password)
    } catch (err) {
      setError(err.message || "Invalid email or password.")
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
    if (e.key === "Enter") handleLogin()
  }

  return (
    <AuthShell subtitle="Embark on a practical digital learning journey where every skill, handbook, and AI studio tool is within your reach.">
      {previewMode && (
        <div
          style={{
            background: "rgba(248, 201, 14, 0.16)",
            border: "1px solid rgba(248, 201, 14, 0.45)",
            color: "#FFFFFF",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#F8C90E" }}>Preview mode.</strong> Sign up once, then sign in with the same details.
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
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {forgotSent && (
        <div
          style={{
            background: "rgba(56, 161, 40, 0.25)",
            border: "1px solid rgba(56, 161, 40, 0.7)",
            color: "#FFFFFF",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 12.5,
            textAlign: "center",
          }}
        >
          Password recovery instructions have been prepared for {form.email || "your account"}.
        </div>
      )}

      <div className="field" style={{ marginBottom: 16 }}>
        <label style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600, marginBottom: 7, display: "block" }}>
          Email
        </label>
        <input
          className="input auth-horizon-input"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyDown={handleKey}
        />
      </div>

      <div className="field" style={{ marginBottom: 8 }}>
        <label style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600, marginBottom: 7, display: "block" }}>
          Password
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

      <div style={{ textAlign: "right", marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => setForgotSent(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "#FFFFFF",
            fontSize: 12.5,
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Forgot password?
        </button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <RecaptchaCheck verified={notRobot} onChange={setNotRobot} />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="auth-horizon-submit"
        style={{ cursor: loading ? "default" : "pointer" }}
      >
        {loading ? "SIGNING IN..." : "SIGN IN"}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "20px 0 16px",
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
          marginTop: 20,
          marginBottom: 0,
        }}
      >
        Are you new?{" "}
        <Link
          href="/sign-up"
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            textDecoration: "underline",
          }}
        >
          Create an Account
        </Link>
      </p>

      <GoogleAuthModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onComplete={handleGoogleModalComplete}
        mode="signin"
      />
    </AuthShell>
  )
}
