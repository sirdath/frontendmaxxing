# Vendored Claude skills — 3D / shaders / Blender

External, MIT-licensed Claude Code skills vendored here as a reference + adoption source for 3D design, 3D motion, and Blender work. These are the **deep "how-to" layer** that complements the decision-tree `*.skill.md` files in the repo root ([`3d-web`](../3d-web.skill.md), [`shaders`](../shaders.skill.md), [`blender`](../blender.skill.md), [`3d-motion`](../3d-motion.skill.md)).

To make any of these **active** in a project, copy the skill folder into that project's `.claude/skills/` (e.g. `cp -R web3d/react-three-fiber /path/to/project/.claude/skills/`). A skill is "live" when its `SKILL.md` sits under `.claude/skills/<name>/`.

---

## `webgpu-threejs-tsl/` — WebGPU + Three.js Shading Language
- **Source:** [dgreenheck/webgpu-claude-skill](https://github.com/dgreenheck/webgpu-claude-skill) · author Dan Greenheck · **MIT** (declared in `.claude-plugin/plugin.json` + README)
- **Contents:** `SKILL.md` + `REFERENCE.md` + `docs/` + `examples/` + `templates/`. Covers TSL fundamentals, node-based materials, GPU compute shaders, particle systems, post-processing (bloom/blur/DoF), custom WGSL integration, device-loss recovery. Targets Three.js r171+/r183+.
- **Why:** the highest-quality shader/WebGPU skill in the ecosystem and the 2026 direction (TSL → WGSL/GLSL). Fills the deep-shader gap. The upstream repo also ships `.cursor/rules/` mirrors (not copied here — use the skill form for Claude).

## `blender/` — 8 deep Blender skills (Blender 5.x)
- **Source:** [ra100/blender-claude-plugin](https://github.com/ra100/blender-claude-plugin) · **MIT** (see `blender/LICENSE`)
- **Contents (8 `SKILL.md`):** `blender-geometry-nodes` (~373 nodes), `blender-shader-nodes` (PBR/procedural), `blender-compositing-nodes`, `blender-python-scripting` (operators/panels/handlers, Py 3.13), `blender-animation-rigging` (FCurves/drivers/IK-FK/NLA), `blender-modeling-modifiers` (bmesh/booleans/retopo), `blender-physics-simulation` (rigid/cloth/fluid/soft/particles), `blender-scene-rendering` (Cycles/EEVEE, color mgmt, import/export).
- **Why:** deep Blender API knowledge that complements the DathStel `blender-mcp-workflow` skill (which covers MCP *process/gotchas*, not the node/bpy *API*). v1.3.0 upstream integrates the blender-mcp server.

## `web3d/` — R3F + web-3D integration patterns
- **Source:** [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) · **MIT** (see `web3d/LICENSE`)
- **Contents:** `react-three-fiber` (R3F patterns) + `web3d-integration-patterns` (meta-skill combining Three.js + GSAP ScrollTrigger + R3F + Motion + react-spring). The upstream repo has ~22 skills total — only these two are vendored to avoid overlap with the root `.skill.md` files and the `gsap.skill.md` already in this vault.
- **Why:** R3F-specific patterns + the cross-library integration playbook for award-style motion.

## `taste-skill/` — 13 anti-slop frontend-taste skills
- **Source:** [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) · author Leonxlnx · **MIT** (see `taste-skill/LICENSE`) · site tasteskill.dev
- **Contents (13 `SKILL.md` under `taste-skill/skills/`):** `taste-skill` (the flagship anti-slop framework — layout/type/motion/spacing rules), `taste-skill-v1`, `gpt-tasteskill`; aesthetic directions `brutalist-skill`, `minimalist-skill`, `soft-skill`; method skills `redesign-skill`, `image-to-code-skill`, `output-skill`, `stitch-skill` (+ `DESIGN.md`); brand/imagery `brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile`. Also `research/laziness/` (why models under-deliver UI + remediations) and `examples/` reference boards.
- **Why:** the **prose design-taste layer** that complements this vault's *token/component* layer. Where the root `taste.skill.md` drives the `taste/*` CSS presets and anti-slop tokens, leonxlnx's skills carry aesthetic-direction playbooks (brutalist/minimalist/soft), a redesign methodology, and image→code / reference-board generation. Pair them: pick an aesthetic-direction skill for the *vibe*, then realise it with this vault's components + taste tokens.
- Dropped the 1.5M marketing `readme-banner.png` (kept the logo + Floria example boards).

---

## Licenses & attribution
All four sources are **MIT-licensed**. MIT requires preserving the copyright notice + license text on redistribution — `blender/LICENSE`, `web3d/LICENSE`, and `taste-skill/LICENSE` are the upstream files; `webgpu-threejs-tsl` is MIT per its `plugin.json`/README (no standalone LICENSE file upstream). Keep these notices intact if this repo is published. Credit: Dan Greenheck (webgpu-threejs-tsl), ra100 (blender), freshtechbro (web3d), Leonxlnx (taste-skill).

*Vendored 2026-06-04 (taste-skill added 2026-06-13). Re-pull from upstream periodically — these track fast-moving APIs (Three.js TSL, Blender 5.x).*