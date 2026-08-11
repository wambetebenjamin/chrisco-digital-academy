"use client"
import { useState } from "react"
import emailjs from "@emailjs/browser"
import Icon from "../components/Icon"
import { courses, categories, categoryCounts } from "../data/courses"

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

  const counts = categoryCounts()

  const filtered = courses.filter((c) => {
    const catOk = category === "All" || c.category === category
    const levelOk = level === "All" || c.level === level
    return catOk && levelOk
  })

  async function handleEnroll(course) {
    if (!form.name || !form.phone) return
    setSending(true)
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: `Enrollment Request for: ${course.title}\nLevel: ${course.level}\nDuration: ${course.duration}`,
      }, PUBLIC_KEY)
      setSent(true)
      setForm({ name: "", email: "", phone: "" })
    } catch {
      alert("Failed to send. Please email shambetz@gmail.com directly.")
    }
    setSending(false)
  }

  function handleDownload(course) {
    if (course.download) {
      window.open(course.download, "_blank")
    }
  }

  function openCourse(course) {
    setSelected(course)
    setEnrolling(null)
    setSent(false)
  }

  function clearFilters() {
    setCategory("All")
    setLevel("All")
  }

  return (
    <>
      {/* BODY */}
      <section style={{ padding: "0 0 96px" }}>
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
                  top: 92,
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
                      {/* Header */}
                      <div style={{ background: `linear-gradient(135deg, ${course.color[0]}, ${course.color[1]})`, padding: "26px 26px", position: "relative" }}>
                        <span
                          className="pill pill-sm"
                          style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.94)", border: "none", color: "var(--ink)" }}
                        >
                          {course.category}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8 }}>{course.title}</h3>
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
                            title="Download course details"
                            aria-label={`Download ${course.title} details`}
                            style={{ cursor: "pointer", padding: "10px 16px" }}
                          >
                            <Icon name="download" size={16} />
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

      {/* MODAL */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${selected.color[0]}, ${selected.color[1]})`, padding: "32px 32px 28px", position: "relative", overflow: "hidden" }}>
              <span
                className="pill pill-sm"
                style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.94)", border: "none", color: "var(--ink)" }}
              >
                {selected.category}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
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

              {/* Syllabus */}
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", marginBottom: 12, color: "var(--ink)", display: "flex", alignItems: "center", gap: 9 }}>
                <Icon name="clipboard" size={18} style={{ color: "var(--green-deep)" }} /> Course Syllabus
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

              {/* Who for */}
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", marginBottom: 10, color: "var(--ink)", display: "flex", alignItems: "center", gap: 9 }}>
                <Icon name="target" size={18} style={{ color: "var(--green-deep)" }} /> Who Is This For?
              </h3>
              <div style={{ background: "var(--green-tint)", borderRadius: 14, padding: "16px 18px", marginBottom: 26 }}>
                <p style={{ color: "var(--green-deep)", fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{selected.for}</p>
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
                    title="Download course details"
                    aria-label="Download course details"
                    style={{ cursor: "pointer", padding: "14px 18px" }}
                  >
                    <Icon name="download" size={17} />
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
                  <div className="field">
                    <label>Full name *</label>
                    <input className="input" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Phone / WhatsApp *</label>
                    <input className="input" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
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
                <div style={{ textAlign: "center", background: "var(--green-tint)", border: "1.5px solid rgba(0,255,132,0.6)", borderRadius: 20, padding: "40px 24px" }}>
                  <span style={{ display: "inline-flex", width: 72, height: 72, borderRadius: "50%", background: "#fff", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "var(--shadow-sm)" }}>
                    <Icon name="checkCircle" size={38} strokeWidth={1.6} />
                  </span>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.3rem", fontWeight: 800, color: "var(--green-deep)", marginBottom: 8 }}>
                    Enrollment Sent!
                  </h3>
                  <p style={{ color: "var(--green-deep)", fontSize: 14, marginBottom: 20 }}>
                    Wambete will contact you soon on WhatsApp or Email. Welcome to CHRISCO Digital Academy!
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
