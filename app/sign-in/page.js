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
    <AuthShell subtitle="Sign in to track your courses, handbooks and learning progress across the academy.">
      <span className="eyebrow" style={{ color: "#E60914" }}>Welcome back</span>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
          color: "#0B1D51",
          textTransform: "uppercase",
          marginTop: 14,
        }}
      >
        Sign in
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 10, marginBottom: 28 }}>
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" style={{ color: "#084EC8", fontWeight: 800, textDecoration: "none" }}>
          Create one free →
        </Link>
      </p>

      {previewMode && (
        <div className="auth-preview-note" style={{ borderLeftColor: "#084EC8" }}>
          <strong>Preview mode.</strong> Supabase keys are not set, so accounts are stored in this browser only.
          Sign up once, then sign in with the same details.
        </div>
      )}

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
        <label style={{ color: "#0B1D51", fontWeight: 700 }}>Email address</label>
        <input
          className="input"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyDown={handleKey}
        />
      </div>
      <div className="field">
        <label style={{ color: "#0B1D51", fontWeight: 700 }}>Password</label>
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
        onClick={handleLogin}
        disabled={loading}
        className="btn btn-green btn-lg btn-block"
        style={{ cursor: loading ? "default" : "pointer", marginTop: 4 }}
      >
        {loading ? "Signing in..." : "Sign In →"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0 16px" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>or</span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <Link
        href="/"
        className="btn btn-outline btn-block"
        style={{ textDecoration: "none", borderColor: "#084EC8", color: "#084EC8" }}
      >
        ← Back to homepage
      </Link>

      <GoogleAuthModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onComplete={handleGoogleModalComplete}
        mode="signin"
      />
    </AuthShell>
  )
}
