import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "../app/AuthProvider"
import CoursesExplorer from "../app/courses/CoursesExplorer"

describe("course handbooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("shows objectives and the outline to everyone", async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <CoursesExplorer />
      </AuthProvider>
    )

    await user.click(screen.getByText("YouTube Automation"))
    expect(await screen.findByText("Course Objectives")).toBeTruthy()
    expect(screen.getByText("Course Outline")).toBeTruthy()
    expect(screen.getByText("Set up a faceless channel in a profitable niche")).toBeTruthy()
    expect(screen.getByText("Introduction to YouTube Automation")).toBeTruthy()
  })

  it("asks signed-out visitors to sign in before downloading", async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, "open").mockImplementation(() => null)

    render(
      <AuthProvider>
        <CoursesExplorer />
      </AuthProvider>
    )

    await user.click(screen.getByText("YouTube Automation"))
    const gateButtons = screen.getAllByRole("button", { name: /sign in to download/i })
    await user.click(gateButtons[gateButtons.length - 1])

    expect(await screen.findByText("Sign in to download the handbook")).toBeTruthy()
    expect(open).not.toHaveBeenCalled()
  })

  it("lets a signed-in student download the handbook", async () => {
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
    expect(screen.queryByText("Sign in to download the handbook")).toBeNull()
  })
})
