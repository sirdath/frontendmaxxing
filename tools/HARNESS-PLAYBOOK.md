# Render-smoke playbook — how to use the harness

The harness (`tools/render-smoke.mjs`) is the **runtime half of "done"**: the only gate that can prove a shader / 3D / canvas / runtime-JS snippet actually renders, with no errors and real drawn pixels. `tools/audit.js` proves a snippet is *indexed and well-formed*; render-smoke proves it *works*. This doc is the operating manual. Mechanics live in `tools/README.md`; this is *when and how to reach for it*.

It was designed and pressure-tested by a 4-lens design panel + an adversarial critic. The non-obvious failure modes the critic surfaced are baked into the rules below — read the **Gotchas** section, it's the part that keeps the gate honest.

---

## 1. The authoring inner loop (per snippet)

For any snippet with runtime behavior — a `<canvas>`, WebGL/shader, THREE/3D, or JS that builds/animates the DOM:

```
write  →  audit  →  register the demo preview  →  scoped smoke  →  done
```

```bash
node tools/audit.js                              # 1. static gate (free, zero-dep)
# 2. register the preview in demo/_previews.js  (see §2)
npm run smoke:dev -- <folder>/<file>             # 3. runtime gate, ONE family, ~2s, one core
```

- **Order matters: register *before* smoke.** The harness verifies the snippet *through the demo route* (`demo/index.html#/<folder>/<file>`). An unregistered canvas snippet has no drawing surface — smoke would catch it (see canvas-required, §3) but you save a cycle by registering first.
- **Pure CSS/markup snippets** don't need smoke — `audit` + an eyeball is enough.
- The loop is `smoke:dev` (capped at `CONCURRENCY=1`) on purpose: it never competes with whatever else the machine is doing. Reserve the full vault for pre-push.

## 2. Registering the demo preview (the step that makes a snippet verifiable)

A new canvas/shader/3D snippet renders **nothing** in the demo until it's registered. Add a `P['folder/file.ext']` entry in `demo/_previews.js` (key must match the route exactly — shaders keep their `.glsl.js`):

- **Fullscreen-quad shaders** → `shaderStage(t, 'GlobalName', { note, prop })`. Use `prop: 'proceduralFragment'` for image-processing shaders that otherwise need a `photo.jpg`.
- **3D** → `threeStage(target, { height, note })` + `waitForThree(() => window.Global.init(host))`. `window.SceneRunner` is loaded globally (static `<script>` in `index.html`), so it's always available.
- **2D canvas / DOM** → a plain function that builds the surface and calls your global's `.init()`.

If you skip this, the demo falls back to a text preview with no `<canvas>` — the **vacuous pass** the harness was built to catch.

## 3. Reading the result — three independent claims

The summary prints `render N/N`, `console-clean N/N`, `canvas-drew N/M`. Each maps to a *different* file you'd edit:

| Failure | Means | Fix in |
|---|---|---|
| `render` < N | preview body never mounted | `demo/_previews.js` (registration / route key) — or the snippet threw before mounting |
| `console-clean` < N | real JS error, failed request, or 4xx on your file / a CDN lib | the snippet (the harness already filters benign favicon + example-asset 404s, so a reported error is real) |
| `canvas-drew` < N | canvas mounted but no pixel signal (`variance X, colors Y`) | the shader/THREE draw code (compile error, uniform-type bug, never drew) |
| `canvas-drew` **absent** on a `shaders/`/`3d/` snippet | no canvas at all → **missing registration** | `demo/_previews.js` — this is a hard FAIL, not a pass |

A `[retried]` tag means the family failed **twice** (the harness auto-retries once) → a real failure, not a flake.

**Canvas-required:** every `shaders/`/`3d/` family must produce a canvas. The harness fails any that renders a text fallback instead. (This is what caught 6 three.js snippets that were silently rendering nothing because `SceneRunner` wasn't being loaded.)

**`canvas-drew` ≠ "looks right."** It proves *a non-trivial frame rendered*, not that the intended scene did. For genuinely new visual work, still eyeball the demo once for correctness — the harness replaces the "did I wire it up / did it draw anything" eyeball, not the "does it look right" one.

## 4. Exemptions — narrowing the gate, never silencing it

Three sets at the top of `render-smoke.mjs` skip *only* the pixel assertion (render + zero-error are still enforced); the result's `canvas` stays `null`:

- `MIC` — audio/mic visualizers (silent headless). Keyed by **full path** (`media/audio-visualizer.js`).
- `CDN_ASSET_FAMILIES` — Lottie/Rive players whose sample asset 404s. Keyed by **base** (`media/lottie-player`).
- `INTERACTIVE_CANVAS` — paint/whiteboard/empty-minimap, blank until the user draws. Keyed by **base**.

Rules for adding one (this is a **one-way gate-narrowing** operation — get it wrong and you blind the gate to a real snippet forever):

1. **First disprove it's a real bug** — open `demo/index.html#/<path>` in real Chrome and confirm the canvas draws *with* input and is blank *only* without it.
2. Add it to the right set at the right key shape (path for MIC, base for the other two), **in the same change** as the snippet.
3. Mirror it in `tools/README.md`'s exemption list.
4. Re-run the scoped command to confirm the exemption took.
5. **Never** widen `BENIGN` or `ALLOW` into a broad regex to make a red run green.

`KNOWN_ISSUES` is for pre-existing breakage too large to fix in the current change. The Map value must be a real **root-cause + exit-criterion** sentence. It's reported (`~`) and excluded from the exit code, never silenced. Exit = delete the line; the family rejoins the gate automatically.

## 5. Machine-load discipline (this Mac also runs ML evals)

- **During authoring:** scoped + hardware GL only — `npm run smoke:dev -- <folder>/<file>`. One context, ~2s. Safe to run continuously.
- **Full vault:** only at two moments — (a) right before a push, and (b) after a *cross-cutting* change (`demo/_app.js`, `demo/_previews.js`, a shared helper like `shaders/runner.js` / `3d/scene-runner.js`, `INDEX.md`, a CDN pin). Throttle it: `npm run smoke:safe` (CONCURRENCY=2), or `CONCURRENCY=1` if an eval is mid-run. Never put a full vault in a git hook.
- **`HARNESS_NET=off`** removes all outbound traffic but **only for non-CDN families** (`components/`, `blocks/`, `typography/`, …). Never on `3d/`, `shaders/`, or `gsap/` — they fetch three/gsap from a CDN at runtime, so net-off manufactures a phantom canvas-blank failure. Never on a full vault.
- **Triage from one captured `--json`**, don't re-run the sweep: `node tools/render-smoke.mjs --json > /tmp/smoke.json`, then `jq '.results[] | select(.canvas==false or .console==false)'`, then re-run only the failed bases via `--only a/b,c/d`.

## 6. CI / release gating

`.github/workflows/verify.yml` runs two jobs; make **both** required status checks on `main`:

- **`audit`** — `node tools/audit.js && node mcp-server/test.js`. Zero-dep, seconds, the structural gate. Must never be bypassable.
- **`render-smoke`** — the browser harness under `HARNESS_SOFTWARE=1` (SwiftShader-via-ANGLE, GPU-independent) on a Linux runner, off your Mac entirely.

- **Honor the exit-code contract.** `render-smoke.mjs` exits 1 only on real `fails` (known-issues are excluded). **Never** add `continue-on-error` to the render-smoke job — that silently demotes the only dynamic gate to advisory and lets blank shaders merge.
- **Flake policy:** the single family-level retry (`withRetry`) is the ceiling. Do **not** enable GitHub job-level auto-rerun — it hides non-determinism. A family that needs the retry to pass is marginal; investigate it.
- **The +9000/+12000ms populate deadlines are load-bearing** anti-flake margins for heavy CDN previews. If a heavy pack flakes, lower `CONCURRENCY`, don't shorten the deadline.

## 7. Gotchas (the adversarial critic's findings — internalize these)

1. **Vacuous pass.** A shader/3D snippet run *before* registration passes `render + console` with `canvas-drew` absent. → The canvas-required check now fails these for `shaders/`/`3d/`; for any *other* canvas snippet you know has a canvas, treat an absent `canvas-drew` as a registration bug, not a pass.
2. **`--only` is a substring match.** `blocks/tooltips` → 2 families; `card` → a dozen. Pass the full `<folder>/<file>` and check the `N families` header.
3. **`0 families` is a red state.** It means your snippet was filtered out (unregistered/weak-preview/typo) and is **unverified** — not green.
4. **Don't ship a bare-`--only` script.** `node … --only` with no arg parses to "no filter" = full vault. `smoke:dev` caps `CONCURRENCY=1` so even that accident can't saturate cores.
5. **`canvas-drew` proves "drew," not "correct."** Keep one manual eyeball for new visual work.
6. **Hardware (your M-series) vs software (CI SwiftShader) GL can diverge.** For a borderline shader, reproduce CI once: `HARNESS_SOFTWARE=1 node tools/render-smoke.mjs --only <snippet>`.

## 8. Tracked follow-ups (prioritized)

1. **Resolve the one `KNOWN_ISSUE` — `3d/postprocessing-bloom`.** It needs three.js `EffectComposer`/`UnrealBloomPass`, ESM-only at `three@0.160`. Add a small importmap/ESM loader that imports them from `examples/jsm/...` and attaches to `window.THREE` (preserving the snippet's `T.EffectComposer` contract), update its `demo/_previews.js` registration to use it instead of the dead `examples/js` URLs, verify with `--only 3d/postprocessing-bloom`, then delete the `KNOWN_ISSUES` entry + the README bullet → `canvas-drew` reaches a true 100%.
2. **CI hardening.** Pin `browser-actions/setup-chrome` to a fixed version; capture the harness's `GL:` line and assert it contains `SwiftShader` (a Chrome update dropping `--enable-unsafe-swiftshader` would silently blank every canvas); add a `--json` post-step that `::warning::`s any `retried===true` family and `::error::`s if a `knownIssue` family starts passing (anti-rot — forces the list to shrink as fixes land).
3. **Hermetic CI net.** Vendor the 4 pinned CDN libs (`three@0.160`, `gsap@3.13`, `dotlottie@0.74`, `rive@2.38`) into `tools/fixtures/` and `route.fulfill` them, then set `HARNESS_NET=off` on the CI step so a transient CDN 5xx can't redden `main`. This is a prerequisite-gated change (the fixtures must exist first), not a same-day flag flip.
4. **Two-tier CI triggers.** Keep `audit` on every push/PR; make the full render-smoke a nightly `schedule:` + a diff-scoped `--only` smoke per PR (derive families from `git diff`, fall back to full when tooling/`_app.js`/`_previews.js`/`INDEX.md` change). Cuts per-PR runner cost without losing whole-corpus coverage.
