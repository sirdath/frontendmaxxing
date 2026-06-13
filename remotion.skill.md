# Remotion Skill — programmatic video in React (+ FFmpeg)

> Verified June 2026 (Remotion 4.0.x, FFmpeg 8.1.x). Read this whenever the user wants to **render video from code** — marketing/hero clips, social cards, captioned reels, data-driven/batch-personalized video. Pairs with the DS `premium-motion-pipeline` skill (Flux→Veo cinematic heroes) and the deep `.claude/skills/remotion/` skill already in the repo. **FFmpeg is not installed on this Mac → `brew install ffmpeg` once.**

## TL;DR — which tool

| The user wants… | Reach for |
|---|---|
| Templated/branded/data-driven video where layout = React + CSS | **Remotion** (component model, frame-deterministic, parametrized renders) |
| Mechanical ops on an existing file: transcode, trim, concat, crop, GIF, extract frames, mux audio | **Raw FFmpeg** (one command, no React runtime) |
| Cinematic "3D-feeling" non-interactive hero from 2 AI keyframes | **`premium-motion-pipeline`** (Flux→Veo 3.1→WebP scroll-scrub) |

Rule: **author motion in Remotion; post-process pixels in FFmpeg.** Remotion bundles ffmpeg internally for the final encode — drop to raw ffmpeg only for container/codec swaps, GIF palettes, frame extraction, concatenation, re-muxing, or non-Remotion assets.

## Licensing — DS is on the FREE tier
Remotion is **free** for individuals, non-profits, and for-profit orgs with **up to 3 employees**. A paid Company License is required only at **4+ employees** (min ~$100/mo incl. 4 seats, per remotion.pro). **DS is two founders (≤3) → free tier, no Company License needed.** Revisit only if DS grows to 4+ employees. (If you ever bring contractors onto a Remotion project, check remotion.pro/faq on seats — but headcount, not contractors, is the threshold.)

## Remotion — install & core API
```bash
npx create-video@latest                       # scaffold (interactive)
npx remotion studio                           # live preview :3000
npx remotion render <comp-id> out.mp4         # render
npx remotion render <id> out.mp4 --props=./data.json   # data-driven
npx remotion upgrade                          # bump all @remotion/* in lockstep
```
- A video is a React tree; time is a number. **Animate only from `useCurrentFrame()`** — never `setTimeout`/`Date.now()`/CSS keyframes, or renders won't reproduce.
- `interpolate(frame,[in],[out],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})` · `spring({frame,fps,config})` · `<Sequence from durationInFrames>` (local frame resets to 0) · `useVideoConfig()`.
- **Parametrize** via `defaultProps` + a **Zod schema** (`@remotion/zod-types`) → Studio auto-renders a form; `calculateMetadata()` sets duration/size from props/asset (e.g. fit to audio).
- **Pin all `@remotion/*` to the same exact version** (no `^`).

## `@remotion/*` packages worth knowing
`@remotion/media` (current recommended `<Video>`/`<Audio>` — Mediabunny, frame-exact) · `@remotion/lambda` (distributed cloud render — the scalable path; Cloud Run is alpha, avoid) · `@remotion/player` (embed interactive `<Player>` in a normal app) · `@remotion/transitions` · `@remotion/three` (R3F inside a comp) · `@remotion/lottie` · `@remotion/captions` + `@remotion/install-whisper-cpp` (local transcription → captions — ties to [`local-audio.skill.md`](local-audio.skill.md)).

## FFmpeg — `brew install ffmpeg` (8.1.x, videotoolbox-enabled) — recipe cheat-sheet
```bash
# H.264 MP4 (universal; CRF 18≈lossless, 23 default; +faststart for web)
ffmpeg -i in.mov -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4
# H.265 (smaller; MUST tag hvc1 or Safari/QuickTime show black)
ffmpeg -i in.mov -c:v libx265 -crf 24 -preset slow -tag:v hvc1 -pix_fmt yuv420p out.mp4
# WebM VP9 / AV1 (AV1 = best ratio, slow CPU — hero assets only)
ffmpeg -i in.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -row-mt 1 out.webm
# High-quality GIF (ALWAYS two-pass palette — single-pass bands)
ffmpeg -i in.mp4 -vf "fps=15,scale=640:-1:flags=lanczos,palettegen=stats_mode=diff" pal.png
ffmpeg -i in.mp4 -i pal.png -lavfi "fps=15,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" out.gif
# Frames → WebP/AVIF sequence (scroll-scrub assets for premium-motion-pipeline)
ffmpeg -i in.mp4 -vf fps=30 -c:v libwebp -q:v 80 frames/%04d.webp
# Concat (same codec, instant) / Trim (fast, keyframe-snapped) / Scale / Crop / Overlay / Add audio
ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4
ffmpeg -ss 00:00:05 -to 00:00:12 -i in.mp4 -c copy cut.mp4      # -ss before -i = fast; after = frame-exact
ffmpeg -i in.mp4 -vf "scale=1280:-2" out.mp4                     # -2 keeps even dims
ffmpeg -i v.mp4 -i logo.png -filter_complex "overlay=W-w-24:24" out.mp4
ffmpeg -i v.mp4 -i music.m4a -c:v copy -c:a aac -b:a 192k -shortest out.mp4
# Hardware encode (Apple Silicon — fast iteration/batch; slightly worse quality/byte than libx264)
ffmpeg -i in.mov -c:v hevc_videotoolbox -q:v 65 -tag:v hvc1 out.mp4
```

## Mac (M5) notes
- `videotoolbox` HW encoders = fast/low-power → use for previews/batch; use CPU `libx264/libx265 -crf` for **delivery masters** (better quality-per-byte). AV1 CPU encodes are slow even on M5 — hero assets only.
- Always `-tag:v hvc1` on HEVC; keep `-pix_fmt yuv420p` for compatibility.

## Files this skill governs
- The repo's deep `.claude/skills/remotion/` (SKILL.md + ~35 rules incl. `ffmpeg.md`, `lottie.md`, `transitions.md`, `subtitles.md`) covers the in-composition API; this adds the version/licensing/ffmpeg-CLI/Mac layer. Cross-refs: [`local-audio.skill.md`](local-audio.skill.md) (narration/captions), [`lottie-rive.skill.md`](lottie-rive.skill.md) (`@remotion/lottie`), `premium-motion-pipeline` skill.
