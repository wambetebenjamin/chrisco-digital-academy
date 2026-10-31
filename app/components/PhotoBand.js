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
        background: "#003896",
        borderTop: "4px solid #F8C90E",
        padding: "76px 0",
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0 }}>
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: imagePosition, opacity: 0.18 }}
        />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(11, 29, 81, 0.94) 0%, rgba(0, 56, 150, 0.90) 65%, rgba(8, 78, 200, 0.85) 100%)",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            borderLeft: centered ? "none" : "4px solid #F8C90E",
            paddingLeft: centered ? 0 : "clamp(18px, 3vw, 28px)",
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
                      ? { justifyContent: "center", color: "#F8C90E" }
                      : { color: "#F8C90E" }
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
                    color: "rgba(255,255,255,0.88)",
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
