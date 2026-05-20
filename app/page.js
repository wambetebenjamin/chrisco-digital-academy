"use client"
import Chatbot from "./Chatbot"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"

function Comet({ style }) {
  return <div className="comet" style={style}></div>
}

export default function Home() {
  const [comets, setComets] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: 10 }, (_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }))
    setComets(generated)
  }, [])

  const skills = [
    { icon: "🎨", title: "Graphic Design", desc: "Professional branding, posters and visual identity" },
    { icon: "💻", title: "Web Development", desc: "Modern websites built with Next.js and React" },
    { icon: "📱", title: "Social Media Management", desc: "Strategy, content and growth for brands" },
    { icon: "🎬", title: "Video Editing", desc: "Cinematic edits for YouTube, reels and events" },
    { icon: "✨", title: "Animations", desc: "Motion graphics and animated content" },
    { icon: "🤖", title: "AI Expert", desc: "Leveraging AI tools for productivity and creativity" },
  ]

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @keyframes cometFly {
          0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 1; }
          100% { transform: translateX(500px) translateY(500px) rotate(45deg); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .comet {
          position: absolute;
          width: 3px;
          height: 80px;
          background: linear-gradient(to bottom, #f59e0b, transparent);
          border-radius: 50%;
          animation: cometFly linear infinite;
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .float { animation: float 3s ease-in-out infinite; }
        .skill-card { transition: all 0.3s ease; }
        .skill-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(109,40,217,0.2); }
        .glow { box-shadow: 0 0 30px rgba(245,158,11,0.3); }
      `}</style>

      <Navbar />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white py-32 px-6 text-center overflow-hidden">
        {comets.map((style, i) => <Comet key={i} style={style} />)}
        <div className="relative z-10">
          <div className="float inline-block mb-6">
            <span className="bg-yellow-400 text-purple-950 font-black px-6 py-2 rounded-full text-sm tracking-widest uppercase">
              🔥 CHRISCO Digital Academy
            </span>
          </div>
          <h1 className="fade-up text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Empowering Youth Through<br />
            <span className="text-yellow-400">Digital Skills</span>
          </h1>
          <p className="fade-up text-purple-200 text-xl max-w-2xl mx-auto mb-10">
            Learn. Grow. Transform Your Future. Join thousands of young Africans building real skills for the digital world.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/courses" className="glow bg-yellow-400 text-purple-950 font-black px-10 py-4 rounded-full hover:bg-yellow-300 transition text-lg">
              🚀 Explore Courses
            </a>
            <a href="/about" className="border-2 border-yellow-400 text-yellow-400 font-bold px-10 py-4 rounded-full hover:bg-yellow-400 hover:text-purple-950 transition text-lg">
              Learn More →
            </a>
          </div>
        </div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-700 rounded-full opacity-20 float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-400 rounded-full opacity-10 float" style={{animationDelay:"1s"}}></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-indigo-500 rounded-full opacity-20 float" style={{animationDelay:"2s"}}></div>
      </section>
      {/* Stats */}
      <section className="bg-yellow-400 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "500+", label: "Youth Trained" },
            { number: "10+", label: "Courses" },
            { number: "5+", label: "Counties Reached" },
            { number: "100%", label: "Practical Skills" },
          ].map((stat, i) => (
            <div key={i} className="skill-card bg-white rounded-2xl p-6">
              <h3 className="text-4xl font-extrabold text-purple-950">{stat.number}</h3>
              <p className="text-purple-700 font-semibold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-purple-950 mb-4">What We Teach</h2>
          <p className="text-gray-500 text-lg">Practical digital skills taught by <span className="text-purple-700 font-bold">Wambete Benjamin</span> — CS Graduate & Digital Expert</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, i) => (
            <div key={i} className="skill-card border border-purple-100 rounded-2xl p-8 shadow-md bg-white">
              <div className="text-5xl mb-4">{skill.icon}</div>
              <h3 className="text-xl font-bold text-purple-950 mb-2">{skill.title}</h3>
              <p className="text-gray-500">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Founder */}
      <section className="relative bg-gradient-to-br from-purple-950 to-indigo-950 text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 bg-yellow-400 rounded-full float"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-purple-400 rounded-full float" style={{animationDelay:"1.5s"}}></div>
        </div>
        <div className="relative z-10">
          <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl float">
            👨‍💻
          </div>
          <h2 className="text-4xl font-extrabold mb-2 text-yellow-400">Wambete Benjamin</h2>
          <p className="text-purple-300 mb-6 text-lg">CS Graduate • Designer • Developer • AI Expert</p>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto mb-8">
            Founder of CHRISCO Digital Academy under CHRISCO Youth Aflame. Passionate about equipping African youth with digital skills that open real doors and transform lives.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Graphic Design","Web Development","Video Editing","Animations","Social Media","AI Expert"].map((tag, i) => (
              <span key={i} className="bg-yellow-400 text-purple-950 font-bold px-4 py-2 rounded-full text-sm">{tag}</span>
            ))}
          </div>
          <a href="/contact" className="glow bg-yellow-400 text-purple-950 font-black px-10 py-4 rounded-full hover:bg-yellow-300 transition text-lg">
            Get In Touch 🚀
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 text-purple-300 text-center py-8 text-sm">
        <p className="text-yellow-400 font-bold text-lg mb-1">CHRISCO Digital Academy</p>
        <p>Under CHRISCO Youth Aflame • Founded by CHRISCO </p>
        <p className="mt-2">📧 shambetz@gmail.com • 📞 +254112272061 • 📍 Nairobi, Kenya</p>
        <p className="mt-4 text-purple-600">© 2026 All Rights Reserved</p>
      </footer>
      <Chatbot />
    </main>
  )
}

