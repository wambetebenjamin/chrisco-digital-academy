# Merchandise artwork

Three collections share one print system.

| Collection | Artwork | Where it lives |
| --- | --- | --- |
| PURSUE | Sunrise warrior, golden arrow, "PURSUE / OVERTAKE • RECOVER ALL / 1 Samuel 30:8" | `public/merch/source/pursue-design.png` |
| Faith affirmations | Type only: Faith Over Fear, Chosen, Be Still, Anchored, Grace, Risen, Wonderfully Made | Generated directly in the mockups |
| Scripture statements | 1 Samuel 30:8 as the anchor, plus 2 Corinthians 5:7, 2 Corinthians 6:2 and Matthew 4:19 | Generated directly in the mockups |

The supplied reference photos in `public/merch/source/refs/` are the brief for
the scripture set, not artwork to copy: bold stacked caps, script paired with
condensed caps, a vintage engraved badge and a heavy brush lettering piece. Each
one is redrawn in the CHRISCO warm palette so nothing borrows a navy or red
palette from the references.

## Palette

The garments are deliberately warm so the gold artwork sits naturally, with
white and black for the quieter pieces:

| Token | Hex | Used on |
| --- | --- | --- |
| Cocoa brown | `#4A342A` | Tee, hoodie, polo, cap, journal |
| Warm cream | `#EFE3CE` | Tee, hoodie, mug, journal |
| Black | `#111111` | Tee, hoodie |
| White | `#FFFFFF` | Tee, polo, cap, mug |
| Natural canvas | `#D9CDB4` | Totes |

## Placement template

| Code | Product | Placement | Size on garment | Technique |
| --- | --- | --- | --- | --- |
| TS-01 | Tee, Brown | Centre chest | 44% width, 90mm below collar | Screen print |
| TS-02 | Tee, Cream | Centre chest | 44% width, 90mm below collar | Screen print |
| TS-03 | Tee, Black | Centre chest | 44% width, 90mm below collar | Screen print |
| TS-04 | Tee, White | Centre chest | 44% width, 90mm below collar | Screen print |
| TS-05 | Faith Over Fear Tee, White | Centre chest | 34% width, type only | Gold screen print |
| TS-06 | Chosen Tee, Black | Left chest | 75mm wide, type only | Gold screen print |
| HD-01 | Hoodie, Brown | Below drawstrings, above pocket | 38% width | Screen print |
| HD-02 | Hoodie, Cream | Below drawstrings, above pocket | 38% width | Screen print |
| HD-03 | Be Still Hoodie, Black | Below drawstrings, above pocket | 32% width, type only | Cream and gold print |
| PL-01 | Polo, Brown | Left chest | 85mm wide | Screen print |
| PL-02 | Polo, White | Left chest | 85mm wide | Screen print |
| CP-01 | Cap, Brown | Front panel centre | 58mm wide | Embroidery |
| CP-02 | Anchored Cap, White | Front panel centre | 58mm wide | Embroidery |
| TB-01 | Tote, Natural | Centre front, all four margins equal | 42% width | Screen print |
| TB-02 | Grace Tote, Natural | Centre front, all four margins equal | 45% width, type only | Brown screen print |
| MG-01 | Mug, Cream | Front face, opposite handle | 55% height | Sublimation |
| MG-02 | Risen Mug, White | Front face, opposite handle | 50% height, type only | Gold print |
| NB-01 | PURSUE Journal, Brown | Cover centre | Small foil emblem cluster, 30% width | Gold foil |
| NB-02 | Wonderfully Made Journal, Cream | Cover centre | 45% width, type only | Gold foil |
| TS-07 | Overtake Tee, Black | Centre chest | 28cm wide, 90mm below collar | Cream and gold screen print |
| TS-08 | The Presence Tee, Cream | Centre chest | 27cm wide, below collar | Brown and gold screen print |
| TS-09 | Walk By Faith Tee, White | Centre chest | 25cm wide, below collar | Brown and gold screen print |
| TS-10 | Now Is The Time Tee, Brown | Centre chest | 26cm wide, below collar | Cream and gold screen print |
| TS-11 | Fishers Of Men Tee, Cream | Centre chest | 26cm wide, below collar | Sepia and gold badge print |
| HD-04 | Recover All Hoodie, Cream | Between drawstrings and pocket | 26cm wide | Espresso and gold screen print |
| PL-03 | PURSUE Crest Polo, Cream | Left chest | 80mm circular crest | Embroidery |
| CP-03 | Overtake Cap, Black | Front panel centre | Arched, 58mm tall | Cream and gold embroidery |
| TB-03 | Walk By Faith Tote, Natural | Centre front, all four margins equal | 60% width | Brown screen print |
| MG-03 | Recover All Mug, Cream | Front face, opposite handle | 55% height | Sublimation |

## Rules

- Centre first: equal left and right margins. Totes need equal margins on all
  four sides.
- Minimum 60mm clear below the collar, 50mm clear of each sleeve seam.
- Hoodies: print sits below the drawstring tips and above the pocket. Nothing
  crosses the artwork.
- Never crop: arrow head and the "1 Samuel 30:8" line must stay visible.
- Journals are typographic, not pictorial. A small foil emblem and/or a short
  line of type, no full-bleed picture.
- Faith pieces are type only, one accent colour per garment.
- Scripture statements lead with 1 Samuel 30:8. Other verses are allowed, but
  keep the reference line small and inside the print block.
- The reference photos are inspiration only. Redraw the idea in cream, brown
  and gold on the CHRISCO garments, never on navy or red, and never copy a
  third party mark such as a church crest.
- Never knock out the sky to the garment colour on light garments.

## Ordering

The shop does not take payment and does not ask anyone to sign in. Every card
carries a "Message on WhatsApp" link built by `whatsappInquiry()` in
`app/data/merch.js`, which opens a prefilled chat with the design code, colour,
chosen size and quantity. The order tray can send a whole multi item order the
same way. To change the destination number, edit `org.whatsapp`.

## Prices

Stored per item in `app/data/merch.js` as `{ kes, ugx }`. KSh is shown first,
UGX alongside. Update both when a price changes.

## Adding a design

1. Generate or export the mockup as PNG with a light neutral background.
2. Name it after the garment and idea, for example `tshirt-prayer.png`.
3. Add an entry to `app/data/merch.js` with the next code in that series and a
   `collection` of `pursue`, `faith` or `scripture`.
4. Nothing else is needed: the card, the product panel, the recommendations and
   the WhatsApp message all read from that one entry.
