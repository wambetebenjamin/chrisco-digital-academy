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
    <main style={{ minHeight: "100vh", background: "#F7F6F1" }}>
      <Navbar />
      <section style={{ padding: "clamp(112px, 14vw, 144px) 0 72px" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #DCE3F0",
              borderTop: "5px solid #084EC8",
              borderRadius: 12,
              padding: "24px 26px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0B1D51",
              }}
            >
              CHRISCO YOUTH <span style={{ color: "#EE6816" }}>AFLAME</span> DIGITAL ACADEMY • HANDS-ON AI LABS
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
                lineHeight: 1.06,
                textTransform: "uppercase",
                marginTop: 10,
              }}
            >
              <span style={{ color: "#E60914" }}>CREATIVE AI,</span>{" "}
              <span style={{ color: "#084EC8" }}>VOICE NARRATION &amp;</span>{" "}
              <span style={{ color: "#38A128" }}>SEO STUDIO!</span>
            </h1>
            <p style={{ color: "#1E293B", maxWidth: 680, marginTop: 10, fontSize: 15 }}>
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
