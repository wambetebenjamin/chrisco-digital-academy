import Link from "next/link"
import Icon from "./Icon"

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
]

const popularCourses = [
  "Freelancing",
  "YouTube Automation",
  "Python Programming",
  "SWE & LLM Mastery",
  "Social Media Marketing",
]

const socials = ["Facebook", "Instagram", "YouTube", "LinkedIn"]

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--navy)",
        color: "rgba(255,255,255,0.6)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Ghost wordmark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -42,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(5rem, 18vw, 13rem)",
          lineHeight: 1,
          color: "rgba(255,255,255,0.025)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        CHRISCO
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 80, paddingBottom: 36 }}>
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col">
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
                  flexShrink: 0,
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
            <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 20, maxWidth: 320 }}>
              A youth-focused learning platform under CHRISCO Youth Aflame, equipping young Africans with practical
              digital skills that open real doors.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
              {socials.map((s) => (
                <span key={s} className="pill pill-dark pill-sm" style={{ cursor: "default" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav className="footer-col" aria-label="Explore">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-list">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular courses */}
          <nav className="footer-col" aria-label="Popular courses">
            <h3 className="footer-heading">Popular Courses</h3>
            <ul className="footer-list">
              {popularCourses.map((c) => (
                <li key={c}>
                  <Link href="/courses" className="footer-link">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="footer-col">
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-list footer-contact">
              <li>
                <span className="footer-contact-icon"><Icon name="mail" size={15} /></span>
                <a href="mailto:shambetz@gmail.com" className="footer-link" style={{ wordBreak: "break-all" }}>
                  shambetz@gmail.com
                </a>
              </li>
              <li>
                <span className="footer-contact-icon"><Icon name="phone" size={15} /></span>
                <span>+254 112 272 061</span>
              </li>
              <li>
                <span className="footer-contact-icon"><Icon name="pin" size={15} /></span>
                <span>Jinja, Uganda</span>
              </li>
            </ul>
            <a href="https://wa.me/254112272061" className="btn btn-green btn-sm" style={{ marginTop: 24 }}>
              <Icon name="whatsapp" size={15} /> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© 2026 CHRISCO Digital Academy. All Rights Reserved.</span>
          <span className="footer-bottom-right">
            <span>Founded by Wambete Benjamin, Jinja, Uganda</span>
            <a href="#" className="footer-top-link">
              Back to top ↑
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
