"use client"

import { useState, useMemo } from "react"
import Image from "next/image"

export const OPEN_HIGGSFIELD_CATALOG = [
  {
    id: "flux-pro-1.1",
    name: "Flux Pro 1.1 Studio",
    kind: "image",
    aspectRatios: ["1:1", "4:5", "16:9", "9:16"],
    resolutions: ["1080p", "2K", "4K"],
    durations: [],
    badge: "Photorealistic & Posters",
  },
  {
    id: "ideogram-v3",
    name: "Ideogram v3 Typography",
    kind: "image",
    aspectRatios: ["1:1", "4:5", "16:9"],
    resolutions: ["1080p", "2K"],
    durations: [],
    badge: "Posters, Logos & Text",
  },
  {
    id: "recraft-v3",
    name: "Recraft v3 Brand & Vector",
    kind: "image",
    aspectRatios: ["1:1", "4:5", "16:9"],
    resolutions: ["1080p", "2K"],
    durations: [],
    badge: "3D Clay Icons & Illustrations",
  },
  {
    id: "seedance-2.5",
    name: "Seedance 2.5 Cinema",
    kind: "video",
    aspectRatios: ["16:9", "9:16", "1:1"],
    resolutions: ["720p", "1080p"],
    durations: ["5s", "10s"],
    badge: "Storyboards & Motion",
  },
  {
    id: "kling-3-pro",
    name: "Kling 3 Pro 4K Motion",
    kind: "video",
    aspectRatios: ["16:9", "9:16", "4:5"],
    resolutions: ["1080p", "4K"],
    durations: ["5s", "10s"],
    badge: "Cinematic Video",
  },
]

const STARTER_GALLERY = [
  {
    id: "run-teens-poster",
    modelId: "ideogram-v3",
    modelName: "Ideogram v3 Typography",
    kind: "image",
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
    prompt:
      "African youth collaborating in a modern digital creative lab in Nairobi, working on AI prompt workflows, laptops and glowing UI holograms, warm studio lighting.",
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
    prompt:
      "Cinematic camera pan across a youth fellowship media desk editing documentary reels and AI motion graphics, vibrant teal and emerald rim lighting.",
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
    "Design a creative digital project showcase card for an East African teen AI innovator building smart study assistants, studio lighting, crisp typography."
  )
  const [aspectRatio, setAspectRatio] = useState("4:5")
  const [resolution, setResolution] = useState("2K")
  const [duration, setDuration] = useState("5s")
  const [enhancePrompt, setEnhancePrompt] = useState(true)
  const [scope, setScope] = useState("Assets") // Assets | Image | Video | Favorites
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
      ? `${prompt.trim()} — studio grade lighting, ultra-crisp composition, vibrant colors`
      : prompt.trim()

    const newRun = {
      id: `run-${Date.now()}`,
      modelId: currentModel.id,
      modelName: currentModel.name,
      kind: currentModel.kind,
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
        background: "#0B111E",
        color: "#F8FAFC",
        borderRadius: 22,
        padding: "28px 24px",
        border: "1px solid rgba(209, 254, 23, 0.24)",
        boxShadow: "0 18px 42px rgba(0, 0, 0, 0.28)",
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
          marginBottom: 20,
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              background: "rgba(209, 254, 23, 0.14)",
              color: "#D1FE17",
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
          <h2 style={{ fontSize: "1.45rem", fontWeight: 900, margin: 0, color: "#FFFFFF" }}>
            One Composer for Image &amp; Video Projects
          </h2>
        </div>

        <input
          type="search"
          value={modelSearch}
          onChange={(e) => setModelSearch(e.target.value)}
          placeholder="Search models (Flux, Ideogram, Seedance...)"
          style={{
            background: "#131C2E",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 12.5,
            minWidth: 250,
          }}
        />
      </div>

      {/* Searchable Model Picker Rail */}
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 10,
          marginBottom: 18,
        }}
      >
        {filteredModels.map((model) => {
          const active = model.id === currentModel.id
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => handleSelectModel(model)}
              style={{
                flexShrink: 0,
                background: active ? "#D1FE17" : "#131C2E",
                color: active ? "#0B111E" : "#E2E8F0",
                border: active
                  ? "1px solid #D1FE17"
                  : "1px solid rgba(255,255,255,0.14)",
                borderRadius: 14,
                padding: "10px 14px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13 }}>{model.name}</div>
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.8,
                  marginTop: 2,
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
          background: "#131C2E",
          borderRadius: 16,
          padding: 18,
          border: "1px solid rgba(255,255,255,0.12)",
          marginBottom: 22,
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
            background: "#0B111E",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 12,
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700 }}>
              Aspect Ratio:
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                style={{
                  marginLeft: 6,
                  background: "#0B111E",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "5px 8px",
                  fontSize: 12,
                }}
              >
                {currentModel.aspectRatios.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700 }}>
              Resolution:
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                style={{
                  marginLeft: 6,
                  background: "#0B111E",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "5px 8px",
                  fontSize: 12,
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
              <label style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700 }}>
                Duration:
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    marginLeft: 6,
                    background: "#0B111E",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    padding: "5px 8px",
                    fontSize: 12,
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
                fontSize: 12,
                color: "#E2E8F0",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={enhancePrompt}
                onChange={(e) => setEnhancePrompt(e.target.checked)}
                style={{ accentColor: "#D1FE17" }}
              />
              Prompt Enhancement
            </label>
          </div>

          <button
            type="submit"
            style={{
              background: "#D1FE17",
              color: "#0B111E",
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
            background: "#1E293B",
            border: "1px solid #D1FE17",
            borderRadius: 10,
            padding: "8px 14px",
            marginBottom: 16,
            fontSize: 12.5,
          }}
        >
          <span>Run removed from studio gallery.</span>
          <button
            type="button"
            onClick={handleUndoDelete}
            style={{
              background: "#D1FE17",
              color: "#0B111E",
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

      {/* 4-Scope Gallery Tab Rail */}
      <div
        role="tablist"
        aria-label="Gallery scopes"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: 10,
        }}
      >
        {["Assets", "Image", "Video", "Favorites"].map((tab) => {
          const active = scope === tab
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setScope(tab)}
              style={{
                background: active ? "#D1FE17" : "transparent",
                color: active ? "#0B111E" : "#94A3B8",
                border: "none",
                borderRadius: 999,
                padding: "6px 14px",
                fontWeight: 800,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }}
      >
        {visibleRuns.map((run) => (
          <div
            key={run.id}
            style={{
              background: "#131C2E",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "16/10", background: "#000" }}>
              <Image
                src={run.previewUrl}
                alt={run.prompt}
                fill
                sizes="(min-width: 768px) 320px, 90vw"
                style={{ objectFit: "cover" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "rgba(11,17,30,0.82)",
                  color: "#D1FE17",
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: 999,
                }}
              >
                {run.modelName} · {run.aspectRatio}
              </span>
            </div>

            <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#E2E8F0",
                  lineHeight: 1.5,
                  margin: "0 0 12px",
                  flex: 1,
                }}
              >
                {run.prompt}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleReuse(run)}
                  style={{
                    background: "rgba(209, 254, 23, 0.14)",
                    color: "#D1FE17",
                    border: "1px solid rgba(209, 254, 23, 0.35)",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  ↻ Reuse Prompt &amp; Settings
                </button>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    aria-label="Favorite run"
                    onClick={() => handleToggleFavorite(run.id)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: run.favorite ? "#FACC15" : "#94A3B8",
                      borderRadius: 8,
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    aria-label="Delete run"
                    onClick={() => handleDelete(run)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "#F87171",
                      borderRadius: 8,
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
