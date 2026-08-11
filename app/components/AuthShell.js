import Link from "next/link"

export default function AuthShell({ children, subtitle }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr", background: "var(--paper)" }}>
      {/* Left brand panel */}
      <aside className="hide-mobile" style={{ background: "var(--navy)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 56px" }}>
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "rgba(0,255,132,0.08)", top: -160, right: -160, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "rgba(0,255,132,0.06)", bottom: -120, left: -120, filter: "blur(70px)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 44, height: 44, borderRadius: 13, background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--navy)", transform: "rotate(-4deg)" }}>
              C
            </span>
            <span style={{ lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#fff", display: "block" }}>CHRISCO</span>
              <span style={{ fontFamily: "var(--font-head)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--green)" }}>
                Digital Academy
              </span>
            </span>
          </Link>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 420 }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "clamp(1.9rem, 3vw, 2.8rem)", lineHeight: 1.05, textTransform: "uppercase", marginBottom: 18 }}>
            Learn skills that <span style={{ color: "var(--green)" }}>pay for life.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7 }}>
            {subtitle}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
            {["Graphic Design", "Web Dev", "Video", "AI", "Marketing"].map((t) => (
              <span key={t} className="pill pill-dark pill-sm">{t}</span>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
          © 2026 CHRISCO Digital Academy · Nairobi, Kenya 🇰🇪
        </div>
      </aside>

      {/* Right form panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", minHeight: "100vh" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Mobile brand */}
          <div className="hide-desktop" style={{ textAlign: "center", marginBottom: 32 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{ width: 52, height: 52, borderRadius: 15, background: "var(--navy)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--green)", transform: "rotate(-4deg)" }}>
                C
              </span>
            </Link>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--ink)", marginTop: 14 }}>
              CHRISCO Digital Academy
            </div>
          </div>

          <div style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>{children}</div>
        </div>
      </div>
    </main>
  )
}
