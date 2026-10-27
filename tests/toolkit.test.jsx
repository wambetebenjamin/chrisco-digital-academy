import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ToolkitClient from "../app/toolkit/ToolkitClient"
import { toolkitPrompts, toolkitFilters, advancedTools } from "../app/data/toolkit"

/*
 * AI Creator Toolkit tests: catalogue integrity, filtering/search, the
 * copy-prompt flow (including edited prompts and the reset action), and the
 * advanced open-source tools section.
 *
 * userEvent.setup() installs a clipboard simulator on navigator.clipboard,
 * so copy assertions read it back with navigator.clipboard.readText().
 */
describe("AI Creator Toolkit catalogue data", () => {
  it("ships a complete, internally consistent prompt catalogue", () => {
    expect(toolkitPrompts.length).toBeGreaterThanOrEqual(20)

    const ids = toolkitPrompts.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)

    const filterIds = toolkitFilters.map((f) => f.id)
    for (const card of toolkitPrompts) {
      expect(card.title).toBeTruthy()
      expect(card.description).toBeTruthy()
      expect(card.prompt.length).toBeGreaterThan(40)
      expect(card.track).toBeTruthy()
      expect(card.tip).toBeTruthy()
      expect(card.source).toBeTruthy()
      expect(filterIds).toContain(card.type)
    }
  })

  it("attributes every adapted OpenCreator card with the Apache license and a source URL", () => {
    const adapted = toolkitPrompts.filter((c) => c.license === "Apache-2.0")
    expect(adapted.length).toBeGreaterThan(10)
    for (const card of adapted) {
      expect(card.sourceUrl).toMatch(/^https:\/\/github\.com\//)
      expect(card.source).toMatch(/OpenCreator/)
    }

    const originals = toolkitPrompts.filter((c) => c.type === "starter")
    expect(originals.length).toBeGreaterThan(0)
    for (const card of originals) {
      expect(card.license).toBeNull()
      expect(card.sourceUrl).toBeNull()
    }
  })

  it("lists both advanced tools with a license, GitHub link and requirements", () => {
    expect(advancedTools.map((t) => t.id).sort()).toEqual(["image-blaster", "opencreator"])
    for (const tool of advancedTools) {
      expect(tool.url).toMatch(/^https:\/\/github\.com\//)
      expect(tool.license).toMatch(/(Apache|MIT)/)
      expect(tool.requirements.length).toBeGreaterThan(0)
      expect(tool.does.length).toBeGreaterThan(0)
    }
  })
})

describe("AI Creator Toolkit page", () => {
  it("renders every prompt card with an editable prompt and a copy button", () => {
    const { container } = render(<ToolkitClient />)
    expect(container.querySelectorAll(".toolkit-card").length).toBe(toolkitPrompts.length)
    expect(screen.getAllByRole("button", { name: /copy prompt/i }).length).toBe(toolkitPrompts.length)
    expect(screen.getAllByLabelText(/^Editable prompt:/).length).toBe(toolkitPrompts.length)
  })

  it("filters cards by prompt type and reports the live count", async () => {
    const user = userEvent.setup()
    const { container } = render(<ToolkitClient />)

    await user.click(screen.getByRole("button", { name: /video prompts/i }))
    const videoCount = toolkitPrompts.filter((c) => c.type === "video").length
    expect(container.querySelectorAll(".toolkit-card").length).toBe(videoCount)
    expect(container.querySelectorAll(".toolkit-card[data-type='video']").length).toBe(videoCount)
    expect(screen.getByText(/showing/i).textContent).toContain(String(videoCount))

    await user.click(screen.getByRole("button", { name: /writing frameworks/i }))
    expect(container.querySelectorAll(".toolkit-card[data-type='writing']").length).toBe(
      toolkitPrompts.filter((c) => c.type === "writing").length
    )
  })

  it("searches across titles, descriptions and prompt text", async () => {
    const user = userEvent.setup()
    const { container } = render(<ToolkitClient />)

    await user.type(screen.getByLabelText("Search prompts"), "drone")
    const visible = container.querySelectorAll(".toolkit-card")
    expect(visible.length).toBeGreaterThan(0)
    expect(visible.length).toBeLessThan(toolkitPrompts.length)
    expect(visible[0].textContent).toMatch(/drone/i)
  })

  it("copies the prompt, then copies the learner's edited version and can reset it", async () => {
    const user = userEvent.setup()
    const { container } = render(<ToolkitClient />)

    const firstCard = toolkitPrompts[0]
    const card = container.querySelector(".toolkit-card")
    const textarea = within(card).getByLabelText(`Editable prompt: ${firstCard.title}`)

    await user.click(within(card).getByRole("button", { name: /cop/i }))
    expect(await navigator.clipboard.readText()).toBe(firstCard.prompt)

    await user.clear(textarea)
    await user.type(textarea, "My custom edited prompt for a learner")
    await user.click(within(card).getByRole("button", { name: /cop/i }))
    expect(await navigator.clipboard.readText()).toBe("My custom edited prompt for a learner")

    await user.click(within(card).getByRole("button", { name: /^reset$/i }))
    expect(textarea.value).toBe(firstCard.prompt)
  })

  it("shows the fill-in tokens each learner must replace", () => {
    render(<ToolkitClient />)
    expect(screen.getAllByText("Replace:").length).toBeGreaterThan(0)
    // The drone orbit card carries a [subject] token in the adapted prompt.
    expect(screen.getAllByText(/\[subject\]/i).length).toBeGreaterThan(0)
  })

  it("presents the advanced tools as external, attributed links", () => {
    render(<ToolkitClient />)
    const githubLinks = screen.getAllByRole("link", { name: /view on github/i })
    expect(githubLinks.length).toBe(2)
    for (const link of githubLinks) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\/github\.com\//)
      expect(link.getAttribute("target")).toBe("_blank")
      expect(link.getAttribute("rel")).toContain("noreferrer")
    }
    // "Apache License 2.0" appears in the tool card and the attribution banner.
    expect(screen.getAllByText(/Apache License 2\.0/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/MIT License/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/NOTICE\.md/i).length).toBeGreaterThan(0)
  })
})
