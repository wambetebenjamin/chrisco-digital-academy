import Link from "next/link"
import Icon from "./Icon"
import { org } from "../data/org"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "List of All 19 Programmes", href: "/courses" },
  { label: "Digital Book Repository (20 PDFs)", href: "/library" },
  { label: "Christian & Faith Books Shelf", href: "/library?shelf=christian" },
  { label: "AI, Voice & SEO Studio", href: "/studio" },
  { label: "PURSUE Apparel Shop", href: "/shop" },
  { label: "Student Dashboard (e-Learning)", href: "/dashboard" },
  { label: "Become a Tutor", href: "/become-a-tutor" },
  { label: "Affiliate Programme", href: "/affiliates" },
  { label: "Privacy & Data Policy", href: "/privacy" },
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

const socials = ["Facebook", "Instagram", "YouTube", "LinkedIn"]

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0B1D51",
        color: "rgba(255,255,255,0.86)",
        position: "relative",
        overflow: "hidden",
        borderTop: "4px solid #E60914",
      }}
    >
      {/* Poster-style 4-item Royal Blue Contact Strip */}
      <div
        style={{
          background: "#003896",
          borderBottom: "2px solid #F8C90E",
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
              color: "#F8C90E",
            }}
          >
            <Icon name="users" size={18} />
            <span>@chrisco youth aflame</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 60, paddingBottom: 36 }}>
        <div className="footer-grid">
          {/* Brand Column (UCU Crest + Tagline) */}
          <div className="footer-col">
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 44,
                  height: 48,
                  borderRadius: "6px 6px 22px 22px",
                  background: "linear-gradient(145deg, #003896 0%, #0B1D51 55%, #E60914 100%)",
                  border: "2px solid #F8C90E",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  color: "#F8C90E",
                  flexShrink: 0,
                }}
              >
                C
              </span>
              <span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.02rem",
                    color: "#FFFFFF",
                    letterSpacing: "0.02em",
                    display: "block",
                    lineHeight: 1.15,
                    paddingBottom: 4,
                    borderBottom: "2px solid #E60914",
                  }}
                >
                  CHRISCO DIGITAL ACADEMY
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: "#F8C90E",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  A Centre of Excellence in Practical Digital Skills
                </span>
              </span>
            </Link>
            <p style={{ fontSize: 13.8, lineHeight: 1.72, marginTop: 18, maxWidth: 320, color: "rgba(255,255,255,0.82)" }}>
              The digital learning institution of CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches
              International, equipping young Africans across Central &amp; Eastern Districts and online with 19 free
              practical courses and 20 PDF handbooks.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
              {socials.map((s) => (
                <span key={s} className="pill pill-dark pill-sm" style={{ cursor: "default" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav className="footer-col" aria-label="Quick Links">
            <h3 className="footer-heading" style={{ color: "#F8C90E" }}>Quick Links</h3>
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
            <h3 className="footer-heading" style={{ color: "#F8C90E" }}>Schools &amp; Faculties</h3>
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
            <h3 className="footer-heading" style={{ color: "#F8C90E" }}>Admissions &amp; Contact</h3>
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
                  <Icon name="whatsapp" size={15} /> {org.phoneDisplay}
                </a>
              </li>
            </ul>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <a
                href="https://forms.gle/ChriscoTeensAIBootcamp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{
                  background: "#E60914",
                  color: "#FFFFFF",
                  border: "1.5px solid #F8C90E",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Teens Bootcamp Google Form →
              </a>
              <a href={org.whatsapp} className="btn btn-amber btn-sm" style={{ textDecoration: "none" }}>
                <Icon name="whatsapp" size={15} /> WhatsApp Admissions
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© 2026 CHRISCO Youth Aflame Digital Academy. All Rights Reserved.</span>
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
