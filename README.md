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
- **Dashboard** - stats, enrollments, account (Supabase auth, gated).
- **Sign In / Sign Up** - split editorial auth screens.

## 📬 Contact

- Email: chriscoyouthaflame2025@gmail.com
- Phone and WhatsApp: shown as call/chat icons only, never as printed numbers

## 🔐 Accounts, handbooks and referrals

- Sign-in and sign-up run on Supabase when `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present.
- Without those keys the app runs in **preview mode**: accounts, sessions and
  enrolments are kept in `localStorage` so every screen remains testable.
- Course objectives and the full outline are public. The handbook PDF needs a
  signed-in account; signed-out visitors get a sign-in prompt instead.
- Referral links look like `/?ref=YOURCODE`. The code is stored for 60 days,
  attached to sign-ups, and summarised on the Affiliates page.

## 🧪 Tests

```bash
npm test          # node:test logic suite + Vitest component suite
npx vitest run    # component tests only
```

## 🧱 Tech

- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- Supabase (auth + profiles + enrollments)
- EmailJS (contact & enrollment forms)
- Google Fonts - Archivo Black / Archivo / Inter

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Set environment variables to enable auth (optional - the site renders publicly without them):

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
- 🏫 Founder - CHRISCO Youth Aflame

## 📄 License

This project is built for **CHRISCO Youth Aflame** - a non-profit youth empowerment organisation serving youth in Uganda.

© 2026 CHRISCO Digital Academy - Founded by Wambete Benjamin

## 🙏 Acknowledgements

- CHRISCO Youth Aflame community
- All the youth across Uganda and Africa who inspired this platform
- Built with love for the youth of Jinja & Buikwe, Uganda 🇺🇬
