"use client"

import Link from "next/link"
import { org } from "../data/org"
import { CONNECTED_RESOURCES } from "../data/connectedResources"

export default function AutoReplyReceipt({
  receipt,
  compact = false,
  showDashboardLink = true,
  onClose,
}) {
  if (!receipt) return null

  const slidesRes = CONNECTED_RESOURCES.find((r) => r.connector === "google_slides")
  const dropboxRes = CONNECTED_RESOURCES.find((r) => r.connector === "dropbox")
  const notionRes = CONNECTED_RESOURCES.find((r) => r.connector === "notion")

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: "#ffffff",
        border: "1.5px solid rgba(30, 122, 71, 0.32)",
        borderRadius: "16px",
        padding: compact ? "16px 18px" : "22px 24px",
        marginTop: "16px",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
        textAlign: "left",
        color: "var(--ink, #171412)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          flexWrap: "wrap",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--line, rgba(23, 20, 18, 0.08))",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--green-tint, rgba(30, 122, 71, 0.12))",
              color: "var(--green-deep, #166534)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: "999px",
            }}
          >
            <span>✓</span> Automated Confirmation Response
          </span>
          {receipt.reference_code && (
            <span
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                background: "rgba(0, 35, 51, 0.08)",
                color: "var(--navy, #002333)",
                padding: "3px 8px",
                borderRadius: "6px",
                fontWeight: 700,
              }}
            >
              Ref: {receipt.reference_code}
            </span>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted, #6b635b)",
              cursor: "pointer",
              fontSize: "12.5px",
              fontWeight: 600,
              padding: "2px 6px",
            }}
          >
            Dismiss
          </button>
        )}
      </div>

      <div style={{ fontSize: "12.5px", lineHeight: 1.6, color: "var(--muted, #57524c)", marginBottom: "12px" }}>
        <div>
          <strong style={{ color: "var(--ink, #171412)" }}>From:</strong>{" "}
          <span>{receipt.sender_name || `${org.academy} (${org.programme})`}</span>{" "}
          <span style={{ fontFamily: "monospace", color: "var(--green-deep, #166534)", fontWeight: 700 }}>
            &lt;{receipt.from || org.email}&gt;
          </span>
        </div>
        {receipt.to && (
          <div>
            <strong style={{ color: "var(--ink, #171412)" }}>To:</strong> {receipt.to}
          </div>
        )}
        <div style={{ marginTop: "4px" }}>
          <strong style={{ color: "var(--ink, #171412)" }}>Subject:</strong>{" "}
          <span style={{ color: "var(--ink, #171412)", fontWeight: 700 }}>{receipt.subject}</span>
        </div>
      </div>

      <div
        style={{
          background: "#F4F6F4",
          border: "1px solid var(--line, rgba(23, 20, 18, 0.08))",
          borderRadius: "12px",
          padding: compact ? "12px 14px" : "14px 16px",
          fontSize: compact ? "12.5px" : "13.5px",
          lineHeight: 1.65,
          whiteSpace: "pre-line",
          color: "var(--ink, #171412)",
        }}
      >
        {receipt.body}
      </div>

      {!compact && (
        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px dashed var(--line, rgba(23, 20, 18, 0.12))",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
          }}
        >
          {showDashboardLink && (
            <Link
              href="/dashboard"
              className="btn btn-green btn-sm"
              style={{ textDecoration: "none", fontSize: "12.5px" }}
            >
              Open Student Dashboard →
            </Link>
          )}
          {slidesRes && (
            <a
              href={slidesRes.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ textDecoration: "none", fontSize: "12px" }}
            >
              Google Slides Orientation
            </a>
          )}
          {dropboxRes && (
            <a
              href={dropboxRes.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ textDecoration: "none", fontSize: "12px" }}
            >
              Dropbox Study Vault (19 PDFs)
            </a>
          )}
          {notionRes && (
            <a
              href={notionRes.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ textDecoration: "none", fontSize: "12px" }}
            >
              Notion Learner Hub
            </a>
          )}
        </div>
      )}
    </div>
  )
}
