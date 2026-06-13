# Local Image Gen Skill — Flux/SDXL on Apple Silicon

> Verified June 2026 for **Mac M5 / 24 GB unified / macOS 26**. Read this when the user wants to generate images **locally/offline/free** (no API cost, private). Image gen is the genuine strong suit on Apple Silicon. For video/3D see [`local-video-3d-gen.skill.md`](local-video-3d-gen.skill.md); for cloud premium see the fal.ai MCP. Pairs with [`images.skill.md`](images.skill.md) (optimize/convert the output).

## TL;DR — three tiers, in order to reach for
| Tool | What | M5/24GB verdict |
|---|---|---|
| **Draw Things** | Native Mac app, most-optimized SD/Flux runtime on Apple Silicon (~20% faster than ComfyUI) | ✅ **FAST — default.** Easiest. |
| **mflux** (MLX) | Python/CLI Flux on Apple's MLX — scriptable | ✅ **USABLE→FAST.** For pipelines/automation. |
| **ComfyUI** (MPS) | Node-graph engine — most flexible (ControlNet/inpaint/IPAdapter) | ✅ **USABLE.** Only when you need graph control; slowest + Metal quirks. |

## 1. Draw Things — first choice
Free Mac/iOS app (App Store: "Draw Things: Offline AI Art"). Runs SDXL, SD3.5, FLUX.1 [schnell]/[dev], FLUX.2, Qwen Image, Z-Image, Wan, LTX. Built-in quantization + weight offload (offloads below 16 GB RAM, cutting peak memory >50% with no speed penalty).
- **M5 numbers (DT release notes):** Metal FlashAttention v2.5 w/ Neural Accelerators → up to **4.6× over M4**; FLUX.1[schnell] / Qwen Image (20B) / HiDream (17B) generate **hi-res in under a minute** on M5.
- **Automation (how Claude drives it):** HTTP API + **gRPC server** (run headless via the gRPC Server CLI, no GUI) + sandboxed **JS scripting** for presets/batch. Bridge: `ComfyUI-DrawThings-gRPC` routes ComfyUI graphs through DT's fast backend.

## 2. mflux (MLX) — scriptable
`filipstrand/mflux`, **MIT, actively maintained.** MLX-native ports of modern models.
```bash
uv tool install --upgrade mflux --with hf_transfer
mflux-generate-z-image-turbo --prompt "a puffin on a cliff" --width 1280 --height 500 --seed 42 --steps 9 -q 8
```
- Models: FLUX.1 (schnell+dev), **FLUX.2** (4B & 9B), **Z-Image** (6B), Qwen Image (20B), SeedVR2 upscaler. `-q` = 3/4/6/8-bit quant.
- Use when you need image gen *inside a Python pipeline* rather than a GUI; LoRA fine-tune on-device.

## 3. ComfyUI on Mac (MPS) — most flexible, slowest
Install ComfyUI Desktop (macOS) or venv with **nightly PyTorch** (best MPS fixes).
- **Critical MPS flags:** launch with `--use-pytorch-cross-attention` (biggest speed win); `PYTORCH_ENABLE_MPS_FALLBACK=1`. **Metal can't run FP8 (`Float8_e4m3fn`)** → use GGUF or bf16/fp16, not FP8 checkpoints. Optional `ComfyUI-MLX` nodes (~50–70% faster).
- Speeds (M4 Pro 24GB): Flux Dev Q6 @1024² 20 steps ≈ 50–90 s; SDXL ≈ 20–40 s. GPL-3.0.
- **ComfyUI MCP (let Claude drive it):** **`artokun/comfyui-mcp`** (MIT, recommended — MCP server *and* Claude Code plugin; auto-detects local ComfyUI on 8188/8000):
```json
{ "mcpServers": { "comfyui": { "command": "npx", "args": ["-y", "comfyui-mcp"] } } }
```
Alts: `shawnrushefsky/comfyui-mcp`; official Comfy Cloud MCP (invite-only, cloud GPU fallback).

## Models that fit 24 GB (realistic)
| Model | Fit | Verdict |
|---|---|---|
| **SDXL** | Easy | Fast, mature, LoRA-rich — safe default |
| **FLUX.1 [schnell]** (1–4 steps) | Easy (4-bit) | **Fast** — best local Flux quality/speed |
| **FLUX.1 [dev]** (~12B) | Tight at FP16 (~24GB) | Quantize 4/6-bit → usable, not snappy |
| **FLUX.2** (4B/9B, int4 ~17GB) | Comfortable | **Sweet spot** — modern quality, fits well |
| **Z-Image** (6B, ~3.5GB q-turbo) | Very easy | **Fast, small, strong realism** — great default |
| **Qwen Image** (20B) | Via offload | Slower; strong prompt adherence |

## ⚠️ Notes / flags
- **DiffusionKit (argmaxinc) is ARCHIVED (Mar 2026) — do not adopt.** Use mflux or Draw Things.
- Don't reach for an image API unless you need FLUX.2 Pro / Imagen-tier quality — local covers most needs free/private (good for NDA'd client work, per the DS secrets rule).
- Check each model's commercial-use license before shipping generated images in a paid deliverable.

## Files this skill governs
Cross-refs: [`images.skill.md`](images.skill.md) (optimize/convert output), [`local-video-3d-gen.skill.md`](local-video-3d-gen.skill.md), [`local-llm.skill.md`](local-llm.skill.md), the fal.ai MCP (cloud premium).
