/*
 * PhotoHero renders the UCU-style full-width institutional banner with a
 * clean translucent blue caption band over the hero photograph.
 */
export default function PhotoHero({ image, eyebrow, title, lead, children, imagePosition = "center 30%", titleStyle }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0B1D51",
        padding: "clamp(140px, 17vw, 184px) 0 28px",
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
          }}
        />
      )}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 1120,
            background: "rgba(8, 46, 118, 0.64)",
            padding: "22px 26px 24px",
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
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              color: "#FFFFFF",
              fontSize: "clamp(22px, 2.6vw, 32px)",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.25,
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
                color: "#FFFFFF",
                fontSize: "clamp(17px, 1.7vw, 22px)",
                lineHeight: 1.45,
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
