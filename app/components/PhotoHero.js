/*
 * PhotoHero renders the hero scrim only. The route-level PageBackdrop paints
 * the photograph across the whole page, so the hero deliberately does NOT
 * render its own <Image> -- that would load the same asset twice and stack two
 * different opacities over each other. `image`/`imagePosition` remain in the
 * signature for call-site compatibility.
 */
export default function PhotoHero({ image, eyebrow, title, lead, children, imagePosition = "center 30%", titleStyle }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "rgba(0,35,51,0.18)", padding: "clamp(120px, 16vw, 172px) 0 clamp(56px, 8vw, 76px)" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(112deg, rgba(0,35,51,0.84) 0%, rgba(0,35,51,0.64) 46%, rgba(1,58,79,0.44) 100%)" }} />
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(0deg, rgba(250,250,246,0.55), transparent)" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {eyebrow && <span className="eyebrow on-dark fade-up">{eyebrow}</span>}
        <h1 className="display on-dark fade-up fade-up-1" style={{ marginTop: 20, ...titleStyle }}>{title}</h1>
        {lead && <p className="lead fade-up fade-up-2" style={{ maxWidth: 620, marginTop: 24, color: "rgba(255,255,255,0.78)" }}>{lead}</p>}
        {children}
      </div>
    </section>
  )
}
