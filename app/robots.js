import { DEFAULT_SITE_ORIGIN } from "./lib/siteOrigin"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: ["/", "/courses", "/library", "/shop", "/studio", "/about"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
