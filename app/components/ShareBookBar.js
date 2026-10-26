"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Icon from "./Icon"
import { buildBookShareUrl } from "../data/booksCatalogue"

export default function ShareBookBar({ book, compact = false }) {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined" && window.location?.origin) {
      setOrigin(window.location.origin)
    }
  }, [])

  if (!book) return null

  const shareUrl = buildBookShareUrl(book.slug, origin)
  const displayHost = (() => {
    try {
      return new URL(shareUrl).host
    } catch {
      return "chrisco-digital-academy.vercel.app"
    }
  })()

  const shareHeadline =
    book.shelf === "christian"
      ? `${book.title} | CHRISCO Youth Aflame`
      : `${book.title} | CHRISCO Digital Academy`

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

  // Put URL cleanly on its own line so WhatsApp groups & chats immediately generate the cover preview popup
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${shareHeadline}\n${shareUrl}`)}`
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareHeadline)}`
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareHeadline)}&url=${encodeURIComponent(shareUrl)}`
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const mailHref = `mailto:?subject=${encodeURIComponent(`Recommended E-Book: ${book.title}`)}&body=${encodeURIComponent(`${shareHeadline}\n\n${shareUrl}`)}`

  const ogCardSrc = book.ogImage || `/og/books/${book.slug}.jpg`

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
          title="Copy shareable link with cover preview"
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
        padding: "16px",
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
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <Icon name="share" size={14} style={{ color: "var(--green-deep)" }} />
        Share this book so others can visit &amp; download
      </div>

      {/* Live WhatsApp / Group Link Cover Preview Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
          boxShadow: "0 4px 14px rgba(0,35,51,0.06)",
        }}
      >
        <div style={{ position: "relative", width: "100%", aspectRatio: "1200 / 630", background: "var(--navy)" }}>
          <Image
            src={ogCardSrc}
            alt={`WhatsApp link preview for ${book.title}`}
            fill
            sizes="(max-width: 640px) 92vw, 480px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ padding: "10px 13px", borderTop: "1px solid var(--line)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green-deep)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {displayHost}
          </div>
          <div style={{ fontSize: 13.2, fontWeight: 800, color: "var(--ink)", marginTop: 2, lineHeight: 1.3 }}>
            {book.title}
          </div>
          <div style={{ fontSize: 11.8, color: "var(--muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {shareUrl}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="btn btn-green btn-sm"
          style={{ textDecoration: "none", fontSize: 12.5, padding: "8px 14px" }}
        >
          <Icon name="whatsapp" size={14} /> Share on WhatsApp
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="btn btn-navy btn-sm"
          style={{ cursor: "pointer", fontSize: 12.5, padding: "8px 14px" }}
        >
          <Icon name={copied ? "check" : "copy"} size={14} />
          {copied ? "Link Copied!" : "Copy Link"}
        </button>

        <a
          href={tgHref}
          target="_blank"
          rel="noreferrer"
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          Telegram
        </a>

        <a
          href={xHref}
          target="_blank"
          rel="noreferrer"
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          X / Post
        </a>

        <a
          href={fbHref}
          target="_blank"
          rel="noreferrer"
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          Facebook
        </a>

        <a
          href={mailHref}
          className="pill pill-sm"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          Email
        </a>

        <button
          type="button"
          onClick={handleNativeShare}
          className="pill pill-sm"
          style={{ cursor: "pointer", color: "var(--ink)", background: "#fff" }}
        >
          More...
        </button>
      </div>
    </div>
  )
}
