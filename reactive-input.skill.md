# reactive-input.skill.md — make the page react to a person

Drive motion/visuals from a live input signal. Pick the **lightest source that
carries the effect** — escalate only when the cheaper one can't express it.

## TL;DR decision table

| You want… | Source | Snippet | Cost / gate |
|---|---|---|---|
| Cursor/touch position → motion | pointer | `effects/device-tilt.js` (gyro+pointer), `effects/cursor-*`, `shaders/pointer-displace.glsl.js` | free, no permission |
| Phone tilt → "living poster" parallax | gyroscope | `effects/device-tilt.js` | iOS 13+ asks on first gesture; falls back to pointer |
| Sound/music → bars/pulse/uniform | mic or `<audio>` | `interactions/sound-react.js`, `media/audio-visualizer.js` | mic needs a gesture + consent |
| Hand/face → control surface | webcam | `interactions/vision-react.js` (MediaPipe) | camera is **opt-in only**; heavy WASM; falls back to pointer |

All four write **CSS custom properties** (`--tilt-x/y`, `--vr-x/y`, `--snd-*`) or
shader uniforms, so the *styling* stays in CSS and the input layer is swappable.

## Rules of the family

- **Consent + gesture.** Camera and mic start ONLY from an explicit user action,
  never on load. `vision-react` never calls `getUserMedia` until `.enableCamera()`.
- **Always degrade.** Every reactive source has a pointer (or static) fallback:
  no gyro → pointer; no/denied camera → pointer; reduced-motion → frozen.
- **Honor `prefers-reduced-motion`.** Disable the live layer (render the rest at rest).
- **Lazy-load the heavy stuff.** MediaPipe (ESM, ~MB + a model file) loads via
  dynamic `import()` *inside* `.enableCamera()` — a page that never enables the
  camera never pays for it.
- **Privacy.** Camera/mic frames are processed on-device (MediaPipe WASM / WebAudio);
  nothing is uploaded. Say so in the UI near the enable button.

## Licensing

- MediaPipe Tasks Vision — **Apache-2.0** (CDN ESM + a `.task` model from Google).
- DeviceOrientation / WebAudio — **web standards**, no dependency.

## Files this skill governs
`effects/device-tilt.js` · `interactions/vision-react.js` · `interactions/sound-react.js` · `media/audio-visualizer.js` · the `shaders/pointer-*` uniforms. See also `audio-ui.skill.md` (sound) and `shaders.skill.md` (uniform wiring).
