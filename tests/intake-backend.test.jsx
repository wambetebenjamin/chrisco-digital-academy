import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "../app/AuthProvider"
import SignIn from "../app/sign-in/page"
import ContactForm from "../app/contact/ContactForm"
import TutorApplicationForm from "../app/become-a-tutor/TutorApplicationForm"
import CoursesExplorer from "../app/courses/CoursesExplorer"

describe("Google Auth, Contact Persistence & Automated Responses from chriscoyouthaflame2025@gmail.com", () => {
  it("opens the Google Sign-In modal and signs in with a Google account", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    )

    const googleBtn = screen.getByRole("button", { name: /continue with google/i })
    await user.click(googleBtn)

    expect(await screen.findByRole("dialog", { name: /sign in with google/i })).toBeTruthy()
    await user.type(screen.getByPlaceholderText("you@gmail.com"), "grace.wanjiku@gmail.com")
    await user.click(screen.getByRole("button", { name: /continue with google account/i }))

    const storedSession = JSON.parse(window.localStorage.getItem("chrisco:preview-session") || "null")
    expect(storedSession?.email).toBe("grace.wanjiku@gmail.com")
    expect(storedSession?.provider).toBe("google")
  })

  it("saves a contact inquiry and shows the automated response from chriscoyouthaflame2025@gmail.com", async () => {
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
    await user.click(screen.getByRole("button", { name: /send message/i }))

    expect((await screen.findAllByText(/we have received your message/i)).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/chriscoyouthaflame2025@gmail\.com/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Ref: MSG-/i)).toBeTruthy()
  })

  it("saves a course application and shows the automated receipt from chriscoyouthaflame2025@gmail.com", async () => {
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
    expect(screen.getAllByText(/chriscoyouthaflame2025@gmail\.com/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Ref: APP-/i)).toBeTruthy()
  })

  it("saves a tutor application and shows the automated receipt from chriscoyouthaflame2025@gmail.com", async () => {
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
    await user.click(screen.getByRole("button", { name: /submit tutor application/i }))

    expect(await screen.findByText(/we have received your tutor application!/i)).toBeTruthy()
    expect(screen.getAllByText(/chriscoyouthaflame2025@gmail\.com/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Ref: TUT-/i)).toBeTruthy()
  })
})
