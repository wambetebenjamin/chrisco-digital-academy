# Merchandise artwork

Four collections share one print system.

| Collection | Artwork | Where it lives |
| --- | --- | --- |
| PURSUE | Sunrise warrior, golden arrow, "PURSUE / OVERTAKE RECOVER ALL / 1 Samuel 30:8" | `public/merch/source/pursue-design.png` |
| Faith affirmations | Type only: Faith Over Fear, Chosen, Be Still, Anchored, Grace, Risen, Wonderfully Made | Set from the brand fonts by `scripts/build_merch_mockups.py` |
| Scripture statements | 1 Samuel 30:8 as the anchor, plus 2 Corinthians 5:7, 2 Corinthians 6:2 and Matthew 4:19 | Supplied artwork in `public/merch/source/art/` plus type set by the renderer |
| Design drops | The supplied design artwork, printed exactly as drawn (Confess & Believe, Christ Fest, Media, Be The Church, Jesus Made Us, Walk By Faith script) | `public/merch/source/art/` |

The supplied reference photos in `public/merch/source/refs/` are the original
drops as the owner drew them. `public/merch/source/art/` holds the same
artwork lifted off those photos as flat ink, so the garments print the real
design instead of an interpretation of it.

## The no-lines rule

Nothing in this range carries a line. No rule lines, no underlines, no
divider bars, no outline strokes, no engraved hatching, no badge rings, no
hanger wires, no drawstring cords, no seam stitches and no card bars. Prints
are solid shapes and type only; garments are shaded with soft gradients so
edges read as fabric, not as drawing. `scripts/build_merch_mockups.py` owns
every pixel of every mockup, which is how the rule is enforced: the renderer
has no stroke primitive at all.

If a supplied design arrives with a rule line in it, the line is dropped when
the artwork is prepared, and `tighten()` in the renderer collapses any stray
vertical air so a reference never floats away from its lockup.

## Palette

One harmonious family of garment colours, so the whole wall of cards rhymes.
Warm neutrals carry the gold artwork; the brand ink and deep teal carry the
quieter pieces.

| Token | Hex | Used on |
| --- | --- | --- |
| Cocoa | `#5A4232` | Tee, hoodie, polo, cap, journal |
| Cream | `#EFE6D4` | Tee, hoodie, polo, mug, journal |
| Ink | `#191A1C` | Tee, hoodie, cap |
| Chalk | `#F6F4EF` | Tee, polo, cap, mug |
| Sand | `#D8CCB2` | Totes, tee |
| Deep teal | `#0E2A38` | Tote |

Inks: gold `#CEA052` on dark garments, deep gold `#B08034` and espresso
`#563C29` on light garments, cream `#F3E9D3` and charcoal `#2B2D30` where the
supplied artwork calls for them.

Card and modal surfaces stay on the site's neutral ladder (white cards, cool
grey media wells). No brown washes, no accent bars, no hairlines on cards:
the mockup is the only colour in a card.

## Rendering mockups

    .venv-merch/bin/pip install -r scripts/merch-requirements.txt
    .venv-merch/bin/python scripts/build_merch_mockups.py

The renderer draws each garment (tee, hoodie, polo, cap, tote, mug, journal)
as filled shapes with soft shading, keys the flat backdrop out of each
artwork, and prints the artwork into the placement box below. Output is
1200x1500 (4:5) to match the shop cards. Adding a product is: drop the
artwork in `public/merch/source/art/`, add a job line to `JOBS`, add the
catalogue entry in `app/data/merch.js`.

## Placement template

| Code | Product | Placement | Size on garment | Technique |
| --- | --- | --- | --- | --- |
| TS-01..04 | PURSUE Tee, Cocoa / Cream / Ink / Chalk | Centre chest | 430px box | Screen print |
| TS-05 | Faith Over Fear Tee, Chalk | Centre chest | 80% box | Gold screen print |
| TS-06 | Chosen Tee, Ink | Centre chest | 45% box | Gold screen print |
| TS-07 | Overtake Tee, Ink | Centre chest | 86% box | Cream and gold print |
| TS-08 | The Presence Tee, Cocoa | Centre chest | 90% box | Supplied artwork |
| TS-09 | Walk By Faith Tee, Cocoa | Centre chest | 90% box | Supplied artwork |
| TS-10 | Now Is The Time Tee, Cocoa | Centre chest | 90% box | Supplied artwork |
| TS-11 | Fishers Of Men Tee, Cocoa | Centre chest | 90% box | Supplied artwork |
| TS-12 | Confess & Believe Tee, Chalk | Centre chest | 90% box | Supplied artwork |
| TS-13 | Christ Fest Tee, Chalk | Centre chest | 92% box | Supplied artwork |
| TS-14 | Media Team Tee, Chalk | Centre chest | 90% box | Supplied artwork |
| TS-15 | Be The Church Tee, Chalk | Centre chest | 90% box | Supplied artwork |
| TS-16 | Jesus Made Us Tee, Chalk | Centre chest | 86% box | Supplied artwork |
| TS-17 | Walk By Faith Script Tee, Sand | Centre chest | 86% box | Supplied artwork |
| HD-01..02 | PURSUE Hoodie, Cocoa / Cream | Between hood and pocket | 92% box | Screen print |
| HD-03 | Be Still Hoodie, Ink | Between hood and pocket | 86% box | Cream and gold print |
| HD-04 | Recover All Hoodie, Cream | Between hood and pocket | 86% box | Espresso and gold print |
| PL-01..02 | PURSUE Polo, Cocoa / Chalk | Centre chest | 62% box | Screen print |
| PL-03 | PURSUE Crest Polo, Cream | Centre chest | 60% filled disc crest | Embroidery |
| CP-01 | PURSUE Cap, Cocoa | Front panel | 78% box | Embroidery |
| CP-02 | Anchored Cap, Chalk | Front panel | 78% box | Embroidery |
| CP-03 | Overtake Cap, Ink | Front panel | 78% box | Embroidery |
| TB-01 | PURSUE Tote, Sand | Centre front | 100% box | Screen print |
| TB-02 | Grace Tote, Sand | Centre front | 90% box | Espresso print |
| TB-03 | Walk By Faith Tote, Deep teal | Centre front | 95% box | Supplied artwork |
| MG-01 | PURSUE Mug, Cream | Front face | 100% box | Sublimation |
| MG-02 | Risen Mug, Chalk | Front face | 90% box | Deep gold print |
| MG-03 | Recover All Mug, Cream | Front face | 100% box | Sublimation |
| NB-01 | PURSUE Journal, Cocoa | Cover centre | 80% box | Gold foil |
| NB-02 | Wonderfully Made Journal, Cream | Cover centre | 85% box | Foil block |

## Rules

- Centre first: equal left and right margins. Totes keep equal margins on all
  four sides.
- Never crop: the arrow head and the "1 Samuel 30:8" line stay visible.
- Journals are typographic, not pictorial.
- Faith pieces are type only, one accent ink per garment.
- Scripture statements lead with 1 Samuel 30:8; keep the reference small and
  inside the print block.
- Garment colour must rhyme with the artwork ink: light inks sit on cocoa,
  ink or teal; dark inks sit on chalk, cream or sand.
- The reference photos are the owner's artwork. Print them as drawn, minus
  any rule lines; never redraw a third party mark.

## Ordering

The shop does not take payment and does not ask anyone to sign in. Every card
carries a "Message on WhatsApp" link built by `whatsappInquiry()` in
`app/data/merch.js`, which opens a prefilled chat with the design code, colour,
chosen size and quantity. The order tray can send a whole multi item order the
same way, and on phones a floating order pill follows the shopper until the
tray is opened. To change the destination number, edit `org.whatsapp`.

## Prices

Stored per item in `app/data/merch.js` as `{ kes, ugx }`. KSh is shown first,
UGX alongside. Update both when a price changes.

## Adding a design

1. Put the flat artwork in `public/merch/source/art/` (white or flat backdrop;
   the renderer keys it out).
2. Add a job line to `JOBS` in `scripts/build_merch_mockups.py` and run it.
3. Add an entry to `app/data/merch.js` with the next code in that series and a
   `collection` of `pursue`, `faith`, `scripture` or `drops`.
4. Nothing else is needed: the card, the product panel, the recommendations
   and the WhatsApp message all read from that one entry.
