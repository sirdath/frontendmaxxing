# Shaders Skill — GLSL / WebGL for distinctive visuals

> Distilled from verified GitHub research (June 2026 — real repos, stars, licenses checked live). Read this whenever the user wants a shader-driven look: animated gradient/mesh backgrounds, fluid/plasma/noise, dithering, holographic/iridescent materials, displacement, raymarched/SDF scenes, godrays, halftone. Governs the [`shaders/`](shaders/) GLSL snippets; pairs with [`3d-web.skill.md`](3d-web.skill.md) (mounting shaders in three/R3F) and `gradients.skill.md` (CSS-only gradient alternatives).

## TL;DR — which tool

| The user wants… | Reach for |
|---|---|
| A gradient/mesh/noise background, no GLSL writing | **paper-design/shaders** (`@paper-design/shaders-react`, zero-dep) or the CSS in `gradients.skill.md` |
| A custom shader on a mesh in R3F (greenfield) | **drei `shaderMaterial`** (GLSL pair + uniforms → ready material) |
| Custom displacement/iridescence **while keeping PBR lighting + shadows** | **THREE-CustomShaderMaterial (CSM)** — extend MeshStandard/Physical, don't rebuild lighting |
| Reusable noise/SDF/color/lighting functions | **LYGIA** `#include` (⚠️ license below) or **IQ's** snippets |
| Screen-space post FX (bloom/DoF/CA/glitch) | **pmndrs/postprocessing** (vanilla) / **react-postprocessing** (R3F) |
| A raw effect in this vault | the CDN GLSL snippets in [`shaders/`](shaders/) via `runner.js` |

## Shader libraries & building blocks
- **LYGIA** (patriciogonzalezvivo/lygia, ~3.4k★) — granular one-function-per-file shader lib (noise, SDFs, color spaces, lighting, filters) across GLSL/HLSL/WGSL. Highest leverage-per-line. ⚠️ **Prosperity license = non-commercial unless you sponsor the author** — do NOT ship in paid client work without a Patron license; port from a clean-licensed base instead.
- **THREE-CustomShaderMaterial** (FarazzShaikh, ~1.3k★ MIT) — inject `csm_*` outputs into built-in materials; keep real PBR/shadows. The standard when raw `ShaderMaterial` loses you lighting.
- **Inigo Quilez articles** (iquilezles.org, mostly MIT per-article) — the definitive SDF / smooth-min / domain-warping / fBm / raymarching reference. Source of "impossible geometry" + metaball/fluid hero effects.
- **Noise:** `stegu/webgl-noise` (~580★ MIT, simplex/Perlin/Worley; newer `stegu/psrdnoise`), `cabbibo/glsl-curl-noise` (⚠️ **no license** — re-implement curl from a clean base; curl noise drives premium flow-field particles), `FarazzShaikh/glNoise` (MIT, pairs with CSM).
- **glslify** (~2.3k★ MIT) — `#pragma glslify` module system; **stable but last release 2016** — many teams now prefer raw `#include`/LYGIA.

## Post-processing
- **pmndrs/postprocessing** (~2.8k★ Zlib, very active) — the de-facto vanilla post lib; selective bloom (emissive lifted out of 0–1) + merged `EffectPass` = the premium glow/grade without tanking FPS.
- **pmndrs/react-postprocessing** (MIT) — declarative `<EffectComposer><Bloom/></EffectComposer>` for R3F; pin against a matching `postprocessing` core version.
- **N8python/n8ao** (CC0) high-quality SSAO; **0beqz/realism-effects** (MIT) SSGI/motion-blur/TRAA.

## Ready-to-use effects (no GLSL needed)
- **paper-design/shaders** (~2.1k★, PolyForm Shield — client-safe unless you build a competing shader product) — 30+ effects (mesh gradient, dithering, grain gradient, warp, waves, dot-orbit) as zero-dep React/vanilla; design in the Paper app, export. Fastest path to a distinctive animated background.

## Learning (the technique behind the look)
- **The Book of Shaders** (thebookofshaders.com, free; repo patriciogonzalezvivo/thebookofshaders) — canonical intro to procedural fragment shaders (shaping fns, noise, Voronoi, patterns). Same author as LYGIA.
- **Three.js Journey** (Bruno Simon, paid) — the shader chapters (vertex displacement, raging-sea, galaxy, GPGPU flow-field particles) are the standard onboarding for exactly this work.
- **Maxime Heckel's blog** (blog.maximeheckel.com, code open-source) — current best R3F shader deep-dives: dithering, raymarching ("Painting with Math"), FBO particles, post-processing as a medium, volumetric/holographic. The single most applicable author for the 2025-26 aesthetic.
- **ShaderToy** (shadertoy.com) — prototyping + discovery; per-author licenses, check each.

## Authoring tools (the iteration loop)
- **actarian/vscode-glsl-canvas** — live GLSL preview inside VS Code (best free in-editor loop).
- **KodeLife** (hexler.net/kodelife) — polished native real-time shader editor (GLSL/HLSL/Metal).
- **SHADERed** (shadered.org) — open-source shader IDE with step-debugging.

## Particles / VFX (shader-driven)
- **three.quarks** (Alchemist0823, MIT, TS) — mature particle/VFX engine + visual editor; **prefer over the inactive three-nebula**.
- **wawa-vfx** (wass08, MIT, ~135★, young) — lightweight composable R3F particle/VFX; evaluate before a deadline.
- GPGPU flow fields: see [`3d-motion.skill.md`](3d-motion.skill.md) + `shaders/noise-flow.glsl.js`.

## WebGPU / TSL note (2026 direction)
The ecosystem is shifting to **WebGPU + Three Shader Language (TSL)** (node-based, write once → WGSL/GLSL). Codrops/Tympanus is publishing the current recipes. For a Claude skill on this, vendor **dgreenheck/webgpu-claude-skill** (MIT) — see [`3d-web.skill.md`](3d-web.skill.md).

## License flags for client work
Client-safe: postprocessing (Zlib), react-postprocessing/CSM/glNoise/glslify/webgl-noise/three.quarks/wawa-vfx (MIT), n8ao (CC0), paper-design/shaders (PolyForm Shield — fine for sites). **Do NOT ship without clearing:** LYGIA (Prosperity, non-commercial), `glsl-curl-noise` (no license). IQ/ShaderToy snippets — per-item, mostly MIT but confirm.

## Files this skill governs
- [`shaders/`](shaders/) — CDN GLSL snippets: `gradient-flow`, `gradient-mesh`, `mesh-gradient-wgl`, `fluid`, `plasma`, `noise-flow`, `voronoi`, `liquid-distortion`, `halftone`, `kaleidoscope`, `godrays`, `raymarch-sdf`, `sdf-text`, plus `runner.js`. Copy-paste layer; for shaders bound to a React scene use drei `shaderMaterial` / CSM per the table above.