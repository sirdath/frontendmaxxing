# SVG Skill — author, optimize, animate, generate & vectorize

> Verified June 2026. Read this whenever the user wants vector work: icons, logos, illustrations, animated SVG, generative vector art, or raster→vector. Governs the [`svg/`](svg/) snippets; pairs with [`gsap.skill.md`](gsap.skill.md) (SVG animation), [`shaders.skill.md`](shaders.skill.md), and the `gradients`/`color` skills.

## TL;DR — which approach

| You want… | Use |
|---|---|
| Hand-author an icon/logo, precise control | Write SVG by hand or in Inkscape GUI → **SVGO** |
| Batch convert/export/path-ops, headless | **Inkscape CLI** (`--actions`, `--shell`) + **inkex** (Python) |
| Generative/programmatic vector in JS | **svg.js** (DOM) · **two.js** (renderer-agnostic) · **paper.js** (boolean/path math) · **Rough.js** (hand-drawn) · **D3** (data-driven) |
| Animate an SVG | **CSS** (simple) → **GSAP DrawSVG/MorphSVG** (production, now free) — avoid SMIL |
| Raster → vector (B&W/line) | **potrace** |
| Raster → vector (color) | **vtracer** |
| Text prompt → true vector | **Recraft API** (real paths) — local text→SVG isn't viable yet |

## Install (Mac, Apple Silicon — none of these are installed yet)
```bash
brew install --cask inkscape        # v1.4.x → /Applications/Inkscape.app (CLI: `inkscape`)
brew install potrace                # bitmap (PBM/PGM/PPM/BMP) → SVG  (mkbitmap ships with it)
brew install vtracer                # Rust color vectorizer (or: cargo install vtracer)
npx svgo in.svg -o out.svg          # optimizer (npm i -D svgo for project)
npm i @svgdotjs/svg.js two.js paper roughjs d3 gsap
pip install inkex fonttools         # SVG path API in Python
```

## Generative / programmatic libs (verified)
| Lib | ★ | License | Use |
|---|---|---|---|
| **D3** | 113k | ISC | Data-driven SVG (charts/maps) — see [`dataviz.skill.md`](dataviz.skill.md) |
| **Rough.js** | 21k | MIT | Hand-drawn/sketchy (canvas+SVG) |
| **paper.js** | 15k | MIT | Boolean ops, path math — exact vector geometry |
| **svg.js** | 12k | MIT | Lightweight dependency-free SVG DOM |
| **two.js** | 8.6k | MIT | Renderer-agnostic 2D (SVG/Canvas/WebGL) |
| **vtracer** | 6.1k | MIT | Raster→vector, color, O(n) |
| ⚠️ Vivus | 15.5k | MIT | SVG line-draw — **stale (2021); prefer GSAP DrawSVG** |

**Optimizer: SVGO** (22.5k★, MIT, v4). In v4 `removeViewBox`/`removeTitle` are off by default — keep them off.

## Inkscape CLI cheat-sheet (1.x)
```bash
inkscape in.svg --export-type=png --export-filename=out.png --export-width=512
inkscape in.svg --export-type=pdf --export-filename=out.pdf
inkscape in.svg --export-type=png --export-area-drawing       # crop to drawing (kill whitespace)
inkscape in.svg --export-type=png --export-id=logoMark --export-id-only
inkscape in.svg --query-id=logoMark --query-width             # scripting: read geometry
inkscape in.svg --actions="select-all; object-to-path; export-filename:out.svg; export-do"
inkscape --shell                                               # batch: one process, many files (fast)
inkscape --action-list                                         # list every action id
```
**inkex** (Python) = the extension API behind Inkscape: parse/transform SVG as a DOM, matrix transforms, path ops, run batch actions. Use for real path geometry in Python; bare CLI for plain export/convert.

## Animation: SMIL < CSS < GSAP
- **SMIL** (`<animate>`): avoid for production (deprecated-ish, poor tooling).
- **CSS** (`stroke-dashoffset`, `transform`, `@keyframes`): first choice for simple hovers/loops; cheap `prefers-reduced-motion`.
- **GSAP** (now 100% free incl. all plugins): production standard. **DrawSVGPlugin** (line-draw, replaces Vivus), **MorphSVGPlugin** (path morph — no free equivalent). Route through [`gsap.skill.md`](gsap.skill.md) / `gsap-master` MCP; pair with ScrollTrigger. *(GSAP plugins are royalty-free, not OSI-MIT — don't mislabel.)*

## Web-output / a11y conventions
- Keep one **`viewBox`**; drop fixed width/height for responsive scaling.
- **`fill="currentColor"`** so icons inherit CSS `color` — essential for the repo's 3-scheme theming; never bake brand hex into icon files.
- Inline icons: `role="img"` + `<title>`; decorative: `aria-hidden="true"`. Respect `prefers-reduced-motion`.

## Optimization gotchas (SVGO)
Optimize **before** wiring animation — SVGO strips IDs/classes your CSS/JS targets, removes referenced `<defs>`, collapses groups. For animated/scripted SVGs disable `cleanupIds`, `removeUselessDefs`, `inlineStyles`, `mergePaths`, `collapseGroups`. Keep `viewBox`. GUI: SVGOMG.

## Vectorize & AI gotchas
- **potrace only takes bitmaps** (PBM/PGM/PPM/BMP) — pipe PNG/JPG through `mkbitmap` or ImageMagick first. **autotrace** is gone from Homebrew — potrace (B&W) + vtracer (color) cover it.
- **AI text→SVG:** **Recraft** (V4) is the only production-grade text→vector (real paths) — via fal.ai/Replicate API (route through the fal MCP). Local open models (StarVector, OmniSVG) are research-grade, GPU-heavy, image→SVG-leaning — **not viable on an M-series Mac for client work**; hand-author + SVGO instead.

## Files this skill governs
[`svg/`](svg/) snippets · cross-refs: [`gsap.skill.md`](gsap.skill.md), [`generative-art.skill.md`](generative-art.skill.md), [`dataviz.skill.md`](dataviz.skill.md), [`print-typography.skill.md`](print-typography.skill.md) (fonts→paths).
