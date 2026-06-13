# Local Video & 3D Gen Skill — Apple Silicon reality check

> Verified June 2026 for **Mac M5 / 24 GB / macOS 26**. Read this when the user wants to generate **video** or **3D models** with AI. Blunt headline: **local video on 24 GB ranges from slow to impractical; local 3D is more viable but constrained.** For anything client-facing on a deadline, use the API fallbacks below. Pairs with [`local-image-gen.skill.md`](local-image-gen.skill.md), [`blender.skill.md`](blender.skill.md), the `premium-motion-pipeline` skill, and the fal.ai MCP.

## TL;DR
- **Video local pick → Wan 2.2 TI2V-5B (Turbo GGUF)** — Apache-2.0, fits 24GB, ~5–15 min/short clip in ComfyUI or Draw Things. **fal.ai (cloud) for deadline/quality.**
- **3D → local TripoSR (fast previz) / TRELLIS.2 (best usable local quality) for blockouts; API (fal/Tripo/Meshy) or Blender-MCP for textured, client-ready assets.**
- Both feed [`blender.skill.md`](blender.skill.md) for cleanup → web (gltfjsx → R3F).

## Why local video struggles on Mac
MPS lacks CUDA-level optimization + `torch.compile`; Metal can't run FP8 (`Float8_e4m3fn`) checkpoints; 14B models thermal-throttle; 24 GB caps resolution/length hard. Use GGUF quants where available.

## Local VIDEO — the actual pick: Wan 2.2 TI2V-5B
**Latest + most compatible local video on M5/24GB (verified June 2026): Wan 2.2 TI2V-5B** — 5B dense, **Apache-2.0 (commercial ✅)**, has GGUF (sidesteps the FP8-on-Metal wall), runs in both ComfyUI (MPS) and Draw Things. The **Turbo** 4-step distill + TeaCache makes it tolerable. *(No Wan 2.5/2.6 open weights exist yet — 2.2 is the latest open line. FramePack & HunyuanVideo-1.5 are the best new low-VRAM models but are CUDA-only — no Mac path.)*

| Model | Mac verdict |
|---|---|
| **Wan 2.2 TI2V-5B (Turbo GGUF)** | ✅ **THE pick** — fits 24GB with headroom; 4-step + TeaCache → ~5–15 min for a 2–3s 512p clip. Apache-2.0 |
| **Wan 2.2 A14B** | ⚠️ quality ceiling; only via **Draw Things** weight-offload (~20GB, 6-bit SVDQuant). ComfyUI-MPS ≈ tens of min / 2s clip |
| **LTX-Video / LTX-2** | ⚠️ fast architecture but **fragile on Metal** (needs torch 2.4.1; 14B NaNs). Run via **Draw Things**, not raw ComfyUI |
| **SVD-XT** | ✅ reliable fallback — image-only motion (no text steering), minutes/4s clip, 2023-era quality |
| FramePack · HunyuanVideo-1.5 · CogVideoX · Mochi · LTX-2.3 22B | ❌ CUDA-only or needs 32GB+ / too slow |

### Best local recipe — Wan 2.2 5B Turbo in ComfyUI (MPS)
**Files** (`hf download`): UNet `hum-ma/Wan2.2-TI2V-5B-Turbo-GGUF` → `Wan2.2-TI2V-5B-Turbo-Q5_K_M.gguf` (3.8GB) → `models/diffusion_models/` · text encoder `city96/umt5-xxl-encoder-gguf` → `umt5-xxl-encoder-Q5_K_M.gguf` (~3.6GB) → `models/text_encoders/` · VAE `QuantStack/Wan2.2-TI2V-5B-GGUF` → `VAE/Wan2.2_VAE.safetensors` → `models/vae/`.
**Nodes:** `city96/ComfyUI-GGUF` (**swap the fp8 umt5 for the GGUF one — the fp8 encoder is what crashes MPS**), `kosinkadink/ComfyUI-VideoHelperSuite`, `welltop-cn/ComfyUI-TeaCache`.
**Launch:** `PYTORCH_ENABLE_MPS_FALLBACK=1 .venv/bin/python main.py --use-pytorch-cross-attention --force-fp16 --mac-max-memory 18432`. KSampler **4 steps** + TeaCache; start **512×512 / 49 frames**, then scale. Use `euler` (not `uni_pc`).
**Zero-config alt: Draw Things** (App Store) → Wan 2.2 5B — most-optimized Metal runtime, weight-offload fits even 14B; headless via `gRPCServerCLI` / `draw-things-cli` for scripting + benchmarks.
**Realistic M5/24GB:** smoke 320² ~1–3 min · 512²/49-frame (~2s) Turbo+TeaCache **~5–12 min** · full 720p/5s = 30–60+ min (don't). **Verify the real number on your machine.**

### Video API fallbacks (use for anything real) — fal.ai, one API, pay-per-use
Wan 2.6 **$0.05/s** · Kling 2.5 Turbo Pro **$0.07/s** · **Veo 3.1 $0.20/s** (+audio/4K $0.40/s) · Sora 2 Pro $0.30–0.50/s. **Veo 3.1 via fal is exactly what the DS `premium-motion-pipeline` already uses** (first-last-frame interpolation) — keep that pipeline for cinematic heroes. Runway = alternative for img2vid/editing.

## Local 3D — more viable, but constrained
Caveats: MPS needs **more memory than CUDA (32 GB+ officially recommended)**; several models give **untextured meshes** without the CUDA rasterizer; outputs need Blender cleanup (retopo/decimate, re-UV).
| Model | Mac | Verdict on 24 GB |
|---|---|---|
| **TripoSR** (VAST, MIT) | MPS w/ `PYTORCH_ENABLE_MPS_FALLBACK=1` | ✅ **Fast (seconds) but rough**, lighting baked into texture — blockouts/previz, not final |
| **TRELLIS.2** (MS; Apple-Silicon Metal port, Apr 2026) | **native Metal, no NVIDIA** | ✅ **Best usable local quality** — ~400K-vert GLB from one photo in **~3.5 min (M4 Pro 24GB)**, Blender-ready |
| **Stable Fast 3D** (Stability) | MPS (Metal texture-baker) | ⚠️ UV-unwrapped, illumination-disentangled — **<32 GB not recommended**; tight |
| **InstantMesh** | CUDA-oriented | ❌ Unreliable on MPS → API |
| **Hunyuan3D-2/2.1** (Mac forks exist) | MPS | shape ~11.5 GB ✅ / shape+texture ~24.5 GB ❌ → **expect untextured mesh**; texture via API/Blender |

### 3D API fallbacks
- **fal.ai → Tripo3D v2.5 image-to-3D:** $0.20 (no texture) / $0.30 / $0.40 (HD). Cheapest.
- **Tripo3D** own API (~$0.13/gen, ~1/6 of Meshy) · **Meshy** (free 300 cr/mo, strong PBR; commercial needs paid plan).
- **Blender-MCP path (cleanest for DS):** you already have `generate_hunyuan3d_model` / `generate_hyper3d_model_via_text/images` in the Blender MCP — these call hosted gen and import straight into Blender. See [`blender.skill.md`](blender.skill.md).

## Bottom line
- **Video:** local = **Wan 2.2 5B Turbo** (ComfyUI GGUF or Draw Things) for free short-clip iteration (~5–15 min/clip); **fal.ai (Veo/Kling) for deadline/quality.**
- **3D:** local TripoSR/TRELLIS.2 for blockouts + offline iteration; fal/Tripo/Meshy or Blender-MCP for textured client-ready assets. All local output → Blender cleanup → web.
- Speed figures are community/vendor benchmarks (mostly M4-class; M5 from Draw Things notes) — treat as order-of-magnitude.

## Files this skill governs
Cross-refs: [`local-image-gen.skill.md`](local-image-gen.skill.md), [`blender.skill.md`](blender.skill.md), [`3d-web.skill.md`](3d-web.skill.md), [`remotion.skill.md`](remotion.skill.md), `premium-motion-pipeline` skill, fal.ai MCP.
