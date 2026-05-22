"use client"
import { useState } from "react"
import Navbar from "../Navbar"
import emailjs from "@emailjs/browser"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

const courses = [
  {
    id: 1,
    icon: "▶️",
    emoji_bg: "#dc2626",
    title: "YouTube Automation",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.9",
    students: "50+",
    color: "from-red-600 to-orange-500",
    desc: "Build and grow automated YouTube channels that earn money without showing your face.",
    syllabus: ["Introduction to YouTube Automation","Finding profitable niches","Content research and scripting","Voiceover and video creation tools","Uploading and SEO optimization","Monetization strategies","Outsourcing and scaling","Final project — Launch your channel"],
    for: "Anyone who wants to earn online through YouTube without appearing on camera.",
    download: "/courses/youtube-automation.html",
  },
  {
    id: 2,
    icon: "🐍",
    title: "Python Programming",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "70+",
    color: "from-green-500 to-teal-500",
    desc: "Learn programming fundamentals with Python. Build real projects and problem-solving skills.",
    syllabus: ["Introduction to programming","Python syntax and variables","Conditions and loops","Functions and modules","Working with files and data","Introduction to APIs","Building automation scripts","Final project — Python tool"],
    for: "Anyone who wants to start coding and build a foundation for a tech career.",
    download: "/courses/python-programming.html",
  },
  {
    id: 3,
    icon: "👕",
    title: "Print on Demand",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.6",
    students: "40+",
    color: "from-teal-600 to-green-500",
    desc: "Sell custom designed products online without holding any inventory.",
    syllabus: ["Introduction to print on demand","Choosing your niche","Design basics for POD","Setting up on Redbubble","Creating listings that sell","Marketing your store","Scaling your income","Final project — Live POD store"],
    for: "Designers and creatives who want to sell products online passively.",
    download: "/courses/print-on-demand.html",
  },
  {
    id: 4,
    icon: "👻",
    title: "Ghostwriting",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.9",
    students: "35+",
    color: "from-purple-600 to-indigo-500",
    desc: "Get paid to write content for others — blogs, books, scripts and social media.",
    syllabus: ["What is ghostwriting","Finding ghostwriting clients","Writing in someone else's voice","Blog and article ghostwriting","Social media ghostwriting","Scriptwriting for YouTube","Pricing and contracts","Final project — Full portfolio"],
    for: "Writers who want to earn good money writing content for businesses and influencers.",
    download: "/courses/ghostwriting.html",
  },
  {
    id: 5,
    icon: "💼",
    title: "Freelancing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "110+",
    color: "from-yellow-500 to-orange-500",
    desc: "Build a freelancing career and earn money online using your digital skills.",
    syllabus: ["Introduction to freelancing","Choosing your freelance skill","Setting up on Fiverr and Upwork","Creating a winning profile","Pricing your services","Landing your first client","Delivering quality work","Final project — Live profile"],
    for: "Anyone who wants to earn money online using their skills from anywhere in Africa.",
    download: "/courses/freelancing.html",
  },
  {
    id: 6,
    icon: "📊",
    title: "Digital Marketing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "60+",
    color: "from-blue-600 to-cyan-500",
    desc: "Master digital marketing strategies to grow businesses and brands online.",
    syllabus: ["Introduction to digital marketing","SEO fundamentals","Content marketing","Social media advertising","Google Ads basics","Email marketing","Analytics and reporting","Final project — Full campaign"],
    for: "Entrepreneurs, marketers and anyone who wants to grow a business online.",
    download: "/courses/digital-marketing.html",
  },
  {
    id: 7,
    icon: "✍️",
    title: "Copywriting",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "65+",
    color: "from-indigo-600 to-blue-500",
    desc: "Write words that sell. Learn the art of persuasive writing for businesses.",
    syllabus: ["What is copywriting","Psychology of persuasion","Writing headlines","Email copywriting","Social media copy","Sales page writing","SEO copywriting basics","Final project — Full portfolio"],
    for: "Anyone who loves writing and wants to get paid for it online.",
    download: "/courses/copywriting.html",
  },
  {
    id: 8,
    icon: "📧",
    title: "Email Marketing",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.8",
    students: "55+",
    color: "from-orange-600 to-red-500",
    desc: "Build email lists and create campaigns that convert subscribers into customers.",
    syllabus: ["Introduction to email marketing","Building your email list","Choosing an email platform","Writing compelling emails","Automating email sequences","Segmentation and personalization","Analytics and optimization","Final project — Full campaign"],
    for: "Marketers, entrepreneurs and freelancers who want to master email marketing.",
    download: "/courses/email-marketing.html",
  },
  {
    id: 9,
    icon: "💸",
    title: "Affiliate Marketing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.7",
    students: "45+",
    color: "from-green-600 to-emerald-500",
    desc: "Learn how to earn commissions by promoting other people's products online.",
    syllabus: ["What is affiliate marketing","Choosing the right niche","Finding affiliate programs","Building a platform","Creating content that converts","SEO for affiliate marketers","Email list building","Final project — Live campaign"],
    for: "Anyone who wants to earn passive income online from anywhere.",
    download: "/courses/affiliate-marketing.html",
  },
  {
    id: 10,
    icon: "📱",
    title: "Social Media Marketing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.7",
    students: "150+",
    color: "from-pink-600 to-purple-500",
    desc: "Grow brands and businesses using digital platforms. Learn strategy, content and analytics.",
    syllabus: ["Social media platforms overview","Content strategy and planning","Creating engaging content","Instagram and Facebook marketing","TikTok and YouTube basics","Analytics and insights","Paid advertising basics","Final project — Social media campaign"],
    for: "Entrepreneurs, business owners and anyone who wants to grow an online presence.",
    download: "/courses/social-media-marketing.html",
  },
  {
    id: 11,
    icon: "🧠",
    title: "SWE & LLM Mastery",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "5.0",
    students: "New",
    color: "from-slate-700 to-indigo-800",
    desc: "Learn software engineering combined with Large Language Models to build AI-powered applications.",
    syllabus: ["Software engineering basics","Understanding LLMs","Prompt engineering","Building with APIs","AI-powered app development","Testing and deployment","Real world projects","Final project — AI app"],
    for: "Developers and tech enthusiasts who want to build AI-powered software.",
    download: "/courses/swe-llm-mastery.html",
  },
]

export default function Courses() {
  const [selected, setSelected] = useState(null)
  const [enrolling, setEnrolling] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleEnroll(course) {
    if (!form.name || !form.phone) return
    setSending(true)
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: `Enrollment Request for: ${course.title}\nLevel: ${course.level}\nDuration: ${course.duration}`,
      }, PUBLIC_KEY)
      setSent(true)
      setForm({ name: "", email: "", phone: "" })
    } catch {
      alert("Failed to send. Please email shambetz@gmail.com directly.")
    }
    setSending(false)
  }

  function handleDownload(course) {
    if (course.download) {
      window.open(course.download, "_blank")
    } else {
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
        <html>
          <head>
            <title>${course.title} — CHRISCO Digital Academy</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; }
              h1 { color: #581c87; font-size: 28px; margin-bottom: 5px; }
              h2 { color: #581c87; font-size: 18px; margin-top: 30px; }
              .badge { background: #fbbf24; color: #1a1a2e; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; margin-right: 8px; }
              .item { padding: 8px 0; border-bottom: 1px solid #e9d5ff; font-size: 15px; }
              .footer { margin-top: 40px; font-size: 13px; color: #888; }
              .logo { font-size: 22px; font-weight: bold; color: #581c87; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="logo">CHRISCO Digital Academy</div>
            <h1>${course.title}</h1>
            <p>${course.desc}</p>
            <div>
              <span class="badge">${course.level}</span>
              <span class="badge">⏱ ${course.duration}</span>
              <span class="badge">⭐ ${course.rating}</span>
              <span class="badge">👥 ${course.students} Students</span>
            </div>
            <h2>📋 Course Syllabus</h2>
            ${course.syllabus.map((item, i) => `<div class="item">${i + 1}. ${item}</div>`).join("")}
            <h2>🎯 Who Is This For?</h2>
            <p>${course.for}</p>
            <div class="footer">
              Founded by Wambete Benjamin • CHRISCO Youth Aflame<br/>
              📧 shambetz@gmail.com • 📞 +254112272061 • 📍 Nairobi, Kenya
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
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
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes iconPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .comet {
          position: absolute; width: 2px; height: 80px;
          background: linear-gradient(to bottom, #f59e0b, transparent);
          border-radius: 50%; animation: cometFly linear infinite;
        }
        .float { animation: float 3s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(107,33,168,0.1);
        }
        .card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 30px 60px rgba(109,40,217,0.25);
          border-color: rgba(245,158,11,0.4);
        }
        .card:hover .course-icon {
          animation: iconPop 0.4s ease forwards;
        }
        .glow { box-shadow: 0 0 30px rgba(245,158,11,0.4); }
        .input-field {
          width: 100%; border: 2px solid #e9d5ff; border-radius: 12px;
          padding: 12px 16px; outline: none; font-size: 14px;
          margin-bottom: 12px; transition: all 0.3s;
          background: #faf5ff;
        }
        .input-field:focus {
          border-color: #7e22ce;
          background: white;
          box-shadow: 0 0 0 4px rgba(126,34,206,0.1);
        }
        .overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fadeUp 0.2s ease forwards;
        }
        .modal {
          background: white; border-radius: 24px; padding: 32px;
          max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 40px 80px rgba(0,0,0,0.3);
        }
        .course-icon {
          font-size: 4rem;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
          line-height: 1;
        }
        .icon-wrapper {
          width: 90px; height: 90px;
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .level-badge {
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          color: white; font-weight: 700;
          padding: 4px 14px; border-radius: 50px; font-size: 12px;
        }
        .stat-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 12px; border-radius: 50px;
          font-size: 12px; font-weight: 700;
        }
        .shimmer-title {
          background: linear-gradient(90deg, #f59e0b, #fcd34d, #f59e0b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white py-28 px-6 text-center overflow-hidden">
        <div className="comet" style={{top:"5%",left:"15%",animationDuration:"3s"}}></div>
        <div className="comet" style={{top:"45%",left:"65%",animationDuration:"4s",animationDelay:"1s"}}></div>
        <div className="comet" style={{top:"15%",left:"80%",animationDuration:"2.5s",animationDelay:"2s"}}></div>
        <div className="comet" style={{top:"70%",left:"30%",animationDuration:"3.5s",animationDelay:"0.5s"}}></div>
        <div className="absolute top-10 left-10 w-40 h-40 bg-purple-700 rounded-full opacity-20 float"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-yellow-400 rounded-full opacity-10 float" style={{animationDelay:"1s"}}></div>
        <div className="absolute top-1/2 left-5 w-20 h-20 bg-indigo-500 rounded-full opacity-15 float" style={{animationDelay:"2s"}}></div>
        <div className="relative z-10">
          <div className="inline-block bg-yellow-400 bg-opacity-20 border border-yellow-400 border-opacity-40 text-yellow-300 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
            🎓 CHRISCO Digital Academy
          </div>
          <h1 className="fade-up text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Our <span className="shimmer-title">Courses</span>
          </h1>
          <p className="fade-up text-purple-200 text-xl max-w-2xl mx-auto mb-8">
            11 practical digital skill courses designed for the next generation of African innovators
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-extrabold text-yellow-400">11</div>
              <div className="text-xs text-purple-300">Courses</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-extrabold text-yellow-400">500+</div>
              <div className="text-xs text-purple-300">Students</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-extrabold text-yellow-400">100%</div>
              <div className="text-xs text-purple-300">Practical</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-extrabold text-yellow-400">🏆</div>
              <div className="text-xs text-purple-300">Certificate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-purple-950 mb-4">Choose Your Path</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Every course is designed to give you real skills you can use to earn money online</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="card rounded-2xl overflow-hidden bg-white">
              <div className={`bg-gradient-to-br ${course.color} p-8 text-white text-center relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-full translate-y-6 -translate-x-6"></div>
                <div className="icon-wrapper">
                  <span className="course-icon">{course.icon}</span>
                </div>
                <span className="level-badge">{course.level}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-purple-950 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{course.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="stat-pill bg-purple-50 text-purple-700">⏱ {course.duration}</span>
                  <span className="stat-pill bg-yellow-50 text-yellow-700">⭐ {course.rating}</span>
                  <span className="stat-pill bg-green-50 text-green-700">👥 {course.students}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelected(course); setEnrolling(null); setSent(false) }}
                    className="flex-1 bg-purple-950 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition text-sm"
                  >
                    View Course
                  </button>
                  <button
                    onClick={() => handleDownload(course)}
                    className="bg-yellow-400 text-purple-950 font-bold px-4 py-3 rounded-xl hover:bg-yellow-300 transition text-sm glow"
                    title="Download Course Outline"
                  >
                    📥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Course Modal */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-br ${selected.color} p-8 rounded-2xl text-white text-center mb-6 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="icon-wrapper mx-auto mb-3">
                <span className="course-icon">{selected.icon}</span>
              </div>
              <h2 className="text-2xl font-extrabold mb-3">{selected.title}</h2>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="level-badge">{selected.level}</span>
                <span className="level-badge">⏱ {selected.duration}</span>
                <span className="level-badge">⭐ {selected.rating}</span>
                <span className="level-badge">👥 {selected.students}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{selected.desc}</p>

            <h3 className="text-lg font-extrabold text-purple-950 mb-3">📋 Course Syllabus</h3>
            <div className="mb-6 rounded-xl overflow-hidden border border-purple-100">
              {selected.syllabus.map((item, i) => (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-purple-50' : 'bg-white'}`}>
                  <span className="bg-yellow-400 text-purple-950 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-extrabold text-purple-950 mb-2">🎯 Who Is This For?</h3>
            <p className="text-gray-600 text-sm mb-6 bg-purple-50 rounded-xl p-4">{selected.for}</p>

            {!enrolling && !sent && (
              <div className="flex gap-3">
                <button
                  onClick={() => { setEnrolling(selected); setSent(false) }}
                  className="flex-1 bg-purple-950 text-white font-black py-3 rounded-xl hover:bg-purple-800 transition glow"
                >
                  Enroll Now 🚀
                </button>
                <button
                  onClick={() => handleDownload(selected)}
                  className="bg-yellow-400 text-purple-950 font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition"
                >
                  📥 Download
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="bg-gray-100 text-gray-500 font-bold px-4 py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {enrolling && !sent && (
              <div>
                <h3 className="text-lg font-extrabold text-purple-950 mb-4">📝 Enroll in {enrolling.title}</h3>
                <input className="input-field" placeholder="Your Full Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input className="input-field" placeholder="Your Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <input className="input-field" placeholder="Your Phone / WhatsApp *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEnroll(enrolling)}
                    disabled={sending}
                    className="flex-1 bg-purple-950 text-white font-black py-3 rounded-xl hover:bg-purple-800 transition"
                  >
                    {sending ? "Sending..." : "Submit Enrollment 🚀"}
                  </button>
                  <button onClick={() => setEnrolling(null)} className="bg-gray-100 text-gray-500 font-bold px-4 py-3 rounded-xl hover:bg-gray-200 transition">
                    Back
                  </button>
                </div>
              </div>
            )}

            {sent && (
              <div className="text-center bg-green-50 border-2 border-green-400 rounded-2xl p-8">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-extrabold text-green-700 mb-2">Enrollment Sent!</h3>
                <p className="text-green-600 text-sm">Wambete will contact you soon on WhatsApp or Email. Welcome to CHRISCO Digital Academy! 🔥</p>
                <button onClick={() => setSelected(null)} className="mt-4 bg-purple-950 text-white font-bold px-8 py-3 rounded-xl hover:bg-purple-800 transition">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-purple-950 to-indigo-950 text-white py-24 px-6 text-center overflow-hidden">
        <div className="comet" style={{top:"20%",left:"10%",animationDuration:"3s"}}></div>
        <div className="comet" style={{top:"60%",left:"80%",animationDuration:"4s",animationDelay:"1s"}}></div>
        <div className="absolute top-5 left-10 w-24 h-24 bg-yellow-400 rounded-full opacity-10 float"></div>
        <div className="absolute bottom-5 right-10 w-36 h-36 bg-purple-400 rounded-full opacity-10 float" style={{animationDelay:"1s"}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600 rounded-full opacity-5 float" style={{animationDelay:"2s", transform:"translate(-50%,-50%)"}}></div>
        <div className="relative z-10">
          <div className="text-5xl mb-4 float">🚀</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-yellow-400">Ready to Start Learning?</h2>
          <p className="text-purple-200 text-lg mb-10 max-w-xl mx-auto">Join CHRISCO Digital Academy today and take your first step towards a digital future.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/contact" className="glow bg-yellow-400 text-purple-950 font-black px-10 py-4 rounded-full hover:bg-yellow-300 transition text-lg">
              Get Started Today 🔥
            </a>
            <a href="https://wa.me/254112272061" className="border-2 border-yellow-400 text-yellow-400 font-black px-10 py-4 rounded-full hover:bg-yellow-400 hover:text-purple-950 transition text-lg">
              WhatsApp Us 💬
            </a>
          </div>
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