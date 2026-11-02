/*
 * PhotoHero renders a clean institutional banner with a dark navy/photo
 * background and a calm translucent navy caption block.
 */
export default function PhotoHero({ image, eyebrow, title, lead, children, imagePosition = "center 30%", titleStyle }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0B1D51",
        padding: "clamp(136px, 16vw, 176px) 0 36px",
      }}
    >
      {image && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: imagePosition,
            opacity: 0.35,
          }}
        />
      )}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 1080,
            background: "rgba(11, 29, 81, 0.78)",
            padding: "24px 28px 26px",
            color: "#FFFFFF",
          }}
        >
          {eyebrow && (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                color: "#F8C90E",
                marginBottom: 6,
              }}
            >
              {eyebrow}
            </div>
          )}
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "clamp(24px, 2.8vw, 34px)",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.22,
              ...titleStyle,
            }}
          >
            {title}
          </h1>
          {lead && (
            <p
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                maxWidth: 780,
                marginTop: 12,
                marginBottom: 0,
                color: "rgba(255, 255, 255, 0.92)",
                fontSize: "clamp(16px, 1.55vw, 20px)",
                lineHeight: 1.5,
              }}
            >
              {lead}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
