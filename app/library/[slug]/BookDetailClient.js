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
          background: "#0B1D51",
          color: "#FFFFFF",
          padding: "clamp(136px, 16vw, 172px) 0 56px",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: 20 }}>
            <Link
              href={book.shelf === "christian" ? "/library#christian-books" : "/library#learning-handbooks"}
              style={{ color: "#F8C90E", textDecoration: "none", fontSize: 13.5, fontWeight: 600 }}
            >
              Back to {book.shelf === "christian" ? "Christian Books Shelf" : "Digital Library"}
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 36,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 240,
                  height: 340,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  priority
                  sizes="260px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#F8C90E", marginBottom: 10 }}>
                {book.shelfLabel} · {book.pages} Pages · {book.illustrations} Diagrams
              </div>

              <h1 style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "#FFFFFF", fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", lineHeight: 1.2 }}>
                {book.title}
              </h1>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.88)", marginTop: 8, fontWeight: 500 }}>
                {book.subtitle}
              </p>

              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.84)", lineHeight: 1.72, marginTop: 14, maxWidth: 680 }}>
                {book.desc}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-amber"
                  style={{ cursor: "pointer" }}
                >
                  <Icon name={isUnlocked ? "download" : "lock"} size={16} />
                  {isUnlocked
                    ? `Download Full ${book.pages}-Page E-Book (PDF)`
                    : "Create Account / Sign In to Download"}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-outline-light"
                  style={{ cursor: "pointer" }}
                >
                  <Icon name="bookmark" size={15} />
                  {saved ? "Saved in My Dashboard" : "Save to My Library"}
                </button>

                {isUnlocked && (
                  <Link
                    href="/dashboard#books"
                    className="btn btn-outline-light"
                    style={{ textDecoration: "none" }}
                  >
                    Open Dashboard Vault
                  </Link>
                )}

                {book.courseId && (
                  <Link
                    href={`/courses?course=${book.courseId}`}
                    className="btn btn-outline-light"
                    style={{ textDecoration: "none" }}
                  >
                    Enroll in Course
                  </Link>
                )}
              </div>

              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 14 }}>
                <Link href="/privacy" style={{ color: "#FFFFFF", textDecoration: "underline" }}>
                  Privacy Policy
                </Link>{" "}
                · Saved in your Dashboard after sign-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INSIDE THIS BOOK + SHAREABLE LINK BOX */}
      <section style={{ background: "#FFFFFF", padding: "56px 0 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, alignItems: "start" }}>
            <div style={{ background: "#F5F7FA", padding: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.2rem", color: "#0B1D51", marginBottom: 16 }}>
                Inside This Book
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(book.highlights || []).map((item) => (
                  <div key={item} style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
                    • {item}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22, fontSize: 13, color: "#475569" }}>
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
              <div style={{ background: "#F5F7FA", padding: "26px", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.08rem", color: "#0B1D51", marginBottom: 8 }}>
                  Share This Book
                </h3>
                <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, marginBottom: 14 }}>
                  Send a direct link with cover preview on WhatsApp, Telegram, X, or email.
                </p>
                <ShareBookBar book={book} />
              </div>

              {relatedBooks.length > 0 && (
                <div style={{ background: "#F5F7FA", padding: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem", color: "#0B1D51", marginBottom: 14 }}>
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
                          padding: "10px",
                          background: "#FFFFFF",
                        }}
                      >
                        <div style={{ width: 44, height: 62, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                          <Image src={rel.coverImage} alt={rel.title} fill sizes="50px" style={{ objectFit: "cover" }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0B1D51" }}>{rel.title}</div>
                          <div style={{ fontSize: 12, color: "#475569" }}>{rel.pages} Pages · {rel.category}</div>
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
