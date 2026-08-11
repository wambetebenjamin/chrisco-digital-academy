"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "./AuthProvider"
import { supabase } from "./supabase"
import { BADGE_DEFS } from "./badgeDefs"
import emailjs from "@emailjs/browser"

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
const EMAILJS_SERVICE = "service_m86zbad"
const EMAILJS_TEMPLATE = "template_i5wg4c8"
const EMAILJS_KEY = "eVsfqNv-Jtq46-4b2"

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
  // Generate a short local referral code if none exists
  let referralCode = null
  try {
    referralCode = localStorage.getItem("chrisco_referral_code")
  } catch {}
  if (!referralCode) {
    referralCode = "CHRISCO" + Math.random().toString(36).slice(2, 8).toUpperCase()
    try {
      localStorage.setItem("chrisco_referral_code", referralCode)
    } catch {}
  }

  // Detect ?ref=XXXXXX in the URL and save it (reward when this user signs up / starts first course)
  let pendingReferral = null
  try {
    const url = new URL(window.location.href)
    const refParam = url.searchParams.get("ref")
    if (refParam) {
      pendingReferral = refParam
      localStorage.setItem("chrisco_pending_ref", refParam)
    } else {
      pendingReferral = localStorage.getItem("chrisco_pending_ref")
    }
  } catch {}

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
    startedCourses: {}, // { courseId: { startedAt, progress, lessonsCompleted: n } }
    downloads: 0,
    personalEvents: [], // {id, date, title, type, time, emailReminder, reminderEmail}
    upvotedThreads: [],
    referralCode,
    referralsMade: [], // list of referred codes we've already rewarded for
    pendingReferral, // code from the friend who referred us
    referralBonusClaimed: false, // whether we got our bonus for signing up via a link
    referralRewards: 0, // count of friends who signed up via our link
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
function formatTime(t) {
  if (!t) return ""
  const [hStr, mStr] = t.split(":")
  let h = parseInt(hStr, 10)
  const m = (mStr || "00").padStart(2, "0")
  const suffix = h >= 12 ? "pm" : "am"
  h = h % 12 || 12
  return `${h}:${m} ${suffix}`
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
          .select("xp, streak, badges, last_active_date, quizzes_answered, quizzes_correct, answered_quiz_ids, buddy_found, courses_started, started_courses, downloads, personal_events, upvoted_threads, referral_code, referrals_made, referral_bonus_claimed, referral_rewards")
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
            startedCourses: data.started_courses ?? prev.startedCourses,
            downloads: data.downloads ?? prev.downloads,
            personalEvents: data.personal_events ?? prev.personalEvents,
            upvotedThreads: data.upvoted_threads ?? prev.upvotedThreads,
            referralCode: data.referral_code ?? prev.referralCode,
            referralsMade: data.referrals_made ?? prev.referralsMade,
            referralBonusClaimed: data.referral_bonus_claimed ?? prev.referralBonusClaimed,
            referralRewards: data.referral_rewards ?? prev.referralRewards,
          }
          // persist referral code to localStorage
          try {
            if (merged.referralCode) localStorage.setItem("chrisco_referral_code", merged.referralCode)
          } catch {}
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
          started_courses: state.startedCourses,
          downloads: state.downloads,
          personal_events: state.personalEvents,
          upvoted_threads: state.upvotedThreads,
          referral_code: state.referralCode,
          referrals_made: state.referralsMade,
          referral_bonus_claimed: state.referralBonusClaimed,
          referral_rewards: state.referralRewards,
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

  const trackCourseStart = useCallback((courseId, courseTitle) => {
    let firstStart = false
    let newBadges = []
    let referralBonus = 0
    setState((prev) => {
      const key = String(courseId)
      if (prev.startedCourses && prev.startedCourses[key]) {
        return prev // already started
      }
      firstStart = true
      const next = {
        ...prev,
        coursesStarted: prev.coursesStarted + 1,
        startedCourses: {
          ...(prev.startedCourses || {}),
          [key]: {
            title: courseTitle || key,
            startedAt: new Date().toISOString(),
            progress: 0,
            lessonsCompleted: 0,
            lastOpened: new Date().toISOString(),
          },
        },
      }
      // First course referral bonus (200 XP both sides if a ref is pending)
      if (prev.pendingReferral && !prev.referralBonusClaimed && next.coursesStarted >= 1) {
        next.xp = prev.xp + 200
        next.referralBonusClaimed = true
        referralBonus = 200
        try { localStorage.removeItem("chrisco_pending_ref") } catch {}
      }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    if (firstStart) {
      awardXP(40, "for starting a course")
      newBadges.forEach((b, i) => {
        setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 400 + i * 500)
      })
      if (referralBonus) {
        setTimeout(() => showToast("+200 XP friend referral bonus!", "yellow"), 800)
      }
    }
  }, [awardXP, showToast])

  const trackLessonComplete = useCallback((courseId, lessonCount = 1) => {
    let newBadges = []
    setState((prev) => {
      const key = String(courseId)
      const existing = prev.startedCourses?.[key]
      if (!existing) return prev
      const updated = {
        ...existing,
        lessonsCompleted: (existing.lessonsCompleted || 0) + lessonCount,
        lastOpened: new Date().toISOString(),
      }
      // progress auto-advances by one lesson out of 8 (typical course length)
      updated.progress = Math.min(100, Math.round(((updated.lessonsCompleted || 0) / 8) * 100))
      const next = {
        ...prev,
        startedCourses: { ...(prev.startedCourses || {}), [key]: updated },
      }
      next.xp = prev.xp + 20 // 20 XP per lesson
      // check badges
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    touchActivity()
    showToast("+20 XP lesson complete", "lime")
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 600 + i * 500)
    })
  }, [showToast, touchActivity])

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
    const id = Date.now()
    const newEvent = { ...event, id }
    setState((prev) => ({
      ...prev,
      personalEvents: [...prev.personalEvents, newEvent],
    }))
    showToast("Event added to calendar", "lime")
    awardXP(10, "for planning ahead")

    // Request browser notification permission lazily
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {})
      }
    }

    // Send email reminder if requested (EmailJS template will include details)
    if (event.emailReminder && event.reminderEmail) {
      const eventDate = new Date(event.date)
      const timeStr = formatTime(event.time)
      const dateStr = eventDate.toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
      emailjs
        .send(
          EMAILJS_SERVICE,
          EMAILJS_TEMPLATE,
          {
            from_name: "CHRISCO Digital Academy",
            from_email: "reminders@chrisco.academy",
            to_name: event.reminderEmail.split("@")[0],
            to_email: event.reminderEmail,
            message: `Reminder: ${event.title} on ${dateStr} at ${timeStr}. Open your dashboard to join: ${window.location.origin}/dashboard`,
            phone: "+254 112 272 061",
          },
          EMAILJS_KEY,
        )
        .then(() => {
          showToast("Reminder email sent!", "purple")
        })
        .catch(() => {
          // Silently fail - user still has browser reminder
        })
    }

    // Schedule a browser notification 10 minutes before if time is set
    if (event.date && event.time && typeof window !== "undefined") {
      const eventDate = new Date(event.date)
      const [h, m] = (event.time || "00:00").split(":").map(Number)
      eventDate.setHours(h || 0, m || 0, 0, 0)
      const notifyAt = eventDate.getTime() - 10 * 60 * 1000
      const delay = notifyAt - Date.now()
      if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 7) {
        setTimeout(() => {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("CHRISCO: " + event.title, {
              body: `Starting in 10 minutes (${formatTime(event.time)})`,
              icon: "/favicon.ico",
            })
          }
        }, delay)
      }
    }
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

  // Generate a shareable referral link
  const getReferralLink = useCallback(() => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/sign-up?ref=${state.referralCode}`
  }, [state.referralCode])

  // When a referred friend completes their first course (sign-up flow), call this to credit the referrer
  // Since we don't have a backend here, we'll simulate it via localStorage and show a toast
  const claimReferralBonus = useCallback(() => {
    setState((prev) => {
      if (prev.referralBonusClaimed || !prev.pendingReferral) return prev
      try { localStorage.removeItem("chrisco_pending_ref") } catch {}
      return {
        ...prev,
        xp: prev.xp + 200,
        referralBonusClaimed: true,
      }
    })
    showToast("+200 XP referral bonus claimed!", "yellow")
  }, [showToast])

  // Generate a deterministic Jitsi room URL for a lounge name.
  // Rooms are public and require no API key. We add a random suffix per session
  // but keep it stable per lounge name per day so people meet up.
  const getJitsiRoom = useCallback((loungeName) => {
    const safe = (loungeName || "room")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)
    const d = new Date()
    const dayKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    return `https://meet.jit.si/chrisco-${safe}-${dayKey}`
  }, [])

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
    trackLessonComplete,
    toggleUpvote,
    addPersonalEvent,
    removePersonalEvent,
    getRandomQuiz,
    touchActivity,
    getReferralLink,
    claimReferralBonus,
    getJitsiRoom,
    dismissToast: () => setToast(null),
  }

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>
}

export function useGamification() {
  return useContext(GamificationContext)
}
