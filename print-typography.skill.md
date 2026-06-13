# Print & Typography Skill — PDF, posters & fonts

> Verified June 2026. Read this when the user wants a PDF/print deliverable (reports, posters, books, invoices), programmatic document layout, or font work (subsetting, variable fonts, kinetic type). Pairs with [`images.skill.md`](images.skill.md) (Satori/raster), [`svg.skill.md`](svg.skill.md), and the `typography` folder.

## TL;DR — which tool
| Need | Use |
|---|---|
| Pixel-faithful PDF from a web page / React component (full modern CSS, web fonts, charts) | **Playwright/Puppeteer print** (real Chromium — highest fidelity) |
| Multi-page docs/books: running headers, page numbers, TOC, footnotes | **Paged.js** (in browser) → print to PDF via Playwright |
| Lightweight server-side HTML→PDF, no Chromium (invoices/reports) | **WeasyPrint** (Python) |
| Posters / structured docs authored **as code** (not from HTML) | **Typst** (modern LaTeX alt) |
| Manipulate font files (subset/instance/inspect) | **fontTools** (Python) / **fontkit**, **opentype.js** (JS) |

## HTML → PDF
**Playwright** (`npm i playwright` → `npx playwright install chromium`, Apache-2.0) — best fidelity (honors `@media print`, `@page`, web fonts, flex/grid, JS-rendered content).
```js
await page.emulateMedia({ media: "print" });
await page.pdf({ path: "out.pdf", format: "A4", printBackground: true,   // REQUIRED for bg colors
  margin: { top: "15mm", bottom: "15mm" } });
```
Add CSS `-webkit-print-color-adjust: exact`; preload fonts/images; **pin the Chromium version in CI** (pagination/font rendering drifts across updates).

**Paged.js** (`npm i pagedjs`, MIT) — polyfills the Paged Media CSS specs browsers lack (running headers/footers, page counters, footnotes, TOC). Render in headless browser, then `page.pdf()`. Officially "experimental" — pin it.

**WeasyPrint** (`pip install weasyprint`, BSD, v69) — pure-Python HTML/CSS→PDF with a real pagination engine, no Chromium. For server-side invoices/reports. Trade-off: **CSS subset only, no JS** — author print-specific HTML. Needs Homebrew Pango: `brew install pango`.

## Typesetting — Typst
`brew install typst` (Apache-2.0, v0.14 — pre-1.0, pin it). Markup-based LaTeX alternative, far easier, with a real scripting language (loops/functions/data import) and near-instant compile. Best for **programmatic layout**: data-driven reports, posters, papers, templated docs.
```bash
typst compile poster.typ poster.pdf     # or: typst watch poster.typ
```

## Typography / fonts
- **Variable fonts** — one file, continuous axes (`wght`/`wdth`/`slnt`/optical/custom); animate via CSS `font-variation-settings` for **kinetic type** (respect `prefers-reduced-motion`). Subset it — see below.
- **fontTools** (`pip install fonttools[woff]`, MIT) — the reference toolkit. **`pyftsubset`** (subset glyphs → WOFF2, preserves ligatures/kerning/features), **`varLib.instancer`** (pin/partial-instance variable fonts), TTX (binary↔XML).
```bash
pyftsubset font.ttf --unicodes=U+0000-00FF --layout-features='*' --flavor=woff2 -o font.subset.woff2
```
- **JS engines:** **fontkit** (`npm i fontkit`, MIT — best CFF2/variable/WOFF2 support; powers pdf-lib) · **opentype.js** (MIT — parse/write OTF/TTF, glyph paths → render text to SVG/canvas, letterform manipulation).
- **Web-font subsetting tooling:** **glyphhanger** (`npm i -g glyphhanger`, MIT — crawls a URL, computes the real `unicode-range`, subsets via pyftsubset) · **subfont** (build-tool: auto-analyzes built HTML, subsets, rewrites `@font-face`). Use subsetting (smaller file) **and** CSS `unicode-range` (download-on-demand) together.

## License flags
Playwright/Typst Apache-2.0; Paged.js MIT; WeasyPrint BSD; fontTools/fontkit/opentype.js/glyphhanger MIT. **Typst pre-1.0 + Paged.js "experimental" → pin versions** for reproducible client output.

## Files this skill governs
`typography/` folder · cross-refs: [`images.skill.md`](images.skill.md) (Satori OG cards, fonts), [`svg.skill.md`](svg.skill.md) (fonts→paths), the `docx`/`pdf`/`pptx` Claude skills (office docs).
