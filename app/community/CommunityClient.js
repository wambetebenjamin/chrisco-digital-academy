"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import Icon from "../components/Icon"

const lounges = [
 { name: "Python Crew", people: 12, topic: "Coding", color: "lime", live: true },
 { name: "Late Night Design", people: 8, topic: "Design", color: "pink", live: true },
 { name: "Reels Editors", people: 5, topic: "Video", color: "purple", live: true },
 { name: "AI Builders", people: 9, topic: "AI", color: "yellow", live: true },
 { name: "Freelance Hustle", people: 14, topic: "Business", color: "lime", live: false },
 { name: "Writers Room", people: 6, topic: "Writing", color: "pink", live: false },
]

const buddies = [
 { name: "Aisha M.", track: "Python Programming", xp: 2480, initials: "AM", badge: "Python" },
 { name: "Brian K.", track: "Graphic Design", xp: 2215, initials: "BK", badge: "Design" },
 { name: "Neema W.", track: "YouTube Automation", xp: 1980, initials: "NW", badge: "Video" },
 { name: "Kevin O.", track: "Web Development", xp: 1720, initials: "KO", badge: "Code" },
]

const threads = [
 { tag: "Python", title: "Best way to practice loops daily?", author: "Aisha M.", upvotes: 124, replies: 32, color: "lime" },
 { tag: "Design", title: "How do you price a logo as a beginner?", author: "Brian K.", upvotes: 98, replies: 21, color: "pink" },
 { tag: "YouTube", title: "Share your thumbnail hacks here", author: "Neema W.", upvotes: 210, replies: 47, color: "yellow" },
 { tag: "AI", title: "Which AI tools do you use for homework help?", author: "Kevin O.", upvotes: 76, replies: 19, color: "purple" },
 { tag: "Freelance", title: "How did you land your first client?", author: "Faith J.", upvotes: 156, replies: 41, color: "lime" },
 { tag: "Reels", title: "Best free video editing apps in 2026", author: "David T.", upvotes: 88, replies: 17, color: "pink" },
]

export function CommunityClient() {
 const [upvoted, setUpvoted] = useState({})
 const [matched, setMatched] = useState(false)
 const [filter, setFilter] = useState("All")

 function upvote(i) { setUpvoted((p) => ({ ...p, [i]: !p[i] })) }

 return (
 <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
 <PageBackdrop image="/images/bg-about.jpg" position="center 30%" />
 <Navbar />

 {/* HERO */}
 <section style={{ padding: "170px 0 90px", position: "relative" }}>
 <div className="container" style={{ position: "relative", zIndex: 1 }}>
 <span className="eyebrow purple fade-up">Community</span>
 <h1 className="display fade-up fade-up-1" style={{ marginTop: 22, maxWidth: 900 }}>
 Study with <span className="marker purple">your squad.</span>
 </h1>
 <p className="lead fade-up fade-up-2" style={{ maxWidth: 640, marginTop: 22, fontSize: "1.1rem" }}>
 Get matched with a study buddy on the same course. Join silent study lounges. Ask questions and
 upvote answers in our social style forums.
 </p>
 <div className="fade-up fade-up-3" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
 <button onClick={() => setMatched(true)} className="btn btn-lime btn-lg">
 <Icon name="users" size={18} /> Find My Study Buddy
 </button>
 <a href="#lounges" className="btn btn-purple btn-lg" style={{ textDecoration: "none" }}>
 <Icon name="video" size={18} /> Join a Lounge
 </a>
 </div>

 {matched && (
 <div className="card yellow fade-up" style={{ marginTop: 30, padding: 24, maxWidth: 520, display: "flex", gap: 16, alignItems: "center" }}>
 <span style={{
 width: 64, height: 64, borderRadius: "50%", background: "var(--ink)", color: "var(--lime)",
 border: "3px solid var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center",
 fontFamily: "var(--font-display)", fontSize: 22, flexShrink: 0, boxShadow: "4px 4px 0 0 var(--lime)"
 }}>AM</span>
 <div style={{ flex: 1 }}>
 <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16 }}>You matched with Aisha M.</div>
 <div style={{ fontSize: 13, color: "var(--body)" }}>She is on Chapter 4 of Python Programming. Say hi on WhatsApp and schedule your first session.</div>
 </div>
 <a href="https://wa.me/254112272061" className="btn btn-ink btn-sm">Say Hi</a>
 </div>
 )}
 </div>
 </section>

 {/* BUDDY MATCHES */}
 <section className="section band-cream">
 <div className="container">
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
 <div>
 <span className="eyebrow pink">Study Buddies</span>
 <h2 className="title" style={{ marginTop: 16 }}>Meet your peers.</h2>
 </div>
 <span className="xp-chip"><Icon name="users" size={12} /> 500+ learners online</span>
 </div>

 <div className="grid-4">
 {buddies.map((b, i) => (
 <div key={i} className={`card ${i % 2 ? "purple" : "lime"}`} style={{ padding: 22, textAlign: "center" }}>
 <div style={{
 width: 80, height: 80, borderRadius: "50%", margin: "0 auto 14px",
 background: "var(--ink)", color: i % 2 ? "#fff" : "var(--lime)",
 border: "3px solid var(--ink)",
 display: "flex", alignItems: "center", justifyContent: "center",
 fontFamily: "var(--font-display)", fontSize: 28,
 boxShadow: "4px 4px 0 0 var(--ink)",
 }}>{b.initials}</div>
 <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16 }}>{b.name}</div>
 <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4, opacity: 0.9 }}>{b.track}</div>
 <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
 <span className="sticker ink" style={{ fontSize: 10 }}>{b.badge}</span>
 <span className="sticker white" style={{ fontSize: 10 }}>{b.xp} XP</span>
 </div>
 <button onClick={() => setMatched(true)} className="btn btn-ink btn-sm" style={{ marginTop: 14, width: "100%", fontSize: 12 }}>
 Pair Up
 </button>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* GROUP STUDY LOUNGES */}
 <section id="lounges" className="section">
 <div className="container">
 <div style={{ maxWidth: 640, marginBottom: 36 }}>
 <span className="eyebrow purple">Group Study Lounges</span>
 <h2 className="title" style={{ marginTop: 16 }}>Silent co working rooms.</h2>
 <p style={{ marginTop: 12 }}>Hop into a 25 or 50 minute silent room. Cameras on, mics muted, vibe on. Pomodoro timer included.</p>
 </div>

 <div className="grid-3">
 {lounges.map((l, i) => (
 <div key={i} className={`card ${l.color}`} style={{ padding: 24 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
 <span className="sticker white" style={{ fontSize: 10 }}>{l.topic}</span>
 {l.live ? (
 <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, background: "var(--ink)", color: "var(--lime)", padding: "4px 10px", borderRadius: 999, border: "2px solid var(--ink)" }}>
 <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--lime)", animation: "pulseRing 1.5s infinite" }} /> LIVE
 </span>
 ) : (
 <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(10,10,10,0.15)", padding: "4px 10px", borderRadius: 999, border: "2px solid var(--ink)" }}>Scheduled</span>
 )}
 </div>
 <h3 style={{ fontSize: "1.3rem", marginBottom: 6 }}>{l.name}</h3>
 <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginBottom: 18 }}>{l.people} learners in room</div>
 <div className="photo-frame" style={{ aspectRatio: "16/8", marginBottom: 16 }}>
 <Image src="/images/feat-video.jpg" alt="" fill sizes="(min-width:768px) 360px, 90vw" style={{ objectFit: "cover" }} />
 </div>
 <button className="btn btn-ink" style={{ width: "100%" }}>
 {l.live ? "Join Now" : "Set Reminder"}
 </button>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* DISCUSSION THREADS */}
 <section className="section band-purple" style={{ color: "#fff" }}>
 <div className="container">
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
 <div style={{ maxWidth: 640 }}>
 <span className="eyebrow yellow">Discussion Threads</span>
 <h2 className="title on-dark" style={{ marginTop: 16, color: "#fff" }}>Ask. Answer. <span style={{ color: "var(--lime)" }}>Upvote.</span></h2>
 <p style={{ marginTop: 12, color: "rgba(255,255,255,0.85)" }}>A social style forum where the best answers rise to the top. No stupid questions.</p>
 </div>
 <button className="btn btn-lime">Start a Thread</button>
 </div>

 {/* Filter chips */}
 <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
 {["All", "Python", "Design", "YouTube", "AI", "Freelance", "Reels"].map((f) => (
 <button key={f} onClick={() => setFilter(f)} className={`pill ${filter === f ? "pill-lime" : ""}`} style={{ background: filter === f ? "var(--lime)" : "rgba(255,255,255,0.1)", color: "#fff", borderColor: "#fff", cursor: "pointer" }}>
 {f}
 </button>
 ))}
 </div>

 <div className="grid-2">
 {threads.filter(t => filter === "All" || t.tag === filter).map((t, i) => (
 <div key={i} className="thread" style={{ background: "#fff", color: "var(--ink)" }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
 <span className={`sticker ${t.color}`} style={{ fontSize: 10 }}>{t.tag}</span>
 <button onClick={() => upvote(i)} style={{ background: upvoted[i] ? "var(--lime)" : "var(--paper-2)", border: "2px solid var(--ink)", borderRadius: 10, padding: "6px 12px", fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-head)", fontSize: 12 }}>
 {t.upvotes + (upvoted[i] ? 1 : 0)}
 </button>
 </div>
 <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, marginTop: 12, lineHeight: 1.3 }}>{t.title}</h3>
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "var(--muted)", marginTop: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
 <span>by {t.author}</span>
 <span>{t.replies} replies</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <PhotoBand
 eyebrow="Bring a friend"
 title="Learning hits different with a squad."
 body="Invite a friend and you both earn 200 bonus XP when they complete their first lesson."
 tone="pink"
 centered
 >
 <button className="btn btn-lime btn-lg">
 <Icon name="heart" size={18} /> Invite a Friend
 </button>
 <Link href="/courses" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
 Browse Courses
 </Link>
 </PhotoBand>

 <Footer />
 <Chatbot />
 </main>
 )
}
