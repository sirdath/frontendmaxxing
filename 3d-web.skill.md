# 3D Web Skill — Three.js / React Three Fiber decision tree

> Distilled from verified GitHub research (June 2026 — real repos, stars, licenses checked live). Read this first whenever the user asks for 3D on the web: a hero scene, a product viewer, a 3D portfolio, "make it 3D", WebGL/WebGPU. Pairs with the vanilla-Three CDN snippets in [`3d/`](3d/), the shader work in [`shaders.skill.md`](shaders.skill.md), motion in [`3d-motion.skill.md`](3d-motion.skill.md), and the Blender asset pipeline in [`blender.skill.md`](blender.skill.md).

## TL;DR — which 3D approach

| The user wants… | Reach for |
|---|---|
| A quick effect in a static page / this vault | **Vanilla three.js from CDN** → [`3d/`](3d/) snippets (`particles-galaxy.js`, `wave-plane.js`, `instanced-grid.js`, `postprocessing-bloom.js`) |
| A 3D scene inside a React/Next app | **React Three Fiber (R3F) v9** + `drei` — the DS default for client sites |
| A designer-built 3D hero, fast, no shader code | **Spline** (`@splinetool/react-spline`) or `r3f-spline` — see [`3d-motion.skill.md`](3d-motion.skill.md) |
| A non-interactive cinematic hero (scroll-scrubbed) | **NOT a 3D runtime** — use the Flux→Veo3 `premium-motion-pipeline` skill (cheaper, faster, hits Lighthouse) |
| Max hand-tuned perf, minimal abstraction | **OGL** (`oframe/ogl`) — what Lusion/award studios use over three |

**Rule:** if the hero doesn't need real-time interactivity, don't ship a WebGL runtime — pre-render it (premium-motion-pipeline). Reserve R3F/three for genuinely interactive 3D.

## The core stack (pin these — React 19 / Next 15)

| Package | Repo | Role | License |
|---|---|---|---|
| **three** | mrdoob/three.js (~113k★, daily) | The engine. Pin the version — it gates WebGPU/TSL features | MIT |
| **@react-three/fiber@9** | pmndrs/react-three-fiber (~31k★) | React renderer for three. **v9 = React 19**; v8 = React 18 | MIT |
| **@react-three/drei** | pmndrs/drei (~9.7k★) | The std-lib: controls, loaders, staging, `Environment`, `Text3D`, `ScrollControls`, `MeshTransmissionMaterial` | MIT |
| **@react-three/postprocessing** | pmndrs/react-postprocessing | Declarative bloom/DoF/SSAO/CA. Track the core `postprocessing` (Zlib) version it wraps | MIT |
| **@react-three/rapier** | pmndrs/react-three-rapier | Physics (Rust/WASM). **Use this, not `use-cannon`** (dormant since 2024) | MIT |
| **zustand** | pmndrs/zustand (~58k★) | State without re-render churn in the render loop | MIT |
| **leva** | pmndrs/leva | Dev-time GUI to dial in lighting/material/motion. Strip from prod | MIT |
| **r3f-perf** | utsuboco/r3f-perf | In-canvas perf HUD (draw calls/GPU/FPS) — your Lighthouse-90 gate | MIT |

**Recommended client-site base:** `pmndrs/react-three-next` starter (App Router, persistent global canvas, DOM↔canvas tunneling) → then bump `three` + `@react-three/fiber@9` yourself (the starter lags; architecture is sound). Pin `drei` + `react-postprocessing` + `rapier` + `zustand` + `r3f-perf`; `leva` dev-only.

## drei — the 80% you assemble from
Cameras/controls (`OrbitControls`, `CameraControls`), `useGLTF` (pairs with gltfjsx output — see [`blender.skill.md`](blender.skill.md)), staging (`Environment`, `ContactShadows`, `Lightformer`, `Stage`, `Bounds`), `Text`/`Text3D`, `Instances`/`Merged` (instancing), `MeshTransmissionMaterial` (glass), `ScrollControls`+`useScroll`, `shaderMaterial` (mount a GLSL pair as a material — see [`shaders.skill.md`](shaders.skill.md)). Non-React variant: `drei-vanilla`.

## In-scene UI / XR / gizmos
- **pmndrs/uikit** (~3.2k★, very active) — WebGL flexbox UI inside the scene (HUDs, panels). The successor to the **dormant** `react-three-flex`.
- **pmndrs/xr** — WebXR (VR/AR), and home of `@react-three/handle` (move/rotate/scale gizmos, work on non-XR too). ⚠️ custom/NOASSERTION license — verify before commercial ship.

## Perf budget (how you hit Lighthouse ≥ 90 on 3D)
- **r3f-perf** to measure; **three-mesh-bvh** (gkjohnson, ~3.4k★ MIT) for fast raycast/collision on heavy meshes; **instancing** (`Instances`) for repeated geometry; **react-three-offscreen** to run R3F in a worker; bake lighting in Blender (see `my-room-in-3d` below); compress assets (Draco/Meshopt — [`blender.skill.md`](blender.skill.md)).
- **n8ao** (N8python, CC0) / **realism-effects** (0beqz, SSGI/motion-blur, MIT) for cheap realism gains.

## Study-grade open-source (read the code, mind the license)
- **brunosimon/folio-2019** (~4.7k★ MIT) — the drivable-car portfolio; reference for "fun, premium, branded" 3D.
- **brunosimon/my-room-in-3d** (~4.4k★, no SPDX — study only) — gold standard for the bake-everything perf approach.
- **pmndrs/racing-game** (~2.2k★ MIT) — clean, MIT, safe to adapt: input + physics + game loop.
- **isaac-mason/sketches** (MIT, active) — large R3F technique reference (physics/shaders/voxels).
- **pmndrs/examples** (MIT) — the authoritative R3F example gallery (backs the docs).
- ⚠️ **Lunakepio/Mario-Kart-3.js** (~4.6k★) — superb R3F+Rapier reference but **no license = all-rights-reserved**; learn, don't copy.

## Awesome / discovery
- **AxiomeCG/awesome-threejs** (~900★ CC0) — the canonical three.js list (the best feedstock if you author your own skills).

## Adoptable Claude skill files (vendor with `git clone`)
- **dgreenheck/webgpu-claude-skill** (~961★ MIT) — **top pick** for R3F + shaders + Three.js TSL/WGSL; dual-format (Claude skill + Cursor rules). Vendor into `.claude/skills`.
- **freshtechbro/claudedesignskills** (~211★ MIT) — 22 skills incl. `react-three-fiber`, `threejs-webgl`, `web3d-integration-patterns`, `gsap-scrolltrigger`. Closest match to the DS stack.
- **davila7/claude-code-templates** → `3d-web-experience` skill (`npx skills add … --skill 3d-web-experience`).
- **Nice-Wolf-Studio/claude-skills-threejs-ecs-ts** (~20★ MIT) — ECS-for-three angle; partly WIP, verify file-by-file.

## License flags for client work
Clean MIT/permissive: three, react-three-fiber, drei, rapier, zustand, leva, r3f-perf, react-three-next, racing-game, lenis. **Verify before shipping:** `uikit` + `xr` (custom/NOASSERTION), `maath` + `my-room-in-3d` (no SPDX), Mario-Kart demo (no license).

## Files this skill governs
- [`3d/`](3d/) — vanilla three.js CDN snippets: `particles-galaxy.js`, `wave-plane.js`, `instanced-grid.js`, `cube-morph.js`, `floating-text.js`, `raycast-hover.js`, `postprocessing-bloom.js`, `scene-runner.js`, `scenes-pack.js`. These are the zero-build, copy-paste layer; reach for R3F when the scene lives in a React app.
- Cross-refs: [`shaders.skill.md`](shaders.skill.md) (GLSL on meshes/backgrounds), [`3d-motion.skill.md`](3d-motion.skill.md) (scroll-driven 3D, particles), [`blender.skill.md`](blender.skill.md) (assets → web).