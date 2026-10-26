"use client"
import { useState } from "react"
import Icon from "./Icon"
import { buildBookShareUrl } from "../data/booksCatalogue"

export default function ShareBookBar({ book, compact = false }) {
  const [copied, setCopied] = useState(false)
  if (!book) return null

  const shareUrl = buildBookShareUrl(book.slug)
  const shareHeadline =
    book.shelf === "christian"
      ? `Read "${book.title}" from CHRISCO Youth Aflame — register free by email and download here:`
      : `Download the 28-page illustrated "${book.title}" from CHRISCO Digital Academy — register free by email here:`

  async function handleCopy(e) {
    e?.stopPropagation?.()
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2600)
    } catch {
      setCopied(false)
    }
  }

  async function handleNativeShare(e) {
    e?.stopPropagation?.()
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: shareHeadline,
          url: shareUrl,
        })
        return
      } catch {
        /* user cancelled */
      }
    }
    handleCopy(e)
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(`${shareHeadline} ${shareUrl}`)}`
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareHeadline)}&url=${encodeURIComponent(shareUrl)}`
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const mailHref = `mailto:?subject=${encodeURIComponent(`Recommended E-Book: ${book.title}`)}&body=${encodeURIComponent(`${shareHeadline}\n\n${shareUrl}`)}`

  if (compact) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="pill pill-sm"
          title="Copy shareable link to this book page"
          aria-label={`Copy share link for ${book.title}`}
          style={{
            cursor: "pointer",
            background: copied ? "var(--green-tint)" : "var(--layer-1)",
            color: copied ? "var(--green-deep)" : "var(--ink)",
            borderColor: copied ? "var(--green-deep)" : "var(--line-strong)",
          }}
        >
          <Icon name={copied ? "check" : "share"} size={13} />
          {copied ? "Link Copied!" : "Share Book"}
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "var(--layer-1)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 800,
          fontSize: 11.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <Icon name="share" size={14} style={{ color: "var(--green-deep)" }} />
        Share this book so others can visit &amp; download
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          onClick={handleCopy}
          className="btn btn-navy btn-sm"
          style={{ cursor: "pointer", fontSize: 12.5, padding: "8px 14px" }}
        >
          <Icon name={copied ? "check" : "copy"} size={14} />
          {copied ? "Share Link Copied!" : "Copy Book Link"}
        </button>

        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          <Icon name="whatsapp" size={14} /> WhatsApp
        </a>

        <a
          href={xHref}
          target="_blank"
          rel="noreferrer"
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          <Icon name="send" size={13} /> Post on X
        </a>

        <a
          href={fbHref}
          target="_blank"
          rel="noreferrer"
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          <Icon name="globe" size={13} /> Facebook
        </a>

        <a
          href={mailHref}
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          <Icon name="mail" size={13} /> Email Friend
        </a>

        {typeof navigator !== "undefined" && navigator.share && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="pill pill-sm"
            style={{ cursor: "pointer" }}
          >
            <Icon name="share" size={13} /> More
          </button>
        )}
      </div>

      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 8, wordBreak: "break-all" }}>
        Book page link: <strong style={{ color: "var(--ink)" }}>{shareUrl}</strong>
      </div>
    </div>
  )
}
