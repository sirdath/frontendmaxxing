# Generative Art Skill — creative coding, export & plotter output

> Verified June 2026. Read this when the user wants algorithmic/generative art — flow fields, particle systems, long-form/on-chain, pen-plotter output, or hi-res print. **Complements** the existing `algorithmic-art` Claude skill (p5.js + seeded randomness + flow fields) and [`shaders.skill.md`](shaders.skill.md) — cross-reference, don't duplicate. Governs `effects/` + generative work in `3d/`.

## TL;DR — which tool
| Goal | Use | Why |
|---|---|---|
| Learn/sketch fast, interactive params | **p5.js** | Friendliest API; what `algorithmic-art` skill targets |
| Pro workflow: seeded export to PNG/MP4/GIF **+ SVG for plotters** | **canvas-sketch** | The production harness; wraps p5/three/regl/d3 |
| Hand-drawn / sketchy strokes | **Rough.js** | Tiny, SVG+canvas, instant "imperfect" line |
| 3D / shader-driven / particles / WebGPU | **Three.js + GLSL/TSL** | See [`shaders.skill.md`](shaders.skill.md); WebGPU now production-ready |
| Precise vector geometry, boolean ops, clean SVG | **paper.js** | Exact path math |
| Long-form on-chain (deterministic per token) | **fxhash `$fx.rand()`** | Platform hash seed → reproducible outputs |
| Pen-plotter / AxiDraw physical output | **canvas-sketch → SVG** | Native SVG exporter feeds plotter toolchains |

Workflow: **prototype in p5.js → graduate to canvas-sketch for export/print/plotter → add Rough.js (sketchy), paper.js (exact vectors), or Three.js+GLSL (3D/shaders).**

## The libraries (verified)
| Lib | ★ | License | One-line |
|---|---|---|---|
| **p5.js** (processing) | 24k | LGPL-2.1 | Default sketching env. **2.0 is beta — pin 1.x** (default stays 1.x until ≥Aug 2026) |
| **canvas-sketch** (mattdesl) | 5.3k | MIT (beta) | The pro layer above p5: seeded randomness, hi-res PNG (Giclée), MP4/GIF sequences, **SVG export for AxiDraw**, git-hash archival. `npm i canvas-sketch canvas-sketch-util`; scaffold `npx canvas-sketch-cli` |
| **Rough.js** (rough-stuff) | 21k | MIT | <9 kB hand-drawn primitives → SVG/canvas |
| **Three.js** (mrdoob) | 113k | MIT | 3D / GPU particles / fragment-shader art; WebGPU+TSL (see shaders skill) |
| **paper.js** (paperjs) | 15k | MIT | Precise vector geometry, boolean ops, exact SVG |

CDN: p5 `https://cdn.jsdelivr.net/npm/p5/lib/p5.min.js` · Rough `https://cdn.jsdelivr.net/npm/roughjs/bundled/rough.min.js`.

## Patterns (cross-referenced — see `algorithmic-art` skill for detail)
- **Seeded randomness** — always seed the PRNG so a piece is reproducible from one number/hash. canvas-sketch exposes it natively; raw p5 uses `randomSeed()`/`noiseSeed()`.
- **fxhash / long-form** — platform injects a unique hash; use `$fx.rand()` for *all* randomness so each minted token is reproducible. You build the *system*, not the outputs (boilerplate: `skerrett/fxhash-generative-art`).
- **Plotter / SVG (AxiDraw)** — render to SVG (canvas-sketch exporter or paper.js for exact geometry) → AxiDraw toolchain. Strokes as paths, no fills.
- **Flow fields & noise** — Perlin/simplex vector fields — detailed in `algorithmic-art`; curl noise in [`shaders.skill.md`](shaders.skill.md). Don't restate.

## License flags
Mostly MIT; **p5.js = LGPL-2.1** (note for redistribution). canvas-sketch is beta — pin it.

## Files this skill governs
`effects/` + generative `3d/` snippets · cross-refs: the official `algorithmic-art` skill, [`shaders.skill.md`](shaders.skill.md), [`svg.skill.md`](svg.skill.md) (plotter output), [`3d-web.skill.md`](3d-web.skill.md).
