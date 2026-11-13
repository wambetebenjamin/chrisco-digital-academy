# 🎓 CHRISCO Digital Academy

A modern learning platform equipping African youth with practical digital skills - design, code, marketing,
writing, video and AI. Built as the learning platform of **CHRISCO Youth Aflame**, operating under **CHRISCO Fellowship of Churches International**.

## 🎨 Design Language

"Creative studio meets editorial magazine" - bold, editorial, playful yet professional.

The brand palette is unchanged; it is organised over a neutral surface ladder so
green stays a signal rather than a surface. Full rationale in
[COLOR-SYSTEM.md](./COLOR-SYSTEM.md).

| Token | Value | Use |
| --- | --- | --- |
| Dark teal | `#002333` | Top nav, contrast bands, footer, chat |
| Electric green | `#00FF84` | Primary CTAs, active nav marks, small signals |
| Green deep | `#00B865` | Green text/icons on light paper |
| Paper | `#FAFAF6` | Layer 0 page base |
| Mist / slate | `#F4F7F4` / `#EBF0ED` | Layers 1–2 alternating section bands |
| Ink | `#06202E` | Headings & display type |
| Hairline | `#E3E9E7` | Card borders, dividers |

- **Typography** - Archivo Black (heavy display headlines, uppercase), Archivo (subheads/UI), Inter (body).
- **Components** - pill-shaped outlined tags, whitespace-heavy card grids, category sidebar + hero image tile,
  ghost outline text, restrained green CTAs.
- **Navigation** - three-layer bar (utility strip, brand bar, grouped dropdowns) with a full-width
  courses mega-menu, keyboard/escape support and a stacked mobile accordion.
- **Shape** - rounded cards (20-28px), 999px pill buttons, hairline borders, soft shadows.

## 🗺️ Pages

- **Home** - editorial hero (category sidebar + image tile + stats), credentials strip, skill
  tracks, featured courses, founder band, how-it-works, CTA, footer, chatbot.
- **About** - story, stats, mission & vision, values, tutor profile, and a "become a tutor" pathway.
- **Courses** - 19 courses across 7 categories (incl. Business & economic-empowerment skills) with sidebar filters, syllabus modals, download & enrollment
  (EmailJS → shambetz@gmail.com).
- **Become a Tutor** - open tracks, requirements, what the academy provides, application steps.
- **PURSUE Shop** - merchandise mockups with codes, S to XXL sizes, quantity picker, order tray,
  recommendations and share links.
- **Affiliates** - referral code and link builder, per-course links, referral tracking.
- **Contact** - info cards, WhatsApp shortcut, EmailJS contact form.
- **Dashboard** - stats, enrolments, account (Sheet-backed sign-in, gated).
- **Sign In / Sign Up** - split editorial auth screens.

## 📬 Contact

- Email: chriscoyouthaflame2025@gmail.com
- Phone and WhatsApp: shown as call/chat icons only, never as printed numbers

## 🔐 Accounts, handbooks and referrals

There is no database server. **The Google Sheet is the database**, reached
through one Google Apps Script Web App. Full setup, the tab-by-tab schema and the
`doGet`/`doPost` code are in
[docs/GOOGLE-SHEETS-BACKEND.md](./docs/GOOGLE-SHEETS-BACKEND.md); the script
itself is [docs/apps-script/Code.gs](./docs/apps-script/Code.gs).

- Every read is `GET ?sheet=Name`, and every form submission is one `fetch()`
  POST of `{ sheet, action, ...fields }` to `GOOGLE_SCRIPT_WEBAPP_URL`.
- Sign-in, enrolments, progress and saved books are rows in the Sheet.
- Until `NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL` is set the app runs in **preview
  mode**: the session is kept in `localStorage` so every screen remains testable.
- Course objectives and the full outline are public. The handbook PDF needs a
  signed-in account; signed-out visitors get a sign-in prompt instead.
- Referral links look like `/?ref=YOURCODE`. The code is stored for 60 days,
  attached to sign-ups, and summarised on the Affiliates page.

## 🎬 Course Films

Every course has a ~90-second vertical promo film (1080 × 1920, narrated,
captioned). They are built from the same course data as the site and published
as GitHub Release assets rather than repository files:

```
https://github.com/wambetebenjamin/chrisco-digital-academy/releases/tag/course-films-v1
```

Download them all from **[/films](https://chrisco-digital-academy.vercel.app/films)**
or straight from the release. Rebuild with `npm run films:texts`, `films:align`,
`films:render`, `films:verify`, `films:publish` — full notes in
[docs/COURSE-FILMS.md](./docs/COURSE-FILMS.md).

## 🧪 Tests

```bash
npm test          # node:test logic suite + Vitest component suite
npx vitest run    # component tests only
```

## 🧱 Tech

- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- Google Sheets (database) via a Google Apps Script Web App
- Google Docs + Google Slides (curriculum, orientation deck)
- Google Fonts - Archivo Black / Archivo / Inter

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Set one environment variable to connect the Sheet (optional — the site renders
publicly without it, in preview mode):

```bash
NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL=https://script.google.com/macros/s/AKfy…/exec
```

Deploy the frontend on **Render** and add the same variable there.

## 👨‍💻 About The Developer

**Wambete Benjamin**
Computer Science Graduate | Graphic Designer | Web Developer | Video Editor | Animator | Social Media Manager | AI Expert

- 📧 shambetz@gmail.com
- 📞 +254112272061
- 📍 Jinja & Buikwe, Uganda
- 🏫 Founder - CHRISCO Youth Aflame

## 📄 License

This project is built for **CHRISCO Youth Aflame** - a non-profit youth empowerment organisation serving youth in Uganda.

© 2026 CHRISCO Digital Academy - Founded by Wambete Benjamin

## 🙏 Acknowledgements

- CHRISCO Youth Aflame community
- All the youth across Uganda and Africa who inspired this platform
- Built with love for the youth of Jinja & Buikwe, Uganda 🇺🇬
