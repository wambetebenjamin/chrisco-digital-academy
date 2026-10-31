"use client"

import { useState, useMemo } from "react"

export const KEYWORD_RESEARCH_CATALOG = [
  {
    keyword: "teens ai bootcamp kenya",
    volume: 2400,
    difficulty: 22,
    cpc: "$0.85",
    intent: "Transactional",
    aiVisibility: "96% Cited (ChatGPT & Perplexity)",
    color: "#E60914",
  },
  {
    keyword: "digital skills training nairobi",
    volume: 5100,
    difficulty: 34,
    cpc: "$1.20",
    intent: "Commercial",
    aiVisibility: "91% Cited (Google AI Overviews)",
    color: "#084EC8",
  },
  {
    keyword: "coding and ai projects for teens",
    volume: 3800,
    difficulty: 27,
    cpc: "$0.95",
    intent: "Informational",
    aiVisibility: "94% Cited (ChatGPT Search)",
    color: "#38A128",
  },
  {
    keyword: "python programming course east africa",
    volume: 4200,
    difficulty: 31,
    cpc: "$1.10",
    intent: "Transactional",
    aiVisibility: "89% Cited (Perplexity)",
    color: "#EE6816",
  },
  {
    keyword: "youtube automation course kenya",
    volume: 6700,
    difficulty: 29,
    cpc: "$0.75",
    intent: "Commercial",
    aiVisibility: "92% Cited (ChatGPT & Gemini)",
    color: "#D99B00",
  },
  {
    keyword: "freelancing skills for african youth",
    volume: 4900,
    difficulty: 25,
    cpc: "$0.65",
    intent: "Informational",
    aiVisibility: "95% Cited (All AI Engines)",
    color: "#0B1D51",
  },
]

export function evaluatePageSeo({ title = "", description = "", keyword = "" }) {
  const t = String(title || "").trim()
  const d = String(description || "").trim()
  const k = String(keyword || "").trim().toLowerCase()

  const titleLenOk = t.length >= 40 && t.length <= 70
  const descLenOk = d.length >= 110 && d.length <= 170
  const keywordInTitle = k ? t.toLowerCase().includes(k) : true
  const keywordInDesc = k ? d.toLowerCase().includes(k) : true

  let score = 60
  if (titleLenOk) score += 10
  if (descLenOk) score += 10
  if (keywordInTitle) score += 10
  if (keywordInDesc) score += 10

  return {
    score,
    titleLen: t.length,
    descLen: d.length,
    titleLenOk,
    descLenOk,
    keywordInTitle,
    keywordInDesc,
  }
}

export default function OpenSeoWorkspace() {
  const [searchFilter, setSearchFilter] = useState("")
  const [titleInput, setTitleInput] = useState(
    "CHRISCO Youth Aflame Digital Academy · Teens AI & Projects Bootcamp"
  )
  const [metaInput, setMetaInput] = useState(
    "Fun AI learning and creative digital projects designed for young minds (Ages 13+). Join the 6-week CHRISCO Digital Academy Teens AI & Projects Bootcamp online."
  )
  const [targetKeyword, setTargetKeyword] = useState("teens ai")

  const audit = useMemo(
    () =>
      evaluatePageSeo({
        title: titleInput,
        description: metaInput,
        keyword: targetKeyword,
      }),
    [titleInput, metaInput, targetKeyword]
  )

  const filteredKeywords = useMemo(() => {
    const q = searchFilter.trim().toLowerCase()
    if (!q) return KEYWORD_RESEARCH_CATALOG
    return KEYWORD_RESEARCH_CATALOG.filter(
      (item) =>
        item.keyword.toLowerCase().includes(q) ||
        item.intent.toLowerCase().includes(q)
    )
  }, [searchFilter])

  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #DCE3F0",
        borderTop: "5px solid #38A128",
        borderRadius: 12,
        padding: "26px 24px",
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
          paddingBottom: 14,
          borderBottom: "1px solid #DCE3F0",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              background: "#38A128",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 12px",
              borderRadius: 999,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            OpenSEO · Search &amp; AI Visibility Lab
          </span>
          <h3
            style={{
              fontSize: "1.35rem",
              fontWeight: 900,
              color: "#0B1D51",
              margin: 0,
            }}
          >
            Live On-Page SEO Audit, Keyword Explorer &amp; AI Citations
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#F8C90E",
            padding: "8px 18px",
            borderRadius: 999,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: "#0B1D51" }}>
            Technical &amp; AI SEO Score:
          </span>
          <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0B1D51" }}>
            {audit.score}/100
          </span>
        </div>
      </div>

      {/* Live On-Page Audit Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 800,
              color: "#E60914",
              marginBottom: 6,
            }}
          >
            • Page Title ({audit.titleLen} chars · optimal 40–70)
          </label>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1.5px solid #C2CEE3",
              fontSize: 13.5,
              color: "#0B1D51",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 800,
              color: "#084EC8",
              marginBottom: 6,
            }}
          >
            • Target Focus Keyword
          </label>
          <input
            type="text"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1.5px solid #C2CEE3",
              fontSize: 13.5,
              color: "#0B1D51",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            display: "block",
            fontSize: 12.5,
            fontWeight: 800,
            color: "#38A128",
            marginBottom: 6,
          }}
        >
          • Meta Description ({audit.descLen} chars · optimal 110–170)
        </label>
        <textarea
          rows={2}
          value={metaInput}
          onChange={(e) => setMetaInput(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1.5px solid #C2CEE3",
            fontSize: 13.5,
            color: "#0B1D51",
          }}
        />
      </div>

      {/* Live Keyword Explorer — Poster Color Rows */}
      <div
        style={{
          borderTop: "1px solid #DCE3F0",
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
          <div style={{ fontWeight: 900, fontSize: 14, color: "#0B1D51" }}>
            East Africa Keyword &amp; AI Visibility Matrix
          </div>
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter keywords..."
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1.5px solid #C2CEE3",
              background: "#F7F6F1",
              fontSize: 12.5,
              color: "#0B1D51",
            }}
          />
        </div>

        <div style={{ overflowX: "auto", border: "1px solid #DCE3F0", borderRadius: 10 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12.8,
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#003896", color: "#FFFFFF" }}>
                <th style={{ padding: "10px 12px" }}>Keyword</th>
                <th style={{ padding: "10px 12px" }}>Monthly Vol</th>
                <th style={{ padding: "10px 12px" }}>KD %</th>
                <th style={{ padding: "10px 12px" }}>Search Intent</th>
                <th style={{ padding: "10px 12px" }}>AI Visibility</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((row) => (
                <tr key={row.keyword} style={{ borderBottom: "1px solid #DCE3F0", background: "#FFFFFF" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 800, color: row.color }}>
                    • {row.keyword}
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0B1D51" }}>
                    {row.volume.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "#084EC8" }}>
                    {row.difficulty}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        background: row.color,
                        color: "#FFFFFF",
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {row.intent}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#38A128", fontWeight: 800 }}>
                    {row.aiVisibility}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
