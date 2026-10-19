# CHRISCO Digital Academy — Colour System & Navigation Notes

## 1. What we took from the reference site

The Mediacrest Training College site was studied for **colour organisation and
navigation pattern only**. It is a restrained institutional layout:

| Observed principle | Why it works |
| --- | --- |
| A white / near-white canvas carries most of the page | Content breathes; nothing competes with photography |
| Dark ink bands used sparingly for contrast | Creates clear chapter breaks without shouting |
| One saturated colour used as a *signal*, not a surface | Green appears in labels, icons, small buttons — rarely as a full background |
| A gentle neutral ladder between sections (white → mist → slate) | Each band reads as its own plane, so long pages stay legible |
| Deep, tightly-spaced footer navigation | Feels organised and complete |
| Grouped dropdown navigation (courses grouped into tracks) | Lets a large catalogue be scanned in one panel |

## 2. What we deliberately did **not** change

The CHRISCO inspiration is untouched. These four values still carry the brand:

```
--navy        #002333   dark teal plane (nav, dark bands, footer)
--green       #00FF84   electric green — CTA and signal
--green-deep  #00B865   green that is legible on light paper
--green-tint  #E9FFF4   soft green wash — chips only, never a surface
```

No brand colour was replaced, recoloured or re-hued. What changed is **how much
space each one is allowed to occupy**.

## 3. What was reorganised

### The surface ladder

A neutral scale now sits under the brand colours. Sections climb it one step at
a time instead of alternating between white and green washes:

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#FAFAF6` | Layer 0 — page base |
| `--layer-1` | `#F4F7F4` | Layer 1 — mist band |
| `--layer-2` | `#EBF0ED` | Layer 2 — slate band |
| `--layer-3` | `#E2E9E5` | Layer 3 — deep slate |
| `--surface` | `#FFFFFF` | Layer 4 — cards and panels |
| `--navy` | `#002333` | Contrast plane — founder, footer, CTA |

Frosted bands (`.section-frost`, `.section-frost-alt`, `.section-frost-deep`)
now map onto this ladder, so pages with a photographic backdrop still stack
tonally instead of glowing green.

### Where green is allowed

- Primary CTA buttons (`Explore Courses`, `Apply Now`, WhatsApp)
- Small section labels (`.eyebrow`) and icons inside neutral chips
- A 2px hairline on open navigation panels and active nav items
- Hover states in menus and links

### Where green was removed or demoted

- Section backgrounds — `.section-green` is now a pale tint with a hairline,
  never an electric full-bleed band
- Hero and CTA glows — opacity dropped from `0.16–0.20` to `0.09–0.12`
- Backdrop brand tint — dropped to `0.04`
- Course card headers — replaced 19 saturated course gradients with a navy
  photo wash; each course keeps its colour as a 3px identity rule
- "Soft" chips — now neutral with a green icon instead of a green fill
- Footer top edge — a full green bar became a hairline
- Card hover borders — neutral hairline instead of green

## 4. Navigation

The navbar is now three layers:

1. **Utility strip** — location, phone, hours, WhatsApp (desktop only)
2. **Brand bar** — logo, six menu groups, auth actions / `Apply Now`
3. **Dropdown panels** — white paper panels with a single green hairline

Menus:

| Group | Panel |
| --- | --- |
| Home | direct link |
| About Us | Who We Are · Our Mission · Meet the Founder · Contact |
| Courses | full-width mega panel: 3 track columns (Business & Career, Marketing & Content, Design & Build) + navy guidance rail |
| Programs | Online Learning · In-Person · Youth & Community · Corporate |
| Students | Dashboard · Log In · Create Account · Course Guidance |
| Contact | direct link |

Courses deep-link into the catalogue with
`/courses?category=Coding` and `/courses?course=12`.

Purely CSS/JS — no new dependencies. Includes keyboard `Escape`, outside-click
close, hover-intent grace, route-change close, and a stacked mobile accordion.
