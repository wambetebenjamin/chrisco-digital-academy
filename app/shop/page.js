import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import Link from "next/link"
import Shop from "./Shop"

export const metadata = {
  title: "PURSUE Merchandise",
  description:
    "The PURSUE collection from CHRISCO Youth Aflame: t-shirts, hoodies, polos, caps, tote bags, mugs and notebooks. Choose a code, a size from S to XXL and a quantity, then send your order.",
}

export default async function ShopPage({ searchParams }) {
  const params = (await searchParams) || {}
  const initialCode = typeof params.item === "string" ? params.item.toUpperCase() : ""

  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-courses.jpg" position="center 40%" />
      <Navbar />

      <PhotoHero
        eyebrow="PURSUE collection"
        title={
          <>
            Wear the <span className="accent-bright">pursuit.</span>
          </>
        }
        titleStyle={{ maxWidth: 820 }}
        lead="Official CHRISCO Youth Aflame merchandise in brown, white, black, cream and natural canvas. Two collections: the PURSUE artwork, and quieter Christian affirmations set in gold type."
      >
        <div className="fade-up fade-up-2" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
          {["S to XXL", "KSh and UGX pricing", "Bulk orders welcome"].map((p) => (
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
        title="Dress your whole team in PURSUE."
        body="Youth groups, worship teams, schools and fellowships can order in bulk by code and size run. Ask us for a quotation."
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
