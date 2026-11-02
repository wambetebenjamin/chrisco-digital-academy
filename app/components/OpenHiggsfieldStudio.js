"use client"

import { useState, useMemo } from "react"
import Image from "next/image"

export const OPEN_HIGGSFIELD_CATALOG = [
  {
    id: "poster-design",
    name: "Visual & Poster Design",
    kind: "image",
    aspectRatios: ["1:1", "4:5", "16:9", "9:16"],
    resolutions: ["1080p", "2K", "4K"],
    durations: [],
    badge: "Posters & Brand Graphics",
  },
  {
    id: "typography-layout",
    name: "Typography & Editorial Layout",
    kind: "image",
    aspectRatios: ["1:1", "4:5", "16:9"],
    resolutions: ["1080p", "2K"],
    durations: [],
    badge: "Flyers, Titles & Layouts",
  },
  {
    id: "brand-illustration",
    name: "Brand & Vector Illustration",
    kind: "image",
    aspectRatios: ["1:1", "4:5", "16:9"],
    resolutions: ["1080p", "2K"],
    durations: [],
    badge: "Icons & Visual Diagrams",
  },
  {
    id: "storyboard-motion",
    name: "Video Storyboard & Motion",
    kind: "video",
    aspectRatios: ["16:9", "9:16", "1:1"],
    resolutions: ["720p", "1080p"],
    durations: ["5s", "10s"],
    badge: "Storyboards & Short Reels",
  },
]

const STARTER_GALLERY = [
  {
    id: "run-teens-poster",
    modelId: "typography-layout",
    modelName: "Typography & Editorial Layout",
    kind: "image",
    prompt:
      "4:5 educational poster for CHRISCO Youth Aflame Digital Academy Teens AI & Projects Bootcamp, East African teenager with backpack, clean typography and royal blue footer.",
    aspectRatio: "4:5",
    resolution: "2K",
    duration: null,
    previewUrl: "/posters/teens-ai-bootcamp-official.png",
    favorite: true,
    createdAt: "Academy Example",
  },
  {
    id: "run-ai-literacy",
    modelId: "poster-design",
    modelName: "Visual & Poster Design",
    kind: "image",
    prompt:
      "Young people collaborating in a CHRISCO Digital Academy creative lab, working on AI prompt workflows, laptops, and practical project boards.",
    aspectRatio: "16:9",
    resolution: "2K",
    duration: null,
    previewUrl: "/images/hero-tile.jpg",
    favorite: true,
    createdAt: "Academy Example",
  },
  {
    id: "run-video-story",
    modelId: "storyboard-motion",
    modelName: "Video Storyboard & Motion",
    kind: "video",
    prompt:
      "Youth fellowship media desk editing documentary reels and practical digital projects at CHRISCO Youth Aflame.",
    aspectRatio: "16:9",
    resolution: "1080p",
    duration: "5s",
    previewUrl: "/images/bg-home.jpg",
    favorite: false,
    createdAt: "Academy Example",
  },
]

export default function OpenHiggsfieldStudio() {
  const [selectedModelId, setSelectedModelId] = useState(OPEN_HIGGSFIELD_CATALOG[0].id)
  const [modelSearch, setModelSearch] = useState("")
  const [prompt, setPrompt] = useState(
    "Design a creative digital project showcase poster for a CHRISCO Digital Academy student building practical study tools, clean studio lighting, clear typography."
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
      ? `${prompt.trim()} — studio lighting, clear composition, editorial layout`
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
        background: "#F5F7FA",
        color: "#0B1D51",
        padding: "28px 26px",
      }}
    >
      {/* Header */}
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
          <div style={{ fontSize: 13, fontWeight: 600, color: "#003896", marginBottom: 4 }}>
            CHRISCO Digital Academy · Prompt Engineering Lab
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#0B1D51" }}>
            Image &amp; Video Prompt Practice Composer
          </h2>
        </div>

        <input
          type="search"
          value={modelSearch}
          onChange={(e) => setModelSearch(e.target.value)}
          placeholder="Filter workflow tracks..."
          className="input"
          style={{ maxWidth: 260, padding: "9px 14px", fontSize: 13 }}
        />
      </div>

      {/* Workflow Picker */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 10,
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
                background: active ? "#0B1D51" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#0B1D51",
                border: "none",
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13.5, color: active ? "#FFFFFF" : "#0B1D51" }}>
                {model.name}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: active ? "rgba(255,255,255,0.8)" : "#475569",
                  marginTop: 4,
                }}
              >
                {model.kind.toUpperCase()} · {model.badge}
              </div>
            </button>
          )
        })}
      </div>

      {/* Prompt Composer */}
      <form
        onSubmit={handleGenerate}
        style={{
          background: "#FFFFFF",
          padding: 20,
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
          placeholder="Write your image or video project prompt..."
          className="input"
          style={{ marginBottom: 14, fontSize: 14 }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            <label style={{ fontSize: 13, color: "#0B1D51", fontWeight: 600 }}>
              Aspect Ratio:
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                style={{
                  marginLeft: 6,
                  background: "#F5F7FA",
                  color: "#0B1D51",
                  border: "none",
                  padding: "6px 10px",
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                {currentModel.aspectRatios.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ fontSize: 13, color: "#0B1D51", fontWeight: 600 }}>
              Resolution:
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                style={{
                  marginLeft: 6,
                  background: "#F5F7FA",
                  color: "#0B1D51",
                  border: "none",
                  padding: "6px 10px",
                  fontSize: 12.5,
                  fontWeight: 600,
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
              <label style={{ fontSize: 13, color: "#0B1D51", fontWeight: 600 }}>
                Duration:
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    marginLeft: 6,
                    background: "#F5F7FA",
                    color: "#0B1D51",
                    border: "none",
                    padding: "6px 10px",
                    fontSize: 12.5,
                    fontWeight: 600,
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
                fontSize: 13,
                color: "#0B1D51",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={enhancePrompt}
                onChange={(e) => setEnhancePrompt(e.target.checked)}
              />
              Structured Prompt Framing
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" style={{ cursor: "pointer" }}>
            Save Prompt Run
          </button>
        </div>
      </form>

      {lastDeletedRun && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FFFFFF",
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
            color: "#0B1D51",
          }}
        >
          <span>Run removed from gallery.</span>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="btn btn-navy btn-sm"
            style={{ cursor: "pointer" }}
          >
            Undo Delete
          </button>
        </div>
      )}

      {/* Gallery Scopes */}
      <div
        role="tablist"
        aria-label="Gallery scopes"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {["Assets", "Image", "Video", "Favorites"].map((label) => {
          const active = scope === label
          return (
            <button
              key={label}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setScope(label)}
              className="pill pill-sm"
              style={{
                background: active ? "#0B1D51" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#0B1D51",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 18,
        }}
      >
        {visibleRuns.map((run) => (
          <div
            key={run.id}
            style={{
              background: "#FFFFFF",
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
            </div>

            <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#003896", marginBottom: 4 }}>
                {run.modelName} · {run.kind.toUpperCase()} · {run.aspectRatio} · {run.resolution}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#334155",
                  lineHeight: 1.6,
                  margin: "0 0 14px",
                  flex: 1,
                }}
              >
                {run.prompt}
              </p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleReuse(run)}
                  className="btn btn-primary btn-sm"
                  style={{ cursor: "pointer", padding: "6px 12px", fontSize: 12 }}
                >
                  Reuse Prompt
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleFavorite(run.id)}
                  className="btn btn-outline btn-sm"
                  style={{ cursor: "pointer", padding: "6px 12px", fontSize: 12 }}
                >
                  {run.favorite ? "Saved" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(run)}
                  className="btn btn-outline btn-sm"
                  style={{ cursor: "pointer", padding: "6px 12px", fontSize: 12, marginLeft: "auto" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
