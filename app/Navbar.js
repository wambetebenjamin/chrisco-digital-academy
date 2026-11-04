"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "./AuthProvider"
import Icon from "./components/Icon"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push("/")
    setMenuOpen(false)
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/library", label: "Library" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ]

  const isActive = (href) => pathname === href

  return (
    <header className="kyn-header" style={{ position: "sticky", top: 0, zIndex: 200 }}>
      {/* Topbar — KYN dark green */}
      <div className="kyn-topbar topbar s2" style={{ background: "#18322E" }}>
        <div className="kyn-topbar-inner">
          <ul className="contact-info" style={{ margin: 0, padding: "8px 0" }}>
            <li>
              <i className="ti-email" style={{ color: "#F74F22" }} aria-hidden>
                <Icon name="mail" size={14} />
              </i>
              <a className="info-link" href="mailto:chriscoyouthaflame2025@gmail.com">
                chriscoyouthaflame2025@gmail.com
              </a>
            </li>
            <li>
              <i className="fi flaticon-phone" style={{ color: "#F74F22" }} aria-hidden>
                <Icon name="phone" size={14} />
              </i>
              <a className="info-link" href="tel:+254112272061">
                +254 112 272 061
              </a>
            </li>
            <li className="hide-mobile">
              <Icon name="flame" size={14} style={{ color: "#F74F22" }} />
              <span style={{ fontWeight: 700, letterSpacing: "0.04em" }}>CHRISCO Youth Aflame</span>
            </li>
          </ul>
          <div className="contact-into">
            <ul className="social-media" style={{ margin: 0 }}>
              <li className="hide-mobile">
                <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
                  Follow Us :
                </span>
              </li>
              <li>
                <a className="social-link" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Icon name="facebook" size={12} />
                </a>
              </li>
              <li>
                <a className="social-link" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Icon name="instagram" size={12} />
                </a>
              </li>
              <li>
                <a className="social-link" href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Icon name="play" size={12} />
                </a>
              </li>
              <li>
                <a className="social-link" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Icon name="linked" size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main header — white, like wpo-site-header */}
      <div className="wpo-site-header">
        <nav className="navigation navbar navbar-expand-lg navbar-light" style={{ background: "#fff" }}>
          <div className="container-fluid">
            <div className="row align-items-center kyn-header-row" style={{ width: "100%", margin: 0, minHeight: 78, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
              {/* Logo */}
              <div className="col-lg-2 col-md-6 col-6" style={{ flex: "0 0 auto", width: "auto", padding: 0 }}>
                <div className="navbar-header">
                  <Link href="/" className="navbar-brand kyn-logo" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
                    <span className="kyn-logo-mark" style={{ width: 44, height: 44, borderRadius: 12, background: "#18322E", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.05rem" }}>
                      C
                    </span>
                    <span>
                      <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", color: "#061408", display: "block", lineHeight: 1.05 }}>CHRISCO</span>
                      <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.64rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#F74F22", display: "block" }}>Digital Academy</span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Desktop nav */}
              <div className="col-lg-6 col-md-1 col-1 hide-mobile" style={{ flex: "1 1 auto", display: "flex", justifyContent: "center", padding: 0 }}>
                <div id="navbar" className="collapse navbar-collapse navigation-holder" style={{ display: "flex" }}>
                  <ul id="menu-1" className="nav navbar-nav mb-2 mb-lg-0" style={{ display: "flex", alignItems: "center", gap: 2, listStyle: "none", margin: 0, padding: 0, flexWrap: "nowrap" }}>
                    {links.map((link) => {
                      const active = isActive(link.href)
                      return (
                        <li key={link.href} className={active ? "current-menu-item" : ""} style={{ position: "relative" }}>
                          <Link
                            href={link.href}
                            className="kyn-nav-link"
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: active ? 800 : 600,
                              fontSize: 15,
                              color: active ? "#F74F22" : "#1A2B26",
                              padding: "10px 11px",
                              textDecoration: "none",
                              whiteSpace: "nowrap",
                              display: "inline-block",
                              position: "relative",
                            }}
                          >
                            {link.label}
                          </Link>
                        </li>
                      )
                    })}
                    {/* Primary CTA */}
                    <li className="kyn-donate" style={{ marginLeft: 8 }}>
                      {user ? (
                        <Link href="/dashboard" className="btn-kyn-donate" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "11px 18px", fontWeight: 800, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                          Dashboard →
                        </Link>
                      ) : (
                        <Link href="/sign-up" className="btn-kyn-donate" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "11px 18px", fontWeight: 800, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                          Join Free →
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mobile / desktop auth + hamburger */}
              <div className="col-lg-4 col-md-3 col-3 d-lg-none dl-block hide-mobile" style={{ flex: "0 0 auto", width: "auto", display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end", padding: 0 }}>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 12px 7px 8px",
                        borderRadius: 999,
                        border: "1px solid #E8EDE9",
                        background: "#FAF9F6",
                        color: "#061408",
                        textDecoration: "none",
                        fontFamily: "var(--font-head)",
                        fontSize: 12.5,
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#F74F22", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11 }}>
                        {(profile?.name || user.email)?.[0]?.toUpperCase()}
                      </span>
                      <span>{profile?.name?.split(" ")[0] || "Student"}</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      style={{
                        background: "transparent",
                        border: "1px solid #E8EDE9",
                        color: "#5A6A62",
                        padding: "8px 14px",
                        borderRadius: 999,
                        fontFamily: "var(--font-head)",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/sign-in" style={{ color: "#061408", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, textDecoration: "none", padding: "8px 10px" }}>
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile hamburger */}
              <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block hide-desktop" style={{ flex: "0 0 auto", width: "auto", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: 0 }}>
                <div className="mobail-menu">
                  <button
                    type="button"
                    className="navbar-toggler open-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                    style={{
                      background: menuOpen ? "#F74F22" : "#FAF9F6",
                      border: "1px solid #E8EDE9",
                      color: menuOpen ? "#fff" : "#18322E",
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Icon name={menuOpen ? "x" : "menu"} size={20} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="hide-desktop"
          style={{
            background: "#fff",
            borderTop: "1px solid #E8EDE9",
            padding: "18px 20px 24px",
            boxShadow: "0 12px 32px rgba(24,50,46,0.08)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "13px 14px",
                    borderRadius: 12,
                    fontFamily: "var(--font-head)",
                    fontSize: 15,
                    fontWeight: active ? 800 : 600,
                    color: active ? "#fff" : "#061408",
                    background: active ? "#F74F22" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              )
            })}

          </div>

          <div style={{ borderTop: "1px solid #E8EDE9", marginTop: 16, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {user ? (
              <>
                <div style={{ color: "#18322E", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13 }}>Signed in as {profile?.name || user.email}</div>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    background: "#18322E",
                    color: "#fff",
                    border: "none",
                    padding: "13px",
                    borderRadius: 999,
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textAlign: "center",
                    padding: "13px",
                    borderRadius: 999,
                    border: "1.5px solid #18322E",
                    color: "#18322E",
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textAlign: "center",
                    padding: "13px",
                    borderRadius: 999,
                    background: "#F74F22",
                    color: "#fff",
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Join Free →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
