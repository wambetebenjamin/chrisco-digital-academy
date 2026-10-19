import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Shop from "../app/shop/Shop"

describe("PURSUE shop", () => {
  it("lists every product with its code", () => {
    render(<Shop />)
    for (const code of ["TS-01", "TS-02", "TS-03", "TS-04", "HD-01", "HD-02", "HD-03", "PL-01", "PL-02", "CP-01", "CP-02", "TB-01", "TB-02", "MG-01", "MG-02", "NB-01", "NB-02", "TS-05", "TS-06", "TS-07", "TS-08", "TS-09", "TS-10", "TS-11", "HD-04", "PL-03", "CP-03", "TB-03", "MG-03"]) {
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
    expect(screen.getAllByText("KSh 3,200").length).toBeGreaterThan(0)
    expect(screen.getAllByText("UGX 90,000").length).toBeGreaterThan(0)
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
    expect(within(tray).getAllByText(/UGX 95,000/).length).toBeGreaterThan(0)
    expect(within(tray).getAllByText(/KSh 3,400/).length).toBeGreaterThan(0)
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

  it("filters by collection", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByRole("button", { name: "Faith affirmations" }))
    expect(screen.getAllByText("TS-05").length).toBeGreaterThan(0)
    expect(screen.queryByText("PL-01")).toBeNull()

    await user.click(screen.getByRole("button", { name: "PURSUE" }))
    expect(screen.getAllByText("PL-01").length).toBeGreaterThan(0)
    expect(screen.queryByText("TS-05")).toBeNull()
  })

  it("filters by the scripture collection and links each card to WhatsApp", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByRole("button", { name: "Scripture statements" }))
    expect(screen.getAllByText("TS-07").length).toBeGreaterThan(0)
    expect(screen.queryByText("TS-01")).toBeNull()

    const link = screen.getByLabelText(/Message on WhatsApp about Overtake Tee \(TS-07\)/i)
    expect(link.getAttribute("href")).toContain("wa.me")
    expect(decodeURIComponent(link.getAttribute("href"))).toContain("Design code: TS-07")
  })

  it("sends the picked size and quantity to WhatsApp from the product panel", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByLabelText("View Overtake Tee (TS-07)"))
    await user.click(screen.getByRole("button", { name: "XL" }))
    const cta = screen.getByRole("link", { name: /send code on whatsapp/i })
    const message = decodeURIComponent(cta.getAttribute("href"))
    expect(message).toContain("Design code: TS-07")
    expect(message).toContain("Size: XL")
  })

  it("filters the catalogue by category", async () => {
    const user = userEvent.setup()
    render(<Shop />)

    await user.click(screen.getByRole("button", { name: "Hoodies" }))
    expect(screen.getAllByText("HD-01").length).toBeGreaterThan(0)
    expect(screen.queryByText("MG-01")).toBeNull()
  })
})
