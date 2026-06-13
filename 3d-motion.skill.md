# 3D Motion Skill — scroll-driven 3D, particles & award-winning motion

> Distilled from verified GitHub research (June 2026 — real repos, stars, licenses checked live). Read this whenever the user wants 3D *in motion*: scroll-scrubbed scenes, scroll-linked camera/object animation, particle systems, flow fields, keyframed 3D timelines, or "make it feel like an Awwwards site." This is the 3D-specific motion layer — for the GSAP/ScrollTrigger engine and CSS motion see [`gsap.skill.md`](gsap.skill.md); for the scene itself see [`3d-web.skill.md`](3d-web.skill.md); for shader-driven motion see [`shaders.skill.md`](shaders.skill.md).

## TL;DR — which motion tool

| The user wants… | Reach for |
|---|---|
| Scroll-scrub a 3D scene/camera in R3F | **drei `ScrollControls` + `useScroll`** (the canonical primitive) |
| Sync WebGL meshes to DOM elements on scroll (image→mesh, no scroll-jack) | **14islands/r3f-scroll-rig** (Lenis built in) — the proven "DOM-driven WebGL" pattern |
| Smooth scroll under any WebGL site | **darkroomengineering/lenis** (`lenis/react`) — already in the DS stack |
| Scroll-scrubbed *timeline* of many steps | **GSAP ScrollTrigger** (see [`gsap.skill.md`](gsap.skill.md)) — attach to a timeline, pass `containerAnimation` |
| Hand-authored, keyframed 3D camera/object motion | **Theatre.js** (visual sequencer) — ⚠️ license/cadence below |
| Physics-based object motion in R3F | **pmndrs/react-spring** (`framer-motion-3d` is **deprecated**) |
| Particle systems / VFX | **three.quarks** (general) or **flow-field GPGPU** repos below |
| A designer-built animated 3D hero, fast | **Spline** (`@splinetool/react-spline` / `r3f-spline`) |
| A non-interactive cinematic hero | **NOT a runtime** — Flux→Veo3 `premium-motion-pipeline` skill |

## Scroll-driven 3D
- **drei `ScrollControls` + `useScroll`** — wrap the scene, read `scroll.offset`/`range()`/`curve()`/`visible()` in `useFrame` to drive camera/objects. The standard R3F scroll primitive.
- **14islands/r3f-scroll-rig** (~940★ MIT) — progressively enhances a normal DOM page with WebGL: tracks DOM rects and renders synced three meshes (`ScrollScene`, `ViewportScrollScene`) over one shared `GlobalCanvas`, **Lenis integrated**. The award-site pattern for image-to-mesh / scroll-linked scenes without multiple canvas contexts or scroll-jacking.
- **darkroomengineering/lenis** (~14k★ MIT, by darkroom.engineering, an Awwwards studio) — the smooth-scroll layer award sites assume; first-class `lenis/react` (`ReactLenis`, `useLenis`). Pairs with drei `ScrollControls` and your GSAP ScrollTrigger pipeline.
- **lusionltd/WebGL-Scroll-Sync** (~334★ MIT) — Lusion's own demo of syncing WebGL to many DOM elements on one canvas without scroll-jacking; study-grade.

## Keyframed / sequenced 3D motion
- **theatre-js/theatre** (~12.5k★) — visual + programmatic animation sequencer with strong R3F integration (the classic Codrops "camera fly-through on scroll" tutorial). The premier tool for hand-authored 3D motion timelines. ⚠️ **Caveats:** active dev moved to a **private repo** (public cadence paused toward 1.0); the **studio package is AGPL-3.0** — clear it before proprietary client work. Core is Apache-2.0.

## Physics-based & spring motion
- **pmndrs/react-spring** (~29k★ MIT) — spring physics targeting react-dom / native / **R3F**. The recommended physics-based animation path for R3F objects.
- ⚠️ **framer-motion-3d is DEPRECATED** — "no longer supported," no React 19. Do not adopt; the 2D lib was renamed **`motion`** (motion.dev) and stays active for DOM. For physical/collision motion use **@react-three/rapier** (see [`3d-web.skill.md`](3d-web.skill.md)).

## Particles & generative motion
- **three.quarks** (Alchemist0823, MIT, TS) + its WYSIWYG editor — **the recommended particle engine** (exports JSON you load at runtime). **Prefer over the inactive `three-nebula`.**
- **sebastien-lempens/r3f-flow-field-particles** — GPGPU flow-field particles native to R3F (the most directly reusable curl-noise flow repo). Vanilla companions: `juniorxsound/Particle-Curl-Noise`, `iagokrt/curl-noise-threejs`.
- Underlying technique: Three.js Journey's "GPGPU Flow Field Particles" lesson (FBO ping-pong) + curl noise (see [`shaders.skill.md`](shaders.skill.md)). Vault snippets: `3d/particles-galaxy.js`, `shaders/noise-flow.glsl.js`.
- **wawa-vfx** (wass08, MIT, young) — lightweight composable R3F VFX; evaluate before a deadline.

## No-code 3D (designer-driven heroes)
- **Spline** (spline.design) — browser 3D editor. `@splinetool/react-spline` (+ `@splinetool/runtime`) drops a scene in as a React component with props, events (`onSplineMouseDown`), Next.js SSR + blurred placeholder. **r3f-spline** loads a Spline scene into R3F when you want the visual layer but full three control underneath. Both MIT. Fastest path to an animated 3D hero without shader code.

## Creative-dev people & studios to follow (technique sources)
- **Bruno Simon** (github.com/brunosimon) — `folio-2019`, `my-room-in-3d`, `infinite-world` (all MIT); runs Three.js Journey. The canonical reference.
- **Yuri Artiukh / akella** (github.com/akella) — "deconstruction" demos recreating award-site effects; threejs-workshops.com.
- **Robin Delaporte / robin-dela** (Awwwards jury) — MIT libs `hover-effect` (image displacement hover — a staple effect), `flowmap-effect` (mouse flowmap with OGL).
- **Olivier Larose** (blog.olivierlarose.com) — Next.js + Framer Motion + GSAP + R3F effect tutorials with per-post source.
- **Lusion** (lusion.co) — multi-time Awwwards Site/Dev of the Year; built on **OGL** (oframe/ogl, MIT) not three when they want hand-tuned perf.

## Inspiration galleries (reference, mostly closed-source)
- **Codrops / Tympanus** (tympanus.net/codrops, github.com/codrops) — uniquely both gallery AND open MIT code; the richest source of complete, current effect recipes (now incl. WebGPU/TSL).
- **Awwwards** (awwwards.com — has a "GitHub" inspiration tag linking open repos), **Godly** (godly.website).

## Adoptable Claude skill files (vendor with `git clone`)
- **freshtechbro/claudedesignskills** (MIT) → `web3d-integration-patterns` (combines three + GSAP ScrollTrigger + R3F + Motion + react-spring) and `gsap-scrolltrigger` — both reinforce your `premium-motion-pipeline`.
- **greensock/gsap-skills** (MIT) — official GSAP AI skills (already the source of [`gsap.skill.md`](gsap.skill.md)); covers ScrollTrigger/ScrollSmoother motion.
- **dgreenheck/webgpu-claude-skill** (MIT) — TSL particle systems / compute-driven motion (see [`3d-web.skill.md`](3d-web.skill.md)).

## Maturity flags to act on
- **framer-motion-3d** → deprecated (no React 19). Use react-spring / drei / rapier.
- **three-nebula** → inactive. Use three.quarks.
- **Theatre.js** → public repo paused; studio editor AGPL-3.0 — weigh before proprietary client ship.

## License flags for client work
Client-safe MIT: react-three-fiber, drei, react-spring, lenis, r3f-scroll-rig, three.quarks, react-spline/r3f-spline, OGL, WebGL-Scroll-Sync, robin-dela libs. GSAP = free incl. all plugins (never use a GreenSock auth token — see [`gsap.skill.md`](gsap.skill.md)). **Verify before shipping:** Theatre.js studio (AGPL-3.0), Codrops per-demo, any flow-field repo without a stated license.

## Files this skill governs
- Cross-refs: [`gsap.skill.md`](gsap.skill.md) (the scroll/timeline engine + `gsap/` snippets), [`3d-web.skill.md`](3d-web.skill.md) (the scene/runtime), [`shaders.skill.md`](shaders.skill.md) (shader-driven motion), and the vault snippets [`3d/particles-galaxy.js`](3d/particles-galaxy.js), [`3d/wave-plane.js`](3d/wave-plane.js), [`scroll/`](scroll/).