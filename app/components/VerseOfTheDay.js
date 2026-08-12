"use client"
import { useState } from "react"
import Icon from "./Icon"
import { VERSES, getVerseOfTheDay, getWorshipPick } from "../data/verses"
import { useGamification } from "../GamificationContext"

/**
 * VerseOfTheDay: today's verse card with a "Study Video" link that opens YouTube,
 * a button to mark today's devotional done (awards XP through the daily challenge hook),
 * and a mini worship pick.
 */
export default function VerseOfTheDay({ compact = false }) {
  const gam = useGamification()
  const verse = getVerseOfTheDay()
  const worship = getWorshipPick()
  const [saved, setSaved] = useState(false)

  function saveVerse() {
    setSaved(true)
    gam.awardXP(5, "for reflecting on the Word")
    // Touch activity for streak
    gam.touchActivity()
    setTimeout(() => setSaved(false), 2400)
  }

  function openVideo(url) {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer")
    gam.awardXP(5, "for digging deeper")
  }

  if (compact) {
    return (
      <div className="card" style={{ padding: 22, background: "var(--ink)", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: "var(--lime)", color: "var(--ink)", border: "2.5px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="book" size={18} />
          </span>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13, color: "var(--lime)" }}>Verse of the Day</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>{verse.theme} · {verse.ref}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.92)", marginBottom: 12, fontStyle: "italic" }}>
          &ldquo;{verse.text}&rdquo;
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => openVideo(verse.videoUrl)} className="btn btn-lime btn-sm" style={{ flex: 1, cursor: "pointer", fontSize: 11 }}>
            <Icon name="video" size={12} /> Study Video
          </button>
          <button onClick={saveVerse} className="btn btn-sm" style={{ background: saved ? "var(--pink)" : "#fff", fontSize: 11, cursor: "pointer", color: "var(--ink)" }}>
            <Icon name="heart" size={12} /> {saved ? "Saved" : "Reflect"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ background: "var(--ink)", color: "#fff", padding: 32, position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: "var(--purple)", opacity: 0.25 }} />
      <div aria-hidden style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "var(--lime)", opacity: 0.15 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
          <span className="eyebrow" style={{ background: "var(--lime)", color: "var(--ink)" }}>
            <Icon name="book" size={12} /> Verse of the Day
          </span>
          <span className="sticker pink" style={{ fontSize: 10 }}>{verse.theme}</span>
        </div>

        <blockquote style={{ margin: "0 0 18px", padding: 0 }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 3.6vw, 2.2rem)",
            lineHeight: 1.15,
            textTransform: "uppercase",
            color: "#fff",
            letterSpacing: "-0.01em",
          }}>
            &ldquo;{verse.text}&rdquo;
          </p>
          <footer style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, color: "var(--lime)", marginTop: 14 }}>
            {verse.ref}
          </footer>
        </blockquote>

        <div className="card" style={{ background: "rgba(255,255,255,0.08)", padding: "14px 16px", color: "#fff", marginBottom: 18, borderColor: "rgba(255,255,255,0.2)", boxShadow: "none" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lime)", marginBottom: 6 }}>
            Worship pick
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>{worship.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{worship.artist}</div>
            </div>
            <button
              onClick={() => openVideo(worship.url)}
              className="btn btn-lime btn-sm"
              style={{ cursor: "pointer", fontSize: 11 }}
            >
              <Icon name="play" size={11} /> Play
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => openVideo(verse.videoUrl)}
            className="btn btn-purple"
            style={{ flex: 1, cursor: "pointer" }}
          >
            <Icon name="video" size={14} /> Watch Study Video
          </button>
          <button
            onClick={saveVerse}
            className="btn btn-lime"
            style={{ cursor: "pointer" }}
          >
            <Icon name={saved ? "check" : "heart"} size={14} /> {saved ? "Saved" : "Reflect (+5 XP)"}
          </button>
        </div>
      </div>
    </div>
  )
}
