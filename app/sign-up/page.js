"use client"
import { useState } from "react"
import { useAuth } from "../AuthProvider"

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  async function handleSignUp() {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signUp(form.name, form.email, form.password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong.")
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSignUp()
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
          0%,100% { transform:translate(0,0); }
          50% { transform:translate(20px,-15px); }
        }
        @keyframes cometFly {
          0% { transform:translate(0,0) rotate(45deg); opacity:1; }
          100% { transform:translate(600px,600px) rotate(45deg); opacity:0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        .comet {
          position:absolute; width:2px; height:90px;
          background:linear-gradient(to bottom, #f59e0b, transparent);
          border-radius:50%; animation:cometFly linear infinite;
          pointer-events:none;
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
        .signup-card { animation:fadeUp 0.6s ease forwards; }
      `}</style>

      <div style={{position:"absolute",width:600,height:600,background:"rgba(124,58,237,0.12)",borderRadius:"50%",top:-200,right:-200,filter:"blur(80px)",animation:"orbFloat 8s ease-in-out infinite"}}></div>
      <div style={{position:"absolute",width:400,height:400,background:"rgba(245,158,11,0.07)",borderRadius:"50%",bottom:-100,left:-100,filter:"blur(60px)",animation:"orbFloat 10s ease-in-out infinite",animationDelay:"2s"}}></div>
      <div className="comet" style={{top:"10%",left:"10%",animationDuration:"3s"}}></div>
      <div className="comet" style={{top:"60%",left:"80%",animationDuration:"4s",animationDelay:"1s"}}></div>

      <div className="signup-card" style={{
        background:"rgba(255,255,255,0.04)",
        backdropFilter:"blur(24px)",
        border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:32, padding:"48px 40px",
        width:"100%", maxWidth:440,
        position:"relative", zIndex:1,
        boxShadow:"0 40px 80px rgba(0,0,0,0.4)"
      }}>
        {success ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:"4rem",marginBottom:16}}>🎉</div>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"white",marginBottom:12}}>Check Your Email!</h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,lineHeight:1.7,marginBottom:24}}>
              We sent a confirmation link to <strong style={{color:"#f59e0b"}}>{form.email}</strong>. Click it to activate your account then sign in.
            </p>
            <a href="/sign-in" style={{
              background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
              color:"#1a0533",fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:800,padding:"14px 32px",borderRadius:50,
              textDecoration:"none",display:"inline-block"
            }}>Go to Sign In →</a>
          </div>
        ) : (
          <>
            <div style={{textAlign:"center",marginBottom:36}}>
              <div style={{
                display:"inline-flex",alignItems:"center",justifyContent:"center",
                width:64,height:64,borderRadius:20,
                background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
                fontSize:"1.8rem",marginBottom:16,
                boxShadow:"0 8px 24px rgba(124,58,237,0.4)"
              }}>🚀</div>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#f59e0b",marginBottom:4}}>CHRISCO Digital Academy</div>
              <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"white",marginBottom:8}}>Create Account</h1>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:14}}>Join thousands of African youth learning digital skills</p>
            </div>

            {error && (
              <div style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.25)",color:"#fca5a5",padding:"12px 16px",borderRadius:12,marginBottom:16,fontSize:14,textAlign:"center"}}>
                {error}
              </div>
            )}

            <input className="input-modern" type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} onKeyDown={handleKey} />
            <input className="input-modern" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form,email:e.target.value})} onKeyDown={handleKey} />
            <input className="input-modern" type="password" placeholder="Create Password (min 6 chars)" value={form.password} onChange={e => setForm({...form,password:e.target.value})} onKeyDown={handleKey} />

            <button onClick={handleSignUp} disabled={loading} style={{
              width:"100%",
              background:"linear-gradient(135deg, #7c3aed, #4f46e5)",
              color:"white",
              fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:800, fontSize:16,
              padding:"16px", borderRadius:16,
              border:"none", cursor:"pointer",
              transition:"all 0.3s", marginBottom:20,
              boxShadow:"0 8px 24px rgba(124,58,237,0.35)",
              opacity: loading ? 0.8 : 1
            }}>
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            <div style={{textAlign:"center",padding:"16px 0",borderTop:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.4)",fontSize:14}}>
              Already have an account?{" "}
              <a href="/sign-in" style={{color:"#f59e0b",fontWeight:700,textDecoration:"none"}}>Sign In →</a>
            </div>
          </>
        )}
      </div>
    </main>
  )
}