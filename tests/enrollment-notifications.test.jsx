import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

/*
 * Admin enrollment notification tests.
 *
 * Covers the alert email that goes to the CHRISCO admin inboxes whenever a
 * learner enrols, plus the locally stored application record that feeds the
 * Enrollment alerts card on the student dashboard.
 */
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }))

vi.mock("@emailjs/browser", () => ({
  default: { send: sendMock },
}))

import {
  buildAdminEnrollmentAlert,
  sendAdminEnrollmentNotifications,
} from "../app/lib/intakeClient"
import { ADMIN_NOTIFY_EMAILS } from "../app/data/org"
import { AuthProvider } from "../app/AuthProvider"
import CoursesExplorer from "../app/courses/CoursesExplorer"

const samplePayload = {
  action: "course_application",
  name: "Faith Atieno",
  email: "faith@example.com",
  phone: "+254712345678",
  course_title: "YouTube Automation",
  category: "Video",
  level: "Beginner",
  ref: "benja123",
}

const sampleReceipt = {
  reference_code: "APP-ABC123",
  sent_at: new Date("2026-10-25T09:30:00Z").toISOString(),
}

describe("Admin enrollment notifications", () => {
  beforeEach(() => {
    sendMock.mockReset()
  })

  it("builds an alert containing the learner, course and follow-up details", () => {
    const alert = buildAdminEnrollmentAlert(samplePayload, sampleReceipt)

    expect(alert.subject).toBe(
      "New Course Enrollment: YouTube Automation — Faith Atieno (APP-ABC123)"
    )
    expect(alert.message).toContain("Faith Atieno")
    expect(alert.message).toContain("YouTube Automation")
    expect(alert.message).toContain("Track: Video")
    expect(alert.message).toContain("Level: Beginner")
    expect(alert.message).toContain("faith@example.com")
    expect(alert.message).toContain("+254712345678")
    expect(alert.message).toContain("Referred by affiliate code: benja123")
    expect(alert.message).toContain("Application reference: APP-ABC123")
    // One-tap follow-up links for the admin
    expect(alert.message).toContain("mailto:faith@example.com")
    expect(alert.message).toContain("https://wa.me/254712345678")
  })

  it("sends one alert email to every configured admin inbox", async () => {
    sendMock.mockResolvedValue({ status: 200, text: "OK" })

    const sentCount = await sendAdminEnrollmentNotifications(samplePayload, sampleReceipt)

    expect(sentCount).toBe(ADMIN_NOTIFY_EMAILS.length)
    expect(sendMock).toHaveBeenCalledTimes(ADMIN_NOTIFY_EMAILS.length)

    const recipients = sendMock.mock.calls.map((call) => call[2].to_email)
    expect(recipients).toEqual(ADMIN_NOTIFY_EMAILS)

    sendMock.mock.calls.forEach((call) => {
      // Same EmailJS service/template/public key as the learner receipts
      expect(call[0]).toBe("service_m86zbad")
      expect(call[1]).toBe("template_i5wg4c8")
      expect(call[2].subject).toMatch(/^New Course Enrollment: YouTube Automation/)
      expect(call[2].reply_to).toBe("faith@example.com")
      expect(call[2].message).toContain("Faith Atieno")
    })
  })

  it("never throws when the email provider is unavailable", async () => {
    sendMock.mockRejectedValue(new Error("network down"))

    const sentCount = await sendAdminEnrollmentNotifications(
      { name: "Test Learner", course_title: "Copywriting" },
      { reference_code: "APP-FAIL01", sent_at: new Date().toISOString() }
    )

    expect(sentCount).toBe(0)
  })

  it("stores the enrollment application that feeds the dashboard alerts feed", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <CoursesExplorer />
      </AuthProvider>
    )

    await user.click(screen.getByText("YouTube Automation"))
    await user.click(await screen.findByRole("button", { name: /enroll now/i }))

    await user.type(screen.getByPlaceholderText("e.g. Amani Mwangi"), "Faith Atieno")
    await user.type(screen.getByPlaceholderText("you@email.com"), "faith@example.com")
    await user.type(screen.getByPlaceholderText("+254 7xx xxx xxx"), "+254712345678")
    await user.click(screen.getByRole("button", { name: /submit enrollment/i }))

    expect(await screen.findByText(/we have received your application!/i)).toBeTruthy()

    const applications = JSON.parse(
      window.localStorage.getItem("chrisco:applications") || "[]"
    )
    const enrollment = applications.find((a) => a.type === "course_application")
    expect(enrollment).toBeTruthy()
    expect(enrollment.course_title).toBe("YouTube Automation")
    expect(enrollment.name).toBe("Faith Atieno")
    expect(enrollment.phone).toBe("+254712345678")
    expect(String(enrollment.id)).toMatch(/^APP-/)
  })
})
