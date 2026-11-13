/*
 * The frontend/Apps Script contract.
 *
 * The site reads and writes a Google Sheet through one Apps Script Web App.
 * Nothing enforces that contract at runtime — if a tab name drifts on one side,
 * reads quietly return [] and forms quietly stop saving. These tests fail loudly
 * instead.
 *
 * Run with: npm test
 */
import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, "..")
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8")

const script = read("docs/apps-script/Code.gs")
const client = read("app/lib/googleSheets.js")

/** Tab names the Apps Script will create, in declaration order. */
function scriptTabs() {
  const block = script.slice(script.indexOf("var SCHEMA = {"), script.indexOf("};", script.indexOf("var SCHEMA = {")))
  return [...block.matchAll(/^\s{2}([A-Za-z]+):\s*\[/gm)].map((m) => m[1])
}

/** Tab names the frontend asks for. */
function clientTabs() {
  const start = client.indexOf("export const SHEETS")
  const block = client.slice(start, client.indexOf("}", start))
  return [...block.matchAll(/([A-Za-z]+):\s*"([A-Za-z]+)"/g)].map((m) => m[2])
}

test("frontend and Apps Script agree on every tab name", () => {
  const fromScript = scriptTabs()
  const fromClient = clientTabs()

  assert.ok(fromScript.length >= 10, `expected the script to define tabs, got ${fromScript.length}`)
  assert.deepEqual(
    [...fromClient].sort(),
    [...fromScript].sort(),
    `frontend asks for [${fromClient.join(", ")}] but the script creates [${fromScript.join(", ")}]`
  )
})

test("every tab the frontend scripts against has a header row in the script", () => {
  for (const tab of clientTabs()) {
    const re = new RegExp(`${tab}:\\s*\\[([^\\]]*)\\]`)
    const match = script.match(re)
    assert.ok(match, `${tab} has no column list in Code.gs`)
    assert.ok(match[1].includes('"'), `${tab} has an empty column list`)
  }
})

test("the script exposes the two entrypoints Apps Script needs", () => {
  assert.match(script, /function doGet\(e\)/, "missing doGet")
  assert.match(script, /function doPost\(e\)/, "missing doPost")
  assert.match(script, /function setupSheets\(\)/, "missing setupSheets helper")
})

test("the client reads its URL from the environment, never a hard-coded endpoint", () => {
  assert.match(
    client,
    /GOOGLE_SCRIPT_WEBAPP_URL\s*=\s*\n?\s*process\.env\.NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL/,
    "the webhook URL must come from NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL"
  )
  assert.doesNotMatch(client, /https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,}/,
    "a real deployment URL must not be committed")
})

test("the client posts JSON as text/plain so Apps Script needs no CORS preflight", () => {
  assert.match(client, /"Content-Type":\s*"text\/plain;charset=utf-8"/)
})

test("nothing in the app imports Supabase or EmailJS any more", () => {
  const offenders = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (["node_modules", ".next", ".git"].includes(entry.name)) continue
        walk(rel)
      } else if (/\.(js|jsx|mjs)$/.test(entry.name)) {
        const text = read(rel)
        if (/@supabase\/supabase-js|@emailjs\/browser/.test(text)) offenders.push(rel)
      }
    }
  }
  walk("app")
  assert.deepEqual(offenders, [], `these files still import a removed package: ${offenders.join(", ")}`)
})

test("no database driver or ORM is declared", () => {
  const pkg = JSON.parse(read("package.json"))
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
  const banned = ["pg", "mysql", "mysql2", "mongodb", "mongoose", "prisma", "@prisma/client",
    "sequelize", "drizzle-orm", "knex", "typeorm", "@supabase/supabase-js", "@emailjs/browser"]
  const found = deps.filter((d) => banned.includes(d))
  assert.deepEqual(found, [], `database packages still declared: ${found.join(", ")}`)
})

test("every form reaches the Sheet through the single submitRow helper", () => {
  // Forms must not call fetch() themselves: one code path, one webhook.
  const forms = [
    "app/contact/ContactForm.js",
    "app/become-a-tutor/TutorApplicationForm.js",
    "app/courses/CoursesExplorer.js",
    "app/Chatbot.js",
    "app/dashboard/page.js",
  ]
  for (const file of forms) {
    const text = read(file)
    assert.match(text, /from ["'].*intakeClient["']/, `${file} must submit through intakeClient`)
    assert.doesNotMatch(text, /\bfetch\(/, `${file} must not call fetch() directly`)
  }
})

test("the canonical site origin matches where the site is actually deployed", () => {
  // A wrong default here silently poisons robots.txt, the sitemap and every
  // share link — search engines get pointed at a domain that does not serve
  // the site. The default must be the live host, or set via NEXT_PUBLIC_SITE_URL.
  const originFile = read("app/lib/siteOrigin.js")
  const match = originFile.match(/DEFAULT_SITE_ORIGIN\s*=\s*"([^"]+)"/)
  assert.ok(match, "DEFAULT_SITE_ORIGIN must be declared")

  const origin = match[1]
  assert.match(origin, /^https:\/\//, "the default origin must use https")

  const host = origin.replace(/^https:\/\//, "").split("/")[0]
  assert.equal(
    host,
    "chrisco-digital-academy.vercel.app",
    `DEFAULT_SITE_ORIGIN points at ${host}, but the site is served from chrisco-digital-academy.vercel.app`
  )
})

test("no stray hosting domains are hardcoded in the app", () => {
  const offenders = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (["node_modules", ".next", ".git"].includes(entry.name)) continue
        walk(rel)
      } else if (/\.(js|jsx|mjs)$/.test(entry.name)) {
        const text = read(rel)
        if (/onrender\.com|herokuapp\.com|netlify\.app/.test(text)) offenders.push(rel)
      }
    }
  }
  walk("app")
  assert.deepEqual(offenders, [], `hosting domains that do not serve this site: ${offenders.join(", ")}`)
})
