"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase, isSupabaseConfigured, SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY } from "./supabase"
import {
  previewSignUp,
  previewSignIn,
  previewSession,
  previewSignOut,
} from "./lib/previewAuth"
import { captureRefFromLocation, readRef } from "./lib/referral"
import {
  submitAcademyIntake,
  authenticateWithGoogleBridge,
  updateCourseProgressInBackend,
} from "./lib/intakeClient"

const AuthContext = createContext(null)
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"]
const PROTECTED_ROUTES = ["/dashboard"]
const AUTH_GATED_ROUTES = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES]
const PROGRESS_STORAGE_KEY = "chrisco:course-progress"

function readLocalProgressMap() {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}")
  } catch {
    return {}
  }
}

function writeLocalProgressMap(map) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastAutoReply, setLastAutoReply] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  async function fetchProfile(userId, fallbackUser = null) {
    if (!isSupabaseConfigured || !supabase) return
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()
      if (data) {
        setProfile(data)
      } else if (fallbackUser) {
        setProfile({
          id: userId,
          name:
            fallbackUser.user_metadata?.name ||
            fallbackUser.user_metadata?.full_name ||
            fallbackUser.email?.split("@")[0] ||
            "Student",
          email: fallbackUser.email,
        })
      }
    } catch {
      if (fallbackUser) {
        setProfile({
          id: userId,
          name:
            fallbackUser.user_metadata?.name ||
            fallbackUser.user_metadata?.full_name ||
            fallbackUser.email?.split("@")[0] ||
            "Student",
          email: fallbackUser.email,
        })
      }
    }
  }

  useEffect(() => {
    captureRefFromLocation()

    const localSession = previewSession()
    if (!isSupabaseConfigured) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(localSession ?? null)
      setProfile(localSession ? { name: localSession.name, email: localSession.email } : null)
      setLoading(false)
      return undefined
    }

    if (localSession) {
      setUser(localSession)
      setProfile({ name: localSession.name, email: localSession.email })
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user)
          fetchProfile(session.user.id, session.user)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id, session.user)
      } else {
        const fallback = previewSession()
        if (!fallback) {
          setUser(null)
          setProfile(null)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return
    if (PROTECTED_ROUTES.includes(pathname) && !user) router.push("/sign-in")
    if (user && PUBLIC_ROUTES.includes(pathname)) router.push("/dashboard")
  }, [user, loading, pathname])

  async function signUp(name, email, password) {
    const ref = readRef()
    if (!isSupabaseConfigured) {
      const result = previewSignUp({ name, email, password, ref })
      if (result.error) throw new Error(result.error.message)
      setUser(result.data.user)
      setProfile({ name: result.data.user.name, email: result.data.user.email })
      const intake = await submitAcademyIntake({
        action: "signup_welcome",
        name,
        email,
        ref,
        user_id: result.data.user.id,
      })
      if (intake?.auto_reply) setLastAutoReply(intake.auto_reply)
      return { ...result.data, autoReply: intake?.auto_reply || null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, full_name: name, ref } },
    })
    if (error) throw error

    // Also mirror in local preview store for resilience
    previewSignUp({ name, email, password, ref })

    if (data?.user) {
      setUser(data.user)
      setProfile({
        id: data.user.id,
        name: name || data.user.email?.split("@")[0] || "Student",
        email: data.user.email || email,
      })
    }

    const intake = await submitAcademyIntake({
      action: "signup_welcome",
      name,
      email,
      ref,
      user_id: data?.user?.id || null,
    })
    if (intake?.auto_reply) setLastAutoReply(intake.auto_reply)

    return { ...data, autoReply: intake?.auto_reply || null }
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
    if (!error && data?.user) {
      setUser(data.user)
      fetchProfile(data.user.id, data.user)
      return data
    }

    // Check if account exists in local preview store
    const localAttempt = previewSignIn({ email, password })
    if (!localAttempt.error && localAttempt.data?.user) {
      setUser(localAttempt.data.user)
      setProfile({ name: localAttempt.data.user.name, email: localAttempt.data.user.email })
      return localAttempt.data
    }

    throw error || new Error(localAttempt.error?.message || "Invalid email or password.")
  }

  async function signInWithGoogle(next = "/dashboard", googleAccount = null) {
    const ref = readRef()

    // When GoogleAuthModal passes a chosen Google account, sign in via our Supabase Google Auth Bridge
    if (googleAccount?.email) {
      const res = await authenticateWithGoogleBridge({
        name: googleAccount.name,
        email: googleAccount.email,
        password: googleAccount.password,
        avatar_url: googleAccount.avatar_url,
        ref,
      })
      if (res.error) throw new Error(res.error.message)

      if (res.data?.user) {
        const u = res.data.user
        const resolvedName =
          u.user_metadata?.name || u.user_metadata?.full_name || u.name || googleAccount.name
        const resolvedEmail = u.email || googleAccount.email
        if (googleAccount.password) {
          previewSignUp({
            name: resolvedName,
            email: resolvedEmail,
            password: googleAccount.password,
            ref,
          })
        }
        setUser(u)
        setProfile({ id: u.id, name: resolvedName, email: resolvedEmail, provider: "google" })
        try {
          window.localStorage.setItem(
            "chrisco:preview-session",
            JSON.stringify({
              id: u.id,
              name: resolvedName,
              email: resolvedEmail,
              provider: "google",
              ref: ref || null,
            })
          )
        } catch {
          /* ignore */
        }
      }
      router.push(next)
      return { data: res.data }
    }

    if (isSupabaseConfigured) {
      try {
        const settingsRes = await fetch(`${SUPABASE_PROJECT_URL}/auth/v1/settings`, {
          headers: { apikey: SUPABASE_ANON_KEY },
        })
        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          if (settings?.external?.google) {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
                queryParams: { access_type: "offline", prompt: "consent" },
              },
            })
            if (error) throw error
            return { redirected: true }
          }
        }
      } catch {
        /* fall through to Google Account Modal */
      }
    }

    return { openModal: true }
  }

  async function logout() {
    previewSignOut()
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut()
      } catch {
        /* ignore */
      }
    }
    setUser(null)
    setProfile(null)
    router.push(isSupabaseConfigured ? "/sign-in" : "/")
  }

  async function enrollCourse(courseTitle, courseMeta = {}) {
    if (!user) return
    try {
      const key = "chrisco:preview-enrollments"
      const existing = JSON.parse(window.localStorage.getItem(key) || "[]")
      const nowIso = new Date().toISOString()
      window.localStorage.setItem(
        key,
        JSON.stringify([
          ...existing.filter((e) => !(e.user_id === user.id && e.course_title === courseTitle)),
          {
            user_id: user.id,
            course_title: courseTitle,
            created_at: nowIso,
            enrolled_at: nowIso,
            progress: 0,
            completed_modules: [],
          },
        ])
      )
    } catch {
      /* storage unavailable */
    }

    if (!isSupabaseConfigured || !supabase) return
    try {
      await supabase.from("enrollments").upsert(
        {
          user_id: user.id,
          course_title: courseTitle,
          course_id: courseMeta.id || null,
          category: courseMeta.category || null,
          level: courseMeta.level || null,
          applicant_name: profile?.name || user.user_metadata?.name || user.name || null,
          applicant_email: user.email || null,
          applicant_phone: courseMeta.phone || null,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_title" }
      )
    } catch {
      /* local enrollment already saved */
    }
  }

  async function getEnrollments() {
    if (!user) return []
    const progressMap = readLocalProgressMap()[user.id] || {}
    let localRows = []
    try {
      const existing = JSON.parse(window.localStorage.getItem("chrisco:preview-enrollments") || "[]")
      localRows = existing.filter((e) => e.user_id === user.id)
    } catch {
      localRows = []
    }

    if (!isSupabaseConfigured || !supabase) {
      return localRows.map((r) => ({
        ...r,
        enrolled_at: r.enrolled_at || r.created_at || new Date().toISOString(),
        progress: progressMap[r.course_title]?.progress ?? r.progress ?? 0,
        completed_modules: progressMap[r.course_title]?.completed_modules ?? r.completed_modules ?? [],
      }))
    }

    try {
      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      const remoteRows = (data || []).map((r) => ({
        ...r,
        enrolled_at: r.enrolled_at || r.created_at || new Date().toISOString(),
        progress:
          progressMap[r.course_title]?.progress !== undefined
            ? progressMap[r.course_title].progress
            : r.progress || 0,
        completed_modules:
          progressMap[r.course_title]?.completed_modules || r.completed_modules || [],
      }))

      const seenTitles = new Set(remoteRows.map((r) => r.course_title))
      return [
        ...remoteRows,
        ...localRows
          .filter((l) => !seenTitles.has(l.course_title))
          .map((l) => ({
            ...l,
            enrolled_at: l.enrolled_at || l.created_at || new Date().toISOString(),
            progress: progressMap[l.course_title]?.progress ?? l.progress ?? 0,
            completed_modules: progressMap[l.course_title]?.completed_modules ?? l.completed_modules ?? [],
          })),
      ]
    } catch {
      return localRows.map((r) => ({
        ...r,
        enrolled_at: r.enrolled_at || r.created_at || new Date().toISOString(),
        progress: progressMap[r.course_title]?.progress ?? r.progress ?? 0,
        completed_modules: progressMap[r.course_title]?.completed_modules ?? r.completed_modules ?? [],
      }))
    }
  }

  async function updateCourseProgress(courseTitle, completedModules = [], totalModules = 6) {
    if (!user) return null
    const pct = Math.min(
      100,
      Math.round((completedModules.length / Math.max(1, totalModules)) * 100)
    )
    const allMap = readLocalProgressMap()
    const userMap = allMap[user.id] || {}
    userMap[courseTitle] = {
      progress: pct,
      completed_modules: completedModules,
      updated_at: new Date().toISOString(),
    }
    allMap[user.id] = userMap
    writeLocalProgressMap(allMap)

    await updateCourseProgressInBackend({
      user_id: user.id,
      course_title: courseTitle,
      progress: pct,
      completed_modules: completedModules,
    })

    return {
      course_title: courseTitle,
      progress: pct,
      completed_modules: completedModules,
    }
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
      value={{
        user,
        profile,
        loading,
        previewMode: !isSupabaseConfigured,
        lastAutoReply,
        setLastAutoReply,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
        enrollCourse,
        getEnrollments,
        updateCourseProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
