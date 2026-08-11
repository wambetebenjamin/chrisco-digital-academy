"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import { useAuth } from "../AuthProvider"

export default function Dashboard() {
  const { user, profile, logout, getEnrollments } = useAuth()
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
  }, [user])

  const name = profile?.name || user?.email?.split("@")[0] || "Student"
  const initial = name[0]?.toUpperCase() || "S"

  const stats = [
    { icon: "flame",    label: "Day Streak",    value: "7",   color: "lime" },
    { icon: "bolt",     label: "Total XP",      value: "1,240", color: "yellow" },
    { icon: "trophy",   label: "Badges Earned", value: "4",   color: "pink" },
    { icon: "book",     label: "Courses Active", value: enrollments.length || "0", color: "purple" },
  ]

  const myCourses = enrollments.length ? enrollments : [
    { course_title: "Python Programming", progress: 62 },
    { course_title: "Freelancing",         progress: 38 },
    { course_title: "Graphic Design",      progress: 12 },
  ]

  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdropDash />
      <Navbar />

      {/* HEADER */}
      <section style={{ padding: "160px 0 60px", position: "relative" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28, alignItems: "center" }}
               className="dash-head">
            <div>
              <span className="sticker purple">👋 Welcome back</span>
              <h1 className="display fade-up" style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)", marginTop: 18 }}>
                Hey, <span className="marker purple">{name}</span>
              </h1>
              <p className="lead fade-up fade-up-1" style={{ marginTop: 14, maxWidth: 560 }}>
                You are on a 7 day streak. Keep the fire going. Your next lesson is waiting.
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
                <span style={{ width: 64, height: 64, borderRadius: 18, background: "var(--ink)", color: "var(--lime)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.8rem", border: "3px solid var(--ink)", flexShrink: 0 }}>
                  {initial}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18 }}>{name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{user?.email}</div>
                  <div className="xp-chip" style={{ marginTop: 8 }}><Icon name="bolt" size={12} /> Level 4 · 1,240 XP</div>
                </div>
              </div>
              <div className="progress" style={{ marginTop: 18 }}>
                <span style={{ width: "48%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8 }}>
                <span>Level 4</span>
                <span>260 XP to Level 5</span>
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
              <div key={i} className={`card ${s.color}`} style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ width: 50, height: 50, borderRadius: 14, background: s.color === "purple" || s.color === "pink" ? "rgba(255,255,255,0.2)" : "var(--ink)", border: "2.5px solid var(--ink)", color: s.color === "purple" || s.color === "pink" ? "#fff" : "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={s.icon} size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4, opacity: 0.9 }}>{s.label}</div>
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
                  Browse All Courses <span aria-hidden>→</span>
                </Link>
              </div>

              {loading ? (
                <div className="card" style={{ padding: 40, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto 12px" }} />Loading...</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {myCourses.map((c, i) => {
                    const pct = c.progress ?? Math.floor(20 + i * 22)
                    return (
                      <div key={i} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                        <span className={`sticker ${["lime","purple","pink","yellow"][i % 4]}`} style={{ fontSize: 11 }}>Ch {Math.ceil(pct/12)}</span>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{c.course_title}</div>
                          <div className="progress" style={{ height: 12 }}>
                            <span style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", minWidth: 60, textAlign: "right" }}>{pct}%</div>
                        <Link href="/courses" className="btn btn-ink btn-sm" style={{ textDecoration: "none" }}>Resume <span aria-hidden>→</span></Link>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Upcoming calendar */}
              <div className="card ink" style={{ marginTop: 32, padding: 28, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 14, background: "var(--lime)", border: "2.5px solid var(--lime)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="calendar" size={22} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, color: "#fff" }}>Your Week Ahead</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Classes and deadlines</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { day: "Mon", title: "Python Loops Live Class", time: "6:00pm", color: "lime" },
                    { day: "Wed", title: "Logo Design Assignment Due", time: "9:00pm", color: "pink" },
                    { day: "Thu", title: "Group Study Lounge", time: "7:00pm", color: "purple" },
                    { day: "Sat", title: "Freelance Q&A with Benjamin", time: "11:00am", color: "yellow" },
                  ].map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)" }}>
                      <span style={{ width: 56, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 14, background: `var(--${e.color})`, color: "var(--ink)", padding: "6px 0", borderRadius: 10, border: "2px solid var(--ink)" }}>{e.day}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, color: "#fff" }}>{e.title}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "var(--lime)" }}>{e.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Streak */}
              <div className="card pink" style={{ padding: 22, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Icon name="flame" size={24} />
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16 }}>7 Day Streak</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{
                        aspectRatio: 1, borderRadius: 10, border: "2.5px solid var(--ink)",
                        background: i < 6 ? "var(--lime)" : "rgba(255,255,255,0.2)",
                        color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 12,
                      }}>{i < 6 ? "🔥" : "?"}</div>
                      <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4 }}>{d}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, marginTop: 12, opacity: 0.9 }}>Study 10 minutes today to keep it alive.</p>
              </div>

              {/* Daily micro quiz */}
              <div className="card yellow" style={{ padding: 22 }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>🎯 Daily Quiz</div>
                <p style={{ fontSize: 13, marginBottom: 12 }}>Which keyword defines a function in Python?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {["func", "def", "function", "lambda"].map((a, i) => (
                    <button key={i} className="quiz-opt" style={{ padding: "10px 14px", fontSize: 13 }}>{String.fromCharCode(65 + i)}. {a}</button>
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, marginTop: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>+50 XP for a correct answer</div>
              </div>

              {/* AI buddy card */}
              <div className="card purple" style={{ padding: 22, color: "#fff" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ width: 48, height: 48, borderRadius: 14, background: "var(--lime)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "2.5px solid var(--ink)", flexShrink: 0 }}>
                    <Icon name="robot" size={24} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>AI Study Buddy</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>Stuck? I am here 24/7.</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, marginTop: 12, opacity: 0.9 }}>Ask me to explain a concept, quiz you, or brainstorm project ideas.</p>
              </div>

              {/* Account */}
              <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>Account</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{user?.email || "Signed in"}</div>
                </div>
                {user && (
                  <button onClick={logout} className="btn btn-pink btn-sm" style={{ cursor: "pointer" }}>Sign Out</button>
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
          .dash-head { grid-template-columns: 1.2fr 1fr !important; gap: 48px !important; }
          .dash-grid { grid-template-columns: 1.6fr 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </main>
  )
}

// Small framed backdrop for the dashboard (reuses courses image for consistency)
function PageBackdropDash() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", padding: 14 }}>
      <div style={{ position: "absolute", inset: 14, borderRadius: 28, overflow: "hidden", border: "4px solid var(--ink)", boxShadow: "12px 12px 0 0 var(--ink)" }}>
        <Image src="/images/bg-courses.jpg" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,248,236,0.28) 0%, rgba(243,234,216,0.55) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(700px 500px at 88% 6%, rgba(198,255,61,0.18), transparent 62%), radial-gradient(760px 560px at 4% 94%, rgba(124,58,237,0.18), transparent 62%)" }} />
      </div>
    </div>
  )
}
