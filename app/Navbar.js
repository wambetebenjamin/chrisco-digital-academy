"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      padding:"16px 32px",
      transition:"all 0.4s",
      background: scrolled ? "rgba(13,10,26,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Link href="/" style={{
          fontFamily:"'Bricolage Grotesque',sans-serif",
          fontWeight:800, fontSize:"1.1rem",
          color:"white", textDecoration:"none",
          display:"flex", alignItems:"center", gap:8
        }}>
          <span style={{color:"#f59e0b"}}>CHRISCO</span>
          <span style={{color:"rgba(255,255,255,0.7)",fontWeight:400,fontSize:"0.95rem"}}>Digital Academy</span>
        </Link>

        {/* Desktop links */}
        <ul style={{display:"flex",alignItems:"center",gap:8,listStyle:"none",margin:0,padding:0}} className="desktop-nav">
          {["Home","About","Courses","Contact"].map((item,i) => (
            <li key={i}>
              <Link href={item === "Home" ? "/" : `/${item.toLowerCase()}`} style={{
                color:"rgba(255,255,255,0.7)",
                textDecoration:"none",
                fontSize:14, fontWeight:500,
                padding:"8px 16px", borderRadius:50,
                transition:"all 0.2s",
                display:"block"
              }}
              onMouseEnter={e => {e.currentTarget.style.color="white"; e.currentTarget.style.background="rgba(255,255,255,0.08)";}}
              onMouseLeave={e => {e.currentTarget.style.color="rgba(255,255,255,0.7)"; e.currentTarget.style.background="transparent";}}
              >{item}</Link>
            </li>
          ))}
          <li>
            <Link href="/sign-in" style={{
              background:"linear-gradient(135deg, #f59e0b, #fbbf24)",
              color:"#1a0533",
              fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:700, fontSize:14,
              padding:"10px 24px", borderRadius:50,
              textDecoration:"none", transition:"all 0.3s",
              display:"block",
              boxShadow:"0 4px 16px rgba(245,158,11,0.3)"
            }}
            onMouseEnter={e => {e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(245,158,11,0.4)";}}
            onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(245,158,11,0.3)";}}
            >Login →</Link>
          </li>
        </ul>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} style={{
          background:"rgba(255,255,255,0.08)",
          border:"1px solid rgba(255,255,255,0.1)",
          color:"white", width:40, height:40,
          borderRadius:12, cursor:"pointer",
          fontSize:18, display:"none"
        }} className="burger-btn">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          marginTop:12, padding:"20px 24px",
          background:"rgba(13,10,26,0.95)",
          backdropFilter:"blur(20px)",
          borderRadius:20,
          border:"1px solid rgba(255,255,255,0.08)",
          display:"flex", flexDirection:"column", gap:8
        }}>
          {["Home","About","Courses","Contact"].map((item,i) => (
            <Link key={i} href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{color:"rgba(255,255,255,0.7)",textDecoration:"none",fontSize:15,fontWeight:500,padding:"10px 16px",borderRadius:12,transition:"all 0.2s"}}
            >{item}</Link>
          ))}
          <Link href="/sign-in" onClick={() => setOpen(false)} style={{
            background:"#f59e0b",color:"#1a0533",
            fontFamily:"'Bricolage Grotesque',sans-serif",
            fontWeight:700, padding:"12px 24px", borderRadius:50,
            textDecoration:"none", textAlign:"center", marginTop:8
          }}>Login →</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </nav>
  )
}