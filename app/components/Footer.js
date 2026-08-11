import Link from "next/link"

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,0.6)", position: "relative", overflow: "hidden" }}>
      {/* Ghost wordmark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(5rem, 18vw, 13rem)",
          color: "rgba(255,255,255,0.03)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        CHRISCO
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 72, paddingBottom: 32 }}>
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 40 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--green)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  color: "var(--navy)",
                  transform: "rotate(-4deg)",
                }}
              >
                C
              </span>
              <span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "#fff", letterSpacing: "0.01em", display: "block", lineHeight: 1.1 }}>
                  CHRISCO
                </span>
                <span style={{ fontFamily: "var(--font-head)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--green)" }}>
                  Digital Academy
                </span>
              </span>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 20, maxWidth: 300 }}>
              A youth-focused learning platform under CHRISCO Youth Aflame — equipping young Africans with practical
              digital skills that open real doors.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
              {["Facebook", "Instagram", "YouTube", "LinkedIn"].map((s) => (
                <span key={s} className="pill pill-dark pill-sm" style={{ cursor: "default" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--green)", marginBottom: 18 }}>
              Explore
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Courses", href: "/courses" },
                { label: "Contact", href: "/contact" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--green)", marginBottom: 18 }}>
              Contact
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--green)" }}>✉</span> shambetz@gmail.com
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--green)" }}>✆</span> +254 112 272 061
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--green)" }}>⌖</span> Nairobi, Kenya
              </li>
            </ul>
            <a href="https://wa.me/254112272061" className="btn btn-green btn-sm" style={{ marginTop: 22 }}>
              WhatsApp Us 💬
            </a>
          </div>

          {/* Courses */}
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--green)", marginBottom: 18 }}>
              Popular Courses
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              {["Freelancing", "YouTube Automation", "Python Programming", "SWE & LLM Mastery", "Social Media Marketing"].map((c) => (
                <li key={c}>
                  <Link href="/courses" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 56, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            © 2026 CHRISCO Digital Academy. All Rights Reserved.
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Founded by Wambete Benjamin 🇰🇪
          </span>
        </div>
      </div>

    </footer>
  )
}
