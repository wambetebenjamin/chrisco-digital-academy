"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"
import { useAuth } from "../AuthProvider"

export default function Dashboard() {
  const { user, profile, logout, getEnrollments } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getEnrollments()
      setEnrollments(data)
      setLoading(false)
    }
    if (user) load()
  }, [user])

  const stats = [
    { icon: "book", label: "Courses Available", value: "11" },
    { icon: "checkCircle", label: "Courses Enrolled", value: loading ? "…" : enrollments.length },
    { icon: "trophy", label: "Certificates Earned", value: "0" },
    { icon: "calendar", label: "Member Since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-KE", { month: "short", year: "numeric" }) : "Today" },
  ]

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: "var(--navy)", padding: "140px 0 96px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/bg-cta.jpg" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 35%", opacity: 0.12 }} />
        </div>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(0,255,132,0.1)", top: -160, right: -120, filter: "blur(70px)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow on-dark" style={{ marginBottom: 14 }}>Welcome back</span>
              <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.05, textTransform: "uppercase" }}>
                {profile?.name || user?.email?.split("@")[0] || "Student"}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", marginTop: 12 }}>
                Continue your digital learning journey
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "14px 20px" }}>
              <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--green)", color: "var(--navy)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.1rem", flexShrink: 0 }}>
                {(profile?.name || user?.email || "U")[0].toUpperCase()}
              </span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{profile?.name || "Student"}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{user?.email}</div>
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
        </div>
      </section>

      {/* Enrollments */}
      <section style={{ padding: "40px 0 32px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.35rem", color: "var(--ink)" }}>
              {enrollments.length > 0 ? "Your enrolled courses" : "Start learning today"}
            </h2>
            <Link href="/courses" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
              Browse All Courses →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div className="spinner" />
              Loading your courses...
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid-3">
              {enrollments.map((enrollment, i) => (
                <div key={i} className="card card-hover" style={{ padding: "26px 26px" }}>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--ink)", fontSize: "1.1rem", marginBottom: 6 }}>{enrollment.course_title}</h3>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 18 }}>
                    Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString("en-KE")}
                  </div>
                  <div style={{ background: "var(--green-tint)", borderRadius: 999, height: 8, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "0%", background: "linear-gradient(90deg, var(--green-deep), var(--green))", borderRadius: 999 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "var(--muted)", fontSize: 12.5 }}>0% complete</span>
                    <Link href="/courses" className="btn btn-navy btn-sm" style={{ textDecoration: "none", fontSize: 12.5 }}>
                      Continue →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: "64px 40px", textAlign: "center" }}>
              <span style={{ display: "inline-flex", width: 80, height: 80, borderRadius: "50%", background: "var(--green-tint)", color: "var(--green-deep)", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon name="book" size={38} strokeWidth={1.6} />
              </span>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.25rem", fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>
                No courses yet
              </h3>
              <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 26, maxWidth: 420, margin: "0 auto 26px" }}>
                Browse our 11 practical courses and enroll in one that matches your goals. Your progress will show
                up here.
              </p>
              <Link href="/courses" className="btn btn-green" style={{ textDecoration: "none" }}>
                Browse Courses →
              </Link>
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
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{user?.email}</p>
            </div>
            <button onClick={logout} className="btn btn-outline-light btn-sm" style={{ cursor: "pointer" }}>
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
