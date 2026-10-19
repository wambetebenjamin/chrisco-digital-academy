# PURSUE merchandise artwork

Source artwork: `public/merch/source/pursue-design.png` (supplied by CHRISCO Youth
Aflame). The mockups in `public/merch/` are generated from that file as a
colour reference, so the sunrise scene, the golden arrow, the word "PURSUE",
"OVERTAKE • RECOVER ALL" and "1 Samuel 30:8" all carry through.

## Placement template

| Code | Product | Placement | Size on garment | Technique |
| --- | --- | --- | --- | --- |
| TS-01 | T-shirt, Navy | Centre chest | 48% of chest width | Screen print |
| TS-02 | T-shirt, White | Centre chest | 48% of chest width | Screen print |
| TS-03 | T-shirt, Sand | Centre chest | 48% of chest width | Screen print |
| HD-01 | Hoodie, Navy | Centre chest, between drawstrings and pocket | 42% of chest width | Screen print |
| HD-02 | Hoodie, Sand | Centre chest, between drawstrings and pocket | 42% of chest width | Screen print |
| PL-01 | Polo, Navy | Left chest | 90mm wide | Screen print |
| PL-02 | Polo, White | Left chest | 90mm wide | Screen print |
| CP-01 | Cap, Navy | Front panel, centre | 60mm wide | Embroidery |
| TB-01 | Tote, Natural | Centre front | 45% of bag width | Screen print |
| MG-01 | Mug, White | Front face | 55% of mug height | Sublimation |
| NB-01 | Notebook, Navy | Front cover, centre | 65% of cover width | Print |

## Placement rules

- Minimum 60mm clear below the collar and 50mm clear of each sleeve seam.
- The artwork is never cropped: the arrow head and the "1 Samuel 30:8" line must
  both be fully visible.
- On light garments the artwork sits on its own printed panel; never knock out
  the sky to the garment colour.
- Embroidery (caps) uses gold and cream thread only, no gradient mesh.

## Replacing a mockup

1. Export the new mockup as PNG with a light neutral background.
2. Save it over the existing file name (for example `tshirt-navy.png`).
3. Keep item codes unchanged so existing orders, links and analytics resolve.

## Adding a colourway

Add an entry to `app/data/merch.js` with a new code following the pattern
`TS-04`, `HD-02` and so on, then point `img` at the new mockup.
