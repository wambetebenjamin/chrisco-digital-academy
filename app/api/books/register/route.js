import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { CONSENT_POLICY_VERSION, maskEmail } from "../../../data/booksCatalogue"
import {
  BOOK_ACCESS_COOKIE,
  buildAccessCookieOptions,
  checkRegistrationRateLimit,
  isValidReaderEmail,
  signBookAccessToken,
  verifyBookAccessToken,
} from "../../../lib/bookGateServer"

export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(BOOK_ACCESS_COOKIE)?.value || ""
  const verified = verifyBookAccessToken(raw)
  if (!verified) {
    return NextResponse.json(
      { ok: true, registered: false, authenticated: false },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  }
  return NextResponse.json(
    {
      ok: true,
      registered: true,
      authenticated: true,
      maskedEmail: verified.me || "",
      consentVersion: verified.cv || CONSENT_POLICY_VERSION,
    },
    { headers: { "Cache-Control": "private, no-store" } }
  )
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local"

    if (!checkRegistrationRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      )
    }

    const body = await request.json()

    if (body?.website && String(body.website).trim() !== "") {
      return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 })
    }

    const email = String(body?.email || "").trim().toLowerCase()
    const userId = String(body?.userId || "").trim()
    const authenticatedAccount = Boolean(body?.authenticatedAccount)

    // Strict Account-Only Download Gate:
    // Visitors must create an account and sign in (no guest email-only downloads).
    if (!authenticatedAccount || !userId || !isValidReaderEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please create an account and sign in to download Christian books and course handbooks.",
        },
        { status: 401 }
      )
    }

    const token = signBookAccessToken({
      userId,
      email,
      consentVersion: CONSENT_POLICY_VERSION,
    })

    const res = NextResponse.json(
      {
        ok: true,
        registered: true,
        authenticated: true,
        maskedEmail: maskEmail(email),
        consentVersion: CONSENT_POLICY_VERSION,
        registeredAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "private, no-store" } }
    )

    const opts = buildAccessCookieOptions(request)
    res.cookies.set(opts.name, token, {
      httpOnly: opts.httpOnly,
      sameSite: opts.sameSite,
      secure: opts.secure,
      path: opts.path,
      maxAge: opts.maxAge,
    })

    return res
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid session sync request." },
      { status: 400 }
    )
  }
}

export async function DELETE(request) {
  const opts = buildAccessCookieOptions(request)
  const res = NextResponse.json(
    { ok: true, registered: false, authenticated: false, message: "Your book session cookie has been cleared." },
    { headers: { "Cache-Control": "private, no-store" } }
  )
  res.cookies.set(BOOK_ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: opts.secure,
    path: "/",
    maxAge: 0,
  })
  return res
}
