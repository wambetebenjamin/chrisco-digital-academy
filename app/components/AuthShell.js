import Link from "next/link"
import Image from "next/image"

export default function AuthShell({ children, subtitle }) {
 return (
 <main style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr", background: "var(--paper)" }}>
 {/* Left brand panel */}
 <aside className="hide-mobile" style={{ background: "var(--purple)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 48px", borderRight: "4px solid var(--ink)" }}>
 <div aria-hidden style={{ position: "absolute", inset: 0 }}>
 <Image src="/images/bg-home.jpg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" style={{ objectFit: "cover", objectPosition: "center 30%", opacity: 0.22 }} />
 </div>
 {/* Chunky shapes */}
 <div aria-hidden style={{ position: "absolute", width: 320, height: 320, borderRadius: 40, background: "var(--lime)", top: -80, right: -80, border: "4px solid var(--ink)", transform: "rotate(18deg)", boxShadow: "10px 10px 0 0 var(--ink)" }} />
 <div aria-hidden style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "var(--pink)", bottom: -60, left: -60, border: "4px solid var(--ink)", boxShadow: "8px 8px 0 0 var(--ink)" }} />

 <div style={{ position: "relative", zIndex: 1 }}>
 <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
 <span style={{ width: 52, height: 52, borderRadius: 14, background: "var(--lime)", border: "3px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--ink)", transform: "rotate(-4deg)", boxShadow: "4px 4px 0 0 var(--ink)" }}>
 C
 </span>
 <span style={{ lineHeight: 1 }}>
 <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "#fff", display: "block" }}>CHRISCO</span>
 <span style={{ fontFamily: "var(--font-head)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--lime)" }}>
 Digital Academy
 </span>
 </span>
 </Link>
 </div>

 <div style={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
 <span className="sticker yellow" style={{ marginBottom: 20 }}> Learn · Earn · Grow</span>
 <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "clamp(2rem, 3.6vw, 3.2rem)", lineHeight: 0.98, textTransform: "uppercase", margin: "22px 0 18px" }}>
 Learn skills <br />
 that <span style={{ color: "var(--lime)", textShadow: "3px 3px 0 var(--ink)" }}>pay</span> for life.
 </h2>
 <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem", lineHeight: 1.65, fontWeight: 500 }}>
 {subtitle}
 </p>
 <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}>
 {["Streaks", "Bite Videos", "AI Help", "Buddies"].map((t, i) => (
 <span key={t} className={`sticker ${["lime", "pink", "yellow", "white"][i]}`} style={{ fontSize: 11 }}>{t}</span>
 ))}
 </div>
 </div>

 <div style={{ position: "relative", zIndex: 1, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 700 }}>
 © 2026 CHRISCO Digital Academy · Nairobi, Kenya
 </div>
 </aside>

 {/* Right form panel */}
 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", minHeight: "100vh", position: "relative" }}>
 <div style={{ width: "100%", maxWidth: 480 }}>
 {/* Mobile brand */}
 <div className="hide-desktop" style={{ textAlign: "center", marginBottom: 32 }}>
 <Link href="/" style={{ textDecoration: "none" }}>
 <span style={{ width: 64, height: 64, borderRadius: 18, background: "var(--lime)", border: "3px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--ink)", transform: "rotate(-4deg)", boxShadow: "5px 5px 0 0 var(--ink)" }}>
 C
 </span>
 </Link>
 <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--ink)", marginTop: 14 }}>
 CHRISCO Digital Academy
 </div>
 </div>

 <div className="card" style={{ padding: 36, background: "#fff" }}>
 {children}
 </div>
 </div>
 </div>

 <style jsx>{`
 @media (min-width: 768px) {
 main { grid-template-columns: 1fr 1fr !important; }
 }
 `}</style>
 </main>
 )
}
