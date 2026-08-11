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
 wash = 0.32,
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
 {/* Very light cream wash just to take the edge off contrast;
 the photo should remain vividly visible. */}
 <div
 style={{
 position: "absolute",
 inset: 0,
 background: `linear-gradient(180deg, rgba(255,248,236,${wash}) 0%, rgba(255,248,236,${wash + 0.08}) 60%, rgba(243,234,216,${wash + 0.12}) 100%)`,
 }}
 />
 {/* Subtle colored glows — kept faint so they don't wash out the photo */}
 <div
 style={{
 position: "absolute",
 inset: 0,
 background:
 "radial-gradient(700px 500px at 88% 6%, rgba(198,255,61,0.18), transparent 62%), radial-gradient(760px 560px at 4% 94%, rgba(124,58,237,0.18), transparent 62%), radial-gradient(520px 380px at 50% 18%, rgba(255,79,163,0.10), transparent 60%)",
 }}
 />
 {/* Light dot texture for that neo-brutalist zine feel */}
 <div
 style={{
 position: "absolute",
 inset: 0,
 backgroundImage: "radial-gradient(rgba(10,10,10,0.06) 1px, transparent 1px)",
 backgroundSize: "24px 24px",
 mixBlendMode: "multiply",
 opacity: 0.35,
 }}
 />
 </div>
 </div>
 )
}
