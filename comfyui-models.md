# ComfyUI on M5/24GB — what to download

> Verified June 2026. The "what to actually put in ComfyUI" shopping list for the local install (see [`local-image-gen.skill.md`](local-image-gen.skill.md)). **Mac reality: no CUDA, no FP8 in Metal → never download `*_fp8_e4m3fn` files; use fp16/bf16 or GGUF.** GGUF is your friend (run via the `ComfyUI-GGUF` node). Usable budget ≈ 16–18 GB after the OS.

## TL;DR — first-session download (fits 24 GB, mostly open/commercial)
1. **`ComfyUI-GGUF` node** (city96) — enables every GGUF below. Install first.
2. **Flux schnell GGUF Q4_K_S** (~6.8 GB, **Apache-2.0**, `city96/FLUX.1-schnell-gguf`) + Flux text encoders + VAE (below)
3. **Z-Image Turbo** (6B, **Apache-2.0**, `Comfy-Org/z_image_turbo`) — best quality-per-GB on Mac, fast
4. **SDXL-Lightning 4-step LoRA** (~390 MB, `ByteDance/SDXL-Lightning`) for your existing SDXL base
5. **SDXL VAE fp16-fix** (335 MB, `madebyollin/sdxl-vae-fp16-fix`) + **4x-UltraSharp** + **RealESRGAN x4plus** (67 MB each)
6. **SDXL Union ProMax ControlNet** (2.5 GB, `xinsir/controlnet-union-sdxl-1.0`) + **comfyui_controlnet_aux** node
7. **IP-Adapter Plus SDXL** (847 MB, `h94/IP-Adapter`) + **CLIP-ViT-H encoder** (2.5 GB, required)
8. Nodes: Impact-Pack, rgthree, Crystools, Florence2, WAS, efficiency

## Checkpoints (priority order)
| Model | HF repo | Size | License | Mac verdict | Folder |
|---|---|---|---|---|---|
| **Flux schnell GGUF Q4–Q5** | `city96/FLUX.1-schnell-gguf` | Q4 ~6.8 GB | **Apache-2.0 ✅ commercial** | Ideal — 4-step, open | `unet` |
| **Z-Image Turbo** | `Comfy-Org/z_image_turbo` | 6B AIO | **Apache-2.0 ✅** | **Best Mac pick** — small, fast, photoreal, text | `checkpoints` |
| **Flux dev GGUF Q5–Q6** | `city96/FLUX.1-dev-gguf` | Q5 ~9 GB | ⚠️ **non-commercial**, HF-gated | Best Flux quality, personal use | `unet` |
| **SDXL-Lightning** (UNet or LoRA) | `ByteDance/SDXL-Lightning` | 6 GB / 390 MB LoRA | OpenRAIL++ ✅ | Fast 4-step SDXL | `checkpoints`/`loras` |
| **SD3.5 Medium** | `stabilityai/stable-diffusion-3.5-medium` | ~5 GB | Stability Community (gated) | Light, capable | `checkpoints` |
| **Qwen-Image GGUF Q3/Q4** | `city96/Qwen-Image-gguf` | Q4 ~10 GB | Apache-2.0 ✅ | 20B — best text rendering, heavy; Q8 won't fit | `unet` |

**Flux needs these once (shared):** `clip_l.safetensors` (246 MB) + `t5xxl_fp16.safetensors` (9.8 GB — **fp16, not fp8**) from `comfyanonymous/flux_text_encoders` → `clip/`; `ae.safetensors` (335 MB) from the Flux repo → `vae/`.

## ControlNet
- **`xinsir/controlnet-union-sdxl-1.0`** → `..._promax.safetensors` (2.5 GB, **Apache-2.0**) — one file = canny/depth/pose/scribble/tile/inpaint. **Get this.** → `controlnet/`
- Flux: `Shakker-Labs/FLUX.1-dev-ControlNet-Union-Pro-2.0` (6.6 GB, ⚠️ non-commercial) — tight alongside a Flux model.

## IP-Adapter / face
- **`h94/IP-Adapter`** → `ip-adapter-plus_sdxl_vit-h.safetensors` (847 MB, Apache) → `ipadapter/` + **CLIP-ViT-H** `image_encoder/model.safetensors` (2.5 GB, **required**) → `clip_vision/`
- **InstantID** (`InstantX/InstantID`, Apache) — face identity; also needs InsightFace `antelopev2` + `onnxruntime`. SDXL only.

## Upscalers (tiny, run via built-in "Upscale Image (using Model)")
- **4x-UltraSharp** (`Kim2091/UltraSharp`, ~67 MB, ⚠️ CC-BY-NC-SA) · **RealESRGAN x4plus** (~67 MB, **BSD-3 ✅**) → `upscale_models/`
- **SUPIR** (`kijai/ComfyUI-SUPIR` node) — diffusion restoration; heavy/slow on Mac, occasional hero-shot only.

## VAE / LoRA
- **SDXL VAE fp16-fix** (`madebyollin/sdxl-vae-fp16-fix`, MIT) → prevents black images in fp16. **Get it.** → `vae/`
- **SDXL-Lightning 4-step LoRA** → turns any SDXL checkpoint into 4-step fast gen. High value on Mac. → `loras/`

## Essential custom nodes (install via ComfyUI-Manager)
`ComfyUI-GGUF` (city96 — **first, loads all GGUF**) · `ComfyUI-Impact-Pack` (detailers/face-fix) · `comfyui_controlnet_aux` (Fannovel16 — CN preprocessors, **required to use ControlNets**; bundles DWPose/Depth) · `ComfyUI_IPAdapter_plus` (cubiq) · `rgthree-comfy` (QoL, LoRA stacking) · `ComfyUI-Florence2` (kijai — auto-caption/detect/OCR) · `was-node-suite-comfyui` · `ComfyUI-Crystools` (RAM/temp monitor — watch the 24 GB ceiling) · `efficiency-nodes-comfyui` · `ComfyUI-VideoHelperSuite` + `ComfyUI-AnimateDiff-Evolved` (lightest local video path).

## HF gating
**Open, no login:** Flux **schnell**, Z-Image, Qwen-Image, SDXL-Lightning, xinsir ControlNets, h94 IP-Adapter, madebyollin VAE, RealESRGAN.
**Gated (need free HF account + accept license):** Flux **dev** + its ControlNets (⚠️ non-commercial), SD3.5, some InstantID deps. GGUF re-uploads aren't gated but the **underlying license still applies** (Flux-dev GGUF is still non-commercial).

## Avoid on Mac
Any `*_fp8_e4m3fn` file · full fp16 Flux (23.8 GB) · Qwen-Image Q8 (21.8 GB) · SUPIR for batch.

*Cross-refs: [`local-image-gen.skill.md`](local-image-gen.skill.md), [`local-video-3d-gen.skill.md`](local-video-3d-gen.skill.md), [`local-ai-utilities.skill.md`](local-ai-utilities.skill.md). The `comfyui` MCP (in DathStel `.mcp.json`) drives all of this once ComfyUI runs on :8188.*
