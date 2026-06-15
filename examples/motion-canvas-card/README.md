# motion-canvas-card — minimal Motion Canvas example

A tiny, runnable [Motion Canvas](https://motioncanvas.io) project that animates a card in (fade +
rise + pulse) and renders to video — the canonical, **MIT, fully-local** video engine for the vault.
See `../../motion-canvas.skill.md` for the decision tree and when to use this vs Remotion.

> This is a **build-based example project**, not a vault snippet — it needs Node + a build step and
> is intentionally outside the vanilla snippet layer (never indexed).

## Run it

```bash
cd examples/motion-canvas-card
npm install
npm run serve     # live editor at http://localhost:9000
```

## Render to video

The editor's **Render** button outputs a PNG sequence by default. For an `.mp4`/`.webm`, the
`@motion-canvas/ffmpeg` exporter is already a dependency — pick the video exporter in the editor
(local, no service). Grade the output upstream with ffmpeg `lut3d` (see `color-grade.skill.md`).

## Files
- `src/scenes/card.tsx` — the scene (the generator timeline; this is the part you edit).
- `src/project.ts` — registers the scene.
- `vite.config.ts` — the Motion Canvas Vite plugin.
