import Link from "next/link"
import Icon from "../components/Icon"
import { CONSENT_POLICY_VERSION } from "../data/booksCatalogue"
import PrivacyControlsClient from "./PrivacyControlsClient"

export const metadata = {
  title: "Privacy & Data Protection Policy | CHRISCO Youth Aflame & Digital Academy",
  description:
    "How CHRISCO Youth Aflame and CHRISCO Digital Academy protect your personal data, minimize collection, safeguard email book registrations, and uphold your statutory privacy rights.",
}

const sections = [
  {
    id: "controller",
    title: "1. Data Controller & Stewardship Commitment",
    body: [
      "CHRISCO Digital Academy and the CHRISCO Youth Aflame Library are operated by CHRISCO Youth Aflame under CHRISCO FELLOWSHIP OF CHURCHES ('we', 'us', or 'the Academy'). We treat personal information as a sacred trust and handle every reader and learner record with transparency, security, and strict confidentiality.",
      "For any privacy inquiry, data access request, correction, or erasure request, contact our Data Protection Desk directly at chriscoyouthaflame2025@gmail.com.",
    ],
  },
  {
    id: "data-protection",
    title: "2. Applicable Data Protection Frameworks & Core Principles",
    body: [
      "Our data protection practices are designed in alignment with the Kenya Data Protection Act, 2019, the Uganda Data Protection and Privacy Act, 2019, and internationally recognized GDPR principles:",
      "• Lawfulness, Fairness & Transparency: We explain clearly why your account details are requested before you submit them.\n• Purpose Limitation: Data collected to create your learner account and unlock book downloads is never repurposed for unrelated profiling.\n• Data Minimization: We request only the minimum details necessary for your student account and library access.\n• Storage Limitation & Security: Access tokens expire automatically and store salted cryptographic hashes rather than plaintext emails in cookies.",
    ],
  },
  {
    id: "collection",
    title: "3. Information We Collect & How We Use It",
    body: [
      "• Account-Protected Book & Handbook Downloads: Downloading Christian Books or Course Handbooks requires creating a learner account and signing in, with explicit privacy consent recorded under Policy Version " +
        CONSENT_POLICY_VERSION +
        ". Once signed in, all 20 books remain unlocked in your Student Dashboard.",
      "• Student Accounts & Course Enrollments: When you create a student account or enroll in a cohort, we process your name, email, and course progress so you can access your dashboard, e-book library, modules, and completion records.",
      "• Technical Security Logs: To protect the platform from automated abuse, our authentication endpoint applies short-lived, SHA-256 hashed IP rate-limiting in memory without building persistent tracking profiles.",
    ],
  },
  {
    id: "consent",
    title: "4. Unbundled Consent & Zero Data Selling",
    body: [
      "We never use pre-ticked consent boxes. Creating an account to download books requires your explicit agreement to this Privacy & Data Protection Policy; optional announcements are never bundled without your choice.",
      "We NEVER sell, rent, trade, or broker your email address or personal data to advertisers, data brokers, or external marketers.",
    ],
  },
  {
    id: "security",
    title: "5. Technical & Organizational Safeguards",
    body: [
      "• Cryptographic Cookie Protection: Online book access uses an HttpOnly, SameSite=Lax, HMAC-SHA256 signed verification cookie ('chrisco_book_access') inaccessible to third-party scripts.",
      "• Local Storage Minimization: Client-side UI state stores only a masked email indicator (for example, 'g****@gmail.com') rather than raw personal identifiers.",
      "• Restricted File Serving: All 28-page PDF books are served through server-verified route handlers with 'Cache-Control: private, no-store' and 'X-Robots-Tag: noindex' headers.",
    ],
  },
  {
    id: "rights",
    title: "6. Your Data Protection Rights & How to Exercise Them",
    body: [
      "Under applicable East African and international data protection law, you have the right to: (a) know what personal data we hold about you, (b) request correction of inaccurate details, (c) withdraw consent at any time, (d) request erasure ('right to be forgotten') of your registration or account records, and (e) object to optional communications.",
      "You can immediately revoke your browser's book-access cookie using the Self-Service Control above, or email chriscoyouthaflame2025@gmail.com with the subject 'Data Protection Request' for prompt deletion of any server/database records within 14 days.",
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <section
        style={{
          background: "linear-gradient(135deg, var(--navy) 0%, #0d2346 100%)",
          color: "#fff",
          padding: "72px 0 56px",
        }}
      >
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="pill pill-dark pill-sm" style={{ marginBottom: 14 }}>
            <Icon name="shield" size={14} /> Policy Version {CONSENT_POLICY_VERSION} · Effective October 2026
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, marginBottom: 14 }}>
            Privacy &amp; Data Protection Policy
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
            How <strong>CHRISCO Youth Aflame</strong> and <strong>CHRISCO Digital Academy</strong> (under{" "}
            <strong>CHRISCO FELLOWSHIP OF CHURCHES</strong>) safeguard reader emails, uphold strict data minimization,
            and protect your privacy rights.
          </p>
        </div>
      </section>

      <section className="section-frost" style={{ padding: "56px 0 92px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <PrivacyControlsClient />

          <div style={{ display: "grid", gap: 22 }}>
            {sections.map((sec) => (
              <article key={sec.id} id={sec.id} className="card" style={{ padding: "28px 30px" }}>
                <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.18rem", color: "var(--ink)", marginBottom: 12 }}>
                  {sec.title}
                </h2>
                {sec.body.map((para, idx) => (
                  <p
                    key={idx}
                    style={{
                      fontSize: 14.2,
                      color: "var(--body)",
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                      marginBottom: idx < sec.body.length - 1 ? 12 : 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </article>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/library" className="btn btn-navy btn-sm" style={{ textDecoration: "none" }}>
              ← Return to Books &amp; Library
            </Link>
            <a
              href="mailto:chriscoyouthaflame2025@gmail.com?subject=Data%20Protection%20Inquiry"
              className="btn btn-outline btn-sm"
              style={{ textDecoration: "none" }}
            >
              <Icon name="mail" size={14} /> Contact Data Protection Desk
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
