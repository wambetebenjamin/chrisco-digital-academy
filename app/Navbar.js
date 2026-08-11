"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "./AuthProvider"
import Icon from "./components/Icon"

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Community", href: "/community" },
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

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "14px 0",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            background: scrolled ? "rgba(255,248,236,0.92)" : "var(--paper)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "3px solid var(--ink)",
            borderRadius: 18,
            padding: "10px 14px 10px 16px",
            boxShadow: "6px 6px 0 0 var(--ink)",
            transition: "all 0.25s ease",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "var(--lime)",
                border: "2.5px solid var(--ink)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                color: "var(--ink)",
                transform: "rotate(-4deg)",
                boxShadow: "3px 3px 0 0 var(--ink)",
              }}
            >
              C
            </span>
            <span style={{ lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  color: "var(--ink)",
                  letterSpacing: "0.01em",
                  display: "block",
                }}
              >
                CHRISCO
              </span>
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "0.66rem",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--purple)",
                }}
              >
                Digital Academy
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: isActive(l.href) ? "var(--ink)" : "var(--body)",
                  textDecoration: "none",
                  fontFamily: "var(--font-head)",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 999,
                  transition: "all 0.2s",
                  background: isActive(l.href) ? "var(--lime)" : "transparent",
                  border: isActive(l.href) ? "2px solid var(--ink)" : "2px solid transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth actions */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="btn btn-purple btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  <Icon name="bolt" size={14} strokeWidth={2.4} /> My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in" style={{ textDecoration: "none", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13, color: "var(--ink)", padding: "8px 10px" }}>
                  Log In
                </Link>
                <Link href="/sign-up" className="btn btn-lime btn-sm" style={{ textDecoration: "none" }}>
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
              background: "var(--ink)",
              border: "2.5px solid var(--ink)",
              color: "var(--lime)",
              width: 44,
              height: 44,
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 18,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={open ? "x" : "menu"} size={22} strokeWidth={2.4} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{
              margin: "10px 0 0",
              padding: 16,
              background: "var(--paper)",
              border: "3px solid var(--ink)",
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              boxShadow: "6px 6px 0 0 var(--ink)",
              animation: "fadeUp 0.3s ease",
            }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: isActive(l.href) ? "var(--ink)" : "var(--body)",
                  textDecoration: "none",
                  fontFamily: "var(--font-head)",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: isActive(l.href) ? "var(--lime)" : "transparent",
                  border: isActive(l.href) ? "2px solid var(--ink)" : "2px solid transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ borderTop: "2px dashed var(--ink)", margin: "10px 0 6px" }} />
            {user ? (
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="btn btn-pink btn-sm"
                style={{ cursor: "pointer", marginTop: 6 }}
              >
                Sign Out
              </button>
            ) : (
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-sm" style={{ textDecoration: "none", flex: 1 }}>
                  Log In
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} className="btn btn-lime btn-sm" style={{ textDecoration: "none", flex: 1 }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
