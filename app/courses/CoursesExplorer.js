"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "../components/Icon"
import { courses, categories, categoryCounts, imageFor } from "../data/courses"
import { org } from "../data/org"
import { CONNECTED_RESOURCES } from "../data/connectedResources"
import { useAuth } from "../AuthProvider"
import { readRef } from "../lib/referral"
import { submitAcademyIntake } from "../lib/intakeClient"
import RecaptchaCheck from "../components/RecaptchaCheck"
import BookGateModal from "../components/BookGateModal"
import ShareBookBar from "../components/ShareBookBar"
import { getBookByCourse } from "../data/booksCatalogue"

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
}

const levels = ["All", "Beginner", "Intermediate"]

export default function CoursesExplorer() {
  const [selected, setSelected] = useState(null)
  const [enrolling, setEnrolling] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [category, setCategory] = useState("All")
  const [level, setLevel] = useState("All")
  const [lockedCourse, setLockedCourse] = useState(null)
  const [notRobot, setNotRobot] = useState(false)
  const [enrollError, setEnrollError] = useState("")
  const { user, profile, enrollCourse } = useAuth() || {}

  const hasBookAccess = Boolean(user?.email)

  const slidesDeck = CONNECTED_RESOURCES.find((r) => r.connector === "google_slides")
  const dropboxVault = CONNECTED_RESOURCES.find((r) => r.connector === "dropbox")
  const notionHub = CONNECTED_RESOURCES.find((r) => r.connector === "notion")

  useEffect(() => {
    if (user || profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile?.name || user?.user_metadata?.name || user?.name || "",
        email: prev.email || user?.email || profile?.email || "",
      }))
    }
  }, [user, profile])

  const counts = categoryCounts()

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const cat = params.get("category")
    const courseId = params.get("course")
    if (cat && (cat === "All" || categories.some((c) => c.name === cat))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(cat)
    }
    if (courseId) {
      const match = courses.find((c) => String(c.id) === courseId)
      if (match) setSelected(match)
    }
  }, [])

  useEffect(() => {
    const onCatalogueNav = (event) => {
      const { category: cat, courseId } = event.detail || {}
      if (cat) setCategory(cat)
      if (courseId) {
        const match = courses.find((c) => String(c.id) === String(courseId))
        if (match) {
          setSelected(match)
          setEnrolling(null)
          setSent(false)
        }
      } else if (cat) {
        setSelected(null)
      }
    }
    window.addEventListener("chrisco:catalogue", onCatalogueNav)
    return () => window.removeEventListener("chrisco:catalogue", onCatalogueNav)
  }, [])

  const filtered = courses.filter((c) => {
    const catOk = category === "All" || c.category === category
    const levelOk = level === "All" || c.level === level
    return catOk && levelOk
  })

  async function handleEnroll(course) {
    setEnrollError("")
    if (!form.name.trim() || !form.phone.trim()) {
      setEnrollError("Please fill in your full name and phone number.")
      return
    }
    if (!isValidEmail(form.email)) {
      setEnrollError("Please enter a valid email address.")
      return
    }
    if (!notRobot) {
      setEnrollError("Please complete the reCAPTCHA check to prove you are not a bot.")
      return
    }
    setSending(true)
    try {
      if (user && enrollCourse) {
        await enrollCourse(course.title, {
          id: course.id,
          category: course.category,
          level: course.level,
          phone: form.phone.trim(),
        })
      }
      await submitAcademyIntake({
        action: "course_application",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        course_title: course.title,
        course_id: course.id,
        category: course.category,
        level: course.level,
        user_id: user?.id || null,
        ref: readRef() || null,
        message: `Enrollment Request for: ${course.title}\nLevel: ${course.level}\nDuration: ${course.duration}\nPhone: ${form.phone.trim()}`,
      })
      setSent(true)
      setNotRobot(false)
    } catch {
      setEnrollError(`Failed to send. Please email ${org.email} directly.`)
    }
    setSending(false)
  }

  function handleDownload(course) {
    if (!course.download) return
    if (!hasBookAccess) {
      setLockedCourse(course)
      return
    }
    window.open(course.download, "_blank")
  }

  function openCourse(course) {
    setSelected(course)
    setEnrolling(null)
    setSent(false)
    setEnrollError("")
    setNotRobot(false)
  }

  function clearFilters() {
    setCategory("All")
    setLevel("All")
  }

  return (
    <>
      <section style={{ background: "#FFFFFF", padding: "56px 0 88px" }}>
        <div className="container">
          <div className="grid-sidebar">

            {/* SIDEBAR */}
            <aside>
              <div
                style={{
                  background: "#F5F7FA",
                  padding: "24px 20px",
                  position: "sticky",
                  top: 126,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0B1D51", marginBottom: 12 }}>
                  Skill Tracks
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setCategory("All")}
                    className="pill"
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      background: category === "All" ? "#0B1D51" : "#FFFFFF",
                      color: category === "All" ? "#FFFFFF" : "#0B1D51",
                    }}
                  >
                    <span>All Courses</span>
                    <span>{courses.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className="pill"
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                        background: category === cat.name ? "#0B1D51" : "#FFFFFF",
                        color: category === cat.name ? "#FFFFFF" : "#0B1D51",
                      }}
                    >
                      <span>{cat.name}</span>
                      <span>{counts[cat.name] || 0}</span>
                    </button>
                  ))}
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, color: "#0B1D51", margin: "22px 0 10px" }}>
                  Level
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {levels.map((lv) => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => setLevel(lv)}
                      className="pill pill-sm"
                      style={{
                        background: level === lv ? "#0B1D51" : "#FFFFFF",
                        color: level === lv ? "#FFFFFF" : "#0B1D51",
                      }}
                    >
                      {lv}
                    </button>
                  ))}
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, color: "#0B1D51", margin: "22px 0 10px" }}>
                  Study Resources
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {slidesDeck && (
                    <a
                      href={slidesDeck.url}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-sm"
                      style={{ background: "#FFFFFF", textDecoration: "none", justifyContent: "flex-start" }}
                    >
                      Google Slides Track Guide
                    </a>
                  )}
                  {dropboxVault && (
                    <a
                      href={dropboxVault.url}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-sm"
                      style={{ background: "#FFFFFF", textDecoration: "none", justifyContent: "flex-start" }}
                    >
                      Dropbox Vault (19 PDFs)
                    </a>
                  )}
                  {notionHub && (
                    <a
                      href={notionHub.curriculum_url || notionHub.url}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-sm"
                      style={{ background: "#FFFFFF", textDecoration: "none", justifyContent: "flex-start" }}
                    >
                      Notion Curriculum Guide
                    </a>
                  )}
                  <Link
                    href="/studio"
                    className="pill pill-sm"
                    style={{ background: "#FFFFFF", textDecoration: "none", justifyContent: "flex-start" }}
                  >
                    AI Creative &amp; Voice Studio
                  </Link>
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, color: "#0B1D51", margin: "22px 0 10px" }}>
                  Teens AI Bootcamp
                </div>
                <div>
                  <Image
                    src="/posters/teens-ai-bootcamp-official.png"
                    alt="CHRISCO Teens AI & Projects Bootcamp Official Poster"
                    width={736}
                    height={920}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
            </aside>

            {/* COURSE GRID */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
                <span style={{ fontSize: 14, color: "#475569" }}>
                  Showing <strong style={{ color: "#0B1D51" }}>{filtered.length}</strong> of {courses.length} courses
                </span>
                {(category !== "All" || level !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="pill pill-sm"
                    style={{ background: "#F5F7FA", color: "#003896" }}
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div style={{ background: "#F5F7FA", padding: "56px 36px", textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0B1D51", marginBottom: 8 }}>
                    No courses match those filters
                  </h3>
                  <p style={{ color: "#475569", fontSize: 14, marginBottom: 20 }}>
                    Try selecting a different skill track or level.
                  </p>
                  <button type="button" onClick={clearFilters} className="btn btn-navy btn-sm">
                    Show all courses
                  </button>
                </div>
              ) : (
                <div className="course-grid">
                  {filtered.map((course) => (
                    <div
                      key={course.id}
                      style={{
                        background: "#F5F7FA",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                      }}
                      onClick={() => openCourse(course)}
                    >
                      <div style={{ background: "#0B1D51", position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
                        <Image
                          src={imageFor(course)}
                          alt={course.title}
                          fill
                          sizes="(min-width: 1200px) 380px, (min-width: 768px) 45vw, 92vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
                          {course.category} · {course.level} · {course.duration}
                        </div>

                        <h3 style={{ fontSize: "1.12rem", fontWeight: 700, color: "#0B1D51", marginBottom: 8 }}>
                          {course.title}
                        </h3>

                        <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.65, marginBottom: 18, flex: 1 }}>
                          {course.desc}
                        </p>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1, cursor: "pointer" }}
                          >
                            View Course
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(course)
                            }}
                            className="btn btn-outline btn-sm"
                            title={hasBookAccess ? "Download course handbook" : "Sign in to your account to download handbook"}
                            aria-label={hasBookAccess ? `Download ${course.title} handbook` : `Sign in to your account to download ${course.title} handbook`}
                            style={{ cursor: "pointer", padding: "9px 14px" }}
                          >
                            <Icon name={hasBookAccess ? "download" : "lock"} size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {lockedCourse && (
        <BookGateModal
          book={getBookByCourse(lockedCourse)}
          onClose={() => setLockedCourse(null)}
        />
      )}

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ background: "#0B1D51", padding: "28px 30px 24px", color: "#FFFFFF" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F8C90E", marginBottom: 6 }}>
                {selected.category} · {selected.level} · {selected.duration}
              </div>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "#FFFFFF", fontSize: "1.45rem" }}>
                {selected.title}
              </h2>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)", marginTop: 6 }}>
                {org.courseCredit}
              </p>
            </div>

            <div style={{ padding: "26px 30px 30px" }}>
              <p style={{ color: "#334155", lineHeight: 1.7, marginBottom: 22 }}>{selected.desc}</p>

              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.02rem", marginBottom: 10, color: "#0B1D51" }}>
                Course Objectives
              </h3>
              <ul className="course-objectives">
                {(selected.objectives || []).map((objective) => (
                  <li key={objective}>
                    <span>• {objective}</span>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.02rem", marginBottom: 10, color: "#0B1D51" }}>
                Course Outline
              </h3>
              <div style={{ background: "#F5F7FA", padding: "14px 18px", marginBottom: 22, display: "grid", gap: 10 }}>
                {selected.syllabus.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#003896", minWidth: 24 }}>
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <p style={{ color: "#0B1D51", fontSize: 14, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>

              <div className="course-handbook-note" style={{ border: "none", background: "#F5F7FA" }}>
                <span>
                  {hasBookAccess
                    ? "PDF handbook unlocked in your account and Dashboard."
                    : "Sign in to download the PDF handbook."}
                </span>
                {!hasBookAccess && (
                  <button
                    type="button"
                    onClick={() => setLockedCourse(selected)}
                    className="course-handbook-link"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Sign in
                  </button>
                )}
              </div>

              <div style={{ marginBottom: 22 }}>
                <ShareBookBar book={getBookByCourse(selected)} />
              </div>

              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.02rem", marginBottom: 8, color: "#0B1D51" }}>
                Who Is This For?
              </h3>
              <div style={{ background: "#F5F7FA", padding: "14px 18px", marginBottom: 24 }}>
                <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.65 }}>{selected.for}</p>
              </div>

              {!enrolling && !sent && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setEnrolling(selected)}
                    className="btn btn-primary"
                    style={{ flex: 1, cursor: "pointer" }}
                  >
                    Enroll Now
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(selected)}
                    className="btn btn-outline"
                    title={hasBookAccess ? "Download course handbook" : "Sign in to your account to download handbook"}
                    aria-label={hasBookAccess ? "Download course handbook" : "Sign in to your account to download handbook"}
                    style={{ cursor: "pointer", padding: "12px 16px" }}
                  >
                    <Icon name={hasBookAccess ? "download" : "lock"} size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    className="btn btn-outline"
                    style={{ cursor: "pointer", padding: "12px 16px" }}
                  >
                    <Icon name="x" size={15} />
                  </button>
                </div>
              )}

              {enrolling && !sent && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.05rem", color: "#0B1D51", marginBottom: 16 }}>
                    Enroll in {enrolling.title}
                  </h3>
                  {enrollError && (
                    <div style={{ background: "#FEECEC", color: "#B91C1C", padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>
                      {enrollError}
                    </div>
                  )}
                  <div className="field">
                    <label>Full name *</label>
                    <input className="input" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Email *</label>
                    <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Phone / WhatsApp *</label>
                    <input className="input" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>

                  <RecaptchaCheck
                    verified={notRobot}
                    onChange={setNotRobot}
                  />

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => handleEnroll(enrolling)}
                      disabled={sending}
                      className="btn btn-primary"
                      style={{ flex: 1, cursor: "pointer" }}
                    >
                      {sending ? "Sending..." : "Submit Enrollment"}
                    </button>
                    <button type="button" onClick={() => setEnrolling(null)} className="btn btn-outline" style={{ cursor: "pointer" }}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {sent && (
                <div style={{ textAlign: "center", background: "#F5F7FA", padding: "36px 24px" }}>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.25rem", fontWeight: 700, color: "#0B1D51", marginBottom: 8 }}>
                    Enrollment Sent!
                  </h3>
                  <p style={{ color: "#334155", fontSize: 14, marginBottom: 20 }}>
                    Our team at CHRISCO Youth Aflame will contact you soon on WhatsApp or email. Welcome to CHRISCO Digital Academy!
                  </p>
                  <button type="button" onClick={() => setSelected(null)} className="btn btn-navy" style={{ cursor: "pointer" }}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
