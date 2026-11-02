"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const SLIDES = [
  {
    id: "teens-bootcamp",
    title: "TEENS AI & PROJECTS BOOTCAMP AT CHRISCO DIGITAL ACADEMY",
    subtitle: "The 5-week holiday cohort runs from 3rd November to 11th December 2026.",
    image: "/images/bg-home.jpg",
    href: "#teens-bootcamp",
  },
  {
    id: "digital-courses",
    title: "19 PRACTICAL DIGITAL PROGRAMMES OPEN FOR ENROLLMENT",
    subtitle: "Open to youth across Central and Eastern Districts, Nairobi, and online learners.",
    image: "/images/bg-courses.jpg",
    href: "/courses",
  },
  {
    id: "digital-library",
    title: "20 FREE PDF HANDBOOKS & CHRISTIAN STUDY BOOKS PUBLISHED",
    subtitle: "Learners urged to uphold Biblical integrity and build real-world portfolios.",
    image: "/images/campus-library-mentorship.jpg",
    href: "/library",
  },
  {
    id: "ai-studio",
    title: "ACADEMY LAUNCHES OPEN-HIGGSFIELD AI, VOICESTUDIO & SEO LAB",
    subtitle: "The studio equips learners with prompt direction, voice narration, and technical SEO skills.",
    image: "/images/hero-tile.jpg",
    href: "/studio",
  },
  {
    id: "software-track",
    title: "SCHOOL OF CODING STRENGTHENS CAPACITY IN PYTHON & LLM ENGINEERING",
    subtitle: "The training equips young developers to build modern web apps and AI workflows.",
    image: "/images/cat-coding.jpg",
    href: "/courses?category=Coding%20%26%20Tech",
  },
  {
    id: "pursue-shop",
    title: "PURSUE STUDIO COLLECTION SUPPORTS YOUTH DIGITAL TRAINING",
    subtitle: "Official CHRISCO Youth Aflame merchandise funding free internet access and mentorship.",
    image: "/images/workspace.jpg",
    href: "/shop",
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
      aria-label="Featured Highlights"
      style={{
        position: "relative",
        marginTop: 42,
        minHeight: "clamp(520px, 78vh, 690px)",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        background: "#0B1D51",
      }}
    >
      {/* Full-bleed watermark-free photograph */}
      <div
        key={slide.id}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${slide.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.45s ease",
        }}
      />

      {/* Left / Right circular dark translucent arrows matching UCU screenshot */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: 24,
          top: "46%",
          transform: "translateY(-50%)",
          zIndex: 4,
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.65)",
          border: "none",
          color: "#FFFFFF",
          fontSize: 20,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        &#10094;
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: 24,
          top: "46%",
          transform: "translateY(-50%)",
          zIndex: 4,
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.65)",
          border: "none",
          color: "#FFFFFF",
          fontSize: 20,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        &#10095;
      </button>

      {/* Bottom wide translucent dark-blue band matching UCU screenshot */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          padding: "0 14px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            background: "rgba(8, 46, 118, 0.62)",
            padding: "20px 24px 22px",
            color: "#FFFFFF",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(20px, 2.35vw, 30px)",
              fontWeight: 500,
              lineHeight: 1.25,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
            }}
          >
            {slide.title}
          </h1>

          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(17px, 1.85vw, 24px)",
              fontWeight: 400,
              lineHeight: 1.4,
              color: "#FFFFFF",
              margin: "14px 0 22px",
            }}
          >
            {slide.subtitle}
          </p>

          <Link
            href={slide.href}
            style={{
              display: "inline-block",
              padding: "10px 48px",
              background: "#003896",
              border: "1.5px solid #F8C90E",
              borderRadius: 0,
              color: "#FFFFFF",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  )
}
