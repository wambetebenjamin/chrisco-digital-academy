import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PhotoHero from "../components/PhotoHero"
import PhotoBand from "../components/PhotoBand"
import Link from "next/link"
import Shop from "./Shop"
import { findMerch } from "../data/merch"
import { resolveServerOrigin, buildSocialMetadata } from "../lib/siteOrigin"

export const dynamic = "force-dynamic"

export async function generateMetadata({ searchParams }) {
  const origin = await resolveServerOrigin()
  const params = (await searchParams) || {}
  const code = typeof params.item === "string" ? params.item.toUpperCase() : ""
  const item = code ? findMerch(code) : null

  if (item) {
    const merchSlug = item.img
      ? item.img.split("/").pop().replace(/\.(png|jpe?g)$/i, ".jpg")
      : ""
    return buildSocialMetadata({
      origin,
      title: `${item.name} (${item.code}) | CHRISCO PURSUE Merchandise`,
      description: `${item.desc} Order code ${item.code} from CHRISCO Youth Aflame.`,
      path: `/shop?item=${item.code}`,
      bannerPath: merchSlug ? `/og/merch/${merchSlug}` : "/og/shop.jpg",
    })
  }

  return buildSocialMetadata({
    origin,
    title: "CHRISCO PURSUE Merchandise | Wear the Word",
    description:
      "Scripture merchandise from CHRISCO Youth Aflame: PURSUE artwork, Christian affirmations and 1 Samuel 30:8 statement pieces on tees, hoodies, polos, caps, and totes.",
    path: "/shop",
    bannerPath: "/og/shop.jpg",
  })
}

export default async function ShopPage({ searchParams }) {
  const params = (await searchParams) || {}
  const initialCode = typeof params.item === "string" ? params.item.toUpperCase() : ""

  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      <Navbar />

      <PhotoHero
        image="/images/bg-courses.jpg"
        eyebrow="CHRISCO Youth Aflame · 1 Samuel 30:8"
        title="PURSUE Merchandise Collection"
        lead="Official CHRISCO Youth Aflame apparel and study essentials in Brown, Cream, Black, White, and Natural. Anchored on 1 Samuel 30:8 with pricing in KSh and UGX."
      />

      <Shop initialCode={initialCode} />

      <PhotoBand
        centered
        eyebrow="Youth Fellowships & Teams"
        title="Bulk Orders for Churches, Youth Groups & Schools"
        body="Youth groups, worship teams, schools, and fellowships can order in bulk by product code and size run."
      >
        <Link href="/affiliates" className="btn btn-amber" style={{ textDecoration: "none" }}>
          Become an Affiliate
        </Link>
        <Link href="/contact" className="btn btn-outline-light" style={{ textDecoration: "none" }}>
          Contact the Academy
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
