"use client"
import { useState } from "react"
import Link from "next/link"
import Icon from "./Icon"
import { backend } from "../lib/googleSheets"
import { org } from "../data/org"

/*
 * Footer — restored to the PR #11 layout: teal band, 3px green top rule,
 * ghost wordmark, four balanced columns, pill socials, bottom bar.
 * The newsletter form keeps its working Google Sheets hook, and the credit
 * line carries no personal name.
 */
const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Books Library", href: "/library" },
  { label: "Shop", href: "/shop" },
  { label: "Films", href: "/films" },
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
  const [subscribed, setSubscribed] = useState("")
  const [sending, setSending] = useState(false)

  async function handleSubscribe(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("EMAIL") || "").trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setSubscribed("Please enter a valid email address.")
      return
    }
    setSending(true)
    const result = await backend.newsletter({
      action: "newsletter_signup",
      email,
      source: "footer",
      created_at: new Date().toISOString(),
    })
    setSending(false)
    setSubscribed(
      result?.ok
        ? "You are subscribed. Thank you!"
        : "We could not save that just now. Please try again."
    )
    if (result?.ok) e.target.reset()
  }

  return (
    <footer
      style={{
        background: "var(--navy)",
        color: "rgba(255,255,255,0.6)",
        position: "relative",
        overflow: "hidden",
        borderTop: "3px solid var(--green)",
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
                  transform: "rotate(-4deg)",
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
            <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 20, maxWidth: 320, color: "rgba(255,255,255,0.6)" }}>
              A youth-focused learning platform under CHRISCO Youth Aflame — equipping young Africans with practical
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

          {/* Contact + newsletter */}
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
                <span className="footer-contact-icon"><Icon name="phone" size={15} /></span>
                <span>+254 112 272 061</span>
              </li>
              <li>
                <span className="footer-contact-icon"><Icon name="pin" size={15} /></span>
                <span>Jinja, Uganda</span>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} style={{ marginTop: 24 }}>
              <label
                htmlFor="footer-email"
                style={{ display: "block", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 8 }}
              >
                Join the newsletter
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  id="footer-email"
                  className="input"
                  type="email"
                  name="EMAIL"
                  placeholder="you@example.com"
                  style={{ flex: 1, minWidth: 0, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff" }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  disabled={sending}
                  style={{ width: 44, height: 44, borderRadius: 999, background: "var(--green)", border: "none", color: "var(--on-accent)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: sending ? "wait" : "pointer", flexShrink: 0, opacity: sending ? 0.6 : 1 }}
                >
                  <Icon name="send" size={16} />
                </button>
              </div>
              {subscribed && (
                <p role="status" style={{ marginTop: 8, fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>
                  {subscribed}
                </p>
              )}
            </form>

            <a href={org.whatsapp} className="btn btn-green btn-sm" style={{ marginTop: 18 }}>
              <Icon name="whatsapp" size={15} /> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© 2026 CHRISCO Digital Academy. All Rights Reserved.</span>
          <span className="footer-bottom-right">
            <span>CHRISCO Youth Aflame · Uganda</span>
            <a href="#" className="footer-top-link">
              Back to top ↑
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
