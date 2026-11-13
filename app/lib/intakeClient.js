import { ORG } from "../data/org"
import { CONNECTED_RESOURCES } from "../data/connectedResources"
import { SHEETS, submitRow, fetchSheet, isBackendConfigured } from "./googleSheets"

// Local UI cache only. The Sheet is the source of truth; this just keeps
// the last few confirmations visible when the page reloads offline.
const INBOX_STORAGE_KEY = "chrisco:inbox-cache"
const APPS_STORAGE_KEY = "chrisco:applications"

const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.VITEST === "true" || process.env.NODE_ENV === "test")

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim())
  )
}

function makeRefCode(prefix = "CDA") {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${rand}`
}

export function buildAutoReplyReceipt({
  action = "contact",
  name,
  email,
  phone,
  course_title,
  track,
  message,
  refCode,
}) {
  const cleanName = (name || (email ? email.split("@")[0] : "Learner")).trim()
  const code =
    refCode ||
    makeRefCode(
      action === "course_application"
        ? "APP"
        : action === "tutor_application"
        ? "TUT"
        : action === "signup_welcome" || action === "google_auth"
        ? "WEL"
        : action === "merch_order"
        ? "ORD"
        : "MSG"
    )

  if (action === "course_application") {
    const courseName = course_title || "Practical Digital Skills Track"
    return {
      reference_code: code,
      template_type: "course_application_received",
      from: ORG.email,
      sender_name: `${ORG.academy} (${ORG.programme})`,
      to: email || phone || cleanName,
      recipient_name: cleanName,
      subject: `We Have Received Your Application: ${courseName} | ${ORG.academy} (${code})`,
      body:
        `Dear ${cleanName},\n\n` +
        `Thank you for applying to "${courseName}" at ${ORG.academy}, the learning platform of ${ORG.programme} (operating under ${ORG.umbrella}).\n\n` +
        `We have received your application and recorded your enrolment in our system:\n` +
        `• Reference Code: ${code}\n` +
        `• Course: ${courseName}\n` +
        `• Applicant: ${cleanName}${email ? ` (${email})` : ""}${phone ? ` · ${phone}` : ""}\n` +
        `• Confirmation From: ${ORG.email}\n` +
        `• Status: Application Received & Unlocked in Student Dashboard\n\n` +
        `What happens next:\n` +
        `1. Open your Student Dashboard to access the interactive modules, PDF course handbook, Google Slides Orientation Deck, Notion Learner Hub, and Dropbox Study Vault.\n` +
        `2. Our tutor team at ${ORG.email} will also reach out on WhatsApp/email with upcoming cohort schedules.\n\n` +
        `Warm regards,\n` +
        `Admissions & Tutor Team\n` +
        `${ORG.academy} · ${ORG.programme}\n` +
        `Email: ${ORG.email}`,
      sent_at: new Date().toISOString(),
    }
  }

  if (action === "tutor_application") {
    const trackName = track || course_title || "Digital Skills Track"
    return {
      reference_code: code,
      template_type: "tutor_application_received",
      from: ORG.email,
      sender_name: `${ORG.academy} (${ORG.programme})`,
      to: email || phone || cleanName,
      recipient_name: cleanName,
      subject: `We Have Received Your Tutor Application (${trackName}) | ${ORG.academy} (${code})`,
      body:
        `Dear ${cleanName},\n\n` +
        `Thank you for applying to become a tutor with ${ORG.academy} for the "${trackName}" track! We have received your application under reference ${code}.\n\n` +
        `Our Lead Tutor at ${ORG.programme} reviews every application personally and will contact you at ${email || phone || "your contact details"} within 2 to 3 business days to arrange a short online conversation and a 30-minute sample class.\n\n` +
        `If you would like to share additional portfolio links, reply to ${ORG.email} quoting Reference ${code}.\n\n` +
        `Warm regards,\n` +
        `Tutor Onboarding Team\n` +
        `${ORG.academy} · ${ORG.programme}\n` +
        `Email: ${ORG.email}`,
      sent_at: new Date().toISOString(),
    }
  }

  if (action === "signup_welcome" || action === "google_auth") {
    return {
      reference_code: code,
      template_type: "welcome_signup",
      from: ORG.email,
      sender_name: `${ORG.academy} (${ORG.programme})`,
      to: email || cleanName,
      recipient_name: cleanName,
      subject: `Thank You for Signing Up: Welcome to ${ORG.academy}! (${code})`,
      body:
        `Dear ${cleanName},\n\n` +
        `Thank you for signing up with ${ORG.academy}, the learning platform of ${ORG.programme}, operating under ${ORG.umbrella}!\n\n` +
        `We have received your registration (${email || cleanName}) under reference ${code}. Your account now unlocks:\n` +
        `• Dedicated Christian & Faith E-Books plus all 19 Practical Digital Skills Courses\n` +
        `• All 20 Downloadable 28-Page PDF E-Books & Handbooks inside your Student Dashboard\n` +
        `• Interactive Google Slides Orientation & Track Guide\n` +
        `• Notion Learner Hub & 7-Track Operations Portal\n` +
        `• Module progress in your Dashboard\n\n` +
        `Need help choosing your first track? Write to us anytime at ${ORG.email}.\n\n` +
        `Warm regards,\n` +
        `${ORG.programme} Tutor Team\n` +
        `Email: ${ORG.email}`,
      sent_at: new Date().toISOString(),
    }
  }

  if (action === "merch_order") {
    return {
      reference_code: code,
      template_type: "merch_order_received",
      from: ORG.email,
      sender_name: `${ORG.academy} (${ORG.programme})`,
      to: email || phone || cleanName,
      recipient_name: cleanName,
      subject: `We Have Received Your PURSUE Merchandise Order | ${ORG.academy} (${code})`,
      body:
        `Dear ${cleanName},\n\n` +
        `Thank you for ordering from the ${ORG.programme} PURSUE collection! We have received your order request under reference ${code}.\n\n` +
        `Order details:\n${message || "PURSUE Merchandise Order"}\n\n` +
        `Our merchandise desk at ${ORG.email} will confirm your sizes, colourways, delivery location, and payment details shortly via WhatsApp and email.\n\n` +
        `Warm regards,\n` +
        `${ORG.programme} Merchandise Desk\n` +
        `Email: ${ORG.email}`,
      sent_at: new Date().toISOString(),
    }
  }

  if (action === "book_download_registration") {
    const bookName = course_title || "CHRISCO Library E-Books"
    return {
      reference_code: makeRefCode("LIB"),
      template_type: "book_registration_verified",
      from: ORG.email,
      sender_name: `${ORG.programme} Library`,
      to: email || cleanName,
      recipient_name: cleanName,
      subject: `Your Online Book Access Is Verified | ${ORG.programme} (${bookName})`,
      body:
        `Dear ${cleanName},\n\n` +
        `Thank you for signing in with your account to access "${bookName}" from ${ORG.programme} (under ${ORG.umbrella}).\n\n` +
        `• Account Email: ${email || cleanName}\n` +
        `• Access Status: Verified for Christian Books & Digital Skill Handbooks (also saved in your Dashboard)\n` +
        `• Privacy Protection: Handled strictly under our Privacy & Data Protection Policy (/privacy)\n\n` +
        `You can share any book page from /library so friends and fellowship members can visit the site, create an account, sign in, and download their own copy.\n\n` +
        `Warm regards,\n` +
        `${ORG.programme} Editorial & Mentorship Desk\n` +
        `Email: ${ORG.email}`,
      sent_at: new Date().toISOString(),
    }
  }

  return {
    reference_code: code,
    template_type: "contact_received",
    from: ORG.email,
    sender_name: `${ORG.academy} (${ORG.programme})`,
    to: email || phone || cleanName,
    recipient_name: cleanName,
    subject: `We Have Received Your Message | ${ORG.academy} (${code})`,
    body:
      `Dear ${cleanName},\n\n` +
      `Thank you for reaching out to ${ORG.academy} (${ORG.programme}). We have received your message under reference ${code}:\n\n` +
      `"${(message || "").slice(0, 350)}"\n\n` +
      `Our team at ${ORG.email} has logged your inquiry and will reply shortly via email or WhatsApp.\n\n` +
      `Warm regards,\n` +
      `${ORG.academy} Support Team\n` +
      `Email: ${ORG.email}`,
    sent_at: new Date().toISOString(),
  }
}

export function readLocalInbox() {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(INBOX_STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveToLocalInbox(receipt) {
  if (typeof window === "undefined" || !receipt) return
  try {
    const current = readLocalInbox()
    const filtered = current.filter((r) => r.reference_code !== receipt.reference_code)
    const next = [receipt, ...filtered].slice(0, 30)
    window.localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage errors
  }
}

export function readLocalApplications() {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(APPS_STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveToLocalApplications(item) {
  if (typeof window === "undefined" || !item) return
  try {
    const current = readLocalApplications()
    const next = [item, ...current].slice(0, 30)
    window.localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

export async function submitAcademyIntake(payload = {}) {
  const action = payload.action || payload.type || "contact"
  const fallbackReceipt = buildAutoReplyReceipt({
    ...payload,
    action,
  })

  // Cache the receipt locally for instant UI feedback. This is a cache, not a
  // store: the Sheet is the source of truth.
  saveToLocalInbox(fallbackReceipt)

  if (isTestEnv) {
    return {
      ok: true,
      reference_code: fallbackReceipt.reference_code,
      auto_reply: fallbackReceipt,
    }
  }

  if (!isBackendConfigured) {
    return {
      ok: false,
      error:
        "The Google Sheets backend is not configured yet. Set " +
        "NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL to your Apps Script Web App URL.",
      reference_code: fallbackReceipt.reference_code,
      auto_reply: fallbackReceipt,
    }
  }

  // One POST to the Apps Script Web App. It appends the row and returns the
  // stored record; the schema of that row is documented in docs/APPS-SCRIPT.md.
  const sheetFor = {
    contact: SHEETS.contacts,
    course_application: SHEETS.enrolments,
    tutor_application: SHEETS.tutors,
    newsletter_signup: SHEETS.newsletter,
    merch_order: SHEETS.contacts,
    book_download_registration: SHEETS.books,
    signup_welcome: SHEETS.learners,
    google_auth: SHEETS.learners,
  }

  const result = await submitRow(sheetFor[action] || SHEETS.contacts, {
    action,
    reference_code: fallbackReceipt.reference_code,
    name: payload.name || "",
    email: payload.email || "",
    phone: payload.phone || "",
    course_title: payload.course_title || "",
    course_id: payload.course_id || "",
    category: payload.category || "",
    level: payload.level || "",
    track: payload.track || "",
    message: payload.message || "",
    ref: payload.ref || "",
    user_id: payload.user_id || "",
    created_at: fallbackReceipt.sent_at,
    status: "responded",
    auto_reply_subject: fallbackReceipt.subject,
    auto_reply_from: ORG.email,
  })

  if (!result?.ok) {
    return {
      ok: false,
      error: result?.error || "We could not reach the server. Please try again.",
      reference_code: fallbackReceipt.reference_code,
      auto_reply: fallbackReceipt,
    }
  }

  const stored = {
    ...fallbackReceipt,
    reference_code: result.reference_code || fallbackReceipt.reference_code,
  }
  saveToLocalInbox(stored)
  return { ok: true, reference_code: stored.reference_code, auto_reply: stored }
}


/**
 * Form wrapper: same call, but a rejected write becomes a thrown error so the
 * caller's catch block shows a real failure instead of a false "sent" screen.
 */
export async function sendAcademyIntake(payload) {
  const result = await submitAcademyIntake(payload)
  if (!result?.ok) {
    throw new Error(result?.error || "We could not save your submission. Please try again.")
  }
  return result
}

export async function authenticateWithGoogleBridge({ name, email, password, avatar_url, ref }) {
  const cleanEmail = (email || "").trim().toLowerCase()
  const cleanName = (name || cleanEmail.split("@")[0] || "Learner").trim()

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
    return { error: { message: "Please enter a valid Google email address." } }
  }
  if (!password || String(password).length < 6) {
    return { error: { message: "Please enter your password (at least 6 characters)." } }
  }

  // Authentication is a row in the Learners sheet, not a separate auth server.
  // The Apps Script hashes the password before storing it; see docs/APPS-SCRIPT.md.
  if (!isTestEnv) {
    const result = await submitRow(SHEETS.learners, {
      action: "auth",
      name: cleanName,
      email: cleanEmail,
      password,
      avatar_url: avatar_url || "",
      ref: ref || "",
      created_at: new Date().toISOString(),
    })
    if (result?.ok && result.learner) {
      return {
        data: {
          user: {
            id: result.learner.id,
            name: result.learner.name || cleanName,
            email: cleanEmail,
            provider: "google",
            user_metadata: { name: cleanName, full_name: cleanName, auth_provider: "google" },
          },
        },
        error: null,
      }
    }
    if (result?.error) {
      return { data: null, error: { message: result.error } }
    }
  }

  return {
    data: {
      user: {
        id: `google-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        provider: "google",
        user_metadata: { name: cleanName, full_name: cleanName, auth_provider: "google" },
      },
    },
    error: null,
    isFallbackSession: true,
  }
}

export async function fetchAcademyOverview({ user_id, email, affiliate_code } = {}) {
  const localInbox = readLocalInbox()

  if (isTestEnv || !isBackendConfigured) {
    return {
      ok: true,
      stats: { learners: 0, enrolments: 0, contacts: localInbox.length },
      resources: CONNECTED_RESOURCES,
      notifications: localInbox,
      applications: [],
      affiliateStats: null,
      offline: true,
    }
  }

  // Each of these is one Apps Script GET returning an array of row objects.
  const [learners, enrolments, contacts, affiliates] = await Promise.all([
    fetchSheet(SHEETS.learners),
    fetchSheet(SHEETS.enrolments, { filter: email ? { email } : {} }),
    fetchSheet(SHEETS.contacts, { filter: email ? { email } : {} }),
    fetchSheet(SHEETS.affiliates, {
      filter: affiliate_code ? { code: affiliate_code } : {},
    }),
  ])

  const notifications = contacts.map((row, i) => ({
    id: row.id || `c${i}`,
    reference_code: row.reference_code || "",
    from: row.auto_reply_from || ORG.email,
    sender_name: `${ORG.academy} (${ORG.programme})`,
    to: row.email || "",
    recipient_name: row.name || "",
    subject: row.auto_reply_subject || "Message received",
    body: row.message || "",
    sent_at: row.created_at || "",
  }))

  const seen = new Set(notifications.map((n) => n.reference_code))
  const mergedInbox = [
    ...notifications,
    ...localInbox.filter((l) => !seen.has(l.reference_code)),
  ]

  return {
    ok: true,
    stats: {
      learners: learners.length,
      enrolments: enrolments.length,
      contacts: contacts.length,
    },
    resources: CONNECTED_RESOURCES,
    notifications: mergedInbox,
    applications: enrolments,
    affiliateStats: affiliates[0] || null,
    offline: false,
  }
}

export async function updateCourseProgressInBackend({
  user_id,
  course_title,
  progress,
  completed_modules,
}) {
  if (isTestEnv || !isBackendConfigured || !user_id || !course_title) return null
  const res = await submitRow(SHEETS.progress, {
    action: "update",
    user_id,
    course_title,
    progress,
    completed_modules: Array.isArray(completed_modules)
      ? completed_modules.join(", ")
      : completed_modules || "",
    updated_at: new Date().toISOString(),
  })
  return res?.ok ? res.row || null : null
}

export async function registerAffiliateInBackend({ code, name, email, user_id }) {
  if (isTestEnv || !isBackendConfigured || !code) return null
  const res = await submitRow(SHEETS.affiliates, {
    action: "register_affiliate",
    code,
    name,
    email,
    user_id,
    created_at: new Date().toISOString(),
  })
  return res?.ok ? res.row || null : null
}
