import Image from "next/image"

export default function PhotoBand({
  image = "/images/bg-cta.jpg",
  eyebrow,
  title,
  body,
  children,
  centered = false,
  imagePosition = "center 35%",
}) {
  return (
    <section
      className="section"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--navy)",
        padding: "88px 0",
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0 }}>
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: imagePosition, opacity: 0.34 }}
        />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(0, 28, 42, 0.94) 0%, rgba(1, 48, 66, 0.86) 55%, rgba(4, 120, 87, 0.48) 100%)",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "var(--radius-xl)",
            padding: "clamp(32px, 5vw, 52px)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 24px 60px rgba(0, 18, 28, 0.32)",
            textAlign: centered ? "center" : "left",
          }}
        >
          <div
            style={
              centered
                ? { maxWidth: 680, margin: "0 auto" }
                : {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 36,
                    flexWrap: "wrap",
                  }
            }
          >
            <div style={centered ? {} : { maxWidth: 600 }}>
              {eyebrow && (
                <span
                  className="eyebrow on-dark"
                  style={
                    centered
                      ? { justifyContent: "center", color: "var(--cta-warm-light)" }
                      : { color: "var(--cta-warm-light)" }
                  }
                >
                  {eyebrow}
                </span>
              )}
              <h2
                className="display on-dark"
                style={{ fontSize: "clamp(1.85rem, 4vw, 2.9rem)", marginTop: 12 }}
              >
                {title}
              </h2>
              {body && (
                <p
                  style={{
                    marginTop: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "1.02rem",
                    lineHeight: 1.7,
                  }}
                >
                  {body}
                </p>
              )}
            </div>
            {children && (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: centered ? 28 : 0,
                  justifyContent: centered ? "center" : "flex-start",
                  alignItems: "center",
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
