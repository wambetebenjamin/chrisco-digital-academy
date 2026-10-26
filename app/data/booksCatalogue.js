import { courses } from "./courses"

export const CONSENT_POLICY_VERSION = "2026-10"

/**
 * Dedicated shelf for Christian, Prophetic & Spiritual Formation E-Books
 * published by CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES.
 */
export const christianBooks = [
  {
    slug: "joseph-7-lessons-emerging-seer-prophet",
    shelf: "christian",
    shelfLabel: "Christian & Faith Library",
    category: "Prophetic & Biblical Study",
    title: "Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn",
    subtitle:
      "A Scripture-anchored prophetic study on dreams, hidden process, private integrity, and appointed fulfillment from Genesis 37 to 50.",
    desc:
      "Most believers remember Joseph because of his dreams, yet Scripture devotes thirteen chapters to what happened after heaven spoke. This 28-page illustrated Christian study guide walks through seven foundational lessons every emerging seer, watchman, and young believer must learn so spiritual gifting never outruns godly character.",
    pages: 28,
    illustrations: 8,
    edition: "28-Page Illustrated Seer Study Edition",
    publisher: "CHRISCO Youth Aflame · Under CHRISCO FELLOWSHIP OF CHURCHES",
    coverImage: "/book-covers/joseph-7-lessons-emerging-seer-prophet.jpg",
    downloadPath: "/books/joseph-7-lessons-emerging-seer-prophet.pdf",
    sharePath: "/library/joseph-7-lessons-emerging-seer-prophet",
    icon: "flame",
    color: ["#010C80", "#FA3F26"],
    highlights: [
      "Full 28-page spacious study with 8 custom prophetic framework diagrams",
      "Scripture-anchored exposition across Genesis 37 to 50, Psalm 105:19, and Habakkuk 2:2 to 3",
      "Personal seer journal prompts, secret-altar heart checks, and daily watchman rhythm",
      "100% faith-centered photography and reverent fellowship teaching",
    ],
    chapters: [
      "Prologue: After the Dream Begins & The Four Chambers of Formation",
      "Lesson 01: Sight Often Comes Before Capacity (With Illustrated Timeline Diagram)",
      "Lesson 02: The Solitude of Sight — Sacred Consecration vs Bitter Isolation",
      "Lesson 03: Faithful in the Pit — How the Word Refines the Messenger (Psalm 105:19)",
      "Lesson 04: Private Integrity — Unseen Roots Sustaining Public Ministry",
      "Lesson 05: Delay Builds Government — Why God Trains Vessels in Obscurity",
      "Lesson 06: Marrying Pure Revelation to Practical Wisdom (Genesis 41:33 to 36)",
      "Lesson 07: Preserved for Many — Generational Deliverance & Daily Watchman Rhythm",
    ],
    forWho:
      "Emerging prophetic voices, youth fellowship leaders, intercessors, Bible students, and every Christian navigating the quiet season between God's promise and its fulfillment.",
  },
]

function slugFromDownloadPath(downloadPath = "") {
  const m = String(downloadPath).match(/\/books\/([a-z0-9-]+)\.pdf$/i)
  return m ? m[1].toLowerCase() : ""
}

/**
 * Dedicated shelf for Practical Skill & Learning Handbooks
 * published by CHRISCO Digital Academy (under CHRISCO Youth Aflame).
 */
export const learningBooks = courses.map((course) => {
  const slug = slugFromDownloadPath(course.download)
  return {
    slug,
    courseId: course.id,
    shelf: "learning",
    shelfLabel: "Digital Skill & Learning Handbook",
    category: course.category,
    level: course.level,
    duration: course.duration,
    title: `${course.title} — Course Handbook`,
    shortTitle: course.title,
    subtitle: course.desc,
    desc: `${course.desc} Expanded 28-page illustrated workbook featuring two spacious pages per module, custom visual concept diagrams, worked East African case studies, and guided hands-on labs.`,
    pages: 28,
    illustrations: 8,
    edition: "28-Page Illustrated Course Edition",
    publisher: "CHRISCO Digital Academy · CHRISCO Youth Aflame",
    coverImage: `/book-covers/${slug}.jpg`,
    downloadPath: course.download,
    sharePath: `/library/${slug}`,
    icon: course.icon,
    color: course.color,
    highlights: course.objectives || [],
    chapters: course.syllabus || [],
    forWho: course.for,
  }
})

export const allBooks = [...christianBooks, ...learningBooks]

export function getBookBySlug(slug) {
  const clean = String(slug || "").trim().toLowerCase()
  return allBooks.find((b) => b.slug === clean) || null
}

export function getBookByCourse(course) {
  if (!course) return null
  const slug = slugFromDownloadPath(course.download)
  return learningBooks.find((b) => b.slug === slug) || null
}

export function maskEmail(email = "") {
  const clean = String(email || "").trim().toLowerCase()
  const [local, domain] = clean.split("@")
  if (!local || !domain) return ""
  const visible = local.length <= 2 ? local[0] || "*" : `${local[0]}${"*".repeat(Math.min(4, local.length - 1))}`
  return `${visible}@${domain}`
}

export function buildBookShareUrl(slug, origin = "") {
  const base =
    origin ||
    (typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://chrisco-digital-academy.vercel.app")
  return `${base.replace(/\/$/, "")}/library/${encodeURIComponent(slug)}`
}
