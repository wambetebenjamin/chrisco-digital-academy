import Link from "next/link"
import Icon from "./Icon"
import { org } from "../data/org"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "List of All Programmes", href: "/courses" },
  { label: "Digital Institutional Repository", href: "/library" },
  { label: "Christian & Faith Books", href: "/library?shelf=christian" },
  { label: "AI, Voice & SEO Studio", href: "/studio" },
  { label: "PURSUE Shop", href: "/shop" },
  { label: "e-Learning Portal", href: "/dashboard" },
  { label: "Become a Tutor", href: "/become-a-tutor" },
  { label: "Affiliate Programme", href: "/affiliates" },
  { label: "Privacy Policy", href: "/privacy" },
]

const schoolsLinks = [
  { label: "School of Business & Freelancing", href: "/courses?category=Business" },
  { label: "School of Coding & Software Eng.", href: "/courses?category=Coding%20%26%20Tech" },
  { label: "School of Graphic Design & POD", href: "/courses?category=Design" },
  { label: "School of Video & AI Media", href: "/courses?category=Video%20%26%20AI" },
  { label: "School of Digital Marketing", href: "/courses?category=Marketing" },
  { label: "School of Copywriting & Books", href: "/courses?category=Writing" },
  { label: "School of Executive Leadership", href: "/courses?category=Career" },
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
      {/* Royal Blue Contact Strip */}
      <div
        style={{
          background: "#003896",
          borderBottom: "1px solid rgba(255,255,255,0.16)",
          padding: "14px 0",
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
            fontWeight: 500,
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
            }}
          >
            <Icon name="phone" size={16} />
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
              wordBreak: "break-all",
            }}
          >
            <Icon name="mail" size={16} />
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
            }}
          >
            <Icon name="globe" size={16} />
            <span>chrisco-digital-academy.vercel.app</span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#F8C90E",
            }}
          >
            <Icon name="users" size={16} />
            <span>@chrisco youth aflame</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 56, paddingBottom: 36 }}>
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col">
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 38,
                  height: 44,
                  borderRadius: "3px 3px 18px 18px",
                  background: "#003896",
                  border: "2px solid #F8C90E",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="26" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 3.5V26.5M5 13.5H21" stroke="#E60914" strokeWidth="3"/>
                  <path d="M13 3.5V26.5M5 13.5H21" stroke="#FFFFFF" strokeWidth="1.2"/>
                </svg>
              </span>
              <span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#FFFFFF",
                    display: "block",
                    lineHeight: 1.15,
                    paddingBottom: 3,
                    borderBottom: "1.5px solid #E60914",
                    textTransform: "uppercase",
                  }}
                >
                  CHRISCO DIGITAL ACADEMY
                </span>
                <span
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: 11,
                    color: "#F8C90E",
                    display: "block",
                    marginTop: 3,
                  }}
                >
                  A Centre of Excellence in Practical Digital Skills
                </span>
              </span>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 18, maxWidth: 320, color: "rgba(255,255,255,0.8)" }}>
              CHRISCO Digital Academy is an authentic Christian digital training institution established by CHRISCO
              Youth Aflame under CHRISCO Fellowship of Churches International.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="footer-col" aria-label="Quick Links">
            <h3 className="footer-heading" style={{ color: "#FFFFFF", borderBottom: "2px solid #14853B", paddingBottom: 10 }}>
              Quick Links
            </h3>
            <ul className="footer-list">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Schools & Faculties */}
          <nav className="footer-col" aria-label="Schools and Faculties">
            <h3 className="footer-heading" style={{ color: "#FFFFFF", borderBottom: "2px solid #14853B", paddingBottom: 10 }}>
              Schools &amp; Faculties
            </h3>
            <ul className="footer-list">
              {schoolsLinks.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="footer-link">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Admissions & Contact */}
          <div className="footer-col">
            <h3 className="footer-heading" style={{ color: "#FFFFFF", borderBottom: "2px solid #14853B", paddingBottom: 10 }}>
              Contact Us
            </h3>
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
                  {org.phoneDisplay}
                </a>
              </li>
            </ul>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <a
                href="https://forms.gle/ChriscoTeensAIBootcamp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#E60914",
                  color: "#FFFFFF",
                  padding: "10px 18px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Teens Bootcamp Registration
              </a>
              <Link
                href="/sign-up"
                style={{
                  display: "inline-block",
                  background: "#14853B",
                  color: "#FFFFFF",
                  padding: "10px 18px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>Copyright All Right Reserved 2026, CHRISCO Digital Academy</span>
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
