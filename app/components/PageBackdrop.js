import Image from "next/image"

/*
 * PageBackdrop — KYN paper wash, very subtle
 * Keeps CHRISCO assets (images) visible but muted so frosted sections stay legible.
 * Uses KYN palette: warm paper #FAF9F6 with faint green tint.
 */
export default function PageBackdrop({
  image,
  position = "center 30%",
  wash = 0.86,
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(250,249,246,${wash - 0.06}) 0%, rgba(250,249,246,${wash + 0.02}) 45%, rgba(250,249,246,${wash + 0.06}) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 88% 4%, rgba(247,79,34,0.06), transparent 60%), radial-gradient(760px 620px at 4% 96%, rgba(24,50,46,0.06), transparent 62%)",
        }}
      />
    </div>
  )
}
