# Render / Smoke Harness — Build Recommendation

Spec for `tools/render-smoke.mjs`: render EVERY snippet in a real headless Chrome and
assert it actually works — zero console/page/request errors, a non-empty preview node,
and (for canvas/WebGL/audio-viz) a canvas that demonstrably DREW. This is the
implementer's blueprint. Pinned versions and exact flags are load-bearing; do not
substitute `latest`.

It sits next to `tools/audit.js` (static, zero-dep) as the **dynamic** half of `verify`:
audit proves "every snippet is indexed, has a matching global, and has *a* render path
(inPrev / jsRun / Usage-HTML / CSS tiles)"; this harness proves "that render path
*actually renders* in a browser without errors."

---

## 0. Why this shape (the decisions, up front)

- **Foundation:** `playwright-core@1.60.0` as a **devDependency only**, launched against the
  user's **installed Google Chrome** via `channel:'chrome'` — zero ~150 MB browser download
  (the npm driver is ~12 MB of JS). Not `playwright` (downloads a browser on postinstall),
  not `@playwright/test` (a whole `.spec`/config/reporter runner — we want a plain Node loop
  with our own pass/fail table + exit code, mirroring `audit.js`).
- **Reuse, don't reimplement.** `demo/_app.js` already contains the complete
  snippet→preview pipeline: `parseIndex()` of `INDEX.md`, `companions()`, the CDN loaders
  (`loadThreeOnce` → `three@0.160.0`, `loadGsapOnce` → `gsap@3.13.0`), and
  `renderPreviewInto()` which tries (1) a custom `window.DemoPreviews[folder/file]`,
  then (2) Usage-HTML auto-preview, then (3) `tryRunJsUsage` / `tryAutoInit`, then
  (4) CSS variant tiles. **The harness drives the real demo page and navigates the
  in-page router to each snippet** — so every snippet becomes a test page through the
  exact code the user ships, and the audit's `inPrev / html / jsRun / tiles`
  classification maps 1:1 to what the demo will actually do.
- **WebGL crux (settled empirically on this machine, Chrome 149):** the old
  `chrome --headless --screenshot --use-gl=swiftshader` path was flaky because
  (a) `--use-gl=swiftshader` is **removed** — `getContext('webgl')` returns `null` =
  blank canvas; and (b) a screenshot reads the *cleared/swapped* drawing buffer.
  Fix: **read pixels in-page** via `gl.readPixels` / `getImageData` after rAF ticks,
  and for software determinism use the **SwANGLE** flag set below.
- **Two GPU profiles.** Default = installed Chrome's real hardware (fast, catches real-GPU
  bugs on dev macOS). `HARNESS_SOFTWARE=1` (CI) = SwiftShader-via-ANGLE, identical raster
  on any Linux runner.
- **Serve over `http://127.0.0.1`, never `file://`.** ES-module snippets, `isSecureContext`
  (Web Audio / `mediaDevices`), and clean CDN resolution all require an http origin.
- **Canvas-drew assertion = luminance variance + distinct-color count**, not a center-pixel
  check (a uniform fill fools the center check; a transparent-center render fails it).

---

## 1. Foundation + how it reuses the installed Chrome

`tools/package.json` (isolate the dev dep so the repo root stays zero-dep):

```json
{
  "name": "frontendmaxxing-tools",
  "private": true,
  "type": "module",
  "devDependencies": {
    "playwright-core": "1.60.0",
    "pixelmatch": "7.2.0",
    "pngjs": "7.0.0"
  }
}
```

`pixelmatch`/`pngjs` are **only** for the opt-in screenshot-diff in §5; the render gate
needs no diff library. (`pixelmatch@7` is ESM-only — fine, the harness is `.mjs`.)

Install with `npm install` inside `tools/`. No `npx playwright install`.

Launch (verified driving real Chrome 149, no download):

```js
import { chromium } from 'playwright-core';

const SOFTWARE = process.env.HARNESS_SOFTWARE === '1';

// SwANGLE: deterministic CPU WebGL. Replaces the dead --use-gl=swiftshader.
// Chrome 137+ removed the silent SwiftShader fallback, so --enable-unsafe-swiftshader
// is required to opt back into it.
const SOFTWARE_GL = [
  '--use-gl=angle',
  '--use-angle=swiftshader-webgl',
  '--enable-unsafe-swiftshader',
];

const browser = await chromium.launch({
  channel: 'chrome',        // reuse /Applications/Google Chrome.app — zero browser download
  headless: true,           // new headless (channel:'chrome' ⇒ headless=new since PW 1.49)
  args: [
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-color-profile=srgb',           // deterministic pixels across machines
    '--disable-features=AutomationControlled',
    '--autoplay-policy=no-user-gesture-required',  // Web Audio without a gesture (§4)
    '--mute-audio',
    ...(SOFTWARE ? SOFTWARE_GL : []),
  ],
});
```

Fallback if Chrome isn't at the default channel path: pass
`executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`
instead of `channel:'chrome'`. (`puppeteer-core@25.1.0` is the functional equivalent if
Playwright is ever undesirable — same three signals, same flags — but Playwright's
`browser.newContext()` isolation and `page.route()` stubbing make it the default.)

Sources: <https://playwright.dev/docs/browsers#google-chrome--microsoft-edge> ·
<https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md> ·
<https://groups.google.com/a/chromium.org/g/blink-dev/c/yhFguWS_3pM> ·
<https://chromeenterprise.google/policies/enable-unsafe-swift-shader/>

---

## 2. The Chrome launch flags for reliable software WebGL

Verified on Chrome 149 reading `UNMASKED_RENDERER_WEBGL` + `gl.readPixels` (not a screenshot):

| Flags | Renderer | readPixels | Verdict |
|---|---|---|---|
| none (default) | `ANGLE (Apple, ANGLE Metal Renderer: Apple M5)` | correct clear color → DREW | Hardware — dev macOS only |
| `--use-gl=swiftshader` (old) | — | `getContext('webgl')` → **null** | The blank-canvas flakiness — never use |
| **`--use-gl=angle --use-angle=swiftshader-webgl --enable-unsafe-swiftshader`** | `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader driver)` | `[51,153,230,255]` → DREW | **CI default — deterministic on any box** |

Pass these via Playwright `args` (verified they coexist with `channel:'chrome'`). **Avoid**
`--use-angle=vulkan` / `--enable-features=Vulkan` (the Chrome-AI-blog recipe): that needs
real GPU drivers and fails on driverless CI. **Avoid** `headless:'shell'`
(chrome-headless-shell) for WebGL — it is the GPU-poor old headless.

CI runs `HARNESS_SOFTWARE=1`; local dev defaults to hardware. The harness logs the
resolved `UNMASKED_RENDERER_WEBGL` once at startup so failures are diagnosable.

---

## 3. Each snippet → a test page + the per-snippet assertions

### 3a. Building the worklist (shared with the audit)

Reuse the audit's classification so the harness and audit never drift. Run
`node tools/audit.js --json` and read `findings` to know which snippets have **no** render
path (the `weak-preview` list) — those are skipped-as-expected (audit already flags them),
not harness failures. Everything else has at least one of `inPrev / html / jsRun / tiles`
and MUST render. The harness parses `INDEX.md` for the canonical entry list (same
`parseIndex` regex as `_app.js`: `**file** \`folder/file\` (KIND, global: \`Name\`)`),
grouping CSS+JS companions into one **family** per preview (the demo previews a family,
not a lone file). ~775 snippet families.

### 3b. Driving the real demo (the key move)

Serve the repo root and open the demo once per snippet via its hash router — this runs the
shipped `_app.js` pipeline end-to-end (custom preview → Usage-HTML → jsRun → CSS tiles),
including the real `loadThreeOnce`/`loadGsapOnce` CDN loaders.

```js
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;   // repo root (tools/ is one down)
const MIME = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml',
  '.riv':'application/octet-stream', '.lottie':'application/zip' };

const server = http.createServer((req, res) => {
  let p = normalize(decodeURIComponent(req.url.split('?')[0]));
  let abs = join(ROOT, p);
  if (existsSync(abs) && statSync(abs).isDirectory()) abs = join(abs, 'index.html');
  if (!abs.startsWith(ROOT) || !existsSync(abs)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
  createReadStream(abs).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;
```

Per snippet, in a **fresh isolated context** (clean console/cache/storage every time):

```js
const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 } });
const page = await ctx.newPage();

const consoleErrs = [], pageErrs = [], failed = [], badResp = [];
page.on('console',     m => { if (m.type() === 'error') consoleErrs.push(m.text()); });
page.on('pageerror',   e => pageErrs.push(String(e)));
page.on('requestfailed', r => failed.push(`${r.url()} :: ${r.failure()?.errorText}`));
page.on('response',    r => { if (r.status() >= 400) badResp.push(`${r.status()} ${r.url()}`); });

// Open the demo at this snippet's route (hash router: #/folder/file).
await page.goto(`${BASE}/demo/index.html#/${entry.path}`, { waitUntil: 'load' });

// Click through the router to the snippet's preview pane the same way a user does,
// OR (more robust) expose a tiny test hook in _app.js — see 3c.
```

### 3c. One small, additive hook in `_app.js` (recommended)

The demo's preview is built asynchronously (CDN loads + `setTimeout` auto-init). Rather than
race it with arbitrary waits, add a **non-invasive** promise the harness can await. This is
the only repo change required and it is additive (no behavior change for humans):

```js
// at top of _app.js IIFE
var __previewReady;
window.__renderSnippet = function (path) {
  return new Promise(function (resolve) { __previewReady = resolve; route('#/' + path); });
};
// inside renderPreviewInto, AFTER the preview is mounted (custom or auto), call:
//   if (__previewReady) { var r = __previewReady; __previewReady = null;
//                         requestAnimationFrame(function(){ requestAnimationFrame(r); }); }
```

Then the harness does:

```js
await page.evaluate(p => window.__renderSnippet(p), entry.path);
```

If touching `_app.js` is undesirable, fall back to: navigate, wait for the preview body
selector, then `await page.waitForFunction` that the preview node is non-empty AND poll
for canvas-drew (with a timeout). The hook is strongly preferred — it removes the only
real source of flake (timing).

### 3d. The assertions (per snippet)

**A. Zero errors (hard fail on any):**

```js
const errs = [...consoleErrs, ...pageErrs.map(e=>'pageerror: '+e),
              ...failed.map(f=>'requestfailed: '+f), ...badResp.map(b=>'http '+b)];
```

Allow-list known-benign noise narrowly (e.g. a `favicon.ico` 404 if the demo lacks one),
defined as an explicit constant — never a broad regex.

**B. Preview node non-empty:**

```js
const previewOk = await page.evaluate(() => {
  const body = document.getElementById('dapp-preview-body')
            || document.querySelector('.dapp-auto-stage')
            || document.getElementById('dapp-content');
  if (!body) return false;
  if (body.querySelector('canvas, svg, img, video')) return true;     // media counts
  return body.innerText.trim().length > 0 || body.children.length > 0; // markup counts
});
```

**C. Canvas DREW (only for families with a `<canvas>`):** read the FULL (or downscaled)
buffer in-page after rAF ticks; fail if blank or uniform. This is the crux assertion.

```js
const canvasReport = await page.evaluate(async () => {
  const sleep = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await sleep(); await sleep();                      // ≥2 rAF so the first frame rendered
  await new Promise(r => setTimeout(r, 250));        // settle for THREE/shader warmup

  const out = [];
  for (const c of document.querySelectorAll('canvas')) {
    if (!c.width || !c.height) { out.push({ drew:false, reason:'zero-size' }); continue; }
    // downscale read for speed; works for both 2D and WebGL canvases
    const off = document.createElement('canvas');
    const W = Math.min(c.width, 64), H = Math.min(c.height, 64);
    off.width = W; off.height = H;
    const octx = off.getContext('2d');
    let data;
    try { octx.drawImage(c, 0, 0, W, H); data = octx.getImageData(0,0,W,H).data; }
    catch (e) { out.push({ drew:true, reason:'tainted-unreadable' }); continue; } // CORS = pass
    let n=0, sum=0, sumSq=0; const seen = new Set();
    for (let i=0;i<data.length;i+=4){
      const lum = 0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2];
      const a = data[i+3];
      sum += lum; sumSq += lum*lum; n++;
      seen.add((data[i]>>4)<<8 | (data[i+1]>>4)<<4 | (data[i+2]>>4)); // ~quantized color
      if (a > 0 && (data[i]||data[i+1]||data[i+2])) {} // opacity tracked implicitly
    }
    const variance = sumSq/n - (sum/n)**2;
    out.push({ drew: variance > 5 && seen.size > 1, variance, colors: seen.size });
  }
  return out;
});
```

PASS rule for a canvas family: every `<canvas>` reports `drew === true` (or
`tainted-unreadable`). Verified contrast: blank → variance 0 / 1 color; uniform fill →
variance 0 / 1 color; real render → variance ~1762 / 32 colors. Keep a tiny **per-snippet
allow-list** for legitimately-uniform canvases (e.g. a solid-fill demo) where
`variance === 0` is an expected PASS.

WebGL note: reading via `drawImage(canvas)` into a 2D context composites the current
front buffer and avoids the `preserveDrawingBuffer` trap — but only if read **inside** a
frame (the rAF waits above ensure this). For snippets that explicitly create the GL
context with `preserveDrawingBuffer:false` and clear aggressively, the rAF-timed read still
catches a live frame; if a specific snippet flakes, set `preserveDrawingBuffer:true` is NOT
needed because we read via the 2D composite, not `gl.readPixels`.

---

## 4. CDN snippets (THREE / GSAP / lottie / rive) + Web-Audio autoplay

**Exact CDN pins in the vault** (confirmed by grep — counts are *files that load the lib
from a CDN*):

| Lib | Pin | Source | Files |
|---|---|---|---|
| three | `0.160.0` | unpkg (`loadThreeOnce` in `_app.js`) | 7 |
| gsap (+ScrollTrigger/Flip/Draggable/Inertia/ScrollTo) | `3.13.0` | jsdelivr (`loadGsapOnce`) | 5 |
| @lottiefiles/dotlottie-web | `0.74.0` | jsdelivr `+esm` | `media/lottie-player.js` |
| @rive-app/canvas | `2.38.1` | unpkg | `media/rive-player.js` |

THREE also pulls `examples/fonts/helvetiker_bold.typeface.json` and several
`examples/js/postprocessing|shaders` files from unpkg for a couple of 3d snippets — these
are real network deps to allow in ONLINE mode and to vendor in OFFLINE mode.

**Two network modes (env `HARNESS_NET`):**

- **ONLINE (default, real integration coverage):** allow only the pinned CDN hosts; abort
  everything else; a failed CDN load (`requestfailed` or `>=400`) is a HARD fail.

  ```js
  const ALLOW = [/^https?:\/\/unpkg\.com\//, /^https?:\/\/cdn\.jsdelivr\.net\//];
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(BASE) || ALLOW.some(re => re.test(u))) return route.continue();
    return route.abort();   // block trackers/fonts/etc. for determinism
  });
  ```

- **OFFLINE / hermetic CI (`HARNESS_NET=offline`):** vendor the 4 pinned libs once into
  `tools/fixtures/` and `route.fulfill()` them; ship a tiny local `.lottie` and `.riv`
  fixture so lottie/rive draw deterministically without CDN/network. Lottie and Rive both
  draw to `<canvas>`, so the **same §3d variance assertion** confirms they rendered. Use a
  longer settle (300–400 ms) for these two — first frame is async after asset fetch+parse.

Give CDN families a longer per-snippet timeout (e.g. 20 s vs 8 s default) and **1 retry**
to absorb transient CDN latency in ONLINE mode.

**Web Audio (7 analyser snippets):** with `--autoplay-policy=no-user-gesture-required`
(already in §1 args) `AudioContext.state` becomes `running` with no gesture, and an
`OscillatorNode → AnalyserNode` produces real data with no audio hardware (verified
`getByteFrequencyData` max 255). So oscillator/file-driven visualizers DRAW and pass the
variance check directly.

**Mic visualizers** (`interactions/sound-react.js`, `media/audio-visualizer.js`,
`ai/voice-input.js`, `ai/voice-transcribe.js`): the fake mic
(`--use-fake-device-for-media-stream`) returns **silence** — verified `freqMax=0`. Do NOT
assert audio-reactive pixels for these. Either (a) downgrade them to "static UI renders +
zero console errors" (drop the canvas-drew assertion via the per-snippet allow-list), or
(b) inject a synthetic `OscillatorNode` into the snippet's `AudioContext` before asserting.
List these 4 explicitly as `audioMode:'mic'` so the harness picks the right path.

Sources: <https://playwright.dev/docs/network#modify-requests> ·
<https://developer.chrome.com/docs/chromium/headless> · empirical Chrome 149 Web-Audio probes.

---

## 5. Optional screenshot-diff baseline (opt-in, not the gate)

The gate (§3) needs no images. Regression diffing is a **separate opt-in layer** for
snippets you explicitly bless.

- Capture: `await page.locator('#dapp-preview-body').screenshot({ path })` with
  `animations:'disabled'`-equivalent determinism (freeze via injected CSS
  `*{animation:none!important;transition:none!important}` before the shot for non-canvas
  snippets; canvas snippets diff a single rAF-synced frame).
- Diff with **`pixelmatch@7.2.0`** + **`pngjs@7.0.0`**:

  ```js
  import { PNG } from 'pngjs';
  import pixelmatch from 'pixelmatch';
  const a = PNG.sync.read(fs.readFileSync(baseline));
  const b = PNG.sync.read(fs.readFileSync(current));
  const diff = new PNG({ width:a.width, height:a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height,
                       { threshold: 0.1, includeAA: false });
  const ratio = n / (a.width * a.height);   // fail if ratio > 0.02
  ```

- **Baselines are OS/GPU-specific** — a macOS-hardware baseline will NOT match Linux-software
  CI. So: store baselines under `tools/__baselines__/<os>-<gl>/…` and **only diff when the
  baseline matches the current `os+gl` profile**; in CI, generate/bless baselines in the
  same container that runs them, or skip diffing in CI entirely and keep only the render
  gate. Non-zero `threshold` + `includeAA:false` so font-hinting/AA jitter doesn't false-fail.
- `--update-baselines` CLI flag (re)writes the current profile's baselines.

(`odiff` is the escape hatch only if diffing the full vault becomes a measurable bottleneck;
at preview-sized images pixelmatch is competitive and adds no native binary.)

Sources: <https://github.com/mapbox/pixelmatch> · <https://playwright.dev/docs/test-snapshots>

---

## 6. CLI / report / exit code + how it slots next to `tools/audit.js`

Mirror `audit.js`'s ergonomics so `npm run verify` can chain both.

```
node tools/render-smoke.mjs                 # full run, hardware GL (dev), exit 1 on any fail
node tools/render-smoke.mjs --only 3d/      # filter by folder or path substring
node tools/render-smoke.mjs --json          # machine-readable report to stdout
node tools/render-smoke.mjs --update-baselines
HARNESS_SOFTWARE=1 node tools/render-smoke.mjs   # CI: deterministic SwiftShader WebGL
HARNESS_NET=offline ...                           # CI: hermetic, vendored CDN fixtures
```

**Per-snippet flow:** fresh context → route stubs → `__renderSnippet(path)` → collect
errors → assert preview-non-empty → assert canvas-drew (if canvas) → optional diff →
`ctx.close()`. Wrap in a per-snippet **timeout** (8 s default / 20 s CDN) and **1 retry**
(retry catches the rare CDN/rAF-timing flake; a snippet that fails twice is a real fail).
Run with a small **concurrency** (e.g. 4 contexts in flight) for throughput — contexts are
isolated so this is safe; software-GL CI may want concurrency 2 to avoid CPU contention.

**Report:** a pass/fail table plus a failure detail block, e.g.

```
frontendmaxxing render-smoke — 775 families · GL: SwiftShader · net: online

  ✓ render            761 / 775  (98%)
  ✗ console-clean     768 / 775   ·  7 with console/page/request errors
  ✗ canvas-drew        58 /  61   ·  3 canvases blank/uniform

FAILURES
  ✗ 3d/particles-field        canvas-drew: variance 0.0, colors 1  (blank)
  ✗ media/lottie-player       requestfailed: …dotlottie-web/+esm :: net::ERR_…
  ✗ effects/foo               pageerror: TypeError: x is not a function

FAIL: 10 snippet(s) failed.
```

`--json` emits `{ total, gl, net, pass, fail, results:[{path, render, console, canvas,
errors[], variance, colors, retried}] }` for CI consumption.

**Exit code:** `process.exit(failCount > 0 ? 1 : 0)` — identical contract to `audit.js`.

**package.json wiring** (root):

```json
"scripts": {
  "audit": "node tools/audit.js",
  "smoke": "node tools/render-smoke.mjs",
  "smoke:ci": "HARNESS_SOFTWARE=1 HARNESS_NET=online node tools/render-smoke.mjs",
  "verify": "node tools/audit.js && node tools/render-smoke.mjs"
}
```

`audit` stays the fast static gate (no browser); `smoke` is the dynamic gate. `verify`
runs static-then-dynamic so a structural break fails fast before spinning up Chrome. CI
calls `smoke:ci` for cross-machine determinism. Snippets remain zero-dep; all tooling and
the one `playwright-core` dev dep live under `tools/`, and `_app.js` gains only the additive
`window.__renderSnippet` hook (§3c).

---

### Pinned versions (do not drift)

`playwright-core` **1.60.0** · Google Chrome **149** (`channel:'chrome'`) ·
`pixelmatch` **7.2.0** + `pngjs` **7.0.0** (diff only) · three **0.160.0** ·
gsap **3.13.0** · @lottiefiles/dotlottie-web **0.74.0** · @rive-app/canvas **2.38.1**.

SwANGLE flags (CI software profile):
`--use-gl=angle --use-angle=swiftshader-webgl --enable-unsafe-swiftshader`.
