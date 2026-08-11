"use client"
import { useState } from "react"
import emailjs from "@emailjs/browser"
import Icon from "./components/Icon"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

const menuOptions = [
  { number: "1", label: "View Courses" },
  { number: "2", label: "Pricing" },
  { number: "3", label: "Enroll Now" },
  { number: "4", label: "About Founder" },
  { number: "5", label: "Location & Contact" },
  { number: "6", label: "Certificates" },
  { number: "7", label: "Online Classes" },
  { number: "8", label: "Send us a Message" },
]

const responses = [
  { keywords: ["1", "courses", "course", "learn", "study", "offer"], reply: "We offer 11 practical courses across 6 tracks:\nDesign · Coding · Marketing\nWriting · Video · Career\n\nType a topic like \"python\" or \"freelancing\" to learn more!" },
  { keywords: ["graphic", "design", "canva", "adobe"], reply: "Our Graphic Design track covers branding, posters, logos and visual identity using Canva and Adobe tools. Perfect for beginners!" },
  { keywords: ["web", "website", "development", "html", "css", "javascript", "react", "next"], reply: "Our Web Development skills teach HTML, CSS, JavaScript and React — and we have a Python course and an SWE & LLM Mastery course for future developers!" },
  { keywords: ["social media", "marketing", "instagram", "facebook", "tiktok"], reply: "Our Social Media Marketing course teaches you how to grow brands, create content strategies and manage pages professionally!" },
  { keywords: ["video", "editing", "youtube", "reels", "film"], reply: "Our Video Editing and YouTube Automation courses cover cinematic edits, channel growth and automation — very in-demand skills!" },
  { keywords: ["python", "coding", "programming", "code"], reply: "Our Python Programming course teaches coding fundamentals, and SWE & LLM Mastery takes you into AI-powered app development!" },
  { keywords: ["ai", "artificial intelligence", "chatgpt", "tools"], reply: "Our SWE & LLM Mastery course teaches you to build AI-powered apps and use tools like ChatGPT to boost creativity and productivity!" },
  { keywords: ["2", "price", "cost", "fee", "how much", "payment", "pay"], reply: "Our courses are very affordable and accessible to all youth. Contact us for current pricing:\nEmail: shambetz@gmail.com\nPhone: +254112272061" },
  { keywords: ["3", "enroll", "join", "register", "sign up"], reply: "To enroll, open the Courses page and pick a course — or contact us directly!\nEmail: shambetz@gmail.com\nPhone: +254112272061\n\nOr type 8 to send us a message right here!" },
  { keywords: ["4", "wambete", "benjamin", "founder", "instructor", "teacher", "who"], reply: "Wambete Benjamin is our founder and lead instructor — a CS Graduate with expertise in graphic design, web development, video editing, animations, social media management and AI!" },
  { keywords: ["5", "contact", "reach", "email", "phone", "whatsapp", "location", "where", "nairobi"], reply: "Reach us here:\nEmail: shambetz@gmail.com\nPhone: +254112272061 (WhatsApp)\nLocation: Nairobi, Kenya" },
  { keywords: ["6", "certificate", "certification", "qualify"], reply: "Yes! You receive a certificate upon completing any course. Practical-skills based and recognized!" },
  { keywords: ["7", "online", "remote", "zoom", "virtual"], reply: "Yes! We offer both online and in-person classes. Learn from anywhere in Kenya and beyond!" },
  { keywords: ["hello", "hi", "hey", "hujambo", "start", "menu"], reply: "SHOW_MENU" },
  { keywords: ["bye", "goodbye", "thank you", "thanks", "asante"], reply: "Thank you for chatting! Feel free to reach out anytime. We look forward to empowering you digitally." },
]

function getReply(input) {
  const lower = input.toLowerCase()
  for (const item of responses) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.reply
    }
  }
  return "I'm not sure about that! Here's what I can help with — type a number:\n\n1. Courses\n2. Pricing\n3. Enroll\n4. About Founder\n5. Contact\n6. Certificates\n7. Online Classes\n8. Send a Message"
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Welcome to CHRISCO Digital Academy!\n\nI'm here to help. Choose an option below or type your question!" },
  ])
  const [input, setInput] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function sendMessage(text) {
    const userInput = text || input
    if (!userInput.trim()) return

    if (userInput === "8" || userInput.toLowerCase().includes("send") || userInput.toLowerCase().includes("message")) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: "Sure! Fill in the form below and your message will be sent directly to Wambete!" },
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
        { role: "assistant", content: "Hello! Here's what I can help you with — type a number or click an option:" },
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
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: form.message,
      }, PUBLIC_KEY)
      setSent(true)
      setShowForm(false)
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `Message sent successfully! Wambete will get back to you soon. Thank you, ${form.name}!`,
      }])
      setForm({ name: "", email: "", phone: "", message: "" })
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, the message failed to send. Please email us directly at shambetz@gmail.com",
      }])
    }
    setSending(false)
  }

  function handleKey(e) {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <>
      {/* Floating button */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 500, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
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
            <Icon name="sparkles" size={14} style={{ color: "var(--green)" }} /> Ask me anything!
          </span>
        )}
        <button onClick={() => setOpen(!open)} className="chat-btn" aria-label={open ? "Close chat" : "Open chat"}>
          <Icon name={open ? "x" : "chat"} size={26} strokeWidth={2} />
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: "fixed",
            bottom: 96,
            right: 24,
            zIndex: 500,
            width: "min(380px, calc(100vw - 48px))",
          }}
        >
          {/* Header */}
          <div style={{ background: "var(--navy)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
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
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 14 }}>CHRISCO Assistant</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>Online — replies instantly</div>
            </div>
            <span style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          </div>

          {/* Messages */}
          <div style={{ height: 280, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, background: "#F4F6F4" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div className={`msg-bubble ${msg.role === "user" ? "msg-user" : "msg-assistant"}`}>{msg.content}</div>
              </div>
            ))}
          </div>

          {/* Menu chips */}
          {!showForm && (
            <div style={{ padding: "12px 14px", display: "flex", gap: 8, flexWrap: "wrap", background: "#fff", borderTop: "1px solid var(--line)" }}>
              {menuOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(opt.number)}
                  className="pill pill-soft pill-sm"
                  style={{ cursor: "pointer", fontSize: 11.5 }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Contact form */}
          {showForm && (
            <div style={{ padding: "14px 16px", background: "#fff", borderTop: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--ink)", fontSize: 13.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="mail" size={15} style={{ color: "var(--green-deep)" }} /> Send Wambete a message
              </div>
              <input className="input" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }} />
              <input className="input" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }} />
              <input className="input" placeholder="Your Phone (WhatsApp)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }} />
              <textarea className="input" rows={3} placeholder="Your Message *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ marginBottom: 10, padding: "10px 14px", fontSize: 13, resize: "none" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSend} disabled={sending} className="btn btn-green btn-sm" style={{ flex: 1, cursor: "pointer", fontSize: 13 }}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
                <button onClick={() => setShowForm(false)} className="btn btn-outline btn-sm" style={{ cursor: "pointer", fontSize: 13 }}>
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          {!showForm && (
            <div style={{ padding: "12px 14px", display: "flex", gap: 8, background: "#fff", borderTop: "1px solid var(--line)" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a number or your question..."
                className="input"
                style={{ padding: "11px 14px", fontSize: 13, margin: 0 }}
              />
              <button onClick={() => sendMessage()} className="btn btn-navy btn-sm" aria-label="Send message" style={{ cursor: "pointer", fontSize: 13 }}>
                <Icon name="send" size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
