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
  streak_3:       (s) => s.streak >= 3,
  streak_7:       (s) => s.streak >= 7,
  streak_21:      (s) => s.streak >= 21,
  first_quiz:     (s) => s.quizzesAnswered >= 1,
  quiz_10:        (s) => s.quizzesAnswered >= 10,
  buddy:          (s) => s.buddyFound,
  level_5:        (s) => calcLevel(s.xp) >= 5,
  xp_5000:        (s) => s.xp >= 5000,
  first_course:   (s) => s.coursesStarted >= 1,
  vault:          (s) => s.downloads >= 3,
  pomodoro_5:     (s) => (s.pomodoroCompleted || 0) >= 5,
  pomodoro_25:    (s) => (s.pomodoroCompleted || 0) >= 25,
  focus_master:   (s) => (s.focusMinutes || 0) >= 500,
  course_complete:(s) => {
    return Object.values(s.startedCourses || {}).some((c) => (c.progress || 0) >= 100)
  },
  daily_7:        (s) => (s.dailyChallengesCompleted || 0) >= 7,
  quiz_perfect:   (s) => (s.perfectQuizzes || 0) >= 3,
}

// Daily challenge generator - deterministic from date so everyone gets the same challenge each day
const DAILY_CHALLENGES = [
  { id: "d_quiz",    label: "Answer a quiz correctly",         xp: 75, icon: "bolt" },
  { id: "d_lesson",  label: "Complete 1 video lesson",         xp: 60, icon: "play" },
  { id: "d_pomo",    label: "Finish a 25 min focus session",   xp: 80, icon: "clock" },
  { id: "d_buddy",   label: "Match with a study buddy",        xp: 50, icon: "users" },
  { id: "d_upvote",  label: "Upvote 2 community threads",      xp: 30, icon: "arrow-up" },
  { id: "d_download",label: "Grab a free resource",            xp: 40, icon: "download" },
  { id: "d_streak",  label: "Keep your streak alive",          xp: 25, icon: "flame" },
]

function getTodayChallenge() {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((d - start) / 86400000)
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length]
}

function isToday(dateStr) {
  if (!dateStr) return false
  return dateStr === todayKey()
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
    perfectQuizzes: 0,
    perfectStreak: 0,
    lastQuizCorrect: false,
    lastQuizDate: null,
    lastLessonDate: null,
    lastPomodoroDate: null,
    lastDownloadDate: null,
    upvoteCountToday: 0,
    coursesStarted: 0,
    startedCourses: {},
    lessonsCompleted: 0,
    downloads: 0,
    personalEvents: [],
    upvotedThreads: [],
    referralCode,
    referralsMade: [],
    pendingReferral,
    referralBonusClaimed: false,
    referralRewards: 0,
    pomodoroCompleted: 0,
    focusMinutes: 0,
    dailyChallengesCompleted: 0,
    dailyChallengeDate: null,
    dailyChallengeDone: false,
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
            // yesterday's streak continues once they take an action today
          } else if (diff > 1) {
            parsed.streak = 0
          }
        }
        // Reset daily flags if last action was not today
        if (!isToday(parsed.dailyChallengeDate)) {
          parsed.dailyChallengeDone = false
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
          .select("xp, streak, badges, last_active_date, quizzes_answered, quizzes_correct, answered_quiz_ids, buddy_found, courses_started, started_courses, downloads, personal_events, upvoted_threads, referral_code, referrals_made, referral_bonus_claimed, referral_rewards, pomodoro_completed, focus_minutes, daily_challenges_completed, daily_challenge_date, daily_challenge_done, lessons_completed, perfect_quizzes")
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
            pomodoroCompleted: data.pomodoro_completed ?? prev.pomodoroCompleted,
            focusMinutes: data.focus_minutes ?? prev.focusMinutes,
            dailyChallengesCompleted: data.daily_challenges_completed ?? prev.dailyChallengesCompleted,
            dailyChallengeDate: data.daily_challenge_date ?? prev.dailyChallengeDate,
            dailyChallengeDone: data.daily_challenge_done ?? prev.dailyChallengeDone,
            lessonsCompleted: data.lessons_completed ?? prev.lessonsCompleted,
            perfectQuizzes: data.perfect_quizzes ?? prev.perfectQuizzes,
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
          pomodoro_completed: state.pomodoroCompleted,
          focus_minutes: state.focusMinutes,
          daily_challenges_completed: state.dailyChallengesCompleted,
          daily_challenge_date: state.dailyChallengeDate,
          daily_challenge_done: state.dailyChallengeDone,
          lessons_completed: state.lessonsCompleted,
          perfect_quizzes: state.perfectQuizzes,
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

  // Internal helper: checks if today's challenge is met and awards XP once per day
  const checkDailyChallenge = useCallback(() => {
    setState((prev) => {
      const tk = todayKey()
      if (prev.dailyChallengeDate === tk && prev.dailyChallengeDone) return prev
      const challenge = getTodayChallenge()
      // Evaluate challenge condition against current state
      let met = false
      switch (challenge.id) {
        case "d_quiz":
          met = (prev.lastQuizCorrect === true && prev.lastQuizDate === tk)
          break
        case "d_lesson":
          met = (prev.lastLessonDate === tk)
          break
        case "d_pomo":
          met = (prev.lastPomodoroDate === tk)
          break
        case "d_buddy":
          met = prev.buddyFound
          break
        case "d_upvote":
          met = (prev.upvoteCountToday || 0) >= 2
          break
        case "d_download":
          met = (prev.lastDownloadDate === tk)
          break
        case "d_streak":
          met = prev.streak >= 1 && prev.lastActiveDate === tk
          break
      }
      if (!met) return prev
      const next = {
        ...prev,
        xp: prev.xp + challenge.xp,
        dailyChallengeDate: tk,
        dailyChallengeDone: true,
        dailyChallengesCompleted: (prev.dailyChallengesCompleted || 0) + 1,
      }
      // check if any new badges unlocked from this
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 1200)
        }
      }
      setTimeout(() => showToast(`Daily Challenge done! +${challenge.xp} XP`, "yellow"), 400)
      return next
    })
  }, [showToast])

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
    let wasCorrect = false
    let newBadges = []
    setState((prev) => {
      if (prev.answeredQuizIds.includes(quizId)) {
        alreadyAnswered = true
        return prev
      }
      const correct = chosenIndex === quiz.answer
      wasCorrect = correct
      const next = {
        ...prev,
        quizzesAnswered: prev.quizzesAnswered + 1,
        quizzesCorrect: prev.quizzesCorrect + (correct ? 1 : 0),
        answeredQuizIds: [...prev.answeredQuizIds, quizId],
        lastQuizCorrect: correct,
        lastQuizDate: todayKey(),
      }
      if (correct) {
        next.perfectStreak = (prev.perfectStreak || 0) + 1
        if (next.perfectStreak >= 3) next.perfectQuizzes = (prev.perfectQuizzes || 0) + 1
      } else {
        next.perfectStreak = 0
      }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    if (!alreadyAnswered) {
      if (wasCorrect) awardXP(50, "for nailing the quiz")
      else awardXP(10, "for trying the quiz")
      setTimeout(() => checkDailyChallenge(), 50)
    }
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 800 + i * 500)
    })
    return { correct: wasCorrect, quiz, alreadyAnswered }
  }, [awardXP, checkDailyChallenge, showToast])

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
    setTimeout(() => checkDailyChallenge(), 50)
  }, [awardXP, checkDailyChallenge, showToast])

  const trackDownload = useCallback(() => {
    let newBadges = []
    setState((prev) => {
      const next = {
        ...prev,
        downloads: prev.downloads + 1,
        lastDownloadDate: todayKey(),
      }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    awardXP(15, "for grabbing a resource")
    setTimeout(() => checkDailyChallenge(), 50)
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 400 + i * 500)
    })
  }, [awardXP, checkDailyChallenge, showToast])

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
    let courseFinished = false
    setState((prev) => {
      const key = String(courseId)
      const existing = prev.startedCourses?.[key]
      if (!existing) return prev
      const updated = {
        ...existing,
        lessonsCompleted: (existing.lessonsCompleted || 0) + lessonCount,
        lastOpened: new Date().toISOString(),
      }
      updated.progress = Math.min(100, Math.round(((updated.lessonsCompleted || 0) / 8) * 100))
      if (updated.progress >= 100) courseFinished = true
      const next = {
        ...prev,
        startedCourses: { ...(prev.startedCourses || {}), [key]: updated },
        lessonsCompleted: (prev.lessonsCompleted || 0) + lessonCount,
        xp: prev.xp + 20 * lessonCount,
        lastLessonDate: todayKey(),
      }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    touchActivity()
    showToast(`+${20 * lessonCount} XP lesson complete`, "lime")
    if (courseFinished) {
      awardXP(100, "for finishing a course!")
      setTimeout(() => showToast("Course Finished! +100 XP", "yellow"), 500)
    }
    // Check daily challenge completion
    checkDailyChallenge()
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 600 + i * 500)
    })
  }, [showToast, touchActivity, awardXP])

  const toggleUpvote = useCallback((threadKey) => {
    let wasAdded = false
    setState((prev) => {
      const has = prev.upvotedThreads.includes(threadKey)
      wasAdded = !has
      return {
        ...prev,
        upvotedThreads: has
          ? prev.upvotedThreads.filter((k) => k !== threadKey)
          : [...prev.upvotedThreads, threadKey],
        upvoteCountToday: has ? Math.max(0, (prev.upvoteCountToday || 0) - 1) : (prev.upvoteCountToday || 0) + 1,
      }
    })
    if (wasAdded) awardXP(5, "")
    setTimeout(() => checkDailyChallenge(), 50)
  }, [awardXP, checkDailyChallenge])

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

  // Complete a pomodoro focus session (default 25 min)
  const completePomodoro = useCallback((minutes = 25) => {
    let newBadges = []
    setState((prev) => {
      const next = {
        ...prev,
        pomodoroCompleted: (prev.pomodoroCompleted || 0) + 1,
        focusMinutes: (prev.focusMinutes || 0) + minutes,
        lastPomodoroDate: todayKey(),
        xp: prev.xp + 30 + Math.floor(minutes / 5),
      }
      for (const b of BADGE_DEFS) {
        if (!next.badges.includes(b.id) && BADGE_CHECKS[b.id]?.(next)) {
          next.badges = [...next.badges, b.id]
          newBadges.push(b)
        }
      }
      return next
    })
    touchActivity()
    showToast(`+${30 + Math.floor(minutes / 5)} XP focus session done`, "lime")
    newBadges.forEach((b, i) => {
      setTimeout(() => showToast(`Badge: ${b.label}`, "pink"), 600 + i * 500)
    })
    setTimeout(() => checkDailyChallenge(), 50)
  }, [showToast, touchActivity, checkDailyChallenge])

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
    getTodayChallenge,
    completePomodoro,
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
