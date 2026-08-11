"use client"
import Link from "next/link"
import Icon from "./Icon"

export default function Footer() {
 return (
 <footer style={{ background: "var(--ink)", color: "rgba(255,255,255,0.78)", position: "relative", overflow: "hidden", borderTop: "4px solid var(--ink)" }}>
 {/* Giant background wordmark */}
 <div aria-hidden style={{
 position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
 fontFamily: "var(--font-display)", fontSize: "clamp(6rem, 22vw, 18rem)",
 color: "rgba(198,255,61,0.07)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none",
 }}>
 CHRISCO
 </div>

 <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 80, paddingBottom: 36 }}>
 <div className="footer-grid" style={{ display: "grid", gap: 48, gridTemplateColumns: "1fr" }}>
 {/* Brand */}
 <div>
 <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
 <span style={{
 width: 44, height: 44, borderRadius: 12, background: "var(--lime)",
 display: "inline-flex", alignItems: "center", justifyContent: "center",
 fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--ink)",
 transform: "rotate(-4deg)", border: "3px solid var(--lime)", boxShadow: "4px 4px 0 0 rgba(255,255,255,0.2)",
 }}>
 C
 </span>
 <span>
 <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#fff", letterSpacing: "0.01em", display: "block", lineHeight: 1 }}>
 CHRISCO
 </span>
 <span style={{ fontFamily: "var(--font-head)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--lime)" }}>
 Digital Academy
 </span>
 </span>
 </Link>
 <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 20, maxWidth: 320, color: "rgba(255,255,255,0.7)" }}>
 A vibrant, youth focused learning platform under CHRISCO Youth Aflame. We equip young Africans
 with practical digital skills that open real doors.
 </p>
 <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
 {[
 { label: "TikTok", icon: "video" },
 { label: "Instagram", icon: "smartphone" },
 { label: "YouTube", icon: "clapper" },
 { label: "WhatsApp", icon: "whatsapp" },
 ].map((s) => (
 <span key={s.label} className="pill pill-dark" style={{ cursor: "pointer", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)" }}>
 <Icon name={s.icon} size={13} /> {s.label}
 </span>
 ))}
 </div>
 </div>

 {/* Explore */}
 <div>
 <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lime)", marginBottom: 18 }}>
 Explore
 </div>
 <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
 {[
 { label: "Home", href: "/" },
 { label: "About Us", href: "/about" },
 { label: "Courses", href: "/courses" },
 { label: "Community", href: "/community" },
 { label: "Contact", href: "/contact" },
 { label: "Dashboard", href: "/dashboard" },
 ].map((l) => (
 <li key={l.href}>
 <Link href={l.href} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "color 0.2s" }} className="footer-link">
 {l.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Features */}
 <div>
 <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lime)", marginBottom: 18 }}>
 Why Learners Love Us
 </div>
 <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
 {[
 "Daily streaks and XP",
 "Badges and leaderboards",
 "Bite sized 3 to 5 min videos",
 "Study buddies and group rooms",
 "24/7 AI study assistant",
 "Downloadable resource vault",
 ].map((c) => (
 <li key={c} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
 <span style={{ color: "var(--lime)", display: "inline-flex", marginTop: 2 }}><Icon name="check" size={14} strokeWidth={3} /></span> {c}
 </li>
 ))}
 </ul>
 </div>

 {/* Contact */}
 <div>
 <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lime)", marginBottom: 18 }}>
 Contact
 </div>
 <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
 <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
 <span style={{ color: "var(--lime)" }}><Icon name="mail" size={15} /></span> shambetz@gmail.com
 </li>
 <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
 <span style={{ color: "var(--lime)" }}><Icon name="phone" size={15} /></span> +254 112 272 061
 </li>
 <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
 <span style={{ color: "var(--lime)" }}><Icon name="pin" size={15} /></span> Nairobi, Kenya
 </li>
 </ul>
 <a href="https://wa.me/254112272061" className="btn btn-lime btn-sm" style={{ marginTop: 22 }}>
 <Icon name="whatsapp" size={15} /> WhatsApp Us
 </a>
 </div>
 </div>

 {/* Bottom bar */}
 <div style={{ borderTop: "2px solid rgba(255,255,255,0.12)", marginTop: 56, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
 <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
 © 2026 CHRISCO Digital Academy. All rights reserved.
 </span>
 <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
 Founded by Wambete Benjamin · Nairobi, Kenya
 </span>
 </div>
 </div>

 <style jsx>{`
 @media (min-width: 768px) {
 .footer-grid { grid-template-columns: 1.4fr 1fr 1fr 1fr !important; }
 }
 `}</style>
 </footer>
 )
}
