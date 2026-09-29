# 🎓 CHRISCO Digital Academy

A modern learning platform equipping African youth with practical digital skills — design, code, marketing,
writing, video and AI. Built for **CHRISCO Youth Aflame** and founded by **Wambete Benjamin**.

## 🎨 Design Language

"Creative studio meets editorial magazine" — bold, editorial, playful yet professional.

| Token | Value | Use |
| --- | --- | --- |
| Dark teal | `#002333` | Top nav, dark sections, footer, chat |
| Electric green | `#00FF84` | Primary CTAs, accents, highlights |
| Paper | `#FAFAF6` | Editorial off-white page base |
| Ink | `#06202E` | Headings & display type |
| Hairline | `#E3E9E7` | Card borders, dividers |

- **Typography** — Archivo Black (heavy display headlines, uppercase), Archivo (subheads/UI), Inter (body).
- **Components** — pill-shaped outlined tags, whitespace-heavy card grids, category sidebar + hero image tile,
  marquee ticker, ghost outline text, green-glow CTAs.
- **Shape** — rounded cards (20–28px), 999px pill buttons, hairline borders, soft shadows.

### ✨ Photography & motion

Photography is treated as the subject, not wallpaper: heroes and CTA bands run their images at full strength
with a **directional gradient scrim** (dark where type sits, clear on the photo side) instead of a flat dark
overlay, and the fixed page backdrop uses only a light paper veil.

| Piece | What it does |
| --- | --- |
| `components/Reveal.js` | IntersectionObserver fade/slide/scale reveals on scroll (unobserves after playing) |
| `components/Parallax.js` | rAF-throttled parallax drift, only while the element is on screen |
| `components/AccentShapes.js` | Pure-CSS floating brand orbs (`#002333` / `#00FF84`) |
| `globals.css` motion layer | Ken-Burns zoom, aurora gradient, hover photo zoom + sheen, scroll cue, `.section-veil` |
| `scripts/optimize_images.py` | Crops, grades (vibrance/contrast) and re-encodes all site photography |

Everything animated is switched off under `prefers-reduced-motion`, the heaviest layer (the fixed backdrop's
Ken-Burns) is held still below 768px, and all non-hero images are lazy-loaded through `next/image`.

## 🗺️ Pages

- **Home** — editorial hero (category sidebar + image tile + stats), skills marquee, skill tracks, featured
  courses, how-it-works, founder band, CTA, footer, chatbot.
- **About** — story, stats, mission & vision, values, founder profile.
- **Courses** — 19 courses across 7 categories (incl. Business & economic-empowerment skills) with sidebar filters, syllabus modals, download & enrollment
  (EmailJS → shambetz@gmail.com).
- **Contact** — info cards, WhatsApp shortcut, EmailJS contact form.
- **Dashboard** — stats, enrollments, account (Supabase auth, gated).
- **Sign In / Sign Up** — split editorial auth screens.

## 🧱 Tech

- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- Supabase (auth + profiles + enrollments)
- EmailJS (contact & enrollment forms)
- Google Fonts — Archivo Black / Archivo / Inter

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Set environment variables to enable auth (optional — the site renders publicly without them):

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 👨‍💻 About The Developer

**Wambete Benjamin**
Computer Science Graduate | Graphic Designer | Web Developer | Video Editor | Animator | Social Media Manager | AI Expert

- 📧 shambetz@gmail.com
- 📞 +254112272061
- 📍 Jinja & Buikwe, Uganda
- 🏫 Founder — CHRISCO Youth Aflame

## 📄 License

This project is built for **CHRISCO Youth Aflame** — a non-profit youth empowerment organisation serving youth in Uganda.

© 2026 CHRISCO Digital Academy — Founded by Wambete Benjamin

## 🙏 Acknowledgements

- CHRISCO Youth Aflame community
- All the youth across Uganda and Africa who inspired this platform
- Built with love for the youth of Jinja & Buikwe, Uganda 🇺🇬
