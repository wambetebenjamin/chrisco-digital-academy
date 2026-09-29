import Image from "next/image"
import AccentShapes from "./AccentShapes"
import Reveal from "./Reveal"

/*
 * PhotoBand — a full-bleed photographic CTA band.
 *
 * The photograph runs at full opacity with a slow Ken-Burns push and a
 * directional gradient scrim for text contrast, plus drifting brand orbs.
 */
export default function PhotoBand({
  image = "/images/bg-cta.jpg",
  eyebrow,
  title,
  body,
  children,
  centered = false,
  imagePosition = "center 40%",
}) {
  return (
    <section
      className="section"
      style={{ position: "relative", overflow: "hidden", background: "var(--navy)", padding: "112px 0" }}
    >
      <div className="kenburns-media" aria-hidden>
        <div className="kenburns-slow" style={{ position: "absolute", inset: 0 }}>
          <Image
            src={image}
            alt=""
            fill
            loading="lazy"
            quality={80}
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: imagePosition,
              filter: "saturate(1.18) contrast(1.05) brightness(1.03)",
            }}
          />
        </div>
      </div>

      <div aria-hidden className={centered ? "scrim-soft" : "scrim-band"} />
      <div className="aurora" aria-hidden style={{ opacity: 0.45 }} />
      <AccentShapes variant="band" />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: centered ? "center" : "left" }}>
        <div
          style={
            centered
              ? { maxWidth: 660, margin: "0 auto" }
              : { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }
          }
        >
          <Reveal variant="up" style={centered ? {} : { maxWidth: 620 }}>
            {eyebrow && (
              <span className="eyebrow on-dark" style={centered ? { justifyContent: "center" } : {}}>
                {eyebrow}
              </span>
            )}
            <h2
              className="display on-dark"
              style={{ fontSize: "clamp(1.9rem, 4.2vw, 3.1rem)", marginTop: 14, textShadow: "0 2px 24px rgba(0,18,28,0.45)" }}
            >
              {title}
            </h2>
            {body && (
              <p
                style={{
                  marginTop: 16,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.02rem",
                  lineHeight: 1.7,
                  textShadow: "0 1px 16px rgba(0,18,28,0.5)",
                }}
              >
                {body}
              </p>
            )}
          </Reveal>
          {children && (
            <Reveal
              variant={centered ? "up" : "right"}
              delay={120}
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: centered ? 30 : 0,
                justifyContent: centered ? "center" : "flex-start",
              }}
            >
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
