"use client"
import { useEffect, useState } from "react"
import { useGamification } from "../GamificationContext"
import Icon from "./Icon"

/**
 * MicroQuiz - swipe-style single question quiz.
 * Props:
 *  - quizId: optional fixed quiz; if omitted, picks a random unanswered one
 *  - onDone: optional callback
 *  - variant: "paper" (default cream card) | "ink" (dark card) | "lime" | "purple"
 */
export default function MicroQuiz({ quizId, onDone, variant = "paper" }) {
  const { quizBank, answerQuiz, getRandomQuiz } = useGamification()
  const [quiz, setQuiz] = useState(null)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null) // "correct" | "wrong" | null
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (quizId) {
      setQuiz(quizBank.find((q) => q.id === quizId) || quizBank[0])
    } else {
      setQuiz(getRandomQuiz())
    }
    setSelected(null); setResult(null); setLocked(false)
  }, [quizId, quizBank, getRandomQuiz])

  function choose(idx) {
    if (locked || !quiz) return
    setSelected(idx)
    const res = answerQuiz(quiz.id, idx)
    setResult(res.correct ? "correct" : "wrong")
    setLocked(true)
    if (onDone) setTimeout(() => onDone(res.correct), 900)
  }

  function nextQuiz() {
    setQuiz(getRandomQuiz())
    setSelected(null); setResult(null); setLocked(false)
  }

  if (!quiz) return null

  const bg = {
    paper: "var(--paper-2)",
    ink: "var(--ink)",
    lime: "var(--lime)",
    purple: "var(--purple)",
    pink: "var(--pink)",
    yellow: "var(--yellow)",
  }[variant]
  const textCol = variant === "ink" || variant === "purple" || variant === "pink" ? "#fff" : "var(--ink)"

  return (
    <div className="card" style={{ padding: "24px 26px", background: bg, color: textCol }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <span className="sticker lime" style={{ fontSize: 10 }}>
          <Icon name="bolt" size={11} /> Micro Quiz
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.85 }}>
          {quiz.track} · +50 XP
        </span>
      </div>
      <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.2rem", marginBottom: 16, color: textCol }}>
        {quiz.q}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        {quiz.options.map((opt, i) => {
          let cls = ""
          if (locked) {
            if (i === quiz.answer) cls = "correct"
            else if (i === selected) cls = "wrong"
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`quiz-opt ${cls}`}
              style={{
                background: cls === "correct" ? "var(--lime)" : cls === "wrong" ? "var(--pink)" : (variant === "ink" ? "rgba(255,255,255,0.08)" : "#fff"),
                color: cls === "wrong" ? "#fff" : (cls === "correct" ? "var(--ink)" : (variant === "ink" ? "#fff" : "var(--ink)")),
                borderColor: variant === "ink" && !cls ? "rgba(255,255,255,0.3)" : "var(--ink)",
                textAlign: "left",
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: "var(--ink)", color: cls === "correct" ? "var(--lime)" : "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: 12, flexShrink: 0,
              }}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {result === "correct" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <span className="sticker lime" style={{ fontSize: 11 }}>Correct. +50 XP.</span>
          <button onClick={nextQuiz} className="btn btn-ink btn-sm" style={{ fontSize: 11, padding: "7px 12px" }}>
            Next question
          </button>
        </div>
      )}
      {result === "wrong" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <span className="sticker pink" style={{ fontSize: 11 }}>
            Not quite. Answer: {quiz.options[quiz.answer]}
          </span>
          <button onClick={nextQuiz} className="btn btn-sm" style={{ fontSize: 11, padding: "7px 12px" }}>
            Try another
          </button>
        </div>
      )}
    </div>
  )
}
