/*
 * Auth, referral and shop logic tests.
 *
 * Run with: npm test
 * These exercise the pure logic that the sign-in, sign-up, affiliate and
 * merchandise screens depend on. The React screens themselves are verified in
 * the browser preview.
 */
import test from "node:test"
import assert from "node:assert/strict"

// ---------------------------------------------------------------------------
// Minimal browser shims so the client modules can be imported in Node.
// ---------------------------------------------------------------------------
class MemoryStorage {
  constructor() {
    this.map = new Map()
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null
  }
  setItem(key, value) {
    this.map.set(key, String(value))
  }
  removeItem(key) {
    this.map.delete(key)
  }
  clear() {
    this.map.clear()
  }
}

globalThis.window = {
  localStorage: new MemoryStorage(),
  location: { search: "", origin: "https://chrisco.test", pathname: "/" },
  dispatchEvent: () => true,
}
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init) {
    this.type = type
    this.detail = init?.detail
  }
}
Object.defineProperty(globalThis, "navigator", {
  value: { clipboard: { writeText: async () => {} } },
  configurable: true,
})

const auth = await import("../app/lib/previewAuth.js")
const referral = await import("../app/lib/referral.js")
const shop = await import("../app/data/merch.js")
const { courses } = await import("../app/data/courses.js")

const CREDS = { name: "Amina Nakato", email: "Amina@Example.com", password: "secret123" }

// ---------------------------------------------------------------------------
test("sign up validates name, email and password", () => {
  assert.match(auth.validateSignUp({ name: "A", email: "a@b.co", password: "secret1" }), /full name/i)
  assert.match(auth.validateSignUp({ name: "Amina", email: "nope", password: "secret1" }), /valid email/i)
  assert.match(auth.validateSignUp({ name: "Amina", email: "a@b.co", password: "123" }), /6 characters/i)
  assert.equal(auth.validateSignUp(CREDS), "")
})

test("sign up stores an account and starts a session", () => {
  auth.previewClearAll()
  const result = auth.previewSignUp(CREDS)
  assert.equal(result.error, null)
  assert.equal(result.data.user.email, "amina@example.com", "email is normalised")
  assert.equal(result.data.user.name, "Amina Nakato")
  assert.equal(auth.previewSession().email, "amina@example.com")

  const users = auth.readUsers()
  assert.equal(users.length, 1)
  assert.notEqual(users[0].password, CREDS.password, "password is never stored in plain text")
})

test("duplicate emails are rejected", () => {
  const again = auth.previewSignUp(CREDS)
  assert.match(again.error.message, /already exists/i)
})

test("sign in succeeds with the right password", () => {
  auth.previewSignOut()
  assert.equal(auth.previewSession(), null)

  const ok = auth.previewSignIn({ email: "AMINA@example.com", password: "secret123" })
  assert.equal(ok.error, null)
  assert.equal(ok.data.user.email, "amina@example.com")
  assert.equal(auth.previewSession().name, "Amina Nakato")
})

test("sign in rejects a wrong password and an unknown account", () => {
  const wrong = auth.previewSignIn({ email: "amina@example.com", password: "wrongpass" })
  assert.match(wrong.error.message, /incorrect password/i)

  const missing = auth.previewSignIn({ email: "nobody@example.com", password: "secret123" })
  assert.match(missing.error.message, /no account found/i)

  const invalid = auth.previewSignIn({ email: "not-an-email", password: "x" })
  assert.match(invalid.error.message, /valid email/i)
})

test("sign out clears the session but keeps the account", () => {
  auth.previewSignOut()
  assert.equal(auth.previewSession(), null)
  assert.equal(auth.readUsers().length, 1)

  const back = auth.previewSignIn({ email: "amina@example.com", password: "secret123" })
  assert.equal(back.error, null)
})

test("an account can be created after a failed attempt", () => {
  const second = auth.previewSignUp({ name: "Joshua Okello", email: "josh@example.com", password: "another1", ref: "amina001" })
  assert.equal(second.error, null)
  assert.equal(second.data.user.ref, "amina001", "referral code travels with the sign up")
  assert.equal(auth.readUsers().length, 2)
})

// ---------------------------------------------------------------------------
test("referral codes are generated, normalised and stored", () => {
  const generated = referral.codeFromName("Amina Digital")
  assert.match(generated, /^[a-z0-9]+$/)
  assert.ok(generated.startsWith("aminadigit"))

  const saved = referral.saveRef("  AMINA-001 ")
  assert.equal(saved, "amina001")
  assert.equal(referral.readRef(), "amina001")
})

test("a ?ref= visit is captured and turned into a share link", () => {
  globalThis.window.location.search = "?ref=PETER02"
  assert.equal(referral.captureRefFromLocation("?ref=PETER02"), "peter02")
  assert.equal(referral.readRef(), "peter02")

  const link = referral.buildRefLink("peter02", "/courses")
  assert.equal(link, "https://chrisco.test/courses?ref=peter02")

  const withQuery = referral.buildRefLink("peter02", "/courses?course=12")
  assert.equal(withQuery, "https://chrisco.test/courses?course=12&ref=peter02")
})

test("expired referrals are dropped", () => {
  globalThis.window.localStorage.setItem(
    "chrisco:ref",
    JSON.stringify({ code: "oldcode", at: Date.now() - 120 * 24 * 60 * 60 * 1000 })
  )
  assert.equal(referral.readRef(), "")
})

// ---------------------------------------------------------------------------
test("every merchandise item has a unique code, sizes and a price", () => {
  const codes = new Set()
  for (const item of shop.merch) {
    assert.match(item.code, /^[A-Z]{2}-\d{2}$/, `${item.name} has a code`)
    assert.ok(!codes.has(item.code), `${item.code} is unique`)
    codes.add(item.code)
    assert.ok(item.sizes.length > 0, `${item.code} has sizes`)
    assert.ok(item.price.kes > 0 && item.price.ugx > 0, `${item.code} has a price in both currencies`)
    assert.ok(item.img.startsWith("/merch/"), `${item.code} has a mockup`)
  }
  assert.equal(shop.merch.filter((m) => m.category === "Hoodies").length, 4)
  assert.equal(shop.merch.filter((m) => m.category === "T-shirts").length, 11)
  assert.equal(shop.merch.filter((m) => m.category === "Polos").length, 3)
  assert.equal(shop.merch.length, 29)
})

test("every colourway of each product has its own code", () => {
  const pursueTees = shop.merch.filter((m) => m.category === "T-shirts" && m.collection === "pursue")
  assert.deepEqual(pursueTees.map((t) => t.colour), ["Brown", "Cream", "Black", "White"])
})

test("apparel runs from S to XXL", () => {
  assert.deepEqual(shop.sizeSets.apparel, ["S", "M", "L", "XL", "XXL"])
  const tee = shop.findMerch("TS-01")
  assert.deepEqual(tee.sizes, shop.sizeSets.apparel)
})

test("recommendations exclude the viewed item and never repeat", () => {
  const recs = shop.recommendationsFor("TS-01", 3)
  assert.equal(recs.length, 3)
  assert.ok(!recs.some((r) => r.code === "TS-01"))
  assert.equal(new Set(recs.map((r) => r.code)).size, 3)
})

test("prices carry KSh and UGX", () => {
  const tee = shop.findMerch("TS-01")
  assert.equal(shop.formatKsh(shop.priceKsh(tee)), "KSh 1,600")
  assert.equal(shop.formatUgx(shop.priceUgx(tee)), "UGX 45,000")
  const pair = shop.formatPricePair(tee)
  assert.deepEqual(pair, { primary: "KSh 1,600", secondary: "UGX 45,000" })
})

test("every item lists specifications and a collection", () => {
  for (const item of shop.merch) {
    assert.ok(["pursue", "faith", "scripture"].includes(item.collection), `${item.code} has a collection`)
    assert.ok(Array.isArray(item.specs) && item.specs.length >= 3, `${item.code} has specs`)
    assert.ok(item.price.kes > 0 && item.price.ugx > 0, `${item.code} has both currencies`)
  }
})

test("the catalogue spans every collection and a wide colour range", () => {
  const pursue = shop.merch.filter((m) => m.collection === "pursue")
  const faith = shop.merch.filter((m) => m.collection === "faith")
  const scripture = shop.merch.filter((m) => m.collection === "scripture")
  assert.equal(pursue.length, 12)
  assert.equal(faith.length, 7)
  assert.equal(scripture.length, 10)
  for (const id of shop.collections.map((c) => c.id)) {
    if (id !== "all") assert.ok(scripture.concat(pursue, faith).some((m) => m.collection === id), `${id} has stock`)
  }
  const colours = new Set(shop.merch.map((m) => m.colour))
  for (const colour of ["Brown", "White", "Black", "Cream", "Natural"]) {
    assert.ok(colours.has(colour), `${colour} appears in the range`)
  }
})

test("the WhatsApp message leads with the design code", () => {
  const item = shop.findMerch("TS-07")
  const message = decodeURIComponent(shop.whatsappInquiry(item, { size: "L", qty: 2 }))
  assert.ok(message.includes("Design code: TS-07"))
  assert.ok(message.includes("Overtake Tee"))
  assert.ok(message.includes("Size: L"))
  assert.ok(message.includes("Quantity: 2"))
  assert.ok(message.includes("KSh 1,600"))
  assert.ok(message.includes("UGX 45,000"))

  const bare = decodeURIComponent(shop.whatsappInquiry(item))
  assert.ok(bare.includes("Design code: TS-07"))
  assert.ok(!bare.includes("Size:"), "no size is invented before the shopper picks one")
  assert.equal(shop.whatsappInquiry(null), "")
})

test("the scripture collection is anchored on 1 Samuel 30:8", () => {
  const verses = shop.merch
    .filter((m) => m.collection === "scripture")
    .map((m) => `${m.name} ${m.desc}`)
    .join(" ")
  assert.ok(verses.includes("1 Samuel 30:8"))
  assert.ok(shop.merch.some((m) => m.code === "TS-07" && m.colour === "Black"))
  assert.ok(shop.merch.some((m) => m.code === "CP-03"))
})

// ---------------------------------------------------------------------------
test("recommendations stay valid for the new colourways", () => {
  for (const code of ["HD-02", "TS-03"]) {
    const recs = shop.recommendationsFor(code, 3)
    assert.equal(recs.length, 3, `${code} has three recommendations`)
    assert.ok(!recs.some((r) => r.code === code), `${code} is not recommended to itself`)
  }
})

test("all 19 courses publish objectives and a full outline", () => {
  assert.equal(courses.length, 19)
  for (const course of courses) {
    assert.ok(Array.isArray(course.objectives), `${course.title} has objectives`)
    assert.ok(course.objectives.length >= 3, `${course.title} has at least three objectives`)
    assert.ok(course.syllabus.length >= 6, `${course.title} has a full outline`)
    assert.ok(course.download.endsWith(".pdf"), `${course.title} has a handbook path`)
  }
})
