"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Icon from "./Icon"

const SLIDES = [
  {
    id: "digital-mastery",
    eyebrow: "CHRISCO DIGITAL ACADEMY • A CENTRE OF EXCELLENCE",
    accentColor: "#E60914",
    title: "Empowering Future Innovators Through Practical Digital & AI Mastery",
    subtitle:
      "19 free project-based digital courses and 20 free PDF handbooks equipping young Africans under CHRISCO Youth Aflame.",
    image: "/images/bg-home.jpg",
    primaryLabel: "Read More",
    primaryHref: "/courses",
    secondaryLabel: "Apply Now →",
    secondaryHref: "/sign-up",
  },
  {
    id: "teens-ai-bootcamp",
    eyebrow: "NOVEMBER – DECEMBER 2026 HOLIDAY INTAKE • AGES 13–19",
    accentColor: "#EE6816",
    title: "Teens AI & Projects Bootcamp: 3rd November – 11th December 2026",
    subtitle:
      "5 weeks of hands-on AI Prompt Engineering, Coding, Graphic Design, Video Production, and App Building for teens.",
    image: "/images/bg-courses.jpg",
    primaryLabel: "Read More",
    primaryHref: "#teens-bootcamp",
    secondaryLabel: "Register (Google Form) →",
    secondaryHref: "https://forms.gle/ChriscoTeensAIBootcamp",
    externalSecondary: true,
  },
  {
    id: "digital-library",
    eyebrow: "CHRISCO DIGITAL REPOSITORY • 20 FREE PDF BOOKS",
    accentColor: "#084EC8",
    title: "Explore 20 Free Christian & Digital Skill Handbooks With AI Voice Narration",
    subtitle:
      "Download complete step-by-step course textbooks and Christian youth leadership books or listen with VoiceStudio.",
    image: "/images/campus-library-mentorship.jpg",
    primaryLabel: "Read More",
    primaryHref: "/library",
    secondaryLabel: "Browse Christian Shelf →",
    secondaryHref: "/library?shelf=christian",
  },
  {
    id: "ai-voice-seo-studio",
    eyebrow: "OPEN-SOURCE INNOVATION LAB • AI, VOICE & TECHNICAL SEO",
    accentColor: "#38A128",
    title: "Open-Higgsfield AI Prompt Studio, VoiceStudio Narrator & Open-SEO Engine",
    subtitle:
      "Practice visual prompt direction, neural spoken-word synthesis, and 100-point technical SEO audits inside one studio.",
    image: "/images/hero-tile.jpg",
    primaryLabel: "Read More",
    primaryHref: "/studio",
    secondaryLabel: "Launch AI Studio →",
    secondaryHref: "/studio",
  },
  {
    id: "software-engineering",
    eyebrow: "SCHOOL OF CODING & SOFTWARE ENGINEERING",
    accentColor: "#084EC8",
    title: "Python Programming, Modern Web Development & LLM Engineering",
    subtitle:
      "Build production web apps, automate workflows with Python, and master AI-assisted software engineering.",
    image: "/images/cat-coding.jpg",
    primaryLabel: "Read More",
    primaryHref: "/courses?category=Coding%20%26%20Tech",
    secondaryLabel: "View All 19 Courses →",
    secondaryHref: "/courses",
  },
  {
    id: "pursue-merch-shop",
    eyebrow: "PURSUE COLLECTION • WEAR THE MISSION",
    accentColor: "#E60914",
    title: "Official PURSUE Studio Apparel Funding Free Youth Digital Training",
    subtitle:
      "Every hoodie, tee, cap, and tote helps fund free data bundles, mentorship, and learning devices across our districts.",
    image: "/images/workspace.jpg",
    primaryLabel: "Read More",
    primaryHref: "/shop",
    secondaryLabel: "Visit PURSUE Shop →",
    secondaryHref: "/shop",
  },
]

export default function UcuHeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[index]
  const prevSlide = () => setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  const nextSlide = () => setIndex((prev) => (prev + 1) % SLIDES.length)

  return (
    <section
      aria-label="Featured Highlights Slider"
      style={{
        position: "relative",
        marginTop: 114,
        minHeight: "clamp(480px, 68vh, 640px)",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        background: "#0B1D51",
        borderBottom: "4px solid #F8C90E",
      }}
    >
      {/* Full-bleed watermark-free background image */}
      <div
        key={slide.id}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${slide.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Subtle institutional navy gradient overlay so image stays vivid while caption is high-contrast */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(11,29,81,0.72) 0%, rgba(11,29,81,0.32) 55%, rgba(11,29,81,0.18) 100%), linear-gradient(180deg, rgba(11,29,81,0.25) 0%, rgba(11,29,81,0.58) 100%)",
        }}
      />

      {/* Left / Right Slider Arrows (UCU style) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 4,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(11, 29, 81, 0.82)",
          border: "2px solid #F8C90E",
          color: "#FFFFFF",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 4,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(11, 29, 81, 0.82)",
          border: "2px solid #F8C90E",
          color: "#FFFFFF",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        ›
      </button>

      {/* Bottom-left UCU-style Dark Navy Translucent Caption Box */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          paddingTop: 48,
          paddingBottom: 36,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            maxWidth: 740,
            background: "rgba(11, 29, 81, 0.90)",
            borderLeft: `6px solid ${slide.accentColor}`,
            borderTop: "3px solid #F8C90E",
            borderRadius: "0 12px 12px 0",
            padding: "clamp(22px, 3.5vw, 34px)",
            color: "#FFFFFF",
            boxShadow: "0 18px 44px rgba(11, 29, 81, 0.45)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: slide.accentColor,
              color: "#FFFFFF",
              padding: "4px 12px",
              borderRadius: 4,
              fontFamily: "var(--font-head)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {slide.eyebrow}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.55rem, 3.1vw, 2.5rem)",
              lineHeight: 1.15,
              color: "#FFFFFF",
              marginBottom: 12,
              letterSpacing: "-0.01em",
            }}
          >
            {slide.title}
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 1.3vw, 1.08rem)",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.88)",
              marginBottom: 20,
              maxWidth: 650,
            }}
          >
            {slide.subtitle}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href={slide.primaryHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 22px",
                borderRadius: 6,
                border: "2px solid #F8C90E",
                background: "rgba(0, 56, 150, 0.65)",
                color: "#FFFFFF",
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              {slide.primaryLabel}
            </Link>

            {slide.externalSecondary ? (
              <a
                href={slide.secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  borderRadius: 6,
                  border: `2px solid ${slide.accentColor}`,
                  background: slide.accentColor,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-head)",
                  fontSize: 13.5,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                {slide.secondaryLabel}
              </a>
            ) : (
              <Link
                href={slide.secondaryHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  borderRadius: 6,
                  border: `2px solid ${slide.accentColor}`,
                  background: slide.accentColor,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-head)",
                  fontSize: 13.5,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                {slide.secondaryLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Slide selector pills (01 - 06) */}
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "rgba(11, 29, 81, 0.86)",
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid rgba(248, 201, 14, 0.45)",
          }}
        >
          {SLIDES.map((s, idx) => {
            const active = idx === index
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                style={{
                  width: active ? 34 : 26,
                  height: 26,
                  borderRadius: 999,
                  border: active ? "1.5px solid #F8C90E" : "1px solid rgba(255,255,255,0.25)",
                  background: active ? "#E60914" : "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-head)",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                0{idx + 1}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
