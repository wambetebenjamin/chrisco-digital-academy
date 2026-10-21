import { ORG } from "./org"

export const CONNECTED_RESOURCES = [
  {
    id: "slides-orientation-deck",
    connector: "google_slides",
    badge: "Google Slides",
    title: "Learner Orientation & 19-Course Track Guide",
    category: "Orientation & Slides",
    description:
      "Interactive 5-slide Google Slides deck covering all 7 CHRISCO Digital Academy tracks, how your learning journey works, and how to earn your certificate.",
    url: "https://docs.google.com/presentation/d/1PZLmMuF77_TlX6aPZqmO-7cbmv_OaxFHtNCsbNWvd4k/edit",
    embed_url:
      "https://docs.google.com/presentation/d/1PZLmMuF77_TlX6aPZqmO-7cbmv_OaxFHtNCsbNWvd4k/embed?start=false&loop=false&delayms=5000",
    action_label: "Open Google Slides Deck",
    highlights: [
      "Slide 1: Welcome to CHRISCO Digital Academy",
      "Slide 2: Your 4-Step Learning Journey",
      "Slide 3–4: All 7 Practical Digital Skills Tracks (19 Courses)",
      "Slide 5: Connected Learning Ecosystem & Support",
    ],
  },
  {
    id: "dropbox-study-vault",
    connector: "dropbox",
    badge: "Dropbox Vault",
    title: "CHRISCO Digital Academy Study Vault (19 PDF Handbooks)",
    category: "Study Handbooks",
    description:
      "Cloud-synced Dropbox folder (/CHRISCO-Digital-Academy/Handbooks) containing all 19 official CHRISCO Youth Aflame PDF course handbooks for offline reading across phone and laptop.",
    url: "https://www.dropbox.com/scl/fo/5ukqudw6jo7y0nf6ey3jo/ABZnfV4-iAzoLxkLTHp2jUw?rlkey=n12vai88kb7wiywilsys1r9sn&dl=0",
    embed_url: null,
    action_label: "Open Dropbox Study Vault",
    highlights: [
      "All 19 PDF course handbooks synced to /CHRISCO-Digital-Academy/Handbooks",
      "Offline access for self-paced study across East Africa",
      "Includes Python, SWE & LLM Mastery, YouTube Automation, Copywriting & more",
    ],
  },
  {
    id: "notion-learner-hub",
    connector: "notion",
    badge: "Notion Hub",
    title: "CHRISCO Learner Hub & 7-Track Operations Portal",
    category: "Knowledge Base",
    description:
      "Structured Notion workspace linking the 7-Track Operations Portal, Complete 19-Course Curriculum & Study Guide, and Admissions & Auto-Response Runbook.",
    url: "https://app.notion.com/p/CHRISCO-Digital-Academy-Learner-Hub-7-Track-Operations-Portal-4001ca7fb5f78109ada8edbffe2955d0",
    curriculum_url:
      "https://app.notion.com/p/CHRISCO-Digital-Academy-Complete-19-Course-Curriculum-Study-Guide-4001ca7fb5f78135a287f65ac486ffb9",
    runbook_url:
      "https://app.notion.com/p/CHRISCO-Digital-Academy-Admissions-Google-Auth-Auto-Response-Runbook-4001ca7fb5f7815b8b76f35845e2ff61",
    embed_url: null,
    action_label: "Open Notion Learner Hub",
    highlights: [
      "Complete 19-Course Curriculum & Study Guide",
      "Admissions, Google Auth & Auto-Response Runbook",
      "Learner & Tutor Directory",
    ],
  },
  {
    id: "sheets-admissions-crm",
    connector: "google_sheets",
    badge: "Google Sheets",
    title: "Live Admissions, Contacts & Student CRM",
    category: "Live Tracker",
    description:
      `Google Sheets workbook with 4 tabs tracking course catalog metrics, admissions & contact responses from ${ORG.email}, registered learners, and PURSUE merchandise.`,
    url: "https://docs.google.com/spreadsheets/d/1OJ71E_buo-xNRyqRGaQqjkJwdMCaqVRYz4Jgq4iY3Dw/edit",
    embed_url: null,
    action_label: "Open Google Sheets CRM",
    highlights: [
      "Tab 1: Applications & Contacts (Auto-Reply Log)",
      "Tab 2: Registered Learners Directory",
      "Tab 3: Course Catalog (19 Tracks)",
      "Tab 4: PURSUE Merch & Affiliates",
    ],
  },
]

export const CONNECTED_APPS_SUMMARY = [
  {
    slug: "supabase",
    name: "Supabase Backend & Auth",
    status: "Active",
    detail: "Postgres DB (profiles, enrollments, contacts, email_notifications, affiliates) + Google OAuth + academy-intake Edge Function",
  },
  {
    slug: "google_slides",
    name: "Google Slides",
    status: "Active",
    detail: "5-Slide Learner Orientation & 19-Course Track Guide embedded in Student Dashboard",
  },
  {
    slug: "dropbox",
    name: "Dropbox Study Vault",
    status: "Active",
    detail: "19 Official PDF Course Handbooks synced to /CHRISCO-Digital-Academy/Handbooks",
  },
  {
    slug: "notion",
    name: "Notion Learner Hub",
    status: "Active",
    detail: "Learner Hub Portal + 19-Course Study Guide + Admissions Runbook",
  },
  {
    slug: "google_sheets",
    name: "Google Sheets CRM",
    status: "Active",
    detail: "4-Tab Live Admissions, Contacts, Learner Directory & Merch Workbook",
  },
  {
    slug: "vercel",
    name: "Vercel Production Cloud",
    status: "Active",
    detail: "chrisco-digital-academy.vercel.app connected to Supabase Production",
  },
]
