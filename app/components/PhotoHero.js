/* KYN wpo-page-title style — dark green tint over photo */
export default function PhotoHero({ image, eyebrow, title, lead, children, imagePosition = "center 30%", titleStyle }) {
  return (
    <section className="wpo-page-title" style={{ position: "relative", overflow: "hidden", backgroundImage: image ? `url(${image})` : undefined, backgroundSize: "cover", backgroundPosition: imagePosition, padding: "110px 0 72px" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(24,50,46,0.58), rgba(24,50,46,0.68))" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {eyebrow && <span className="eyebrow on-dark" style={{ color: "#FFD9CF", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", padding: "7px 14px", borderRadius: 999, backdropFilter: "blur(8px)", display: "inline-flex", alignItems: "center", gap: 8 }}>{eyebrow}</span>}
        <h1 className="display on-dark" style={{ marginTop: 18, color: "#fff", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.08, ...titleStyle }}>{title}</h1>
        {lead && <p className="lead" style={{ maxWidth: 620, margin: "18px auto 0", color: "rgba(255,255,255,0.78)", fontSize: "1.02rem", lineHeight: 1.7 }}>{lead}</p>}
        {children && <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>{children}</div>}
        {/* breadcrumb-like tint */}
        <div aria-hidden style={{ marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.60)", fontFamily: "var(--font-head)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Home · {eyebrow || "CHRISCO Digital Academy"}
        </div>
      </div>
    </section>
  )
}
