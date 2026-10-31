import Link from "next/link"
import Image from "next/image"

export default function AuthShell({ children, subtitle }) {
  return (
    <main
      className="auth-horizon-page"
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowX: "hidden",
        background: "#0B1D51",
      }}
    >
      {/* Full-bleed background photography from the original site */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Image
          src="/images/bg-home.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(112deg, rgba(11, 29, 81, 0.90) 0%, rgba(0, 56, 150, 0.72) 52%, rgba(8, 78, 200, 0.56) 100%)",
          }}
        />
      </div>

      {/* Top navigation bar over full-bleed background */}
      <header
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1220,
          width: "100%",
          margin: "0 auto",
          padding: "24px 32px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            color: "rgba(255,255,255,0.92)",
            textDecoration: "none",
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#F8C90E", fontSize: 16 }}>←</span> Back to website
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            href="/courses"
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Explore 19 Courses
          </Link>
          <a
            href="tel:+254112272061"
            style={{
              color: "#F8C90E",
              textDecoration: "none",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 12.5,
              letterSpacing: "0.06em",
            }}
          >
            +254 112 272 061
          </a>
        </div>
      </header>

      {/* Main 2-column centered stage (Dribbble 24790137 Travel Login template) */}
      <div
        className="auth-horizon-stage"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1220,
          width: "100%",
          margin: "auto",
          padding: "28px 32px 44px",
        }}
      >
        {/* Left editorial hero block */}
        <aside className="auth-horizon-aside">
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 18 }}>
            <svg
              width="164"
              height="30"
              viewBox="0 0 180 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ marginBottom: -4, marginLeft: 6 }}
            >
              <path
                d="M4 28C46 6 112 6 156 20"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="1.8"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
              <path d="M163 14L175 19L161 24L165 19L163 14Z" fill="#F8C90E" />
            </svg>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "#EE6816",
                  border: "2px solid #F8C90E",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  color: "#FFFFFF",
                }}
              >
                C
              </span>
              <span style={{ lineHeight: 1.05 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.35rem",
                    letterSpacing: "0.06em",
                    color: "#FFFFFF",
                    display: "block",
                  }}
                >
                  CHRISCO
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#F8C90E",
                  }}
                >
                  Digital Academy
                </span>
              </span>
            </Link>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "#FFFFFF",
              fontSize: "clamp(2.8rem, 5.4vw, 4.6rem)",
              lineHeight: 0.94,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginBottom: 18,
              textShadow: "0 10px 28px rgba(0, 0, 0, 0.32)",
            }}
          >
            EXPLORE
            <br />
            HORIZONS
          </h2>

          <p
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "clamp(1.05rem, 1.5vw, 1.22rem)",
              lineHeight: 1.42,
              maxWidth: 430,
              marginBottom: 12,
            }}
          >
            Where Your Digital Dreams Become Practical Reality.
          </p>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.84)",
              fontSize: "0.94rem",
              lineHeight: 1.72,
              maxWidth: 430,
              marginBottom: 24,
            }}
          >
            {subtitle}
          </p>

          {/* Original repository images strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              maxWidth: 440,
              marginBottom: 22,
            }}
          >
            {[
              { src: "/images/bg-courses.jpg", label: "19 Free Courses", border: "#E60914" },
              { src: "/images/workspace.jpg", label: "Hands-On Labs", border: "#F8C90E" },
              { src: "/images/hero-tile.jpg", label: "Live Mentorship", border: "#38A128" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  position: "relative",
                  height: 78,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: `1.5px solid ${item.border}`,
                  boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="150px"
                  style={{ objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: "auto 0 0 0",
                    padding: "4px 8px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,29,81,0.92) 100%)",
                    color: "#FFFFFF",
                    fontSize: 10.5,
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { name: "Prompt Engineering", color: "#E60914" },
              { name: "Python Coding", color: "#084EC8" },
              { name: "Web Building", color: "#38A128" },
              { name: "AI Projects", color: "#EE6816" },
            ].map((t) => (
              <span
                key={t.name}
                style={{
                  background: t.color,
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "5px 11px",
                  borderRadius: 999,
                }}
              >
                {t.name}
              </span>
            ))}
          </div>
        </aside>

        {/* Right floating translucent frosted card (Dribbble 24790137 template) */}
        <div className="auth-horizon-card-wrap">
          <div className="auth-horizon-card">{children}</div>
        </div>
      </div>
    </main>
  )
}
