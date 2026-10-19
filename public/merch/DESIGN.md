# PURSUE merchandise artwork

## Placement template

| Product | Placement | Technique |
| --- | --- | --- |
| T-shirt (TS-01, TS-02) | Full chest, 280mm wide, 90mm below collar | Screen print |
| Hoodie (HD-01) | Full chest, 260mm wide, above pocket | Screen print |
| Polo (PL-01) | Left chest, 80mm wide | Embroidery |
| Cap (CP-01) | Front panel centre, 60mm wide | Embroidery |
| Tote (TB-01) | Centre front, 240mm wide | Screen print |
| Mug (MG-01) | Wrap print, 200mm wide, 80mm from handle | Sublimation |
| Notebook (NB-01) | Centre cover, 70mm wide | Foil |

## Ink

- On navy: mint `#00FF84` with a 1px darker edge `#00B865`
- On white / natural: navy `#002333`

## Swapping in the supplied design

The mockups in this folder are stand-ins generated to match the CHRISCO palette
while the supplied PURSUE artwork is added. To use the real design:

1. Drop the artwork into `public/merch/` (PNG or SVG, transparent background).
2. Replace the matching mockup file, keeping the same name (for example
   `tshirt-navy.png`), or edit the `img` path for that code in
   `app/data/merch.js`.
3. Keep the item codes unchanged so existing orders and links still resolve.
