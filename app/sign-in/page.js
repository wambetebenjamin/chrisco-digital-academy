"use client"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../AuthProvider"
import AuthShell from "../components/AuthShell"

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signIn(form.email, form.password)
    } catch (err) {
      setError(err.message || "Invalid email or password.")
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <AuthShell subtitle="Sign in to track your courses, certificates and learning progress across the academy.">
      <span className="eyebrow">Welcome back</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 4vw, 2.6rem)", color: "var(--ink)", textTransform: "uppercase", marginTop: 14 }}>
        Sign in
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 10, marginBottom: 32 }}>
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" style={{ color: "var(--green-deep)", fontWeight: 700, textDecoration: "none" }}>
          Create one free →
        </Link>
      </p>

      {error && (
        <div style={{ background: "var(--danger-tint)", border: "1px solid rgba(229,72,77,0.3)", color: "var(--danger)", padding: "12px 16px", borderRadius: 12, marginBottom: 18, fontSize: 13.5, textAlign: "center" }}>
          {error}
        </div>
      )}

      <div className="field">
        <label>Email address</label>
        <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onKeyDown={handleKey} />
      </div>
      <div className="field">
        <label>Password</label>
        <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={handleKey} />
      </div>

      <button onClick={handleLogin} disabled={loading} className="btn btn-green btn-lg btn-block" style={{ cursor: loading ? "default" : "pointer", marginTop: 6 }}>
        {loading ? "Signing in..." : "Sign In →"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "26px 0 18px" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>or</span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <Link href="/" className="btn btn-outline btn-block" style={{ textDecoration: "none" }}>
        ← Back to homepage
      </Link>
    </AuthShell>
  )
}
