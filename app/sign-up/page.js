"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "../AuthProvider"
import AuthShell from "../components/AuthShell"
import Icon from "../components/Icon"
import { readRef } from "../lib/referral"

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp, signInWithGoogle, previewMode } = useAuth()
  const [ref, setRef] = useState("")

  useEffect(() => {
    // One-shot read of the stored referral code.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRef(readRef())
  }, [])

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

  async function handleGoogle() {
    setError("")
    setLoading(true)
    try {
      await signInWithGoogle("/dashboard")
    } catch (err) {
      setError(err.message || "Google sign-in is not available right now.")
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSignUp()
  }

  return (
    <AuthShell subtitle="Join thousands of young Africans building real, practical digital skills, for free, forever.">
      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <span style={{ display: "inline-flex", width: 76, height: 76, borderRadius: "50%", background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <Icon name="mail" size={36} strokeWidth={1.6} />
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", color: "var(--ink)", textTransform: "uppercase", marginBottom: 12 }}>
            {previewMode ? "You are in." : "Check your email!"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 26 }}>
            {previewMode ? (
              <>
                Your preview account for <strong style={{ color: "var(--green-deep)" }}>{form.email}</strong> was
                created in this browser. Open your dashboard to continue.
              </>
            ) : (
              <>
                We sent a confirmation link to{" "}
                <strong style={{ color: "var(--green-deep)" }}>{form.email}</strong>. Click it to activate your
                account, then sign in.
              </>
            )}
          </p>
          <Link href={previewMode ? "/dashboard" : "/sign-in"} className="btn btn-green" style={{ textDecoration: "none" }}>
            {previewMode ? "Open Dashboard →" : "Go to Sign In →"}
          </Link>
        </div>
      ) : (
        <>
          <span className="eyebrow">Join the academy</span>
          {previewMode && (
            <div className="auth-preview-note">
              <strong>Preview mode.</strong> Accounts are stored in this browser until Supabase keys are added.
            </div>
          )}
          {ref && (
            <div className="auth-ref-note">
              <Icon name="users" size={14} strokeWidth={2} /> Referred by <strong>{ref}</strong>
            </div>
          )}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 4vw, 2.6rem)", color: "var(--ink)", textTransform: "uppercase", marginTop: 14 }}>
            Create account
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 10, marginBottom: 32 }}>
            Already have an account?{" "}
            <Link href="/sign-in" style={{ color: "var(--green-deep)", fontWeight: 700, textDecoration: "none" }}>
              Sign In →
            </Link>
          </p>

          {error && (
            <div style={{ background: "var(--danger-tint)", border: "1px solid rgba(229,72,77,0.3)", color: "var(--danger)", padding: "12px 16px", borderRadius: 12, marginBottom: 18, fontSize: 13.5, textAlign: "center" }}>
              {error}
            </div>
          )}

          {!previewMode && (
            <>
              <button type="button" onClick={handleGoogle} disabled={loading} className="btn btn-outline btn-block auth-google">
                <span className="auth-google-mark">G</span> Continue with Google
              </button>
              <div className="auth-or">
                <span /> or with email <span />
              </div>
            </>
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

          <button onClick={handleSignUp} disabled={loading} className="btn btn-green btn-lg btn-block" style={{ cursor: loading ? "default" : "pointer", marginTop: 6 }}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>

          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 18, lineHeight: 1.6 }}>
            By signing up you agree to learn, practice and build something great.
          </p>
        </>
      )}
    </AuthShell>
  )
}
