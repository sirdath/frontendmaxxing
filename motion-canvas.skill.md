# motion-canvas.skill.md — Code-driven motion graphics & video (the open engine)

Make **video / motion-graphics from code** — logo reveals, kinetic typography, animated
explainers, data-driven scenes. This is the vault's **canonical, unconditionally-MIT** video
engine. It is build-based (Vite + an editor), so it lives as a **skill + example project**
(`examples/motion-canvas-card/`), never as a vanilla snippet. Sibling: `remotion.skill.md`.

## When to reach for which engine

| Need | Engine | License |
|---|---|---|
| Hand-authored motion graphics, a timeline/generator mental model (like GSAP + After Effects) | **Motion Canvas** | **MIT, unconditional** — default. |
| React/JSX layout, data-driven/personalized video at scale, Lambda batch render, captions+whisper | **Remotion** (`remotion.skill.md`) | Free ≤3 employees; **paid Company License at 4+** — mind the headcount. |
| A Motion Canvas fork with hosted/cloud rendering | Revideo | MIT (fork) but built around a cloud-render service — avoid unless you want that dependency. |
| A short looping UI animation, not a video | **Lottie/Rive** (`media/lottie-player.js`, `media/rive-player.js`) or CSS/GSAP | — |

Default to **Motion Canvas** for vault work: no headcount clause, fully local, copies into client repos with zero license accounting.

## How it works

```bash
npm init @motion-canvas@latest      # scaffolds a Vite project + editor
npm install                          # @motion-canvas/core + @motion-canvas/2d + the vite plugin
npm run serve                        # opens the live editor at localhost:9000
```
A **scene** is a generator — you `yield*` animations on the timeline and they play in order:

```tsx
import {makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const card = createRef<Rect>();
  view.add(
    <Rect ref={card} width={420} height={260} radius={24} fill={'#6c5cff'} opacity={0} y={40}>
      <Txt fill={'white'} fontSize={48} text={'Finder'} />
    </Rect>,
  );
  // animate in: fade + rise together, then hold
  yield* all(card().opacity(1, 0.6), card().y(0, 0.6));
  yield* waitFor(0.8);
  yield* card().scale(1.05, 0.32).to(1, 0.32);   // a tasteful pulse
});
```
Animations are `signal(value, duration, easing?)`; compose with `all()` / `chain()` / `sequence()` / `delay()` / `loop()`.

## Rendering out

- The editor's **Render** button (or `npm run build`) outputs an **image sequence (PNG)** by default.
- For an **`.mp4`/`.webm`**, add **`@motion-canvas/ffmpeg`** (it bundles ffmpeg) and select the video exporter — fully local, no service.
- Pixel-perfect, deterministic, parametrizable (variables drive the scene → batch variants).

## Pairing with the vault

Motion Canvas authors the *asset*; the vault *delivers* it. Render a logo-reveal `.mp4`/`.webm`, then ship it with `media/video-player.*` or as a scroll-scrubbed clip; or render a frame sequence and play it with a canvas blitter. Grade the output upstream (`color-grade.skill.md` → ffmpeg `lut3d`), never at runtime.

## Files this skill governs
- `examples/motion-canvas-card/` (the runnable example — outside the snippet layer).
- Siblings: `remotion.skill.md` (React/data-driven), `lottie-rive.skill.md` + `media/lottie-player.js`/`media/rive-player.js` (short looping graphics), `gsap.skill.md` (in-page motion).

## Licensing
- `@motion-canvas/*` — **MIT, no caveats** — safe to vendor/copy. `@motion-canvas/ffmpeg` bundles ffmpeg (LGPL/GPL) for local rendering only; you ship the *output*, not ffmpeg.
- Render only assets you own / are licensed to use; bake color grades from CC0/own LUTs (see `color-grade.skill.md`).
