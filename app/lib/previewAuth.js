/*
 * Preview authentication.
 *
 * Real sign-in runs on Supabase. When the Supabase environment variables are
 * missing (local preview, fresh clone, CI), this module keeps the auth screens
 * usable by storing accounts in localStorage under a clearly separate key.
 * It is intentionally simple: it exists so the flows can be exercised and
 * tested, not to protect production data. As soon as real keys are present,
 * AuthProvider never touches this module.
 */

const USERS_KEY = "chrisco:preview-users"
const SESSION_KEY = "chrisco:preview-session"

function hash(value) {
  // Small non-cryptographic digest so passwords are not stored verbatim.
  let h1 = 0x811c9dc5
  let h2 = 0x1000193
  const text = String(value)
  for (let i = 0; i < text.length; i += 1) {
    const c = text.charCodeAt(i)
    h1 = (h1 ^ c) * 0x01000193
    h2 = (h2 + c * (i + 7)) % 0x7fffffff
    h1 >>>= 0
  }
  return `${h1.toString(16)}${h2.toString(16)}`
}

function store() {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readUsers() {
  const s = store()
  if (!s) return []
  try {
    const raw = s.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  const s = store()
  if (s) s.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

export function validateSignUp({ name, email, password }) {
  if (!name || name.trim().length < 2) return "Please enter your full name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) return "Please enter a valid email address."
  if (!password || password.length < 6) return "Password must be at least 6 characters."
  return ""
}

export function validateSignIn({ email, password }) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) return "Please enter a valid email address."
  if (!password) return "Please enter your password."
  return ""
}

export function previewSignUp({ name, email, password, ref }) {
  const problem = validateSignUp({ name, email, password })
  if (problem) return { error: { message: problem } }

  const users = readUsers()
  const normalised = email.trim().toLowerCase()
  if (users.some((u) => u.email === normalised)) {
    return { error: { message: "An account with this email already exists. Please sign in." } }
  }

  const user = {
    id: `preview-${hash(normalised)}`,
    email: normalised,
    name: name.trim(),
    ref: ref || "",
    createdAt: new Date().toISOString(),
  }
  writeUsers([...users, { ...user, password: hash(password) }])
  setSession(user)
  return { data: { user, session: { user } }, error: null }
}

export function previewSignIn({ email, password }) {
  const problem = validateSignIn({ email, password })
  if (problem) return { error: { message: problem } }

  const normalised = email.trim().toLowerCase()
  const found = readUsers().find((u) => u.email === normalised)
  if (!found) {
    return { error: { message: "No account found for that email. Please create one." } }
  }
  if (found.password !== hash(password)) {
    return { error: { message: "Incorrect password. Please try again." } }
  }

  const { password: _ignored, ...user } = found
  setSession(user)
  return { data: { user, session: { user } }, error: null }
}

export function previewSession() {
  const s = store()
  if (!s) return null
  try {
    const raw = s.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(user) {
  const s = store()
  if (s) s.setItem(SESSION_KEY, JSON.stringify(user))
}

export function previewSignOut() {
  const s = store()
  if (s) s.removeItem(SESSION_KEY)
}

export function previewClearAll() {
  const s = store()
  if (!s) return
  s.removeItem(USERS_KEY)
  s.removeItem(SESSION_KEY)
}
