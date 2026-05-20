"use client"
import { useState } from "react"
import emailjs from "@emailjs/browser"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

const menuOptions = [
  { number: "1", label: "📚 View Courses" },
  { number: "2", label: "💰 Pricing" },
  { number: "3", label: "📝 Enroll Now" },
  { number: "4", label: "👨‍💻 About Founder" },
  { number: "5", label: "📍 Location & Contact" },
  { number: "6", label: "🏆 Certificates" },
  { number: "7", label: "💻 Online Classes" },
  { number: "8", label: "✉️ Send us a Message" },
]

const responses = [
  { keywords: ["1", "courses", "course", "learn", "study", "offer"], reply: "🎓 We offer 6 courses:\n1. 🎨 Graphic Design\n2. 💻 Web Development\n3. 📱 Social Media Marketing\n4. 🎬 Video Editing\n5. 🐍 Python Coding\n6. 🤖 AI Tools Mastery\n\nType a course name to learn more!" },
  { keywords: ["graphic", "design", "canva", "adobe"], reply: "🎨 Our Graphic Design course covers branding, posters, logos and visual identity using Canva and Adobe tools. Perfect for beginners!" },
  { keywords: ["web", "website", "development", "html", "css", "javascript", "react", "next"], reply: "💻 Our Web Development course teaches HTML, CSS, JavaScript and React.js. You will build real websites from scratch!" },
  { keywords: ["social media", "marketing", "instagram", "facebook", "tiktok"], reply: "📱 Our Social Media Marketing course teaches you how to grow brands, create content strategies and manage pages professionally!" },
  { keywords: ["video", "editing", "youtube", "reels", "film"], reply: "🎬 Our Video Editing course covers cinematic editing for YouTube, Instagram Reels and events. Very in-demand skill!" },
  { keywords: ["python", "coding", "programming", "code"], reply: "🐍 Our Python Coding course teaches programming fundamentals. Great for anyone wanting to become a developer!" },
  { keywords: ["ai", "artificial intelligence", "chatgpt", "tools"], reply: "🤖 Our AI Tools Mastery course teaches you how to use AI tools like ChatGPT to boost your creativity and productivity!" },
  { keywords: ["2", "price", "cost", "fee", "how much", "payment", "pay"], reply: "💰 Our courses are very affordable and accessible to all youth. Contact us for current pricing:\n📧 shambetz@gmail.com\n📞 +254112272061" },
  { keywords: ["3", "enroll", "join", "register", "sign up"], reply: "🚀 To enroll contact us directly!\n📧 shambetz@gmail.com\n📞 +254112272061\n\nOr type 8 to send us a message right here!" },
  { keywords: ["4", "wambete", "benjamin", "founder", "instructor", "teacher", "who"], reply: "👨‍💻 Wambete Benjamin is our founder and lead instructor — a CS Graduate with expertise in graphic design, web development, video editing, animations, social media management and AI!" },
  { keywords: ["5", "contact", "reach", "email", "phone", "whatsapp", "location", "where", "nairobi"], reply: "📬 Reach us here:\n📧 shambetz@gmail.com\n📞 +254112272061 (WhatsApp)\n📍 Nairobi, Kenya" },
  { keywords: ["6", "certificate", "certification", "qualify"], reply: "🏆 Yes! You receive a certificate upon completing any course. Practical-skills based and recognized!" },
  { keywords: ["7", "online", "remote", "zoom", "virtual"], reply: "💻 Yes! We offer both online and in-person classes. Learn from anywhere in Kenya and beyond!" },
  { keywords: ["hello", "hi", "hey", "hujambo", "start", "menu"], reply: "SHOW_MENU" },
  { keywords: ["bye", "goodbye", "thank you", "thanks", "asante"], reply: "😊 Thank you for chatting! Feel free to reach out anytime. We look forward to empowering you digitally! 🔥🇰🇪" },
]

function getReply(input) {
  const lower = input.toLowerCase()
  for (const item of responses) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply
    }
  }
  return "🤔 I'm not sure about that! Here's what I can help with — type a number:\n\n1️⃣ Courses\n2️⃣ Pricing\n3️⃣ Enroll\n4️⃣ About Founder\n5️⃣ Contact\n6️⃣ Certificates\n7️⃣ Online Classes\n8️⃣ Send a Message"
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! Welcome to CHRISCO Digital Academy!\n\nI'm here to help. Choose an option below or type your question!" },
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
      setMessages(prev => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: "✉️ Sure! Fill in the form below and your message will be sent directly to Wambete!" }
      ])
      setShowForm(true)
      setInput("")
      return
    }

    const reply = getReply(userInput)

    if (reply === "SHOW_MENU") {
      setMessages(prev => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: "😊 Hello! Here's what I can help you with — type a number or click an option:" }
      ])
      setInput("")
      return
    }

    setMessages(prev => [
      ...prev,
      { role: "user", content: userInput },
      { role: "assistant", content: reply }
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
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `✅ Message sent successfully! Wambete will get back to you soon. Thank you ${form.name}! 🙏`
      }])
      setForm({ name: "", email: "", phone: "", message: "" })
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Sorry, message failed to send. Please email us directly at shambetz@gmail.com"
      }])
    }
    setSending(false)
  }

  function handleKey(e) {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.6); }
          50% { box-shadow: 0 0 40px rgba(245,158,11,1); }
        }
        @keyframes tagPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .chat-window { animation: slideUp 0.3s ease forwards; }
        .chat-btn { animation: glow 2s ease-in-out infinite; }
        .ask-tag { animation: tagPulse 2s ease-in-out infinite; }
        .msg-bubble { max-width: 85%; word-wrap: break-word; white-space: pre-line; }
        .input-field {
          width: 100%;
          border: 2px solid #e9d5ff;
          border-radius: 10px;
          padding: 8px 12px;
          outline: none;
          font-size: 13px;
          margin-bottom: 8px;
          transition: border 0.3s;
        }
        .input-field:focus { border-color: #7e22ce; }
      `}</style>

      {/* Floating Button + Tag */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <div
          className="ask-tag bg-yellow-400 text-purple-950 font-black text-xs px-4 py-2 rounded-full shadow-lg cursor-pointer"
          style={{boxShadow:"0 0 20px rgba(245,158,11,0.6)"}}
          onClick={() => setOpen(!open)}
        >
          ✨ Ask me anything!
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="chat-btn w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl hover:bg-yellow-300 transition"
        >
          {open ? "✕" : "🤖"}
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chat-window fixed bottom-32 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950 to-indigo-950 text-white px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
              <p className="font-bold text-sm">CHRISCO Assistant</p>
              <p className="text-purple-300 text-xs">✨ Ask me about anything!</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`msg-bubble px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-purple-950 text-white rounded-br-none"
                    : "bg-white text-gray-700 border border-purple-100 rounded-bl-none shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Menu Options */}
          {!showForm && (
            <div className="px-4 py-2 flex gap-2 flex-wrap bg-gray-50 border-t border-purple-50">
              {menuOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(opt.number)}
                  className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full hover:bg-purple-200 transition font-semibold mb-1"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Contact Form */}
          {showForm && (
            <div className="px-4 py-3 bg-white border-t border-purple-100">
              <p className="text-purple-950 font-bold text-sm mb-2">✉️ Send Wambete a Message</p>
              <input className="input-field" placeholder="Your Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input className="input-field" placeholder="Your Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <input className="input-field" placeholder="Your Phone (WhatsApp)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <textarea className="input-field" rows={3} placeholder="Your Message *" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
              <div className="flex gap-2">
                <button onClick={handleSend} disabled={sending} className="flex-1 bg-purple-950 text-yellow-400 font-bold py-2 rounded-xl hover:bg-purple-800 transition text-sm">
                  {sending ? "Sending..." : "Send Message 🚀"}
                </button>
                <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl hover:bg-gray-300 transition text-sm">
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          {!showForm && (
            <div className="p-4 border-t border-purple-100 flex gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a number or your question..."
                className="flex-1 border border-purple-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-700"
              />
              <button
                onClick={() => sendMessage()}
                className="bg-purple-950 text-yellow-400 font-bold px-4 py-2 rounded-xl hover:bg-purple-800 transition text-sm"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}