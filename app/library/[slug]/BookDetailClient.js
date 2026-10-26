"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "../../components/Icon"
import ShareBookBar from "../../components/ShareBookBar"
import BookGateModal from "../../components/BookGateModal"
import { useAuth } from "../../AuthProvider"
import {
  fetchServerBookAccessStatus,
  readLocalBookReader,
  syncAuthenticatedUserBookAccess,
} from "../../lib/bookGateClient"

export default function BookDetailClient({ book }) {
  const { user } = useAuth() || {}
  const [reader, setReader] = useState(null)
  const [showGate, setShowGate] = useState(false)

  useEffect(() => {
    setReader(readLocalBookReader())
    let active = true

    async function init() {
      let current = readLocalBookReader()
      if (user?.email) {
        current = await syncAuthenticatedUserBookAccess(user)
      } else {
        current = await fetchServerBookAccessStatus()
      }
      if (!active) return
      setReader(current)

      // If visitor arrived from a gated PDF redirect (?unlock=1) and is not yet registered, open the email prompt automatically!
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        if (params.get("unlock") === "1" && !(user?.email || current?.registered)) {
          setShowGate(true)
        }
      }
    }

    init()
    const onReaderChange = (e) => setReader(e.detail || readLocalBookReader())
    window.addEventListener("chrisco:book-reader-updated", onReaderChange)
    return () => {
      active = false
      window.removeEventListener("chrisco:book-reader-updated", onReaderChange)
    }
  }, [user])

  const isRegistered = Boolean(user?.email || reader?.registered)
  const isChristian = book.shelf === "christian"

  function handleDownload() {
    if (!isRegistered) {
      setShowGate(true)
      return
    }
    window.open(book.downloadPath, "_blank")
  }

  return (
    <>
      <section
        style={{
          background: isChristian
            ? "linear-gradient(135deg, #010C80 0%, #16249B 100%)"
            : "linear-gradient(135deg, var(--navy) 0%, #152888 100%)",
          color: "#fff",
          padding: "64px 0 68px",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: 22 }}>
            <Link
              href={isChristian ? "/library?shelf=christian" : "/library?shelf=learning"}
              style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 13.5, fontWeight: 600 }}
            >
              ← Back to {isChristian ? "Christian & Faith Books" : "Skill & Learning Handbooks"}
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            {/* Cover */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 260,
                  aspectRatio: "595 / 842",
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 24px 56px rgba(0,0,0,0.42)",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="280px"
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Book Summary & Primary CTA */}
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                <span
                  className="pill pill-sm"
                  style={{
                    background: isChristian ? "#FA3F26" : "var(--green)",
                    color: isChristian ? "#fff" : "var(--navy)",
                    border: "none",
                  }}
                >
                  {book.shelfLabel}
                </span>
                <span className="pill pill-dark pill-sm">{book.pages} Spacious Pages</span>
                <span className="pill pill-dark pill-sm">{book.illustrations} Visual Diagrams</span>
              </div>

              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", lineHeight: 1.12, marginBottom: 14 }}>
                {book.title}
              </h1>
              <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.84)", lineHeight: 1.7, marginBottom: 22 }}>
                {book.desc}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-green"
                  style={{ cursor: "pointer" }}
                >
                  <Icon name={isRegistered ? "download" : "mail"} size={17} />
                  {isRegistered ? "Download 28-Page PDF Now" : "Register by Email to Download PDF"}
                </button>
                {book.courseId && (
                  <Link
                    href={`/courses?course=${book.courseId}`}
                    className="btn btn-outline"
                    style={{ textDecoration: "none", color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}
                  >
                    Explore Interactive Course →
                  </Link>
                )}
              </div>

              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)" }}>
                <Icon name="shield" size={14} style={{ color: "var(--green)", marginRight: 6 }} />
                Free online download for email-registered readers · Protected under our{" "}
                <Link href="/privacy" style={{ color: "var(--green)", fontWeight: 700 }}>
                  Privacy &amp; Data Protection Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTERS, HIGHLIGHTS & SHARE SECTION */}
      <section className="section-frost" style={{ padding: "64px 0 88px" }}>
        <div className="container" style={{ maxWidth: 920 }}>
          {/* Share Card */}
          <div style={{ marginBottom: 36 }}>
            <ShareBookBar book={book} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
            }}
          >
            {/* Chapters */}
            <div className="card" style={{ padding: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.15rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="clipboard" size={18} style={{ color: "var(--green-deep)" }} />
                Inside This 28-Page Illustrated Book
              </h2>
              <div style={{ display: "grid", gap: 10 }}>
                {book.chapters.map((ch, idx) => (
                  <div
                    key={ch}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      paddingBottom: 10,
                      borderBottom: idx < book.chapters.length - 1 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: "var(--navy)",
                        color: "var(--green)",
                        fontSize: 11.5,
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 13.8, color: "var(--ink)", lineHeight: 1.5 }}>{ch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Highlights & Audience */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div className="card" style={{ padding: "28px" }}>
                <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.15rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="target" size={18} style={{ color: "var(--green-deep)" }} />
                  Key Highlights &amp; Takeaways
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                  {book.highlights.map((hl) => (
                    <li key={hl} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.8, color: "var(--body)", lineHeight: 1.55 }}>
                      <Icon name="checkCircle" size={16} style={{ color: "var(--green-deep)", marginTop: 2 }} />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ padding: "26px 28px", borderLeft: "4px solid var(--green-deep)" }}>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.02rem", marginBottom: 8 }}>
                  Who This Book Is Written For
                </h3>
                <p style={{ fontSize: 13.8, color: "var(--body)", lineHeight: 1.65, marginBottom: 16 }}>
                  {book.forWho}
                </p>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-navy btn-sm"
                  style={{ width: "100%", cursor: "pointer" }}
                >
                  <Icon name={isRegistered ? "download" : "mail"} size={15} />
                  {isRegistered ? "Open Full 28-Page PDF" : "Register by Email to Download"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showGate && (
        <BookGateModal
          book={book}
          onClose={() => setShowGate(false)}
          onUnlocked={(newReader) => setReader(newReader)}
        />
      )}
    </>
  )
}
