"use client"

import { useState } from "react"
import { ORG } from "../data/org"

const QUICK_ACCOUNTS = [
  { name: "Wambete Benjamin", email: "wambetebenjamin@gmail.com", role: "Lead Learner & Admin" },
  { name: "CHRISCO Youth Aflame", email: "chriscoyouthaflame2025@gmail.com", role: "Official Academy Account" },
]

export default function GoogleAuthModal({ open, onClose, onComplete, mode = "signin" }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const handleSubmit = async (selectedAccount) => {
    setError("")
    const targetEmail = (selectedAccount?.email ?? email).trim().toLowerCase()
    const targetName = (
      selectedAccount?.name ||
      name.trim() ||
      (targetEmail ? targetEmail.split("@")[0] : "")
    ).trim()

    if (!targetEmail || !targetEmail.includes("@")) {
      setError("Please enter a valid Google / Gmail address.")
      return
    }

    setLoading(true)
    try {
      await onComplete({
        name: targetName || "Google Learner",
        email: targetEmail,
      })
    } catch (err) {
      setError(err?.message || "Could not complete Google sign-in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in with Google"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.62)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "28px 26px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
          color: "#1f2937",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
              Sign in with Google
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Google Sign-In"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>

        <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px", color: "#111827" }}>
          {mode === "signup" ? "Create your account with Google" : "Choose a Google account"}
        </h3>
        <p style={{ fontSize: "13px", color: "#4b5563", margin: "0 0 16px", lineHeight: 1.5 }}>
          Continue to <strong>{ORG.academy}</strong> ({ORG.programme}). You will also receive an automated welcome confirmation from{" "}
          <span style={{ fontFamily: "monospace", color: "#166534", fontWeight: 600 }}>{ORG.email}</span>.
        </p>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "9px 12px",
              borderRadius: "8px",
              fontSize: "12.5px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280", marginBottom: "8px" }}>
            Quick-Select Connected Account
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {QUICK_ACCOUNTS.map((acct) => (
              <button
                key={acct.email}
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(acct)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "#166534",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {acct.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#111827" }}>{acct.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {acct.email}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 600 }}>Continue →</span>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "14px 0",
            color: "#9ca3af",
            fontSize: "11.5px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          <span>or use any Google / Gmail account</span>
          <span style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(null)
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amani Mwangi"
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "13.5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Google Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              required
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "13.5px",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px 16px",
              borderRadius: "9px",
              border: "none",
              background: "#1a73e8",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Signing in with Google..." : "Continue with Google Account"}
          </button>
        </form>
      </div>
    </div>
  )
}
