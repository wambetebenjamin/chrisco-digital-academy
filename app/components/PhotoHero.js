/*
 * PhotoHero renders the hero scrim only. The route-level PageBackdrop paints
 * the photograph across the whole page, so the hero deliberately does NOT
 * render its own <Image> -- that would load the same asset twice and stack two
 * different opacities over each other. `image`/`imagePosition` remain in the
 * signature for call-site compatibility.
 */
export default function PhotoHero({ image, eyebrow, title, lead, children, imagePosition = "center 30%", titleStyle }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "rgba(11,29,81,0.34)", padding: "158px 0 76px" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(112deg, rgba(11,29,81,0.92) 0%, rgba(0,56,150,0.80) 48%, rgba(8,78,200,0.62) 100%)" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(640px 320px at 88% 8%, rgba(248,201,14,0.20), transparent 62%), radial-gradient(520px 280px at 14% 92%, rgba(230,9,20,0.16), transparent 60%)" }} />
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(0deg, rgba(247,246,241,0.55), transparent)" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {eyebrow && <span className="eyebrow on-dark fade-up">{eyebrow}</span>}
        <h1 className="display on-dark fade-up fade-up-1" style={{ marginTop: 20, ...titleStyle }}>{title}</h1>
        {lead && <p className="lead fade-up fade-up-2" style={{ maxWidth: 620, marginTop: 24, color: "rgba(255,255,255,0.82)" }}>{lead}</p>}
        {children}
      </div>
    </section>
  )
}
