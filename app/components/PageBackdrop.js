import Image from "next/image"

/*
 * PageBackdrop, a per-page photograph that spans the FULL page.
 *
 * The image is pinned to the viewport (position: fixed) and sits behind all
 * page content at z-index -1, so it stays put while the page scrolls and the
 * frosted content sections glide over it.
 *
 * The wash is deliberately light: the photograph should be recognisable, not
 * hidden. Content bands carry their own frosted surface for legibility, so the
 * backdrop does not need to be flattened to near-white.
 */
export default function PageBackdrop({
  image,
  position = "center 30%",
  // How strongly the paper wash mutes the photo. Lower = photo more visible.
  wash = 0.52,
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

      {/* Paper wash, keeps the photo readable as texture without erasing it */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(250,250,246,${wash + 0.06}) 0%, rgba(250,250,246,${wash}) 45%, rgba(250,250,246,${wash + 0.04}) 100%)`,
        }}
      />
    </div>
  )
}
