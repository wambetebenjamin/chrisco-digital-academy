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
      <div className="container" style={{ marginTop: 36 }}>
        <div
          style={{
            background: "#F5F7FA",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: "#0B1D51" }}>
              {isUnlocked
                ? `Signed in (${user.email})`
                : "Sign in to download and save books"}
            </div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
              {isUnlocked ? (
                <>
                  All 20 books are unlocked here and in your{" "}
                  <Link href="/dashboard#books" style={{ color: "#003896", fontWeight: 600 }}>
                    Dashboard
                  </Link>
                  .{" "}
                  <Link href="/privacy" style={{ color: "#003896", fontWeight: 600 }}>
                    Privacy Policy
                  </Link>
                </>
              ) : (
                <>
                  Use your Google account or email to unlock PDF downloads and save books to your Dashboard.{" "}
                  <Link href="/privacy" style={{ color: "#003896", fontWeight: 600 }}>
                    Privacy Policy
                  </Link>
                </>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {isUnlocked ? (
              <Link href="/dashboard#books" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
                Open Dashboard Vault ({savedBooks.length} Saved)
              </Link>
            ) : (
              <>
                <Link href="/sign-up?next=/library" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
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

      {/* DEDICATED SHELF 1: CHRISTIAN & FAITH BOOKS */}
      <section id="christian-books" style={{ padding: "48px 0 40px" }}>
        <div className="container">
          <div
            style={{
              background: "#0B1D51",
              padding: "36px 32px",
              color: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#F8C90E", marginBottom: 6 }}>
                  CHRISCO Youth Aflame · Shelf 01
                </div>
                <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "clamp(1.6rem, 2.8vw, 2.15rem)", lineHeight: 1.2, color: "#FFFFFF" }}>
                  Christian &amp; Prophetic Study Books
                </h2>
                <p style={{ color: "rgba(255,255,255,0.86)", fontSize: 14.5, maxWidth: 620, marginTop: 8 }}>
                  Scripture-grounded studies on character, discernment, and spiritual growth published by CHRISCO Youth Aflame.
                </p>
              </div>
              <a
                href="#learning-handbooks"
                className="btn btn-amber btn-sm"
                style={{ textDecoration: "none" }}
              >
                View 19 Learning Handbooks
              </a>
            </div>

            {christianBooks.map((book) => (
              <div
                key={book.slug}
                style={{
                  background: "#FFFFFF",
                  color: "#0B1D51",
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
                      width: 210,
                      height: 296,
                      position: "relative",
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
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#003896", marginBottom: 8 }}>
                    {book.category} · {book.pages} Pages · {book.illustrations} Visual Diagrams · {book.edition}
                  </div>

                  <Link href={book.sharePath} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.45rem", color: "#0B1D51", lineHeight: 1.25 }}>
                      {book.title}
                    </h3>
                  </Link>

                  <p style={{ color: "#334155", fontSize: 14.5, lineHeight: 1.7, marginTop: 10, marginBottom: 16 }}>
                    {book.desc}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, marginBottom: 20 }}>
                    {book.highlights.map((item) => (
                      <div key={item} style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>
                        • {item}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadClick(book)}
                      className="btn btn-primary"
                      style={{ cursor: "pointer" }}
                    >
                      <Icon name={isUnlocked ? "download" : "lock"} size={15} />
                      {isUnlocked ? "Download 28-Page E-Book (PDF)" : "Sign In / Register to Download"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveClick(book)}
                      className="btn btn-outline"
                      style={{ cursor: "pointer" }}
                    >
                      <Icon name="bookmark" size={15} />
                      {isBookSaved?.(book.slug) ? "Saved in Library" : "Save Book"}
                    </button>

                    <Link href={book.sharePath} className="btn btn-navy" style={{ textDecoration: "none" }}>
                      Read Book Overview
                    </Link>

                    <button
                      type="button"
                      onClick={() => setShareBook(shareBook?.slug === book.slug ? null : book)}
                      className="btn btn-outline"
                      style={{ cursor: "pointer" }}
                    >
                      Share Book
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

      {/* DEDICATED SHELF 2: PRACTICAL DIGITAL SKILLS & LEARNING HANDBOOKS */}
      <section id="learning-handbooks" style={{ background: "#FFFFFF", padding: "36px 0 88px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 18, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 6 }}>
                CHRISCO Digital Academy · Shelf 02
              </div>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)", color: "#0B1D51" }}>
                Practical Skill &amp; Learning Handbooks
              </h2>
              <p style={{ color: "#334155", fontSize: 14.5, maxWidth: 620, marginTop: 6 }}>
                19 illustrated 28-page study guides with clear diagrams, East African case studies, and practical exercises.
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

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
            <button
              type="button"
              onClick={() => setCategoryFilter("All")}
              className="pill pill-sm"
              style={{
                cursor: "pointer",
                background: categoryFilter === "All" ? "#0B1D51" : "#F5F7FA",
                color: categoryFilter === "All" ? "#FFFFFF" : "#0B1D51",
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
                  background: categoryFilter === cat.name ? "#0B1D51" : "#F5F7FA",
                  color: categoryFilter === cat.name ? "#FFFFFF" : "#0B1D51",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 20,
            }}
          >
            {filteredCourseBooks.map((book) => (
              <div
                key={book.slug}
                style={{
                  background: "#F5F7FA",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Link
                  href={book.sharePath}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "20px 20px 14px",
                    textDecoration: "none",
                    color: "inherit",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 114,
                      position: "relative",
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
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#003896", marginBottom: 4 }}>
                      {book.category}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.02rem", color: "#0B1D51", lineHeight: 1.3 }}>
                      {book.title}
                    </h3>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>
                      {book.pages} Pages · {book.illustrations} Diagrams · {book.level}
                    </div>
                  </div>
                </Link>

                <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                    {book.subtitle || book.desc}
                  </p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadClick(book)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, cursor: "pointer" }}
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
                      style={{ cursor: "pointer", padding: "9px 12px" }}
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
                      Overview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
