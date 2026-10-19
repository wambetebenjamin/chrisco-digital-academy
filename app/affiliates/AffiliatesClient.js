"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Icon from "../components/Icon"
import { readMyCode, saveMyCode, codeFromName, buildRefLink, normaliseCode, readRef, COMMISSION_RATE } from "../lib/referral"
import { readUsers } from "../lib/previewAuth"
import { courses } from "../data/courses"

const DESTINATIONS = [
  { label: "Homepage", path: "/" },
  { label: "All courses", path: "/courses" },
  { label: "PURSUE shop", path: "/shop" },
  { label: "Become a tutor", path: "/become-a-tutor" },
]

export default function AffiliatesClient() {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [destination, setDestination] = useState("/")
  const [copied, setCopied] = useState("")
  const [incomingRef, setIncomingRef] = useState("")
  const [referrals, setReferrals] = useState([])

  useEffect(() => {
    // One-shot hydration of the saved affiliate code and referral cookies.
    /* eslint-disable react-hooks/set-state-in-effect */
    const saved = readMyCode()
    if (saved) setCode(saved)
    setIncomingRef(readRef())
    try {
      setReferrals(readUsers().filter((u) => u.ref))
    } catch {
      setReferrals([])
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  const link = useMemo(
    () => (code ? buildRefLink(code, destination) : ""),
    [code, destination]
  )

  function generate() {
    const generated = codeFromName(name || "chrisco")
    setCode(saveMyCode(generated))
  }

  function applyCustom(value) {
    const clean = normaliseCode(value)
    setCode(saveMyCode(clean))
  }

  async function copy(text, key) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(""), 2200)
    } catch {
      setCopied("")
    }
  }

  const myReferrals = referrals.filter((u) => u.ref === code)
  const courseLinks = courses.slice(0, 4)

  return (
    <>
      {/* builder */}
      <section className="section-frost" style={{ padding: "52px 0 72px" }}>
        <div className="container">
          <div className="aff-grid">
            <div className="card aff-builder">
              <span className="eyebrow" style={{ fontSize: 11 }}>Step 1, your code</span>
              <h2 className="aff-title">Create your affiliate link</h2>
              <p className="aff-body">
                Pick a name your audience will recognise. Your link carries the code, and referrals are credited to
                it whenever someone signs up or enrols.
              </p>

              <div className="aff-field">
                <label htmlFor="aff-name">Your name or handle</label>
                <div className="aff-input-row">
                  <input
                    id="aff-name"
                    className="input"
                    placeholder="e.g. Amina Digital"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button type="button" className="btn btn-navy btn-sm" onClick={generate} style={{ cursor: "pointer" }}>
                    Generate
                  </button>
                </div>
              </div>

              <div className="aff-field">
                <label htmlFor="aff-code">Your code</label>
                <input
                  id="aff-code"
                  className="input"
                  placeholder="yourcode"
                  value={code}
                  onChange={(e) => applyCustom(e.target.value)}
                  spellCheck={false}
                />
                <span className="aff-hint">Letters and numbers only. Keep it short and memorable.</span>
              </div>

              <div className="aff-field">
                <label>Where should the link land?</label>
                <div className="aff-dest">
                  {DESTINATIONS.map((d) => (
                    <button
                      key={d.path}
                      type="button"
                      onClick={() => setDestination(d.path)}
                      className={`pill pill-sm${destination === d.path ? " is-active" : ""}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aff-linkbox">
                <code>{link || "Add a code to see your link"}</code>
                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  disabled={!link}
                  onClick={() => copy(link, "main")}
                  style={{ cursor: link ? "pointer" : "not-allowed" }}
                >
                  {copied === "main" ? "Copied" : "Copy link"}
                </button>
              </div>

              <div className="aff-share">
                <a
                  className="btn btn-outline btn-sm"
                  style={{ textDecoration: "none" }}
                  href={`https://wa.me/?text=${encodeURIComponent(`Learn practical digital skills with CHRISCO Digital Academy: ${link}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" size={15} /> WhatsApp
                </a>
                <a
                  className="btn btn-outline btn-sm"
                  style={{ textDecoration: "none" }}
                  href={`mailto:?subject=${encodeURIComponent("Study with CHRISCO Digital Academy")}&body=${encodeURIComponent(`I thought you would find this useful: ${link}`)}`}
                >
                  <Icon name="mail" size={15} /> Email
                </a>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => copy(link, "again")} style={{ cursor: "pointer" }}>
                  <Icon name="send" size={15} /> {copied === "again" ? "Copied" : "Share"}
                </button>
              </div>
            </div>

            <aside className="aff-side">
              <div className="card aff-stat-card">
                <span className="eyebrow" style={{ fontSize: 11 }}>Your activity</span>
                <div className="aff-stat-row">
                  <div>
                    <strong>{myReferrals.length}</strong>
                    <span>sign ups</span>
                  </div>
                  <div>
                    <strong>{Math.round(COMMISSION_RATE * 100)}%</strong>
                    <span>indicative share</span>
                  </div>
                </div>
                <p className="aff-note">
                  Referral credit is recorded when a visitor arrives through your link and creates an account. Keep
                  using the same link so the credit stays with you.
                </p>
              </div>

              {incomingRef && (
                <div className="card aff-incoming">
                  <Icon name="users" size={16} strokeWidth={2} />
                  <div>
                    <strong>You arrived through {incomingRef}</strong>
                    <span>That affiliate will be credited if you sign up.</span>
                  </div>
                </div>
              )}

              <div className="card aff-steps">
                <span className="eyebrow" style={{ fontSize: 11 }}>How it works</span>
                <ol>
                  <li><span>1</span>Create your code and copy your link.</li>
                  <li><span>2</span>Share it on WhatsApp, TikTok, X or in your class group.</li>
                  <li><span>3</span>Someone opens your link, signs up and enrols.</li>
                  <li><span>4</span>We confirm the enrolment and pay your share.</li>
                </ol>
                <Link href="/contact" className="link-arrow" style={{ marginTop: 14 }}>
                  Ask about payouts <span className="arr">→</span>
                </Link>
              </div>
            </aside>
          </div>

          {/* per course links */}
          <div className="aff-courses">
            <div className="aff-courses-head">
              <span className="eyebrow">Share a specific course</span>
              <p>These links land directly on the course catalogue. Same code, deeper link.</p>
            </div>
            <div className="aff-course-grid">
              {courseLinks.map((course) => {
                const courseLink = code
                  ? buildRefLink(code, `/courses?course=${course.id}`)
                  : "Add a code above"
                return (
                  <div key={course.id} className="card aff-course">
                    <div>
                      <strong>{course.title}</strong>
                      <span>{course.category} · {course.duration}</span>
                    </div>
                    <button
                      type="button"
                      className="pill pill-sm"
                      onClick={() => copy(courseLink, `course-${course.id}`)}
                      disabled={!code}
                    >
                      {copied === `course-${course.id}` ? "Copied" : "Copy link"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
