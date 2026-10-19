# PURSUE merchandise artwork

Source artwork: `public/merch/source/pursue-design.png` (supplied by CHRISCO
Youth Aflame). Every mockup is generated from that file as the design reference,
so the sunrise scene, the golden arrow, the word "PURSUE",
"OVERTAKE • RECOVER ALL" and "1 Samuel 30:8" carry through.

## Palette

The collection is deliberately warm, so the golds in the artwork sit naturally:

| Token | Hex | Used on |
| --- | --- | --- |
| Cocoa brown | `#4A342A` | Tee, hoodie, polo, cap, notebook |
| Warm cream | `#EFE3CE` | Tee, hoodie, mug |
| Black | `#111111` | Tee |
| Natural canvas | `#D9CDB4` | Tote |

No blue garments: navy fights the gold and muddies the sunrise.

## Placement template

| Code | Product | Placement | Size on garment | Technique |
| --- | --- | --- | --- | --- |
| TS-01 | T-shirt, Brown | Centre chest | 44% of chest width, 90mm below collar | Screen print |
| TS-02 | T-shirt, Cream | Centre chest | 44% of chest width, 90mm below collar | Screen print |
| TS-03 | T-shirt, Black | Centre chest | 44% of chest width, 90mm below collar | Screen print |
| HD-01 | Hoodie, Brown | Centre chest, between drawstrings and pocket | 38% of chest width | Screen print |
| HD-02 | Hoodie, Cream | Centre chest, between drawstrings and pocket | 38% of chest width | Screen print |
| PL-01 | Polo, Brown | Left chest | 85mm wide | Screen print |
| CP-01 | Cap, Brown | Front panel, centre | 58mm wide | Embroidery |
| TB-01 | Tote, Natural | Centre front, horizontally and vertically | 42% of bag width | Screen print |
| MG-01 | Mug, Cream | Front face, opposite the handle | 55% of mug height | Sublimation |
| NB-01 | Notebook, Brown | Front cover, centre | 60% of cover width | Print |

## Placement rules

- **Centre first**: equal margins left and right. On the tote, equal margins on
  all four sides.
- Minimum 60mm clear below the collar, 50mm clear of each sleeve seam.
- Hoodies: the print sits below the drawstring tips and above the pocket, never
  crossing either.
- The artwork is never cropped: the arrow head and the "1 Samuel 30:8" line must
  both be fully visible.
- Never knock out the sky to the garment colour on light garments.
- Embroidery (caps) uses gold and cream thread only, no gradient mesh.
- Folds may pass near the print but must not distort it, and no garment seam,
  pocket edge, placket or crease may cross the artwork.

## Replacing a mockup

1. Export the new mockup as PNG with a light neutral background.
2. Save it over the existing file name (for example `tshirt-brown.png`).
3. Keep item codes unchanged so existing orders, links and analytics resolve.

## Adding a colourway

Add an entry to `app/data/merch.js` with a new code following the pattern
`TS-04`, `HD-03` and so on, then point `img` at the new mockup. Stay inside the
palette table above.
