"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase, isSupabaseConfigured } from "./supabase"
import {
  previewSignUp,
  previewSignIn,
  previewSession,
  previewSignOut,
} from "./lib/previewAuth"
import { captureRefFromLocation, readRef } from "./lib/referral"

const AuthContext = createContext(null)
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"]
const PROTECTED_ROUTES = ["/dashboard"]
// Only these routes wait for the session check before revealing content.
// Public marketing pages render immediately so their HTML is fully
// server-rendered / statically prerendered (better first paint + SEO).
const AUTH_GATED_ROUTES = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (data) setProfile(data)
  }

  useEffect(() => {
    // Capture any ?ref= code the visitor arrived with, whatever the page.
    captureRefFromLocation()

    if (!isSupabaseConfigured) {
      // Preview mode: accounts live in localStorage (see lib/previewAuth).
      const session = previewSession()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(session ?? null)
      setProfile(session ? { name: session.name, email: session.email } : null)
      setLoading(false)
      return undefined
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return
    // Public site: only the dashboard requires signing in.
    if (PROTECTED_ROUTES.includes(pathname) && !user) router.push("/sign-in")
    // Signed-in users skip the auth screens.
    if (user && PUBLIC_ROUTES.includes(pathname)) router.push("/dashboard")
  }, [user, loading, pathname])

  async function signUp(name, email, password) {
    if (!isSupabaseConfigured) {
      const result = previewSignUp({ name, email, password, ref: readRef() })
      if (result.error) throw new Error(result.error.message)
      setUser(result.data.user)
      setProfile({ name: result.data.user.name, email: result.data.user.email })
      return result.data
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, ref: readRef() } }
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      const result = previewSignIn({ email, password })
      if (result.error) throw new Error(result.error.message)
      setUser(result.data.user)
      setProfile({ name: result.data.user.name, email: result.data.user.email })
      return result.data
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function logout() {
    if (!isSupabaseConfigured) {
      previewSignOut()
      setUser(null)
      setProfile(null)
      router.push("/")
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push("/sign-in")
  }

  async function enrollCourse(courseTitle) {
    if (!user) return
    if (!isSupabaseConfigured) {
      // Preview mode keeps enrolments in localStorage so the dashboard works.
      try {
        const key = "chrisco:preview-enrollments"
        const existing = JSON.parse(window.localStorage.getItem(key) || "[]")
        window.localStorage.setItem(
          key,
          JSON.stringify([...existing.filter((e) => e.course_title !== courseTitle), { user_id: user.id, course_title: courseTitle, created_at: new Date().toISOString() }])
        )
      } catch {
        /* storage unavailable, nothing to persist */
      }
      return
    }
    const { error } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_title: courseTitle })
    if (error) throw error
  }

  async function getEnrollments() {
    if (!user) return []
    if (!isSupabaseConfigured) {
      try {
        const existing = JSON.parse(window.localStorage.getItem("chrisco:preview-enrollments") || "[]")
        return existing.filter((e) => e.user_id === user.id)
      } catch {
        return []
      }
    }
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
    return data || []
  }

  if (loading && AUTH_GATED_ROUTES.includes(pathname)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              color: "var(--navy)",
              margin: "0 auto 20px",
            }}
          >
            C
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#fff", marginBottom: 16 }}>
            CHRISCO Digital Academy
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinner" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, previewMode: !isSupabaseConfigured, signUp, signIn, logout, enrollCourse, getEnrollments }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
