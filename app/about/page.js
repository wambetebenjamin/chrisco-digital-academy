"use client"
import Navbar from "../Navbar"

export default function About() {
  const team = [
    { icon: "👨‍💻", name: "Wambete Benjamin", role: "Founder & Lead Instructor", skills: "CS Graduate • Designer • Developer • AI Expert" },
  ]

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
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(109,40,217,0.2); }
        .glow { box-shadow: 0 0 30px rgba(245,158,11,0.3); }
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
            About <span className="text-yellow-400">Us</span>
          </h1>
          <p className="fade-up text-purple-200 text-xl max-w-xl mx-auto">
            A movement to digitally empower the next generation of African youth
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-purple-950 mb-6">Who We Are</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          CHRISCO Digital Academy is a youth-focused learning platform under <span className="text-purple-700 font-bold">CHRISCO Youth Aflame</span>. We exist to equip young people across Africa with practical digital skills that open doors to opportunities and transform their futures.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          Founded by <span className="text-purple-700 font-bold">Wambete Benjamin</span> — a Computer Science graduate with expertise in graphic design, web development, video editing, animations, social media management and AI — we bring real-world skills to young people who are ready to grow.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-yellow-400 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "500+", label: "Youth Trained" },
            { number: "10+", label: "Courses Available" },
            { number: "5+", label: "Counties Reached" },
            { number: "100%", label: "Practical Skills" },
          ].map((stat, i) => (
            <div key={i} className="card bg-white rounded-2xl p-6">
              <h3 className="text-4xl font-extrabold text-purple-950">{stat.number}</h3>
              <p className="text-purple-700 font-semibold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="card bg-purple-950 text-white rounded-2xl p-10">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-2xl font-extrabold text-yellow-400 mb-4">Our Mission</h3>
          <p className="text-purple-200 leading-relaxed">
            To bridge the digital divide by providing accessible, affordable and practical digital education to youth across Kenya and beyond.
          </p>
        </div>
        <div className="card border-2 border-purple-950 rounded-2xl p-10">
          <div className="text-5xl mb-4">🌍</div>
          <h3 className="text-2xl font-extrabold text-purple-950 mb-4">Our Vision</h3>
          <p className="text-gray-600 leading-relaxed">
            A generation of digitally empowered African youth creating solutions, building businesses and leading transformation across the continent.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="relative bg-gradient-to-br from-purple-950 to-indigo-950 text-white py-24 px-6 text-center overflow-hidden">
        <div className="comet" style={{top:"15%",left:"30%",animationDuration:"3.5s"}}></div>
        <div className="absolute top-10 right-10 w-36 h-36 bg-yellow-400 rounded-full opacity-10 float"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400 rounded-full opacity-10 float" style={{animationDelay:"1.5s"}}></div>
        <div className="relative z-10">
          <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl float">
            👨‍💻
          </div>
          <h2 className="text-4xl font-extrabold mb-2 text-yellow-400">Wambete Benjamin</h2>
          <p className="text-purple-300 mb-6 text-lg">Founder & Lead Instructor</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["CS Graduate","Graphic Design","Web Development","Video Editing","Animations","Social Media","AI Expert"].map((tag, i) => (
              <span key={i} className="bg-yellow-400 text-purple-950 font-bold px-4 py-2 rounded-full text-sm">{tag}</span>
            ))}
          </div>
          <a href="/contact" className="glow bg-yellow-400 text-purple-950 font-black px-10 py-4 rounded-full hover:bg-yellow-300 transition text-lg">
            Contact Wambete 🚀
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