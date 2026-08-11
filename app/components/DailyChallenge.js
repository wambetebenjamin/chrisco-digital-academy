"use client"
import Icon from "./Icon"
import { useGamification } from "../GamificationContext"

/**
 * DailyChallenge: shows today's rotating challenge with progress context.
 * Challenges reset at midnight local time. Completion is auto detected by
 * checkDailyChallenge() in GamificationContext whenever the user does the
 * action (quiz/lesson/pomo/buddy/upvote/download/streak).
 */
export default function DailyChallenge() {
  const gam = useGamification()
  const challenge = gam.getTodayChallenge()
  const done = gam.dailyChallengeDone
  const date = gam.dailyChallengeDate
  const total = gam.dailyChallengesCompleted || 0
  const streak = gam.streak || 0

  // Hint text per challenge id
  const hints = {
    d_quiz: "Answer any micro quiz correctly today.",
    d_lesson: "Finish one video lesson in any course.",
    d_pomo: "Complete a full 25 min focus session.",
    d_buddy: "Click Find My Buddy in the community.",
    d_upvote: "Upvote two discussion threads.",
    d_download: "Grab one resource from the vault.",
    d_streak: "Log in and do any study action today.",
  }

  const colorMap = {
    d_quiz: "var(--yellow)",
    d_lesson: "var(--lime)",
    d_pomo: "var(--pink)",
    d_buddy: "var(--purple)",
    d_upvote: "var(--orange)",
    d_download: "var(--blue)",
    d_streak: "var(--red)",
  }
  const bg = colorMap[challenge.id] || "var(--yellow)"
  const onDark = ["var(--purple)", "var(--pink)", "var(--blue)", "var(--red)"].includes(bg)
  const text = onDark ? "#fff" : "var(--ink)"
  const ring = onDark ? "#fff" : "var(--ink)"
  const ringText = onDark ? bg : "var(--lime)"

  return (
    <div
      className="card"
      style={{
        background: bg,
        color: text,
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: ring,
          opacity: 0.1,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: ring,
            color: ringText,
            border: "2.5px solid var(--ink)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={challenge.icon} size={22} />
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            Daily Challenge
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>
            Resets at midnight
          </div>
        </div>
        <span
          className="sticker"
          style={{
            background: ring,
            color: ringText,
            fontSize: 10,
          }}
        >
          +{challenge.xp} XP
        </span>
      </div>

      <h3
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 800,
          fontSize: "clamp(1.15rem,2.4vw,1.4rem)",
          lineHeight: 1.2,
          marginBottom: 8,
          color: text,
        }}
      >
        {challenge.label}
      </h3>
      <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9, marginBottom: 16 }}>
        {hints[challenge.id] || "Complete it to earn bonus XP."}
      </p>

      {/* Progress / status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          border: "2.5px solid var(--ink)",
          borderRadius: 14,
          background: done ? "rgba(10,10,10,0.15)" : "rgba(255,255,255,0.35)",
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: done ? "var(--lime)" : ring,
            color: done ? "var(--ink)" : ringText,
            border: "2px solid var(--ink)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={done ? "check" : challenge.icon} size={16} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13 }}>
            {done ? "Completed today!" : "In progress"}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>
            {total} challenges completed so far
            {streak > 0 ? ` · ${streak} day streak` : ""}
          </div>
        </div>
        {done && (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              lineHeight: 1,
            }}
          >
            +{challenge.xp}
          </span>
        )}
      </div>
    </div>
  )
}
