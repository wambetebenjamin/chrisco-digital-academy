import { CONSENT_POLICY_VERSION, maskEmail } from "../data/booksCatalogue"

export const BOOK_READER_STORAGE_KEY = "chrisco:book-reader"

const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.VITEST === "true" || process.env.NODE_ENV === "test")

export function readLocalBookReader() {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(BOOK_READER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.authenticated) return null
    return parsed
  } catch {
    return null
  }
}

export function writeLocalBookReader(state) {
  if (typeof window === "undefined") return
  try {
    if (!state) {
      window.localStorage.removeItem(BOOK_READER_STORAGE_KEY)
    } else {
      window.localStorage.setItem(BOOK_READER_STORAGE_KEY, JSON.stringify(state))
    }
    window.dispatchEvent(new CustomEvent("chrisco:book-reader-updated", { detail: state }))
  } catch {
    /* ignore storage errors */
  }
}

export async function syncAuthenticatedUserBookAccess(user) {
  const email = String(user?.email || "").trim().toLowerCase()
  const userId = String(user?.id || email).trim()
  if (!userId || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null

  const state = {
    registered: true,
    authenticated: true,
    maskedEmail: maskEmail(email),
    consentVersion: CONSENT_POLICY_VERSION,
    registeredAt: new Date().toISOString(),
  }
  writeLocalBookReader(state)

  if (!isTestEnv && typeof window !== "undefined") {
    try {
      await fetch("/api/books/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          userId,
          email,
          authenticatedAccount: true,
        }),
      })
    } catch {
      /* ignore network errors */
    }
  }
  return state
}

export async function fetchServerBookAccessStatus() {
  if (isTestEnv || typeof window === "undefined") {
    return readLocalBookReader() || { ok: true, registered: false, authenticated: false }
  }
  try {
    const res = await fetch("/api/books/register", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    })
    const data = await res.json()
    if (data?.authenticated) {
      const merged = {
        registered: true,
        authenticated: true,
        maskedEmail: data.maskedEmail || "",
        consentVersion: data.consentVersion || CONSENT_POLICY_VERSION,
      }
      writeLocalBookReader(merged)
      return merged
    }
    return { ok: true, registered: false, authenticated: false }
  } catch {
    return readLocalBookReader() || { ok: true, registered: false, authenticated: false }
  }
}

export async function revokeBookRegistration() {
  writeLocalBookReader(null)
  if (!isTestEnv && typeof window !== "undefined") {
    try {
      await fetch("/api/books/register", {
        method: "DELETE",
        credentials: "same-origin",
      })
    } catch {
      /* ignore */
    }
  }
  return { ok: true }
}
