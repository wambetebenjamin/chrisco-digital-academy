import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
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
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-courses.jpg" position="center 40%" />
      <Navbar />

      <PhotoHero
        eyebrow="Merchandise"
        title={
          <>
            Wear the <span className="accent-bright">word.</span>
          </>
        }
        titleStyle={{ maxWidth: 820 }}
        lead="Official CHRISCO Youth Aflame merchandise in cocoa, cream, ink, chalk, sand and deep teal, one harmonious family of colourways. Four collections: the PURSUE artwork, quieter Christian affirmations, statement pieces built on 1 Samuel 30:8, and the supplied design drops printed exactly as drawn."
      >
        <div className="fade-up fade-up-2" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
          {["S to XXL", "KSh and UGX pricing", "Order by code on WhatsApp"].map((p) => (
            <span key={p} className="pill pill-soft pill-sm">
              <Icon name="checkCircle" size={13} strokeWidth={2.2} /> {p}
            </span>
          ))}
        </div>
      </PhotoHero>

      <Shop initialCode={initialCode} />

      <PhotoBand
        centered
        eyebrow="Teams and churches"
        title="Dress your whole team in the word."
        body="Youth groups, worship teams, schools and fellowships can order in bulk by code and size run. Message the codes on WhatsApp and we will build the quotation."
      >
        <Link href="/affiliates" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
          Become an Affiliate →
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
