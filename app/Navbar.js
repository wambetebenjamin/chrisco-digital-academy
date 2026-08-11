"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "./AuthProvider"

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, profile, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: scrolled ? "rgba(0,35,51,0.96)" : "var(--navy)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        transition: "background 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--green)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
              color: "var(--navy)",
              transform: "rotate(-4deg)",
            }}
          >
            C
          </span>
          <span style={{ lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#fff", letterSpacing: "0.01em", display: "block" }}>
              CHRISCO
            </span>
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--green)",
              }}
            >
              Digital Academy
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                position: "relative",
                color: isActive(l.href) ? "#fff" : "rgba(255,255,255,0.65)",
                textDecoration: "none",
                fontFamily: "var(--font-head)",
                fontSize: 14,
                fontWeight: 600,
                padding: "10px 16px",
                borderRadius: 999,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => {
                if (!isActive(l.href)) e.currentTarget.style.color = "rgba(255,255,255,0.65)"
              }}
            >
              {l.label}
              {isActive(l.href) && (
                <span
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 2,
                    height: 2,
                    borderRadius: 2,
                    background: "var(--green)",
                  }}
                />
              )}
            </Link>
          ))}

          {user && (
            <Link
              href="/dashboard"
              style={{
                color: isActive("/dashboard") ? "#fff" : "rgba(255,255,255,0.65)",
                textDecoration: "none",
                fontFamily: "var(--font-head)",
                fontSize: 14,
                fontWeight: 600,
                padding: "10px 16px",
                borderRadius: 999,
              }}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth actions */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  padding: "6px 14px 6px 8px",
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "var(--green)",
                    color: "var(--navy)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                  }}
                >
                  {(profile?.name || user?.email || "U")[0].toUpperCase()}
                </span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {profile?.name || user?.email?.split("@")[0]}
                </span>
              </div>
              <button
                onClick={logout}
                className="pill pill-dark pill-sm"
                style={{ cursor: "pointer", fontFamily: "var(--font-head)" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="pill pill-dark pill-sm" style={{ textDecoration: "none" }}>
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="btn btn-green btn-sm"
                style={{ textDecoration: "none" }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Burger */}
        <button
          className="hide-desktop"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff",
            width: 42,
            height: 42,
            borderRadius: 12,
            cursor: "pointer",
            fontSize: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            margin: "0 24px 16px",
            padding: 20,
            background: "var(--navy-2)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            animation: "fadeUp 0.3s ease",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                color: isActive(l.href) ? "var(--green)" : "rgba(255,255,255,0.75)",
                textDecoration: "none",
                fontFamily: "var(--font-head)",
                fontSize: 15,
                fontWeight: 600,
                padding: "12px 16px",
                borderRadius: 12,
              }}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 600, padding: "12px 16px", borderRadius: 12 }}
            >
              Dashboard
            </Link>
          )}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "12px 0 8px" }} />
          {user ? (
            <>
              <div style={{ padding: "4px 16px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{user?.email}</div>
              <button
                onClick={logout}
                style={{ background: "rgba(229,72,77,0.15)", border: "1px solid rgba(229,72,77,0.3)", color: "#FFB3B6", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 14, padding: "12px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-outline-light btn-sm" style={{ textDecoration: "none", flex: 1 }}>
                Log In
              </Link>
              <Link href="/sign-up" onClick={() => setOpen(false)} className="btn btn-green btn-sm" style={{ textDecoration: "none", flex: 1 }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
