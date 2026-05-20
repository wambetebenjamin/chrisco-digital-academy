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
    icon: "🎨",
    title: "Graphic Design Basics",
    level: "Beginner",
    duration: "4 Weeks",
    rating: "4.9",
    students: "120+",
    color: "from-pink-500 to-purple-600",
    desc: "Learn design fundamentals using Canva and Adobe tools. Create stunning visuals for brands and social media.",
    syllabus: ["Introduction to design principles","Color theory and typography","Canva for beginners","Adobe Photoshop basics","Logo and brand identity design","Social media graphics","Poster and flyer design","Final project — Brand identity package"],
    for: "Anyone who wants to create beautiful designs for businesses, social media or personal branding.",
    download: null,
  },
  {
    id: 2,
    icon: "💻",
    title: "Web Development",
    level: "Beginner",
    duration: "6 Weeks",
    rating: "4.8",
    students: "95+",
    color: "from-blue-500 to-indigo-600",
    desc: "Build real websites using HTML, CSS, JavaScript and React.js from scratch.",
    syllabus: ["HTML fundamentals","CSS styling and layouts","JavaScript basics","Responsive design","React.js introduction","Next.js basics","API integration","Final project — Personal portfolio website"],
    for: "Anyone interested in building websites and starting a career in tech.",
    download: null,
  },
  {
    id: 3,
    icon: "📱",
    title: "Social Media Marketing",
    level: "Beginner",
    duration: "3 Weeks",
    rating: "4.7",
    students: "150+",
    color: "from-orange-500 to-pink-500",
    desc: "Grow brands and businesses using digital platforms. Learn strategy, content creation and analytics.",
    syllabus: ["Social media platforms overview","Content strategy and planning","Creating engaging content","Instagram and Facebook marketing","TikTok and YouTube basics","Analytics and insights","Paid advertising basics","Final project — Social media campaign"],
    for: "Entrepreneurs, business owners and anyone who wants to grow an online presence.",
    download: null,
  },
  {
    id: 4,
    icon: "🎬",
    title: "Video Editing",
    level: "Intermediate",
    duration: "4 Weeks",
    rating: "4.9",
    students: "80+",
    color: "from-red-500 to-orange-500",
    desc: "Create and edit professional videos for YouTube, Instagram Reels and events.",
    syllabus: ["Video editing fundamentals","CapCut for mobile editing","Adobe Premiere Pro basics","Colour grading and correction","Adding music and sound effects","Motion graphics basics","YouTube and Reels optimization","Final project — Short film or promo video"],
    for: "Content creators, YouTubers and anyone who wants to produce professional video content.",
    download: null,
  },
  {
    id: 5,
    icon: "🐍",
    title: "Coding with Python",
    level: "Intermediate",
    duration: "5 Weeks",
    rating: "4.8",
    students: "70+",
    color: "from-green-500 to-teal-500",
    desc: "Learn programming fundamentals with Python. Build real projects and problem-solving skills.",
    syllabus: ["Introduction to programming","Python syntax and variables","Conditions and loops","Functions and modules","Working with files and data","Introduction to APIs","Building simple automation scripts","Final project — Python automation tool"],
    for: "Anyone who wants to start coding and build a foundation for a tech career.",
    download: null,
  },
  {
    id: 6,
    icon: "🤖",
    title: "AI Tools Mastery",
    level: "Intermediate",
    duration: "3 Weeks",
    rating: "5.0",
    students: "200+",
    color: "from-purple-500 to-indigo-500",
    desc: "Use AI tools to boost creativity, productivity and build smarter solutions.",
    syllabus: ["Introduction to AI and how it works","ChatGPT for productivity","AI for graphic design","AI for writing and content creation","AI for coding assistance","AI for video and audio","Building AI-powered workflows","Final project — AI-powered project"],
    for: "Everyone! AI is the future and this course prepares you to use it professionally.",
    download: null,
  },
  {
    id: 7,
    icon: "▶️",
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
    id: 8,
    icon: "📊",
    title: "Digital Marketing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "60+",
    color: "from-blue-600 to-cyan-500",
    desc: "Master digital marketing strategies to grow businesses and brands online.",
    syllabus: ["Introduction to digital marketing","SEO fundamentals","Content marketing","Social media advertising","Google Ads basics","Email marketing","Analytics and reporting","Final project — Full digital marketing campaign"],
    for: "Entrepreneurs, marketers and anyone who wants to grow a business online.",
    download: "/courses/digital-marketing.html",
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
    syllabus: ["What is affiliate marketing","Choosing the right niche","Finding affiliate programs","Building a platform — blog or social","Creating content that converts","SEO for affiliate marketers","Email list building","Final project — Live affiliate campaign"],
    for: "Anyone who wants to earn passive income online from anywhere.",
    download: "/courses/affiliate-marketing.html",
  },
  {
    id: 10,
    icon: "🎭",
    title: "Faceless Content Creation",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.9",
    students: "90+",
    color: "from-gray-700 to-gray-500",
    desc: "Create viral content and grow online without ever showing your face.",
    syllabus: ["Introduction to faceless content","Choosing your niche and platform","Scripting and storytelling","AI voiceover tools","Video creation without a camera","Growing on YouTube and TikTok","Monetization strategies","Final project — Launch a faceless channel"],
    for: "Shy creators, introverts and anyone who wants to create content anonymously.",
    download: "/courses/facelesscontent-creation.html",
  },
  {
    id: 11,
    icon: "💼",
    title: "Freelancing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "110+",
    color: "from-yellow-500 to-orange-500",
    desc: "Build a freelancing career and earn money online using your digital skills.",
    syllabus: ["Introduction to freelancing","Choosing your freelance skill","Setting up on Fiverr and Upwork","Creating a winning profile","Pricing your services","Landing your first client","Delivering quality work","Final project — Live freelance profile"],
    for: "Anyone who wants to earn money online using their skills from anywhere in Africa.",
    download: "/courses/freelancing.html",
  },
  {
    id: 12,
    icon: "📱",
    title: "Social Media Management",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.7",
    students: "75+",
    color: "from-pink-600 to-purple-500",
    desc: "Manage social media pages for businesses and get paid as a professional.",
    syllabus: ["Introduction to social media management","Understanding different platforms","Content planning and scheduling","Canva for social media graphics","Community management","Analytics and reporting","Client management","Final project — Manage a real page"],
    for: "Anyone who wants to offer social media services to businesses and earn online.",
    download: "/courses/socialmedia-management.html",
  },
  {
    id: 13,
    icon: "✍️",
    title: "Copywriting",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "65+",
    color: "from-indigo-600 to-blue-500",
    desc: "Write words that sell. Learn the art of persuasive writing for businesses.",
    syllabus: ["What is copywriting","Psychology of persuasion","Writing headlines that grab attention","Email copywriting","Social media copy","Sales page writing","SEO copywriting basics","Final project — Full copywriting portfolio"],
    for: "Anyone who loves writing and wants to get paid for it online.",
    download: "/courses/copywriting.html",
  },
  {
    id: 14,
    icon: "👕",
    title: "Print on Demand",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.6",
    students: "40+",
    color: "from-teal-600 to-green-500",
    desc: "Sell custom designed products online without holding any inventory.",
    syllabus: ["Introduction to print on demand","Choosing your products and niche","Design basics for POD","Setting up on Redbubble and Merch","Creating listings that sell","Marketing your store","Scaling your income","Final project — Live POD store"],
    for: "Designers and creatives who want to sell products online passively.",
    download: "/courses/print-on-demand.html",
  },
  {
    id: 15,
    icon: "📧",
    title: "Email Marketing",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.8",
    students: "55+",
    color: "from-orange-600 to-red-500",
    desc: "Build email lists and create campaigns that convert subscribers into customers.",
    syllabus: ["Introduction to email marketing","Building your email list","Choosing an email platform","Writing compelling emails","Automating email sequences","Segmentation and personalization","Analytics and optimization","Final project — Full email campaign"],
    for: "Marketers, entrepreneurs and freelancers who want to master email marketing.",
    download: "/courses/email-marketing.html",
  },
  {
    id: 16,
    icon: "👻",
    title: "Ghostwriting",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.9",
    students: "35+",
    color: "from-purple-600 to-indigo-500",
    desc: "Get paid to write content for others — blogs, books, scripts and social media.",
    syllabus: ["What is ghostwriting","Finding ghostwriting clients","Writing in someone else's voice","Blog and article ghostwriting","Social media ghostwriting","Scriptwriting for YouTube","Pricing and contracts","Final project — Full ghostwriting portfolio"],
    for: "Writers who want to earn good money writing content for businesses and influencers.",
    download: "/courses/ghostwriting.html",
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

  function handlePrint(course) {
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
          <h1>${course.icon} ${course.title}</h1>
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
          position: absolute; width: 3px; height: 80px;
          background: linear-gradient(to bottom, #f59e0b, transparent);
          border-radius: 50%; animation: cometFly linear infinite;
        }
        .float { animation: float 3s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(109,40,217,0.2); }
        .glow { box-shadow: 0 0 30px rgba(245,158,11,0.3); }
        .input-field {
          width: 100%; border: 2px solid #e9d5ff; border-radius: 10px;
          padding: 10px 14px; outline: none; font-size: 14px;
          margin-bottom: 10px; transition: border 0.3s;
        }
        .input-field:focus { border-color: #7e22ce; }
        .overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.7); z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .modal {
          background: white; border-radius: 20px; padding: 30px;
          max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;
        }
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
            Our <span className="text-yellow-400">Courses</span>
          </h1>
          <p className="fade-up text-purple-200 text-xl max-w-xl mx-auto">
            Practical digital skills for the next generation of African innovators
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="card border border-purple-100 rounded-2xl overflow-hidden shadow-md bg-white">
              <div className={`bg-gradient-to-r ${course.color} p-6 text-white text-center`}>
                <div className="text-6xl mb-2">{course.icon}</div>
                <span className="bg-white bg-opacity-30 text-white font-bold px-3 py-1 rounded-full text-xs">{course.level}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-950 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{course.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">⏱ {course.duration}</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">⭐ {course.rating}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">👥 {course.students}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelected(course); setEnrolling(null); setSent(false) }}
                    className="flex-1 bg-purple-950 text-white font-bold py-2 rounded-xl hover:bg-purple-800 transition text-sm"
                  >
                    View Course
                  </button>
                  <button
                    onClick={() => handlePrint(course)}
                    className="bg-yellow-400 text-purple-950 font-bold px-3 py-2 rounded-xl hover:bg-yellow-300 transition text-sm"
                    title="Download / Print"
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
            <div className={`bg-gradient-to-r ${selected.color} p-6 rounded-xl text-white text-center mb-6`}>
              <div className="text-6xl mb-2">{selected.icon}</div>
              <h2 className="text-2xl font-extrabold">{selected.title}</h2>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                <span className="bg-white bg-opacity-30 text-white font-bold px-3 py-1 rounded-full text-xs">{selected.level}</span>
                <span className="bg-white bg-opacity-30 text-white font-bold px-3 py-1 rounded-full text-xs">⏱ {selected.duration}</span>
                <span className="bg-white bg-opacity-30 text-white font-bold px-3 py-1 rounded-full text-xs">⭐ {selected.rating}</span>
                <span className="bg-white bg-opacity-30 text-white font-bold px-3 py-1 rounded-full text-xs">👥 {selected.students}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{selected.desc}</p>

            <h3 className="text-lg font-extrabold text-purple-950 mb-3">📋 Course Syllabus</h3>
            <div className="mb-6">
              {selected.syllabus.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-purple-50">
                  <span className="bg-yellow-400 text-purple-950 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{i+1}</span>
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-extrabold text-purple-950 mb-2">🎯 Who Is This For?</h3>
            <p className="text-gray-600 text-sm mb-6">{selected.for}</p>

            {!enrolling && !sent && (
              <div className="flex gap-3">
                <button
                  onClick={() => { setEnrolling(selected); setSent(false) }}
                  className="flex-1 bg-purple-950 text-white font-black py-3 rounded-xl hover:bg-purple-800 transition glow"
                >
                  Enroll Now 🚀
                </button>
                <button
                  onClick={() => handlePrint(selected)}
                  className="bg-yellow-400 text-purple-950 font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition"
                >
                  📥 Download
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="bg-gray-100 text-gray-700 font-bold px-4 py-3 rounded-xl hover:bg-gray-200 transition"
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
                  <button onClick={() => setEnrolling(null)} className="bg-gray-100 text-gray-700 font-bold px-4 py-3 rounded-xl hover:bg-gray-200 transition">
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
      <section className="relative bg-gradient-to-br from-purple-950 to-indigo-950 text-white py-20 px-6 text-center overflow-hidden">
        <div className="comet" style={{top:"20%",left:"10%",animationDuration:"3s"}}></div>
        <div className="absolute top-5 left-10 w-24 h-24 bg-yellow-400 rounded-full opacity-10 float"></div>
        <div className="absolute bottom-5 right-10 w-36 h-36 bg-purple-400 rounded-full opacity-10 float" style={{animationDelay:"1s"}}></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-4 text-yellow-400">Ready to Start Learning?</h2>
          <p className="text-purple-200 text-lg mb-8 max-w-xl mx-auto">Join CHRISCO Digital Academy today and take your first step towards a digital future.</p>
          <a href="/contact" className="glow bg-yellow-400 text-purple-950 font-black px-10 py-4 rounded-full hover:bg-yellow-300 transition text-lg">
            Get Started Today 🔥
          </a>
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