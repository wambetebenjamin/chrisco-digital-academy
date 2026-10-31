"use client"
import { useState, useEffect } from "react"
import emailjs from "@emailjs/browser"
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

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

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

  // Deep links from the navigation mega-menu: /courses?category=Coding
  // and /courses?course=12 (opens that course's detail panel directly).
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const cat = params.get("category")
    const courseId = params.get("course")
    if (cat && (cat === "All" || categories.some((c) => c.name === cat))) {
      // One-shot read of the URL on mount; the router is the external store.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(cat)
    }
    if (courseId) {
      const match = courses.find((c) => String(c.id) === courseId)
      if (match) setSelected(match)
    }
  }, [])

  // Live hand-off from the navigation mega-menu when this page is already open.
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

  /*
   * Online book downloads require email registration (with Privacy & Data Protection consent).
   */
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
      {/* BODY */}
      <section className="section-frost" style={{ padding: "56px 0 96px" }}>
        <div className="container">
          <div className="grid-sidebar">

            {/* SIDEBAR */}
            <aside>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-lg)",
                  padding: "26px 22px",
                  position: "sticky",
                  top: 126,
                }}
              >
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
                  Categories
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    onClick={() => setCategory("All")}
                    className="pill"
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      background: category === "All" ? "var(--navy)" : "transparent",
                      borderColor: category === "All" ? "var(--navy)" : "var(--line-strong)",
                      color: category === "All" ? "#fff" : "var(--ink)",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon name="grid" size={14} /> All Courses
                    </span>
                    <span style={{ opacity: 0.7, fontWeight: 700 }}>{courses.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className="pill"
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                        background: category === cat.name ? "var(--navy)" : "transparent",
                        borderColor: category === cat.name ? "var(--navy)" : "var(--line-strong)",
                        color: category === cat.name ? "#fff" : "var(--ink)",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Icon name={cat.icon} size={14} /> {cat.name}
                      </span>
                      <span style={{ opacity: 0.7, fontWeight: 700 }}>{counts[cat.name] || 0}</span>
                    </button>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid var(--line)", margin: "22px 0" }} />

                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
                  Level
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {levels.map((lv) => (
                    <button
                      key={lv}
                      onClick={() => setLevel(lv)}
                      className="pill pill-sm"
                      style={{
                        background: level === lv ? "var(--navy)" : "transparent",
                        borderColor: level === lv ? "var(--navy)" : "var(--line-strong)",
                        color: level === lv ? "#fff" : "var(--ink)",
                      }}
                    >
                      {lv}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 24,
                    background: "var(--navy)",
                    borderRadius: 16,
                    padding: "20px 18px",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", lineHeight: 1.15 }}>
                    Not sure where to start?
                  </div>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: "8px 0 14px" }}>
                    WhatsApp us and we&apos;ll match you with the right course for your goals.
                  </p>
                  <a href="https://wa.me/254112272061" className="btn btn-green btn-sm" style={{ textDecoration: "none", width: "100%" }}>
                    <Icon name="whatsapp" size={15} /> WhatsApp Us
                  </a>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", margin: "22px 0 14px" }} />
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
                  Connected Study Hub
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {slidesDeck && (
                    <a
                      href={slidesDeck.url}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-sm"
                      style={{ textDecoration: "none", justifyContent: "flex-start" }}
                    >
                      <Icon name="play" size={13} /> Google Slides Track Guide
                    </a>
                  )}
                  {dropboxVault && (
                    <a
                      href={dropboxVault.url}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-sm"
                      style={{ textDecoration: "none", justifyContent: "flex-start" }}
                    >
                      <Icon name="download" size={13} /> Dropbox Vault (19 PDFs)
                    </a>
                  )}
                  {notionHub && (
                    <a
                      href={notionHub.curriculum_url || notionHub.url}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-sm"
                      style={{ textDecoration: "none", justifyContent: "flex-start" }}
                    >
                      <Icon name="book" size={13} /> Notion Curriculum Guide
                    </a>
                  )}
                  <Link
                    href="/studio"
                    className="pill pill-sm"
                    style={{ textDecoration: "none", justifyContent: "flex-start" }}
                  >
                    <Icon name="robot" size={13} /> AI Prompt &amp; Voice Studio
                  </Link>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", margin: "22px 0 14px" }} />
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
                  Teens AI Bootcamp Poster
                </div>
                <div
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    boxShadow: "0 10px 24px rgba(0, 35, 51, 0.12)",
                  }}
                >
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
                <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>
                  Showing <strong style={{ color: "var(--ink)" }}>{filtered.length}</strong> of {courses.length} courses
                </span>
                {(category !== "All" || level !== "All") && (
                  <button
                    onClick={clearFilters}
                    className="pill pill-sm"
                    style={{ background: "var(--green-tint)", borderColor: "transparent", color: "var(--green-deep)" }}
                  >
                    <Icon name="x" size={13} strokeWidth={2.4} /> Clear filters
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="card" style={{ padding: "60px 40px", textAlign: "center" }}>
                  <span style={{ display: "inline-flex", width: 72, height: 72, borderRadius: "50%", background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon name="search" size={34} strokeWidth={1.6} />
                  </span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>No courses match those filters</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>Try a different category or level.</p>
                  <button onClick={clearFilters} className="btn btn-navy btn-sm" style={{ cursor: "pointer" }}>
                    Show all courses
                  </button>
                </div>
              ) : (
                <div className="course-grid">
                  {filtered.map((course, i) => (
                    <div
                      key={course.id}
                      className="card card-hover"
                      style={{ overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", animation: `fadeUp 0.5s ease ${i * 0.05}s both` }}
                      onClick={() => openCourse(course)}
                    >
                      {/* Header, photo + course-tone overlay */}
                      <div style={{ background: "var(--navy)", padding: "26px 26px", position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
                        <Image
                          src={imageFor(course)}
                          alt=""
                          fill
                          sizes="(min-width: 1200px) 380px, (min-width: 768px) 45vw, 92vw"
                          style={{ objectFit: "cover" }}
                        />
                        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(148deg, rgba(0,35,51,0.68) 0%, rgba(0,35,51,0.38) 58%, rgba(1,58,79,0.2) 100%)" }} />
                        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(140deg, ${course.color[0]}3D, transparent 68%)` }} />
                        <span aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: `linear-gradient(90deg, ${course.color[0]}, ${course.color[1]})` }} />
                        <span
                          className="pill pill-sm"
                          style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.94)", border: "none", color: "var(--ink)" }}
                        >
                          {course.category}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
                          <div
                            style={{
                              width: 58,
                              height: 58,
                              borderRadius: 18,
                              background: "rgba(255,255,255,0.18)",
                              border: "1px solid rgba(255,255,255,0.3)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon name={course.icon} size={29} strokeWidth={1.7} />
                          </div>
                          <div>
                            <span style={{ background: "rgba(255,255,255,0.92)", color: "var(--ink)", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              {course.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 6 }}>{course.title}</h3>
                        <p style={{ fontFamily: "var(--font-head)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
                          {org.courseCredit}
                        </p>
                        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 18, flex: 1 }}>{course.desc}</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                          <span className="pill pill-soft pill-sm"><Icon name="clock" size={13} strokeWidth={2.2} /> {course.duration}</span>
                          <span className="pill pill-soft pill-sm"><Icon name="star" size={13} strokeWidth={2.2} /> {course.rating}</span>
                          <span className="pill pill-soft pill-sm"><Icon name="users" size={13} strokeWidth={2.2} /> {course.students}</span>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            className="btn btn-navy btn-sm"
                            style={{ flex: 1, cursor: "pointer", fontSize: 13.5 }}
                          >
                            View Course →
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(course) }}
                            className="btn btn-outline btn-sm"
                            title={hasBookAccess ? "Download course handbook" : "Sign in to your account to download handbook"}
                            aria-label={hasBookAccess ? `Download ${course.title} handbook` : `Sign in to your account to download ${course.title} handbook`}
                            style={{ cursor: "pointer", padding: "10px 16px" }}
                          >
                            <Icon name={hasBookAccess ? "download" : "lock"} size={16} />
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

      {/* ACCOUNT-GATED BOOK DOWNLOAD MODAL */}
      {lockedCourse && (
        <BookGateModal
          book={getBookByCourse(lockedCourse)}
          onClose={() => setLockedCourse(null)}
        />
      )}

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Header, photo + course-tone overlay */}
            <div style={{ background: "var(--navy)", padding: "32px 32px 28px", position: "relative", overflow: "hidden" }}>
              <Image
                src={imageFor(selected)}
                alt=""
                fill
                sizes="(min-width: 640px) 600px, 92vw"
                style={{ objectFit: "cover" }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(148deg, rgba(0,35,51,0.68) 0%, rgba(0,35,51,0.38) 58%, rgba(1,58,79,0.2) 100%)" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(140deg, ${selected.color[0]}3D, transparent 68%)` }} />
              <span
                className="pill pill-sm"
                style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.94)", border: "none", color: "var(--ink)" }}
              >
                {selected.category}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={selected.icon} size={34} strokeWidth={1.6} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: "1.4rem" }}>{selected.title}</h2>
                  <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", color: "rgba(255,255,255,0.72)", marginTop: 8 }}>
                    {org.courseCredit}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    <span className="modal-chip">{selected.level}</span>
                    <span className="modal-chip" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="clock" size={12} strokeWidth={2.2} /> {selected.duration}</span>
                    <span className="modal-chip" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="star" size={12} strokeWidth={2.2} /> {selected.rating}</span>
                    <span className="modal-chip" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="users" size={12} strokeWidth={2.2} /> {selected.students}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "28px 32px 32px" }}>
              <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 24 }}>{selected.desc}</p>

              {/* Objectives */}
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", marginBottom: 12, color: "var(--ink)", display: "flex", alignItems: "center", gap: 9 }}>
                <Icon name="target" size={18} style={{ color: "var(--green-deep)" }} /> Course Objectives
              </h3>
              <ul className="course-objectives">
                {(selected.objectives || []).map((objective) => (
                  <li key={objective}>
                    <Icon name="checkCircle" size={15} strokeWidth={2.1} />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>

              {/* Outline */}
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", marginBottom: 12, color: "var(--ink)", display: "flex", alignItems: "center", gap: 9 }}>
                <Icon name="clipboard" size={18} style={{ color: "var(--green-deep)" }} /> Course Outline
              </h3>
              <div style={{ background: "#F4F6F4", borderRadius: 16, padding: "6px 18px", marginBottom: 24 }}>
                {selected.syllabus.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: i < selected.syllabus.length - 1 ? "1px solid var(--line)" : "none" }}>
                    <span
                      style={{
                        background: "var(--navy)",
                        color: "var(--green)",
                        fontFamily: "var(--font-head)",
                        fontWeight: 800,
                        fontSize: 11,
                        width: 26,
                        height: 26,
                        borderRadius: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ color: "var(--ink)", fontSize: 14, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>

              <div className="course-handbook-note">
                <Icon name="book" size={15} strokeWidth={2} />
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

              {/* Who for */}
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", marginBottom: 10, color: "var(--ink)", display: "flex", alignItems: "center", gap: 9 }}>
                <Icon name="target" size={18} style={{ color: "var(--green-deep)" }} /> Who Is This For?
              </h3>
              <div
                style={{
                  background: "var(--layer-1)",
                  border: "1px solid var(--line)",
                  borderLeft: "3px solid var(--green-deep)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  marginBottom: 26,
                }}
              >
                <p style={{ color: "var(--body)", fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{selected.for}</p>
              </div>

              {/* Actions */}
              {!enrolling && !sent && (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setEnrolling(selected)}
                    className="btn btn-green"
                    style={{ flex: 1, cursor: "pointer" }}
                  >
                    <Icon name="rocket" size={16} /> Enroll Now
                  </button>
                  <button
                    onClick={() => handleDownload(selected)}
                    className="btn btn-outline"
                    title={hasBookAccess ? "Download course handbook" : "Sign in to your account to download handbook"}
                    aria-label={hasBookAccess ? "Download course handbook" : "Sign in to your account to download handbook"}
                    style={{ cursor: "pointer", padding: "14px 18px" }}
                  >
                    <Icon name={hasBookAccess ? "download" : "lock"} size={17} />
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    style={{ background: "transparent", border: "1.5px solid var(--line-strong)", color: "var(--muted)", borderRadius: 999, padding: "14px 20px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                  >
                    <Icon name="x" size={15} />
                  </button>
                </div>
              )}

              {/* Enroll form */}
              {enrolling && !sent && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.05rem", color: "var(--ink)", marginBottom: 18, display: "flex", alignItems: "center", gap: 9 }}>
                    <Icon name="pen" size={17} style={{ color: "var(--green-deep)" }} /> Enroll in {enrolling.title}
                  </h3>
                  {enrollError && (
                    <div style={{ background: "var(--danger-tint)", border: "1px solid rgba(229,72,77,0.3)", color: "var(--danger)", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 }}>
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

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => handleEnroll(enrolling)}
                      disabled={sending}
                      className="btn btn-green"
                      style={{ flex: 1, cursor: "pointer" }}
                    >
                      {sending ? "Sending..." : <><Icon name="send" size={15} /> Submit Enrollment</>}
                    </button>
                    <button onClick={() => setEnrolling(null)} className="btn btn-outline" style={{ cursor: "pointer" }}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Success */}
              {sent && (
                <div style={{ textAlign: "center", background: "var(--layer-1)", border: "1px solid var(--line)", borderRadius: 20, padding: "40px 24px" }}>
                  <span style={{ display: "inline-flex", width: 72, height: 72, borderRadius: "50%", background: "#fff", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "var(--shadow-sm)" }}>
                    <Icon name="checkCircle" size={38} strokeWidth={1.6} />
                  </span>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.3rem", fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>
                    Enrollment Sent!
                  </h3>
                  <p style={{ color: "var(--body)", fontSize: 14, marginBottom: 20 }}>
                    Our team at CHRISCO Youth Aflame will contact you soon on WhatsApp or email. Welcome to CHRISCO Digital Academy!
                  </p>
                  <button onClick={() => setSelected(null)} className="btn btn-navy" style={{ cursor: "pointer" }}>
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
