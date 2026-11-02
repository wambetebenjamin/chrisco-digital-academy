/*
 * PhotoHero renders the UCU-style full-width institutional banner with a
 * bottom-left dark navy translucent caption panel styled in our Teens AI
 * Bootcamp poster colors (#0B1D51, #003896, #E60914, #F8C90E).
 */
export default function PhotoHero({ image, eyebrow, title, lead, children, imagePosition = "center 30%", titleStyle }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0B1D51",
        padding: "clamp(132px, 16vw, 172px) 0 clamp(44px, 6vw, 64px)",
        borderBottom: "4px solid #F8C90E",
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
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(11,29,81,0.78) 0%, rgba(0,56,150,0.45) 55%, rgba(11,29,81,0.28) 100%)",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 780,
            background: "rgba(11, 29, 81, 0.90)",
            borderLeft: "6px solid #E60914",
            borderTop: "3px solid #F8C90E",
            borderRadius: "0 12px 12px 0",
            padding: "clamp(22px, 3.5vw, 34px)",
            color: "#FFFFFF",
          }}
        >
          {eyebrow && (
            <span
              style={{
                display: "inline-block",
                background: "#E60914",
                color: "#FFFFFF",
                padding: "4px 12px",
                borderRadius: 4,
                fontFamily: "var(--font-head)",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              {eyebrow}
            </span>
          )}
          <h1
            className="display on-dark fade-up fade-up-1"
            style={{
              marginTop: 4,
              color: "#FFFFFF",
              fontSize: "clamp(1.7rem, 3.2vw, 2.55rem)",
              ...titleStyle,
            }}
          >
            {title}
          </h1>
          {lead && (
            <p
              className="lead fade-up fade-up-2"
              style={{
                maxWidth: 640,
                marginTop: 14,
                color: "rgba(255,255,255,0.88)",
                fontSize: "clamp(0.95rem, 1.3vw, 1.08rem)",
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
