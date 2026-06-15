#!/usr/bin/env node
/* ============================================
   render-smoke.mjs — the DYNAMIC half of `verify`
   ============================================
   Renders every snippet family in a real (headless) Google Chrome via the
   shipped demo SPA and asserts it actually works: zero console/page/request
   errors, a non-empty preview, and — for any <canvas> — that it demonstrably
   DREW (per-channel R/G/B variance + distinct colors, so constant-luminance but
   hue-varying shaders still count; not a center-pixel check). WebGL readback is
   made reliable by forcing preserveDrawingBuffer on every webgl context.

   Reuses the installed Chrome (playwright-core channel:'chrome' — no browser
   download). For deterministic software WebGL in CI, HARNESS_SOFTWARE=1 uses the
   SwANGLE flags. See tools/RENDER-HARNESS-SPEC.md and tools/README.md.

   Exemptions (assert render + zero-error only, not drawn pixels): MIC visualizers
   (silent input), CDN players whose sample .lottie/.riv 404s, and interactive
   canvases (paint/whiteboard) that are blank until the user draws. KNOWN_ISSUES
   are reported but excluded from the exit-code gate — never silently passed.

   Usage:
     node tools/render-smoke.mjs                    # full run (hardware GL), exit 1 on fail
     node tools/render-smoke.mjs --only 3d/         # filter by path substring
     node tools/render-smoke.mjs --only a/b,c/d     # comma-separated list
     node tools/render-smoke.mjs --json             # machine-readable
     HARNESS_SOFTWARE=1 node tools/render-smoke.mjs # CI: SwiftShader-via-ANGLE
   Env: HARNESS_SOFTWARE=1 (software GL) · HARNESS_NET=off (block all CDNs) ·
        CONCURRENCY=N · HARNESS_CHROME=/path/to/chrome (explicit executable).
   ============================================ */
import { chromium } from 'playwright-core';
import http from 'node:http';
import { createReadStream, existsSync, statSync, readFileSync } from 'node:fs';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ---- args / env ----
const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const onlyIx = argv.indexOf('--only');
// --only accepts one path substring or a comma-separated list ("a/b,c/d"); a
// family matches if ANY token is a substring of its base or representative path.
const ONLY = onlyIx !== -1 && argv[onlyIx + 1] && !argv[onlyIx + 1].startsWith('--')
  ? argv[onlyIx + 1].split(',').map((s) => s.trim()).filter(Boolean)
  : null;
const SOFTWARE = process.env.HARNESS_SOFTWARE === '1';
const NET = process.env.HARNESS_NET || 'online';
// Software GL is single-threaded-ish, so default lower; override with CONCURRENCY=N.
const CONCURRENCY = Math.max(1, parseInt(process.env.CONCURRENCY, 10) || (SOFTWARE ? 2 : 4));

// Fake mic returns silence, so audio-reactive canvases can't be asserted to draw.
const MIC = new Set(['interactions/sound-react.js', 'media/audio-visualizer.js', 'ai/voice-input.js', 'ai/voice-transcribe.js']);
// CDN players reference a sample .lottie/.riv that doesn't exist in the demo —
// the lib loads but the asset 404s and the snippet no-ops gracefully (correct).
const CDN_ASSET_FAMILIES = new Set(['media/lottie-player', 'media/rive-player']);
// Drawing surfaces that are intentionally BLANK until the user interacts (paint,
// whiteboard, minimap of empty content). A canvas with no strokes is correct here,
// so assert render + zero-error only — not drawn pixels (like MIC visualizers).
const INTERACTIVE_CANVAS = new Set(['components/canvas-minimap', 'components/whiteboard-pack', 'cursor/cursor-paint', 'cursor/cursor-tool']);
// Explicit, REPORTED known-issues: pre-existing breakage that needs a larger fix
// than this harness should bundle. Listed in the output and excluded from the hard
// pass/fail gate so "green" means "everything fixable passes" — never silent.
const KNOWN_ISSUES = new Map([
  ['3d/postprocessing-bloom', 'needs three EffectComposer/UnrealBloomPass — ESM-only (examples/jsm) at r160; no <script>-tag (examples/js) build exists. Tracked for ESM-addon migration.'],
]);
// narrow, explicit benign-noise allow-list (never a broad regex)
const BENIGN = [/favicon\.ico/i];
// CDN hosts allowed in ONLINE mode; everything else is aborted for determinism.
// Google Fonts (CSS on googleapis, font files on gstatic) are a legit web-font CDN.
const ALLOW = [/^https?:\/\/unpkg\.com\//, /^https?:\/\/cdn\.jsdelivr\.net\//, /^https?:\/\/cdnjs\.cloudflare\.com\//, /^https?:\/\/fonts\.googleapis\.com\//, /^https?:\/\/fonts\.gstatic\.com\//];

// WebGL drawing buffers are cleared after compositing unless preserveDrawingBuffer
// is set, so a later drawImage/getImageData reads an empty buffer (false "blank
// canvas"). Force it on for every webgl/webgl2 context, before any page script
// runs, so the pixel-variance assertion reads the actual rendered frame. Runs in
// the page via addInitScript; this is the single most important robustness fix
// for verifying shader/3D snippets headlessly.
const PRESERVE_WEBGL = `(function () {
  var orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
      attrs = Object.assign({}, attrs || {}, { preserveDrawingBuffer: true });
    }
    return orig.call(this, type, attrs);
  };
})();`;

function log(...a) { if (!JSON_OUT) console.log(...a); }

// ---- static server (http origin: ES modules, secure context, CDN resolution) ----
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.riv': 'application/octet-stream', '.lottie': 'application/zip', '.md': 'text/plain' };
function startServer() {
  const server = http.createServer((req, res) => {
    let p = normalize(decodeURIComponent(req.url.split('?')[0].split('#')[0]));
    let abs = join(ROOT, p);
    if (existsSync(abs) && statSync(abs).isDirectory()) abs = join(abs, 'index.html');
    if (!abs.startsWith(ROOT) || !existsSync(abs)) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
    createReadStream(abs).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

// ---- worklist: families from INDEX, minus the audit's weak-preview (no render path) ----
async function buildWorklist() {
  const fm = await import(pathToFileURL(join(ROOT, 'mcp-server', 'server.js')).href);
  const entries = fm.parseIndex(readFileSync(join(ROOT, 'INDEX.md'), 'utf8'));
  let weak = new Set();
  try {
    const json = JSON.parse(execFileSync('node', [join(ROOT, 'tools', 'audit.js'), '--json'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
    (json.findings && json.findings['weak-preview'] || []).forEach((f) => weak.add(String(f).split(/\s/)[0]));
  } catch (e) { log('warn: could not read audit --json (' + e.message + ') — not skipping any'); }

  const fams = new Map();
  for (const e of entries) {
    const base = (e.folder + '/' + e.file).replace(/\.(css|js)$/, '').replace(/\.glsl$/, '');
    const fam = fams.get(base) || { base, files: [], rep: null };
    fam.files.push(e);
    // representative route: prefer a JS (runs init/shader), else the CSS
    if (!fam.rep || (e.kind === 'JS' && fam.rep.kind !== 'JS')) fam.rep = e;
    fams.set(base, fam);
  }
  let list = [...fams.values()].filter((f) => !f.files.every((e) => weak.has(e.path)));
  if (ONLY) list = list.filter((f) => ONLY.some((t) => f.base.includes(t) || f.rep.path.includes(t)));
  list.forEach((f) => {
    f.isMic = f.files.some((e) => MIC.has(e.path));
    f.cdnAsset = CDN_ASSET_FAMILIES.has(f.base);
    f.interactive = INTERACTIVE_CANVAS.has(f.base);
    f.knownIssue = KNOWN_ISSUES.get(f.base) || null;
  });
  return list;
}

// ---- in-page: wait for preview, then assess every canvas (the crux assertion) ----
// Passed to page.evaluate as a real function (NOT a string — a string is
// evaluated as an expression and never invoked with args). Self-contained.
const ASSESS = async (opts) => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  // poll for the preview body to mount + populate (render path is async)
  const body = () => document.getElementById('dapp-preview-body');
  const nonEmpty = (b) => !!(b && (b.querySelector('canvas,svg,img,video') || b.innerText.trim().length > 0 || b.children.length > 0));
  // Generous populate window: under concurrent load a heavy preview (e.g. a 6-scene
  // three.js pack) can take seconds to mount. Too short a deadline = false "empty".
  const deadline = Date.now() + opts.settle + 9000;
  while (Date.now() < deadline) { if (nonEmpty(body())) break; await sleep(60); }
  const b = body();
  const previewOk = nonEmpty(b);
  // let canvases warm up (THREE/shaders need a few frames)
  await raf(); await raf(); await sleep(opts.settle);
  const canvases = [];
  for (const c of (b ? b.querySelectorAll('canvas') : [])) {
    if (!c.width || !c.height) { canvases.push({ drew: false, reason: 'zero-size' }); continue; }
    const W = Math.min(c.width, 64), H = Math.min(c.height, 64);
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const octx = off.getContext('2d'); let data;
    try { octx.drawImage(c, 0, 0, W, H); data = octx.getImageData(0, 0, W, H).data; }
    catch (e) { canvases.push({ drew: true, reason: 'tainted-unreadable' }); continue; }
    // Per-channel variance (not just luminance) — some shaders vary in hue while
    // keeping luminance flat (e.g. a constant-brightness color spiral). Measuring
    // only luminance would falsely report those as "didn't draw". Track R/G/B
    // variance separately + a distinct-color count, and treat any meaningful
    // signal as "drew".
    let n = 0; const s = [0, 0, 0], sq = [0, 0, 0]; const seen = new Set();
    for (let i = 0; i < data.length; i += 4) {
      for (let k = 0; k < 3; k++) { const v = data[i + k]; s[k] += v; sq[k] += v * v; }
      n++;
      seen.add(((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4));
    }
    const ch = n ? [0, 1, 2].map((k) => sq[k] / n - (s[k] / n) ** 2) : [0, 0, 0];
    const lumVar = 0.299 * ch[0] + 0.587 * ch[1] + 0.114 * ch[2];
    const maxVar = Math.max(ch[0], ch[1], ch[2]);
    // drew when there's real spatial signal: brightness OR per-channel variance
    // above noise, with >1 distinct color — or simply many distinct colors.
    const drew = (Math.max(lumVar, maxVar) > 5 && seen.size > 1) || seen.size >= 4;
    canvases.push({ drew, variance: Math.round(Math.max(lumVar, maxVar)), colors: seen.size });
  }
  return { previewOk, canvases, hasCanvas: canvases.length > 0 };
};

async function testFamily(browser, base, fam) {
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 } });
  await ctx.addInitScript({ content: PRESERVE_WEBGL });   // reliable WebGL pixel readback
  const page = await ctx.newPage();
  const consoleErrs = [], pageErrs = [], failed = [], badResp = [];
  // Usage examples render placeholder assets (<img src="…">, data-lottie="hero.lottie")
  // that resolve under /demo/ and 404 — that's a benign example artifact, NOT a
  // snippet bug. Fail only on real JS errors + CDN-lib / snippet-file load failures.
  const isExampleAsset = (u) => u.startsWith(base + '/demo/') && !/\/demo\/(index\.html|_app\.|_previews\.)/.test(u);
  page.on('console', (m) => { if (m.type() === 'error') { const t = m.text(); if (!/Failed to load resource/i.test(t) && !BENIGN.some((re) => re.test(t))) consoleErrs.push(t); } });
  page.on('pageerror', (e) => pageErrs.push(String(e)));
  page.on('requestfailed', (r) => { const u = r.url(); if (!isExampleAsset(u) && !BENIGN.some((re) => re.test(u))) failed.push(`${u} :: ${r.failure()?.errorText}`); });
  page.on('response', (r) => { const u = r.url(); if (r.status() >= 400 && !isExampleAsset(u) && !BENIGN.some((re) => re.test(u))) badResp.push(`${r.status()} ${u}`); });

  if (NET !== 'off') {
    await ctx.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith(base) || ALLOW.some((re) => re.test(u))) return route.continue();
      return route.abort();
    });
  }

  const r = { base: fam.base, render: false, console: false, canvas: null, errors: [], variance: null, colors: null, knownIssue: fam.knownIssue || null };
  try {
    await page.goto(`${base}/demo/index.html#/${fam.rep.path}`, { waitUntil: 'load', timeout: 30000 });
    const settle = fam.cdnAsset ? 600 : (fam.rep.path.startsWith('3d/') || fam.rep.path.startsWith('shaders/')) ? 400 : 250;
    const res = await page.evaluate(ASSESS, { settle });
    r.render = res.previewOk;
    // CDN-asset families: the sample .lottie/.riv 404 is expected (graceful no-op),
    // so drop the asset requestfailed/404 from the error set for these.
    let errs = [...consoleErrs, ...pageErrs.map((e) => 'pageerror: ' + e), ...failed.map((f) => 'requestfailed: ' + f), ...badResp.map((b) => 'http ' + b)];
    if (fam.cdnAsset) errs = errs.filter((e) => !/\.(lottie|riv)\b/i.test(e));
    r.console = errs.length === 0;
    r.errors = errs.slice(0, 6);
    // canvas-drew: only when canvases exist AND we can expect pixels — skip for
    // (silent) mic visualizers, CDN players whose sample .lottie/.riv 404s, and
    // interactive surfaces (paint/whiteboard) that are blank until the user draws.
    // The canvas is correctly created but has nothing to draw; r.canvas stays null
    // ("not asserted"); those families still must pass render + zero-error.
    if (res.hasCanvas && !fam.isMic && !fam.cdnAsset && !fam.interactive) {
      const bad = res.canvases.filter((c) => !c.drew);
      r.canvas = bad.length === 0;
      const worst = res.canvases.reduce((a, c) => (c.variance != null && (a == null || c.variance < a.variance) ? c : a), null);
      if (worst) { r.variance = worst.variance; r.colors = worst.colors; }
    }
  } catch (e) {
    r.errors.push('harness: ' + (e.message || e).slice(0, 200));
  } finally { await ctx.close(); }
  return r;
}

// single source of truth for "this family passed": preview rendered, no console/
// page errors, and (where asserted) the canvas drew. knownIssue families can still
// fail this — they're filtered out of the gate separately, never silently passed.
function passed(r) { return r.render && r.console && (r.canvas == null || r.canvas); }

async function withRetry(browser, base, fam) {
  let r = await testFamily(browser, base, fam);
  if (!passed(r)) { const r2 = await testFamily(browser, base, fam); r2.retried = true; return r2; }
  return r;
}

async function main() {
  const { server, base } = await startServer();
  const list = await buildWorklist();
  const SOFTWARE_GL = ['--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader'];
  const ARGS = ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb', '--autoplay-policy=no-user-gesture-required', '--mute-audio', ...(SOFTWARE ? SOFTWARE_GL : [])];
  // Launch strategies, in order: explicit HARNESS_CHROME path (CI sets this from
  // the installed Chrome) → system Chrome via channel → the default macOS path.
  // playwright-core ships no browser, so one of these must resolve a real Chrome.
  const strategies = [
    process.env.HARNESS_CHROME && { executablePath: process.env.HARNESS_CHROME, headless: true, args: ARGS },
    { channel: 'chrome', headless: true, args: ARGS },
    { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ARGS },
  ].filter(Boolean);
  let browser, lastErr;
  for (const opts of strategies) {
    try { browser = await chromium.launch(opts); break; } catch (e) { lastErr = e; }
  }
  if (!browser) { console.error('Could not launch Chrome (set HARNESS_CHROME, or install Google Chrome). Last error: ' + (lastErr && lastErr.message)); process.exit(2); }

  // log the resolved WebGL renderer once (diagnosability)
  try { const p = await browser.newPage(); const gl = await p.evaluate(() => { const c = document.createElement('canvas'); const g = c.getContext('webgl'); const d = g && g.getExtension('WEBGL_debug_renderer_info'); return g && d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'no-webgl'; }); await p.close(); log(`GL: ${gl}`); } catch (e) {}

  log(`frontendmaxxing render-smoke — ${list.length} families · GL: ${SOFTWARE ? 'SwiftShader' : 'hardware'} · net: ${NET}\n`);
  const results = [];
  for (let i = 0; i < list.length; i += CONCURRENCY) {
    const batch = list.slice(i, i + CONCURRENCY);
    const rs = await Promise.all(batch.map((f) => withRetry(browser, base, f)));
    rs.forEach((r) => { results.push(r); if (!JSON_OUT) process.stdout.write(passed(r) ? '·' : (r.knownIssue ? '~' : 'X')); });
  }
  if (!JSON_OUT) process.stdout.write('\n\n');
  await browser.close(); server.close();

  // A family is "not passing" if it failed any active assertion. Split those into
  // real failures (gate the exit code) and documented known-issues (reported only).
  const notPassing = results.filter((r) => !passed(r));
  const knownFails = notPassing.filter((r) => r.knownIssue);
  const fails = notPassing.filter((r) => !r.knownIssue);
  const nCanvas = results.filter((r) => r.canvas != null).length;
  if (JSON_OUT) {
    console.log(JSON.stringify({ total: results.length, gl: SOFTWARE ? 'swiftshader' : 'hardware', net: NET, pass: results.length - notPassing.length, fail: fails.length, knownIssues: knownFails.length, results }, null, 2));
  } else {
    log(`  render        ${results.filter((r) => r.render).length} / ${results.length}`);
    log(`  console-clean ${results.filter((r) => r.console).length} / ${results.length}`);
    log(`  canvas-drew   ${results.filter((r) => r.canvas).length} / ${nCanvas}`);
    if (fails.length) {
      log('\nFAILURES');
      for (const f of fails) {
        const why = !f.render ? 'preview empty' : !f.console ? f.errors[0] : `canvas blank (variance ${f.variance}, colors ${f.colors})`;
        log(`  X ${f.base.padEnd(34)} ${why}${f.retried ? '  [retried]' : ''}`);
      }
    }
    if (knownFails.length) {
      log('\nKNOWN ISSUES (tracked, not gated)');
      for (const f of knownFails) log(`  ~ ${f.base.padEnd(34)} ${f.knownIssue}`);
    }
    log(fails.length
      ? `\nFAIL: ${fails.length} / ${results.length} families failed${knownFails.length ? ` (+${knownFails.length} known-issue)` : ''}.`
      : `\nOK: all ${results.length} families render clean${knownFails.length ? ` (${knownFails.length} known-issue tracked separately)` : ''}.`);
  }
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(2); });
