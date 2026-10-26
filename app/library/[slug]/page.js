import { notFound } from "next/navigation"
import { allBooks, getBookBySlug } from "../../data/booksCatalogue"
import BookDetailClient from "./BookDetailClient"

export function generateStaticParams() {
  return allBooks.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }) {
  const resolved = await params
  const book = getBookBySlug(resolved?.slug)
  if (!book) {
    return { title: "Book Not Found | CHRISCO Library" }
  }
  return {
    title: `${book.title} | CHRISCO Youth Aflame Library`,
    description: `${book.subtitle} (${book.pages} spacious pages with ${book.illustrations} visual diagrams — register free by email to download online.)`,
    openGraph: {
      title: book.title,
      description: book.subtitle,
      images: [book.coverImage],
    },
  }
}

export default async function BookDetailPage({ params }) {
  const resolved = await params
  const book = getBookBySlug(resolved?.slug)
  if (!book) notFound()
  return <BookDetailClient book={book} />
}
