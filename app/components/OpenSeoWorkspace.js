"use client"

import { useState, useMemo } from "react"

const SEED_KEYWORDS = [
  { keyword: "AI bootcamp for teens Kenya", volume: 1900, difficulty: 22, intent: "Transactional", aiVisibility: "94%" },
  { keyword: "CHRISCO Youth Aflame Digital Academy", volume: 880, difficulty: 11, intent: "Navigational", aiVisibility: "98%" },
  { keyword: "practical digital skills courses Nairobi", volume: 2400, difficulty: 34, intent: "Commercial", aiVisibility: "89%" },
  { keyword: "learn prompt engineering and AI projects", volume: 3200, difficulty: 29, intent: "Informational", aiVisibility: "91%" },
  { keyword: "Christian youth mentorship books Kenya", volume: 1100, difficulty: 18, intent: "Commercial", aiVisibility: "92%" },
  { keyword: "PURSUE Christian apparel Kenya", volume: 740, difficulty: 15, intent: "Transactional", aiVisibility: "95%" },
]

export default function OpenSeoWorkspace() {
  const [titleInput, setTitleInput] = useState(
    "CHRISCO Teens AI & Projects Bootcamp | Learn, Build & Impact (Ages 13+)"
  )
  const [metaInput, setMetaInput] = useState(
    "Join the 6-week CHRISCO Youth Aflame Digital Academy Teens AI & Projects Bootcamp (3 Nov – 11 Dec 2026). Teen-friendly AI tools, prompts, and hands-on creative builds."
  )
  const [targetKeyword, setTargetKeyword] = useState("Teens AI")
  const [searchFilter, setSearchFilter] = useState("")

  const audit = useMemo(() => {
    const titleLen = titleInput.trim().length
    const metaLen = metaInput.trim().length
    const kw = targetKeyword.trim().toLowerCase()
    const kwInTitle = kw ? titleInput.toLowerCase().includes(kw) : true
    const kwInMeta = kw ? metaInput.toLowerCase().includes(kw) : true

    let score = 60
    if (titleLen >= 40 && titleLen <= 70) score += 15
    if (metaLen >= 110 && metaLen <= 170) score += 15
    if (kwInTitle) score += 5
    if (kwInMeta) score += 5

    return {
      score: Math.min(100, score),
      titleLen,
      metaLen,
      kwInTitle,
      kwInMeta,
    }
  }, [titleInput, metaInput, targetKeyword])

  const filteredKeywords = useMemo(() => {
    const q = searchFilter.trim().toLowerCase()
    if (!q) return SEED_KEYWORDS
    return SEED_KEYWORDS.filter(
      (k) =>
        k.keyword.toLowerCase().includes(q) ||
        k.intent.toLowerCase().includes(q)
    )
  }, [searchFilter])

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        padding: 24,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              background: "#ECFDF5",
              color: "#047857",
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            OpenSEO · Site Audit &amp; AI Visibility
          </span>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
            Search &amp; AI Visibility Lab
          </h3>
        </div>

        <div
          style={{
            background: "#002333",
            color: "#00FF84",
            padding: "8px 16px",
            borderRadius: 12,
            fontWeight: 900,
            fontSize: "0.95rem",
          }}
        >
          SEO &amp; AI Score: {audit.score}/100
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              marginBottom: 6,
            }}
          >
            Page Title ({audit.titleLen} chars · optimal 40–70)
          </label>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #CBD5E1",
              fontSize: 13.5,
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              marginBottom: 6,
            }}
          >
            Target Focus Keyword
          </label>
          <input
            type="text"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #CBD5E1",
              fontSize: 13.5,
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: "#334155",
            marginBottom: 6,
          }}
        >
          Meta Description ({audit.metaLen} chars · optimal 110–170)
        </label>
        <textarea
          rows={2}
          value={metaInput}
          onChange={(e) => setMetaInput(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #CBD5E1",
            fontSize: 13.5,
          }}
        />
      </div>

      {/* Live Keyword Explorer */}
      <div
        style={{
          borderTop: "1px solid #E2E8F0",
          paddingTop: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A" }}>
            East Africa Keyword &amp; AI Visibility Matrix
          </div>
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter keywords..."
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #CBD5E1",
              fontSize: 12.5,
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12.5,
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                <th style={{ padding: "8px 6px" }}>Keyword</th>
                <th style={{ padding: "8px 6px" }}>Monthly Vol</th>
                <th style={{ padding: "8px 6px" }}>KD %</th>
                <th style={{ padding: "8px 6px" }}>Search Intent</th>
                <th style={{ padding: "8px 6px" }}>AI Visibility</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((row) => (
                <tr key={row.keyword} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "8px 6px", fontWeight: 700, color: "#0F172A" }}>
                    {row.keyword}
                  </td>
                  <td style={{ padding: "8px 6px" }}>{row.volume.toLocaleString()}</td>
                  <td style={{ padding: "8px 6px" }}>{row.difficulty}</td>
                  <td style={{ padding: "8px 6px" }}>
                    <span
                      style={{
                        background: "#EFF6FF",
                        color: "#1D4ED8",
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {row.intent}
                    </span>
                  </td>
                  <td style={{ padding: "8px 6px", fontWeight: 800, color: "#059669" }}>
                    {row.aiVisibility}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
