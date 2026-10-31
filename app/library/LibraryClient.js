"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "../components/Icon"
import BookGateModal from "../components/BookGateModal"
import ShareBookBar from "../components/ShareBookBar"
import { christianBooks, learningBooks } from "../data/booksCatalogue"
import { categories } from "../data/courses"
import { useAuth } from "../AuthProvider"

export default function LibraryClient() {
  const { user, toggleSavedBook, isBookSaved, savedBooks = [] } = useAuth() || {}
  const [selectedBook, setSelectedBook] = useState(null)
  const [gateIntent, setGateIntent] = useState("download")
  const [shareBook, setShareBook] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Strict account-only rule: ALL Christian books and Course Handbooks require a logged-in account
  const isUnlocked = Boolean(user?.email)

  function handleDownloadClick(book) {
    if (!isUnlocked) {
      setGateIntent("download")
      setSelectedBook(book)
      return
    }
    window.open(book.downloadPath, "_blank")
  }

  function handleSaveClick(book) {
    if (!isUnlocked) {
      setGateIntent("save")
      setSelectedBook(book)
      return
    }
    if (toggleSavedBook) toggleSavedBook(book.slug)
  }

  const filteredCourseBooks = learningBooks.filter((book) => {
    const catOk = categoryFilter === "All" || book.category === categoryFilter
    const q = searchQuery.trim().toLowerCase()
    const queryOk =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q) ||
      (book.desc || "").toLowerCase().includes(q)
    return catOk && queryOk
  })

  return (
    <div>
      {/* ACCOUNT STATUS BAR */}
      <div className="container" style={{ marginTop: 28 }}>
        <div
          style={{
            background: isUnlocked ? "var(--green-tint)" : "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            padding: "16px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: isUnlocked ? "var(--green)" : "var(--navy)",
                color: isUnlocked ? "var(--navy)" : "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={isUnlocked ? "checkCircle" : "lock"} size={20} />
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)" }}>
                {isUnlocked
                  ? `Signed in (${user.email})`
                  : "Sign in to download and save books"}
              </div>
              <div style={{ fontSize: 12.6, color: "var(--body)" }}>
                {isUnlocked ? (
                  <>
                    All books are available here and in your{" "}
                    <Link href="/dashboard#books" style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                      Dashboard
                    </Link>
                    .{" "}
                    <Link href="/privacy" style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                      Privacy Policy
                    </Link>
                  </>
                ) : (
                  <>
                    Use Google or email to unlock downloads and save books to your Dashboard.{" "}
                    <Link href="/privacy" style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                      Privacy Policy
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {isUnlocked ? (
              <Link href="/dashboard#books" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
                <Icon name="bookmark" size={14} /> Open Dashboard Vault ({savedBooks.length} Saved)
              </Link>
            ) : (
              <>
                <Link href="/sign-up?next=/library" className="btn btn-green btn-sm" style={{ textDecoration: "none" }}>
                  Create Free Account
                </Link>
                <Link href="/sign-in?next=/library" className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =================================================================
          DEDICATED SHELF 1: CHRISTIAN & FAITH BOOKS (CHRISCO Youth Aflame)
          ================================================================= */}
      <section id="christian-books" style={{ padding: "56px 0 40px" }}>
        <div className="container">
          <div
            style={{
              background: "#003896",
              borderRadius: 12,
              borderTop: "5px solid #F8C90E",
              padding: "36px 32px",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div>
                <span
                  className="pill pill-sm"
                  style={{
                    background: "#EE6816",
                    color: "#fff",
                    border: "none",
                    marginBottom: 10,
                  }}
                >
                  CHRISCO Youth Aflame
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem, 3vw, 2.35rem)", lineHeight: 1.15, color: "#FFFFFF" }}>
                  Christian &amp; Prophetic Study Books
                </h2>
                <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 14.5, maxWidth: 620, marginTop: 8 }}>
                  Scripture-grounded studies on character, discernment, and spiritual growth.
                </p>
              </div>
              <a
                href="#learning-handbooks"
                className="btn btn-amber btn-sm"
                style={{
                  textDecoration: "none",
                }}
              >
                Jump to 19 Learning Handbooks ↓
              </a>
            </div>

            {christianBooks.map((book) => (
              <div
                key={book.slug}
                style={{
                  background: "#FFFFFF",
                  color: "var(--ink)",
                  borderRadius: 10,
                  borderTop: "5px solid #E60914",
                  padding: "28px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 28,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Link
                    href={book.sharePath}
                    style={{
                      width: 220,
                      height: 310,
                      position: "relative",
                      borderRadius: 8,
                      border: "2px solid #084EC8",
                      overflow: "hidden",
                      display: "block",
                    }}
                  >
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      sizes="240px"
                      style={{ objectFit: "cover" }}
                    />
                  </Link>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <span className="pill pill-soft pill-sm">{book.category}</span>
                    <span className="pill pill-soft pill-sm">{book.pages} Pages</span>
                    <span className="pill pill-soft pill-sm">{book.illustrations} Visual Diagrams</span>
                    <span className="pill pill-soft pill-sm">{book.edition}</span>
                  </div>

                  <Link href={book.sharePath} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.5rem", color: "#E60914", lineHeight: 1.2 }}>
                      {book.title}
                    </h3>
                  </Link>

                  <p style={{ color: "var(--body)", fontSize: 14.5, lineHeight: 1.7, marginTop: 10, marginBottom: 16 }}>
                    {book.desc}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, marginBottom: 20 }}>
                    {book.highlights.map((item, idx) => {
                      const hColors = ["#E60914", "#084EC8", "#38A128", "#EE6816"]
                      const hc = hColors[idx % hColors.length]
                      return (
                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--ink)" }}>
                          <Icon name="checkCircle" size={16} style={{ color: hc, flexShrink: 0, marginTop: 2 }} />
                          <span>{item}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadClick(book)}
                      className="btn btn-red"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Icon name={isUnlocked ? "download" : "lock"} size={16} />
                      {isUnlocked ? "Download 28-Page E-Book (PDF)" : "Sign In / Register to Download"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveClick(book)}
                      className="btn btn-outline"
                      style={{
                        cursor: "pointer",
                        background: isBookSaved?.(book.slug) ? "var(--green-tint)" : "transparent",
                        color: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--ink)",
                        borderColor: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--line-strong)",
                      }}
                    >
                      <Icon name="bookmark" size={15} />
                      {isBookSaved?.(book.slug) ? "Saved in Library" : "Save Book"}
                    </button>

                    <Link href={book.sharePath} className="btn btn-navy" style={{ textDecoration: "none" }}>
                      Read Book Overview &amp; Share Link →
                    </Link>

                    <button
                      type="button"
                      onClick={() => setShareBook(shareBook?.slug === book.slug ? null : book)}
                      className="btn btn-outline"
                      style={{ cursor: "pointer" }}
                    >
                      <Icon name="send" size={15} /> Share Book
                    </button>
                  </div>

                  {shareBook?.slug === book.slug && (
                    <div style={{ marginTop: 16 }}>
                      <ShareBookBar book={book} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          DEDICATED SHELF 2: PRACTICAL DIGITAL SKILLS & LEARNING HANDBOOKS
          ================================================================= */}
      <section id="learning-handbooks" className="section-frost" style={{ padding: "48px 0 96px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 18, marginBottom: 28 }}>
            <div>
              <span className="pill pill-soft pill-sm" style={{ marginBottom: 10 }}>
                CHRISCO Digital Academy
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.65rem, 2.8vw, 2.25rem)", color: "var(--ink)" }}>
                Practical Skill &amp; Learning Handbooks
              </h2>
              <p style={{ color: "var(--body)", fontSize: 14.5, maxWidth: 620, marginTop: 6 }}>
                Study guides with clear diagrams, local case studies, and practical exercises.
              </p>
            </div>

            <div style={{ minWidth: 260, flex: "0 1 320px" }}>
              <input
                type="search"
                className="input"
                placeholder="Search handbooks by topic or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category filter pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            <button
              type="button"
              onClick={() => setCategoryFilter("All")}
              className="pill pill-sm"
              style={{
                cursor: "pointer",
                background: categoryFilter === "All" ? "var(--navy)" : "var(--surface)",
                color: categoryFilter === "All" ? "#fff" : "var(--ink)",
                borderColor: categoryFilter === "All" ? "var(--navy)" : "var(--line-strong)",
              }}
            >
              All 19 Handbooks
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategoryFilter(cat.name)}
                className="pill pill-sm"
                style={{
                  cursor: "pointer",
                  background: categoryFilter === cat.name ? "var(--navy)" : "var(--surface)",
                  color: categoryFilter === cat.name ? "#fff" : "var(--ink)",
                  borderColor: categoryFilter === cat.name ? "var(--navy)" : "var(--line-strong)",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Handbooks Grid — Clean Poster Sheets with Poster Color Cycle */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 20,
            }}
          >
            {filteredCourseBooks.map((book, idx) => {
              const pColors = ["#E60914", "#084EC8", "#38A128", "#EE6816", "#D99B00"]
              const accent = pColors[idx % pColors.length]
              return (
                <div
                  key={book.slug}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    padding: 0,
                    borderTop: `4px solid ${accent}`,
                  }}
                >
                  <Link
                    href={book.sharePath}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "18px 18px 14px",
                      background: "#F7F6F1",
                      borderBottom: "1px solid var(--line)",
                      textDecoration: "none",
                      color: "inherit",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 84,
                        height: 120,
                        position: "relative",
                        borderRadius: 6,
                        border: "1px solid var(--line-strong)",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        sizes="100px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <span
                        className="pill pill-sm"
                        style={{
                          marginBottom: 6,
                          background: accent,
                          color: "#FFFFFF",
                          borderColor: accent,
                        }}
                      >
                        {book.category}
                      </span>
                      <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", color: accent, lineHeight: 1.28 }}>
                        {book.title}
                      </h3>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>
                        {book.pages} Pages · {book.illustrations} Diagrams · {book.level}
                      </div>
                    </div>
                  </Link>

                  <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <p style={{ fontSize: 13.3, color: "var(--body)", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                      {book.subtitle || book.desc}
                    </p>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => handleDownloadClick(book)}
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          cursor: "pointer",
                          background: accent,
                          color: "#FFFFFF",
                          borderColor: accent,
                        }}
                      >
                        <Icon name={isUnlocked ? "download" : "lock"} size={14} />
                        {isUnlocked ? "Download PDF" : "Sign In to Download"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveClick(book)}
                        className="btn btn-outline btn-sm"
                        title={isBookSaved?.(book.slug) ? "Saved in your Dashboard" : "Save book to your Dashboard"}
                        aria-label={isBookSaved?.(book.slug) ? `Unsave ${book.title}` : `Save ${book.title}`}
                        style={{
                          cursor: "pointer",
                          padding: "9px 12px",
                          background: isBookSaved?.(book.slug) ? "var(--green-tint)" : "transparent",
                          color: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--ink)",
                          borderColor: isBookSaved?.(book.slug) ? "var(--green-deep)" : "var(--line-strong)",
                        }}
                      >
                        <Icon name="bookmark" size={14} />
                        {isBookSaved?.(book.slug) ? "Saved" : "Save"}
                      </button>
                      <Link
                        href={book.sharePath}
                        className="btn btn-outline btn-sm"
                        title="Open shareable book page"
                        style={{ textDecoration: "none", padding: "9px 12px" }}
                      >
                        Share →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {selectedBook && (
        <BookGateModal
          book={selectedBook}
          intent={gateIntent}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  )
}
