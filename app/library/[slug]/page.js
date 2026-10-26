import { notFound } from "next/navigation"
import { allBooks, getBookBySlug } from "../../data/booksCatalogue"
import { resolveServerOrigin, buildSocialMetadata } from "../../lib/siteOrigin"
import BookDetailClient from "./BookDetailClient"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }) {
  const origin = await resolveServerOrigin()
  const resolved = await params
  const book = getBookBySlug(resolved?.slug)
  if (!book) {
    return { title: "Book Not Found | CHRISCO Library" }
  }

  return buildSocialMetadata({
    origin,
    title: `${book.title} | CHRISCO Youth Aflame`,
    description: book.subtitle,
    path: book.sharePath,
    bannerPath: book.ogImage || `/og/books/${book.slug}.jpg`,
    squarePath: book.ogSquareImage || `/og/books/${book.slug}-sq.jpg`,
    type: "website",
  })
}

export default async function BookDetailPage({ params }) {
  const resolved = await params
  const book = getBookBySlug(resolved?.slug)
  if (!book) notFound()

  const relatedBooks = allBooks
    .filter((b) => b.shelf === book.shelf && b.slug !== book.slug)
    .slice(0, 4)

  return <BookDetailClient book={book} relatedBooks={relatedBooks} />
}
