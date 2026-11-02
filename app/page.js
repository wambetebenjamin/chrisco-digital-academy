import Link from "next/link"
import Navbar from "./Navbar"
import Footer from "./components/Footer"
import Chatbot from "./Chatbot"
import UcuHeroSlider from "./components/UcuHeroSlider"
import { courses, categories, categoryCounts, categoryImages } from "./data/courses"
import { christianBooks } from "./data/booksCatalogue"
import { org, tutor } from "./data/org"

const CORE_SKILLS = [
  {
    title: "Graphic Design",
    desc: "Build visual identities, church and commercial posters, and brand systems using Canva and Adobe tools.",
    href: "/courses?category=Design",
  },
  {
    title: "Web Development",
    desc: "Create modern, responsive websites and web applications with HTML, CSS, JavaScript, React, and Next.js.",
    href: "/courses?category=Coding",
  },
  {
    title: "Social Media",
    desc: "Plan content calendars, audience growth strategies, and campaigns that drive measurable engagement.",
    href: "/courses?category=Marketing",
  },
  {
    title: "Video Editing",
    desc: "Produce clean, compelling edits for YouTube channels, short-form reels, and ministry or client events.",
    href: "/courses?category=Video",
  },
  {
    title: "Animation",
    desc: "Craft motion graphics, explainer sequences, and visual storytelling that capture attention.",
    href: "/courses?category=Video",
  },
  {
    title: "AI Expertise",
    desc: "Apply modern AI tools for research, writing, coding workflows, and creative production.",
    href: "/courses?category=Coding",
  },
]

const VALUES = [
  {
    title: "Accessible",
    desc: "Beginner-friendly digital education designed for every young person in Jinja, Buikwe, and across Africa.",
  },
  {
    title: "Practical",
    desc: "Every course is built around hands-on assignments and ends with a real project you can show and use to earn.",
  },
  {
    title: "Mentorship",
    desc: "Learn directly from working practitioners in software development, design, media production, and AI.",
  },
  {
    title: "Community",
    desc: "Grow alongside a supportive fellowship of young Christian creators, developers, and entrepreneurs.",
  },
]

const STEPS = [
  {
    step: "Step 1",
    title: "Browse & Choose",
    desc: "Select from 19 practical courses across Business, Marketing, Coding, Writing, Design, Video, and Career.",
  },
  {
    step: "Step 2",
    title: "Enroll in Minutes",
    desc: "Create your learner account or submit an enrollment request and receive confirmation via WhatsApp or email.",
  },
  {
    step: "Step 3",
    title: "Learn & Build",
    desc: "Follow the structured 8-week syllabus, study the 28-page course handbook, and complete your portfolio project.",
  },
]

export default function Home() {
  const counts = categoryCounts()
  const featuredCourses = [courses[4], courses[0], courses[10]] // Freelancing, YouTube Automation, SWE & LLM Mastery
  const josephBook = christianBooks[0]

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", background: "#FFFFFF", color: "#1E293B" }}>
      <Navbar />

      {/* ================= 1. HERO SLIDER ================= */}
      <UcuHeroSlider />

      {/* ================= 2. 3-COLUMN CHRISCO YOUTH AFLAME PATHWAYS STRIP ================= */}
      <section aria-label="CHRISCO Digital Academy Pathways" style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "#0B1D51",
              color: "#FFFFFF",
              padding: "40px 34px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 23,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: "0 0 14px",
              }}
            >
              19 Practical Courses
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "rgba(255, 255, 255, 0.88)",
                margin: "0 auto 22px",
                maxWidth: 400,
              }}
            >
              Structured, beginner-friendly training across seven digital skill tracks designed to help young people turn
              talent and ambition into real income.
            </p>
            <Link
              href="/courses"
              style={{
                display: "inline-block",
                padding: "10px 26px",
                background: "#F8C90E",
                color: "#0B1D51",
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Explore Courses
            </Link>
          </div>

          <div
            style={{
              background: "#003896",
              color: "#FFFFFF",
              padding: "40px 34px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 23,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: "0 0 14px",
              }}
            >
              Teens AI &amp; Projects Bootcamp
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "rgba(255, 255, 255, 0.9)",
                margin: "0 auto 22px",
                maxWidth: 400,
              }}
            >
              Our five-week holiday cohort (3rd November – 11th December 2026) equipping teens with AI Prompt
              Engineering, Coding, Graphic Design, Video Production, and App Building.
            </p>
            <a
              href="https://forms.gle/ChriscoTeensAIBootcamp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 26px",
                background: "#FFFFFF",
                color: "#0B1D51",
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Register Teen
            </a>
          </div>

          <div
            style={{
              background: "#0B1D51",
              color: "#FFFFFF",
              padding: "40px 34px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 23,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: "0 0 14px",
              }}
            >
              Christian &amp; Learning Books
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "rgba(255, 255, 255, 0.88)",
                margin: "0 auto 22px",
                maxWidth: 400,
              }}
            >
              Access two dedicated shelves: our Christian prophetic study guide on the life of Joseph and 19 illustrated
              28-page course handbooks.
            </p>
            <Link
              href="/library"
              style={{
                display: "inline-block",
                padding: "10px 26px",
                background: "#F8C90E",
                color: "#0B1D51",
                fontFamily: "var(--font-head)",
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Open Library
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 3. WHO WE ARE — CHRISCO DIGITAL ACADEMY ================= */}
      <section
        id="teens-bootcamp"
        style={{
          padding: "80px 0",
          background: "#FFFFFF",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Left: Official Teens AI & Projects Bootcamp Poster + Learner Workspace Photo */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 20,
                alignItems: "stretch",
              }}
            >
              <a
                href="https://forms.gle/ChriscoTeensAIBootcamp"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", textDecoration: "none" }}
              >
                <img
                  src="/posters/teens-ai-bootcamp-official.png"
                  alt="CHRISCO Youth Aflame — Teens AI & Projects Bootcamp (3rd Nov - 11th Dec 2026)"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </a>

              <div
                style={{
                  minHeight: 360,
                  backgroundImage: "url('/images/hero-tile.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-label="Learner at CHRISCO Digital Academy"
              />
            </div>

            {/* Right: Authentic CHRISCO Youth Aflame Story & Stats */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(26px, 2.8vw, 34px)",
                  fontWeight: 800,
                  color: "#0B1D51",
                  margin: "0 0 18px",
                  lineHeight: 1.2,
                }}
              >
                Born From a Passion to See Youth Thrive
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "#334155",
                  margin: "0 0 16px",
                }}
              >
                We exist to bridge the digital divide. Too many young people have talent and ambition, but lack the
                practical skills required to turn that potential into sustainable income.{" "}
                <strong>{org.academy}</strong> was built to solve that gap.
              </p>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "#334155",
                  margin: "0 0 26px",
                }}
              >
                {org.academy} is the learning platform of <strong>{org.programme}</strong>, operating under{" "}
                <strong>{org.umbrella}</strong>, serving young people across Jinja and Buikwe Districts and online
                across Africa.
              </p>

              {/* 4 Authentic Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  gap: 20,
                  marginBottom: 30,
                  padding: "20px 24px",
                  background: "#F5F7FA",
                }}
              >
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#003896", lineHeight: 1 }}>500+</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginTop: 6 }}>Youth Trained</div>
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#003896", lineHeight: 1 }}>19</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginTop: 6 }}>Courses</div>
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#003896", lineHeight: 1 }}>2</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginTop: 6 }}>Districts</div>
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#003896", lineHeight: 1 }}>100%</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginTop: 6 }}>Practical</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link
                  href="/courses"
                  style={{
                    display: "inline-block",
                    background: "#003896",
                    color: "#FFFFFF",
                    padding: "12px 28px",
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Browse All 19 Courses
                </Link>
                <Link
                  href="/about"
                  style={{
                    display: "inline-block",
                    background: "#F5F7FA",
                    color: "#0B1D51",
                    padding: "12px 28px",
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. MISSION, VISION & VALUES — CHRISCO YOUTH AFLAME ================= */}
      <section
        style={{
          padding: "80px 0",
          background: "#0B1D51",
          color: "#FFFFFF",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 36,
              marginBottom: 56,
            }}
          >
            <div style={{ background: "rgba(255, 255, 255, 0.06)", padding: "32px 30px" }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800, color: "#F8C90E", margin: "0 0 12px" }}>
                Our Mission
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255, 255, 255, 0.9)", margin: 0 }}>
                To bridge the digital divide by providing accessible, affordable, and practical digital education to
                youth across Africa and beyond.
              </p>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.06)", padding: "32px 30px" }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800, color: "#F8C90E", margin: "0 0 12px" }}>
                Our Vision
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255, 255, 255, 0.9)", margin: 0 }}>
                A generation of digitally empowered African youth creating solutions, building businesses, and leading
                transformation across the continent.
              </p>
            </div>
          </div>

          <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800, color: "#FFFFFF", margin: "0 0 28px" }}>
            The Values Behind Every Course
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 28,
            }}
          >
            {VALUES.map((v) => (
              <div key={v.title}>
                <h4 style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, color: "#F8C90E", margin: "0 0 10px" }}>
                  {v.title}
                </h4>
                <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(255, 255, 255, 0.85)", margin: 0 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. 6 CORE DIGITAL SKILLS WE TEACH ================= */}
      <section style={{ padding: "80px 0", background: "#F5F7FA" }}>
        <div className="container">
          <div style={{ maxWidth: 680, marginBottom: 44 }}>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(26px, 2.8vw, 34px)",
                fontWeight: 800,
                color: "#0B1D51",
                margin: "0 0 12px",
              }}
            >
              Practical Digital Skills That Open Real Doors
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#475569", margin: 0 }}>
              Our curriculum focuses on six core disciplines taught by practitioners who use these workflows every day.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 24,
            }}
          >
            {CORE_SKILLS.map((skill) => (
              <div
                key={skill.title}
                style={{
                  background: "#FFFFFF",
                  padding: "30px 28px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 19,
                    fontWeight: 800,
                    color: "#0B1D51",
                    margin: "0 0 10px",
                  }}
                >
                  {skill.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: "0 0 18px" }}>{skill.desc}</p>
                <Link
                  href={skill.href}
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#003896",
                    textDecoration: "none",
                  }}
                >
                  View Track
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. 7 SKILL TRACKS & FEATURED COURSES ================= */}
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 38,
            }}
          >
            <div style={{ maxWidth: 680 }}>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(26px, 2.8vw, 34px)",
                  fontWeight: 800,
                  color: "#0B1D51",
                  margin: "0 0 12px",
                }}
              >
                19 Courses Across 7 Skill Tracks
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "#475569", margin: 0 }}>
                Choose a track below to view course objectives, 8-week outlines, and downloadable study handbooks.
              </p>
            </div>
            <Link
              href="/courses"
              style={{
                display: "inline-block",
                background: "#003896",
                color: "#FFFFFF",
                padding: "12px 26px",
                fontFamily: "var(--font-head)",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View All 19 Courses
            </Link>
          </div>

          {/* 7 Category Photo Tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 64,
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/courses?category=${encodeURIComponent(cat.name)}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 200,
                    backgroundImage: `url('${categoryImages[cat.name] || "/images/bg-courses.jpg"}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      background: "rgba(11, 29, 81, 0.84)",
                      padding: "14px 18px",
                      color: "#FFFFFF",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700 }}>{cat.name}</span>
                    <span style={{ fontSize: 13, color: "#F8C90E", fontWeight: 700 }}>
                      {counts[cat.name] || 0} {counts[cat.name] === 1 ? "Course" : "Courses"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 3 Featured Courses */}
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 24,
              fontWeight: 800,
              color: "#0B1D51",
              margin: "0 0 26px",
            }}
          >
            Featured Courses
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 26,
            }}
          >
            {featuredCourses.map((course) => (
              <div key={course.id} style={{ background: "#F5F7FA" }}>
                <div
                  style={{
                    height: 195,
                    backgroundImage: `url('${course.img}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: "24px 24px 26px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#003896", marginBottom: 6 }}>
                    {course.category} · {course.duration} · {course.level}
                  </div>
                  <h4
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 19,
                      fontWeight: 800,
                      color: "#0B1D51",
                      margin: "0 0 10px",
                    }}
                  >
                    {course.title}
                  </h4>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#475569", margin: "0 0 18px" }}>{course.desc}</p>
                  <Link
                    href={`/courses?category=${encodeURIComponent(course.category)}&course=${course.id}`}
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#003896",
                      textDecoration: "none",
                    }}
                  >
                    View Course Outline
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. CHRISTIAN & LEARNING BOOKS LIBRARY ================= */}
      <section style={{ padding: "80px 0", background: "#F5F7FA" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: 44,
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(26px, 2.8vw, 34px)",
                  fontWeight: 800,
                  color: "#0B1D51",
                  margin: "0 0 16px",
                }}
              >
                Two Dedicated Shelves: Christian &amp; Skill Handbooks
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155", margin: "0 0 16px" }}>
                Our library brings together spiritual formation and practical digital mastery under{" "}
                <strong>{org.programme}</strong>.
              </p>
              <p style={{ fontSize: 15.5, lineHeight: 1.8, color: "#475569", margin: "0 0 26px" }}>
                On the <strong>Christian &amp; Faith Shelf</strong>, read{" "}
                <em>{josephBook.title}</em> — a 28-page Scripture-anchored study on Genesis 37 to 50. On the{" "}
                <strong>Skill &amp; Learning Shelf</strong>, download 28-page illustrated handbooks for all 19 courses.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link
                  href="/library?shelf=christian"
                  style={{
                    display: "inline-block",
                    background: "#0B1D51",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Christian &amp; Faith Shelf
                </Link>
                <Link
                  href="/library?shelf=learning"
                  style={{
                    display: "inline-block",
                    background: "#003896",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  19 Course Handbooks
                </Link>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "32px 30px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#003896", marginBottom: 8 }}>
                {josephBook.shelfLabel} · {josephBook.pages} Pages
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 21,
                  fontWeight: 800,
                  color: "#0B1D51",
                  margin: "0 0 12px",
                  lineHeight: 1.3,
                }}
              >
                {josephBook.title}
              </h3>
              <p style={{ fontSize: 14.8, lineHeight: 1.75, color: "#475569", margin: "0 0 20px" }}>
                {josephBook.subtitle}
              </p>
              <Link
                href={josephBook.sharePath}
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#003896",
                  textDecoration: "none",
                }}
              >
                Read Book Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. TEENS BOOTCAMP + MEET OUR TUTOR & TEACH WITH US ================= */}
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: 44,
              alignItems: "start",
            }}
          >
            {/* Left: Teens AI & Projects Bootcamp */}
            <div style={{ background: "#F5F7FA", padding: "34px 32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0B1D51",
                  margin: "0 0 14px",
                }}
              >
                Teens AI &amp; Projects Bootcamp
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "#334155", margin: "0 0 18px" }}>
                Our five-week holiday programme (3rd November – 11th December 2026) equips teens with practical project
                experience across five hands-on areas:
              </p>
              <ul style={{ paddingLeft: 20, margin: "0 0 24px", lineHeight: 1.9, color: "#334155", fontSize: 15 }}>
                <li>AI Prompt Engineering</li>
                <li>Coding &amp; Web Foundations</li>
                <li>Graphic Design</li>
                <li>Video Production</li>
                <li>Practical App Building</li>
              </ul>
              <a
                href="https://forms.gle/ChriscoTeensAIBootcamp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#003896",
                  color: "#FFFFFF",
                  padding: "12px 26px",
                  fontFamily: "var(--font-head)",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Register via Google Form
              </a>
            </div>

            {/* Right: Meet Our Tutor & Become a Tutor */}
            <div style={{ background: "#F5F7FA", padding: "34px 32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0B1D51",
                  margin: "0 0 14px",
                }}
              >
                Taught by People Who Do the Work
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "#334155", margin: "0 0 14px" }}>
                Our Lead Tutor is a Computer Science graduate who works daily in graphic design, web development, video
                editing, animation, social media, and AI, teaching the exact practical workflows our learners use on
                real projects.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "#334155", margin: "0 0 24px" }}>
                <strong>Want to become a tutor?</strong> {org.programme} welcomes practitioners in design, development,
                marketing, writing, video, and AI who have a heart to mentor young people.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link
                  href="/about#tutor"
                  style={{
                    display: "inline-block",
                    background: "#0B1D51",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Meet Our Tutor
                </Link>
                <Link
                  href="/become-a-tutor"
                  style={{
                    display: "inline-block",
                    background: "#003896",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    fontFamily: "var(--font-head)",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Apply to Teach
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. HOW IT WORKS (3 STEPS) + PURSUE SHOP CALLOUT ================= */}
      <section style={{ padding: "80px 0", background: "#0B1D51", color: "#FFFFFF" }}>
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(26px, 2.8vw, 34px)",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 36px",
            }}
          >
            How Learning Works at {org.academy}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 32,
              marginBottom: 60,
            }}
          >
            {STEPS.map((s) => (
              <div key={s.step} style={{ background: "rgba(255, 255, 255, 0.06)", padding: "28px 26px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#F8C90E", marginBottom: 8 }}>{s.step}</div>
                <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, color: "#FFFFFF", margin: "0 0 10px" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14.8, lineHeight: 1.75, color: "rgba(255, 255, 255, 0.86)", margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* PURSUE Shop & Enrollment Callout */}
          <div
            style={{
              background: "#003896",
              padding: "36px 34px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 660 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800, color: "#FFFFFF", margin: "0 0 8px" }}>
                Your Future Is Digital — Let&apos;s Build It Together
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255, 255, 255, 0.9)", margin: 0 }}>
                Create your free learner account today, or support our youth training mission through the official
                PURSUE merchandise collection anchored on 1 Samuel 30:8.
              </p>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link
                href="/sign-up"
                style={{
                  display: "inline-block",
                  background: "#F8C90E",
                  color: "#0B1D51",
                  padding: "12px 28px",
                  fontFamily: "var(--font-head)",
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Create Learner Account
              </Link>
              <Link
                href="/shop"
                style={{
                  display: "inline-block",
                  background: "#FFFFFF",
                  color: "#0B1D51",
                  padding: "12px 26px",
                  fontFamily: "var(--font-head)",
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Visit PURSUE Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
