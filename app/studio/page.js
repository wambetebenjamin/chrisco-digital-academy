import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PhotoHero from "../components/PhotoHero"
import OpenHiggsfieldStudio from "../components/OpenHiggsfieldStudio"
import VoiceStudioNarrator from "../components/VoiceStudioNarrator"
import OpenSeoWorkspace from "../components/OpenSeoWorkspace"

export const metadata = {
  title: "AI Creative & Voice Studio | CHRISCO Digital Academy",
  description:
    "Interactive AI Image & Video Prompt Studio, Audio Narrator, and Search Visibility Lab at CHRISCO Digital Academy.",
}

export default function StudioPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      <Navbar />
      <PhotoHero
        image="/images/workspace.jpg"
        eyebrow="CHRISCO Youth Aflame Digital Academy · Practical AI Practice Lab"
        title="AI Creative, Voice & Search Studio"
        lead="Practice image and video prompt engineering, multi-language audio narration, and search visibility audits inside your browser."
      />
      <section style={{ padding: "56px 0 88px", background: "#FFFFFF" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <OpenHiggsfieldStudio />
          <VoiceStudioNarrator title="Audio Script Narration, Paste-and-Split & Voice Dictation" />
          <OpenSeoWorkspace />
        </div>
      </section>
      <Footer />
      <Chatbot />
    </main>
  )
}
