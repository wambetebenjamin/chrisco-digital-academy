import Link from "next/link"
import Navbar from "./Navbar"
import Footer from "./components/Footer"
import Chatbot from "./Chatbot"
import UcuHeroSlider from "./components/UcuHeroSlider"
import Icon from "./components/Icon"
import { tutor } from "./data/org"

const SCHOOLS = [
  {
    title: "School of Business & Freelancing",
    href: "/courses?category=Business",
    image: "/images/cat-business.jpg",
  },
  {
    title: "School of Coding & Software Engineering",
    href: "/courses?category=Coding%20%26%20Tech",
    image: "/images/cat-coding.jpg",
  },
  {
    title: "School of Graphic Design & Print-on-Demand",
    href: "/courses?category=Design",
    image: "/images/cat-design.jpg",
  },
  {
    title: "School of Video, Media & AI Storytelling",
    href: "/courses?category=Video%20%26%20AI",
    image: "/images/cat-video.jpg",
  },
  {
    title: "School of Digital & Social Media Marketing",
    href: "/courses?category=Marketing",
    image: "/images/cat-marketing.jpg",
  },
  {
    title: "School of Copywriting & Book Publishing",
    href: "/courses?category=Writing",
    image: "/images/cat-writing.jpg",
  },
  {
    title: "School of Executive Leadership & Career",
    href: "/courses?category=Career",
    image: "/images/cat-career.jpg",
  },
  {
    title: "Teens AI & Projects Bootcamp (Nov – Dec)",
    href: "https://forms.gle/ChriscoTeensAIBootcamp",
    image: "/images/bg-home.jpg",
    external: true,
  },
]

const RESEARCH_ITEMS = [
  {
    title: "Teens AI & Projects Bootcamp 2026: What Teens and Parents Need to Know",
    meta: "Time & Location Tue. 3 Nov 2026 – Fri. 11 Dec 2026 · Time: 09:00",
    image: "/posters/teens-ai-bootcamp-official.png",
    href: "https://forms.gle/ChriscoTeensAIBootcamp",
    external: true,
  },
  {
    title: "Open-Higgsfield AI Prompt Studio Challenges Learners to Build Beyond Memorisation",
    meta: "Open-Higgsfield AI Prompt Studio Challenges Learners to Build Beyond Memorisation",
    image: "/images/courses/ai-video-storytelling.jpg",
    href: "/studio",
  },
  {
    title: "VoiceStudio Narrator Turns 20 Academy Handbooks Into Spoken Audio Guides",
    meta: "VoiceStudio Narrator Turns 20 Academy Handbooks Into Spoken Audio Guides",
    image: "/images/courses/ai-literacy.jpg",
    href: "/studio",
  },
  {
    title: "Open-SEO Technical Audit Workspace: Call for Student Web Projects",
    meta: "The workspace aims to foster practical mastery in technical SEO, metadata, and JSON-LD schema.",
    image: "/images/courses/digital-marketing.jpg",
    href: "/studio",
  },
]

const TESTIMONIALS = [
  {
    name: "Brian Mwangi",
    role: "School of Coding & Tech Alumnus (Nairobi)",
    image: "/images/campus-student-focus.jpg",
    quote:
      "CHRISCO Digital Academy has been amazing, and I was very fortunate to join this esteemed programme. Its focus on producing well-rounded practical software builders really attracted me to the academy.",
  },
  {
    name: "Grace Wanjiku",
    role: "Digital Marketing Alumna (Central District)",
    image: "/images/bg-about.jpg",
    quote:
      "CHRISCO Digital Academy has made my dreams of digital media and client work a reality. And I am eager to serve my local community with these skills, helping small businesses grow online.",
  },
  {
    name: "Kevin Otieno",
    role: "Video & AI Media Alumnus (Eastern District)",
    image: "/images/hero-tile.jpg",
    quote:
      "My parents and I chose CHRISCO Digital Academy because I wanted to study under an environment where I would not just be built technically in AI and media, but also grow in Christian faith.",
  },
]

const NEWS_ITEMS = [
  {
    title: "Registration Opens for Teens AI & Projects Bootcamp (3rd Nov – 11th Dec 2026)",
    date: "November 2, 2026",
    image: "/posters/teens-ai-bootcamp-official.png",
    href: "https://forms.gle/ChriscoTeensAIBootcamp",
    external: true,
  },
  {
    title: "CHRISCO Digital Academy graduate Brian Mwangi’s Python & LLM journey",
    date: "October 28, 2026",
    image: "/images/courses/swe-llm-mastery.jpg",
    href: "/courses/swe-llm-mastery",
  },
  {
    title: "Lead Tutor Commissions Youth Cohorts Ahead of November Digital Intake",
    date: "October 22, 2026",
    image: "/images/campus-library-mentorship.jpg",
    href: "/courses",
  },
  {
    title: "CHRISCO Digital Academy Releases 20 Free PDF Handbooks and Christian Study Books",
    date: "October 19, 2026",
    image: "/images/bg-courses.jpg",
    href: "/library",
  },
]

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", background: "#FFFFFF", color: "#333333" }}>
      <Navbar />

      {/* ================= 1. FULL-WIDTH HERO SLIDER (UCU REPLICA) ================= */}
      <UcuHeroSlider />

      {/* ================= 2. EDGE-TO-EDGE 3-COLUMN ADMISSIONS STRIP (UCU REPLICA) ================= */}
      <section aria-label="Admissions Welcome Strip" style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            width: "100%",
          }}
        >
          {/* Column 1: Golden Yellow (#F8C90E) — Call for Applications */}
          <div
            style={{
              background: "#F8C90E",
              color: "#111111",
              padding: "36px 32px 38px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 25,
                fontWeight: 700,
                color: "#111111",
                margin: "0 0 16px",
              }}
            >
              Call for Applications
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "#111111",
                margin: "0 auto 22px",
                maxWidth: 420,
              }}
            >
              We are honoured that you are considering CHRISCO Digital Academy for your practical digital education. Our
              admissions process is designed to be straight forward and accessible, ensuring that all prospective
              students have the opportunity to join our vibrant community.
            </p>
            <Link
              href="/sign-up"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "#111111",
                textDecoration: "underline",
                letterSpacing: "0.06em",
              }}
            >
              Apply Now
            </Link>
          </div>

          {/* Column 2: Leaf Green (#14853B / #38A128) — Youth & Teens Cohorts */}
          <div
            style={{
              background: "#14853B",
              color: "#FFFFFF",
              padding: "36px 32px 38px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 25,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: "0 0 16px",
              }}
            >
              Youth &amp; Teens Cohorts
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "#FFFFFF",
                margin: "0 auto 22px",
                maxWidth: 420,
              }}
            >
              A warm welcome to CHRISCO Digital Academy! We are thrilled to have you join our diverse and dynamic Youth
              Aflame community. Your presence enriches our Academy, bringing a wealth of perspective and experiences
              that enhances our collective learning environment.
            </p>
            <a
              href="https://forms.gle/ChriscoTeensAIBootcamp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "#FFFFFF",
                textDecoration: "underline",
                letterSpacing: "0.06em",
              }}
            >
              Read More
            </a>
          </div>

          {/* Column 3: Poster Red (#E60914) — Prospective students */}
          <div
            style={{
              background: "#E60914",
              color: "#FFFFFF",
              padding: "36px 32px 38px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 25,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: "0 0 16px",
              }}
            >
              Prospective students
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "#FFFFFF",
                margin: "0 auto 22px",
                maxWidth: 420,
              }}
            >
              CHRISCO Digital Academy students are empowered to ask bold questions and grow intellectually. With
              personal attention from experienced mentors, you will develop the practical digital skills to adapt and
              lead in our evolving world
            </p>
            <Link
              href="/courses"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "#FFFFFF",
                textDecoration: "underline",
                letterSpacing: "0.06em",
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 3. "WHY CHRISCO DIGITAL ACADEMY" (UCU REPLICA) ================= */}
      <section
        id="teens-bootcamp"
        style={{
          padding: "72px 0",
          background: "#FFFFFF",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: 44,
              alignItems: "center",
            }}
          >
            {/* Left: Two clean unframed images side-by-side just like UCU */}
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
                  alt="Teens AI & Projects Bootcamp (3rd Nov - 11th Dec 2026)"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </a>

              <Link
                href="/studio"
                style={{
                  position: "relative",
                  display: "block",
                  minHeight: 360,
                  backgroundImage: "url('/images/campus-library-mentorship.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(230, 9, 20, 0.9)",
                    color: "#FFFFFF",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="play" size={24} />
                </span>
              </Link>
            </div>

            {/* Right: Why CHRISCO Digital Academy + 6 programme links + 2 counters + Apply Now */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(26px, 2.8vw, 34px)",
                  fontWeight: 700,
                  color: "#003896",
                  margin: "0 0 18px",
                  lineHeight: 1.2,
                }}
              >
                Why CHRISCO Digital Academy
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15.5,
                  lineHeight: 1.75,
                  color: "#4B5563",
                  margin: "0 0 24px",
                }}
              >
                CHRISCO Digital Academy is an authentic Christian digital learning institution established by{" "}
                <Link href="/about" style={{ color: "#003896", textDecoration: "underline" }}>
                  CHRISCO Youth Aflame
                </Link>{" "}
                under CHRISCO Fellowship of Churches International in response to a call for quality practical digital
                education with a Christian perspective.
              </p>

              {/* 2-Column 6-link list matching UCU */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px 28px",
                  marginBottom: 30,
                }}
              >
                <ul style={{ listStyle: "disc", paddingLeft: 18, margin: 0, lineHeight: 2 }}>
                  <li>
                    <Link href="/courses" style={{ color: "#003896", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                      19 Practical Courses
                    </Link>
                  </li>
                  <li>
                    <Link href="/library" style={{ color: "#003896", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                      20 Free PDF Handbooks
                    </Link>
                  </li>
                  <li>
                    <Link href="/studio" style={{ color: "#003896", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                      AI, Voice &amp; SEO Studio
                    </Link>
                  </li>
                </ul>

                <ul style={{ listStyle: "disc", paddingLeft: 18, margin: 0, lineHeight: 2 }}>
                  <li>
                    <a
                      href="https://forms.gle/ChriscoTeensAIBootcamp"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#003896", fontSize: 15, textDecoration: "none", fontWeight: 500 }}
                    >
                      Teens AI Bootcamp
                    </a>
                  </li>
                  <li>
                    <Link href="/shop" style={{ color: "#003896", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                      PURSUE Apparel Shop
                    </Link>
                  </li>
                  <li>
                    <Link href="/sign-up" style={{ color: "#003896", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                      Application Procedures
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 2 Stat Counters + Apply Now matching UCU */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 44,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: 38, fontWeight: 700, color: "#0B1D51", lineHeight: 1 }}>19+</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#4B5563", marginTop: 6 }}>
                    Programmes/ Courses
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 38, fontWeight: 700, color: "#0B1D51", lineHeight: 1 }}>500+</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#4B5563", marginTop: 6 }}>
                    Youth Trained
                  </div>
                </div>

                <Link
                  href="/sign-up"
                  style={{
                    display: "inline-block",
                    background: "#E60914",
                    color: "#FFFFFF",
                    padding: "12px 32px",
                    borderRadius: 0,
                    fontSize: 14.5,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. "TO THE JOURNEY AHEAD / GAIN VALUABLE KNOWLEDGE & EXPERIENCE" (UCU REPLICA) ================= */}
      <section
        style={{
          position: "relative",
          padding: "76px 0",
          backgroundImage: "url('/images/bg-courses.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#FFFFFF",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(11, 29, 81, 0.88)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#F8C90E", marginBottom: 6 }}>
              To the Journey Ahead
            </div>
            <h2 style={{ fontSize: "clamp(26px, 2.8vw, 34px)", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Gain Valuable Knowledge &amp; Experience
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 32,
            }}
          >
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8C90E", margin: "0 0 12px" }}>
                Join CHRISCO Academy
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                We don’t just give students an education and experiences that set them up for success in a career, we
                help them succeed in their career.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8C90E", margin: "0 0 12px" }}>
                E-learning
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                CHRISCO Digital Academy is a leader in online practical learning. Every student receives free access to
                20 PDF handbooks and AI voice narration whether studying online or in person.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8C90E", margin: "0 0 12px" }}>
                Practical Labs
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                The academy offers a wide range of practical programmes across business, software engineering, graphic
                design, digital marketing, copywriting, and AI video production.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8C90E", margin: "0 0 12px" }}>
                Teens AI Bootcamp
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.88)", margin: "0 0 18px" }}>
                Hello and welcome to CHRISCO Digital Academy! Join our 3rd November – 11th December 2026 Teens AI &amp;
                Projects Bootcamp.
              </p>
              <a
                href="https://forms.gle/ChriscoTeensAIBootcamp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#E60914",
                  color: "#FFFFFF",
                  padding: "10px 28px",
                  borderRadius: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. "OUR RESEARCH / EXPLORE OUR RESEARCH" (UCU REPLICA) ================= */}
      <section style={{ padding: "72px 0", background: "#F7F6F1" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#003896", margin: "0 0 8px" }}>
                Our Studio &amp; Research
              </h2>
              <p style={{ fontSize: 15, color: "#4B5563", margin: 0 }}>
                As CHRISCO Digital Academy, we are committed to strengthening our position as a leading centre for
                open-source AI tools and practical digital handbooks.
              </p>
            </div>
            <Link
              href="/studio"
              style={{
                color: "#003896",
                fontSize: 14.5,
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Read More
            </Link>
          </div>

          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D51", margin: "0 0 28px" }}>
            Explore Our Studio &amp; Handbooks
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 26,
              marginBottom: 38,
            }}
          >
            {RESEARCH_ITEMS.map((item) => (
              <div key={item.title} style={{ background: "#FFFFFF" }}>
                <div
                  style={{
                    height: 185,
                    backgroundImage: `url('${item.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: "18px 18px 22px" }}>
                  <h4 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, color: "#0B1D51", margin: "0 0 10px" }}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0B1D51", textDecoration: "none" }}
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link href={item.href} style={{ color: "#0B1D51", textDecoration: "none" }}>
                        {item.title}
                      </Link>
                    )}
                  </h4>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#6B7280", margin: "0 0 14px" }}>{item.meta}</p>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 14, fontWeight: 600, color: "#003896", textDecoration: "none" }}
                    >
                      Read More
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      style={{ fontSize: 14, fontWeight: 600, color: "#003896", textDecoration: "none" }}
                    >
                      Read More
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 2 Repository Buttons matching UCU Scholar + UCU Digital Institutional Repository */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Link
              href="/studio"
              style={{
                display: "inline-block",
                background: "#003896",
                color: "#FFFFFF",
                padding: "13px 28px",
                borderRadius: 0,
                fontSize: 14.5,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              CHRISCO AI, Voice &amp; SEO Studio
            </Link>
            <Link
              href="/library"
              style={{
                display: "inline-block",
                background: "#E60914",
                color: "#FFFFFF",
                padding: "13px 28px",
                borderRadius: 0,
                fontSize: 14.5,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              CHRISCO Digital Institutional Repository
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 6. "WE ARE OPEN FOR OPPORTUNITIES! + SCHOOLS & FACULTIES" (UCU REPLICA) ================= */}
      <section style={{ padding: "76px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 36,
              marginBottom: 44,
              alignItems: "start",
            }}
          >
            {/* Left Callout */}
            <div style={{ background: "#003896", color: "#FFFFFF", padding: "32px 28px" }}>
              <h5 style={{ fontSize: 18, fontWeight: 700, color: "#F8C90E", margin: "0 0 12px" }}>
                We Are Open For Opportunities!
              </h5>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.9)", margin: "0 0 22px" }}>
                A place where excellence in digital education meets boundless opportunities for personal growth. We
                pride ourselves on our practical programmes, that are designed to equip students with knowledge, skills
                and ethical grounding necessary to excel in their chosen fields.
              </p>
              <Link
                href="/courses"
                style={{
                  display: "inline-block",
                  background: "#E60914",
                  color: "#FFFFFF",
                  padding: "11px 26px",
                  borderRadius: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View All Programmes
              </Link>
            </div>

            {/* Right Heading */}
            <div>
              <h2 style={{ fontSize: "clamp(26px, 2.8vw, 34px)", fontWeight: 700, color: "#0B1D51", margin: "0 0 14px" }}>
                Schools &amp; Faculties
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "#4B5563", margin: 0 }}>
                Choosing the right track is a pretty big deal. That’s why it helps to have choices. And with 19
                practical courses and 20 handbooks to choose from across 7 schools and our Teens AI Bootcamp, you’re
                bound to find something that inspires you.
              </p>
            </div>
          </div>

          {/* Clean Photo Tile Grid of Schools matching UCU */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))",
              gap: 20,
            }}
          >
            {SCHOOLS.map((school) => {
              const inner = (
                <div
                  style={{
                    position: "relative",
                    height: 215,
                    backgroundImage: `url('${school.image}')`,
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
                      padding: "13px 16px",
                      color: "#FFFFFF",
                      fontSize: 15.5,
                      fontWeight: 700,
                    }}
                  >
                    {school.title}
                  </div>
                </div>
              )
              return school.external ? (
                <a
                  key={school.title}
                  href={school.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  {inner}
                </a>
              ) : (
                <Link key={school.title} href={school.href} style={{ textDecoration: "none", display: "block" }}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= 7. "SPREAD OVER 2 DISTRICTS" + "TESTIMONIALS" (UCU REPLICA) ================= */}
      <section style={{ padding: "76px 0", background: "#F7F6F1" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 44,
              alignItems: "center",
              marginBottom: 68,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#E60914", marginBottom: 6 }}>
                Spread over 2 districts &amp; online
              </div>
              <h2 style={{ fontSize: "clamp(26px, 2.8vw, 34px)", fontWeight: 700, color: "#003896", margin: "0 0 16px" }}>
                We Are One Of The Largest Church Youth Digital Academies
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "#4B5563", margin: 0 }}>
                With training cohorts across Central District, Eastern District, Nairobi, and our 24/7 online e-learning
                portal, CHRISCO Digital Academy provides you access to flexible, practical digital programmes without
                barriers.
              </p>
            </div>

            <div>
              <img
                src="/images/workspace.jpg"
                alt="CHRISCO Digital Academy Regional Cohorts"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>

          {/* Testimonials */}
          <h2 style={{ fontSize: "clamp(26px, 2.8vw, 32px)", fontWeight: 700, color: "#003896", margin: "0 0 32px" }}>
            Testimonials
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: "#FFFFFF", padding: "28px 26px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 16.5, fontWeight: 700, color: "#0B1D51" }}>{t.name}</div>
                    <div style={{ fontSize: 13.5, color: "#6B7280", marginTop: 3 }}>{t.role}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14.8, lineHeight: 1.75, color: "#4B5563", margin: 0 }}>{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 8. "UPCOMING EVENTS" | "OFFICE OF THE LEAD TUTOR" | "ACADEMY COUNCIL" (UCU 3-COLUMN REPLICA) ================= */}
      <section style={{ padding: "76px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* Column 1: Upcoming Events */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#003896", margin: 0 }}>Upcoming Events</h2>
                <a
                  href="https://forms.gle/ChriscoTeensAIBootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, color: "#003896", textDecoration: "underline" }}
                >
                  Read more
                </a>
              </div>

              <div style={{ marginBottom: 28 }}>
                <img
                  src="/posters/teens-ai-bootcamp-official.png"
                  alt="Teens AI & Projects Bootcamp"
                  style={{ width: "100%", height: "auto", display: "block", marginBottom: 14 }}
                />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0B1D51", margin: "0 0 8px" }}>
                  Teens AI &amp; Projects Bootcamp
                </h3>
                <p style={{ fontSize: 14, color: "#4B5563", margin: "4px 0" }}>
                  <strong>Date:</strong> Tue 03 Nov – Fri 11 Dec 2026
                </p>
                <p style={{ fontSize: 14, color: "#4B5563", margin: "4px 0" }}>
                  <strong>Time:</strong> 09:00 AM
                </p>
                <p style={{ fontSize: 14, color: "#4B5563", margin: "4px 0 12px" }}>
                  <strong>Venue:</strong> CHRISCO Youth Aflame Hub &amp; Online
                </p>
                <a
                  href="https://forms.gle/ChriscoTeensAIBootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, fontWeight: 600, color: "#E60914", textDecoration: "underline" }}
                >
                  Read More
                </a>
              </div>

              <div>
                <img
                  src="/images/bg-home.jpg"
                  alt="Employability & Freelancing Training Workshop"
                  style={{ width: "100%", height: 160, objectFit: "cover", display: "block", marginBottom: 12 }}
                />
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0B1D51", margin: "0 0 6px" }}>
                  DIGITAL PORTFOLIO &amp; FREELANCING WORKSHOP
                </h3>
                <p style={{ fontSize: 14, color: "#4B5563", margin: "4px 0" }}>
                  <strong>Date:</strong> Every Saturday, 2026
                </p>
                <p style={{ fontSize: 14, color: "#4B5563", margin: "4px 0 10px" }}>
                  <strong>Venue:</strong> Main Digital Hub &amp; Online.
                </p>
                <Link href="/courses" style={{ fontSize: 14, fontWeight: 600, color: "#003896", textDecoration: "underline" }}>
                  Read More
                </Link>
              </div>
            </div>

            {/* Column 2: Office of the Lead Tutor (matches Office of the Vice Chancellor) */}
            <div>
              <img
                src="/images/bg-contact.jpg"
                alt={tutor.name}
                style={{ width: "100%", height: 230, objectFit: "cover", display: "block", marginBottom: 18 }}
              />
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#003896", margin: "0 0 12px" }}>
                Office of the Lead Tutor
              </h2>
              <p style={{ fontSize: 14.8, lineHeight: 1.72, color: "#4B5563", margin: "0 0 12px" }}>
                {tutor.name} is the Lead Tutor and Digital Strategist of CHRISCO Digital Academy.
              </p>
              <p style={{ fontSize: 14.8, lineHeight: 1.72, color: "#4B5563", margin: "0 0 20px" }}>
                {tutor.bio}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link
                  href="/about"
                  style={{
                    display: "block",
                    background: "#003896",
                    color: "#FFFFFF",
                    padding: "11px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Read Lead Tutor&apos;s full biography
                </Link>
                <Link
                  href="/studio"
                  style={{
                    display: "block",
                    background: "#003896",
                    color: "#FFFFFF",
                    padding: "11px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Lead Tutor&apos;s Digital Studio Nuggets
                </Link>
                <Link
                  href="/library"
                  style={{
                    display: "block",
                    background: "#003896",
                    color: "#FFFFFF",
                    padding: "11px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Official Handbooks From Lead Tutor&apos;s Office
                </Link>
              </div>
            </div>

            {/* Column 3: Academy Mentorship Council (matches University Senate 1-6) */}
            <div style={{ background: "#003896", color: "#FFFFFF", padding: "30px 26px" }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#F8C90E", margin: "0 0 14px" }}>
                Academy Council
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", margin: "0 0 20px" }}>
                The Academy Mentorship Council, chaired by the Lead Tutor, serves as the principal deliberative and
                curriculum body of CHRISCO Digital Academy. Its membership comprises the following;
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "1. Lead Tutor & Digital Strategist",
                  "2. Deputy Curriculum Coordinators",
                  "3. School Directors and Track Leads",
                  "4. Deans and Heads of Practical Labs",
                  "5. Managers of Digital Book Repository",
                  "6. Students’ Cohort President",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: "11px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.18)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#FFFFFF",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. "APPLY FOR ADMISSION" + "A GLIMPSE OF CHRISCO DIGITAL ACADEMY" (UCU REPLICA) ================= */}
      <section style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            width: "100%",
          }}
        >
          {/* Left: Full-bleed photo with A Glimpse of CHRISCO Digital Academy */}
          <div
            style={{
              position: "relative",
              minHeight: 380,
              backgroundImage: "url('/images/hero-tile.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "rgba(11, 29, 81, 0.42)" }} />
            <Link
              href="/studio"
              style={{
                position: "relative",
                zIndex: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(0, 56, 150, 0.88)",
                border: "1.5px solid #F8C90E",
                color: "#FFFFFF",
                padding: "14px 28px",
                fontSize: 18,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Icon name="play" size={20} /> A Glimpse of CHRISCO Digital Academy
            </Link>
          </div>

          {/* Right: Apply for Admission */}
          <div
            style={{
              background: "#0B1D51",
              color: "#FFFFFF",
              padding: "clamp(40px, 6vw, 72px) clamp(28px, 5vw, 60px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ fontSize: "clamp(26px, 2.8vw, 34px)", fontWeight: 700, color: "#FFFFFF", margin: "0 0 10px" }}>
              Apply for Admission
            </h2>
            <h3 style={{ fontSize: 19, fontWeight: 600, color: "#F8C90E", margin: "0 0 18px" }}>
              Applications for November – December Intake 2026 are now open
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.88)", margin: "0 0 26px", maxWidth: 540 }}>
              We do not just give our students education and experiences that set them up for success in a career; we
              help them succeed in their careers.
            </p>
            <div>
              <Link
                href="/sign-up"
                style={{
                  display: "inline-block",
                  background: "#14853B",
                  color: "#FFFFFF",
                  padding: "12px 34px",
                  borderRadius: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. "LATEST NEWS & ARTICLES" + "OUR PARTNERS" (UCU REPLICA) ================= */}
      <section style={{ padding: "76px 0", background: "#FFFFFF" }}>
        <div className="container">
          <h2 style={{ fontSize: "clamp(26px, 2.8vw, 32px)", fontWeight: 700, color: "#003896", margin: "0 0 32px" }}>
            Latest News &amp; Articles
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 26,
              marginBottom: 68,
            }}
          >
            {NEWS_ITEMS.map((news) => (
              <div key={news.title}>
                <div
                  style={{
                    height: 190,
                    backgroundImage: `url('${news.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: 14,
                  }}
                />
                <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, color: "#0B1D51", margin: "0 0 8px" }}>
                  {news.external ? (
                    <a
                      href={news.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0B1D51", textDecoration: "none" }}
                    >
                      {news.title}
                    </a>
                  ) : (
                    <Link href={news.href} style={{ color: "#0B1D51", textDecoration: "none" }}>
                      {news.title}
                    </Link>
                  )}
                </h3>
                <div style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 10 }}>{news.date}</div>
                {news.external ? (
                  <a
                    href={news.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 14, fontWeight: 600, color: "#003896", textDecoration: "none" }}
                  >
                    Read More
                  </a>
                ) : (
                  <Link href={news.href} style={{ fontSize: 14, fontWeight: 600, color: "#003896", textDecoration: "none" }}>
                    Read More
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Our Partners */}
          <h2 style={{ fontSize: "clamp(24px, 2.5vw, 30px)", fontWeight: 700, color: "#003896", margin: "0 0 26px" }}>
            Our Partners
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
              gap: 20,
              alignItems: "center",
              borderTop: "1px solid #E5E7EB",
              paddingTop: 28,
            }}
          >
            {[
              "CHRISCO Fellowship of Churches",
              "CHRISCO Youth Aflame",
              "Open-Higgsfield AI Studio",
              "VoiceStudio Narration",
              "Open-SEO Workspace",
              "PURSUE Mission Apparel",
            ].map((partner) => (
              <div
                key={partner}
                style={{
                  padding: "16px 14px",
                  border: "1px solid #E5E7EB",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#003896",
                }}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
