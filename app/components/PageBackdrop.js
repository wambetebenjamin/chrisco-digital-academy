import Image from "next/image"

/*
 * PageBackdrop — a per-page photographic backdrop that spans the FULL page.
 *
 * The image is pinned to the viewport (position: fixed) and sits behind all
 * page content at z-index -1, so it stays put while the page scrolls and the
 * frosted content sections glide over it. That reads as one continuous
 * backdrop for the whole route rather than a photo trapped in a hero band.
 *
 * A paper-tinted wash keeps the photo subtle enough that the light editorial
 * sections layered on top stay readable — the photo is texture, not subject.
 */
export default function PageBackdrop({
  image,
  position = "center 30%",
  // How strongly the paper wash mutes the photo. Higher = quieter backdrop.
  wash = 0.78,
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: "var(--paper)",
      }}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: position }}
      />

      {/* Paper wash — mutes the photo so frosted sections stay legible */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(250,250,246,${wash - 0.06}) 0%, rgba(250,250,246,${wash + 0.06}) 45%, rgba(250,250,246,${wash + 0.1}) 100%)`,
        }}
      />

      {/* Brand tint — a whisper of teal/green so it never reads as grey */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 88% 4%, rgba(0,255,132,0.09), transparent 60%), radial-gradient(760px 620px at 4% 96%, rgba(1,58,79,0.10), transparent 62%)",
        }}
      />
    </div>
  )
}
