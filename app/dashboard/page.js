"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../Navbar"

const courses = [
  { icon:"▶️", title:"YouTube Automation", progress:0 },
  { icon:"🐍", title:"Python Programming", progress:0 },
  { icon:"💼", title:"Freelancing", progress:0 },
  { icon:"📧", title:"Email Marketing", progress:0 },
  { icon:"💸", title:"Affiliate Marketing", progress:0 },
  { icon:"🧠", title:"SWE & LLM Mastery", progress:0 },
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("chrisco_user")
    if (!stored) {
      router.push("/sign-in")
    } else {
      setUser(JSON.parse(stored))
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem("chrisco_user")
    router.push("/")
  }

  if (!user) return null

  return (
    <main style={{background:"var(--cream)",minHeight:"100vh"}}>
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(20px,-15px); }
        }
        .course-card {
          background:white;
          border:1px solid rgba(124,58,237,0.1);
          border-radius:20px; padding:24px;
          transition:all 0.3s;
        }
        .course-card:hover {
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(124,58,237,0.1);
          border-color:rgba(245,158,11,0.3);
        }
      `}</style>

      <Navbar />

      {/* Welcome Hero */}
      <section style={{
        background:"linear-gradient(160deg, #0d0a1a 0%, #2d1b69 50%, #4c1d95 100%)",
        padding:"140px 24px 80px",
        position:"relative", overflow:"hidden"
      }}>
        <div style={{position:"absolute",width:400,height:400,background:"rgba(124,58,237,0.12)",borderRadius:"50%",top:-150,right:-100,filter:"blur(80px)",animation:"orbFloat 8s ease-in-out infinite"}}></div>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:14,marginBottom:8}}>Welcome back 👋</div>
            <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"white",marginBottom:8}}>
              {user.name || user.email} 🔥
            </h1>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:"1rem"}}>Continue your digital learning journey</p>
          </div>
          <button onClick={handleLogout} style={{
            background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.15)",
            color:"white", padding:"10px 24px",
            borderRadius:50, cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",
            fontWeight:600, fontSize:14,
            transition:"all 0.2s"
          }}>Sign Out</button>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(to bottom, transparent, var(--cream))",pointerEvents:"none"}}></div>
      </section>

      {/* Stats */}
      <section style={{padding:"40px 24px 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {[
            {icon:"📚",label:"Courses Available",value:"11"},
            {icon:"✅",label:"Courses Enrolled",value:"0"},
            {icon:"🏆",label:"Certificates",value:"0"},
            {icon:"⭐",label:"Learning Streak",value:"Day 1"},
          ].map((stat,i) => (
            <div key={i} style={{
              background:"white",border:"1px solid rgba(124,58,237,0.1)",
              borderRadius:20,padding:"24px",display:"flex",alignItems:"center",gap:16
            }}>
              <div style={{fontSize:"2rem"}}>{stat.icon}</div>
              <div>
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.4rem",color:"var(--ink)"}}>{stat.value}</div>
                <div style={{color:"var(--muted)",fontSize:13}}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section style={{padding:"40px 24px 80px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.5rem",color:"var(--ink)"}}>Your Courses</h2>
            <a href="/courses" style={{
              background:"linear-gradient(135deg,#2d1b69,#7c3aed)",
              color:"white",fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:700,fontSize:14,padding:"10px 24px",
              borderRadius:50,textDecoration:"none"
            }}>Browse All Courses →</a>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
            {courses.map((course,i) => (
              <div key={i} className="course-card">
                <div style={{fontSize:"2.5rem",marginBottom:12}}>{course.icon}</div>
                <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,color:"var(--ink)",marginBottom:12,fontSize:"1rem"}}>{course.title}</h3>
                <div style={{background:"rgba(124,58,237,0.08)",borderRadius:50,height:6,marginBottom:8,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${course.progress}%`,background:"linear-gradient(90deg,#7c3aed,#f59e0b)",borderRadius:50}}></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"var(--muted)",fontSize:12}}>{course.progress}% complete</span>
                  <a href="/courses" style={{
                    background:"linear-gradient(135deg,#2d1b69,#7c3aed)",
                    color:"white",fontSize:12,fontWeight:700,
                    padding:"6px 16px",borderRadius:50,textDecoration:"none"
                  }}>Start →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:"var(--ink)",padding:"40px 24px",textAlign:"center"}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#f59e0b",marginBottom:8}}>CHRISCO Digital Academy</div>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>© 2026 All Rights Reserved</p>
      </footer>
    </main>
  )
}