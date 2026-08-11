import Image from "next/image"

export default function PhotoBand({
 image = "/images/bg-cta.jpg",
 eyebrow,
 title,
 body,
 children,
 centered = false,
 imagePosition = "center 35%",
 tone = "purple", // purple, lime, pink, ink
}) {
 const bg = {
 purple: "var(--purple)",
 lime: "var(--lime)",
 pink: "var(--pink)",
 ink: "var(--ink)",
 }[tone]
 const textColor = tone === "lime" ? "var(--ink)" : "#fff"

 return (
 <section className="section" style={{ padding: "90px 0", position: "relative" }}>
 <div className="container">
 <div
 className="photo-frame"
 style={{
 background: bg,
 color: textColor,
 padding: "56px 48px",
 boxShadow: "12px 12px 0 0 var(--ink)",
 position: "relative",
 }}
 >
 {/* Framed photo peeking in the corner */}
 <div
 aria-hidden
 style={{
 position: "absolute",
 right: 40,
 bottom: 26,
 width: 220,
 height: 160,
 borderRadius: 20,
 overflow: "hidden",
 border: "3px solid var(--ink)",
 boxShadow: "6px 6px 0 0 var(--ink)",
 display: "none",
 }}
 className="hide-mobile"
 >
 <Image src={image} alt="" fill sizes="220px" style={{ objectFit: "cover", objectPosition: imagePosition }} />
 </div>

 <div style={centered ? { maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 } : { maxWidth: 700, position: "relative", zIndex: 1 }}>
 {eyebrow && (
 <span
 className={`sticker ${tone === "lime" ? "ink" : "lime"}`}
 style={centered ? {} : {}}
 >
 {eyebrow}
 </span>
 )}
 <h2
 className="display"
 style={{
 fontSize: "clamp(2rem, 5vw, 3.4rem)",
 marginTop: 18,
 color: textColor,
 }}
 >
 {title}
 </h2>
 {body && (
 <p
 style={{
 marginTop: 18,
 fontSize: "1.1rem",
 lineHeight: 1.65,
 color: tone === "lime" ? "var(--ink)" : "rgba(255,255,255,0.92)",
 fontWeight: 500,
 }}
 >
 {body}
 </p>
 )}
 {children && (
 <div
 style={{
 display: "flex",
 gap: 14,
 flexWrap: "wrap",
 marginTop: 28,
 justifyContent: centered ? "center" : "flex-start",
 }}
 >
 {children}
 </div>
 )}
 </div>
 </div>
 </div>
 </section>
 )
}
