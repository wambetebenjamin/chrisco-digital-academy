import Image from "next/image"

/*
 * PageBackdrop: a per-page photographic backdrop that spans the full page.
 *
 * Neo-brutalist version: the photo is presented as a giant framed picture
 * fixed behind all content. A cream wash keeps text readable while letting
 * the photo read as texture, with chunky purple/lime splashes for vibe.
 */
export default function PageBackdrop({
  image,
  position = "center 30%",
  wash = 0.82,
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        padding: 18,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 18,
          borderRadius: 28,
          overflow: "hidden",
          border: "3px solid var(--ink)",
          boxShadow: "10px 10px 0 0 var(--ink)",
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
        {/* Cream wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(255,248,236,${wash - 0.02}) 0%, rgba(255,248,236,${wash + 0.05}) 55%, rgba(243,234,216,${wash + 0.08}) 100%)`,
          }}
        />
        {/* Colored splashes */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(600px 420px at 88% 4%, rgba(198,255,61,0.22), transparent 60%), radial-gradient(700px 500px at 6% 92%, rgba(124,58,237,0.22), transparent 62%), radial-gradient(520px 320px at 50% 20%, rgba(255,79,163,0.12), transparent 60%)",
          }}
        />
        {/* Dot grid texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(10,10,10,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  )
}
