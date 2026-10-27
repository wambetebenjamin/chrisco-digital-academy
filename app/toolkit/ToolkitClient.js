"use client"
import { useMemo, useState } from "react"
import Icon from "../components/Icon"
import { toolkitFilters, toolkitPrompts, advancedTools } from "../data/toolkit"

/* Pull the [bracketed] and {braced} tokens out of a prompt so learners can
 * see exactly which words they are expected to replace. */
function extractTokens(text) {
  const matches = text.match(/\[[^\]]+\]|\{[^}]+\}/g) || []
  return Array.from(new Set(matches)).slice(0, 8)
}

/* Clipboard API with a legacy fallback so copy still works on older mobile
 * browsers and inside embedded web views. */
async function copyText(text) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the textarea trick
  }
  try {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.style.position = "fixed"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

const TYPE_META = {
  video: { label: "Video", icon: "video" },
  image: { label: "Image", icon: "palette" },
  writing: { label: "Writing", icon: "pen" },
  starter: { label: "Starter", icon: "bulb" },
}

const FREE_TOOLS = [
  { name: "ChatGPT", url: "https://chat.openai.com", note: "Writing & ideas" },
  { name: "Google Gemini", url: "https://gemini.google.com", note: "Text & images" },
  { name: "Canva", url: "https://www.canva.com", note: "Design & templates" },
  { name: "CapCut", url: "https://www.capcut.com", note: "Video editing" },
]

function PromptCard({ card }) {
  const [draft, setDraft] = useState(card.prompt)
  const [copied, setCopied] = useState(false)
  const tokens = useMemo(() => extractTokens(card.prompt), [card.prompt])
  const typeMeta = TYPE_META[card.type] || TYPE_META.starter

  async function handleCopy() {
    const ok = await copyText(draft)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  function handleReset() {
    setDraft(card.prompt)
  }

  return (
    <article className="toolkit-card card card-hover" data-type={card.type}>
      <div className="toolkit-card-head">
        <span className="pill pill-soft pill-sm toolkit-type-pill">
          <Icon name={typeMeta.icon} size={12} strokeWidth={2.2} /> {typeMeta.label}
        </span>
        <span className="pill pill-sm toolkit-track-pill">{card.track}</span>
      </div>

      <h3 className="toolkit-card-title">{card.title}</h3>
      <p className="toolkit-card-desc">{card.description}</p>

      {Array.isArray(card.structure) && card.structure.length > 0 && (
        <ol className="toolkit-structure">
          {card.structure.map((step, i) => (
            <li key={i}>
              <span className="toolkit-step-num">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      )}

      {tokens.length > 0 && (
        <div className="toolkit-tokens">
          <span className="toolkit-tokens-label">Replace:</span>
          {tokens.map((token) => (
            <code key={token} className="toolkit-token">
              {token}
            </code>
          ))}
        </div>
      )}

      <textarea
        className="input toolkit-prompt"
        aria-label={`Editable prompt: ${card.title}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={Math.min(12, Math.max(4, Math.ceil(card.prompt.length / 95)))}
      />

      <div className="toolkit-card-actions">
        <button
          type="button"
          className={`btn btn-sm ${copied ? "btn-green" : "btn-navy"}`}
          onClick={handleCopy}
          style={{ cursor: "pointer" }}
        >
          <Icon name={copied ? "checkCircle" : "clipboard"} size={14} strokeWidth={2.2} />
          {copied ? "Copied!" : "Copy prompt"}
        </button>
        {draft !== card.prompt && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleReset}
            style={{ cursor: "pointer" }}
          >
            Reset
          </button>
        )}
        {card.course && (
          <span className="toolkit-course">
            <Icon name="book" size={12} strokeWidth={2.2} /> {card.course}
          </span>
        )}
      </div>

      <p className="toolkit-tip">
        <Icon name="bulb" size={13} strokeWidth={2.2} /> <span>{card.tip}</span>
      </p>
    </article>
  )
}

export default function ToolkitClient() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [query, setQuery] = useState("")

  const counts = useMemo(() => {
    const map = { all: toolkitPrompts.length }
    for (const card of toolkitPrompts) {
      map[card.type] = (map[card.type] || 0) + 1
    }
    return map
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return toolkitPrompts.filter((card) => {
      const filterOk = activeFilter === "all" || card.type === activeFilter
      if (!filterOk) return false
      if (!q) return true
      return [card.title, card.description, card.prompt, card.track, card.course]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    })
  }, [activeFilter, query])

  return (
    <>
      {/* How it works */}
      <section className="section-frost" style={{ padding: "44px 0 8px" }}>
        <div className="container">
          <div className="grid-3">
            {[
              { icon: "search", title: "1. Pick a prompt", desc: "Filter by video, image, writing or quick starter prompts for everyday tasks." },
              { icon: "pen", title: "2. Fill the brackets", desc: "Tap the prompt and replace every [bracketed] or {braced} token with your own details." },
              { icon: "send", title: "3. Paste into a free tool", desc: "Copy and paste into ChatGPT, Gemini, Canva or CapCut — no paid account required to start." },
            ].map((step) => (
              <div key={step.title} className="card" style={{ padding: "24px 22px" }}>
                <span className="tutor-req-ico" style={{ marginBottom: 14 }}>
                  <Icon name={step.icon} size={18} strokeWidth={1.9} />
                </span>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="toolkit-free-tools">
            <span className="toolkit-tokens-label">Free tools to paste into:</span>
            {FREE_TOOLS.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="pill pill-soft toolkit-free-pill"
              >
                {tool.name} <span className="toolkit-free-note">· {tool.note}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and search */}
      <section className="section" style={{ padding: "28px 0 8px" }}>
        <div className="container">
          <div className="toolkit-controls">
            <div className="toolkit-filters" role="group" aria-label="Filter prompts by type">
              {toolkitFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`pill toolkit-filter${activeFilter === filter.id ? " is-active" : ""}`}
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  style={{ cursor: "pointer" }}
                >
                  <Icon name={filter.icon} size={13} strokeWidth={2.3} />
                  {filter.label}
                  <span className="toolkit-filter-count">{counts[filter.id] || 0}</span>
                </button>
              ))}
            </div>
            <input
              type="search"
              className="input toolkit-search"
              placeholder="Search prompts — e.g. poster, caption, drone…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search prompts"
            />
          </div>
          <p className="toolkit-result-count" aria-live="polite">
            Showing <strong>{visible.length}</strong> of {toolkitPrompts.length} prompts
          </p>
        </div>
      </section>

      {/* Prompt cards */}
      <section className="section" style={{ padding: "16px 0 40px" }}>
        <div className="container">
          {visible.length === 0 ? (
            <div className="card toolkit-empty">
              <Icon name="search" size={30} strokeWidth={1.6} />
              <h3>No prompts match that search</h3>
              <p>Try a different word, or clear the search to see the full toolkit.</p>
              <button
                type="button"
                className="btn btn-green btn-sm"
                onClick={() => {
                  setQuery("")
                  setActiveFilter("all")
                }}
                style={{ cursor: "pointer" }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid-3 toolkit-grid">
              {visible.map((card) => (
                <PromptCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Advanced open-source tools */}
      <section className="section-frost-alt" style={{ padding: "44px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ fontSize: 11 }}>
            Go further
          </span>
          <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.5rem", color: "var(--ink)", margin: "6px 0 8px" }}>
            Advanced open-source creator tools
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 680, marginBottom: 26 }}>
            These free, open-source desktop projects power professional AI workflows. They need their own
            installation and API keys, so we recommend them after you have worked through the relevant handbook.
          </p>
          <div className="grid-3">
            {advancedTools.map((tool) => (
              <div key={tool.id} className="card" style={{ padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.15rem", color: "var(--ink)", margin: 0 }}>
                    {tool.name}
                  </h3>
                  <span className="pill pill-soft pill-sm" style={{ fontSize: 10.5, flexShrink: 0 }}>
                    {tool.license}
                  </span>
                </div>
                {tool.formerly && (
                  <span style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 6 }}>{tool.formerly}</span>
                )}
                <p style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600, marginBottom: 12 }}>{tool.tagline}</p>

                <p className="toolkit-subhead">What it does</p>
                <ul className="toolkit-bullets">
                  {tool.does.map((d) => (
                    <li key={d}>
                      <Icon name="checkCircle" size={13} strokeWidth={2.3} /> {d}
                    </li>
                  ))}
                </ul>

                <p className="toolkit-subhead">What you need</p>
                <ul className="toolkit-bullets toolkit-bullets--muted">
                  {tool.requirements.map((r) => (
                    <li key={r}>
                      <Icon name="warn" size={13} strokeWidth={2.1} /> {r}
                    </li>
                  ))}
                </ul>

                <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "10px 0 16px", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--ink)" }}>Best for:</strong> {tool.bestFor}
                </p>

                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-navy btn-sm"
                    style={{ textDecoration: "none", fontSize: 12.5, textAlign: "center" }}
                  >
                    View on GitHub →
                  </a>
                  {tool.upstreamUrl && (
                    <a
                      href={tool.upstreamUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ textDecoration: "none", fontSize: 12, textAlign: "center" }}
                    >
                      Original project →
                    </a>
                  )}
                  <span style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>{tool.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
