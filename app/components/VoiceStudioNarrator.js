"use client"

import { useState, useEffect, useMemo, useRef } from "react"

const LANGUAGE_PRESETS = [
  { code: "en-GB", label: "English (East Africa / UK)" },
  { code: "en-US", label: "English (Studio US)" },
  { code: "sw-KE", label: "Kiswahili (Kenya)" },
  { code: "fr-FR", label: "Français (Africa / France)" },
]

export function splitIntoSpeechChunks(rawText = "", maxChars = 220) {
  const normalized = String(rawText || "")
    .replace(/\r\n/g, "\n")
    .trim()
  if (!normalized) return []

  const paragraphs = normalized
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const chunks = []
  for (const para of paragraphs) {
    if (para.length <= maxChars) {
      chunks.push(para)
      continue
    }
    const sentences = para.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [para]
    let current = ""
    for (const s of sentences) {
      const clean = s.trim()
      if (!clean) continue
      if ((current + " " + clean).trim().length <= maxChars) {
        current = (current + " " + clean).trim()
      } else {
        if (current) chunks.push(current)
        current = clean
      }
    }
    if (current) chunks.push(current)
  }
  return chunks
}

export default function VoiceStudioNarrator({
  title = "Course & Book Audio Narrator",
  initialText = "",
  compact = false,
}) {
  const [text, setText] = useState(
    initialText ||
      "Welcome to CHRISCO Youth Aflame Digital Academy. Use VoiceStudio to narrate course handbooks, Christian study books, and AI project scripts aloud with paragraph splitting and speed control."
  )
  const [lang, setLang] = useState("en-GB")
  const [rate, setRate] = useState(1.0)
  const [chunkLimit, setChunkLimit] = useState(220)
  const [activeChunkIndex, setActiveChunkIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCustomEditor, setShowCustomEditor] = useState(false)
  const [dictatedNotes, setDictatedNotes] = useState("")
  const [isDictating, setIsDictating] = useState(false)
  const stopRequestedRef = useRef(false)

  useEffect(() => {
    if (initialText) {
      setText(initialText)
    }
  }, [initialText])

  const chunks = useMemo(
    () => splitIntoSpeechChunks(text, chunkLimit),
    [text, chunkLimit]
  )

  const estimatedSeconds = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round((words / (150 * rate)) * 60))
  }, [text, rate])

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speakChunkAt = (index) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }
    if (index >= chunks.length || stopRequestedRef.current) {
      setIsPlaying(false)
      setActiveChunkIndex(-1)
      return
    }

    setActiveChunkIndex(index)
    const utterance = new SpeechSynthesisUtterance(chunks[index])
    utterance.lang = lang
    utterance.rate = rate

    const voices = window.speechSynthesis.getVoices?.() || []
    const matchedVoice =
      voices.find((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase())) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en"))
    if (matchedVoice) {
      utterance.voice = matchedVoice
    }

    utterance.onend = () => {
      if (!stopRequestedRef.current) {
        speakChunkAt(index + 1)
      }
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      setActiveChunkIndex(-1)
    }

    window.speechSynthesis.speak(utterance)
  }

  const handlePlay = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }
    window.speechSynthesis.cancel()
    stopRequestedRef.current = false
    setIsPlaying(true)
    const startIdx = activeChunkIndex >= 0 ? activeChunkIndex : 0
    speakChunkAt(startIdx)
  }

  const handleStop = () => {
    stopRequestedRef.current = true
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setActiveChunkIndex(-1)
  }

  const handleToggleDictation = () => {
    if (typeof window === "undefined") return
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRec) {
      setDictatedNotes((prev) =>
        prev
          ? prev
          : "Voice dictation is ready in Chrome/Edge browsers with microphone access."
      )
      return
    }
    if (isDictating) {
      setIsDictating(false)
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
        background: "#002333",
        color: "#FFFFFF",
        borderRadius: 18,
        padding: compact ? "16px 18px" : "22px 24px",
        border: "1px solid rgba(0, 255, 132, 0.24)",
        boxShadow: "0 12px 28px rgba(0, 35, 51, 0.16)",
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
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              background: "rgba(0, 255, 132, 0.14)",
              color: "#00FF84",
              fontSize: 11,
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: 999,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            VoiceStudio · AI Narration &amp; Paste-and-Split
          </span>
          <div style={{ fontWeight: 800, fontSize: "1.02rem" }}>{title}</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <select
            aria-label="Narration language"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 10,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {LANGUAGE_PRESETS.map((p) => (
              <option key={p.code} value={p.code} style={{ color: "#0F172A" }}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Playback speed"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 10,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <option value={0.85} style={{ color: "#0F172A" }}>0.85x Calm</option>
            <option value={1.0} style={{ color: "#0F172A" }}>1.0x Normal</option>
            <option value={1.2} style={{ color: "#0F172A" }}>1.2x Brisk</option>
            <option value={1.4} style={{ color: "#0F172A" }}>1.4x Fast</option>
          </select>

          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              style={{
                background: "#00FF84",
                color: "#002333",
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
                background: "#EF4444",
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
            onClick={() => setShowCustomEditor((v) => !v)}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              padding: "7px 13px",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {showCustomEditor ? "Hide Script" : "Paste & Split"}
          </button>
        </div>
      </div>

      {showCustomEditor && (
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              fontSize: 12,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <span>
              Paste &amp; Split: {chunks.length} speech chunks · Est. {estimatedSeconds}s
            </span>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              Max chars/chunk:
              <input
                type="number"
                min={80}
                max={500}
                value={chunkLimit}
                onChange={(e) =>
                  setChunkLimit(Math.max(80, Math.min(500, Number(e.target.value) || 220)))
                }
                style={{
                  width: 68,
                  padding: "3px 6px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "#001824",
                  color: "#FFFFFF",
                  fontSize: 12,
                }}
              />
            </label>
          </div>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "#001824",
              color: "#FFFFFF",
              padding: "10px 12px",
              fontSize: 13,
              marginBottom: 10,
            }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={handleToggleDictation}
              style={{
                background: isDictating ? "#F59E0B" : "rgba(0,255,132,0.16)",
                color: isDictating ? "#0F172A" : "#00FF84",
                border: "1px solid rgba(0,255,132,0.35)",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {isDictating ? "● Listening... Click to Stop" : "🎙 Dictate Voice Study Note"}
            </button>
            {dictatedNotes && (
              <span style={{ fontSize: 12, color: "#A7F3D0" }}>
                Note: &ldquo;{dictatedNotes}&rdquo;
              </span>
            )}
          </div>
        </div>
      )}

      {/* Active Speech Chunks Rail */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: compact ? 110 : 160,
          overflowY: "auto",
        }}
      >
        {chunks.map((chunk, idx) => {
          const active = idx === activeChunkIndex
          return (
            <div
              key={idx}
              onClick={() => {
                stopRequestedRef.current = false
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel()
                  setIsPlaying(true)
                  speakChunkAt(idx)
                }
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                background: active
                  ? "rgba(0, 255, 132, 0.2)"
                  : "rgba(255, 255, 255, 0.05)",
                border: active
                  ? "1px solid #00FF84"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: 12.5,
                lineHeight: 1.5,
                color: active ? "#FFFFFF" : "rgba(255, 255, 255, 0.82)",
                cursor: "pointer",
              }}
            >
              <strong style={{ color: "#00FF84", marginRight: 8 }}>
                #{idx + 1}
              </strong>
              {chunk}
            </div>
          )
        })}
      </div>
    </div>
  )
}
