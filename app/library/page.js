import LibraryClient from "./LibraryClient"
import { resolveServerOrigin, buildSocialMetadata } from "../lib/siteOrigin"

export const dynamic = "force-dynamic"

export async function generateMetadata({ searchParams }) {
  const origin = await resolveServerOrigin()
  const sp = (await searchParams) || {}
  const isChristian = sp.shelf === "christian"

  return buildSocialMetadata({
    origin,
    title: isChristian
      ? "Christian & Prophetic Study Books | CHRISCO Youth Aflame"
      : "Digital E-Book Library: Christian Books & 19 Course Handbooks",
    description: isChristian
      ? "Scripture-anchored Christian books from CHRISCO Youth Aflame. Sign in to download and save."
      : "Christian books and 19 practical digital skill handbooks from CHRISCO Youth Aflame. Sign in to download and save.",
    path: isChristian ? "/library?shelf=christian" : "/library",
    bannerPath: isChristian
      ? "/og/books/joseph-7-lessons-emerging-seer-prophet.jpg"
      : "/og/library.jpg",
    squarePath: isChristian
      ? "/og/books/joseph-7-lessons-emerging-seer-prophet-sq.jpg"
      : null,
  })
}

export default function LibraryPage() {
  return <LibraryClient />
}
