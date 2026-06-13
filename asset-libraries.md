# Asset Libraries — free / CC0 sources for a local library

> Verified June 2026. Build a local, license-clean asset library for client work. **License key:** **CC0** = public domain, no attribution (safest for commercial) · **MIT/ISC** = free commercial, keep license file · **CC-BY** = free commercial *but must credit* · **OFL** = free embed/sell-in-product, can't sell the font file alone · **API-terms** = attribution can be triggered by API use. Pairs with [`images.skill.md`](images.skill.md), [`blender.skill.md`](blender.skill.md), [`svg.skill.md`](svg.skill.md), [`local-audio.skill.md`](local-audio.skill.md).

## Bottom line — the zero-friction core (CC0/MIT, no attribution)
Poly Haven · ambientCG · Quaternius · Kenney · Open Peeps · Humaaans · unDraw · Lucide/Phosphor/Tabler · Pixabay (photo + audio) · Google Fonts/Fontshare/Fontsource. Build the library around these.

## By type
### Fonts
- **Google Fonts** (`github.com/google/fonts`) — mostly **OFL**, some Apache. `git clone` the whole repo (~1,900 families, 546 variable). ✅
- **Fontsource** (fontsource.org) — same fonts as **npm per family** (`@fontsource-variable/inter`) — best for self-hosting variable fonts in Next.js. ✅
- **Fontshare** (fontshare.com) — **ITF Free Font License**, free commercial incl. client work. Premium-quality-but-free; best non-Google option (closed files, can't redistribute). ✅
- **Velvetyne / Collletttivo / League of Movable Type** — OFL, distinctive/editorial display faces. ✅

### HDRIs / textures / PBR materials
- **Poly Haven** (polyhaven.com) — **CC0**, no signup. Public API + **`polydown`** CLI (`github.com/agmmnn/polydown`) for batch download. ✅✅
- **ambientCG** (ambientcg.com) — **CC0**, 2,000+ PBR materials/HDRIs, download API/CSV. ✅✅
- **cgbookcase** — **CC0** textures. ✅
- ⚠️ **Poliigon free tier** — proprietary terms (free commercial but NOT CC0, no redistribution). Prefer the CC0 sources.

### 3D models
- **Quaternius** (quaternius.com) — **CC0** low-poly packs. ✅
- **Kenney** (kenney.nl) — **CC0**, 40k+ game/3D/UI/audio assets. ✅✅
- **Poly Pizza** (poly.pizza) — **mixed CC0 + CC-BY**; API v1.1; filter `search/CC0`. ⚠️ credit CC-BY ones.
- **Sketchfab** — mixed; **filter by license** → CC0 (no credit) / CC-BY (credit). **Editorial license = NOT commercial.** Auto-converts to glTF.
- **Khronos glTF-Sample-Assets** — per-model licenses; pipeline testing, not hero assets.

### Icons
- **Lucide** (ISC ✅) · **Phosphor** (MIT ✅, 9k) · **Tabler** (MIT ✅, 5.9k) — no attribution, npm + CDN. **Default to these.**
- **Iconify** (200k+, aggregator) — **license varies per set**; pin the sets you use + record licenses.
- ⚠️ **Hugeicons** — free tier free-commercial; full set paid.

### Illustrations
- **Open Peeps** (CC0 ✅) · **Humaaans** (CC0 ✅) · **unDraw** (MIT-like ✅, recolorable SVG). Safe.
- ⚠️ **Blush / DrawKit** — mixed free/premium; per-collection license check.
- ⚠️ **icons8 / Ouch!** (icons8.com) — huge icon + illustration + animated sets; free tier **requires a link-back attribution**; paid removes it. Record the license per asset.

### Motion assets — animated icons / illustrations / gradients / 3D embeds
*(the "make it feel alive" layer; pair with [`lottie-rive.skill.md`](lottie-rive.skill.md) for HOW to play them)*
- **Animated icons:** **Lordicon** (lordicon.com) — Lottie-based, free set needs attribution, paid doesn't; **icons8 animated** (⚠️ link-back on free); or animate **Lucide/Tabler** strokes yourself with `svg/` + `animations/` snippets (zero license burden — prefer this for brand work).
- **Animated illustrations:** **Storyset** (storyset.com, Freepik) — customizable + animatable scenes, ⚠️ attribution on free; **LottieFiles marketplace** (lottiefiles.com) — per-asset licenses, many free; export `.lottie` and play via the skill.
- **Animated/shader gradients:** the vault's own `shaders/` (WebGL, zero-dep) + `effects/`/`gradients` packs cover this natively ✅; **shadergradient.co** (MIT runtime, R3F/Framer/Spline plugin) when a designer wants the tweakable-tool version — `npm i shadergradient`.
- **3D embeds:** **Spline** (spline.design) — designer-built interactive 3D, `@splinetool/react-spline` or vanilla `@splinetool/runtime`; free tier shows a badge + public scenes. For code-first 3D stay with `3d/` + `3d-web.skill.md`. Decision tree: [`3d-motion.skill.md`](3d-motion.skill.md).
- **Rive** (rive.app) — interactive state-machine animations; free tier fine for web embeds. Full guidance in [`lottie-rive.skill.md`](lottie-rive.skill.md).

### Stock photo / video
- **Pixabay** (pixabay.com) — **no attribution even via API**, 5.6M+ assets, generous API. **Easiest for automated bulk.** ✅
- **Unsplash** — free commercial, but **API use mandates attribution** (store photographer + link). ⚠️
- **Pexels** — free commercial; API requests a courtesy link.
- *None allow: selling the photo standalone, identifiable people/trademarks without releases, implying endorsement.*

### Sound / SFX / music
- **Pixabay Audio** — **royalty-free, no attribution, commercial OK**, 120k+ SFX + music. Same API. **Safest + easiest for video work.** ✅
- **Freesound** — **mixed CC per sound** (CC0/CC-BY/CC-BY-NC). REST API — **filter to CC0**; exclude NC. ⚠️
- ⚠️ **BBC Sound Effects** (RemArc license) = **NON-COMMERCIAL only** — keep out of client deliverables.

### LUTs / color
- Free `.cube` packs: Color Grading Central (100 free), Lutify.me, Uppbeat. ⚠️ **Not CC0** — "free to use" per vendor terms (commercial usually OK, no reselling the LUTs). Record source + terms.
- **Coolors** (coolors.co) — palettes (not copyrightable, free to use/export). ✅

## Bulk-download tooling to seed the library
`git clone google/fonts` · **`polydown`** (Poly Haven) · ambientCG CSV/API · Poly Pizza API (CC0 filter) · **Pixabay API** (photo + audio) · **Freesound REST API** (CC0 filter). **Store license + author metadata alongside every asset** so the DELIVERY-CHECKLIST can audit attribution at handoff.

## Watch-list for client deliverables
- **Exclude (non-commercial):** BBC SFX, Sketchfab Editorial models, Freesound -NC sounds.
- **Credit-tracked (keep a CREDITS file):** CC-BY models (Poly Pizza/Sketchfab), Unsplash via API, CC-BY Freesound, Pexels.
- **Per-asset check:** Iconify (per set), Blush/DrawKit (per collection), Free Music Archive, LUT packs.
