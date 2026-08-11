// Central badge definitions. Used by GamificationContext for auto-awarding
// and by the Home/Dashboard/Community pages for rendering locked/earned states.

export const BADGE_DEFS = [
  { id: "streak_3",    label: "3 Day Streak",    icon: "flame",    color: "var(--orange)" },
  { id: "streak_7",    label: "7 Day Streak",    icon: "flame",    color: "var(--pink)"   },
  { id: "streak_21",   label: "21 Day Streak",   icon: "flame",    color: "var(--red)"    },
  { id: "first_quiz",  label: "First Quiz",      icon: "trophy",   color: "var(--lime)"   },
  { id: "quiz_10",     label: "Quiz Champion",   icon: "trophy",   color: "var(--yellow)" },
  { id: "buddy",       label: "Study Buddy",     icon: "users",    color: "var(--pink)"   },
  { id: "level_5",     label: "Level 5 Reached", icon: "bolt",     color: "var(--purple)" },
  { id: "xp_5000",     label: "5000 XP Club",    icon: "star",     color: "var(--blue)"   },
  { id: "first_course",label: "First Course",    icon: "cap",      color: "var(--blue)"   },
  { id: "vault",       label: "Resource Hunter", icon: "download", color: "var(--purple)" },
]
