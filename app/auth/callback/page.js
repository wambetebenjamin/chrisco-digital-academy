"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../AuthProvider"
import Icon from "../../components/Icon"

/*
 * Landing route for OAuth providers (Google).
 *
 * Supabase redirects here with the session in the URL hash. The browser client
 * picks it up automatically; this screen simply waits for the session and then
 * forwards the learner to the dashboard.
 */
export default function AuthCallback() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (loading) return
    if (user) {
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard"
      router.replace(next)
    }
  }, [user, loading, router])

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <span style={{ width: 56, height: 56, borderRadius: 16, background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Icon name="user" size={26} strokeWidth={2} />
        </span>
        <h1 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.3rem", color: "#fff", marginBottom: 10 }}>
          {loading ? "Signing you in" : slow && !user ? "We could not complete sign in" : "Signing you in"}
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 22 }}>
          {slow && !user
            ? "The provider did not return a session. Check that this site's URL is listed in Supabase redirect URLs, then try again."
            : "Finishing the handshake with Google. This takes a moment."}
        </p>
        {!loading && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-in" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
              Back to sign in
            </Link>
            <Link href="/courses" className="btn btn-outline-light btn-sm" style={{ textDecoration: "none" }}>
              Browse courses
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
