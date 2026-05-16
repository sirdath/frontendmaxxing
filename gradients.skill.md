---
name: gradients
description: Comprehensive gradient toolkit for the frontendmaxxing library — 32 files spanning preset backgrounds, mesh compositions, animated patterns, holographic/iridescent surfaces, liquid metals, gradient text/borders/buttons/cards/progress/badges, sky scenes, blob shapes, glow halos, noise overlays, image masks, multi-color shadows, duotone image filters, SVG defs, color wheels, palette extraction from images, interactive mesh editors, and WebGL gradient shaders. Use when the user asks for anything involving color blends, surface treatments, atmospheric backgrounds, or recreations of brand gradients (Stripe, Vercel, Linear, Instagram, Spotify, etc.).
---

# Gradients — toolkit reference

This skill documents **32 gradient-related files** across `effects/`, `backgrounds/`, `blocks/`, `components/`, `typography/`, `svg/`, `utils/`, and `shaders/`. **Always check this file before writing custom gradient CSS from scratch** — chances are a preset or utility already covers it.

> Library root: `c:/Users/Dath/OneDrive/Desktop/AntiGravity Stuff/frontendmaxxing/`

## Files at a glance

### Core gradient toolkit (`effects/`)
| File | What it gives you |
| --- | --- |
| `effects/gradients.css` (legacy) | Basic linear/radial/conic utilities |
| `effects/gradients-pack.css` | **60+ preset gradients** (`.grad-*`) — Instagram, Stripe, Vercel, Linear, etc. |
| `effects/gradient-text.css` | Text-fill utilities (`.gtxt-*`) — Apple, Instagram, cosmic, stroke, shimmer |
| `effects/gradient-borders.css` | Border utilities (`.gbord-*`) — static, rotating, flowing, breathing, beam |
| `effects/gradient-mesh.css` | Stripe-style multi-radial mesh bgs (`.gmesh-*`) |
| `effects/gradient-animations.css` | Animation utilities (`.ganm-*`) — apply to any preset |
| `effects/gradient-holo.css` | Holo / iridescent / chrome surfaces (`.holo-*`) — Pokémon card style |
| `effects/gradient-blobs.css` | Morphing organic blobs (`.gblob-*`) |
| `effects/gradient-glow.css` | Colored auras / halos (`.gglow-*`) — pulse, spin, floor variants |
| `effects/gradient-noise.css` | Grain texture overlay (`.gnoise-*`) — Apple-quality polish |
| `effects/gradient-mask.css` | Image fade-out masks (`.gmask-*`) — vignette, iris, edges |
| `effects/gradient-shadows.css` | Multi-color drop shadows (`.gsh-*`) |
| `effects/iridescent-pack.css` | **15 iridescent variants** (`.iri-*`) — soap, CD, opal, pearl, foil, mirror |
| `effects/liquid-metal.css` | **13 metal surfaces** (`.metal-*`) — chrome, mercury, titanium, gold-liquid |
| `effects/gradient-divider.css` | Animated separators (`.gdiv-*`) |
| `effects/duotone.css/.js` | Image duotone filters — Spotify-style. `Duotone.apply()` for true SVG filter |

### Backgrounds (`backgrounds/`)
| File | What it gives you |
| --- | --- |
| `backgrounds/aurora-bg.css` | Multi-blob aurora bg (`.aurorabg-*`) — 11 variants, fixed/grain modifiers |
| `backgrounds/gradient-orbs.css/.js` | Vercel-style floating orbs (`.orbsbg-*`, `GradientOrbs` global) |
| `backgrounds/sky-gradients.css` | **30+ time-of-day/atmosphere presets** (`.sky-*`) — dawn through midnight, mars, jupiter, nebula |
| `backgrounds/mesh-bg-stripe.css/.js` | Stripe-homepage mesh (`.meshbg-*`, `MeshBg` global) — 12 brand mimics |

### Blocks (gradient-applied components)
| File | What it gives you |
| --- | --- |
| `blocks/gradient-buttons.css` | 20+ specialty buttons (`.gbtn-*`) — holo, conic, shimmer, 3d, brand mimics |
| `blocks/gradient-cards.css` | Card surfaces (`.gcard-*`) — solid/border/glass/glow/mesh/corner/spotlight |
| `blocks/gradient-progress.css/.js` | Progress bars + rings (`.gprog-*`, `.gpring`, `GradientProgress` global) |
| `blocks/gradient-badges.css` | Pills/status (`.gbdg-*`) — holo, pulse-dot, count, brand |

### Components / Typography / SVG
| File | What it gives you |
| --- | --- |
| `components/color-wheel.css/.js` | HSL conic-ring picker (`.cwheel-*`, `ColorWheel` global) |
| `typography/gradient-numbers.css` | Hero stat numerals (`.gnum-*`) — mega sizes, 14 colors |
| `svg/gradient-defs.js` | Reusable SVG `<defs>` (`SvgDefs` global) — 16 palettes pre-mounted |

### Utilities & Shaders
| File | What it gives you |
| --- | --- |
| `utils/gradient-builder.js` | `GradientBuilder` global — palettes, random mesh, spin, slide, track-holo |
| `utils/gradient-extract.js` | `GradientExtract` global — pull palette from image (k-means) |
| `utils/mesh-editor.js` | `MeshEditor` global — interactive drag-to-position mesh builder |
| `shaders/gradient-mesh.glsl.js` | `GradientMeshShader` — animated 4-corner mesh |
| `shaders/gradient-flow.glsl.js` | `GradientFlowShader` — soft multi-color flow with warp |
| `shaders/mesh-gradient-wgl.glsl.js` | `MeshGradientWGLShader` — whatamesh Stripe-style |

### Logo / PNG / SVG gradient treatments
| File | What it gives you |
| --- | --- |
| `effects/image-gradient.css` | Fill a PNG/SVG/logo's silhouette with a gradient (`.imggrad-*`). 20+ palettes inc. holo/chrome/Apple. |
| `effects/image-gradient.js` | `ImageGradient` global — auto-detects PNG/external-SVG/inline-SVG and applies mask, defs-injection, or inline+inject. Also exposes `.halo()` for drop-shadow chain. |
| `effects/logo-glow.css` | Multi-color gradient halo following the logo's alpha (`.logoglow-*`) via stacked `drop-shadow()`. 18 color presets + pulse/floor/rim/sticker/rotating. |

### Specialty visual effects
| File | What it gives you |
| --- | --- |
| `effects/caustics.css` | Water-surface light patterns (`.caustics-*`) — pool, ocean, tropical, sunset, night, emerald, mono, rainbow. Use for aquatic moods. |
| `effects/watercolor.css` | Painterly splotchy gradient bleeds (`.wc-*`) — 11 palettes + paper-grain overlay. Editorial / Pinterest moodboards. |
| `effects/tie-dye.css` | Psychedelic conic swirls (`.tie-dye-*`) — 60s festival, cosmic, cyberpunk, starburst, vortex, eye-of-storm. |
| `effects/stepped-gradient.css` | Banded `.step-*` + dithered `.dither-*` (SVG noise) + pixel-block `.pixel-grad-*` (NES/CGA/Game Boy palettes). |
| `effects/crystal-facets.css` | Gemstone gradients (`.cryst-*`) — diamond, ruby, sapphire, emerald, amethyst, topaz, opal, onyx, fluorite, prism. Cuts: hex/round/pear. |
| `effects/lava-lamp.css` | Gooey metaball blobs (`.lava-*`) via `filter: blur(20px) contrast(20)`. 10 color palettes inc. rainbow (each blob different). |
| `effects/fire.css` | Animated flames + embers (`.fire-*`) — orange/blue/green/purple/pink/cold/rainbow. Plus `.fire-overlay` to put flames behind a logo/text. |
| `effects/smoke.css` | Drifting fog/mist/steam (`.smoke-*`) — 11 variants inc. toxic/magical/cyber/incense/dust/blood. Bottom-anchored ground fog mode. |
| `effects/glass-refraction.css` | Chromatic aberration / RGB-split (`.gref-text-*`, `.gref-img-*`, `.gref-pane-*`) — prism edges, glitch text, Apple Vision Pro glass. |

### Color tools (new)
| File | What it gives you |
| --- | --- |
| `utils/palette-generator.js` | `PaletteGenerator` global — color-theory schemes (complementary/triadic/tetradic/analogous/monochromatic/shades/tints/tones/square/compound) + WCAG contrast + random/surprise. |
| `components/gradient-avatar.css/.js` | `GradientAvatar` global — Discord/GitHub-style identicon. Hashes a string into a deterministic gradient + initials. 9 styles. Standalone SVG output for `<img src="data:…">` usage. |

## Quick decision tree

```
User wants a gradient background…
├── Landing page hero with aurora blobs? → aurora-bg.css (.aurorabg-cosmic)
├── Vercel-style floating orbs? → gradient-orbs.js (GradientOrbs.init())
├── Stripe-homepage mesh? → mesh-bg-stripe.css (.meshbg-stripe) OR mesh-gradient-wgl shader
├── Time-of-day / atmospheric? → sky-gradients.css (.sky-sunset / .sky-deep-space)
├── Specific brand vibe? → gradients-pack.css (.grad-instagram / .grad-stripe / etc.)
├── Smooth multi-color blending? → gradient-mesh.css (.gmesh-*) OR utils/mesh-editor.js
├── Wants it animated? → gradient-animations.css (.ganm-slide on any preset)
└── Custom palette? → GradientBuilder.linear() / .randomMesh()

User wants gradient text…
├── Headline? → gradient-text.css (.gtxt-instagram / -sunset / -cosmic / -apple)
├── Massive stat number? → typography/gradient-numbers.css (.gnum-cosmic .gnum-hero)
├── Animated? Add .gtxt-anim or .gnum-shimmer
└── Outline only? Add .gtxt-stroke or .gnum-stroke

User wants a gradient border…
└── gradient-borders.css → .gbord + .gbord-static OR .gbord-rotating OR .gbord-flowing

User wants "holographic / iridescent / Pokémon card"…
├── Simple? → gradient-holo.css (.holo-card)
├── Variety pack? → effects/iridescent-pack.css (.iri-soap / .iri-cd / .iri-opal / .iri-foil)
└── With mouse tracking? → + GradientBuilder.trackHolo(el)

User wants chrome / mercury / metallic look…
└── liquid-metal.css (.metal-chrome / .metal-mercury / .metal-gold-liquid + .metal-sheen)

User wants Apple-quality polish on a gradient surface…
└── Add .gnoise on top (gradient-noise.css adds SVG grain overlay)

User wants color-following / matching shadow…
└── gradient-shadows.css (.gsh-aurora / .gsh-sunset / .gsh-strong / .gsh-floor)

User wants colored aura around CTA…
└── gradient-glow.css (.gglow-aurora .gglow-pulse / .gglow-spin)

User wants gradient on a button…
└── gradient-buttons.css (.gbtn-aurora / .gbtn-holo / .gbtn-conic / .gbtn-shimmer)

User wants progress bar with gradient…
└── gradient-progress.css (.gprog .gprog-aurora style="--v: 65") + .gprog-striped/.gprog-pulse

User wants image effects (duotone, fade, vignette)…
├── Duotone (Spotify-style)? → effects/duotone.css (.dt-cyber) OR Duotone.apply() for true SVG
├── Fade out edges? → effects/gradient-mask.css (.gmask-bottom / .gmask-vignette)

User wants WebGL-quality (heavy use case)…
└── shaders/mesh-gradient-wgl.glsl.js (Stripe homepage clone) via ShaderRunner

User wants to pull a palette from an image…
└── GradientExtract.fromImage('cover.jpg').then(p => ...)
   // p.palette[], p.dominant, p.accent, p.light, p.dark

User wants to build a mesh interactively…
└── MeshEditor.init(targetEl, { stops: 4, palette: 'aurora', onChange })

User wants a color picker wheel…
└── components/color-wheel.css/.js — ColorWheel.init('.cwheel', { onChange })

User wants a specialty visual effect (water / paint / fire / glass / etc)…
├── Water-light caustics?        → effects/caustics.css (.caustics-pool)
├── Watercolor bleed / editorial? → effects/watercolor.css (.wc-bloom + .wc-paper)
├── Tie-dye psychedelic swirl?    → effects/tie-dye.css (.tie-dye-festival + .tie-dye-spin)
├── Banded / posterized?          → effects/stepped-gradient.css (.step-rainbow .step-bands-8)
├── Dithered SVG noise?           → effects/stepped-gradient.css (.dither-cosmic)
├── Pixel / retro-game blocks?    → effects/stepped-gradient.css (.pixel-grad-game-boy)
├── Diamond / gemstone facets?    → effects/crystal-facets.css (.cryst-opal .cryst-shine)
├── Gooey lava lamp blobs?        → effects/lava-lamp.css (.lava-aurora + 4-8 .lava-blob children)
├── Animated fire / flames?       → effects/fire.css (.fire .fire-blue + .fire-flame ×3)
├── Drifting smoke / fog / mist?  → effects/smoke.css (.smoke-magical + 5 .smoke-puff)
└── Chromatic aberration / RGB-split? → effects/glass-refraction.css (.gref-text-rgb / .gref-img-prism)

User wants a deterministic avatar from a username / email / id…
└── components/gradient-avatar.css/.js — GradientAvatar.init('[data-gav]')
   <span class="gav gav-mesh gav-lg" data-gav="user@email.com"></span>
   // 9 styles: linear, radial, conic, mesh, stripes, dots, rings, spiral, holo
   // Also: GradientAvatar.svgDataUri('seed', opts) for use in <img src="data:…">

User wants harmonious colors from a single seed color…
└── utils/palette-generator.js — PaletteGenerator
   const { colors, gradients } = PaletteGenerator.triadic('#ec4899');
   // Schemes: complementary, triadic, splitComplementary, tetradic, square,
   //          analogous, monochromatic, shades, tints, tones, compound

User wants to color a PNG / SVG / logo with a gradient…
├── Fill the shape (replace colors)?
│   ├── Inline SVG?    → ImageGradient.fill(svgEl, { palette: 'aurora' })
│   ├── External SVG?  → ImageGradient.inline(imgEl, { palette: 'aurora' }) (fetches + inlines)
│   ├── PNG/JPG?       → ImageGradient.mask(imgEl, { palette: 'aurora' })
│   └── CSS-only?      → <div class="imggrad imggrad-aurora" style="--src: url('logo.png')"></div>
├── Wrap a gradient halo around it (keep original colors)?
│   ├── CSS-only:      <img class="logoglow logoglow-cosmic logoglow-pulse" src="logo.png">
│   └── JS:            ImageGradient.halo(target, { palette: 'cyber', intensity: 'strong' })
└── Auto-init via data attrs: <img data-img-gradient="aurora" data-img-gradient-method="auto">
                              → ImageGradient.init('[data-img-gradient]')
```

## Code patterns

### Aurora hero background
```html
<section class="aurorabg aurorabg-cosmic">
  <h1 class="gtxt gtxt-h1 gtxt-apple">Build the future</h1>
</section>
```

### Stripe-style mesh background
```html
<section class="meshbg meshbg-stripe">…</section>

<!-- Or programmatically with random blobs -->
<section id="hero"></section>
<script>MeshBg.init('#hero', { palette: 'stripe', blobs: 6, animate: true });</script>
```

### Sky / time-of-day
```html
<section class="sky sky-sunset">…</section>
<section class="sky sky-deep-space">…</section>
<section class="sky sky-aurora-sky sky-animate">…</section>
```

### Holo card with mouse tracking
```html
<div class="holo-card holo-tilt" id="card">
  <div class="holo-content"><h2>Limited</h2></div>
</div>
<script>GradientBuilder.trackHolo(document.getElementById('card'));</script>

<!-- Or pick from iridescent-pack for a different style -->
<div class="iri iri-opal">…</div>
<div class="iri iri-cd iri-fast">…</div>
```

### Metallic surfaces
```html
<button class="metal metal-chrome metal-sheen">CHROME</button>
<div class="metal metal-gold-liquid metal-anim">…</div>
```

### Gradient button (specialty)
```html
<button class="gbtn gbtn-aurora gbtn-glow">Subscribe</button>
<button class="gbtn gbtn-holo gbtn-pill">Premium</button>
<button class="gbtn gbtn-conic">Rotating border</button>
<button class="gbtn gbtn-shimmer gbtn-sunset">Animated sheen</button>
<button class="gbtn gbtn-outline gbtn-cosmic">Ghost</button>
```

### Gradient card (7 styles)
```html
<div class="gcard gcard-aurora">Solid fill</div>
<div class="gcard gcard-border" style="--gc-base:#0a0a14;">Border only</div>
<div class="gcard gcard-glass gcard-cosmic">Frosted</div>
<div class="gcard gcard-glow gcard-sunset">Heavy halo</div>
<div class="gcard gcard-mesh gcard-aurora">Multi-radial mesh</div>
<div class="gcard gcard-corner gcard-rose">Corner bleed</div>
<div class="gcard gcard-spotlight" data-cursor-track>Mouse-tracked spotlight</div>
```

### Gradient progress
```html
<div class="gprog gprog-aurora" style="--v: 65"><div class="gprog-fill"></div></div>
<div class="gprog gprog-cyber gprog-striped gprog-anim" style="--v: 80"><div class="gprog-fill"></div></div>

<div class="gpring" style="--v: 75; --gpring-bg: #0a0a14;">
  <span class="gpring-label">75%</span>
</div>

<script>
  GradientProgress.animateTo('.gprog', 90, { duration: 1000 });
</script>
```

### Gradient hero numbers
```html
<div class="gnum-set">
  <span class="gnum gnum-cosmic gnum-hero">240k</span>
  <span class="gnum-label">Active users</span>
</div>

<span class="gnum gnum-mega gnum-aurora gnum-shimmer">$129M+</span>
<span class="gnum gnum-lg gnum-apple">99.9%</span>
```

### Colored glow CTA + matching shadow
```html
<button class="gbtn gbtn-aurora gglow gglow-aurora gsh gsh-aurora gsh-strong">
  Get started
</button>
```

### Image with duotone + fade-out mask
```html
<figure class="dt dt-cyber gmask gmask-bottom">
  <img src="hero.jpg" alt="">
</figure>

<!-- Or apply true SVG-filter duotone via JS -->
<script>Duotone.apply('img.cover', { palette: 'spotify' });</script>
```

### Apply Apple-style grain on top of any gradient
```html
<section class="grad grad-stripe gnoise gnoise-light">
  Premium feel
</section>

<!-- Standalone grain overlay -->
<div class="gradbox">
  <span class="gnoise-layer"></span>
  …content…
</div>
```

### Reusable SVG gradient on an icon
```html
<script>SvgDefs.mount();</script>
<svg width="32" height="32"><path d="..." fill="url(#grad-aurora)"/></svg>

<!-- Or build a custom one -->
<script>
  const id = SvgDefs.linear({ colors: ['#ff00aa', '#00ffff'], angle: 45 });
  iconEl.setAttribute('fill', `url(#${id})`);
</script>
```

### Extract palette from album cover
```js
GradientExtract.fromImage('cover.jpg').then(p => {
  heroEl.style.background = `linear-gradient(135deg, ${p.palette.slice(0, 3).join(',')})`;
  el.style.color = p.dark;
});
// Or one-liner:
GradientExtract.applyTo(heroEl, 'cover.jpg', { type: 'linear', angle: 135 });
```

### Interactive mesh editor
```js
const editor = MeshEditor.init('#editor-canvas', {
  width: 800, height: 500,
  stops: 5,
  palette: 'aurora',
  onChange: (css) => previewEl.style.background = css
});
editor.randomize();
console.log(editor.exportCss()); // ready to paste
```

### Color wheel picker
```js
const wheel = ColorWheel.init('.cwheel', {
  initial: '#ff00aa',
  onChange: (color) => {
    pickedEl.style.background = color.hex;
    rgbEl.textContent = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
  }
});
```

### Wrap a PNG / SVG / logo in a gradient

**Fill the silhouette with a gradient (replace colors):**
```html
<!-- CSS-only: set --src to the image URL -->
<div class="imggrad imggrad-aurora imggrad-lg" style="--src: url('logo.png');"></div>

<!-- Wide wordmark -->
<div class="imggrad imggrad-cosmic imggrad-wordmark" style="--src: url('wordmark.svg');"></div>

<!-- Animated holographic foil fill -->
<div class="imggrad imggrad-holo imggrad-md" style="--src: url('icon.png');"></div>
```

```js
// Auto — detects PNG vs external SVG vs inline SVG
ImageGradient.apply('img.logo', { palette: 'aurora' });

// Inline SVG — best quality, injects <linearGradient> into <defs>, rewires fills
ImageGradient.fill(document.querySelector('svg.icon'), { palette: 'cosmic', strokes: true });

// External SVG via <img> — fetches and inlines, then applies fill
ImageGradient.inline('img.svg-logo', { palette: 'sunset' });

// PNG — mask-image + gradient bg (replaces the <img> with a styled <div>)
ImageGradient.mask('img.png-logo', { palette: 'cyber' });
```

**Wrap a gradient glow AROUND the logo (keep original colors):**
```html
<!-- CSS-only halo via stacked drop-shadow -->
<img src="logo.png" class="logoglow logoglow-aurora logoglow-pulse" alt="Brand">

<!-- Stronger Vercel-style floor light -->
<img src="logo.svg" class="logoglow logoglow-cosmic logoglow-floor-strong">

<!-- Neon sticker rim -->
<svg class="logoglow logoglow-mono-cyan logoglow-sticker">…</svg>
```

```js
// Programmatic halo on any element with alpha (img, svg, .imggrad)
ImageGradient.halo('img.logo', { palette: 'aurora', intensity: 'strong', pulse: true });
ImageGradient.halo('svg.icon', { palette: 'cyber', intensity: 'extreme' });
```

**Auto-init from data attributes** (no JS to write per-element):
```html
<img src="logo.png"
     data-img-gradient="aurora"
     data-img-gradient-method="halo"
     data-img-gradient-intensity="strong"
     data-img-gradient-pulse="true">

<script>ImageGradient.init('[data-img-gradient]');</script>
```

**Stack: fill + halo on the same logo:**
```html
<div class="imggrad imggrad-cosmic logoglow logoglow-cosmic logoglow-pulse imggrad-md"
     style="--src: url('logo.svg');"></div>
```

### Specialty effects examples

```html
<!-- Watercolor + paper -->
<section class="wc wc-spring wc-paper wc-anim">
  <h1>Spring collection</h1>
</section>

<!-- Tie-dye spin behind translucent content -->
<div class="stack" style="position:relative;">
  <div class="tie-dye tie-dye-festival tie-dye-spin tie-dye-mask" style="position:absolute;inset:0;z-index:0;"></div>
  <div style="position:relative;z-index:1;">Hero content</div>
</div>

<!-- Lava lamp with content overlay -->
<div class="lava-stack" style="width:300px;height:500px;">
  <div class="lava lava-aurora">
    <span class="lava-blob"></span>
    <span class="lava-blob"></span>
    <span class="lava-blob"></span>
    <span class="lava-blob"></span>
    <span class="lava-blob"></span>
  </div>
  <div class="lava-content"><h2>Now Streaming</h2></div>
</div>

<!-- Logo on fire -->
<span class="fire-overlay">
  <img src="brand.png" class="logoglow logoglow-fire" alt="">
</span>

<!-- Smoke ground fog under a hero -->
<section class="hero">
  <div class="smoke smoke-fog smoke-bottom">
    <span class="smoke-puff"></span><span class="smoke-puff"></span>
    <span class="smoke-puff"></span><span class="smoke-puff"></span>
  </div>
  <h1>The mist</h1>
</section>

<!-- Glass refraction text -->
<h1 class="gref-text gref-text-prism gref-anim">PRISM</h1>

<!-- Crystal gem icon -->
<div class="cryst cryst-opal cryst-shine cryst-hex" style="width:60px;height:60px;"></div>

<!-- Caustics over an existing image -->
<figure style="position:relative;">
  <img src="underwater.jpg" alt="">
  <div class="caustics-layer"></div>
</figure>
```

### Color palette generation
```js
// Start with one brand color, get a full palette
const tri = PaletteGenerator.triadic('#ec4899');
// → { name, colors: [3], gradients: { linear, radial, conic }, meta }

heroEl.style.background = tri.gradients.linear;
btnEl.style.color = tri.meta.contrastWB[0].bestText;

// Apply palette as CSS variables on an element
PaletteGenerator.applyToCSS(rootEl, tri);
// → sets --palette-0, --palette-1, --palette-2, --palette-gradient

// Generate everything at once
const all = PaletteGenerator.all('#06b6d4');
console.log(Object.keys(all)); // complementary, triadic, tetradic, ...

// Surprise me
const random = PaletteGenerator.surprise();
```

### Gradient avatars / identicons
```html
<!-- Auto-init: hash applies on page load -->
<span class="gav gav-md" data-gav="claude@anthropic.com" data-gav-name="Claude AI"></span>
<span class="gav gav-conic gav-lg" data-gav="user-1234"></span>
<span class="gav gav-mesh gav-xl gav-glow" data-gav="anthropic"></span>

<!-- Avatar pile -->
<div class="gav-pile">
  <span class="gav gav-md" data-gav="alice"></span>
  <span class="gav gav-md gav-conic" data-gav="bob"></span>
  <span class="gav gav-md gav-mesh" data-gav="carol"></span>
  <span class="gav-pile-count">+12</span>
</div>

<!-- Instagram-story-style ring around a photo -->
<span class="gav gav-ring gav-ring-anim gav-lg" data-gav="user-1234">
  <img src="profile.jpg" alt="">
</span>

<script>GradientAvatar.init('[data-gav]');</script>
```

```js
// Programmatic
GradientAvatar.render(myEl, 'username', { style: 'mesh', initials: 'CA' });

// Standalone SVG (no DOM)
const dataUri = GradientAvatar.svgDataUri('claude', { size: 64, style: 'conic' });
imgEl.src = dataUri;

// Just the colors
const [c1, c2, c3] = GradientAvatar.palette('claude');
```

### Aurora background + gradient orbs (combined)
```html
<section class="aurorabg aurorabg-cosmic" id="hero">
  <h1 class="gtxt gtxt-mega gtxt-apple">Aurora</h1>
</section>
<script>
  GradientOrbs.init('#hero', { count: 4, palette: 'cosmic', parallax: true });
</script>
```

## Animation utilities (`gradient-animations.css`)

| Class | What it does |
| --- | --- |
| `.ganm-slide` | Slides background-position horizontally |
| `.ganm-slide-diag` | Diagonal slide |
| `.ganm-pulse` | Background-size pulses in/out |
| `.ganm-hue` | Hue-rotate filter cycles |
| `.ganm-conic-spin` | Self-contained spinning conic gradient |
| `.ganm-drift` | 5-stop Stripe drift |
| `.ganm-blink` | Two-tone hard step |
| `.ganm-rainbow` | Full spectrum hue cycle |
| `.ganm-ribbon` | Bright bar sweeps across |
| `.ganm-shimmer` | Soft highlight sweep (loaders) |
| `.ganm-breathe` | Saturation/brightness pulse |
| `.ganm-aurora` | Slide + hue-rotate combo |
| `.ganm-kenburns` | Slow zoom (great for hero photos) |

Speed modifiers: `.ganm-slow` · `.ganm-fast` · `.ganm-glacial`

## Iridescent / metal / holo variants

### `iridescent-pack.css` — 15 variants
soap, soap-bubble-thin, cd, dvd (rotating), oil-thick, pearl, pearl-soft, rainbow-stripe, foil, holo-card, prism, opal, mother-of-pearl, aurora-foil, mercury-rainbow, mirror-ball

Modifiers: `.iri-still`, `.iri-fast`, `.iri-slow`, `.iri-bright`, `.iri-mute`. Mouse-tracked via `.iri-shift` (set `--ix/--iy` from JS).

### `liquid-metal.css` — 13 surfaces
chrome, silver, mercury, titanium, platinum, rose-gold, gold-liquid, copper, bronze, gunmetal, obsidian, iridescent-chrome, brushed

Modifiers: `.metal-anim` (flow), `.metal-tilt` (mouse, set `--tx/--ty`), `.metal-sheen` (sweeping highlight).

### `gradient-holo.css` (legacy)
holo-card, holo-text, holo-chrome, holo-oil-slick, holo-mother-pearl, holo-rainbow-foil, holo-shiny

## Preset categories (`gradients-pack.css`)

| Category | Examples |
| --- | --- |
| **Brand recreations** | instagram, spotify, discord, twitch, stripe, linear, vercel, vercel-rainbow, apple-intelligence, notion, figma, tailwind |
| **Sunset / warm** | sunset, sunset-deep, sunrise, mango, peach, coral, citrus, firewatch |
| **Ocean / cool / sky** | ocean, ocean-deep, arctic, glacier, sky, mint, teal, aqua, deep-sea |
| **Aurora / cosmic / space** | aurora, galaxy, cosmic, nebula, purple-haze, supernova, saturn |
| **Pastel / soft** | pastel-pink/-blue/-mint/-lavender/-rainbow, cotton-candy, petal, cream |
| **Vibrant / pop** | pop, electric, juicy, tropical, mojito, rainbow, magenta, flamingo |
| **Dark / moody** | dark, midnight, charcoal, onyx, noir, blood, forest-dark |
| **Retro / synthwave** | synthwave, vaporwave, miami, retro-sun, arcade, neon-night |
| **Y2K / iridescent** | y2k, iridescent, pearl, bubble |
| **Cyberpunk / neon** | cyberpunk, blade-runner, neon-pink, toxic, acid |
| **Nature** | forest, meadow, lava, volcano, emerald, cherry, blueberry, grape, rose, honey |

## Sky / atmospheric presets (`sky-gradients.css`)

| Category | Variants |
| --- | --- |
| **Time of day** | dawn, sunrise, morning, noon, clear-blue, golden-hour, sunset, burnt-sunset, magic-hour, twilight, blue-hour, dusk, pink-dusk, night, midnight, deep-night |
| **Phenomena** | aurora-sky, northern-lights, stormy, overcast, foggy, rainy, misty-dawn, sandstorm |
| **Alien worlds** | mars, jupiter, venus, saturn, neptune |
| **Stylized** | pastel-sky, cotton-candy, arctic, savanna, tropical, mediterranean, tequila, mojave |
| **Deep space** | deep-space, galactic, nebula |

Modifiers: `.sky-radial`, `.sky-conic`, `.sky-animate`

## Performance + a11y notes

- **Animate sparingly**. Use animated gradients on hero / focal elements only.
- All animation classes already respect `prefers-reduced-motion: reduce`.
- Mesh gradients are GPU-light (radial gradients are cheap) — fine for full-page bg.
- For text gradients, browsers vary on `background-clip: text` quality at small sizes. Don't use below 14px.
- `oklch` interpolation produces smoother blends than the default sRGB. Pair `linear-gradient(in oklch, …)` for premium results.
- `@property --angle` is required for animating conic-gradient `from` angle. Fallback animation (transform: rotate) is included where relevant.
- Aurora/mesh/orb backgrounds use `position:absolute; pointer-events:none` for the gradient layers so they never block clicks.
- `gradient-noise` overlays cost a single SVG turbulence shader pass — cheap, but skip on mobile for huge surfaces.

## Composition cheat sheet

```html
<!-- Hero combo: aurora bg + apple text + grain polish -->
<section class="aurorabg aurorabg-cosmic gnoise gnoise-light">
  <h1 class="gtxt gtxt-mega gtxt-apple">Headline</h1>
  <button class="gbtn gbtn-aurora gbtn-glow gbtn-pill">Get started</button>
</section>

<!-- Premium card: rotating border + mesh + holo text + colored shadow -->
<div class="gbord gbord-rotating gbord-cosmic gsh gsh-cosmic gsh-strong">
  <div class="gbord-content gmesh gmesh-aurora">
    <h2 class="holo-text">Featured</h2>
    <div class="gprog gprog-aurora" style="--v: 75"><div class="gprog-fill"></div></div>
  </div>
</div>

<!-- Stat block: hero number + iridescent badge -->
<div class="gnum-set">
  <span class="gnum gnum-mega gnum-sunset">$2.4M</span>
  <span class="gbdg gbdg-holo gbdg-sm">LIVE</span>
</div>

<!-- Album-art-driven gradient -->
<script>
  GradientExtract.applyTo(heroEl, albumCover.src, { type: 'linear', angle: 135 });
</script>
```

## When NOT to use gradients

- Body copy (use solid colors, gradients hurt readability)
- Form inputs (distracting from input state)
- Tables of data (use solid bg for clarity)
- Dense dashboards with lots of small elements (visual noise)

Use gradients where the goal is to **draw the eye** — heroes, CTAs, brand moments, premium tiers, achievement badges, hero numbers.

## Cross-references

- For animated borders that aren't full gradients, see `effects/border-beam.css` and `effects/shine-border.css`.
- For text effects beyond gradients (split, scramble, type), see `effects/text-reveal.js`, `text-wave.js`, `text-generate.js`, `text-ripple.js`.
- For shader-based gradient meshes (most advanced), see `shaders/mesh-gradient-wgl.glsl.js` + `shaders/runner.js`.
- For 3D scenes that produce gradient backgrounds, see `3d/wave-plane.js`.
- For traditional color picker UI (hue/sat/alpha sliders), see `blocks/color-picker.css/.js`. For wheel-style, see `components/color-wheel.css/.js`.
