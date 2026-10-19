import { describe, it, expect } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "../app/AuthProvider"
import SignIn from "../app/sign-in/page"
import SignUp from "../app/sign-up/page"

function renderSignIn() {
  return render(
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  )
}

async function createAccount() {
  const user = userEvent.setup()
  render(
    <AuthProvider>
      <SignUp />
    </AuthProvider>
  )
  await user.type(screen.getByPlaceholderText("e.g. Amani Mwangi"), "Amina Nakato")
  await user.type(screen.getByPlaceholderText("you@email.com"), "amina@example.com")
  await user.type(screen.getByPlaceholderText("••••••••"), "secret123")
  await user.click(screen.getByRole("button", { name: /create account/i }))
  await waitFor(() => expect(window.localStorage.getItem("chrisco:preview-session")).toBeTruthy())
}

describe("sign up and sign in", () => {
  it("creates an account and starts a session", async () => {
    await createAccount()
    const session = JSON.parse(window.localStorage.getItem("chrisco:preview-session"))
    expect(session.email).toBe("amina@example.com")
  })

  it("signs in with the account just created", async () => {
    await createAccount()
    window.localStorage.removeItem("chrisco:preview-session")

    renderSignIn()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText("you@email.com"), "amina@example.com")
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      const session = JSON.parse(window.localStorage.getItem("chrisco:preview-session") || "null")
      expect(session?.email).toBe("amina@example.com")
    })
    expect(screen.queryByText(/incorrect password/i)).toBeNull()
  })

  it("shows a clear error for a wrong password", async () => {
    await createAccount()
    window.localStorage.removeItem("chrisco:preview-session")

    renderSignIn()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText("you@email.com"), "amina@example.com")
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpass")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    expect(await screen.findByText(/incorrect password/i)).toBeTruthy()
    expect(window.localStorage.getItem("chrisco:preview-session")).toBeNull()
  })

  it("shows a clear error for an unknown account", async () => {
    renderSignIn()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText("you@email.com"), "nobody@example.com")
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    expect(await screen.findByText(/no account found/i)).toBeTruthy()
  })

  it("requires both fields before submitting", async () => {
    renderSignIn()
    const user = userEvent.setup()
    await user.click(screen.getByRole("button", { name: /sign in/i }))
    expect(await screen.findByText(/please fill in all fields/i)).toBeTruthy()
  })
})
