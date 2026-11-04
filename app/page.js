"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "./Navbar"
import Footer from "./components/Footer"
import Chatbot from "./Chatbot"
import Icon from "./components/Icon"
import { courses, categories, categoryCounts } from "./data/courses"

const skills = [
  { num: "01", icon: "palette", title: "Graphic Design", desc: "Branding, posters and visual identity with Canva and Adobe tools." },
  { num: "02", icon: "code", title: "Web Development", desc: "Modern websites and apps with HTML, CSS, JavaScript, React & Next.js." },
  { num: "03", icon: "smartphone", title: "Social Media", desc: "Strategy, content creation and growth that gets real engagement." },
  { num: "04", icon: "clapper", title: "Video Editing", desc: "Cinematic edits for YouTube, Reels and events — a skill in demand." },
  { num: "05", icon: "layers", title: "Animation", desc: "Motion graphics and animated content that stops the scroll." },
  { num: "06", icon: "robot", title: "AI Expertise", desc: "Leveraging AI tools like ChatGPT for creativity and productivity." },
]

const stats = [
  { value: "500+", label: "Youth Trained" },
  { value: "19", label: "Courses" },
  { value: "2", label: "Districts" },
  { value: "100%", label: "Practical" },
]

const featured = [courses[4], courses[0], courses[10]]

const steps = [
  { num: "01", icon: "search", title: "Browse & Choose", desc: "Pick from 19 practical courses across business, design, code, marketing, writing, video and AI." },
  { num: "02", icon: "clipboard", title: "Enroll in Minutes", desc: "Send an enrollment request — we confirm on WhatsApp or email within a day." },
  { num: "03", icon: "rocket", title: "Learn & Earn", desc: "Follow the hands-on syllabus, finish your project, build your portfolio — and start earning." },
]

const heroSlides = [
  {
    image: "/images/bg-home.jpg",
    eyebrow: "From Jinja to the World",
    title: "Empowering Youth,",
    accent: "Transforming Futures",
    lead: "CHRISCO Digital Academy is a modern learning platform for African youth — practical courses in design, code, marketing, writing, video and AI.",
  },
  {
    image: "/images/bg-about.jpg",
    eyebrow: "One Community, Endless Possibilities",
    title: "Youth inspiring",
    accent: "change beyond boundaries",
    lead: "Learn practical skills that actually pay. 19 courses, hands-on projects, mentorship from Wambete Benjamin and the CHRISCO Youth Aflame team.",
  },
  {
    image: "/images/bg-courses.jpg",
    eyebrow: "Building stronger futures",
    title: "Design, Code &",
    accent: "AI Skills",
    lead: "Education, creativity and mentorship — bridging the digital divide for the next generation of African creators and builders.",
  },
]

export default function Home() {
  const counts = categoryCounts()
  const [activeSlide, setActiveSlide] = useState(0)

  // auto-advance like KYN swiper
  useEffect(() => {
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % heroSlides.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", background: "#FAF9F6" }}>
      <Navbar />
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (max-width: 1100px){ .kyn-projects{grid-template-columns: repeat(2,1fr) !important;} }
          @media (max-width: 640px){ 
            .kyn-projects{grid-template-columns: 1fr !important;}
            .kyn-testimonials{grid-template-columns: 1fr !important;}
            .kyn-blog-grid{grid-template-columns: 1fr !important;}
            .kyn-gallery{grid-template-columns: repeat(2,1fr) !important;}
            .grid-3{grid-template-columns: 1fr !important;}
            .kyn-about{grid-template-columns: 1fr !important;}
            .kyn-tours{grid-template-columns: 1fr !important;}
            .split{grid-template-columns: 1fr !important;}
            .kyn-stats{grid-template-columns: repeat(2,1fr) !important;}
            .kyn-cta-pair{grid-template-columns: 1fr !important;}
          }
          @media (max-width: 900px){ .kyn-about{grid-template-columns:1fr !important;} }
          @media (max-width: 640px){ .wpo-about.kyn-about{grid-template-columns:1fr !important;} .kyn-tours-media{min-height:220px !important;} }
          `,
        }}
      />

      {/* ================= KYN HERO SLIDER ================= */}
      <section className="aidus-hero wpo-hero-slider-s2 wpo-hero-slider-s5" style={{ position: "relative", background: "#0f2521" }}>
        <div className="swiper-container">
          <div className="swiper-wrapper" style={{ position: "relative", height: "auto" }}>
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className="swiper-slide"
                style={{
                  display: i === activeSlide ? "block" : "none",
                  animation: i === activeSlide ? "fadeIn 0.6s ease" : "none",
                }}
              >
                <div
                  className="slide-inner slide-bg-image"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: 560,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    padding: "72px 0",
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(112deg, rgba(24,50,46,0.92) 0%, rgba(24,50,46,0.72) 48%, rgba(24,50,46,0.28) 100%)",
                    }}
                  />
                  <div className="container-fluid" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
                    <div className="slide-content" style={{ maxWidth: 640, color: "#fff" }}>
                      <div data-swiper-parallax="300" className="slide-title" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFD9CF", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", padding: "7px 14px", borderRadius: 999, backdropFilter: "blur(8px)", marginBottom: 18 }}>
                        <span>{slide.eyebrow}</span>
                      </div>
                      <div data-swiper-parallax="400" className="slide-sub-title">
                        <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(2.2rem, 5.2vw, 3.8rem)", lineHeight: 0.98, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                          {slide.title} <span className="text" style={{ color: "#F74F22" }}>{slide.accent}</span>
                        </h2>
                        <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.78)", marginTop: 18, maxWidth: 560 }}>{slide.lead}</p>
                      </div>
                      <div data-swiper-parallax="500" className="slide-btns" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
                        <div className="btn-wrap">
                          <Link href="/about" className="theme-btn" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "14px 28px", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                            About Us
                          </Link>
                        </div>
                        <a className="call" href="tel:+254112272061" style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", padding: "10px 18px 10px 12px", borderRadius: 999, color: "#fff", textDecoration: "none" }}>
                          <div className="icon" style={{ width: 36, height: 36, borderRadius: "50%", background: "#F74F22", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon name="phone" size={15} />
                          </div>
                          <div className="text" style={{ textAlign: "left" }}>
                            <h3 style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", margin: 0, fontWeight: 700 }}>Call Us Now</h3>
                            <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, color: "#fff" }}>+254 112 272 061</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="swiper-pagination" style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: activeSlide === i ? 28 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: activeSlide === i ? "#F74F22" : "rgba(255,255,255,0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all .3s ease",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
            className="swiper-button-prev"
            aria-label="Previous slide"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}
          >
            ‹
          </button>
          <button
            onClick={() => setActiveSlide((s) => (s + 1) % heroSlides.length)}
            className="swiper-button-next"
            aria-label="Next slide"
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}
          >
            ›
          </button>
        </div>
      </section>

      {/* ================= KYN 4 FEATURES — CHRISCO SKILLS ================= */}
      <section className="section" style={{ background: "#FAF9F6", padding: "64px 0 56px" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="wpo-feature kyn-features">
            {skills.slice(0, 4).map((s) => (
              <div key={s.title} className="feature-card kyn-feature" style={{ background: "#fff", border: "1px solid #E8EDE9", borderRadius: 16, padding: "28px 24px", boxShadow: "0 1px 3px rgba(24,50,46,0.06)" }}>
                <div className="icon" style={{ width: 56, height: 56, borderRadius: 14, background: "#FFF0EB", color: "#F74F22", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={s.icon} size={24} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, color: "#061408", margin: "0 0 8px" }}>
                  <a href="#">{s.title}</a>
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "#5A6A62", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXPLORE BY CATEGORY — KYN PARTNERS STRIP ================= */}
      <section className="aidus-partners partners-section" style={{ background: "#fff", borderTop: "1px solid #E8EDE9", borderBottom: "1px solid #E8EDE9", padding: "28px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#5A6A62" }}>Explore by Category</span>
            <div className="partners-slider" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {categories.map((cat) => (
                <Link key={cat.name} href="/courses" className="pill" style={{ background: "#FAF9F6", borderColor: "#E8EDE9", color: "#061408", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 999, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name={cat.icon} size={14} /> {cat.name} <span style={{ background: "#18322E", color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 11 }}>{counts[cat.name] || 0}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT — KYN About style ================= */}
      <section className="section" style={{ background: "#fff", padding: "88px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="wpo-about kyn-about" style={{ display: "grid", gap: 56, gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
            {/* Media collage — keep CHRISCO assets */}
            <div className="kyn-about-media" style={{ position: "relative" }}>
              <div className="kyn-about-media-main" style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "4/3.1", border: "1px solid #E8EDE9", boxShadow: "0 12px 32px rgba(24,50,46,0.08)" }}>
                <Image src="/images/hero-tile.jpg" alt="Learner at CHRISCO Digital Academy" fill sizes="(min-width: 900px) 560px, 92vw" style={{ objectFit: "cover" }} />
                <span className="kyn-about-badge" style={{ position: "absolute", top: 18, left: 18, background: "#18322E", color: "#fff", padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <Icon name="pin" size={13} /> Made in Uganda
                </span>
              </div>
              {/* Since badge */}
              <div className="kyn-about-since" style={{ position: "absolute", right: -14, bottom: 28, background: "#fff", border: "1px solid #E8EDE9", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 12px 32px rgba(24,50,46,0.10)" }}>
                <span style={{ width: 48, height: 48, borderRadius: 12, background: "#FFF0EB", color: "#F74F22", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>WB</span>
                <div>
                  <strong style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, color: "#061408", lineHeight: 1, display: "block" }}>500+</strong>
                  <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6A62", fontWeight: 700 }}>Youth Impacted</span>
                </div>
              </div>
              {/* Decorative blur */}
              <div aria-hidden style={{ position: "absolute", top: -18, right: -18, width: 120, height: 120, background: "rgba(247,79,34,0.10)", borderRadius: "50%", filter: "blur(32px)", zIndex: -1 }} />
            </div>

            {/* Content */}
            <div className="right-content">
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: "#F74F22", margin: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Image src="https://kibrayouthnetwork.org/wp-content/uploads/2024/11/healthcare.svg" alt="" width={18} height={18} style={{ width: 18, height: 18 }} />
                Kibra Youth Network · CHRISCO Digital Academy
              </h2>
              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", lineHeight: 1.08, color: "#061408", margin: "10px 0 0" }}>
                Empowering Youth, Building Stronger <span style={{ color: "#F74F22" }}>Communities</span>
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "#2E3B35", marginTop: 16 }}>
                Helping young people unlock potential creates a brighter future for all. At CHRISCO Digital Academy, under CHRISCO Youth Aflame, we provide practical digital education, mentorship, life skills, and community-driven opportunities. By equipping youth with knowledge, resilience, and creativity, we inspire transformation that extends beyond Jinja to the world.
              </p>
              <div className="about-tab" style={{ marginTop: 22 }}>
                <div className="tab-wrap" style={{ display: "flex", gap: 18, alignItems: "center" }}>
                  <div className="left" style={{ position: "relative", width: 140, height: 92, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "1px solid #E8EDE9" }}>
                    <Image src="/images/workspace.jpg" alt="Workspace" fill style={{ objectFit: "cover" }} />
                    <a href="/about" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(24,50,46,0.32)" }}>
                      <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#F74F22", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="play" size={14} />
                      </span>
                    </a>
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 13.5, color: "#061408" }}>
                      <Icon name="checkCircle" size={16} style={{ color: "#F74F22" }} /> Empowering 500+ Youth
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 13.5, color: "#061408" }}>
                      <Icon name="checkCircle" size={16} style={{ color: "#F74F22" }} /> 19 Creative & Skills Courses
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 13.5, color: "#061408" }}>
                      <Icon name="checkCircle" size={16} style={{ color: "#F74F22" }} /> Recognized Youth Organization
                    </li>
                  </ul>
                </div>
              </div>
              <div className="author-wrap" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginTop: 28, paddingTop: 22, borderTop: "1px solid #E8EDE9" }}>
                <ul className="author-img" style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
                  <li style={{ marginLeft: 0, border: "2px solid #fff", borderRadius: "50%", overflow: "hidden", width: 42, height: 42, display: "block" }}>
                    <Image src="/images/hero-tile.jpg" alt="" width={42} height={42} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </li>
                  <li style={{ marginLeft: -10, border: "2px solid #fff", borderRadius: "50%", overflow: "hidden", width: 42, height: 42 }}>
                    <Image src="/images/workspace.jpg" alt="" width={42} height={42} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </li>
                  <li style={{ marginLeft: -10, border: "2px solid #fff", borderRadius: "50%", overflow: "hidden", width: 42, height: 42 }}>
                    <Image src="/images/bg-about.jpg" alt="" width={42} height={42} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </li>
                </ul>
                <div className="author-text" style={{ fontWeight: 800, color: "#061408" }}>
                  500+ Youth Impacted
                  <div className="shape" style={{ marginTop: 6, opacity: 0.6 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6A62" }}>Trusted by learners in 2 districts</span>
                  </div>
                </div>
                <a className="contact" href="tel:+254112272061" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 10, background: "#FAF9F6", border: "1px solid #E8EDE9", borderRadius: 999, padding: "10px 16px", textDecoration: "none" }}>
                  <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#18322E", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="phone" size={14} />
                  </span>
                  <span>
                    <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6A62", fontWeight: 700, display: "block" }}>Phone:</span>
                    <span style={{ fontWeight: 800, color: "#061408", fontSize: 13 }}>+254 112 272 061</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR PROJECTS — KYN What we are building ================= */}
      <section className="section" style={{ background: "#FAF9F6", padding: "88px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-title section-title-s3 kyn-h1-title" style={{ textAlign: "left", maxWidth: 560, margin: "0 0 40px" }}>
            <span className="subtitle" style={{ color: "#F74F22", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12 }}>Our projects</span>
            <h1 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.08, color: "#061408", margin: 0 }}>
              What we are <span style={{ color: "#F74F22" }}>building</span> in Jinja
            </h1>
          </div>

          <div className="kyn-projects" style={{ display: "grid", gap: 22, gridTemplateColumns: "repeat(4, 1fr)" }}>
            {featured.map((c) => (
              <div key={c.id} className="kyn-project" style={{ background: "#fff", border: "1px solid #E8EDE9", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(24,50,46,0.06)", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#E8EDE9" }}>
                  <Image src={c.img} alt={c.title} fill sizes="(min-width: 1100px) 300px, 92vw" style={{ objectFit: "cover" }} />
                </div>
                <div className="kyn-project-body" style={{ padding: "18px 18px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, color: "#061408", margin: "0 0 8px" }}>{c.title}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#5A6A62", margin: "0 0 14px", flex: 1 }}>{c.desc}</p>
                  <Link href={`/courses?course=${c.id}`} style={{ fontWeight: 700, fontSize: 13, color: "#F74F22", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Learn more <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
            {/* Fourth card — Poultry / Shop like KYN */}
            <div className="kyn-project" style={{ background: "#fff", border: "1px solid #E8EDE9", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(24,50,46,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#E8EDE9" }}>
                <Image src="/images/bg-cta.jpg" alt="CHRISCO Shop" fill sizes="(min-width: 1100px) 300px, 92vw" style={{ objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 12, left: 12, background: "#F74F22", color: "#fff", fontWeight: 800, fontSize: 11, padding: "6px 10px", borderRadius: 999 }}>PURSUE Shop</span>
              </div>
              <div className="kyn-project-body" style={{ padding: "18px 18px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, color: "#061408", margin: "0 0 8px" }}>PURSUE Merchandise</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#5A6A62", margin: "0 0 14px", flex: 1 }}>Wear the word — statement tees, hoodies and polos from CHRISCO Youth Aflame.</p>
                <Link href="/shop" style={{ fontWeight: 700, fontSize: 13, color: "#F74F22", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Visit shop <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/courses" className="theme-btn" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "14px 28px", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              See all courses →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS — keep CHRISCO 3 steps ================= */}
      <section className="section" style={{ background: "#fff", padding: "88px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ color: "#F74F22", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12 }}>How it works</span>
            <h2 className="title" style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", color: "#061408", marginTop: 16 }}>
              From zero to earning — <span className="accent" style={{ color: "#F74F22" }}>in 3 steps</span>
            </h2>
          </div>

          <div className="grid-3" style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(3, 1fr)", alignItems: "stretch" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div className="card card-hover" style={{ padding: "34px 30px", height: "100%", background: "#FAF9F6", border: "1px solid #E8EDE9", borderRadius: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                    <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "2.2rem", color: "#F74F22" }}>{step.num}</span>
                    <span style={{ color: "#18322E" }}>
                      <Icon name={step.icon} size={30} strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.1rem", color: "#061408", marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "#5A6A62", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <span className="hide-mobile" style={{ position: "absolute", top: "50%", right: -16, zIndex: 2, color: "#E8EDE9", fontSize: "1.4rem", transform: "translateY(-50%)" }}>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= KIBERA TOURS — repurposed as Jinja / Campus ================= */}
      <section className="section" style={{ background: "#FAF9F6", padding: "64px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="kyn-tours" style={{ display: "grid", gap: 0, gridTemplateColumns: "1.15fr 1fr", background: "#fff", border: "1px solid #E8EDE9", borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 32px rgba(24,50,46,0.08)" }}>
            <div className="kyn-tours-media" style={{ position: "relative", minHeight: 380, background: "#E8EDE9" }}>
              <Image src="/images/bg-cta.jpg" alt="Jinja community" fill sizes="(min-width: 900px) 640px, 92vw" style={{ objectFit: "cover" }} />
            </div>
            <div className="kyn-tours-body" style={{ padding: "36px 32px" }}>
              <h3 style={{ fontWeight: 800, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#F74F22", margin: "0 0 10px" }}>Visit Us in Jinja</h3>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.1, color: "#061408", margin: "0 0 14px" }}>
                See CHRISCO <span style={{ color: "#F74F22" }}>with local youth</span>
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#2E3B35", margin: "0 0 18px" }}>
                Take a campus walk led by young people who learn here. Meet traders and artisans, visit CHRISCO projects and hear real stories behind Jinja, told with respect.
              </p>
              <ul style={{ listStyle: "none", margin: "0 0 22px", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 600, color: "#061408" }}>
                  <Icon name="check" size={14} style={{ color: "#F74F22" }} /> Led by local youth guides
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 600, color: "#061408" }}>
                  <Icon name="check" size={14} style={{ color: "#F74F22" }} /> Small groups, hands-on demos
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 600, color: "#061408" }}>
                  <Icon name="check" size={14} style={{ color: "#F74F22" }} /> Open to visitors, schools and groups
                </li>
              </ul>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="https://wa.me/254112272061" className="theme-btn" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "12px 20px", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="whatsapp" size={16} /> Book on WhatsApp
                </a>
                <Link href="/about" style={{ background: "#fff", border: "1.5px solid #E8EDE9", color: "#061408", borderRadius: 999, padding: "12px 20px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Tour details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOUNDER — dark with KYN overlay ================= */}
      <section className="section section-navy" style={{ position: "relative", overflow: "hidden", background: "#18322E", color: "rgba(255,255,255,0.72)", padding: "88px 0" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
          <Image src="/images/bg-about.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="split" style={{ display: "grid", gap: 56, gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark" style={{ color: "#FFD9CF", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12 }}>Meet the founder</span>
              <h2 className="display on-dark" style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.4rem)", marginTop: 18, color: "#fff", lineHeight: 1 }}>
                Wambete <span className="accent-bright" style={{ color: "#F74F22" }}>Benjamin</span>
              </h2>
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "14px 0 24px" }}>
                CS Graduate · Designer · Developer · Video Editor · AI Expert
              </p>
              <p className="lead on-dark" style={{ maxWidth: 520, color: "rgba(255,255,255,0.72)", fontSize: "1.02rem", lineHeight: 1.7 }}>
                Founder of CHRISCO Digital Academy under CHRISCO Youth Aflame. He built this platform so that every young person in Africa can learn real, practical digital skills — and turn them into real income.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "28px 0 36px" }}>
                {["Graphic Design", "Web Development", "Video Editing", "Animation", "Social Media", "AI"].map((t) => (
                  <span key={t} className="pill pill-dark pill-sm" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.85)", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-green" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "14px 28px", fontWeight: 800, textDecoration: "none" }}>
                  Get In Touch →
                </Link>
                <Link href="/about" className="btn btn-outline-light" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff", borderRadius: 999, padding: "14px 28px", textDecoration: "none" }}>
                  Read Our Story
                </Link>
              </div>
            </div>

            <div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", aspectRatio: "4/3.2", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Image src="/images/workspace.jpg" alt="Creative workspace — design, code and video" fill sizes="(min-width: 768px) 46vw, 92vw" style={{ objectFit: "cover" }} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    bottom: 20,
                    background: "rgba(24,50,46,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 16,
                    padding: "14px 18px",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#F74F22" }}>
                    <Icon name="laptop" size={26} strokeWidth={1.7} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "#fff", fontSize: 13.5 }}>7+ skill areas</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>taught hands-on</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS — Voices of Change ================= */}
      <section className="section" style={{ background: "#FAF9F6", padding: "88px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 48px" }}>
            <span className="eyebrow" style={{ color: "#F74F22", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12, justifyContent: "center", display: "inline-flex", alignItems: "center", gap: 8 }}>Together, We Transform Lives</span>
            <h2 className="title" style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", color: "#061408", marginTop: 12, lineHeight: 1.08 }}>
              Voices of Change <span style={{ color: "#F74F22" }}>From Our Community</span>
            </h2>
          </div>
          <div className="kyn-testimonials" style={{ display: "grid", gap: 22, gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { quote: "Thanks to CHRISCO Digital Academy, I gained confidence and digital skills that helped me get through tough times.", name: "Sarah A.", role: "Youth Participant", img: "/images/hero-tile.jpg" },
              { quote: "Through their creative skills training, I learned graphic design and now earn from my work. This program changed my future.", name: "Brian O.", role: "Beneficiary", img: "/images/workspace.jpg" },
              { quote: "CHRISCO supported my learning when I couldn't afford it. Today, I'm building my career and thriving.", name: "Jane M.", role: "Parent", img: "/images/bg-about.jpg" },
            ].map((t, i) => (
              <div key={i} className="kyn-quote" style={{ background: "#fff", border: "1px solid #E8EDE9", borderRadius: 16, padding: "24px 22px", boxShadow: "0 1px 3px rgba(24,50,46,0.06)" }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#2E3B35", margin: "0 0 18px", fontStyle: "italic" }}>"{t.quote}"</p>
                <div className="meta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: "2px solid #E8EDE9", flexShrink: 0 }}>
                    <Image src={t.img} alt="" width={44} height={44} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <strong style={{ display: "block", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13.5, color: "#061408" }}>{t.name}</strong>
                    <span style={{ fontSize: 12, color: "#5A6A62" }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS — KYN Author style + original stats ================= */}
      <section className="section" style={{ background: "#fff", padding: "56px 0", borderTop: "1px solid #E8EDE9", borderBottom: "1px solid #E8EDE9" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="kyn-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: "18px 12px", borderRight: i < stats.length - 1 ? "1px solid #E8EDE9" : "none" }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "2rem", color: "#061408", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6A62", fontWeight: 700, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY + 2 CTAs — KYN Gallery ================= */}
      <section className="section" style={{ background: "#FAF9F6", padding: "88px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#F74F22" }}>Moments from Jinja</span>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "2rem", color: "#061408", margin: "8px 0 0" }}>
                Our <span style={{ color: "#F74F22" }}>Gallery</span>
              </h2>
            </div>
            <Link href="/about" style={{ fontWeight: 700, fontSize: 13, color: "#F74F22", textDecoration: "none" }}>
              View the gallery →
            </Link>
          </div>

          <div className="kyn-gallery" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(4, 1fr)" }}>
            {["/images/hero-tile.jpg", "/images/workspace.jpg", "/images/bg-about.jpg", "/images/bg-courses.jpg", "/images/cat-design.jpg", "/images/cat-coding.jpg", "/images/cat-video.jpg", "/images/cat-marketing.jpg"].slice(0, 4).map((src, i) => (
              <a key={i} href="/about" style={{ display: "block", borderRadius: 12, overflow: "hidden", aspectRatio: "1.15", border: "1px solid #E8EDE9" }}>
                <Image src={src} alt="" width={400} height={400} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </a>
            ))}
          </div>

          <div className="kyn-cta-pair" style={{ display: "grid", gap: 22, gridTemplateColumns: "1fr 1fr", marginTop: 28 }}>
            <div style={{ background: "#18322E", borderRadius: 16, padding: "28px 24px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, color: "#fff" }}>Want To Volunteer?</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 4 }}>Share your skills with young learners.</div>
              </div>
              <Link href="/contact" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "10px 18px", fontWeight: 800, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
                Contact With us →
              </Link>
            </div>
            <div style={{ background: "#F74F22", borderRadius: 16, padding: "28px 24px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, color: "#fff" }}>Help a Child Learn</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>Sponsor a practical skills handbook.</div>
              </div>
              <Link href="/library" style={{ background: "#fff", color: "#061408", borderRadius: 999, padding: "10px 18px", fontWeight: 800, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
                Make an Impact →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LATEST ARTICLES — blog style but with courses ================= */}
      <section className="section" style={{ background: "#fff", padding: "88px 0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 48px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#F74F22" }}>Hope, Support, and Love for All.</span>
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#061408", marginTop: 12 }}>our latest articles, news & blogs you need</h2>
          </div>
          <div className="kyn-blog-grid" style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(3, 1fr)" }}>
            {featured.map((c) => (
              <div key={c.id} className="kyn-post" style={{ background: "#fff", border: "1px solid #E8EDE9", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(24,50,46,0.06)" }}>
                <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#E8EDE9" }}>
                  <Image src={c.img} alt={c.title} fill sizes="400px" style={{ objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: 12, left: 12, background: "#fff", color: "#061408", fontWeight: 700, fontSize: 11, padding: "6px 10px", borderRadius: 999, boxShadow: "0 4px 12px rgba(24,50,46,0.10)" }}>{c.category} · {c.level}</span>
                </div>
                <div className="kyn-post-body" style={{ padding: "18px 18px 16px" }}>
                  <div className="kyn-post-meta" style={{ display: "flex", gap: 12, fontSize: 12, color: "#5A6A62", marginBottom: 10 }}>
                    <span>04 Nov 2026</span>
                    <span>·</span>
                    <a href="/courses" style={{ color: "#5A6A62", textDecoration: "none" }}>
                      Comments (0)
                    </a>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, color: "#061408", margin: "0 0 10px", lineHeight: 1.35 }}>
                    <Link href={`/courses?course=${c.id}`} style={{ color: "#061408", textDecoration: "none" }}>
                      {c.title}: {c.desc.slice(0, 48)}...
                    </Link>
                  </h3>
                  <Link href={`/courses?course=${c.id}`} className="read-more" style={{ fontWeight: 700, fontSize: 13, color: "#F74F22", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA — keep assets but KYN promo style ================= */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: "#18322E", padding: "88px 0" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image src="/images/bg-cta.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(24,50,46,0.96) 8%, rgba(24,50,46,0.84) 55%, rgba(24,50,46,0.72) 100%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <span className="eyebrow on-dark" style={{ color: "#FFD9CF", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12 }}>Start today</span>
          <h2 className="display on-dark" style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.9rem, 4.2vw, 3.1rem)", color: "#fff", marginTop: 14, lineHeight: 1.08 }}>
            Ready to build your <span style={{ color: "#F74F22" }}>digital career?</span>
          </h2>
          <p style={{ marginTop: 16, fontWeight: 500, color: "rgba(255,255,255,0.75)", fontSize: "1.02rem", lineHeight: 1.7, maxWidth: 660, marginLeft: "auto", marginRight: "auto" }}>
            Real skills. Real income. Real future. Join CHRISCO Digital Academy and start learning this week — kept exactly the same practical content you trust, now in a fresh KYN-inspired look.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 28 }}>
            <a href="https://wa.me/254112272061" className="theme-btn" style={{ background: "#F74F22", color: "#fff", borderRadius: 999, padding: "14px 28px", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="whatsapp" size={17} /> WhatsApp Us
            </a>
            <Link href="/courses" style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: 999, padding: "14px 28px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Browse Courses →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
