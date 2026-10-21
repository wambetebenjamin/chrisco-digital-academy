import { describe, it, expect } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "../app/AuthProvider"
import SignIn from "../app/sign-in/page"
import ContactForm from "../app/contact/ContactForm"
import TutorApplicationForm from "../app/become-a-tutor/TutorApplicationForm"
import CoursesExplorer from "../app/courses/CoursesExplorer"

describe("Google Auth with Email Verification + Password + reCAPTCHA, and Form Submissions", () => {
  it("opens the Google Sign-In modal, verifies email, requires password and reCAPTCHA, and signs in", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    )

    const googleBtn = screen.getByRole("button", { name: /continue with google/i })
    await user.click(googleBtn)

    const dialog = await screen.findByRole("dialog", { name: /sign in with google/i })
    await user.type(within(dialog).getByPlaceholderText("you@gmail.com"), "grace.wanjiku@gmail.com")
    await user.click(within(dialog).getByRole("button", { name: /verify email/i }))
    await user.type(within(dialog).getByPlaceholderText("Enter your password"), "gracePass123")
    const recaptcha = within(dialog).getByRole("checkbox", { name: /i'm not a robot/i })
    await user.click(recaptcha)
    await waitFor(() => expect(recaptcha.getAttribute("aria-checked")).toBe("true"))

    await user.click(within(dialog).getByRole("button", { name: /continue with google account/i }))

    const storedSession = JSON.parse(window.localStorage.getItem("chrisco:preview-session") || "null")
    expect(storedSession?.email).toBe("grace.wanjiku@gmail.com")
    expect(storedSession?.provider).toBe("google")
  })

  it("saves a contact inquiry after email validation and reCAPTCHA check", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <ContactForm />
      </AuthProvider>
    )

    await user.type(screen.getByPlaceholderText("e.g. Amani Mwangi"), "David Ochieng")
    await user.type(screen.getByPlaceholderText("you@email.com"), "david@example.com")
    await user.type(
      screen.getByPlaceholderText(/tell us what you need help with/i),
      "I would like to join the next Python cohort."
    )
    const recaptcha = screen.getByRole("checkbox", { name: /i'm not a robot/i })
    await user.click(recaptcha)
    await waitFor(() => expect(recaptcha.getAttribute("aria-checked")).toBe("true"))

    await user.click(screen.getByRole("button", { name: /send message/i }))

    expect(await screen.findByText(/message sent!/i)).toBeTruthy()
  })

  it("saves a course application after email validation and reCAPTCHA check", async () => {
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
    const recaptcha = screen.getByRole("checkbox", { name: /i'm not a robot/i })
    await user.click(recaptcha)
    await waitFor(() => expect(recaptcha.getAttribute("aria-checked")).toBe("true"))

    await user.click(screen.getByRole("button", { name: /submit enrollment/i }))

    expect(await screen.findByText(/enrollment sent!/i)).toBeTruthy()
  })

  it("saves a tutor application after email validation and reCAPTCHA check", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TutorApplicationForm />
      </AuthProvider>
    )

    await user.type(screen.getByPlaceholderText("e.g. Amani Mwangi"), "Samuel Kiprop")
    await user.type(screen.getByPlaceholderText("you@email.com"), "samuel@example.com")
    await user.type(screen.getByPlaceholderText("+254 7xx xxx xxx"), "+254799001122")
    await user.type(
      screen.getByPlaceholderText(/tell us about your practical experience/i),
      "5 years building production Python and LLM apps."
    )
    const recaptcha = screen.getByRole("checkbox", { name: /i'm not a robot/i })
    await user.click(recaptcha)
    await waitFor(() => expect(recaptcha.getAttribute("aria-checked")).toBe("true"))

    await user.click(screen.getByRole("button", { name: /submit tutor application/i }))

    expect(await screen.findByText(/tutor application submitted!/i)).toBeTruthy()
  })
})
