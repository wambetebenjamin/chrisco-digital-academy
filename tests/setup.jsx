import React from "react"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// The app uses next/navigation and next/link. In tests we only need the parts
// AuthProvider touches. Written with createElement so this file needs no JSX
// transform (the repo's jsconfig keeps jsx: preserve for Next).
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/sign-in",
}))
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => {
    const { fill, sizes, priority, ...attrs } = rest
    return React.createElement("img", { src: typeof src === "string" ? src : "", alt: alt || "", ...attrs })
  },
}))
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) =>
    React.createElement("a", { href: typeof href === "string" ? href : "#", ...rest }, children),
}))

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
