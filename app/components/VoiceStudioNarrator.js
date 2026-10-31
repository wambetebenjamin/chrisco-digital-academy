"use client"

import { useState, useEffect, useMemo } from "react"

export function splitScriptIntoChunks(rawText = "") {
  const cleaned = String(rawText || "").trim()
  if (!cleaned) return []

  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  const chunks = []
  paragraphs.forEach((para, pIndex) => {
    const sentences = para
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)

    sentences.forEach((sentence, sIndex) => {
      chunks.push({
        id: `p${pIndex + 1}-s${sIndex + 1}`,
        paragraph: pIndex + 1,
        text: sentence,
      })
    })
  })

  return chunks
}

const LANGUAGE_PRESETS = [
  { code: "en-KE", label: "English (Kenya)" },
  { code: "en-UG", label: "English (Uganda)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "en-US", label: "English (US)" },
  { code: "sw-KE", label: "Kiswahili (East Africa)" },
]

const CHUNK_POSTER_COLORS = ["#E60914", "#084EC8", "#38A128", "#EE6816", "#D99B00"]

export default function VoiceStudioNarrator({
  title = "VoiceStudio · AI Audio Narrator & Paste-and-Split",
  initialText = "Welcome to CHRISCO Youth Aflame Digital Academy. Learn practical digital skills, AI tools, coding, design, and creative projects designed for young minds.",
  compact = false,
}) {
  const [text, setText] = useState(initialText)
  const [lang, setLang] = useState("en-KE")
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeChunkIndex, setActiveChunkIndex] = useState(-1)
  const [showStudioPanel, setShowStudioPanel] = useState(!compact)
  const [dictatedNotes, setDictatedNotes] = useState("")
  const [isDictating, setIsDictating] = useState(false)

  useEffect(() => {
    setText(initialText)
  }, [initialText])

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const chunks = useMemo(() => splitScriptIntoChunks(text), [text])
  const wordCount = useMemo(
    () => (text.trim() ? text.trim().split(/\s+/).length : 0),
    [text]
  )
  const estimatedSeconds = Math.max(1, Math.round((wordCount / 145) * 60))

  const speakChunkAt = (index) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsPlaying(false)
      return
    }
    if (index >= chunks.length) {
      setIsPlaying(false)
      setActiveChunkIndex(-1)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new window.SpeechSynthesisUtterance(chunks[index].text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    setActiveChunkIndex(index)
    setIsPlaying(true)

    utterance.onend = () => {
      if (index + 1 < chunks.length) {
        speakChunkAt(index + 1)
      } else {
        setIsPlaying(false)
        setActiveChunkIndex(-1)
      }
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      setActiveChunkIndex(-1)
    }

    window.speechSynthesis.speak(utterance)
  }

  const handlePlay = () => {
    if (!chunks.length) return
    speakChunkAt(0)
  }

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setActiveChunkIndex(-1)
  }

  const handleStartDictation = () => {
    if (typeof window === "undefined") return
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRec) {
      setDictatedNotes((prev) =>
        prev
          ? prev
          : "Voice dictation uses Web Speech Recognition in supported browsers (Chrome/Edge). Type your study notes below!"
      )
      return
    }
    try {
      const rec = new SpeechRec()
      rec.lang = lang
      rec.continuous = false
      rec.interimResults = false
      setIsDictating(true)
      rec.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ""
        if (transcript) {
          setDictatedNotes((prev) => (prev ? `${prev} ${transcript}` : transcript))
        }
      }
      rec.onend = () => setIsDictating(false)
      rec.onerror = () => setIsDictating(false)
      rec.start()
    } catch {
      setIsDictating(false)
    }
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        color: "#0B1D51",
        borderRadius: 12,
        padding: compact ? "16px 18px" : "24px 24px",
        border: "1px solid #DCE3F0",
        borderTop: "5px solid #084EC8",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
          paddingBottom: 12,
          borderBottom: "1px solid #DCE3F0",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              background: "#084EC8",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 800,
              padding: "3px 12px",
              borderRadius: 999,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            VoiceStudio · AI Narration &amp; Paste-and-Split
          </span>
          <div style={{ fontWeight: 900, fontSize: "1.08rem", color: "#0B1D51" }}>{title}</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <select
            aria-label="Narration language"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: "#F7F6F1",
              color: "#0B1D51",
              border: "1px solid #C2CEE3",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {LANGUAGE_PRESETS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Playback speed"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{
              background: "#F7F6F1",
              color: "#0B1D51",
              border: "1px solid #C2CEE3",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <option value={0.85}>0.85x Calm</option>
            <option value={1.0}>1.0x Normal</option>
            <option value={1.2}>1.2x Brisk</option>
            <option value={1.4}>1.4x Fast</option>
          </select>

          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              style={{
                background: "#38A128",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 999,
                padding: "8px 16px",
                fontWeight: 800,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              ▶ Listen Aloud ({estimatedSeconds}s)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              style={{
                background: "#E60914",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 999,
                padding: "8px 16px",
                fontWeight: 800,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              ■ Stop Narration
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowStudioPanel((v) => !v)}
            style={{
              background: "#F8C90E",
              color: "#0B1D51",
              border: "none",
              borderRadius: 999,
              padding: "7px 14px",
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {showStudioPanel ? "Hide Chunks" : `Paste & Split (${chunks.length})`}
          </button>
        </div>
      </div>

      {showStudioPanel && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginTop: 14,
          }}
        >
          {/* Paste & Split Script Editor */}
          <div style={{ background: "#F7F6F1", padding: 14, borderRadius: 10, border: "1px solid #DCE3F0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#E60914",
                marginBottom: 6,
                fontWeight: 800,
              }}
            >
              <span>• Paste &amp; Split Script</span>
              <span style={{ color: "#084EC8" }}>
                {wordCount} words · {chunks.length} sentence chunks
              </span>
            </div>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste any study passage or lesson script here to automatically split into narratable sentence chunks..."
              style={{
                width: "100%",
                background: "#FFFFFF",
                color: "#0B1D51",
                border: "1px solid #C2CEE3",
                borderRadius: 8,
                padding: 10,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            />

            {/* Sentence Chunks List — Poster Divider Rows */}
            <div
              style={{
                maxHeight: 165,
                overflowY: "auto",
                marginTop: 10,
                background: "#FFFFFF",
                border: "1px solid #DCE3F0",
                borderRadius: 8,
              }}
            >
              {chunks.map((c, idx) => {
                const cColor = CHUNK_POSTER_COLORS[idx % CHUNK_POSTER_COLORS.length]
                const isActive = activeChunkIndex === idx
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => speakChunkAt(idx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: isActive ? "#FEF9E3" : "#FFFFFF",
                      color: "#0B1D51",
                      border: "none",
                      borderBottom: "1px solid #E5E9F2",
                      borderLeft: `4px solid ${cColor}`,
                      padding: "8px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    <strong style={{ color: cColor, marginRight: 6 }}>
                      [{c.id}]
                    </strong>
                    {c.text}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Voice Dictation & Study Notes */}
          <div style={{ background: "#F7F6F1", padding: 14, borderRadius: 10, border: "1px solid #DCE3F0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: "#38A128",
                marginBottom: 6,
                fontWeight: 800,
              }}
            >
              <span>• Voice Dictation &amp; Study Notes</span>
              <button
                type="button"
                onClick={handleStartDictation}
                style={{
                  background: isDictating ? "#E60914" : "#EE6816",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isDictating ? "● Listening..." : "🎤 Dictate Note"}
              </button>
            </div>
            <textarea
              rows={5}
              value={dictatedNotes}
              onChange={(e) => setDictatedNotes(e.target.value)}
              placeholder="Click 'Dictate Note' to transcribe spoken reflections, or type your study summary here..."
              style={{
                width: "100%",
                background: "#FFFFFF",
                color: "#0B1D51",
                border: "1px solid #C2CEE3",
                borderRadius: 8,
                padding: 10,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <label style={{ fontSize: 11.5, color: "#0B1D51", fontWeight: 700 }}>
                Voice Pitch ({pitch.toFixed(1)}):
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  style={{ marginLeft: 8, verticalAlign: "middle", accentColor: "#084EC8" }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!dictatedNotes.trim() || typeof window === "undefined") return
                  const blob = new Blob([dictatedNotes], { type: "text/plain;charset=utf-8" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "chrisco-study-notes.txt"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                style={{
                  background: "#084EC8",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 999,
                  padding: "5px 12px",
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Export Notes (.txt)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
