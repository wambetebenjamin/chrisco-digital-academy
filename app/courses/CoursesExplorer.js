"use client"
import { useState, useMemo } from "react"
import emailjs from "@emailjs/browser"
import Image from "next/image"
import Icon from "../components/Icon"
import { useGamification } from "../GamificationContext"
import { courses, categories, categoryCounts } from "../data/courses"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

const levels = ["All", "Beginner", "Intermediate"]
const cardColors = ["lime", "purple", "pink", "yellow"]

export default function CoursesExplorer() {
  const [selected, setSelected] = useState(null)
  const [enrolling, setEnrolling] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [category, setCategory] = useState("All")
  const [level, setLevel] = useState("All")
  const [search, setSearch] = useState("")
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [activeLesson, setActiveLesson] = useState(0)
  const [noteText, setNoteText] = useState("")
  const [noteSaved, setNoteSaved] = useState(false)
  const [startedCourses, setStartedCourses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chrisco_started_popups") || "{}")
    } catch {
      return {}
    }
  })

  const {
    trackCourseStart,
    trackLessonComplete,
    startedCourses: gamStartedCourses,
    toggleBookmark,
    bookmarkedCourses = [],
    saveLessonNote,
    lessonNotes = {},
  } = useGamification()

  const counts = categoryCounts()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return courses.filter((c) => {
      const catOk = category === "All" || c.category === category
      const levelOk = level === "All" || c.level === level
      const searchOk =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.syllabus || []).some((s) => s.toLowerCase().includes(q))
      const bookmarkOk = !showBookmarksOnly || (bookmarkedCourses || []).includes(String(c.id))
      return catOk && levelOk && searchOk && bookmarkOk
    })
  }, [category, level, search, showBookmarksOnly, bookmarkedCourses])

  async function handleEnroll(course) {
    if (!form.name || !form.phone) return
    setSending(true)
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,
          message: `Enrollment Request for: ${course.title}\nLevel: ${course.level}\nDuration: ${course.duration}`,
        },
        PUBLIC_KEY,
      )
      setSent(true)
      setForm({ name: "", email: "", phone: "" })
    } catch {
      alert("Failed to send. Please email chriscoyouthaflame2025@gmail.com directly.")
    }
    setSending(false)
  }

  function handleDownload(course) {
    if (course.download) window.open(course.download, "_blank")
  }

  function openCourse(course) {
    setSelected(course)
    setEnrolling(null)
    setSent(false)
    setNoteSaved(false)
    const prog = getCourseProgress(course.id)
    const idx = Math.min(prog.lessonsCompleted, course.syllabus.length - 1)
    setActiveLesson(idx)
    const noteKey = `${String(course.id)}:${idx}`
    setNoteText(lessonNotes[noteKey] || "")
    if (!startedCourses[course.id]) {
      trackCourseStart(course.id, course.title)
      const next = { ...startedCourses, [course.id]: true }
      setStartedCourses(next)
      try {
        localStorage.setItem("chrisco_started_popups", JSON.stringify(next))
      } catch {}
    }
  }

  function getCourseProgress(courseId) {
    const key = String(courseId)
    const g = gamStartedCourses?.[key]
    return {
      lessonsCompleted: g?.lessonsCompleted || 0,
      progress: g?.progress || 0,
    }
  }

  function markLessonDone(course, lessonIdx) {
    const { lessonsCompleted } = getCourseProgress(course.id)
    if (lessonIdx < lessonsCompleted) return
    trackLessonComplete(course.id, 1)
    if (lessonIdx + 1 < course.syllabus.length) {
      const nextIdx = lessonIdx + 1
      setActiveLesson(nextIdx)
      const noteKey = `${String(course.id)}:${nextIdx}`
      setNoteText(lessonNotes[noteKey] || "")
      setNoteSaved(false)
    }
  }

  function selectLesson(course, idx) {
    setActiveLesson(idx)
    const noteKey = `${String(course.id)}:${idx}`
    setNoteText(lessonNotes[noteKey] || "")
    setNoteSaved(false)
  }

  function handleSaveNote(course, idx) {
    saveLessonNote(course.id, idx, noteText)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 1800)
  }

  function clearFilters() {
    setCategory("All")
    setLevel("All")
    setSearch("")
    setShowBookmarksOnly(false)
  }

  return (
    <>
      <section className="band-cream" style={{ padding: "32px 0 96px" }}>
        <div className="container">
          <div className="grid-sidebar" style={{ display: "grid", gap: 36, gridTemplateColumns: "1fr" }}>
            <aside>
              <div className="card" style={{ padding: "26px 22px", position: "sticky", top: 92, background: "#fff" }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
                  Categories
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    onClick={() => setCategory("All")}
                    className={`pill ${category === "All" ? "pill-lime" : ""}`}
                    style={{ width: "100%", justifyContent: "space-between", background: category === "All" ? "var(--lime)" : "#fff", borderColor: "var(--ink)", color: "var(--ink)", padding: "10px 14px" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon name="grid" size={14} /> All Courses
                    </span>
                    <span style={{ fontWeight: 800 }}>{courses.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const active = category === cat.name
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className={`pill ${active ? "pill-purple" : ""}`}
                        style={{ width: "100%", justifyContent: "space-between", background: active ? "var(--purple)" : "#fff", borderColor: "var(--ink)", color: active ? "#fff" : "var(--ink)", padding: "10px 14px" }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <Icon name={cat.icon} size={14} /> {cat.name}
                        </span>
                        <span style={{ fontWeight: 800 }}>{counts[cat.name] || 0}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="divider" style={{ margin: "22px 0" }} />

                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
                  Level
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {levels.map((lv, i) => (
                    <button
                      key={lv}
                      onClick={() => setLevel(lv)}
                      className="pill"
                      style={{
                        background: level === lv ? ["var(--lime)", "var(--pink)", "var(--yellow)"][i] || "var(--lime)" : "#fff",
                        borderColor: "var(--ink)",
                        color: "var(--ink)",
                        cursor: "pointer",
                      }}
                    >
                      {lv}
                    </button>
                  ))}
                </div>

                <div className="card purple" style={{ marginTop: 24, padding: "20px 18px", color: "#fff" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", lineHeight: 1.15, marginBottom: 8 }}>
                    Not sure where to start?
                  </div>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", margin: "0 0 14px" }}>
                    WhatsApp us and we will match you with the right course for your goals.
                  </p>
                  <a href="https://wa.me/254112272061" className="btn btn-lime btn-sm" style={{ textDecoration: "none", width: "100%" }}>
                    <Icon name="whatsapp" size={15} /> WhatsApp Us
                  </a>
                </div>
              </div>
            </aside>

            <div>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                  <Icon name="search" size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search courses, topics or keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 46 }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: 8, background: "var(--paper-2)", border: "2px solid var(--ink)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14 }}>
                  Showing <strong style={{ color: "var(--ink)" }}>{filtered.length}</strong> of {courses.length} courses
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setShowBookmarksOnly((v) => !v)}
                    className={`pill ${showBookmarksOnly ? "pill-lime" : ""}`}
                    style={{ cursor: "pointer", background: showBookmarksOnly ? "var(--lime)" : "#fff" }}
                  >
                    <Icon name="heart" size={12} /> {showBookmarksOnly ? "Bookmarked" : "Show bookmarks"}
                  </button>
                  {(category !== "All" || level !== "All" || search || showBookmarksOnly) && (
                    <button onClick={clearFilters} className="sticker pink" style={{ cursor: "pointer" }}>
                      <Icon name="x" size={12} strokeWidth={2.4} /> Clear filters
                    </button>
                  )}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="card" style={{ padding: "60px 40px", textAlign: "center", background: "#fff" }}>
                  <span style={{ display: "inline-flex", width: 80, height: 80, borderRadius: 22, background: "var(--pink)", color: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 18, border: "3px solid var(--ink)", boxShadow: "6px 6px 0 0 var(--ink)" }}>
                    <Icon name="search" size={36} strokeWidth={1.8} />
                  </span>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>No courses match those filters</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>Try a different category, level or search term.</p>
                  <button onClick={clearFilters} className="btn btn-purple btn-sm" style={{ cursor: "pointer" }}>
                    Show all courses
                  </button>
                </div>
              ) : (
                <div className="course-grid" style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr" }}>
                  {filtered.map((course, i) => {
                    const colorCard = cardColors[i % cardColors.length]
                    const isBookmarked = (bookmarkedCourses || []).includes(String(course.id))
                    return (
                      <div
                        key={course.id}
                        className="card card-hover"
                        style={{ overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", padding: 0, animation: `fadeUp 0.5s ease ${i * 0.05}s both` }}
                        onClick={() => openCourse(course)}
                      >
                        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/10", borderBottom: "3px solid var(--ink)" }}>
                          <Image src={course.img} alt="" fill sizes="(min-width: 1200px) 380px, (min-width: 768px) 45vw, 92vw" style={{ objectFit: "cover" }} />
                          <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${course.color[0]}C8, ${course.color[1]}9C)` }} />
                          <span className={`sticker ${colorCard}`} style={{ position: "absolute", top: 14, right: 14, fontSize: 10 }}>{course.category}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(course.id)
                            }}
                            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark course"}
                            style={{
                              position: "absolute",
                              top: 14,
                              left: 14,
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              background: isBookmarked ? "var(--pink)" : "#fff",
                              color: isBookmarked ? "#fff" : "var(--ink)",
                              border: "2.5px solid var(--ink)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "3px 3px 0 0 var(--ink)",
                            }}
                          >
                            <Icon name="heart" size={16} />
                          </button>
                          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "absolute", bottom: 16, left: 18 }}>
                            <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(255,255,255,0.2)", border: "2.5px solid #fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 0 var(--ink)" }}>
                              <Icon name={course.icon} size={26} strokeWidth={1.8} />
                            </div>
                            <span className="sticker white" style={{ fontSize: 10 }}>{course.level}</span>
                          </div>
                        </div>

                        <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1, background: "#fff" }}>
                          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>{course.title}</h3>
                          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{course.desc}</p>
                          <div className="progress" style={{ height: 12, marginBottom: 14 }}>
                            <span style={{ width: `${getCourseProgress(course.id).progress}%` }} />
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                            <span className="sticker lime" style={{ fontSize: 10 }}><Icon name="clock" size={11} strokeWidth={2.4} /> {course.duration}</span>
                            <span className="sticker yellow" style={{ fontSize: 10 }}><Icon name="star" size={11} strokeWidth={2.4} /> {course.rating}</span>
                            <span className="sticker white" style={{ fontSize: 10 }}><Icon name="users" size={11} strokeWidth={2.4} /> {course.students}</span>
                          </div>
                          <div style={{ display: "flex", gap: 10 }}>
                            <button className="btn btn-purple btn-sm" style={{ flex: 1, cursor: "pointer", fontSize: 13 }}>
                              View Course
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDownload(course) }}
                              className="btn btn-sm"
                              title="Download course details"
                              aria-label={`Download ${course.title} details`}
                              style={{ cursor: "pointer", padding: "10px 14px" }}
                            >
                              <Icon name="download" size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ border: "3px solid var(--ink)", borderRadius: 24 }}>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/8", borderBottom: "3px solid var(--ink)" }}>
              <Image src={selected.img} alt="" fill sizes="(min-width: 640px) 600px, 92vw" style={{ objectFit: "cover" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${selected.color[0]}D8, ${selected.color[1]}9C)` }} />
              <span className="sticker white" style={{ position: "absolute", top: 18, right: 18, fontSize: 10 }}>{selected.category}</span>
              <button
                onClick={() => { toggleBookmark(selected.id) }}
                aria-label="Bookmark"
                style={{
                  position: "absolute",
                  top: 14,
                  right: 90,
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: (bookmarkedCourses || []).includes(String(selected.id)) ? "var(--pink)" : "#fff",
                  color: (bookmarkedCourses || []).includes(String(selected.id)) ? "#fff" : "var(--ink)",
                  border: "2.5px solid var(--ink)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "3px 3px 0 0 var(--ink)",
                }}
              >
                <Icon name="heart" size={16} />
              </button>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                style={{ position: "absolute", top: 14, left: 14, width: 38, height: 38, borderRadius: 12, background: "#fff", border: "2.5px solid var(--ink)", color: "var(--ink)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 0 var(--ink)" }}
              >
                <Icon name="x" size={16} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 18, position: "absolute", bottom: 22, left: 24, right: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.2)", border: "2.5px solid #fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "3px 3px 0 0 var(--ink)" }}>
                  <Icon name={selected.icon} size={32} strokeWidth={1.6} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", textShadow: "2px 2px 0 rgba(0,0,0,0.2)" }}>{selected.title}</h2>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    <span className="sticker lime" style={{ fontSize: 10 }}>{selected.level}</span>
                    <span className="sticker yellow" style={{ fontSize: 10 }}><Icon name="clock" size={10} strokeWidth={2.4} /> {selected.duration}</span>
                    <span className="sticker pink" style={{ fontSize: 10 }}><Icon name="star" size={10} strokeWidth={2.4} /> {selected.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "28px 28px 32px" }}>
              <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 22, fontSize: 14.5 }}>{selected.desc}</p>

              {!enrolling && !sent && (() => {
                const prog = getCourseProgress(selected.id)
                const doneCount = prog.lessonsCompleted
                const currentIdx = activeLesson != null ? activeLesson : Math.min(doneCount, selected.syllabus.length - 1)
                const currentLesson = selected.syllabus[currentIdx]
                const isDone = currentIdx < doneCount
                const noteKey = `${String(selected.id)}:${currentIdx}`
                return (
                  <>
                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.05rem", marginBottom: 8, color: "var(--ink)", display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--purple)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--ink)" }}>
                        <Icon name="play" size={14} strokeWidth={2.2} />
                      </span>
                      Lesson Viewer
                    </h3>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                        <span>{doneCount} / {selected.syllabus.length} lessons</span>
                        <span>{prog.progress}% complete</span>
                      </div>
                      <div className="progress" style={{ height: 12 }}>
                        <span style={{ width: `${prog.progress}%` }} />
                      </div>
                    </div>

                    <div className="card" style={{ background: selected.color[0], padding: 0, marginBottom: 14, overflow: "hidden", boxShadow: "var(--shadow-chunk-sm)" }}>
                      <div style={{ position: "relative", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${selected.color[0]}dd, ${selected.color[1]}aa)` }} />
                        <button
                          onClick={() => markLessonDone(selected, currentIdx)}
                          disabled={isDone}
                          style={{
                            position: "relative",
                            width: 72, height: 72, borderRadius: "50%",
                            background: isDone ? "var(--lime)" : "#fff",
                            color: "var(--ink)",
                            border: "4px solid var(--ink)",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            cursor: isDone ? "default" : "pointer",
                            boxShadow: "4px 4px 0 0 var(--ink)",
                          }}
                          title={isDone ? "Completed" : "Mark lesson watched"}
                        >
                          <Icon name={isDone ? "check" : "play"} size={32} strokeWidth={isDone ? 3 : 2} />
                        </button>
                        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>
                          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.9 }}>
                            Lesson {currentIdx + 1} · 3 to 5 min
                          </div>
                          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.2, marginTop: 2 }}>
                            {currentLesson}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                      <button
                        onClick={() => selectLesson(selected, Math.max(0, currentIdx - 1))}
                        disabled={currentIdx === 0}
                        className="btn btn-sm"
                        style={{ cursor: currentIdx === 0 ? "not-allowed" : "pointer", opacity: currentIdx === 0 ? 0.5 : 1, padding: "10px 14px", fontSize: 12 }}
                      >
                        <Icon name="chevron-left" size={14} /> Prev
                      </button>
                      <button
                        onClick={() => markLessonDone(selected, currentIdx)}
                        disabled={isDone}
                        className="btn btn-lime btn-sm"
                        style={{ flex: 1, cursor: isDone ? "default" : "pointer", fontSize: 12, opacity: isDone ? 0.7 : 1 }}
                      >
                        <Icon name={isDone ? "checkCircle" : "check"} size={14} /> {isDone ? "Lesson completed" : "Mark as done (+20 XP)"}
                      </button>
                      <button
                        onClick={() => selectLesson(selected, Math.min(selected.syllabus.length - 1, currentIdx + 1))}
                        disabled={currentIdx === selected.syllabus.length - 1}
                        className="btn btn-sm"
                        style={{ cursor: currentIdx === selected.syllabus.length - 1 ? "not-allowed" : "pointer", opacity: currentIdx === selected.syllabus.length - 1 ? 0.5 : 1, padding: "10px 14px", fontSize: 12 }}
                      >
                        Next <Icon name="chevron-right" size={14} />
                      </button>
                    </div>

                    <div className="card" style={{ background: "var(--paper-2)", padding: 14, marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <Icon name="pen" size={12} /> My Notes
                        </div>
                        {noteSaved && <span style={{ fontSize: 11, fontWeight: 800, color: "var(--purple)" }}>Saved</span>}
                      </div>
                      <textarea
                        value={noteText}
                        onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false) }}
                        placeholder="Jot down key takeaways from this lesson..."
                        style={{
                          width: "100%",
                          minHeight: 80,
                          padding: "10px 12px",
                          border: "2.5px solid var(--ink)",
                          borderRadius: 12,
                          background: "#fff",
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          resize: "vertical",
                          outline: "none",
                          boxShadow: "3px 3px 0 0 var(--ink)",
                        }}
                      />
                      <button onClick={() => handleSaveNote(selected, currentIdx)} className="btn btn-purple btn-sm" style={{ marginTop: 8, cursor: "pointer", fontSize: 11 }}>
                        <Icon name="save" size={12} /> Save note
                      </button>
                    </div>

                    <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "0.95rem", marginBottom: 10, color: "var(--ink)" }}>
                      Chapters
                    </h4>
                    <div className="card" style={{ background: "var(--paper-2)", padding: "4px 16px", marginBottom: 18, boxShadow: "3px 3px 0 0 var(--ink)" }}>
                      {selected.syllabus.map((item, i) => {
                        const chapterDone = i < doneCount
                        const isCurrent = i === currentIdx
                        const hasNote = !!((lessonNotes[`${String(selected.id)}:${i}`] || "").trim())
                        return (
                          <button
                            key={i}
                            onClick={() => selectLesson(selected, i)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "12px 0",
                              width: "100%",
                              background: "transparent",
                              border: "none",
                              borderBottom: i < selected.syllabus.length - 1 ? "2px dashed var(--ink)" : "none",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <span
                              style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: chapterDone ? "var(--lime)" : isCurrent ? "var(--purple)" : "var(--ink)",
                                color: chapterDone || isCurrent ? "var(--ink)" : "var(--lime)",
                                fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 11,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, border: "2px solid var(--ink)",
                              }}
                            >
                              {chapterDone ? <Icon name="check" size={14} strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                color: isCurrent ? "var(--purple)" : "var(--ink)",
                                fontSize: 14,
                                lineHeight: 1.4,
                                fontWeight: isCurrent ? 800 : 600,
                                textDecoration: chapterDone ? "line-through" : "none",
                                opacity: chapterDone ? 0.6 : 1,
                              }}>
                                {item}
                              </p>
                            </div>
                            {hasNote && (
                              <span title="You have notes here" style={{ width: 24, height: 24, borderRadius: 6, background: "var(--yellow)", border: "2px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon name="pen" size={11} />
                              </span>
                            )}
                            {isCurrent && <span className="sticker purple" style={{ fontSize: 9 }}>Now</span>}
                          </button>
                        )
                      })}
                    </div>

                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.05rem", marginBottom: 10, color: "var(--ink)", display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--pink)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--ink)" }}>
                        <Icon name="target" size={14} strokeWidth={2.2} />
                      </span>
                      Who is this for
                    </h3>
                    <div className="card lime" style={{ padding: "16px 18px", marginBottom: 20 }}>
                      <p style={{ color: "var(--ink)", fontSize: 14, lineHeight: 1.6, fontWeight: 600 }}>{selected.for}</p>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={() => setEnrolling(selected)} className="btn btn-lime" style={{ flex: 1, cursor: "pointer" }}>
                        <Icon name="rocket" size={16} /> Enroll Now
                      </button>
                      <button onClick={() => handleDownload(selected)} className="btn btn-purple" title="Download course details" aria-label="Download course details" style={{ cursor: "pointer" }}>
                        <Icon name="download" size={16} />
                      </button>
                      <button onClick={() => setSelected(null)} aria-label="Close" className="btn" style={{ cursor: "pointer" }}>
                        Close
                      </button>
                    </div>
                  </>
                )
              })()}

              {enrolling && !sent && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.1rem", color: "var(--ink)", marginBottom: 18, display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--lime)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--ink)" }}>
                      <Icon name="pen" size={14} strokeWidth={2.2} />
                    </span>
                    Enroll in {enrolling.title}
                  </h3>
                  <div className="field">
                    <label>Full name</label>
                    <input className="input" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Phone/WhatsApp</label>
                    <input className="input" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    <button onClick={() => handleEnroll(enrolling)} disabled={sending} className="btn btn-lime" style={{ flex: 1, cursor: "pointer" }}>
                      {sending ? "Sending..." : <><Icon name="send" size={14} /> Submit Enrollment</>}
                    </button>
                    <button onClick={() => setEnrolling(null)} className="btn" style={{ cursor: "pointer" }}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {sent && (
                <div className="card lime" style={{ textAlign: "center", padding: "36px 24px" }}>
                  <span style={{ display: "inline-flex", width: 72, height: 72, borderRadius: 22, background: "#fff", color: "var(--ink)", alignItems: "center", justifyContent: "center", marginBottom: 14, border: "3px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)" }}>
                    <Icon name="checkCircle" size={38} strokeWidth={1.6} />
                  </span>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>
                    Enrollment sent.
                  </h3>
                  <p style={{ color: "var(--ink)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                    Our team will contact you soon on WhatsApp or email. Karibu to CHRISCO Digital Academy.
                  </p>
                  <button onClick={() => setSelected(null)} className="btn btn-ink" style={{ cursor: "pointer" }}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 1024px) {
          .grid-sidebar { grid-template-columns: 280px 1fr !important; gap: 36px !important; }
        }
        @media (min-width: 768px) {
          .course-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1200px) {
          .course-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
