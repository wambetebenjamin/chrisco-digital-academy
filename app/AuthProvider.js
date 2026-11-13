"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isBackendConfigured, SHEETS, submitRow, fetchSheet } from "./lib/googleSheets"
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
import {
  syncAuthenticatedUserBookAccess,
  revokeBookRegistration,
} from "./lib/bookGateClient"

const AuthContext = createContext(null)
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"]
const PROTECTED_ROUTES = ["/dashboard"]
const AUTH_GATED_ROUTES = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES]
const PROGRESS_STORAGE_KEY = "chrisco:course-progress"
const SAVED_BOOKS_STORAGE_KEY = "chrisco:saved-books"

function readSavedBooksMap() {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_BOOKS_STORAGE_KEY) || "{}")
  } catch {
    return {}
  }
}

function writeSavedBooksMap(map) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(SAVED_BOOKS_STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim())
  )
}

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
  const [savedBooks, setSavedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastAutoReply, setLastAutoReply] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const emailKey = String(user?.email || "").trim().toLowerCase()
    if (!emailKey) {
      setSavedBooks([])
      return
    }
    const allSaved = readSavedBooksMap()
    const localList = Array.isArray(allSaved[emailKey]) ? allSaved[emailKey] : []
    const metaList = Array.isArray(user?.user_metadata?.saved_books)
      ? user.user_metadata.saved_books
      : []
    const merged = Array.from(new Set([...localList, ...metaList]))
    setSavedBooks(merged)
  }, [user?.email])

  async function fetchProfile(userId, fallbackUser = null) {
    if (!isBackendConfigured) return
    try {
      const rows = await fetchSheet(SHEETS.learners, { filter: { id: userId } })
      const data = rows[0] || null
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
    if (!isBackendConfigured) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(localSession ?? null)
      setProfile(localSession ? { name: localSession.name, email: localSession.email } : null)
      if (localSession?.email) syncAuthenticatedUserBookAccess(localSession)
      setLoading(false)
      return undefined
    }

    if (localSession) {
      setUser(localSession)
      setProfile({ name: localSession.name, email: localSession.email })
      if (localSession.email) syncAuthenticatedUserBookAccess(localSession)
    }

    // No auth server to poll: the session lives in this browser and the
    // Learners sheet is the record of who exists.
    setLoading(false)
    return undefined
  }, [])

  useEffect(() => {
    if (loading) return
    if (PROTECTED_ROUTES.includes(pathname) && !user) router.push("/sign-in")
    if (user && PUBLIC_ROUTES.includes(pathname)) {
      let nextDest = "/dashboard"
      if (typeof window !== "undefined") {
        const rawNext = new URLSearchParams(window.location.search).get("next") || ""
        if (rawNext.startsWith("/") && !rawNext.startsWith("//")) {
          nextDest = rawNext
        }
      }
      router.push(nextDest)
    }
  }, [user, loading, pathname])

  async function signUp(name, email, password) {
    const ref = readRef()
    if (!isBackendConfigured) {
      const result = previewSignUp({ name, email, password, ref })
      if (result.error) throw new Error(result.error.message)
      setUser(result.data.user)
      setProfile({ name: result.data.user.name, email: result.data.user.email })
      await syncAuthenticatedUserBookAccess(result.data.user)
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

    // One POST to the Apps Script: it appends the learner row and answers
    // with the stored record.
    const res = await submitRow(SHEETS.learners, {
      action: "signup",
      name,
      email,
      password,
      ref: ref || "",
      created_at: new Date().toISOString(),
    })
    if (!res?.ok) throw new Error(res?.error || "Could not create your account.")
    const data = { user: res.learner }

    // Also mirror in local preview store for resilience
    previewSignUp({ name, email, password, ref })

    if (data?.user) {
      setUser(data.user)
      setProfile({
        id: data.user.id,
        name: name || data.user.email?.split("@")[0] || "Student",
        email: data.user.email || email,
      })
      await syncAuthenticatedUserBookAccess(data.user)
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
    if (!isBackendConfigured) {
      const result = previewSignIn({ email, password })
      if (result.error) throw new Error(result.error.message)
      setUser(result.data.user)
      setProfile({ name: result.data.user.name, email: result.data.user.email })
      await syncAuthenticatedUserBookAccess(result.data.user)
      return result.data
    }

    const res = await submitRow(SHEETS.learners, {
      action: "signin",
      email,
      password,
    })
    if (res?.ok && res.learner) {
      const data = { user: res.learner }
      setUser(data.user)
      fetchProfile(data.user.id, data.user)
      await syncAuthenticatedUserBookAccess(data.user)
      return data
    }

    // Check if account exists in local preview store
    const localAttempt = previewSignIn({ email, password })
    if (!localAttempt.error && localAttempt.data?.user) {
      setUser(localAttempt.data.user)
      setProfile({ name: localAttempt.data.user.name, email: localAttempt.data.user.email })
      await syncAuthenticatedUserBookAccess(localAttempt.data.user)
      return localAttempt.data
    }

    throw new Error(res?.error || localAttempt.error?.message || "Invalid email or password.")
  }

  async function signInWithGoogle(next = "/dashboard", googleAccount = null) {
    const ref = readRef()

    // When GoogleAuthModal passes a chosen Google account, sign in via the Sheet-backed bridge
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
        await syncAuthenticatedUserBookAccess({ id: u.id, email: resolvedEmail })
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
      if (next) router.push(next)
      return { data: res.data }
    }

    // With a Sheets backend there is no hosted OAuth provider to redirect to:
    // the GoogleAuthModal collects the account and posts it as a learner row.
    return { openModal: true }
  }

  async function logout() {
    previewSignOut()
    revokeBookRegistration()
    setUser(null)
    setProfile(null)
    router.push("/")
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

    if (!isBackendConfigured) return
    const applicantName =
      profile?.name || user.user_metadata?.name || user.user_metadata?.full_name || user.name || ""
    await submitRow(SHEETS.enrolments, {
      action: "enrol",
      user_id: isUuid(user.id) ? user.id : "",
      course_title: courseTitle,
      course_id: courseMeta.id || "",
      category: courseMeta.category || "",
      level: courseMeta.level || "",
      applicant_name: applicantName,
      applicant_email: user.email || "",
      applicant_phone: courseMeta.phone || "",
      status: "active",
      updated_at: new Date().toISOString(),
    })
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

    if (!isBackendConfigured) {
      return localRows.map((r) => ({
        ...r,
        enrolled_at: r.enrolled_at || r.created_at || new Date().toISOString(),
        progress: progressMap[r.course_title]?.progress ?? r.progress ?? 0,
        completed_modules: progressMap[r.course_title]?.completed_modules ?? r.completed_modules ?? [],
      }))
    }

    try {
      const remoteRows = await fetchSheet(SHEETS.enrolments, {
        filter: user.email ? { email: user.email } : {},
      })
      const seenRemote = new Set()
      const out = []
      for (const r of remoteRows) {
        const title = r.course_title
        if (!title || seenRemote.has(title)) continue
        seenRemote.add(title)
        out.push({
          user_id: r.user_id || user.id,
          course_title: title,
          course_id: r.course_id || null,
          category: r.category || null,
          level: r.level || null,
          status: r.status || "active",
          created_at: r.created_at || r.updated_at || null,
          enrolled_at: r.created_at || r.updated_at || null,
          progress: progressMap[title]?.progress ?? (Number(r.progress) || 0),
          completed_modules:
            progressMap[title]?.completed_modules ?? String(r.completed_modules || "").split(",").filter(Boolean),
        })
      }
      for (const r of localRows) {
        if (seenRemote.has(r.course_title)) continue
        out.push({
          ...r,
          enrolled_at: r.enrolled_at || r.created_at || new Date().toISOString(),
          progress: progressMap[r.course_title]?.progress ?? r.progress ?? 0,
          completed_modules: progressMap[r.course_title]?.completed_modules ?? r.completed_modules ?? [],
        })
      }
      return out
    } catch {
      return localRows
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

  function persistSavedBooksForEmail(emailKey, nextList) {
    if (!emailKey) return
    const map = readSavedBooksMap()
    map[emailKey] = nextList
    writeSavedBooksMap(map)
    setSavedBooks(nextList)
    if (isBackendConfigured) {
      submitRow(SHEETS.savedBooks, {
        action: "save_books",
        email: emailKey,
        saved_books: nextList.join(", "),
        updated_at: new Date().toISOString(),
      }).catch(() => {})
    }
  }

  function saveBook(slug, explicitEmail = "") {
    const cleanSlug = String(slug || "").trim().toLowerCase()
    const emailKey = String(explicitEmail || user?.email || "").trim().toLowerCase()
    if (!cleanSlug || !emailKey) return false
    const map = readSavedBooksMap()
    const current = Array.isArray(map[emailKey]) ? map[emailKey] : savedBooks
    const nextList = Array.from(new Set([cleanSlug, ...current]))
    persistSavedBooksForEmail(emailKey, nextList)
    return true
  }

  function toggleSavedBook(slug) {
    const cleanSlug = String(slug || "").trim().toLowerCase()
    const emailKey = String(user?.email || "").trim().toLowerCase()
    if (!cleanSlug || !emailKey) return false
    const exists = savedBooks.includes(cleanSlug)
    const nextList = exists
      ? savedBooks.filter((s) => s !== cleanSlug)
      : [cleanSlug, ...savedBooks]
    persistSavedBooksForEmail(emailKey, nextList)
    return !exists
  }

  function isBookSaved(slug) {
    const cleanSlug = String(slug || "").trim().toLowerCase()
    return Boolean(cleanSlug && savedBooks.includes(cleanSlug))
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
        previewMode: !isBackendConfigured,
        lastAutoReply,
        setLastAutoReply,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
        enrollCourse,
        getEnrollments,
        updateCourseProgress,
        savedBooks,
        saveBook,
        toggleSavedBook,
        isBookSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
