import Link from "next/link"
import Image from "next/image"

const POSTER_TRACK_PILLS = [
  { label: "Graphic Design", bg: "#E60914", color: "#FFFFFF" },
  { label: "Web Dev", bg: "#084EC8", color: "#FFFFFF" },
  { label: "Video", bg: "#38A128", color: "#FFFFFF" },
  { label: "AI", bg: "#EE6816", color: "#FFFFFF" },
  { label: "Marketing", bg: "#F8C90E", color: "#0B1D51" },
]

export default function AuthShell({ children, subtitle }) {
  return (
    <main className="auth-shell" style={{ minHeight: "100vh", display: "grid", background: "var(--paper)" }}>
      {/* Left brand panel — Teens Poster Royal Blue, Flame Orange, Golden Yellow, Red & Leaf Green */}
      <aside
        className="hide-mobile"
        style={{
          background: "#003896",
          borderRight: "4px solid #F8C90E",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 56px",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0 }}>
          <Image
            src="/images/bg-home.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%", opacity: 0.12 }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#EE6816",
                border: "2px solid #F8C90E",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                color: "#FFFFFF",
              }}
            >
              C
            </span>
            <span style={{ lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#fff", display: "block" }}>
                CHRISCO
              </span>
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "0.64rem",
                  fontWeight: 800,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#F8C90E",
                }}
              >
                Digital Academy
              </span>
            </span>
          </Link>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 420 }}>
          <span
            style={{
              display: "inline-block",
              background: "#E60914",
              color: "#FFFFFF",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: 999,
              marginBottom: 16,
            }}
          >
            CHRISCO Youth Aflame • Learn | Build | Impact
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "#fff",
              fontSize: "clamp(1.9rem, 3vw, 2.8rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Learn skills that <span style={{ color: "#F8C90E" }}>pay for life.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", lineHeight: 1.7 }}>
            {subtitle}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
            {POSTER_TRACK_PILLS.map((t) => (
              <span
                key={t.label}
                className="pill pill-sm"
                style={{
                  background: t.bg,
                  color: t.color,
                  borderColor: t.bg,
                  fontWeight: 800,
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>
          © 2026 CHRISCO Youth Aflame
        </div>
      </aside>

      {/* Right form panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", minHeight: "100vh" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "#FFFFFF",
            border: "1px solid var(--line)",
            borderTop: "5px solid #E60914",
            borderRadius: 12,
            padding: "32px 28px",
          }}
        >
          {/* Mobile brand */}
          <div className="hide-desktop" style={{ textAlign: "center", marginBottom: 28 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#EE6816",
                  border: "2px solid #F8C90E",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  color: "#FFFFFF",
                }}
              >
                C
              </span>
            </Link>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "#0B1D51", marginTop: 12 }}>
              CHRISCO Digital Academy
            </div>
          </div>

          <div style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>{children}</div>
        </div>
      </div>
    </main>
  )
}
