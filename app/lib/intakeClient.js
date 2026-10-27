import emailjs from "@emailjs/browser"
import { ORG, ADMIN_NOTIFY_EMAILS } from "../data/org"
import { CONNECTED_RESOURCES } from "../data/connectedResources"
import {
  supabase,
  isSupabaseConfigured,
  SUPABASE_ANON_KEY,
  SUPABASE_EDGE_INTAKE_URL,
} from "../supabase"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

const INBOX_STORAGE_KEY = "chrisco:inbox"
const APPS_STORAGE_KEY = "chrisco:applications"

const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.VITEST === "true" || process.env.NODE_ENV === "test")

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
      subject: `We Have Received Your Application: ${courseName} — ${ORG.academy} (${code})`,
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
      subject: `We Have Received Your Tutor Application (${trackName}) — ${ORG.academy} (${code})`,
      body:
        `Dear ${cleanName},\n\n` +
        `Thank you for applying to become a tutor with ${ORG.academy} for the "${trackName}" track! We have received your application under reference ${code}.\n\n` +
        `Our Lead Tutor at ${ORG.programme} reviews every application personally and will contact you at ${email || phone || "your contact details"} within 2–3 business days to arrange a short online conversation and a 30-minute sample class.\n\n` +
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
      subject: `Thank You for Signing Up — Welcome to ${ORG.academy}! (${code})`,
      body:
        `Dear ${cleanName},\n\n` +
        `Thank you for signing up with ${ORG.academy}, the learning platform of ${ORG.programme}, operating under ${ORG.umbrella}!\n\n` +
        `We have received your registration (${email || cleanName}) under reference ${code}. Your account now unlocks:\n` +
        `• All 19 Practical Digital Skills Courses across 7 tracks\n` +
        `• All 19 Downloadable PDF Course Handbooks & Dropbox Study Vault\n` +
        `• Interactive Google Slides Orientation & Track Guide\n` +
        `• Notion Learner Hub & 7-Track Operations Portal\n` +
        `• Module Progress & Certificate Generator in your Dashboard\n\n` +
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
      subject: `We Have Received Your PURSUE Merchandise Order — ${ORG.academy} (${code})`,
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

  return {
    reference_code: code,
    template_type: "contact_received",
    from: ORG.email,
    sender_name: `${ORG.academy} (${ORG.programme})`,
    to: email || phone || cleanName,
    recipient_name: cleanName,
    subject: `We Have Received Your Message — ${ORG.academy} (${code})`,
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

/*
 * Admin-side enrollment alert. Separate from the learner's auto-reply
 * receipt: it tells the CHRISCO team that someone new has enrolled, with all
 * the contact details they need to follow up.
 */
export function buildAdminEnrollmentAlert(payload = {}, receipt = null) {
  const courseName = payload.course_title || "Practical Digital Skills Track"
  const learnerName = payload.name || "A new learner"
  const refCode = receipt?.reference_code || payload.refCode || ""
  const enrolledAt = receipt?.sent_at
    ? new Date(receipt.sent_at).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })

  const lines = [
    `A new learner has enrolled on ${ORG.academy}.`,
    "",
    `Learner: ${learnerName}`,
    `Course: ${courseName}`,
  ]
  if (payload.category) lines.push(`Track: ${payload.category}`)
  if (payload.level) lines.push(`Level: ${payload.level}`)
  if (payload.email) lines.push(`Email: ${payload.email}`)
  if (payload.phone) lines.push(`Phone / WhatsApp: ${payload.phone}`)
  if (payload.ref) lines.push(`Referred by affiliate code: ${payload.ref}`)
  if (refCode) lines.push(`Application reference: ${refCode}`)
  lines.push(`Enrolled at: ${enrolledAt}`)
  if (payload.message) lines.push("", "Learner's message:", payload.message)
  lines.push(
    "",
    `Reply by email: ${payload.email ? `mailto:${payload.email}` : ORG.email}`,
    `Reply on WhatsApp: https://wa.me/${(payload.phone || "").replace(/[^0-9]/g, "")}`
  )

  return {
    subject: `New Course Enrollment: ${courseName} — ${learnerName}${refCode ? ` (${refCode})` : ""}`,
    message: lines.join("\n"),
    reference_code: refCode,
  }
}

/*
 * Sends one alert email per admin inbox through the existing EmailJS
 * service. Never throws: an admin alert failing must not break the learner's
 * enrollment flow. Returns how many inboxes the alert was dispatched to.
 */
export async function sendAdminEnrollmentNotifications(payload = {}, receipt = null) {
  if (
    typeof window === "undefined" ||
    !Array.isArray(ADMIN_NOTIFY_EMAILS) ||
    ADMIN_NOTIFY_EMAILS.length === 0
  ) {
    return 0
  }
  const alert = buildAdminEnrollmentAlert(payload, receipt)

  const results = await Promise.allSettled(
    ADMIN_NOTIFY_EMAILS.map((adminEmail) =>
      emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: `${ORG.academy} Enrollment Alert`,
          from_email: ORG.email,
          reply_to: payload.email || ORG.email,
          to_email: adminEmail,
          phone: payload.phone || "",
          subject: alert.subject,
          message: alert.message,
        },
        PUBLIC_KEY
      )
    )
  )

  return results.filter((r) => r.status === "fulfilled").length
}

export async function submitAcademyIntake(payload = {}) {
  const action = payload.action || payload.type || "contact"
  const fallbackReceipt = buildAutoReplyReceipt({
    ...payload,
    action,
  })

  // Always cache locally for instant UI feedback
  saveToLocalInbox(fallbackReceipt)
  saveToLocalApplications({
    id: fallbackReceipt.reference_code,
    type: action,
    name: payload.name || "Learner",
    email: payload.email || "",
    phone: payload.phone || "",
    course_title: payload.course_title || null,
    track: payload.track || null,
    message: payload.message || "",
    status: "responded",
    auto_reply_from: ORG.email,
    auto_reply_subject: fallbackReceipt.subject,
    auto_reply_body: fallbackReceipt.body,
    created_at: fallbackReceipt.sent_at,
  })

  if (isTestEnv) {
    return {
      ok: true,
      reference_code: fallbackReceipt.reference_code,
      auto_reply: fallbackReceipt,
    }
  }

  // Trigger browser EmailJS in background (non-blocking)
  if (typeof window !== "undefined") {
    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: payload.name || "Learner",
          from_email: payload.email || ORG.email,
          reply_to: ORG.email,
          to_email: payload.email || ORG.email,
          phone: payload.phone || "",
          subject: fallbackReceipt.subject,
          message: `${payload.message || action}\n\n--- Automated Response from ${ORG.email} ---\n${fallbackReceipt.body}`,
        },
        PUBLIC_KEY
      )
      .catch(() => {})

    // Separate alert to the CHRISCO admin inboxes for every enrollment.
    // Fire-and-forget: the learner's flow must never wait on or fail over it.
    if (action === "course_application") {
      sendAdminEnrollmentNotifications(payload, fallbackReceipt).catch(() => {})
    }
  }

  // 1. Primary: Call Supabase Edge Function `academy-intake`
  try {
    const res = await fetch(SUPABASE_EDGE_INTAKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ ...payload, action }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.ok && data?.auto_reply) {
        saveToLocalInbox(data.auto_reply)
        return data
      }
    }
  } catch {
    // Fall through to direct Supabase table insert
  }

  // 2. Fallback: Direct Supabase PostgREST insert
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("contacts").insert({
        user_id: payload.user_id || null,
        name: payload.name || "Visitor",
        email: payload.email || null,
        phone: payload.phone || null,
        type: action,
        subject: fallbackReceipt.subject,
        course_title: payload.course_title || null,
        track: payload.track || null,
        message: payload.message || "",
        ref: payload.ref || null,
        metadata: { ...(payload.metadata || {}), reference_code: fallbackReceipt.reference_code },
        status: "responded",
        auto_reply_from: ORG.email,
        auto_reply_subject: fallbackReceipt.subject,
        auto_reply_body: fallbackReceipt.body,
        auto_reply_sent: true,
      })

      if (payload.email) {
        await supabase.from("email_notifications").insert({
          user_id: payload.user_id || null,
          sender_email: ORG.email,
          sender_name: `${ORG.academy} (${ORG.programme})`,
          recipient_email: payload.email,
          recipient_name: payload.name || "Learner",
          template_type: fallbackReceipt.template_type,
          subject: fallbackReceipt.subject,
          body_text: fallbackReceipt.body,
          delivery_status: "sent",
          reference_code: fallbackReceipt.reference_code,
        })
      }
    } catch {
      // Non-blocking
    }
  }

  return {
    ok: true,
    reference_code: fallbackReceipt.reference_code,
    auto_reply: fallbackReceipt,
  }
}

export async function authenticateWithGoogleBridge({ name, email, avatar_url, ref }) {
  const cleanEmail = (email || "").trim().toLowerCase()
  const cleanName = (name || cleanEmail.split("@")[0] || "Google Learner").trim()

  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { error: { message: "Please enter a valid Google email address." } }
  }

  if (!isTestEnv && isSupabaseConfigured && supabase) {
    try {
      const res = await fetch(SUPABASE_EDGE_INTAKE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: "google_auth",
          name: cleanName,
          email: cleanEmail,
          avatar_url: avatar_url || null,
          ref: ref || null,
        }),
      })
      const payload = await res.json()
      if (payload?.ok && payload?.hashed_token) {
        if (payload.auto_reply) {
          saveToLocalInbox(payload.auto_reply)
        }
        const { data: otpData, error: otpErr } = await supabase.auth.verifyOtp({
          token_hash: payload.hashed_token,
          type: "magiclink",
        })
        if (!otpErr && otpData?.user) {
          return {
            data: otpData,
            auto_reply: payload.auto_reply,
            error: null,
          }
        }
      }
    } catch {
      // Fall through to local Google session if offline
    }
  }

  const fallbackReceipt = buildAutoReplyReceipt({
    action: "google_auth",
    name: cleanName,
    email: cleanEmail,
  })
  saveToLocalInbox(fallbackReceipt)
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
    auto_reply: fallbackReceipt,
    error: null,
    isFallbackSession: true,
  }
}

export async function fetchAcademyOverview({ user_id, email, affiliate_code } = {}) {
  const localInbox = readLocalInbox()
  const localApps = readLocalApplications()

  if (!isTestEnv) {
    try {
      const params = new URLSearchParams()
      if (user_id) params.set("user_id", user_id)
      if (email) params.set("email", email)
      if (affiliate_code) params.set("affiliate_code", affiliate_code)

      const url = `${SUPABASE_EDGE_INTAKE_URL}${params.toString() ? `?${params.toString()}` : ""}`
      const res = await fetch(url, {
        method: "GET",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        const serverNotifs = (data.notifications || []).map((n) => ({
          id: n.id,
          reference_code: n.reference_code || `REF-${String(n.id).slice(0, 6).toUpperCase()}`,
          from: n.sender_email || ORG.email,
          sender_name: n.sender_name || `${ORG.academy} (${ORG.programme})`,
          to: n.recipient_email || email || "",
          recipient_name: n.recipient_name || "",
          subject: n.subject,
          body: n.body_text,
          template_type: n.template_type,
          sent_at: n.created_at,
        }))

        const seenRefs = new Set(serverNotifs.map((n) => n.reference_code))
        const mergedInbox = [
          ...serverNotifs,
          ...localInbox.filter((l) => !seenRefs.has(l.reference_code)),
        ]

        return {
          ok: true,
          stats: data.stats || { learners: 4, enrollments: 0, contacts: 0 },
          resources: CONNECTED_RESOURCES,
          notifications: mergedInbox,
          applications: data.applications?.length ? data.applications : localApps,
          affiliateStats: data.affiliateStats || null,
        }
      }
    } catch {
      // Fall back to local + static resources
    }
  }

  return {
    ok: true,
    stats: { learners: 4, enrollments: 0, contacts: localApps.length },
    resources: CONNECTED_RESOURCES,
    notifications: localInbox,
    applications: localApps,
    affiliateStats: null,
  }
}

export async function updateCourseProgressInBackend({
  user_id,
  course_title,
  progress,
  completed_modules,
}) {
  if (!isTestEnv && user_id && course_title) {
    try {
      const res = await fetch(SUPABASE_EDGE_INTAKE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: "update_progress",
          user_id,
          course_title,
          progress,
          completed_modules,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.ok) return data.enrollment
      }
    } catch {
      // Fallback
    }
  }
  return null
}

export async function registerAffiliateInBackend({ code, name, email, user_id }) {
  if (!isTestEnv && code) {
    try {
      const res = await fetch(SUPABASE_EDGE_INTAKE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: "register_affiliate",
          code,
          name,
          email,
          user_id,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.ok) return data.affiliate
      }
    } catch {
      // Fallback
    }
  }
  return null
}
