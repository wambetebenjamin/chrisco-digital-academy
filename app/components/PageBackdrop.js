import Image from "next/image"

/*
 * PageBackdrop — a per-page photographic backdrop that spans the full page.
 *
 * The photo is presented as a large framed picture pinned behind all content.
 * The wash is intentionally light so the photograph reads vividly; content
 * bands add their own frosted surfaces only where legibility needs it.
 */
export default function PageBackdrop({
 image,
 position = "center 30%",
  wash = 0.22,
}) {
 return (
 <div
 aria-hidden
 style={{
 position: "fixed",
 inset: 0,
 zIndex: -1,
 pointerEvents: "none",
 padding: 14,
 }}
 >
 <div
 style={{
 position: "absolute",
 inset: 14,
 borderRadius: 28,
 overflow: "hidden",
 border: "4px solid var(--ink)",
 boxShadow: "12px 12px 0 0 var(--ink)",
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
      {/* Light cream wash just to take the edge off contrast; photos stay vivid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,248,236,${wash}) 0%, rgba(255,248,236,${wash + 0.06}) 55%, rgba(243,234,216,${wash + 0.10}) 100%)`,
        }}
      />
      {/* Stronger colored glows for a vibrant neo-brutalist vibe */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(720px 520px at 88% 6%, rgba(198,255,61,0.28), transparent 62%), radial-gradient(760px 560px at 4% 94%, rgba(124,58,237,0.26), transparent 62%), radial-gradient(560px 400px at 60% 20%, rgba(255,79,163,0.18), transparent 60%), radial-gradient(520px 400px at 20% 50%, rgba(255,210,63,0.14), transparent 60%)",
          mixBlendMode: "soft-light",
        }}
      />
      {/* A thin ink vignette at the edges to frame the content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(10,10,10,0.30) 100%)",
        }}
      />
      {/* Light dot texture for that neo-brutalist zine feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(10,10,10,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          mixBlendMode: "multiply",
          opacity: 0.45,
        }}
      />
 </div>
 </div>
 )
}
