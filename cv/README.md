# CV build

One-page CV for Wambete Benjamin, styled after the supplied Canva "ripped paper"
template but built as a real vector PDF with selectable text.

```bash
python cv/build_cv.py
```

Writes `assets/Wambete-Benjamin-CV.pdf` and the preview PNG at 150 dpi.

## Why not just fill in the Canva template

The Canva design is a collage: torn paper, washi tape, green stars, graph paper.
It looks good but it is a picture of a page — text is not selectable and
applicant tracking systems cannot read it. This keeps the torn-paper idea as
vector furniture (a ragged edge under the masthead, a standing torn divider
between columns) while every word stays real text.

Facts and dates live in the `CONF` dict at the top of `build_cv.py`. Correct them
there and re-run; do not hand-edit the PDF.
