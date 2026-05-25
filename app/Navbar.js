"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "./AuthProvider"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, profile, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = ["Home","About","Courses","Contact"]

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      padding:"14px 24px",
      transition:"all 0.4s",
      background:scrolled ? "rgba(13,10,26,0.92)" : "transparent",
      backdropFilter:scrolled ? "blur(20px)" : "none",
      borderBottom:scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily:"'Bricolage Grotesque',sans-serif",
          fontWeight:800,fontSize:"1rem",
          color:"white",textDecoration:"none",
          display:"flex",alignItems:"center",gap:6
        }}>
          <span style={{color:"#f59e0b"}}>CHRISCO</span>
          <span style={{color:"rgba(255,255,255,0.5)",fontWeight:400,fontSize:"0.85rem"}}>Digital Academy</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="desktop-nav" style={{display:"flex",alignItems:"center",gap:4,listStyle:"none",margin:0,padding:0}}>
          {links.map((item,i) => (
            <li key={i}>
              <Link href={item==="Home"?"/":`/${item.toLowerCase()}`} style={{
                color:"rgba(255,255,255,0.65)",textDecoration:"none",
                fontSize:14,fontWeight:500,
                padding:"8px 14px",borderRadius:50,
                transition:"all 0.2s",display:"block"
              }}
              onMouseEnter={e=>{e.currentTarget.style.color="white";e.currentTarget.style.background="rgba(255,255,255,0.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.65)";e.currentTarget.style.background="transparent";}}
              >{item}</Link>
            </li>
          ))}

          {user ? (
            <>
              <li>
                <Link href="/dashboard" style={{
                  color:"rgba(255,255,255,0.65)",textDecoration:"none",
                  fontSize:14,fontWeight:500,
                  padding:"8px 14px",borderRadius:50,
                  transition:"all 0.2s",display:"block"
                }}
                onMouseEnter={e=>{e.currentTarget.style.color="white";e.currentTarget.style.background="rgba(255,255,255,0.08)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.65)";e.currentTarget.style.background="transparent";}}
                >Dashboard</Link>
              </li>
              <li>
                <div style={{
                  display:"flex",alignItems:"center",gap:8,
                  background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:50,padding:"6px 14px 6px 8px"
                }}>
                  <div style={{
                    width:28,height:28,borderRadius:"50%",
                    background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'Bricolage Grotesque',sans-serif",
                    fontWeight:800,fontSize:12,color:"#1a0533",flexShrink:0
                  }}>
                    {(profile?.name||user?.email||"U")[0].toUpperCase()}
                  </div>
                  <span style={{color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:500,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {profile?.name||user?.email?.split("@")[0]}
                  </span>
                </div>
              </li>
              <li>
                <button onClick={logout} style={{
                  background:"rgba(239,68,68,0.1)",
                  border:"1px solid rgba(239,68,68,0.2)",
                  color:"#fca5a5",fontSize:13,fontWeight:600,
                  padding:"8px 16px",borderRadius:50,cursor:"pointer",
                  transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif"
                }}>Sign Out</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/sign-in" style={{
                background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
                color:"#1a0533",
                fontFamily:"'Bricolage Grotesque',sans-serif",
                fontWeight:700,fontSize:14,
                padding:"10px 22px",borderRadius:50,
                textDecoration:"none",transition:"all 0.3s",
                display:"block",
                boxShadow:"0 4px 16px rgba(245,158,11,0.3)"
              }}>Login →</Link>
            </li>
          )}
        </ul>

        {/* Burger */}
        <button
          className="burger-btn"
          onClick={() => setOpen(!open)}
          style={{
            background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.1)",
            color:"white",width:40,height:40,
            borderRadius:12,cursor:"pointer",
            fontSize:18,display:"none",
            alignItems:"center",justifyContent:"center",
            flexShrink:0
          }}>
          {open?"✕":"☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          margin:"12px 0 0",padding:"20px",
          background:"rgba(13,10,26,0.97)",
          backdropFilter:"blur(20px)",
          borderRadius:20,
          border:"1px solid rgba(255,255,255,0.08)",
          display:"flex",flexDirection:"column",gap:4
        }}>
          {links.map((item,i) => (
            <Link key={i}
              href={item==="Home"?"/":`/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{
                color:"rgba(255,255,255,0.7)",textDecoration:"none",
                fontSize:15,fontWeight:500,
                padding:"12px 16px",borderRadius:12,
                display:"block",transition:"all 0.2s"
              }}
            >{item}</Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} style={{color:"rgba(255,255,255,0.7)",textDecoration:"none",fontSize:15,fontWeight:500,padding:"12px 16px",borderRadius:12}}>Dashboard</Link>
              <div style={{padding:"12px 16px",color:"rgba(255,255,255,0.4)",fontSize:13}}>{user?.email}</div>
              <button onClick={logout} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#fca5a5",fontSize:14,fontWeight:600,padding:"12px 16px",borderRadius:12,cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}>Sign Out</button>
            </>
          ) : (
            <Link href="/sign-in" onClick={() => setOpen(false)} style={{
              background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
              color:"#1a0533",fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:700,padding:"14px 24px",borderRadius:50,
              textDecoration:"none",textAlign:"center",marginTop:8,
              display:"block"
            }}>Login →</Link>
          )}
        </div>
      )}
    </nav>
  )
}