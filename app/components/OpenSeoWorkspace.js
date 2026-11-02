"use client"

import { useState, useMemo } from "react"

export const KEYWORD_RESEARCH_CATALOG = [
  {
    keyword: "teens ai bootcamp uganda",
    volume: 2400,
    difficulty: 22,
    cpc: "$0.85",
    intent: "Transactional",
    aiVisibility: "96% Indexed",
  },
  {
    keyword: "digital skills training east africa",
    volume: 5100,
    difficulty: 34,
    cpc: "$1.20",
    intent: "Commercial",
    aiVisibility: "91% Indexed",
  },
  {
    keyword: "coding and ai projects for teens",
    volume: 3800,
    difficulty: 27,
    cpc: "$0.95",
    intent: "Informational",
    aiVisibility: "94% Indexed",
  },
  {
    keyword: "python programming course east africa",
    volume: 4200,
    difficulty: 31,
    cpc: "$1.10",
    intent: "Transactional",
    aiVisibility: "89% Indexed",
  },
  {
    keyword: "youtube automation course",
    volume: 6700,
    difficulty: 29,
    cpc: "$0.75",
    intent: "Commercial",
    aiVisibility: "92% Indexed",
  },
  {
    keyword: "freelancing skills for african youth",
    volume: 4900,
    difficulty: 25,
    cpc: "$0.65",
    intent: "Informational",
    aiVisibility: "95% Indexed",
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
    "Practical AI learning and creative digital projects designed for young minds (Ages 13+). Join the 6-week CHRISCO Digital Academy Teens AI & Projects Bootcamp online."
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
        background: "#F5F7FA",
        padding: "28px 26px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#003896", marginBottom: 4 }}>
            CHRISCO Digital Academy · Content &amp; Search Audit Lab
          </div>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#0B1D51",
              margin: 0,
            }}
          >
            On-Page Search Audit &amp; Keyword Practice
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#0B1D51",
            color: "#FFFFFF",
            padding: "8px 16px",
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>
            Audit Score:
          </span>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F8C90E" }}>
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
          marginBottom: 16,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#0B1D51",
              marginBottom: 6,
            }}
          >
            Page Title ({audit.titleLen} chars · optimal 40–70)
          </label>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="input"
            style={{ fontSize: 13.5 }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#0B1D51",
              marginBottom: 6,
            }}
          >
            Target Focus Keyword
          </label>
          <input
            type="text"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            className="input"
            style={{ fontSize: 13.5 }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 12.5,
            fontWeight: 700,
            color: "#0B1D51",
            marginBottom: 6,
          }}
        >
          Meta Description ({audit.descLen} chars · optimal 110–170)
        </label>
        <textarea
          rows={2}
          value={metaInput}
          onChange={(e) => setMetaInput(e.target.value)}
          className="input"
          style={{ fontSize: 13.5 }}
        />
      </div>

      {/* Keyword Table */}
      <div style={{ background: "#FFFFFF", padding: 18 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0B1D51" }}>
            East Africa Digital Skills Keyword Reference
          </div>
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter keywords..."
            className="input"
            style={{ maxWidth: 240, padding: "8px 12px", fontSize: 12.5 }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#0B1D51", color: "#FFFFFF" }}>
                <th style={{ padding: "10px 12px" }}>Keyword</th>
                <th style={{ padding: "10px 12px" }}>Monthly Vol</th>
                <th style={{ padding: "10px 12px" }}>KD %</th>
                <th style={{ padding: "10px 12px" }}>Search Intent</th>
                <th style={{ padding: "10px 12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((row) => (
                <tr key={row.keyword} style={{ background: "#FFFFFF" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0B1D51" }}>
                    {row.keyword}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#334155" }}>
                    {row.volume.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#334155" }}>
                    {row.difficulty}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#003896", fontWeight: 600 }}>
                    {row.intent}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#334155" }}>
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
