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
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "rgba(11, 29, 81, 0.94)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        className="container"
        style={{
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "var(--green)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              color: "var(--navy)",
              transform: "rotate(-4deg)",
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
                color: "#fff",
                display: "block",
                lineHeight: 1.05,
                letterSpacing: "0.01em",
              }}
            >
              CHRISCO
            </span>
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "0.66rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--green)",
                display: "block",
              }}
            >
              Digital Academy
            </span>
          </span>
        </Link>

        {/* Desktop center nav */}
        <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {links.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: "relative",
                  padding: "9px 18px",
                  borderRadius: 999,
                  fontFamily: "var(--font-head)",
                  fontSize: 13.5,
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--navy)" : "rgba(255,255,255,0.78)",
                  background: active ? "var(--green)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop auth */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 14px 7px 9px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "var(--green)",
                    color: "var(--navy)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {(profile?.name || user.email)?.[0]?.toUpperCase()}
                </span>
                <span>{profile?.name?.split(" ")[0] || "Student"}</span>
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "rgba(255,255,255,0.78)",
                  padding: "9px 18px",
                  borderRadius: 999,
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontFamily: "var(--font-head)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  padding: "9px 18px",
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
              <Link href="/sign-up" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
                Join Free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hide-desktop"
          aria-label="Toggle menu"
          style={{
            background: menuOpen ? "var(--green)" : "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: menuOpen ? "var(--navy)" : "#fff",
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

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="hide-desktop"
          style={{
            background: "var(--navy)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 24px 28px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {links.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "13px 16px",
                    borderRadius: 12,
                    fontFamily: "var(--font-head)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: active ? "var(--navy)" : "#fff",
                    background: active ? "var(--green)" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              marginTop: 18,
              paddingTop: 18,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {user ? (
              <>
                <div style={{ color: "var(--green)", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13 }}>
                  Signed in as {profile?.name || user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline-light btn-sm"
                  style={{ width: "100%", cursor: "pointer" }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-outline-light btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-green btn-sm"
                  style={{ textDecoration: "none" }}
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
