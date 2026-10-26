import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "../app/AuthProvider"
import CoursesExplorer from "../app/courses/CoursesExplorer"
import LibraryClient from "../app/library/LibraryClient"
import { christianBooks, learningBooks, buildBookShareUrl } from "../app/data/booksCatalogue"
import { signBookAccessToken, verifyBookAccessToken } from "../app/lib/bookGateServer"

describe("email-gated books, dedicated Christian & Learning shelves, share links, and data protection", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it("separates Christian books into their own shelf beside Learning handbooks with shareable links", () => {
    expect(christianBooks.length).toBeGreaterThanOrEqual(1)
    expect(learningBooks.length).toBe(19)
    expect(christianBooks[0].shelf).toBe("christian")
    expect(christianBooks[0].pages).toBe(28)
    expect(learningBooks.every((b) => b.shelf === "learning" && b.pages === 28)).toBe(true)
    expect(buildBookShareUrl("joseph-7-lessons-emerging-seer-prophet", "https://chrisco.org")).toBe(
      "https://chrisco.org/library/joseph-7-lessons-emerging-seer-prophet"
    )
  })

  it("cryptographically signs and verifies book-access tokens without storing plaintext email", () => {
    const token = signBookAccessToken({ email: "reader@gmail.com" })
    expect(token).not.toContain("reader@gmail.com")
    const verified = verifyBookAccessToken(token)
    expect(verified).toBeTruthy()
    expect(verified.me).toBe("r****@gmail.com")
    expect(verifyBookAccessToken(`${token}tampered`)).toBeNull()
  })

  it("shows objectives, outline, and a shareable book link to everyone", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <CoursesExplorer />
      </AuthProvider>
    )

    await user.click(screen.getByText("YouTube Automation"))
    expect(await screen.findByText("Course Objectives")).toBeTruthy()
    expect(screen.getByText("Course Outline")).toBeTruthy()
    expect(screen.getByText(/Share this book so others can visit/i)).toBeTruthy()
    expect(screen.getByText(/\/library\/youtube-automation/i)).toBeTruthy()
  })

  it("requires email registration + explicit Privacy & Data Protection consent before online download", async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, "open").mockImplementation(() => null)

    render(
      <AuthProvider>
        <CoursesExplorer />
      </AuthProvider>
    )

    await user.click(screen.getByText("YouTube Automation"))
    const gateButtons = screen.getAllByRole("button", {
      name: /register by email to download/i,
    })
    await user.click(gateButtons[gateButtons.length - 1])

    expect(await screen.findByRole("dialog")).toBeTruthy()

    // Attempt with email but WITHOUT privacy consent -> blocked!
    await user.type(screen.getByLabelText(/Email Address/i), "grace@example.com")
    await user.click(screen.getByRole("button", { name: /Register & Download PDF/i }))
    expect(await screen.findByText(/agree to the Privacy & Data Protection Policy/i)).toBeTruthy()
    expect(open).not.toHaveBeenCalled()

    // Grant explicit Data Protection consent -> unlocks download & stores only masked email locally
    await user.click(screen.getByRole("checkbox", { name: /Data Protection Consent/i }))
    await user.click(screen.getByRole("button", { name: /Register & Download PDF/i }))

    expect(open).toHaveBeenCalledWith("/books/youtube-automation.pdf", "_blank")
    const storedRaw = window.localStorage.getItem("chrisco:book-reader")
    expect(storedRaw).toContain("g****@example.com")
    expect(storedRaw).not.toContain("grace@example.com")
  })

  it("renders dedicated Christian & Faith Shelf beside Skill & Learning Shelf on /library", async () => {
    render(
      <AuthProvider>
        <LibraryClient />
      </AuthProvider>
    )

    expect(await screen.findByText("Christian & Prophetic Study Books")).toBeTruthy()
    expect(screen.getByText(/Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn/i)).toBeTruthy()
    expect(screen.getByText(/Practical Skill & Learning Handbooks/i)).toBeTruthy()
  })

  it("lets a signed-in student download the handbook directly", async () => {
    window.localStorage.setItem(
      "chrisco:preview-users",
      JSON.stringify([
        { id: "preview-1", email: "amina@example.com", name: "Amina", password: "x" },
      ])
    )
    window.localStorage.setItem(
      "chrisco:preview-session",
      JSON.stringify({ id: "preview-1", email: "amina@example.com", name: "Amina" })
    )

    const user = userEvent.setup()
    const open = vi.spyOn(window, "open").mockImplementation(() => null)

    render(
      <AuthProvider>
        <CoursesExplorer />
      </AuthProvider>
    )

    await user.click(screen.getByText("YouTube Automation"))
    const downloadButtons = screen.getAllByRole("button", { name: /download course handbook/i })
    await user.click(downloadButtons[downloadButtons.length - 1])

    expect(open).toHaveBeenCalledWith("/books/youtube-automation.pdf", "_blank")
  })
})
