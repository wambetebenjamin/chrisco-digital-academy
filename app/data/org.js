/*
 * Single source of truth for the organisation's name and ownership.
 *
 * CHRISCO Digital Academy is a learning platform of CHRISCO Youth Aflame,
 * which operates under CHRISCO Fellowship of Churches International.
 * Keep ownership language organisational everywhere it appears.
 */
export const org = {
  academy: "CHRISCO Digital Academy",
  programme: "CHRISCO Youth Aflame",
  umbrella: "CHRISCO Fellowship of Churches International",
  // e.g. "CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International"
  ownership: "CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International",
  email: "chriscoyouthaflame2025@gmail.com",
  // Numbers are kept for links only, never printed as visible text.
  phone: "+254112272061",
  whatsapp: "https://wa.me/254112272061",
  tutorTitle: "Lead Tutor",
  courseCredit: "Course editor: CHRISCO Youth Aflame",
}

export const ORG = org

export const tutor = {
  name: "CHRISCO Youth Aflame Tutor Team",
  shortName: "Our tutor",
  role: "Lead Tutor",
  credentials: "Computer Science graduate, Designer, Developer, Video Editor, AI Practitioner",
  skills: ["Graphic Design", "Web Development", "Video Editing", "Animation", "Social Media", "AI"],
}

export function whatsappLink(message = "") {
  if (!message) return org.whatsapp
  return `${org.whatsapp}?text=${encodeURIComponent(message)}`
}

export function whatsappCourseLink(courseTitle = "") {
  return whatsappLink(`Hi CHRISCO, please send me the handbook for ${courseTitle || "this course"}.`)
}

export function mailtoLink(subject = "", body = "") {
  const qs = new URLSearchParams()
  if (subject) qs.set("subject", subject)
  if (body) qs.set("body", body)
  const query = qs.toString()
  return `mailto:${org.email}${query ? `?${query}` : ""}`
}
