"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "./Navbar"
import Footer from "./components/Footer"
import Chatbot from "./Chatbot"
import PageBackdrop from "./components/PageBackdrop"
import PhotoBand from "./components/PhotoBand"
import Icon from "./components/Icon"
import { courses, categories, categoryCounts } from "./data/courses"

// ================= STATIC CONTENT =================

const skillTracks = [
  { num: "01", icon: "palette", color: "lime",   title: "Graphic Design",  desc: "Branding, posters and visual identity with Canva and Adobe tools." },
  { num: "02", icon: "code",    color: "purple", title: "Web Development",  desc: "Modern websites and apps with HTML, CSS, JavaScript, React and Next.js." },
  { num: "03", icon: "smartphone", color: "pink", title: "Social Media",    desc: "Strategy, content creation and growth that gets real engagement." },
  { num: "04", icon: "clapper", color: "yellow", title: "Video Editing",    desc: "Cinematic edits for YouTube, Reels and events. A skill in high demand." },
  { num: "05", icon: "sparkles", color: "purple", title: "Animation",       desc: "Motion graphics and animated content that stops the scroll." },
  { num: "06", icon: "robot",   color: "pink",   title: "AI Expertise",     desc: "Leverage AI tools like ChatGPT to boost creativity and productivity." },
]

const stats = [
  { value: "500+", label: "Youth Trained", color: "lime" },
  { value: "11",   label: "Bite Sized Courses", color: "purple" },
  { value: "24/7", label: "AI Study Help", color: "pink" },
  { value: "100%", label: "Hands On Practical", color: "yellow" },
]

const featured = [courses[4], courses[0], courses[10]]

const marqueeItems = [
  "Streaks and XP",
  "Badges and Leaderboards",
  "Bite Sized Videos",
  "Study Buddies",
  "AI Study Helper",
  "Micro Quizzes",
  "Resource Vault",
  "Mobile First",
]

const steps = [
  { num: "01", icon: "search",    title: "Browse and Pick",    desc: "Explore 11 practical courses across design, code, marketing, writing, video and AI.", color: "lime" },
  { num: "02", icon: "clipboard", title: "Enroll in Minutes",  desc: "Send an enrollment request. We confirm on WhatsApp or email within a day.", color: "purple" },
  { num: "03", icon: "rocket",    title: "Learn and Earn",     desc: "Follow the hands on syllabus, finish your project, earn your certificate and start earning.", color: "pink" },
]

// Badges
const badges = [
  { icon: "flame",    label: "7 Day Streak",  color: "var(--orange)" },
  { icon: "bolt",     label: "Speed Learner", color: "var(--yellow)" },
  { icon: "trophy",   label: "Quiz Champion", color: "var(--lime)" },
  { icon: "users",    label: "Study Buddy",   color: "var(--pink)" },
  { icon: "star",     label: "Top Contributor", color: "var(--purple)" },
  { icon: "cap",      label: "First Course",  color: "var(--blue)" },
]

// Leaderboard
const leaderboard = [
  { name: "Aisha M.",    xp: 2480, streak: 21, rank: 1, color: "var(--yellow)" },
  { name: "Brian K.",    xp: 2215, streak: 18, rank: 2, color: "var(--pink)" },
  { name: "Neema W.",    xp: 1980, streak: 14, rank: 3, color: "var(--purple)" },
  { name: "Kevin O.",    xp: 1720, streak: 12, rank: 4, color: "var(--lime)" },
  { name: "Faith J.",    xp: 1540, streak: 9,  rank: 5, color: "var(--paper-2)" },
]

// Micro quiz
const quiz = {
  question: "What does CSS stand for?",
  options: [
    { key: "A", text: "Computer Style Sheets", correct: false },
    { key: "B", text: "Cascading Style Sheets", correct: true },
    { key: "C", text: "Creative Style System",  correct: false },
    { key: "D", text: "Color and Shape Syntax", correct: false },
  ],
}

// Upcoming classes for calendar
const events = [
  { day: 4,  type: "class",  title: "Intro to Python",  time: "6pm" },
  { day: 7,  type: "due",    title: "Design brief due", time: "9pm" },
  { day: 12, type: "class",  title: "React Basics",     time: "6pm" },
  { day: 15, type: "event",  title: "Study Lounge",     time: "7pm" },
  { day: 19, type: "due",    title: "Marketing plan",   time: "11pm" },
  { day: 22, type: "class",  title: "Video Editing",    time: "5pm" },
  { day: 26, type: "event",  title: "Career Q&A",       time: "7pm" },
]

// Resources
const resources = [
  { icon: "download", label: "HTML and CSS Cheat Sheet",    meta: "PDF · 2 pages",  color: "lime" },
  { icon: "clipboard", label: "Freelance Proposal Template", meta: "DOCX · editable", color: "purple" },
  { icon: "bulb",      label: "AI Prompt Library",          meta: "PDF · 120 prompts", color: "pink" },
  { icon: "book",      label: "Python Quick Reference",     meta: "PDF · 6 pages",  color: "yellow" },
  { icon: "video",     label: "Reels Editing Pack",         meta: "ZIP · presets",  color: "purple" },
  { icon: "layers",    label: "Brand Identity Starter",     meta: "Canva template", color: "lime" },
]

// Discussion threads
const threads = [
  { tag: "Python",  title: "Best way to practice loops daily?",            author: "Aisha M.",    upvotes: 124, replies: 32, color: "lime" },
  { tag: "Design",  title: "How do you price a logo as a beginner?",       author: "Brian K.",    upvotes: 98,  replies: 21, color: "pink" },
  { tag: "YouTube", title: "Share your thumbnail hacks here",              author: "Neema W.",    upvotes: 210, replies: 47, color: "yellow" },
  { tag: "AI",      title: "Which AI tools do you use for homework help?", author: "Kevin O.",    upvotes: 76,  replies: 19, color: "purple" },
]

// ================= CLIENT COMPONENT =================
export default function Home() {
  const counts = categoryCounts()

  // Gamification demo state
  const [xp, setXp] = useState(1240)
  const [level, setLevel] = useState(4)
  const [streak, setStreak] = useState(7)
  const [selected, setSelected] = useState(null)
  const [quizResult, setQuizResult] = useState(null) // "correct" | "wrong" | null
  const [upvoted, setUpvoted] = useState({})
  const [buddyFound, setBuddyFound] = useState(false)

  // Ticking "today" for the calendar highlight
  const today = new Date()
  const currentDay = today.getDate()

  // Animate XP counter on mount
  useEffect(() => {
    let mounted = true
    const start = 0
    const end = 1240
    const duration = 1400
    const t0 = performance.now()
    function step(t) {
      if (!mounted) return
      const p = Math.min(1, (t - t0) / duration)
      setXp(Math.round(start + (end - start) * p))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    return () => { mounted = false }
  }, [])

  function answerQuiz(key) {
    if (quizResult) return
    setSelected(key)
    const opt = quiz.options.find((o) => o.key === key)
    setQuizResult(opt.correct ? "correct" : "wrong")
    if (opt.correct) {
      setXp((v) => v + 50)
      setTimeout(() => setLevel((l) => l + 1), 500)
    }
  }

  function upvote(idx) {
    setUpvoted((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  function findBuddy() {
    setBuddyFound(true)
    setXp((v) => v + 20)
  }

  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-home.jpg" position="center 25%" />
      <Navbar />

      {/* ================= HERO ================= */}
      <section style={{ padding: "150px 0 80px", position: "relative" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 36, alignItems: "center" }}
               className="hero-split">
            {/* LEFT: copy */}
            <div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
                <span className="sticker purple">🎓 For African Youth</span>
                <span className="sticker pink">📱 Mobile First</span>
                <span className="sticker yellow">⚡ Learn in 5 Minutes</span>
              </div>
              <h1 className="display fade-up" style={{ fontSize: "clamp(2.8rem, 7.4vw, 5.8rem)" }}>
                Learn skills
                <br />
                that <span className="marker">actually</span>{" "}
                <span className="accent-bright">pay.</span>
              </h1>

              <p className="lead fade-up fade-up-1" style={{ maxWidth: 620, marginTop: 26, fontSize: "1.15rem" }}>
                CHRISCO Digital Academy is a vibrant learning platform for African youth. We serve up
                bite sized video lessons, daily XP streaks, study buddies and an AI helper that never sleeps.
                Real skills. Real income. Real fun.
              </p>

              <div className="fade-up fade-up-2" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
                <Link href="/courses" className="btn btn-lime btn-lg" style={{ textDecoration: "none" }}>
                  Start Learning <span aria-hidden>→</span>
                </Link>
                <Link href="/community" className="btn btn-purple btn-lg" style={{ textDecoration: "none" }}>
                  <Icon name="users" size={18} /> Join the Community
                </Link>
              </div>

              {/* Stats row */}
              <div className="fade-up fade-up-3" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginTop: 36, maxWidth: 580 }}>
                {stats.map((s, i) => (
                  <div key={i} className={`card ${s.color}`} style={{ padding: "16px 18px" }}>
                    <div className="stat-num">{s.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4, color: s.color === "yellow" ? "var(--ink)" : "inherit" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: framed hero photo + floating widgets */}
            <div style={{ position: "relative" }}>
              <div className="photo-frame tilt-right float-anim" style={{ aspectRatio: "4/5", maxWidth: 460, marginLeft: "auto" }}>
                <Image src="/images/hero-tile.jpg" alt="Young learner at CHRISCO Digital Academy" fill priority sizes="(min-width: 900px) 460px, 92vw" style={{ objectFit: "cover" }} />
                <span className="tape" style={{ top: -10, left: 30 }} />
                <span className="tape pink" style={{ top: -8, right: 40, transform: "rotate(6deg)" }} />
                <span className="sticker ink" style={{ position: "absolute", top: 18, left: 18 }}>
                  <Icon name="flame" size={13} /> Streak {streak} days
                </span>
              </div>

              {/* Floating XP card */}
              <div className="photo-frame tilt-left wiggle" style={{ position: "absolute", top: 30, left: -14, background: "var(--purple)", padding: "12px 14px", color: "#fff", width: 200 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--lime)" }}>Level {level}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", lineHeight: 1 }}>{xp} XP</div>
                <div className="progress" style={{ height: 10, marginTop: 8, boxShadow: "none", borderWidth: 2 }}>
                  <span style={{ width: `${(xp % 500) / 5}%`, background: "var(--lime)" }} />
                </div>
              </div>

              {/* Floating buddy card */}
              <div className="photo-frame tilt-right" style={{ position: "absolute", bottom: 24, right: -10, background: "var(--yellow)", padding: "14px 16px", width: 220 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Study Buddy</div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, marginTop: 4 }}>
                  {buddyFound ? "You matched with Aisha 🎉" : "Find a peer now"}
                </div>
                <button onClick={findBuddy} className="btn btn-ink btn-sm" style={{ marginTop: 10, fontSize: 12, padding: "8px 14px" }}>
                  {buddyFound ? "Say Hi" : "Match Me"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee marquee-purple">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "flex" }} aria-hidden={dup === 1}>
              {marqueeItems.map((item, i) => (
                <span key={`${dup}-${i}`} className="marquee-item">
                  {item} <span className="dot">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= GAMIFICATION & COMMUNITY STRIP ================= */}
      <section className="section band-cream">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 18, flexWrap: "wrap", marginBottom: 48 }}>
            <div style={{ maxWidth: 640 }}>
              <span className="eyebrow purple">🚀 Gamified Learning</span>
              <h2 className="title" style={{ marginTop: 18 }}>
                Earn XP, keep streaks, <span className="marker purple">climb the board.</span>
              </h2>
              <p style={{ marginTop: 12, fontSize: "1.05rem", maxWidth: 620 }}>
                Every log in, every lesson and every quiz earns you XP. Unlock badges, beat the weekly
                leaderboard and stay motivated alongside other youth.
              </p>
            </div>
            <div className="xp-chip"><Icon name="bolt" size={13} /> {xp} XP · Level {level}</div>
          </div>

          <div className="grid-3" style={{ alignItems: "start" }}>
            {/* Streak calendar */}
            <div className="card" style={{ padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--orange)", border: "2.5px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="flame" size={20} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>Daily Streak</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>You are on fire</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "var(--font-display)", fontSize: "2rem" }}>{streak}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
                {Array.from({ length: 21 }).map((_, i) => {
                  const cls = i < streak - 1 ? "done" : i === streak - 1 ? "today" : ""
                  return <span key={i} className={`streak-dot ${cls}`}>{cls === "today" ? "🔥" : cls === "done" ? "✓" : ""}</span>
                })}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 14, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                Last 3 weeks
              </div>
            </div>

            {/* Badges */}
            <div className="card purple" style={{ padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--lime)", border: "2.5px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
                  <Icon name="medal" size={20} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>Your Badges</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Unlock as you go</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {badges.map((b) => (
                  <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 10, borderRadius: 14, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)" }}>
                    <span style={{ width: 42, height: 42, borderRadius: 12, background: b.color, border: "2.5px solid #fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: b.color === "var(--yellow)" || b.color === "var(--lime)" ? "var(--ink)" : "#fff" }}>
                      <Icon name={b.icon} size={20} />
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="card yellow" style={{ padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--ink)", color: "var(--lime)", border: "2.5px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="trophy" size={20} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>Weekly Leaderboard</div>
                  <div style={{ fontSize: 12 }}>Top 5 learners</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {leaderboard.map((u) => (
                  <div key={u.rank} className="lb-row" style={{ background: u.color, color: u.rank <= 3 ? "var(--ink)" : "var(--ink)" }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 10, background: "var(--ink)", color: u.color,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontSize: 14, flexShrink: 0,
                      border: "2px solid var(--ink)",
                    }}>{u.rank}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>{u.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>🔥 {u.streak} day streak</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>{u.xp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Micro quiz */}
          <div className="card" style={{ marginTop: 40, padding: 32, background: "var(--paper-2)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
              <span className="sticker lime">🎯 Micro Quiz</span>
              <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                Swipe style · 10 seconds · +50 XP
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.4rem", marginBottom: 18 }}>{quiz.question}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {quiz.options.map((o) => {
                const isSel = selected === o.key
                let cls = ""
                if (quizResult) {
                  if (o.correct) cls = "correct"
                  else if (isSel) cls = "wrong"
                }
                return (
                  <button key={o.key} onClick={() => answerQuiz(o.key)} className={`quiz-opt ${cls}`} style={{ textAlign: "left" }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 8, background: "var(--ink)", color: "#fff",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontSize: 13, flexShrink: 0,
                    }}>{o.key}</span>
                    {o.text}
                  </button>
                )
              })}
            </div>
            {quizResult === "correct" && (
              <div className="sticker lime" style={{ marginTop: 16 }}>🎉 Correct! +50 XP. Keep going.</div>
            )}
            {quizResult === "wrong" && (
              <div className="sticker pink" style={{ marginTop: 16 }}>Not quite. The answer is B. Review the Web Dev module.</div>
            )}
          </div>
        </div>
      </section>

      {/* ================= SKILL TRACKS / BITE SIZED MODULES ================= */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 18, flexWrap: "wrap", marginBottom: 48 }}>
            <div style={{ maxWidth: 640 }}>
              <span className="eyebrow">🎬 Bite Sized Learning</span>
              <h2 className="title" style={{ marginTop: 18 }}>
                3 to 5 minute video <span className="marker">chapters.</span>
              </h2>
              <p style={{ marginTop: 12, fontSize: "1.05rem", maxWidth: 620 }}>
                No two hour lectures. Every lesson is a short, punchy video chapter you can knock out on your
                phone between classes or on the bus. Progress bars show exactly where you are.
              </p>
            </div>
          </div>

          <div className="grid-3">
            {skillTracks.map((s, i) => (
              <div key={i} className={`card card-hover ${s.color}`} style={{ padding: 28, position: "relative" }}>
                <div className="ghost-num" style={s.color === "purple" || s.color === "pink" ? { WebkitTextStrokeColor: "rgba(255,255,255,0.4)", color: "transparent" } : {}}>{s.num}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <span style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: s.color === "purple" || s.color === "pink" ? "rgba(255,255,255,0.2)" : "var(--ink)",
                    border: "2.5px solid var(--ink)",
                    color: s.color === "purple" || s.color === "pink" ? "#fff" : "var(--lime)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={s.icon} size={26} />
                  </span>
                  <span className="sticker white" style={{ fontSize: 10 }}>📱 3 to 5 min</span>
                </div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: 8, color: s.color === "yellow" || s.color === "lime" ? "var(--ink)" : "inherit" }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16, color: s.color === "purple" || s.color === "pink" ? "rgba(255,255,255,0.9)" : "var(--body)" }}>{s.desc}</p>
                <div className="progress" style={{ marginBottom: 12 }}>
                  <span style={{ width: `${20 + i * 12}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  <span>{20 + i * 12}% complete</span>
                  <span>Ch {i + 1} of 8</span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Roadmap */}
          <div className="card ink" style={{ marginTop: 48, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
              <div>
                <div className="sticker lime" style={{ marginBottom: 10 }}>🗺️ Your Progress Roadmap</div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.5rem", color: "#fff", marginTop: 8 }}>Freelancing Track</h3>
              </div>
              <div style={{ fontFamily: "var(--font-display)", color: "var(--lime)", fontSize: "2rem" }}>62%</div>
            </div>
            <div className="progress" style={{ background: "rgba(255,255,255,0.1)", borderColor: "#fff" }}>
              <span style={{ width: "62%" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 22 }}>
              {[
                { label: "Mindset",    done: true },
                { label: "Skill Pick", done: true },
                { label: "Portfolio",  done: true },
                { label: "First Client", done: false },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, margin: "0 auto 8px",
                    border: "2.5px solid #fff",
                    background: s.done ? "var(--lime)" : "transparent",
                    color: s.done ? "var(--ink)" : "rgba(255,255,255,0.5)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800,
                  }}>{s.done ? "✓" : i + 1}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: s.done ? "#fff" : "rgba(255,255,255,0.5)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY: BUDDIES, LOUNGES, THREADS ================= */}
      <section className="section band-purple" style={{ color: "#fff" }}>
        <div className="container">
          <div style={{ maxWidth: 700, marginBottom: 48 }}>
            <span className="eyebrow" style={{ background: "var(--yellow)" }}>👯 Community</span>
            <h2 className="title on-dark" style={{ marginTop: 18, color: "#fff" }}>
              Study with peers, <span style={{ color: "var(--lime)" }}>not alone.</span>
            </h2>
            <p style={{ marginTop: 12, fontSize: "1.05rem", color: "rgba(255,255,255,0.9)" }}>
              Get matched with a study buddy in your course. Join silent group study lounges. Ask questions
              and upvote answers in our social style forums.
            </p>
          </div>

          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {/* Study Buddies */}
            <div className="card" style={{ background: "#fff", color: "var(--ink)", padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 46, height: 46, borderRadius: 14, background: "var(--pink)", border: "2.5px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Icon name="users" size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>Study Buddies</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Automated peer matching</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 16 }}>
                Tell us what course you are on. We pair you with 1 or 2 learners at the same chapter for daily
                accountability.
              </p>
              <div className="photo-frame" style={{ aspectRatio: "16/9", marginBottom: 16 }}>
                <Image src="/images/feat-buddy.jpg" alt="Study buddies" fill sizes="(min-width:768px) 360px, 90vw" style={{ objectFit: "cover" }} />
              </div>
              <button onClick={findBuddy} className="btn btn-pink" style={{ width: "100%" }}>
                <Icon name="heart" size={16} /> Find My Buddy
              </button>
            </div>

            {/* Group Study Rooms */}
            <div className="card" style={{ background: "var(--lime)", padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 46, height: 46, borderRadius: 14, background: "var(--ink)", border: "2.5px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--lime)" }}>
                  <Icon name="mic" size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>Group Study Lounges</div>
                  <div style={{ fontSize: 12 }}>Silent co working rooms</div>
                </div>
              </div>
              <p style={{ fontSize: 14, marginBottom: 16 }}>
                Hop into a 25 or 50 minute silent room. Cameras on, mics muted, vibe on. Hosted daily.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {[
                  { name: "Python Crew",       people: 12, live: true },
                  { name: "Late Night Design",  people: 8,  live: true },
                  { name: "Reels Editors",      people: 5,  live: false },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "2.5px solid var(--ink)", borderRadius: 12, background: "#fff" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: r.live ? "var(--lime-deep)" : "var(--muted)", border: "2px solid var(--ink)" }} />
                    <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13, flex: 1 }}>{r.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, background: "var(--paper-2)", padding: "3px 8px", borderRadius: 999, border: "1.5px solid var(--ink)" }}>{r.people} in room</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-ink" style={{ width: "100%" }}>
                <Icon name="video" size={16} /> Join a Lounge
              </button>
            </div>

            {/* Discussion Threads */}
            <div className="card" style={{ background: "#fff", color: "var(--ink)", padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 46, height: 46, borderRadius: 14, background: "var(--purple)", border: "2.5px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Icon name="message" size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>Discussion Threads</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Upvote style forums</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {threads.map((t, i) => (
                  <div key={i} className="thread">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                      <span className={`sticker ${["lime","pink","yellow","purple"][i % 4]}`} style={{ fontSize: 10 }}>{t.tag}</span>
                      <button onClick={() => upvote(i)} style={{ background: upvoted[i] ? "var(--lime)" : "var(--paper-2)", border: "2px solid var(--ink)", borderRadius: 10, padding: "4px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-head)" }}>
                        ▲ {t.upvotes + (upvoted[i] ? 1 : 0)}
                      </button>
                    </div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13.5, marginTop: 8 }}>{t.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "var(--muted)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      <span>by {t.author}</span>
                      <span>💬 {t.replies} replies</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/community" className="link-arrow" style={{ marginTop: 14, display: "inline-block" }}>
                See all threads <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURSES ================= */}
      <section className="section band-cream">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
            <div>
              <span className="eyebrow pink">📚 Course Catalog</span>
              <h2 className="title" style={{ marginTop: 16 }}>
                Featured courses that <span className="marker pink">actually pay.</span>
              </h2>
            </div>
            <Link href="/courses" className="btn btn-purple" style={{ textDecoration: "none" }}>
              View all courses <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid-3">
            {featured.map((course, i) => (
              <Link
                key={course.id}
                href="/courses"
                className="card card-hover"
                style={{ textDecoration: "none", overflow: "hidden", display: "flex", flexDirection: "column", padding: 0, borderWidth: 3 }}
              >
                <div style={{ background: `linear-gradient(135deg, ${course.color[0]}, ${course.color[1]})`, padding: "30px 26px", position: "relative", borderBottom: "3px solid var(--ink)" }}>
                  <span className="sticker" style={{ position: "absolute", top: 14, right: 14, fontSize: 10 }}>
                    {course.category}
                  </span>
                  <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: "rgba(255,255,255,0.2)",
                    border: "2.5px solid #fff",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={course.icon} size={28} strokeWidth={1.8} />
                  </div>
                </div>

                <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1, background: "#fff" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8, color: "var(--ink)" }}>{course.title}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18, flex: 1 }}>{course.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                    <span className="sticker lime" style={{ fontSize: 10 }}><Icon name="clock" size={11} strokeWidth={2.4} /> {course.duration}</span>
                    <span className="sticker yellow" style={{ fontSize: 10 }}><Icon name="star" size={11} strokeWidth={2.4} /> {course.rating}</span>
                    <span className="sticker white" style={{ fontSize: 10 }}><Icon name="users" size={11} strokeWidth={2.4} /> {course.students}</span>
                  </div>
                  {/* Mini progress */}
                  <div className="progress" style={{ height: 10, marginBottom: 12 }}>
                    <span style={{ width: `${30 + i * 15}%` }} />
                  </div>
                  <span className="link-arrow" style={{ fontSize: 13.5 }}>
                    Start course <span className="arr">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUPPORT: CALENDAR, RESOURCES, AI ================= */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 700, marginBottom: 48 }}>
            <span className="eyebrow yellow">🛠️ Support and Resources</span>
            <h2 className="title" style={{ marginTop: 18 }}>
              Everything you need to <span className="marker yellow">win.</span>
            </h2>
            <p style={{ marginTop: 12, fontSize: "1.05rem" }}>
              An interactive calendar to track classes and deadlines, a downloadable resource vault for
              cheat sheets, and a 24/7 AI study assistant ready to help with homework.
            </p>
          </div>

          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {/* Interactive Calendar */}
            <div className="card pink" style={{ padding: 26, color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", border: "2.5px solid var(--ink)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="calendar" size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>August 2026</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>Classes and deadlines</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, textAlign: "center" }}>
                {["M","T","W","T","F","S","S"].map((d,i)=>(<div key={i} style={{padding:4}}>{d}</div>))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                {Array.from({length: 31}, (_, i) => i + 1).map(d => {
                  const ev = events.find(e => e.day === d)
                  const isToday = d === currentDay
                  let cls = ""
                  if (ev?.type === "class") cls = "class"
                  else if (ev?.type === "due") cls = "due"
                  else if (ev?.type === "event") cls = "event"
                  return (
                    <div key={d} className={`cal-cell ${cls}`} style={isToday ? { outline: "3px solid var(--ink)", outlineOffset: 1 } : {}}>
                      {d}
                    </div>
                  )
                })}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, background: "var(--lime)", border: "2px solid var(--ink)", borderRadius: 3 }} />Class</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, background: "var(--pink)", border: "2px solid var(--ink)", borderRadius: 3 }} />Due</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, background: "var(--purple)", border: "2px solid var(--ink)", borderRadius: 3 }} />Event</span>
              </div>
            </div>

            {/* Resource Vault */}
            <div className="card" style={{ background: "#fff", padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 44, height: 44, borderRadius: 14, background: "var(--purple)", border: "2.5px solid var(--ink)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="download" size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>Resource Vault</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Cheat sheets and templates</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {resources.map((r, i) => (
                  <a key={i} href="#" className="vault-item" onClick={(e)=>e.preventDefault()} style={{ textDecoration: "none", color: "var(--ink)" }}>
                    <span style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `var(--${r.color})`,
                      border: "2px solid var(--ink)",
                      color: r.color === "purple" || r.color === "pink" ? "#fff" : "var(--ink)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon name={r.icon} size={18} />
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>{r.meta}</div>
                    </div>
                    <Icon name="download" size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* AI Study Assistant */}
            <div className="card" style={{ background: "var(--ink)", color: "#fff", padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 48, height: 48, borderRadius: 14, background: "var(--lime)", border: "2.5px solid var(--lime)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="robot" size={24} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, color: "#fff" }}>AI Study Assistant</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>24/7 homework help</div>
                </div>
                <span className="sticker lime" style={{ marginLeft: "auto", fontSize: 10 }}>● Online</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 16 }}>
                Stuck on a problem? Need a concept explained in simple language? Chat with our AI buddy
                anytime. It knows all our courses.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {["Explain CSS flexbox", "Give me 5 Python loop exercises", "Summarize chapter 3 of Freelancing"].map((q, i) => (
                  <button key={i} onClick={() => setOpen(true)} className="quiz-opt" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                    <Icon name="sparkles" size={14} style={{ color: "var(--lime)" }} /> {q}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(true)} className="btn btn-lime" style={{ width: "100%" }}>
                <Icon name="chat" size={16} /> Chat Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section band-cream">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ background: "var(--purple)", color: "#fff" }}>3 Easy Steps</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              From zero to earning, <span className="marker">fast.</span>
            </h2>
          </div>

          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div className={`card ${step.color}`} style={{ padding: "34px 30px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", lineHeight: 1, color: step.color === "yellow" ? "var(--ink)" : "inherit" }}>
                      {step.num}
                    </span>
                    <span style={{
                      width: 54, height: 54, borderRadius: 16,
                      background: step.color === "purple" || step.color === "pink" ? "rgba(255,255,255,0.2)" : "var(--ink)",
                      border: "2.5px solid var(--ink)",
                      color: step.color === "purple" || step.color === "pink" ? "#fff" : "var(--lime)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={step.icon} size={28} strokeWidth={1.8} />
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 10, color: step.color === "yellow" ? "var(--ink)" : "inherit" }}>{step.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: step.color === "purple" || step.color === "pink" ? "rgba(255,255,255,0.92)" : "var(--body)" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <PhotoBand
        eyebrow="Start today"
        title="Ready to build your digital career?"
        body="Real skills. Real income. Real future. Join CHRISCO Digital Academy and start learning this week."
        tone="lime"
        centered
      >
        <a href="https://wa.me/254112272061" className="btn btn-ink btn-lg" style={{ textDecoration: "none" }}>
          <Icon name="whatsapp" size={18} /> WhatsApp Us
        </a>
        <Link href="/courses" className="btn btn-purple btn-lg" style={{ textDecoration: "none" }}>
          Browse Courses <span aria-hidden>→</span>
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />

      {/* Local styles */}
      <style jsx>{`
        @media (min-width: 900px) {
          .hero-split { grid-template-columns: 1.1fr 1fr !important; gap: 60px !important; }
        }
      `}</style>
    </main>
  )
}
