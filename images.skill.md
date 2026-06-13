# Images Skill — raster processing, optimization & OG/social cards

> Verified June 2026. Read this whenever the user wants to convert/resize/composite/optimize raster images, build responsive image sets, or generate dynamic OG/social cards. Pairs with [`print-typography.skill.md`](print-typography.skill.md) (PDF/fonts), [`svg.skill.md`](svg.skill.md), and the `media/` folder.

## TL;DR — which tool
- **In a Node/Next build or serverless fn** → **Sharp** (fastest, no system deps). Default for web image work.
- **Ad-hoc terminal, weird/legacy formats, montages, complex compositing** → **ImageMagick** (`magick`).
- **OG/social card from JSX+CSS** → **Satori → resvg-js** (or `@vercel/og` if already in Next.js).
- **Final byte-squeeze / responsive sets** → Sharp in a script (Squoosh CLI is dead).
- **"Did this image change?"** → **odiff** (visual regression).

## Sharp — `npm i sharp` (default)
N-API binding over libvips; 4–8× faster + far less memory than ImageMagick for common web ops. **On Apple Silicon it ships prebuilt arm64 with libvips bundled — no Homebrew, no build step.** Apache-2.0, v0.34.x.
```js
import sharp from "sharp";
await sharp("in.jpg").resize(1200, 630, { fit: "cover" }).avif({ quality: 50 }).toFile("out.avif");
for (const w of [400,800,1200,1600])                          // responsive set
  await sharp("hero.jpg").resize({ width: w }).webp({ quality: 80 }).toFile(`hero-${w}.webp`);
```
AVIF `quality: 45–55` (best ratio), WebP `78–82` (broad support); serve via `<picture>`/`srcset` + `sizes`.

## ImageMagick 7 — `brew install imagemagick` (not installed yet)
Swiss-army CLI for 200+ formats. v7 entrypoint is **`magick`** (`convert`/`mogrify` warn-deprecated). License: "ImageMagick" license (Apache-2.0 derivative).
```bash
magick in.png out.webp                                          # convert
magick in.jpg -resize 1200x630^ -gravity center -extent 1200x630 out.jpg   # cover-crop to exact box
magick base.png logo.png -gravity southeast -geometry +20+20 -composite out.png   # watermark
magick montage *.jpg -tile 4x -geometry +8+8 grid.jpg           # contact sheet
magick in.jpg -strip -quality 82 out.jpg                        # strip metadata + compress
magick mogrify -path out/ -resize 800x -format webp *.png       # batch
```
Use only for one-off CLI work / formats / effects Sharp doesn't cover.

## OG / social cards — Satori (+ resvg-js)
**Satori** (`npm i satori`, MPL-2.0): HTML/JSX + **flexbox-only** CSS → SVG, full text/font/layout. Pure stateless JSX (no hooks/`dangerouslySetInnerHTML`, no CSS Grid). Rasterize SVG→PNG with **`@resvg/resvg-js`** (`npm i @resvg/resvg-js`, MPL-2.0, prebuilt arm64).
```js
import satori from "satori"; import { Resvg } from "@resvg/resvg-js";
const svg = await satori({ type:"div", props:{ style:{ display:"flex", fontSize:64 }, children:"Hello" } },
  { width:1200, height:630, fonts:[{ name:"Inter", data:fontBuf, weight:600 }] });
const png = new Resvg(svg).render().asPng();
```
**In Next.js App Router → `@vercel/og`** (`ImageResponse`) is built in (no install) and bundles Satori + a rasterizer for Node/Edge OG routes.

## Optimization & diffing
- **Squoosh CLI is dead** (deprecated 2023) — use Sharp scripts, or **rimage** (`cargo install rimage`) for a Squoosh-style binary. squoosh.app still works for one-off manual.
- **odiff** (`npm i odiff-bin`): SIMD-fast native image diff (~6× pixelmatch) for visual regression of generated cards/exports. *(Written in Zig, not Rust.)*

## License flags
Sharp Apache-2.0 (bundled libvips LGPL); **Satori + resvg-js are MPL-2.0** (file-level copyleft — fine, just note for client deliverables); ImageMagick = Apache-derivative.

## Files this skill governs
`media/` folder · cross-refs: [`print-typography.skill.md`](print-typography.skill.md) (fonts for Satori, PDF), [`svg.skill.md`](svg.skill.md), [`local-image-gen.skill.md`](local-image-gen.skill.md) (generate then optimize here).
