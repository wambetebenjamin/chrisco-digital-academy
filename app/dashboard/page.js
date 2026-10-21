"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"
import { useAuth } from "../AuthProvider"
import { courses } from "../data/courses"
import { org } from "../data/org"
import { CONNECTED_RESOURCES, CONNECTED_APPS_SUMMARY } from "../data/connectedResources"
import {
  fetchAcademyOverview,
  submitAcademyIntake,
  buildAutoReplyReceipt,
} from "../lib/intakeClient"
import AutoReplyReceipt from "../components/AutoReplyReceipt"

export default function Dashboard() {
  const {
    user,
    profile,
    logout,
    getEnrollments,
    enrollCourse,
    updateCourseProgress,
    lastAutoReply,
    setLastAutoReply,
  } = useAuth()

  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [quickCourseTitle, setQuickCourseTitle] = useState(courses[0]?.title || "")
  const [enrollingQuick, setEnrollingQuick] = useState(false)
  const [activeCertificate, setActiveCertificate] = useState(null)
  const [showSlidesEmbed, setShowSlidesEmbed] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState(null)

  const displayName =
    profile?.name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Student"

  const slidesRes = CONNECTED_RESOURCES.find((r) => r.connector === "google_slides")
  const dropboxRes = CONNECTED_RESOURCES.find((r) => r.connector === "dropbox")
  const notionRes = CONNECTED_RESOURCES.find((r) => r.connector === "notion")
  const sheetsRes = CONNECTED_RESOURCES.find((r) => r.connector === "google_sheets")

  useEffect(() => {
    async function load() {
      const [enrolledData, overview] = await Promise.all([
        getEnrollments(),
        fetchAcademyOverview({
          user_id: user?.id,
          email: user?.email,
        }),
      ])
      setEnrollments(enrolledData || [])

      let inbox = overview?.notifications || []
      if (inbox.length === 0 && user?.email) {
        inbox = [
          buildAutoReplyReceipt({
            action: "signup_welcome",
            name: displayName,
            email: user.email,
            refCode: `WEL-${String(user.id || "CDA001").slice(0, 6).toUpperCase()}`,
          }),
        ]
      }
      setNotifications(inbox)
      setLoading(false)
    }
    if (user) load()
  }, [user])

  async function handleQuickEnroll(e) {
    e.preventDefault()
    if (!quickCourseTitle || !user) return
    const courseObj = courses.find((c) => c.title === quickCourseTitle)
    setEnrollingQuick(true)
    try {
      await enrollCourse(quickCourseTitle, {
        id: courseObj?.id,
        category: courseObj?.category,
        level: courseObj?.level,
      })
      const intake = await submitAcademyIntake({
        action: "course_application",
        name: displayName,
        email: user.email || org.email,
        course_title: quickCourseTitle,
        course_id: courseObj?.id,
        category: courseObj?.category,
        level: courseObj?.level,
        user_id: user.id,
        message: `Dashboard Quick Enrollment in ${quickCourseTitle}`,
      })
      if (intake?.auto_reply) {
        setLastAutoReply(intake.auto_reply)
        setNotifications((prev) => [intake.auto_reply, ...prev])
      }
      const updated = await getEnrollments()
      setEnrollments(updated)
    } finally {
      setEnrollingQuick(false)
    }
  }

  async function handleToggleModule(courseTitle, modIndex, totalModules) {
    const target = enrollments.find((e) => e.course_title === courseTitle)
    const currentMods = Array.isArray(target?.completed_modules) ? target.completed_modules : []
    const nextMods = currentMods.includes(modIndex)
      ? currentMods.filter((m) => m !== modIndex)
      : [...currentMods, modIndex]

    const res = await updateCourseProgress(courseTitle, nextMods, totalModules)
    if (res) {
      setEnrollments((prev) =>
        prev.map((e) =>
          e.course_title === courseTitle
            ? { ...e, progress: res.progress, completed_modules: res.completed_modules }
            : e
        )
      )
    }
  }

  const completedCount = enrollments.filter((e) => (e.progress || 0) >= 100).length

  const stats = [
    { icon: "book", label: "Courses Available", value: "19" },
    { icon: "checkCircle", label: "Courses Enrolled", value: loading ? "…" : enrollments.length },
    { icon: "trophy", label: "Certificates Earned", value: loading ? "…" : String(completedCount) },
    {
      icon: "mail",
      label: `Receipts (${org.email.split("@")[0]})`,
      value: loading ? "…" : String(notifications.length || 1),
    },
  ]

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: "var(--navy)", padding: "140px 0 96px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/bg-cta.jpg" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 35%", opacity: 0.12 }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow on-dark" style={{ marginBottom: 14 }}>Welcome back</span>
              <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.05, textTransform: "uppercase" }}>
                {displayName}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "1rem", marginTop: 12 }}>
                Continue your digital learning journey with {org.academy} ({org.programme})
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "14px 20px" }}>
              <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--green)", color: "var(--navy)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.1rem", flexShrink: 0 }}>
                {displayName[0]?.toUpperCase() || "U"}
              </span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{displayName}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ marginTop: -56, padding: "0 0 16px" }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((stat, i) => (
              <div key={i} className="card card-hover" style={{ padding: "24px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ width: 54, height: 54, borderRadius: 16, background: "var(--green-tint)", color: "var(--green-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={stat.icon} size={24} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--ink)" }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {lastAutoReply && (
            <div style={{ marginTop: 20 }}>
              <AutoReplyReceipt
                receipt={lastAutoReply}
                showDashboardLink={false}
                onClose={() => setLastAutoReply(null)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Enrollments & Quick Enroll */}
      <section style={{ padding: "36px 0 32px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <div>
              <span className="eyebrow" style={{ fontSize: 11 }}>Your Learning Track</span>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.45rem", color: "var(--ink)", marginTop: 4 }}>
                {enrollments.length > 0 ? "Your enrolled courses & module progress" : "Start learning today"}
              </h2>
            </div>

            <form onSubmit={handleQuickEnroll} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <select
                className="input"
                aria-label="Select a course to enrol in"
                value={quickCourseTitle}
                onChange={(e) => setQuickCourseTitle(e.target.value)}
                style={{ width: "auto", minWidth: 230, padding: "10px 14px", fontSize: 13 }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={enrollingQuick}
                className="btn btn-green btn-sm"
                style={{ cursor: "pointer" }}
              >
                {enrollingQuick ? "Enrolling..." : "+ Enrol in Course"}
              </button>
              <Link href="/courses" className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>
                Catalogue →
              </Link>
            </form>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div className="spinner" />
              Loading your courses...
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid-3">
              {enrollments.map((enrollment, i) => {
                const courseMeta = courses.find((c) => c.title === enrollment.course_title)
                const syllabus = courseMeta?.syllabus || [
                  "Module 1: Foundations & Core Concepts",
                  "Module 2: Tools & Practical Setup",
                  "Module 3: Guided Project Build",
                  "Module 4: Portfolio & Monetisation",
                ]
                const completedMods = Array.isArray(enrollment.completed_modules)
                  ? enrollment.completed_modules
                  : []
                const pct =
                  enrollment.progress !== undefined
                    ? enrollment.progress
                    : Math.round((completedMods.length / syllabus.length) * 100)
                const isExpanded = expandedCourse === enrollment.course_title
                const enrolledDate = enrollment.enrolled_at || enrollment.created_at

                return (
                  <div key={i} className="card card-hover" style={{ padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--ink)", fontSize: "1.1rem" }}>
                        {enrollment.course_title}
                      </h3>
                      {courseMeta?.category && (
                        <span className="pill pill-soft pill-sm" style={{ fontSize: 11 }}>
                          {courseMeta.category}
                        </span>
                      )}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 12.5, marginBottom: 16 }}>
                      Enrolled{" "}
                      {enrolledDate
                        ? new Date(enrolledDate).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Today"}
                    </div>

                    <div style={{ background: "var(--green-tint)", borderRadius: 999, height: 8, marginBottom: 8, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: "linear-gradient(90deg, var(--green-deep), var(--green))",
                          borderRadius: 999,
                          transition: "width 0.25s ease",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ color: "var(--ink)", fontSize: 12.5, fontWeight: 700 }}>
                        {pct}% complete ({completedMods.length}/{syllabus.length} modules)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCourse(isExpanded ? null : enrollment.course_title)
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--green-deep)",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {isExpanded ? "Hide modules ▲" : "Track modules ▼"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div
                        style={{
                          background: "#F4F6F4",
                          borderRadius: 12,
                          padding: "12px 14px",
                          marginBottom: 16,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {syllabus.map((mod, mIdx) => {
                          const checked = completedMods.includes(mIdx)
                          return (
                            <label
                              key={mIdx}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 9,
                                fontSize: 12.5,
                                color: "var(--ink)",
                                cursor: "pointer",
                                lineHeight: 1.4,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  handleToggleModule(
                                    enrollment.course_title,
                                    mIdx,
                                    syllabus.length
                                  )
                                }
                                style={{ marginTop: 2 }}
                              />
                              <span style={{ textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.7 : 1 }}>
                                {mod}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
                      {courseMeta?.learnUrl ? (
                        <a
                          href={courseMeta.learnUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-navy btn-sm"
                          style={{ textDecoration: "none", fontSize: 12 }}
                        >
                          Open Lesson →
                        </a>
                      ) : (
                        <Link
                          href={courseMeta ? `/courses?course=${courseMeta.id}` : "/courses"}
                          className="btn btn-navy btn-sm"
                          style={{ textDecoration: "none", fontSize: 12 }}
                        >
                          Continue →
                        </Link>
                      )}
                      {courseMeta?.download && (
                        <a
                          href={courseMeta.download}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ textDecoration: "none", fontSize: 12 }}
                        >
                          PDF Handbook
                        </a>
                      )}
                      {pct >= 100 && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCertificate({
                              courseTitle: enrollment.course_title,
                              studentName: displayName,
                              date: new Date().toLocaleDateString("en-KE", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }),
                              code:
                                enrollment.certificate_code ||
                                `CERT-CDA-${String(user?.id || "2026").slice(0, 4).toUpperCase()}-${courseMeta?.id || 10}`,
                            })
                          }
                          className="btn btn-green btn-sm"
                          style={{ cursor: "pointer", fontSize: 12 }}
                        >
                          🎓 View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: "56px 40px", textAlign: "center" }}>
              <span style={{ display: "inline-flex", width: 80, height: 80, borderRadius: "50%", background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon name="book" size={38} strokeWidth={1.6} />
              </span>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.25rem", fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>
                No courses enrolled yet
              </h3>
              <p style={{ color: "var(--muted)", fontSize: 14.5, maxWidth: 460, margin: "0 auto 24px" }}>
                Pick any of our 19 practical digital skills courses using the quick selector above or browse the full catalogue. You will receive an immediate confirmation from <strong>{org.email}</strong>.
              </p>
              <Link href="/courses" className="btn btn-green" style={{ textDecoration: "none" }}>
                Browse All 19 Courses →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Connected Learning Ecosystem Hub */}
      <section style={{ padding: "24px 0 36px" }}>
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <span className="eyebrow" style={{ fontSize: 11 }}>Connected Learning Ecosystem</span>
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.45rem", color: "var(--ink)", marginTop: 4 }}>
              Live study vault, orientation slides, Notion hub &amp; admissions tracker
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>
              Your account is connected to our live workspace across Google Slides, Dropbox, Notion, Google Sheets, and Supabase.
            </p>
          </div>

          <div className="grid-4" style={{ marginBottom: 24 }}>
            {CONNECTED_RESOURCES.map((res) => (
              <div key={res.id} className="card card-hover" style={{ padding: "24px 22px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="pill pill-soft pill-sm" style={{ fontSize: 11, fontWeight: 700 }}>
                    {res.badge}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--green-deep)", fontWeight: 700 }}>● Live</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", color: "var(--ink)", marginBottom: 8 }}>
                  {res.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                  {res.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-navy btn-sm"
                    style={{ textDecoration: "none", fontSize: 12.5, textAlign: "center" }}
                  >
                    {res.action_label} →
                  </a>
                  {res.curriculum_url && (
                    <a
                      href={res.curriculum_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ textDecoration: "none", fontSize: 12, textAlign: "center" }}
                    >
                      19-Course Curriculum Doc →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Embedded Google Slides Orientation Deck */}
          {slidesRes?.embed_url && (
            <div className="card" style={{ padding: "24px 26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: showSlidesEmbed ? 16 : 0 }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: 11 }}>Interactive Orientation Presentation</span>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.15rem", color: "var(--ink)", marginTop: 4 }}>
                    {slidesRes.title}
                  </h3>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowSlidesEmbed(!showSlidesEmbed)}
                    className="btn btn-outline btn-sm"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    {showSlidesEmbed ? "Hide Presentation" : "Show Presentation"}
                  </button>
                  <a
                    href={slidesRes.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-green btn-sm"
                    style={{ textDecoration: "none", fontSize: 12 }}
                  >
                    Open in Google Slides →
                  </a>
                </div>
              </div>

              {showSlidesEmbed && (
                <div style={{ position: "relative", width: "100%", paddingTop: "52%", borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)", background: "#0f172a" }}>
                  <iframe
                    src={slidesRes.embed_url}
                    title="CHRISCO Digital Academy Learner Orientation & 19-Course Track Guide"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Official Inbox from chriscoyouthaflame2025@gmail.com */}
      <section style={{ padding: "12px 0 40px" }}>
        <div className="container">
          <div className="card" style={{ padding: "28px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
              <div>
                <span className="eyebrow" style={{ fontSize: 11 }}>Official Academy Communications</span>
                <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.3rem", color: "var(--ink)", marginTop: 4 }}>
                  Automated Responses &amp; Receipts from {org.email}
                </h2>
              </div>
              <span className="pill pill-soft pill-sm" style={{ fontSize: 11.5 }}>
                Sender: {org.email}
              </span>
            </div>

            {notifications.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 14 }}>
                Your automated confirmations from <strong>{org.email}</strong> will appear here whenever you sign up, enrol in a course, or send us a message.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {notifications.slice(0, 6).map((item, idx) => {
                  const isOpen = selectedNotification === (item.reference_code || idx)
                  return (
                    <div
                      key={item.reference_code || idx}
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: 14,
                        padding: "16px 18px",
                        background: isOpen ? "#F4F6F4" : "#fff",
                      }}
                    >
                      <div
                        onClick={() =>
                          setSelectedNotification(isOpen ? null : item.reference_code || idx)
                        }
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          flexWrap: "wrap",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "var(--green-deep)", textTransform: "uppercase" }}>
                              ✓ Sent from {item.from || org.email}
                            </span>
                            {item.reference_code && (
                              <span style={{ fontSize: 11, fontFamily: "monospace", background: "rgba(0,35,51,0.08)", padding: "2px 7px", borderRadius: 5, fontWeight: 700 }}>
                                {item.reference_code}
                              </span>
                            )}
                          </div>
                          <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5, marginTop: 4 }}>
                            {item.subject}
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: "var(--green-deep)", fontWeight: 700 }}>
                          {isOpen ? "Hide receipt ▲" : "Read receipt ▼"}
                        </span>
                      </div>

                      {isOpen && (
                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: "1px solid var(--line)",
                            whiteSpace: "pre-line",
                            fontSize: 13.5,
                            lineHeight: 1.65,
                            color: "var(--ink)",
                          }}
                        >
                          {item.body}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Account */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div style={{ background: "var(--navy)", borderRadius: "var(--radius-lg)", padding: "32px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: "1.15rem", marginBottom: 4 }}>Account settings</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                {user?.email} · Connected to {CONNECTED_APPS_SUMMARY.length} active integrations
              </p>
            </div>
            <button onClick={logout} className="btn btn-outline-light btn-sm" style={{ cursor: "pointer" }}>
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      {activeCertificate && (
        <div className="overlay" onClick={() => setActiveCertificate(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640, padding: "36px 32px", textAlign: "center", border: "4px double var(--green-deep)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--green-deep)", marginBottom: 8 }}>
              {org.umbrella}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--navy)", textTransform: "uppercase", marginBottom: 6 }}>
              {org.academy}
            </h2>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 24 }}>
              Certificate of Practical Completion · {org.programme}
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>This certifies that</p>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--ink)", borderBottom: "2px solid var(--line)", display: "inline-block", padding: "0 24px 8px", marginBottom: 18 }}>
              {activeCertificate.studentName}
            </div>
            <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 20px" }}>
              has completed all syllabus modules and practical requirements for the course{" "}
              <strong style={{ color: "var(--navy)" }}>{activeCertificate.courseTitle}</strong>.
            </p>
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16, fontSize: 12.5, color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: 18, marginBottom: 24 }}>
              <div>
                <strong>Issued:</strong> {activeCertificate.date}
              </div>
              <div>
                <strong>Certificate ID:</strong> <code>{activeCertificate.code}</code>
              </div>
              <div>
                <strong>Verified By:</strong> {org.email}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => typeof window !== "undefined" && window.print()}
                className="btn btn-green btn-sm"
                style={{ cursor: "pointer" }}
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setActiveCertificate(null)}
                className="btn btn-navy btn-sm"
                style={{ cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
