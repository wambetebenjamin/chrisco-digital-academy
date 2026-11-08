import Image from "next/image"

export default function PhotoBand({ image = "/images/bg-cta.jpg", eyebrow, title, body, children, centered = false, imagePosition = "center 35%" }) {
  return (
    <section className="section" style={{ position: "relative", overflow: "hidden", background: "var(--ink-900)", padding: "88px 0" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0 }}>
        <Image src={image} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: imagePosition, opacity: 0.22 }} />
      </div>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(24,50,46,0.96) 8%, rgba(24,50,46,0.84) 55%, rgba(24,50,46,0.72) 100%)" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(560px 300px at 92% 0%, rgba(247,79,34,0.14), transparent 60%)" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: centered ? "center" : "left" }}>
        <div style={centered ? { maxWidth: 660, margin: "0 auto" } : { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div style={centered ? {} : { maxWidth: 620 }}>
            {eyebrow && <span className="eyebrow on-dark" style={{ color: "var(--ochre-tint)", justifyContent: centered ? "center" : "flex-start" }}>{eyebrow}</span>}
            <h2 className="display on-dark" style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.9rem, 4.2vw, 3.1rem)", marginTop: 14, color: "#fff", lineHeight: 1.08 }}>{title}</h2>
            {body && <p style={{ marginTop: 16, fontWeight: 500, color: "rgba(255,255,255,0.75)", fontSize: "1.02rem", lineHeight: 1.7 }}>{body}</p>}
          </div>
          {children && <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: centered ? 30 : 0, justifyContent: centered ? "center" : "flex-start" }}>{children}</div>}
        </div>
      </div>
    </section>
  )
}
