"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "../components/Icon"
import ShareBookBar from "../components/ShareBookBar"
import BookGateModal from "../components/BookGateModal"
import { christianBooks, learningBooks } from "../data/booksCatalogue"
import { categories } from "../data/courses"
import { useAuth } from "../AuthProvider"
import {
  fetchServerBookAccessStatus,
  readLocalBookReader,
  revokeBookRegistration,
  syncAuthenticatedUserBookAccess,
} from "../lib/bookGateClient"

export default function LibraryClient() {
  const { user } = useAuth() || {}
  const [reader, setReader] = useState(null)
  const [shelfFilter, setShelfFilter] = useState("all") // "all" | "christian" | "learning"
  const [trackFilter, setTrackFilter] = useState("All")
  const [gateBook, setGateBook] = useState(null)

  useEffect(() => {
    setReader(readLocalBookReader())
    if (user?.email) {
      syncAuthenticatedUserBookAccess(user).then((st) => {
        if (st) setReader(st)
      })
    } else {
      fetchServerBookAccessStatus().then((st) => setReader(st))
    }

    const onReaderChange = (e) => setReader(e.detail || readLocalBookReader())
    window.addEventListener("chrisco:book-reader-updated", onReaderChange)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const shelf = params.get("shelf")
      if (shelf === "christian" || shelf === "learning") {
        setShelfFilter(shelf)
      }
    }

    return () => window.removeEventListener("chrisco:book-reader-updated", onReaderChange)
  }, [user])

  const isRegistered = Boolean(user?.email || reader?.registered)

  function handleDownloadClick(book) {
    if (!isRegistered) {
      setGateBook(book)
      return
    }
    window.open(book.downloadPath, "_blank")
  }

  async function handleForgetReader() {
    await revokeBookRegistration()
    setReader(null)
  }

  const filteredLearning = learningBooks.filter(
    (b) => trackFilter === "All" || b.category === trackFilter
  )

  return (
    <>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--navy) 0%, #091d3a 60%, #102a56 100%)",
          color: "#fff",
          padding: "76px 0 60px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 780 }}>
            <span className="pill pill-dark pill-sm" style={{ marginBottom: 16 }}>
              <Icon name="book" size={14} /> CHRISCO Youth Aflame · CHRISCO Digital Academy
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)",
                lineHeight: 1.08,
                marginBottom: 16,
              }}
            >
              Christian Books &amp; Practical Learning Handbooks
            </h1>
            <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 26 }}>
              Every e-book is written in depth across <strong>28 spacious pages</strong> with detailed explanations,
              custom visual diagrams, and real African photography. <strong>Christian &amp; Faith Books</strong> have
              their dedicated sanctuary shelf right beside our <strong>19 Practical Skill Handbooks</strong>. Register
              once by email to download online, or share any book link so others can visit and download.
            </p>

            {/* Shelf Switcher Pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setShelfFilter("all")}
                className="btn btn-sm"
                style={{
                  cursor: "pointer",
                  background: shelfFilter === "all" ? "var(--green)" : "rgba(255,255,255,0.1)",
                  color: shelfFilter === "all" ? "var(--navy)" : "#fff",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                All Collections ({christianBooks.length + learningBooks.length})
              </button>
              <button
                type="button"
                onClick={() => setShelfFilter("christian")}
                className="btn btn-sm"
                style={{
                  cursor: "pointer",
                  background: shelfFilter === "christian" ? "#FA3F26" : "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                <Icon name="flame" size={14} /> Christian &amp; Faith Shelf ({christianBooks.length})
              </button>
              <button
                type="button"
                onClick={() => setShelfFilter("learning")}
                className="btn btn-sm"
                style={{
                  cursor: "pointer",
                  background: shelfFilter === "learning" ? "#313FB3" : "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                <Icon name="cap" size={14} /> Skill &amp; Learning Shelf ({learningBooks.length})
              </button>
            </div>
          </div>

          {/* Reader Email Access & Data Protection Banner */}
          <div
            style={{
              marginTop: 28,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 16,
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
              <Icon name={isRegistered ? "shield" : "lock"} size={18} style={{ color: "var(--green)" }} />
              {isRegistered ? (
                <span>
                  Online downloads unlocked for{" "}
                  <strong>{user?.email || reader?.maskedEmail || "your verified email"}</strong>. Protected under our{" "}
                  <Link href="/privacy" style={{ color: "var(--green)", fontWeight: 700 }}>
                    Privacy &amp; Data Protection Policy
                  </Link>
                  .
                </span>
              ) : (
                <span>
                  <strong>Email Registration Required:</strong> Click any book&apos;s download button to register with
                  your email. Read our{" "}
                  <Link href="/privacy" style={{ color: "var(--green)", fontWeight: 700 }}>
                    Privacy &amp; Data Protection Policy
                  </Link>
                  .
                </span>
              )}
            </div>

            {reader?.registered && !user && (
              <button
                type="button"
                onClick={handleForgetReader}
                className="pill pill-dark pill-sm"
                style={{ cursor: "pointer" }}
              >
                Clear Saved Email
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SHELF 1: CHRISTIAN & FAITH BOOKS (Dedicated Sanctuary Place)
         ===================================================================== */}
      {(shelfFilter === "all" || shelfFilter === "christian") && (
        <section
          id="christian-books"
          style={{
            padding: "64px 0",
            background: "linear-gradient(180deg, #FFF7F5 0%, #FFFFFF 100%)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
              <div>
                <span
                  className="pill pill-sm"
                  style={{ background: "#FFE6E1", color: "#B82410", borderColor: "transparent", marginBottom: 10 }}
                >
                  <Icon name="flame" size={13} /> Dedicated Christian &amp; Faith Library
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem, 3vw, 2.35rem)", color: "#010C80" }}>
                  Christian &amp; Prophetic Study Books
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 640, marginTop: 6 }}>
                  Scripture-centered spiritual formation publications from <strong>CHRISCO Youth Aflame</strong> under{" "}
                  <strong>CHRISCO FELLOWSHIP OF CHURCHES</strong>, set apart in their own dedicated fellowship shelf.
                </p>
              </div>
            </div>

            {christianBooks.map((book) => (
              <div
                key={book.slug}
                className="card"
                style={{
                  padding: "32px",
                  borderRadius: 24,
                  border: "1px solid rgba(1,12,128,0.14)",
                  boxShadow: "0 16px 42px rgba(1,12,128,0.06)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 32,
                  alignItems: "center",
                }}
              >
                {/* Cover Preview */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Link
                    href={book.sharePath}
                    style={{
                      display: "block",
                      width: 240,
                      aspectRatio: "595 / 842",
                      position: "relative",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 18px 40px rgba(1,12,128,0.22)",
                    }}
                  >
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      sizes="260px"
                      style={{ objectFit: "cover" }}
                    />
                  </Link>
                </div>

                {/* Details + Actions */}
                <div style={{ gridColumn: "span 1" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                    <span className="pill pill-sm" style={{ background: "#010C80", color: "#fff", border: "none" }}>
                      {book.category}
                    </span>
                    <span className="pill pill-soft pill-sm">{book.pages} Spacious Pages</span>
                    <span className="pill pill-soft pill-sm">{book.illustrations} Prophetic Diagrams</span>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.55rem", color: "var(--ink)", marginBottom: 10 }}>
                    <Link href={book.sharePath} style={{ color: "inherit", textDecoration: "none" }}>
                      {book.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: 14.5, color: "var(--body)", lineHeight: 1.7, marginBottom: 18 }}>
                    {book.desc}
                  </p>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "grid", gap: 8 }}>
                    {book.highlights.map((hl) => (
                      <li key={hl} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: "var(--ink)" }}>
                        <Icon name="checkCircle" size={16} style={{ color: "#FA3F26", marginTop: 2 }} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadClick(book)}
                      className="btn"
                      style={{
                        background: "#010C80",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <Icon name={isRegistered ? "download" : "lock"} size={16} />
                      {isRegistered ? "Download 28-Page Christian PDF" : "Register by Email to Download"}
                    </button>

                    <Link href={book.sharePath} className="btn btn-outline" style={{ textDecoration: "none" }}>
                      Preview Chapters &amp; Share →
                    </Link>
                  </div>

                  <ShareBookBar book={book} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          SHELF 2: PRACTICAL SKILL & LEARNING BOOKS (Beside Christian Books)
         ===================================================================== */}
      {(shelfFilter === "all" || shelfFilter === "learning") && (
        <section id="learning-books" className="section-frost" style={{ padding: "68px 0 92px" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <div>
                <span
                  className="pill pill-sm"
                  style={{ background: "#E4E7FF", color: "#1D2EA8", borderColor: "transparent", marginBottom: 10 }}
                >
                  <Icon name="cap" size={13} /> CHRISCO Digital Academy Shelf
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem, 3vw, 2.35rem)", color: "var(--ink)" }}>
                  Practical Skill &amp; Learning Handbooks ({filteredLearning.length})
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 660, marginTop: 6 }}>
                  Unified 28-page illustrated course handbooks covering coding, AI, business leadership, writing, design,
                  and marketing — each with two spacious pages per module, visual diagrams, and real-world labs.
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              <button
                type="button"
                onClick={() => setTrackFilter("All")}
                className="pill pill-sm"
                style={{
                  cursor: "pointer",
                  background: trackFilter === "All" ? "var(--navy)" : "var(--surface)",
                  color: trackFilter === "All" ? "#fff" : "var(--ink)",
                }}
              >
                All Tracks ({learningBooks.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setTrackFilter(cat.name)}
                  className="pill pill-sm"
                  style={{
                    cursor: "pointer",
                    background: trackFilter === cat.name ? "var(--navy)" : "var(--surface)",
                    color: trackFilter === cat.name ? "#fff" : "var(--ink)",
                  }}
                >
                  <Icon name={cat.icon} size={13} /> {cat.name}
                </button>
              ))}
            </div>

            <div className="course-grid">
              {filteredLearning.map((book) => (
                <div
                  key={book.slug}
                  className="card card-hover"
                  style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
                >
                  <Link
                    href={book.sharePath}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      background: "linear-gradient(145deg, #122184 0%, #2538C4 100%)",
                      padding: "22px 20px",
                      textDecoration: "none",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 148,
                        aspectRatio: "595 / 842",
                        position: "relative",
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
                      }}
                    >
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        sizes="180px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <span
                      className="pill pill-sm"
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "rgba(255,255,255,0.94)",
                        color: "var(--ink)",
                        border: "none",
                      }}
                    >
                      {book.category}
                    </span>
                  </Link>

                  <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 6 }}>
                      <Link href={book.sharePath} style={{ color: "var(--ink)", textDecoration: "none" }}>
                        {book.shortTitle}
                      </Link>
                    </h3>
                    <p style={{ fontSize: 13.3, color: "var(--muted)", lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
                      {book.subtitle}
                    </p>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      <span className="pill pill-soft pill-sm">{book.pages} Pages</span>
                      <span className="pill pill-soft pill-sm">{book.illustrations} Diagrams</span>
                      <span className="pill pill-soft pill-sm">{book.level}</span>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => handleDownloadClick(book)}
                        className="btn btn-navy btn-sm"
                        style={{ flex: 1, cursor: "pointer", fontSize: 12.8 }}
                      >
                        <Icon name={isRegistered ? "download" : "lock"} size={14} />
                        {isRegistered ? "Download PDF" : "Email to Download"}
                      </button>
                      <ShareBookBar book={book} compact />
                    </div>

                    <div style={{ marginTop: 10, fontSize: 12.2 }}>
                      <Link href={book.sharePath} style={{ color: "var(--green-deep)", fontWeight: 700, textDecoration: "none" }}>
                        Open Book Page &amp; Share Options →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gateBook && (
        <BookGateModal
          book={gateBook}
          onClose={() => setGateBook(null)}
          onUnlocked={(newReader) => setReader(newReader)}
        />
      )}
    </>
  )
}
