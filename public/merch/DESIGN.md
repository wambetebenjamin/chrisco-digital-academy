# Merchandise artwork

Two collections share one print system.

| Collection | Artwork | Where it lives |
| --- | --- | --- |
| PURSUE | Sunrise warrior, golden arrow, "PURSUE / OVERTAKE • RECOVER ALL / 1 Samuel 30:8" | `public/merch/source/pursue-design.png` |
| Faith affirmations | Type only: Faith Over Fear, Chosen, Be Still, Anchored, Grace, Risen, Wonderfully Made | Generated directly in the mockups |

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
- Never knock out the sky to the garment colour on light garments.

## Prices

Stored per item in `app/data/merch.js` as `{ kes, ugx }`. KSh is shown first,
UGX alongside. Update both when a price changes.

## Adding a design

1. Generate or export the mockup as PNG with a light neutral background.
2. Name it after the garment and idea, for example `tshirt-prayer.png`.
3. Add an entry to `app/data/merch.js` with the next code in that series and a
   `collection` of `pursue` or `faith`.
