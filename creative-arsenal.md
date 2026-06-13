# Creative Arsenal — apps, live-visual envs & creative MCPs

> Verified June 2026 for **Mac Apple Silicon (M5, macOS 26)**. Free/open-source creative software to install, live-visual/generative environments to explore, and MCP servers that let Claude *drive* creative apps (the blender-mcp pattern, extended). Cask tokens verified against formulae.brew.sh.

## A. Desktop apps — one-line install
```bash
brew install --cask krita gimp inkscape kdenlive audacity obs godot upscayl handbrake-app chainner sonic-pi
```
| App | Cask | What | Priority |
|---|---|---|---|
| **Krita** | `krita` | Pro digital painting + frame-by-frame 2D animation. Concept art, texture, illustration. | **must** |
| **GIMP** | `gimp` | Raster editor / open Photoshop. | nice |
| **Inkscape** | `inkscape` | SVG vector editor (installing). | **must** |
| **Kdenlive** | `kdenlive` | Fully-FOSS multitrack video editor. | nice |
| **Audacity** | `audacity` | Audio editor/recorder — VO, podcast, cleanup. | nice |
| **OBS Studio** | `obs` | Screen record + stream — demos, walkthroughs. | **must** |
| **Godot** | `godot` | Game engine with **web (WASM) export** — interactive microsites. | nice |
| **Upscayl** | `upscayl` | AI image upscaler (RealESRGAN/UltraSharp). | nice |
| **HandBrake** | `handbrake-app` | Video transcode/compress. *(token changed from `handbrake`)* | nice |
| **chaiNNer** | `chainner` | Node-based image-processing pipelines (MPS). | nice |
| **Sonic Pi** | `sonic-pi` | Live-code music (MIT, native ASi). | niche |

**No cask — download manually:** **DaVinci Resolve** (free tier — flagship edit/color/Fusion VFX/Fairlight audio, Metal-optimized — blackmagicdesign.com) · **Penpot** (open-source Figma, self-host via Docker — penpot.app) · **Natron** (node compositor, Rosetta) · **Pinokio** (1-click local-AI-app installer — pinokio.co).
**Token gotchas:** HandBrake = `handbrake-app`; OpenShot = `openshot-video-editor`; Synfig = `synfigstudio`; **no** `davinci-resolve` cask exists. Deprecated casks (install before 2026-09-01 or download): `synfigstudio`, `lmms`, `opentoonz` (use the **Tahoma2D** fork instead).

## B. Creative-coding & live-visual environments
**Web-embeddable (fit your Next.js stack) — explore these first:**
| Tool | What | License | Embed |
|---|---|---|---|
| **Cables.gl** | Browser node-patcher for WebGL (TouchDesigner-for-web). | **MIT ✅** | Publishes/embeds patches into a page. Best node option for web. |
| **Hydra** | Live-coding video synth, audio-reactive. | ⚠️ CC-BY-NC-SA (clear for client work) | `npm i hydra-synth` → render to a canvas. |
| **Strudel** | TidalCycles in the browser — algorithmic music. | AGPLv3 | Web Audio/Tone.js; embeddable. |
| **three.js / p5.js** | (you have these) WebGL 3D / generative 2D. | MIT / LGPL | Native React fit. |
| **ISF** (interactive-shader-format-js) | Portable parameterized GLSL shaders, runnable in WebGL. | open | Embed authored shaders in a page. |

**Free desktop powerhouses (Apple-Silicon-native):**
- **TouchDesigner** (derivative.ca) — the installation/projection/AV-performance standard. **Free non-commercial tier capped at 1280×1280**; paid lifts it. (NVIDIA-only features don't work on Mac.)
- **Cavalry** (cavalry.scenegroup.co) — procedural/parametric **motion-graphics** (AE alternative). **Cavalry Pro became free for individuals (Apr 2026, Canva)**, native ASi, exports Lottie/video for web.
- **openFrameworks** (MIT, C++) / **nannou** (MIT+Apache, Rust) — performance-critical installations.
- **KodeLife** (hexler.net) — real-time Metal/GLSL shader live-coding (free trial, optional one-time license).

**Deprioritize on Mac:** vvvv (no native macOS — Parallels only); Max/MSP (paid).

## C. Creative-tool MCP servers (Claude drives the app — the blender-mcp pattern)
Ranked by maturity. All community unless noted. Add to `.mcp.json` like the others.
| MCP | Repo | Drives | Maturity |
|---|---|---|---|
| **Unity** | `CoplayDev/unity-mcp` | Unity Editor (assets/scenes/C#) | ~10k★, very active |
| **Godot** | `Coding-Solo/godot-mcp` | Godot (scenes/run/debug) | ~4k★, active |
| **Ableton Live** | `ahujasid/ableton-mcp` | Ableton (tracks/MIDI/instruments) — same author as blender-mcp | ~2.7k★ MIT |
| **DaVinci Resolve** | `samuelgursky/davinci-resolve-mcp` | Resolve **Studio** (timeline/color), 329 tools | ~1.2k★, active |
| **FreeCAD** | `neka-nat/freecad-mcp` | FreeCAD (parametric CAD, FEM) | ~1.1k★ MIT |
| **ComfyUI** | `artokun/comfyui-mcp` | ComfyUI (already in your `.mcp.json`) | active |
| **Penpot** (official) | `penpot/penpot-mcp` | Penpot design → code | official |
| **Canva** (official) | canva.dev/docs/connect/mcp-server | Canva (templates/export), hosted | official |
| **Three.js DevTools** | `DmitriyGolub/threejs-devtools-mcp` | inspect/edit live three/R3F scenes | newer, 59 tools |
| **Cinema 4D / Unreal / Krita / GIMP** | `ttiimmaacc/cinema4d-mcp` · `chongdashu/unreal-mcp` · `nanayax3/krita-mcp` · `maorcc/gimp-mcp` | respective apps | ⚠️ experimental |

**Gaps (no real/maintained MCP found):** Logic Pro, Photoshop-on-Mac (the PS MCP is Windows-only), chaiNNer.

## Files this skill governs
Cross-refs: [`3d-web.skill.md`](3d-web.skill.md), [`3d-motion.skill.md`](3d-motion.skill.md), [`shaders.skill.md`](shaders.skill.md), [`generative-art.skill.md`](generative-art.skill.md), [`remotion.skill.md`](remotion.skill.md), [`comfyui-models.md`](comfyui-models.md), the DathStel `.mcp.json` (where creative MCPs get wired).
