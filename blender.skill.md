# Blender Skill — modelling & the Blender → web pipeline

> Distilled from verified GitHub research (June 2026 — real repos, stars, licenses checked live). Read this whenever the user wants 3D assets/motion authored in Blender and shipped to the web (Three.js / R3F), drives Blender via the **blender-mcp** server, works with Geometry Nodes, or asks about glTF export / compression. Pairs with [`3d-web.skill.md`](3d-web.skill.md) (consuming assets in R3F) and the DathStel `blender-mcp-workflow` skill (the canonical MCP gotchas).

## TL;DR — the pipeline in one line
**Author in Blender → export glTF/GLB (Khronos exporter) → optimize + convert to R3F component (`gltfjsx --transform`) → load with drei `useGLTF`.** Compress with **Meshopt by default** (faster decode, tiny WASM, compresses animation too); use **Draco** only when geometry size is the hard constraint.

## The pipeline, step by step
| Step | Tool | Notes |
|---|---|---|
| 1. Export | **KhronosGroup/glTF-Blender-IO** (Apache-2.0, ships with Blender) | Where Draco toggles, `KHR_*` extensions, and **action naming** are decided — gltfjsx reads action names. `+Y up` for three. |
| 2. Optimize + componentize | **pmndrs/gltfjsx** (~5.8k★ MIT; web app gltf.pmnd.rs) | `npx gltfjsx model.glb --transform` → pruned, typed R3F component + a 70–90% smaller `-transformed.glb`. The literal Blender→R3F bridge. |
| 3. Fine-grained compression | **donmccurdy/glTF-Transform** (MIT, by a three maintainer) | `gltf-transform meshopt in.glb out.glb` / `draco …`. Scriptable when `gltfjsx --transform` over-compresses a hero mesh. |
| 4. Consume | **drei `useGLTF`** + `<Environment files="…hdr">` | See [`3d-web.skill.md`](3d-web.skill.md). Decoders (`DRACOLoader`/`MeshoptDecoder`) live in three's `examples/jsm`. |

## Driving Blender via MCP (you already do this)
- **ahujasid/blender-mcp** (~14–22k★ MIT) — MCP server + addon (port 9876): code execution, scene inspection, viewport screenshots, asset download (PolyHaven, Sketchfab, Hyper3D/Rodin, Hunyuan3D).
- **Gotchas (already captured in your `blender-mcp-workflow` skill — honor them):**
  - One logical op per `execute_blender_code` call — chaining state-changing ops times out the socket (`WinError 10054`).
  - **Mantaflow fluid sim is broken in Blender 5.x (≥5.1)** — bakes in seconds, empty caches. **Keep a Blender 4.5 LTS install** for any fluid work.
  - `bpy.ops.fluid.free_all()` blocks the UI thread → times out; delete caches with `shutil.rmtree`.
  - Mantaflow `cache_type='MODULAR'` only writes the last frame from Python — use `'ALL'` + `bake_all()`.
  - Save before/after every mutating call; verify state with `get_scene_info`, not screenshots (can return black).
  - **Blender 4.4+ Action API drift:** old `action.fcurves` is gone → `action.layers[0].strips[0].channelbag(slot)`.
- **nutti/fake-bpy-module** (MIT, PyPI) — type-annotated `bpy` stubs for autocomplete/type-checking the code you push through MCP; catches API-drift before it hits the socket.
- Integrations: **DeemosTech/blender-mcp-rodin-integration** (Hyper3D/Rodin), **Tencent-Hunyuan/Hunyuan3D-2.1** (open-weights image→3D — the model behind your Hunyuan path; dense meshes → retopo+decimate before export).

## Procedural / Geometry Nodes
- **nortikin/sverchok** (GPL-3.0, **tested to Blender 5.1**) — parametric node CAD beyond native Geometry Nodes (math-driven generative forms, architectural patterning); bake to mesh → clean glTF.
- Native **Geometry Nodes** with simulation/repeat zones is now the path for procedural motion (bake to keyframes/mesh, then export).
- ⚠️ **JacquesLucke/animation_nodes** (GPL-3.0) — historic motion-graphics reference but **stalled at Blender 4.2 LTS, no 4.4/4.5/5.x build**. Use as learning reference only; prefer Geometry Nodes / Sverchok for new work.
- GN asset libraries (clone + register as Asset Library; **vet per-repo license before client ship**): `johnnygizmo/node_assets`, `Tams3d/T3D-GN-Presets`, `cgvirus/blender-geometry-nodes-collection`, `KoreTeknology/Blender-GN-Library-Addon`, `rbarbosa51/GeometryNodesByTutorials`.

## bpy scripting pattern banks (for MCP code)
`CGArtPython/bpy_building_blocks` (helper fns), `kolibril13/bpy-gallery` (runnable snippets), `zeffii/BlenderPythonRecipes` (curated — some target ≤2.79).

## Assets (license-clean first)
- **PolyHaven** (polyhaven.com, **CC0** — safest for client work) — 1,700+ HDRIs/textures/models; HDRIs drop into drei `<Environment>`; `agmmnn/polydown` (MIT) batch-downloads via the public API. Already wired into blender-mcp.
- **ambientCG** (ambientcg.com, **CC0**) — 2,800+ PBR materials/HDRIs up to 8K (site + API, no repo).
- ⚠️ **BlenderKit/BlenderKit** (addon GPL-3.0, but **assets are mixed-license, not uniformly CC0**) — verify per asset before a commercial deliverable.
- AI-generated meshes (Hunyuan/Rodin) — confirm the generation service's commercial-use terms before shipping.

## Heavier alternative (editor-driven web pipeline)
- **needle-tools/needle-engine** — Blender/Unity → glTF web runtime on top of three, with a component system + lightmap baking. More opinionated than hand-wired R3F; consider only if you want an editor-driven pipeline. `needle-tools/gltf-progressive` does runtime glTF LOD — genuinely useful for heavy heroes.

## Index / discovery
- **agmmnn/awesome-blender** (~6k★) — the master list of addons/tools/exporters/GN/assets.

## Adoptable Claude skill files (vendor with `git clone`)
- **ra100/blender-claude-plugin** (MIT, 8 SKILL.md files, Blender 5.x) — geometry-nodes (~373 nodes), shader-nodes, compositing, python-scripting (Py 3.13), animation-rigging, modeling-modifiers, physics-sim, scene-rendering; v1.3.0 has blender-mcp integration. **Best pure-Blender skill set** — port the relevant subset into your `blender-mcp-workflow`.
- **freshtechbro/claudedesignskills** → `blender-web-pipeline/SKILL.md` (MIT, ~613 lines: glTF/Draco export, decimation, baking, LOD, batch bpy).
- **Impertio-Studio/Blender-Bonsai-…-Skill-Package** (MIT, 73 skills incl. 26 Blender) — deepest error-pattern/recipe structure, but heavily AEC/BIM-oriented; mine the Blender 26-skill subset only.

## License hygiene (client work)
Pipeline core all permissive: glTF-Blender-IO (Apache-2.0), gltfjsx/glTF-Transform/blender-mcp/fake-bpy-module/polydown (MIT). PolyHaven + ambientCG = **CC0 (safest)**. Sverchok/animation_nodes/BlenderKit-addon = GPL-3.0. BlenderKit assets + AI-gen meshes = **verify per item**.

## Files / skills this governs
- The DathStel `blender-mcp-workflow` SKILL.md (authoritative MCP gotchas — this file mirrors + extends it).
- Output feeds [`3d-web.skill.md`](3d-web.skill.md) (R3F consumption) and the `premium-motion-pipeline` skill (pre-rendered heroes).