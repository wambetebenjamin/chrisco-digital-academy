"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  function handleLogin() {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }
    // Save basic auth to localStorage
    localStorage.setItem("chrisco_user", JSON.stringify({ email: form.email }))
    router.push("/dashboard")
  }

  return (
    <main style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg, #0d0a1a 0%, #2d1b69 50%, #4c1d95 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px", position:"relative", overflow:"hidden"
    }}>
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(20px,-15px); }
        }
        @keyframes cometFly {
          0% { transform: translate(0,0) rotate(45deg); opacity:1; }
          100% { transform: translate(600px,600px) rotate(45deg); opacity:0; }
        }
        .comet {
          position:absolute; width:2px; height:90px;
          background:linear-gradient(to bottom, #f59e0b, transparent);
          border-radius:50%; animation:cometFly linear infinite;
        }
        .input-modern {
          width:100%; background:rgba(255,255,255,0.05);
          border:2px solid rgba(255,255,255,0.1);
          border-radius:16px; padding:14px 18px;
          font-size:15px; font-family:'DM Sans',sans-serif;
          outline:none; transition:all 0.3s; color:white;
          margin-bottom:14px;
        }
        .input-modern::placeholder { color:rgba(255,255,255,0.35); }
        .input-modern:focus {
          border-color:#7c3aed;
          background:rgba(255,255,255,0.08);
          box-shadow:0 0 0 4px rgba(124,58,237,0.15);
        }
      `}</style>

      <div style={{position:"absolute",width:500,height:500,background:"rgba(124,58,237,0.12)",borderRadius:"50%",top:-200,right:-200,filter:"blur(80px)",animation:"orbFloat 8s ease-in-out infinite"}}></div>
      <div style={{position:"absolute",width:350,height:350,background:"rgba(245,158,11,0.07)",borderRadius:"50%",bottom:-100,left:-100,filter:"blur(60px)",animation:"orbFloat 10s ease-in-out infinite",animationDelay:"2s"}}></div>
      <div className="comet" style={{top:"10%",left:"10%",animationDuration:"3s"}}></div>
      <div className="comet" style={{top:"60%",left:"80%",animationDuration:"4s",animationDelay:"1s"}}></div>

      <div style={{
        background:"rgba(255,255,255,0.05)",
        backdropFilter:"blur(20px)",
        border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:32, padding:"48px 40px",
        width:"100%", maxWidth:440,
        position:"relative", zIndex:1
      }}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#f59e0b",marginBottom:4}}>CHRISCO Digital Academy</div>
          <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"2rem",fontWeight:800,color:"white",marginBottom:8}}>Welcome Back 👋</h1>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:14}}>Sign in to access your dashboard</p>
        </div>

        {error && (
          <div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",color:"#fca5a5",padding:"12px 16px",borderRadius:12,marginBottom:16,fontSize:14}}>
            {error}
          </div>
        )}

        <input className="input-modern" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
        <input className="input-modern" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />

        <button onClick={handleLogin} style={{
          width:"100%",
          background:"linear-gradient(135deg, #f59e0b, #fbbf24)",
          color:"#1a0533",
          fontFamily:"'Bricolage Grotesque',sans-serif",
          fontWeight:800, fontSize:16,
          padding:"16px", borderRadius:16,
          border:"none", cursor:"pointer",
          transition:"all 0.3s", marginBottom:16,
          boxShadow:"0 8px 24px rgba(245,158,11,0.3)"
        }}>
          Sign In →
        </button>

        <div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:13}}>
          Don't have an account?{" "}
          <a href="/sign-up" style={{color:"#f59e0b",fontWeight:600,textDecoration:"none"}}>Sign Up</a>
        </div>

        <div style={{textAlign:"center",marginTop:20}}>
          <a href="/" style={{color:"rgba(255,255,255,0.3)",fontSize:13,textDecoration:"none"}}>← Back to Home</a>
        </div>
      </div>
    </main>
  )
}