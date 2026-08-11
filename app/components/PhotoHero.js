import Image from "next/image"

export default function PhotoHero({ image, eyebrow, title, lead, children, imagePosition = "center 30%", titleStyle }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--navy)", padding: "158px 0 76px" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0 }}>
        <Image src={image} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: imagePosition, opacity: 0.5 }} />
      </div>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(112deg, rgba(0,35,51,0.96) 0%, rgba(0,35,51,0.82) 46%, rgba(1,58,79,0.62) 100%)" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(640px 320px at 88% 8%, rgba(0,255,132,0.16), transparent 62%)" }} />
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(0deg, var(--paper), transparent)" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {eyebrow && <span className="eyebrow on-dark fade-up">{eyebrow}</span>}
        <h1 className="display on-dark fade-up fade-up-1" style={{ marginTop: 20, ...titleStyle }}>{title}</h1>
        {lead && <p className="lead fade-up fade-up-2" style={{ maxWidth: 620, marginTop: 24, color: "rgba(255,255,255,0.78)" }}>{lead}</p>}
        {children}
      </div>
    </section>
  )
}
