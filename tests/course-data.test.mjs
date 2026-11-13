/*
 * Guards the course catalogue against copy drift.
 *
 * The objectives arrays were once shifted by a slot, so "Digital Marketing"
 * advertised HTML/CSS goals. Every course's objectives must now talk about the
 * same subject as its own title, description and syllabus.
 *
 * Run with: npm test
 */
import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, writeFileSync, unlinkSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

// app/data/courses.js is ESM with no imports, so it can be loaded by rewriting
// the two export keywords into a temp module and importing that by path.
const SOURCE = readFileSync(new URL("../app/data/courses.js", import.meta.url), "utf8")

const tmp = join(tmpdir(), `courses-${process.pid}.mjs`)
writeFileSync(tmp, SOURCE)
const { courses } = await import(pathToFileURL(tmp).href)
unlinkSync(tmp)

// Words that only make sense for one track. If a course's objectives hit a
// vocabulary that belongs to another track, the arrays have been shuffled.
const foreignTerms = {
  Coding: ["html", "css", "javascript", "python", "code", "api"],
  Marketing: ["seo", "campaign", "advertising", "ads", "email list", "funnel"],
  Writing: ["headline", "copy", "byline", "ghostwrit", "script"],
  Video: ["footage", "thumbnail", "edit", "monetis", "channel"],
  Design: ["artwork", "print-ready", "print ready", "listing"],
  Business: ["negotiat", "networking", "executive presence", "prompt"],
  Career: ["fiverr", "upwork", "freelance", "profile"],
}

test("every course has four objectives", () => {
  assert.equal(courses.length, 19)
  for (const course of courses) {
    assert.equal(course.objectives.length, 4, `${course.title} should list 4 objectives`)
    for (const objective of course.objectives) {
      assert.ok(objective.trim().length > 12, `${course.title}: objective too short`)
    }
  }
})

test("objectives belong to the course's own track", () => {
  for (const course of courses) {
    const text = course.objectives.join(" ").toLowerCase()
    const own = new Set(
      [
        ...(foreignTerms[course.category] || []),
        ...course.syllabus.join(" ").toLowerCase().split(/[^a-z]+/),
      ].filter(Boolean)
    )
    // any objective that uses another track's vocabulary and shares nothing
    // with this course's category or syllabus is drift
    for (const [track, terms] of Object.entries(foreignTerms)) {
      if (track === course.category) continue
      const hits = terms.filter((t) => text.includes(t))
      if (!hits.length) continue
      const usesOwn = [...own].some((t) => t.length > 4 && text.includes(t))
      assert.ok(
        usesOwn,
        `${course.title} (${course.category}) objectives mention ${hits.join(", ")} ` +
          `but nothing from its own syllabus — the arrays look shifted`
      )
    }
  }
})

test("specific known drifts stay fixed", () => {
  const byTitle = Object.fromEntries(courses.map((c) => [c.title, c]))
  const marketing = byTitle["Digital Marketing"].objectives.join(" ").toLowerCase()
  assert.ok(!/html|css|javascript/.test(marketing), "Digital Marketing must not teach web dev")
  assert.ok(/campaign|marketing|seo|ads/.test(marketing))

  const affiliate = byTitle["Affiliate Marketing"].objectives.join(" ").toLowerCase()
  assert.ok(/affiliate|commission|niche/.test(affiliate), "Affiliate Marketing must be affiliate work")
  assert.ok(!/email list ethically/.test(affiliate), "Affiliate Marketing had Email Marketing copy")

  const social = byTitle["Social Media Marketing"].objectives.join(" ").toLowerCase()
  assert.ok(/social|platform|content/.test(social))
  assert.ok(!/commission/.test(social), "Social Media Marketing had Affiliate copy")

  const branding = byTitle["Personal Branding: Visibility Is Currency"].objectives.join(" ").toLowerCase()
  assert.ok(/brand|positioning|authority/.test(branding))
  assert.ok(!/raw footage|colour grade/.test(branding), "Personal Branding had video-editing copy")
})
