"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "../../components/Icon"
import BookGateModal from "../../components/BookGateModal"
import ShareBookBar from "../../components/ShareBookBar"
import VoiceStudioNarrator from "../../components/VoiceStudioNarrator"
import { useAuth } from "../../AuthProvider"

export default function BookDetailClient({ book, relatedBooks = [] }) {
  const { user, toggleSavedBook, isBookSaved } = useAuth() || {}
  const [modalOpen, setModalOpen] = useState(false)
  const [gateIntent, setGateIntent] = useState("download")

  // Strict account-only rule: ALL Christian books and Course Handbooks require a logged-in account
  const isUnlocked = Boolean(user?.email)
  const saved = Boolean(isBookSaved?.(book?.slug))

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("unlock") === "1" && !user?.email) {
        setGateIntent("download")
        setModalOpen(true)
      }
    }
  }, [user])

  function handleDownload() {
    if (!isUnlocked) {
      setGateIntent("download")
      setModalOpen(true)
      return
    }
    window.open(book.downloadPath, "_blank")
  }

  function handleSave() {
    if (!isUnlocked) {
      setGateIntent("save")
      setModalOpen(true)
      return
    }
    if (toggleSavedBook) toggleSavedBook(book.slug)
  }

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          background:
            book.shelf === "christian"
              ? "linear-gradient(135deg, #010C80 0%, #0D1B63 70%, #1C2B78 100%)"
              : "linear-gradient(135deg, #14133B 0%, #1D2568 70%, #002333 100%)",
          color: "#fff",
          padding: "56px 0 64px",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: 22 }}>
            <Link
              href={book.shelf === "christian" ? "/library#christian-books" : "/library#learning-handbooks"}
              style={{ color: "rgba(255,255,255,0.82)", textDecoration: "none", fontSize: 13.5, fontWeight: 600 }}
            >
              ← Back to {book.shelf === "christian" ? "Christian Books Shelf" : "Digital Library"}
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 38,
              alignItems: "center",
            }}
          >
            {/* Cover Preview */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 265,
                  height: 375,
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 26px 60px rgba(0,0,0,0.45)",
                  border: "2px solid rgba(255,255,255,0.22)",
                }}
              >
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  priority
                  sizes="280px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Book Details */}
            <div style={{ gridColumn: "span 2" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                <span
                  className="pill pill-sm"
                  style={{
                    background: book.shelf === "christian" ? "#FA3F26" : "var(--green)",
                    color: book.shelf === "christian" ? "#fff" : "var(--navy)",
                    border: "none",
                  }}
                >
                  {book.shelfLabel}
                </span>
                <span className="pill pill-sm" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "none" }}>
                  {book.pages} Pages
                </span>
                <span className="pill pill-sm" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "none" }}>
                  {book.illustrations} Diagrams
                </span>
              </div>

              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 2.85rem)", lineHeight: 1.12 }}>
                {book.title}
              </h1>
              <p style={{ fontSize: "1.08rem", color: "rgba(255,255,255,0.84)", marginTop: 8, fontWeight: 600 }}>
                {book.subtitle}
              </p>

              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", lineHeight: 1.72, marginTop: 16, maxWidth: 680 }}>
                {book.desc}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn"
                  style={{
                    background: book.shelf === "christian" ? "#FA3F26" : "var(--green)",
                    color: book.shelf === "christian" ? "#fff" : "var(--navy)",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  <Icon name={isUnlocked ? "download" : "lock"} size={17} />
                  {isUnlocked
                    ? `Download Full ${book.pages}-Page E-Book (PDF)`
                    : "Create Account / Sign In to Download"}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="btn"
                  style={{
                    background: saved ? "rgba(46,211,117,0.22)" : "rgba(255,255,255,0.14)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.32)",
                    cursor: "pointer",
                  }}
                >
                  <Icon name="bookmark" size={16} />
                  {saved ? "Saved in My Dashboard" : "Save to My Library"}
                </button>

                {isUnlocked && (
                  <Link
                    href="/dashboard#books"
                    className="btn"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.28)",
                      textDecoration: "none",
                    }}
                  >
                    Open Dashboard Vault →
                  </Link>
                )}

                {book.courseId && (
                  <Link
                    href={`/courses?course=${book.courseId}`}
                    className="btn"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.28)",
                      textDecoration: "none",
                    }}
                  >
                    Enroll in Live Course →
                  </Link>
                )}
              </div>

              <p style={{ fontSize: 12.2, color: "rgba(255,255,255,0.72)", marginTop: 14 }}>
                <Icon name="shield" size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />
                <Link href="/privacy" style={{ color: "#fff", textDecoration: "underline" }}>
                  Privacy Policy
                </Link>{" "}
                · Saved in your Dashboard after sign-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INSIDE THIS BOOK + SHAREABLE LINK BOX */}
      <section className="section-frost" style={{ padding: "56px 0 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, alignItems: "start" }}>
            <div className="card" style={{ padding: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.22rem", color: "var(--ink)", marginBottom: 16 }}>
                Inside This Book
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(book.highlights || []).map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--ink)" }}>
                    <Icon name="checkCircle" size={18} style={{ color: "var(--green-deep)", flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)", fontSize: 12.8, color: "var(--muted)" }}>
                Published by <strong>{book.publisher}</strong> · Editorial inquiries: chriscoyouthaflame2025@gmail.com
              </div>

              <div style={{ marginTop: 22 }}>
                <VoiceStudioNarrator
                  compact
                  title={`Audio Overview: ${book.title}`}
                  initialText={[
                    `${book.title}. ${book.subtitle || ""}`,
                    book.desc || "",
                    ...(book.highlights || []),
                  ]
                    .filter(Boolean)
                    .join("\n\n")}
                />
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: "26px", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.08rem", color: "var(--ink)", marginBottom: 8 }}>
                  Share This Book
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.6, marginBottom: 14 }}>
                  Send a direct link with cover preview on WhatsApp, Telegram, X, or email.
                </p>
                <ShareBookBar book={book} />
              </div>

              {relatedBooks.length > 0 && (
                <div className="card" style={{ padding: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1rem", color: "var(--ink)", marginBottom: 14 }}>
                    More Books on This Shelf
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {relatedBooks.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={rel.sharePath}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          textDecoration: "none",
                          color: "inherit",
                          padding: "8px",
                          borderRadius: 10,
                          background: "var(--layer-1)",
                        }}
                      >
                        <div style={{ width: 44, height: 62, position: "relative", borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                          <Image src={rel.coverImage} alt={rel.title} fill sizes="50px" style={{ objectFit: "cover" }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)" }}>{rel.title}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>{rel.pages} Pages · {rel.category}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <BookGateModal
          book={book}
          intent={gateIntent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
