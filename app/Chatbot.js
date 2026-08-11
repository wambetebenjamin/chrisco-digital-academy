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
  { number: "5", label: "Contact" },
  { number: "6", label: "Certificates" },
  { number: "7", label: "Online Classes" },
  { number: "8", label: "Send Message" },
]

const responses = [
  { keywords: ["1", "courses", "course", "learn", "study", "offer"], reply: "We offer 11 practical courses across 6 tracks:\nDesign, Coding, Marketing,\nWriting, Video, Career.\n\nType a topic like \"python\" or \"freelancing\" to learn more!" },
  { keywords: ["graphic", "design", "canva", "adobe"], reply: "Our Graphic Design track covers branding, posters, logos and visual identity using Canva and Adobe tools. Perfect for total beginners." },
  { keywords: ["web", "website", "development", "html", "css", "javascript", "react", "next"], reply: "Our Web Development track teaches HTML, CSS, JavaScript and React. We also have a Python course and an SWE & LLM Mastery course for future developers." },
  { keywords: ["social media", "marketing", "instagram", "facebook", "tiktok"], reply: "Our Social Media Marketing course teaches you how to grow brands, create content strategies and manage pages like a pro." },
  { keywords: ["video", "editing", "youtube", "reels", "film"], reply: "Our Video Editing and YouTube Automation courses cover cinematic edits, channel growth and automation. These are highly in demand skills." },
  { keywords: ["python", "coding", "programming", "code"], reply: "Our Python Programming course teaches coding fundamentals. SWE & LLM Mastery takes you into building AI powered apps." },
  { keywords: ["ai", "artificial intelligence", "chatgpt", "tools"], reply: "Our SWE & LLM Mastery course teaches you to build AI powered apps and use tools like ChatGPT to boost your creativity and productivity." },
  { keywords: ["2", "price", "cost", "fee", "how much", "payment", "pay"], reply: "Our courses are very affordable and accessible to all youth. Contact us for current pricing:\nEmail: shambetz@gmail.com\nPhone: +254112272061" },
  { keywords: ["3", "enroll", "join", "register", "sign up"], reply: "To enroll, open the Courses page and pick a course, or contact us directly.\nEmail: shambetz@gmail.com\nPhone: +254112272061\n\nYou can also type 8 to send us a message right here." },
  { keywords: ["4", "wambete", "benjamin", "founder", "instructor", "teacher", "who"], reply: "Wambete Benjamin is our founder and lead instructor. He is a CS Graduate skilled in graphic design, web development, video editing, animation, social media and AI." },
  { keywords: ["5", "contact", "reach", "email", "phone", "whatsapp", "location", "where", "nairobi"], reply: "Reach us here:\nEmail: shambetz@gmail.com\nPhone: +254112272061 (WhatsApp)\nLocation: Nairobi, Kenya" },
  { keywords: ["6", "certificate", "certification", "qualify"], reply: "Yes. You receive a certificate upon completing any course. It is practical skills based and recognized." },
  { keywords: ["7", "online", "remote", "zoom", "virtual"], reply: "Yes. We offer both online and in person classes. Learn from anywhere in Kenya and beyond." },
  { keywords: ["study buddy", "buddy", "community", "friends"], reply: "We have Study Buddies automated peer matching and Group Study Rooms. Head to the Community page to join a squad." },
  { keywords: ["streak", "xp", "badge", "leaderboard", "gamif"], reply: "Earn XP and keep a daily streak as you complete lessons. Climb the leaderboard and unlock badges every week." },
  { keywords: ["hello", "hi", "hey", "hujambo", "start", "menu"], reply: "SHOW_MENU" },
  { keywords: ["bye", "goodbye", "thank you", "thanks", "asante"], reply: "Thank you for chatting. Feel free to reach out anytime. Karibu sana." },
]

function getReply(input) {
  const lower = input.toLowerCase()
  for (const item of responses) {
    if (item.keywords.some((k) => lower.includes(k))) return item.reply
  }
  return "I am not sure about that. Here is what I can help with. Type a number:\n\n1. Courses\n2. Pricing\n3. Enroll\n4. About Founder\n5. Contact\n6. Certificates\n7. Online Classes\n8. Send a Message"
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi. Welcome to CHRISCO Digital Academy.\n\nI am your AI study assistant. Pick an option below or type your question." },
  ])
  const [input, setInput] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)

  function sendMessage(text) {
    const userInput = text || input
    if (!userInput.trim()) return

    if (userInput === "8" || userInput.toLowerCase().includes("send") || userInput.toLowerCase().includes("message")) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: "Sure. Fill the form below and your message will go straight to Wambete." },
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
        { role: "assistant", content: "Hey. Here is what I can help with. Type a number or tap an option:" },
      ])
      setInput("")
      return
    }

    setMessages((prev) => [...prev, { role: "user", content: userInput }, { role: "assistant", content: reply }])
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
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `Message sent. Wambete will get back to you soon. Asante, ${form.name}.`,
      }])
      setForm({ name: "", email: "", phone: "", message: "" })
      setShowForm(false)
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, the message failed to send. Email us directly at shambetz@gmail.com",
      }])
    }
    setSending(false)
  }

  function handleKey(e) { if (e.key === "Enter") sendMessage() }

  return (
    <>
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 500, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
        {!open && (
          <span
            onClick={() => setOpen(true)}
            style={{
              background: "var(--lime)",
              color: "var(--ink)",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 12.5,
              padding: "10px 16px",
              borderRadius: 14,
              cursor: "pointer",
              border: "3px solid var(--ink)",
              boxShadow: "5px 5px 0 0 var(--ink)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              animation: "floatY 4s ease-in-out infinite",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Icon name="sparkles" size={14} /> AI Study Help
          </span>
        )}
        <button onClick={() => setOpen(!open)} className="chat-btn" aria-label={open ? "Close chat" : "Open chat"}>
          <Icon name={open ? "x" : "robot"} size={26} strokeWidth={2.2} />
        </button>
      </div>

      {open && (
        <div
          className="chat-window"
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            zIndex: 500,
            width: "min(380px, calc(100vw - 24px))",
          }}
        >
          <div style={{ background: "var(--purple)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "3px solid var(--ink)" }}>
            <span style={{
              width: 44, height: 44, borderRadius: 12, background: "var(--lime)",
              border: "2.5px solid var(--ink)", color: "var(--ink)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon name="robot" size={24} strokeWidth={2} />
            </span>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 14 }}>CHRISCO AI Study Buddy</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>Online, replies instantly</div>
            </div>
            <span style={{ marginLeft: "auto", width: 12, height: 12, borderRadius: "50%", background: "var(--lime)", border: "2px solid #fff", display: "inline-block" }} />
          </div>

          <div style={{ height: 300, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, background: "var(--paper)" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div className={`msg-bubble ${msg.role === "user" ? "msg-user" : "msg-assistant"}`}>{msg.content}</div>
              </div>
            ))}
          </div>

          {!showForm && (
            <div style={{ padding: "10px 12px", display: "flex", gap: 6, flexWrap: "wrap", background: "#fff", borderTop: "2.5px solid var(--ink)" }}>
              {menuOptions.map((opt) => (
                <button key={opt.number} onClick={() => sendMessage(opt.number)} className="pill pill-sm" style={{ cursor: "pointer", fontSize: 11 }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {showForm && (
            <div style={{ padding: "14px 16px", background: "#fff", borderTop: "2.5px solid var(--ink)" }}>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--ink)", fontSize: 13.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="mail" size={15} style={{ color: "var(--purple)" }} /> Send Wambete a message
              </div>
              <input className="input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }} />
              <input className="input" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }} />
              <input className="input" placeholder="Your Phone (WhatsApp)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ marginBottom: 8, padding: "10px 14px", fontSize: 13 }} />
              <textarea className="input" rows={3} placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ marginBottom: 10, padding: "10px 14px", fontSize: 13, resize: "none" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSend} disabled={sending} className="btn btn-lime btn-sm" style={{ flex: 1, cursor: "pointer", fontSize: 13 }}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
                <button onClick={() => setShowForm(false)} className="btn btn-sm" style={{ cursor: "pointer", fontSize: 13 }}>
                  Back
                </button>
              </div>
            </div>
          )}

          {!showForm && (
            <div style={{ padding: "12px", display: "flex", gap: 8, background: "#fff", borderTop: "2.5px solid var(--ink)" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a number or question..."
                className="input"
                style={{ padding: "11px 14px", fontSize: 13, margin: 0, boxShadow: "none" }}
              />
              <button onClick={() => sendMessage()} className="btn btn-purple btn-sm" aria-label="Send message" style={{ cursor: "pointer", fontSize: 13 }}>
                <Icon name="send" size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
