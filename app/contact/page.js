"use client"
import { useState } from "react"
import Navbar from "../Navbar"
import emailjs from "@emailjs/browser"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.message) return
    setSending(true)
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: form.message,
      }, PUBLIC_KEY)
      setSent(true)
    } catch {
      alert("Failed to send. Please email shambetz@gmail.com directly.")
    }
    setSending(false)
  }

  return (
    <main style={{background:"var(--cream)",minHeight:"100vh"}}>
      <style>{`
        @keyframes cometFly {
          0% { transform: translate(0,0) rotate(45deg); opacity:1; }
          100% { transform: translate(600px,600px) rotate(45deg); opacity:0; }
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(20px,-15px); }
        }
        .comet {
          position:absolute; width:2px; height:90px;
          background:linear-gradient(to bottom, #f59e0b, transparent);
          border-radius:50%; animation:cometFly linear infinite;
          pointer-events:none;
        }
        .input-modern {
          width:100%; background:#faf5ff;
          border:2px solid rgba(124,58,237,0.12);
          border-radius:16px; padding:14px 18px;
          font-size:15px; font-family:'DM Sans',sans-serif;
          outline:none; transition:all 0.3s; color:var(--ink);
          margin-bottom:14px;
        }
        .input-modern:focus {
          border-color:#7c3aed;
          background:white;
          box-shadow:0 0 0 4px rgba(124,58,237,0.08);
        }
        .contact-info-card {
          display:flex; align-items:flex-start; gap:16px;
          background:white; border:1px solid rgba(124,58,237,0.1);
          border-radius:20px; padding:20px 24px;
          margin-bottom:14px; transition:all 0.3s;
        }
        .contact-info-card:hover {
          transform:translateY(-3px);
          box-shadow:0 12px 30px rgba(124,58,237,0.1);
          border-color:rgba(245,158,11,0.3);
        }
        .tag-pill {
          display:inline-flex; align-items:center;
          background:rgba(124,58,237,0.08);
          border:1px solid rgba(124,58,237,0.15);
          color:#7c3aed; padding:6px 16px; border-radius:50px;
          font-size:13px; font-weight:600;
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section style={{
        background:"linear-gradient(160deg, #0d0a1a 0%, #2d1b69 50%, #4c1d95 100%)",
        padding:"160px 24px 100px",
        textAlign:"center", position:"relative", overflow:"hidden"
      }}>
        <div style={{position:"absolute",width:500,height:500,background:"rgba(124,58,237,0.12)",borderRadius:"50%",top:-150,right:-150,filter:"blur(80px)",animation:"orbFloat 8s ease-in-out infinite"}}></div>
        <div style={{position:"absolute",width:350,height:350,background:"rgba(245,158,11,0.07)",borderRadius:"50%",bottom:-100,left:-100,filter:"blur(60px)",animation:"orbFloat 10s ease-in-out infinite",animationDelay:"2s"}}></div>
        <div className="comet" style={{top:"10%",left:"15%",animationDuration:"3s"}}></div>
        <div className="comet" style={{top:"50%",left:"70%",animationDuration:"4s",animationDelay:"1s"}}></div>
        <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto"}}>
          <span className="tag-pill" style={{background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:"#fde68a",marginBottom:20,display:"inline-block"}}>
            📬 Get In Touch
          </span>
          <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2.5rem,5vw,4rem)",fontWeight:800,color:"white",marginBottom:20,lineHeight:1.1}}>
            Let's Start a
            <span style={{background:"linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}> Conversation</span>
          </h1>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:"1.1rem",lineHeight:1.7}}>
            Have a question or want to enroll? We would love to hear from you.
          </p>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,background:"linear-gradient(to bottom, transparent, var(--cream))",pointerEvents:"none"}}></div>
      </section>

      {/* CONTACT BODY */}
      <section style={{padding:"80px 24px",background:"var(--cream)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:60,alignItems:"start"}}>

          {/* Left — Info */}
          <div>
            <span className="tag-pill" style={{marginBottom:20,display:"inline-block"}}>Contact Details</span>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:800,color:"var(--ink)",marginBottom:8,lineHeight:1.2}}>
              We're Always Here For You
            </h2>
            <p style={{color:"var(--muted)",fontSize:"1rem",lineHeight:1.7,marginBottom:32}}>
              Reach out anytime — we respond fast on WhatsApp.
            </p>

            {[
              {icon:"📧",label:"Email",value:"shambetz@gmail.com"},
              {icon:"📞",label:"Phone & WhatsApp",value:"+254112272061"},
              {icon:"📍",label:"Location",value:"Nairobi, Kenya"},
              {icon:"⛪",label:"Organisation",value:"CHRISCO Youth Aflame"},
            ].map((item,i) => (
              <div key={i} className="contact-info-card">
                <div style={{
                  width:48,height:48,borderRadius:14,
                  background:"linear-gradient(135deg,rgba(124,58,237,0.1),rgba(245,158,11,0.1))",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"1.4rem",flexShrink:0
                }}>{item.icon}</div>
                <div>
                  <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{item.label}</div>
                  <div style={{fontWeight:600,color:"var(--ink)",fontSize:15}}>{item.value}</div>
                </div>
              </div>
            ))}

            <div style={{marginTop:24}}>
              <div style={{fontWeight:600,color:"var(--ink)",marginBottom:12,fontSize:14}}>Find Us Online</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {["Facebook","Instagram","YouTube","LinkedIn"].map((s,i) => (
                  <span key={i} style={{
                    background:"linear-gradient(135deg,#2d1b69,#7c3aed)",
                    color:"white",fontSize:12,fontWeight:700,
                    padding:"8px 16px",borderRadius:50,cursor:"pointer",
                    transition:"all 0.2s"
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div style={{
            background:"white",
            border:"1px solid rgba(124,58,237,0.1)",
            borderRadius:32, padding:40,
            boxShadow:"0 20px 60px rgba(124,58,237,0.06)"
          }}>
            {sent ? (
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:"4rem",marginBottom:16}}>🎉</div>
                <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"var(--ink)",marginBottom:8}}>Message Sent!</h3>
                <p style={{color:"var(--muted)"}}>We will get back to you soon. Thank you!</p>
              </div>
            ) : (
              <>
                <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"var(--ink)",marginBottom:24}}>Send a Message ✉️</h3>
                <input className="input-modern" placeholder="Your Full Name *" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                <input className="input-modern" placeholder="Your Email Address" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
                <input className="input-modern" placeholder="Your Phone / WhatsApp" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
                <textarea className="input-modern" rows={5} placeholder="Your Message *" value={form.message} onChange={e => setForm({...form,message:e.target.value})} style={{resize:"none"}}></textarea>
                <button onClick={handleSubmit} disabled={sending} style={{
                  width:"100%",
                  background:"linear-gradient(135deg, #2d1b69, #7c3aed)",
                  color:"white",
                  fontFamily:"'Bricolage Grotesque',sans-serif",
                  fontWeight:700, fontSize:16,
                  padding:"16px", borderRadius:16,
                  border:"none", cursor:"pointer",
                  transition:"all 0.3s",
                  boxShadow:"0 8px 24px rgba(124,58,237,0.3)"
                }}>
                  {sending ? "Sending..." : "Send Message 🚀"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--ink)",padding:"48px 24px",textAlign:"center"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#f59e0b",marginBottom:8}}>CHRISCO Digital Academy</div>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:20}}>Under CHRISCO Youth Aflame • Founded by Wambete Benjamin</p>
          <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
            {["Home","About","Courses","Contact"].map((link,i) => (
              <a key={i} href={`/${link.toLowerCase()==="home"?"":link.toLowerCase()}`} style={{color:"rgba(255,255,255,0.4)",fontSize:14,textDecoration:"none"}}>{link}</a>
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
    </main>
  )
}