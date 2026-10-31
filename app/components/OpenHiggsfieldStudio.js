"use client"

import { useState, useMemo } from "react"
import Image from "next/image"

export const OPEN_HIGGSFIELD_CATALOG = [
  {
    id: "flux-pro-1.1",
    name: "Flux Pro 1.1 Studio",
    kind: "image",
    color: "#E60914",
    aspectRatios: ["1:1", "4:5", "16:9", "9:16"],
    resolutions: ["1080p", "2K", "4K"],
    durations: [],
    badge: "Photorealistic & Posters",
  },
  {
    id: "ideogram-v3",
    name: "Ideogram v3 Typography",
    kind: "image",
    color: "#084EC8",
    aspectRatios: ["1:1", "4:5", "16:9"],
    resolutions: ["1080p", "2K"],
    durations: [],
    badge: "Posters, Logos & Text",
  },
  {
    id: "recraft-v3",
    name: "Recraft v3 Brand & Vector",
    kind: "image",
    color: "#38A128",
    aspectRatios: ["1:1", "4:5", "16:9"],
    resolutions: ["1080p", "2K"],
    durations: [],
    badge: "3D Clay Icons & Illustrations",
  },
  {
    id: "seedance-2.5",
    name: "Seedance 2.5 Cinema",
    kind: "video",
    color: "#EE6816",
    aspectRatios: ["16:9", "9:16", "1:1"],
    resolutions: ["720p", "1080p"],
    durations: ["5s", "10s"],
    badge: "Storyboards & Motion",
  },
  {
    id: "kling-3-pro",
    name: "Kling 3 Pro 4K Motion",
    kind: "video",
    color: "#D99B00",
    aspectRatios: ["16:9", "9:16", "4:5"],
    resolutions: ["1080p", "4K"],
    durations: ["5s", "10s"],
    badge: "Cinematic Video",
  },
]

const POSTER_COLORS = ["#E60914", "#084EC8", "#38A128", "#EE6816", "#D99B00"]

const STARTER_GALLERY = [
  {
    id: "run-teens-poster",
    modelId: "ideogram-v3",
    modelName: "Ideogram v3 Typography",
    kind: "image",
    color: "#E60914",
    prompt:
      "4:5 educational poster for CHRISCO Youth Aflame Digital Academy Teens AI & Projects Bootcamp, joyful East African teenager with backpack looking upward toward floating 3D clay icons, off-white background with torn-paper blue footer.",
    aspectRatio: "4:5",
    resolution: "2K",
    duration: null,
    previewUrl: "/posters/teens-ai-bootcamp-official.png",
    favorite: true,
    createdAt: "Featured Template",
  },
  {
    id: "run-ai-literacy",
    modelId: "flux-pro-1.1",
    modelName: "Flux Pro 1.1 Studio",
    kind: "image",
    color: "#084EC8",
    prompt:
      "African youth collaborating in a modern digital creative lab in Nairobi, working on AI prompt workflows, laptops and project boards, warm studio lighting.",
    aspectRatio: "16:9",
    resolution: "2K",
    duration: null,
    previewUrl: "/images/hero-tile.jpg",
    favorite: true,
    createdAt: "Starter Run",
  },
  {
    id: "run-video-story",
    modelId: "seedance-2.5",
    modelName: "Seedance 2.5 Cinema",
    kind: "video",
    color: "#38A128",
    prompt:
      "Cinematic camera pan across a youth fellowship media desk editing documentary reels and AI motion graphics, vibrant royal blue and warm orange lighting.",
    aspectRatio: "16:9",
    resolution: "1080p",
    duration: "5s",
    previewUrl: "/images/bg-home.jpg",
    favorite: false,
    createdAt: "Starter Storyboard",
  },
]

export default function OpenHiggsfieldStudio() {
  const [selectedModelId, setSelectedModelId] = useState(OPEN_HIGGSFIELD_CATALOG[0].id)
  const [modelSearch, setModelSearch] = useState("")
  const [prompt, setPrompt] = useState(
    "Design a creative digital project showcase poster for an East African teen AI innovator building smart study assistants, studio lighting, crisp typography."
  )
  const [aspectRatio, setAspectRatio] = useState("4:5")
  const [resolution, setResolution] = useState("2K")
  const [duration, setDuration] = useState("5s")
  const [enhancePrompt, setEnhancePrompt] = useState(true)
  const [scope, setScope] = useState("Assets")
  const [runs, setRuns] = useState(STARTER_GALLERY)
  const [lastDeletedRun, setLastDeletedRun] = useState(null)

  const currentModel = useMemo(
    () =>
      OPEN_HIGGSFIELD_CATALOG.find((m) => m.id === selectedModelId) ||
      OPEN_HIGGSFIELD_CATALOG[0],
    [selectedModelId]
  )

  const filteredModels = useMemo(() => {
    const q = modelSearch.trim().toLowerCase()
    if (!q) return OPEN_HIGGSFIELD_CATALOG
    return OPEN_HIGGSFIELD_CATALOG.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.badge.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q)
    )
  }, [modelSearch])

  const visibleRuns = useMemo(() => {
    return runs.filter((r) => {
      if (scope === "Image") return r.kind === "image"
      if (scope === "Video") return r.kind === "video"
      if (scope === "Favorites") return r.favorite
      return true
    })
  }, [runs, scope])

  const handleSelectModel = (model) => {
    setSelectedModelId(model.id)
    if (!model.aspectRatios.includes(aspectRatio)) {
      setAspectRatio(model.aspectRatios[0])
    }
    if (!model.resolutions.includes(resolution)) {
      setResolution(model.resolutions[0])
    }
    if (model.durations.length && !model.durations.includes(duration)) {
      setDuration(model.durations[0])
    }
  }

  const handleGenerate = (e) => {
    if (e) e.preventDefault()
    if (!prompt.trim()) return

    const finalPrompt = enhancePrompt
      ? `${prompt.trim()} — studio grade lighting, ultra-crisp composition, vibrant poster colors`
      : prompt.trim()

    const newRun = {
      id: `run-${Date.now()}`,
      modelId: currentModel.id,
      modelName: currentModel.name,
      kind: currentModel.kind,
      color: currentModel.color || "#084EC8",
      prompt: finalPrompt,
      aspectRatio,
      resolution,
      duration: currentModel.kind === "video" ? duration : null,
      previewUrl:
        currentModel.kind === "video"
          ? "/images/bg-home.jpg"
          : "/posters/teens-ai-bootcamp-official.png",
      favorite: false,
      createdAt: "Just now",
    }

    setRuns((prev) => [newRun, ...prev])
  }

  const handleReuse = (run) => {
    const targetModel =
      OPEN_HIGGSFIELD_CATALOG.find((m) => m.id === run.modelId) ||
      OPEN_HIGGSFIELD_CATALOG[0]
    setSelectedModelId(targetModel.id)
    setPrompt(run.prompt)
    setAspectRatio(run.aspectRatio || targetModel.aspectRatios[0])
    setResolution(run.resolution || targetModel.resolutions[0])
    if (run.duration) setDuration(run.duration)
  }

  const handleToggleFavorite = (id) => {
    setRuns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
    )
  }

  const handleDelete = (run) => {
    setLastDeletedRun(run)
    setRuns((prev) => prev.filter((r) => r.id !== run.id))
  }

  const handleUndoDelete = () => {
    if (!lastDeletedRun) return
    setRuns((prev) => [lastDeletedRun, ...prev])
    setLastDeletedRun(null)
  }

  return (
    <section
      style={{
        background: "#FFFFFF",
        color: "#0B1D51",
        borderRadius: 12,
        padding: "26px 24px",
        border: "1px solid #DCE3F0",
        borderTop: "5px solid #E60914",
      }}
    >
      {/* Studio Header */}
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
              background: "#E60914",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 12px",
              borderRadius: 999,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            OpenHiggsfield Studio · Image &amp; Video Prompt Lab
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: 0, color: "#0B1D51" }}>
            One Composer for Image &amp; Video Projects
          </h2>
        </div>

        <input
          type="search"
          value={modelSearch}
          onChange={(e) => setModelSearch(e.target.value)}
          placeholder="Search models (Flux, Ideogram, Seedance...)"
          style={{
            background: "#F7F6F1",
            color: "#0B1D51",
            border: "1.5px solid #C2CEE3",
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 12.5,
            minWidth: 250,
          }}
        />
      </div>

      {/* Searchable Model Picker Rail — Each Model Uses Its Poster Color */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
          border: "1px solid #DCE3F0",
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        {filteredModels.map((model, idx) => {
          const active = model.id === currentModel.id
          const mColor = model.color || POSTER_COLORS[idx % POSTER_COLORS.length]
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => handleSelectModel(model)}
              style={{
                background: active ? mColor : "#FFFFFF",
                color: active ? "#FFFFFF" : "#0B1D51",
                border: "none",
                borderRight: "1px solid #DCE3F0",
                borderTop: `4px solid ${mColor}`,
                padding: "12px 14px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13, color: active ? "#FFFFFF" : mColor }}>
                • {model.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: active ? "rgba(255,255,255,0.9)" : "#475569",
                  marginTop: 3,
                  fontWeight: 600,
                }}
              >
                {model.kind.toUpperCase()} · {model.badge}
              </div>
            </button>
          )
        })}
      </div>

      {/* Single Prompt Composer + Per-Model Settings */}
      <form
        onSubmit={handleGenerate}
        style={{
          background: "#F7F6F1",
          borderRadius: 10,
          padding: 18,
          border: "1px solid #DCE3F0",
          marginBottom: 20,
        }}
      >
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              handleGenerate(e)
            }
          }}
          placeholder="Describe your AI image or video project prompt... (Press Ctrl/⌘ + Enter to run)"
          style={{
            width: "100%",
            background: "#FFFFFF",
            color: "#0B1D51",
            border: "1.5px solid #C2CEE3",
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 14,
            marginBottom: 14,
          }}
        />

        {/* Per-model declarative allow-list controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <label style={{ fontSize: 12.5, color: "#E60914", fontWeight: 800 }}>
              Aspect Ratio:
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                style={{
                  marginLeft: 6,
                  background: "#FFFFFF",
                  color: "#0B1D51",
                  border: "1px solid #C2CEE3",
                  borderRadius: 6,
                  padding: "5px 8px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {currentModel.aspectRatios.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ fontSize: 12.5, color: "#084EC8", fontWeight: 800 }}>
              Resolution:
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                style={{
                  marginLeft: 6,
                  background: "#FFFFFF",
                  color: "#0B1D51",
                  border: "1px solid #C2CEE3",
                  borderRadius: 6,
                  padding: "5px 8px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {currentModel.resolutions.map((res) => (
                  <option key={res} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </label>

            {currentModel.durations.length > 0 && (
              <label style={{ fontSize: 12.5, color: "#38A128", fontWeight: 800 }}>
                Duration:
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    marginLeft: 6,
                    background: "#FFFFFF",
                    color: "#0B1D51",
                    border: "1px solid #C2CEE3",
                    borderRadius: 6,
                    padding: "5px 8px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {currentModel.durations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                color: "#EE6816",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={enhancePrompt}
                onChange={(e) => setEnhancePrompt(e.target.checked)}
                style={{ accentColor: "#EE6816" }}
              />
              Prompt Enhancement
            </label>
          </div>

          <button
            type="submit"
            style={{
              background: "#F8C90E",
              color: "#0B1D51",
              border: "none",
              borderRadius: 999,
              padding: "10px 22px",
              fontWeight: 900,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            Generate with {currentModel.name} ↵
          </button>
        </div>
      </form>

      {/* Undo Bar */}
      {lastDeletedRun && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FEF9E3",
            border: "1px solid #F8C90E",
            borderRadius: 8,
            padding: "8px 14px",
            marginBottom: 16,
            fontSize: 12.5,
            color: "#0B1D51",
          }}
        >
          <span>Run removed from studio gallery.</span>
          <button
            type="button"
            onClick={handleUndoDelete}
            style={{
              background: "#084EC8",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 999,
              padding: "4px 12px",
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Undo Delete
          </button>
        </div>
      )}

      {/* 4-Scope Gallery Tab Rail (Red, Blue, Green, Orange) */}
      <div
        role="tablist"
        aria-label="Gallery scopes"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          borderBottom: "1px solid #DCE3F0",
          paddingBottom: 10,
        }}
      >
        {[
          { label: "Assets", color: "#E60914" },
          { label: "Image", color: "#084EC8" },
          { label: "Video", color: "#38A128" },
          { label: "Favorites", color: "#EE6816" },
        ].map((tab) => {
          const active = scope === tab.label
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setScope(tab.label)}
              style={{
                background: active ? tab.color : "#F7F6F1",
                color: active ? "#FFFFFF" : tab.color,
                border: `1.5px solid ${tab.color}`,
                borderRadius: 999,
                padding: "6px 16px",
                fontWeight: 800,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Gallery Sheet — Divided Items Using Poster Colors */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          border: "1px solid #DCE3F0",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {visibleRuns.map((run, idx) => {
          const rColor = run.color || POSTER_COLORS[idx % POSTER_COLORS.length]
          return (
            <div
              key={run.id}
              style={{
                background: "#FFFFFF",
                borderRight: "1px solid #DCE3F0",
                borderBottom: "1px solid #DCE3F0",
                borderTop: `4px solid ${rColor}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 185,
                  width: "100%",
                  background: "#0B1D51",
                }}
              >
                <Image
                  src={run.previewUrl}
                  alt={run.prompt}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  style={{ objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: rColor,
                    color: "#FFFFFF",
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  {run.kind.toUpperCase()} · {run.aspectRatio} · {run.resolution}
                  {run.duration ? ` · ${run.duration}` : ""}
                </span>
              </div>

              <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: rColor, marginBottom: 4 }}>
                  • {run.modelName} ({run.createdAt})
                </div>
                <p
                  style={{
                    fontSize: 12.5,
                    color: "#1E293B",
                    lineHeight: 1.55,
                    margin: "0 0 12px",
                    flex: 1,
                  }}
                >
                  {run.prompt}
                </p>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid #DCE3F0", paddingTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleReuse(run)}
                    style={{
                      background: "#084EC8",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Reuse Prompt
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(run.id)}
                    style={{
                      background: run.favorite ? "#F8C90E" : "#F7F6F1",
                      color: "#0B1D51",
                      border: "1px solid #C2CEE3",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {run.favorite ? "★ Favorited" : "☆ Favorite"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(run)}
                    style={{
                      background: "#FFFFFF",
                      color: "#E60914",
                      border: "1px solid #E60914",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
