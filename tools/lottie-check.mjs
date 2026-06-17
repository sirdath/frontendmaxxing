#!/usr/bin/env node
/* ============================================
   lottie-check.mjs — validate + preview Lottie JSON (give the agent EYES)
   ============================================
   LLM-authored Lottie often parses fine but renders NOTHING (empty shape layers,
   off-canvas, zero opacity/scale). This renders each file headless via lottie-web,
   samples frames, and returns a hard verdict per file:

     OK       — draws real geometry AND it changes across frames (animates)
     STATIC   — draws, but identical across frames (no motion)
     BLANK    — parses but renders nothing visible  ← the silent-failure case
     INVALID  — not valid Bodymovin (missing v/fr/ip/op/w/h/layers or no layers)

   It also writes a grid PREVIEW png (mid-animation) so you can judge if it's
   actually beautiful. Same Bodymovin JSON plays in lottie-web AND Flutter's
   `lottie` package, so a green check here == it works in your Flutter app.

   Usage:
     node tools/lottie-check.mjs <a.json> [b.json …] [--out preview.png] [--json]
     node tools/lottie-check.mjs "/path/CRIT/assets/lottie/"*.json
   ============================================ */
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const outIx = argv.indexOf('--out');
const OUT = outIx !== -1 ? argv[outIx + 1] : '/tmp/lottie-check.png';
const files = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--out');
if (!files.length) { console.error('usage: node tools/lottie-check.mjs <a.json> [b.json…] [--out preview.png] [--json]'); process.exit(2); }

const items = files.map((f) => {
  let data = null, err = null;
  try { data = JSON.parse(readFileSync(f, 'utf8')); } catch (e) { err = e.message; }
  return { name: basename(f).replace(/\.json$/, ''), file: f, data, err };
});

function structValid(d) {
  if (!d) return { ok: false, why: 'parse error' };
  const miss = ['v', 'fr', 'ip', 'op', 'w', 'h', 'layers'].filter((k) => d[k] == null);
  if (miss.length) return { ok: false, why: 'missing ' + miss.join(',') };
  if (!Array.isArray(d.layers) || !d.layers.length) return { ok: false, why: 'no layers' };
  return { ok: true, layers: d.layers.length, frames: `${d.ip}-${d.op}@${d.fr}fps`, size: `${d.w}x${d.h}` };
}

const cols = Math.min(items.length, 4);
const harness = `<!doctype html><html><head><meta charset="utf8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
<style>body{margin:0;background:#0a0a0e}#g{display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px;padding:14px}
.c{background:radial-gradient(circle at 50% 45%,#15151b,#000);border:1px solid #222;border-radius:12px;aspect-ratio:1;position:relative}
.l{position:absolute;bottom:6px;left:0;right:0;text-align:center;color:#a1a1aa;font:11px -apple-system,sans-serif;letter-spacing:.4px}</style></head>
<body><div id="g"></div><script>
const DATA=${JSON.stringify(items.map((i) => ({ name: i.name, data: i.data || null })))};
const g=document.getElementById('g'); window.__a=[];
DATA.forEach(d=>{const c=document.createElement('div');c.className='c';const a=document.createElement('div');a.style.cssText='position:absolute;inset:0';const l=document.createElement('div');l.className='l';l.textContent=d.name;c.append(a,l);g.append(c);
 if(d.data){try{window.__a.push(lottie.loadAnimation({container:a,renderer:'svg',loop:false,autoplay:false,animationData:d.data}));}catch(e){window.__a.push(null);}}else window.__a.push(null);});
window.__seek=f=>window.__a.forEach(a=>{if(a){try{a.goToAndStop(Math.round((a.totalFrames||60)*f),true);}catch(e){}}});
window.__m=()=>[...document.querySelectorAll('.c')].map(c=>{const s=c.querySelector('svg');let n=0,ar=0;if(s){n=s.querySelectorAll('path,rect,circle,ellipse,stop,image,polygon').length;try{const r=s.getBBox();ar=Math.round(r.width*r.height);}catch(e){}}return{n,ar};});
</script></body></html>`;

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox', '--force-color-profile=srgb'] }).catch(async () =>
  chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] }));
const page = await browser.newPage({ viewport: { width: 1080, height: Math.ceil(items.length / cols) * 270 + 40 } });
const cerr = [];
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/i.test(m.text())) cerr.push(m.text().slice(0, 140)); });
page.on('pageerror', (e) => cerr.push('pageerror: ' + String(e).slice(0, 140)));
await page.setContent(harness, { waitUntil: 'load' });
await page.waitForTimeout(700);
// dense, early-weighted sampling — a burst may only be visible for a few frames;
// sampling only late would false-flag a brief animation as BLANK.
const FRACS = [0.02, 0.06, 0.12, 0.22, 0.35, 0.5, 0.68, 0.85];
const samples = [];
for (const f of FRACS) { await page.evaluate((fr) => window.__seek(fr), f); await page.waitForTimeout(110); samples.push(await page.evaluate(() => window.__m())); }
// preview at the early-bloom frame (bursts peak ~15-20% in; lottie keeps DOM
// elements even at opacity 0, so "peak node count" can't find the visible peak).
const previewFrac = outIx !== -1 && argv.includes('--at') ? +argv[argv.indexOf('--at') + 1] : 0.18;
await page.evaluate((fr) => window.__seek(fr), previewFrac); await page.waitForTimeout(160);
await page.screenshot({ path: OUT });
await browser.close();

const results = items.map((it, i) => {
  const sv = structValid(it.data);
  const peakNodes = Math.max(...samples.map((s) => s[i].n));
  const peakArea = Math.max(...samples.map((s) => s[i].ar));
  const varies = new Set(samples.map((s) => s[i].n + ':' + s[i].ar)).size > 1;
  const draws = peakNodes > 2 && peakArea > 50;
  const verdict = !sv.ok ? 'INVALID' : !draws ? 'BLANK' : !varies ? 'STATIC' : 'OK';
  return { name: it.name, file: it.file, verdict, why: sv.why, peakNodes, peakArea, ...(sv.ok ? { layers: sv.layers, frames: sv.frames, size: sv.size } : {}) };
});

if (JSON_OUT) {
  console.log(JSON.stringify({ preview: OUT, consoleErrors: cerr, results }, null, 2));
} else {
  console.log(`LOTTIE CHECK · ${items.length} file(s)\n`);
  for (const r of results) {
    const mark = r.verdict === 'OK' ? '✓' : '✗';
    const detail = r.verdict === 'INVALID' ? `(${r.why})`
      : r.verdict === 'BLANK' ? 'renders nothing — empty/off-canvas/zero-opacity layers'
      : r.verdict === 'STATIC' ? 'draws but no motion across frames'
      : `${r.layers}L ${r.frames} ${r.size} · nodes ${r.peakNodes}`;
    console.log(`  ${mark} ${r.name.padEnd(24)} ${r.verdict.padEnd(8)} ${detail}`);
  }
  const bad = results.filter((r) => r.verdict !== 'OK').length;
  console.log(`\n${results.length - bad}/${results.length} OK · preview → ${OUT}`);
}
process.exit(results.some((r) => r.verdict !== 'OK') ? 1 : 0);
