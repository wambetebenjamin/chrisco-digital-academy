"use client"

import { useEffect, useRef, useState } from "react"

/*
 * Reveal — a featherweight scroll-reveal wrapper.
 *
 * Uses a single IntersectionObserver per element (no scroll listeners, no
 * animation library) and unobserves as soon as the element has played, so
 * scrolling stays at 60fps. The visual states live in globals.css under
 * `.reveal`, which is also where `prefers-reduced-motion` neutralises them.
 */
export default function Reveal({
  as: Tag = "div",
  variant = "up",      // up | down | left | right | scale | blur | fade
  delay = 0,           // ms
  threshold = 0.12,
  once = true,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No IntersectionObserver (very old browser) → just show the content.
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setShown(true), 0)
      return () => clearTimeout(t)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            setShown(false)
          }
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant}${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
