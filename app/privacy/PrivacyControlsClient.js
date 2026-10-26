"use client"
import { useState, useEffect } from "react"
import Icon from "../components/Icon"
import {
  fetchServerBookAccessStatus,
  readLocalBookReader,
  revokeBookRegistration,
} from "../lib/bookGateClient"

export default function PrivacyControlsClient() {
  const [reader, setReader] = useState(null)
  const [clearedMsg, setClearedMsg] = useState("")

  useEffect(() => {
    setReader(readLocalBookReader())
    fetchServerBookAccessStatus().then((st) => setReader(st))
  }, [])

  async function handleErase() {
    await revokeBookRegistration()
    setReader(null)
    setClearedMsg(
      "Your browser's reader access cookie and local registration record have been immediately erased."
    )
  }

  return (
    <div
      className="card"
      style={{
        padding: "24px 26px",
        borderRadius: 18,
        borderLeft: "4px solid var(--green-deep)",
        marginBottom: 32,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Icon name="shield" size={20} style={{ color: "var(--green-deep)" }} />
        <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>
          Self-Service Data Protection Control (This Browser)
        </h2>
      </div>

      {reader?.registered ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13.8, color: "var(--body)", margin: 0 }}>
            Active book-reader verification cookie detected for{" "}
            <strong>{reader.maskedEmail || "verified email"}</strong> (Policy v{reader.consentVersion || "2026-10"}).
          </p>
          <button
            type="button"
            onClick={handleErase}
            className="btn btn-outline btn-sm"
            style={{ cursor: "pointer" }}
          >
            Withdraw Consent &amp; Erase Browser Cookie
          </button>
        </div>
      ) : (
        <p style={{ fontSize: 13.8, color: "var(--muted)", margin: 0 }}>
          {clearedMsg || "No active book-download registration cookie is currently stored on this browser."}
        </p>
      )}
    </div>
  )
}
