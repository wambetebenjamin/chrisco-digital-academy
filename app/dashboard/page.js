"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"
import { useAuth } from "../AuthProvider"
import { courses, categories } from "../data/courses"
import { christianBooks, learningBooks, allBooks } from "../data/booksCatalogue"
import ShareBookBar from "../components/ShareBookBar"
import { org } from "../data/org"
import { CONNECTED_RESOURCES, CONNECTED_APPS_SUMMARY } from "../data/connectedResources"
import { submitAcademyIntake } from "../lib/intakeClient"

export default function Dashboard() {
  const {
    user,
    profile,
    logout,
    getEnrollments,
    enrollCourse,
    updateCourseProgress,
    savedBooks = [],
    toggleSavedBook,
    isBookSaved,
  } = useAuth()

  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [quickCourseTitle, setQuickCourseTitle] = useState(courses[0]?.title || "")
  const [enrollingQuick, setEnrollingQuick] = useState(false)
  const [activeCertificate, setActiveCertificate] = useState(null)
  const [showSlidesEmbed, setShowSlidesEmbed] = useState(true)
  const [bookSearch, setBookSearch] = useState("")
  const [bookCategory, setBookCategory] = useState("All")
  const [shareSlug, setShareSlug] = useState(null)

  const displayName =
    profile?.name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Student"

  const slidesRes = CONNECTED_RESOURCES.find((r) => r.connector === "google_slides")

  useEffect(() => {
    async function load() {
      const enrolledData = await getEnrollments()
      setEnrollments(enrolledData || [])
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
      await submitAcademyIntake({
        action: "course_application",
        name: displayName,
        email: user.email || "",
        course_title: quickCourseTitle,
        course_id: courseObj?.id,
        category: courseObj?.category,
        level: courseObj?.level,
        user_id: user.id,
        message: `Dashboard Quick Enrollment in ${quickCourseTitle}`,
      })
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
  const enrolledTitles = new Set(enrollments.map((e) => e.course_title))
  const savedBookObjects = allBooks.filter((b) => savedBooks.includes(b.slug))

  const filteredDashboardBooks = learningBooks.filter((book) => {
    const isEnrolledBook = enrolledTitles.has(book.shortTitle)
    const isSaved = savedBooks.includes(book.slug)
    const catOk =
      bookCategory === "All" ||
      (bookCategory === "Saved"
        ? isSaved
        : bookCategory === "Enrolled"
          ? isEnrolledBook
          : book.category === bookCategory)
    const q = bookSearch.trim().toLowerCase()
    const qOk =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q) ||
      (book.subtitle || "").toLowerCase().includes(q)
    return catOk && qOk
  })

  const stats = [
    { icon: "book", label: "Books Unlocked", value: "20 PDFs" },
    { icon: "checkCircle", label: "Courses Enrolled", value: loading ? "..." : enrollments.length },
    { icon: "trophy", label: "Certificates Earned", value: loading ? "..." : String(completedCount) },
    { icon: "flame", label: "Learning Progress", value: "Active" },
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
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <a href="#books" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
                  <Icon name="download" size={15} /> My Books &amp; PDF Downloads (20)
                </a>
                <Link href="/library" className="btn btn-outline-light btn-sm" style={{ textDecoration: "none" }}>
                  Browse Public Library →
                </Link>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "14px 20px" }}>
              <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--cta-primary)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.1rem", flexShrink: 0 }}>
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

      {/* Stats — Poster 4-Item Info Bar (Red, Blue, Green, Orange) */}
      <section style={{ marginTop: -44, padding: "0 0 16px", position: "relative", zIndex: 2 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {stats.map((stat, i) => {
              const sColors = ["#E60914", "#084EC8", "#38A128", "#EE6816"]
              const sc = sColors[i % sColors.length]
              return (
                <div
                  key={i}
                  style={{
                    padding: "20px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    borderRight: i < stats.length - 1 ? "1px solid var(--line)" : "none",
                    borderTop: `4px solid ${sc}`,
                  }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: sc,
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={stat.icon} size={22} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", color: sc }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--body)", fontWeight: 700 }}>{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
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
              <Link href="/studio" className="btn btn-navy btn-sm" style={{ textDecoration: "none" }}>
                AI Studio →
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
                          background: "linear-gradient(90deg, var(--green-deep), var(--cta-primary))",
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
                          <Icon name="award" size={14} /> View Certificate
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
                Pick any of our 19 practical digital skills courses using the quick selector above or browse the full catalogue.
              </p>
              <Link href="/courses" className="btn btn-green" style={{ textDecoration: "none" }}>
                Browse All 19 Courses →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================
          MY DIGITAL LIBRARY & E-BOOK DOWNLOADS VAULT (CHRISTIAN + 19 COURSES)
          ================================================================= */}
      <section id="books" className="section-frost" style={{ padding: "44px 0 48px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
            <div>
              <span className="eyebrow" style={{ fontSize: 11 }}>Digital Library</span>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.55rem", color: "var(--ink)", marginTop: 4 }}>
                Your Christian Books &amp; 19 Course Handbooks
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6, maxWidth: 620 }}>
                Download and save Christian books and course handbooks anytime.
              </p>
            </div>
            <Link href="/library" className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>
              Open Full Library View →
            </Link>
          </div>

          {/* Saved Books Reading List (shown whenever the user has saved books) */}
          {savedBookObjects.length > 0 && (
            <div
              className="card"
              style={{
                padding: "22px 24px",
                marginBottom: 26,
                borderLeft: "4px solid var(--green-deep)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Icon name="bookmark" size={18} style={{ color: "var(--green-deep)" }} />
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.1rem", color: "var(--ink)" }}>
                    Saved Books ({savedBookObjects.length})
                  </h3>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                {savedBookObjects.map((b) => (
                  <div
                    key={b.slug}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "var(--layer-1)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <div style={{ width: 46, height: 64, position: "relative", borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                      <Image src={b.coverImage} alt={b.title} fill sizes="56px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)", lineHeight: 1.25 }}>
                        {b.shortTitle || b.title}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                        <a
                          href={b.downloadPath}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 12, fontWeight: 700, color: "var(--green-deep)", textDecoration: "none" }}
                        >
                          Download PDF ↓
                        </a>
                        <button
                          type="button"
                          onClick={() => toggleSavedBook?.(b.slug)}
                          style={{
                            fontSize: 11.5,
                            color: "var(--muted)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Christian & Faith Shelf inside Dashboard */}
          <div
            style={{
              background: "linear-gradient(135deg, #010C80 0%, #0A1854 70%, #162266 100%)",
              borderRadius: 22,
              padding: "26px 26px",
              color: "#fff",
              marginBottom: 32,
              boxShadow: "0 16px 40px rgba(1,12,128,0.16)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
              <div>
                <span
                  className="pill pill-sm"
                  style={{ background: "#FA3F26", color: "#fff", border: "none", marginBottom: 8 }}
                >
                  CHRISCO Youth Aflame
                </span>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.25rem", color: "#fff" }}>
                  Christian Books
                </h3>
              </div>
            </div>

            {christianBooks.map((book) => (
              <div
                key={book.slug}
                style={{
                  background: "rgba(255,255,255,0.97)",
                  color: "var(--ink)",
                  borderRadius: 18,
                  padding: "22px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 22,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      width: 155,
                      height: 220,
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 14px 30px rgba(1,12,128,0.22)",
                    }}
                  >
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      sizes="180px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <span className="pill pill-soft pill-sm">{book.category}</span>
                    <span className="pill pill-soft pill-sm">{book.pages} Pages</span>
                    <span className="pill pill-soft pill-sm">{book.illustrations} Visual Diagrams</span>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.25rem", color: "#010C80", lineHeight: 1.25 }}>
                    {book.title}
                  </h4>
                  <p style={{ color: "var(--body)", fontSize: 13.8, lineHeight: 1.65, margin: "8px 0 16px" }}>
                    {book.desc}
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a
                      href={book.downloadPath}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm"
                      style={{
                        background: "#FA3F26",
                        color: "#fff",
                        border: "none",
                        textDecoration: "none",
                      }}
                    >
                      <Icon name="download" size={15} /> Download 28-Page Christian E-Book (PDF)
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleSavedBook?.(book.slug)}
                      className="btn btn-outline btn-sm"
                      style={{
                        cursor: "pointer",
                        background: isBookSaved?.(book.slug) ? "var(--green-tint)" : "#fff",
                        color: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--ink)",
                        borderColor: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--line-strong)",
                      }}
                    >
                      <Icon name="bookmark" size={14} />
                      {isBookSaved?.(book.slug) ? "Saved" : "Save"}
                    </button>
                    <Link href={book.sharePath} className="btn btn-navy btn-sm" style={{ textDecoration: "none" }}>
                      Book Page →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShareSlug(shareSlug === book.slug ? null : book.slug)}
                      className="btn btn-outline btn-sm"
                      style={{ cursor: "pointer" }}
                    >
                      <Icon name="send" size={14} /> Share Link
                    </button>
                  </div>
                  {shareSlug === book.slug && (
                    <div style={{ marginTop: 14 }}>
                      <ShareBookBar book={book} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* All 19 Practical Course Handbooks inside Dashboard */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.2rem", color: "var(--ink)" }}>
                19 Course Learning Handbooks (28 Pages Each)
              </h3>
              <div style={{ minWidth: 250, flex: "0 1 300px" }}>
                <input
                  type="search"
                  className="input"
                  placeholder="Filter course handbooks..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  style={{ padding: "9px 14px", fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setBookCategory("All")}
                className="pill pill-sm"
                style={{
                  cursor: "pointer",
                  background: bookCategory === "All" ? "var(--navy)" : "var(--surface)",
                  color: bookCategory === "All" ? "#fff" : "var(--ink)",
                  borderColor: bookCategory === "All" ? "var(--navy)" : "var(--line-strong)",
                }}
              >
                All 19 Handbooks
              </button>
              {savedBooks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBookCategory("Saved")}
                  className="pill pill-sm"
                  style={{
                    cursor: "pointer",
                    background: bookCategory === "Saved" ? "var(--green-deep)" : "var(--surface)",
                    color: bookCategory === "Saved" ? "#fff" : "var(--ink)",
                    borderColor: bookCategory === "Saved" ? "var(--green-deep)" : "var(--line-strong)",
                  }}
                >
                  Saved ({savedBooks.filter((s) => learningBooks.some((lb) => lb.slug === s)).length})
                </button>
              )}
              {enrollments.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBookCategory("Enrolled")}
                  className="pill pill-sm"
                  style={{
                    cursor: "pointer",
                    background: bookCategory === "Enrolled" ? "var(--green-deep)" : "var(--surface)",
                    color: bookCategory === "Enrolled" ? "#fff" : "var(--ink)",
                    borderColor: bookCategory === "Enrolled" ? "var(--green-deep)" : "var(--line-strong)",
                  }}
                >
                  Enrolled Courses ({enrollments.length})
                </button>
              )}
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setBookCategory(cat.name)}
                  className="pill pill-sm"
                  style={{
                    cursor: "pointer",
                    background: bookCategory === cat.name ? "var(--navy)" : "var(--surface)",
                    color: bookCategory === cat.name ? "#fff" : "var(--ink)",
                    borderColor: bookCategory === cat.name ? "var(--navy)" : "var(--line-strong)",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
                gap: 18,
              }}
            >
              {filteredDashboardBooks.map((book) => {
                const isEnrolled = enrolledTitles.has(book.shortTitle)
                return (
                  <div
                    key={book.slug}
                    className="card"
                    style={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div
                        style={{
                          width: 68,
                          height: 96,
                          position: "relative",
                          borderRadius: 8,
                          overflow: "hidden",
                          flexShrink: 0,
                          boxShadow: "0 8px 18px rgba(20,19,59,0.16)",
                        }}
                      >
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
                          <span className="pill pill-soft pill-sm" style={{ fontSize: 10.5 }}>
                            {book.category}
                          </span>
                          {isEnrolled && (
                            <span
                              className="pill pill-sm"
                              style={{
                                fontSize: 10.5,
                                background: "var(--green-tint)",
                                color: "var(--green-deep)",
                                border: "none",
                              }}
                            >
                              Enrolled
                            </span>
                          )}
                        </div>
                        <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "0.96rem", color: "var(--ink)", lineHeight: 1.28 }}>
                          {book.shortTitle}
                        </h4>
                        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>
                          {book.pages} Pages · {book.illustrations} Diagrams
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                      <a
                        href={book.downloadPath}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-navy btn-sm"
                        style={{ flex: 1, textDecoration: "none", fontSize: 12.2 }}
                      >
                        <Icon name="download" size={14} /> Download PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => toggleSavedBook?.(book.slug)}
                        className="btn btn-outline btn-sm"
                        title={isBookSaved?.(book.slug) ? "Saved in reading list" : "Save to reading list"}
                        aria-label={isBookSaved?.(book.slug) ? `Unsave ${book.shortTitle}` : `Save ${book.shortTitle}`}
                        style={{
                          cursor: "pointer",
                          fontSize: 12.2,
                          padding: "8px 10px",
                          background: isBookSaved?.(book.slug) ? "var(--green-tint)" : "transparent",
                          color: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--ink)",
                          borderColor: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--line-strong)",
                        }}
                      >
                        <Icon name="bookmark" size={13} />
                      </button>
                      <Link
                        href={book.sharePath}
                        className="btn btn-outline btn-sm"
                        style={{ textDecoration: "none", fontSize: 12.2, padding: "8px 12px" }}
                      >
                        Share →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Connected Learning Ecosystem Hub */}
      <section style={{ padding: "24px 0 40px" }}>
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <span className="eyebrow" style={{ fontSize: 11 }}>Connected Learning Ecosystem</span>
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.45rem", color: "var(--ink)", marginTop: 4 }}>
              Live study vault, orientation slides, Notion hub &amp; admissions tracker
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>
              Access our connected study materials across Google Slides, Dropbox, Notion, and Google Sheets.
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
