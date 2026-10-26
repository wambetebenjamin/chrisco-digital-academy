import { headers } from "next/headers"

function cleanOrigin(raw) {
  const s = String(raw || "").trim().replace(/\/+$/, "")
  if (!s) return ""
  if (/^https?:\/\//i.test(s)) return s
  return `https://${s}`
}

/**
 * Resolves the live public origin from incoming request headers first,
 * falling back to configured site/deployment environment variables.
 * Ensures WhatsApp, Telegram, Facebook, and X crawlers always receive
 * reachable absolute https:// URLs rather than http://localhost:3000.
 */
export async function resolveServerOrigin() {
  const envFallback =
    cleanOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    cleanOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    cleanOrigin(process.env.VERCEL_URL) ||
    "https://chrisco-digital-academy.vercel.app"

  try {
    const h = await headers()
    const host = (
      h.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      h.get("host")?.split(",")[0]?.trim() ||
      ""
    )
    if (!host) return envFallback

    const isLocal =
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.startsWith("0.0.0.0")

    if (isLocal && process.env.NEXT_PUBLIC_SITE_URL) {
      return cleanOrigin(process.env.NEXT_PUBLIC_SITE_URL)
    }

    const forwardedProto = h.get("x-forwarded-proto")?.split(",")[0]?.trim()
    const proto = forwardedProto || (isLocal ? "http" : "https")
    return `${proto}://${host}`
  } catch {
    return envFallback
  }
}

export function buildSocialMetadata({
  origin,
  title,
  description,
  path = "/",
  bannerPath = "/og/default.jpg",
  squarePath = null,
  type = "website",
}) {
  const base = cleanOrigin(origin) || "https://chrisco-digital-academy.vercel.app"
  const canonicalUrl = `${base}${path.startsWith("/") ? path : `/${path}`}`
  const primaryImageUrl = bannerPath.startsWith("http")
    ? bannerPath
    : `${base}${bannerPath.startsWith("/") ? bannerPath : `/${bannerPath}`}`

  const images = [
    {
      url: primaryImageUrl,
      secureUrl: primaryImageUrl.replace(/^http:\/\//i, "https://"),
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: title,
    },
  ]

  if (squarePath) {
    const sqUrl = squarePath.startsWith("http")
      ? squarePath
      : `${base}${squarePath.startsWith("/") ? squarePath : `/${squarePath}`}`
    images.push({
      url: sqUrl,
      secureUrl: sqUrl.replace(/^http:\/\//i, "https://"),
      width: 600,
      height: 600,
      type: "image/jpeg",
      alt: title,
    })
  }

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "CHRISCO Youth Aflame · Digital Academy",
      locale: "en_KE",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImageUrl],
    },
  }
}
