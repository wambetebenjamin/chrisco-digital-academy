import Link from "next/link"
import Icon from "./Icon"
import { org } from "../data/org"

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Christian & Faith Books", href: "/library?shelf=christian" },
  { label: "Skill & Learning Books", href: "/library?shelf=learning" },
  { label: "Courses", href: "/courses" },
  { label: "AI Prompt & Voice Studio", href: "/studio" },
  { label: "About Us", href: "/about" },
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

const socials = ["Facebook", "Instagram", "YouTube", "LinkedIn"]

export default function Footer() {
  return (
    <footer
      style={{
        background: "#003896",
        color: "rgba(255,255,255,0.82)",
        position: "relative",
        overflow: "hidden",
        borderTop: "4px solid #F8C90E",
      }}
    >
      {/* Poster-style 4-item Royal Blue Contact Strip */}
      <div
        style={{
          background: "#084EC8",
          borderBottom: "1px solid rgba(255,255,255,0.18)",
          padding: "16px 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 14,
            alignItems: "center",
            color: "#FFFFFF",
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          <a
            href={`tel:${org.phone}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#FFFFFF",
              textDecoration: "none",
              borderRight: "1px solid rgba(255,255,255,0.28)",
              paddingRight: 12,
            }}
          >
            <Icon name="phone" size={18} />
            <span>{org.phone}</span>
          </a>

          <a
            href={`mailto:${org.email}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#FFFFFF",
              textDecoration: "none",
              borderRight: "1px solid rgba(255,255,255,0.28)",
              paddingRight: 12,
              wordBreak: "break-all",
            }}
          >
            <Icon name="mail" size={18} />
            <span>{org.email}</span>
          </a>

          <Link
            href="/courses"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#FFFFFF",
              textDecoration: "none",
              borderRight: "1px solid rgba(255,255,255,0.28)",
              paddingRight: 12,
            }}
          >
            <Icon name="globe" size={18} />
            <span>chrisco-digital-academy.vercel.app/courses</span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#FFFFFF",
            }}
          >
            <Icon name="users" size={18} />
            <span>@chrisco youth aflame</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 64, paddingBottom: 36 }}>
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col">
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#EE6816",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  color: "#FFFFFF",
                  flexShrink: 0,
                }}
              >
                C
              </span>
              <span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "#fff", letterSpacing: "0.01em", display: "block", lineHeight: 1.1 }}>
                  CHRISCO YOUTH <span style={{ color: "#EE6816" }}>AFLAME</span>
                </span>
                <span style={{ fontFamily: "var(--font-head)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#F8C90E" }}>
                  Digital Academy · Learn | Build | Impact
                </span>
              </span>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 20, maxWidth: 320 }}>
              The learning platform of CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches
              International, equipping young Africans with practical digital skills that open real doors.
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
            <a href={org.whatsapp} className="btn btn-amber btn-sm" style={{ marginTop: 24 }}>
              <Icon name="whatsapp" size={15} /> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© 2026 CHRISCO Youth Aflame. All Rights Reserved.</span>
          <span className="footer-bottom-right" style={{ display: "inline-flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/privacy" className="footer-top-link">
              Privacy &amp; Data Protection Policy
            </Link>
            <span>{org.ownership}</span>
            <a href="#" className="footer-top-link">
              Back to top ↑
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
