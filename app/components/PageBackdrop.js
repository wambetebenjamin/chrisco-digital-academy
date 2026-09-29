import Image from "next/image"

/*
 * PageBackdrop — a per-page photographic backdrop that spans the FULL page.
 *
 * The image is pinned to the viewport (position: fixed) and sits behind all
 * page content at z-index -1, so it stays put while the page scrolls and the
 * frosted content sections glide over it. That reads as one continuous
 * backdrop for the whole route rather than a photo trapped in a hero band.
 *
 * The photo is now the star, not wallpaper: it gets a slow Ken-Burns drift, a
 * saturation lift, and only a LIGHT paper wash (the frosted sections carry the
 * readability, so the backdrop no longer has to be muted into grey).
 */
export default function PageBackdrop({
  image,
  position = "center 30%",
  // How strongly the paper wash mutes the photo. Higher = quieter backdrop.
  wash = 0.48,
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        background: "var(--paper)",
      }}
    >
      <div className="kenburns-media">
        <div className="kenburns-slow" style={{ position: "absolute", inset: 0 }}>
          <Image
            src={image}
            alt=""
            fill
            priority
            quality={82}
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: position,
              filter: "saturate(1.12) contrast(1.04)",
            }}
          />
        </div>
      </div>

      {/* Paper wash — a light veil only; the photo stays clearly visible */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(250,250,246,${wash - 0.14}) 0%, rgba(250,250,246,${wash}) 45%, rgba(250,250,246,${wash + 0.12}) 100%)`,
        }}
      />

      {/* Brand tint — a whisper of teal/green so it never reads as grey */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 88% 4%, rgba(0,255,132,0.16), transparent 60%), radial-gradient(760px 620px at 4% 96%, rgba(1,58,79,0.14), transparent 62%)",
        }}
      />

      {/* Slow-moving aurora so even the static backdrop feels alive */}
      <div className="aurora" style={{ opacity: 0.45 }} />
    </div>
  )
}
