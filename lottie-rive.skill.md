# Lottie & Rive Skill — premium web motion-graphics

> Verified June 2026. Read this whenever the user wants lightweight vector animation or interactive motion in a web UI (onboarding loops, success ticks, animated icons, interactive hero graphics, stateful buttons). Pairs with [`gsap.skill.md`](gsap.skill.md) (DOM/SVG animation), [`3d-motion.skill.md`](3d-motion.skill.md), and the `animations/` folder.

## TL;DR — which tool
| Need | Pick | Why |
|---|---|---|
| Designer-made vector loop, decorative, plays on load/scroll/hover | **Lottie** (`.lottie` via dotlottie) | Tiny, GPU-friendly, huge asset ecosystem, no logic |
| Graphic that **responds** to clicks/hover/inputs/app state, branching logic | **Rive** | State machines + data binding — logic lives in the file, not JS |
| Animating the **real DOM/SVG/text** already on the page, scroll-scrub | **GSAP / Framer Motion / CSS** | No WASM/canvas blob, inspectable, best a11y/SEO |
| Cinematic non-interactive 3D-feel hero | **`premium-motion-pipeline`** | Neither Lottie nor Rive is right |

One-liner: **Lottie = play a pre-baked animation. Rive = an interactive animation runtime with logic. GSAP = animate what's already on the page.**

## Lottie
JSON (from After Effects → Bodymovin) played natively. **`.lottie`** = zipped bundle (multi-animation, ~up to 80% smaller) — use it by default.
```bash
npm i @lottiefiles/dotlottie-react      # modern default (Rust/WASM/ThorVG, actively maintained)
# or legacy: npm i lottie-react          (wraps airbnb lottie-web, low maintenance)
```
- Runtimes (all MIT): `lottie-web` (airbnb, ~32k★, the original, stable but quiet) · **`@lottiefiles/dotlottie-web`/`-react`** (modern, WebGL2/WebGPU backends, off-main-thread — prefer this).
- **Renderers:** SVG (crisp, DOM-heavy — small icons) · Canvas (complex/large) · dotlottie WASM (lowest CPU/mem — premium work).
- **Create without AE:** Lottielab (web-native, free, AE/Figma/SVG import), Jitter (Figma-first), LottieFiles Creator. Avoid Haiku (unmaintained).
- **Interactivity:** segments/markers, scroll-sync (frame seek), hover/click; dotLottie v2 adds state machines + theming + audio.

## Rive
All-in-one editor (rive.app) → compact `.riv` binary, GPU-accelerated runtime.
- **The differentiator — State Machines:** visual graph of states + transitions driven by typed **inputs** (bool/number/trigger). Interaction logic lives *inside* the `.riv`. Plus **mesh deformation**, **data binding** (live app state ↔ view-model, two-way), responsive Layout, text runs.
```bash
npm i @rive-app/react-webgl2            # Rive's recommended default (vector feathering, advanced)
# lighter: @rive-app/react-canvas / -canvas-lite
```
```tsx
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-webgl2';
const { rive, RiveComponent } = useRive({ src:'/hero.riv', stateMachines:'Main', autoplay:true,
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }) });
const hover = useStateMachineInput(rive, 'Main', 'isHovered');   // hover.value = true
return <RiveComponent className="h-full w-full" />;   // give the wrapper explicit size
```
- **⚠️ Licensing reality:** runtimes are **free, MIT, no royalties — playback never costs anything**. BUT the **editor gates `.riv` export behind a paid seat** (Free = no export; **Cadet $9/seat** = export; Voyager $32). Budget ≥1 Cadet seat per project that *authors* Rive assets.

## React / Next 15 integration (both)
Both need browser canvas/WASM → **never SSR**.
```tsx
import dynamic from 'next/dynamic';
const DotLottieReact = dynamic(() => import('@lottiefiles/dotlottie-react').then(m => m.DotLottieReact), { ssr:false });
```
- Mark `'use client'`; lazy-load below-fold/hero (IntersectionObserver / `next/dynamic`) for Lighthouse ≥90.
- WASM cold-start: show a static poster/first-frame, swap when ready (no blank-canvas flash / layout shift).

## Cross-cutting gotchas
- **`prefers-reduced-motion` (DS checklist):** don't autoplay; static fallback + play/pause (WCAG 2.2.2). Lottie has a reduced-motion marker; Rive can hold an idle state.
- **Tokens:** drive Lottie theming / Rive data-binding from `@ds/tokens` rather than baking brand colors into the file (so a rebrand doesn't need re-export).
- **Rive's real cost = the export seat**, not runtime.

## Files this skill governs
`animations/` folder · cross-refs: [`gsap.skill.md`](gsap.skill.md), [`3d-motion.skill.md`](3d-motion.skill.md), [`remotion.skill.md`](remotion.skill.md) (`@remotion/lottie` to render Lotties into video).
