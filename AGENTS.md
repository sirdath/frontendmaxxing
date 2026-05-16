# AGENTS.md — Read this first

This folder is a **vanilla CSS+JS snippet vault** — 481 standalone, copy-paste-ready files for frontend design. Zero build step. Zero dependencies (except Three.js for `3d/*` snippets via CDN).

## What you do here

**To find a snippet:** grep [`INDEX.md`](INDEX.md). Every file has a 2-line tagged entry with synonyms baked in. Search for the *vibe*, not the filename — e.g. "card 3d tilt parallax" finds `components/cards-3d.css`.

**To add a snippet:** follow conventions below, then add a tagged entry to `INDEX.md` and register the snippet in `demo/index.html`.

**For gradients specifically:** read [`gradients.skill.md`](gradients.skill.md) first. It has its own decision tree and 32+ files of gradient territory.

## How the docs fit together

| File | Purpose | When to consult |
| --- | --- | --- |
| `AGENTS.md` (this file) | Entry point + conventions | First time landing in folder |
| `INDEX.md` | Tagged inventory of every file (~1800 lines) | Whenever finding/adding a snippet |
| `gradients.skill.md` | Gradient-specific decision tree | Anything involving color blends, holo, mesh, brand recreations |
| `demo/index.html` | Live preview of every snippet | When adding a new file (must register) |
| `MEMORY.md` (separate, in user memory dir) | Phase summaries | Already loaded for Claude — auto-consulted |

## Conventions (LOCKED — follow exactly when adding files)

### Folder layout

```
3d/             Three.js scenes (requires THREE global via CDN)
ai/             AI-native UI (streaming text, tool calls, citations, …)
animations/     Keyframes, transitions, spring, stagger, AOS, anime-recipes
backgrounds/    Hero/page backgrounds (aurora, mesh, orbs, world map, sky, …)
blocks/         Buttons, loaders, toasts, tooltips, badges, inputs, sliders, …
borders/        Animated/gradient borders
components/     Full UI components (heroes, navbars, cards, modals, kanban, …)
data-viz/       Charts, sparklines, treemap, sankey, network, count-up, …
effects/        Visual effects (gradients, glitch, parallax, cursors, holo, …)
feedback/       Confetti, sparkles, success/error states, gamification (XP, streak, …)
interactions/   Sortable, swipe, long-press, pinch-zoom, gravity, elastic-line, …
layout/         Grids, flexbox, masonry, container queries, sticky, aspect ratios
media/          Image compare, video player, audio waveform, lightbox, clip trim, …
micro/          Tiny micro-interactions (toggle, like, copy, counter)
responsive/     Breakpoints, dark mode, mobile patterns, skip-link
scroll/         Pin, scrub, snap, horizontal-pin, text-reveal
shaders/        Pure-WebGL fullscreen-quad shaders (noise, mesh, voronoi, godrays, …)
svg/            SVG animations, gradient defs
transitions/    Page transitions (fade, curtain, morph, View Transitions API)
typography/     Fluid type, variable fonts, gradient numbers, text effects
utils/          easing, lerp, dom, performance, smooth-scroll, palette-generator, gradient-builder
```

### JS template — every JS file follows this IIFE+UMD pattern

```js
/* ============================================
   MODULE NAME — One-sentence description
   Inspired by [source]
   ============================================
   Usage:
     ModuleName.init('.selector', { opt: val });

   Variants / Methods / Modifiers (document inline)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { /* … */ };

  function init(target, opts) { /* returns instance or [instances] */ }
  function create(el, opts)   { /* returns { el, …methods, destroy } */ }

  var ModuleName = { init: init, /* … */ };

  if (typeof module !== 'undefined' && module.exports) module.exports = ModuleName;
  else root.ModuleName = ModuleName;
})(typeof window !== 'undefined' ? window : this);
```

### CSS template

```css
/* ============================================
   SNIPPET NAME — Description
   Inspired by [source]
   ============================================
   Usage: <div class="snippet-name">...</div>

   Variants: .snippet-name-variant1, .snippet-name-variant2
   Modifiers: .snippet-name-modifier
   ============================================ */
.snippet-name {
  --snippet-var: value;  /* CSS custom properties for everything tunable */
  /* … */
}
```

### Naming rules

- **Files** — kebab-case: `gradient-text.css`, `streaming-text.js`. Companion JS+CSS pairs share the base: `tool-call-card.css` + `tool-call-card.js`.
- **CSS classes** — kebab-case with a short prefix tied to the file: `.tcc`, `.tcc-head`, `.tcc-success`. Pick a 2-4-char prefix and stick to it. Variants are `.prefix-variant`. Modifiers are `.prefix-modifier`.
- **JS globals** — PascalCase: `ToolCallCard`, `StreamingText`. Always expose one root global per file.
- **CSS variables** — `--prefix-var` matching the class prefix: `--tcc-bg`, `--strm-caret`.

### Zero-dep rule

- **No `import`, no `require`** (except `module.exports` at the end for CommonJS interop)
- **No frameworks** — vanilla DOM only
- **One exception** — `3d/*.js` may reference `window.THREE` (loaded via CDN: `<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>`)
- **All tunables exposed as CSS custom properties** so consumers can theme without editing CSS

### Indexing rule

After adding any file, append a 2-line entry to the appropriate `INDEX.md` section:

```
**filename.ext** `folder/filename.ext` (CSS|JS, global: `Name`) — tags: keyword keyword2 synonym3 vendor-name
  One-sentence description of what it does and its key API/variants.
```

Bake **synonyms** into tags so grep finds it from multiple angles. Tag with vendor names where appropriate (`linear`, `vercel`, `stripe`, `apple`, `notion`, `cursor`, `claude`, etc.) so brand-style searches work.

### Demo registration rule

After adding any file, register it in `demo/index.html`:
1. Add `<link rel="stylesheet" href="path/to/file.css">` in `<head>`
2. Add `<script src="path/to/file.js"></script>` before `</body>`
3. Add a `<section>` with a heading + a `.demo-grid` of `.demo-card` examples that demonstrate the variants
4. Call `Module.init()` in the closing inline script block

## What's already covered (mental map)

This vault has comprehensive coverage of:

- **Forms** — all standard pickers (date, color, file, color wheel, phone, tags, OTP, range, multi-select, combobox, emoji, country, icon, swatch)
- **Overlays** — modals, drawers, command palette, popovers, dropdown menus, slash menus, context menus, tour spotlight
- **Charts** — bar/line/pie/area/radar/funnel/gauge/sankey/treemap/network/sparkline + count-up + stat tiles
- **Navigation** — navbars (10 styles), tabs, animated tabs, breadcrumbs, pagination, steps wizard, dock, family-button, dynamic-island
- **Layout** — bento, masonry, container queries, scroll snap, sticky, aspect ratios, resizable panels, infinite canvas + minimap
- **Heroes** — 10+ styles, lamp, aurora, world map, spotlight, light-rays, hero-parallax
- **Buttons** — 30+ styles in `buttons-pack.css`, plus shimmer/rainbow/pulsating/holo/conic/neumorph
- **Gradients** — 60+ presets + 32 gradient files (text/borders/mesh/holo/iridescent/metal/blobs/glow/noise/masks/shadows/divider/duotone/image-fill + extract/builder/mesh-editor/palette-generator)
- **3D** — Three.js scenes (galaxy, wave plane, instanced grid, cube morph, raycast hover, postprocessing-bloom, floating text)
- **Shaders** — 12 fullscreen-quad shaders (noise, mesh, voronoi, kaleidoscope, raymarch SDF, godrays, plasma, fluid, sdf-text, halftone, liquid-distortion, gradient-flow)
- **AI-native UI** (Phase 14–15) — streaming text, tool-call cards, reasoning blocks, citations, sources panel, model picker, token usage, attachments, suggested replies, inline controls, artifact split, agent trace, AI diff, voice input
- **Editor primitives** (Phase 14–15) — infinite canvas, minimap, slash menu, block drag handle, shortcut cheatsheet, rich-text editor, markdown editor, diff viewer, json editor, layers panel, properties panel
- **Pro-tool patterns** (Phase 14–15) — Warp terminal blocks, Vercel log stream, Sentry stack traces, Linear triage rows, changelog popover, focus mode with Pomodoro
- **Specialty visual** — caustics, watercolor, tie-dye, stepped/banded/pixel, crystal facets, lava lamp, fire, smoke, glass refraction, gooey input, image cursor trail
- **Distinctive text** — TextWave, TextReveal, TextGenerate, TextRipple, EncryptedText, TextFlippingBoard (split-flap), VariableFontCursor

If you're considering adding something — **grep INDEX.md first**, there's a decent chance it's already there.

## Quick start for the most common agent tasks

### "I need a component for X"
```
grep -i "your keyword" INDEX.md
# (or use a fuzzy synonym — e.g. "ticker" finds marquee)
```
Read the file before suggesting it. Don't trust INDEX blindly — verify API matches.

### "I want to add a new snippet"
1. Pick the folder (or propose a new top-level one)
2. Follow the JS/CSS template above
3. Add the INDEX entry in the right section
4. Register in `demo/index.html`
5. Done — no build, no test, just save and refresh demo

### "I want to make a change to an existing snippet"
1. Read the file
2. Make the edit
3. If the API surface changed, update the INDEX entry's tags + one-liner
4. Verify the demo still works (open `demo/index.html` in a browser)

### "I want to know what's available in folder X"
Grep INDEX.md for entries with that folder path, e.g. `grep "components/" INDEX.md`

## Cross-platform paths

The INDEX uses Windows-style backslashes in older entries (`animations\keyframes.css`) and forward slashes in newer ones (`ai/streaming-text.css`). Both work for grep. When writing new entries, prefer **forward slashes** — they work on every OS.

## When you change anything in this folder, update:
1. The file itself
2. `INDEX.md` — body entry + intent-table row if applicable
3. `gradients.skill.md` — only if it's gradient-related
4. `demo/index.html` — register/update the demo

That's it. The folder is self-contained, the docs are the source of truth, and you have everything you need to be productive immediately.
