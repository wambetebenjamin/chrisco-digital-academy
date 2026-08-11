"use client"
import { useGamification } from "../GamificationContext"

export default function XPToast() {
  const { toast, dismissToast } = useGamification()
  if (!toast) return null
  const bg = {
    lime: "var(--lime)", purple: "var(--purple)", pink: "var(--pink)", yellow: "var(--yellow)", ink: "var(--ink)",
  }[toast.tone] || "var(--lime)"
  const col = (toast.tone === "purple" || toast.tone === "pink" || toast.tone === "ink") ? "#fff" : "var(--ink)"
  return (
    <div
      onClick={dismissToast}
      role="status"
      style={{
        position: "fixed",
        bottom: 110,
        right: 24,
        zIndex: 600,
        background: bg,
        color: col,
        border: "3px solid var(--ink)",
        borderRadius: 14,
        padding: "12px 18px",
        fontFamily: "var(--font-head)",
        fontWeight: 800,
        fontSize: 14,
        boxShadow: "6px 6px 0 0 var(--ink)",
        animation: "toastPop 0.35s cubic-bezier(.16,1,.3,1)",
        cursor: "pointer",
        maxWidth: "calc(100vw - 48px)",
      }}
    >
      {toast.text}
      <style jsx>{`
        @keyframes toastPop {
          0% { opacity: 0; transform: translateY(20px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
