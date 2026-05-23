"use client"
import { useEffect, useState } from "react"
import Navbar from "../Navbar"
import { useAuth } from "../AuthProvider"

export default function Dashboard() {
  const { user, profile, logout, getEnrollments } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getEnrollments()
      setEnrollments(data)
      setLoading(false)
    }
    if (user) load()
  }, [user])

  return (
    <main style={{background:"var(--cream)",minHeight:"100vh"}}>
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform:translate(0,0); }
          50% { transform:translate(20px,-15px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        .dash-card {
          background:white;
          border:1px solid rgba(124,58,237,0.08);
          border-radius:20px; padding:24px;
          transition:all 0.3s;
          animation:fadeUp 0.5s ease forwards;
        }
        .dash-card:hover {
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(124,58,237,0.1);
          border-color:rgba(245,158,11,0.3);
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{
        background:"linear-gradient(160deg, #0d0a1a 0%, #2d1b69 50%, #4c1d95 100%)",
        padding:"140px 24px 80px",
        position:"relative", overflow:"hidden"
      }}>
        <div style={{position:"absolute",width:400,height:400,background:"rgba(124,58,237,0.12)",borderRadius:"50%",top:-150,right:-100,filter:"blur(80px)",animation:"orbFloat 8s ease-in-out infinite"}}></div>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:20}}>
            <div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:8,textTransform:"uppercase",letterSpacing:2}}>Welcome back</div>
              <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"white",marginBottom:8}}>
                {profile?.name || user?.email?.split("@")[0]} 👋
              </h1>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"1rem"}}>Continue your digital learning journey 🔥</p>
            </div>
            <div style={{
              background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20, padding:"16px 20px",
              display:"flex", alignItems:"center", gap:12
            }}>
              <div style={{
                width:44,height:44,borderRadius:"50%",
                background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'Bricolage Grotesque',sans-serif",
                fontWeight:800,fontSize:"1.1rem",color:"#1a0533"
              }}>
                {(profile?.name || user?.email || "U")[0].toUpperCase()}
              </div>
              <div>
                <div style={{color:"white",fontWeight:600,fontSize:14}}>{profile?.name || "Student"}</div>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(to bottom, transparent, var(--cream))",pointerEvents:"none"}}></div>
      </section>

      {/* Stats */}
      <section style={{padding:"40px 24px 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {[
            {icon:"📚",label:"Courses Available",value:"11"},
            {icon:"✅",label:"Courses Enrolled",value:loading ? "..." : enrollments.length},
            {icon:"🏆",label:"Certificates Earned",value:"0"},
            {icon:"🌍",label:"Member Since",value:user?.created_at ? new Date(user.created_at).toLocaleDateString("en-KE",{month:"short",year:"numeric"}) : "Today"},
          ].map((stat,i) => (
            <div key={i} className="dash-card" style={{display:"flex",alignItems:"center",gap:16,animationDelay:`${i*0.1}s`}}>
              <div style={{
                width:52,height:52,borderRadius:16,
                background:"linear-gradient(135deg,rgba(124,58,237,0.1),rgba(245,158,11,0.08))",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"1.6rem",flexShrink:0
              }}>{stat.icon}</div>
              <div>
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.5rem",color:"var(--ink)"}}>{stat.value}</div>
                <div style={{color:"var(--muted)",fontSize:13}}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enrollments */}
      <section style={{padding:"40px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.4rem",color:"var(--ink)"}}>
              {enrollments.length > 0 ? "Your Enrolled Courses" : "Start Learning Today"}
            </h2>
            <a href="/courses" style={{
              background:"linear-gradient(135deg,#2d1b69,#7c3aed)",
              color:"white",fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:700,fontSize:14,padding:"10px 24px",
              borderRadius:50,textDecoration:"none"
            }}>Browse All Courses →</a>
          </div>

          {loading ? (
            <div style={{textAlign:"center",padding:"60px 20px",color:"var(--muted)"}}>Loading your courses...</div>
          ) : enrollments.length > 0 ? (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
              {enrollments.map((enrollment,i) => (
                <div key={i} className="dash-card" style={{animationDelay:`${i*0.1}s`}}>
                  <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,color:"var(--ink)",marginBottom:8}}>{enrollment.course_title}</h3>
                  <div style={{color:"var(--muted)",fontSize:13,marginBottom:12}}>
                    Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString("en-KE")}
                  </div>
                  <div style={{background:"rgba(124,58,237,0.06)",borderRadius:50,height:6,marginBottom:8,overflow:"hidden"}}>
                    <div style={{height:"100%",width:"0%",background:"linear-gradient(90deg,#7c3aed,#f59e0b)",borderRadius:50}}></div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{color:"var(--muted)",fontSize:12}}>0% complete</span>
                    <a href="/courses" style={{
                      background:"linear-gradient(135deg,#2d1b69,#7c3aed)",
                      color:"white",fontSize:12,fontWeight:700,
                      padding:"6px 16px",borderRadius:50,textDecoration:"none"
                    }}>Continue →</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background:"white",border:"1px solid rgba(124,58,237,0.08)",
              borderRadius:24,padding:"60px 40px",textAlign:"center"
            }}>
              <div style={{fontSize:"4rem",marginBottom:16}}>📚</div>
              <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"var(--ink)",marginBottom:8}}>
                No courses yet
              </h3>
              <p style={{color:"var(--muted)",marginBottom:24,maxWidth:400,margin:"0 auto 24px"}}>
                Browse our 11 practical courses and enroll in one that matches your goals.
              </p>
              <a href="/courses" style={{
                background:"linear-gradient(135deg,#2d1b69,#7c3aed)",
                color:"white",fontFamily:"'Bricolage Grotesque',sans-serif",
                fontWeight:700,fontSize:15,padding:"14px 32px",
                borderRadius:50,textDecoration:"none",display:"inline-block"
              }}>Browse Courses 🚀</a>
            </div>
          )}
        </div>
      </section>

      {/* Account Info */}
      <section style={{padding:"0 24px 80px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{
            background:"linear-gradient(135deg,#0d0a1a,#2d1b69)",
            borderRadius:28,padding:"36px 40px",
            display:"flex",justifyContent:"space-between",
            alignItems:"center",flexWrap:"wrap",gap:20
          }}>
            <div>
              <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,color:"white",fontSize:"1.2rem",marginBottom:4}}>Account Settings</h3>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:14}}>{user?.email}</p>
            </div>
            <button onClick={logout} style={{
              background:"rgba(239,68,68,0.12)",
              border:"1px solid rgba(239,68,68,0.25)",
              color:"#fca5a5",fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:700,fontSize:14,
              padding:"12px 28px",borderRadius:50,cursor:"pointer",
              transition:"all 0.2s"
            }}>Sign Out</button>
          </div>
        </div>
      </section>

      <footer style={{background:"var(--ink)",padding:"40px 24px",textAlign:"center"}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#f59e0b",marginBottom:8}}>CHRISCO Digital Academy</div>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>© 2026 All Rights Reserved</p>
      </footer>
    </main>
  )
}