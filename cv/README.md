# CV / resume builds

Two documents, both generated from code so facts are edited in one place:

| Script | Output | Look |
|---|---|---|
| `build_cv.py` | `assets/Wambete-Benjamin-CV.pdf` | Editorial one-pager (bone / ink / oxblood) |
| `build_resume.py` | `assets/Wambete-Benjamin-Resume.pdf` | Replica of the supplied Canva collage |

```bash
python cv/build_cv.py
python cv/build_resume.py     # also writes preview PNGs
```

## The replica

`build_resume.py` reproduces the layout of the supplied `resume.pdf` — the Canva
"ripped paper" template — measured from that PDF: A4, two 207 pt columns at
x=48 and x=322, 43.1 pt section bars, name set in Archivo Black and rotated
4.65°, section labels rotated 1.52°.

Differences, all deliberate:

- **Palette.** The template is lime green. That green is off-limits here, so the
  collage is retinted to oxblood, kraft, blush gingham and bone.
- **Type.** The template uses a decorative face that is not open-licensed.
  Archivo Black is the closest open match and is already the site's display face.
- **Photo.** There is no portrait, so the torn ring holds a monogram instead.
- **Details.** Every word is rewritten for Wambete Benjamin. The template's own
  copy ("Emma Brooks", "Stellar Studio") appears nowhere — checked on every build.

## Assets

`cv/assets/*.png` are the template's own paper textures, recoloured. They were
extracted from the supplied PDF (which is why the torn edges match exactly) and
tinted with `PIL`; see the git history for the extraction steps.
