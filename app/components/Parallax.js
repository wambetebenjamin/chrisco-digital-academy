"use client"

import { useEffect, useRef } from "react"

/*
 * Parallax — drifts its children vertically as the section scrolls past.
 *
 * Deliberately cheap: the scroll handler only schedules one rAF at a time and
 * only runs while the element is on screen (an IntersectionObserver gates it),
 * and it writes a single transform — no layout is ever read in the frame loop
 * beyond one getBoundingClientRect.
 *
 * Disabled entirely when the visitor prefers reduced motion.
 */
export default function Parallax({
  speed = 0.12,        // fraction of scroll distance; 0 = pinned, 0.3 = strong
  className = "",
  style,
  children,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    let visible = false
    let ticking = false

    const update = () => {
      ticking = false
      if (!visible) return
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      // -1 (below the fold) → 1 (scrolled past the top)
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport
      const shift = -progress * speed * 100
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) onScroll()
      },
      { threshold: 0 }
    )
    io.observe(el)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    onScroll()

    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  )
}
