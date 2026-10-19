import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Shop from "../app/shop/Shop"

describe("PURSUE shop", () => {
  it("lists every product with its code", () => {
    render(<Shop />)
    for (const code of ["TS-01", "TS-02", "TS-03", "HD-01", "HD-02", "PL-01", "PL-02", "CP-01", "TB-01", "MG-01", "NB-01"]) {
      expect(screen.getAllByText(code).length).toBeGreaterThan(0)
    }
  })

  it("offers S to XXL, quantity and a running total", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByLabelText("View PURSUE Sunrise Tee (TS-01)"))
    for (const size of ["S", "M", "L", "XL", "XXL"]) {
      expect(screen.getByRole("button", { name: size })).toBeTruthy()
    }

    await user.click(screen.getByRole("button", { name: "L" }))
    await user.click(screen.getByRole("button", { name: /increase quantity/i }))
    expect(screen.getByText("UGX 90,000")).toBeTruthy()
  })

  it("adds the chosen size and quantity to the order tray", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByLabelText("View PURSUE Pullover Hoodie (HD-01)"))
    await user.click(screen.getByRole("button", { name: "M" }))
    await user.click(screen.getByRole("button", { name: /add to order/i }))

    const tray = await screen.findByLabelText("My order")
    expect(within(tray).getByText(/HD-01/)).toBeTruthy()
    expect(within(tray).getByText(/size M/)).toBeTruthy()
    expect(within(tray).getAllByText("UGX 95,000").length).toBeGreaterThan(0)
  })

  it("shows recommendations that exclude the item being viewed", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByLabelText("View PURSUE Sunrise Tee (TS-02)"))
    const recs = screen.getByText("Recommended").closest(".shop-recs")
    expect(within(recs).queryByText("TS-02")).toBeNull()
    expect(recs.querySelectorAll(".shop-rec").length).toBe(3)
  })

  it("opens a size guide for apparel", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByLabelText("View PURSUE Sunrise Tee (TS-01)"))
    await user.click(screen.getByRole("button", { name: /size guide/i }))
    const table = screen.getByRole("table")
    expect(table).toBeTruthy()
    expect(within(table).getByText("XXL")).toBeTruthy()
    expect(within(table).getByText("120")).toBeTruthy()
  })

  it("filters the catalogue by category", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByRole("button", { name: "Hoodies" }))
    expect(screen.getAllByText("HD-01").length).toBeGreaterThan(0)
    expect(screen.queryByText("MG-01")).toBeNull()
  })
})
