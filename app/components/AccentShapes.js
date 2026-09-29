/*
 * AccentShapes — floating, blurred brand-colour orbs (teal #002333 family +
 * electric green #00FF84) that drift slowly behind hero and CTA content.
 *
 * Pure CSS animation (see `.blob` / `@keyframes drift` in globals.css), so it
 * ships zero JavaScript and pauses under `prefers-reduced-motion`.
 */
export default function AccentShapes({ variant = "hero" }) {
  const sets = {
    hero: [
      { cls: "blob blob-green", style: { width: 360, height: 360, top: "-12%", right: "-6%", opacity: 0.55 } },
      { cls: "blob blob-teal blob-slow blob-delay", style: { width: 420, height: 420, bottom: "-22%", left: "-8%", opacity: 0.5 } },
      { cls: "blob blob-lime blob-delay-2", style: { width: 240, height: 240, top: "42%", right: "28%", opacity: 0.32 } },
    ],
    band: [
      { cls: "blob blob-green blob-delay", style: { width: 300, height: 300, top: "-18%", right: "6%", opacity: 0.5 } },
      { cls: "blob blob-teal blob-slow", style: { width: 340, height: 340, bottom: "-26%", left: "2%", opacity: 0.42 } },
    ],
    soft: [
      { cls: "blob blob-green blob-slow", style: { width: 260, height: 260, top: "-10%", left: "-6%", opacity: 0.3 } },
      { cls: "blob blob-teal blob-delay-2", style: { width: 300, height: 300, bottom: "-18%", right: "-8%", opacity: 0.28 } },
    ],
  }

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {(sets[variant] || sets.hero).map((b, i) => (
        <span key={i} className={b.cls} style={b.style} />
      ))}
    </div>
  )
}
