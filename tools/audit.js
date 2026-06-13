#!/usr/bin/env node
/* ============================================
   AUDIT — Repo health & convention verifier for frontendmaxxing
   ============================================
   Zero-dep Node (fs + path only). Verifies the invariants the README
   claims ("every claim verified") and surfaces the quality worklist.

   Usage:
     node tools/audit.js              # full report, exit 1 on hard failures
     node tools/audit.js --strict     # also fail on a11y/convention warnings
     node tools/audit.js --json       # machine-readable report to stdout
     node tools/audit.js --list KEY   # print the file list for one finding
                                       # KEYS: reduced-motion focus-removed
                                       #       no-header weak-preview index-missing
                                       #       global-mismatch broken-pointer
                                       #       hardcoded-hex unblessed-duration
                                       #       px-radius slop-hover

   Hard invariants (always fail CI):
     - every snippet file has an INDEX.md entry
     - every path referenced in INDEX.md maps to a real file
     - every JS file's `global: Name` in INDEX matches `root.Name =` in code

   Soft warnings (fail only with --strict):
     - animated CSS missing prefers-reduced-motion
     - missing standard header banner
     - JS/CSS not registered with a custom demo preview
     - taste-cohesion tells in components/blocks/effects/taste CSS:
       hex outside --var defs · transition/animation duration outside the
       blessed set (90/120/140/160/200/260/320/480ms) · border-radius:Npx
       literals · :hover scale(1.0x) slop (use translateY lift + elevation)
   ============================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
// Auto-discover every snippet folder (any top-level dir that isn't tooling/demo),
// so the index-completeness invariant covers new folders automatically — nothing
// can be added without being indexed + discoverable.
var NON_SNIPPET = { 'demo': 1, 'mcp-server': 1, 'tools': 1, 'claude-skills': 1, 'node_modules': 1, 'templates': 1 };
var SNIPPET_DIRS = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(function (d) { return d.isDirectory() && !d.name.startsWith('.') && !NON_SNIPPET[d.name]; })
  .map(function (d) { return d.name; })
  .sort();

// ---------- helpers ----------
function walk(dir) {
  var out = [];
  var abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  (function rec(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach(function (ent) {
      var p = path.join(d, ent.name);
      if (ent.isDirectory()) rec(p);
      else if (/\.(css|js)$/.test(ent.name)) out.push(path.relative(ROOT, p));
    });
  })(abs);
  return out;
}
function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function norm(p) { return p.replace(/\\/g, '/'); }

// ---------- gather ----------
var files = [];
SNIPPET_DIRS.forEach(function (d) { files = files.concat(walk(d)); });
files = files.map(norm).sort();

var indexSrc = fs.existsSync(path.join(ROOT, 'INDEX.md')) ? read('INDEX.md') : '';
var indexNorm = indexSrc.replace(/\\/g, '/');
var previewsSrc = fs.existsSync(path.join(ROOT, 'demo/_previews.js')) ? read('demo/_previews.js') : '';

// Build a map of INDEX-declared globals:  path -> GlobalName
// Lines look like: **file.js** `folder/file.js` (JS, global: `Name`) — tags: …
var declaredGlobals = {};
indexNorm.split('\n').forEach(function (line) {
  var m = line.match(/`([^`]+\.js)`[^\n]*global:\s*`([^`]+)`/);
  if (m) declaredGlobals[m[1]] = m[2];
});

// Every backticked path referenced in INDEX (for broken-pointer check)
var indexPaths = {};
var pm; var re = /`([0-9a-z\-]+\/[0-9a-z\-]+\.(?:css|js))`/gi;
while ((pm = re.exec(indexNorm))) indexPaths[pm[1]] = true;

// ---------- findings ----------
var F = {
  'index-missing': [],     // snippet file with no INDEX entry        (HARD)
  'broken-pointer': [],    // INDEX path with no file on disk          (HARD)
  'global-mismatch': [],   // INDEX global != root.X in code           (HARD)
  'reduced-motion': [],    // animated CSS, no prefers-reduced-motion  (soft)
  'focus-removed': [],     // kills outline on interactive el, no :focus-visible (soft)
  'no-header': [],         // missing banner header                    (soft)
  'weak-preview': [],      // demo renders nothing meaningful for it   (soft)
  'hardcoded-hex': [],     // hex color outside a --var definition     (soft, cohesion)
  'unblessed-duration': [],// transition/animation ms outside blessed  (soft, cohesion)
  'px-radius': [],         // border-radius:Npx literal                (soft, cohesion)
  'slop-hover': []         // :hover { transform: scale(1.0x) } tell   (soft, cohesion)
};

// ---------- taste-cohesion checks (soft) ----------
// NOTE: intentionally duplicated in mcp-server/server.js (BLESSED_MS +
// checkCoherence, ESM) — keep the two in sync; no cross-module import.
// Scanned folders only: the page-facing packs where cohesion matters most.
var COHESION_DIRS = { components: 1, blocks: 1, effects: 1, taste: 1 };
var BLESSED_MS = [90, 120, 140, 160, 200, 260, 320, 480];
function cohesionScan(rel, src) {
  // strip comments, drop custom-property definition lines (--x: #hex is the
  // theming hook — allowed), drop var(--x, fallback) groups
  var css = src.replace(/\/\*[\s\S]*?\*\//g, '');
  var scrub = css.split('\n').filter(function (l) { return !/^\s*--[\w-]+\s*:/.test(l); }).join('\n')
    .replace(/var\([^)]*\)/g, ' ');

  var hex = scrub.match(/#[0-9a-fA-F]{3,8}\b/g);
  if (hex) F['hardcoded-hex'].push(rel + '  (' + hex.length + ')');

  var durRe = /(?:transition|animation)(?:-duration|-delay)?\s*:\s*([^;{}]+)/gi;
  var dm; var badDur = 0;
  while ((dm = durRe.exec(scrub))) {
    (dm[1].match(/\b\d*\.?\d+m?s\b/g) || []).forEach(function (tok) {
      var ms = /ms$/.test(tok) ? parseFloat(tok) : parseFloat(tok) * 1000;
      if (!isFinite(ms) || ms <= 1) return; // reduced-motion 0.01ms etc.
      if (BLESSED_MS.indexOf(ms) === -1) badDur++;
    });
  }
  if (badDur) F['unblessed-duration'].push(rel + '  (' + badDur + ')');

  var rad = scrub.match(/border-radius\s*:\s*\d+px/gi);
  if (rad) F['px-radius'].push(rel + '  (' + rad.length + ')');

  var slop = scrub.match(/:hover[^{}]*\{[^{}]*scale\(\s*1\.(?:0[1-9]|1\d?)\d*\s*\)[^{}]*\}/g);
  if (slop) F['slop-hover'].push(rel + '  (' + slop.length + ')');
}

// Does a header's Usage block contain renderable HTML? (mirrors the demo's
// extractUsageBlock + extractHtmlBlock heuristics, conservatively.)
function usageHasHtml(src) {
  var L = src.split('\n');
  var s = -1;
  for (var i = 0; i < Math.min(L.length, 200); i++) {
    if (/^\s*(?:\*\s+)?Usage(?:\s*\([^)]*\))?\s*:/i.test(L[i])) { s = i + 1; break; }
  }
  if (s < 0) return false;
  for (var j = s; j < L.length; j++) {
    var l = L[j];
    if (/^\s*\*\/\s*$/.test(l) || /^\s*={5,}/.test(l)) break;
    if (/^\s*(?:\*\s+)?(?:Variants|Modifiers|Methods|States)\s*:/i.test(l)) break;
    if (/^\s*(?:\*\s+)?<[a-zA-Z!]/.test(l)) return true;
  }
  return false;
}
function jsRunnable(src) {            // GLOBAL.init('.sel') style usage the demo can execute
  return /Usage[\s\S]{0,500}?[A-Z][A-Za-z0-9]+\.(?:init|create|bind|attach|reveal)\s*\(/.test(src);
}
// CSS with `.prefix-variant` style classes the demo can tile as a fallback.
function hasVariantTiles(src) {
  var m = src.match(/^\.[a-z][a-z0-9]*-[a-z][a-z0-9-]*\s*[\{,]/gm);
  return !!m && m.length >= 3;
}

var previewMeta = {};            // base -> { inPrev, html, jsRun, tiles }
files.forEach(function (rel) {
  var src = read(rel);
  // INDEX presence
  if (indexNorm.indexOf(rel) === -1) F['index-missing'].push(rel);
  // header banner
  if (src.split('\n')[0].indexOf('====') === -1) F['no-header'].push(rel);
  // accumulate per-family preview signals
  var base = rel.replace(/\.(css|js)$/, '');
  var pm = previewMeta[base] || (previewMeta[base] = { inPrev: false, html: false, jsRun: false, tiles: false });
  if (previewsSrc.indexOf(rel) !== -1) pm.inPrev = true;
  if (usageHasHtml(src)) pm.html = true;
  if (rel.endsWith('.js') && jsRunnable(src)) pm.jsRun = true;
  if (rel.endsWith('.css') && hasVariantTiles(src)) pm.tiles = true;

  if (rel.endsWith('.css')) {
    if (COHESION_DIRS[rel.split('/')[0]]) cohesionScan(rel, src);
    var animated = /(^|\s)animation\s*:|@keyframes|(^|\s)transition\s*:/.test(src);
    if (animated && src.indexOf('prefers-reduced-motion') === -1) F['reduced-motion'].push(rel);
    // a11y bug: removes the focus outline on an interactive element but offers
    // no :focus-visible replacement — keyboard users lose the focus indicator.
    var killsOutline = /outline\s*:\s*(none|0)\b/.test(src);
    var interactive = /cursor\s*:\s*pointer|button|input|<a|role=|tabindex|:focus|:hover/.test(src);
    if (killsOutline && interactive && src.indexOf('focus-visible') === -1) F['focus-removed'].push(rel);
  } else {
    // JS global vs export. The IIFE root param varies across vintages
    // (`root`, `global`, …) so detect the param name, then accept any of:
    //   <param>.Name =   |   <known-root>.Name =   |   module.exports = Name
    var declared = declaredGlobals[rel];
    if (declared) {
      var esc = declared.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var paramM = src.match(/\(function\s*\(\s*([A-Za-z_$][\w$]*)\s*\)/);
      var roots = ['root', 'global', 'self', 'window', 'globalThis'];
      if (paramM && roots.indexOf(paramM[1]) === -1) roots.push(paramM[1]);
      var assign = new RegExp('(?:' + roots.join('|') + ')\\.' + esc + '\\s*=');
      var cjs = new RegExp('module\\.exports\\s*=\\s*' + esc + '\\b');
      if (!assign.test(src) && !cjs.test(src)) {
        F['global-mismatch'].push(rel + '  (INDEX says ' + declared + ')');
      }
    }
  }
});

// broken pointers
Object.keys(indexPaths).forEach(function (p) {
  if (!fs.existsSync(path.join(ROOT, p))) F['broken-pointer'].push(p);
});

// weak previews: a family the demo can't render via custom preview, Usage HTML,
// runnable JS, or CSS variant tiles — these are the real demo gaps.
files.forEach(function (rel) {
  var pm = previewMeta[rel.replace(/\.(css|js)$/, '')];
  if (pm && !pm.inPrev && !pm.html && !pm.jsRun && !pm.tiles) F['weak-preview'].push(rel);
});

// ---------- output ----------
var args = process.argv.slice(2);
if (args[0] === '--list') {
  var key = args[1];
  (F[key] || []).forEach(function (x) { console.log(x); });
  process.exit(0);
}
if (args.indexOf('--json') !== -1) {
  console.log(JSON.stringify({ total: files.length, findings: F }, null, 2));
  process.exit(0);
}

var HARD = ['index-missing', 'broken-pointer', 'global-mismatch'];
var SOFT = ['reduced-motion', 'focus-removed', 'no-header', 'weak-preview',
            'hardcoded-hex', 'unblessed-duration', 'px-radius', 'slop-hover'];
var hardCount = HARD.reduce(function (n, k) { return n + F[k].length; }, 0);

function bar(label, n, denom) {
  var pad = (label + '                     ').slice(0, 22);
  var pct = denom ? '  (' + Math.round((n / denom) * 100) + '%)' : '';
  return pad + n + (denom ? ' / ' + denom : '') + pct;
}

console.log('\nfrontendmaxxing audit — ' + files.length + ' snippet files\n');
console.log('HARD INVARIANTS (fail CI):');
HARD.forEach(function (k) {
  var n = F[k].length;
  console.log('  ' + (n === 0 ? '✓ ' : '✗ ') + bar(k, n));
  if (n && n <= 8) F[k].forEach(function (x) { console.log('       · ' + x); });
});
console.log('\nQUALITY WORKLIST (warnings):');
SOFT.forEach(function (k) {
  console.log('  • ' + bar(k, F[k].length, files.length));
});
console.log('\n  (use --list <key> to dump any list, --json for full report)\n');

var strict = args.indexOf('--strict') !== -1;
var softCount = SOFT.reduce(function (n, k) { return n + F[k].length; }, 0);
if (hardCount > 0) { console.error('FAIL: ' + hardCount + ' hard invariant violation(s).'); process.exit(1); }
if (strict && softCount > 0) { console.error('FAIL (--strict): ' + softCount + ' warning(s).'); process.exit(1); }
console.log('OK: all hard invariants pass.\n');
