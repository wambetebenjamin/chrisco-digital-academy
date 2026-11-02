"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const SLIDES = [
  {
    id: "chrisco-academy",
    title: "CHRISCO YOUTH AFLAME DIGITAL ACADEMY",
    subtitle:
      "Equipping young people across Jinja, Buikwe, and Africa with practical digital skills in design, coding, video, marketing, writing, and AI.",
    image: "/images/bg-home.jpg",
    ctaLabel: "Explore Courses",
    href: "/courses",
  },
  {
    id: "teens-bootcamp",
    title: "TEENS AI & PROJECTS BOOTCAMP (3RD NOV – 11TH DEC 2026)",
    subtitle:
      "Five weeks of hands-on holiday training in AI Prompt Engineering, Coding, Graphic Design, Video Production, and App Building.",
    image: "/images/bg-courses.jpg",
    ctaLabel: "View Bootcamp",
    href: "#teens-bootcamp",
  },
  {
    id: "practical-tracks",
    title: "19 PRACTICAL COURSES ACROSS 7 SKILL TRACKS",
    subtitle:
      "Beginner-friendly, project-based learning under CHRISCO Fellowship of Churches International to help youth turn talent into income.",
    image: "/images/workspace.jpg",
    ctaLabel: "Browse Catalogue",
    href: "/courses",
  },
  {
    id: "christian-and-learning-books",
    title: "CHRISTIAN & DIGITAL LEARNING LIBRARY",
    subtitle:
      "Study Joseph: 7 Lessons Every Emerging Seer Prophet Must Learn alongside 19 complete 28-page illustrated course handbooks.",
    image: "/images/campus-library-mentorship.jpg",
    ctaLabel: "Open Library",
    href: "/library",
  },
  {
    id: "pursue-collection",
    title: "PURSUE MERCHANDISE COLLECTION (1 SAMUEL 30:8)",
    subtitle:
      "Official CHRISCO Youth Aflame hoodies, tees, caps, and accessories supporting youth digital training across our communities.",
    image: "/images/bg-about.jpg",
    ctaLabel: "Visit Shop",
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
      aria-label="CHRISCO Digital Academy Highlights"
      style={{
        position: "relative",
        marginTop: 40,
        minHeight: "clamp(520px, 76vh, 680px)",
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

      {/* Left / Right slider controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: 24,
          top: "48%",
          transform: "translateY(-50%)",
          zIndex: 4,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(11, 29, 81, 0.72)",
          border: "none",
          color: "#FFFFFF",
          fontSize: 18,
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
          top: "48%",
          transform: "translateY(-50%)",
          zIndex: 4,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(11, 29, 81, 0.72)",
          border: "none",
          color: "#FFFFFF",
          fontSize: 18,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        &#10095;
      </button>

      {/* Bottom caption band — calm navy, no extra borders or lines */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          padding: "0 20px 28px",
        }}
      >
        <div
          className="container"
          style={{
            padding: 0,
          }}
        >
          <div
            style={{
              maxWidth: 980,
              background: "rgba(11, 29, 81, 0.82)",
              padding: "28px 32px",
              color: "#FFFFFF",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(22px, 2.5vw, 32px)",
                fontWeight: 700,
                lineHeight: 1.22,
                color: "#FFFFFF",
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              {slide.title}
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(16px, 1.45vw, 19px)",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.92)",
                margin: "12px 0 22px",
                maxWidth: 820,
              }}
            >
              {slide.subtitle}
            </p>

            <Link
              href={slide.href}
              style={{
                display: "inline-block",
                padding: "11px 32px",
                background: "#F8C90E",
                color: "#0B1D51",
                fontFamily: "var(--font-head)",
                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              {slide.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
