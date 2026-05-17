# Frontendmaxxing INDEX — snippet lookup

> **First time here? Read [`AGENTS.md`](AGENTS.md) first** — it explains the folder's purpose, conventions, and how to add new snippets. This file is the tagged inventory; AGENTS.md is the operating manual.
>
> **How to use this file:** `grep` for keywords describing what you want.
> Each entry is two lines: `**name** path — tags | globals | deps` then a one-liner.
> Synonyms are baked into the tag strings — search for the *vibe* not the filename.
> When a match looks right, **read the actual file** for the full API and variants.
>
> Also see: [`gradients.skill.md`](gradients.skill.md) for the gradient-specific decision tree (32+ files of gradient territory).

## Quick lookup by intent

| Want… | Look at |
| --- | --- |
| Animated button (one of 30+ styles) | `blocks/buttons.css/.js`, `blocks/buttons-pack.css`, `blocks/shimmer-button.css`, `blocks/rainbow-button.css`, `blocks/pulsating-button.css` |
| Loading spinner / dots / bars | `blocks/loaders.css/.js`, `blocks/loaders-pack.css` (18 variants) |
| Confetti / celebration burst | `feedback/confetti.js` |
| Hero section with effects | `components/heroes.css/.js`, `effects/lamp.css`, `effects/spotlight-v2.css`, `backgrounds/aurora.css`, `backgrounds/grid-bg-spotlight.css` |
| Animated background | `backgrounds/animated-bg.css/.js`, `backgrounds/aurora.css`, `effects/retro-grid.css`, `effects/flickering-grid.css/.js`, `effects/animated-grid-pattern.css/.js`, `effects/meteors.css/.js`, `effects/wavy-background.css/.js`, `shaders/gradient-mesh.glsl.js` |
| Cursor follows / glow / blob / magnetic | `effects/cursor-effects.js`, `effects/cursor-glow.css/.js`, `effects/blob-cursor.css/.js`, `interactions/cursor-magnetic.js` |
| 3D scene with three.js | `3d/scene-runner.js` + any `3d/*.js` |
| Custom shader on a canvas | `shaders/runner.js` + a `shaders/*.glsl.js` |
| Marquee / ticker / infinite scroll text | `components/marquee.css/.js`, `components/marquee-3d.css` |
| Bento grid layout | `components/bento-grid.css` |
| Macy/Pinterest grid | `layout/masonry.css` |
| Sliding pill tabs | `components/animated-tabs.css/.js` |
| FAQ accordion | `components/faq.css/.js` |
| Modal / dialog | `components/modals.css/.js` |
| Toast notifications | `blocks/toasts.css/.js` |
| Tooltip | `blocks/tooltips.css/.js` |
| Pricing table + monthly/yearly toggle | `components/pricing.css`, `components/pricing-toggle.css/.js` |
| Stats counters | `components/stats.css/.js`, `data-viz/count-up.js` |
| Progress bar / ring | `blocks/loaders.css` (linear/topBar), `data-viz/progress-ring.css/.js` |
| Sparkline / mini chart | `data-viz/sparkline.js` |
| Audio bars / equalizer | `data-viz/bar-pulse.css` |
| Floating action button → row of actions | `components/family-button.css/.js` |
| iPhone-style "Dynamic Island" pill | `components/dynamic-island.css/.js` |
| macOS-style dock with magnification | `components/dock.css/.js` |
| File tree explorer | `components/file-tree.css/.js` |
| Fake terminal that types | `components/terminal.css/.js` |
| Orbiting icons around a center | `components/orbiting-circles.css` |
| Vertical scroll-progress timeline | `components/timeline-vertical-progress.css/.js`, `components/timeline.css` |
| Animated list (notifications stacking) | `components/animated-list.css/.js`, `components/notification-stack.css` |
| Card 3D tilt | `components/cards.js` (tilt), `components/cards-3d.css/.js` (parallax layers) |
| Hero parallax product grid | `components/hero-parallax.css/.js` |
| Feature grid with cursor spotlight | `components/feature-grid-hover.css/.js` |
| Glassmorphism / frosted | `effects/glassmorphism.css` |
| Gradient text / aurora text | `effects/aurora-text.css`, `typography/text-effects.css` |
| Text reveal / type-in / scramble | `effects/text-reveal.js`, `effects/text-generate.js`, `effects/text-wave.js`, `scroll/scroll-text-reveal.css/.js`, `effects/text-ripple.js` |
| Image reveal mask (clip-path entrance) | `effects/image-reveal-mask.css/.js` |
| Image distortion on hover | `effects/image-distortion-hover.css/.js` |
| Before/after image compare slider | `media/image-compare.css/.js` |
| Video autoplay on hover | `media/video-hover-preview.css/.js` |
| Spotlight reveal mouse-tracking | `effects/spotlight-reveal.css/.js`, `effects/spotlight-v2.css` |
| Border beam / rotating gradient border | `effects/border-beam.css`, `effects/shine-border.css`, `borders/animated-borders.css` |
| Glitch / retro effect | `effects/glitch.css`, `effects/retro-grid.css` |
| Noise / grain texture | `effects/noise-grain.css` |
| Morph (geometry / clip-path) | `effects/morphing.css`, `3d/cube-morph.js` |
| Particles (canvas) | `effects/particles.js`, `3d/particles-galaxy.js` |
| Sparkles / twinkle | `effects/sparkles.css/.js` |
| Meteors falling | `effects/meteors.css/.js` |
| Ripple effect (button click / ambient) | `blocks/buttons.js` (ripple), `effects/ripple.css` (ambient rings) |
| Scroll-pinned section | `scroll/scroll-pin.js`, `scroll/horizontal-pin.js` |
| Tween element via scroll position | `scroll/scroll-scrub.js` |
| Snap-to-section scroll | `scroll/scroll-snap-scenes.css/.js`, `layout/scroll-snap.css` |
| Smooth scroll | `utils/smooth-scroll.js` |
| Page transitions (fade/curtain/morph) | `transitions/page-transition-fade.css/.js`, `transitions/page-transition-curtain.css/.js`, `transitions/page-transition-morph.js`, `transitions/view-transitions.js` |
| Spring physics / motion | `animations/spring.js`, `animations/physics.js`, `utils/easing.js`, `animations/anime-recipes.js` |
| Stagger entrance | `animations/stagger.js`, `animations/anime-recipes.js` (stagger fn) |
| Scroll-trigger reveals (AOS) | `animations/aos-lite.css/.js`, `animations/scroll-animations.css/.js`, `animations/inview.css` |
| Drag-to-sort list | `interactions/sortable.js` |
| Draggable panels (macOS-style) | `components/draggable.js` |
| Swipe detection | `interactions/swipe.js` |
| Pinch / wheel zoom | `interactions/pinch-zoom.js` |
| Pull-to-refresh | `interactions/pull-to-refresh.css/.js` |
| Long press | `interactions/long-press.js` |
| Form inputs (basic + premium) | `blocks/inputs.css`, `blocks/inputs-pro.css`, `components/forms.css/.js` |
| Checkboxes / radios / toggles | `blocks/checkboxes.css`, `blocks/radios.css`, `blocks/toggles.css` |
| Range slider | `blocks/sliders.css/.js` |
| OTP code input | `blocks/inputs-pro.css` (`.inpx-otp`) |
| Success checkmark animation | `feedback/success-checkmark.css` |
| Form shake on error | `feedback/error-shake.css` |
| Sparkle burst on click | `feedback/sparkle-click.js` |
| World map with arcs | `backgrounds/world-map.css/.js` |
| Dark mode toggle | `responsive/dark-mode.css` |
| Container queries | `layout/container-queries.css` |
| Sticky header pattern | `layout/sticky-patterns.css` |
| Aspect-ratio media | `layout/aspect-ratios.css` |
| Fluid responsive type | `typography/fluid-type.css` |
| Variable fonts | `typography/variable-fonts.css` |
| SVG drawing/morph | `svg/svg-animations.css/.js` |
| Custom select dropdown | `blocks/select.css/.js` |
| Multi-select with chips | `blocks/multi-select.css/.js` |
| Autocomplete / typeahead input | `blocks/combobox.css/.js` |
| Date picker / date range picker | `blocks/date-picker.css/.js` |
| File upload (drag & drop) | `blocks/file-upload.css/.js` |
| Color picker (hue/sat/alpha/hex) | `blocks/color-picker.css/.js` |
| 2-handle range slider (price filter) | `blocks/range-slider.css/.js` |
| Star / heart / thumb rating | `blocks/star-rating.css/.js` |
| Dropdown menu (overflow / context) | `components/dropdown-menu.css/.js` |
| Drawer / side sheet / bottom sheet | `components/drawer.css/.js` |
| Command palette (⌘K spotlight) | `components/command-palette.css/.js` |
| Popover (auto-positioned floating panel) | `components/popover.css/.js` |
| Sortable / sticky-header data table | `data-viz/table.css/.js` |
| Bar chart / line chart / pie chart | `data-viz/chart-bar.js` · `data-viz/chart-line.js` · `data-viz/chart-pie.js` |
| Code block with copy + diff + line numbers | `components/code-block.css/.js` |
| Empty state ("no data", "no results", offline) | `components/empty-state.css` |
| 404 / 500 / maintenance / broken page | `components/error-states.css` |
| Navbar — many style variants (10) | `components/navbars-pack.css` (`.navp-*`) |
| Hero — many style variants (10+) | `components/heroes-pack.css` (`.heropk-*`) |
| Footer — many style variants (6) | `components/footers-pack.css` (`.ftrp-*`) |
| Card — many style variants (10) | `components/cards-pack.css` (`.cdp-*`) |
| CTA section (6 layouts) | `components/cta-sections.css` (`.ctas-*`) |
| Feature blocks (3-col, alternating, comparison…) | `components/feature-blocks.css` (`.fbk-*`) |
| Logo cloud / "trusted by" | `components/logo-cloud.css` (`.lclo-*`) |
| Team grid (about page) | `components/team-grid.css` (`.tgrid-*`) |
| Sign-in / sign-up / 2FA / forgot password screen | `components/auth-screens.css` (`.auth-*`) |
| Product card (e-commerce) | `components/product-card.css` (`.pcard-*`) |
| Cart drawer / mini cart | `components/cart-drawer.css` (uses `components/drawer.*`) |
| Quantity stepper (± buttons) | `blocks/quantity-stepper.css/.js` |
| Multi-step checkout layout | `components/checkout-flow.css` |
| Chat message bubble (sent/received/typing) | `components/chat-bubble.css` |
| Chat composer / input (auto-grow + send) | `components/chat-input.css/.js` |
| DM / conversation list (sidebar) | `components/message-list.css` |
| Threaded comments | `components/comments.css` |
| Emoji reactions row + picker | `components/reactions.css/.js` |
| Dashboard layout (sidebar + header shell) | `components/dashboard-layout.css` |
| Workspace / org switcher | `components/workspace-switcher.css/.js` |
| Filter bar (chips + search + sort + bulk) | `components/filter-bar.css` |
| Settings list (sectioned rows) | `components/settings-list.css` |
| Time picker (hh:mm + slot grid) | `blocks/time-picker.css/.js` |
| Schedule / calendar week view | `components/schedule-view.css` |
| Countdown timer (days/hours/min/sec) | `components/countdown.css/.js` |
| Image lightbox gallery | `media/lightbox.css/.js` |
| Custom HTML5 video player | `media/video-player.css/.js` |
| Audio player with waveform | `media/audio-waveform.css/.js` |
| Emoji picker (categorized + search) | `blocks/emoji-picker.css/.js` |
| Country picker w/ flag + dial code | `blocks/country-picker.css/.js` |
| Icon picker (Notion-style) | `blocks/icon-picker.css/.js` |
| Kanban board (drag-to-reorder cards) | `components/kanban-board.css/.js` |
| Full month calendar (with events) | `components/calendar-month.css/.js` |
| Mini calendar widget (sidebar) | `components/calendar-month.css` (`.calm-mini`) |
| GitHub-style contribution heatmap | `data-viz/heatmap-calendar.css/.js` |
| Resizable split panels (VSCode-style) | `layout/resizable-panels.css/.js` |
| Breadcrumbs navigation | `components/breadcrumbs.css` |
| Pagination (numeric / prev-next / load-more / infinite) | `components/pagination.css/.js` |
| Multi-step wizard layout (full screen) | `components/steps-wizard.css` |
| Rich text editor (contenteditable + toolbar) | `components/rich-text-editor.css/.js` |
| Markdown editor (split-pane preview) | `components/markdown-editor.css/.js` |
| Diff viewer (unified / split) | `components/diff-viewer.css/.js` |
| Grouped action toolbar (VSCode/Figma-style) | `components/toolbar.css` |
| Right-click context menu | `components/context-menu.css/.js` |
| Activity feed / audit log | `components/activity-feed.css` |
| Status bar (bottom IDE-style) | `components/status-bar.css` |
| Onboarding tour / spotlight walkthrough | `components/tour.css/.js` |
| Area chart (stacked or single) | `data-viz/chart-area.js` |
| Gauge / speedometer chart | `data-viz/chart-gauge.js` |
| Radar / spider chart | `data-viz/chart-radar.js` |
| Funnel chart (conversion drop-off) | `data-viz/chart-funnel.js` |
| Notification center / inbox panel | `components/notification-center.css` (uses drawer) |
| Top announcement bar (dismissible) | `components/announcement-bar.css/.js` |
| GDPR-style cookie consent banner | `components/cookie-consent.css/.js` |
| Inline alert banners (info/success/warning/danger/promo) | `components/banners.css` |
| Swipe-to-reveal list actions (iOS-style) | `interactions/swipe-actions.css/.js` |
| Instagram-style stories player + tray | `components/stories.css/.js` |
| Sticky mobile bottom CTA bar | `components/sticky-cta.css` |
| A11y skip-to-content link + sr-only utility | `responsive/skip-link.css` |
| Treemap chart | `data-viz/chart-treemap.js` |
| Sankey / flow diagram | `data-viz/chart-sankey.js` |
| Network / force-directed graph | `data-viz/chart-network.js` |
| Stat tile with sparkline + trend | `data-viz/stat-with-sparkline.css` |
| Figma-style layers panel | `components/layers-panel.css` |
| Figma-style properties / inspector panel | `components/properties-panel.css` |
| Color swatches palette | `components/swatches-palette.css` |
| Canvas zoom controls (−/+/fit/100%) | `components/zoom-controls.css/.js` |
| Phone input (country + national number) | `blocks/phone-input.css/.js` |
| JSON tree viewer (collapsible) | `blocks/json-editor.css/.js` |
| Tag input (chips + autocomplete) | `blocks/tag-input.css/.js` |
| Image cropper (drag selection + circle) | `blocks/image-crop.css/.js` |
| Achievement / Steam-style popup | `feedback/achievement-popup.css/.js` |
| Level / XP progress meter | `feedback/level-meter.css` |
| Streak flame (Duolingo-style) | `feedback/streak-flame.css` |
| Animated score counter with +N popup | `feedback/score-counter.css/.js` |
| Video/audio timeline scrubber (multi-track) | `media/timeline-scrubber.css` |
| Clip trim (in/out handles) | `media/clip-trim.css/.js` |
| **60+ preset gradients** (brand / sunset / aurora / cyberpunk / pastel / mono / etc) | `effects/gradients-pack.css` (`.grad-*`) |
| Gradient text headlines (Instagram/sunset/cosmic/apple/etc) | `effects/gradient-text.css` (`.gtxt-*`) |
| Gradient borders (static / rotating / flowing / beam / breathing / hover) | `effects/gradient-borders.css` (`.gbord-*`) |
| Mesh gradient backgrounds (Stripe-style multi-radial) | `effects/gradient-mesh.css` (`.gmesh-*`) |
| Animated gradients (slide/pulse/hue/conic-spin/drift/ribbon/shimmer) | `effects/gradient-animations.css` (`.ganm-*`) |
| Holographic / iridescent / chrome / oil-slick cards + text | `effects/gradient-holo.css` (`.holo-*`) |
| Programmatic gradient builder (random mesh / palettes / mouse-track / spin) | `utils/gradient-builder.js` (`GradientBuilder`) |
| Gradient skill reference for Claude (decision tree + cheat sheet) | `gradients.skill.md` (read first when user asks for gradients) |
| Aurora animated background (multi-blob) — landing page hero | `backgrounds/aurora-bg.css` (`.aurorabg-*`) |
| Vercel-style floating gradient orbs background | `backgrounds/gradient-orbs.css/.js` (`.orbsbg-*`, `GradientOrbs`) |
| Sky / time-of-day / nebula / mars / arctic gradient presets | `backgrounds/sky-gradients.css` (`.sky-*` 30+ presets) |
| Stripe-homepage-style animated mesh background (brand mimics) | `backgrounds/mesh-bg-stripe.css/.js` (`.meshbg-*`, `MeshBg`) |
| Morphing gradient blobs (organic shapes) | `effects/gradient-blobs.css` (`.gblob-*`) |
| Diffused colored glow / aura on any element | `effects/gradient-glow.css` (`.gglow-*`) |
| Grain / noise texture overlay (Apple-quality finish) | `effects/gradient-noise.css` (`.gnoise-*`) |
| Image fade-out / vignette / iris masks | `effects/gradient-mask.css` (`.gmask-*`) |
| Multi-color drop shadows matching element gradient | `effects/gradient-shadows.css` (`.gsh-*`) |
| Iridescent / soap bubble / CD / opal / mother-of-pearl pack | `effects/iridescent-pack.css` (`.iri-*` 15 variants) |
| Liquid metal / chrome / mercury / titanium / gold | `effects/liquid-metal.css` (`.metal-*` 13 variants) |
| Animated gradient divider / separator / vertical rule | `effects/gradient-divider.css` (`.gdiv-*`) |
| Image duotone filter (Spotify-style) | `effects/duotone.css/.js` (`.dt-*`, `Duotone`) |
| Specialty gradient buttons (Instagram/Stripe/Vercel/Holo/Conic/Shimmer) | `blocks/gradient-buttons.css` (`.gbtn-*`) |
| Gradient surface cards (solid/border/glass/mesh/spotlight/corner) | `blocks/gradient-cards.css` (`.gcard-*`) |
| Gradient progress bars + rings (striped/pulse/indeterminate/segmented) | `blocks/gradient-progress.css/.js` (`.gprog-*`, `.gpring`, `GradientProgress`) |
| Gradient badges / pills / status chips | `blocks/gradient-badges.css` (`.gbdg-*`) |
| HSL color wheel picker (conic gradient ring + lightness disc) | `components/color-wheel.css/.js` (`.cwheel-*`, `ColorWheel`) |
| Hero stat numbers with gradient fill | `typography/gradient-numbers.css` (`.gnum-*`) |
| Reusable SVG gradient `<defs>` (palette + linear/radial builder) | `svg/gradient-defs.js` (`SvgDefs.mount/.linear/.radial/.palette`) |
| Extract palette / dominant color from an image (k-means) | `utils/gradient-extract.js` (`GradientExtract.fromImage`) |
| Interactive mesh gradient editor (drag-to-position stops) | `utils/mesh-editor.js` (`MeshEditor.init`) |
| Whatamesh / Stripe-style WebGL mesh gradient shader | `shaders/mesh-gradient-wgl.glsl.js` (`MeshGradientWGLShader`) |
| Soft animated multi-color flow gradient shader | `shaders/gradient-flow.glsl.js` (`GradientFlowShader`) |
| Gradient fill INSIDE a PNG / SVG / logo (mask-image) | `effects/image-gradient.css` (`.imggrad-*`) + `effects/image-gradient.js` (`ImageGradient.apply/.mask/.fill/.inline`) |
| Multi-color gradient halo / glow WRAPPED AROUND a PNG/SVG/logo alpha | `effects/logo-glow.css` (`.logoglow-*`) + `ImageGradient.halo()` |
| Caustics — water-surface light patterns (pool / ocean / arctic / lava) | `effects/caustics.css` (`.caustics-*` 9 variants) |
| Watercolor splotchy bleed (painterly editorial) | `effects/watercolor.css` (`.wc-*` 11 palettes + paper grain) |
| Tie-dye psychedelic swirl (conic + blur) | `effects/tie-dye.css` (`.tie-dye-*` 11 variants — classic/festival/cosmic/cyberpunk/starburst/vortex/eye) |
| Stepped / banded / posterized / dithered / pixel gradients | `effects/stepped-gradient.css` (`.step-*`, `.dither-*`, `.pixel-grad-*`) |
| Crystal / gemstone / faceted gradients (diamond, ruby, opal, prism) | `effects/crystal-facets.css` (`.cryst-*` 12 variants + hex/round/pear cuts) |
| Lava lamp metaballs (gooey morphing blobs) | `effects/lava-lamp.css` (`.lava-*` 10 palettes) |
| Animated fire / flames / embers (CSS-only) | `effects/fire.css` (`.fire-*` 7 colors + ember-only + logo-fire overlay) |
| Animated smoke / fog / mist / steam | `effects/smoke.css` (`.smoke-*` 11 variants — magical/toxic/cyber/incense/dust/blood) |
| Glass refraction / chromatic aberration / RGB-split text+images | `effects/glass-refraction.css` (`.gref-text-*`, `.gref-img-*`, `.gref-pane-*`, `.gref-blob`) |
| Color-theory palette generator (complementary/triadic/tetradic/analogous/monochromatic) | `utils/palette-generator.js` (`PaletteGenerator` global) |
| Gradient avatar / identicon from a string hash (Discord/GitHub/Stripe-style) | `components/gradient-avatar.css/.js` (`.gav-*`, `GradientAvatar.init/.render/.svg`) |

---

## Snippets (tagged, alphabetical within each section)

### Animations & keyframes

**keyframes.css** `animations/keyframes.css` (CSS) — tags: animation keyframe library pulse spin float fade-in slide rotate bounce
  Core baseline keyframes used across other snippets. Pulse, spin, float, fadeIn, slideUp.

**keyframes-pack.css** `animations/keyframes-pack.css` (CSS) — tags: animation keyframe pack animate.css rubber-band jello wobble swing heartbeat tada flash bounce head-shake hinge roll light-speed zoom-soft flip slide spin-bounce sheen glow-pulse pop-in drop-in
  28 named keyframes under `.kp-*`. Modifiers: kp-fast, kp-slow, kp-infinite, kp-delay-1/2/3.

**transitions.css** `animations/transitions.css` (CSS) — tags: transition curve easing duration utility
  Pre-set CSS transition utilities (ease, swift, bouncy) you compose onto elements.

**inview.css** `animations/inview.css` (CSS) — tags: scroll inview entrance reveal stagger fade slide
  Entrance animations triggered by `.is-inview` class (paired with an IntersectionObserver).

**spring.js** `animations/spring.js` (JS, global: `Spring`, `animateSpring`) — tags: spring physics motion stiffness damping animation
  Spring-based animation with stiffness/damping/mass presets. `animateSpring(el, {from, to, ...})`.

**physics.js** `animations/physics.js` (JS, global: `Physics`) — tags: physics bounce gravity inertia momentum animation
  Bounce, gravity, friction utilities for physics-driven motion.

**scroll-animations.css** `animations/scroll-animations.css` (CSS) — tags: scroll reveal animation fade slide entrance
  CSS classes that animate as `ScrollAnim.reveal()` adds the active class.

**scroll-animations.js** `animations/scroll-animations.js` (JS, global: `ScrollAnim`) — tags: scroll reveal animation intersection-observer
  `.reveal(selector, {animation, threshold, stagger})`, `.scrub()`, `.progress()`.

**stagger.js** `animations/stagger.js` (JS, global: `Stagger`) — tags: stagger sequence list entrance grid
  Stagger child animations: `entrance`, `transform`, `gridStagger`.

**timeline.js** `animations/timeline.js` (JS, global: `Timeline`) — tags: timeline sequence parallel orchestration
  Compose animations sequentially or in parallel: `Timeline.sequence([...])`.

**aos-lite.css** `animations/aos-lite.css` (CSS) — tags: aos scroll reveal data-attribute fade zoom slide flip rotate
  Styles for `[data-aos="fade-up"]` etc. Paired with `aos-lite.js`.

**aos-lite.js** `animations/aos-lite.js` (JS, global: `AosLite`) — tags: aos scroll reveal data-attribute intersection-observer animate-on-scroll
  AOS-style: `AosLite.init()`. Attributes: data-aos, data-aos-delay/-duration/-once/-anchor.

**anime-recipes.js** `animations/anime-recipes.js` (JS, global: `AnimeRecipes`) — tags: anime tween timeline stagger easing motion zero-deps
  Vanilla anime.js-style: `tween(target, {to, duration, easing, delay})`, `timeline()`, `stagger(amount)`.

---

### Backgrounds & patterns

**patterns.css** `backgrounds/patterns.css` (CSS) — tags: background pattern stripes dots grid diagonal checker
  Repeating CSS-only background patterns.

**aurora.css** `backgrounds/aurora.css` (CSS) — tags: background aurora gradient blur conic glow hero
  Aurora gradient hero background (animated blurred conic blobs).

**animated-bg.css** `backgrounds/animated-bg.css` (CSS) — tags: background animated gradient waves spotlight interactive
  Companion styles for animated-bg.js.

**animated-bg.js** `backgrounds/animated-bg.js` (JS, global: `AnimatedBG`) — tags: background spotlight interactive-gradient waves canvas
  `AnimatedBG.spotlight()`, `.interactiveGradient()`, `.waves()`.

**grid-bg-spotlight.css** `backgrounds/grid-bg-spotlight.css` (CSS) — tags: background grid spotlight radial-mask aceternity hero dark
  Grid background with central radial spotlight mask. Variants: dots, cyan/pink/amber, light.

**world-map.css** `backgrounds/world-map.css` (CSS) — tags: world-map dots geography arcs map background
  Styles for the procedurally-drawn dotted world map (companion to world-map.js).

**world-map.js** `backgrounds/world-map.js` (JS, global: `WorldMap`) — tags: world-map continents arcs lat-lng geography aceternity dots
  Procedurally renders a dotted world map with animated arcs between lat/lng pairs.

**aurora-bg.css** `backgrounds/aurora-bg.css` (CSS) — tags: aurora bg background hero landing-page blurred-blobs multi-blob conic radial mood violet cyan sunset cosmic dawn cyber mint rose noir light fixed grain
  Multi-blob aurora animated bg. 11 color variants + fixed/strong/soft/grain modifiers. Pure CSS pseudo-elements, no JS.

**gradient-orbs.css** `backgrounds/gradient-orbs.css` (CSS) — tags: orbs floating blurred radial gradient bg vercel linear framer hero pastel cyber cosmic huge tight
  Floating blurred orb bg via `.orbsbg > .orb`. 10 palette presets + size/density modifiers.

**gradient-orbs.js** `backgrounds/gradient-orbs.js` (JS, global: `GradientOrbs`) — tags: orbs dynamic generate parallax pointer-track palette drift waapi
  Programmatically inject N orbs into a container. Supports parallax (orbs follow pointer) + WAAPI drift animations.

**sky-gradients.css** `backgrounds/sky-gradients.css` (CSS) — tags: sky gradient dawn sunrise sunset twilight blue-hour dusk night midnight aurora storm fog mars jupiter venus pastel cotton-candy arctic savanna deep-space galactic nebula time-of-day atmospheric
  30+ sky/atmosphere gradient presets — dawn through midnight + alien worlds (mars/jupiter) + nebulas. `.sky-radial` / `.sky-conic` / `.sky-animate` modifiers.

**mesh-bg-stripe.css** `backgrounds/mesh-bg-stripe.css` (CSS) — tags: mesh-gradient bg stripe vercel linear shopify figma supabase arc notion spotify anthropic discord whatamesh hero landing
  Stripe-homepage-style animated mesh gradient. 12 brand-inspired presets + light modifier.

**mesh-bg-stripe.js** `backgrounds/mesh-bg-stripe.js` (JS, global: `MeshBg`) — tags: mesh-gradient programmatic whatamesh palette regenerate animate waapi snapshot
  Build mesh gradients procedurally (random blob positions). Includes 12 palettes, regenerate(), snapshot().

---

### Borders

**animated-borders.css** `borders/animated-borders.css` (CSS) — tags: border animated gradient conic neon glow draw
  Animated border styles (gradient sweeps, neon glows, draw-in lines).

---

### Buttons

**buttons.css** `blocks/buttons.css` (CSS) — tags: button primary secondary outline ghost icon size
  Baseline button library (primary/secondary/ghost/outline/icon, sm/md/lg).

**buttons.js** `blocks/buttons.js` (JS, global: `Buttons`) — tags: button ripple magnetic submit click
  `.ripple()`, `.magnetic()`, `.submit()` (loading state).

**buttons-pack.css** `blocks/buttons-pack.css` (CSS) — tags: button pack uiverse neon glass 3d gooey soft flip slide-fill border-draw glow-arrow cta skew icon-pop pulse rounded-arrow ghost-underline split ribbon tag
  18 button variants under `.btnp-*`. Sizes btnp-sm/lg/xl.

**shimmer-button.css** `blocks/shimmer-button.css` (CSS) — tags: button shimmer conic glow magic-ui pill rainbow
  Pill button with rotating shimmer trail. Variants: ghost, light, rainbow, sm/lg.

**rainbow-button.css** `blocks/rainbow-button.css` (CSS) — tags: button rainbow gradient sliding glow magic-ui pastel vivid outline
  Animated rainbow gradient pill. Variants: outline, flat, pastel, vivid, sm/lg.

**pulsating-button.css** `blocks/pulsating-button.css` (CSS) — tags: button pulse ring breathing recording cta danger success
  Pulse-ring CTA. Variants: soft, fast, danger, success, double, sm/lg. Optional `.pulse-btn-dot` recording indicator.

**gradient-buttons.css** `blocks/gradient-buttons.css` (CSS) — tags: button gradient specialty aurora sunset cosmic cyber ocean fire mint rose gold instagram stripe vercel discord spotify holo conic shimmer glow outline ghost 3d pill rounded
  20+ gradient button variants. Includes brand recreations (Instagram/Stripe/Vercel/Discord/Spotify/Twitch/Figma) + holo (Pokémon foil) + conic (rotating border) + shimmer + glow + outline/ghost.

**gradient-cards.css** `blocks/gradient-cards.css` (CSS) — tags: card gradient surface solid border glass glow mesh corner spotlight holo cta apple stripe linear pricing feature
  Gradient-filled surface cards. 11 colors + 7 styles (solid/border/glass/glow/mesh/corner/spotlight). Holo + CTA variants.

**gradient-progress.css** `blocks/gradient-progress.css` (CSS) — tags: progress bar ring gradient striped pulse glow indeterminate segmented stack soundcloud spotify apple-health
  Gradient progress bars + rings. Variants: striped, pulse, glow, indeterminate, segmented, stack, gpring (circular).

**gradient-progress.js** `blocks/gradient-progress.js` (JS, global: `GradientProgress`) — tags: progress controller animate-to set easing waapi label
  Controller for gprog/gpring elements. `set(target, value)`, `animateTo(target, value, opts)`, `init('[data-gprog]')`.

**gradient-badges.css** `blocks/gradient-badges.css` (CSS) — tags: badge pill tag status gradient github linear stripe holo pulse live count new outline ghost soft brand
  Gradient pills + status badges. 11 colors + brand (Instagram/Discord/Spotify/Vercel) + holo + outline/ghost/soft/glow + pulse-dot live indicator + count.

---

### Cards

**cards.css** `components/cards.css` (CSS) — tags: card hover flip expand spotlight tilt grid
  Card primitives + variants (flip, expand, spotlight).

**cards.js** `components/cards.js` (JS, global: `Cards`) — tags: card flip expand tilt spotlight hover
  `.flip()`, `.expand()`, `.tilt()`, `.spotlight()`.

**cards-3d.css** `components/cards-3d.css` (CSS) — tags: card 3d tilt parallax layers aceternity depth perspective glass
  Tilt card with parallaxing inner layers (via `data-card3d-depth`). Variants: glass, flat.

**cards-3d.js** `components/cards-3d.js` (JS, global: `Cards3D`) — tags: card 3d tilt parallax mouse hover perspective layers
  `Cards3D.init('[data-card3d]', {maxTilt, perspective, scale})`. Reads `data-card3d-depth` on children.

---

### Components — Hero & Navigation

**heroes.css** `components/heroes.css` (CSS) — tags: hero video ken-burns parallax text-reveal landing
  Hero section variants (video bg, Ken Burns image, parallax layers).

**heroes.js** `components/heroes.js` (JS, global: `Heroes`) — tags: hero video ken-burns parallax text-reveal init
  `.video()`, `.kenBurns()`, `.parallaxLayers()`, `.textReveal()`.

**hero-parallax.css** `components/hero-parallax.css` (CSS) — tags: hero parallax scroll multi-row product-grid aceternity perspective
  3D-perspective stacked rows that scroll-drift in opposite directions.

**hero-parallax.js** `components/hero-parallax.js` (JS, global: `HeroParallax`) — tags: hero parallax scroll multi-row drift product-grid
  `HeroParallax.init('.hero-parallax', {rowDriftX, rotateLift})`.

**navbars.css** `components/navbars.css` (CSS) — tags: navbar nav top sticky transparent scroll-aware mega-menu hamburger
  Navbar variants.

**navbars.js** `components/navbars.js` (JS, global: `Nav`) — tags: navbar scroll-aware hamburger mega-menu active-link
  `.scrollAware()`, `.hamburger()`, `.megaMenu()`, `.activeLink()`.

**dock.css** `components/dock.css` (CSS) — tags: dock macos magnification floating-bar glass tooltip
  macOS-style dock styles. Variants: floating, vertical, glass, light.

**dock.js** `components/dock.js` (JS, global: `Dock`) — tags: dock magnification mouse-tracking macos
  `Dock.init('.dock', {baseSize, magnification, distance, axis})`.

**tabs.css** `components/tabs.css` (CSS) — tags: tabs underline keyboard accessible
  Baseline tabs with underline indicator.

**tabs.js** `components/tabs.js` (JS, global: `Tabs`) — tags: tabs keyboard accessible underline indicator
  `Tabs.init('#tabs')` — handles arrow keys.

**animated-tabs.css** `components/animated-tabs.css` (CSS) — tags: tabs pill sliding linear skiper-ui segmented
  Sliding-pill tabs (variant of `tabs.css`). Variants: soft, rounded, vertical.

**animated-tabs.js** `components/animated-tabs.js` (JS, global: `AnimatedTabs`) — tags: tabs pill sliding panel switch
  `AnimatedTabs.init('[data-atabs]', {panelsSelector, onChange})`.

---

### Components — Content

**modals.css** `components/modals.css` (CSS) — tags: modal dialog overlay morph
  Modal/dialog styles (centered, side, morph).

**modals.js** `components/modals.js` (JS, global: `Modal`) — tags: modal dialog open close trigger morph
  `.open()`, `.close()`, `.bindTriggers()`, `.morph()`.

**forms.css** `components/forms.css` (CSS) — tags: form input floating-label validation wizard password-strength
  Form layouts with floating labels and validation states.

**forms.js** `components/forms.js` (JS, global: `Forms`) — tags: form floating-label validate step-wizard password-strength
  `.floatingLabel()`, `.validate()`, `.stepWizard()`, `.passwordStrength()`.

**faq.css** `components/faq.css` (CSS) — tags: faq accordion expandable
  Accordion / FAQ styles.

**faq.js** `components/faq.js` (JS, global: `FAQ`) — tags: faq accordion single-open multi-open
  `FAQ.init('#faq', {singleOpen})`.

**testimonials.css** `components/testimonials.css` (CSS) — tags: testimonial carousel quote review
  Testimonial card + carousel styles.

**testimonials.js** `components/testimonials.js` (JS, global: `Testimonials`) — tags: testimonial carousel autoplay swipe touch
  `Testimonials.carousel('#x', {autoplay})`.

**timeline.css** `components/timeline.css` (CSS) — tags: timeline history milestones vertical
  Baseline vertical timeline styles.

**timeline-vertical-progress.css** `components/timeline-vertical-progress.css` (CSS) — tags: timeline progress scroll fill rail markers reached
  Vertical timeline with scroll-driven progress fill. Variants: right, soft, cyan, pink.

**timeline-vertical-progress.js** `components/timeline-vertical-progress.js` (JS, global: `TimelineVerticalProgress`) — tags: timeline scroll progress fill reached
  `TimelineVerticalProgress.init('[data-tlvp]', {trigger})`.

**stats.css** `components/stats.css` (CSS) — tags: stats numbers counter grid metrics
  Stats grid styles.

**stats.js** `components/stats.js` (JS, global: `Stats`) — tags: stats counter count-up scroll-trigger
  `.init()`, `.countUp()` (scroll-triggered).

**pricing.css** `components/pricing.css` (CSS) — tags: pricing plan card monthly yearly tier
  Pricing tier card styles.

**pricing-toggle.css** `components/pricing-toggle.css` (CSS) — tags: pricing toggle monthly yearly switch segmented pill
  Monthly/yearly toggle with sliding pill and price flip class.

**pricing-toggle.js** `components/pricing-toggle.js` (JS, global: `PricingToggle`) — tags: pricing toggle monthly yearly flip price-update
  `PricingToggle.init('[data-ptog]')`. Auto-updates `.ptog-price` cells via `data-ptog-<key>`.

**footers.css** `components/footers.css` (CSS) — tags: footer columns links newsletter copyright
  Footer layouts.

**marquee.css** `components/marquee.css` (CSS) — tags: marquee ticker scroll infinite text logos
  Infinite scrolling marquee rail.

**marquee.js** `components/marquee.js` (JS, global: `Marquee`) — tags: marquee scroll-velocity infinite trucknroll
  Marquee with scroll-velocity influence: `Marquee.init('.marquee', {speed, scrollInfluence})`.

**marquee-3d.css** `components/marquee-3d.css` (CSS) — tags: marquee 3d perspective tilt stack rows magic-ui
  Perspective-tilted stack of marquee rows.

**notification-stack.css** `components/notification-stack.css` (CSS) — tags: notification stack toast feed list
  Stacked notification list styles.

**animated-list.css** `components/animated-list.css` (CSS) — tags: list animated cycling notification stacking magic-ui
  Auto-cycling list with stacking entrance.

**animated-list.js** `components/animated-list.js` (JS, global: `AnimatedList`) — tags: list animated cycling items entrance magic-ui
  `AnimatedList.init('.animated-list', {delay, maxVisible, loop, items: [{title, meta, icon}]})`.

**draggable.js** `components/draggable.js` (JS, global: `Draggable`) — tags: draggable panel window macos stacking
  macOS-style draggable panels: `Draggable.init('.panel', {handle, stack})`.

**bento-grid.css** `components/bento-grid.css` (CSS) — tags: bento grid asymmetric layout primitive apple magic-ui
  Asymmetric grid with sized cells: bento-sm/md/lg/wide/tall/xl/full.

**file-tree.css** `components/file-tree.css` (CSS) — tags: file-tree explorer sidebar vscode collapsible folder
  Collapsible nested file/folder tree. Variants: compact, light.

**file-tree.js** `components/file-tree.js` (JS, global: `FileTree`) — tags: file-tree tree nested data renderer
  Bind to markup or pass `data: [{name, type, children}]`. Auto-renders icons by file extension.

**terminal.css** `components/terminal.css` (CSS) — tags: terminal console fake typed dots traffic-light
  Fake terminal styles. Variants: light, mono, rounded-lg.

**terminal.js** `components/terminal.js` (JS, global: `Terminal`) — tags: terminal type lines cmd output ok error loop
  `Terminal.init('[data-terminal]', {lines: [{type, text, delay}], loop, speed})`.

**orbiting-circles.css** `components/orbiting-circles.css` (CSS) — tags: orbit revolve rings center icons magic-ui
  Items revolving around a center. Multiple rings supported.

**feature-grid-hover.css** `components/feature-grid-hover.css` (CSS) — tags: feature grid hover spotlight stripe linear cult-ui radial
  Grid where each cell shows a radial spotlight that follows the cursor.

**feature-grid-hover.js** `components/feature-grid-hover.js` (JS, global: `FeatureGridHover`) — tags: feature grid spotlight cursor radial cursor-track
  `FeatureGridHover.init('[data-fgh]')` — sets `--cell-x` / `--cell-y` on each cell.

**dynamic-island.css** `components/dynamic-island.css` (CSS) — tags: dynamic-island iphone pill notification expand cult-ui
  Expanding pill notification. Variants: static, floating, bottom.

**dynamic-island.js** `components/dynamic-island.js` (JS, global: `DynamicIsland`) — tags: dynamic-island toggle expand collapse pill notification
  `DynamicIsland.init('.di', {autoCollapse, onExpand, onCollapse})`.

**family-button.css** `components/family-button.css` (CSS) — tags: fab floating-action-button morph cult-ui expand staggered icon-menu
  FAB that expands into a row of staggered action buttons. Variants: up, down, glass, sm, lg.

**family-button.js** `components/family-button.js` (JS, global: `FamilyButton`) — tags: fab morph open close outside-click action-menu
  `FamilyButton.init('.fam', {closeOnOutside, onAction})`.

---

### Cursors & Hover

**cursor-effects.js** `effects/cursor-effects.js` (JS, global: `CursorFX`) — tags: cursor magnetic trail spotlight custom
  `.magnetic()`, `.trail()`, `.spotlight()`, `.customCursor()`.

**cursor-glow.css** `effects/cursor-glow.css` (CSS) — tags: cursor glow spotlight dark hero linear vercel radial
  Cursor-following radial glow for dark sections. Variants: soft, tight, cyan/pink/amber/mint, rect.

**cursor-glow.js** `effects/cursor-glow.js` (JS, global: `CursorGlow`) — tags: cursor glow track lerp radial mouse
  `CursorGlow.init('[data-cursor-glow]', {lerp})` — sets `--cg-x`/`--cg-y` with smoothing.

**blob-cursor.css** `effects/blob-cursor.css` (CSS) — tags: cursor blob gooey trail mix-blend-mode awwwards
  Gooey blob cursor with SVG goo filter. `.is-near`, `.is-press` states.

**blob-cursor.js** `effects/blob-cursor.js` (JS, global: `BlobCursor`) — tags: cursor blob gooey trail follow custom
  `BlobCursor.init({color, size, hoverSelector, trailLerp, dotLerp})`.

**cursor-magnetic.js** `interactions/cursor-magnetic.js` (JS, global: `CursorMagnetic`) — tags: magnetic target hover spring smooth pull
  Targets pulled toward cursor with spring smoothing. `data-magnetic-child` for parallax children.

---

### Effects — surfaces & finishes

**glassmorphism.css** `effects/glassmorphism.css` (CSS) — tags: glass frosted blur backdrop-filter card overlay
  Glassmorphic surface utility (`.glass`, `.glass-dark`, etc.).

**gradients.css** `effects/gradients.css` (CSS) — tags: gradient utility linear radial conic mesh
  Reusable gradient utility classes.

**shadows.css** `effects/shadows.css` (CSS) — tags: shadow box-shadow neumorphism depth elevation soft
  Shadow utilities (soft, sharp, neumorph).

**noise-grain.css** `effects/noise-grain.css` (CSS) — tags: noise grain film texture svg overlay
  Subtle film grain overlay via SVG turbulence.

**glitch.css** `effects/glitch.css` (CSS) — tags: glitch rgb-split datamosh distortion retro
  Glitch / RGB-split text/element effect.

**morphing.css** `effects/morphing.css` (CSS) — tags: morph blob shape-shifting border-radius
  Morphing blob / shape transitions via animated border-radius.

**post-processing.css** `effects/post-processing.css` (CSS) — tags: post-processing filter vignette grain bloom-fake
  CSS-only "post-processing" looks (vignette, grain, fake bloom).

**hover-effects.css** `effects/hover-effects.css` (CSS) — tags: hover lift glow tilt rise spread
  Hover utility classes for lift/glow/tilt.

**gradient-blobs.css** `effects/gradient-blobs.css` (CSS) — tags: blob organic morph border-radius gradient haikei codrops floating aurora sunset cyber pastel cosmic glow blurred
  Morphing organic shapes with gradient fills. 10 color variants + sizes (sm/md/lg/xl/full) + spin/glow/blurred modifiers.

**gradient-glow.css** `effects/gradient-glow.css` (CSS) — tags: glow halo aura colored-shadow vercel apple cta button card pulse spin floor hover
  Diffused colored auras via box-shadow. Variants: soft, strong, huge, pulse, spin (conic halo), floor (under-glow), hover-only.

**gradient-noise.css** `effects/gradient-noise.css` (CSS) — tags: noise grain texture overlay svg-turbulence apple stripe film polished fine coarse warm cool color animated
  Grain texture overlay for gradients. Intensities light/medium/heavy/extreme + warm/cool/color modes + animated.

**gradient-mask.css** `effects/gradient-mask.css` (CSS) — tags: mask fade-out vignette iris diamond image scroll-fade edges top bottom left right radial spotlight apple
  Image & content fade masks via mask-image. 15+ variants: top/bottom/left/right, both-v/h, vignette, iris, diamond, soft-edges, scroll-fade.

**gradient-shadows.css** `effects/gradient-shadows.css` (CSS) — tags: shadow colored multi-color drop-shadow button card vercel shadcn aurora sunset cosmic cyber rose mint fire gold violet
  Multi-color box-shadows matching element gradient. 11 color presets + soft/strong/glow/floor/around + hover/filter variants.

**iridescent-pack.css** `effects/iridescent-pack.css` (CSS) — tags: iridescent holographic soap-bubble cd dvd oil-slick pearl mother-of-pearl opal prism rainbow-stripe foil mirror-ball aurora-foil mercury chrome pokemon-card y2k
  15 iridescent variants — soap, CD, DVD, oil-thick, pearl, opal, holo-card, prism, foil, mirror-ball, aurora-foil, mercury-rainbow, etc.

**liquid-metal.css** `effects/liquid-metal.css` (CSS) — tags: metal chrome silver mercury titanium platinum rose-gold gold-liquid copper bronze gunmetal obsidian iridescent-chrome brushed terminator-t1000 apple-silver y2k
  13 metallic surface variants. Modifiers: anim (flow), tilt (mouse-tracked), sheen (sweeping highlight).

**gradient-divider.css** `effects/gradient-divider.css` (CSS) — tags: divider separator rule line gradient animated flowing horizontal vertical fade dotted double glow text-with-line
  Animated gradient dividers (hr replacement). 11 colors + thicknesses + fade/dotted/double/glow/text/vertical modifiers.

**duotone.css** `effects/duotone.css` (CSS) — tags: duotone image filter two-tone spotify apple-music vox editorial cyber sunset noir vaporwave spotify-green classic-blue toxic grape coral sepia
  20 duotone presets via background-blend-mode. Strengths soft/strong/extreme + hover-reveal variant.

**duotone.js** `effects/duotone.js` (JS, global: `Duotone`) — tags: duotone image svg-filter true-duotone feColorMatrix feComponentTransfer palette dynamic
  True SVG-filter-based duotone (sharper than blend-mode CSS). `Duotone.apply(el, {palette, dark, light})` + `init('[data-duotone]')`.

**image-gradient.css** `effects/image-gradient.css` (CSS) — tags: image-gradient mask-image png svg logo icon wordmark gradient-fill silhouette apple-product-color vercel-logo linear-icon brand contain cover holo chrome shimmer two-tone aurora cosmic sunset cyber holo wrap-around png-fill svg-fill logo-fill
  Fill a PNG/SVG/logo with a gradient via `mask-image: var(--src)`. 20+ palette presets (aurora, cosmic, instagram, stripe, vercel, holo, chrome, etc.) + sizes xs→hero + wordmark/banner aspect ratios + anim/spin/hover/shimmer modifiers + two-tone (gradient blend over original) + wrap mode for existing `<img>`.

**image-gradient.js** `effects/image-gradient.js` (JS, global: `ImageGradient`) — tags: image-gradient logo png svg inline-svg external-svg fetch mask-image fill-attribute auto-detect halo drop-shadow apply init data-attribute palette method-auto-mask-fill-inline-halo
  Auto-detects PNG / external SVG / inline SVG and applies the right technique. `apply()` chooses; `.mask()` for PNG, `.fill()` for inline SVG (injects `<defs>` + rewires fills/strokes), `.inline()` fetches external SVG and inlines it, `.halo()` for drop-shadow chain. 22 palettes built-in. `init('[data-img-gradient]')` reads data attrs.

**logo-glow.css** `effects/logo-glow.css` (CSS) — tags: logo-glow halo png-glow svg-glow drop-shadow-chain multi-color brand reveal vercel apple keynote neon rim sticker floor pulse hover hue-rotate alpha-channel
  Multi-color gradient halo following the alpha channel of any logo/PNG/SVG via stacked `drop-shadow()` filters. 18 color presets + intensity (soft/strong/extreme/halo) + behaviors (pulse, hover, floor under-glow, rim light, sticker neon, rotating hue).

**caustics.css** `effects/caustics.css` (CSS) — tags: caustics water pool ocean swimming-pool sunlight refraction shadertoy aquarium tropical arctic sunset night emerald mono rainbow underwater overlay deep
  Pure-CSS water-surface light pattern via animated overlapping radial gradients with screen blend. 9 variants (pool/tropical/ocean/arctic/sunset/night/emerald/mono/rainbow) + still/overlay/deep/fast/slow modifiers. Standalone `.caustics-layer` overlay for any image.

**watercolor.css** `effects/watercolor.css` (CSS) — tags: watercolor paint splotch bleed editorial squarespace pinterest moodboard painterly artistic bloom spring sunset ocean meadow rose cosmic mono pastel citrus bruise paper-grain
  Soft splotchy gradient bleeds. 11 palette variants. Modifiers: paper grain overlay, edges-soft/-hard, anim drift, dense/sparse splotch counts. `.wc-blob` for inline text highlights.

**tie-dye.css** `effects/tie-dye.css` (CSS) — tags: tie-dye spiral swirl psychedelic 60s festival rainbow conic-gradient blur cosmic cyberpunk fire ocean forest pastel mono starburst vortex eye-of-storm
  Swirling conic gradients with heavy blur. 11 variants (classic/festival/pastel/fire/ocean/forest/cosmic/mono/cyberpunk/starburst/vortex/eye). Spin/pulse animations + soft/sharp/crisp blur control + mask fade-to-transparent.

**stepped-gradient.css** `effects/stepped-gradient.css` (CSS) — tags: stepped banded posterized riso risograph dithered pixel pixel-art 8-bit game-boy nes cga retro-game cmyk poster band-count radial conic vertical horizontal diagonal hard-stops
  3 distinct techniques. `.step-*` 10 palettes + 5 band counts + radial/conic. `.dither-*` 7 SVG-noise dither presets. `.pixel-grad-*` quantized blocks (NES/CGA/Game Boy/cosmic/sunset/mint).

**crystal-facets.css** `effects/crystal-facets.css` (CSS) — tags: crystal gem gemstone diamond ruby sapphire emerald amethyst topaz opal onyx rose-quartz aquamarine fluorite prism low-poly faceted jewelry art-deco shine hex round pear cut
  Faceted geometric gradients. 12 gemstone variants + low-poly. Cuts via clip-path: hex / round / pear. Modifiers: anim (pulse), spin, shine (sweeping highlight).

**lava-lamp.css** `effects/lava-lamp.css` (CSS) — tags: lava-lamp metaballs gooey blob morphing filter-blur-contrast retro 70s ios-memory aurora acid ocean cosmic mint fire ice mono rainbow chimney
  Gooey morphing blobs via `filter: blur(20px) contrast(20)` metaballs trick. 10 color variants + rainbow (each blob different color) + density/speed/bordered modifiers. Includes `.lava-stack` pattern for content overlays.

**fire.css** `effects/fire.css` (CSS) — tags: fire flame ember bonfire dragonfire witchfire campfire blue-flame green-flame purple cold-fire pink cotton-candy rainbow ember-only logo-on-fire flicker rising
  Pure-CSS animated flames + embers. 7 color variants (orange/blue/green/purple/pink/cold/rainbow) + sizes sm→xl + ember-only mode + `.fire-overlay` for putting flames behind a logo/text.

**smoke.css** `effects/smoke.css` (CSS) — tags: smoke fog mist steam haze cloud cinematic atmospheric horror theatrical magical toxic cyber chimney incense dust desert blood ground-fog drift rising
  Drifting rising smoke puffs. 11 variants (mist/fog/steam/toxic/magical/cyber/chimney/incense/dust/blood). Modifiers: bottom-anchored ground fog, dense/sparse, speed control. Pairs with .fire for chimney scenes.

**glass-refraction.css** `effects/glass-refraction.css` (CSS) — tags: glass refraction chromatic-aberration rgb-split prism spectral apple-vision-pro glitch vaporwave acid rainbow text image svg pane edge-bleed blob chromatic
  Chromatic aberration / RGB-split effect. 6 text variants + 4 image variants (drop-shadow chain) + glass pane with spectral edge bleed (5 variants) + `.gref-blob` animated chromatic ball. Includes glitch animation.

---

### Effects — backgrounds & overlays

**spotlight-reveal.css** `effects/spotlight-reveal.css` (CSS) — tags: spotlight dot-grid mask mouse-track reveal
  Dot pattern with mouse-tracking radial spotlight reveal.

**spotlight-reveal.js** `effects/spotlight-reveal.js` (JS, global: `SpotlightReveal`) — tags: spotlight dot mask mouse lerp
  `SpotlightReveal.init('#x', {radius, lerp})`.

**spotlight-v2.css** `effects/spotlight-v2.css` (CSS) — tags: spotlight blob radial drift aceternity hero soft
  Soft drifting radial spotlight blob (no dot grid). Distinct from spotlight-reveal.

**lamp.css** `effects/lamp.css` (CSS) — tags: lamp cone hero conic-gradient glow overhead aceternity
  Overhead lamp glow with two cones + bar + halo + content slot. Variants: cyan, pink, amber, mint, tall, animate.

**aurora-text.css** `effects/aurora-text.css` (CSS) — tags: text gradient aurora animated sliding hero
  Animated multi-stop gradient text fill. Variants: vivid, pastel, slow, fast, glow.

**border-beam.css** `effects/border-beam.css` (CSS) — tags: border beam rotating conic gradient magic-ui
  Rotating gradient beam around a border. Variants: thin, thick, slow, fast, rainbow.

**shine-border.css** `effects/shine-border.css` (CSS) — tags: border shine conic gradient breathing magic-ui
  Gradient border that breathes. Variants: soft, vivid, double.

**ripple.css** `effects/ripple.css` (CSS) — tags: ripple rings concentric ambient pulse magic-ui
  Concentric expanding rings (ambient pulse effect).

**dot-pattern.css** `effects/dot-pattern.css` (CSS) — tags: pattern dots radial-gradient background magic-ui fade
  Repeating dot background. Variants: sm/md/lg/xl, fade radial/top/bottom, stagger, accent.

**grid-pattern.css** `effects/grid-pattern.css` (CSS) — tags: pattern grid square lines background magic-ui dashed fade
  Repeating grid lines background. Variants: dashed, cross, iso, fade radial/top/side.

**retro-grid.css** `effects/retro-grid.css` (CSS) — tags: grid retro perspective synthwave 80s floor horizon magic-ui
  80s-style perspective grid floor. Variants: purple, amber, cyan, slow, fast.

**flickering-grid.css** `effects/flickering-grid.css` (CSS) — tags: grid flicker canvas magic-ui pattern
  Wrapper styles for canvas-based flickering grid.

**flickering-grid.js** `effects/flickering-grid.js` (JS, global: `FlickeringGrid`) — tags: grid flicker canvas random cells animated
  `FlickeringGrid.init('.flickering-grid', {squareSize, gridGap, flickerChance, color, maxOpacity})`.

**animated-grid-pattern.css** `effects/animated-grid-pattern.css` (CSS) — tags: grid pattern pulse highlight cells magic-ui
  Grid background with SVG cells pulsing on top.

**animated-grid-pattern.js** `effects/animated-grid-pattern.js` (JS, global: `AnimatedGridPattern`) — tags: grid pulse highlight cells random animated
  `AnimatedGridPattern.init('.animated-grid-pattern', {numSquares, cellSize, duration, maxOpacity})`.

**meteors.css** `effects/meteors.css` (CSS) — tags: meteors streaks falling diagonal background magic-ui aceternity
  Falling diagonal streaks. Variants: dense, sparse, slow, fast, amber, mint, rose.

**meteors.js** `effects/meteors.js` (JS, global: `Meteors`) — tags: meteors spawn random falling streaks
  `Meteors.init('.meteors', {count, minDuration, maxDuration})` — injects spans.

**wavy-background.css** `effects/wavy-background.css` (CSS) — tags: wavy background canvas waves blur aceternity
  Wrapper styles for canvas wavy background.

**wavy-background.js** `effects/wavy-background.js` (JS, global: `WavyBackground`) — tags: wavy background canvas sin-noise waves blur
  `WavyBackground.init('.wavy-bg', {colors, waveWidth, speed, opacity, amplitude})`.

**sparkles.css** `effects/sparkles.css` (CSS) — tags: sparkles twinkle dots magic aceternity hero
  Wrapper + dot styles for randomized twinkles.

**sparkles.js** `effects/sparkles.js` (JS, global: `Sparkles`) — tags: sparkles twinkle dots randomized hero aceternity
  `Sparkles.init('.sparkles', {count, minSize, maxSize, minDuration, maxDuration, color})`.

**animated-beam.css** `effects/animated-beam.css` (CSS) — tags: beam connector svg flowing-gradient magic-ui
  Wrapper + path styles for SVG beam connecting two DOM nodes.

**animated-beam.js** `effects/animated-beam.js` (JS, global: `AnimatedBeam`) — tags: beam connector svg curved bezier flowing-gradient multi-beam magic-ui
  `AnimatedBeam.init('.container', {from, to, curvature, duration, beams: [...]})`.

---

### Effects — Text & images

**text-effects.css** `typography/text-effects.css` (CSS) — tags: text gradient outline shadow underline strike highlight
  Text styling utilities (gradient fill, outlined, shadowed).

**text-animations.css** `typography/text-animations.css` (CSS) — tags: text animation type-in glitch wave reveal
  CSS-only text animations.

**text-reveal.js** `effects/text-reveal.js` (JS, global: `TextReveal`) — tags: text split typewriter scramble reveal character
  `.split()`, `.typewriter()`, `.scramble()` — char-level effects.

**text-wave.js** `effects/text-wave.js` (JS, global: `TextWave`) — tags: text wave shimmer scan character-by-character
  Character-by-character shimmer/scan effect.

**text-generate.js** `effects/text-generate.js` (JS, global: `TextGenerate`) — tags: text word-by-word fade-in streaming aceternity reveal
  Word-by-word fade-in (companion to char-based TextWave). Start modes: auto/inview/manual.

**text-ripple.js** `effects/text-ripple.js` (JS, global: `TextRipple`) — tags: text ripple click wave color scale propagation
  Wave of color+scale across letters from click point. Modes: click/hover.

**distortion.js** `effects/distortion.js` (JS, global: `Distortion`) — tags: distortion ripple stretch noise warp
  `.ripple()`, `.stretch()`, `.noise()`.

**parallax.js** `effects/parallax.js` (JS, global: `Parallax`) — tags: parallax scroll layers mouse tilt
  `.scroll()`, `.layers()`, `.mouse()`, `.tilt()`.

**particles.js** `effects/particles.js` (JS, global: `Particles`) — tags: particles canvas connect network points hero
  Canvas particle system. Presets: network, snow, dust.

**image-reveal-mask.css** `effects/image-reveal-mask.css` (CSS) — tags: image reveal mask clip-path entrance codrops bars iris diamond
  Clip-path image entrance. Variants: up/down/left/right, iris, diamond, bars.

**image-reveal-mask.js** `effects/image-reveal-mask.js` (JS, global: `ImageRevealMask`) — tags: image reveal intersection-observer once threshold
  `ImageRevealMask.init('[data-irm]', {threshold, once, delay})`.

**image-distortion-hover.css** `effects/image-distortion-hover.css` (CSS) — tags: image distortion hover svg-filter warp rgb chromatic codrops
  Companion styles. Variants: soft, strong, rgb.

**image-distortion-hover.js** `effects/image-distortion-hover.js` (JS, global: `ImageDistortionHover`) — tags: image distortion svg-filter feTurbulence feDisplacementMap hover codrops
  `ImageDistortionHover.init('[data-idh]', {baseFrequency, scaleMax})` — injects a shared SVG filter.

---

### Form controls

**inputs.css** `blocks/inputs.css` (CSS) — tags: input field float underline gradient glass solid icon button hint error success
  Baseline input variants: float, underline, gradient, glass, solid. Slots: `.inp-ico/-btn/-eye/-suffix`.

**inputs-pro.css** `blocks/inputs-pro.css` (CSS) — tags: input premium aurora neon pill-icon tag chip counter otp search-bar currency segmented
  9 premium variants under `.inpx-*`: aurora (conic), neon, pill-icon, tag, counter, otp, search-bar, currency, segmented.

**checkboxes.css** `blocks/checkboxes.css` (CSS) — tags: checkbox draw fill pop flip cross animated
  5 animated checkbox variants under `.cbx-*`. Colors accent/success/danger/amber, sizes sm/lg/xl, rounded/square.

**radios.css** `blocks/radios.css` (CSS) — tags: radio classic fill ring pop slide group card segmented
  4 radio variants + sliding `.rdo-group` + `.rdo-card` selectable card. Colors accent/success/danger.

**toggles.css** `blocks/toggles.css` (CSS) — tags: toggle switch ios square pill icon soft stretchy vertical
  6 toggle variants under `.tgl-*`. Colors accent/cyan/pink/amber, sizes sm/lg/xl.

**sliders.css** `blocks/sliders.css` (CSS) — tags: slider range thick thin glow vertical segments range-input
  Range slider variants with `--sld-progress`. Colors pink/cyan/amber/mint/rose, sizes thick/thin.

**sliders.js** `blocks/sliders.js` (JS, global: `Sliders`) — tags: slider range value bubble sync
  `Sliders.init('[data-sld]', {formatValue, onInput, onChange})` — syncs `--sld-progress` + `.sld-value`.

---

### Layout

**grid-systems.css** `layout/grid-systems.css` (CSS) — tags: grid columns 12-col layout responsive
  CSS grid utility classes.

**flexbox-patterns.css** `layout/flexbox-patterns.css` (CSS) — tags: flex flexbox center stack split row column
  Common flexbox layout patterns.

**scroll-snap.css** `layout/scroll-snap.css` (CSS) — tags: scroll snap proximity mandatory section
  Native CSS scroll-snap utilities.

**masonry.css** `layout/masonry.css` (CSS) — tags: masonry pinterest grid columns gallery
  Masonry/Pinterest-style grid (CSS columns).

**container-queries.css** `layout/container-queries.css` (CSS) — tags: container-query responsive component-level @container
  Container query helpers for component-level responsive design.

**sticky-patterns.css** `layout/sticky-patterns.css` (CSS) — tags: sticky header sidebar offset position
  Sticky header / sidebar patterns.

**aspect-ratios.css** `layout/aspect-ratios.css` (CSS) — tags: aspect-ratio 16-9 4-3 1-1 video media
  Aspect-ratio utility classes for media containers.

**fade-masks.css** `layout/fade-masks.css` (CSS) — tags: fade mask edge gradient overlay marquee
  Edge-fade overlays for marquees/lists (top/bottom/sides).

**horizontal-scroll.js** `layout/horizontal-scroll.js` (JS, global: `HorizontalScroll`) — tags: scroll horizontal wheel-hijack
  Vertical-to-horizontal scroll conversion via wheel hijack.

---

### Loaders & indicators

**loaders.css** `blocks/loaders.css` (CSS) — tags: loader spinner progress skeleton bar top
  Baseline loaders (spinner, skeleton, progress, top-bar).

**loaders.js** `blocks/loaders.js` (JS, global: `Loaders`) — tags: loader skeleton progress top-bar
  `.skeleton()`, `.progress()`, `.topBar()`.

**loaders-pack.css** `blocks/loaders-pack.css` (CSS) — tags: loader pack dots bounce pulse fade snake bars eq spinner conic dual orbit cube fold flip pacman heart ripple blob
  18 loader variants under `.ldr-*`. Color/size modifiers: ldr-accent/cyan/pink/mint/amber/mono · ldr-sm/lg/xl.

---

### Marquee / Ticker (cross-referenced — also under Components)

(See `components/marquee.*` and `components/marquee-3d.css` above.)

---

### Media (image / video)

**image-compare.css** `media/image-compare.css` (CSS) — tags: image-compare before-after slider drag split handle
  Before/after slider. Variants: vertical, thin, no-handle.

**image-compare.js** `media/image-compare.js` (JS, global: `ImageCompare`) — tags: image-compare before-after drag axis keyboard
  `ImageCompare.init('[data-ic]', {start, axis, hoverPreview})` — supports keyboard arrows.

**video-hover-preview.css** `media/video-hover-preview.css` (CSS) — tags: video hover preview tile poster autoplay zoom dim
  Tile that autoplays a video on hover. Variants: rounded, zoom, dim.

**video-hover-preview.js** `media/video-hover-preview.js` (JS, global: `VideoHoverPreview`) — tags: video hover preview autoplay lazy debounce
  `VideoHoverPreview.init('[data-vhp]', {muted, loop, startDelay})` — lazy-injects `<video>`.

---

### Micro-interactions & feedback

**interactions.css** `micro/interactions.css` (CSS) — tags: like copy counter toggle hamburger micro click
  CSS for micro-interactions (like-heart fill, copy ✓, hamburger to X).

**interactions.js** `micro/interactions.js` (JS, global: `Micro`) — tags: toggle like copy counter hamburger count-up
  `.toggle()`, `.like()`, `.copy()`, `.counter()`, `.hamburger()`, `.countUp()`.

**confetti.js** `feedback/confetti.js` (JS, global: `Confetti`) — tags: confetti burst canvas celebration party cannon
  `Confetti.burst({x, y, count, spread, colors, shapes})`, `.cannon('left'|'right'|'top'|'center')`.

**sparkle-click.js** `feedback/sparkle-click.js` (JS, global: `SparkleClick`) — tags: sparkle click burst point particles celebrate
  `SparkleClick.attach(target)` or `SparkleClick.burst(x, y)`.

**success-checkmark.css** `feedback/success-checkmark.css` (CSS) — tags: checkmark success draw svg circle stroke green
  Animated draw-on green checkmark. Variants: lg, sm, amber/cyan/purple/rose, fill, spin.

**error-shake.css** `feedback/error-shake.css` (CSS) — tags: error shake invalid form validation horizontal vertical tilt ring
  Shake-on-invalid animation. Variants: h/v/tilt/soft. Plus `.err-ring` red focus.

---

### Modals, Toasts, Tooltips, Badges

**toasts.css** `blocks/toasts.css` (CSS) — tags: toast notification snackbar success error warning info
  Toast styles.

**toasts.js** `blocks/toasts.js` (JS, global: `Toast`) — tags: toast notification show dismiss success error warning info
  `Toast.show()`, `.success()`, `.error()`, `.warning()`, `.info()`, `.dismiss()`.

**tooltips.css** `blocks/tooltips.css` (CSS) — tags: tooltip hover popover css-only top bottom
  CSS-only tooltips via `data-tooltip`.

**tooltips.js** `blocks/tooltips.js` (JS, global: `Tooltip`) — tags: tooltip popover positioned floating
  `Tooltip.init()`, `.attach(el, content, opts)`.

**badges.css** `blocks/badges.css` (CSS) — tags: badge pill tag chip status dot indicator
  Badge / chip variants.

**avatars.css** `blocks/avatars.css` (CSS) — tags: avatar profile image stack overlap fallback
  Avatar single + stacked styles.

**gradient-avatar.css** `components/gradient-avatar.css` (CSS) — tags: avatar identicon gradient discord github stripe boring-avatars username initials linear conic radial mesh stripes dots rings spiral holo squircle hex ring story instagram-story status-dot online offline busy pile group
  Gradient-fill avatar styles. 9 styles (linear/radial/conic/mesh/stripes/dots/rings/spiral/holo) + 6 sizes + shapes (circle/square/rounded/squircle/hex) + ring (Instagram-story) + status-dot + pile group.

**gradient-avatar.js** `components/gradient-avatar.js` (JS, global: `GradientAvatar`) — tags: avatar identicon hash deterministic fnv string-hash discord github stripe boring-avatars username email initials data-attribute svg data-uri standalone palette
  Hashes a string (username/email/id) into a deterministic gradient + initials. `init('[data-gav]')` for batch DOM application, `render(el, seed, opts)` for single, `svg(seed, opts)` returns standalone SVG string + `svgDataUri()` for `<img src="data:…">` usage.

**dividers.css** `blocks/dividers.css` (CSS) — tags: divider separator rule line dashed gradient text
  Divider patterns (line, with text, dashed, gradient).

---

### Responsive / theming

**breakpoints.css** `responsive/breakpoints.css` (CSS) — tags: breakpoint responsive media-query mobile tablet desktop
  Breakpoint utility variables and helpers.

**dark-mode.css** `responsive/dark-mode.css` (CSS) — tags: dark-mode theme tokens prefers-color-scheme
  Dark mode token system (`data-theme="dark"` and `prefers-color-scheme`).

**mobile-patterns.css** `responsive/mobile-patterns.css` (CSS) — tags: mobile touch safe-area bottom-nav drawer
  Mobile-first patterns (safe-area, bottom nav, swipe panels).

**viewport.css** `responsive/viewport.css` (CSS) — tags: viewport units dvh svh lvh height mobile
  Dynamic viewport unit helpers (dvh/svh/lvh).

---

### Scroll-driven motion

**scroll-pin.js** `scroll/scroll-pin.js` (JS, global: `ScrollPin`) — tags: scroll pin sticky progress section
  Sticky-pin a section, expose progress via `--sp-progress` and onProgress callback.

**scroll-scrub.js** `scroll/scroll-scrub.js` (JS, global: `ScrollScrub`) — tags: scroll scrub tween scroll-position data-attribute
  Tween element {opacity,x,y,scale,rotate,blur} via scroll. Uses `data-scrub-from`/`-to`/`-start`/`-end`.

**scroll-snap-scenes.css** `scroll/scroll-snap-scenes.css` (CSS) — tags: scroll snap scene fullpage entrance stagger
  Full-page snap scenes with inner stagger when active.

**scroll-snap-scenes.js** `scroll/scroll-snap-scenes.js` (JS, global: `ScrollSnapScenes`) — tags: scroll snap scene fullpage intersection-observer pagination
  `ScrollSnapScenes.init('.snap-scenes', {pagination, threshold})`.

**horizontal-pin.js** `scroll/horizontal-pin.js` (JS, global: `HorizontalPin`) — tags: scroll horizontal pin sticky vertical-to-horizontal panels
  Sticky-pin a section and translate inner `.hpin-track` horizontally with scroll.

**scroll-text-reveal.css** `scroll/scroll-text-reveal.css` (CSS) — tags: text scroll reveal word line color mode codrops
  Styles for word/line scroll reveals. Variants: color gradient, rise.

**scroll-text-reveal.js** `scroll/scroll-text-reveal.js` (JS, global: `ScrollTextReveal`) — tags: text scroll reveal word line threshold codrops
  Splits text into words, activates them as they cross the viewport threshold.

---

### Smooth scrolling

**smooth-scroll.js** `utils/smooth-scroll.js` (JS, global: `SmoothScroll`) — tags: smooth-scroll lenis lerp inertia snap
  Lenis-like smooth scroller with snap points.

---

### Page transitions

**page-transition-fade.css** `transitions/page-transition-fade.css` (CSS) — tags: page-transition fade barba route navigation
  Fade-in/out classes for page swaps.

**page-transition-fade.js** `transitions/page-transition-fade.js` (JS, global: `PageTransitionFade`) — tags: page-transition fade fetch DOMParser link-intercept SPA-like
  Intercept `a[data-pt]`, fade-swap container, push state.

**page-transition-curtain.css** `transitions/page-transition-curtain.css` (CSS) — tags: page-transition curtain wipe overlay directional
  Directional wipe overlay (ltr/rtl/ttb/btt/diagonal). Optional loader.

**page-transition-curtain.js** `transitions/page-transition-curtain.js` (JS, global: `PageTransitionCurtain`) — tags: page-transition curtain wipe fetch DOMParser link-intercept loader
  Intercept links, slide curtain over, swap container, slide off.

**page-transition-morph.js** `transitions/page-transition-morph.js` (JS, global: `PageTransitionMorph`) — tags: page-transition morph shared-element flip thumbnail-to-detail
  FLIP-style morph between two DOM elements: `PageTransitionMorph.morph(src, dst)`.

**view-transitions.js** `transitions/view-transitions.js` (JS, global: `ViewTransitions`) — tags: view-transitions api wrapper cross-fade fallback flip
  `ViewTransitions.run(callback, {type})` wrapper for `document.startViewTransition()` with FLIP fallback.

---

### Interactions (gestures & input)

**sortable.js** `interactions/sortable.js` (JS, global: `Sortable`) — tags: drag-and-drop sort reorder list HTML5-DnD
  `Sortable.init('#list', {itemSelector, handle, onSort})`. Classes: `.sortable-dragging`/`-over`.

**swipe.js** `interactions/swipe.js` (JS, global: `Swipe`) — tags: swipe gesture pointer threshold velocity directions
  4-direction swipe detector: `Swipe.init(el, {threshold, velocity, directions, onSwipe})`.

**pull-to-refresh.css** `interactions/pull-to-refresh.css` (CSS) — tags: pull-to-refresh ptr mobile drag spinner
  PTR styles + states (is-pulling, is-ready, is-refreshing).

**pull-to-refresh.js** `interactions/pull-to-refresh.js` (JS, global: `PullToRefresh`) — tags: pull-to-refresh ptr drag-down promise mobile
  `PullToRefresh.init('.ptr', {trigger, resistance, onRefresh: () => Promise})`.

**long-press.js** `interactions/long-press.js` (JS, global: `LongPress`) — tags: long-press press hold haptic progress confirm
  `LongPress.init(el, {delay, moveThreshold, onProgress, onLongPress, onCancel})`.

**pinch-zoom.js** `interactions/pinch-zoom.js` (JS, global: `PinchZoom`) — tags: pinch zoom pan touch double-tap wheel
  Pinch + wheel zoom + drag pan: `PinchZoom.init(el, {targetSelector, minScale, maxScale, bounds})`.

---

### SVG

**svg-animations.css** `svg/svg-animations.css` (CSS) — tags: svg animation stroke draw morph icons
  CSS-only SVG animations (stroke-dash draw, morph).

**svg-animations.js** `svg/svg-animations.js` (JS, global: `SVGAnim`) — tags: svg animation path-length draw morph animate-icon
  `.calcPaths()`, `.draw()`, `.morph()`, `.animateIcon()`.

**gradient-defs.js** `svg/gradient-defs.js` (JS, global: `SvgDefs`) — tags: svg gradient defs linearGradient radialGradient palette reusable icon fill stops ssr
  Reusable SVG `<defs>` for gradient icons/shapes. `SvgDefs.mount()` injects all 16 palette presets. `.linear({colors, angle})`, `.radial({colors, cx, cy, r})`, `.palette(name)`. SSR-friendly `defsString()`.

---

### Typography

**fluid-type.css** `typography/fluid-type.css` (CSS) — tags: typography fluid clamp responsive scale
  Fluid type scale using clamp().

**variable-fonts.css** `typography/variable-fonts.css` (CSS) — tags: typography variable-fonts weight slant playground
  Variable font utility classes (weight/slant/optical-size axes).

**vertical-rhythm.css** `typography/vertical-rhythm.css` (CSS) — tags: typography vertical-rhythm baseline line-height
  Baseline-aligned vertical rhythm helpers.

**gradient-numbers.css** `typography/gradient-numbers.css` (CSS) — tags: typography number numeral hero stat metric digit gradient counter mega large landing apple linear stripe stroke outlined shimmer glow tabular
  Hero stat numerals with gradient fill. Sizes sm→mega + 14 color presets. Variants: stroke (outlined), shimmer (animated), glow, tabular, italic.

---

### Utilities (math, DOM, perf)

**easing.js** `utils/easing.js` (JS, global: `Easing`) — tags: easing curve cubic-bezier ease-in-out elastic bounce
  20+ named easing functions + `cubicBezier(p1, p2, p3, p4)`.

**lerp.js** `utils/lerp.js` (JS, global: `MathUtils`) — tags: math lerp clamp map smoothstep damp
  `lerp`, `clamp`, `mapRange`, `smoothstep`, `damp`.

**dom.js** `utils/dom.js` (JS, globals: `DOM`, `$`, `$$`) — tags: dom selector helper delegation events
  `$(sel)`/`$$(sel)` selector helpers, event delegation.

**performance.js** `utils/performance.js` (JS, global: `Perf`) — tags: performance throttle debounce raf batch dom
  `throttle`, `debounce`, `rafThrottle`, `batchDOM`.

**gradient-extract.js** `utils/gradient-extract.js` (JS, global: `GradientExtract`) — tags: color-thief palette image dominant accent k-means clustering spotify apple-music album art extract
  Extract dominant color palette from an image. `fromImage(src)` → `{dominant, accent, light, dark, palette[]}`. `applyTo(el, src, {type, angle})` directly sets element background as linear/radial/conic from the extracted colors.

**mesh-editor.js** `utils/mesh-editor.js` (JS, global: `MeshEditor`) — tags: mesh-gradient editor interactive drag stops sketch hypercolor tailwind-mesh builder export-css randomize live preview pointer
  Interactive mesh gradient builder. Drag-to-position color stops on a canvas. Dbl-click a handle to recolor. `exportCss()` → ready-to-paste CSS. 10 palette presets + randomize/addStop/removeStop.

**palette-generator.js** `utils/palette-generator.js` (JS, global: `PaletteGenerator`) — tags: color-theory palette harmony complementary triadic tetradic split-complementary square analogous monochromatic shades tints tones compound adobe-color coolors paletton wcag contrast best-text hsl hex
  Color-theory palette generation from one seed hex. 11 schemes (complementary/triadic/splitComplementary/tetradic/square/analogous/monochromatic/shades/tints/tones/compound) + random/surprise + WCAG contrast helpers + applyToCSS().

---

### 3D (Three.js required)

> All `3d/*.js` files assume Three.js is loaded globally as `window.THREE`:
> `<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>`

**scene-runner.js** `3d/scene-runner.js` (JS, global: `SceneRunner`) — tags: three.js scene camera renderer raf resize boilerplate helper
  `SceneRunner.create(target, {cameraPosition, background, onTick, onResize})` — returns {scene, camera, renderer, canvas, clock, destroy}.

**particles-galaxy.js** `3d/particles-galaxy.js` (JS, global: `ParticlesGalaxy`) — tags: three.js particles galaxy spiral point-cloud points stars
  Swirling spiral point-cloud galaxy. `init(target, {count, radius, branches, spin, insideColor, outsideColor})`.

**wave-plane.js** `3d/wave-plane.js` (JS, global: `WavePlane`) — tags: three.js plane vertex-displacement waves noise gradient
  Vertex-displaced plane with sin/cos noise; two-color vertex gradient.

**floating-text.js** `3d/floating-text.js` (JS, global: `FloatingText`) — tags: three.js text 3d extruded TextGeometry hover tilt bob
  3D text with hover tilt + bobbing. Falls back to extruded box if FontLoader/TextGeometry not loaded.

**instanced-grid.js** `3d/instanced-grid.js` (JS, global: `InstancedGrid`) — tags: three.js instanced-mesh grid waves height scroll
  N×M InstancedMesh with height-driven y. Supports `scrollDriven: true`.

**cube-morph.js** `3d/cube-morph.js` (JS, global: `CubeMorph`) — tags: three.js morph sphere cube torus vertex-lerp geometry
  Vertex-position lerp morph between sphere ↔ cube ↔ torus.

**postprocessing-bloom.js** `3d/postprocessing-bloom.js` (JS, global: `PostBloom`) — tags: three.js postprocessing bloom EffectComposer UnrealBloom glow
  Bloom scaffold using EffectComposer + UnrealBloomPass (requires extra examples/js script tags).

**raycast-hover.js** `3d/raycast-hover.js` (JS, global: `RaycastHover`) — tags: three.js raycaster hover pick mouse highlight select
  Mouse-pick highlight + onSelect callback. Layouts: circle/line/grid.

---

### Shaders (pure WebGL, no Three.js)

**runner.js** `shaders/runner.js` (JS, global: `ShaderRunner`) — tags: webgl shader runner fullscreen-quad fragment shader uniforms textures shadertoy
  Vanilla WebGL fullscreen-quad runner. Auto-provides `u_resolution`, `u_time`, `u_mouse`. Pass `uniforms`, `imageUniforms`.

**noise-flow.glsl.js** `shaders/noise-flow.glsl.js` (JS, global: `NoiseFlowShader`) — tags: shader noise fbm domain-warping animated colors lygia
  Animated fBm noise with domain warping. `{fragment, defaults}`.

**gradient-mesh.glsl.js** `shaders/gradient-mesh.glsl.js` (JS, global: `GradientMeshShader`) — tags: shader gradient mesh stripe-style 4-corner film-grain animated
  Animated 4-corner gradient mesh + grain. `{fragment, defaults}`.

**liquid-distortion.glsl.js** `shaders/liquid-distortion.glsl.js` (JS, global: `LiquidDistortionShader`) — tags: shader liquid distortion uv-warp fluid mouse texture procedural
  Fluid UV warp; mouse-influenced. `{fragment, proceduralFragment, defaults}`.

**halftone.glsl.js** `shaders/halftone.glsl.js` (JS, global: `HalftoneShader`) — tags: shader halftone dot-pattern print luminance image rotated
  Rotated dot-grid halftone over image or animated radial source. `{fragment, proceduralFragment, defaults}`.

**gradient-flow.glsl.js** `shaders/gradient-flow.glsl.js` (JS, global: `GradientFlowShader`) — tags: shader gradient flow animated soft multi-color warp linear vercel marketing palettes presets
  Soft animated multi-color flow gradient with subtle domain warping. `{fragment, defaults, palettes}`. 9 palettes (aurora/sunset/cosmic/ocean/cyber/fire/pastel/mint/mono).

**mesh-gradient-wgl.glsl.js** `shaders/mesh-gradient-wgl.glsl.js` (JS, global: `MeshGradientWGLShader`) — tags: shader whatamesh stripe-style mesh gradient simplex-noise five-color hero homepage marketing
  Whatamesh-style Stripe-homepage mesh gradient via simplex noise. `{fragment, defaults, palettes}`. 8 brand palettes (stripe/vercel/aurora/ocean/sunset/cosmic/pastel/cyber).

---

### Data viz

**count-up.js** `data-viz/count-up.js` (JS, global: `CountUp`) — tags: counter count-up animated number decimals separator prefix suffix easing inview
  Animate numeric labels: `CountUp.init('[data-count-up]')` or `CountUp.to(target, value, opts)`.

**progress-ring.css** `data-viz/progress-ring.css` (CSS) — tags: progress ring circular svg apple activity success danger amber
  Circular SVG progress. Sizes sm/lg/xl, colors success/danger/amber/cyan.

**progress-ring.js** `data-viz/progress-ring.js` (JS, global: `ProgressRing`) — tags: progress ring circular svg animate set inview
  `ProgressRing.init('[data-pring]')` (animates on inview) or `ProgressRing.set(target, value)`.

**sparkline.js** `data-viz/sparkline.js` (JS, global: `Sparkline`) — tags: sparkline mini-chart line svg inline trend smooth fill dot
  Inline mini SVG line chart: `Sparkline.init('[data-sparkline]')` or `Sparkline.create(target, data, opts)`.

**bar-pulse.css** `data-viz/bar-pulse.css` (CSS) — tags: bars equalizer audio now-playing spotify pulse rainbow
  Equalizer bars under `.bp`. Variants: tall, xl, thin, fat, slow, fast, paused; colors + rainbow.

---

## Phase 9 — Daily-driver components (form pickers, overlays, data, states)

### Form pickers (advanced)

**select.css** `blocks/select.css` (CSS) — tags: select dropdown searchable grouped option radix shadcn list value
  Single-select dropdown styles with `.sel-trigger`, `.sel-menu`, `.sel-option`, `.sel-group`, `.sel-search`.

**select.js** `blocks/select.js` (JS, global: `Select`) — tags: select dropdown keyboard search filter listbox a11y
  `Select.init('[data-select]', {options, searchable, onChange})`. Keyboard nav: ↑↓, Enter, Esc.

**multi-select.css** `blocks/multi-select.css` (CSS) — tags: multi-select multiselect tags chips picker filter linear notion
  Chip-based multi-pick styles. Variants: showCount, glass.

**multi-select.js** `blocks/multi-select.js` (JS, global: `MultiSelect`) — tags: multi-select tags chips search check filter
  `MultiSelect.init('[data-multi-select]', {options, placeholder, showCount, onChange})`.

**combobox.css** `blocks/combobox.css` (CSS) — tags: combobox autocomplete input typeahead suggest radix algolia
  Input + dropdown list styles. Variants: pill, sm/lg, glass-menu.

**combobox.js** `blocks/combobox.js` (JS, global: `Combobox`) — tags: combobox autocomplete fuzzy keyboard nav free-text
  `Combobox.init('[data-combobox]', {options, freeText, onSelect, onChange})`. Fuzzy filter built in.

**date-picker.css** `blocks/date-picker.css` (CSS) — tags: date-picker calendar grid range single month year keyboard
  Calendar grid styles. States: today, selected, range-start/end/in-range, other-month, disabled.

**date-picker.js** `blocks/date-picker.js` (JS, global: `DatePicker`) — tags: date-picker calendar range single keyboard month navigation today clear
  `DatePicker.init('[data-date-picker]', {mode: 'single'|'range', weekStartsOn, min, max, format, onChange})`.

**file-upload.css** `blocks/file-upload.css` (CSS) — tags: file-upload drag-and-drop drop-zone preview list thumbs progress
  Drag/drop area + file list styles. Variants: compact, list-only, thumbs.

**file-upload.js** `blocks/file-upload.js` (JS, global: `FileUpload`) — tags: file-upload drag-drop accept multiple maxSize preview progress validate
  `FileUpload.init('[data-file-upload]', {accept, maxSize, multiple, onAdd, onRemove})`. `.upload(fn)` for progress streaming.

**color-picker.css** `blocks/color-picker.css` (CSS) — tags: color-picker hue saturation value alpha swatches hex figma colorful
  Saturation area + hue/alpha sliders + hex input + swatches grid.

**color-picker.js** `blocks/color-picker.js` (JS, global: `ColorPicker`) — tags: color-picker hsv rgb hex alpha swatches drag
  `ColorPicker.init('[data-color-picker]', {value, alpha, swatches, onChange})`.

**color-wheel.css** `components/color-wheel.css` (CSS) — tags: color-wheel hue ring conic-gradient lightness saturation disc figma procreate macos picker hsl hsv crosshair thumb readout hue-strip alpha-strip
  Conic-gradient HSL color picker wheel. Variants sm/lg/xl + flat (no center) + square HSV + hue-strip + alpha-strip.

**color-wheel.js** `components/color-wheel.js` (JS, global: `ColorWheel`) — tags: color-wheel hsl-picker conic-ring lightness-disc hsv pointer-drag pick on-change figma procreate macos hue-strip
  `ColorWheel.init('.cwheel', {initial, onChange, onPick})`. Returns `{set, get, destroy}`. Pure JS HSL color math included.

**range-slider.css** `blocks/range-slider.css` (CSS) — tags: range-slider two-handle range filter min max price linear
  2-handle range slider. Variants: thick/thin, glow, color presets.

**range-slider.js** `blocks/range-slider.js` (JS, global: `RangeSlider`) — tags: range-slider two-handle drag keyboard nouislider price-filter
  `RangeSlider.init('[data-range-slider]', {min, max, low, high, step, formatLabel, onChange})`.

**star-rating.css** `blocks/star-rating.css` (CSS) — tags: rating stars hearts thumbs review trustpilot app-store
  Star/heart/thumb rating with SVG mask. Colors amber/pink/cyan/mint, sizes sm/lg/xl, readonly.

**star-rating.js** `blocks/star-rating.js` (JS, global: `StarRating`) — tags: rating click hover preview value
  `StarRating.init('[data-rating]', {value, max, onChange})`.

### Overlays

**dropdown-menu.css** `components/dropdown-menu.css` (CSS) — tags: dropdown menu overflow context shortcut radix shadcn macos sub-menu
  Menu styles with sections, shortcuts, separators, danger items, sub-menu support.

**dropdown-menu.js** `components/dropdown-menu.js` (JS, global: `DropdownMenu`) — tags: dropdown menu keyboard outside-click toggle
  `DropdownMenu.init('[data-dropdown]', {onSelect, closeOnSelect})`. Arrow + Enter + Esc.

**drawer.css** `components/drawer.css` (CSS) — tags: drawer sheet side-panel bottom-sheet ios vaul left right top bottom
  Side sheet from any edge + bottom-sheet variant with drag handle. Width presets, glass.

**drawer.js** `components/drawer.js` (JS, global: `Drawer`) — tags: drawer sheet open close escape overlay focus-trap
  `Drawer.init('.drw')` + `[data-drawer-open]` / `[data-drawer-close]` triggers. Or `Drawer.open('#id')`.

**command-palette.css** `components/command-palette.css` (CSS) — tags: command-palette cmd-k spotlight launcher raycast linear vercel docsearch
  ⌘K modal styles: overlay, search, list with groups, item icons, shortcuts, footer hints.

**command-palette.js** `components/command-palette.js` (JS, global: `CommandPalette`) — tags: command-palette cmd-k fuzzy hotkey search action
  `CommandPalette.init('[data-command-palette]', {items, hotkey: 'mod+k', onSelect})`. Fuzzy filter + keyboard nav + global hotkey.

**popover.css** `components/popover.css` (CSS) — tags: popover floating-panel positioned tooltip-bigger radix floating-ui arrow
  Popover styles with positioned arrow. Glass, width presets, no-arrow.

**popover.js** `components/popover.js` (JS, global: `Popover`) — tags: popover floating positioning auto-flip click hover
  Auto-positioned floating panel with arrow + auto-flip. `Popover.init('.pop', {placement, offset, trigger})`.

### Data display

**table.css** `data-viz/table.css` (CSS) — tags: table data-grid sortable striped sticky compact bordered card pagination select
  Sortable / selectable / paginated table styles. Status badges, avatar cell helper, num column right-align.

**table.js** `data-viz/table.js` (JS, global: `Table`) — tags: table sort select pagination tanstack-table linear stripe
  `Table.init('[data-table]', {selectable, pageSize, onSort, onSelect})`. Click headers to sort.

**chart-bar.js** `data-viz/chart-bar.js` (JS, global: `ChartBar`) — tags: chart bar bars vertical horizontal grouped recharts tremor svg
  `ChartBar.create(target, {data, color, orientation, grouped})`. Single + grouped bars, h/v orientation.

**chart-line.js** `data-viz/chart-line.js` (JS, global: `ChartLine`) — tags: chart line area smooth recharts tremor multi-series svg
  `ChartLine.create(target, {data, color, smooth, dots, fill})`. Single + multi-series.

**chart-pie.js** `data-viz/chart-pie.js` (JS, global: `ChartPie`) — tags: chart pie donut hollow legend percentage tremor
  `ChartPie.create(target, {data, donut, showLegend, centerLabel, centerMeta})`. Optional hole + center text.

**code-block.css** `components/code-block.css` (CSS) — tags: code-block syntax-highlight copy lines diff window macos light shiki prism
  Code block styles with header, copy button, line numbers, diff +/- prefixes, macOS window dots, light theme.

**code-block.js** `components/code-block.js` (JS, global: `CodeBlock`) — tags: code highlight tokenize js ts css html json md copy diff
  `CodeBlock.init('[data-code-block]')`. Tiny built-in tokenizer (js/ts/css/html/json/md). Copy-to-clipboard.

### States (the most-forgotten polish)

**empty-state.css** `components/empty-state.css` (CSS) — tags: empty-state zero-data no-results no-permission offline first-use error linear stripe notion
  6 patterns under `.estate-*`. Variants: search/lock/offline/firstuse/error + compact, card, inline.

**error-states.css** `components/error-states.css` (CSS) — tags: error-state 404 500 403 maintenance offline broken page vercel github
  Full-page error patterns. Variants: 404, 500, 403, maintenance, offline, broken, card. Includes errp-bg-grid background.

---

## Phase 10 — Multi-style variant packs

**navbars-pack.css** `components/navbars-pack.css` (CSS) — tags: navbar pack solid transparent floating glass bordered centered dock minimal pill condensed light multiple-styles
  10 navbar variants under `.navp-*`: solid, transparent, floating, glass, bordered, centered, dock, minimal, pill, condensed. Light + tall + condensed modifiers.

**heroes-pack.css** `components/heroes-pack.css` (CSS) — tags: hero pack landing centered split stack asymmetric form app-shot gradient grid aurora noise dark light multiple-styles
  6 layouts × 6 backgrounds = many hero combinations under `.heropk-*`. Includes built-in CTA + ghost buttons.

**footers-pack.css** `components/footers-pack.css` (CSS) — tags: footer pack minimal mega newsletter gradient app-promo bordered dark light multiple-styles
  6 footer styles under `.ftrp-*`: minimal, mega (multi-column), newsletter, gradient (huge brand), app-promo, bordered. Light theme.

**cards-pack.css** `components/cards-pack.css` (CSS) — tags: card pack product profile blog stat integration pricing testimonial feature quote cta linear stripe shadcn multiple-styles
  10 card styles under `.cdp-*`: product, profile, blog, stat, integration, pricing, testimonial, feature, quote, cta. + modifiers (bordered, glass, gradient, light).

**cta-sections.css** `components/cta-sections.css` (CSS) — tags: cta call-to-action section centered gradient split form image banner dark light landing
  6 CTA section styles under `.ctas-*`: centered, gradient, split, form, image-bg, banner. Includes eyebrow/title/text/buttons.

**feature-blocks.css** `components/feature-blocks.css` (CSS) — tags: feature blocks 3col 4col alternating side-image checklist comparison icon-grid numbered steps landing
  8 feature section layouts under `.fbk-*`: 3col/4col icons, alternating image rows, side-image+bullets, checklist, before/after comparison, icon grid, numbered steps.

**logo-cloud.css** `components/logo-cloud.css` (CSS) — tags: logo-cloud trusted-by featured-in press partners marquee grid stripe vercel
  Logo cloud patterns under `.lclo-*`: grid (default), marquee (auto-scroll), fade-rows, compact, bordered.

**team-grid.css** `components/team-grid.css` (CSS) — tags: team-grid people about staff cards minimal hover-bio mosaic photo-wall vercel stripe
  4 layouts under `.tgrid-*`: cards (with bios), minimal, hover-bio (bio on hover), mosaic (asymmetric photo wall).

**auth-screens.css** `components/auth-screens.css` (CSS) — tags: auth sign-in sign-up login register forgot password 2fa otp magic-link clerk linear stripe vercel
  Full auth screens under `.auth-*`. Layouts: centered, split (image side), aside. Backgrounds: gradient, grid, aurora, light. Includes OTP boxes, divider, providers (Google/GitHub), helper links.

---

## Phase 11 — E-commerce, messaging, dashboard, calendar, media, specialty pickers

### E-commerce

**product-card.css** `components/product-card.css` (CSS) — tags: product-card ecommerce shopify polaris classic minimal overlay horizontal feature quickview wishlist swatch badge sale
  6 product-card style variants under `.pcard-*`. Sale/new/hot/soldout badges, swatches, wishlist, price-was strikethrough.

**cart-drawer.css** `components/cart-drawer.css` (CSS) — tags: cart drawer mini-cart line-items subtotal checkout quantity remove promo shopify ecommerce
  Cart styles to drop inside `components/drawer.*`. Includes line items, quantity stepper, totals, promo code, checkout CTA, empty state.

**quantity-stepper.css** `blocks/quantity-stepper.css` (CSS) — tags: quantity stepper number input plus minus ecommerce shopify pill vertical
  Numeric stepper styles. Variants: pill, sm/lg, glass, vertical, bordered.

**quantity-stepper.js** `blocks/quantity-stepper.js` (JS, global: `QuantityStepper`) — tags: quantity stepper min max value bind input
  `QuantityStepper.init('[data-qstep]', {min, max, step, onChange})`. Reads min/max from input attrs.

**checkout-flow.css** `components/checkout-flow.css` (CSS) — tags: checkout multi-step shipping payment review order-summary stripe shopify apple
  Multi-step checkout layout (`.chk-*`). Stepper, sections, summary sidebar (sticky), payment-method tiles, address grid.

### Social / messaging

**chat-bubble.css** `components/chat-bubble.css` (CSS) — tags: chat bubble message imessage whatsapp sent received typing system bordered tail reactions
  Sent/received chat bubbles with typing indicator, reactions row, system message, iMessage style, tail arrow.

**chat-input.css** `components/chat-input.css` (CSS) — tags: chat input composer slack discord imessage textarea attachments emoji send pill card
  Chat composer styles: auto-grow textarea, attach/emoji buttons, send button, attachment chips. Slack/card/pill variants.

**chat-input.js** `components/chat-input.js` (JS, global: `ChatInput`) — tags: chat input auto-grow submit enter shift maxlength send
  `ChatInput.init('[data-chat-input]', {submitOnEnter, shiftForNewline, onSend, maxLength})`.

**message-list.css** `components/message-list.css` (CSS) — tags: message-list conversations DM inbox sidebar linear slack imessage status-dot unread
  Sidebar list of conversations (`.mlist-*`). Avatar+name+snippet+time+badge, online/away/offline status dot, unread highlighting.

**comments.css** `components/comments.css` (CSS) — tags: comments thread replies nested vote github reddit linear discussions
  Threaded comments with avatars, vote buttons, replies, badge ("Author"), composer. Variants: flat, card, compact.

**reactions.css** `components/reactions.css` (CSS) — tags: reactions emoji slack github linear chip picker bubble add
  Reaction chip row + emoji picker bubble. Pill/floating variants. `.rxn-chip.is-mine` highlights your reaction.

**reactions.js** `components/reactions.js` (JS, global: `Reactions`) — tags: reactions toggle add count emoji picker
  `Reactions.init('.rxn', {onReact, closeOnPick})`. Click to toggle, picker for new emoji.

### Dashboard / admin

**dashboard-layout.css** `components/dashboard-layout.css` (CSS) — tags: dashboard layout sidebar app-shell linear vercel notion stripe header breadcrumbs collapsed floating
  Full app-shell layout (`.dash-*`): sidebar with workspace + nav + sections + footer, header w/ breadcrumbs + search + actions + avatar. Light + collapsed + floating variants.

**workspace-switcher.css** `components/workspace-switcher.css` (CSS) — tags: workspace switcher org tenant linear slack notion vercel multi-workspace
  Workspace switcher trigger + dropdown menu (`.wss-*`). Logos, active state, action items (Create / Switch account).

**workspace-switcher.js** `components/workspace-switcher.js` (JS, global: `WorkspaceSwitcher`) — tags: workspace switch active outside-click action
  `WorkspaceSwitcher.init('[data-workspace-switcher]', {onSwitch, onAction})`.

**filter-bar.css** `components/filter-bar.css` (CSS) — tags: filter-bar toolbar chips search sort group view dashboard linear stripe bulk-actions tabbed
  Filter toolbar (`.fbar-*`): search + filter chips + sort/group/view buttons + bulk actions strip when items selected. Stacked + tabbed variants.

**settings-list.css** `components/settings-list.css` (CSS) — tags: settings list sections rows toggle action danger linear stripe github ios
  Settings page rows (`.setl-*`). Sections with title+desc, toggles, change buttons, danger zone. Aside + compact + card variants.

### Date / time

**time-picker.css** `blocks/time-picker.css` (CSS) — tags: time picker hh-mm 12h 24h spinner column ios calendly slot grid
  Spinner-column time picker + time-slot grid (`.tslot-*`). 24h variant, inline mode, slot groups.

**time-picker.js** `blocks/time-picker.js` (JS, global: `TimePicker`) — tags: time picker hours minutes ampm minute-step format
  `TimePicker.init('[data-time-picker]', {value, format24, minuteStep, onChange})`.

**schedule-view.css** `components/schedule-view.css` (CSS) — tags: schedule calendar week-view events grid google-calendar cron linear cycle day-view
  Week-grid schedule (`.schd-*`). Events positioned via `--row` and `--span` CSS vars. Compact + day-mode + "now" indicator.

**countdown.css** `components/countdown.css` (CSS) — tags: countdown timer days hours minutes seconds launch event pills flip inline big glass
  Countdown cells (`.cdwn-*`). Big, pills, flip-card, inline, glass variants. Accent/danger/success palettes.

**countdown.js** `components/countdown.js` (JS, global: `Countdown`) — tags: countdown timer target date tick complete
  `Countdown.init('[data-countdown]', {to: Date|string, onTick, onComplete})`. Reads `data-cdwn-to`. Auto-pads.

### Media

**lightbox.css** `media/lightbox.css` (CSS) — tags: lightbox image gallery viewer photoswipe lightgallery fullscreen overlay thumbs caption
  Full-screen image viewer styles. Header with counter + download + close, side nav arrows, caption, thumbnails strip.

**lightbox.js** `media/lightbox.js` (JS, global: `Lightbox`) — tags: lightbox gallery group keyboard arrow escape thumbs download
  `Lightbox.init({thumbs, caption})`. Use `<a class="lbx-trigger" data-lbx="group" href="full.jpg" data-lbx-thumb="thumb.jpg">`. Keyboard: ←→ + Esc.

**video-player.css** `media/video-player.css` (CSS) — tags: video player html5 chrome plyr mux youtube vimeo bar progress volume fullscreen big-play
  Custom video player chrome. Big play overlay, bottom bar (play, progress with buffer, time, mute, volume, fullscreen). Minimal/rounded/light variants.

**video-player.js** `media/video-player.js` (JS, global: `VideoPlayer`) — tags: video play pause seek volume fullscreen progress buffer time-update
  `VideoPlayer.init('[data-video-player]', {autoplay, muted, loop, onPlay, onPause, onEnded})`.

**audio-waveform.css** `media/audio-waveform.css` (CSS) — tags: audio waveform player soundcloud wavesurfer voice-note bars play seek pill mini
  Audio player with bar waveform visualization. Pill + mini variants for voice notes.

**audio-waveform.js** `media/audio-waveform.js` (JS, global: `AudioWaveform`) — tags: audio waveform analyze bars play seek voice-note wavesurfer-lite
  `AudioWaveform.init('[data-audio-waveform]', {bars, analyze, heights})`. Optionally decodes audio for real amplitudes.

### Specialized pickers

**emoji-picker.css** `blocks/emoji-picker.css` (CSS) — tags: emoji picker categories grid search slack discord linear recent
  Emoji picker styles (`.emj-*`). Search bar, category tabs, 8-col grid, recent strip, glass variant.

**emoji-picker.js** `blocks/emoji-picker.js` (JS, global: `EmojiPicker`) — tags: emoji picker category search recents keywords compact
  `EmojiPicker.init('[data-emoji-picker]', {onPick})`. Built-in curated set across 8 categories. Recents stored in localStorage.

**country-picker.css** `blocks/country-picker.css` (CSS) — tags: country picker flag dial-code phone stripe checkout international search
  Country picker trigger + dropdown (`.cpk-*`). Flag emoji + dial code + name. Pill + no-code variants.

**country-picker.js** `blocks/country-picker.js` (JS, global: `CountryPicker`) — tags: country flag dial-code iso phone search filter
  `CountryPicker.init('[data-country-picker]', {value, onChange})`. 50 countries built-in. Flags via regional indicator chars (no images).

**icon-picker.css** `blocks/icon-picker.css` (CSS) — tags: icon picker grid search notion tile category random
  Icon picker styles (`.ipk-*`). Search + random shuffle button + grid of icons. Tile + glass variants.

**icon-picker.js** `blocks/icon-picker.js` (JS, global: `IconPicker`) — tags: icon picker emoji search random notion
  `IconPicker.init('[data-icon-picker]', {onPick, icons})`. Default 70+ icons (emoji-based). Pass custom `icons: [{name, char}]` for SVG sets.

---

## Phase 12 — productivity, layout, rich content, advanced charts, onboarding

### Productivity & calendar

**kanban-board.css** `components/kanban-board.css` (CSS) — tags: kanban board cards columns drag trello linear jira notion project task tag priority assignee
  Drag-to-reorder kanban board styles (`.kbn-*`). Card meta: tag, priority dot, due date, assignee. Compact + glass variants.

**kanban-board.js** `components/kanban-board.js` (JS, global: `KanbanBoard`) — tags: kanban drag-drop reorder column move
  `KanbanBoard.init('[data-kanban]', {onMove, onAdd})`. HTML5 DnD, cards move within/between columns.

**calendar-month.css** `components/calendar-month.css` (CSS) — tags: calendar month grid events google-calendar apple-calendar cron mini-calendar widget
  Full month-grid calendar (`.calm-*`). Events styled per-day with color. `.calm-mini` variant for sidebar widget.

**calendar-month.js** `components/calendar-month.js` (JS, global: `CalendarMonth`) — tags: calendar month render events plot day click prev next today
  `CalendarMonth.init('.calm', {value, events, weekStartsOn, maxEventsPerDay, onDayClick, onEventClick})`.

**heatmap-calendar.css** `data-viz/heatmap-calendar.css` (CSS) — tags: heatmap calendar contribution github wakatime activity streak yearly cells legend
  GitHub-style yearly heatmap styles (`.hcal-*`). Compact/large size variants. Levels l0–l4.

**heatmap-calendar.js** `data-viz/heatmap-calendar.js` (JS, global: `HeatmapCalendar`) — tags: heatmap year contribution data tooltip github
  `HeatmapCalendar.create(target, {data: {YYYY-MM-DD: n}, year, color, tooltip, onClick})`.

### Layout / navigation

**resizable-panels.css** `layout/resizable-panels.css` (CSS) — tags: split-pane resizable layout vscode notion linear horizontal vertical handle
  Split-pane layout (`.rpan-*`) with draggable handles. Visual handle affordance on hover.

**resizable-panels.js** `layout/resizable-panels.js` (JS, global: `ResizablePanels`) — tags: split resize drag pointer min max persist localstorage
  `ResizablePanels.init('[data-resizable-panels]', {direction, persistKey, onResize})`. Panels can have `data-min` / `data-max`.

**breadcrumbs.css** `components/breadcrumbs.css` (CSS) — tags: breadcrumbs navigation path crumbs chevron slash arrow pill collapse
  Breadcrumbs (`.brc-*`). Variants: chevron/slash/arrow separators, pill, collapse middle, with-icons, light.

**pagination.css** `components/pagination.css` (CSS) — tags: pagination numeric prev next load-more infinite-scroll page rounded pill minimal
  Pagination styles (`.pag-*`). Numeric + load-more + sentinel for infinite scroll. Pill + rounded + minimal + compact.

**pagination.js** `components/pagination.js` (JS, global: `Pagination`) — tags: pagination page total page-size on-page render ellipsis infinite-scroll observer
  `Pagination.init('[data-pagination]', {total, page, pageSize, onPage})`. Plus `Pagination.infinite(sentinel, {onLoad})` for IntersectionObserver-based infinite scroll.

**steps-wizard.css** `components/steps-wizard.css` (CSS) — tags: wizard steps multi-step onboarding stripe setup linear connect form layout progress
  Full wizard layout (`.wzd-*`): side rail stepper, head/body/foot, progress bar, back/skip/next.

### Rich content editing

**rich-text-editor.css** `components/rich-text-editor.css` (CSS) — tags: rich-text editor wysiwyg contenteditable toolbar notion medium link bold italic
  RTE styles (`.rte-*`): toolbar with active states, contenteditable content area, prose typography, floating bubble menu variant.

**rich-text-editor.js** `components/rich-text-editor.js` (JS, global: `RichTextEditor`) — tags: rich-text execcommand contenteditable toolbar shortcut sanitize bubble-menu
  `RichTextEditor.init('[data-rich-text-editor]', {onChange, sanitize, keyboard})`. ⌘B/I/U/K shortcuts. Strips script/style/event handlers.

**markdown-editor.css** `components/markdown-editor.css` (CSS) — tags: markdown editor split preview linear bear github obsidian toolbar
  Markdown editor (`.md-*`): toolbar (mode toggle + format buttons), source `<textarea>` + live preview pane with prose typography.

**markdown-editor.js** `components/markdown-editor.js` (JS, global: `MarkdownEditor`) — tags: markdown render parser headings lists code blockquote tables task-lists
  `MarkdownEditor.init('[data-markdown-editor]', {value, mode, onChange})`. Built-in tiny markdown renderer; swap with marked.js for richer output.

**diff-viewer.css** `components/diff-viewer.css` (CSS) — tags: diff viewer code github gitlab pr split unified added removed line-numbers
  Diff styles (`.dfv-*`): unified + split modes, added/removed line backgrounds, hunk separator, stats header.

**diff-viewer.js** `components/diff-viewer.js` (JS, global: `DiffViewer`) — tags: diff lcs lines compute split unified line-numbers patch
  `DiffViewer.create(target, {before, after, mode, lineNumbers, title})`. LCS-based line diff.

### Toolbars & indicators

**toolbar.css** `components/toolbar.css` (CSS) — tags: toolbar action-bar grouped vscode figma linear icon-button floating vertical glass compact
  Toolbar (`.tbar-*`) with grouped buttons, separators, spacer, icon-only buttons. Floating, vertical, glass, compact variants.

**context-menu.css** `components/context-menu.css` (CSS) — tags: context-menu right-click positioned cursor notion linear macos
  Context menu styles (`.ctx-*`). Reuses `.ddm-menu` visuals from dropdown-menu.css.

**context-menu.js** `components/context-menu.js` (JS, global: `ContextMenu`) — tags: context-menu right-click position cursor outside-click escape attach
  `ContextMenu.init('[data-context-menu]', {onSelect})` or `ContextMenu.attach(trigger, menu, opts)`. Auto-clamps within viewport.

**activity-feed.css** `components/activity-feed.css` (CSS) — tags: activity-feed audit-log timeline github stripe linear events create update delete comment merge login rail
  Activity feed (`.afeed-*`): icon by event type (create/update/delete/comment/merge/login), quote, meta tags. Compact/card/grouped/rail variants.

**status-bar.css** `components/status-bar.css` (CSS) — tags: status-bar footer-bar vscode bottom-bar slack indicator dot ok warning error active monospace
  Fixed bottom status bar (`.sbar-*`). Items with status dots (ok/warning/error). Static + glass + accent variants.

### Onboarding

**tour.css** `components/tour.css` (CSS) — tags: tour onboarding walkthrough spotlight intro shepherd driver overlay popover arrow steps
  Tour styles: mask overlay, spotlight ring, popover with dots/counter/skip/back/next, arrow per placement.

**tour.js** `components/tour.js` (JS, global: `Tour`) — tags: tour onboarding walkthrough spotlight engine keyboard arrow escape steps
  `Tour.start([{target, title, text, placement, scrollTo}], {onFinish, onSkip})`. Auto-flips placement, ←→ + Esc keyboard.

### Advanced charts

**chart-area.js** `data-viz/chart-area.js` (JS, global: `ChartArea`) — tags: chart area filled stacked smooth recharts tremor multi-series gradient
  `ChartArea.create(target, {data, color/colors, stacked, smooth})`. Single + stacked + multi-series support.

**chart-gauge.js** `data-viz/chart-gauge.js` (JS, global: `ChartGauge`) — tags: chart gauge speedometer progress ring arc apple-watch tremor
  `ChartGauge.create(target, {value, max, size, color, thickness, arc, startAngle, label, subtitle})`. Configurable arc sweep.

**chart-radar.js** `data-viz/chart-radar.js` (JS, global: `ChartRadar`) — tags: chart radar spider polygon comparison multi-series d3
  `ChartRadar.create(target, {axes, series: [{name, values, color}], max, size, rings, showLegend})`.

**chart-funnel.js** `data-viz/chart-funnel.js` (JS, global: `ChartFunnel`) — tags: chart funnel conversion drop-off mixpanel amplitude posthog percent
  `ChartFunnel.create(target, {data, color, showPercent, showAbs})`. Auto-renders drop-off % between rows.

---

### Backfill — earlier-phase entries (Phase 13 components + original gradient batch)

These cover components and gradient utilities that had only intent-table rows above. Tagged here for grep.

**gradients-pack.css** `effects/gradients-pack.css` (CSS) — tags: gradient preset pack brand instagram spotify discord twitch stripe linear vercel apple-intelligence notion figma tailwind sunset sunrise ocean cool sky pastel vibrant dark moody synthwave vaporwave miami y2k iridescent cyberpunk neon nature forest meadow lava two-tone basics 60-presets grad
  60+ preset gradients under `.grad-*`. Adds `.grad-anim`/`-anim-slow`/`-anim-fast`/`-anim-conic` for animation.

**gradient-text.css** `effects/gradient-text.css` (CSS) — tags: gradient text fill background-clip headline instagram sunset cosmic cyber electric rainbow gold silver rose-gold apple shimmer stroke glow fade-down fade-up h1 h2 gtxt
  Text-fill gradients under `.gtxt-*`. Mirrors gradients-pack palette names. Modifiers: `.gtxt-anim`, `.gtxt-stroke`, `.gtxt-glow`, `.gtxt-fade-*`, `.gtxt-shimmer`. Sizing helpers `.gtxt-h1`, `.gtxt-h2`.

**gradient-borders.css** `effects/gradient-borders.css` (CSS) — tags: gradient border static rotating flowing breathing beam double dashed hover instagram sunset cosmic cyber rainbow aurora mono gold iridescent vercel padding-box conic gbord
  Gradient border utilities under `.gbord-*`. 8 techniques (static/rotating/flowing/breathing/beam/double/dashed/on-hover) + size + color presets.

**gradient-mesh.css** `effects/gradient-mesh.css` (CSS) — tags: gradient mesh stripe-style multi-radial hero landing dashboard gmesh aurora ocean cosmic pastel sunset forest iridescent stripe vercel linear monochromatic
  Stripe-style multi-radial mesh backgrounds under `.gmesh-*`. 13 variants.

**gradient-animations.css** `effects/gradient-animations.css` (CSS) — tags: gradient animation slide pulse hue conic-spin drift blink rainbow ribbon shimmer breathe aurora kenburns ganm slow fast glacial
  Animation utilities under `.ganm-*` that apply to any gradient preset. 13 animations + speed modifiers.

**gradient-holo.css** `effects/gradient-holo.css` (CSS) — tags: holographic iridescent chrome oil-slick mother-pearl rainbow-foil pokemon card mouse-tracked tilt shiny holo-text holo
  Holographic / iridescent / chrome surfaces under `.holo-*`. Pairs with `GradientBuilder.trackHolo(el)`.

**gradient-builder.js** `utils/gradient-builder.js` (JS, global: `GradientBuilder`) — tags: gradient builder palette random-mesh spin slide track-holo mouse-tracked linear radial conic mix color-mix hue-rotate generate
  Programmatic gradient API with 14 curated palettes. `linear/radial/conic/randomMesh/applyMesh/trackHolo/spin/slide/mix/toRGBA/generatePalette`.

**achievement-popup.css** `feedback/achievement-popup.css` (CSS) — tags: achievement popup steam unlock badge xbox playstation toast trophy reward gamification slide-in
  Steam-style achievement popup styles. Slide-in animation, icon slot, title + meta.

**achievement-popup.js** `feedback/achievement-popup.js` (JS, global: `AchievementPopup`) — tags: achievement popup steam show queue auto-dismiss reward gamification
  `AchievementPopup.show({title, meta, icon, sound, duration})` — queue + auto-dismiss.

**announcement-bar.css** `components/announcement-bar.css` (CSS) — tags: announcement bar top banner news header marketing promo strip site-wide dismissible link cta countdown ticker
  Top-of-page announcement bars with optional close + CTA. Variants: minimal, gradient, ticker, countdown, segmented.

**announcement-bar.js** `components/announcement-bar.js` (JS, global: `AnnouncementBar`) — tags: announcement bar dismiss persist localstorage close show countdown ticker
  `AnnouncementBar.init('.abar', {persistKey, onClose})` — remembers dismissed state.

**banners.css** `components/banners.css` (CSS) — tags: banner inline alert info warning error success notice tip stripe linear app-prompt callout block
  5 inline banner styles for in-content alerts (info, warning, error, success, tip).

**chart-network.js** `data-viz/chart-network.js` (JS, global: `ChartNetwork`) — tags: chart network force-directed graph nodes links repulsion spring damping d3-like physics simulation drag-pin
  Force-directed network graph (canvas). Repulsion + spring + center attraction + damping; drag-to-pin nodes.

**chart-sankey.js** `data-viz/chart-sankey.js` (JS, global: `ChartSankey`) — tags: chart sankey flow diagram stages source target nodes ribbon allocation flow-chart
  Sankey diagram (SVG). Multi-stage flows with auto-layered nodes + curved ribbons sized by value.

**chart-treemap.js** `data-viz/chart-treemap.js` (JS, global: `ChartTreemap`) — tags: chart treemap slice-and-dice hierarchical squarified rectangles area-proportional disk-usage breakdown
  Treemap using slice-and-dice. Recursive partitioning + hover labels.

**clip-trim.css** `media/clip-trim.css` (CSS) — tags: clip trim video audio in-out handles range editor waveform timeline cut crop
  In/out handle styles for trimming a clip. Draggable left/right handles + duration label.

**clip-trim.js** `media/clip-trim.js` (JS, global: `ClipTrim`) — tags: clip trim handles in-out drag range video audio editor onChange milliseconds
  `ClipTrim.init('.cliptrim', {min, max, onChange})` — two-handle range with millisecond-accurate readout.

**cookie-consent.css** `components/cookie-consent.css` (CSS) — tags: cookie consent gdpr banner privacy bottom corner toast accept reject manage categories
  GDPR cookie consent banner styles. Variants: bottom-bar, corner-card, modal.

**cookie-consent.js** `components/cookie-consent.js` (JS, global: `CookieConsent`) — tags: cookie consent gdpr accept reject manage localstorage persist categories
  `CookieConsent.init({categories, onAccept, persistKey})` — category toggles, persists per-key.

**image-crop.css** `blocks/image-crop.css` (CSS) — tags: image crop selection rectangle handles grid-overlay zoom rule-of-thirds cropper canvas-export
  Image cropper UI with selection rectangle, grid overlay (rule-of-thirds), 8-direction resize handles.

**image-crop.js** `blocks/image-crop.js` (JS, global: `ImageCrop`) — tags: image crop selection drag resize canvas-export blob aspect-ratio onChange
  `ImageCrop.init('.crop', {aspect, onChange, exportType})` — returns canvas/blob/dataUrl on demand.

**json-editor.css** `blocks/json-editor.css` (CSS) — tags: json editor tree viewer collapsible syntax-highlight nested array object key value
  Tree-style JSON viewer with collapsible nodes + syntax-highlighted values.

**json-editor.js** `blocks/json-editor.js` (JS, global: `JsonEditor`) — tags: json editor tree viewer parse render expand collapse copy nested
  `JsonEditor.render(target, jsonObj, {collapsed, maxDepth})` — read-only by default with copy button per key.

**layers-panel.css** `components/layers-panel.css` (CSS) — tags: layers panel figma photoshop list reorder visibility lock thumbnail nested groups inspector eye lock-icon
  Figma-style layers panel with visibility/lock toggles, thumbnails, nested groups, drag-reorder slots.

**level-meter.css** `feedback/level-meter.css` (CSS) — tags: level meter xp progress duolingo points bar streak gamification ring radial label
  Duolingo-style XP/level meter. Linear bar + radial variants + level/next-level labels.

**notification-center.css** `components/notification-center.css` (CSS) — tags: notification center inbox list bell unread read tabs filter mark-all activity feed
  Notification center panel — list with unread dot, time, action button, tabs (All / Unread / Mentions).

**phone-input.css** `blocks/phone-input.css` (CSS) — tags: phone input intl country-flag prefix dial-code mask validation iti-style telinput
  International phone input styles. Country flag + dial code prefix + masked field.

**phone-input.js** `blocks/phone-input.js` (JS, global: `PhoneInput`) — tags: phone input intl country-flag dial-code mask validate format E.164 country-picker
  `PhoneInput.init('.phone-input')` — uses Country Picker for the prefix; emits E.164 on change.

**properties-panel.css** `components/properties-panel.css` (CSS) — tags: properties panel inspector figma photoshop key-value rows section group toggle slider input-row right-rail
  Inspector panel with typed rows (text, number, color, slider, toggle), grouped sections, collapsible.

**score-counter.css** `feedback/score-counter.css` (CSS) — tags: score counter points bump popup flying +N -N pulse big-number sparkline scoreboard scnt
  Score counter styles. `.scnt-value` for the big number + `.scnt-bump` for the flying +N/-N popup.

**score-counter.js** `feedback/score-counter.js` (JS, global: `ScoreCounter`) — tags: score counter add subtract animate eased flying popup bump value set
  `ScoreCounter.add(sel, delta)` / `.set(sel, val)` — animated tween + flying +N popup (green/red).

**skip-link.css** `responsive/skip-link.css` (CSS) — tags: skip-link a11y accessibility sr-only screen-reader focus visible skip-to-content
  Accessibility skip-link + `.sr-only` utility. Focus-visible-only reveal.

**stat-with-sparkline.css** `data-viz/stat-with-sparkline.css` (CSS) — tags: stat sparkline tile card big-number trend up down meta dashboard tremor stripe linear analytics ssp
  Stripe/Linear-style stat tile: label + trend pill + huge number + meta + inline sparkline area.

**sticky-cta.css** `components/sticky-cta.css` (CSS) — tags: sticky cta bottom mobile reveal scroll-show price-cta product detail anchored
  Bottom-anchored sticky CTA bar (mobile-first). Reveals after scroll threshold.

**stories.css** `components/stories.css` (CSS) — tags: stories instagram tray player segmented-progress tap-advance hold-pause profile avatar mobile
  Instagram-style stories: tray of circles + fullscreen player with segmented progress bars at top.

**stories.js** `components/stories.js` (JS, global: `Stories`) — tags: stories instagram tap-advance hold-pause keyboard segmented-progress mute auto-advance
  `Stories.init('.stories')` — tap-left/-right, hold-to-pause, keyboard ←/→, segmented progress, onComplete.

**streak-flame.css** `feedback/streak-flame.css` (CSS) — tags: streak flame fire duolingo days-in-a-row gamification icon counter mute milestone-pulse
  Duolingo-style streak flame: animated flame icon + day-count number, milestone pulse states.

**swatches-palette.css** `components/swatches-palette.css` (CSS) — tags: swatches palette colors grid copy click figma color-picker rows hex tile
  Color swatches grid (clickable to copy hex). Row + grid layouts + size variants.

**swipe-actions.css** `interactions/swipe-actions.css` (CSS) — tags: swipe actions ios mail-app reveal archive delete left right horizontal-list mobile
  iOS-style swipe-to-reveal action buttons (archive / delete / pin) under list rows.

**swipe-actions.js** `interactions/swipe-actions.js` (JS, global: `SwipeActions`) — tags: swipe actions ios reveal threshold drag pointer touch onAction commit cancel
  `SwipeActions.init('.swipe-list')` — pointer-driven horizontal swipe; reveal threshold + commit / cancel.

**tag-input.css** `blocks/tag-input.css` (CSS) — tags: tag input chips multi-tag autocomplete suggestions enter-to-add backspace-to-remove pill
  Tag/chip input field styles: chips + input + suggestion dropdown.

**tag-input.js** `blocks/tag-input.js` (JS, global: `TagInput`) — tags: tag input chips autocomplete suggestions add remove enter backspace duplicate validation
  `TagInput.init('.taginp', {suggestions, onChange, allowDuplicate})` — fuzzy suggestions + chip add/remove.

**timeline-scrubber.css** `media/timeline-scrubber.css` (CSS) — tags: timeline scrubber multi-track editor playhead ruler markers clip rows tracks video audio
  Multi-track video/audio timeline editor styles. Track rows + playhead + ruler + draggable clips.

**zoom-controls.css** `components/zoom-controls.css` (CSS) — tags: zoom controls in out reset fit-to-screen 100% magnifier floating pill keyboard-shortcut
  Floating zoom-controls pill — in/out/reset/fit/100% buttons + keyboard-shortcut hints.

**zoom-controls.js** `components/zoom-controls.js` (JS, global: `ZoomControls`) — tags: zoom controls in out reset fit-to-screen wheel pinch keyboard increment factor
  `ZoomControls.init('.zoom', {target, min, max, step, onZoom})` — wires buttons + keyboard + wheel/pinch.

---

### Phase 14 — AI UI, canvas/editor primitives, shaders, pro-tool patterns

**Phase 14 — AI UI (`ai/`)**

**streaming-text.css** `ai/streaming-text.css` (CSS) — tags: ai chat streaming token-by-token caret cursor blinking markdown chatgpt claude vercel-ai assistant-ui scroll-lock thinking error bubble plain card mono
  Streaming AI message styles with blinking tail caret + thinking dots + smooth markdown rendering. Variants: bubble, plain, card, mono. States: streaming, paused, done, error, thinking.

**streaming-text.js** `ai/streaming-text.js` (JS, global: `StreamingText`) — tags: ai streaming sse fetch ReadableStream tokens append done thinking error scroll-lock json-delta markdown-lite
  `append(id, chunk)`, `fromStream(id, body, {parser: 'sse'|'text'|'json-delta'})`, `fromIterable(id, asyncIter)`, `done(id)`, `bindScrollLock('#scroller')`. Lightweight streaming markdown renderer included.

**tool-call-card.css** `ai/tool-call-card.css` (CSS) — tags: ai tool-call function-call agent vercel-ai assistant-ui claude collapsible pending running success error cancelled args result group rail spinner status
  Collapsible AI tool/function-call card with header + args + result panes. States pending/running/success/error/cancelled. `.tcc-group` for consecutive calls with shared rail. Auto-color hints by `[data-tcc-tool]`.

**tool-call-card.js** `ai/tool-call-card.js` (JS, global: `ToolCallCard`) — tags: ai tool-call render create setState setResult setElapsed expand collapse group langchain agents
  `ToolCallCard.create(target, {tool, args, state, result})` returns handle with `setState/.setResult/.setElapsed/.expand/.collapse`. `group(parent, calls, {label})` for agent step bundles.

**reasoning-block.css** `ai/reasoning-block.css` (CSS) — tags: ai reasoning thinking chain-of-thought claude o1 extended-thinking disclosure details collapsible elapsed-time pulsing icon auto-collapse rail
  Collapsible "Thinking…" disclosure for reasoning models. States: streaming (pulsing icon + live timer), done (auto-collapses), empty. Variants: compact, flat, rail.

**reasoning-block.js** `ai/reasoning-block.js` (JS, global: `ReasoningBlock`) — tags: ai reasoning thinking append done elapsed timer auto-collapse pin label icon claude o1
  `ReasoningBlock.create(target, {autoCollapse, label, icon})` returns handle with `.append/.done/.setLabel/.elapsed/.pin/.unpin/.reset`.

**citation-popover.css** `ai/citation-popover.css` (CSS) — tags: ai citation footnote source-popover perplexity wikipedia inline-ref numbered superscript bracket pill favicon hover click
  Inline `[1]` numbered citation chips + auto-positioned source popover. Shape variants: circle, square, bracket, superscript, pill, favicon. Color variants violet/cyan/pink/amber/mono.

**citation-popover.js** `ai/citation-popover.js` (JS, global: `CitationPopover`) — tags: ai citation popover hover click register parse-sources data-cit renderInto rag-hits perplexity
  `CitationPopover.init(scope)` parses `.cit-sources li[id^="src-"]` + auto-wires `.cit[data-cit]`. `register(id, {title, domain, favicon, url, snippet})`. `renderInto(el, 'text [1] [2]', sourcesArr)` builds in one call.

**sources-panel.css** `ai/sources-panel.css` (CSS) — tags: ai sources rag retrieval search-results perplexity vercel-ai right-rail strip grid inline favicon snippet domain tier primary secondary related cited loading shimmer
  Source-card rail for RAG / web-search results. Layouts: rail, strip (horizontal scroll), grid, inline (chips only). Tier badges (primary/secondary/related/cited). Loading shimmer.

**model-picker.css** `ai/model-picker.css` (CSS) — tags: ai model-picker dropdown vercel-ai openrouter chatgpt provider capability vision tools reasoning fast cheap multimodal code creative new experimental context-pill anthropic openai google meta mistral xai cohere deepseek
  Model-picker dropdown trigger + panel. Capability badges (10 types). Provider color hints by `data-mpk-provider`. Search input + keyboard nav.

**model-picker.js** `ai/model-picker.js` (JS, global: `ModelPicker`) — tags: ai model-picker init select onChange capability-badges keyboard-nav search filter groups openrouter vercel
  `ModelPicker.init('[data-mpk]', {models: [{id, name, provider, context, tags, description, group, shortcut}], selectedId, onChange})`. Returns `{setModels, setSelected, get, open, close}`.

**token-usage-pill.css** `ai/token-usage-pill.css` (CSS) — tags: ai token usage context-window pill arc progress chatgpt claude cursor 12k 200k indicator low mid warn critical bar icon-only
  Token usage indicator pill with arc + numeric `124k / 200k`. Auto-color (green/violet/amber/red) by `--tup-pct`. Variants: soft, strong, mono, compact, icon-only, bar.

**token-usage-pill.js** `ai/token-usage-pill.js` (JS, global: `TokenUsagePill`) — tags: ai token-usage set update auto-format k M percent threshold
  `TokenUsagePill.init('[data-tup]')` or `.set('.tup', {used, max})`. `formatTokens(124000) → '124k'`. Auto state classes (is-low/mid/warn/critical).

**attachment-chips.css** `ai/attachment-chips.css` (CSS) — tags: ai attachment chips composer chatgpt claude image pdf audio video code text zip csv json md link removable thumbnail progress drag-drop dropzone uploading success error staged large
  Removable attachment chips for chat composer. Type-auto-styling (img/pdf/audio/video/code/text/zip/csv/json/md/link). States: uploading (progress bar), error, success, staged. `.atc-drop` dropzone with drag-over highlight.

**attachment-chips.js** `ai/attachment-chips.js` (JS, global: `AttachmentChips`) — tags: ai attachment tray init add remove drag-drop paste clipboard file-type-detect mime size-format
  `AttachmentChips.init('.atc-tray', {onAdd, onRemove, allow, max, dropZone})`. Auto-detects file type → matching chip class. Paste-from-clipboard built in. Returns `{add, remove, clear, list, setProgress, markDone, markError}`.

**suggested-replies.css** `ai/suggested-replies.css` (CSS) — tags: ai suggested-replies follow-ups suggestion chips chatgpt claude vercel-ai pills outline primary arrow icon card row wrap stack grid 3col fade-on-type cyan pink amber green violet
  Pill-chip follow-up suggestions under AI message. Layouts: row (scrollable), wrap, stack, grid, 3col. Chip variants: primary (gradient), outline, arrow, icon, card (multi-line).

**inline-controls.css** `ai/inline-controls.css` (CSS) — tags: ai inline-controls stop regenerate copy good bad branch share edit tts read-aloud chatgpt claude floating toolbar compact vertical streaming done error branches pager
  Stop/Regenerate/Copy/Good/Bad/Branch/Share/Edit/TTS controls under AI messages. Variants: floating, toolbar, compact, vertical. States auto-show relevant buttons.

**artifact-split.css** `ai/artifact-split.css` (CSS) — tags: ai artifact split-pane claude artifacts v0 canvas chatgpt preview code tabs version pager iframe sandbox resizable splitter stacked fullscreen
  Chat-left / artifact-right split pane with Preview/Code tabs + version pager + iframe preview. Draggable splitter. Mobile-stacks under 768px.

**artifact-split.js** `ai/artifact-split.js` (JS, global: `ArtifactSplit`) — tags: ai artifact init addVersion setVersion setTab download open canvas claude v0 splitter drag
  `ArtifactSplit.init('.afct', {versions: [{html, code, label}], initialVersion, onTabChange, onVersionChange, onAction})`. `addVersion()`, `setVersion(idx)`, `setTab('preview'|'code')`. Built-in download + open-in-new-tab.

**agent-trace.css** `ai/agent-trace.css` (CSS) — tags: ai agent-trace step-timeline langchain copilotkit vercel-ai plan tool observation thinking answer action checkpoint error pending running done skipped substep summary compact
  Vertical agent step timeline. Step types: plan/tool/observation/thinking/answer/action/checkpoint/error. States: pending/running/done/error/skipped. Substep dots. Summary footer.

**agent-trace.js** `ai/agent-trace.js` (JS, global: `AgentTrace`) — tags: ai agent-trace addStep update done error skip substep summary autoExpand collapseDone elapsed duration timeline langchain
  `AgentTrace.create('#trace')`. `addStep({type, title, content, state})` returns handle with `.update/.done/.error/.skip/.addSubstep`. Auto-summary with done/running/error counts.

**Phase 14 — Canvas/Editor primitives (`components/`)**

**infinite-canvas.css** `components/infinite-canvas.css` (CSS) — tags: infinite-canvas tldraw excalidraw figma figjam miro pan zoom viewport grid dotted lines blueprint graph plain world-coords screen-coords hud marquee selection node
  Infinite canvas viewport with infinite-tiled grid (dots/lines/blueprint/graph variants). World layer for shapes, UI overlay for screen-space controls. `--icv-tx/-ty/-zoom` drive transform.

**infinite-canvas.js** `components/infinite-canvas.js` (JS, global: `InfiniteCanvas`) — tags: infinite-canvas pan zoom wheel-anchored pinch touch space-drag inertia marquee keyboard tldraw excalidraw figma screenToWorld worldToScreen zoomToFit
  Pan + wheel-anchored zoom + touch pinch + space-drag + inertia + marquee select. Wheel-zooms toward cursor (keeps point under cursor fixed). `setZoom`, `panTo`, `zoomToFit`, `screenToWorld`, `worldToScreen`.

**canvas-minimap.css** `components/canvas-minimap.css` (CSS) — tags: minimap mini-overview canvas tldraw figma viewport-rectangle draggable bottom-right top-left collapse small medium large
  Minimap container + viewport rectangle styles. Positions: bottom-left (default), top-right, etc. Sizes sm/md/lg. Collapsible.

**canvas-minimap.js** `components/canvas-minimap.js` (JS, global: `CanvasMinimap`) — tags: minimap bidirectional drag-rect pan world-bounds nodes shapes infinite-canvas tldraw render resize-observer
  `CanvasMinimap.bind('.cmm', {canvas: InfiniteCanvasInstance, nodeSelector, renderShape})`. Draggable viewport rectangle pans the canvas, panning the canvas moves the rectangle. Auto-renders nodes as rects.

**slash-menu.css** `components/slash-menu.css` (CSS) — tags: slash-menu notion blocknote tiptap inline-command-palette block-insert caret-anchored contenteditable group icon kbd tag new ai
  Caret-anchored block-insert menu (different from global command palette). Groups by category, kbd hint, query echo line, footer with nav/select keys.

**slash-menu.js** `components/slash-menu.js` (JS, global: `SlashMenu`) — tags: slash-menu trigger contenteditable textarea input caret-position filter keyboard-nav enter-insert remove-trigger insert notion blocknote
  `SlashMenu.bind('[data-slash]', {trigger: '/', items: [{id, label, desc, icon, group, keywords, insert(editor)}], onSelect})`. Opens at caret when user types trigger, filters live, removes trigger + query on select.

**block-drag-handle.css** `components/block-drag-handle.css` (CSS) — tags: block-drag-handle notion gutter ⋮⋮ hover-revealed drag-reorder add-block coda blocknote ghost menu light tight wide always-on
  Hover-revealed left-gutter handle (⋮⋮) + `+` insert button per block. Drag-to-reorder with floating ghost. Drop indicators (line above/below).

**block-drag-handle.js** `components/block-drag-handle.js` (JS, global: `BlockDragHandle`) — tags: block-drag-handle reorder drag drop actions menu context-menu duplicate delete notion blocknote contextmenu pointer
  `BlockDragHandle.init('[data-bdh]', {onReorder, onAdd, actions: [{id, label, icon, shortcut, run}]})`. Pointer-driven reorder with ghost, right-click on handle = actions popover.

**shortcut-cheatsheet.css** `components/shortcut-cheatsheet.css` (CSS) — tags: shortcut cheatsheet keyboard shortcuts overlay ? github gmail linear vercel trello modal columns kbd platform-aware mac windows search filter cmd-style raycast
  `?` overlay modal with grouped key tables, kbd glyphs, search filter, platform-aware mod glyph (⌘/Ctrl). Variants: wide (3-col), tall, cmd-style (Raycast-like flat list).

**shortcut-cheatsheet.js** `components/shortcut-cheatsheet.js` (JS, global: `ShortcutCheatsheet`) — tags: shortcut cheatsheet open close trigger-key data-trigger groups setGroups platform-aware mod-glyph cmd ctrl auto-bind
  `ShortcutCheatsheet.init({title, groups: [{title, items: [{keys, label, combo}]}], triggerKey: '?'})`. Auto-formats `mod → ⌘/Ctrl`, `alt → ⌥/Alt`, etc. `setGroups()` for dynamic updates.

**Phase 14 — Shaders (`shaders/`)**

**voronoi.glsl.js** `shaders/voronoi.glsl.js` (JS, global: `VoronoiShader`) — tags: shader voronoi worley cells f1 f2 distance edges cracked-glass leather plasma palette book-of-shaders lygia
  Worley cell pattern with 4 modes: F1, F2-F1 (edges), random per cell, palette mix. 8 palettes (cosmic/cyber/ocean/fire/forest/cracked/leather/plasma).

**kaleidoscope.glsl.js** `shaders/kaleidoscope.glsl.js` (JS, global: `KaleidoscopeShader`) — tags: shader kaleidoscope mirror sector-fold polar lygia hydra fbm noise procedural image psychedelic
  Sector-folding UV transform — wraps any source (procedural fBm by default, or image texture) into N rotationally-symmetric segments. `.imageFragment` for use with `imageUniforms`.

**raymarch-sdf.glsl.js** `shaders/raymarch-sdf.glsl.js` (JS, global: `RaymarchSDFShader`) — tags: shader raymarch sdf signed-distance sphere box torus smin blend inigo-quilez iq normal soft-shadow fresnel
  Raymarched 3D primitives (sphere/box/torus) with polynomial smin blend. Soft shadows, fresnel rim, mouse-orbit camera. 6 material palettes (cosmic/gold/chrome/mint/rose/noir).

**godrays.glsl.js** `shaders/godrays.glsl.js` (JS, global: `GodraysShader`) — tags: shader godrays light-rays volumetric crepuscular sun-shafts atmospheric cinematic radial-blur shadertoy dust mouse-driven
  Volumetric light shafts from a configurable sun position. Cloud/horizon silhouette + animated dust motes. Mouse drives sun. 6 palettes (cinematic/forest/cathedral/sunset/dive/moonlit).

**plasma.glsl.js** `shaders/plasma.glsl.js` (JS, global: `PlasmaShader`) — tags: shader plasma demoscene 80s 90s sum-of-sines iq cosine-palette nostalgic retro arcade matrix monochrome
  Classic demoscene plasma: sum-of-sines field through IQ cosine palette LUT. 10 palettes (rainbow/cosmic/fire/cyber/ocean/sunset/monochrome/pastel/matrix/arcade).

**Phase 14 — Visual polish (`effects/`, `blocks/`)**

**light-rays.css** `effects/light-rays.css` (CSS) — tags: light-rays volumetric beams god-rays magic-ui apple keynote conic-gradient blur screen-blend violet cyan amber rose mint cosmic sunset white rainbow tight wide soft strong noise floor anim
  Pure-CSS volumetric light beams via conic-gradient + blur + screen blend. 9 colors + 6 directions (top/top-left/top-right/bottom/left/right) + animation. `.lrays-layer` standalone overlay. `.lrays-floor` for under-glow.

**backlight-halo.css** `effects/backlight-halo.css` (CSS) — tags: backlight halo bloom color-sampled apple-tv youtube-ambient spotify cover ambient-lighting media image video tv rounded circle pill floor top spin pulse hover sm md lg xl
  Color-matched bloom halo behind images/videos. Variants: sizes (sm→xl), shapes (rounded/circle/square/pill), directional (floor/top), spin (conic), pulse, hover-reveal. Use with `backlight-halo.js` for auto-sampling.

**backlight-halo.js** `effects/backlight-halo.js` (JS, global: `BacklightHalo`) — tags: backlight halo color-sample dominant palette k-means apple-tv youtube ambient bloom auto-color
  `BacklightHalo.init('[data-bhalo]')` auto-samples dominant colors from img/video and sets `--bh-c1/-c2/-c3`. Reuses `GradientExtract` if present; ships with a tiny fallback extractor.

**neumorph-buttons.css** `blocks/neumorph-buttons.css` (CSS) — tags: neumorph neumorphism soft-ui inset outset shadow dribbble 2020 cult-ui texture pressed flat soft deep primary fill noise toggle aria-pressed disabled light pill icon group
  Soft-UI / neumorphic buttons via dual inset/outset shadows. Variants: pressed, flat, soft, deep, primary (gradient stroke), fill, icon, pill, square, circle. Modifiers: noise overlay, aria-pressed toggle, light theme, group container, texture variant.

**Phase 14 — Pro-tool patterns (`components/`)**

**terminal-block.css** `components/terminal-block.css` (CSS) — tags: terminal-block warp command output exit-code duration cwd copy permalink rerun collapse success error running cancelled ansi colors compact card borderless selected linked
  Warp-style "command + output + exit-code + duration" as a discrete selectable record. Header has copy/permalink/rerun/collapse actions. ANSI color helpers for piped output. Permalink target via `#tblk-N`.

**terminal-block.js** `components/terminal-block.js` (JS, global: `TerminalBlock`) — tags: terminal-block create appendOutput setState success error running collapse expand copy clipboard permalink rerun timer duration warp
  `TerminalBlock.create(parent, {cmd, cwd})` returns handle with `.appendOutput/.setState/.collapse/.expand`. Live timer while running. Click line-number copies permalink.

**log-stream.css** `components/log-stream.css` (CSS) — tags: log-stream live-logs virtualized vercel datadog railway render timestamps levels info warn error debug trace success fatal follow-tail filter regex line-anchor permalink mark highlight light compact
  Virtualized live log viewer with timestamp + severity gutters, level toggle pills, follow-tail with pause-on-scroll-up, regex filter input, line-number permalinks (#L42), match highlight via `<mark>`.

**log-stream.js** `components/log-stream.js` (JS, global: `LogStream`) — tags: log-stream append filter scrollToLine bindEventSource sse follow-tail levels regex permalink hash auto-pause scroll
  `LogStream.create('#logs', {levels, follow, maxLines, formatTime})`. `.append({time, level, msg})`, `.setFilter('regex')`, `.bindEventSource(es, {parse: 'json'|'text'})`. Auto-disables follow when user scrolls up.

**stack-trace.css** `components/stack-trace.css` (CSS) — tags: stack-trace sentry bugsnag rollbar error-frame expandable source-context line-highlight in-app vendor fold locals key-value typed-rows light compact borderless
  Sentry-style expandable stack-trace frames with surrounding source-line context + error-line highlight + locals key/value drawer. Toggle in-app vs vendor frames. Vendor fold-up. Light theme.

**stack-trace.js** `components/stack-trace.js` (JS, global: `StackTrace`) — tags: stack-trace render frames source locals in-app vendor toggle expand sentry bugsnag init
  `StackTrace.render(target, {error: {type, message}, frames: [{fn, path, line, col, inApp, isError, source, sourceStart, errorLine, locals}], defaultShow: 'app'|'vendor'|'all'})`.

---

### Phase 15 — More AI + editor + distinctive text + shaders + media

**ai-diff.css** `ai/ai-diff.css` (CSS) — tags: ai-diff cursor-ide accept-reject hunks inline-edit copilot continue red green word-level pending review proposed-changes side-by-side compact loading
  Cursor-style interactive diff with per-hunk Accept/Reject + global Accept-all/Reject-all. Hunk states: accepted (del removed), rejected (add removed + faded), partial. Word-level `+/-` highlights. Side-by-side variant.

**ai-diff.js** `ai/ai-diff.js` (JS, global: `AIDiff`) — tags: ai-diff cursor accept reject hunks resolve render getResult getResolvedText apply edits
  `AIDiff.create(target, {file, hunks: [{id, startLine, lines: [{type:'add'|'del'|'context', text}]}], onAccept, onReject, onResolve})` returns `{accept, reject, acceptAll, rejectAll, getResult, getResolvedText}`.

**voice-input.css** `ai/voice-input.css` (CSS) — tags: voice-input mic microphone speech-to-text whisper chatgpt audio waveform recording timer pill icon-only floating push-to-talk transcribing
  Mic button with live audio waveform bars + recording timer + pill/icon-only/floating layouts. States: idle / recording (red pulse + bars dance) / processing (spinner + "Transcribing…") / error.

**voice-input.js** `ai/voice-input.js` (JS, global: `VoiceInput`) — tags: voice-input speech-recognition web-speech webkit-speech-recognition media-recorder waveform analyser auto-stop silence-detect whisper-upload transcript interim
  Combines `SpeechRecognition` (in-browser transcription) + `Web Audio Analyser` (waveform) + optional `MediaRecorder` (Whisper-style upload). `VoiceInput.bind('[data-vin]', {lang, continuous, interim, autoStop, onTranscript, onAudio})`.

**gravity.js** `interactions/gravity.js` (JS, global: `Gravity`) — tags: gravity physics matter-js-lite rigid-body bounce friction cursor-attract repel drag flick shake aabb collision dom
  Lightweight 2D physics for DOM elements. Bodies fall, collide AABB, can be flicked, attracted to / repelled from cursor. `Gravity.create(stage, {gravity, bounce, friction, cursorMode, cursorStrength, boundary})`. Methods: `.add/.remove/.shake/.flick/.pause/.play`.

**elastic-line.css** `interactions/elastic-line.css` (CSS) — tags: elastic-line svg spring cursor-bow quadratic-bezier fancy-components thin thick fat violet cyan rose amber mint mono gradient glow rainbow
  Styles for SVG line that bows toward cursor. Variants thin/thick/fat + 6 colors + gradient + glow + rainbow. Pairs with `elastic-line.js`.

**elastic-line.js** `interactions/elastic-line.js` (JS, global: `ElasticLine`) — tags: elastic-line spring damping stiffness pointer fancy-components cursor follow svg path bezier quadratic
  Spring-driven SVG curve that bows toward cursor with spring-back. `ElasticLine.init('[data-eln]', {stiffness, damping, strength, activeOnHover, gradient})`. Uses `B(0.5) = (cursor)` math to make curve pass through cursor.

**image-cursor-trail.js** `effects/image-cursor-trail.js` (JS, global: `ImageCursorTrail`) — tags: image-cursor-trail skiper fancy olivier-larose pointer-move images-spawn fade-out scale rotation tilt momentum gallery hero
  Spawns images along cursor path with fade + scale-out. `ImageCursorTrail.bind('.hero', {images: [...], distance, lifetime, size, rotation, randomImage, maxOnScreen})`.

**triage-row.css** `components/triage-row.css` (CSS) — tags: triage-row linear inline-edit list issues bug-tracker priority status assignee labels avatar due j-k-nav keyboard-first focused selected editing completed bulk
  Linear-style compact inline-editable row. Priority (urgent/high/medium/low/none) + key + title + status (backlog/todo/progress/review/done/cancelled) + labels (bug/feature/improvement/design/perf) + assignee avatar + due date. Bulk-edit bar. Compact / comfortable density.

**triage-row.js** `components/triage-row.js` (JS, global: `TriageRow`) — tags: triage-row inline-edit keyboard-nav j-k arrow-keys enter editor select bulk linear field-popup text select multi-select user date
  `TriageRow.init('.trg', {fields: {priority, status, title, labels, assignee, due}, onChange, onCommit, onBulk})`. Keyboard: j/k navigate, Enter/e edit, x select, ⌘A select-all, Backspace delete.

**changelog-popover.css** `components/changelog-popover.css` (CSS) — tags: changelog popover whats-new bell drawer linear vercel stripe productboard release-notes dated entries feature improvement fix breaking image video tag unread mark-read
  Bell-icon-triggered "What's new" popover with dated entries, tags (feature/improvement/fix/breaking), images/videos, unread bullet dots. Layouts: popover (anchored, default), drawer (right rail), fullscreen.

**changelog-popover.js** `components/changelog-popover.js` (JS, global: `ChangelogPopover`) — tags: changelog popover init open close setEntries markRead markAllRead persist localstorage badge count unread linear vercel
  `ChangelogPopover.init({trigger, entries: [{id, date, title, body, tag, image, video, read, link}], persistKey, onMarkRead, onMarkAllRead, onClickEntry})`. Auto-formats dates (relative for recent).

**focus-mode.css** `components/focus-mode.css` (CSS) — tags: focus-mode arc ia-writer linear dim spotlight pomodoro ambient cosmic warm cool peek-on-hover floating-bar ring countdown veil
  Body-level dim-everything-except-current-block with ambient tint + peek-on-mousemove. Floating control bar with Pomodoro ring (counts down with low / finished color states) + ambient cycler + exit.

**focus-mode.js** `components/focus-mode.js` (JS, global: `FocusMode`) — tags: focus-mode toggle enter exit pomodoro ambient triggerKey peek-on-mousemove mouse-move-peek dim-siblings arc ia-writer keyboard-shortcut
  `FocusMode.init({keepSelector, dimOpacity, peekOnHover, pomodoro: {duration, onComplete}, ambient, triggerKey})`. Auto-dims top-level siblings of `.focus-keep`. Built-in Pomodoro with ring.

**text-flipping-board.css** `effects/text-flipping-board.css` (CSS) — tags: text-flipping-board split-flap airport-display flapper aceternity char-cell amber cyber cosmic light hero animate
  Airport-style split-flap display. Per-character cells with vertical half-flap animation (`flap-half-top` falls, `flap-half-bottom` rises). 5 themes (default/light/amber/cyber/cosmic) + 5 sizes.

**text-flipping-board.js** `effects/text-flipping-board.js` (JS, global: `TextFlippingBoard`) — tags: text-flipping-board setText scramble char-pool cycle stagger split-flap board animate destination
  `TextFlippingBoard.init('[data-flap]')`. `setText(text, {stagger, perStep})` cycles each cell through char pool from current → target. `scramble({duration, target})` for random reveal.

**encrypted-text.css** `effects/encrypted-text.css` (CSS) — tags: encrypted-text mr-robot aceternity char-cycle lock-in left-to-right hacker terminal matrix acid cyber classified redaction glow cursor blink
  Per-character cycling reveal styles. Variants: mono / glow / cyber / acid / matrix / classified (redaction bars). Optional noise background + blinking cursor.

**encrypted-text.js** `effects/encrypted-text.js` (JS, global: `EncryptedText`) — tags: encrypted-text decrypt reveal char-pool lock stagger perChar inview auto manual mr-robot aceternity
  `EncryptedText.reveal('[data-enctxt]', {chars, perChar, stagger, lockAfter, trigger: 'auto'|'inview'|'manual'})`. Each glyph cycles through random chars then locks left-to-right. `.replay()` to restart.

**gooey-input.css** `effects/gooey-input.css` (CSS) — tags: gooey-input metaball aceternity codrops lucas-bebber feGaussianBlur feColorMatrix sticky-blob expanding search submit fab family-button violet cyan pink amber mint mono cosmic
  Expanding search input where the trigger button, input pill, and submit button "merge" via SVG `goo` filter (feGaussianBlur + feColorMatrix). Plus `.goo-fab` companion (FAB → action row that emerges from the main blob).

**variable-font-cursor.css** `effects/variable-font-cursor.css` (CSS) — tags: variable-font cursor wght wdth slnt inter recursive roboto-flex font-variation-settings kinetic-text per-glyph distance fancy-components magic-ui
  Per-glyph variable-font axis interpolation. `--w/--wd/--sl` CSS vars driven by JS. Variants: inter, recursive (also uses slnt), roboto, funnel. Sizes sm→hero, gradient + glow.

**variable-font-cursor.js** `effects/variable-font-cursor.js` (JS, global: `VariableFontCursor`) — tags: variable-font cursor distance lerp per-glyph wght wdth font-variation-settings smoothing radius falloff kinetic-text
  Lerps each glyph's wght/wdth based on cursor distance. `VariableFontCursor.init('[data-vfc]', {minWeight, maxWeight, minWidth, maxWidth, radius, smoothing, useSlnt, maxSlant})`. Smooth per-frame transition.

**fluid.glsl.js** `shaders/fluid.glsl.js` (JS, global: `FluidShader`) — tags: shader fluid flow curl-noise advection jos-stam pavel-dobryakov mouse-impulse ink-blobs viscosity single-pass
  Single-pass curl-noise fluid approximation with mouse impulse and 3 ink colors. 9 palettes (cosmic/sunset/ocean/fire/aurora/ink/rainbow/poison/pearl).

**sdf-text.glsl.js** `shaders/sdf-text.glsl.js` (JS, global: `SDFTextShader`) — tags: shader sdf text signed-distance-field outline glow extrude valve msdf threshold smoothing palette neon chrome fire cyber mono
  Signed-distance-field text shader: fill + outline + glow + extruded shadow. `.fragment` (texture-based) + `.proceduralFragment` (placeholder bar for demos). 5 palettes.

**waveform-regions.css** `media/waveform-regions.css` (CSS) — tags: waveform regions daw reaper logic-pro final-cut davinci ruler playhead loop-brackets in-out-markers regions-draggable resize-handles toolbar zoom region-color-presets compact card light
  DAW-style timeline: time ruler + waveform canvas + draggable/resizable colored regions with labels + loop in/out brackets with range overlay + playhead + toolbar (play/loop/time/zoom). Compact / card / light variants. Region color presets.

**waveform-regions.js** `media/waveform-regions.js` (JS, global: `WaveformRegions`) — tags: waveform regions audio audioContext decode peaks playhead loop draggable resize regions add remove selectivize zoom seek play
  Decodes audio via AudioContext + computes peaks + draws to canvas. Regions are draggable + resizable (l/r handles). Loop brackets with in/out. Methods: `play/pause/seek/addRegion/removeRegion/setLoop/zoom`. `onRegionChange`, `onLoopChange` callbacks.

---

### Phase 16 — Crazy cursor library + button packs + loaders + mobile + specialty

**Cursor library (`cursor/` — new folder)**

**cursor-shapes.css** `cursor/cursor-shapes.css` (CSS) — tags: cursor system pointer text grab grabbing wait help not-allowed crosshair cell context-menu copy alias zoom-in zoom-out resize stage interactive
  Full set of standard `cursor:` keyword presets as utility classes (`.cur-pointer`, `.cur-grab`, `.cur-zoom-in`, all 8 resize directions, etc.). Plus `.cur-stage*` helpers that propagate to children. Zero JS.

**custom-cursors.css** `cursor/custom-cursors.css` (CSS) — tags: cursor custom svg data-uri emoji sparkle star fire rocket heart magic ghost target reticle crosshair pen brush eraser hand pixel minecraft fancy gradient laser bullet dot-glow ring arrow neon foil
  30+ custom SVG cursors as data-URI presets. Emoji cursors (sparkle/star/fire/rocket/heart/magic/ghost/skull/flower/money/gem). Tool cursors (target/reticle/pen/brush/eraser/hand/pointer-arrow). Themed (pixel/minecraft/holo). Plus `.ccur-hidden` + `.ccur-fake-cursor` for JS-painted custom cursors.

**cursor-hud.css** `cursor/cursor-hud.css` (CSS) — tags: cursor hud coordinates crosshair grid blueprint canvas precision mono x-y readout drafting design-editor
  Coordinates HUD + crosshair grid styles for canvases / editors. `.chud` host + `.chud-crosshair-x/-y` + `.chud-coords` + `.chud-grid`. Variants: blueprint, minimal, precision, mono.

**cursor-hud.js** `cursor/cursor-hud.js` (JS, global: `CursorHud`) — tags: cursor hud coordinates crosshair pointer-track snap scale precision format
  `CursorHud.init('[data-chud]', {showCoords, showCrosshair, format, scale, precision, snap})`. Live updates `--x/--y` + format-string coords on pointermove.

**cursor-trail.css** `cursor/cursor-trail.css` (CSS) — tags: cursor trail particle sparkle dot neon fire snow bubble comet ribbon hearts stars pixel glow lightning fade
  Particle trail styles. 13 styles: dot, sparkle, neon, fire, snow, bubble, comet, ribbon, heart, star, pixel, glow, lightning. CSS keyframes handle fade/rise/spin/flicker.

**cursor-trail.js** `cursor/cursor-trail.js` (JS, global: `CursorTrail`) — tags: cursor trail spawn density max-particles lifetime jitter active-only sparkle fire snow
  `CursorTrail.init('body', {style, density, maxParticles, lifetime, jitter})`. Spawns particles along pointer path. `setStyle()` switches live.

**cursor-spotlight.css** `cursor/cursor-spotlight.css` (CSS) — tags: cursor spotlight reveal mask radial-gradient flashlight illuminate violet cyan invert hard soft halo tight wide huge
  Mask-based spotlight that illuminates content under the cursor. Variants: tight/wide/huge/soft/hard/violet/cyan/invert/halo. JS sets `--mx/--my`.

**cursor-spotlight.js** `cursor/cursor-spotlight.js` (JS, global: `CursorSpotlight`) — tags: cursor spotlight lerp smooth pointer-track radius persistOnLeave reveal
  `CursorSpotlight.init('[data-cspot]', {lerp, radius})`. Smooth-tracks cursor with spring easing.

**cursor-ghost.js** `cursor/cursor-ghost.js` (JS, global: `CursorGhost`) — tags: cursor ghost follower lag spring cascade ring dot square cross emoji difference-blend
  Renders one or more "ghost" cursors that lag behind the real cursor with spring easing. `CursorGhost.init({count, lag, cascade, style: 'ring'|'dot'|'square'|'cross'|'emoji', color, emoji, blendMode})`.

**cursor-zoom.js** `cursor/cursor-zoom.js` (JS, global: `CursorZoom`) — tags: cursor zoom magnifier lens scale shape circle square offset hide-real-cursor
  Magnifier lens that follows the cursor — clones host content into a circular lens, scaled. `CursorZoom.bind('.zoomable', {size, zoom, shape, border, offset})`.

**cursor-repel.js** `cursor/cursor-repel.js` (JS, global: `CursorRepel`) — tags: cursor repel attract push pull physics spring radius strength scatter
  Items in a container drift away from (or toward) the cursor with spring physics. `CursorRepel.init('.stage', {mode: 'repel'|'attract', radius, strength, lerp, itemSelector, rotate, fadeOut})`.

**cursor-tool.css** `cursor/cursor-tool.css` (CSS) — tags: cursor tool editor pen brush eraser marker pencil spray blur smudge shape fill pick zoom pan text select hud color-swatch size-ring
  Tool-indicator cursors for paint/editor apps: pen, pencil, brush, marker, eraser, spray, blur, smudge, shape, fill, pick, zoom, pan, text, select. Plus `.ctool-hud` overlay for live size/color/name display.

**cursor-proximity.js** `cursor/cursor-proximity.js` (JS, global: `CursorProximity`) — tags: cursor proximity hover ripple glow scale tilt wobble rise approach reactive
  Elements react when cursor gets close: ripple emit / continuous glow / scale / 3D tilt / rise / wobble. `CursorProximity.init('.target', {radius, effect, continuous, color, cooldown})`.

**cursor-text.js** `cursor/cursor-text.js` (JS, global: `CursorText`) — tags: cursor text label follower hover-label role-indicator data-ctxt difference-blend lerp
  Floating label that rides next to the cursor showing the element's data-ctxt attribute (e.g. "View →", "Drag"). `CursorText.init('[data-ctxt]', {offset, blendMode, lerp})`.

**cursor-paint.js** `cursor/cursor-paint.js` (JS, global: `CursorPaint`) — tags: cursor paint draw canvas signature doodle rainbow glow eraser smoothing quadratic-bezier line-width auto-fade
  Drag-to-paint on a canvas. `CursorPaint.bind('canvas', {color, lineWidth, smoothing, autoFade, rainbow, glow, eraser})`. Methods: `clear / exportImage / setColor / setEraser / setLineWidth / setRainbow / setGlow`.

**Buttons expansions**

**buttons-liquid.css** `blocks/buttons-liquid.css` (CSS) — tags: buttons liquid morph squish inflate jelly stretch drip melt magma slime bubble ripple splash ooze blob border-radius cubic-bezier
  13 morphing/liquid button variants. `.lbtn` base + variants: blob, squish, inflate, jelly, stretch, drip, melt, magma, slime, bubble, ripple, splash, ooze. 6 color presets.

**buttons-extra.css** `blocks/buttons-extra.css` (CSS) — tags: buttons brutalist retro-pixel emboss deboss sticker paper tape torn hand-drawn ink-stamp neon-frame glass-deep lifted 3d-emboss sci-fi terminal cassette polaroid vintage comic lofi
  20 distinctive button styles outside the standard pack. `.xbtn` base. Includes brutalist, 8-bit pixel, emboss/deboss, sticker, paper, washi-tape, torn paper, hand-drawn, ink stamp, neon frame, glass-deep, lifted, 3d-emboss, sci-fi, terminal, cassette, polaroid, vintage, comic, lo-fi.

**buttons-3d.css** `blocks/buttons-3d.css` (CSS) — tags: buttons 3d depth chunky stack cube mario candy key gum pancake layer thick-edge edge-glow deep-press
  Heavy 3D-depth button styles with chunky press. `.bbtn` base. Variants: stack, cube, chunky, mario, candy, key (typewriter), gum, pancake, layer, thick-edge, edge-glow, deep-press. 5 color overrides.

**Loaders expansions**

**loaders-fancy.css** `blocks/loaders-fancy.css` (CSS) — tags: loaders fancy dna pacman quantum holographic hourglass atom signal ekg breath wave-pulse infinity vortex droplet dominos cyber fire mint rose cosmic
  25 distinctive loaders. `.fldr` base. Variants: dna, pacman, quantum, holographic, hourglass, atom, signal (cell bars), ekg (heartbeat), breath, wave-pulse, infinity-loop, vortex, droplet, dominos. 5 colors + 4 sizes.

**skeleton-pack.css** `blocks/skeleton-pack.css` (CSS) — tags: skeleton placeholder loading-state shimmer wave pulse card list profile article tweet table comment message gallery dashboard product video-thumb
  15+ skeleton-loader compositions. Primitives (`.sk-line`, `.sk-thumb`, `.sk-avatar`, `.sk-block`, `.sk-bar`, `.sk-button`) + layouts (card, list-item, profile, article, tweet, table-row, comment, message, gallery, dashboard, product, video-thumb). 4 animation styles + light/warm/cool themes.

**loaders-text.css** `blocks/loaders-text.css` (CSS) — tags: loaders text typing dots ellipsis-bounce scramble shimmer rainbow neon glitch blink slide wave pulse gradient-text marquee morse terminal scanline
  17 text-based loading indicators. `.tldr` base + variants: dots, typing, ellipsis-bounce, scramble, shimmer, rainbow, neon, glitch, blink, slide, wave (letter-by-letter), pulse, marquee, morse, terminal, scanline.

**Mobile patterns (`mobile/` — new folder)**

**bottom-sheet.css** `mobile/bottom-sheet.css` (CSS) — tags: bottom-sheet mobile ios android drag dismiss handle backdrop modal action-sheet panel snap rounded-top glass safe-area
  iOS/Android-style draggable bottom sheet. `.bsht` host + `.bsht-panel` + `.bsht-handle` + `.bsht-backdrop`. Variants: snap (snap points), rounded-top, glass, light. Built-in safe-area-bottom.

**bottom-sheet.js** `mobile/bottom-sheet.js` (JS, global: `BottomSheet`) — tags: bottom-sheet open close drag dismiss snap-points velocity backdrop esc-close ios
  `BottomSheet.init('.bsht', {snapPoints, initialSnap, backdrop, dismissOnBackdrop, onOpen, onClose, onSnap})`. Velocity-based dismissal + spring snapping.

**tab-bar.css** `mobile/tab-bar.css` (CSS) — tags: tab-bar mobile bottom-nav ios android badge fab safe-area glass rounded no-labels stacked active-indicator
  iOS/Android-style bottom tab bar. `.tbar > .tbar-item`. Active-indicator line + badge counts + center FAB (Twitter/Instagram-style compose). Variants: glass, light, rounded (floating pill), no-labels, stacked.

**swipe-stack.css** `mobile/swipe-stack.css` (CSS) — tags: swipe-stack tinder cards tilt-stack pile like nope super-like actions indicator dismiss
  Tinder-style swipeable card stack. `.swst > .swst-card`. Stack-offset positions, indicators (LIKE/NOPE/SUPER), action button row, swipe-out animations.

**swipe-stack.js** `mobile/swipe-stack.js` (JS, global: `SwipeStack`) — tags: swipe-stack tinder threshold velocity drag rotation directions left right up down commit-swipe
  `SwipeStack.init('.swst', {threshold, velocityThreshold, rotationFactor, allowedDirections, onSwipe})`. Pointer-driven drag with rotation; commits when threshold/velocity hit.

**Specialty / effects / game UI**

**perspective-tunnel.css** `effects/perspective-tunnel.css` (CSS) — tags: perspective tunnel synthwave vaporwave cyber 80s 90s retro grid floor sun stars matrix blueprint fire mono
  Vaporwave/synthwave perspective tunnel — animated floor grid + (optional) ceiling mirror + retro sun + stars. Variants: synthwave, cyber, blueprint, fire, matrix, mono.

**parallax-stars.css** `effects/parallax-stars.css` (CSS) — tags: parallax stars galaxy night dawn dust blizzard layers drift twinkle shooting-star background hero
  Multi-layer parallax starfield. 3 layers drift at different speeds. Variants: night, galaxy, dawn, dust, blizzard. Optional shooting-star + twinkle modifiers.

**isometric-grid.css** `effects/isometric-grid.css` (CSS) — tags: isometric grid 3d background blueprint cyan violet mono sunset mint dim dense loose drift cube
  3D isometric grid background. `.iso` + variants (cyan, violet, mono, blueprint, sunset, mint). Density (dim, dense, loose). Optional `.iso-cube` decorative cube tile.

**game-hud.css** `feedback/game-hud.css` (CSS) — tags: game hud health mana stamina xp shield combo timer quest coins lives buffs minimap damage-popup heal-popup crit segmented-bar
  Gamification HUD elements: health/mana/stamina/xp/shield bars, segmented pip bar, resource tiles (coins/gems/keys), lives row, combo counter, timer (with low-state pulse), quest tracker, buff icons with countdown, minimap, damage/heal/crit floating pop-ups.

**spotlight-search.css** `components/spotlight-search.css` (CSS) — tags: spotlight search raycast macos windows-run command-palette centered overlay sections items shortcut empty split detail
  Raycast/macOS Spotlight-style centered search overlay. `.spot` + `.spot-card` + `.spot-input-row` + `.spot-results` + `.spot-foot`. Sections, items with icons + shortcuts, kbd footer. Split-view variant (Raycast detail pane). Light theme.

**toast-stack-2.css** `components/toast-stack-2.css` (CSS) — tags: toast-stack sonner vercel collapsing expandable notification success error warning info loading progress-bar swipe-dismiss
  Sonner-style toast stack — collapses to a tile when not hovered, expands on hover. `.tstk > .tstk-item` with types (success/error/warning/info/loading). Built-in progress-bar countdown + dismissal swipe. 4 corner positions.

**command-pill.css** `components/command-pill.css` (CSS) — tags: command-pill floating-pill linear vercel arc bottom-anchored action-bar quick-actions primary glass shortcut count auto-hide selection-toolbar
  Floating action pill (Linear/Arc/Vercel-style). `.cpill > .cpill-btn / .cpill-primary / .cpill-sep / .cpill-shortcut / .cpill-count`. Variants: glass, light, floating-right, mini, hidden-on-scroll, selection (anchored above text selection).

**Phase 17 — WatermelonUI ports (top 100 picks)**

**ai-inputs-pack.css** `ai/ai-inputs-pack.css` (CSS) — tags: ai-input composer prompt-box textarea send chatgpt claude perplexity gradient-border minimal underline pill large-pad
  5 AI composer input variants in one file: `.aip-1` through `.aip-5` — clean, pill, large pad, minimal underline, gradient-bordered.

**knob-slider.css** `blocks/knob-slider.css` (CSS) — tags: knob rotary control dial daw synth audio plugin sensitivity drag svg-arc indicator
  Rotary knob control SVG ring + cap + indicator. Sensitivity-based pointer drag.

**knob-slider.js** `blocks/knob-slider.js` (JS, global: `KnobSlider`) — tags: knob rotary drag pointer sensitivity onChange onCommit angle
  `KnobSlider.init('.knob', {min, max, value, sensitivity, snap, onChange, onCommit})`. Vertical-drag value change with arc updates.

**scrub-slider.css** `blocks/scrub-slider.css` (CSS) — tags: scrub slider video-scrub timeline ticks magnetic snap drag pointer cuepoint
  Video-scrub style tick slider — 32 ticks with magnetic snap, drag-to-scrub progress fill.

**scrub-slider.js** `blocks/scrub-slider.js` (JS, global: `ScrubSlider`) — tags: scrub slider drag snap tick value onChange onCommit
  `ScrubSlider.init('.scrub', {tickCount, snap, onChange, onCommit})`. Drag along ticks with magnetic snap behavior.

**signature-pad.css** `media/signature-pad.css` (CSS) — tags: signature pad sign canvas pen draw input form esign agreement legal dark sm
  Pen-style signature input canvas. `.sigpad > .sigpad-canvas + .sigpad-line + .sigpad-hint + .sigpad-actions`. Variants: dark, sm.

**signature-pad.js** `media/signature-pad.js` (JS, global: `SignaturePad`) — tags: signature canvas pen draw smooth quadratic dpr clear save dataurl
  `SignaturePad.init('[data-sigpad]', {strokeColor, strokeWidth, smoothing, onChange, onSave})`. Smoothed quadratic-curve drawing with `.clear()`, `.toDataURL()`, `.isEmpty()`.

**gooey-menu.css** `effects/gooey-menu.css` (CSS) — tags: gooey menu morph svg-filter goo blob fab next-status submenu liquid
  SVG-filter morphing menu (Next.js status panel style). Items appear to "ooze" out from the trigger. Requires `<filter id="gooey">`.

**morphing-button.css** `components/morphing-button.css` (CSS) — tags: morphing-button morph form spinner check success error loading expand collapse state
  Button that morphs into form/spinner/check/error/expanded panel. States: `is-loading`, `is-success`, `is-error`, `is-expanded`. Companion `.morph-panel`.

**fluid-tabs.css** `components/fluid-tabs.css` (CSS) — tags: fluid-tabs sliding-pill flip resize-observer underline rounded vertical
  Sliding-pill tabs with FLIP. `.ftab > .ftab-list > .ftab-btn + .ftab-pill`. Variants: underline, rounded, vertical.

**fluid-tabs.js** `components/fluid-tabs.js` (JS, global: `FluidTabs`) — tags: fluid-tabs slide pill flip resize observer onChange index
  `FluidTabs.init('[data-ftab]', {panels, onChange})`. Auto-positions pill via ResizeObserver; flips between buttons.

**scroll-island.css** `components/scroll-island.css` (CSS) — tags: scroll-island dynamic-island scroll-aware pill collapsed expanded floating notification now-playing progress
  Dynamic Island clone. Variants: `.sci-floating`, `.sci-notif`, `.sci-nowplaying` (animated music bars), `.sci-progress`.

**radial-nav.css** `components/radial-nav.css` (CSS) — tags: radial nav pie-menu circular carousel intro orbit trig css-vars
  Circular pie menu / radial carousel / radial intro. CSS vars `--r-radius`, `--r-count`, `--r-start`, `--r-spread` drive trig positioning.

**flip-card.css** `components/flip-card.css` (CSS) — tags: flip-card front back hover click horizontal vertical 3d-dramatic stack-behind
  Front/back flip card. Variants: `.fcard-hover` / `.fcard-click`, horizontal/vertical, `.fcard-dramatic` (3D), `.fcard-stack` (stack-behind preview).

**flip-clock.css** `components/flip-clock.css` (CSS) — tags: flip-clock split-flap countdown timer mechanical noir amber cyber vintage mono lg md sm
  Mechanical flip-clock with 5 themes (noir/amber/cyber/vintage/mono), 5 sizes. JS adds `.is-flipping` for the half-fold animation.

**wiggling-cards.css** `components/wiggling-cards.css` (CSS) — tags: wiggling-cards hover playful tilt pulse shake dance bounce swing sway jelly rubber wobble
  10 playful hover animations: `.wig-tilt/-pulse/-shake/-dance/-bounce/-swing/-sway/-jelly/-rubber/-wobble`.

**dialog-stack.css** `components/dialog-stack.css` (CSS) — tags: dialog-stack notification-center apple stacked cards fan spread reveal counter dismiss
  Apple Notification Center-style stacked dialog cards. `.dstack > .dstack-card`. Variants: default fan-reveal, spread, fan.

**card-swipe.css** `components/card-swipe.css` (CSS) — tags: card-swipe ios swipe-to-reveal actions archive delete pin flag mute mark stacked rounded
  iOS-style swipe-to-reveal action card. `.cswipe > .cswipe-actions-left/-right + .cswipe-card`. Action colors: archive/flag/pin/delete/mark/mute.

**card-swipe.js** `components/card-swipe.js` (JS, global: `CardSwipe`) — tags: card-swipe drag pointer threshold rubber-band open close onAction
  `CardSwipe.init('[data-cswipe]', {threshold, maxOverDrag, closeOnTapOutside, onOpen, onClose, onAction})`. Pointer-drag with rubber-band; `.open(dir)/.close()`.

**text-shimmer-wave.css** `effects/text-shimmer-wave.css` (CSS) — tags: text-shimmer wave word-by-word stagger gradient-wash rainbow glow fast
  Word-by-word shimmer wash. `.tshim > span`. Variants: fast, rainbow, glow.

**glitch-burst.css** `effects/glitch-burst.css` (CSS) — tags: glitch burst rgb-split chromatic-aberration hover click strong mint orange one-shot
  Single-shot RGB glitch on hover/click. Uses `data-text` attr. Variants: strong, mint, orange.

**sticker-peel.css** `effects/sticker-peel.css` (CSS) — tags: sticker peel corner foil hover pink mint cyan amber rotate
  Hover/tap peels sticker corner. `.stkr + .stkr-corner`. Positions: tl/tr (default)/bl/br. Colors + foil holographic variant.

**text-decoder.css** `effects/text-decoder.css` (CSS) — tags: text-decoder cypher matrix scramble cursor blink monospace green amber cyan
  Cypher/Matrix-style monospace look with blinking cursor. Pair with `TextReveal.scramble()` for the animated decode behavior.

**text-flicker.css** `effects/text-flicker.css` (CSS) — tags: text-flicker neon sign crt vacancy broken slow pink cyan amber
  Neon-sign flicker. Variants: slow, pink, cyan, amber, broken (more erratic).

**ribbon-banner.css** `effects/ribbon-banner.css` (CSS) — tags: ribbon banner corner shoulder award medal v-cut fold pink mint cyan amber violet
  Corner / shoulder / award ribbons. `.rib-corner` (4 positions), `.rib-shoulder`, `.rib-banner` (V-cut ends), `.rib-award` (medal w/ tails).

**magnetic-grid.css** `effects/magnetic-grid.css` (CSS) — tags: magnetic-grid dot-grid cursor mouse-tracking glow spotlight tight soft cyan pink amber
  Dot grid with mouse-following glow spotlight. Set `--mx`/`--my` on pointermove. Variants: tight, soft, cyan, pink, amber.

**hover-lift-3d.css** `effects/hover-lift-3d.css` (CSS) — tags: hover-lift 3d perspective rotateX rotateY tilt shadow glow strong soft flip
  Card lifts + tilts on hover. CSS-only — no JS needed. Variants: strong, soft, flip, shadow-pink/cyan/amber/violet.

**typewriter-loop.css** `effects/typewriter-loop.css` (CSS) — tags: typewriter loop type single-phrase caret monospace css-only fast slow no-cursor
  CSS-only looping single-phrase typewriter. Variants: fast, slow, mono, no-cursor.

**swipe-deck-fade.css** `effects/swipe-deck-fade.css` (CSS) — tags: swipe-deck stack cards depth fade hover-lift static-stack tinder-visual
  Static visual stack-of-cards with depth fade + rotate. Distinct from interactive mobile/swipe-stack.

**floating-tags.css** `effects/floating-tags.css` (CSS) — tags: floating-tags chips cloud pills bob gradient outline glow
  Pill chips that float in/up gently with stagger. Variants: gradient, outline, glow.

**text-reveal-mask.css** `effects/text-reveal-mask.css` (CSS) — tags: text-reveal mask bar wipe css-only sweep left vertical cyan pink amber slow
  Bar / mask wipe that reveals text. CSS-only. Variants: bar, left, vertical, cyan, pink, amber, slow.

**fintech-pack.css** `components/fintech-pack.css` (CSS) — tags: fintech swap-card send-money family-receive credit-usage budget fund-widget wallet-card transaction-list keypad ring sparkline
  8 distinct money widgets: `.fin-swap`, `.fin-send`, `.fin-recv`, `.fin-credit` (ring), `.fin-budget` (bar), `.fin-fund` (sparkline up/down), `.fin-wallet` (credit-card), `.fin-tx` (list).

**content-cards-pack.css** `components/content-cards-pack.css` (CSS) — tags: content-cards profile-hero profile-stats notion-toggle folder-stack action-sheet share-sheet onboarding pricing-tier feature-glow quote article event contact playlist song podcast recipe character team album-stack
  20 content card patterns in one file: profile-hero, stats, notion-toggle, folder-stack, action-sheet, share-sheet, onboarding, pricing-pro, feature-glow, quote, article, event, contact, playlist, song, podcast, recipe, character, team, album-stack.

**tree-menu.css** `components/tree-menu.css` (CSS) — tags: tree-menu nested collapsible finder-style indent guide-line keyboard sm light
  Nested collapsible tree (Finder-style). `.tmenu > .tmenu-node > .tmenu-row + .tmenu-children`. Variants: sm, light.

**tree-menu.js** `components/tree-menu.js` (JS, global: `TreeMenu`) — tags: tree-menu toggle keyboard nav arrow-keys expand collapse onSelect
  `TreeMenu.init('[data-tmenu]', {expandAll, onSelect})`. Click + keyboard (←/→/↑/↓) nav with `.expandAll()`/`.collapseAll()`.

**nav-pack.css** `components/nav-pack.css` (CSS) — tags: nav-pack sidebar collapsible header-glass segment-control github-stars notification-bell sticky frosted blur ring
  5 nav patterns: `.sbcp` (collapsible sidebar), `.hglass` (sticky frosted header), `.segctl` (sliding-pill segment), `.ghs` (GitHub stars button), `.nbell` (notification bell with badge + ring).

**nav-pack.js** `components/nav-pack.js` (JS, global: `NavPack`) — tags: nav-pack sidebar segment github-stars bell ring fetch api
  `NavPack.sidebar()`, `.segment({onChange})`, `.githubStars({owner, repo})` (fetches star count), `.bell({count, ring, onClick})`.

**blocks-watermelon-pack.css** `blocks/blocks-watermelon-pack.css` (CSS) — tags: blocks-pack predictive-text ghost frequency-selector editable-chip slot-picker otp-pin copy-input segmented-input pill-tabs floating-action-bar status-pill avatar-stack dropdown-button
  12 block patterns: predictive-text, frequency-selector, editable-chip, slot-picker, otp-pin-pro, copy-input, segmented-input, pill-tabs-mini, floating-action-bar, status-pill (live), avatar-stack-pro, dropdown-button.

**blocks-watermelon-pack.js** `blocks/blocks-watermelon-pack.js` (JS, global: `BlocksWM`) — tags: blocks-pack predict ghost completion freq chip editable otp copy piltabs dropbtn
  `BlocksWM.predict({suggestions})`, `.freq({onChange})`, `.chip({onChange, onRemove})`, `.otp({length, onComplete})`, `.copy({onCopy})`, `.piltabs({onChange})`, `.dropbtn({onMenu})`.

**feedback-pack.css** `feedback/feedback-pack.css` (CSS) — tags: feedback-pack reveal-copy timed-undo qr-display emoji-chips snackbar-stack banner-update coin-flip floating-balloon undo timer
  8 feedback patterns: reveal-copy (blur until hover), timed-undo (toast w/ bar), qr-display, emoji-chips (reactions), snackbar-stack, banner-update, coin-flip (3D), floating-balloon (tooltip).

**feedback-pack.js** `feedback/feedback-pack.js` (JS, global: `FeedbackPack`) — tags: feedback-pack snack undo coinflip revealcopy qr canvas timer
  `FeedbackPack.snack(msg, {type, duration})`, `.undo(msg, {duration, onUndo})`, `.coinFlip({onResult})`, `.revealCopy()`, `.qr({text, size, foreground, background})`.

**ai-watermelon-pack.css** `ai/ai-watermelon-pack.css` (CSS) — tags: ai-pack voice-note contextual-ai-bar thinking-bubble chat-bubble-pro suggestion-chip cmd-k waveform gradient-border sparkle
  5 AI patterns: voice-note (waveform + duration + play), contextual-ai-bar (⌘K + sparkle), thinking-bubble (3-dot), chat-bubble-pro (gradient border + tools), suggestion-chip (✦).

**ai-watermelon-pack.js** `ai/ai-watermelon-pack.js` (JS, global: `AIWmPack`) — tags: ai-pack voice playback ctxbar hotkey cmdk submit
  `AIWmPack.voice({duration, peaks, bars})` (waveform playback sim), `.ctxbar({hotkey, onSubmit})` (cmd+K binding).

**misc-watermelon-pack.css** `components/misc-watermelon-pack.css` (CSS) — tags: misc-pack theme-toggler dragstack info-card stat-glance menu-item preview-hover skill-card footer-mini marquee-pause hover-blob breadcrumb-trail drawer-bottom modal-action-grid stack-fan-reveal
  14 misc patterns: theme-toggler (sun↔moon), draggable-card-stack, info-card (4 types), stat-glance, menu-item-cards, preview-card-hover, skill-card (bars), footer-mini, marquee-pause-hover, hover-blob-button, breadcrumb-chip-trail, drawer-bottom, modal-action-grid (3x3), stack-fan-reveal.

**misc-watermelon-pack.js** `components/misc-watermelon-pack.js` (JS, global: `MiscWMPack`) — tags: misc-pack theme drag-stack blob drawer cursor swipe
  `MiscWMPack.theme({onChange})`, `.dragstack({onSwipe})`, `.blob('.mwm-bbtn')` (cursor tracking), `.drawer({onOpen, onClose})`.

**Phase 18 — WatermelonUI deep cuts (next 50+ patterns, ~23 files)**

**widget-pack.css** `components/widget-pack.css` (CSS) — tags: widget-pack activities-rings weight-widget trade-summary preview-link-card deployment-card integration-card meeting-card event-reminders compose-email files-card stripe-style vercel-style
  10 specialized widgets in one file: activities-rings (3-ring fitness), weight-widget (big metric + trend), trade-summary (buy/sell), preview-link-card (OG card), deployment-card (Vercel build status), integration-card (toggle row), meeting-card (Zoom-style), event-reminders, compose-email-card, files-card.

**code-tabs.css** `components/code-tabs.css` (CSS) — tags: code-tabs docs api stripe-docs tabs language-switcher copy clipboard syntax monospace dark light
  Tabbed code snippet display (Stripe-style docs). `.ctabs > .ctabs-head > .ctabs-tab + .ctabs-copy` then `.ctabs-panels > .ctabs-panel > pre > code`. Light variant + simple token classes.

**code-tabs.js** `components/code-tabs.js` (JS, global: `CodeTabs`) — tags: code-tabs switcher copy clipboard tabs language onChange
  `CodeTabs.init('[data-ctabs]', {onChange})`. Tab switching + clipboard copy of active panel.

**browser-chrome.css** `components/browser-chrome.css` (CSS) — tags: browser-chrome fake-browser frame screenshot mockup product-shot mac win mobile tabs light dark url-bar lights
  Fake browser frame for product screenshots. `.bchrm > .bchrm-bar (.bchrm-lights + .bchrm-url) + .bchrm-body`. Variants: bchrm-mac (default), bchrm-win, bchrm-mobile (phone frame with notch), bchrm-tabs (with tab bar), bchrm-light.

**macos-sidebar.css** `components/macos-sidebar.css` (CSS) — tags: macos-sidebar finder mail-app rail vibrancy blur translucent traffic-lights sections rows active-pill light dark
  Finder/Mail-style sidebar with translucent vibrancy rail. `.msb > .msb-traffic + .msb-section + .msb-row (.msb-ico + .msb-meta)`. Variants: light (default), dark, blur (backdrop-filter), with .msb-layout helper.

**inline-edit-pack.css** `blocks/inline-edit-pack.css` (CSS) — tags: inline-edit pack notion linear edit-in-place contenteditable inline-action floating-input label-selector status-picker split-button
  6 inline-editing primitives: inline-edit (contenteditable click-to-edit), inline-action (toolbar row), floating-input (label that floats up), label-selector (multi-pick chips), status-picker (Linear-style dot indicator), split-button.

**inline-edit-pack.js** `blocks/inline-edit-pack.js` (JS, global: `InlineEditPack`) — tags: inline-edit-pack edit contenteditable status-cycle labels picked split-button onCommit
  `InlineEditPack.edit({onCommit})`, `.status({options, onChange})`, `.splitBtn({onMain, onMenu})`, `.labels({onChange})`.

**audio-player-pro.css** `media/audio-player-pro.css` (CSS) — tags: audio-player-pro waveform play pause time duration mini card gradient album-art track
  Full audio player card with waveform bars, time, controls, more menu. `.apro > .apro-play + .apro-body (.apro-title + .apro-wave + .apro-time) + .apro-more`. Variants: mini (pill), card (with album art), gradient.

**audio-player-pro.js** `media/audio-player-pro.js` (JS, global: `AudioPlayerPro`) — tags: audio-player html5 audio bars waveform peaks click-seek time progress
  `AudioPlayerPro.init('[data-apro]', {src, bars, peaks, onPlay, onPause, onTimeUpdate, onEnd})`. HTMLAudio-backed; click bars to seek; auto-bar generation from random peaks if none provided.

**voice-transcribe.css** `ai/voice-transcribe.css` (CSS) — tags: voice-transcribe live-transcript speech-to-text stt mic listening pause stop duration interim final meter compact
  Live mic → text card. `.vtra > .vtra-head (status+dur) + .vtra-text (final+interim) + .vtra-actions + .vtra-meter`. Variants: compact (pill shape).

**voice-transcribe.js** `ai/voice-transcribe.js` (JS, global: `VoiceTranscribe`) — tags: voice-transcribe webspeech recognition continuous interim getUserMedia analyser level meter pause stop
  `VoiceTranscribe.init('[data-vtra]', {lang, continuous, interimResults, onFinal, onInterim, onLevel, onStop})`. Web Speech API + Web Audio Analyser meter; pause/stop controls.

**social-pack.css** `components/social-pack.css` (CSS) — tags: social-pack x-post twitter verified retweet like comment share user-presence away busy offline award medal gold silver bronze edit-profile community user-card
  6 social patterns: x-post (Twitter card with verified + actions), create-community (setup card), user-presence-avatar (online/away/busy/offline dot), award (gold/silver/bronze/platinum medal with hover wobble), edit-profile, user-card (chip).

**crypto-pack.css** `components/crypto-pack.css` (CSS) — tags: crypto-pack defi aave-swap uniswap-dialog swap-currency returns-calc gas slippage health-factor token-input pink swap-flip
  6 DeFi/crypto patterns: aave-swap (health factor bar), uniswap-dialog (token-in/out + flip), swap-currency (FX), returns-calc (ROI), gas (live gauge), slippage (auto/custom pills).

**carousel-pack.css** `components/carousel-pack.css` (CSS) — tags: carousel-pack minimal motion radial split-accordion grid-disclosure scroll-snap perspective ring expand inline
  5 carousel/disclosure patterns: minimal (scroll-snap), motion (perspective + stagger-in), radial (items in ring), card-split-accordion (expand), collection-grid-disclosure (item expands inline).

**carousel-pack.js** `components/carousel-pack.js` (JS, global: `CarouselPack`) — tags: carousel-pack split-accordion toggle grid-pick expand
  `CarouselPack.split({onToggle})`, `.grid({onPick})`.

**inline-toast.css** `feedback/inline-toast.css` (CSS) — tags: inline-toast in-place success error warn info loading banner action dismissible
  In-place ephemeral message (not floating). `.itoast + variants`. Types: success/error/warn/info/loading (spinner). `.itoast-action`, `.itoast-x`, `.itoast-banner` full-width.

**onboarding-checklist.css** `components/onboarding-checklist.css` (CSS) — tags: onboarding-checklist setup checklist progress tick xp reward compact floating
  Interactive setup checklist with progress bar. `.ochk > .ochk-head + .ochk-bar + .ochk-list > .ochk-item (.ochk-tick + .ochk-rew)`. Variants: compact, floating.

**onboarding-checklist.js** `components/onboarding-checklist.js` (JS, global: `OnboardingChecklist`) — tags: onboarding-checklist tick localStorage progress onComplete onProgress persist
  `OnboardingChecklist.init('[data-ochk]', {storageKey, onComplete, onProgress})`. Tick toggling + localStorage persistence + progress recompute.

**mobile-video-player.css** `components/mobile-video-player.css` (CSS) — tags: mobile-video-player tiktok reels portrait 9-16 fullscreen overlay author follow caption rail like share progress mute fade
  TikTok/Reels-style portrait video player. `.mvp > .mvp-video + .mvp-overlay + .mvp-rail (acts) + .mvp-progress`. Includes mute toggle, pause overlay, gradient fades.

**mobile-video-player.js** `components/mobile-video-player.js` (JS, global: `MobileVideoPlayer`) — tags: mobile-video tap-pause autoplay loop muted progress like share
  `MobileVideoPlayer.init('[data-mvp]', {autoplay, onLike, onShare})`. Tap-to-pause, progress fill, like toggle, mute.

**quick-pack.css** `blocks/quick-pack.css` (CSS) — tags: quick-pack quick-paste quick-switcher option-picker quick-feedback fractional-picker step-indicator dots line labeled stacked-fraction
  6 quick-utility patterns: quick-paste (clipboard list), quick-switcher (cmd-tab tiles), quick-option-picker (compact dropdown), quick-feedback (1-5 emoji + text), fractional-picker (1/2 1/3 1/4 typography), step-indicator (dots/line/labeled).

**disclosure-pack.css** `components/disclosure-pack.css` (CSS) — tags: disclosure-pack continuous-pagination dropdown floating layered switch voice-chat task-widget progressive-reveal accordion-inline
  7 progressive-reveal patterns: continuous-pagination (infinite-scroll spinner), dropdown-disclosure (inline expand), floating-disclosure (absolute popup), layered-progressive (slide-in panes), switch-disclosure (toggle reveals), voice-chat-disclosure (collapsible mic+wave), task-widget-disclosure.

**disclosure-pack.js** `components/disclosure-pack.js` (JS, global: `DisclosurePack`) — tags: disclosure-pack drop switch float layer task pane back-button onChange
  `DisclosurePack.drop()`, `.switch_({onChange})`, `.float()` (click-away close), `.layer()` (slide between panes via data-dp-next + .dp-layer-back), `.task()`.

**Phase 19 — WatermelonUI final batch (21 more patterns, ~17 files)**

**liquid-fill.css** `effects/liquid-fill.css` (CSS) — tags: liquid-fill button hover fill bottom-up wave pink cyan amber mint foil down diag slow solid icon
  Button/element fills with color from bottom up on hover. `.liqf + variants`. Directions: default (up), down, diag. Colors: pink/cyan/amber/mint/foil. Variants: solid, icon (square), slow.

**decorative-cursor.css** `effects/decorative-cursor.css` (CSS) — tags: decorative-cursor pointer follow svg unicode star hide-native pulse rotate pink cyan mint amber trail
  CSS for decorative cursor that follows the pointer. `.dc-host` (hides native cursor), `.dc-dot` (replacement glyph). Variants: pulse, rotate, color presets, trail.

**decorative-cursor.js** `effects/decorative-cursor.js` (JS, global: `DecorativeCursor`) — tags: decorative-cursor pointer follow hide-native hover-target trail destroy
  `DecorativeCursor.init({shape, size, color, hideNative, trail, hoverSelector})` / `.destroy()`. Hover targets enlarge cursor; optional particle trail.

**progress-pack.css** `blocks/progress-pack.css` (CSS) — tags: progress-pack gauge animated speedometer threshold warn bad good adaptive-slider thumb ticks labels bubble labeled-progress shimmer cycling-text
  3 progress patterns: gauge (animated ring + @property + auto-threshold colors + speedometer variant), adaptive-slider (range slider with bubble + ticks + labels), labeled-progress (bar with cycling text labels + shimmer sweep).

**progress-pack.js** `blocks/progress-pack.js` (JS, global: `ProgressPack`) — tags: progress-pack gauge slider lprog tween value autoThreshold drag onChange onInput
  `ProgressPack.gauge({value, autoThreshold})`, `.slider({min, max, step, value, onInput, onChange})`, `.lprog({value, onComplete})`.

**device-mockups.css** `components/device-mockups.css` (CSS) — tags: device-mockups macbook imac iphone ipad watch tv frame bezel screenshot showcase product-shot tilted light dark
  Device-frame mockups: MacBook (with hinge/notch), iMac (with chin), iPhone (notch + radius), iPad, Watch (with strap), TV (with stand). `.dev + .dev-screen` inside. Variants: light, tilted (perspective).

**book-3d.css** `components/book-3d.css` (CSS) — tags: book-3d 3d open animation cover spine pages perspective hover novel tech red green lg sm
  3D book with cover/back/spine + pages that rotates open on hover. `.book3d > .book3d-cover (.book3d-front + .book3d-back + .book3d-spine) + .book3d-pages`. Color presets: novel, tech, red, green.

**scheduler-pack.css** `components/scheduler-pack.css` (CSS) — tags: scheduler-pack availability week-grid drag-select 7-day 24-hour timeline-drag row-to-row calendar-strip horizontal-days
  3 time/calendar patterns: availability (7×24 drag-paint grid), timeline-drag (rows with draggable slots), calendar-strip (horizontal scrollable day chips).

**scheduler-pack.js** `components/scheduler-pack.js` (JS, global: `SchedulerPack`) — tags: scheduler avail paint-grid drag tldrag move-between-rows strip date-pick days hours
  `SchedulerPack.avail({days, hours, onChange})`, `.tldrag({onMove})` (drag time slot between rows), `.strip({onPick})`.

**feature-tour.css** `components/feature-tour.css` (CSS) — tags: feature-tour modal carousel walkthrough intro onboarding step illustration dots backdrop blur
  Self-contained modal carousel walking through features. `.ftour > .ftour-card > .ftour-stage > .ftour-step + .ftour-foot (dots + skip + next)`. Distinct from existing `tour.js` which spotlights existing UI.

**feature-tour.js** `components/feature-tour.js` (JS, global: `FeatureTour`) — tags: feature-tour carousel modal step keyboard arrow autoOpen onComplete onSkip
  `FeatureTour.init('[data-ftour]', {autoOpen, onStep, onComplete, onSkip})`. Methods: `.open()`, `.close()`, `.next()`, `.prev()`, `.go(i)`. Arrow keys + Escape.

**wallet-auth-drawer.css** `components/wallet-auth-drawer.css` (CSS) — tags: wallet-auth-drawer family-wallet sign-in email phone passkey metamask coinbase walletconnect tabs drawer bottom-sheet
  Bottom-sheet drawer with tabbed email/phone/passkey sign-in + crypto wallet buttons. `.wad > .wad-card > h3 + .wad-tabs + .wad-panel + .wad-divider + .wad-wallets`.

**wallet-auth-drawer.js** `components/wallet-auth-drawer.js` (JS, global: `WalletAuthDrawer`) — tags: wallet-auth-drawer tab switcher submit wallet open close
  `WalletAuthDrawer.init('[data-wad]', {onTab, onSubmit, onWallet})`. `.open()`, `.close()`. Backdrop click closes.

**inline-mega-pack.css** `components/inline-mega-pack.css` (CSS) — tags: inline-mega 3dot-menu confirm-delete inline-table contenteditable discrete-tabs icon-only journal-nav edit-profile-modal extended-toolbar pricing-changeable carousel-tilt
  8 advanced patterns: 3-dot-menu (with 2-step danger confirm), inline-editable table (dblclick to edit cells), discrete-tabs (active expands icon+label, inactive icon-only), journal-nav (sidebar + entry pane), edit-profile-modal (form + live preview pane), extended-toolbar (FAB → row of actions), pricing-changeable (monthly/yearly + expandable features), carousel-tilt (3D-tilted card scroll).

**inline-mega-pack.js** `components/inline-mega-pack.js` (JS, global: `InlineMega`) — tags: inline-mega threeDot confirm itable contenteditable dtabs journal xtool pricing toggle expand
  `InlineMega.threeDot({onAction})` (2-step confirm for danger items), `.itable({onChange, onAdd})`, `.dtabs({onChange})`, `.journal({onPick})`, `.xtool()`, `.pricing({onPeriod, onExpand})`.

**emoji-spree.css** `feedback/emoji-spree.css` (CSS) — tags: emoji-spree chips celebration particles float burst pick vertical drift
  Chips that spawn floating celebration emoji particles on click. `.espree > .espree-chip`. `.espree-particle` is the floating sprite. Variants: vertical (drift down).

**emoji-spree.js** `feedback/emoji-spree.js` (JS, global: `EmojiSpree`) — tags: emoji-spree burst particles spawn count extra toggle picked onPick
  `EmojiSpree.init('[data-espree]', {count, extra, toggle, onPick})`. Auto-extracts emoji from chip text; spawns N particles drifting up + rotating. Also `EmojiSpree.burst(x, y, pool, count, vertical)` for direct calls.

**Phase 20 — Mega expansion: dashboards, maps, game UI, social, decorations, editor (13 files, ~77 patterns)**

**kpi-pack.css** `components/kpi-pack.css` (CSS) — tags: kpi-pack dashboard tile metric trend spark spark-bars ring bar compare glow icon stacked split pill live pulse small large light analytics linear notion stripe
  12 KPI tile patterns in one file: clean, trend (sparkline), spark-bars, ring (conic), bar, compare (vs prev), glow (featured), icon, stacked (3-row), split (2-up), pill (compact), live (pulse dot). Sizes: sm/lg. Light variant.

**admin-pack.css** `components/admin-pack.css` (CSS) — tags: admin-pack devops server-health build-pipeline queue job-runner audit-log api-endpoint webhook-log database-table env-secret reveal cpu mem disk
  8 admin/devops widgets: server-health (multi-bar w/ status pill), build-pipeline (connected stages dots), queue/job-runner (running/done/failed rows), audit-log (actor + action + tag), api-endpoint (method badge GET/POST/PUT/DELETE/PATCH + perf), webhook-log (status code rows), db-table-card (columns + index/row count), env-secret-row (blur-reveal value).

**maps-pack.css** `components/maps-pack.css` (CSS) — tags: maps-pack map-pin marker pulse map-tooltip callout map-legend cluster-bubble route-summary distance-pill location-search mini-map preview
  9 map-UI patterns: map-pin (drop pin SVG), pulsing marker (live presence), map-tooltip (callout with arrow), map-legend (frosted), cluster-bubble (sm/md/lg), route-summary (A→B with dashed line + duration), distance-pill (floating chip), location-search results (rows with addr), mini-map-card (stylized roads + pin).

**game-pack-2.css** `feedback/game-pack-2.css` (CSS) — tags: game-pack-2 inventory-grid rarity common rare epic legendary mythic skill-tree node-graph quest-log boss-bar dialogue-box loot-drop crosshair fps mini-map ammo-counter rpg fantasy
  9 game-UI patterns (extends game-hud.css): inventory-grid (8-col D&D/Diablo cells with rarity glows), skill-tree (positioned nodes + links), quest-log (RPG scroll style with objectives), boss-bar (uppercase name + shimmer health), dialogue-box (visual novel with choices), loot-drop (animated card with rarity tier), crosshair (FPS reticle with spread variant), mini-map (radar with player+enemies+sweep), ammo-counter (low-warn pulse).

**social-pack-2.css** `components/social-pack-2.css` (CSS) — tags: social-pack-2 reaction-picker slack-emoji mention-dropdown poll voting upvote downvote reaction-pile live-cursor presence multi-user thread reply
  7 collaboration patterns: reaction-picker (Slack-style with search + categories + frequent), mention-dropdown (@user typeahead with presence dot), poll (with fill-bar on vote), voting (Reddit/HN upvote+downvote with score, vertical+horizontal), reaction-pile (chip cluster with add-button), live-cursor-presence (multi-user named arrows), slack-thread (reply with avatar pile).

**social-pack-2.js** `components/social-pack-2.js` (JS, global: `Social2`) — tags: social-pack-2 poll vote pile toggle cursors multi-user mention keyboard
  `Social2.poll({onVote})`, `.reactionPile({onToggle, onAdd})`, `.cursors(host, {users}).update(id, x, y)`, `.mention({onPick})` with keyboard-nav helpers.

**decorative-shapes.css** `svg/decorative-shapes.css` (CSS) — tags: decorative-shapes svg backgrounds patterns blob waves stripes dots grid scribble arrow ribbon sparkles checker zigzag circuit honeycomb position tl tr bl br center
  13 decorative SVG/CSS shapes for backgrounds: blob (morphing organic), waves, stripes (diagonal), dots, grid-soft, scribble (hand-drawn SVG), arrow (decorative curved), ribbon, sparkles (twinkling), checker, zigzag, circuit (tech), honeycomb. Position helpers tl/tr/bl/br/center/full.

**stepper-pack.css** `blocks/stepper-pack.css` (CSS) — tags: stepper-pack number-input increment decrement plus minus stripe-style pill large vertical gradient outline compact bordered currency
  8 stepper variants: clean (default), pill (rounded ends), large, vertical, gradient (accent +/-), outline, compact, bordered (separate buttons), plus currency-prefix mod. Disabled state when at min/max.

**stepper-pack.js** `blocks/stepper-pack.js` (JS, global: `Stepper`) — tags: stepper increment decrement clamp step min max long-press repeat wheel keyboard onChange
  `Stepper.init('[data-stp]', {min, max, step, value, longPress, longPressDelay, repeatInterval, onChange})`. Click + long-press repeat + wheel + ArrowUp/Down. Methods: `.set()`, `.get()`, `.inc()`, `.dec()`.

**timer-pack.css** `components/timer-pack.css` (CSS) — tags: timer-pack pomodoro focus-timer ring stopwatch laps race-clock alarm phase work break long round dots
  5 timer patterns: pomodoro (phase pills + dots), focus-timer (animated ring countdown w/ @property), stopwatch (laps with best/worst), race-clock (scoreboard glow, cyan/red variants), alarm (toggle row).

**timer-pack.js** `components/timer-pack.js` (JS, global: `TimerPack`) — tags: timer-pack pomodoro focus stopwatch lap alarm interval tick phase complete onTick onPhase onLap onDone
  `TimerPack.pomodoro({work, break, longBreak, rounds, onTick, onPhase, onComplete})`, `.focus({duration, onTick, onDone})`, `.stopwatch({onLap, onStop})`, `.alarm({onToggle})`.

**editor-pack.css** `components/editor-pack.css` (CSS) — tags: editor-pack code-editor ide vscode find-replace regex case whole-word goto-line tab-strip overflow dirty pinned gutter line-numbers diff add del mod git-status branch ahead behind breadcrumb path
  6 IDE chrome patterns: find-replace bar (case/whole/regex toggles + count + actions), goto-line bar, tab-overflow strip (active border + dirty dot + close), gutter (line numbers with add/del/mod/error/warn marks + current-line), git-status-strip (branch + ahead/behind + M/A/D/U counts), breadcrumb-path (file path with function-name highlight).

**editor-pack.js** `components/editor-pack.js` (JS, global: `EditorPack`) — tags: editor-pack find replace regex case-sensitive whole-word match navigation tabs close goto-line
  `EditorPack.find({text, onMatch, onReplace})` (real regex search with case/whole/regex toggles + match navigation), `.tabs({onSelect, onClose})` (active state + close-x), `.goto({onSubmit, onCancel})` (Enter/Escape).

**Phase 21 — Comprehensive sweep: animations / commerce / email / whiteboard / 3D scenes / onboarding / heroes (24 files, ~150 patterns)**

**keyframes-pack-2.css** `animations/keyframes-pack-2.css` (CSS) — tags: keyframes-pack-2 animations jelly rubber jello wobble swing tada bounce-strong heartbeat pop-in pop-out slide-in-up slide-in-down slide-in-left slide-in-right slide-out fade zoom flip-x flip-y hinge roll-in light-speed blur drop-in delay fast slow infinite
  30+ named keyframe utilities with delay/duration/iteration modifiers. Apply `.kf2 .kf2-<name>` and optional `.kf2-fast/slow/infinite/delay-100…1000`.

**lottie-look.css** `animations/lottie-look.css` (CSS) — tags: lottie-look css-only success-check error-cross spinner-orb heart-burst confetti rocket bell-shake thumbs-up clock-spin cloud-rain illustration animated
  10 CSS-only animated illustrations mimicking common Lottie scenes. `.lot .lot-check / -cross / -spinner-orb / -heart-burst / -confetti-burst / -rocket / -bell-shake / -thumbs-up-pop / -clock-spin / -cloud-rain` + sizes sm/lg/xl.

**text-pack-2.css** `typography/text-pack-2.css` (CSS) — tags: text-pack-2 split-shadow embossed debossed chrome etched retro-3d mirrored neon-deep kinetic-split outline-fill drop-cap vertical-cjk big-stretch wraparound stencil
  15 text effects: split-shadow, embossed, debossed, chrome polish, etched (outline), retro-3d w/ stacked shadows + pink/cyan variants, mirrored reflection, neon-deep (multi-glow), kinetic per-letter stagger, outline-fill hover, drop-cap, vertical-cjk, big-stretch variable-font, SVG wraparound, stencil.

**3d-cards-pack.css** `effects/3d-cards-pack.css` (CSS) — tags: 3d-cards-pack parallax holo depth-pop fold-out lift-stack glass-3d perspective rotate hover
  6 CSS-only 3D card variants: parallax (mouse-driven --mx/--my), holo (conic + chromatic), depth-pop (translateZ on hover), fold-out (top half folds back), lift-stack (3-layer stack on hover), glass-3d (frosted + tilt).

**hero-pack.css** `components/hero-pack.css` (CSS) — tags: hero-pack landing-page centered split video-bg gradient-mesh animated-grid marquee-strip badge-row kbd-cta asymmetric card-stack-bg glow-orb code-side cta linear vercel stripe anthropic apple cursor
  12 landing-page hero variants: centered, split (left+art right), video-bg, gradient-mesh-bg, animated-grid floor, marquee-strip top/bottom, badge-row (trust badges), kbd-cta (⌘K search), asymmetric, card-stack-bg, glow-orb, code-side (code preview right).

**marketing-pack.css** `components/marketing-pack.css` (CSS) — tags: marketing-pack social-proof testimonial-strip logo-cloud-pro faq-grid comparison-3col feature-list-2col integration-row stat-strip avatars stars trust
  8 marketing blocks: social-proof-bar (avatars + stars), testimonial-strip (horizontal scroll), logo-cloud-pro (+ marquee variant), faq-grid (auto-fit 2-col), comparison-3col w/ featured highlight, feature-list-2col, integration-row (logos + more), stat-strip (gradient numerals).

**commerce-pack.css** `components/commerce-pack.css` (CSS) — tags: commerce-pack product-gallery zoom color-swatch size-picker qty-stepper add-to-cart-fly mini-cart-badge save-heart wishlist stock-status price-strike sale discount
  9 e-commerce patterns: product-gallery (thumb rail + zoom on hover), color swatches (ring active + disabled cross), size picker (square buttons + disabled strikethrough), qty stepper, add-to-cart w/ loading→added states, mini-cart badge w/ bump, save-heart toggle, stock-status pill (in/low/out + pulse), price-strike (old/new/off%).

**commerce-pack.js** `components/commerce-pack.js` (JS, global: `Commerce`) — tags: commerce-pack gallery zoom swatch size add-to-cart fly animate cart save heart toggle
  `Commerce.gallery()` (thumb swap + zoom-on-mousemove), `.swatches({onPick})`, `.sizes({onPick})`, `.addToCart({target, onComplete})` (loading→added + fly-to-cart animation + badge bump), `.save({onToggle})`, `.fly(from, toSel)`.

**checkout-pack.css** `components/checkout-pack.css` (CSS) — tags: checkout-pack step-progress address-form payment-methods order-summary discount-input success-receipt stepper apple-pay google-pay crypto coupon
  6 checkout patterns: step-progress (cart→shipping→payment→review w/ ✓ done state), address-form (2-col), payment-methods (Apple/Google/Card with picked ring), order-summary (with discount + total), discount-input (apply with error/success state), success-receipt (animated tick + order number).

**image-gallery-pro.css** `media/image-gallery-pro.css` (CSS) — tags: image-gallery-pro lightbox thumbs zoom pan pinch counter strip overlay close prev next double-click
  Pro lightbox + thumb-grid + zoom/pan controls. `.igp > .igp-grid + .igp-overlay (stage, prev/next, close, strip, zoom)`. Distinct from `media/lightbox.css/.js` and `components/image-crop.css/.js`.

**image-gallery-pro.js** `media/image-gallery-pro.js` (JS, global: `ImageGalleryPro`) — tags: image-gallery-pro lightbox open close keyboard arrow escape zoom wheel pan drag double-click
  `ImageGalleryPro.init('[data-igp]', {images, startIndex, onOpen, onClose, onChange})`. Click tile to open. Keyboard ←/→/Escape/+/−/0. Wheel zoom, double-click toggle, drag to pan when zoomed.

**email-pack.css** `components/email-pack.css` (CSS) — tags: email-pack email-row inbox thread compose sidebar label-filter sender-card snooze gmail outlook
  6 email-client patterns: email-list-row (pick + star + sender + subject + preview + tag + time + attach), email-thread (subject + collapsible message stack + quick replies), label-filter-sidebar (Inbox/Starred/Sent w/ counts), compose-modal (floating bottom-right), sender-card popover, snooze-picker.

**email-pack.js** `components/email-pack.js` (JS, global: `EmailPack`) — tags: email-pack thread expand compose send minimize fullscreen close list select star unread snooze pick
  `EmailPack.thread()` (expand collapsed messages), `.compose({onSend})` (min/full/close + send), `.list({onSelect, onStar})`, `.snooze({onPick})`.

**whiteboard-pack.css** `components/whiteboard-pack.css` (CSS) — tags: whiteboard-pack tldraw canvas toolbar shape-picker sticky-note color-bar eraser-cursor selection-marquee hand-arrow zoomchrome curve violet pink
  Whiteboard chrome + tools: floating-toolbar (with kbd hints), shape-picker (rect/round/tri/diamond/arrow/line), sticky-note (5 colors with tape + crinkle), color-bar (active ring), custom cursors (pen/eraser/hand), selection-marquee, hand-drawn arrow (straight + curve), zoomchrome.

**whiteboard-pack.js** `components/whiteboard-pack.js` (JS, global: `Whiteboard`) — tags: whiteboard-pack draw pen eraser canvas quadratic dpr tool-switch sticky-draggable color stroke
  `Whiteboard.init('[data-wb-host]', {tools, defaultTool, defaultColor, defaultStroke, onChangeTool, onDrawEnd})`. Canvas drawing w/ pen + eraser (destination-out), tool switcher binding, methods `.setTool() .setColor() .setStroke() .clear()`. Also `Whiteboard.makeStickyDraggable('.wb-sticky')`.

**onboarding-pack.css** `components/onboarding-pack.css` (CSS) — tags: onboarding-pack welcome-modal profile-wizard tour-launcher plan-picker whats-next-checklist install-prompt pwa progress
  6 onboarding patterns: welcome-modal (illustration + dual-CTA), profile-setup-wizard (step dots + 2x2 grid choices + back/next), tour-launcher pill, plan-picker (3-tier with recommended badge), what's-next-checklist (progress bar + persistent ticks), install-prompt (PWA bar with dismiss).

**onboarding-pack.js** `components/onboarding-pack.js` (JS, global: `OnboardingPack`) — tags: onboarding-pack wizard step plan pick next checklist storage progress install dismiss
  `OnboardingPack.wizard({steps, onStep, onComplete})` (multi-step + grid choices + back/next), `.plan({onPick})`, `.next({storageKey, onProgress})` (localStorage persisted), `.install({onInstall, onDismiss})`.

**scroll-fx-pack.css** `scroll/scroll-fx-pack.css` (CSS) — tags: scroll-fx-pack parallax-bg multi-layer sticky-stagger fade-in-out reveal-on-view ribbon-pin scroll-text-zoom up down left right zoom flip
  6 advanced scroll effects: parallax-bg (3-layer perspective), sticky-stagger (revealed via JS observer), fade-in-out section, reveal-on-view (up/down/left/right/zoom/flip directions), ribbon-pin (sticky slanted marquee), scroll-text-zoom (text scales as you scroll).

**scroll-fx-pack.js** `scroll/scroll-fx-pack.js` (JS, global: `ScrollFx`) — tags: scroll-fx-pack reveal IntersectionObserver opacity zoom parallax mousemove progress sticky
  `ScrollFx.reveal(selector, {threshold, once, stagger})`, `.opacity({fadeIn, fadeOut})`, `.zoom({from, to})`, `.parallax()` (mousemove-driven layer offsets).

**scenes-pack.js** `3d/scenes-pack.js` (JS, global: `ScenesPack`) — tags: scenes-pack three.js shader-ball gltf-cards ascii hologram gradient-cube-array ribbon-trail wireframe rim-light catmull-rom torus-knot scanline
  6 self-contained Three.js scenes: shaderBall (glossy sphere + rim light), gltfCards (drag-rotate stack), ascii (torus knot rendered as ASCII grid), hologram (wireframe icosahedron + scanline overlay), gradientCubeArray (HSL grid with sine wave), ribbonTrail (animated Catmull-Rom tube). Each returns `{destroy}`. Requires three.js global.

**Phase 22 — Pro patterns: forms / charts / chatbot / ratings / video / auth / search / micro (14 files, ~55 patterns)**

**form-pack.css** `components/form-pack.css` (CSS) — tags: form-pack multi-step-form wizard validation-states good warn bad icon file-upload-pro drag-drop preview progress password-meter strength autocomplete typeahead char-counter dependency-chain captcha recaptcha
  8 form patterns: multi-step-form w/ progress pills, field-validation-states (good/warn/bad w/ inline icon), file-upload-pro (drag-drop + file rows + progress bar), password-meter (4-step strength + tips checklist), autocomplete dropdown, char-counter (warn/over states), dependency-chain visual indicator, captcha-look (Google-style).

**form-pack.js** `components/form-pack.js` (JS, global: `FormPack`) — tags: form-pack wizard step validate password strength file drag-drop autocomplete keyboard arrow char count captcha verify
  `FormPack.step({onComplete, validate})`, `.password()` (live strength + tips), `.file({maxSize, accept, onAdd})`, `.autocomplete({items, onPick})` w/ keyboard nav, `.charCount({max})`, `.captcha({onVerified})`.

**charts-pro.css** `data-viz/charts-pro.css` (CSS) — tags: charts-pro heatmap github-contribution scatter candlestick stock donut-pro multi-segment gauge-arc half-circle sparkbars-grid
  6 advanced charts: heatmap (GitHub contribution grid), scatter (axis + grouped points), candlestick (OHLC bars w/ up/down), donut-pro (3-segment + center label), gauge-arc (half-circle with needle + value), sparkbars-grid (cards w/ mini bar charts + up/down).

**charts-pro.js** `data-viz/charts-pro.js` (JS, global: `ChartsPro`) — tags: charts-pro heatmap scatter candlestick donut gauge sparkline grid data render conic-gradient
  `ChartsPro.heatmap({cols, rows, data})`, `.scatter({points})` (auto-scaled), `.candlestick({bars: [{o,h,l,c}]})`, `.donut({segments: [{value, color}], centerLabel})`, `.gauge({value})`, `.sparkGrid({cards})`.

**chatbot-pack.css** `ai/chatbot-pack.css` (CSS) — tags: chatbot-pack widget launcher floating bubble window typing-dots prompt-builder slot quick-reply suggestion-chips feedback thumbs gradient-bubble
  6 chatbot patterns: floating launcher pill (with badge + optional pulse), chatbot-window (avatar + status + scroll body + composer), prompt-builder w/ editable slots + tag chips, quick-reply-chips (horizontal scroll), suggested-questions cards, model-output-feedback toolbar.

**chatbot-pack.js** `ai/chatbot-pack.js` (JS, global: `ChatbotPack`) — tags: chatbot-pack widget open close toggle send typing reply user bot feedback prompt slot
  `ChatbotPack.widget({launcher, window, greeting, onSend})` returns `{open, close, toggle, addBot, addUser}`. `onSend(text, addBotReply)` for async replies. `.feedback({onFeedback})`, `.prompt({onChange})`.

**ratings-pack.css** `components/ratings-pack.css` (CSS) — tags: ratings-pack stars 1-5 1-10 distribution histogram review-card thumbs-up thumbs-down nps net-promoter promoters passives detractors
  6 rating patterns: stars 1-5 (sm/lg + readonly), tens (1-10 number row), rating-distribution (5-row histogram), review-card (avatar+stars+verified+actions), thumbs-up/down toggle, NPS 0-10 scale w/ color-coded promoters/passives/detractors.

**ratings-pack.js** `components/ratings-pack.js` (JS, global: `Ratings`) — tags: ratings-pack stars pick tens thumbs nps onChange auto-generate max
  `Ratings.stars({value, max, onChange})` (auto-generates buttons if empty), `.tens({onChange})`, `.thumbs({onUp, onDown})`, `.nps({onChange})`.

**video-player-pro.css** `media/video-player-pro.css` (CSS) — tags: video-player-pro html5 video controls play pause scrub track chapters captions cc speed playback rate picture-in-picture pip fullscreen big-play loading buffer
  Full HTML5 video player chrome with chapter markers, caption overlay, speed/PiP/fullscreen, big-play overlay, buffering spinner. Distinct from media/video-player.css basic.

**video-player-pro.js** `media/video-player-pro.js` (JS, global: `VideoPlayerPro`) — tags: video-player-pro html5 video play pause seek chapters captions speed pip fullscreen muted buffer onTimeUpdate
  `VideoPlayerPro.init('[data-vpp]', {chapters, captions, speeds, onPlay, onPause, onEnd, onTimeUpdate})`. Click track to seek, chapter markers, caption overlay synced to currentTime, speed cycle, Picture-in-Picture, fullscreen.

**auth-pack-2.css** `components/auth-pack-2.css` (CSS) — tags: auth-pack-2 2fa pin big-otp 6-digit password-reset flow sso google github apple microsoft magic-link account-locked security session row revoke
  6 auth patterns: 2FA pin-input (big 56x64 cells + filled/error states + shake), password-reset card (icon + email + resend), SSO buttons (Google/GitHub/Apple/Microsoft logos), magic-link card "check your email" state, account-locked alert (with reasons list), session-row (device + current badge + revoke).

**search-pack.css** `components/search-pack.css` (CSS) — tags: search-pack search-input-pro icon clear kbd loading faceted-sidebar filter-chips sort-dropdown recent-searches result-card no-results-state highlight mark
  7 search/filter patterns: search-input-pro (icon + clear + kbd + loading spinner), faceted-sidebar (collapsible groups + checkbox + count), filter-chips (active filters w/ × + clear-all), sort-dropdown, recent-searches dropdown, result-card (thumb + highlighted snippet + meta + relevance), no-results-state w/ tips.

**micro-interactions-pack.css** `micro/micro-interactions-pack.css` (CSS) — tags: micro-interactions-pack like-burst heart copy-tick share-pop follow-toggle bookmark notification-ping status-dot badge-bump draft-saved link-arrow pulse-attention hover-swap kbd-pressed slot-shake
  14 micro-interactions: like-burst (heart + radial ring), copy-tick, share-pop (radial menu), follow-toggle (Follow/Following/Unfollow on hover), bookmark, notification-ping (badge wave), status-dot (online/away/busy/offline + pulse), badge-bump animation, draft-saved (idle/saving/saved/error states), link-arrow slide-on-hover, pulse-attention ring, hover-swap text rotate, kbd-pressed animation, slot-shake error.

**micro-interactions-pack.js** `micro/micro-interactions-pack.js` (JS, global: `MicroIx`) — tags: micro-interactions-pack like copy share follow bookmark draft kbd combo shake badge bump clipboard
  `MicroIx.like({onToggle})`, `.copy({text})` (clipboard + tick), `.share()` (radial menu open/close), `.follow({onToggle})`, `.bookmark({onToggle})`, `.draft({simulate})` (idle/saving/saved states), `.kbd({combo, onTrigger})` (e.g. 'mod+k'), `.shake()`, `.badge()` (bump with optional next value).

**Phase 23 — Marketing & tools: datetime / color-tools / error-pages / table-2 / empty-states / pricing / header / footer / notifications / image-tools (11 files, ~59 patterns)**

**datetime-pack.css** `components/datetime-pack.css` (CSS) — tags: datetime-pack date-range-picker two-month time-picker-wheel ios datetime-popover year-view week-view recurrence-builder presets every weekly weekdays
  6 date/time pickers: date-range-picker (two-month w/ in-range highlight + presets), time-picker-wheel (3 spinning columns w/ snap), datetime-popover (date/time tabs), year-view (12-month grid), week-view (7-day timeline w/ event overlay), recurrence-builder ("Every N days/weeks/months" w/ day picker + summary).

**color-tools-pack.css** `components/color-tools-pack.css` (CSS) — tags: color-tools-pack square-picker hsl ring conic palette-grid gradient-stops tailwind shades contrast-checker wcag hex
  6 color tools: square-picker (saturation + hue slider), ring-hsl (conic ring), palette-grid (named swatches), gradient-stops (stop track w/ add/active), tailwind-palette (rows × shades), contrast-checker (live preview + ratio + WCAG grades).

**error-pages.css** `components/error-pages.css` (CSS) — tags: error-pages 404 not-found 500 server-error 403 forbidden 503 maintenance coming-soon paused-billing countdown gradient
  6 full-page error states: 404 (gradient blobs + huge gradient num), 500 (red glow + stack trace), 403 (lock icon), 503 (animated gears + ETA), coming-soon (countdown cells + email form), paused-billing (red card + amount).

**table-pack-2.css** `components/table-pack-2.css` (CSS) — tags: table-pack-2 advanced sortable sticky-header column-resizer row-actions expandable density-toggle dense comfy status-pill avatar checkbox pagination empty loading
  Advanced data table: sortable headers, sticky-header, column-resizer, row-actions on hover, expandable row, density toggle (dense/default/comfy), inline status pills, avatar cells, checkbox column, toolbar w/ search, pagination footer, empty + loading states.

**table-pack-2.js** `components/table-pack-2.js` (JS, global: `TablePack2`) — tags: table-pack-2 data sort filter paginate columns render accessor onRow onSelect refresh setData
  `TablePack2.init({data, columns: [{key, label, sortable, render, accessor}], pageSize, onRow, onSelect})`. Sort by header, search filter, pagination buttons, returns `{refresh, setData, getSelected}`.

**empty-states-pack-2.css** `components/empty-states-pack-2.css` (CSS) — tags: empty-states-pack-2 no-results first-time inbox-zero no-permission lock draft filter expired hourglass success all-done illustration
  8 empty/zero-data states: no-results, first-time (welcome), inbox-zero (celebrate + bounce), no-permission (lock), draft, filter (funnel), expired (rocking hourglass), success-all-done (big check). Small variant.

**pricing-tables-pack.css** `components/pricing-tables-pack.css` (CSS) — tags: pricing-tables-pack 3-tier featured popular comparison-bar single-plan slider-pricing usage horizontal-3col addon-grid mix-match
  6 pricing layouts: 3-tier classic w/ featured scale, comparison-bar (feature horizontal bars), single-plan-card (huge featured), slider-pricing (usage slider updates price), horizontal-3col (compact), addon-grid (pick & mix).

**header-pack.css** `components/header-pack.css` (CSS) — tags: header-pack centered-logo mega-menu hover transparent-on-top dual-bar announcement-strip-attached breadcrumb-header search-prominent mobile-hamburger sticky
  8 header variants: centered-logo, mega-menu w/ hover panel, transparent-on-top (becomes solid on scroll), dual-bar, announcement-strip-attached, breadcrumb-header, search-prominent, mobile-hamburger w/ slide panel.

**footer-pack-2.css** `components/footer-pack-2.css` (CSS) — tags: footer-pack-2 minimal-centered 4-col-corporate newsletter-stripe mega-link-grid sticky-bottom-cta signature-art big-text gradient-bg
  6 footer variants: minimal-centered, 4-col corporate, newsletter-stripe (gradient bg), mega-link-grid (auto-fit), sticky-bottom-cta (fixed), signature-art (huge gradient name).

**notifications-pro.css** `feedback/notifications-pro.css` (CSS) — tags: notifications-pro alert-pro success warn error info dismissible notification-row inbox unread notification-popover bell dropdown floating-action-pill linear action-required-banner push-permission slack-mention
  7 notification patterns: alert-pro (4 types w/ icon + actions + dismiss), notification-row (avatar + tag + read state), notification-popover (dropdown w/ tabs + scrollable list), floating-action-pill, action-required-banner, push-permission-prompt, slack-mention card.

**image-tools.css** `media/image-tools.css` (CSS) — tags: image-tools crop-overlay rule-of-thirds rotate-controls flip filter-strip presets brightness-contrast saturation exposure undo-redo
  5 image-editor patterns: crop-overlay (dim mask + adjustable rect + 3x3 grid + corner handles), rotate-controls (90° steps + freeform slider), filter-strip (8 CSS filter presets: warm/cool/bw/fade/vintage/vivid/matte/noir), brightness-contrast sliders, undo-redo bar.
