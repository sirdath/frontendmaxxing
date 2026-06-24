# web-excellence.skill.md — what makes a website *incredible*, not generic

Distilled from an 11-dimension research sweep of award authorities (Awwwards, FWA,
CSS Design Awards, Codrops, Godly, Smashing, refactoringui, OKLCH). This is the
taste-knowledge layer Design Book composes against. Read alongside
[[taste]], [[structure]], [[authenticity-law]], [[art-direction]].

## The thesis

"Incredible" is **bespoke specificity + one signature moment + craft in the
hundred small things** — and the disciplined *absence* of the generic defaults.
A site reads premium when (a) its imagery, copy, and palette could belong to no
other brand; (b) it has exactly ONE unforgettable interaction, not twenty; (c)
the type, spacing, color, and motion are all tuned to real values, not framework
defaults; and (d) it commits hard to a single aesthetic archetype. Generic is the
average of all templates; incredible is a specific, opinionated choice executed
with restraint.

## KILL these — the AI-slop / template tells (the gate's job)

The single most recognizable "AI-generated / template" signature, ban each:
- **The default trio:** Inter (or raw Roboto) for *everything* + a
  `from-purple-600 to-blue-500` (indigo-500 lineage) hero gradient + three rounded
  icon-cards in a row. This exact combo is the canonical tell — kill all three.
- **Raw mesh/gradient with no grain** — a smooth `linear-gradient(135deg,#a855f7,#ec4899)`
  with no noise overlay. Smoothness *is* the AI signature.
- **Uniform everything:** one border-radius (16px), one shadow (`shadow-lg`), one
  padding (24px) on every card; equal gaps between every section.
- **Centered-stack skeleton:** centered hero → 3 feature cards → social proof →
  pricing → FAQ → footer, all full-width and centered.
- **Stock & blobs:** diverse-team-in-bright-office photos, floating abstract 3D
  blobs, "slightly too smooth, too symmetric, plastic" AI illustration, Corporate
  Memphis (blue people / noodle limbs — dead).
- **Empty-superlative copy:** "Seamless Integration", "Empower/Unlock/Transform",
  "best-in-class", "cutting-edge", Lorem ipsum in production.
- **Pure #000/#fff** surfaces/text (halation, "inverted default"); HSL ramps with
  uneven perceived steps.

## Cross-cutting craft (concrete values)

### Color — author in OKLCH
- Define every token `oklch(L C H)`. Build a 9-step ramp by holding C+H and
  stepping L evenly (0.97→0.10) — perceptually uniform, no manual nudging.
- **Pin perceived lightness to a shared curve** (Stripe's law): every hue at level
  N has identical contrast. Lower yellow/green L to match blue/purple at equal level.
- **One hero hue, 60-30-10:** one saturated accent on ~10% of pixels (CTA/links/
  focus); 30% surface; 60% neutral. Build 8-10 greys (never pure #000/#fff), each
  with a faint shared temperature.
- **Saturate the extremes:** push chroma UP at the lightest and darkest ends or
  they go chalky-grey; hue-rotate toward R/G/B to darken, don't just drop L.
- **Gradients:** always `linear-gradient(in oklch, …)` (curves around the bright
  side, not through grey), endpoint hues within ~30-60°, + the mandatory grain.
- **Dark theme = re-token, not invert:** base on warm charcoal (`#121212`/oklch
  ~0.16), express elevation by ADDING lightness (5%→16% by depth), desaturate the
  accent.

### Typography — two-face system
- **Exactly two roles:** one DISPLAY face (>32px, personality) + one TEXT face
  (legible body). Max 3 with a mono. Never one sans for both (the CMS tell).
- **Modular scale** from base 16-18px × one ratio: 1.2-1.25 for dense UI, 1.333-1.5
  for editorial/marketing. Emit as `--step-(-2..6)`.
- **Fluid `clamp(MIN_rem, REM + VW, MAX_rem)`** — always include a rem term (pure
  vw breaks zoom / WCAG 1.4.4).
- **Measure 60-75ch** (target 66ch), line-height scaled to measure (~1.5 at 66ch).
- **Negative tracking on display only:** -0.02 to -0.04em above ~48px (em, not px);
  +0.05-0.12em on all-caps eyebrows. Never negative on body.
- **Variable fonts:** animate `font-variation-settings` (wght/wdth/opsz) on hover/
  scroll. Use `opsz` so display and text are different optical cuts.
- **OpenType on:** `font-kerning:normal; font-variant-ligatures:common-ligatures;`
  oldstyle/tabular nums where appropriate.
- Signal premium with a distinctive face (Geist, General Sans, Satoshi, Fraunces,
  Clash Display, or a paid foundry) — not raw Inter/Helvetica.

### Layout — designed rhythm
- **Non-linear spacing scale** (no two steps closer than ~25%): 4/8/12/16/24/32/48/
  64/96/128. Every margin/padding/gap pulls from it. Uniform spacing = no hierarchy.
- **Content-column grid with full-bleed breakout** via named lines
  (`[full-start] minmax(1rem,1fr) [content-start] minmax(0,72ch) [content-end] …`)
  so text stays at measure but media breaks full-width.
- **Intentional asymmetry** on a 12-col grid (headline 1/6, media 7/13), not 50/50
  centered. Alternate the axis between sections.
- **Bento** only with a focal cell (one `span 2/span 2` hero tile among varied
  sizes), never equal tiles.
- **Generous, asymmetric whitespace** as the luxury signal (section padding at the
  TOP of the scale, intra-group tight).
- **Break the grid deliberately** for 1-2 hero moments (overlap on a shared cell +
  z-index), on top of a real grid — not chaos.

### Motion — signature curves, tiered
- **One signature ease**, never the browser `ease`: entrances `expo.out` =
  `cubic-bezier(0.16,1,0.3,1)`; UI `cubic-bezier(0.4,0,0.2,1)`. Reserve bounce/
  elastic for playful brands only. Ship as tokens.
- **Duration tiers:** hover/micro 120-200ms, menu/dropdown 200-300ms, modal 300-500ms,
  hero/entrance 400-600ms. UI never >400ms; hero never <400ms.
- **Stagger by unit:** lines 0.08s, words 0.06s, chars 0.008-0.05s. Masked line
  reveals (overflow:hidden wrapper, yPercent:100→0).
- **Scrub:** `scrub:true` for 1:1 parallax/progress; `scrub:1` for smoothed.
- **Parallax subtle:** 0.2-0.5× speed deltas across a 3-layer depth model,
  transform-only.
- **Smooth scroll** Lenis `lerp ~0.1` synced to the rAF that drives ScrollTrigger.
- **View Transitions** API for crossfade/shared-element (`document.startViewTransition`
  + `view-transition-name`), not a heavy JS lib.
- **Compositor-only:** animate transform/opacity, never top/left/width/height/margin.
- **Reduce, don't remove:** author motion inside `@media (prefers-reduced-motion:
  no-preference)`; provide a ≤150ms fade variant under `reduce`. Never `*{animation:none}`.

### Micro-interactions — the 100ms touches
- **Magnetic targets:** rAF lerp(0.1) toward cursor, pull = (mouse-center)*0.3,
  engage inside radius `width*0.7`, inner text inverse-parallax *0.6.
- **Custom cursor:** fixed dot, `mix-blend-mode:difference`, lerp 0.2 trail, scale
  4× + opacity 0.2 over links. (Coarse-pointer fallback: native cursor.)
- **Press:** `:active{transform:scale(0.97)}` reverting ~120ms; entrances from
  scale(0.95)+opacity 0, never scale(0).
- **Underlines:** `::after` bar `scaleX(0)→1` with directional `transform-origin`,
  not `text-decoration`/`border-bottom`.
- **Honest loading:** 150-300ms show-delay + 300-500ms min-visible; layout-mirroring
  **skeletons** (not spinners) shaped like the real content.
- **Sub-100ms feedback** (Doherty): fire `:active`/optimistic update within 100ms
  even if the network is slow.
- **Hygiene:** ≥44px touch targets, `:focus-visible` ring (not `:focus`), 16px
  inputs (`touch-action:manipulation`), styled `::selection` + scrollbar from palette.

### Imagery / art-direction
- **Grain over EVERYTHING** — the fastest "expensive" tell. Tileable SVG
  `<feTurbulence type='fractalNoise' baseFrequency='0.65-0.9' numOctaves='3'
  stitchTiles='stitch'/>` at opacity **0.03-0.08** (never >0.12) with
  `mix-blend-mode:overlay|soft-light` on an `::after`. ~1KB, resolution-independent.
- **Duotone** mismatched photos to 2 brand colors (SVG `feComponentTransfer`
  tableValues, or darken/lighten blend pair) so stock reads art-directed.
- **One image-treatment system:** uniform grade + grain + radius + one hover
  (`grayscale(1)→0`, .8s) applied to 100% of imagery via CSS vars.
- **Image-as-hero:** full-bleed, gradient scrim (0→0.55 from text edge, NOT a flat
  black box), oversized type anchored to a frame edge.
- **Aurora/mesh bg** = 3-5 OKLCH radial blobs `blur(80-140px)` + slow drift + grain.
- **Real imagery beats blobs:** product screenshots, real photography, commissioned
  illustration with intentional asymmetry. Specificity is unforgeable by averaging.

### 3D / WebGL (when it earns its weight)
- **DOM-synced planes:** keep real `<img>` in DOM (SEO/a11y), mirror into a
  three.js plane via `getBoundingClientRect` — not a `<canvas>` painting over empty DOM.
- **`<model-viewer>`** for products (camera-controls/auto-rotate/ar), glTF + **Draco
  + KTX2**, auto-USDZ for iOS.
- **Scroll-cinematic camera:** GSAP timeline `scrub`, segmented camera "shots" with
  custom eases — not one linear tween.
- **GPGPU particles** (FBO position textures) for millions of points on the GPU.
- **Gaussian splats** (Spark, MIT) for photoreal, streamed with LOD.
- **Hard gate:** cap DPR (desktop ≤1.0, mobile ≤1.5), reduced-motion fallback, no
  flat-purple-blob-on-default-MeshStandardMaterial.

### First impression & perceived performance
- **Earn the preloader:** bind to real asset progress (monotonic 0→100), cap ~1.2-1.8s,
  exit when ready — never a `setTimeout` fake wait.
- **Masked hero line reveals** (yPercent:100→0, stagger 0.08-0.12s), not a whole-block
  opacity fade.
- **Kill font-CLS:** self-host WOFF2 subset, `<link rel=preload as=font>` the exact
  hero weight, metric-matched fallback (`size-adjust`/`ascent-override`), `font-display:swap`.
- **Section reveals** via pooled IntersectionObserver (threshold 0.2,
  `rootMargin '0px 0px -10% 0px'`, unobserve-on-fire) — not scroll handlers.
- **Masked page transitions** (clip-path inset dual-container), not a white flash.
- **Perceived-speed (critic adds):** prefetch-on-hover/viewport (`<link rel=prefetch>`),
  **LQIP/ThumbHash** progressive image decode, `content-visibility:auto` +
  `contain-intrinsic-size` for long pages, `fetchpriority=high` on the LCP image.
- **Core Web Vitals are the scorecard:** LCP <1.5s, CLS <0.05, **INP <100ms**,
  weight <3MB, sustained 60fps — on a mid-range phone, not just a MacBook.

### Accessibility-as-craft & modern CSS (critic additions)
- A11y as a differentiator, not just a gate: **designed** `:focus-visible` rings,
  `forced-colors`/Windows-High-Contrast support, `prefers-reduced-transparency` for
  glass, real landmark/heading structure + skip-links, accessible names on icon
  buttons, `prefers-reduced-data`.
- Modern primitives the vault should lean on: **container queries**, `dvh/svh/lvh`,
  **CSS scroll-driven animations** (`animation-timeline: scroll()/view()` — JS-free
  ScrollTrigger), `:has()`, **subgrid**, safe-area insets, coarse-pointer fallbacks.

## Archetype catalog (commit to ONE)

| Archetype | Recipe signature | When |
|---|---|---|
| **Editorial / Swiss** | 12-col + baseline rhythm; one high-contrast serif (GT Sectra/Canela/PP Editorial) or grotesque + one workhorse; scale 1.25-1.333; restrained motion | safe-premium default; agencies, editorial, B2B with taste |
| **Neo-brutalism** | 0 radius; solid 3px black borders; HARD shadow `5px 5px 0 0 #000` (no blur); flat candy fills (#FFD23F/#FF6B6B/#74B9FF) on off-white #FFFDF5; mono-ish display | differentiation, dev tools, bold youth brands |
| **AI-iridescent** | OKLCH mesh (3-5 stops within ~90°) + **mandatory grain** + glassy chrome | modern SaaS, AI products — *only with grain or it IS the slop* |
| **Dark-luxury** | warm charcoal #1C1917 (not #000); one metallic accent (gold #D4A574 / jewel tone); +20-30% whitespace; off-white text | premium, fashion, fintech, spirits |
| **Glassmorphism 2.0** | `rgba(255,255,255,.12)` + `backdrop-filter:blur(12-20px) saturate(160-180%)` + 1px rim + inset highlight + outer shadow — chrome **over imagery only** | overlays/nav/cards over a rich bg; never long body copy |
| **Cinematic scroll** | Lenis + GSAP ScrollTrigger off one rAF; pinned sections, scrubbed horizontal, split-text reveals, parallax depth | portfolio, brand, launch, storytelling |
| **Bento** | varied-span grid (2×2 hero + 1×1/1×2), gap 12-24px, one radius/elevation, one idea per tile | feature overviews, dashboards, "everything app" |
| **Maximalist / dopamine** | 3-5 clashing OKLCH hues with a grid anchor, collage/mixed-media, expressive variable display 48px+ | personality-forward, creative, Gen-Z, music/culture |

Cross-cutting **authenticity layer** on any archetype: site-wide 5-10% grain, real
photography/custom 3D, hand-drawn SVG accents, custom cursor, intentional
imperfection (off-grid breaks, variable kerning).

## Do / Avoid gate checklist

**DO:** OKLCH tokens with luminance-locked levels · one hero hue, 60-30-10 · two-face
type on a modular scale · 60-75ch measure · grain on every flat/gradient surface ·
non-linear spacing scale · intentional asymmetry · one signature ease + tiered
durations · reduce-don't-remove motion · skeletons over spinners · one signature
moment · real copy + owned imagery · commit to one archetype · DPR-capped 3D · CWV
budget (LCP<1.5 / CLS<.05 / INP<100).

**AVOID (fail-worthy):** the default trio (Inter+purple-gradient+3-cards) · grain-less
mesh · uniform radius/shadow/padding · centered-stack skeleton · pure #000/#fff ·
stock photos + 3D blobs + AI illustration · empty-superlative copy / lorem · `ease`
+ `transition:all` · animating layout props · vw-only font sizes · effects buffet ·
3D with no reduced-motion/DPR cap.

## Design Book feature roadmap (build from this)

Prioritized net-new features, each mapped to existing infra:

1. **`book_coherence` "genericness" / anti-slop gate** (extends the coherence scorer
   + authenticity-law) — fail/penalize the default trio, grain-less mesh, uniform
   radius+shadow+padding, centered-stack, pure-#000/#fff, lorem/superlative copy.
2. **Archetype presets** — ship each of the 8 archetypes as a named compose preset
   (extends `taste/presets.js`): palette + type pairing + radius/shadow + motion +
   spacing, internally coherent. *The single biggest compose-quality lever.*
3. **OKLCH palette engine** (extends the 61-palette library + palette-generator) —
   store native L/C/H per token, generate luminance-locked ramps that saturate the
   extremes, auto-derive dark-mode re-tokens, emit `in oklch` gradients.
4. **Grain / image-treatment snippets** — `grain-overlay` (feTurbulence recipe),
   `duotone-image`, `aurora-grain-bg`, `progressive-blur`; + a coherence check that
   all imagery shares one treatment.
5. **Motion-token preset + polish-lint gate** (extends the reduced-motion/duration
   gates already shipped) — blessed ease/duration vocabulary; fail `transition:all`,
   `ease`/linear on UI, >400ms hover, layout-prop animation, flat-wave stagger.
6. **Type-discipline gate + premium-pairing presets** — enforce two-face system,
   modular ratio ∈ [1.2,1.333], 60-75ch measure, no vw-only sizing; ship curated
   license-clear display+text pairs.
7. **Signature-moment slot** — a composition primitive that allocates exactly ONE
   "wow" beat (WebGL hero / split-text / scroll-cinematic) and forbids the buffet.
8. **Performance/CWV + LCP-preload gate** — block pages missing LCP preload /
   `fetchpriority`, font-CLS guards, or exceeding the weight budget; flag fake
   `setTimeout` loaders.
9. **First-impression preset** (`hero-arrival`) — earned preloader + masked line
   reveal + section-reveal IntersectionObserver + masked page transition, all
   reduced-motion-wrapped.
10. **Rubric-weighted composition** — bias compose budget Design 40 / Usability 30 /
    Creativity 20 / Content 10 (the Awwwards scorecard).

(Gaps to revisit per the critic: container-query + scroll-driven-CSS layer,
ThumbHash/LQIP runtime imagery, a11y-as-craft gate dimensions, DTCG token export.)
