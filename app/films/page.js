import { courses } from "../data/courses"
import { buildSocialMetadata, resolveServerOrigin } from "../lib/siteOrigin"
import "./films.css"

// Films live in the repository under /v1. GitHub serves committed .mp4 files as
// application/octet-stream with X-Content-Type-Options: nosniff, so every link
// downloads instead of streaming — which is exactly what this page promises.
const REPO = "wambetebenjamin/chrisco-digital-academy"
const BRANCH = "arena/5440d692-chrisco-digital-academy"
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/v1`

function filmHref(slug) {
  return `${RAW}/${slug}.mp4`
}

function posterHref(slug) {
  return `${RAW}/posters/${slug}.jpg`
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function generateMetadata() {
  const origin = await resolveServerOrigin()
  return buildSocialMetadata({
    origin,
    title: "Course Films · CHRISCO Digital Academy",
    description:
      "Nineteen vertical course films — 1080 × 1920, ninety seconds each, narrated and captioned. Download any of them directly.",
    path: "/films",
  })
}

export default function FilmsPage() {
  const films = courses.map((course) => {
    const slug = slugify(course.title)
    return {
      ...course,
      slug,
      mp4: filmHref(slug),
      poster: posterHref(slug),
    }
  })

  return (
    <main className="films-page">
      <header className="films-hero">
        <p className="films-eyebrow">Download centre</p>
        <h1>
          Nineteen <span>course films</span>
        </h1>
        <p className="films-lead">
          Vertical, narrated, captioned and ready to post. 1080 × 1920, about ninety
          seconds each. Tap a title to download the MP4 directly — no account, no
          player, no waiting.
        </p>
        <p className="films-meta">1080 × 1920 · 30 fps · H.264 + AAC · −14 LUFS</p>
      </header>

      <ol className="films-list">
        {films.map((film, index) => (
          <li key={film.slug}>
            <span className="films-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="films-body">
              <h2>
                <a href={film.mp4} download>
                  {film.title}
                </a>
              </h2>
              <p>
                {film.category} · {film.level} · {film.duration}
              </p>
            </div>
            <a className="films-download" href={film.mp4} download>
              MP4
            </a>
            <a
              className="films-download films-download-ghost"
              href={film.poster}
              download
            >
              JPG
            </a>
          </li>
        ))}
      </ol>

      <footer className="films-footer">
        <p>
          Built for CHRISCO Youth Aflame · Digital Academy · Jinja &amp; Buikwe, Uganda
        </p>
      </footer>
    </main>
  )
}
