"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "./supabase"

const AuthContext = createContext(null)
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (data) setProfile(data)
  }

  useEffect(() => {
    if (loading) return
    const isPublic = PUBLIC_ROUTES.includes(pathname)
    if (!user && !isPublic) router.push("/sign-in")
    if (user && isPublic) router.push("/")
  }, [user, loading, pathname])

  async function signUp(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push("/sign-in")
  }

  async function enrollCourse(courseTitle) {
    if (!user) return
    const { error } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_title: courseTitle })
    if (error) throw error
  }

  async function getEnrollments() {
    if (!user) return []
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
    return data || []
  }

  if (loading) return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg, #0d0a1a 0%, #2d1b69 50%, #4c1d95 100%)",
      display:"flex", alignItems:"center", justifyContent:"center"
    }}>
      <div style={{textAlign:"center"}}>
        <div style={{
          width:60,height:60,borderRadius:16,
          background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"1.8rem",margin:"0 auto 16px",
          boxShadow:"0 8px 24px rgba(245,158,11,0.4)"
        }}>🎓</div>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#f59e0b",marginBottom:8}}>CHRISCO Digital Academy</div>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:14}}>Loading your experience...</div>
      </div>
    </div>
  )

  return (
    <AuthContext.Provider value={{ user, profile, signUp, signIn, logout, enrollCourse, getEnrollments }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}