# CHRISCO Youth Aflame books

Rebuild both print-ready A4 PDFs from the repository root:

```sh
python -m pip install -r scripts/youth_aflame_books/requirements.txt
python scripts/build_youth_aflame_books.py
```

The builder starts from `BOOK FOR TODAY.pdf` itself. It retains its 10-page A4 master pages, image frames, colors, navy capsules, dividers, shapes, ornaments, footer arrangement, and spacing; it removes the template’s sample wording and replaces the template photography with the credited Kenyan church photo. The two output books are each 10 pages and follow the reference page-by-page structure.

- `content/books/stop-making-our-god-look-like-baal.pdf`
- `content/books/young-pastor-10-truths-about-your-calling.pdf`

Inter is used for body copy, matching the reference body font. The reference PDF embeds only a limited subset of its Code Pro display face, so the build uses the repository’s full-glyph Poppins Bold display face for newly written headings. Image and font credits are in `IMAGE-CREDITS.md`.
