import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import Link from "next/link"
import ToolkitClient from "./ToolkitClient"

export const metadata = {
  title: "AI Creator Toolkit",
  description:
    "Free, ready-made prompts for video generation, image design and writing — adapted from open-source AI creator tools. Fill in the brackets, copy, and paste into ChatGPT, Gemini, Canva or CapCut.",
}

const heroPills = ["24 ready prompts", "Works with free AI tools", "Phone-friendly", "No sign-up needed"]

export default function ToolkitPage() {
  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-courses.jpg" position="center 30%" />
      <Navbar />

      <PhotoHero
        eyebrow="AI Creator Toolkit"
        title={
          <>
            Create like a studio, <span className="accent-bright">starting free.</span>
          </>
        }
        titleStyle={{ maxWidth: 860 }}
        lead="A library of expert prompts for AI video, image design and writing — the same prompt-engineering patterns used by professional creator tools, simplified for CHRISCO students. Pick one, fill in the brackets, and paste it into any free AI tool."
      >
        <div className="fade-up fade-up-2" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
          {heroPills.map((p) => (
            <span key={p} className="pill pill-soft pill-sm">
              <Icon name="checkCircle" size={13} strokeWidth={2.2} /> {p}
            </span>
          ))}
        </div>
      </PhotoHero>

      <ToolkitClient />

      <PhotoBand
        centered
        eyebrow="Practice makes prompts"
        title="Use these prompts in your course projects"
        body="Every prompt maps to one of our 19 courses. Enrol, try the prompt in a free tool, and share the result with your tutor for feedback on your portfolio."
      >
        <Link href="/courses" className="btn btn-green btn-lg" style={{ textDecoration: "none" }}>
          Browse the 19 courses →
        </Link>
      </PhotoBand>

      <Footer />
      <Chatbot />
    </main>
  )
}
