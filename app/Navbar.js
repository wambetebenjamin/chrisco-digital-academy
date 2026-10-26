"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "./AuthProvider"
import Icon from "./components/Icon"
import { courses, categories } from "./data/courses"

/* ------------------------------------------------------------------
   Navigation model
   ------------------------------------------------------------------
   Mirrors the layered college-site navigation pattern: a slim utility
   strip, a quiet brand bar, and grouped dropdown panels. Everything is
   expressed with the CHRISCO palette, navy planes, paper panels, a
   single green accent per surface, so the menus feel layered rather
   than flooded with brand green.
------------------------------------------------------------------- */

const aboutLinks = [
  { label: "Who We Are", desc: "Our story, mission and values", href: "/about", icon: "users" },
  { label: "Our Mission", desc: "Why we bridge the digital divide", href: "/about#mission", icon: "target" },
  { label: "Meet Our Tutor", desc: "Who teaches our courses", href: "/about#tutor", icon: "cap" },
  { label: "Become a Tutor", desc: "Teach a track with us", href: "/become-a-tutor", icon: "send" },
  { label: "Contact Us", desc: "Talk to us on WhatsApp or email", href: "/contact", icon: "mail" },
]

const programLinks = [
  { label: "Online Learning", desc: "Study from anywhere in Africa", href: "/courses", icon: "laptop" },
  { label: "In-Person Classes", desc: "Classroom cohorts, scheduled monthly", href: "/contact", icon: "pin" },
  { label: "Youth & Community", desc: "CHRISCO Youth Aflame programmes", href: "/about", icon: "flame" },
  { label: "Corporate Training", desc: "Upskill your team with us", href: "/contact", icon: "briefcase" },
  { label: "Become a Tutor", desc: "Teach what you already do", href: "/become-a-tutor", icon: "send" },
]

const studentLinks = [
  { label: "Student Dashboard", desc: "Your courses and progress", href: "/dashboard", icon: "grid" },
  { label: "Affiliate Programme", desc: "Share your link and earn", href: "/affiliates", icon: "cash" },
  { label: "Log In", desc: "Pick up where you left off", href: "/sign-in", icon: "lock" },
  { label: "Create Account", desc: "Join the academy in minutes", href: "/sign-up", icon: "user" },
  { label: "Course Guidance", desc: "Not sure what to study? Ask us", href: "/contact", icon: "chat" },
]

// Grouped the way a catalogue reads: earn, market, build.
const courseGroups = [
  { title: "Business & Career", cats: ["Business", "Career"], icon: "briefcase" },
  { title: "Marketing & Content", cats: ["Marketing", "Writing"], icon: "chart" },
  { title: "Design & Build", cats: ["Design", "Video", "Coding"], icon: "code" },
]

function courseHref(category, id) {
  return `/courses?category=${encodeURIComponent(category)}&course=${id}`
}

/*
 * When the catalogue is already on screen, a query-only navigation does not
 * remount it. This event lets the explorer react immediately while the router
 * still updates the URL for shareable links.
 */
function notifyCatalogue(category, courseId) {
  if (typeof window === "undefined") return
  if (window.location.pathname !== "/courses") return
  window.dispatchEvent(
    new CustomEvent("chrisco:catalogue", { detail: { category, courseId } })
  )
}

/* --------------------------- Desktop bits --------------------------- */

function Dropdown({ id, label, open, setOpen, pinned, setPinned, children, wide = false }) {
  const closeTimer = useRef(null)
  const isOpen = open === id

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const enter = () => {
    cancelClose()
    setOpen(id)
  }

  /*
   * Hovering out is forgiving: the panel holds for 400ms and the CSS bridge
   * covers the gap, so a diagonal move to the menu never closes it. Once a
   * panel has been clicked open it stays pinned until you click the trigger
   * again, press Escape, or click outside.
   */
  const leave = () => {
    if (pinned === id) return
    cancelClose()
    closeTimer.current = setTimeout(() => {
      setOpen((current) => (current === id ? null : current))
    }, 400)
  }

  const toggle = () => {
    cancelClose()
    if (isOpen && pinned === id) {
      setPinned(null)
      setOpen(null)
    } else {
      setPinned(id)
      setOpen(id)
    }
  }

  useEffect(() => () => cancelClose(), [])

  return (
    <div
      className={`nav-dd${wide ? " nav-dd--wide" : ""}${isOpen ? " is-open" : ""}${pinned === id ? " is-pinned" : ""}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        type="button"
        className="nav-trigger"
        aria-expanded={isOpen}
        onClick={toggle}
        onFocus={enter}
      >
        {label}
        <Icon name="chevron" size={12} strokeWidth={2.6} className="nav-caret" />
      </button>
      <div className="nav-panel" aria-label={label}>
        {children}
      </div>
    </div>
  )
}

function PanelList({ items, onNavigate }) {
  return (
    <div className="nav-panel-list">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="nav-panel-link" onClick={onNavigate}>
          <span className="nav-panel-ico">
            <Icon name={item.icon} size={16} strokeWidth={1.9} />
          </span>
          <span className="nav-panel-copy">
            <span className="nav-panel-title">{item.label}</span>
            <span className="nav-panel-desc">{item.desc}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}

function CoursesMega({ onNavigate, pathname }) {
  return (
    <div className="mega">
      <div className="mega-groups">
        {courseGroups.map((group) => (
          <div className="mega-group" key={group.title}>
            <div className="mega-group-title">
              <Icon name={group.icon} size={13} strokeWidth={2} />
              {group.title}
            </div>
            {group.cats.map((cat) => {
              const catMeta = categories.find((c) => c.name === cat)
              const rows = courses.filter((c) => c.category === cat)
              return (
                <div className="mega-cat" key={cat}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(cat)}`}
                    className="mega-cat-label"
                    onClick={() => {
                      if (pathname === "/courses") notifyCatalogue(cat)
                      onNavigate()
                    }}
                  >
                    {cat}
                    <span className="mega-cat-count">{rows.length}</span>
                  </Link>
                  <ul className="mega-links">
                    {rows.map((course) => (
                      <li key={course.id}>
                        <Link
                          href={courseHref(cat, course.id)}
                          onClick={() => {
                            if (pathname === "/courses") notifyCatalogue(cat, course.id)
                            onNavigate()
                          }}
                        >
                          <Icon name={catMeta?.icon || "layers"} size={13} strokeWidth={2} />
                          <span>{course.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Side rail, the calm, dark plane that anchors the wide panel */}
      <aside className="mega-rail">
        <span className="mega-rail-eyebrow">Start here</span>
        <div className="mega-rail-title">Find your track in minutes</div>
        <p className="mega-rail-body">
          Seven tracks, nineteen practical courses. Every one ends with a project you can show a client or employer.
        </p>
        <Link href="/courses" className="btn btn-green btn-sm" style={{ width: "100%", textDecoration: "none" }} onClick={onNavigate}>
          Browse all courses →
        </Link>
        <div className="mega-rail-rule" />
        <Link href="/contact" className="mega-rail-link" onClick={onNavigate}>
          <Icon name="chat" size={14} strokeWidth={2} /> Need help choosing?
        </Link>
        <div className="mega-rail-stats">
          <div>
            <strong>19</strong>
            <span>courses</span>
          </div>
          <div>
            <strong>7</strong>
            <span>tracks</span>
          </div>
        </div>
      </aside>
    </div>
  )
}

/* --------------------------- Mobile bits --------------------------- */

function MobileSection({ title, icon, items, onNavigate, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`m-acc${open ? " is-open" : ""}`}>
      <button type="button" className="m-acc-trigger" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="m-acc-label">
          <Icon name={icon} size={15} strokeWidth={2} /> {title}
        </span>
        <Icon name="chevron" size={14} strokeWidth={2.4} className="m-acc-caret" />
      </button>
      {open && (
        <div className="m-acc-body">
          {items && <PanelList items={items} onNavigate={onNavigate} />}
          {children}
        </div>
      )}
    </div>
  )
}

/* ------------------------------ Navbar ------------------------------ */

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [pinnedMenu, setPinnedMenu] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const { user, profile, logout } = useAuth()
  const pathname = usePathname()
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close every layer whenever the route changes. This is deliberate
  // synchronisation with the router (an external store), not derived state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMenu(null)
    setPinnedMenu(null)
    setOpen(false)
  }, [pathname])

  // Escape closes the panel; a click outside the nav does the same.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null)
        setPinnedMenu(null)
        setOpen(false)
      }
    }
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null)
        setPinnedMenu(null)
      }
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [])

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0])

  const closeAll = () => {
    setOpenMenu(null)
    setPinnedMenu(null)
    setOpen(false)
  }

  return (
    <nav ref={navRef} className={`nav-shell${scrolled ? " is-scrolled" : ""}`}>
      {/* Utility strip, the top, quietest layer */}
      <div className="nav-utility">
        <div className="container nav-utility-inner">
          <span className="nav-utility-group">
            <a href="tel:+254112272061" className="nav-utility-icon" aria-label="Call us">
              <Icon name="phone" size={13} strokeWidth={2} />
            </a>
            <a href="mailto:chriscoyouthaflame2025@gmail.com" className="nav-utility-icon" aria-label="Email us">
              <Icon name="mail" size={13} strokeWidth={2} />
            </a>
            <span className="nav-utility-item nav-utility-hours">
              <Icon name="clock" size={12} strokeWidth={2} /> Mon to Sat, 8am to 6pm
            </span>
          </span>
          <span className="nav-utility-group">
            <a href="mailto:chriscoyouthaflame2025@gmail.com" className="nav-utility-link">
              <Icon name="mail" size={12} /> chriscoyouthaflame2025@gmail.com
            </a>
          </span>
        </div>
      </div>

      {/* Brand bar */}
      <div className="nav-bar">
        <div className="container nav-bar-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" onClick={closeAll}>
            <span className="nav-logo-mark">C</span>
            <span className="nav-logo-text">
              <span className="nav-logo-word">CHRISCO</span>
              <span className="nav-logo-sub">Digital Academy</span>
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="nav-menu nav-desktop-only">
            <Link
              href="/"
              className={`nav-link${pathname === "/" ? " is-active" : ""}`}
            >
              Home
            </Link>

            <Dropdown id="about" label="About Us" open={openMenu} setOpen={setOpenMenu} pinned={pinnedMenu} setPinned={setPinnedMenu}>
              <div className="nav-panel-head">
                <span className="nav-panel-eyebrow">The academy</span>
                <span className="nav-panel-head-title">Who we are</span>
              </div>
              <PanelList items={aboutLinks} onNavigate={closeAll} />
            </Dropdown>

            <Dropdown id="courses" label="Courses" open={openMenu} setOpen={setOpenMenu} pinned={pinnedMenu} setPinned={setPinnedMenu} wide>
              <CoursesMega onNavigate={closeAll} pathname={pathname} />
            </Dropdown>

            <Dropdown id="programs" label="Programs" open={openMenu} setOpen={setOpenMenu} pinned={pinnedMenu} setPinned={setPinnedMenu}>
              <div className="nav-panel-head">
                <span className="nav-panel-eyebrow">How you learn</span>
                <span className="nav-panel-head-title">Programs &amp; pathways</span>
              </div>
              <PanelList items={programLinks} onNavigate={closeAll} />
            </Dropdown>

            <Dropdown id="students" label="Students" open={openMenu} setOpen={setOpenMenu} pinned={pinnedMenu} setPinned={setPinnedMenu}>
              <div className="nav-panel-head">
                <span className="nav-panel-eyebrow">Learner hub</span>
                <span className="nav-panel-head-title">Your account</span>
              </div>
              <PanelList items={studentLinks} onNavigate={closeAll} />
            </Dropdown>

            <Link
              href="/shop"
              className={`nav-link${isActive("/shop") ? " is-active" : ""}`}
            >
              Shop
            </Link>

            <Link
              href="/contact"
              className={`nav-link${isActive("/contact") ? " is-active" : ""}`}
            >
              Contact
            </Link>

            {user && (
              <Link href="/dashboard" className={`nav-link${isActive("/dashboard") ? " is-active" : ""}`}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth actions */}
          <div className="nav-actions nav-desktop-only">
            {user ? (
              <>
                <div className="nav-user">
                  <span className="nav-user-avatar">
                    {(profile?.name || user?.email || "U")[0].toUpperCase()}
                  </span>
                  <span className="nav-user-name">
                    {profile?.name || user?.email?.split("@")[0]}
                  </span>
                </div>
                <button onClick={logout} className="pill pill-dark pill-sm" style={{ cursor: "pointer", fontFamily: "var(--font-head)" }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="btn btn-outline-light btn-sm" style={{ textDecoration: "none" }}>
                  Log In
                </Link>
                <Link href="/sign-up" className="btn btn-amber btn-sm" style={{ textDecoration: "none" }}>
                  Apply Now →
                </Link>
              </>
            )}
          </div>

          {/* Burger */}
          <button
            className="nav-burger nav-mobile-only"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Icon name={open ? "x" : "menu"} size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Mobile menu, the same layers, stacked */}
      {open && (
        <div className="nav-mobile">
          <div className="nav-mobile-inner">
            <Link href="/" onClick={closeAll} className={`m-link${pathname === "/" ? " is-active" : ""}`}>
              Home
            </Link>

            <MobileSection title="About Us" icon="users" items={aboutLinks} onNavigate={closeAll} />
            <MobileSection title="Courses" icon="layers" onNavigate={closeAll}>
              <div className="m-cats">
                {courseGroups.map((group) => (
                  <div key={group.title} className="m-cat-group">
                    <div className="m-cat-title">{group.title}</div>
                    {group.cats.map((cat) => {
                      const rows = courses.filter((c) => c.category === cat)
                      return (
                        <div key={cat} className="m-cat">
                          <Link
                            href={`/courses?category=${encodeURIComponent(cat)}`}
                            onClick={() => {
                              if (pathname === "/courses") notifyCatalogue(cat)
                              closeAll()
                            }}
                            className="m-cat-label"
                          >
                            {cat} <span>{rows.length}</span>
                          </Link>
                          {rows.map((course) => (
                            <Link
                              key={course.id}
                              href={courseHref(cat, course.id)}
                              onClick={() => {
                                if (pathname === "/courses") notifyCatalogue(cat, course.id)
                                closeAll()
                              }}
                              className="m-course"
                            >
                              {course.title}
                            </Link>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <Link href="/courses" className="btn btn-green btn-sm" onClick={closeAll} style={{ textDecoration: "none", width: "100%", marginTop: 14 }}>
                Browse all courses →
              </Link>
            </MobileSection>
            <Link href="/shop" onClick={closeAll} className={`m-link${isActive("/shop") ? " is-active" : ""}`}>
              Shop
            </Link>
            <MobileSection title="Programs" icon="rocket" items={programLinks} onNavigate={closeAll} />
            <MobileSection title="Students" icon="cap" items={studentLinks} onNavigate={closeAll} />

            <Link href="/contact" onClick={closeAll} className={`m-link${isActive("/contact") ? " is-active" : ""}`}>
              Contact
            </Link>
            {user && (
              <Link href="/dashboard" onClick={closeAll} className="m-link">Dashboard</Link>
            )}

            <div className="m-rule" />
            {user ? (
              <>
                <div className="m-user">{user?.email}</div>
                <button onClick={logout} className="m-logout">Sign Out</button>
              </>
            ) : (
              <div className="m-auth">
                <Link href="/shop" onClick={closeAll} className="btn btn-outline-light btn-sm" style={{ textDecoration: "none", flex: 1 }}>
                  Shop
                </Link>
                <Link href="/sign-up" onClick={closeAll} className="btn btn-green btn-sm" style={{ textDecoration: "none", flex: 1 }}>
                  Apply Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
