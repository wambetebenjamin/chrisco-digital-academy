"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Icon from "./Icon"
import { useGamification } from "../GamificationContext"

/**
 * PomodoroTimer: 25 min focus timer with start/pause/reset, audio chime,
 * and XP reward on session completion. Also supports 5 min short break and
 * 15 min long break presets.
 */
export default function PomodoroTimer() {
  const gam = useGamification()
  const complete = gam.completePomodoro
  const toast = gam.showToast

  const PRESETS = [
    { id: "focus", label: "Focus", minutes: 25, color: "var(--lime)", ring: "var(--ink)" },
    { id: "short", label: "Short Break", minutes: 5, color: "var(--pink)", ring: "#fff" },
    { id: "long", label: "Long Break", minutes: 15, color: "var(--purple)", ring: "#fff" },
  ]

  const [preset, setPreset] = useState(PRESETS[0])
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [sessionsDone, setSessionsDone] = useState(0)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  const totalSeconds = preset.minutes * 60
  const progress = 1 - secondsLeft / totalSeconds
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const ss = String(secondsLeft % 60).padStart(2, "0")

  const chime = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
      const ctx = audioCtxRef.current
      const now = ctx.currentTime
      // Play a little triumphant arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = "sine"
        o.frequency.setValueAtTime(freq, now + i * 0.14)
        g.gain.setValueAtTime(0.0001, now + i * 0.14)
        g.gain.exponentialRampToValueAtTime(0.22, now + i * 0.14 + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.35)
        o.connect(g).connect(ctx.destination)
        o.start(now + i * 0.14)
        o.stop(now + i * 0.14 + 0.4)
      })
    } catch {}
  }, [])

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          chime()
          // Award XP only on focus session completion
          if (preset.id === "focus") {
            complete(preset.minutes)
            setSessionsDone((n) => n + 1)
          } else {
            toast(`Break done! Ready to focus again?`, "lime")
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, preset, complete, toast, chime])

  function selectPreset(p) {
    if (running) return
    setPreset(p)
    setSecondsLeft(p.minutes * 60)
  }

  function toggle() {
    // Unlock audio ctx on first interaction
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx && !audioCtxRef.current) audioCtxRef.current = new Ctx()
    } catch {}
    setRunning((r) => !r)
  }

  function reset() {
    setRunning(false)
    setSecondsLeft(preset.minutes * 60)
  }

  const R = 84
  const C = 2 * Math.PI * R
  const dash = C * progress

  return (
    <div
      className="card"
      style={{
        background: preset.color,
        padding: 26,
        color: preset.id === "focus" ? "var(--ink)" : "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: preset.ring,
            color: preset.id === "focus" ? "var(--lime)" : preset.color,
            border: "2.5px solid var(--ink)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="clock" size={22} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>Focus Timer</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            {running ? "Running" : secondsLeft === 0 ? "Done!" : "Pomodoro technique"}
          </div>
        </div>
        {sessionsDone > 0 && (
          <span
            className="sticker"
            style={{
              background: preset.ring,
              color: preset.id === "focus" ? "var(--ink)" : preset.color,
              fontSize: 10,
            }}
          >
            {sessionsDone} done
          </span>
        )}
      </div>

      {/* Preset tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPreset(p)}
            disabled={running}
            style={{
              flex: 1,
              padding: "8px 6px",
              border: "2.5px solid var(--ink)",
              borderRadius: 10,
              background: preset.id === p.id ? preset.ring : "transparent",
              color: preset.id === p.id ? (p.id === "focus" ? "var(--ink)" : p.color) : "inherit",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 11,
              cursor: running ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              opacity: preset.id === p.id ? 1 : 0.75,
            }}
          >
            {p.minutes}m {p.label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Dial */}
      <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 18px" }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={preset.ring}
            strokeOpacity="0.25"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={preset.ring}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - dash}
            style={{ transition: "stroke-dashoffset 0.8s linear" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3rem",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {mm}:{ss}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: 4,
              opacity: 0.8,
            }}
          >
            {preset.label}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={toggle}
          className="btn"
          style={{
            flex: 1,
            background: preset.ring,
            color: preset.id === "focus" ? "var(--ink)" : preset.color,
            cursor: "pointer",
          }}
        >
          <Icon name={running ? "mic" : "play"} size={16} />
          {running ? "Pause" : secondsLeft === 0 ? "Restart" : "Start"}
        </button>
        <button
          onClick={reset}
          className="btn"
          style={{
            background: "transparent",
            color: "inherit",
            borderColor: "var(--ink)",
            cursor: "pointer",
            padding: "15px 18px",
          }}
          aria-label="Reset"
        >
          <Icon name="x" size={16} />
        </button>
      </div>

      <p style={{ fontSize: 12, marginTop: 12, opacity: 0.8, textAlign: "center" }}>
        {preset.id === "focus"
          ? "Complete a 25 min focus block to earn 35 XP and progress toward focus badges."
          : "Take a breath, stretch, rest your eyes."}
      </p>
    </div>
  )
}