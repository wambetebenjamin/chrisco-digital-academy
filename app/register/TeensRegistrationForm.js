"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "../Navbar"
import { submitAcademyIntake } from "../lib/intakeClient"

export const GOOGLE_FORM_VIEW_URL =
  "https://docs.google.com/forms/d/1vuLx-9fPTLkKy_H0ez0lKeAYHEJqi3uK1rGgf_edch8/viewform"

export default function TeensRegistrationForm() {
  const [registrantRole, setRegistrantRole] = useState("parent")
  const [teenName, setTeenName] = useState("")
  const [teenAge, setTeenAge] = useState("15")
  const [schoolOrFellowship, setSchoolOrFellowship] = useState("")
  const [parentName, setParentName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [deviceAccess, setDeviceAccess] = useState(
    "Laptop / Tablet / Phone for Online Classes (Trainers' gear used for physical)"
  )
  const [projectTrack, setProjectTrack] = useState(
    "All Tracks: Learning AI, Prompts & Creative Digital Projects"
  )
  const [physicalConsent, setPhysicalConsent] = useState("yes")
  const [notes, setNotes] = useState("")
  const [humanVerified, setHumanVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submittedReceipt, setSubmittedReceipt] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!teenName.trim()) {
      setError("Please enter the teen's full name.")
      return
    }
    if (registrantRole === "parent" && !parentName.trim()) {
      setError("Please enter the parent or guardian's full name.")
      return
    }
    if (!phone.trim()) {
      setError("Please enter a valid phone or WhatsApp number.")
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    if (!humanVerified) {
      setError("Please complete the reCAPTCHA human verification check.")
      return
    }

    setSubmitting(true)
    try {
      const applicantDisplay =
        registrantRole === "parent"
          ? `${teenName.trim()} (Registered by Parent/Guardian: ${parentName.trim()})`
          : `${teenName.trim()}${parentName.trim() ? ` (Parent/Guardian: ${parentName.trim()})` : ""}`

      const detailedMessage = [
        `Bootcamp: CHRISCO Teens AI & Projects Bootcamp (3 Nov – 11 Dec 2026 | 6 Weeks | Ages 13+)`,
        `Submitted By: ${registrantRole === "parent" ? "Parent / Guardian" : "Teen Student (Ages 13+)"}`,
        `Teen Full Name: ${teenName.trim()}`,
        `Teen Age: ${teenAge}`,
        `School / Fellowship: ${schoolOrFellowship.trim() || "Not specified"}`,
        `Parent / Guardian Name: ${parentName.trim() || "Not specified"}`,
        `Phone / WhatsApp: ${phone.trim()}`,
        `Email: ${email.trim()}`,
        `Digital Device Access: ${deviceAccess}`,
        `Preferred AI Track: ${projectTrack}`,
        `Physical & Team Activities: ${
          physicalConsent === "yes"
            ? "Yes — Communicate dates & venues when scheduled"
            : "Online classes only"
        }`,
        notes.trim() ? `Additional Notes: ${notes.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n")

      const result = await submitAcademyIntake({
        action: "course_application",
        name: applicantDisplay,
        email: email.trim(),
        phone: phone.trim(),
        course_title: "Teens AI & Projects Bootcamp (Ages 13+)",
        category: "Teens AI & Digital Projects",
        level: `Ages ${teenAge} (Teens Cohort)`,
        track: projectTrack,
        message: detailedMessage,
        metadata: {
          registrant_role: registrantRole,
          teen_name: teenName.trim(),
          teen_age: teenAge,
          school_or_fellowship: schoolOrFellowship.trim(),
          parent_name: parentName.trim(),
          device_access: deviceAccess,
          project_track: projectTrack,
          physical_activities_consent: physicalConsent,
          cohort_dates: "3 Nov – 11 Dec 2026",
        },
      })

      setSubmittedReceipt({
        referenceCode: result?.reference_code || "APP-TEENS",
        teenName: teenName.trim(),
        parentName: parentName.trim(),
        registrantRole,
        email: email.trim(),
        phone: phone.trim(),
        teenAge,
        projectTrack,
      })
    } catch (err) {
      setError(err?.message || "Could not submit registration. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)",
          padding: "48px 16px 80px",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {/* Top Google-Form Style Header Card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              borderTop: "10px solid #2B8CE5",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
              padding: "28px 32px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#EBF5FF",
                  color: "#1D4ED8",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  padding: "6px 14px",
                  borderRadius: 999,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                CHRISCO YOUTH AFLAME — DIGITAL ACADEMY
              </span>
              <a
                href={GOOGLE_FORM_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#FEF3C7",
                  color: "#92400E",
                  border: "1px solid #F59E0B",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  padding: "6px 14px",
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                Open in Google Forms ↗
              </a>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.65rem, 3.5vw, 2.3rem)",
                fontWeight: 900,
                color: "#0F172A",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#E5383B" }}>TEENS AI &amp;</span>{" "}
              <span style={{ color: "#2B8CE5" }}>PROJECTS BOOTCAMP!</span>
            </h1>
            <p
              style={{
                fontSize: "1.02rem",
                color: "#334155",
                lineHeight: 1.6,
                marginBottom: 18,
              }}
            >
              Fun AI learning &amp; creative digital projects designed for young
              minds. Teens (Ages 13+) or their parents/guardians can register
              below or via the official Google Form.
            </p>

            {/* 4-Column Cohort Highlights Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
                gap: 12,
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>
                  COHORT DATES
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#E5383B" }}>
                  3 Nov – 11 Dec 2026
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>
                  DURATION
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F172A" }}>
                  6 Weeks
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>
                  AGE GROUP
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F172A" }}>
                  Ages 13+ (Teens)
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>
                  FORMAT
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#059669" }}>
                  Online + Physical TBA
                </div>
              </div>
            </div>
          </div>

          {submittedReceipt ? (
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid #10B981",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                padding: "32px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "#ECFDF5",
                  color: "#047857",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  padding: "6px 14px",
                  borderRadius: 999,
                  marginBottom: 14,
                }}
              >
                ✓ REGISTRATION RECORDED · REF {submittedReceipt.referenceCode}
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "#0F172A",
                  marginBottom: 10,
                }}
              >
                Registration Confirmed for {submittedReceipt.teenName}!
              </h2>
              <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 18 }}>
                Your registration for the{" "}
                <strong>CHRISCO Teens AI &amp; Projects Bootcamp (3 Nov – 11 Dec 2026)</strong>{" "}
                has been saved and forwarded to the Youth Aflame admissions desk (
                <strong>chriscoyouthaflame2025@gmail.com</strong>).
              </p>

              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 22,
                  fontSize: "0.92rem",
                  color: "#1E293B",
                  lineHeight: 1.7,
                }}
              >
                <div>
                  <strong>Reference Code:</strong> {submittedReceipt.referenceCode}
                </div>
                <div>
                  <strong>Teen Participant:</strong> {submittedReceipt.teenName} (Age{" "}
                  {submittedReceipt.teenAge})
                </div>
                {submittedReceipt.parentName && (
                  <div>
                    <strong>Parent / Guardian:</strong> {submittedReceipt.parentName}
                  </div>
                )}
                <div>
                  <strong>Contact:</strong> {submittedReceipt.phone} · {submittedReceipt.email}
                </div>
                <div>
                  <strong>Selected Track:</strong> {submittedReceipt.projectTrack}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedReceipt(null)
                    setTeenName("")
                    setNotes("")
                  }}
                  style={{
                    background: "#2B8CE5",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 999,
                    padding: "12px 24px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Register Another Teen
                </button>
                <Link
                  href="/courses"
                  style={{
                    background: "#002333",
                    color: "#00FF84",
                    textDecoration: "none",
                    borderRadius: 999,
                    padding: "12px 24px",
                    fontWeight: 800,
                  }}
                >
                  Explore Digital Academy Courses →
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                padding: "32px",
              }}
            >
              {/* Role Selector: Teen vs Parent/Guardian */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: 10,
                    fontSize: "0.96rem",
                  }}
                >
                  1. Who is completing this registration? <span style={{ color: "#E5383B" }}>*</span>
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setRegistrantRole("parent")}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      border:
                        registrantRole === "parent"
                          ? "2px solid #2B8CE5"
                          : "1px solid #CBD5E1",
                      background: registrantRole === "parent" ? "#EBF5FF" : "#FFFFFF",
                      color: "#0F172A",
                      fontWeight: 800,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    👨‍👩‍👧 Parent / Guardian
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#475569",
                        marginTop: 4,
                      }}
                    >
                      Registering my teen (Ages 13+)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegistrantRole("teen")}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      border:
                        registrantRole === "teen"
                          ? "2px solid #2B8CE5"
                          : "1px solid #CBD5E1",
                      background: registrantRole === "teen" ? "#EBF5FF" : "#FFFFFF",
                      color: "#0F172A",
                      fontWeight: 800,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    🎒 Teen Participant (Ages 13+)
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#475569",
                        marginTop: 4,
                      }}
                    >
                      Registering myself for the bootcamp
                    </div>
                  </button>
                </div>
              </div>

              {/* Teen Name & Age */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <label
                    htmlFor="teen-name"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      color: "#0F172A",
                      marginBottom: 6,
                      fontSize: "0.92rem",
                    }}
                  >
                    2. Teen&apos;s Full Name <span style={{ color: "#E5383B" }}>*</span>
                  </label>
                  <input
                    id="teen-name"
                    type="text"
                    required
                    value={teenName}
                    onChange={(e) => setTeenName(e.target.value)}
                    placeholder="e.g. Joshua Mwangi"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      fontSize: "0.96rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="teen-age"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      color: "#0F172A",
                      marginBottom: 6,
                      fontSize: "0.92rem",
                    }}
                  >
                    3. Teen&apos;s Age <span style={{ color: "#E5383B" }}>*</span>
                  </label>
                  <select
                    id="teen-age"
                    value={teenAge}
                    onChange={(e) => setTeenAge(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      fontSize: "0.96rem",
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="13">13 years</option>
                    <option value="14">14 years</option>
                    <option value="15">15 years</option>
                    <option value="16">16 years</option>
                    <option value="17">17 years</option>
                    <option value="18">18 years</option>
                    <option value="19+">19+ years (Youth)</option>
                  </select>
                </div>
              </div>

              {/* Parent/Guardian Name & School/Fellowship */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <label
                    htmlFor="parent-name"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      color: "#0F172A",
                      marginBottom: 6,
                      fontSize: "0.92rem",
                    }}
                  >
                    4. Parent / Guardian Full Name{" "}
                    {registrantRole === "parent" && (
                      <span style={{ color: "#E5383B" }}>*</span>
                    )}
                  </label>
                  <input
                    id="parent-name"
                    type="text"
                    required={registrantRole === "parent"}
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Mary Mwangi"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      fontSize: "0.96rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="school-fellowship"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      color: "#0F172A",
                      marginBottom: 6,
                      fontSize: "0.92rem",
                    }}
                  >
                    5. School / CHRISCO Fellowship / Church
                  </label>
                  <input
                    id="school-fellowship"
                    type="text"
                    value={schoolOrFellowship}
                    onChange={(e) => setSchoolOrFellowship(e.target.value)}
                    placeholder="e.g. CHRISCO Youth Aflame / High School"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      fontSize: "0.96rem",
                    }}
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <label
                    htmlFor="phone-number"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      color: "#0F172A",
                      marginBottom: 6,
                      fontSize: "0.92rem",
                    }}
                  >
                    6. Phone / WhatsApp Number <span style={{ color: "#E5383B" }}>*</span>
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      fontSize: "0.96rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email-address"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      color: "#0F172A",
                      marginBottom: 6,
                      fontSize: "0.92rem",
                    }}
                  >
                    7. Email Address (Parent or Teen) <span style={{ color: "#E5383B" }}>*</span>
                  </label>
                  <input
                    id="email-address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent.or.teen@example.com"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      fontSize: "0.96rem",
                    }}
                  />
                </div>
              </div>

              {/* Digital Media Access */}
              <div style={{ marginBottom: 20 }}>
                <label
                  htmlFor="device-access"
                  style={{
                    display: "block",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: 6,
                    fontSize: "0.92rem",
                  }}
                >
                  8. Access to Digital Media for Online Classes{" "}
                  <span style={{ color: "#E5383B" }}>*</span>
                </label>
                <select
                  id="device-access"
                  value={deviceAccess}
                  onChange={(e) => setDeviceAccess(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    fontSize: "0.95rem",
                    background: "#FFFFFF",
                  }}
                >
                  <option value="Laptop / Tablet / Phone for Online Classes (Trainers' gear used for physical)">
                    Laptop, Tablet, or Smartphone available (Trainers&apos; gear used for physical sessions)
                  </option>
                  <option value="Laptop available for Online Classes">
                    Laptop available for Online Classes
                  </option>
                  <option value="Smartphone / Tablet available for Online Classes">
                    Smartphone or Tablet available for Online Classes
                  </option>
                  <option value="Shared Parent/Family Device for Online Classes">
                    Shared Parent/Family Device for Online Classes
                  </option>
                </select>
              </div>

              {/* AI & Creative Project Track */}
              <div style={{ marginBottom: 20 }}>
                <label
                  htmlFor="project-track"
                  style={{
                    display: "block",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: 6,
                    fontSize: "0.92rem",
                  }}
                >
                  9. Learning AI &amp; Projects Focus{" "}
                  <span style={{ color: "#E5383B" }}>*</span>
                </label>
                <select
                  id="project-track"
                  value={projectTrack}
                  onChange={(e) => setProjectTrack(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    fontSize: "0.95rem",
                    background: "#FFFFFF",
                  }}
                >
                  <option value="All Tracks: Learning AI, Prompts & Creative Digital Projects">
                    All Tracks: Teen-Friendly AI Tools, Prompts &amp; Hands-On Builds
                  </option>
                  <option value="AI Prompts, Smart Study & Research Assistants">
                    AI Prompts, Smart Study &amp; Research Assistants
                  </option>
                  <option value="Creative Digital Media, Design & Storytelling with AI">
                    Creative Digital Media, Design &amp; Storytelling with AI
                  </option>
                  <option value="Hands-On Coding, Web Projects & App Prototyping">
                    Hands-On Coding, Web Projects &amp; App Prototyping
                  </option>
                </select>
              </div>

              {/* Physical & Team Activities */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: 6,
                    fontSize: "0.92rem",
                  }}
                >
                  10. Physical &amp; Team Activities (Dates &amp; venues communicated later)
                </label>
                <select
                  value={physicalConsent}
                  onChange={(e) => setPhysicalConsent(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    fontSize: "0.95rem",
                    background: "#FFFFFF",
                  }}
                >
                  <option value="yes">
                    Yes — Keep us updated on physical &amp; team activity dates and venues
                  </option>
                  <option value="online-only">
                    Joining Online Classes only
                  </option>
                </select>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 20 }}>
                <label
                  htmlFor="notes"
                  style={{
                    display: "block",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: 6,
                    fontSize: "0.92rem",
                  }}
                >
                  11. Any questions or notes from Teen / Parent (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any questions or specific project interests..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              {/* reCAPTCHA Check */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 22,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    fontWeight: 700,
                    color: "#0F172A",
                    fontSize: "0.92rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={humanVerified}
                    onChange={(e) => setHumanVerified(e.target.checked)}
                    style={{ width: 20, height: 20, accentColor: "#2B8CE5" }}
                  />
                  I&apos;m not a robot (reCAPTCHA Verification)
                </label>
                <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>
                  reCAPTCHA
                </span>
              </div>

              {error && (
                <div
                  role="alert"
                  style={{
                    background: "#FEF2F2",
                    color: "#B91C1C",
                    border: "1px solid #FECACA",
                    padding: "12px 16px",
                    borderRadius: 10,
                    marginBottom: 18,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                }}
              >
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "linear-gradient(135deg, #FFE135 0%, #FFC400 100%)",
                    color: "#0F172A",
                    border: "2px solid #F59E0B",
                    borderRadius: 999,
                    padding: "14px 32px",
                    fontWeight: 900,
                    fontSize: "1rem",
                    cursor: submitting ? "wait" : "pointer",
                    boxShadow: "0 8px 20px rgba(245, 158, 11, 0.28)",
                  }}
                >
                  {submitting
                    ? "Submitting Registration..."
                    : "Submit Teen / Parent Registration →"}
                </button>

                <a
                  href={GOOGLE_FORM_VIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1D4ED8",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    textDecoration: "underline",
                  }}
                >
                  Or fill via Google Docs Form ↗
                </a>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
