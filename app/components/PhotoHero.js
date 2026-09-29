import Image from "next/image"
import AccentShapes from "./AccentShapes"

/*
 * PhotoHero — the route hero band.
 *
 * It renders its OWN photograph at full strength with a slow Ken-Burns push,
 * then lays a directional gradient scrim (dark at the text edge, clear at the
 * far edge) over it — so the headline stays readable while the image itself is
 * bright, saturated and clearly visible, instead of being buried under a flat
 * dark panel.
 */
export default function PhotoHero({
  image,
  eyebrow,
  title,
  lead,
  children,
  imagePosition = "center 35%",
  titleStyle,
}) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--navy)",
        padding: "158px 0 86px",
      }}
    >
      {image && (
        <div className="kenburns-media" aria-hidden>
          <div className="kenburns" style={{ position: "absolute", inset: 0 }}>
            <Image
              src={image}
              alt=""
              fill
              priority
              quality={82}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: imagePosition,
                filter: "saturate(1.18) contrast(1.06) brightness(1.04)",
              }}
            />
          </div>
        </div>
      )}

      {/* Readability scrim — a gradient, not a flat dark layer */}
      <div aria-hidden className="scrim-hero" />
      <div className="aurora" aria-hidden style={{ opacity: 0.5 }} />
      <AccentShapes variant="hero" />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {eyebrow && <span className="eyebrow on-dark fade-up">{eyebrow}</span>}
        <h1
          className="display on-dark fade-up fade-up-1"
          style={{ marginTop: 20, textShadow: "0 2px 28px rgba(0,18,28,0.45)", ...titleStyle }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="lead fade-up fade-up-2"
            style={{
              maxWidth: 620,
              marginTop: 24,
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 1px 18px rgba(0,18,28,0.5)",
            }}
          >
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
