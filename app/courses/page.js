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
    icon: "▶️",
    title: "YouTube Automation",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.9",
    students: "50+",
    color: ["#dc2626","#ea580c"],
    desc: "Build and grow automated YouTube channels that earn money without showing your face.",
    syllabus: ["Introduction to YouTube Automation","Finding profitable niches","Content research and scripting","Voiceover and video creation tools","Uploading and SEO optimization","Monetization strategies","Outsourcing and scaling","Final project — Launch your channel"],
    for: "Anyone who wants to earn online through YouTube without appearing on camera.",
    download: "/courses/youtube-automation.html",
  },
  {
    id: 2,
    icon: "🐍",
    title: "Python Programming",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "70+",
    color: ["#059669","#0d9488"],
    desc: "Learn programming fundamentals with Python. Build real projects and problem-solving skills.",
    syllabus: ["Introduction to programming","Python syntax and variables","Conditions and loops","Functions and modules","Working with files and data","Introduction to APIs","Building automation scripts","Final project — Python tool"],
    for: "Anyone who wants to start coding and build a foundation for a tech career.",
    download: "/courses/python-programming.html",
  },
  {
    id: 3,
    icon: "👕",
    title: "Print on Demand",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.6",
    students: "40+",
    color: ["#0d9488","#059669"],
    desc: "Sell custom designed products online without holding any inventory.",
    syllabus: ["Introduction to print on demand","Choosing your niche","Design basics for POD","Setting up on Redbubble","Creating listings that sell","Marketing your store","Scaling your income","Final project — Live POD store"],
    for: "Designers and creatives who want to sell products online passively.",
    download: "/courses/print-on-demand.html",
  },
  {
    id: 4,
    icon: "👻",
    title: "Ghostwriting",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.9",
    students: "35+",
    color: ["#7c3aed","#4f46e5"],
    desc: "Get paid to write content for others — blogs, books, scripts and social media.",
    syllabus: ["What is ghostwriting","Finding ghostwriting clients","Writing in someone else's voice","Blog and article ghostwriting","Social media ghostwriting","Scriptwriting for YouTube","Pricing and contracts","Final project — Full portfolio"],
    for: "Writers who want to earn good money writing content for businesses and influencers.",
    download: "/courses/ghostwriting.html",
  },
  {
    id: 5,
    icon: "💼",
    title: "Freelancing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "110+",
    color: ["#d97706","#ea580c"],
    desc: "Build a freelancing career and earn money online using your digital skills.",
    syllabus: ["Introduction to freelancing","Choosing your freelance skill","Setting up on Fiverr and Upwork","Creating a winning profile","Pricing your services","Landing your first client","Delivering quality work","Final project — Live profile"],
    for: "Anyone who wants to earn money online using their skills from anywhere in Africa.",
    download: "/courses/freelancing.html",
  },
  {
    id: 6,
    icon: "📊",
    title: "Digital Marketing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "60+",
    color: ["#2563eb","#0891b2"],
    desc: "Master digital marketing strategies to grow businesses and brands online.",
    syllabus: ["Introduction to digital marketing","SEO fundamentals","Content marketing","Social media advertising","Google Ads basics","Email marketing","Analytics and reporting","Final project — Full campaign"],
    for: "Entrepreneurs, marketers and anyone who wants to grow a business online.",
    download: "/courses/digital-marketing.html",
  },
  {
    id: 7,
    icon: "✍️",
    title: "Copywriting",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.8",
    students: "65+",
    color: ["#4f46e5","#2563eb"],
    desc: "Write words that sell. Learn the art of persuasive writing for businesses.",
    syllabus: ["What is copywriting","Psychology of persuasion","Writing headlines","Email copywriting","Social media copy","Sales page writing","SEO copywriting basics","Final project — Full portfolio"],
    for: "Anyone who loves writing and wants to get paid for it online.",
    download: "/courses/copywriting.html",
  },
  {
    id: 8,
    icon: "📧",
    title: "Email Marketing",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.8",
    students: "55+",
    color: ["#ea580c","#dc2626"],
    desc: "Build email lists and create campaigns that convert subscribers into customers.",
    syllabus: ["Introduction to email marketing","Building your email list","Choosing an email platform","Writing compelling emails","Automating email sequences","Segmentation and personalization","Analytics and optimization","Final project — Full campaign"],
    for: "Marketers, entrepreneurs and freelancers who want to master email marketing.",
    download: "/courses/email-marketing.html",
  },
  {
    id: 9,
    icon: "💸",
    title: "Affiliate Marketing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.7",
    students: "45+",
    color: ["#16a34a","#059669"],
    desc: "Learn how to earn commissions by promoting other people's products online.",
    syllabus: ["What is affiliate marketing","Choosing the right niche","Finding affiliate programs","Building a platform","Creating content that converts","SEO for affiliate marketers","Email list building","Final project — Live campaign"],
    for: "Anyone who wants to earn passive income online from anywhere.",
    download: "/courses/affiliate-marketing.html",
  },
  {
    id: 10,
    icon: "📱",
    title: "Social Media Marketing",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.7",
    students: "150+",
    color: ["#db2777","#7c3aed"],
    desc: "Grow brands and businesses using digital platforms. Learn strategy, content and analytics.",
    syllabus: ["Social media platforms overview","Content strategy and planning","Creating engaging content","Instagram and Facebook marketing","TikTok and YouTube basics","Analytics and insights","Paid advertising basics","Final project — Social media campaign"],
    for: "Entrepreneurs, business owners and anyone who wants to grow an online presence.",
    download: "/courses/social-media-marketing.html",
  },
  {
    id: 11,
    icon: "🧠",
    title: "SWE & LLM Mastery",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "5.0",
    students: "New",
    color: ["#334155","#4338ca"],
    desc: "Learn software engineering combined with Large Language Models to build AI-powered applications.",
    syllabus: ["Software engineering basics","Understanding LLMs","Prompt engineering","Building with APIs","AI-powered app development","Testing and deployment","Real world projects","Final project — AI app"],
    for: "Developers and tech enthusiasts who want to build AI-powered software.",
    download: "/courses/swe-llm-mastery.html",
  },
]

export default function Courses() {
  const [selected, setSelected] = useState(null)
  const [enrolling, setEnrolling] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [filter, setFilter] = useState("All")

  const filtered = filter === "All" ? courses : courses.filter(c => c.level === filter)

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

  function handleDownload(course) {
    if (course.download) {
      window.open(course.download, "_blank")
    }
  }

  return (
    <main style={{background:"var(--cream)",minHeight:"100vh"}}>
      <style>{`
        @keyframes cometFly {
          0% { transform: translate(0,0) rotate(45deg); opacity:1; }
          100% { transform: translate(600px,600px) rotate(45deg); opacity:0; }
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.05); }
          66% { transform: translate(-20px,30px) scale(0.95); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0% { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(30px); }
          to { opacity:1; transform:translateY(0); }
        }
        .comet {
          position:absolute; width:2px; height:90px;
          background:linear-gradient(to bottom, #f59e0b, transparent);
          border-radius:50%; animation:cometFly linear infinite;
          pointer-events:none;
        }
        .course-card {
          background:white;
          border:1px solid rgba(124,58,237,0.08);
          border-radius:28px;
          overflow:hidden;
          transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
          cursor:pointer;
          animation:fadeUp 0.6s ease forwards;
        }
        .course-card:hover {
          transform:translateY(-10px) scale(1.02);
          box-shadow:0 32px 64px rgba(124,58,237,0.15);
          border-color:rgba(245,158,11,0.3);
        }
        .filter-btn {
          padding:10px 24px; border-radius:50px;
          font-family:'DM Sans',sans-serif;
          font-size:14px; font-weight:600;
          cursor:pointer; border:none;
          transition:all 0.3s;
        }
        .filter-active {
          background:linear-gradient(135deg,#2d1b69,#7c3aed);
          color:white;
          box-shadow:0 8px 20px rgba(124,58,237,0.3);
        }
        .filter-inactive {
          background:white;
          color:var(--muted);
          border:1px solid rgba(124,58,237,0.12) !important;
        }
        .filter-inactive:hover {
          border-color:rgba(124,58,237,0.3) !important;
          color:var(--purple-mid);
        }
        .input-modern {
          width:100%; background:#faf5ff;
          border:2px solid rgba(124,58,237,0.12);
          border-radius:14px; padding:13px 18px;
          font-size:14px; font-family:'DM Sans',sans-serif;
          outline:none; transition:all 0.3s; color:var(--ink);
          margin-bottom:12px;
        }
        .input-modern:focus {
          border-color:#7c3aed;
          background:white;
          box-shadow:0 0 0 4px rgba(124,58,237,0.08);
        }
        .overlay {
          position:fixed; top:0; left:0; width:100%; height:100%;
          background:rgba(13,10,26,0.85);
          backdrop-filter:blur(12px);
          z-index:200;
          display:flex; align-items:center; justify-content:center;
          padding:20px;
          animation:fadeUp 0.2s ease;
        }
        .modal {
          background:white; border-radius:28px;
          padding:36px; max-width:580px; width:100%;
          max-height:90vh; overflow-y:auto;
          box-shadow:0 40px 80px rgba(0,0,0,0.3);
        }
        .shimmer-text {
          background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmer 4s linear infinite;
        }
        .tag-pill {
          display:inline-flex; align-items:center;
          background:rgba(124,58,237,0.08);
          border:1px solid rgba(124,58,237,0.15);
          color:#7c3aed; padding:6px 16px; border-radius:50px;
          font-size:13px; font-weight:600;
        }
        @media (max-width:768px) {
          .hero-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section style={{
        background:"linear-gradient(160deg, #0d0a1a 0%, #2d1b69 50%, #4c1d95 100%)",
        padding:"160px 24px 120px",
        textAlign:"center",
        position:"relative",
        overflow:"hidden"
      }}>
        <div style={{position:"absolute",width:600,height:600,background:"rgba(124,58,237,0.12)",borderRadius:"50%",top:-200,right:-200,filter:"blur(80px)",animation:"orbFloat 8s ease-in-out infinite"}}></div>
        <div style={{position:"absolute",width:400,height:400,background:"rgba(245,158,11,0.07)",borderRadius:"50%",bottom:-100,left:-100,filter:"blur(60px)",animation:"orbFloat 10s ease-in-out infinite",animationDelay:"2s"}}></div>
        <div className="comet" style={{top:"5%",left:"10%",animationDuration:"3s"}}></div>
        <div className="comet" style={{top:"30%",left:"75%",animationDuration:"4s",animationDelay:"1s"}}></div>
        <div className="comet" style={{top:"65%",left:"40%",animationDuration:"3.5s",animationDelay:"2s"}}></div>
        <div className="comet" style={{top:"20%",left:"55%",animationDuration:"5s",animationDelay:"0.5s"}}></div>

        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto"}}>
          <span className="tag-pill" style={{background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:"#fde68a",marginBottom:24,display:"inline-block"}}>
            🎓 11 Courses Available
          </span>
          <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(2.5rem,6vw,5rem)",fontWeight:800,color:"white",marginBottom:20,lineHeight:1.05}}>
            Learn Skills That
            <br/>
            <span className="shimmer-text">Actually Pay</span>
          </h1>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:"1.1rem",lineHeight:1.8,maxWidth:580,margin:"0 auto 40px"}}>
            Practical digital courses designed for African youth — real skills, real income, from anywhere on the continent.
          </p>

          {/* Stats row */}
          <div style={{display:"flex",gap:0,justifyContent:"center",flexWrap:"wrap",background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"20px 32px",maxWidth:500,margin:"0 auto",gap:32}}>
            {[
              {value:"11",label:"Courses"},
              {value:"500+",label:"Students"},
              {value:"100%",label:"Practical"},
              {value:"🏆",label:"Certificate"},
            ].map((s,i) => (
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#f59e0b"}}>{s.value}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,background:"linear-gradient(to bottom, transparent, var(--cream))",pointerEvents:"none"}}></div>
      </section>

      {/* FILTER + GRID */}
      <section style={{padding:"60px 24px 80px",background:"var(--cream)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>

          {/* Filter buttons */}
          <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:48,flexWrap:"wrap"}}>
            {["All","Beginner","Intermediate"].map((f,i) => (
              <button
                key={i}
                onClick={() => setFilter(f)}
                className={`filter-btn ${filter === f ? "filter-active" : "filter-inactive"}`}
              >{f}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24}}>
            {filtered.map((course,i) => (
              <div
                key={course.id}
                className="course-card"
                style={{animationDelay:`${i*0.08}s`}}
                onClick={() => { setSelected(course); setEnrolling(null); setSent(false) }}
              >
                {/* Card top */}
                <div style={{
                  background:`linear-gradient(135deg, ${course.color[0]}, ${course.color[1]})`,
                  padding:"36px 28px",
                  position:"relative", overflow:"hidden"
                }}>
                  <div style={{position:"absolute",width:120,height:120,background:"rgba(255,255,255,0.06)",borderRadius:"50%",top:-30,right:-30}}></div>
                  <div style={{position:"absolute",width:80,height:80,background:"rgba(255,255,255,0.04)",borderRadius:"50%",bottom:-20,left:20}}></div>
                  <div style={{
                    width:70,height:70,borderRadius:20,
                    background:"rgba(255,255,255,0.15)",
                    backdropFilter:"blur(10px)",
                    border:"1px solid rgba(255,255,255,0.2)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:"2.2rem",marginBottom:16,
                    position:"relative",zIndex:1
                  }}>{course.icon}</div>
                  <div style={{
                    display:"inline-block",
                    background:"rgba(255,255,255,0.2)",
                    backdropFilter:"blur(10px)",
                    border:"1px solid rgba(255,255,255,0.25)",
                    color:"white",fontSize:11,fontWeight:700,
                    padding:"4px 12px",borderRadius:50,
                    position:"relative",zIndex:1
                  }}>{course.level}</div>
                </div>

                {/* Card body */}
                <div style={{padding:"24px 28px 28px"}}>
                  <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.15rem",color:"var(--ink)",marginBottom:8}}>{course.title}</h3>
                  <p style={{color:"var(--muted)",fontSize:13,lineHeight:1.6,marginBottom:16}}>{course.desc}</p>

                  <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                    <span style={{background:"rgba(124,58,237,0.06)",color:"#7c3aed",fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:50}}>⏱ {course.duration}</span>
                    <span style={{background:"rgba(245,158,11,0.08)",color:"#b45309",fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:50}}>⭐ {course.rating}</span>
                    <span style={{background:"rgba(16,185,129,0.08)",color:"#065f46",fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:50}}>👥 {course.students}</span>
                  </div>

                  <div style={{display:"flex",gap:10}}>
                    <button style={{
                      flex:1,
                      background:`linear-gradient(135deg, ${course.color[0]}, ${course.color[1]})`,
                      color:"white",fontFamily:"'Bricolage Grotesque',sans-serif",
                      fontWeight:700,fontSize:14,padding:"12px",
                      borderRadius:14,border:"none",cursor:"pointer",
                      transition:"all 0.2s"
                    }}>View Course →</button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDownload(course) }}
                      style={{
                        background:"rgba(124,58,237,0.06)",
                        border:"1px solid rgba(124,58,237,0.12)",
                        color:"#7c3aed",fontWeight:700,
                        padding:"12px 16px",borderRadius:14,
                        cursor:"pointer",fontSize:16,
                        transition:"all 0.2s"
                      }}
                      title="Download Course"
                    >📥</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{
              background:`linear-gradient(135deg, ${selected.color[0]}, ${selected.color[1]})`,
              borderRadius:20, padding:"32px 28px",
              marginBottom:24, position:"relative", overflow:"hidden"
            }}>
              <div style={{position:"absolute",width:150,height:150,background:"rgba(255,255,255,0.06)",borderRadius:"50%",top:-40,right:-40}}></div>
              <div style={{
                width:64,height:64,borderRadius:18,
                background:"rgba(255,255,255,0.15)",
                border:"1px solid rgba(255,255,255,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"2rem",marginBottom:12,
                position:"relative",zIndex:1
              }}>{selected.icon}</div>
              <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"white",marginBottom:8,position:"relative",zIndex:1}}>{selected.title}</h2>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",position:"relative",zIndex:1}}>
                {[selected.level,`⏱ ${selected.duration}`,`⭐ ${selected.rating}`,`👥 ${selected.students}`].map((tag,i) => (
                  <span key={i} style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.2)",color:"white",fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:50}}>{tag}</span>
                ))}
              </div>
            </div>

            <p style={{color:"var(--muted)",marginBottom:20,lineHeight:1.7}}>{selected.desc}</p>

            {/* Syllabus */}
            <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:"1rem",color:"var(--ink)",marginBottom:12}}>📋 Course Syllabus</h3>
            <div style={{background:"var(--surface)",borderRadius:16,overflow:"hidden",marginBottom:20}}>
              {selected.syllabus.map((item,i) => (
                <div key={i} style={{
                  display:"flex",alignItems:"flex-start",gap:12,
                  padding:"12px 16px",
                  borderBottom:i < selected.syllabus.length-1 ? "1px solid rgba(124,58,237,0.06)" : "none"
                }}>
                  <span style={{
                    background:`linear-gradient(135deg, ${selected.color[0]}, ${selected.color[1]})`,
                    color:"white",fontWeight:800,fontSize:11,
                    width:24,height:24,borderRadius:8,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    flexShrink:0,marginTop:1
                  }}>{i+1}</span>
                  <p style={{color:"var(--ink)",fontSize:14,lineHeight:1.5}}>{item}</p>
                </div>
              ))}
            </div>

            {/* Who for */}
            <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:"1rem",color:"var(--ink)",marginBottom:8}}>🎯 Who Is This For?</h3>
            <p style={{color:"var(--muted)",fontSize:14,lineHeight:1.7,background:"var(--surface)",borderRadius:14,padding:"14px 16px",marginBottom:24}}>{selected.for}</p>

            {/* Actions */}
            {!enrolling && !sent && (
              <div style={{display:"flex",gap:12}}>
                <button
                  onClick={() => setEnrolling(selected)}
                  style={{
                    flex:1,
                    background:`linear-gradient(135deg, ${selected.color[0]}, ${selected.color[1]})`,
                    color:"white",fontFamily:"'Bricolage Grotesque',sans-serif",
                    fontWeight:700,fontSize:15,padding:"14px",
                    borderRadius:16,border:"none",cursor:"pointer"
                  }}
                >Enroll Now 🚀</button>
                <button
                  onClick={() => handleDownload(selected)}
                  style={{background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.12)",color:"#7c3aed",fontWeight:700,padding:"14px 20px",borderRadius:16,cursor:"pointer",fontSize:18}}
                >📥</button>
                <button
                  onClick={() => setSelected(null)}
                  style={{background:"rgba(0,0,0,0.04)",border:"none",color:"var(--muted)",fontWeight:700,padding:"14px 18px",borderRadius:16,cursor:"pointer",fontSize:18}}
                >✕</button>
              </div>
            )}

            {/* Enroll form */}
            {enrolling && !sent && (
              <div>
                <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,color:"var(--ink)",marginBottom:16}}>📝 Enroll in {enrolling.title}</h3>
                <input className="input-modern" placeholder="Your Full Name *" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                <input className="input-modern" placeholder="Your Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
                <input className="input-modern" placeholder="Your Phone / WhatsApp *" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
                <div style={{display:"flex",gap:12}}>
                  <button
                    onClick={() => handleEnroll(enrolling)}
                    disabled={sending}
                    style={{
                      flex:1,
                      background:`linear-gradient(135deg, ${enrolling.color[0]}, ${enrolling.color[1]})`,
                      color:"white",fontFamily:"'Bricolage Grotesque',sans-serif",
                      fontWeight:700,fontSize:15,padding:"14px",
                      borderRadius:16,border:"none",cursor:"pointer"
                    }}
                  >{sending ? "Sending..." : "Submit Enrollment 🚀"}</button>
                  <button onClick={() => setEnrolling(null)} style={{background:"rgba(0,0,0,0.04)",border:"none",color:"var(--muted)",fontWeight:700,padding:"14px 18px",borderRadius:16,cursor:"pointer"}}>Back</button>
                </div>
              </div>
            )}

            {/* Success */}
            {sent && (
              <div style={{textAlign:"center",background:"#f0fdf4",border:"2px solid #86efac",borderRadius:20,padding:"40px 24px"}}>
                <div style={{fontSize:"3rem",marginBottom:12}}>🎉</div>
                <h3 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#15803d",marginBottom:8}}>Enrollment Sent!</h3>
                <p style={{color:"#166534",fontSize:14,marginBottom:20}}>Wambete will contact you soon on WhatsApp or Email. Welcome to CHRISCO Digital Academy! 🔥</p>
                <button onClick={() => setSelected(null)} style={{background:"#15803d",color:"white",fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,padding:"12px 32px",borderRadius:50,border:"none",cursor:"pointer"}}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <section style={{padding:"0 24px 80px",background:"var(--cream)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{
            background:"linear-gradient(135deg, #0d0a1a 0%, #2d1b69 60%, #4c1d95 100%)",
            borderRadius:40, padding:"60px 48px",
            textAlign:"center", position:"relative", overflow:"hidden"
          }}>
            <div className="comet" style={{top:"20%",left:"5%",animationDuration:"3s"}}></div>
            <div className="comet" style={{top:"60%",left:"85%",animationDuration:"4s",animationDelay:"1.5s"}}></div>
            <div style={{position:"absolute",width:300,height:300,background:"rgba(124,58,237,0.1)",borderRadius:"50%",top:-100,right:-100,filter:"blur(60px)"}}></div>
            <div style={{position:"relative",zIndex:1}}>
              <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,color:"white",marginBottom:16}}>
                Not Sure Which Course to Pick?
              </h2>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:"1.05rem",marginBottom:32,maxWidth:500,margin:"0 auto 32px"}}>
                WhatsApp us and we will help you choose the right path for your goals.
              </p>
              <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="https://wa.me/254112272061" style={{
                  background:"#f59e0b",color:"#1a0533",
                  fontFamily:"'Bricolage Grotesque',sans-serif",
                  fontWeight:800,fontSize:16,
                  padding:"16px 36px",borderRadius:100,
                  textDecoration:"none"
                }}>WhatsApp Us 💬</a>
                <a href="/contact" style={{
                  background:"rgba(255,255,255,0.08)",
                  border:"2px solid rgba(255,255,255,0.15)",
                  color:"white",
                  fontFamily:"'Bricolage Grotesque',sans-serif",
                  fontWeight:700,fontSize:16,
                  padding:"16px 36px",borderRadius:100,
                  textDecoration:"none"
                }}>Contact Us →</a>
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