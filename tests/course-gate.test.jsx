import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "../app/AuthProvider"
import CoursesExplorer from "../app/courses/CoursesExplorer"
import LibraryClient from "../app/library/LibraryClient"
import Dashboard from "../app/dashboard/page"
import { christianBooks, learningBooks, buildBookShareUrl } from "../app/data/booksCatalogue"
import { courses, imageFor } from "../app/data/courses"
import { signBookAccessToken, verifyBookAccessToken } from "../app/lib/bookGateServer"
import { buildSocialMetadata } from "../app/lib/siteOrigin"

describe("account-gated books, dedicated Christian & Learning shelves, Dashboard vault, and per-course photos", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it("gives every course its own dedicated photograph and separates Christian books beside Learning handbooks", () => {
    expect(christianBooks.length).toBeGreaterThanOrEqual(1)
    expect(learningBooks.length).toBe(19)
    expect(christianBooks[0].shelf).toBe("christian")
    expect(christianBooks[0].pages).toBe(28)
    expect(learningBooks.every((b) => b.shelf === "learning" && b.pages === 28)).toBe(true)

    const courseImgs = courses.map((c) => imageFor(c))
    expect(new Set(courseImgs).size).toBe(19)
    expect(courseImgs.every((p) => p.startsWith("/images/courses/"))).toBe(true)

    expect(buildBookShareUrl("joseph-7-lessons-emerging-seer-prophet", "https://chrisco.org")).toBe(
      "https://chrisco.org/library/joseph-7-lessons-emerging-seer-prophet"
    )
  })

  it("cryptographically signs and verifies authenticated account book-access tokens and rejects unauthenticated calls", () => {
    expect(() => signBookAccessToken({ email: "reader@gmail.com" })).toThrow()
    const token = signBookAccessToken({ userId: "user-101", email: "reader@gmail.com" })
    expect(token).not.toContain("reader@gmail.com")
    expect(token).not.toContain("user-101")
    const verified = verifyBookAccessToken(token)
    expect(verified).toBeTruthy()
    expect(verified.auth).toBe(1)
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

  it("requires creating an account + Privacy consent (not guest email-only) before downloading any Christian book or course handbook", async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, "open").mockImplementation(() => null)

    render(
      <AuthProvider>
        <LibraryClient />
      </AuthProvider>
    )

    // Christian book download is also strictly account-gated when signed out
    const christianBtn = await screen.findByRole("button", {
      name: /Sign In \/ Register to Download/i,
    })
    await user.click(christianBtn)

    expect(await screen.findByRole("dialog")).toBeTruthy()

    // Attempt with name + email + password WITHOUT privacy consent -> blocked
    await user.type(screen.getByLabelText(/Full Name/i), "Grace Nakato")
    await user.type(screen.getByLabelText(/Email Address/i), "grace@example.com")
    await user.type(screen.getByLabelText(/Create Password/i), "secret123")
    await user.click(screen.getByRole("button", { name: /Create Account & Download PDF/i }))
    expect(await screen.findByText(/agree to the Privacy & Data Protection Policy/i)).toBeTruthy()
    expect(open).not.toHaveBeenCalled()

    // Grant Data Protection consent -> creates real account, signs user in, and unlocks PDF download
    await user.click(screen.getByRole("checkbox", { name: /Data Protection Consent/i }))
    await user.click(screen.getByRole("button", { name: /Create Account & Download PDF/i }))

    expect(open).toHaveBeenCalledWith(
      "/books/joseph-7-lessons-emerging-seer-prophet.pdf",
      "_blank"
    )
    const sessionRaw = window.localStorage.getItem("chrisco:preview-session")
    expect(sessionRaw).toContain("grace@example.com")
    const storedReader = window.localStorage.getItem("chrisco:book-reader")
    expect(storedReader).toContain("g****@example.com")
    expect(storedReader).not.toContain("grace@example.com")
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

  it("lets a signed-in student download Christian books and all 19 course handbooks anytime from their Dashboard", async () => {
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

    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    )

    expect(
      await screen.findByText(/Your Christian Books & 19 Course Handbooks/i)
    ).toBeTruthy()
    const christianLink = screen.getByRole("link", {
      name: /Download 28-Page Christian E-Book \(PDF\)/i,
    })
    expect(christianLink.getAttribute("href")).toBe(
      "/books/joseph-7-lessons-emerging-seer-prophet.pdf"
    )
    expect(screen.getAllByRole("link", { name: /^Download PDF$/i }).length).toBe(19)
  })

  it("attaches rich 1200x630 + 600x600 WhatsApp / Open Graph cover thumbnails with absolute HTTPS URLs", () => {
    const book = christianBooks[0]
    const meta = buildSocialMetadata({
      origin: "https://chrisco-youth.org",
      title: book.title,
      description: book.subtitle,
      path: book.sharePath,
      bannerPath: book.ogImage,
      squarePath: book.ogSquareImage,
    })

    expect(meta.openGraph.url).toBe(
      "https://chrisco-youth.org/library/joseph-7-lessons-emerging-seer-prophet"
    )
    expect(meta.openGraph.images.length).toBe(2)
    expect(meta.openGraph.images[0]).toMatchObject({
      url: "https://chrisco-youth.org/og/books/joseph-7-lessons-emerging-seer-prophet.jpg",
      secureUrl: "https://chrisco-youth.org/og/books/joseph-7-lessons-emerging-seer-prophet.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
    })
    expect(meta.openGraph.images[1]).toMatchObject({
      url: "https://chrisco-youth.org/og/books/joseph-7-lessons-emerging-seer-prophet-sq.jpg",
      width: 600,
      height: 600,
      type: "image/jpeg",
    })
    expect(meta.twitter.card).toBe("summary_large_image")
  })

  it("allows Google Authentication to sign in, save books to the user's library, and access them on Dashboard", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <LibraryClient />
      </AuthProvider>
    )

    // Click Save Book while logged out -> opens BookGateModal with Google Sign-In allowed
    await user.click(await screen.findByRole("button", { name: /^Save Book$/i }))
    expect(await screen.findByRole("button", { name: /Continue with Google/i })).toBeTruthy()

    await user.click(screen.getByRole("button", { name: /Continue with Google/i }))
    const googleDialog = await screen.findByRole("dialog", { name: /Sign in with Google/i })

    await user.type(within(googleDialog).getByPlaceholderText("you@gmail.com"), "faith.otieno@gmail.com")
    await user.click(within(googleDialog).getByRole("button", { name: /Verify Email/i }))
    await user.type(within(googleDialog).getByPlaceholderText("Enter your password"), "googleSecret99")
    const recaptcha = within(googleDialog).getByRole("checkbox", { name: /i'm not a robot/i })
    await user.click(recaptcha)
    await waitFor(() => expect(recaptcha.getAttribute("aria-checked")).toBe("true"))
    await user.click(within(googleDialog).getByRole("button", { name: /Continue with Google Account/i }))

    // Session + Saved Book persisted
    expect(await screen.findByText(/Signed In & Saved to Your Dashboard/i)).toBeTruthy()
    const savedMap = JSON.parse(window.localStorage.getItem("chrisco:saved-books") || "{}")
    expect(savedMap["faith.otieno@gmail.com"]).toContain(
      "joseph-7-lessons-emerging-seer-prophet"
    )
  })
})
