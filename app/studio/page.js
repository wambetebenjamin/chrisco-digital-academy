import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import OpenHiggsfieldStudio from "../components/OpenHiggsfieldStudio"
import VoiceStudioNarrator from "../components/VoiceStudioNarrator"
import OpenSeoWorkspace from "../components/OpenSeoWorkspace"

export const metadata = {
  title: "AI Creative Studio · OpenHiggsfield, VoiceStudio & OpenSEO Labs",
  description:
    "Interactive AI Image & Video Prompt Studio, VoiceStudio Audio Narrator, and OpenSEO Visibility Lab at CHRISCO Digital Academy.",
}

export default function StudioPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Navbar />
      <section style={{ padding: "clamp(112px, 14vw, 144px) 0 72px" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <span className="eyebrow">CHRISCO Digital Academy · Hands-On AI Labs</span>
            <h1 className="title" style={{ marginTop: 12 }}>
              Creative AI, Voice Narration &amp; <span className="accent">SEO Studio</span>
            </h1>
            <p style={{ color: "var(--muted)", maxWidth: 680, marginTop: 8 }}>
              Practice image and video prompt engineering, multi-language audio narration, and search/AI visibility audits right inside your browser.
            </p>
          </div>

          <OpenHiggsfieldStudio />
          <VoiceStudioNarrator title="VoiceStudio · AI Script Narration, Paste-and-Split & Voice Dictation" />
          <OpenSeoWorkspace />
        </div>
      </section>
      <Footer />
      <Chatbot />
    </main>
  )
}
