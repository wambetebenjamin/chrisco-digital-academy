"use client"
import { useState } from "react"
import Navbar from "../Navbar"

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cometFly {
          0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 1; }
          100% { transform: translateX(500px) translateY(500px) rotate(45deg); opacity: 0; }
        }
        .comet {
          position: absolute;
          width: 3px;
          height: 80px;
          background: linear-gradient(to bottom, #f59e0b, transparent);
          border-radius: 50%;
          animation: cometFly linear infinite;
        }
        .float { animation: float 3s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(109,40,217,0.15); }
        .glow { box-shadow: 0 0 30px rgba(245,158,11,0.3); }
        .input-field {
          width: 100%;
          border: 2px solid #e9d5ff;
          border-radius: 12px;
          padding: 12px 16px;
          outline: none;
          transition: border 0.3s;
          font-size: 16px;
        }
        .input-field:focus { border-color: #7e22ce; }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white py-24 px-6 text-center overflow-hidden">
        <div className="comet" style={{top:"10%",left:"20%",animationDuration:"3s"}}></div>
        <div className="comet" style={{top:"50%",left:"60%",animationDuration:"4s",animationDelay:"1s"}}></div>
        <div className="comet" style={{top:"20%",left:"80%",animationDuration:"2.5s",animationDelay:"2s"}}></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-700 rounded-full opacity-20 float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-400 rounded-full opacity-10 float" style={{animationDelay:"1s"}}></div>
        <div className="relative z-10">
          <h1 className="fade-up text-5xl md:text-6xl font-extrabold mb-4">
            Get In <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="fade-up text-purple-200 text-xl max-w-xl mx-auto">
            Have a question or want to enroll? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Info */}
        <div>
          <h2 className="text-3xl font-extrabold text-purple-950 mb-8">Contact Information</h2>
          {[
            { icon: "📧", label: "Email", value: "shambetz@gmail.com" },
            { icon: "📞", label: "Phone / WhatsApp", value: "+254112272061" },
            { icon: "📍", label: "Location", value: "Nairobi, Kenya" },
            { icon: "⛪", label: "Organisation", value: "CHRISCO Youth Aflame" },
          ].map((item, i) => (
            <div key={i} className="card flex items-start gap-4 p-5 border border-purple-100 rounded-2xl mb-4 shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <div>
                <p className="text-purple-700 font-bold text-sm">{item.label}</p>
                <p className="text-gray-700 font-semibold">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <p className="text-purple-950 font-bold mb-4">Connect With Us</p>
            <div className="flex gap-4">
              {["Facebook", "Instagram", "YouTube", "LinkedIn"].map((s, i) => (
                <span key={i} className="bg-purple-950 text-yellow-400 font-bold px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-purple-800 transition">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div className="text-center bg-green-50 border-2 border-green-400 rounded-2xl p-16">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-extrabold text-green-700 mb-2">Message Sent!</h3>
              <p className="text-green-600">Thank you for reaching out. We will get back to you soon.</p>
            </div>
          ) : (
            <div className="shadow-xl rounded-2xl p-8 border border-purple-100">
              <h2 className="text-3xl font-extrabold text-purple-950 mb-8">Send a Message</h2>
              <div className="mb-5">
                <label className="block text-purple-900 font-bold mb-2">Full Name</label>
                <input type="text" placeholder="Your full name" className="input-field" />
              </div>
              <div className="mb-5">
                <label className="block text-purple-900 font-bold mb-2">Email Address</label>
                <input type="email" placeholder="your@email.com" className="input-field" />
              </div>
              <div className="mb-5">
                <label className="block text-purple-900 font-bold mb-2">Phone Number</label>
                <input type="tel" placeholder="+254 700 000 000" className="input-field" />
              </div>
              <div className="mb-6">
                <label className="block text-purple-900 font-bold mb-2">Message</label>
                <textarea rows={4} placeholder="Write your message here..." className="input-field"></textarea>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-purple-950 text-white font-black py-4 rounded-xl hover:bg-purple-800 transition glow text-lg"
              >
                Send Message 🚀
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-purple-950 text-purple-300 text-center py-8 text-sm">
        <p className="text-yellow-400 font-bold text-lg mb-1">CHRISCO Digital Academy</p>
        <p>Under CHRISCO Youth Aflame • Founded by Wambete Benjamin</p>
        <p className="mt-2">📧 shambetz@gmail.com • 📞 +254112272061 • 📍 Nairobi, Kenya</p>
        <p className="mt-4 text-purple-600">© 2026 All Rights Reserved</p>
      </footer>
    </main>
  )
}