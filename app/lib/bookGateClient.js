import { CONSENT_POLICY_VERSION, maskEmail } from "../data/booksCatalogue"
import { submitAcademyIntake } from "./intakeClient"

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
    if (!parsed?.registered) return null
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

export async function fetchServerBookAccessStatus() {
  if (isTestEnv || typeof window === "undefined") {
    return readLocalBookReader()
  }
  try {
    const res = await fetch("/api/books/register", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.registered) {
        const nextState = {
          registered: true,
          maskedEmail: data.maskedEmail || readLocalBookReader()?.maskedEmail || "Registered Reader",
          consentVersion: data.consentVersion || CONSENT_POLICY_VERSION,
          registeredAt: readLocalBookReader()?.registeredAt || new Date().toISOString(),
        }
        writeLocalBookReader(nextState)
        return nextState
      }
      // Server cookie missing/expired -> clear stale local badge so UI matches server gate
      writeLocalBookReader(null)
      return null
    }
  } catch {
    // Fallback to local state if offline
  }
  return readLocalBookReader()
}

export async function syncAuthenticatedUserBookAccess(user) {
  const email = String(user?.email || "").trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null

  const state = {
    registered: true,
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
          email,
          autoSessionSync: true,
          privacyConsent: true,
        }),
      })
    } catch {
      /* ignore network errors */
    }
  }
  return state
}

export async function registerEmailForBooks({
  name = "",
  email = "",
  privacyConsent = false,
  updatesOptIn = false,
  website = "",
  bookTitle = "",
  bookSlug = "",
}) {
  const cleanEmail = String(email || "").trim().toLowerCase()
  const cleanName = String(name || "").trim()

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
    return { ok: false, error: "Please enter a valid email address." }
  }
  if (!privacyConsent) {
    return {
      ok: false,
      error: "Please agree to the Privacy & Data Protection Policy to unlock book downloads.",
    }
  }
  if (website && String(website).trim() !== "") {
    return { ok: false, error: "Invalid submission." }
  }

  let serverData = null
  if (!isTestEnv && typeof window !== "undefined") {
    try {
      const res = await fetch("/api/books/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          privacyConsent: true,
          updatesOptIn: Boolean(updatesOptIn),
          website: "",
        }),
      })
      const json = await res.json()
      if (!res.ok || !json?.ok) {
        return { ok: false, error: json?.error || "Unable to register email right now." }
      }
      serverData = json
    } catch {
      return { ok: false, error: "Network error while verifying registration. Please try again." }
    }
  }

  const nextState = {
    registered: true,
    maskedEmail: serverData?.maskedEmail || maskEmail(cleanEmail),
    consentVersion: serverData?.consentVersion || CONSENT_POLICY_VERSION,
    updatesOptIn: Boolean(updatesOptIn),
    registeredAt: serverData?.registeredAt || new Date().toISOString(),
  }
  writeLocalBookReader(nextState)

  // Record audit/consent log cleanly only when user consented
  submitAcademyIntake({
    action: "book_download_registration",
    name: cleanName || "Reader",
    email: cleanEmail,
    course_title: bookTitle || null,
    message: `Book Library Email Registration${bookTitle ? ` for "${bookTitle}"` : ""} (Privacy Policy ${CONSENT_POLICY_VERSION} accepted; Optional Updates: ${updatesOptIn ? "Yes" : "No"})`,
    metadata: {
      book_slug: bookSlug || null,
      privacy_consent: true,
      consent_version: CONSENT_POLICY_VERSION,
      updates_opt_in: Boolean(updatesOptIn),
    },
  }).catch(() => {})

  return { ok: true, reader: nextState }
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
