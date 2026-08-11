"use client"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../AuthProvider"
import AuthShell from "../components/AuthShell"
import Icon from "../components/Icon"

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  async function handleSignUp() {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signUp(form.name, form.email, form.password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong.")
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSignUp()
  }

  return (
    <AuthShell subtitle="Join thousands of young Africans building real, practical digital skills, and earning XP every day.">
      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <span style={{ display: "inline-flex", width: 84, height: 84, borderRadius: 22, background: "var(--lime)", color: "var(--ink)", alignItems: "center", justifyContent: "center", marginBottom: 18, border: "3px solid var(--ink)", boxShadow: "6px 6px 0 0 var(--ink)" }}>
            <Icon name="mail" size={38} strokeWidth={1.8} />
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "var(--ink)", textTransform: "uppercase", marginBottom: 12, lineHeight: 1 }}>
            Check your email
          </h1>
          <p style={{ color: "var(--body)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 26 }}>
            We sent a confirmation link to{" "}
            <strong style={{ color: "var(--purple)" }}>{form.email}</strong>. Click it to activate your account,
            then sign in to start earning XP.
          </p>
          <Link href="/sign-in" className="btn btn-lime btn-lg" style={{ textDecoration: "none" }}>
            Go to Sign In <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <>
          <span className="eyebrow pink">Join the academy</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--ink)", textTransform: "uppercase", marginTop: 14, lineHeight: 0.95 }}>
            Create account
          </h1>
          <p style={{ color: "var(--body)", fontSize: 14.5, marginTop: 12, marginBottom: 28 }}>
            Already have an account?{" "}
            <Link href="/sign-in" style={{ color: "var(--purple)", fontWeight: 800, textDecoration: "none" }}>
              Sign In →
            </Link>
          </p>

          {error && (
            <div className="sticker pink" style={{ marginBottom: 18, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="warn" size={14} /> {error}
            </div>
          )}

          <div className="field">
            <label>Full name</label>
            <input className="input" type="text" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onKeyDown={handleKey} />
          </div>
          <div className="field">
            <label>Email address</label>
            <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onKeyDown={handleKey} />
          </div>
          <div className="field">
            <label>Create password (min 6 characters)</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={handleKey} />
          </div>

          <button onClick={handleSignUp} disabled={loading} className="btn btn-purple btn-lg btn-block" style={{ cursor: loading ? "default" : "pointer", marginTop: 6 }}>
            {loading ? "Creating account..." : "Create Account"} <span aria-hidden>→</span>
          </button>

          <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
            <span className="sticker lime" style={{ fontSize: 10 }}>🔥 Daily streaks</span>
            <span className="sticker yellow" style={{ fontSize: 10 }}>⚡ XP & badges</span>
            <span className="sticker pink" style={{ fontSize: 10 }}>🤖 AI study help</span>
          </div>
        </>
      )}
    </AuthShell>
  )
}
