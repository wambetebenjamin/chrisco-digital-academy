/*
 * Referral links for the affiliate programme.
 *
 * Flow: an affiliate shares /?ref=THEIRCODE (or any page with ?ref=). The code
 * is stored locally so it survives navigation and is attached to sign-up and
 * course enrolment. Codes are also saved by the affiliate on /affiliates.
 */

const REF_KEY = "chrisco:ref"
const MYCODE_KEY = "chrisco:mycode"
const REF_DAYS = 60

export const COMMISSION_RATE = 0.1 // indicative share of a course fee

function safeStorage() {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function normaliseCode(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24)
}

export function codeFromName(name) {
  const base = normaliseCode(name)
  if (!base) return ""
  let hash = 0
  for (let i = 0; i < base.length; i += 1) {
    hash = (hash * 31 + base.charCodeAt(i)) % 9999
  }
  return `${base.slice(0, 10)}${String(hash).padStart(3, "0")}`
}

export function saveRef(code) {
  const clean = normaliseCode(code)
  const store = safeStorage()
  if (!clean || !store) return clean
  store.setItem(
    REF_KEY,
    JSON.stringify({ code: clean, at: Date.now() })
  )
  return clean
}

export function readRef() {
  const store = safeStorage()
  if (!store) return ""
  try {
    const raw = store.getItem(REF_KEY)
    if (!raw) return ""
    const { code, at } = JSON.parse(raw)
    if (!code) return ""
    if (Date.now() - at > REF_DAYS * 24 * 60 * 60 * 1000) {
      store.removeItem(REF_KEY)
      return ""
    }
    return code
  } catch {
    return ""
  }
}

export function clearRef() {
  const store = safeStorage()
  if (store) store.removeItem(REF_KEY)
}

export function captureRefFromLocation(search) {
  if (typeof window === "undefined") return readRef()
  const params = new URLSearchParams(search ?? window.location.search)
  const incoming = params.get("ref") || params.get("aff")
  if (incoming) return saveRef(incoming)
  return readRef()
}

export function buildRefLink(code, path = "/") {
  const base =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://chrisco.academy"
  const clean = normaliseCode(code)
  return `${base}${path}${path.includes("?") ? "&" : "?"}ref=${clean}`
}

export function saveMyCode(code) {
  const clean = normaliseCode(code)
  const store = safeStorage()
  if (store && clean) store.setItem(MYCODE_KEY, clean)
  return clean
}

export function readMyCode() {
  const store = safeStorage()
  return store ? store.getItem(MYCODE_KEY) || "" : ""
}
