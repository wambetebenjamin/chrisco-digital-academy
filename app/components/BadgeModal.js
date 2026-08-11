"use client"
import { useEffect } from "react"
import Icon from "./Icon"

/**
 * BadgeModal: click a badge to see its full detail card: large icon, name,
 * description, unlock status, requirements, and unlock date when earned.
 *
 * Props:
 *  - badge: badge def object { id, label, icon, color, desc }
 *  - earned: boolean
 *  - earnedDate: optional ISO date string of when it was earned
 *  - onClose: () => void
 */
export default function BadgeModal({ badge, earned, earnedDate, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  if (!badge) return null

  const onDark = ["var(--purple)", "var(--pink)", "var(--blue)", "var(--red)"].includes(badge.color)
  const iconColor = onDark ? "#fff" : "var(--ink)"

  const dateStr = earnedDate
    ? new Date(earnedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div
      className="overlay"
      onClick={onClose}
      style={{ zIndex: 500 }}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          background: badge.color,
          color: iconColor,
          border: "4px solid var(--ink)",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "28px 28px 24px", position: "relative" }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "2.5px solid var(--ink)",
              background: "rgba(255,255,255,0.9)",
              color: "var(--ink)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "3px 3px 0 0 var(--ink)",
            }}
          >
            <Icon name="x" size={16} />
          </button>

          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 26,
              background: earned ? "var(--ink)" : "rgba(0,0,0,0.18)",
              color: earned ? badge.color : "rgba(255,255,255,0.6)",
              border: "4px solid var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              boxShadow: "6px 6px 0 0 var(--ink)",
              filter: earned ? "none" : "grayscale(0.7)",
            }}
          >
            <Icon name={badge.icon} size={48} strokeWidth={1.8} />
          </div>

          <div style={{ textAlign: "center" }}>
            <span
              className="sticker"
              style={{
                background: earned ? "var(--lime)" : "rgba(0,0,0,0.25)",
                color: "var(--ink)",
                fontSize: 10,
                marginBottom: 10,
              }}
            >
              {earned ? "Unlocked" : "Locked"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem,4vw,2rem)",
                textTransform: "uppercase",
                color: iconColor,
                marginTop: 10,
                marginBottom: 8,
                lineHeight: 1.05,
              }}
            >
              {badge.label}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.92, marginBottom: 18 }}>
              {badge.desc}
            </p>
          </div>
        </div>

        <div
          style={{
            background: "var(--paper)",
            color: "var(--ink)",
            padding: "20px 28px 28px",
            borderTop: "3px solid var(--ink)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            How to earn
          </div>
          <div
            style={{
              padding: "12px 14px",
              border: "2.5px solid var(--ink)",
              borderRadius: 12,
              background: "#fff",
              fontSize: 13.5,
              lineHeight: 1.5,
              marginBottom: 14,
              boxShadow: "3px 3px 0 0 var(--ink)",
            }}
          >
            {badge.desc}
          </div>

          {dateStr && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "var(--lime)",
                  border: "2px solid var(--ink)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="calendar" size={14} />
              </span>
              Unlocked on {dateStr}
            </div>
          )}

          <button
            onClick={onClose}
            className="btn btn-ink"
            style={{ width: "100%", marginTop: 18, cursor: "pointer" }}
          >
            {earned ? "Nice" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  )
}
