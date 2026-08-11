"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import MicroQuiz from "../components/MicroQuiz"
import InteractiveCalendar from "../components/InteractiveCalendar"
import { useAuth } from "../AuthProvider"
import { useGamification } from "../GamificationContext"

// Built-in calendar events for August 2026 (demo)
const calendarEvents = [
  { day: 4, type: "class", title: "Intro to Python", time: "6:00pm" },
  { day: 7, type: "due", title: "Design brief due", time: "9:00pm" },
  { day: 12, type: "class", title: "React Basics", time: "6:00pm" },
  { day: 15, type: "event", title: "Study Lounge", time: "7:00pm" },
  { day: 19, type: "due", title: "Marketing plan", time: "11:00pm" },
  { day: 22, type: "class", title: "Video Editing", time: "5:00pm" },
  { day: 26, type: "event", title: "Career Q&A", time: "7:00pm" },
]

// Placeholder courses shown before real data loads
const fallbackCourses = [
  { course_title: "Python Programming", progress: 62 },
  { course_title: "Freelancing", progress: 38 },
  { course_title: "Graphic Design", progress: 12 },
]

export default function Dashboard() {
  const { user, logout, getEnrollments } = useAuth()
  const {
    xp, level, streak, levelProgress, xpToNext,
    earnedBadges, badgeDefs,
  } = useGamification()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getEnrollments()
        setEnrollments(data || [])
      } catch {}
      setLoading(false)
    }
    if (user) load()
    else setLoading(false)
  }, [user, getEnrollments])

  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "Learner"
  const initial = (name[0] || "S").toUpperCase()

  const stats = [
    { icon: "flame", label: "Day Streak", value: String(streak), color: "lime" },
    { icon: "bolt", label: "Total XP", value: String(xp), color: "yellow" },
    { icon: "trophy", label: "Badges Earned", value: `${earnedBadges.length}/${badgeDefs.length}`, color: "pink" },
    { icon: "book", label: "Courses Active", value: String(Math.max(enrollments.length, fallbackCourses.length)), color: "purple" },
  ]

  const myCourses = enrollments.length
    ? enrollments.map((e, i) => ({ course_title: e.course_title, progress: e.progress ?? Math.floor(20 + i * 22) }))
    : fallbackCourses

  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdropDash />
      <Navbar />

      {/* HEADER */}
      <section style={{ padding: "160px 0 60px", position: "relative" }}>
        <div className="container">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28, alignItems: "center" }}
            className="dash-head"
          >
            <div>
              <span className="sticker purple">Welcome back</span>
              <h1 className="display fade-up" style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)", marginTop: 18 }}>
                Hey, <span className="marker purple">{name}</span>
              </h1>
              <p className="lead fade-up fade-up-1" style={{ marginTop: 14, maxWidth: 560 }}>
                You are on a {streak} day streak. Keep the fire going. Your next lesson is waiting.
              </p>
              <div className="fade-up fade-up-2" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                <Link href="/courses" className="btn btn-lime btn-lg" style={{ textDecoration: "none" }}>
                  <Icon name="play" size={16} /> Resume Learning
                </Link>
                <Link href="/community" className="btn btn-purple btn-lg" style={{ textDecoration: "none" }}>
                  <Icon name="users" size={18} /> Find a Buddy
                </Link>
              </div>
            </div>

            <div className="card yellow" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: "var(--ink)",
                    color: "var(--lime)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    border: "3px solid var(--ink)",
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18 }}>{name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.email || "Signed in"}
                  </div>
                  <div className="xp-chip" style={{ marginTop: 8 }}>
                    <Icon name="bolt" size={12} /> Level {level} · {xp} XP
                  </div>
                </div>
              </div>
              <div className="progress" style={{ marginTop: 18 }}>
                <span style={{ width: `${levelProgress}%` }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: 8,
                }}
              >
                <span>Level {level}</span>
                <span>{xpToNext} XP to Level {level + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="band-cream" style={{ padding: "40px 0" }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`card ${s.color}`}
                style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}
              >
                <span
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: s.color === "purple" || s.color === "pink" ? "rgba(255,255,255,0.2)" : "var(--ink)",
                    border: "2.5px solid var(--ink)",
                    color: s.color === "purple" || s.color === "pink" ? "#fff" : "var(--lime)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={s.icon} size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4, opacity: 0.9 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MY COURSES + SIDEBAR */}
      <section className="section">
        <div className="container">
          <div className="dash-grid" style={{ display: "grid", gap: 28, gridTemplateColumns: "1fr" }}>
            {/* MAIN */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
                <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.6rem" }}>My Courses</h2>
                <Link href="/courses" className="btn btn-purple btn-sm" style={{ textDecoration: "none" }}>
                  Browse All Courses
                </Link>
              </div>

              {loading ? (
                <div className="card" style={{ padding: 40, textAlign: "center" }}>
                  <div className="spinner" style={{ margin: "0 auto 12px" }} />
                  Loading...
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {myCourses.map((c, i) => (
                    <div
                      key={i}
                      className="card"
                      style={{ padding: 20, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}
                    >
                      <span className={`sticker ${["lime", "purple", "pink", "yellow"][i % 4]}`} style={{ fontSize: 11 }}>
                        Ch {Math.ceil((c.progress ?? 20) / 12)}
                      </span>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                          {c.course_title}
                        </div>
                        <div className="progress" style={{ height: 12 }}>
                          <span style={{ width: `${c.progress ?? 20}%` }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", minWidth: 60, textAlign: "right" }}>
                        {c.progress ?? 20}%
                      </div>
                      <Link href="/courses" className="btn btn-ink btn-sm" style={{ textDecoration: "none" }}>
                        Resume
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Daily quiz */}
              <div style={{ marginTop: 32 }}>
                <MicroQuiz />
              </div>

              {/* Upcoming calendar (compact) */}
              <div style={{ marginTop: 32 }}>
                <InteractiveCalendar builtinEvents={calendarEvents} tone="ink" compact showAdd />
              </div>
            </div>

            {/* SIDEBAR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Streak */}
              <div className="card pink" style={{ padding: 22, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Icon name="flame" size={24} />
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16 }}>{streak} Day Streak</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const filled = i < Math.min(streak, 7)
                    return (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            aspectRatio: 1,
                            borderRadius: 10,
                            border: "2.5px solid var(--ink)",
                            background: filled ? "var(--lime)" : "rgba(255,255,255,0.2)",
                            color: "var(--ink)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          {filled && i === Math.min(streak, 7) - 1 ? "TODAY" : ""}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p style={{ fontSize: 12, marginTop: 12, opacity: 0.9 }}>
                  Study 10 minutes today to keep it alive.
                </p>
              </div>

              {/* AI buddy card */}
              <div className="card purple" style={{ padding: 22, color: "#fff" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "var(--lime)",
                      color: "var(--ink)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2.5px solid var(--ink)",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="robot" size={24} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>AI Study Buddy</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>Stuck? I am here 24/7.</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, marginTop: 12, opacity: 0.9 }}>
                  Ask me to explain a concept, quiz you, or brainstorm project ideas.
                </p>
                <Link href="/community" className="btn btn-lime btn-sm" style={{ marginTop: 14, textDecoration: "none", width: "100%" }}>
                  <Icon name="chat" size={14} /> Open Chat
                </Link>
              </div>

              {/* Badges snapshot */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
                  Your Badges
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                  {badgeDefs.slice(0, 8).map((b) => {
                    const earned = earnedBadges.includes(b.id)
                    return (
                      <div
                        key={b.id}
                        title={b.label}
                        style={{
                          aspectRatio: 1,
                          borderRadius: 12,
                          border: "2.5px solid var(--ink)",
                          background: earned ? b.color : "var(--paper-2)",
                          color: earned && (b.color === "var(--yellow)" || b.color === "var(--lime)") ? "var(--ink)" : earned ? "#fff" : "var(--muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: earned ? 1 : 0.4,
                          filter: earned ? "none" : "grayscale(0.8)",
                        }}
                      >
                        <Icon name={b.icon} size={20} />
                      </div>
                    )
                  })}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginTop: 12 }}>
                  {earnedBadges.length} of {badgeDefs.length} unlocked
                </div>
              </div>

              {/* Account */}
              <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>Account</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{user?.email || "Signed in"}</div>
                </div>
                {user && (
                  <button onClick={logout} className="btn btn-pink btn-sm" style={{ cursor: "pointer" }}>
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />

      <style jsx>{`
        @media (min-width: 900px) {
          .dash-head {
            grid-template-columns: 1.2fr 1fr !important;
            gap: 48px !important;
          }
          .dash-grid {
            grid-template-columns: 1.6fr 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </main>
  )
}

// Small framed backdrop for the dashboard (reuses courses image for consistency)
function PageBackdropDash() {
  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", padding: 14 }}
    >
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: 28,
          overflow: "hidden",
          border: "4px solid var(--ink)",
          boxShadow: "12px 12px 0 0 var(--ink)",
        }}
      >
        <Image
          src="/images/bg-courses.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,248,236,0.22) 0%, rgba(243,234,216,0.50) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(700px 500px at 88% 6%, rgba(198,255,61,0.24), transparent 62%), radial-gradient(760px 560px at 4% 94%, rgba(124,58,237,0.24), transparent 62%)",
            mixBlendMode: "soft-light",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(10,10,10,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            mixBlendMode: "multiply",
            opacity: 0.45,
          }}
        />
      </div>
    </div>
  )
}
