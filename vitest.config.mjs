import { defineConfig } from "vitest/config"
import { transformWithEsbuild } from "vite"

/*
 * Tests render the real app components. The app keeps JSX inside .js files
 * (Next.js convention) and the repo's jsconfig sets jsx: "preserve", so this
 * plugin compiles app/**.js as JSX before Vitest's import analysis runs.
 */
const jsxInJs = {
  name: "chrisco:jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    if (id.endsWith(".jsx") || (id.includes("/app/") && id.endsWith(".js"))) {
      return transformWithEsbuild(code, id, { loader: "jsx", jsx: "automatic" })
    }
    return null
  },
}

export default defineConfig({
  plugins: [jsxInJs],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.jsx"],
    include: ["tests/**/*.test.jsx"],
    globals: true,
  },
})
