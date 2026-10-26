import crypto from "node:crypto"
import { CONSENT_POLICY_VERSION, maskEmail } from "../data/booksCatalogue"

export const BOOK_ACCESS_COOKIE = "chrisco_book_access"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90 // 90 days

// Deterministic HMAC signing key (uses env secret in production when set, with safe fallback)
function getSigningKey() {
  return (
    process.env.BOOK_GATE_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "chrisco-youth-aflame-book-gate-v1-hmac-2026"
  )
}

export function isValidReaderEmail(value) {
  const clean = String(value || "").trim().toLowerCase()
  if (!clean || clean.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)
}

export function hashReaderEmail(email) {
  const clean = String(email || "").trim().toLowerCase()
  return crypto
    .createHmac("sha256", getSigningKey())
    .update(`email:${clean}`)
    .digest("hex")
    .slice(0, 32)
}

export function signBookAccessToken({ email, consentVersion = CONSENT_POLICY_VERSION }) {
  const nowSec = Math.floor(Date.now() / 1000)
  const payload = {
    v: 1,
    eh: hashReaderEmail(email),
    me: maskEmail(email),
    cv: consentVersion,
    iat: nowSec,
    exp: nowSec + COOKIE_MAX_AGE_SECONDS,
  }
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  const sig = crypto
    .createHmac("sha256", getSigningKey())
    .update(encoded)
    .digest("base64url")
  return `${encoded}.${sig}`
}

export function verifyBookAccessToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null
  const [encoded, sig] = token.split(".")
  if (!encoded || !sig) return null

  const expectedSig = crypto
    .createHmac("sha256", getSigningKey())
    .update(encoded)
    .digest("base64url")

  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
    const nowSec = Math.floor(Date.now() / 1000)
    if (!parsed?.eh || !parsed?.exp || parsed.exp < nowSec) return null
    return parsed
  } catch {
    return null
  }
}

export function buildAccessCookieOptions(request = null) {
  const forwardedProto = request?.headers?.get?.("x-forwarded-proto")?.split(",")[0]?.trim()
  const isHttps =
    forwardedProto === "https" ||
    (request?.url ? request.url.startsWith("https://") : process.env.NODE_ENV === "production")
  return {
    name: BOOK_ACCESS_COOKIE,
    httpOnly: true,
    sameSite: "lax",
    secure: Boolean(isHttps),
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  }
}

// Lightweight sliding-window rate limiter per IP (privacy-safe hashed IP in memory)
const rateBuckets = new Map()
export function checkRegistrationRateLimit(ipHeader = "unknown") {
  const now = Date.now()
  const windowMs = 10 * 60 * 1000
  const maxReqs = 20
  const ipKey = crypto.createHash("sha256").update(String(ipHeader)).digest("hex").slice(0, 16)
  const prev = (rateBuckets.get(ipKey) || []).filter((ts) => now - ts < windowMs)
  if (prev.length >= maxReqs) {
    return false
  }
  prev.push(now)
  rateBuckets.set(ipKey, prev)
  return true
}
