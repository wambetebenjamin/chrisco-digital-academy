export default function PhotoBand({
  eyebrow,
  title,
  body,
  children,
  centered = false,
}) {
  return (
    <section
      style={{
        background: "#0B1D51",
        padding: "64px 0",
        color: "#FFFFFF",
      }}
    >
      <div className="container">
        <div
          style={
            centered
              ? { maxWidth: 680, margin: "0 auto", textAlign: "center" }
              : {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 36,
                  flexWrap: "wrap",
                }
          }
        >
          <div style={centered ? {} : { maxWidth: 620 }}>
            {eyebrow && (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#F8C90E",
                  marginBottom: 8,
                }}
              >
                {eyebrow}
              </div>
            )}
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                color: "#FFFFFF",
                fontSize: "clamp(22px, 2.6vw, 30px)",
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {title}
            </h2>
            {body && (
              <p
                style={{
                  marginTop: 12,
                  color: "rgba(255,255,255,0.86)",
                  fontSize: 15,
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
                marginTop: centered ? 24 : 0,
                justifyContent: centered ? "center" : "flex-start",
                alignItems: "center",
              }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
