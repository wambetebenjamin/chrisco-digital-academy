"use client"

import { useState } from "react"

export default function RecaptchaCheck({
  verified = false,
  onChange,
  error = "",
  label = "I'm not a robot",
}) {
  const [verifying, setVerifying] = useState(false)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const [challengeCode, setChallengeCode] = useState(() =>
    String(Math.floor(1000 + Math.random() * 9000))
  )
  const [challengeInput, setChallengeInput] = useState("")
  const [challengeError, setChallengeError] = useState("")

  function handleToggle() {
    if (verifying) return
    if (verified) {
      onChange?.(false)
      setChallengeOpen(false)
      setChallengeInput("")
      setChallengeError("")
      return
    }
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      onChange?.(true)
    }, 120)
  }

  function openManualChallenge(e) {
    e.stopPropagation()
    const nextCode = String(Math.floor(1000 + Math.random() * 9000))
    setChallengeCode(nextCode)
    setChallengeInput("")
    setChallengeError("")
    setChallengeOpen(true)
  }

  function handleChallengeVerify(e) {
    e.preventDefault()
    if (challengeInput.trim() === challengeCode) {
      setChallengeOpen(false)
      setChallengeError("")
      onChange?.(true)
    } else {
      setChallengeError("Code did not match. Please try again.")
    }
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        onClick={handleToggle}
        role="checkbox"
        aria-checked={verified}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={`recaptcha-box${verified ? " is-verified" : ""}${error ? " has-error" : ""}`}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <span className={`recaptcha-checkbox${verified ? " is-checked" : ""}`}>
            {verifying ? (
              <span className="recaptcha-spinner" aria-hidden="true" />
            ) : verified ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4.5 4.5L19 7"
                  stroke="#0D9F6E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>
              {label}
            </div>
            <div style={{ fontSize: 11, color: verified ? "#0D9F6E" : "var(--muted)", marginTop: 3 }}>
              {verifying
                ? "Verifying browser..."
                : verified
                  ? "Human verification complete"
                  : "Click to verify you are not a bot"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <svg width="26" height="26" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
              d="M32 10c10.5 0 19.3 7.3 21.5 17.1l4.5-4.5v13.4H44.6l4.7-4.7C47.5 23.6 40.5 18 32 18c-6.8 0-12.8 3.8-15.8 9.5l-7-3.6C13.6 15.6 22.1 10 32 10z"
              fill="#1C3AA9"
            />
            <path
              d="M32 54c-10.5 0-19.3-7.3-21.5-17.1L6 41.4V28h13.4l-4.7 4.7C16.5 40.4 23.5 46 32 46c6.8 0 12.8-3.8 15.8-9.5l7 3.6C50.4 48.4 41.9 54 32 54z"
              fill="#4285F4"
            />
          </svg>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: "#555", letterSpacing: "0.02em" }}>
            reCAPTCHA
          </span>
          <span style={{ fontSize: 8.5, color: "#888" }}>
            Privacy · Terms
          </span>
        </div>
      </div>

      {!verified && !challengeOpen && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
          <button
            type="button"
            onClick={openManualChallenge}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              fontSize: 11,
              color: "var(--muted)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Use code challenge instead
          </button>
        </div>
      )}

      {challengeOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: 8,
            padding: "12px 14px",
            background: "var(--layer-1)",
            border: "1px solid var(--line-strong)",
            borderRadius: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>
              Type the 4-digit security code:
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: "0.22em",
                background: "#fff",
                border: "1px solid var(--line-strong)",
                padding: "3px 10px",
                borderRadius: 6,
                color: "var(--navy)",
                userSelect: "none",
              }}
            >
              {challengeCode}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              className="input"
              placeholder="Enter 4-digit code"
              value={challengeInput}
              onChange={(e) => setChallengeInput(e.target.value)}
              style={{ padding: "8px 12px", fontSize: 13 }}
            />
            <button
              type="button"
              onClick={handleChallengeVerify}
              className="btn btn-navy btn-sm"
              style={{ cursor: "pointer" }}
            >
              Verify
            </button>
          </div>
          {challengeError && (
            <div style={{ fontSize: 11.5, color: "var(--danger)", marginTop: 6 }}>
              {challengeError}
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 6, fontWeight: 600 }}>
          {error}
        </div>
      )}
    </div>
  )
}
