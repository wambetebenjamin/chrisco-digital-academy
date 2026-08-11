"use client"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../AuthProvider"
import AuthShell from "../components/AuthShell"
import Icon from "../components/Icon"

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
 <AuthShell subtitle="Sign in to track your courses, keep your streaks, earn badges, and unlock new levels across the academy.">
 <span className="eyebrow purple">Welcome back</span>
 <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--ink)", textTransform: "uppercase", marginTop: 14, lineHeight: 0.95 }}>
 Sign in
 </h1>
 <p style={{ color: "var(--body)", fontSize: 14.5, marginTop: 12, marginBottom: 28 }}>
 Don&apos;t have an account?{" "}
 <Link href="/sign-up" style={{ color: "var(--purple)", fontWeight: 800, textDecoration: "none" }}>
 Create one free 
 </Link>
 </p>

 {error && (
 <div className="sticker pink" style={{ marginBottom: 18, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
 <Icon name="warn" size={14} /> {error}
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

 <button onClick={handleLogin} disabled={loading} className="btn btn-lime btn-lg btn-block" style={{ cursor: loading ? "default" : "pointer", marginTop: 6 }}>
 {loading ? "Signing in..." : "Sign In"}
 </button>

 <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "26px 0 18px" }}>
 <div style={{ flex: 1, height: 3, background: "var(--ink)" }} />
 <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>or</span>
 <div style={{ flex: 1, height: 3, background: "var(--ink)" }} />
 </div>

 <Link href="/" className="btn btn-purple btn-block" style={{ textDecoration: "none" }}>
 ← Back to homepage
 </Link>
 </AuthShell>
 )
}
