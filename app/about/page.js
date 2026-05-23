"use client"
import Navbar from "../Navbar"

export default function About() {
  return (
    <main style={{background:"var(--cream)",minHeight:"100vh"}}>
      <style>{`
        @keyframes cometFly {
          0% { transform: translate(0,0) rotate(45deg); opacity:1; }
          100% { transform: translate(600px,600px) rotate(45deg); opacity:0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.05); }
          66% { transform: translate(-20px,30px) scale(0.95); }
        }
        .comet {
          position:absolute; width:2px; height:90px;
          background:linear-gradient(to bottom, #f59e0b, transparent);
          border-radius:50%; animation:cometFly linear infinite;
          pointer-events:none;
        }
        .float-anim { animation:float 4s ease-in-out infinite; }
        .stat-card {
          background:white; border:1px solid rgba(124,58,237,0.1);
          border-radius:24px; padding:32px; text-align:center;
          transition:all 0.3s;
        }
        .stat-card:hover {
          transform:translateY(-6px);
          box-shadow:0 20px 40px rgba(124,58,237,0.12);
          border-color:rgba(245,158,11,0.4);
        }
        .skill-tag {
          background:rgba(124,58,237,0.08);
          border:1px solid rgba(124,58,237,0.15);
          color:#7c3aed; font-size:13px; font-weight:600;
          padding:6px 16px; border-radius:50px;
          display:inline-block;
        }
        .tag-pill {
          display:inline-flex; align-items:center; gap:6px;
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
        <div className="comet" style={{top:"70%",left:"30%",animationDuration:"3.5s",animationDelay:"2s"}}></div>
        <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto"}}>
          <span className="tag-pill" style={{background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:"#fde68a",marginBottom:20,display:"inline-block"}}>
            🌍 About Us
          </span>
          <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2.5rem,5vw,4rem)",fontWeight:800,color:"white",marginBottom:20,lineHeight:1.1}}>
            We Are Building Africa's
            <span style={{background:"linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}> Digital Future</span>
          </h1>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:"1.1rem",lineHeight:1.7}}>
            A youth-focused learning platform under CHRISCO Youth Aflame — equipping young Africans with practical digital skills that open real doors.
          </p>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,background:"linear-gradient(to bottom, transparent, var(--cream))",pointerEvents:"none"}}></div>
      </section>

      {/* WHO WE ARE */}
      <section style={{padding:"80px 24px",background:"var(--cream)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <span className="tag-pill" style={{marginBottom:16,display:"inline-block"}}>Who We Are</span>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(1.8rem,3vw,2.8rem)",fontWeight:800,color:"var(--ink)",marginBottom:20,lineHeight:1.1}}>
              Born From a Passion to See Youth Thrive
            </h2>
            <p style={{color:"var(--muted)",fontSize:"1.05rem",lineHeight:1.8,marginBottom:16}}>
              CHRISCO Digital Academy is a youth-focused learning platform under <strong style={{color:"var(--purple-mid)"}}>CHRISCO Youth Aflame</strong>. We exist to equip young people across Africa with practical digital skills that open doors to real opportunities.
            </p>
            <p style={{color:"var(--muted)",fontSize:"1.05rem",lineHeight:1.8}}>
              Founded by <strong style={{color:"var(--purple-mid)"}}>Wambete Benjamin</strong> — a Computer Science graduate with expertise in graphic design, web development, video editing, animations, social media management and AI.
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[
              {number:"500+",label:"Youth Trained"},
              {number:"11",label:"Courses Available"},
              {number:"5+",label:"Counties Reached"},
              {number:"100%",label:"Practical Skills"},
            ].map((stat,i) => (
              <div key={i} className="stat-card">
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"2.5rem",fontWeight:800,color:"#f59e0b",marginBottom:8}}>{stat.number}</div>
                <div style={{color:"var(--muted)",fontSize:14,fontWeight:500}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section style={{padding:"80px 24px",background:"var(--surface)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <span className="tag-pill" style={{marginBottom:16,display:"inline-block"}}>Our Purpose</span>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(1.8rem,3vw,2.8rem)",fontWeight:800,color:"var(--ink)"}}>
              Mission & Vision
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{
              background:"linear-gradient(135deg, #2d1b69, #7c3aed)",
              borderRadius:32, padding:"48px 40px",
              position:"relative", overflow:"hidden"
            }}>
              <div style={{position:"absolute",width:200,height:200,background:"rgba(255,255,255,0.05)",borderRadius:"50%",top:-60,right:-60}}></div>
              <div style={{fontSize:"3rem",marginBottom:20}}>🎯</div>
              <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fde68a",marginBottom:16}}>Our Mission</h3>
              <p style={{color:"rgba(255,255,255,0.75)",lineHeight:1.8,fontSize:"1.05rem"}}>
                To bridge the digital divide by providing accessible, affordable and practical digital education to youth across Kenya and beyond.
              </p>
            </div>
            <div style={{
              background:"white", border:"2px solid rgba(124,58,237,0.12)",
              borderRadius:32, padding:"48px 40px",
              transition:"all 0.3s"
            }}>
              <div style={{fontSize:"3rem",marginBottom:20}}>🌍</div>
              <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"var(--purple-deep)",marginBottom:16}}>Our Vision</h3>
              <p style={{color:"var(--muted)",lineHeight:1.8,fontSize:"1.05rem"}}>
                A generation of digitally empowered African youth creating solutions, building businesses and leading transformation across the continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{padding:"80px 24px",background:"var(--cream)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{
            background:"linear-gradient(135deg, #0d0a1a 0%, #2d1b69 60%, #4c1d95 100%)",
            borderRadius:40, padding:"60px 48px",
            position:"relative", overflow:"hidden"
          }}>
            <div className="comet" style={{top:"20%",left:"5%",animationDuration:"3s"}}></div>
            <div className="comet" style={{top:"60%",left:"80%",animationDuration:"4s",animationDelay:"1s"}}></div>
            <div style={{position:"absolute",width:400,height:400,background:"rgba(124,58,237,0.1)",borderRadius:"50%",top:-150,right:-100,filter:"blur(80px)"}}></div>
            <div style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"auto 1fr",gap:48,alignItems:"center"}}>
              <div style={{
                width:160,height:160,borderRadius:"50%",
                background:"linear-gradient(135deg, rgba(124,58,237,0.3), rgba(245,158,11,0.2))",
                border:"2px solid rgba(255,255,255,0.1)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"5rem", flexShrink:0
              }} className="float-anim">👨‍💻</div>
              <div>
                <span style={{background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:"#fde68a",padding:"6px 16px",borderRadius:50,fontSize:12,fontWeight:600,display:"inline-block",marginBottom:16}}>Founder & Lead Instructor</span>
                <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(1.8rem,3vw,2.5rem)",fontWeight:800,color:"white",marginBottom:8}}>Wambete Benjamin</h2>
                <p style={{color:"rgba(255,255,255,0.5)",marginBottom:20,fontSize:14}}>CS Graduate • Designer • Developer • AI Expert</p>
                <p style={{color:"rgba(255,255,255,0.65)",lineHeight:1.7,marginBottom:24,maxWidth:600}}>
                  Passionate about equipping African youth with digital skills that open real doors and transform lives. Founded CHRISCO Digital Academy to make quality digital education accessible to every young person in Africa.
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {["Graphic Design","Web Development","Video Editing","Animations","Social Media","AI Expert"].map((tag,i) => (
                    <span key={i} className="skill-tag" style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.7)"}}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
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