import fs from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getBookBySlug } from "../../data/booksCatalogue"
import { BOOK_ACCESS_COOKIE, verifyBookAccessToken } from "../../lib/bookGateServer"

function buildExternalUrl(request, pathnameAndSearch) {
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    new URL(request.url).protocol.replace(":", "") ||
    "https"
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    new URL(request.url).host
  return `${proto}://${host}${pathnameAndSearch}`
}

export async function GET(request, context) {
  const params = await context.params
  const rawFile = String(params?.file || "").trim().toLowerCase()

  // Allow /books/<slug> (without .pdf) to redirect cleanly to the shareable book page
  if (/^[a-z0-9-]+$/.test(rawFile)) {
    const bySlug = getBookBySlug(rawFile)
    if (bySlug) {
      return NextResponse.redirect(buildExternalUrl(request, `/library/${bySlug.slug}`), 302)
    }
  }

  // Strict filename allowlist pattern (prevents path traversal)
  if (!/^[a-z0-9-]+\.pdf$/.test(rawFile)) {
    return new NextResponse("Book not found", { status: 404 })
  }

  const slug = rawFile.replace(/\.pdf$/, "")
  const book = getBookBySlug(slug)

  // Verify server-side HttpOnly email-registration token
  const cookieStore = await cookies()
  const rawToken = cookieStore.get(BOOK_ACCESS_COOKIE)?.value || ""
  const verified = verifyBookAccessToken(rawToken)

  if (!verified) {
    // Redirect unregistered online visitors to the book's landing & registration page!
    const dest = book ? `/library/${encodeURIComponent(slug)}?unlock=1` : "/library?unlock=1"
    return NextResponse.redirect(buildExternalUrl(request, dest), {
      status: 302,
      headers: { "Cache-Control": "private, no-store" },
    })
  }

  const pdfPath = path.join(process.cwd(), "content", "books", rawFile)
  try {
    const fileBuf = await fs.readFile(pdfPath)
    return new NextResponse(fileBuf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${rawFile}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, noarchive",
      },
    })
  } catch {
    return new NextResponse("Book file unavailable", { status: 404 })
  }
}
