# Local AI Utilities Skill — bg-removal, upscale, depth, segment, OCR

> Verified June 2026 for **Mac M5 / 24 GB / MPS**. The production toolkit *around* generation — cleanup, restoration, analysis. Most are sub-1B params → fast on M5. Pairs with [`local-image-gen.skill.md`](local-image-gen.skill.md), [`comfyui-models.md`](comfyui-models.md), [`images.skill.md`](images.skill.md).

## TL;DR — easiest path per job
- **Upscale** → **Upscayl** (`brew install --cask upscayl`) — drag-drop GUI, Apple-GPU via MoltenVK→Metal.
- **Background removal** → **rembg** (`pip install "rembg[cpu]"` → `rembg i in.png out.png`).
- **Chain several ops** → **chaiNNer** (`brew install --cask chainner`) — node-based, no code.
- **OCR** → **Apple Vision** (built into macOS, free, Neural-Engine fast — via `pip install ocrmac`).
- **Depth/pose/segment for ControlNet** → do it as a **ComfyUI node** (`comfyui_controlnet_aux` bundles DWPose + Depth Anything).

**Rule:** standalone tool for a one-off utility op; ComfyUI node when the op feeds a generation pipeline (SUPIR, IC-Light, SAM→inpaint, depth/pose→ControlNet).

## By job (best model + Mac verdict)
| Job | Best | Repo / how | License | M5 verdict |
|---|---|---|---|---|
| **BG removal** | **BiRefNet** (via rembg) | `pip install "rembg[cpu]"`; `ZhengPeng7/BiRefNet` | **MIT ✅** | Fast |
| | RMBG-2.0 | `briaai/RMBG-2.0` | ⚠️ non-commercial | Fast |
| **Upscale** | **Upscayl** (RealESRGAN/UltraSharp) | `brew install --cask upscayl` | app AGPL; RealESRGAN **BSD ✅** | Fast |
| | SUPIR (generative restore) | `kijai/ComfyUI-SUPIR` | code MIT, weights non-comm | Slow — hero only |
| **Face restore** | **GFPGAN** (commercial) | `TencentARC/GFPGAN` | **Apache ✅** | Fast |
| | CodeFormer (better quality) | `sczhou/CodeFormer` | ⚠️ non-commercial | Fast |
| **Depth** | **Depth Anything V2-Small** | `depth-anything/Depth-Anything-V2-Small` | **Apache ✅** (Base/Large = NC) | Fast |
| **Segment** | **SAM 2** (click/box) | `facebookresearch/sam2` | **Apache ✅** | Fast (tiny/base) |
| | MobileSAM (speed) / SAM 3 (text-prompt masks) | `ChaoningZhang/MobileSAM` / `facebookresearch/sam3` | Apache / "SAM License" | MobileSAM very fast; SAM3 heavier, CUDA-first |
| **Pose** | **DWPose** | via `comfyui_controlnet_aux` or `easy_dwpose` | **Apache ✅** | Fast (onnx/CoreML). Avoid OpenPose (NC, fussy) |
| **Relight** | **IC-Light v1** | `kijai/ComfyUI-IC-Light` | code Apache, **v1 weights commercial ✅** | Usable (~10–30 s); v2/FLUX = NC, slow |
| **OCR** | **Apple Vision** | `pip install ocrmac` (or Swift) | free w/ macOS | **Fastest, zero-install** |
| | docTR (structured) / GOT-OCR2 (→ markdown/LaTeX) | `mindee/doctr` / `Ucas-HaoranWei/GOT-OCR2.0` | Apache ✅ / weights NC | docTR fast; GOT heavier |

## chaiNNer — the pipeline app
`brew install --cask chainner` (GPL-3.0, PyTorch **MPS on Apple Silicon**). Node graph to chain upscale → face-restore → re-tile etc. without code. Best when you want a *repeatable* multi-step image pipeline.

## License landmines (client deliverables)
- ⚠️ **Non-commercial — don't ship to clients:** RMBG-2.0, CodeFormer, OpenPose, Depth Anything V2 **Base/Large** + DA3, GOT-OCR2 weights, IC-Light **v2**, SUPIR weights, 4x-UltraSharp.
- ✅ **Commercial-safe:** BiRefNet, rembg wrapper, RealESRGAN, GFPGAN, Depth Anything V2 **Small**, SAM 2/MobileSAM, DWPose, docTR, IC-Light **v1**. Apple Vision = free with OS. Upscayl/chaiNNer are GPL/AGPL *apps* (using them is fine; you're not redistributing their code).

## Files this skill governs
Cross-refs: [`comfyui-models.md`](comfyui-models.md) (the ComfyUI-node versions: ControlNet aux, SUPIR, IC-Light, RMBG), [`local-image-gen.skill.md`](local-image-gen.skill.md), [`images.skill.md`](images.skill.md), [`blender.skill.md`](blender.skill.md) (depth/3D).
