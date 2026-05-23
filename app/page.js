"use client"
import { useEffect, useRef, useState } from "react"
import Navbar from "./Navbar"
import Chatbot from "./Chatbot"

const floatingOrbs = [
  { size: 500, x: -100, y: -100, color: "rgba(124,58,237,0.06)", delay: 0 },
  { size: 350, x: "70%", y: 200, color: "rgba(245,158,11,0.05)", delay: 1.5 },
  { size: 280, x: "30%", y: "60%", color: "rgba(124,58,237,0.04)", delay: 3 },
]

const skills = [
  { icon: "🎨", title: "Graphic Design", desc: "Branding, posters and visual identity" },
  { icon: "💻", title: "Web Development", desc: "Modern websites with Next.js & React" },
  { icon: "📱", title: "Social Media", desc: "Strategy, content and growth" },
  { icon: "🎬", title: "Video Editing", desc: "Cinematic edits for any platform" },
  { icon: "✨", title: "Animations", desc: "Motion graphics and animated content" },
  { icon: "🤖", title: "AI Expert", desc: "Leveraging AI for creativity and productivity" },
]

const stats = [
  { value: "500+", label: "Youth Trained" },
  { value: "11", label: "Courses" },
  { value: "5+", label: "Counties" },
  { value: "100%", label: "Practical" },
]

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main style={{background:"var(--cream)", minHeight:"100vh", overflow:"hidden"}}>
      <style>{`
        @keyframes cometFly {
          0% { transform: translate(0,0) rotate(45deg); opacity:1; }
          100% { transform: translate(600px,600px) rotate(45deg); opacity:0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(40px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.05); }
          66% { transform: translate(-20px,30px) scale(0.95); }
        }
        @keyframes pulse {
          0%,100% { opacity:0.6; transform:scale(1); }
          50% { opacity:1; transform:scale(1.05); }
        }

        .comet {
          position:absolute; width:2px; height:90px;
          background:linear-gradient(to bottom, #f59e0b, transparent);
          border-radius:50%; animation:cometFly linear infinite;
          pointer-events:none;
        }

        .orb {
          position:absolute; border-radius:50%;
          animation:orbFloat ease-in-out infinite;
          pointer-events:none; filter:blur(60px);
        }

        .fade-up { animation:fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .float-anim { animation:float 4s ease-in-out infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmer 4s linear infinite;
        }

        .skill-card {
          background:white;
          border:1px solid var(--border);
          border-radius:24px;
          padding:28px;
          transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
          cursor:default;
        }
        .skill-card:hover {
          transform:translateY(-8px) scale(1.02);
          box-shadow:0 24px 48px rgba(124,58,237,0.12);
          border-color:rgba(245,158,11,0.4);
        }

        .hero-blob {
          position:absolute;
          border-radius:50%;
          filter:blur(80px);
          animation:orbFloat ease-in-out infinite;
          pointer-events:none;
        }

        .glass-card {
          background:rgba(255,255,255,0.7);
          backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.8);
          border-radius:32px;
        }

        .soft-divider {
          height:120px;
          background:linear-gradient(to bottom, var(--cream), var(--surface));
          margin:0;
        }

        .tag-pill {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(124,58,237,0.08);
          border:1px solid rgba(124,58,237,0.15);
          color:var(--purple-mid);
          padding:6px 16px; border-radius:50px;
          font-size:13px; font-weight:600;
          font-family:'DM Sans',sans-serif;
        }

        .cta-btn-primary {
          background:linear-gradient(135deg, #2d1b69, #7c3aed);
          color:white;
          font-family:'Bricolage Grotesque',sans-serif;
          font-weight:700; font-size:16px;
          padding:16px 36px; border-radius:100px;
          border:none; cursor:pointer;
          transition:all 0.3s;
          box-shadow:0 8px 32px rgba(124,58,237,0.3);
          text-decoration:none; display:inline-block;
        }
        .cta-btn-primary:hover {
          transform:translateY(-3px);
          box-shadow:0 16px 48px rgba(124,58,237,0.4);
        }

        .cta-btn-secondary {
          background:transparent;
          color:var(--purple-deep);
          font-family:'Bricolage Grotesque',sans-serif;
          font-weight:700; font-size:16px;
          padding:16px 36px; border-radius:100px;
          border:2px solid rgba(45,27,105,0.2);
          cursor:pointer; transition:all 0.3s;
          text-decoration:none; display:inline-block;
        }
        .cta-btn-secondary:hover {
          border-color:var(--purple-mid);
          background:rgba(124,58,237,0.05);
          transform:translateY(-3px);
        }

        .stat-item {
          text-align:center; padding:20px;
        }

        .founder-section {
          background:linear-gradient(135deg, #0d0a1a 0%, #2d1b69 50%, #4c1d95 100%);
          border-radius:40px;
          overflow:hidden;
          position:relative;
        }

        section { position:relative; }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg, #0d0a1a 0%, #2d1b69 40%, #4c1d95 70%, #1e1b4b 100%)",
        display:"flex", alignItems:"center",
        padding:"120px 24px 80px",
        position:"relative", overflow:"hidden"
      }}>
        {/* Blobs */}
        <div className="hero-blob" style={{width:600,height:600,background:"rgba(124,58,237,0.15)",top:-200,right:-200,animationDuration:"8s"}}></div>
        <div className="hero-blob" style={{width:400,height:400,background:"rgba(245,158,11,0.08)",bottom:-100,left:-100,animationDuration:"10s",animationDelay:"2s"}}></div>
        <div className="hero-blob" style={{width:300,height:300,background:"rgba(167,139,250,0.1)",top:"40%",left:"30%",animationDuration:"12s",animationDelay:"4s"}}></div>

        {/* Comets */}
        <div className="comet" style={{top:"5%",left:"10%",animationDuration:"3s"}}></div>
        <div className="comet" style={{top:"20%",left:"60%",animationDuration:"4s",animationDelay:"1s"}}></div>
        <div className="comet" style={{top:"60%",left:"80%",animationDuration:"3.5s",animationDelay:"2s"}}></div>
        <div className="comet" style={{top:"70%",left:"20%",animationDuration:"5s",animationDelay:"0.5s"}}></div>

        <div style={{maxWidth:1100,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}} className="hero-grid">
            <div>
              <div className="tag-pill" style={{background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:"#fde68a",marginBottom:24}}>
                🔥 CHRISCO Digital Academy
              </div>
              <h1 style={{
                fontFamily:"'Bricolage Grotesque',sans-serif",
                fontSize:"clamp(2.8rem,5vw,4.5rem)",
                fontWeight:800, lineHeight:1.05,
                color:"white", marginBottom:24
              }} className="fade-up">
                Empowering Youth Through{" "}
                <span className="shimmer-text">Digital Skills</span>
              </h1>
              <p style={{color:"rgba(255,255,255,0.65)",fontSize:"1.1rem",lineHeight:1.7,marginBottom:36,maxWidth:460}} className="fade-up">
                Learn. Grow. Transform Your Future. Join thousands of young Africans building real skills for the digital world.
              </p>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}} className="fade-up">
                <a href="/courses" className="cta-btn-primary">Explore Courses →</a>
                <a href="/about" className="cta-btn-secondary" style={{color:"rgba(255,255,255,0.8)",borderColor:"rgba(255,255,255,0.2)"}}>Learn More</a>
              </div>

              {/* Stats row */}
              <div style={{display:"flex",gap:32,marginTop:48,flexWrap:"wrap"}}>
                {stats.map((s,i) => (
                  <div key={i}>
                    <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"#f59e0b"}}>{s.value}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontWeight:500,letterSpacing:1,textTransform:"uppercase"}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side floating card */}
            <div style={{display:"flex",justifyContent:"center"}} className="float-anim">
              <div className="glass-card" style={{
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)",
                padding:36, maxWidth:360, width:"100%"
              }}>
                <div style={{fontSize:"3rem",marginBottom:16}}>👨‍💻</div>
                <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",color:"white",fontSize:"1.3rem",fontWeight:700,marginBottom:8}}>Wambete Benjamin</h3>
                <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,marginBottom:20}}>Founder & Lead Instructor</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {["CS Graduate","Designer","Developer","AI Expert","Animator"].map((tag,i) => (
                    <span key={i} style={{
                      background:"rgba(245,158,11,0.15)",
                      border:"1px solid rgba(245,158,11,0.25)",
                      color:"#fde68a", fontSize:11, fontWeight:600,
                      padding:"4px 12px", borderRadius:50
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{marginTop:24,padding:"16px 0",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:12,marginBottom:8}}>FOUNDED UNDER</div>
                  <div style={{color:"white",fontWeight:700,fontFamily:"'Bricolage Grotesque',sans-serif"}}>CHRISCO Youth Aflame 🇰🇪</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,height:120,
          background:"linear-gradient(to bottom, transparent, var(--cream))",
          pointerEvents:"none"
        }}></div>
      </section>

      {/* SKILLS SECTION */}
      <section style={{padding:"80px 24px",background:"var(--cream)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <span className="tag-pill" style={{marginBottom:16,display:"inline-block"}}>What We Teach</span>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"var(--ink)",marginBottom:16}}>
              Skills That Pay in{" "}
              <span style={{color:"var(--purple-mid)"}}>2026 & Beyond</span>
            </h2>
            <p style={{color:"var(--muted)",fontSize:"1.05rem",maxWidth:500,margin:"0 auto"}}>
              Practical courses taught by Wambete Benjamin — real skills for real income
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {skills.map((skill,i) => (
              <div key={i} className="skill-card" style={{animationDelay:`${i*0.1}s`}}>
                <div style={{fontSize:"2.5rem",marginBottom:16}}>{skill.icon}</div>
                <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:"1.1rem",color:"var(--ink)",marginBottom:8}}>{skill.title}</h3>
                <p style={{color:"var(--muted)",fontSize:14,lineHeight:1.6}}>{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section style={{padding:"80px 24px",background:"var(--surface)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
            <div>
              <span className="tag-pill" style={{marginBottom:16,display:"inline-block"}}>Our Courses</span>
              <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"var(--ink)",marginBottom:20,lineHeight:1.1}}>
                11 Courses to Launch Your Digital Career
              </h2>
              <p style={{color:"var(--muted)",fontSize:"1.05rem",lineHeight:1.7,marginBottom:32}}>
                From YouTube Automation to AI & LLM Mastery — every course is built to help you earn real money online from anywhere in Africa.
              </p>
              <a href="/courses" className="cta-btn-primary">Browse All Courses →</a>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {["▶️ YouTube Automation","🐍 Python Programming","💼 Freelancing","🧠 SWE & LLM Mastery","📧 Email Marketing","💸 Affiliate Marketing"].map((c,i) => (
                <div key={i} style={{
                  background:"white",
                  border:"1px solid var(--border)",
                  borderRadius:16, padding:"16px 20px",
                  fontSize:13, fontWeight:600, color:"var(--ink)",
                  transition:"all 0.3s",
                  cursor:"default"
                }}
                onMouseEnter={e => {e.currentTarget.style.borderColor="rgba(245,158,11,0.5)"; e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e => {e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)";}}
                >{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section style={{padding:"80px 24px",background:"var(--cream)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div className="founder-section" style={{padding:"60px 48px"}}>
            {/* Blobs inside */}
            <div style={{position:"absolute",width:400,height:400,background:"rgba(124,58,237,0.15)",borderRadius:"50%",top:-100,right:-100,filter:"blur(80px)",animation:"orbFloat 8s ease-in-out infinite"}}></div>
            <div style={{position:"absolute",width:300,height:300,background:"rgba(245,158,11,0.08)",borderRadius:"50%",bottom:-50,left:-50,filter:"blur(60px)",animation:"orbFloat 10s ease-in-out infinite",animationDelay:"2s"}}></div>

            <div style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
              <div>
                <span style={{
                  background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",
                  color:"#fde68a",padding:"6px 16px",borderRadius:50,fontSize:13,fontWeight:600,
                  display:"inline-block",marginBottom:20
                }}>Meet The Founder</span>
                <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"white",marginBottom:16,lineHeight:1.1}}>
                  Wambete Benjamin
                </h2>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:"1.05rem",lineHeight:1.7,marginBottom:28}}>
                  CS Graduate, Graphic Designer, Web Developer, Video Editor, Animator and AI Expert. Founder of CHRISCO Digital Academy under CHRISCO Youth Aflame — passionate about equipping African youth with skills that create real opportunities.
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:32}}>
                  {["Graphic Design","Web Development","Video Editing","Animations","Social Media","AI Expert"].map((tag,i) => (
                    <span key={i} style={{
                      background:"rgba(255,255,255,0.08)",
                      border:"1px solid rgba(255,255,255,0.12)",
                      color:"rgba(255,255,255,0.7)",
                      fontSize:12,fontWeight:600,
                      padding:"6px 14px",borderRadius:50
                    }}>{tag}</span>
                  ))}
                </div>
                <a href="/contact" className="cta-btn-primary">Get In Touch →</a>
              </div>
              <div style={{display:"flex",justifyContent:"center"}}>
                <div style={{
                  width:280,height:280,borderRadius:"50%",
                  background:"linear-gradient(135deg, rgba(124,58,237,0.3), rgba(245,158,11,0.2))",
                  border:"2px solid rgba(255,255,255,0.1)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"8rem"
                }} className="float-anim">
                  👨‍💻
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{padding:"60px 24px 80px",background:"var(--cream)",textAlign:"center"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{
            background:"linear-gradient(135deg, #2d1b69, #7c3aed)",
            borderRadius:40, padding:"60px 48px",
            position:"relative",overflow:"hidden"
          }}>
            <div className="comet" style={{top:"20%",left:"5%",animationDuration:"3s"}}></div>
            <div className="comet" style={{top:"60%",left:"80%",animationDuration:"4s",animationDelay:"1.5s"}}></div>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontSize:"3rem",marginBottom:16}} className="float-anim">🚀</div>
              <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,color:"white",marginBottom:16}}>
                Ready to Start Your{" "}
                <span className="shimmer-text">Digital Journey?</span>
              </h2>
              <p style={{color:"rgba(255,255,255,0.65)",fontSize:"1.05rem",marginBottom:32,lineHeight:1.7}}>
                Join CHRISCO Digital Academy today. Real skills. Real income. Real future.
              </p>
              <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="/courses" style={{
                  background:"#f59e0b",color:"#1a0533",
                  fontFamily:"'Bricolage Grotesque',sans-serif",
                  fontWeight:800,fontSize:16,
                  padding:"16px 36px",borderRadius:100,
                  textDecoration:"none",transition:"all 0.3s",
                  display:"inline-block"
                }}
                onMouseEnter={e => {e.currentTarget.style.background="#fde68a"; e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e => {e.currentTarget.style.background="#f59e0b"; e.currentTarget.style.transform="translateY(0)";}}
                >Explore Courses 🔥</a>
                <a href="https://wa.me/254112272061" style={{
                  background:"rgba(255,255,255,0.1)",
                  border:"2px solid rgba(255,255,255,0.2)",
                  color:"white",
                  fontFamily:"'Bricolage Grotesque',sans-serif",
                  fontWeight:700,fontSize:16,
                  padding:"16px 36px",borderRadius:100,
                  textDecoration:"none",transition:"all 0.3s",
                  display:"inline-block"
                }}
                onMouseEnter={e => {e.currentTarget.style.background="rgba(255,255,255,0.15)"; e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e => {e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.transform="translateY(0)";}}
                >WhatsApp Us 💬</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background:"var(--ink)",
        padding:"48px 24px",
        textAlign:"center"
      }}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#f59e0b",marginBottom:8}}>
            CHRISCO Digital Academy
          </div>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:20}}>
            Under CHRISCO Youth Aflame • Founded by Wambete Benjamin
          </p>
          <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
            {["Home","About","Courses","Contact"].map((link,i) => (
              <a key={i} href={`/${link.toLowerCase() === "home" ? "" : link.toLowerCase()}`} style={{
                color:"rgba(255,255,255,0.4)",fontSize:14,textDecoration:"none",
                transition:"color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color="#f59e0b"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.4)"}
              >{link}</a>
            ))}
          </div>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:13,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
            <span>📧 shambetz@gmail.com</span>
            <span>📞 +254112272061</span>
            <span>📍 Nairobi, Kenya</span>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:20,color:"rgba(255,255,255,0.2)",fontSize:12}}>
            © 2026 CHRISCO Digital Academy. All Rights Reserved.
          </div>
        </div>
      </footer>

      <Chatbot />
    </main>
  )
}