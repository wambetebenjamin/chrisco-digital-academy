"use client"
import Link from "next/link"
import Icon from "./Icon"

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Books Library", href: "/library" },
  { label: "PURSUE Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
]

const services = [
  { label: "Youth Leadership Forums", href: "/courses" },
  { label: "Digital Skills Training", href: "/courses" },
  { label: "Counseling & Mentorship", href: "/about" },
  { label: "Peer Support Groups", href: "/about" },
]

const usefulLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/library" },
  { label: "Volunteer", href: "/contact" },
  { label: "Services", href: "/courses" },
  { label: "Donate", href: "/shop" },
  { label: "Contact", href: "/contact" },
]

export default function Footer() {
  return (
    <footer className="wpo-site-footer clearfix">
      <div className="wpo-upper-footer">
        <div className="footer-widget-area">
          <div className="container">
            <div className="row">
              <div className="separator" style={{ background: "rgba(255,255,255,0.08)", height: 1, marginBottom: 40 }} />
              {/* About widget */}
              <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="about-widget widget text-widget">
                  <div className="widget about-widget">
                    <div className="logo widget-title" style={{ marginBottom: 16 }}>
                      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                        <span
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 12,
                            background: "#fff",
                            color: "#18322E",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            flexShrink: 0,
                          }}
                        >
                          C
                        </span>
                        <span>
                          <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: "1.05rem", display: "block", lineHeight: 1.05 }}>CHRISCO</span>
                          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.64rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#F74F22", display: "block" }}>Digital Academy</span>
                        </span>
                      </Link>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.75 }}>
                      CHRISCO Digital Academy is a youth-led movement creating safe spaces for learning and ensuring every young African has a chance at practical digital education — starting in Jinja, reaching everywhere.
                    </p>
                    <div className="social-icons">
                      <ul style={{ display: "flex", gap: 10, listStyle: "none", margin: "18px 0 0", padding: 0 }}>
                        <li>
                          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Icon name="facebook" size={12} />
                          </a>
                        </li>
                        <li>
                          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Icon name="linkedin" size={12} />
                          </a>
                        </li>
                        <li>
                          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Icon name="instagram" size={12} />
                          </a>
                        </li>
                        <li>
                          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <Icon name="play" size={12} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="widget link-widget">
                  <div className="widget-title">
                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 16, margin: "0 0 18px" }}>Services</h3>
                  </div>
                  <div>
                    <div className="menu-service-menu-container">
                      <ul id="menu-service" className="menu" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {services.map((s) => (
                          <li key={s.label}>
                            <a href={s.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Useful Links */}
              <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="widget link-widget">
                  <div className="widget-title">
                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 16, margin: "0 0 18px" }}>Useful Links</h3>
                  </div>
                  <div>
                    <div className="menu-footer-menu-container">
                      <ul id="menu-footer" className="menu" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {usefulLinks.map((l) => (
                          <li key={l.label}>
                            <Link href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="newsletter-s2 widget widget_mc4wp_form_widget">
                  <div className="widget-title">
                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 16, margin: "0 0 18px" }}>Subscribe Newsletter</h3>
                  </div>
                  <form
                    className="mc4wp-form"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      const email = fd.get("EMAIL")
                      if (email) window.location.href = `mailto:chriscoyouthaflame2025@gmail.com?subject=Subscribe&body=${encodeURIComponent(email)}`
                    }}
                  >
                    <div className="mc4wp-form-fields">
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.68)", margin: "0 0 14px" }}>
                        Get updates on our digital skills, youth mentorship and creative skills work with young people in Africa.
                      </p>
                      <div className="form-fild" style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: 4, marginTop: 14 }}>
                        <input type="email" name="EMAIL" placeholder="Email Address" className="fild" required style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: "10px 16px", fontSize: 14, outline: "none" }} />
                        <button type="submit" aria-label="Subscribe" style={{ width: 40, height: 40, borderRadius: "50%", background: "#F74F22", border: "none", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                          <Icon name="send" size={14} />
                        </button>
                      </div>
                    </div>
                  </form>
                  <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                    <a href="mailto:chriscoyouthaflame2025@gmail.com" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon name="mail" size={14} /> chriscoyouthaflame2025@gmail.com
                    </a>
                    <a href="https://wa.me/254112272061" style={{ color: "#fff", background: "#F74F22", borderRadius: 999, padding: "10px 16px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontWeight: 700, width: "fit-content", marginTop: 6 }}>
                      <Icon name="whatsapp" size={14} /> WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wpo-lower-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.10)", padding: "22px 0", textAlign: "center" }}>
        <div className="container">
          <div className="row">
            <div className="separator" style={{ display: "none" }} />
            <div className="col col-xs-12">
              <p className="copyright" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                © Copyright <a href="/" style={{ color: "#fff", textDecoration: "none" }}>CHRISCO Digital Academy</a> | All rights reserved. &nbsp;·&nbsp; Founded by Wambete Benjamin · Jinja, Uganda &nbsp;·&nbsp; <a href="#" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Back to top ↑</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
