# color-grade.skill.md — Cinematic color grading on the web

Pushing imagery toward a **filmic look** (teal-orange, bleach-bypass, film stocks). This is the
*image-grading* sibling of [`color.skill.md`](color.skill.md) (which owns *palette* selection) and
[`gradients.skill.md`](gradients.skill.md) (color blends). Grading = tone/contrast/temperature shift
that keeps natural color; **duotone** (`effects/duotone.*`) is a different thing (2-tone remap).

## Pick the tier in three lines

| Need | Use | Cost |
|---|---|---|
| A look on any `<img>`/`<video>`/section, instantly, no build | **`effects/color-grade.css`** `.grade-*` | Zero — CSS `filter()` only. **Start here.** |
| Programmatic brightness/contrast/sat/temp/curves, exportable | Canvas 2D pipeline (`media/color-pipeline.js`, backlog) | Per-pixel JS; needed when you must *read back* graded pixels. |
| A real `.cube` LUT / HaldCLUT, frame-accurate | WebGL LUT shader (`shaders/lut-grade.glsl.js`, backlog) over `shaders/runner.js` | A texture sample per pixel; **mind LUT licensing (below).** |
| Cinematic look on *video before delivery* | `ffmpeg -vf lut3d=look.cube` (offline) | One-time encode; never grade video at runtime. |

90% of web cases are Tier-1. Reach down a tier only when CSS `filter` can't express it (true 3D LUTs, curves, read-back).

## Tier-1 recipes (what `color-grade.css` ships)

Each look is just a stack of `filter` primitives — no color values, so they're token-clean and composable. `--grade-amt` scales the whole look (`.grade-soft` = 0.5, `.grade-strong` = 1.5).

- **teal-orange** — `saturate(1.18) contrast(1.12) hue-rotate(-6deg)` — the blockbuster split.
- **bleach-bypass** — `saturate(0.5) contrast(1.45) brightness(1.06)` — gritty, silver-retention.
- **noir** — `grayscale(1) contrast(1.3) brightness(0.95)`.
- **kodak-portra** — warm sepia-lean, soft contrast, lifted skin tones.
- **fuji-velvia** — punchy saturation, cool lean — landscapes.
- True **split-tone** (teal shadows / warm highlights) needs an overlay: `.grade-split::after` with `mix-blend-mode: soft-light` over a shadow→highlight gradient (override `--grade-shadow`/`--grade-highlight`).

## LUT licensing — READ BEFORE SHIPPING ONE

There is **no clean CC0 cinematic `.cube` LUT pack** to bundle. Verified:
- The shippable film-look **HaldCLUTs** (Pat David, NatronGitHub/clut) are **CC-BY-SA 4.0** — attribution **and** ShareAlike required; fine to use, but you must credit and keep the license.
- The RawTherapee "free" film sims are `.pp3` profiles, **not portable LUTs**.
- Popular "free LUT" packs (FilterGrade, IWLTBAP, RocketStock, …) **forbid redistribution** — never bundle them into the vault or a client repo.
- **Safest path for the WebGL tier:** hand-roll the sampler shader (no LYGIA/Prosperity includes) and **bake your own CC0 HaldCLUT** from CSS-filter or ffmpeg transforms. Then you owe nobody attribution.

## Performance & a11y

- `filter` is GPU-composited and cheap; still avoid animating it on huge hero images every frame — `color-grade.css` transitions it once (`--m-dur-slow`) and disables the transition under `prefers-reduced-motion`.
- Grading is **decorative** — never encode meaning in color alone (contrast/legibility must survive the grade; check text-over-image with `book_inspect mode:"diagnose"`).

## Files this skill governs
- `effects/color-grade.css` (ship) · `effects/duotone.*` (adjacent, 2-tone) · `media/color-pipeline.js` + `shaders/lut-grade.glsl.js` (backlog tiers) · `shaders/runner.js` (LUT host).
