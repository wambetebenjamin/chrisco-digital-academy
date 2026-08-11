import Link from "next/link"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import Icon from "../components/Icon"
import PhotoHero from "../components/PhotoHero"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"

export const metadata = {
 title: "About Us",
 description:
 "CHRISCO Digital Academy is a youth focused learning platform under CHRISCO Youth Aflame. We bridge the digital divide with practical, affordable digital skills training across Africa.",
}

const stats = [
 { number: "500+", label: "Youth Trained", color: "lime" },
 { number: "11", label: "Skill Courses", color: "purple" },
 { number: "5+", label: "Counties Reached", color: "pink" },
 { number: "100%", label: "Practical Skills", color: "yellow" },
]

const skillTags = [
 { icon: "cap", label: "Certified" },
 { icon: "palette", label: "Design" },
 { icon: "code", label: "Code" },
 { icon: "clapper", label: "Video" },
 { icon: "robot", label: "AI" },
]

const values = [
 { icon: "globe", title: "Accessible", desc: "Affordable, beginner friendly learning for every young person in Africa.", color: "lime" },
 { icon: "wrench", title: "Practical", desc: "Every course ends with a real project you can show and sell.", color: "purple" },
 { icon: "users", title: "Mentorship", desc: "Learn directly from working professionals who live these skills every day.", color: "pink" },
 { icon: "flame", title: "Community", desc: "Join a growing family of young creators, coders and entrepreneurs.", color: "yellow" },
]

export default function About() {
 return (
 <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
 <PageBackdrop image="/images/bg-about.jpg" position="center 35%" />
 <Navbar />

 {/* HERO */}
 <section style={{ padding: "170px 0 80px", position: "relative" }}>
 <div className="container" style={{ position: "relative", zIndex: 1 }}>
 <span className="eyebrow purple fade-up">About us</span>
 <h1 className="display fade-up fade-up-1" style={{ marginTop: 22, maxWidth: 960 }}>
 Building Africa&apos;s <span className="outline on-dark">digital</span>{" "}
 <span className="accent-bright">future.</span>
 </h1>
 <p className="lead fade-up fade-up-2" style={{ maxWidth: 680, marginTop: 24, fontSize: "1.1rem" }}>
 CHRISCO Digital Academy is a youth focused learning platform under CHRISCO Youth Aflame. We equip
 young Africans with practical digital skills that open real doors.
 </p>
 </div>
 </section>

 {/* STATS */}
 <section className="band-cream" style={{ padding: "40px 0" }}>
 <div className="container">
 <div className="grid-4">
 {stats.map((s, i) => (
 <div key={i} className={`card ${s.color}`} style={{ padding: "22px 24px", textAlign: "center" }}>
 <div className="stat-num" style={{ color: s.color === "yellow" || s.color === "lime" ? "var(--ink)" : "inherit" }}>{s.number}</div>
 <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>
 {s.label}
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* WHO WE ARE */}
 <section className="section">
 <div className="container">
 <div className="split">
 <div>
 <span className="eyebrow">Who we are</span>
 <h2 className="title" style={{ marginTop: 18 }}>
 Born from a passion to see <span className="marker">youth thrive.</span>
 </h2>
 <p className="lead" style={{ marginTop: 22 }}>
 We exist to bridge the digital divide. Too many young people have talent and ambition but not the
 practical skills to turn them into income. CHRISCO Digital Academy fixes that.
 </p>
 <p className="lead" style={{ marginTop: 16 }}>
 Our team blends working professionals across graphic design, web development, video editing, animation,
 social media and AI, all committed to passing on real world skills to the next generation of African
 creators and builders.
 </p>
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
 {skillTags.map((t, i) => (
 <span key={t.label} className={`sticker ${["lime","purple","pink","yellow","lime"][i % 5]}`}>
 <Icon name={t.icon} size={12} strokeWidth={2.4} /> {t.label}
 </span>
 ))}
 </div>
 </div>

 <div style={{ position: "relative" }}>
 <div className="photo-frame tilt-right" style={{ aspectRatio: "4/4.2" }}>
 <Image
 src="/images/hero-tile.jpg"
 alt="Learner at CHRISCO Digital Academy"
 fill
 sizes="(min-width: 768px) 46vw, 92vw"
 style={{ objectFit: "cover" }}
 />
 <span className="tape purple" style={{ top: -12, left: 40 }} />
 </div>
 <span className="sticker ink" style={{ position: "absolute", top: 18, left: 18 }}>
 <Icon name="pin" size={12} strokeWidth={2.4} /> Made in Kenya
 </span>
 </div>
 </div>
 </div>
 </section>

 {/* MISSION & VISION */}
 <section className="section band-yellow">
 <div className="container">
 <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
 <span className="eyebrow purple">Our purpose</span>
 <h2 className="title" style={{ marginTop: 18 }}>
 Mission &amp; vision.
 </h2>
 </div>

 <div className="grid-2" style={{ alignItems: "stretch" }}>
 <div className="card purple" style={{ padding: "44px 36px", position: "relative", overflow: "hidden" }}>
 <span style={{ display: "inline-flex", width: 64, height: 64, borderRadius: 18, background: "var(--lime)", color: "var(--ink)", alignItems: "center", justifyContent: "center", marginBottom: 22, border: "3px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)" }}>
 <Icon name="target" size={30} strokeWidth={1.8} />
 </span>
 <h3 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.5rem", marginBottom: 14 }}>OUR MISSION</h3>
 <p style={{ color: "rgba(255,255,255,0.92)", lineHeight: 1.75, fontSize: "1.02rem" }}>
 To bridge the digital divide by providing accessible, affordable and practical digital education
 to youth across Kenya and beyond.
 </p>
 </div>

 <div className="card pink" style={{ padding: "44px 36px" }}>
 <span style={{ display: "inline-flex", width: 64, height: 64, borderRadius: 18, background: "#fff", color: "var(--ink)", alignItems: "center", justifyContent: "center", marginBottom: 22, border: "3px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)" }}>
 <Icon name="globe" size={30} strokeWidth={1.8} />
 </span>
 <h3 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.5rem", marginBottom: 14 }}>OUR VISION</h3>
 <p style={{ color: "rgba(255,255,255,0.95)", lineHeight: 1.75, fontSize: "1.02rem" }}>
 A generation of digitally empowered African youth creating solutions, building businesses and
 leading transformation across the continent.
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* VALUES */}
 <section className="section band-cream">
 <div className="container">
 <div style={{ maxWidth: 620, marginBottom: 48 }}>
 <span className="eyebrow pink">What we stand for</span>
 <h2 className="title" style={{ marginTop: 18 }}>
 Values behind <span className="marker pink">every course.</span>
 </h2>
 </div>
 <div className="grid-4">
 {values.map((v, i) => (
 <div key={i} className={`card ${v.color}`} style={{ padding: "28px 24px" }}>
 <span style={{ display: "inline-flex", width: 54, height: 54, borderRadius: 16, background: v.color === "purple" || v.color === "pink" ? "rgba(255,255,255,0.2)" : "var(--ink)", color: v.color === "purple" || v.color === "pink" ? "#fff" : "var(--lime)", alignItems: "center", justifyContent: "center", marginBottom: 16, border: "2.5px solid var(--ink)", boxShadow: "3px 3px 0 0 var(--ink)" }}>
 <Icon name={v.icon} size={24} />
 </span>
 <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8 }}>{v.title}</h3>
 <p style={{ fontSize: 13.5, lineHeight: 1.6, color: v.color === "purple" || v.color === "pink" ? "rgba(255,255,255,0.9)" : "var(--body)" }}>{v.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* MOVEMENT */}
 <section className="section band-ink" style={{ color: "#fff" }}>
 <div className="container">
 <div className="split" style={{ alignItems: "center" }}>
 <div>
 <span className="eyebrow" style={{ background: "var(--pink)", color: "#fff" }}>CHRISCO Youth Aflame</span>
 <h2 className="display on-dark" style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", marginTop: 20 }}>
 A youth <span style={{ color: "var(--lime)" }}>movement.</span>
 </h2>
 <p style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", margin: "14px 0 22px" }}>
 Faith · Skills · Community · Impact
 </p>
 <p className="lead on-dark" style={{ maxWidth: 540 }}>
 CHRISCO Digital Academy is run by CHRISCO Youth Aflame, a community of young people using creativity,
 faith and digital skills to build a brighter future across Kenya and Africa. Every course, every
 study room and every badge is built by youth, for youth.
 </p>
 <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "28px 0 34px" }}>
 {["Graphic Design", "Web Development", "Video Editing", "Animation", "Social Media", "AI"].map((t, i) => (
 <span key={t} className={`sticker ${["lime","yellow","pink","purple","lime","yellow"][i]}`} style={{ fontSize: 10 }}>{t}</span>
 ))}
 </div>
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
 <Link href="/contact" className="btn btn-lime btn-lg" style={{ textDecoration: "none" }}>
 Get in Touch
 </Link>
 <Link href="/community" className="btn btn-outline-light btn-lg" style={{ textDecoration: "none" }}>
 Join Community
 </Link>
 </div>
 </div>
 <div style={{ position: "relative" }}>
 <div className="photo-frame tilt-left" style={{ aspectRatio: "4/4.3" }}>
 <Image
 src="/images/workspace.jpg"
 alt="CHRISCO youth learning together"
 fill
 sizes="(min-width: 768px) 46vw, 92vw"
 style={{ objectFit: "cover" }}
 />
 <span className="tape" style={{ top: -12, right: 30, transform: "rotate(8deg)" }} />
 </div>
 <div className="card lime" style={{ position: "absolute", left: 20, bottom: 20, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center" }}>
 <Icon name="flame" size={22} />
 <div>
 <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13 }}>By youth, for youth</div>
 <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Nairobi, Kenya</div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 <PhotoBand
 eyebrow="Join the movement"
 title="Your future is digital. Let's build it together."
 tone="purple"
 centered
 >
 <Link href="/courses" className="btn btn-lime btn-lg" style={{ textDecoration: "none" }}>
 Explore Courses
 </Link>
 <a href="https://wa.me/254112272061" className="btn btn-pink btn-lg" style={{ textDecoration: "none" }}>
 <Icon name="whatsapp" size={18} /> WhatsApp Us
 </a>
 </PhotoBand>

 <Footer />
 <Chatbot />
 </main>
 )
}
