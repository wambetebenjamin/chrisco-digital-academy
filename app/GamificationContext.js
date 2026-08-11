"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "./AuthProvider"
import { supabase } from "./supabase"
import { BADGE_DEFS } from "./badgeDefs"

/* ============================================================
   Gamification Context
   - XP, Level, Streak, Badges
   - Persists to localStorage AND to Supabase `profiles` table when signed in
   - Daily streak logic: if last activity was yesterday, streak++
                            if today already, keep
                            else reset to 1
   - Awards XP with level up math (500 XP per level)
   ============================================================ */

const STORAGE_KEY = "chrisco_gamification_v1"
const XP_PER_LEVEL = 500

// Badge check functions (kept here since they inspect state shape)
const BADGE_CHECKS = {
  streak_3:      (s) => s.streak >= 3,
  streak_7:      (s) => s.streak >= 7,
  streak_21:     (s) => s.streak >= 21,
  first_quiz:    (s) => s.quizzesAnswered >= 1,
  quiz_10:       (s) => s.quizzesAnswered >= 10,
  buddy:         (s) => s.buddyFound,
  level_5:       (s) => calcLevel(s.xp) >= 5,
  xp_5000:       (s) => s.xp >= 5000,
  first_course:  (s) => s.coursesStarted >= 1,
  vault:         (s) => s.downloads >= 3,
}

const QUIZ_BANK = [
  {
    id: "q_css_1",
    q: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Color and Shape Syntax"],
    answer: 1,
    track: "Web Development",
  },
  {
    id: "q_py_1",
    q: "Which keyword defines a function in Python?",
    options: ["func", "def", "function", "lambda"],
    answer: 1,
    track: "Coding",
  },
  {
    id: "q_design_1",
    q: "Which color mode is used for screens and the web?",
    options: ["CMYK", "RGB", "Pantone", "Grayscale"],
    answer: 1,
    track: "Design",
  },
  {
    id: "q_marketing_1",
    q: "What does SEO stand for?",
    options: ["Social Engine Outreach", "Search Engine Optimization", "Site Engagement Online", "Sales Email Outreach"],
    answer: 1,
    track: "Marketing",
  },
  {
    id: "q_js_1",
    q: "Which keyword declares a variable that cannot be reassigned in JavaScript?",
    options: ["var", "let", "const", "static"],
    answer: 2,
    track: "Web Development",
  },
  {
    id: "q_py_2",
    q: "What will `print(2 ** 3)` output?",
    options: ["6", "8", "9", "23"],
    answer: 1,
    track: "Coding",
  },
  {
    id: "q_design_2",
    q: "Which pairing is a classic complementary contrast?",
    options: ["Blue and Purple", "Red and Green", "Pink and Orange", "Black and Gray"],
    answer: 1,
    track: "Design",
  },
  {
    id: "q_video_1",
    q: "What is the vertical aspect ratio for Reels and TikTok?",
    options: ["16:9", "9:16", "1:1", "4:3"],
    answer: 1,
    track: "Video",
  },
  {
    id: "q_biz_1",
    q: "In freelancing, a 50 percent deposit is best described as?",
    options: ["A bonus", "A risky move", "Standard good practice", "Illegal"],
    answer: 2,
    track: "Freelancing",
  },
  {
    id: "q_ai_1",
    q: "A good AI prompt should include role, task, format, and what else?",
    options: ["Emojis", "Tone", "Hashtags", "Password"],
    answer: 1,
    track: "AI",
  },
]

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

const daysBetween = (a, b) => {
  if (!a || !b) return 999
  const da = new Date(a)
  const db = new Date(b)
  const ms = db.setHours(0, 0, 0, 0) - da.setHours(0, 0, 0, 0)
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

function defaultState() {
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    badges: [],
    quizzesAnswered: 0,
    quizzesCorrect: 0,
    answeredQuizIds: [],
    buddyFound: false,
    coursesStarted: 0,
    downloads: 0,
    personalEvents: [], // {date: 'YYYY-M-D', title, type: 'class'|'due'|'event'|'personal'}
    upvotedThreads: [],
  }
}

function calcLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}
function xpToNextLevel(xp) {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL)
}
function levelProgressPct(xp) {
  return Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100)
}

const GamificationContext = createContext(null)

export function GamificationProvider({ children }) {
  const { user } = useAuth()
  const [state, setState] = useState(defaultState)
  const [loaded, setLoaded] = useState(false)
  const [toast, setToast] = useState(null) // {text, tone}

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = { ...defaultState(), ...JSON.parse(raw) }
        // Recompute streak based on current date
        const tk = todayKey()
        if (parsed.lastActiveDate !== tk) {
          const diff = daysBetween(parsed.lastActiveDate, tk)
          if (diff === 1) {
            // yesterday's streak continues once they take an action today; do not auto increment
          } else if (diff > 1) {
            parsed.streak = 0
          }
        }
        setState(parsed)
      }
    } catch {}
    setLoaded(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state, loaded])

  // If signed in, try to sync profile from Supabase
  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("xp, streak, badges, last_active_date, quizzes_answered, quizzes_correct, answered_quiz_ids, buddy_found, courses_started, downloads, personal_events")
          .eq("id", user.id)
          .single()
        if (error || !data || cancelled) return
        setState((prev) => {
          const merged = {
            ...prev,
            xp: data.xp ?? prev.xp,
            streak: data.streak ?? prev.streak,
            lastActiveDate: data.last_active_date ?? prev.lastActiveDate,
            badges: data.badges ?? prev.badges,
            quizzesAnswered: data.quizzes_answered ?? prev.quizzesAnswered,
            quizzesCorrect: data.quizzes_correct ?? prev.quizzesCorrect,
            answeredQuizIds: data.answered_quiz_ids ?? prev.answeredQuizIds,
            buddyFound: data.buddy_found ?? prev.buddyFound,
            coursesStarted: data.courses_started ?? prev.coursesStarted,
            downloads: data.downloads ?? prev.downloads,
            personalEvents: data.personal_events ?? prev.personalEvents,
          }
          return merged
        })
      } catch {}
    })()
    return () => { cancelled = true }
  }, [user])

  // Push state to Supabase whenever it changes (if signed in)
  useEffect(() => {
    if (!loaded || !user) return
    const t = setTimeout(() => {
      supabase
        .from("profiles")
        .upsert({
          id: user.id,
          xp: state.xp,
          streak: state.streak,
          last_active_date: state.lastActiveDate,
          badges: state.badges,
          quizzes_answered: state.quizzesAnswered,
          quizzes_correct: state.quizzesCorrect,
          answered_quiz_ids: state.answeredQuizIds,
          buddy_found: state.buddyFound,
          courses_started: state.coursesStarted,
          downloads: state.downloads,
          personal_events: state.personalEvents,
          updated_at: new Date().toISOString(),
        })
        .then(() => {})
        .catch(() => {})
    }, 800)
    return () => clearTimeout(t)
  }, [state, user, loaded])

  // Apply daily activity: touch lastActiveDate and keep streak logic
  const touchActivity = useCallback(() => {
    setState((prev) => {
      const tk = todayKey()
      if (prev.lastActiveDate === tk) return prev
      const diff = daysBetween(prev.lastActiveDate, tk)
      const newStreak = diff === 1 ? prev.streak + 1 : 1
      return { ...prev, lastActiveDate: tk, streak: newStreak }
    })
  }, [])

  const showToast = useCallback((text, tone = "lime") => {
    setToast({ text, tone })
    setTimeout(() => setToast(null), 2200)
  }, [])

  // Award XP (with level up detection)
  const awardXP = useCallback((amount, reason) => {
    let leveledUp = false
    let newBadges = []
    setState((prev) => {
      const nextXP = prev.xp + amount
      const prevLevel = calcLevel(prev.xp)
      const nextLevel = calcLevel(nextXP)
      if (nextLevel > prevLevel) leveledUp = true
      const newState = { ...prev, xp: nextXP }
      // Check badges (use current xp-derived level when evaluating)
      const checkState = { ...newState }
      for (const b of BADGE_DEFS) {
        if (!prev.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(checkState)) {
          newState.badges = [...(newState.badges || []), b.id]
          newBadges.push(b)
        }
      }
      return newState
    })
    touchActivity()
    if (reason) showToast(`+${amount} XP ${reason}`)
    if (leveledUp) setTimeout(() => showToast("Level Up!", "purple"), 400)
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 800 + i * 500)
    })
  }, [showToast, touchActivity])

  // Answer a quiz
  const answerQuiz = useCallback((quizId, chosenIndex) => {
    const quiz = QUIZ_BANK.find((q) => q.id === quizId)
    if (!quiz) return { correct: false, quiz }
    let alreadyAnswered = false
    setState((prev) => {
      if (prev.answeredQuizIds.includes(quizId)) {
        alreadyAnswered = true
        return prev
      }
      const correct = chosenIndex === quiz.answer
      const newState = {
        ...prev,
        quizzesAnswered: prev.quizzesAnswered + 1,
        quizzesCorrect: prev.quizzesCorrect + (correct ? 1 : 0),
        answeredQuizIds: [...prev.answeredQuizIds, quizId],
      }
      // Check badges
      for (const b of BADGE_DEFS) {
        if (!newState.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(newState)) {
          newState.badges = [...newState.badges, b.id]
        }
      }
      return newState
    })
    const correct = chosenIndex === quiz.answer
    if (!alreadyAnswered) {
      if (correct) awardXP(50, "for nailing the quiz")
      else awardXP(10, "for trying the quiz")
    }
    return { correct, quiz, alreadyAnswered }
  }, [awardXP])

  const findBuddy = useCallback(() => {
    let newBadges = []
    setState((prev) => {
      if (prev.buddyFound) return prev
      const next = { ...prev, buddyFound: true }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    awardXP(20, "for finding a study buddy")
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 400 + i * 500)
    })
  }, [awardXP, showToast])

  const trackDownload = useCallback(() => {
    let newBadges = []
    setState((prev) => {
      const next = { ...prev, downloads: prev.downloads + 1 }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    awardXP(15, "for grabbing a resource")
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 400 + i * 500)
    })
  }, [awardXP, showToast])

  const trackCourseStart = useCallback(() => {
    let newBadges = []
    setState((prev) => {
      const next = { ...prev, coursesStarted: prev.coursesStarted + 1 }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    awardXP(40, "for starting a course")
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 400 + i * 500)
    })
  }, [awardXP, showToast])

  const toggleUpvote = useCallback((threadKey) => {
    setState((prev) => {
      const has = prev.upvotedThreads.includes(threadKey)
      return {
        ...prev,
        upvotedThreads: has
          ? prev.upvotedThreads.filter((k) => k !== threadKey)
          : [...prev.upvotedThreads, threadKey],
      }
    })
    awardXP(5, "")
  }, [awardXP])

  const addPersonalEvent = useCallback((event) => {
    setState((prev) => ({
      ...prev,
      personalEvents: [...prev.personalEvents, { ...event, id: Date.now() }],
    }))
    showToast("Event added to calendar", "lime")
    awardXP(10, "for planning ahead")
  }, [awardXP, showToast])

  const removePersonalEvent = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      personalEvents: prev.personalEvents.filter((e) => e.id !== id),
    }))
  }, [])

  const getRandomQuiz = useCallback(() => {
    // Prefer quizzes not yet answered, else any
    const unanswered = QUIZ_BANK.filter((q) => !state.answeredQuizIds.includes(q.id))
    const pool = unanswered.length ? unanswered : QUIZ_BANK
    return pool[Math.floor(Math.random() * pool.length)]
  }, [state.answeredQuizIds])

  const earnedBadges = BADGE_DEFS.filter((b) => state.badges.includes(b.id))

  const value = {
    // state
    ...state,
    level: calcLevel(state.xp),
    xpToNext: xpToNextLevel(state.xp),
    levelProgress: levelProgressPct(state.xp),
    loaded,
    toast,
    earnedBadges,
    badgeDefs: BADGE_DEFS,
    quizBank: QUIZ_BANK,
    // actions
    awardXP,
    answerQuiz,
    findBuddy,
    trackDownload,
    trackCourseStart,
    toggleUpvote,
    addPersonalEvent,
    removePersonalEvent,
    getRandomQuiz,
    touchActivity,
    dismissToast: () => setToast(null),
  }

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>
}

export function useGamification() {
  return useContext(GamificationContext)
}
