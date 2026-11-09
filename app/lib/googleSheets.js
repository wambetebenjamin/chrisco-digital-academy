/**
 * Google Apps Script data layer.
 *
 * The whole site reads and writes through one Google Apps Script Web App that
 * sits in front of a Google Sheet. There is no database server, no ORM and no
 * server-side store: the Sheet is the source of truth and this file is the only
 * place that knows how to talk to it.
 *
 * Shape of every response (enforced by the Apps Script doGet/doPost):
 *   { ok: true,  sheet: "Contacts", rows: [ { ..column: value } ], count: n }
 *   { ok: false, error: "message" }
 *
 * Rows are plain objects keyed by the Sheet's header row, so a component can be
 * written against the columns directly.
 */

export const GOOGLE_SCRIPT_WEBAPP_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL || "GOOGLE_SCRIPT_WEBAPP_URL"

/** Set to true while the placeholder URL is still in place. */
export const isBackendConfigured = !GOOGLE_SCRIPT_WEBAPP_URL.startsWith("GOOGLE_SCRIPT_")

/**
 * Tabs this site uses. These MUST match the keys of SCHEMA in
 * docs/apps-script/Code.gs — that script creates a tab per key on first run.
 */
export const SHEETS = {
  contacts: "Contacts",
  enrolments: "Enrolments",
  learners: "Learners",
  tutors: "TutorApplications",
  newsletter: "Newsletter",
  progress: "Progress",
  affiliates: "Affiliates",
  books: "BookReaders",
  savedBooks: "SavedBooks",
  catalogue: "Courses",
}

const DEFAULT_TIMEOUT_MS = 15000

function buildUrl(params = {}) {
  if (!isBackendConfigured) return null
  const url = new URL(GOOGLE_SCRIPT_WEBAPP_URL)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v))
  })
  return url.toString()
}

/**
 * GET a sheet. Returns an array of row objects, newest first, or [] on failure.
 * Never throws: a dead endpoint must not take a page down.
 */
export async function fetchSheet(sheet, { limit, filter = {}, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const url = buildUrl({ sheet, limit, ...filter })
  if (!url) return []
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(timeout),
      // Apps Script answers with a redirect to a signed googleusercontent URL;
      // following it is required for the JSON body to arrive.
      redirect: "follow",
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data?.ok || !Array.isArray(data.rows)) return []
    return data.rows
  } catch {
    return []
  }
}

/**
 * POST one row to a sheet. Apps Script requires `Content-Type: text/plain`
 * to avoid a CORS preflight it cannot answer; the body is still JSON.
 *
 * Returns { ok, reference_code, row } or { ok: false, error }.
 */
export async function submitRow(sheet, payload = {}, { timeout = DEFAULT_TIMEOUT_MS } = {}) {
  if (!isBackendConfigured) {
    return { ok: false, error: "Backend not configured." }
  }
  const body = JSON.stringify({
    sheet,
    action: payload.action || "create",
    ...payload,
  })
  try {
    const res = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      redirect: "follow",
      signal: AbortSignal.timeout(timeout),
    })
    if (!res.ok) return { ok: false, error: `Request failed (${res.status}).` }
    const data = await res.json()
    return data
  } catch (err) {
    return { ok: false, error: err?.message || "Network error." }
  }
}

/** Convenience wrappers so components never hard-code sheet names. */
export const backend = {
  contacts: (payload) => submitRow(SHEETS.contacts, payload),
  enrolments: (payload) => submitRow(SHEETS.enrolments, payload),
  learners: (payload) => submitRow(SHEETS.learners, payload),
  tutors: (payload) => submitRow(SHEETS.tutors, payload),
  newsletter: (payload) => submitRow(SHEETS.newsletter, payload),
  progress: (payload) => submitRow(SHEETS.progress, payload),
  affiliates: (payload) => submitRow(SHEETS.affiliates, payload),
  books: (payload) => submitRow(SHEETS.books, payload),
  savedBooks: (payload) => submitRow(SHEETS.savedBooks, payload),
}
