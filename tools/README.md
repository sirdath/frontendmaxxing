# Vault tooling — `audit.js` + `render-smoke.mjs`

Two gates verify the vault. They are dev tooling only — neither ships to snippet users (the `tools/` dir is excluded from the npm `files` list), and the snippets stay zero-dependency.

| Gate | File | Deps | What it proves |
|---|---|---|---|
| **Static** | `audit.js` | none (zero-dep CJS) | Every snippet is indexed, pointers resolve, JS globals match INDEX, plus soft style invariants. |
| **Dynamic** | `render-smoke.mjs` | `playwright-core` + system Chrome | Every snippet actually *renders* in a real browser with no errors and drawn pixels. |

```bash
npm run audit          # static invariants (fast, zero-dep)
npm run test           # MCP server unit tests
npm run smoke          # render every snippet in headless Chrome (needs setup below)
npm run verify         # audit + test  (zero-dep — what CI's first job runs)
npm run verify:full    # audit + test + smoke  (the complete local gate)
```

## render-smoke — what it does

For each snippet *family* (a CSS+JS pair sharing a base name) it opens the shipped demo SPA at that snippet's route in headless **Google Chrome**, waits for the preview to mount, and asserts:

1. **Zero errors** — no console errors, page errors (uncaught exceptions), failed requests, or 4xx/5xx for the snippet's own files or its CDN libraries.
2. **Non-empty preview** — the preview node actually mounted content (canvas/svg/img/video, text, or children).
3. **Canvas drew** — for any `<canvas>`, the pixels show real signal: **per-channel R/G/B variance** + distinct colors (not just luminance, so a constant-brightness hue spiral still counts; not a single center-pixel sample).

It found and fixed real pre-existing bugs on its first full run — a shader runner that double-declared uniforms (8 shaders silently blank), two snippets whose banner comments contained a nested `*/` that broke parsing, an `int` shader uniform the runner set as a float, and several demos pointing at the wrong shader variant.

### Setup (once)

```bash
npm run smoke:setup     # installs playwright-core into tools/ (no browser download)
```

`render-smoke` reuses your **installed** Google Chrome via `playwright-core`'s `channel:'chrome'` — it does **not** download a ~150 MB browser. If Chrome isn't auto-found, set `HARNESS_CHROME=/path/to/chrome`.

### Usage

```bash
node tools/render-smoke.mjs                     # full run (hardware GL), exit 1 on failure
node tools/render-smoke.mjs --only shaders/     # filter by path substring
node tools/render-smoke.mjs --only a/b,c/d      # comma-separated list of snippets
node tools/render-smoke.mjs --json              # machine-readable report
HARNESS_SOFTWARE=1 node tools/render-smoke.mjs  # deterministic software WebGL (CI)
```

| Env | Effect |
|---|---|
| `HARNESS_SOFTWARE=1` | SwiftShader-via-ANGLE (`--use-gl=angle --use-angle=swiftshader-webgl --enable-unsafe-swiftshader`) for deterministic, GPU-independent WebGL. Use in CI. |
| `HARNESS_NET=off` | Block *all* CDN requests (offline determinism). Default `online` allows unpkg / jsdelivr / cdnjs / Google Fonts only. |
| `CONCURRENCY=N` | Parallel browser contexts (default 4 hardware / 2 software). |
| `HARNESS_CHROME=/path` | Explicit Chrome executable (CI sets this from the installed Chrome). |

### Why these choices

- **SwANGLE for software GL.** Plain `--use-gl=swiftshader` makes `getContext('webgl')` return `null` headless (the classic blank-canvas flake). Routing SwiftShader *through* ANGLE gives a real, correct-pixel software renderer. Verified on the research pass (`RENDER-HARNESS-SPEC.md`).
- **`preserveDrawingBuffer` forced on.** WebGL clears its drawing buffer after compositing, so a later `drawImage`/`getImageData` reads empty — a false "blank canvas". An init script wraps `getContext` to set it for every webgl context, so the pixel assertion reads the real frame. This is the single most important fix for verifying shader/3D snippets headlessly.
- **Real http origin, not `file://`.** A static server on `127.0.0.1` so ES modules, secure-context APIs, and CDN resolution behave like production.
- **Fresh browser context per snippet.** No state leaks between snippets.

### Exemptions and known-issues (never silent)

Some families can't be asserted on drawn pixels — they're checked for render + zero-error only, and the report says so:

- **MIC visualizers** (mic returns silence headless) — `sound-react`, `audio-visualizer`, `voice-input`, `voice-transcribe`.
- **CDN players** whose sample `.lottie`/`.riv` asset 404s in the demo (the lib loads and no-ops gracefully) — `lottie-player`, `rive-player`.
- **Interactive canvases** that are blank until the user draws — `cursor-paint`, `cursor-tool`, `whiteboard-pack`, `canvas-minimap`.

**Known-issues** are pre-existing breakage that needs a larger fix than this harness should bundle. They are listed in every report and **excluded from the exit-code gate** (so green means "everything fixable passes") but never hidden:

- `3d/postprocessing-bloom` — needs three.js `EffectComposer`/`UnrealBloomPass`, which are ESM-only (`examples/jsm`) at the pinned `three@0.160`; the old `examples/js` `<script>`-tag globals were removed. Tracked for an ESM-addon migration.

## CI

`.github/workflows/verify.yml` runs two jobs: a zero-dep **audit + MCP tests** job, and a **render-smoke** job that installs Chrome and runs the harness with `HARNESS_SOFTWARE=1`.
