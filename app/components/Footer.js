import Link from "next/link"
import Icon from "./Icon"
import { org } from "../data/org"

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Christian & Faith Books", href: "/library?shelf=christian" },
  { label: "Skill & Learning Books", href: "/library?shelf=learning" },
  { label: "Become a Tutor", href: "/become-a-tutor" },
  { label: "PURSUE Shop", href: "/shop" },
  { label: "Affiliate Programme", href: "/affiliates" },
  { label: "Privacy & Data Policy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
]

const popularCourses = [
  "Freelancing",
  "YouTube Automation",
  "Python Programming",
  "SWE & LLM Mastery",
  "Social Media Marketing",
]

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0B1D51",
        color: "rgba(255,255,255,0.85)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 64, paddingBottom: 40 }}>
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col">
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "#003896",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "#FFFFFF",
                  flexShrink: 0,
                }}
              >
                C
              </span>
              <span>
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "#FFFFFF",
                    display: "block",
                    lineHeight: 1.15,
                  }}
                >
                  CHRISCO Digital Academy
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#F8C90E",
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  CHRISCO Youth Aflame
                </span>
              </span>
            </Link>
            <p style={{ fontSize: 14.5, lineHeight: 1.75, marginTop: 18, maxWidth: 320, color: "rgba(255,255,255,0.82)" }}>
              The learning platform of {org.programme}, operating under {org.umbrella}, equipping young Africans with
              practical digital skills that open real doors.
            </p>
          </div>

          {/* Explore */}
          <nav className="footer-col" aria-label="Explore">
            <h3 className="footer-heading" style={{ color: "#FFFFFF" }}>Explore</h3>
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

          {/* Popular Courses */}
          <nav className="footer-col" aria-label="Popular courses">
            <h3 className="footer-heading" style={{ color: "#FFFFFF" }}>Popular Courses</h3>
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
            <h3 className="footer-heading" style={{ color: "#FFFFFF" }}>Contact</h3>
            <ul className="footer-list footer-contact">
              <li>
                <span className="footer-contact-icon"><Icon name="mail" size={15} /></span>
                <a href={`mailto:${org.email}`} className="footer-link" style={{ wordBreak: "break-all" }}>
                  {org.email}
                </a>
              </li>
              <li>
                <a href={`tel:${org.phone}`} className="footer-contact-icon" aria-label="Call CHRISCO Digital Academy">
                  <Icon name="phone" size={15} />
                </a>
                <a href={org.whatsapp} className="footer-link" aria-label="Chat with us on WhatsApp">
                  <Icon name="whatsapp" size={15} />
                </a>
              </li>
            </ul>
            <a
              href={org.whatsapp}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 22,
                background: "#F8C90E",
                color: "#0B1D51",
                padding: "10px 22px",
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              <Icon name="whatsapp" size={15} /> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{ borderTop: "none", paddingTop: 28 }}>
          <span>© 2026 {org.programme}. All Rights Reserved.</span>
          <span className="footer-bottom-right" style={{ display: "inline-flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/privacy" className="footer-top-link">
              Privacy &amp; Data Protection Policy
            </Link>
            <span>{org.ownership}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
