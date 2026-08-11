/*
 * PhotoHero: renders the hero scrim and content only.
 * The route-level PageBackdrop supplies the framed background photo.
 */
export default function PhotoHero({ eyebrow, title, lead, children, titleStyle }) {
 return (
 <section
 style={{
 position: "relative",
 overflow: "hidden",
 padding: "170px 0 90px",
 }}
 >
 <div className="container" style={{ position: "relative", zIndex: 1 }}>
 {eyebrow && <span className="eyebrow purple fade-up">{eyebrow}</span>}
 <h1 className="display fade-up fade-up-1" style={{ marginTop: 22, maxWidth: 900, ...titleStyle }}>
 {title}
 </h1>
 {lead && (
 <p
 className="lead fade-up fade-up-2"
 style={{ maxWidth: 620, marginTop: 24, fontSize: "1.1rem" }}
 >
 {lead}
 </p>
 )}
 {children}
 </div>
 </section>
 )
}
