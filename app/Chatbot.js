"use client"
import { useState, useMemo } from "react"
import Icon from "./components/Icon"
import { org } from "./data/org"
import { submitAcademyIntake } from "./lib/intakeClient"

const menuOptions = [
  { number: "1", label: "View Courses" },
  { number: "2", label: "Pricing" },
  { number: "3", label: "Enroll Now" },
  { number: "4", label: "About Our Tutor" },
  { number: "5", label: "Contact Us" },
  { number: "6", label: "Teens AI Bootcamp" },
  { number: "7", label: "Online Classes" },
  { number: "8", label: "Send us a Message" },
  { number: "9", label: "Merchandise" },
]

const HELP_CENTER_ARTICLES = [
  {
    id: "hc-teens-bootcamp",
    category: "Teens AI Bootcamp",
    title: "What is the Teens AI & Projects Bootcamp (Ages 13+)?",
    body: "A 6-week holiday program running from 3 Nov to 11 Dec 2026 for teens aged 13+. Participants learn teen-friendly AI tools, smart prompts, and hands-on creative builds through online classes plus physical & team activities (dates and venues communicated to registered families).",
  },
  {
    id: "hc-devices",
    category: "Devices & Media",
    title: "What device is needed for Online & Physical classes?",
    body: "A laptop, tablet, or smartphone is required for online classes. During physical and team activity sessions, our trainers provide the specialized equipment.",
  },
  {
    id: "hc-courses",
    category: "19 Digital Courses",
    title: "How do I enroll in the 19 Digital Skills Courses?",
    body: "Visit /courses, select any of the 19 practical tracks across Business, Design, Coding, Marketing, Writing, Video, and AI, and submit your application. Your Student Dashboard (/dashboard) unlocks all course handbooks and interactive modules.",
  },
  {
    id: "hc-ebooks",
    category: "Library & Handbooks",
    title: "How do I download the Christian Books & Course Handbooks?",
    body: "Create an account at /sign-up or sign in at /sign-in, accept the Privacy & Data Protection policy, and download any of the 20 PDF books from /library or your Student Dashboard (/dashboard).",
  },
  {
    id: "hc-merch",
    category: "PURSUE Shop",
    title: "How do I order PURSUE T-Shirts, Hoodies & Apparel?",
    body: "Open /shop, browse the 29 original studio designs (codes TS-01 through JR-01), pick your size (S to XXL) and quantity, and click Order on WhatsApp (+254 112 272 061) or send your order tray.",
  },
]

const MERCH_REPLY =
  "We have 29 merchandise designs across three collections: PURSUE, Faith affirmations, and Scripture statements built on 1 Samuel 30:8.\n\nEvery design has a code, like TS-07 or HD-04. Open the Shop page, pick a code, size and quantity, then message us on WhatsApp with that code and we confirm the rest.\n\nShop page: /shop"

const responses = [
  {
    keywords: ["6", "teen", "teens", "bootcamp", "holiday", "nov", "dec", "ages 13"],
    reply:
      "TEENS AI & PROJECTS BOOTCAMP (Ages 13+):\n• Dates: 3 Nov – 11 Dec 2026 (6 Weeks)\n• Highlights: Teen-friendly AI tools, prompts & hands-on creative builds\n• Format: Online Classes + Physical & Team Activities (trainers' gear provided for physical sessions)\n• Register via the official Google Form link on the poster or reach us on WhatsApp at +254 112 272 061 / chriscoyouthaflame2025@gmail.com!",
  },
  {
    keywords: ["1", "courses", "course", "learn", "study", "offer"],
    reply:
      "We offer 19 practical courses across 7 tracks:\nBusiness, Design, Coding, Marketing\nWriting, Video, Career\n\nPlus our 6-Week Teens AI & Projects Bootcamp (Ages 13+). Type a topic like \"python\", \"teens\" or \"branding\" to learn more!",
  },
  {
    keywords: ["graphic", "design", "canva", "adobe"],
    reply:
      "Our Graphic Design track covers branding, posters, logos and visual identity using Canva and Adobe tools. Perfect for beginners!",
  },
  {
    keywords: ["web", "website", "development", "html", "css", "javascript", "react", "next"],
    reply:
      "Our Web Development skills teach HTML, CSS, JavaScript and React, and we have a Python course and an SWE & LLM Mastery course for future developers!",
  },
  {
    keywords: ["social media", "marketing", "instagram", "facebook", "tiktok"],
    reply:
      "Our Social Media Marketing course teaches you how to grow brands, create content strategies and manage pages professionally!",
  },
  {
    keywords: ["video", "editing", "youtube", "reels", "film"],
    reply:
      "Our Video Editing and YouTube Automation courses cover cinematic edits, channel growth and automation, very in-demand skills!",
  },
  {
    keywords: ["python", "coding", "programming", "code"],
    reply:
      "Our Python Programming course teaches coding fundamentals, and SWE & LLM Mastery takes you into AI-powered app development!",
  },
  {
    keywords: ["ai", "artificial intelligence", "chatgpt", "tools", "prompt"],
    reply:
      "We offer SWE & LLM Mastery, AI Literacy, AI Video Storytelling, and the 6-Week Teens AI & Projects Bootcamp (Ages 13+ | 3 Nov – 11 Dec 2026) — plus our interactive AI Prompt & Voice Studio at /studio!",
  },
  {
    keywords: ["9", "merch", "merchandise", "shop", "tshirt", "t-shirt", "tee", "hoodie", "polo", "cap", "mug", "tote", "journal", "design code", "buy merch"],
    reply: MERCH_REPLY,
  },
  {
    keywords: ["2", "price", "cost", "fee", "how much", "payment", "pay"],
    reply:
      "Our courses are very affordable and accessible to all youth. Contact us for current cohort details:\nWhatsApp: +254 112 272 061\nEmail: chriscoyouthaflame2025@gmail.com",
  },
  {
    keywords: ["3", "enroll", "join", "register", "sign up"],
    reply:
      "To enroll in our 19 courses, open /courses and select your track! For the Teens AI & Projects Bootcamp (3 Nov – 11 Dec 2026), use the Google Form link on the poster or contact us at +254 112 272 061 / chriscoyouthaflame2025@gmail.com.",
  },
  {
    keywords: ["4", "founder", "tutor", "instructor", "teacher", "who", "team"],
    reply:
      "Our courses are led by the CHRISCO Youth Aflame tutor team, working in design, web development, video editing, animation, social media and AI. CHRISCO Digital Academy is the learning platform of CHRISCO Youth Aflame, operating under CHRISCO Fellowship of Churches International.",
  },
  {
    keywords: ["5", "contact", "reach", "email", "phone", "whatsapp", "location", "where"],
    reply:
      "Reach us here:\nCall / WhatsApp: +254 112 272 061\nEmail: chriscoyouthaflame2025@gmail.com\nWe reply fastest on WhatsApp and email.",
  },
  {
    keywords: ["7", "online", "remote", "zoom", "virtual"],
    reply:
      "Yes! Classes are taught online, with physical & team activities scheduled and communicated to participants. Learn from anywhere!",
  },
  { keywords: ["hello", "hi", "hey", "hujambo", "start", "menu"], reply: "SHOW_MENU" },
  {
    keywords: ["bye", "goodbye", "thank you", "thanks", "asante"],
    reply:
      "Thank you for chatting! Feel free to reach out anytime. We look forward to empowering you digitally.",
  },
]

function getReply(input) {
  const lower = input.toLowerCase()
  for (const item of responses) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.reply
    }
  }
  return "I'm Captain AI! Here's what I can help with — type a number:\n\n1. Courses\n2. Pricing\n3. Enroll\n4. About Our Tutor\n5. Contact\n6. Teens AI Bootcamp\n7. Online Classes\n8. Send a Message\n9. Merchandise"
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("chat") // chat | help | channels
  const [helpQuery, setHelpQuery] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Welcome to CHRISCO Digital Academy!\n\nI'm Captain AI — your instant assistant. Choose an option below, search our Help Center tab, or type your question!",
    },
  ])
  const [input, setInput] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)

  const filteredArticles = useMemo(() => {
    const q = helpQuery.trim().toLowerCase()
    if (!q) return HELP_CENTER_ARTICLES
    return HELP_CENTER_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    )
  }, [helpQuery])

  function sendMessage(text) {
    const userInput = text || input
    if (!userInput.trim()) return

    if (
      userInput === "8" ||
      userInput.toLowerCase().includes("send") ||
      userInput.toLowerCase().includes("message")
    ) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userInput },
        {
          role: "assistant",
          content:
            "Sure! Fill in the form below and your message will be routed directly to the CHRISCO Youth Aflame support desk!",
        },
      ])
      setShowForm(true)
      setInput("")
      return
    }

    const reply = getReply(userInput)

    if (reply === "SHOW_MENU") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userInput },
        {
          role: "assistant",
          content: "Hello! Here's what I can help you with, type a number or click an option:",
        },
      ])
      setInput("")
      return
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userInput },
      { role: "assistant", content: reply },
    ])
    setInput("")
  }

  async function handleSend() {
    if (!form.name || !form.message) return
    setSending(true)
    try {
      await submitAcademyIntake({
        action: "contact",
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      })
      setShowForm(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Message sent to our support desk! Our team will get back to you soon, ${form.name}.`,
        },
      ])
      setForm({ name: "", email: "", phone: "", message: "" })
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, the message failed to send. Please email us directly at ${org.email}`,
        },
      ])
    }
    setSending(false)
  }

  function handleKey(e) {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <>
      {/* Floating button */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        {!open && (
          <span
            onClick={() => setOpen(true)}
            style={{
              background: "var(--navy)",
              color: "#fff",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 12.5,
              padding: "10px 18px",
              borderRadius: 999,
              cursor: "pointer",
              boxShadow: "var(--shadow-md)",
              border: "1px solid rgba(255,255,255,0.14)",
              animation: "floatY 4s ease-in-out infinite",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Icon name="chat" size={14} style={{ color: "var(--green)" }} /> Ask Captain AI!
          </span>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="chat-btn"
          aria-label={open ? "Close chat" : "Open chat"}
        >
          <Icon name={open ? "x" : "chat"} size={26} strokeWidth={2} />
        </button>
      </div>

      {/* Chatwoot-style Omnichannel Support Window */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: "fixed",
            bottom: 96,
            right: 24,
            zIndex: 500,
            width: "min(395px, calc(100vw - 48px))",
          }}
        >
          {/* Header */}
          <div style={{ background: "var(--navy)", padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--green)",
                  color: "var(--navy)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="robot" size={22} strokeWidth={2} />
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    color: "#fff",
                    fontSize: 14,
                  }}
                >
                  CHRISCO Support Desk · Captain AI
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}>
                  Omnichannel Live Chat &amp; Help Center
                </div>
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--green)",
                  display: "inline-block",
                }}
              />
            </div>

            {/* 3-Tab Switcher (Captain AI | Help Center | Channels) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 6,
                background: "rgba(255,255,255,0.08)",
                padding: 4,
                borderRadius: 10,
              }}
            >
              {[
                { id: "chat", label: "Captain AI" },
                { id: "help", label: "Help Center" },
                { id: "channels", label: "Direct Desk" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    background: activeTab === t.id ? "var(--green)" : "transparent",
                    color: activeTab === t.id ? "var(--navy)" : "#FFFFFF",
                    border: "none",
                    borderRadius: 7,
                    padding: "6px 8px",
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "chat" && (
            <>
              {/* Messages */}
              <div
                style={{
                  height: 265,
                  overflowY: "auto",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: "#F4F6F4",
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      className={`msg-bubble ${
                        msg.role === "user" ? "msg-user" : "msg-assistant"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Menu chips */}
              {!showForm && (
                <div
                  style={{
                    padding: "10px 14px",
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    background: "#fff",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  {menuOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(opt.number)}
                      className="pill pill-soft pill-sm"
                      style={{ cursor: "pointer", fontSize: 11 }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Contact form */}
              {showForm && (
                <div
                  style={{
                    padding: "14px 16px",
                    background: "#fff",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 800,
                      color: "var(--ink)",
                      fontSize: 13.5,
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Icon name="mail" size={15} style={{ color: "var(--green-deep)" }} /> Send the
                    CHRISCO team a message
                  </div>
                  <input
                    className="input"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }}
                  />
                  <input
                    className="input"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }}
                  />
                  <input
                    className="input"
                    placeholder="Your Phone (WhatsApp)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }}
                  />
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Your Message *"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      marginBottom: 10,
                      padding: "10px 14px",
                      fontSize: 13,
                      resize: "none",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={handleSend}
                      disabled={sending}
                      className="btn btn-green btn-sm"
                      style={{ flex: 1, cursor: "pointer", fontSize: 13 }}
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="btn btn-outline btn-sm"
                      style={{ cursor: "pointer", fontSize: 13 }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Input */}
              {!showForm && (
                <div
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    gap: 8,
                    background: "#fff",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a number or your question..."
                    className="input"
                    style={{ padding: "11px 14px", fontSize: 13, margin: 0 }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    className="btn btn-navy btn-sm"
                    aria-label="Send message"
                    style={{ cursor: "pointer", fontSize: 13 }}
                  >
                    <Icon name="send" size={15} />
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "help" && (
            <div style={{ padding: 16, background: "#F8FAFC", maxHeight: 370, overflowY: "auto" }}>
              <input
                type="search"
                value={helpQuery}
                onChange={(e) => setHelpQuery(e.target.value)}
                placeholder="Search Help Center articles..."
                className="input"
                style={{ padding: "9px 12px", fontSize: 12.5, marginBottom: 12 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#1D4ED8",
                        background: "#EFF6FF",
                        padding: "2px 8px",
                        borderRadius: 999,
                        marginBottom: 4,
                      }}
                    >
                      {art.category}
                    </span>
                    <div style={{ fontWeight: 800, fontSize: 12.5, color: "#0F172A", marginBottom: 4 }}>
                      {art.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                      {art.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "channels" && (
            <div style={{ padding: 18, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.5 }}>
                Connect directly with the CHRISCO Youth Aflame support &amp; admissions desk across our omnichannel inbox:
              </div>
              <a
                href="https://wa.me/254112272061?text=Hello%20CHRISCO%20Youth%20Aflame%20Digital%20Academy!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-green btn-sm"
                style={{ textDecoration: "none", justifyContent: "center" }}
              >
                WhatsApp Support (+254 112 272 061)
              </a>
              <a
                href={`mailto:${org.email}`}
                className="btn btn-navy btn-sm"
                style={{ textDecoration: "none", justifyContent: "center" }}
              >
                Email: {org.email}
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("chat")
                  setShowForm(true)
                }}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: "center", cursor: "pointer" }}
              >
                Open Support Ticket in Chat
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
