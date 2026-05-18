# frontendmaxxing

> **765 standalone CSS + JS snippets for frontend design.** Vanilla. Zero build step. Zero dependencies. Copy-paste and ship.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Files](https://img.shields.io/badge/snippets-765-8b5cf6)](INDEX.md)
[![No build](https://img.shields.io/badge/build-none-success)](#)
[![No deps](https://img.shields.io/badge/dependencies-0-success)](#)
[![Framework-agnostic](https://img.shields.io/badge/framework-agnostic-ec4899)](#)

### ▶︎ [**Browse the live demo →**](https://sirdath.github.io/frontendmaxxing/demo/)

Every single snippet renders in the [interactive demo](https://sirdath.github.io/frontendmaxxing/demo/) — searchable sidebar, live preview, copy-the-path. No clone or build needed to look around. Mobile-app screens render inside a real iPhone frame; GSAP & 3D snippets load their CDN deps automatically.

A massive snippet vault — heroes, navbars, buttons, modals, charts, gradients, shaders, AI-native UI, infinite canvases, fire effects, voronoi shaders, holographic foil, kinetic typography… and 450+ more. Every file is a single `.css` or `.js` you can drop into any project without setup.

If you want a **specific UI piece** — chances are it's already here. If it isn't, [add it](#contributing).

---

## Table of contents

- [Why this exists](#why-this-exists)
- [Quick start](#quick-start)
- [Examples](#examples)
- [What's inside](#whats-inside)
- [Folder structure](#folder-structure)
- [Conventions](#conventions)
- [Finding a snippet](#finding-a-snippet)
- [For AI agents](#for-ai-agents)
- [Contributing](#contributing)
- [License](#license)

---

## Why this exists

Every snippet library in 2026 is either:
- **Framework-locked** (React-only, Vue-only) — you can't paste it into a Stripe Checkout success page or a static HTML demo
- **Tailwind-tied** — requires config, build step, JIT
- **Sprawling but shallow** — 100 buttons, 10 modals, nothing else
- **Or a hidden Figma file** that doesn't help your code

**frontendmaxxing is the opposite:**
- 100% vanilla CSS + JS (with one optional Three.js CDN for `3d/`)
- Drop a file, link it, use it — no installs
- Works with React, Vue, Svelte, htmx, Astro, Eleventy, or raw HTML
- Deep coverage: 30+ button styles, 10+ hero layouts, 12 WebGL shaders, 60+ gradient presets, AI-native chat components, infinite canvas with minimap, Sentry-style stack traces, Warp-style terminal blocks…

**Made for the era of vibe-coded UIs.** Whether you're prompting an AI to build a landing page or building one yourself, this is the parts bin.

---

## Quick start

### Option A — clone and link directly

```bash
git clone https://github.com/sirdath/frontendmaxxing.git
```

In your HTML:

```html
<link rel="stylesheet" href="frontendmaxxing/effects/gradients-pack.css">
<link rel="stylesheet" href="frontendmaxxing/components/cards.css">
<script src="frontendmaxxing/utils/dom.js"></script>
<script src="frontendmaxxing/components/cards.js"></script>
```

That's it. Open the file in a browser. Done.

### Option B — copy specific files

Browse [`INDEX.md`](INDEX.md), grep for what you want, copy the file's contents into your project. Each file is self-contained.

### Option C — explore the demo

**Hosted:** [**sirdath.github.io/frontendmaxxing/demo**](https://sirdath.github.io/frontendmaxxing/demo/) — nothing to install.
**Local:** open [`demo/index.html`](demo/index.html) in any browser (no server needed). Every snippet is registered with a live preview; search the sidebar, click any entry, copy the file path.

---

## Examples

### Streaming AI chat message (Phase 14)

```html
<link rel="stylesheet" href="ai/streaming-text.css">
<script src="ai/streaming-text.js"></script>

<div class="strm strm-bubble" data-stream-id="m1"></div>

<script>
  StreamingText.append('m1', 'Hello, ');
  StreamingText.append('m1', 'world!');
  StreamingText.done('m1');

  // Or pipe an SSE/fetch stream directly:
  fetch('/api/chat').then(r => StreamingText.fromStream('m1', r.body, { parser: 'sse' }));
</script>
```

### Aurora hero background

```html
<link rel="stylesheet" href="backgrounds/aurora-bg.css">
<link rel="stylesheet" href="effects/gradient-text.css">

<section class="aurorabg aurorabg-cosmic" style="min-height: 100vh;">
  <h1 class="gtxt gtxt-h1 gtxt-apple">Build the future</h1>
</section>
```

### Tool-call card for an AI agent

```js
import 'ai/tool-call-card.css';
const card = ToolCallCard.create(container, {
  tool: 'search_web',
  args: { query: 'paris' },
  state: 'running'
});
card.setState('success');
card.setResult({ hits: ['result 1', 'result 2'] });
```

### Infinite canvas (tldraw-style)

```html
<link rel="stylesheet" href="components/infinite-canvas.css">
<script src="components/infinite-canvas.js"></script>

<div class="icv icv-blueprint" data-icv style="height: 100vh;">
  <div class="icv-grid"></div>
  <div class="icv-world">
    <div class="icv-node" style="left:200px;top:120px;">Drag me</div>
  </div>
</div>

<script>
  InfiniteCanvas.init('.icv');
</script>
```

### Logo wrapped in a gradient

```html
<link rel="stylesheet" href="effects/image-gradient.css">
<link rel="stylesheet" href="effects/logo-glow.css">

<!-- Fill a PNG logo with a gradient -->
<div class="imggrad imggrad-aurora imggrad-lg" style="--src: url('logo.png');"></div>

<!-- Or wrap a halo glow around it -->
<img class="logoglow logoglow-cosmic logoglow-pulse" src="logo.svg">
```

---

## What's inside

<table>
<tr>
<td valign="top" width="50%">

**🎨 Visual & motion**
- 60+ preset gradients + full toolkit (text/borders/mesh/holo)
- 12 WebGL shaders (voronoi, kaleidoscope, raymarch SDF, godrays, fluid, plasma…)
- 8 Three.js scenes (galaxy, wave plane, cube morph, particle systems)
- 30+ keyframe animations
- Caustics, watercolor, tie-dye, lava lamp, fire, smoke, glass refraction
- Variable-font cursor, text-flipping board (split-flap)
- Spring physics, scroll-driven scenes, page transitions

</td>
<td valign="top" width="50%">

**🤖 AI-native UI (Phase 14–15)**
- Streaming text with markdown-lite + scroll-lock
- Tool-call cards with run states + grouping
- Reasoning blocks (Claude/o1-style "Thinking…")
- Inline citations + sources panel
- Model picker with capability badges
- Token usage pill
- Attachment chips (drag-drop + paste)
- Suggested replies
- Stop/Regenerate/Branch inline controls
- Artifact split-pane (Claude/v0 canvas)
- Agent step trace timeline
- AI inline diff (Cursor-style hunk accept/reject)
- Voice input with live waveform

</td>
</tr>
<tr>
<td valign="top">

**📐 Editor & pro-tool primitives**
- Infinite canvas + minimap (tldraw-style)
- Slash menu (Notion-style)
- Block drag handle (Notion gutter)
- Shortcut cheatsheet (`?` overlay, ⌘/Ctrl-aware)
- Warp-style terminal blocks
- Vercel-style log stream (regex + follow-tail + permalinks)
- Sentry-style stack trace
- Linear-style triage rows (keyboard-first)
- Linear-style changelog popover
- Arc-style focus mode + Pomodoro
- Resizable panels, JSON editor, diff viewer
- Markdown/rich-text editors

</td>
<td valign="top">

**🧱 Standard UI**
- Heroes (10+ styles), navbars (10+), footers (6)
- Buttons (30+ styles in `buttons-pack`)
- Forms, modals, drawers, popovers, dropdowns
- Tabs, accordions, breadcrumbs, pagination
- Cards (10 styles), feature blocks, pricing tables
- Toasts, tooltips, badges, avatars
- Sliders, range, multi-select, combobox, date picker
- Color picker (block + wheel), file upload
- Charts: bar, line, pie, area, radar, funnel, gauge, sankey, treemap, network
- Sparkline, count-up, progress ring
- Kanban, calendar, heatmap
- Image compare, lightbox, video player, audio waveform
- Lots more — see [INDEX.md](INDEX.md)

</td>
</tr>
</table>

---

## Folder structure

```
3d/             Three.js scenes (requires THREE via CDN)
ai/             AI-native UI primitives
animations/     Keyframes, springs, stagger, AOS, anime-recipes
backgrounds/    Aurora, mesh, orbs, world map, sky, particles
blocks/         Buttons, loaders, toasts, tooltips, badges, inputs, sliders
borders/        Animated/gradient borders
components/     Full components: heroes, navbars, cards, modals, kanban…
data-viz/       Charts, sparklines, count-up, stat tiles
effects/        Gradients, glitch, parallax, cursors, holo, fire/smoke, …
feedback/       Confetti, sparkles, success/error states, achievements
gsap/           GSAP animation snippets (loads GSAP via CDN) — see gsap.skill.md
interactions/   Sortable, swipe, pinch-zoom, gravity, elastic-line
layout/         Grids, masonry, container queries, sticky, aspect ratios
media/          Image compare, video, audio waveform, lightbox, clip trim
micro/          Tiny micro-interactions
mobile/         iPhone-frame chrome (ios-*) + full mobile-app screens (app-*)
responsive/     Breakpoints, dark mode, mobile patterns
scroll/         Pin, scrub, snap, horizontal-pin
shaders/        WebGL fullscreen-quad shaders
svg/            SVG animations, gradient defs
transitions/    Page transitions (fade/curtain/morph + View Transitions API)
typography/     Fluid type, variable fonts, gradient numbers
utils/          easing, lerp, dom, perf, smooth-scroll, palette generator
demo/           Interactive showcase of every snippet
```

**Skill docs** (read before generating in that territory): [`gradients.skill.md`](gradients.skill.md) for color blends / mesh / holo, [`gsap.skill.md`](gsap.skill.md) for any JavaScript animation (when to use GSAP vs CSS, the free-plugin fact, ScrollTrigger/timeline/Flip patterns).

### Building a mobile app?

The `mobile/app-*` files are **full app screens** (login, paywall, onboarding, OTP, PIN, age picker, receipt, error/empty states…) and `mobile/iphone-frame.css` is a reusable iPhone shell. They're vanilla CSS+JS but written as a **visual spec you translate to Flutter or React Native**: CSS custom properties → `ThemeData`/`StyleSheet`, the class tree → the widget/component tree, the `.js` controllers → your `useState`/lifecycle logic.

---

## Conventions

Every file follows the same pattern. **No build step. No imports. No global pollution outside one explicit export.**

### JavaScript

```js
/* ============================================
   MODULE NAME — One-sentence description
   ============================================
   Usage:
     ModuleName.init('.selector', { opt: val });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { /* … */ };
  function init(target, opts) { /* … */ }
  var ModuleName = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ModuleName;
  else root.ModuleName = ModuleName;
})(typeof window !== 'undefined' ? window : this);
```

Works in browsers (`window.ModuleName`) and Node (`require('./module.js')`).

### CSS

```css
/* ============================================
   SNIPPET NAME — Description
   ============================================
   Usage: <div class="snippet-name">...</div>
   Variants: .snippet-name-variant
   ============================================ */
.snippet-name {
  --snippet-var: value;  /* every tunable as a CSS custom property */
}
```

All themeable values are exposed as `--vars` so you can re-skin without editing CSS.

### Naming

- Files: **kebab-case** (`gradient-text.css`)
- JS globals: **PascalCase** (`GradientBuilder`)
- CSS classes: **kebab-case with short prefix** (`.tcc`, `.tcc-head`, `.tcc-success`)
- CSS vars: **--prefix-var** (`--tcc-bg`)

Full conventions live in [`AGENTS.md`](AGENTS.md).

---

## Finding a snippet

### Browse interactively

Open [`demo/index.html`](demo/index.html) in your browser. Every snippet has a live preview.

### Grep the index

```bash
# Find anything related to "card 3d hover tilt parallax"
grep -i "tilt" INDEX.md

# Find brand recreations
grep -i "instagram\|stripe\|vercel" INDEX.md
```

Each `INDEX.md` entry is 2 lines: filename + tags + a one-line description. Synonyms are baked into the tags so you can search for the *vibe*.

### Decision-tree lookups

- **Anything with gradients** → [`gradients.skill.md`](gradients.skill.md) (decision tree + code patterns)
- **What folder does X live in?** → top of [`AGENTS.md`](AGENTS.md)

---

## For AI agents

This repo is designed to work seamlessly when an AI agent (Claude, Cursor, Cody, etc.) is pointed at the folder.

- **Entry point:** [`AGENTS.md`](AGENTS.md) explains everything an agent needs to know — purpose, conventions, folder layout, JS/CSS templates, how to add new snippets.
- **Lookup:** [`INDEX.md`](INDEX.md) is grep-friendly with synonym-rich tags.
- **Domain expertise:** [`gradients.skill.md`](gradients.skill.md) is a structured skill reference for the gradient subsystem (32+ files).
- **Verification:** every claim in the docs is verified — 765 files on disk, matching tagged entries in INDEX, no orphans, no broken pointers, all globals match exports.

Drop the folder into a Cursor or Claude Code project and the agent can reference any of the 765 snippets via grep, follow the exact conventions when adding new ones, and stay in sync with the index.

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the short version, or [AGENTS.md](AGENTS.md) for the full conventions.

**TL;DR:**
1. Add a file matching the JS/CSS template
2. Add a 2-line tagged entry to `INDEX.md`
3. Register a live preview in `demo/index.html`
4. Open a PR

Most-wanted patterns (open to PRs):
- More brand gradient recreations (TikTok, Pinterest, WhatsApp, Reddit, Slack, Adobe CC apps…)
- More 3D scenes (scrolling tunnel, holographic card 3D, fluid surface, glitch portal)
- AI patterns we haven't covered (artifact split with build logs, conversation tree)
- Pro-tool UIs (spreadsheet grid with formula bar, integration card grid, segmented metric tile)
- More distinctive text effects (kinetic poster typography, scroll-driven weight)

---

## Inspiration & credits

Patterns are inspired by (and reimplemented in vanilla CSS/JS from) the open-source work of:
**Magic UI · Aceternity UI · Cult UI · Origin UI · Skiper UI · Motion Primitives · Fancy Components · daisyUI · Mantine · HeroUI · Codrops · The Book of Shaders · lygia · Inigo Quilez · Patricio Gonzalez Vivo · Stripe · Vercel · Linear · Apple · Anthropic · Tympanus · Akella · Pavel Dobryakov · Bruno Simon · Three.js Journey** — and many more.

Every file's header credits its inspiration. No code is copied verbatim; patterns are re-implemented in vanilla CSS/JS to be framework-agnostic and dependency-free.

---

## License

MIT — see [LICENSE](LICENSE). Use it for anything (commercial, personal, modified, redistributed).

---

<p align="center">
  <sub>Built for the era of vibe-coded UIs. Made by people who keep finding themselves rebuilding the same things.</sub>
</p>
