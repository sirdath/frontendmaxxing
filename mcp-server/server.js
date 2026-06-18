#!/usr/bin/env node
/* ============================================
   frontendmaxxing MCP server  (v2)
   ============================================
   Exposes the frontendmaxxing snippet vault to MCP-compatible AI agents
   (Claude Desktop, Cursor, Claude Code, …).

   What's new in v2:
     - BM25 search with synonym expansion + fuzzy/plural/typo tolerance
     - Companion-aware bundling: get_snippet returns the CSS+JS pair, usage,
       variants and the live-demo link as one paste-ready unit
     - get_related: companion + tag-similar neighbours
     - All skill docs exposed (get_skill / list_skills), not just gradients
     - Structured tool output (outputSchema + structuredContent) for typed,
       reliable consumption by agents
     - Read-only tool annotations + a scaffold-page prompt
     - A source/{path} resource template for pulling any file as a resource

   Tools:
     overview · list_categories · list_components · search_components · recommend
     get_snippet · get_source · get_examples · get_related
     list_docs · get_doc · list_skills · get_skill · get_agents_doc
     list_palettes · get_palette · design_system · apply_design_md
     list_taste_presets · get_taste_preset · compose_page · coherence_check
   Resources:
     frontendmaxxing://index · ://agents · ://doc/{name} · ://palette/{name} · ://source/{path}
   Prompts:
     scaffold-page
   ============================================ */

// NOTE: the MCP SDK + zod are imported DYNAMICALLY inside main() (below), not
// statically here — so the exported pure helpers (parseIndex, composePage,
// checkCoherence, parsePalettes, …) can be imported by other tools (e.g. the
// Design Book server) with ZERO node_modules installed. The deps are only
// needed to actually *run* the MCP server.
import { readFile, access, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve, basename, extname } from 'node:path';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// =====================================================
// Locate the library root
// =====================================================
async function resolveLibraryRoot() {
  if (process.env.FRONTENDMAXXING_PATH) return resolve(process.env.FRONTENDMAXXING_PATH);
  const parentDir = resolve(__dirname, '..');
  try { await access(join(parentDir, 'INDEX.md')); return parentDir; } catch {}
  try { await access(join(__dirname, 'INDEX.md')); return __dirname; } catch {}
  try { await access(join(process.cwd(), 'INDEX.md')); return process.cwd(); } catch {}
  throw new Error('Could not locate frontendmaxxing library. Set FRONTENDMAXXING_PATH env var to the library root.');
}

// =====================================================
// INDEX.md parser
// =====================================================
const ENTRY_RE = /^\*\*([\w\-.]+\.(?:css|js|glsl\.js))\*\*\s+`([^`]+)`\s+\((CSS|JS)([^)]*)\)\s*[—-]\s*tags:\s*(.+)$/;

export function parseIndex(text) {
  const entries = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(ENTRY_RE);
    if (!m) continue;
    const [, file, rawPath, kind, meta, tags] = m;
    const path = rawPath.replace(/\\/g, '/');
    const folder = path.split('/')[0];
    const desc = (lines[i + 1] || '').trim();
    const globals = Array.from(meta.matchAll(/`([^`]+)`/g)).map((g) => g[1]);
    const base = path.replace(/\.(css|js)$/, '').replace(/\.glsl$/, '');
    entries.push({
      file, path, folder, kind,
      global: globals[0] || null,
      globals,
      tags: tags.split(/\s+/).filter(Boolean),
      tagsText: tags.trim(),
      desc,
      base,                         // folder/name without extension — for companion pairing
      key: folder + '/' + file
    });
  }
  return entries;
}

export const FOLDER_DESCRIPTIONS = {
  '3d': 'Three.js scenes (requires THREE via CDN)',
  'ai': 'AI-native UI primitives — streaming text, tool calls, citations, voice input, etc.',
  'animations': 'Keyframes, springs, stagger, AOS-style scroll triggers',
  'backgrounds': 'Aurora, mesh gradients, orbs, world map, sky presets, particles',
  'blocks': 'Buttons, loaders, toasts, tooltips, badges, inputs, sliders',
  'borders': 'Animated/gradient borders',
  'colors': '50 vetted theme presets (palettes) + raw hue/neutral ramps (scales) — see color.skill.md',
  'components': 'Full UI components — heroes, navbars, cards, modals, kanban, calendar, infinite canvas',
  'data-viz': 'Charts (bar, line, pie, area, radar, funnel, sankey, treemap, network), sparklines, count-up',
  'effects': 'Gradients, glitch, parallax, cursors, holo, fire/smoke/water, caustics, watercolor',
  'feedback': 'Confetti, sparkles, success/error states, achievements, streak, score',
  'interactions': 'Sortable, swipe, pinch-zoom, gravity physics, elastic line',
  'layout': 'Grids, masonry, container queries, sticky, aspect ratios',
  'media': 'Image compare, video player, audio waveform with regions, lightbox',
  'micro': 'Tiny micro-interactions (toggle, like, copy, counter)',
  'mobile': 'iPhone-frame chrome (ios-*) + full mobile-app screens (app-*) as Flutter/RN visual specs',
  'responsive': 'Breakpoints, dark mode, mobile patterns, skip-link',
  'scroll': 'Pin, scrub, snap, horizontal-pin, text-reveal',
  'shaders': 'Pure-WebGL fullscreen-quad shaders — voronoi, mesh, godrays, plasma, fluid',
  'structure': 'Page-architecture backbone + section transitions + full genre demo pages — see structure.skill.md',
  'svg': 'SVG animations, gradient definitions',
  'taste': 'Taste/composition layer — token-layer presets (data-aesthetic/density/motion/font-pair) that coordinate type+motion+spacing into one cohesive vibe; see taste.skill.md',
  'transitions': 'Page transitions: fade, curtain, morph, View Transitions API',
  'typography': 'Fluid type, variable fonts, gradient numbers, text effects',
  'utils': 'easing, lerp, dom helpers, performance, palette generator, gradient builder'
};

const DEMO_BASE = 'https://sirdath.github.io/frontendmaxxing/demo/';

// =====================================================
// Search — BM25 + synonym expansion + fuzzy matching
// =====================================================

// Vibe synonyms the tags may not already carry. Maps a query term to
// equivalent/adjacent terms so "ticker" finds marquee, "graph" finds charts…
export const SYNONYMS = {
  ticker: ['marquee', 'scroll'], marquee: ['ticker'],
  graph: ['chart', 'data-viz', 'plot'], chart: ['graph', 'data-viz'], plot: ['chart', 'graph'],
  carousel: ['slider', 'swiper'], slider: ['carousel', 'range'], swiper: ['carousel', 'slider'],
  dropdown: ['menu', 'select', 'combobox'], select: ['dropdown', 'combobox', 'picker'],
  loading: ['loader', 'spinner', 'skeleton', 'progress'], spinner: ['loader', 'loading'],
  skeleton: ['loader', 'placeholder', 'shimmer'],
  popup: ['modal', 'dialog', 'popover'], modal: ['dialog', 'popup', 'overlay'], dialog: ['modal', 'popup'],
  tooltip: ['popover', 'hint'], popover: ['tooltip', 'dropdown'],
  navbar: ['nav', 'header', 'navigation'], nav: ['navbar', 'navigation', 'menu'],
  hero: ['banner', 'landing', 'header'], cta: ['call-to-action', 'button'],
  accordion: ['collapse', 'faq', 'disclosure'], faq: ['accordion', 'questions'],
  avatar: ['profile', 'user'], badge: ['pill', 'tag', 'chip'], chip: ['tag', 'badge', 'pill'],
  toast: ['notification', 'snackbar', 'alert'], notification: ['toast', 'alert'],
  glow: ['shadow', 'neon', 'halo'], neon: ['glow', 'cyberpunk'],
  gradient: ['mesh', 'holo', 'aurora'], aurora: ['gradient', 'background', 'northern-lights'],
  particle: ['particles', 'confetti', 'dots'], confetti: ['celebration', 'particles', 'feedback'],
  typewriter: ['typing', 'streaming', 'text'], streaming: ['typewriter', 'stream', 'token'],
  chatbot: ['chat', 'ai', 'assistant', 'conversation'], chat: ['chatbot', 'message', 'conversation'],
  kanban: ['board', 'trello', 'columns'], calendar: ['datepicker', 'schedule', 'date'],
  table: ['grid', 'datagrid', 'spreadsheet'], grid: ['layout', 'table', 'bento'],
  parallax: ['scroll', 'depth', '3d'], tilt: ['3d', 'parallax', 'hover'],
  toggle: ['switch', 'checkbox'], switch: ['toggle'],
  upload: ['file', 'dropzone', 'drag-drop'], dropzone: ['upload', 'file'],
  rating: ['stars', 'review'], stars: ['rating'],
  timeline: ['steps', 'history', 'gantt'], stepper: ['steps', 'wizard', 'progress'],
  pricing: ['plans', 'tiers'], testimonial: ['review', 'quote'],
  cursor: ['pointer', 'mouse'], glitch: ['distortion', 'vhs', 'rgb-split'],
  shimmer: ['skeleton', 'sheen', 'loading'], marquee_: []
};

const STOP = new Set(['a', 'an', 'the', 'for', 'of', 'to', 'with', 'and', 'or', 'i', 'need', 'want', 'that', 'this', 'my', 'me', 'is', 'in', 'on', 'a11y']);

export function tokenize(s) {
  return (s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

// Field weights → term-frequency multipliers (filename matters most).
const FIELD_WEIGHTS = { file: 4, tag: 3, global: 2, folder: 2, desc: 1 };

function levenshtein1(a, b) {
  // returns true if edit distance between a and b is ≤ 1 (cheap early-outs)
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
  }
  return edits + (la - i) + (lb - j) <= 1;
}

// Build a reusable BM25 search index over the parsed entries.
export function buildSearchIndex(entries) {
  const k1 = 1.5, b = 0.75;
  const docs = entries.map((e) => {
    const tf = Object.create(null);
    const add = (text, w) => { for (const t of tokenize(text)) tf[t] = (tf[t] || 0) + w; };
    add(e.file.replace(/\.(css|js)$/, ''), FIELD_WEIGHTS.file);
    e.tags.forEach((t) => add(t, FIELD_WEIGHTS.tag));
    if (e.global) add(e.global, FIELD_WEIGHTS.global);
    add(e.folder, FIELD_WEIGHTS.folder);
    add(e.desc, FIELD_WEIGHTS.desc);
    let len = 0;
    for (const t in tf) len += tf[t];
    return { entry: e, tf, len };
  });
  const df = Object.create(null);
  const vocab = new Set();
  for (const d of docs) for (const t in d.tf) { df[t] = (df[t] || 0) + 1; vocab.add(t); }
  const N = docs.length || 1;
  const avgdl = docs.reduce((s, d) => s + d.len, 0) / N || 1;
  const idf = (t) => Math.log(1 + (N - (df[t] || 0) + 0.5) / ((df[t] || 0) + 0.5));

  // Expand a query term into [{term, weight}] — exact, synonym, fuzzy.
  function expandTerm(tok) {
    const out = [];
    if (df[tok]) out.push({ term: tok, weight: 1 });
    for (const syn of (SYNONYMS[tok] || [])) if (df[syn]) out.push({ term: syn, weight: 0.6 });
    if (!df[tok]) {
      // plural/singular first
      const singular = tok.replace(/(?:es|s)$/, '');
      if (singular !== tok && df[singular]) out.push({ term: singular, weight: 0.85 });
      else if (tok.length >= 4) {
        // forward prefix-completion ("gradien"→"gradient") or edit-distance-1
        // ("buttn"→"button"); among matches pick the most common real term.
        // We deliberately do NOT do tok.startsWith(v) — that grabs short stems.
        let best = null, bestDf = -1;
        for (const v of vocab) {
          const ok = (v.startsWith(tok) && v.length - tok.length <= 3) || levenshtein1(v, tok);
          if (ok && (df[v] || 0) > bestDf) { best = v; bestDf = df[v] || 0; }
        }
        if (best) out.push({ term: best, weight: 0.55 });
      }
    }
    return out;
  }

  function search(query, limit = 10) {
    const qTokens = tokenize(query).filter((t) => !STOP.has(t));
    if (!qTokens.length) return [];
    // dedupe expanded terms, keeping the highest weight
    const terms = new Map();
    for (const tok of qTokens) for (const { term, weight } of expandTerm(tok)) {
      if (!terms.has(term) || terms.get(term) < weight) terms.set(term, weight);
    }
    const exact = new Set(qTokens);
    const scored = docs.map((d) => {
      let score = 0;
      for (const [t, w] of terms) {
        const f = d.tf[t];
        if (!f) continue;
        const denom = f + k1 * (1 - b + b * (d.len / avgdl));
        score += w * idf(t) * (f * (k1 + 1)) / denom;
      }
      if (score === 0) return null;
      // small boosts: exact filename token / multi-term coverage
      const fileToks = new Set(tokenize(d.entry.file));
      for (const t of exact) if (fileToks.has(t)) score += 2.5;
      const covered = [...exact].filter((t) => d.tf[t]).length;
      score += covered * 0.4;
      return { entry: d.entry, score: +score.toFixed(3) };
    }).filter(Boolean);
    scored.sort((a, b2) => b2.score - a.score || a.entry.path.localeCompare(b2.entry.path));
    return scored.slice(0, limit);
  }

  return { search, df, vocab };
}

// =====================================================
// Companion / related resolution
// =====================================================
export function buildRelations(entries) {
  const byBase = new Map();
  for (const e of entries) {
    if (!byBase.has(e.base)) byBase.set(e.base, []);
    byBase.get(e.base).push(e);
  }
  function companions(entry) {
    return (byBase.get(entry.base) || []).filter((e) => e.path !== entry.path);
  }
  function related(entry, all, limit = 5) {
    const tagSet = new Set(entry.tags);
    return all
      .filter((e) => e.path !== entry.path && e.base !== entry.base && e.folder === entry.folder)
      .map((e) => ({ e, shared: e.tags.filter((t) => tagSet.has(t)).length }))
      .filter((x) => x.shared >= 2)
      .sort((a, b) => b.shared - a.shared)
      .slice(0, limit)
      .map((x) => x.e);
  }
  return { companions, related };
}

// =====================================================
// Color palettes — parse colors/palettes.css into structured theme data
// =====================================================
export function parsePalettes(css) {
  const groups = [];
  // Group headers look like:  /* ── FINANCE / BANKING ──────── */
  const gre = /\/\*\s*[^A-Za-z]*([A-Z][A-Z0-9 /]+?[A-Z0-9])\s*[^A-Za-z]*\*\//g;
  let gm;
  while ((gm = gre.exec(css))) groups.push({ index: gm.index, name: gm[1].trim() });
  const groupAt = (idx) => { let g = ''; for (const x of groups) { if (x.index < idx) g = x.name; else break; } return g; };

  const out = [];
  const pre = /\.pal-([a-z0-9-]+)\s*\{([^}]*)\}/g;
  let m;
  while ((m = pre.exec(css))) {
    const name = m[1], body = m[2];
    const mode = /\(light\)/.test(body) ? 'light' : 'dark';
    const tokens = {};
    const tre = /--([a-z0-9-]+)\s*:\s*([^;]+);/g;
    let t;
    while ((t = tre.exec(body))) tokens[t[1]] = t[2].trim();
    out.push({ name, mode, group: groupAt(m.index), accent: tokens.accent || null, bg: tokens.bg || null, tokens });
  }
  return out;
}

// =====================================================
// Doc registry — classify any markdown file in the repo
// =====================================================
export function classifyDoc(relPath) {
  const p = relPath.replace(/\\/g, '/');
  if (p.startsWith('claude-skills/')) return { kind: 'package', name: p.replace(/\.md$/, '') };
  if (p.startsWith('templates/')) return { kind: 'guide', name: p.replace(/\.md$/, '') }; // prebuilt-template docs
  if (p.includes('/')) return null;                 // ignore nested non-package md (mcp-server, .github…)
  if (/\.skill\.md$/.test(p)) return { kind: 'skill', name: p.replace(/\.skill\.md$/, '') };
  const base = p.replace(/\.md$/, '');
  if (base === 'INDEX') return null;                // the snippet index is served via tools/resources
  if (['AGENTS', 'CONTRIBUTING', 'README'].includes(base)) return { kind: 'meta', name: base };
  return { kind: 'guide', name: base };
}

// Pull a one-line title/description from a doc's head (frontmatter or first heading).
export function docTitle(head, fallback) {
  const fm = head.match(/^---\s*[\s\S]*?\bdescription:\s*(.+)$/m);
  if (fm) return fm[1].trim().slice(0, 200);
  const nm = head.match(/^---\s*[\s\S]*?\bname:\s*(.+)$/m);
  if (nm && /^---/.test(head)) return nm[1].trim().slice(0, 200);
  const h = head.match(/^#\s+(.+)$/m);
  if (h) return h[1].trim().slice(0, 200);
  return fallback;
}

// =====================================================
// Formatting helpers
// =====================================================
function demoUrl(entry) { return DEMO_BASE + '#' + encodeURIComponent(entry.path); }

function snippetSummary(e, score) {
  return {
    file: e.file, path: e.path, kind: e.kind, folder: e.folder,
    global: e.global, tags: e.tags.slice(0, 12), description: e.desc,
    demoUrl: demoUrl(e),
    ...(score != null ? { score } : {})
  };
}

function extractBlock(source, label) {
  // Pull "Label:" … up to the next labelled line or the closing banner.
  const lines = source.split('\n');
  const start = lines.findIndex((l) => new RegExp('^\\s*' + label + '\\s*:', 'i').test(l));
  if (start === -1) return null;
  const out = [];
  const stops = /^\s*(Variants|Modifiers|Methods|States|Usage|Inspired by)\s*:/i;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*=={5,}/.test(line) || /^\s*\*\//.test(line)) break;
    if (i > start && stops.test(line)) break;
    out.push(line.replace(/^\s{0,6}/, '').replace(/^\*\s?/, '').replace(/^\/\*\s?/, ''));
  }
  return out.join('\n').trim() || null;
}

// Generate an agent-ready DESIGN.md from a parsed palette (refero.design pattern,
// realised with frontendmaxxing palettes + snippets). Pure — takes one palette.
export function buildDesignMd(p) {
  const t = p.tokens || {};
  const g = (k, d) => t[k] || d;
  const heroBg = p.mode === 'dark'
    ? '`backgrounds/interactive-canvas.css` (network/aurora) or `aurora-bg.css`'
    : '`backgrounds/aurora-bg.css` (light) or `patterns-mega.css`';
  return [
    `# DESIGN.md — ${p.name} (${(p.group || '').toLowerCase()}, ${p.mode})`,
    `> Generated by frontendmaxxing from \`pal-${p.name}\`. Apply with \`<body class="struct pal-${p.name}">\`.`,
    '',
    '## Color',
    '```',
    `bg ${g('bg', '#0a0a12')} · bg-alt ${g('bg-alt', '')} · surface ${g('surface', '')} · border ${g('border', '')}`,
    `fg ${g('fg', '#ffffff')} · muted ${g('muted', '')} · faint ${g('faint', '')}`,
    `accent ${g('accent', '')} · accent-2 ${g('accent-2', '')} · on-accent ${g('on-accent', '')}`,
    `ok ${g('ok', '#34d399')} · warn ${g('warn', '#fbbf24')} · danger ${g('danger', '#f87171')} · info ${g('info', '#60a5fa')}`,
    '```',
    'Use 60-30-10 (bg / surface / accent). Every token-driven snippet re-skins when the palette is applied.',
    '',
    '## Typography',
    '- Stack: `"Inter var", system-ui, -apple-system, sans-serif` (swap to taste)',
    '- Scale: fluid via `typography/fluid-type.css` (clamp); base 16, ratio ~1.25; display 700–800 / body 400',
    '',
    '## Spacing & shape',
    '- 4px scale (4/8/12/16/24/32/48/64); container ~1120px → `structure/structure.css`',
    '- Radius 12px cards / 8px controls (set each snippet `--*-radius`); shadow `0 12px 32px -12px rgba(0,0,0,.5)`',
    '',
    '## Motion',
    '- Hovers 200–250ms ease-out; page transitions 600ms cubic-bezier(.2,.8,.2,1)',
    '- Curves: `utils/easing.js` · keyframes/spring/stagger: `animations/` · page-level: `transitions/transitions-pro.js`',
    '',
    '## Components (house style)',
    '| Slot | Use |',
    '|---|---|',
    '| Buttons | `blocks/buttons-sleek.css` (refined) or `buttons-fx*` (bold); primary = accent gradient |',
    '| Inputs | `blocks/inputs-fancy.css` / `inputs-uiverse.css`; search → `components/glow-search.css` |',
    '| Cards | `components/cards.css`; featured → `effects/card-fx.css` (cfx-holo) / `luxe-hover.css` |',
    '| Toggles/checks | `blocks/toggles-uiverse.css`, `checkboxes-uiverse.css`, `radios-uiverse.css` |',
    '| Nav / chrome | `components/header-pack.css`, `navbars.css`, `footers-pro.css` |',
    `| Hero / bg | ${heroBg} |`,
    '| Loaders | `blocks/loaders-mega.css`, `loaders-uiverse.css` |',
    '| Theme toggle | `components/theme-switch.css` (data-theme + persistence) |',
    '| Page transitions | `transitions/transitions-pro.js` (14 effects) |',
    '',
    '## Build order',
    `1. \`<body class="struct pal-${p.name}">\` · 2. fluid type + font stack · 3. get_skill("structure") for the section sequence · 4. fill each slot via get_snippet/search_components.`,
    ''
  ].join('\n');
}

// ---- Consume an external DESIGN.md: extract color tokens, match the nearest
//      repo palette, and emit a section-by-section snippet build plan. ----
export function extractDesignTokens(md) {
  md = String(md || '');
  const near = (label) => { const m = md.match(new RegExp(label + '[^#\\n]{0,24}?(#[0-9a-fA-F]{3,8})', 'i')); return m ? m[1] : null; };
  const all = md.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const out = {
    accent: near('accent\\b') || near('primary') || all[0] || null,
    bg: near('\\bbg\\b') || near('background') || null,
    fg: near('\\bfg\\b') || near('\\btext\\b') || near('foreground') || null,
    all: all
  };
  return out;
}
function hexRgb(h) {
  if (!h) return null;
  let m = String(h).replace('#', '');
  if (m.length === 3) m = m.split('').map((c) => c + c).join('');
  if (m.length < 6) return null;
  const n = parseInt(m.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbDist(a, b) { return (a && b) ? Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) : null; }
export function matchPalette(tokens, palettes) {
  const acc = hexRgb(tokens && tokens.accent), bg = hexRgb(tokens && tokens.bg);
  let best = null, bestScore = Infinity;
  for (const p of palettes) {
    let score = 0, parts = 0;
    const da = rgbDist(acc, hexRgb(p.tokens.accent)); if (da != null) { score += da * 1.6; parts++; }
    const db = rgbDist(bg, hexRgb(p.tokens.bg)); if (db != null) { score += db; parts++; }
    if (!parts) continue;
    score /= parts;
    if (score < bestScore) { bestScore = score; best = p; }
  }
  return { palette: best, score: Math.round(bestScore) };
}
export function buildApplyPlan(tokens, palette, genre) {
  genre = genre || 'landing';
  const ov = [];
  if (tokens.accent) ov.push('--accent: ' + tokens.accent + ';');
  if (tokens.bg) ov.push('--bg: ' + tokens.bg + ';');
  if (tokens.fg) ov.push('--fg: ' + tokens.fg + ';');
  const sections = [
    ['Nav', '`components/navbars.css` or `components/header-pack.css`'],
    ['Hero', '`backgrounds/aurora-bg.css` + `components/heroes-pack.css` (fluid headline)'],
    ['Features', '`components/feature-grid-hover.css` or `components/bento-grid.css`'],
    ['Social proof', '`components/testimonials.css` / logos `components/marquee.css`'],
    ['Pricing', '`components/pricing.css` + `components/pricing-toggle.css`'],
    ['FAQ', '`components/faq.css`'],
    ['CTA', '`blocks/buttons-sleek.css` (primary = accent gradient)'],
    ['Footer', '`components/footers-pro.css`']
  ];
  return [
    '# Build plan from your DESIGN.md',
    palette ? `**Matched palette:** \`pal-${palette.name}\` (${palette.mode}, ${palette.group}) — closest to your colours${tokens.accent ? ' (accent ' + tokens.accent + ')' : ''}.` : '_No color tokens detected — pick one with list_palettes._',
    palette ? 'Apply: `<body class="struct pal-' + palette.name + '">`' : '',
    ov.length ? 'Override for your exact hexes:\n```css\n.struct {\n  ' + ov.join('\n  ') + '\n}\n```' : '',
    '',
    `## Section plan (${genre})`,
    ...sections.map((s, i) => `${i + 1}. **${s[0]}** → ${s[1]}`),
    'Sections inherit the palette tokens → coherent by default. `get_skill("structure")` gives the exact sequence per genre; `get_snippet(path)` pulls each file.',
    '',
    '## Component house style',
    '- Buttons `blocks/buttons-sleek.css` · Inputs `blocks/inputs-fancy.css` · Cards `effects/card-fx.css` / `components/cards.css`',
    '- Motion `utils/easing.js` + `animations/` · Page transitions `transitions/transitions-pro.js`'
  ].filter((x) => x !== '').join('\n');
}

// =====================================================
// TASTE · composition — compose_page + coherence_check
// =====================================================
// Shared cohesion constants. NOTE: intentionally duplicated in tools/audit.js
// (CJS) — keep the two in sync; there is deliberately no cross-module import.
export const BLESSED_MS = [90, 120, 140, 160, 200, 260, 320, 480];

// Sensible defaults per aesthetic (every palette/value is real).
export const AESTHETIC_DEFAULTS = {
  minimal:   { palette: 'saas-indigo',     fontPair: 'grotesk-tech',    motion: 'minimal',  density: 'airy' },
  editorial: { palette: 'paper',           fontPair: 'editorial-serif', motion: 'standard', density: 'airy' },
  energetic: { palette: 'electric-night',  fontPair: 'display-bold',    motion: 'playful',  density: 'normal' },
  luxury:    { palette: 'luxe-black-gold', fontPair: 'luxury-serif',    motion: 'standard', density: 'airy' },
  playful:   { palette: 'playful-bright',  fontPair: 'geometric-warm',  motion: 'playful',  density: 'normal' },
  technical: { palette: 'vercel-mono',     fontPair: 'mono-technical',  motion: 'minimal',  density: 'compact' },
};
export const GENRE_AESTHETIC = { saas: 'minimal', agency: 'energetic', portfolio: 'editorial', ecommerce: 'energetic', restaurant: 'luxury', startup: 'energetic', blog: 'editorial', landing: 'minimal', diagram: 'technical', plan: 'technical' };

// Seed-driven palette diversity so "compose N variants and pick" yields visibly
// DIFFERENT looks, not byte-identical pages. Each list stays on-genre/on-aesthetic;
// INDEX 0 IS THE CURRENT DEFAULT (def.palette for the genre) so seed 0 is a
// byte-identical regression guard. Only used when no palette is pinned (opts /
// preset always win). Aesthetic is deliberately NOT rotated — it cascades into
// font/motion/density and would break comparability.
export const GENRE_PALETTE_SHORTLIST = {
  saas:      ['saas-indigo', 'linear-violet', 'vercel-mono', 'midnight'],
  agency:    ['electric-night', 'energy-volt', 'neon-night', 'power-orange'],
  portfolio: ['paper', 'clean-light', 'mono-snow', 'ink'],
  ecommerce: ['electric-night', 'appetite-red', 'power-orange', 'royal-purple'],
  restaurant:['luxe-black-gold', 'warm-bistro', 'appetite-red', 'espresso-cream'],
  startup:   ['electric-night', 'linear-violet', 'energy-volt', 'web3-violet'],
  blog:      ['paper', 'clean-light', 'cool-gray', 'charcoal'],
  landing:   ['saas-indigo', 'linear-violet', 'fintech-navy', 'vercel-mono'],
  diagram:   ['slate-dark', 'ink', 'vercel-mono', 'fintech-navy'],
  plan:      ['slate-dark', 'clean-light', 'saas-indigo', 'charcoal'],
};
export const MOBILE_PALETTE_SHORTLIST = {
  onboarding:  ['saas-indigo', 'linear-violet', 'playful-bright'],
  social:      ['playful-bright', 'electric-night', 'neon-night'],
  commerce:    ['electric-night', 'appetite-red', 'royal-purple'],
  health:      ['saas-indigo', 'wellness-teal', 'care-mint', 'medical-blue'],
  finance:     ['vercel-mono', 'fintech-navy', 'wealth-emerald'],
  productivity:['saas-indigo', 'linear-violet', 'midnight'],
  media:       ['electric-night', 'neon-night', 'festival'],
  saas:        ['saas-indigo', 'linear-violet', 'vercel-mono'],
  app:         ['saas-indigo', 'midnight', 'linear-violet'],
};

// Genre → ordered section sequence. Each section: {slot, query, shell, house?}.
// `query` feeds BM25 search to gather candidate snippets; `shell` selects the
// structural .s-* markup; `house` (optional) maps to a preset house slot so that
// slot prefers the preset's chosen pack.
export const GENRE_SEQUENCES = {
  saas: [
    { slot: 'nav', query: 'navbar header sticky', shell: 'nav' },
    { slot: 'hero', query: 'hero headline cta gradient', shell: 'hero', house: 'hero' },
    { slot: 'logos', query: 'logo cloud marquee trusted', shell: 'logos' },
    { slot: 'features', query: 'feature grid bento icons', shell: 'features' },
    { slot: 'showcase', query: 'product screenshot split media', shell: 'split' },
    { slot: 'stats', query: 'stats metrics counter numbers', shell: 'stats' },
    { slot: 'testimonial', query: 'testimonial quote customer', shell: 'testimonial' },
    { slot: 'pricing', query: 'pricing plans tier', shell: 'pricing', house: 'card' },
    { slot: 'cta', query: 'cta call to action signup button', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links columns', shell: 'footer' },
  ],
  agency: [
    { slot: 'nav', query: 'navbar header minimal', shell: 'nav' },
    { slot: 'hero', query: 'hero bold statement headline', shell: 'hero', house: 'hero' },
    { slot: 'logos', query: 'client logos marquee', shell: 'logos' },
    { slot: 'work', query: 'portfolio gallery case study cards', shell: 'gallery', house: 'card' },
    { slot: 'services', query: 'services feature grid', shell: 'features' },
    { slot: 'stats', query: 'stats awards numbers', shell: 'stats' },
    { slot: 'cta', query: 'cta call to action contact', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links big', shell: 'footer' },
  ],
  portfolio: [
    { slot: 'nav', query: 'navbar header minimal', shell: 'nav' },
    { slot: 'hero', query: 'hero portfolio personal intro headline', shell: 'hero', house: 'hero' },
    { slot: 'work', query: 'project gallery grid cards', shell: 'gallery', house: 'card' },
    { slot: 'about', query: 'profile bio avatar card about story', shell: 'split' },
    { slot: 'testimonial', query: 'testimonial quote', shell: 'testimonial' },
    { slot: 'cta', query: 'cta call to action contact', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links', shell: 'footer' },
  ],
  ecommerce: [
    { slot: 'nav', query: 'navbar header cart shop', shell: 'nav' },
    { slot: 'hero', query: 'hero banner big headline', shell: 'hero', house: 'hero' },
    { slot: 'products', query: 'product card grid price', shell: 'products', house: 'card' },
    { slot: 'features', query: 'benefits shipping returns grid', shell: 'features' },
    { slot: 'testimonial', query: 'review testimonial stars', shell: 'testimonial' },
    { slot: 'cta', query: 'cta call to action signup', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links shop', shell: 'footer' },
  ],
  restaurant: [
    { slot: 'nav', query: 'navbar header', shell: 'nav' },
    { slot: 'hero', query: 'hero restaurant ambiance headline', shell: 'hero', house: 'hero' },
    { slot: 'menu', query: 'menu dishes pack', shell: 'split' },
    { slot: 'gallery', query: 'gallery photos masonry lightbox images', shell: 'gallery', house: 'card' },
    { slot: 'stats', query: 'stats numbers years', shell: 'stats' },
    { slot: 'cta', query: 'booking reservation table', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links columns', shell: 'footer' },
  ],
  startup: [
    { slot: 'nav', query: 'navbar header', shell: 'nav' },
    { slot: 'hero', query: 'hero headline cta gradient', shell: 'hero', house: 'hero' },
    { slot: 'features', query: 'feature grid icons benefits', shell: 'features' },
    { slot: 'showcase', query: 'split media product', shell: 'split' },
    { slot: 'cta', query: 'cta waitlist signup button', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links', shell: 'footer' },
  ],
  blog: [
    { slot: 'nav', query: 'navbar header', shell: 'nav' },
    { slot: 'hero', query: 'hero headline cta', shell: 'hero', house: 'hero' },
    { slot: 'posts', query: 'article cards grid blog', shell: 'gallery', house: 'card' },
    { slot: 'about', query: 'about split author', shell: 'split' },
    { slot: 'cta', query: 'newsletter subscribe email capture signup', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links', shell: 'footer' },
  ],
  landing: [
    { slot: 'nav', query: 'navbar header', shell: 'nav' },
    { slot: 'hero', query: 'hero headline cta', shell: 'hero', house: 'hero' },
    { slot: 'features', query: 'feature grid', shell: 'features' },
    { slot: 'testimonial', query: 'testimonial quote', shell: 'testimonial' },
    { slot: 'cta', query: 'cta call to action signup', shell: 'cta', house: 'button' },
    { slot: 'footer', query: 'footer links', shell: 'footer' },
  ],
  diagram: [
    { slot: 'nav', query: 'navbar header minimal', shell: 'nav' },
    { slot: 'diagram-title', query: 'section heading eyebrow', shell: 'diagramTitle' },
    { slot: 'diagram-canvas', query: 'architecture diagram svg nodes edges flowchart', shell: 'diagramCanvas' },
    { slot: 'diagram-notes', query: 'feature grid annotations notes', shell: 'diagramNotes' },
    { slot: 'footer', query: 'footer links', shell: 'footer' },
  ],
  plan: [
    { slot: 'nav', query: 'navbar header minimal', shell: 'nav' },
    { slot: 'plan-header', query: 'section heading eyebrow', shell: 'planHeader' },
    { slot: 'plan-phases', query: 'steps timeline phases roadmap', shell: 'planPhases' },
    { slot: 'plan-stack', query: 'tech stack grid chips', shell: 'planStack' },
    { slot: 'footer', query: 'footer links', shell: 'footer' },
  ],
};

// ---- .s-* shell renderers — on-brand markup styled purely by structure.css +
//      the palette tokens (NO hardcoded hex, NO literal durations/radii), so a
//      composed page reads as designed before the real snippets are wired in.
const card = (h3, p) => `<article class="s-card s-stack s-stack--sm"><h3>${h3}</h3><p>${p}</p></article>`;
const mediaBox = (ar) => `<div class="s-reveal" style="aspect-ratio:${ar};background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);"></div>`;
const SHELLS = {
  nav: () => `<header class="s-nav"><div class="s-nav-inner">
    <a class="s-brand"><span class="s-brand-dot"></span>Northwind</a>
    <nav class="s-nav-links"><a>Product</a><a>Pricing</a><a>Docs</a><a>About</a></nav>
    <a class="s-btn">Get started</a>
  </div></header>`,
  hero: () => `<header class="s-hero s-hero--center"><div class="s-hero-inner s-stack">
    <p class="s-eyebrow">New · just shipped</p>
    <h1 class="s-title">A headline that carries the whole aesthetic</h1>
    <p class="s-lead">One clear sentence about the value — set in the body face at a comfortable measure, never shouting over the display type.</p>
    <div class="s-cluster s-cluster--center"><a class="s-btn s-btn--lg">Start free</a><a class="s-btn s-btn--ghost s-btn--lg">Book a demo</a></div>
  </div></header>`,
  logos: () => `<section class="s-section s-section-tight"><div class="s-container">
    <div class="s-logos"><span>Acme</span><span>Globex</span><span>Umbra</span><span>Initech</span><span>Hooli</span><span>Soylent</span></div>
  </div></section>`,
  features: () => `<section class="s-section"><div class="s-container">
    <div class="s-section-head"><p class="s-eyebrow">Features</p><h2 class="s-title">Everything you need, nothing you don't</h2></div>
    <div class="s-grid">
      ${card('Fast by default', 'Tuned for instant feedback on every interaction.')}
      ${card('Token-themed', 'Re-skins to any palette by swapping one class.')}
      ${card('Accessible', 'Keyboard, focus and reduced-motion handled for you.')}
      ${card('Composable', 'Drop-in parts that share one spacing rhythm.')}
      ${card('Responsive', 'Fluid type and grids from mobile to ultrawide.')}
      ${card('Zero build', 'Plain CSS + JS — paste and ship.')}
    </div>
  </div></section>`,
  split: () => `<section class="s-section s-section--alt"><div class="s-container">
    <div class="s-split">
      <div class="s-stack"><p class="s-eyebrow">Workflow</p><h2 class="s-title">See it in context</h2><p class="s-lead">Show the product doing the one thing it does best, with room to breathe around it.</p><a class="s-btn">Learn more</a></div>
      ${mediaBox('4/3')}
    </div>
  </div></section>`,
  stats: () => `<section class="s-section"><div class="s-container">
    <div class="s-stats">
      <div><div class="s-stat-num">99.99%</div><div class="s-stat-label">Uptime</div></div>
      <div><div class="s-stat-num">12k+</div><div class="s-stat-label">Teams</div></div>
      <div><div class="s-stat-num">40ms</div><div class="s-stat-label">Median latency</div></div>
      <div><div class="s-stat-num">4.9/5</div><div class="s-stat-label">Rating</div></div>
    </div>
  </div></section>`,
  testimonial: () => `<section class="s-section s-section--accent"><div class="s-container-narrow">
    <blockquote class="s-stack s-stack--sm" style="text-align:center;">
      <p class="s-lead">"It looks like we hired a design studio. It took an afternoon."</p>
      <footer class="s-eyebrow">— Jordan Lee, Head of Design at Globex</footer>
    </blockquote>
  </div></section>`,
  pricing: () => `<section class="s-section s-section--alt"><div class="s-container">
    <div class="s-section-head"><p class="s-eyebrow">Pricing</p><h2 class="s-title">Simple, transparent plans</h2></div>
    <div class="s-grid">
      <article class="s-card s-stack"><h3>Starter</h3><div class="s-stat-num">$0</div><p>For trying things out.</p><a class="s-btn s-btn--ghost">Choose</a></article>
      <article class="s-card s-stack"><h3>Pro</h3><div class="s-stat-num">$29</div><p>For growing teams.</p><a class="s-btn">Choose</a></article>
      <article class="s-card s-stack"><h3>Scale</h3><div class="s-stat-num">$99</div><p>For serious volume.</p><a class="s-btn s-btn--ghost">Choose</a></article>
    </div>
  </div></section>`,
  gallery: () => `<section class="s-section"><div class="s-container">
    <div class="s-section-head"><p class="s-eyebrow">Selected work</p><h2 class="s-title">Recent projects</h2></div>
    <div class="s-grid">
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Project one</h3></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Project two</h3></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Project three</h3></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Project four</h3></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Project five</h3></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Project six</h3></article>
    </div>
  </div></section>`,
  products: () => `<section class="s-section"><div class="s-container">
    <div class="s-section-head"><p class="s-eyebrow">Shop</p><h2 class="s-title">Best sellers</h2></div>
    <div class="s-grid">
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Oak chair</h3><p class="s-stat-label">$180</p><a class="s-btn s-btn--ghost">Add to cart</a></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Linen throw</h3><p class="s-stat-label">$60</p><a class="s-btn s-btn--ghost">Add to cart</a></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Clay vase</h3><p class="s-stat-label">$45</p><a class="s-btn s-btn--ghost">Add to cart</a></article>
      <article class="s-card s-stack s-stack--sm">${mediaBox('1/1')}<h3>Brass lamp</h3><p class="s-stat-label">$120</p><a class="s-btn s-btn--ghost">Add to cart</a></article>
    </div>
  </div></section>`,
  cta: () => `<section class="s-section s-section--accent"><div class="s-container-narrow s-stack" style="text-align:center;">
    <h2 class="s-title">Ready to build something tasteful?</h2>
    <p class="s-lead">Start free. No credit card required.</p>
    <div class="s-cluster s-cluster--center"><a class="s-btn s-btn--lg">Get started</a></div>
  </div></section>`,
  footer: () => `<footer class="s-footer"><div class="s-container">
    <div class="s-footer-grid">
      <div class="s-footer-col"><a class="s-brand"><span class="s-brand-dot"></span>Northwind</a><p>Tasteful interfaces, composed fast.</p></div>
      <div class="s-footer-col"><h4>Product</h4><a>Features</a><a>Pricing</a><a>Changelog</a></div>
      <div class="s-footer-col"><h4>Company</h4><a>About</a><a>Blog</a><a>Careers</a></div>
      <div class="s-footer-col"><h4>Legal</h4><a>Privacy</a><a>Terms</a></div>
    </div>
    <div class="s-footer-bottom"><span>© 2026 Northwind</span><span>Made with frontendmaxxing</span></div>
  </div></footer>`,

  // ---- diagram + plan genre shells (token-styled, self-contained SVG graph) ----
  diagramTitle: () => `<header class="s-section"><div class="s-container-narrow s-stack" style="text-align:center;">
    <p class="s-eyebrow">Architecture</p>
    <h1 class="s-title">System overview</h1>
    <p class="s-lead">How a request flows from the client to the data layer — services, the realtime path, and the stores behind them.</p>
  </div></header>`,
  diagramCanvas: () => {
    const n = {
      client:   { x: 450, y: 20,  w: 160, h: 62, t: 'Client',       s: 'Web · Mobile',    a: 1 },
      gateway:  { x: 450, y: 160, w: 160, h: 62, t: 'API Gateway',  s: 'auth · routing' },
      auth:     { x: 80,  y: 300, w: 185, h: 62, t: 'Auth Service', s: 'OAuth · JWT' },
      core:     { x: 437, y: 300, w: 185, h: 62, t: 'Core Service', s: 'business logic' },
      realtime: { x: 795, y: 300, w: 185, h: 62, t: 'Realtime',     s: 'WebSocket' },
      db:       { x: 250, y: 446, w: 185, h: 62, t: 'Postgres',     s: 'source of truth' },
      cache:    { x: 625, y: 446, w: 185, h: 62, t: 'Redis',        s: 'cache · queue' },
    };
    const E = [['client', 'gateway', 1], ['gateway', 'auth'], ['gateway', 'core', 1], ['gateway', 'realtime'], ['auth', 'db'], ['core', 'db', 1], ['core', 'cache'], ['realtime', 'cache']];
    const path = (a, b) => { const ax = a.x + a.w / 2, ay = a.y + a.h, bx = b.x + b.w / 2, by = b.y, m = (ay + by) / 2; return `M${ax},${ay} C${ax},${m} ${bx},${m} ${bx},${by}`; };
    const edges = E.map(([s, t, act]) => `<path class="dgm-edge${act ? ' dgm-edge--active' : ''}" d="${path(n[s], n[t])}"/>`).join('');
    const nodes = Object.values(n).map((x) => { const cx = x.x + x.w / 2, cy = x.y + x.h / 2; return `<g><rect class="dgm-rect${x.a ? ' dgm-rect--accent' : ''}" x="${x.x}" y="${x.y}" width="${x.w}" height="${x.h}" rx="12"/><text class="dgm-label" x="${cx}" y="${cy - 6}" text-anchor="middle" dominant-baseline="middle">${x.t}</text><text class="dgm-sub" x="${cx}" y="${cy + 14}" text-anchor="middle" dominant-baseline="middle">${x.s}</text></g>`; }).join('');
    return `<section class="s-section"><div class="s-container"><div class="dgm-stage">
    <svg class="dgm-svg" viewBox="0 0 1060 540" role="img" aria-label="System architecture diagram">${edges}${nodes}</svg>
    <div class="dgm-legend"><span><i class="is-accent"></i>Critical path</span><span><i></i>Service</span></div>
  </div></div></section>`;
  },
  diagramNotes: () => `<section class="s-section s-section--alt"><div class="s-container">
    <div class="s-section-head"><p class="s-eyebrow">Notes</p><h2 class="s-title">How it fits together</h2></div>
    <div class="s-grid">
      ${card('API Gateway', 'A single entry point — authentication, rate-limiting, and routing to the right service.')}
      ${card('Core Service', 'Owns the business logic and is the only writer to the primary Postgres store.')}
      ${card('Realtime', 'WebSocket fan-out backed by Redis pub/sub for low-latency live updates.')}
      ${card('Data layer', 'Postgres is the source of truth; Redis carries the cache and background queues.')}
    </div>
  </div></section>`,
  planHeader: () => `<header class="s-section"><div class="s-container-narrow s-stack">
    <p class="s-eyebrow">Plan · v1</p>
    <h1 class="s-title">Implementation plan</h1>
    <p class="s-lead">Scope, phases, and the stack — the shared contract everyone agrees on before any code is written.</p>
  </div></header>`,
  planPhases: () => `<section class="s-section"><div class="s-container">
    <div class="s-section-head"><p class="s-eyebrow">Phases</p><h2 class="s-title">The path to ship</h2></div>
    <div class="dgm-phases">
      <div class="dgm-phase"><div class="dgm-phase-num">01</div><div><h3>Foundations</h3><p>Schema, auth, and the deterministic compose path — the spine everything else hangs off.</p></div></div>
      <div class="dgm-phase"><div class="dgm-phase-num">02</div><div><h3>Core flows</h3><p>The two or three journeys that carry the product; wire each one end to end.</p></div></div>
      <div class="dgm-phase"><div class="dgm-phase-num">03</div><div><h3>Verify</h3><p>Render-truth and the save-gate — nothing ships that hasn't proven it actually works.</p></div></div>
      <div class="dgm-phase"><div class="dgm-phase-num">04</div><div><h3>Polish &amp; launch</h3><p>Motion, edge cases, and the launch checklist.</p></div></div>
    </div>
  </div></section>`,
  planStack: () => `<section class="s-section s-section--alt"><div class="s-container">
    <div class="s-section-head"><p class="s-eyebrow">Stack</p><h2 class="s-title">What we build on</h2></div>
    <div class="dgm-stack">
      <div class="dgm-chip"><b>Node + http</b><span>zero-dep server</span></div>
      <div class="dgm-chip"><b>Postgres</b><span>primary store</span></div>
      <div class="dgm-chip"><b>Redis</b><span>cache · queue</span></div>
      <div class="dgm-chip"><b>Headless Chrome</b><span>render-truth gate</span></div>
    </div>
  </div></section>`,
};

function sectionComment(s) {
  return `  <!-- ${s.slot}: drop in ${s.snippet || '(no match — search the vault)'}${s.companions && s.companions.length ? ' + ' + s.companions.join(', ') : ''} -->`;
}
function renderComposedHtml(genre, t, sections, presetName) {
  const links = ['structure/structure.css', 'colors/palettes.css', 'taste/density.css', 'taste/motion.css', 'taste/fonts.css', 'taste/aesthetic.css',
    ...(genre === 'diagram' || genre === 'plan' ? ['structure/diagram.css'] : [])]
    .map((h) => `  <link rel="stylesheet" href="${h}">`).join('\n');
  const body = sections.map((s) => sectionComment(s) + '\n  ' + (SHELLS[s.shell] || SHELLS.features)(s)).join('\n\n');
  const manifest = sections.map((s) => `     ${(s.slot + ':').padEnd(13)} ${s.snippet || '(no match)'}${s.companions && s.companions.length ? '  + ' + s.companions.join(', ') : ''}`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${genre}${presetName ? ' · ' + presetName : ''} — composed by frontendmaxxing</title>
${links}
</head>
<body class="struct pal-${t.palette}" data-aesthetic="${t.aesthetic}" data-font-pair="${t.fontPair}" data-motion="${t.motion}" data-density="${t.density}">

${body}

<!-- ============================================
     BUILD MANIFEST — real snippets to drop into each slot.
     get_snippet <path> for paste-ready code. This scaffold uses structure.css
     .s-* shells so it renders on-brand BEFORE the parts are wired in.
${manifest}
     ============================================ -->
<script>
/* reveal-on-scroll: add .is-in to .s-reveal as it enters view. Without this the
   shells stay opacity:0 forever (the page renders blank). Guarded for
   reduced-motion and browsers without IntersectionObserver — both reveal all. */
(function () {
  var els = document.querySelectorAll('.s-reveal');
  if (!els.length) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
  /* anything already above the fold reveals on the next frame */
  requestAnimationFrame(function () {
    for (var k = 0; k < els.length; k++) { if (els[k].getBoundingClientRect().top < window.innerHeight) els[k].classList.add('is-in'); }
  });
})();
</script>
</body>
</html>`;
}

// Pure: assemble a full, renderable page scaffold for a genre + taste.
// deps = { presets (TastePresets api|null), palByName (Map|null), search (fn|null),
//          byPath (Map|null), companions (fn|null) }.
export function composePage(genre, opts, deps) {
  opts = opts || {};
  deps = deps || {};
  const { presets, palByName, search, byPath, companions } = deps;
  const warnings = [];
  genre = String(genre || 'landing').toLowerCase();
  const seq = GENRE_SEQUENCES[genre] || GENRE_SEQUENCES.landing;

  // resolve theme: preset → explicit opts → aesthetic default
  let base = {};
  if (opts.preset) {
    const p = presets && presets.get ? presets.get(opts.preset) : null;
    if (p) base = { aesthetic: p.aesthetic, palette: p.palette, fontPair: p.fontPair, motion: p.motion, density: p.density, house: p.house };
    else warnings.push(`unknown preset "${opts.preset}" — ignored`);
  }
  const aesthetic = opts.aesthetic || base.aesthetic || GENRE_AESTHETIC[genre] || 'minimal';
  const def = AESTHETIC_DEFAULTS[aesthetic] || AESTHETIC_DEFAULTS.minimal;
  const fontPair = opts.fontPair || base.fontPair || def.fontPair;
  const motion = opts.motion || base.motion || def.motion;
  const density = opts.density || base.density || def.density;
  const seed = Number.isFinite(+opts.seed) ? Math.abs(Math.floor(+opts.seed)) : 0;
  // palette: pinned (opts/preset) always wins; otherwise rotate the genre
  // shortlist by seed for real visual diversity (shortlist[0] = the old default,
  // so seed 0 is byte-identical).
  let palette = opts.palette || base.palette;
  if (!palette) {
    const shortlist = GENRE_PALETTE_SHORTLIST[genre];
    palette = (shortlist && shortlist.length) ? shortlist[seed % shortlist.length] : def.palette;
  }
  if (palByName && !palByName.has(palette)) {
    warnings.push(`palette "${palette}" not found — using "${def.palette}"`);
    palette = def.palette;
  }
  const house = base.house || {};

  // Per-slot pick with variety_seed rotation through real candidates.
  // seed 0 = the house/top-ranked pick for EVERY slot (best quality);
  // each seed increment shifts all slots one rank down for diversity.
  // A snippet is never picked twice on one page (skips to the next candidate).
  const used = new Set();
  const sections = seq.map((sec) => {
    const cands = [];
    if (sec.house && house[sec.house] && (!byPath || byPath.has(house[sec.house]))) cands.push(house[sec.house]);
    if (search) {
      for (const r of search(sec.query, 8)) {
        // mobile/ = iPhone-frame visual specs, never a web-page section
        if (r.entry.folder === 'mobile') continue;
        const pth = r.entry.path;
        if ((!byPath || byPath.has(pth)) && cands.indexOf(pth) === -1) cands.push(pth);
      }
    }
    let snippet = null;
    if (cands.length) {
      const start = seed % cands.length;
      for (let k = 0; k < cands.length; k++) {
        const c = cands[(start + k) % cands.length];
        if (!used.has(c)) { snippet = c; break; }
      }
      if (!snippet) snippet = cands[start];
      used.add(snippet);
    }
    const comps = (snippet && companions && byPath && byPath.has(snippet))
      ? companions(byPath.get(snippet)).map((c) => c.path).filter((pp) => pp !== snippet)
      : [];
    return { slot: sec.slot, shell: sec.shell, query: sec.query, snippet, companions: comps };
  });

  const tokenOverrides = { palette, aesthetic, fontPair, motion, density };
  const html = renderComposedHtml(genre, tokenOverrides, sections, opts.preset || null);
  return { genre, preset: opts.preset || null, theme: tokenOverrides, tokenOverrides, sections, html, warnings };
}

// =====================================================
// MOBILE composition — assemble an app SCREEN FLOW (the .scr-* peer of compose)
// =====================================================
// Where composePage builds one scrolling web page of sections, composeApp builds
// a FLOW of discrete app screens (structure/app-shell.css .scr-* shells), each
// in a device frame, themed by the same taste tokens. Real vault mobile/
// components are recommended per screen via MOBILE_SLOT_COMPONENTS (from the
// classified map); content screens with no component build from shells.

export const MOBILE_GENRE_AESTHETIC = { onboarding: 'minimal', social: 'playful', commerce: 'energetic', health: 'minimal', finance: 'technical', productivity: 'minimal', media: 'energetic', saas: 'minimal', app: 'minimal' };

// slot → real vault components to recommend (paths the agent drops in)
const MOBILE_SLOT_COMPONENTS = {
  onboarding: ['mobile/app-onboarding-value-props.css', 'mobile/app-onboarding-welcome.css', 'mobile/app-onboarding-pick-goals.css', 'mobile/app-permission-prompt.css'],
  auth: ['mobile/app-signup.css', 'mobile/app-login.css', 'mobile/app-email-verify.css'],
  list: ['mobile/ios-list-grouped.css'],
  settings: ['mobile/app-billing-history.css'],
  checkout: ['mobile/app-payment-card.css', 'mobile/app-receipt.css'],
  dashboard: ['mobile/ios-home-screen.css'],
  paywall: ['mobile/app-paywall.css', 'mobile/app-subscription-tiers.css', 'mobile/app-trial-locked.css'],
  feed: [], detail: [], profile: [],     // build from .scr-* shells (no standalone component)
};

// genre → ordered screens. Each: { screen, shell, slot, tab? }
export const MOBILE_FLOWS = {
  onboarding: [ { screen: 'Welcome', shell: 'onboarding', slot: 'onboarding' }, { screen: 'Sign up', shell: 'auth', slot: 'auth' }, { screen: 'Home', shell: 'feed', slot: 'feed', tab: 0 } ],
  social:     [ { screen: 'Feed', shell: 'feed', slot: 'feed', tab: 0 }, { screen: 'Post', shell: 'sheet', slot: 'detail' }, { screen: 'Profile', shell: 'profile', slot: 'profile', tab: 3 } ],
  commerce:   [ { screen: 'Shop', shell: 'feed', slot: 'feed', tab: 0 }, { screen: 'Product', shell: 'detail', slot: 'detail' }, { screen: 'Checkout', shell: 'checkout', slot: 'checkout' } ],
  health:     [ { screen: 'Today', shell: 'dashboard', slot: 'dashboard', tab: 0 }, { screen: 'Activity', shell: 'detail', slot: 'detail' }, { screen: 'Profile', shell: 'profile', slot: 'profile', tab: 3 } ],
  finance:    [ { screen: 'Balance', shell: 'dashboard', slot: 'dashboard', tab: 0 }, { screen: 'Activity', shell: 'list', slot: 'list', tab: 2 }, { screen: 'Detail', shell: 'detail', slot: 'detail' } ],
  productivity:[ { screen: 'Tasks', shell: 'fablist', slot: 'list', tab: 0 }, { screen: 'Task', shell: 'detail', slot: 'detail' }, { screen: 'Settings', shell: 'settings', slot: 'settings', tab: 3 } ],
  media:      [ { screen: 'Browse', shell: 'feed', slot: 'feed', tab: 0 }, { screen: 'Now playing', shell: 'player', slot: 'detail' }, { screen: 'Library', shell: 'empty', slot: 'list', tab: 2 } ],
  saas:       [ { screen: 'Dashboard', shell: 'dashboard', slot: 'dashboard', tab: 0 }, { screen: 'Detail', shell: 'detail', slot: 'detail' }, { screen: 'Settings', shell: 'settings', slot: 'settings', tab: 3 } ],
  app:        [ { screen: 'Welcome', shell: 'onboarding', slot: 'onboarding' }, { screen: 'Home', shell: 'feed', slot: 'feed', tab: 0 }, { screen: 'Settings', shell: 'settings', slot: 'settings', tab: 3 } ],
};

// ---- screen-shell helpers (build .scr inner from .scr-* primitives) ----
const scrBar = '<div class="scr-statusbar"></div>';
const scrTabs = ['Home', 'Search', 'Activity', 'Profile'];
const scrTabIco = ['◉', '◌', '◆', '◇'];
const scrTabbar = (active = 0) => `<nav class="scr-tabbar">${scrTabs.map((t, i) => `<a class="scr-tab${i === active ? ' is-active' : ''}"><span class="scr-tab-ico">${scrTabIco[i]}</span>${t}</a>`).join('')}</nav>`;
const scrRow = (t, sub, val) => `<a class="scr-row"><span class="scr-row-ico">◆</span><span class="scr-row-main"><div class="scr-row-title">${t}</div>${sub ? `<div class="scr-row-sub">${sub}</div>` : ''}</span>${val ? `<span class="scr-row-value">${val}</span>` : '<span class="scr-row-chevron">›</span>'}</a>`;

const MOBILE_SHELLS = {
  onboarding: () => `${scrBar}
    <main class="scr-body" style="justify-content:center;gap:1.4rem;">
      <div class="scr-media" style="aspect-ratio:1/1;max-width:200px;margin:0 auto;border-radius:24px;"></div>
      <div class="scr-hero" style="text-align:center;align-items:center;">
        <h1>Make every day count.</h1>
        <p>A calmer, more intentional way to get where you're going.</p>
      </div>
      <div class="scr-chips" style="justify-content:center;">${['Mindful', 'Daily', 'Private'].map((c, i) => `<span class="scr-chip${i === 0 ? ' is-active' : ''}">${c}</span>`).join('')}</div>
    </main>
    <div class="scr-cta"><a class="scr-btn scr-btn--block">Get started</a><a class="scr-btn scr-btn--text">I already have an account</a></div>`,
  auth: () => `${scrBar}
    <header class="scr-nav"><span class="scr-nav-left">‹</span><span class="scr-nav-title">Create account</span><span class="scr-nav-right"></span></header>
    <main class="scr-body">
      <div class="scr-hero"><h1>Welcome.</h1><p>A few details and you're in.</p></div>
      <div class="scr-field"><span class="scr-field-label">Name</span><input class="scr-input" placeholder="Jordan Lee"></div>
      <div class="scr-field"><span class="scr-field-label">Email</span><input class="scr-input" placeholder="you@example.com"></div>
      <div class="scr-field"><span class="scr-field-label">Password</span><input class="scr-input" type="password" placeholder="••••••••"></div>
    </main>
    <div class="scr-cta"><a class="scr-btn scr-btn--block">Continue</a><span class="scr-cta-note">By continuing you agree to the terms</span></div>`,
  feed: (tab = 0) => `${scrBar}
    <header class="scr-nav scr-nav--large"><span class="scr-nav-title">Home</span></header>
    <main class="scr-body">
      <div class="scr-chips">${['For you', 'Following', 'New', 'Saved'].map((c, i) => `<span class="scr-chip${i === 0 ? ' is-active' : ''}">${c}</span>`).join('')}</div>
      ${['Quiet mornings, done right', 'The case for slow evenings', 'Five rituals worth keeping'].map((t) => `<article class="scr-card"><div class="scr-media"></div><h3>${t}</h3><p>A short read on building a calmer daily rhythm.</p></article>`).join('')}
    </main>
    ${scrTabbar(tab)}`,
  detail: () => `${scrBar}
    <header class="scr-nav"><span class="scr-nav-left">‹</span><span class="scr-nav-title"></span><span class="scr-nav-right">⋯</span></header>
    <main class="scr-body scr-body--flush" style="gap:0;">
      <div class="scr-media" style="aspect-ratio:4/3;border-radius:0;"></div>
      <div style="padding:var(--scr-pad);display:flex;flex-direction:column;gap:0.9rem;">
        <div class="scr-hero"><p class="scr-eyebrow">Featured</p><h1>The case for slow evenings</h1></div>
        <div class="scr-stats"><div class="scr-stat"><b>6 min</b><span>read</span></div><div class="scr-stat"><b>4.9</b><span>rating</span></div><div class="scr-stat"><b>2.1k</b><span>saved</span></div></div>
        <p style="color:var(--muted);line-height:1.6;">Winding down is a skill, not a luxury. The last hour of your day sets the tone for the next one — here's how to give it the attention it deserves.</p>
        <div class="scr-list">${scrRow('Start the ritual', 'Guided · 12 min')}${scrRow('Save for later', 'Added to your library')}</div>
      </div>
    </main>
    <div class="scr-cta"><a class="scr-btn scr-btn--block">Begin</a></div>`,
  profile: (tab = 3) => `${scrBar}
    <header class="scr-nav"><span class="scr-nav-left"></span><span class="scr-nav-title">Profile</span><span class="scr-nav-right">Edit</span></header>
    <main class="scr-body">
      <div style="display:flex;align-items:center;gap:0.9rem;"><span class="scr-avatar" style="width:60px;height:60px;font-size:20px;">JL</span><div><div style="font:700 1.25rem/1.1 var(--font-head,inherit);">Jordan Lee</div><div style="color:var(--muted);font-size:14px;">Member since 2024</div></div></div>
      <div class="scr-stats"><div class="scr-stat"><b>128</b><span>days</span></div><div class="scr-stat"><b>42</b><span>streak</span></div><div class="scr-stat"><b>8.4k</b><span>minutes</span></div></div>
      <div class="scr-list">${scrRow('Notifications', null, 'On')}${scrRow('Privacy', null, null)}${scrRow('Help & support', null, null)}${scrRow('Sign out', null, null)}</div>
    </main>
    ${scrTabbar(tab)}`,
  list: (tab = 0) => `${scrBar}
    <header class="scr-nav scr-nav--large"><span class="scr-nav-title">Activity</span></header>
    <main class="scr-body">
      <div class="scr-segment"><button class="is-active">All</button><button>This week</button><button>Saved</button></div>
      <div class="scr-list">${scrRow('Morning run', '3.2 km · 18 min', '↑')}${scrRow('Breathing', '10 min · calm')}${scrRow('Sleep', '7h 42m', 'Good')}${scrRow('Focus block', '50 min')}${scrRow('Evening walk', '1.1 km · 14 min')}</div>
    </main>
    ${scrTabbar(tab)}`,
  settings: (tab = 3) => `${scrBar}
    <header class="scr-nav"><span class="scr-nav-left"></span><span class="scr-nav-title">Settings</span><span class="scr-nav-right"></span></header>
    <main class="scr-body">
      <p class="scr-eyebrow" style="padding-left:4px;">Account</p>
      <div class="scr-list">${scrRow('Profile', null, null)}${scrRow('Subscription', null, 'Pro')}${scrRow('Notifications', null, 'On')}</div>
      <p class="scr-eyebrow" style="padding-left:4px;">Preferences</p>
      <div class="scr-list">${scrRow('Appearance', null, 'Dark')}${scrRow('Language', null, 'English')}${scrRow('Privacy', null, null)}</div>
      <div class="scr-list">${scrRow('Sign out', null, null)}</div>
    </main>
    ${scrTabbar(tab)}`,
  dashboard: (tab = 0) => `${scrBar}
    <header class="scr-nav scr-nav--large"><span class="scr-nav-title">Today</span></header>
    <main class="scr-body">
      <div class="scr-stats"><div class="scr-stat"><b>87%</b><span>goal</span></div><div class="scr-stat"><b>12k</b><span>steps</span></div><div class="scr-stat"><b>6.4h</b><span>focus</span></div></div>
      <div class="scr-section"><div class="scr-section-head"><h2>Recent</h2><a>See all</a></div><div class="scr-list">${scrRow('Morning run', '3.2 km · 18 min')}${scrRow('Breathing', '10 min · calm')}${scrRow('Sleep', '7h 42m', 'Good')}</div></div>
      <article class="scr-card"><div class="scr-media"></div><h3>Wind down tonight</h3><p>A 12-minute ritual tuned to your evening.</p></article>
    </main>
    ${scrTabbar(tab)}`,
  checkout: () => `${scrBar}
    <header class="scr-nav"><span class="scr-nav-left">‹</span><span class="scr-nav-title">Checkout</span><span class="scr-nav-right"></span></header>
    <main class="scr-body">
      <div class="scr-list">${scrRow('Oak chair', 'Qty 1', '$180')}${scrRow('Linen throw', 'Qty 2', '$120')}</div>
      <div class="scr-list"><div class="scr-row"><span class="scr-row-main"><div class="scr-row-title">Subtotal</div></span><span class="scr-row-value">$300</span></div><div class="scr-row"><span class="scr-row-main"><div class="scr-row-title">Shipping</div></span><span class="scr-row-value">$0</span></div><div class="scr-row"><span class="scr-row-main"><div class="scr-row-title" style="font-weight:700;">Total</div></span><span class="scr-row-value" style="color:var(--fg);font-weight:700;">$300</span></div></div>
      <a class="scr-row" style="border-radius:var(--scr-radius);border:0.5px solid var(--border);"><span class="scr-row-ico">▭</span><span class="scr-row-main"><div class="scr-row-title">Visa •••• 4242</div><div class="scr-row-sub">Default</div></span><span class="scr-row-chevron">›</span></a>
    </main>
    <div class="scr-cta"><a class="scr-btn scr-btn--block">Pay $300</a><span class="scr-cta-note">Secure checkout</span></div>`,
  paywall: () => `${scrBar}
    <header class="scr-nav"><span class="scr-nav-left">✕</span><span class="scr-nav-title"></span><span class="scr-nav-right"></span></header>
    <main class="scr-body" style="gap:1.2rem;">
      <div class="scr-hero" style="text-align:center;align-items:center;"><h1>Go further with Pro.</h1><p>Everything unlocked, ad-free, forever-yours.</p></div>
      <div class="scr-list">${scrRow('Unlimited rituals', 'No daily cap')}${scrRow('Adaptive soundscapes', 'Tuned to your evening')}${scrRow('Offline downloads', 'Airplane mode welcome')}</div>
      <div class="scr-stats"><div class="scr-stat" style="outline:2px solid var(--accent);"><b>$8</b><span>monthly</span></div><div class="scr-stat"><b>$60</b><span>yearly · save 38%</span></div></div>
    </main>
    <div class="scr-cta"><a class="scr-btn scr-btn--block">Start 14-day free trial</a><a class="scr-btn scr-btn--text">Restore purchase</a></div>`,
  // ---- real native patterns (sheets, FAB, player, empty state) ----
  fablist: (tab = 0) => `${scrBar}
    <header class="scr-nav scr-nav--large"><span class="scr-nav-title">Tasks</span></header>
    <main class="scr-body">
      <div class="scr-segment"><button class="is-active">Today</button><button>Upcoming</button><button>Done</button></div>
      <div class="scr-list">${scrRow('Design review', '10:00 · Studio')}${scrRow('Write the brief', 'Due today')}${scrRow('Call with Sam', '2:30 · 30 min')}${scrRow('Ship the build', 'Due tomorrow')}</div>
    </main>
    <button class="scr-fab">+</button>
    ${scrTabbar(tab)}`,
  player: () => `${scrBar}
    <header class="scr-nav"><span class="scr-nav-left">‹</span><span class="scr-nav-title">Now playing</span><span class="scr-nav-right">⋯</span></header>
    <main class="scr-body" style="justify-content:space-between;">
      <div class="scr-media" style="aspect-ratio:1/1;border-radius:20px;margin-top:0.5rem;"></div>
      <div style="text-align:center;">
        <div style="font:800 1.5rem/1.1 var(--font-head,inherit);letter-spacing:-0.02em;">Slow Evenings</div>
        <div style="color:var(--muted);font-size:15px;margin-top:4px;">The Quiet Hours</div>
      </div>
      <div>
        <div style="height:4px;border-radius:2px;background:var(--border);position:relative;"><div style="position:absolute;left:0;top:0;height:4px;width:38%;border-radius:2px;background:var(--accent);"></div></div>
        <div style="display:flex;justify-content:space-between;color:var(--muted);font-size:12px;margin-top:6px;"><span>1:24</span><span>-2:11</span></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:2rem;font-size:1.6rem;color:var(--fg);">
        <span>⏮</span><button class="scr-fab" style="position:static;width:64px;height:64px;">▶</button><span>⏭</span>
      </div>
    </main>`,
  sheet: () => `${scrBar}
    <header class="scr-nav scr-nav--large"><span class="scr-nav-title">Discover</span></header>
    <main class="scr-body" style="filter:brightness(0.5);">
      <article class="scr-card"><div class="scr-media"></div><h3>Featured today</h3></article>
      <div class="scr-list">${scrRow('Nearby', '12 places')}${scrRow('Trending', 'Updated now')}</div>
    </main>
    <div class="scr-sheet">
      <div class="scr-media" style="aspect-ratio:16/9;"></div>
      <div class="scr-hero" style="padding-top:0.6rem;"><h1 style="font-size:1.5rem;">The case for slow evenings</h1><p>A 6-minute read on winding down with intention.</p></div>
      <a class="scr-btn scr-btn--block">Open</a>
    </div>`,
  empty: (tab = 2) => `${scrBar}
    <header class="scr-nav scr-nav--large"><span class="scr-nav-title">Library</span></header>
    <main class="scr-body" style="justify-content:center;align-items:center;text-align:center;gap:1rem;">
      <div class="scr-avatar" style="width:72px;height:72px;font-size:30px;opacity:0.7;">◇</div>
      <div class="scr-hero" style="align-items:center;"><h1 style="font-size:1.4rem;">Nothing saved yet</h1><p>Items you save will show up here for offline access.</p></div>
      <a class="scr-btn" style="max-width:220px;">Browse library</a>
    </main>
    ${scrTabbar(tab)}`,
};

function renderComposedApp(genre, t, screens, presetName) {
  const links = ['structure/structure.css', 'colors/palettes.css', 'taste/density.css', 'taste/motion.css', 'taste/fonts.css', 'taste/aesthetic.css', 'structure/app-shell.css']
    .map((h) => `  <link rel="stylesheet" href="${h}">`).join('\n');
  const frames = screens.map((s) => {
    const inner = (MOBILE_SHELLS[s.shell] || MOBILE_SHELLS.feed)(s.tab ?? 0);
    return `  <!-- ${s.screen} (${s.shell}): drop in ${s.component || '(build from .scr-* shells)'} -->\n  <div class="scr-frame"><div class="scr">\n    ${inner}\n  </div></div>`;
  }).join('\n\n');
  const manifest = screens.map((s) => `     ${(s.screen + ':').padEnd(14)} shell .scr (${s.shell})  →  ${s.component || '(no standalone component — shells only)'}`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${genre} app${presetName ? ' · ' + presetName : ''} — composed by frontendmaxxing</title>
${links}
</head>
<body class="struct pal-${t.palette}" data-aesthetic="${t.aesthetic}" data-font-pair="${t.fontPair}" data-motion="${t.motion}" data-density="${t.density}" style="background:#0a0a0e;">

<div class="app-flow">
${frames}
</div>

<!-- ============================================
     APP FLOW MANIFEST — real vault mobile/ components to drop into each screen.
     get_snippet <path> for paste-ready code. Screens render on-brand from the
     structure/app-shell.css .scr-* shells BEFORE the parts are wired in.
${manifest}
     ============================================ -->
</body>
</html>`;
}

// Pure: assemble a renderable app SCREEN FLOW for a genre + taste.
// deps = { presets, palByName } (search/byPath unused — mobile picks are curated).
export function composeApp(genre, opts, deps) {
  opts = opts || {};
  deps = deps || {};
  const { presets, palByName } = deps;
  const warnings = [];
  genre = String(genre || 'app').toLowerCase();
  const flow = MOBILE_FLOWS[genre] || MOBILE_FLOWS.app;

  let base = {};
  if (opts.preset) {
    const p = presets && presets.get ? presets.get(opts.preset) : null;
    if (p) base = { aesthetic: p.aesthetic, palette: p.palette, fontPair: p.fontPair, motion: p.motion, density: p.density };
    else warnings.push(`unknown preset "${opts.preset}" — ignored`);
  }
  const aesthetic = opts.aesthetic || base.aesthetic || MOBILE_GENRE_AESTHETIC[genre] || 'minimal';
  const def = AESTHETIC_DEFAULTS[aesthetic] || AESTHETIC_DEFAULTS.minimal;
  const fontPair = opts.fontPair || base.fontPair || def.fontPair;
  const motion = opts.motion || base.motion || def.motion;
  const density = opts.density || base.density || def.density;
  const seed = Number.isFinite(+opts.seed) ? Math.abs(Math.floor(+opts.seed)) : 0;
  // seed-driven palette diversity (shortlist[0] = old default → seed 0 unchanged);
  // pinned palette/preset always wins.
  let palette = opts.palette || base.palette;
  if (!palette) {
    const shortlist = MOBILE_PALETTE_SHORTLIST[genre];
    palette = (shortlist && shortlist.length) ? shortlist[seed % shortlist.length] : def.palette;
  }
  if (palByName && !palByName.has(palette)) {
    warnings.push(`palette "${palette}" not found — using "${def.palette}"`);
    palette = def.palette;
  }

  const screens = flow.map((sc) => {
    const cands = MOBILE_SLOT_COMPONENTS[sc.slot] || [];
    const component = cands.length ? cands[seed % cands.length] : null;
    return { screen: sc.screen, shell: sc.shell, slot: sc.slot, tab: sc.tab, component };
  });

  const theme = { palette, aesthetic, fontPair, motion, density };
  const html = renderComposedApp(genre, theme, screens, opts.preset || null);
  return { genre, platform: 'mobile', preset: opts.preset || null, theme, tokenOverrides: theme, screens, html, warnings };
}

// ============================================================================
// DECK — third platform peer (web · mobile · deck). 16:9 slide scaffolds composed
// deterministically from structure/deck.css shells, themed by the taste tokens,
// content carried per-slide so a composed deck reads real out of the box.
// ============================================================================
export const DECK_GENRE_AESTHETIC = { pitch: 'energetic', product: 'minimal', report: 'technical', lecture: 'editorial' };
export const DECK_PALETTE_SHORTLIST = {
  pitch: ['cinnabar', 'electric-night', 'saas-indigo'],
  product: ['saas-indigo', 'clean-light', 'sky-celadon'],
  report: ['slate-dark', 'fintech-navy', 'charcoal'],
  lecture: ['ink', 'paper', 'luxe-cream'],
};
export const DECK_FLOWS = {
  pitch: [
    { slide: 'Title', shell: 'title', slot: 'title', kicker: 'Seed · 2026', title: 'Ship design at the speed of thought.', lead: 'A deterministic design workbench that drafts, verifies, and hands off production-ready UI.', notes: 'Open with the one-line promise. Slow down — let it land.' },
    { slide: 'Problem', shell: 'bullets', slot: 'problem', title: 'Design is the bottleneck.', bullets: ['Mockups take days; handoff loses fidelity.', 'Every page gets rebuilt from scratch.', 'No way to prove a design actually works.'], notes: 'Name the pain the buyer already feels.' },
    { slide: 'Solution', shell: 'twocol', slot: 'solution', title: 'One vault, one verified output.', bullets: ['Compose from 900+ vetted snippets', 'Themed by a coherent taste system', "Gated: it renders clean or it doesn't ship"], notes: 'The wedge is verification — nobody else gates.' },
    { slide: 'How', shell: 'bullets', slot: 'how', title: 'How it works.', bullets: ['Pick a genre → deterministic scaffold', 'Theme with one palette + aesthetic', 'Save-gate renders it headless and proves it'], notes: '' },
    { slide: 'Traction', shell: 'stats', slot: 'traction', title: 'Early traction.', stats: [{ v: '900+', l: 'vetted snippets' }, { v: '61', l: 'palettes' }, { v: '100%', l: 'gate-verified pages' }], notes: 'Lead with the most credible number.' },
    { slide: 'Ask', shell: 'bullets', slot: 'ask', title: 'The ask.', bullets: ['$1.5M to scale the vault + cloud render', '18-month runway to 10k teams', 'Hiring two design engineers'], notes: '' },
    { slide: 'Close', shell: 'quote', slot: 'close', title: 'Design that proves itself.', lead: '— Apex Design', notes: 'End on the tagline. Hold the silence.' },
  ],
  product: [
    { slide: 'Title', shell: 'title', slot: 'title', kicker: 'Product · v2', title: 'Meet the workbench.', lead: 'Composed, not generated — and verified before it ever leaves your hands.', notes: '' },
    { slide: 'Agenda', shell: 'bullets', slot: 'agenda', title: 'Today', bullets: ['The problem', 'The product', 'Live demo', 'The numbers', "What's next"], notes: '' },
    { slide: 'Feature', shell: 'twocol', slot: 'feature', title: 'Composed, not generated.', bullets: ['Deterministic scaffolds', 'Real snippet picks per slot', 'Coherent taste tokens'], notes: '' },
    { slide: 'Demo', shell: 'media', slot: 'demo', title: 'See it run.', lead: 'From a one-line brief to a verified page in seconds.', notes: 'Switch to the live demo here.' },
    { slide: 'Metrics', shell: 'stats', slot: 'metrics', title: 'By the numbers.', stats: [{ v: '2.5min', l: 'full-vault verify' }, { v: '0', l: 'console errors shipped' }, { v: '676', l: 'snippets render-proofed' }], notes: '' },
    { slide: 'Roadmap', shell: 'bullets', slot: 'roadmap', title: "What's next.", bullets: ['Deck + editable PPTX export', 'Lottie motion, validated', 'Perceptual color audit'], notes: '' },
    { slide: 'CTA', shell: 'cta', slot: 'cta', title: 'Start composing.', lead: 'Free while in beta.', cta: 'Get started', notes: '' },
  ],
  report: [
    { slide: 'Title', shell: 'title', slot: 'title', kicker: 'Quarterly Report · Q2', title: 'Design Ops, Q2.', lead: 'Throughput, quality, and what we shipped.', notes: '' },
    { slide: 'Agenda', shell: 'bullets', slot: 'agenda', title: 'Contents', bullets: ['Highlights', 'KPIs', 'Findings', 'Recommendations'], notes: '' },
    { slide: 'Divider', shell: 'divider', slot: 'divider', kicker: '01', title: 'The numbers.', notes: '' },
    { slide: 'KPIs', shell: 'stats', slot: 'kpis', title: 'KPIs.', stats: [{ v: '+38%', l: 'pages shipped' }, { v: '4.9', l: 'quality score' }, { v: '-22%', l: 'rework' }], notes: '' },
    { slide: 'Findings', shell: 'bullets', slot: 'findings', title: 'What we learned.', bullets: ['Verification cut rework by a fifth', 'One palette per page lifted coherence', 'Decks were the top request'], notes: '' },
    { slide: 'Chart', shell: 'media', slot: 'chart', title: 'Trend.', lead: '', notes: '' },
    { slide: 'Takeaways', shell: 'bullets', slot: 'takeaways', title: 'Recommendations.', bullets: ['Make the gate mandatory pre-handoff', 'Invest in the deck pipeline', 'Expand the heritage palettes'], notes: '' },
  ],
};
const deckMedia = '<div class="s-slide-media"></div>';
const DECK_SHELLS = {
  title: (s) => `${s.kicker ? `<p class="s-eyebrow">${s.kicker}</p>` : ''}<h1 class="s-slide-title">${s.title}</h1>${s.lead ? `<p class="s-slide-lead">${s.lead}</p>` : ''}`,
  bullets: (s) => `<h2 class="s-slide-head">${s.title}</h2><ul class="s-slide-bullets">${(s.bullets || []).map((b) => `<li>${b}</li>`).join('')}</ul>`,
  twocol: (s) => `<h2 class="s-slide-head">${s.title}</h2><div class="s-slide-body"><div class="s-slide-col"><ul class="s-slide-bullets">${(s.bullets || []).map((b) => `<li>${b}</li>`).join('')}</ul></div>${deckMedia}</div>`,
  stats: (s) => `<h2 class="s-slide-head">${s.title}</h2><div class="s-slide-body" style="align-items:center;"><div class="s-slide-stats">${(s.stats || []).map((x) => `<div class="s-slide-stat"><b>${x.v}</b><span>${x.l}</span></div>`).join('')}</div></div>`,
  media: (s) => `<h2 class="s-slide-head">${s.title}</h2>${s.lead ? `<p class="s-slide-lead" style="margin-bottom:1rem;">${s.lead}</p>` : ''}<div class="s-slide-body">${deckMedia}</div>`,
  quote: (s) => `<h1 class="s-slide-title">${s.title}</h1>${s.lead ? `<p class="s-slide-lead" style="margin-top:1.2rem;">${s.lead}</p>` : ''}`,
  cta: (s) => `<h1 class="s-slide-title">${s.title}</h1>${s.lead ? `<p class="s-slide-lead">${s.lead}</p>` : ''}<div class="s-slide-cta"><a>${s.cta || 'Get started'}</a></div>`,
  divider: (s) => `${s.kicker ? `<p class="s-eyebrow">${s.kicker}</p>` : ''}<h1 class="s-slide-title">${s.title}</h1>`,
};
const DECK_MOD = { title: 'title', quote: 'quote', divider: 'divider', cta: 'center' };

function renderComposedDeck(genre, t, slides, presetName) {
  const links = ['structure/structure.css', 'colors/palettes.css', 'taste/density.css', 'taste/motion.css', 'taste/fonts.css', 'taste/aesthetic.css', 'structure/deck.css']
    .map((h) => `  <link rel="stylesheet" href="${h}">`).join('\n');
  const stage = slides.map((s, i) => {
    const mod = DECK_MOD[s.shell] ? ` s-slide--${DECK_MOD[s.shell]}` : '';
    const inner = (DECK_SHELLS[s.shell] || DECK_SHELLS.bullets)(s);
    const notes = s.notes ? `\n    <aside class="s-notes"><span class="s-notes-label">Speaker notes</span>${s.notes}</aside>` : '';
    return `  <div class="s-slide-wrap">\n    <section class="s-slide${mod}" data-db-ref="s${i}-${s.slot}">${inner}<span class="s-slide-num">${i + 1} / ${slides.length}</span></section>${notes}\n  </div>`;
  }).join('\n\n');
  const manifest = slides.map((s, i) => `     ${(String(i + 1) + '. ' + s.slide + ':').padEnd(20)} .s-slide (${s.shell})`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${genre} deck${presetName ? ' · ' + presetName : ''} — composed by frontendmaxxing</title>
${links}
</head>
<body class="struct pal-${t.palette}" data-aesthetic="${t.aesthetic}" data-font-pair="${t.fontPair}" data-motion="${t.motion}" data-density="${t.density}">
<div class="deck-stage">
${stage}
</div>
<!-- ============================================
     DECK MANIFEST — ${slides.length} slides (16:9). Each .s-slide is a fixed stage;
     speaker notes are siblings outside the measured box. Export to editable .pptx
     via book_export_pptx (each slide → native PowerPoint shapes).
${manifest}
     ============================================ -->
</body>
</html>`;
}

// Pure: assemble a renderable 16:9 SLIDE DECK for a genre + taste. Mirrors
// composeApp. deps = { presets, palByName }.
export function composeDeck(genre, opts, deps) {
  opts = opts || {};
  deps = deps || {};
  const { presets, palByName } = deps;
  const warnings = [];
  genre = String(genre || 'pitch').toLowerCase();
  const flow = DECK_FLOWS[genre] || DECK_FLOWS.pitch;

  let base = {};
  if (opts.preset) {
    const p = presets && presets.get ? presets.get(opts.preset) : null;
    if (p) base = { aesthetic: p.aesthetic, palette: p.palette, fontPair: p.fontPair, motion: p.motion, density: p.density };
    else warnings.push(`unknown preset "${opts.preset}" — ignored`);
  }
  const aesthetic = opts.aesthetic || base.aesthetic || DECK_GENRE_AESTHETIC[genre] || 'minimal';
  const def = AESTHETIC_DEFAULTS[aesthetic] || AESTHETIC_DEFAULTS.minimal;
  const fontPair = opts.fontPair || base.fontPair || def.fontPair;
  const motion = opts.motion || base.motion || def.motion;
  const density = opts.density || base.density || def.density;
  const seed = Number.isFinite(+opts.seed) ? Math.abs(Math.floor(+opts.seed)) : 0;
  let palette = opts.palette || base.palette;
  if (!palette) {
    const shortlist = DECK_PALETTE_SHORTLIST[genre];
    palette = (shortlist && shortlist.length) ? shortlist[seed % shortlist.length] : def.palette;
  }
  if (palByName && !palByName.has(palette)) {
    warnings.push(`palette "${palette}" not found — using "${def.palette}"`);
    palette = def.palette;
  }

  const slides = flow.map((s) => ({ ...s }));
  const theme = { palette, aesthetic, fontPair, motion, density };
  const html = renderComposedDeck(genre, theme, slides, opts.preset || null);
  return { genre, platform: 'deck', preset: opts.preset || null, theme, tokenOverrides: theme, slides, html, warnings };
}

// Pure: score an HTML string for taste-cohesion. Mirrors the Phase 5 audit soft
// checks. Returns { score 0..100, ok, counts, warnings:[{type,count,sample,hint}] }.
export function checkCoherence(html) {
  html = String(html || '');
  const scrub = html.replace(/var\([^)]*\)/g, ' '); // var(--x,#fallback) fallbacks are legit
  const counts = {};
  const warnings = [];
  const add = (type, arr, hint) => {
    if (arr && arr.length) { counts[type] = arr.length; warnings.push({ type, count: arr.length, sample: arr.slice(0, 3), hint }); }
  };

  // 1. hardcoded hex used as a value (outside palette defs / var fallbacks)
  add('hardcoded-hex', scrub.match(/#[0-9a-fA-F]{3,8}\b/g), 'use palette tokens: var(--accent), var(--surface), var(--fg), var(--border)…');

  // 2. unblessed transition/animation durations — only inside transition/animation
  //    declarations, so copy text like "40ms median latency" never trips it
  const dur = [];
  const durRe = /(?:transition|animation)(?:-duration|-delay)?\s*:\s*([^;{}"']+)/gi;
  let dm;
  while ((dm = durRe.exec(scrub))) {
    (dm[1].match(/\b\d*\.?\d+m?s\b/g) || []).forEach((tok) => {
      const ms = /ms$/.test(tok) ? parseFloat(tok) : parseFloat(tok) * 1000;
      if (!Number.isFinite(ms) || ms <= 1) return; // ignore reduced-motion 0.01ms
      if (BLESSED_MS.indexOf(ms) === -1) dur.push(tok);
    });
  }
  add('unblessed-duration', dur, 'use var(--m-dur-fast|--m-dur|--m-dur-slow). Blessed: ' + BLESSED_MS.join('/') + 'ms');

  // 3. literal px border-radius
  add('px-radius', scrub.match(/border-radius\s*:\s*\d+px/gi), 'use var(--radius) / var(--radius-sm)');

  // 4. slop scale hover (scale(1.0x)/scale(1.1x))
  add('slop-hover', scrub.match(/scale\(\s*1\.(?:0[1-9]|1\d?)\d*\s*\)/g), 'lift with var(--ts-hover-lift) + var(--ts-elevation) instead of scale(1.0x)');

  // 5. AUTHENTICITY — the "AI tell" law (the #1 thing the council surfaced).
  //    Measured on the RAW html (url()/gradients matter here, not after scrub).
  //    Gradients carrying a page with NO real imagery is the single biggest
  //    "looks AI-generated" signal. Penalties apply ONLY to full pages — a
  //    component snippet legitimately has no hero image, so it isn't dinged.
  const isPage = /<!doctype|<body[\s>]/i.test(html);
  const imgTags = (html.match(/<(?:img|picture|video)[\s>]/gi) || []).length;
  const canvasTags = (html.match(/<canvas[\s>]/gi) || []).length;
  const bgImageUrls = (html.match(/background(?:-image)?\s*:\s*[^;}"']*url\(/gi) || []).length;
  // inline <svg> counts as imagery only when it's a real drawing (has shape
  // elements and meaningful length) — not a 1-glyph icon.
  const svgArt = (html.match(/<svg[\s\S]*?<\/svg>/gi) || [])
    .filter((s) => /<(?:path|polygon|polyline|circle|ellipse|rect)\b/i.test(s) && s.length > 160).length;
  const imageCount = imgTags + canvasTags + bgImageUrls + svgArt;
  const gradientCount = (html.match(/(?:linear|radial|conic)-gradient\(/gi) || []).length;
  const scriptCount = (html.match(/<script[\s>]/gi) || []).length;
  const motionDecl = /@keyframes|animation\s*:|animation-name\s*:|transition\s*:|data-anim|IntersectionObserver|\.is-in\b/i.test(html);
  const motionSignals = scriptCount + (motionDecl ? 1 : 0);
  const tells = [];
  if (gradientCount >= 2 && imageCount === 0) tells.push('GRADIENT-HEAVY-NO-IMAGERY');
  if (imageCount === 0) tells.push('NO-IMAGERY');
  if (motionSignals === 0) tells.push('NO-MOTION');
  const authenticity = {
    imageCount, gradientCount, motionSignals,
    bespoke: imageCount > 0 && !(gradientCount >= 2 && imageCount === 0),
    tells,
  };
  let authPenalty = 0;
  if (isPage) {
    if (gradientCount >= 2 && imageCount === 0) {
      authPenalty += 40; // HARD — the only authenticity check that should breach the save-gate
      warnings.push({ type: 'gradient-heavy-no-imagery', count: gradientCount, sample: [],
        hint: 'the #1 AI tell: gradients carrying a page with no real imagery. Generate a hero image (book_generate_image) or mount an illustration (svg/illustrations.js), and drop a gradient.' });
    }
    if (imageCount === 0) {
      authPenalty += 12; // SOFT — signals the deficit on every fresh draft without auto-failing
      warnings.push({ type: 'no-imagery', count: 1, sample: [],
        hint: 'no images/illustration/video on the page — add real imagery: book_generate_image for photos, svg/illustrations.js (Illustrations.get/mount) for vector scenes. The biggest "looks AI-generated" tell.' });
    }
    if (motionSignals === 0) {
      authPenalty += 6; // SOFT advisory — a fresh draft may add motion later
      warnings.push({ type: 'no-motion', count: 1, sample: [],
        hint: 'no motion at all — wire a reveal-on-scroll or a tasteful transition (taste/motion-profiles.js, animations/*).' });
    }
  }

  const penalty = (counts['hardcoded-hex'] || 0) * 4 + (counts['unblessed-duration'] || 0) * 6 + (counts['px-radius'] || 0) * 3 + (counts['slop-hover'] || 0) * 12 + authPenalty;
  const score = Math.max(0, 100 - Math.min(100, penalty));
  return { score, ok: score >= 80, counts, warnings, authenticity };
}

// =====================================================
// Server setup
// =====================================================
async function main() {
  // deps are loaded here (not at module top) so the pure helpers stay zero-dep importable
  const { McpServer, ResourceTemplate } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  const { z } = await import('zod');

  // Zod shape for structured snippet output (used by several tools below)
  const SNIPPET_OUT = {
    file: z.string(), path: z.string(), kind: z.string(), folder: z.string(),
    global: z.string().nullable(), tags: z.array(z.string()), description: z.string(),
    demoUrl: z.string()
  };

  const libraryRoot = await resolveLibraryRoot();
  const indexText = await readFile(join(libraryRoot, 'INDEX.md'), 'utf8');
  const entries = parseIndex(indexText);

  const byPath = new Map(entries.map((e) => [e.path, e]));
  const byFolder = new Map();
  for (const e of entries) {
    if (!byFolder.has(e.folder)) byFolder.set(e.folder, []);
    byFolder.get(e.folder).push(e);
  }
  const { search } = buildSearchIndex(entries);
  const { companions, related } = buildRelations(entries);

  // Build the full doc registry — EVERY queryable markdown across the repo:
  // skill decision-trees, reference guides, meta docs, and the claude-skills
  // packages (blender/web3d/webgpu). Titles come from frontmatter or H1.
  const allMd = await readdir(libraryRoot, { recursive: true }).catch(() => []);
  const docs = [];
  for (const rel of allMd) {
    const relNorm = String(rel).replace(/\\/g, '/');
    if (!relNorm.endsWith('.md')) continue;
    const c = classifyDoc(relNorm);
    if (!c) continue;
    let title = c.name;
    try { title = docTitle((await readFile(join(libraryRoot, relNorm), 'utf8')).slice(0, 4000), c.name); } catch {}
    docs.push({ name: c.name, kind: c.kind, title, path: relNorm });
  }
  docs.sort((a, b) => a.name.localeCompare(b.name));
  const docByName = new Map(docs.map((d) => [d.name, d]));
  // Alias each package SKILL.md by its folder name (so "blender-shader-nodes"
  // resolves to claude-skills/blender/blender-shader-nodes/SKILL).
  const docAlias = new Map();
  for (const d of docs) {
    if (d.kind === 'package' && /\/SKILL$/.test(d.name)) {
      const parent = d.name.split('/').slice(-2, -1)[0];
      if (parent) docAlias.set(parent.toLowerCase(), d);
    }
  }
  // Flexible name resolution: exact → name.skill → alias → case-insensitive → leaf → segment
  function resolveDoc(name, kindFilter) {
    const pool = kindFilter ? docs.filter((d) => d.kind === kindFilter) : docs;
    const n = String(name).replace(/\.md$/, '').replace(/\\/g, '/');
    const nl = n.toLowerCase();
    const get = (nm) => pool.find((d) => d.name === nm);
    return get(n) || get(n + '.skill')
      || (docAlias.has(nl) && (!kindFilter || docAlias.get(nl).kind === kindFilter) ? docAlias.get(nl) : null)
      || pool.find((d) => d.name.toLowerCase() === nl)
      || pool.find((d) => d.name.toLowerCase().endsWith('/' + nl))
      || pool.find((d) => d.name.toLowerCase().split('/').includes(nl)) || null;
  }
  const skillDocs = docs.filter((d) => d.kind === 'skill');

  // Parse the 55 color palettes into structured theme data.
  let palettes = [];
  try { palettes = parsePalettes(await readFile(join(libraryRoot, 'colors/palettes.css'), 'utf8')); } catch {}
  const palByName = new Map(palettes.map((p) => [p.name, p]));

  // Load the taste-preset registry (single source of truth: taste/presets.js, UMD/CJS).
  let tastePresets = null;
  try { tastePresets = require(join(libraryRoot, 'taste/presets.js')); } catch (e) { process.stderr.write(`[frontendmaxxing-mcp] taste/presets.js load failed: ${e.message}\n`); }

  const server = new McpServer({ name: 'frontendmaxxing', version: '2.0.0' });
  const RO = { readOnlyHint: true, openWorldHint: false };

  function pathError(p) {
    return { content: [{ type: 'text', text: `_Not in INDEX: \`${p}\`. Use search_components / list_components for valid paths._` }], isError: true };
  }

  // ---- list_categories ----
  server.registerTool('list_categories', {
    title: 'List categories',
    description: `List all ${byFolder.size} folders with snippet counts + descriptions. Start here to decide which category to drill into.`,
    inputSchema: {},
    outputSchema: { total: z.number(), folders: z.array(z.object({ folder: z.string(), count: z.number(), description: z.string() })) },
    annotations: RO
  }, async () => {
    const folders = Array.from(byFolder.keys()).sort().map((f) => ({ folder: f, count: byFolder.get(f).length, description: FOLDER_DESCRIPTIONS[f] || '' }));
    const text = ['# frontendmaxxing categories', `${entries.length} snippets across ${folders.length} folders.`, '',
      ...folders.map((f) => `**\`${f.folder}/\`** · ${f.count}\n  ${f.description}`)].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { total: entries.length, folders } };
  });

  // ---- list_components ----
  server.registerTool('list_components', {
    title: 'List components',
    description: 'Browse the catalog. Filter by folder (e.g. "components", "ai", "effects") and/or kind (CSS/JS).',
    inputSchema: {
      folder: z.string().optional().describe('Folder to filter by, e.g. "components", "ai", "shaders".'),
      kind: z.enum(['CSS', 'JS']).optional().describe('Only CSS or only JS.'),
      limit: z.number().int().positive().max(500).default(100)
    },
    outputSchema: { total: z.number(), shown: z.number(), results: z.array(z.object(SNIPPET_OUT)) },
    annotations: RO
  }, async ({ folder, kind, limit }) => {
    let list = entries.slice();
    if (folder) list = list.filter((e) => e.folder === folder);
    if (kind) list = list.filter((e) => e.kind === kind);
    const total = list.length;
    list = list.slice(0, limit);
    const results = list.map((e) => snippetSummary(e));
    const text = [`# ${folder ? folder + '/' : 'All components'}${kind ? ' (' + kind + ')' : ''}`,
      `Showing ${list.length} of ${total}`, '',
      ...list.map((e) => `**${e.file}** \`${e.path}\` — ${e.desc}`)].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { total, shown: list.length, results } };
  });

  // ---- search_components ----
  server.registerTool('search_components', {
    title: 'Search components',
    description: 'Search the vault by keywords/vibe. BM25 ranking with synonym expansion and typo/plural tolerance over tags, descriptions, file names and globals. Returns ranked matches.',
    inputSchema: {
      query: z.string().describe('Keywords/vibe. E.g. "streaming chat token by token", "kanban drag drop", "aurora hero background", "loading spinner".'),
      limit: z.number().int().positive().max(50).default(10)
    },
    outputSchema: { query: z.string(), count: z.number(), results: z.array(z.object({ ...SNIPPET_OUT, score: z.number() })) },
    annotations: RO
  }, async ({ query, limit }) => {
    const hits = search(query, limit);
    const results = hits.map(({ entry, score }) => snippetSummary(entry, score));
    const text = [`# Search: "${query}" — ${hits.length} match${hits.length === 1 ? '' : 'es'}`, '',
      hits.length === 0
        ? '_No matches. Try simpler/alternate keywords — the vault has 800+ files so something likely fits._'
        : hits.map(({ entry, score }) => `**${entry.file}** \`${entry.path}\` (score ${score})${entry.global ? ' · global: `' + entry.global + '`' : ''}\n  ${entry.desc}`).join('\n\n')
    ].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { query, count: hits.length, results } };
  });

  // ---- recommend ----
  server.registerTool('recommend', {
    title: 'Recommend snippets',
    description: 'Free-form "I need X" → top matches with rationale. Also flags CSS/JS companions you should grab together.',
    inputSchema: {
      description: z.string().describe('What you are building. E.g. "a chat input with file attachments and an auto-growing textarea".'),
      limit: z.number().int().positive().max(10).default(5)
    },
    outputSchema: { count: z.number(), recommendations: z.array(z.object({ ...SNIPPET_OUT, score: z.number(), companions: z.array(z.string()) })) },
    annotations: RO
  }, async ({ description, limit }) => {
    const hits = search(description, limit);
    const recommendations = hits.map(({ entry, score }) => ({ ...snippetSummary(entry, score), companions: companions(entry).map((c) => c.path) }));
    const text = hits.length === 0
      ? `_No matches for "${description}". Try simpler keywords or list_components._`
      : [`# Recommendations: "${description}"`, '', ...hits.map(({ entry, score }, i) => {
          const comp = companions(entry).map((c) => c.path);
          return [`### ${i + 1}. \`${entry.path}\` · score ${score}`, entry.desc,
            entry.global ? '_Global: `' + entry.global + '`_' : '',
            comp.length ? `_Companion (use together): ${comp.join(', ')}_` : '',
            `→ get_snippet("${entry.path}") for the paste-ready bundle.`].filter(Boolean).join('\n');
        })].join('\n\n');
    return { content: [{ type: 'text', text }], structuredContent: { count: hits.length, recommendations } };
  });

  // ---- get_snippet (companion-aware bundle) ----
  server.registerTool('get_snippet', {
    title: 'Get snippet bundle',
    description: 'Everything needed to USE a snippet: the file + its CSS/JS companion, the Usage block, variants, and the live-demo link — as one paste-ready unit. Prefer this over get_source when you intend to use the snippet.',
    inputSchema: { path: z.string().describe('Path within the library, e.g. "ai/tool-call-card.js" or "components/cards.css".') },
    annotations: RO
  }, async ({ path }) => {
    const clean = path.replace(/^\/+/, '').replace(/\\/g, '/');
    const entry = byPath.get(clean);
    if (!entry) return pathError(clean);
    const files = [entry, ...companions(entry)];
    const parts = [`# ${entry.base.split('/').pop()} — paste-ready bundle`,
      `Files: ${files.map((f) => '`' + f.path + '`').join(' + ')}`,
      entry.global ? `Global: \`${entry.global}\`` : '',
      `Demo: ${demoUrl(entry)}`, '', entry.desc, ''];
    for (const f of files) {
      const src = await readFile(join(libraryRoot, f.path), 'utf8');
      const usage = extractBlock(src, 'Usage');
      const variants = extractBlock(src, 'Variants');
      parts.push(`## \`${f.path}\``);
      if (usage) parts.push('**Usage:**\n```\n' + usage + '\n```');
      if (variants) parts.push('**Variants:** ' + variants.replace(/\n/g, ' '));
      parts.push('```' + (f.kind === 'CSS' ? 'css' : 'js') + '\n' + src + '\n```', '');
    }
    return { content: [{ type: 'text', text: parts.filter(Boolean).join('\n') }] };
  });

  // ---- get_source ----
  server.registerTool('get_source', {
    title: 'Get source',
    description: 'Return the full source of a single file. Use get_snippet instead if you want the companion + usage bundle.',
    inputSchema: { path: z.string().describe('Path, e.g. "ai/streaming-text.css".') },
    annotations: RO
  }, async ({ path }) => {
    const clean = path.replace(/^\/+/, '').replace(/\\/g, '/');
    const entry = byPath.get(clean);
    if (!entry) return pathError(clean);
    const source = await readFile(join(libraryRoot, clean), 'utf8');
    return { content: [{ type: 'text', text: [`# ${entry.file}`,
      `Path: \`${entry.path}\` · ${entry.kind}${entry.global ? ' · `' + entry.global + '`' : ''} · demo: ${demoUrl(entry)}`,
      '', '```' + (entry.kind === 'CSS' ? 'css' : 'js'), source, '```'].join('\n') }] };
  });

  // ---- get_examples ----
  server.registerTool('get_examples', {
    title: 'Get usage examples',
    description: 'Extract just the Usage + Variants blocks from a file header — quick reference without the full implementation.',
    inputSchema: { path: z.string().describe('Path, e.g. "ai/tool-call-card.js".') },
    annotations: RO
  }, async ({ path }) => {
    const clean = path.replace(/^\/+/, '').replace(/\\/g, '/');
    const entry = byPath.get(clean);
    if (!entry) return pathError(clean);
    const src = await readFile(join(libraryRoot, clean), 'utf8');
    const usage = extractBlock(src, 'Usage');
    const variants = extractBlock(src, 'Variants');
    return { content: [{ type: 'text', text: [`# Usage: ${entry.file}`, `Path: \`${entry.path}\``, '', entry.desc, '',
      usage ? '**Usage:**\n```\n' + usage + '\n```' : '_No Usage block — run get_source._',
      variants ? '\n**Variants:** ' + variants.replace(/\n/g, ' ') : ''].join('\n') }] };
  });

  // ---- get_related ----
  server.registerTool('get_related', {
    title: 'Get related snippets',
    description: 'Given a snippet, return its CSS/JS companion plus tag-similar neighbours in the same folder.',
    inputSchema: { path: z.string().describe('Path, e.g. "components/modals.css".'), limit: z.number().int().positive().max(10).default(5) },
    outputSchema: { companions: z.array(z.object(SNIPPET_OUT)), related: z.array(z.object(SNIPPET_OUT)) },
    annotations: RO
  }, async ({ path, limit }) => {
    const clean = path.replace(/^\/+/, '').replace(/\\/g, '/');
    const entry = byPath.get(clean);
    if (!entry) return pathError(clean);
    const comp = companions(entry).map((e) => snippetSummary(e));
    const rel = related(entry, entries, limit).map((e) => snippetSummary(e));
    const text = [`# Related to \`${entry.path}\``, '',
      comp.length ? '**Companions:**\n' + comp.map((c) => `- \`${c.path}\``).join('\n') : '_No companion file._', '',
      rel.length ? '**Similar in folder:**\n' + rel.map((r) => `- \`${r.path}\` — ${r.description}`).join('\n') : '_No close neighbours._'].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { companions: comp, related: rel } };
  });

  // ---- overview (one-call orientation) ----
  server.registerTool('overview', {
    title: 'Vault overview',
    description: 'One-call orientation: totals, every folder + count, all skill docs, palette groups. Call this first to learn what is available before searching.',
    inputSchema: {},
    outputSchema: {
      snippets: z.number(), folders: z.number(), skillDocs: z.number(), guides: z.number(),
      packages: z.number(), palettes: z.number(),
      folderList: z.array(z.object({ folder: z.string(), count: z.number() })),
      skills: z.array(z.string()), paletteGroups: z.array(z.string())
    },
    annotations: RO
  }, async () => {
    const folderList = Array.from(byFolder.keys()).sort().map((f) => ({ folder: f, count: byFolder.get(f).length }));
    const skills = skillDocs.map((d) => d.name);
    const guides = docs.filter((d) => d.kind === 'guide').length;
    const packages = docs.filter((d) => d.kind === 'package').length;
    const paletteGroups = [...new Set(palettes.map((p) => p.group).filter(Boolean))];
    const text = ['# frontendmaxxing overview',
      `${entries.length} snippets · ${folderList.length} folders · ${skillDocs.length} skill docs · ${guides} guides · ${packages} package docs · ${palettes.length} palettes`,
      '', '**Folders:** ' + folderList.map((f) => `${f.folder}(${f.count})`).join(' '),
      '', '**Skill docs:** ' + skills.join(', '),
      '', '**Palette groups:** ' + paletteGroups.join(', '),
      '', 'Next: search_components(query) · get_snippet(path) · get_skill(name) · get_doc(name) · list_palettes() · get_palette(name)'].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { snippets: entries.length, folders: folderList.length, skillDocs: skillDocs.length, guides, packages, palettes: palettes.length, folderList, skills, paletteGroups } };
  });

  // ---- list_docs (EVERY markdown doc — skills, guides, meta, packages) ----
  server.registerTool('list_docs', {
    title: 'List all docs',
    description: 'List every queryable markdown doc: skill decision-trees, reference guides (asset libraries, awwwards inspiration, creative arsenal…), meta docs (AGENTS/CONTRIBUTING/README), and claude-skills packages (blender, web3d, webgpu). Filter by kind.',
    inputSchema: { kind: z.enum(['skill', 'guide', 'meta', 'package']).optional().describe('Filter: skill | guide | meta | package.') },
    outputSchema: { total: z.number(), docs: z.array(z.object({ name: z.string(), kind: z.string(), title: z.string() })) },
    annotations: RO
  }, async ({ kind }) => {
    const list = (kind ? docs.filter((d) => d.kind === kind) : docs).map((d) => ({ name: d.name, kind: d.kind, title: d.title }));
    const text = ['# Docs' + (kind ? ` (${kind})` : ''), `${list.length} docs`, '',
      ...['skill', 'guide', 'meta', 'package'].filter((k) => !kind || k === kind).map((k) => {
        const sub = list.filter((d) => d.kind === k);
        return sub.length ? `## ${k}\n` + sub.map((d) => `- \`${d.name}\` — ${d.title}`).join('\n') : '';
      }).filter(Boolean)].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { total: list.length, docs: list } };
  });

  // ---- get_doc (fetch any doc by name) ----
  server.registerTool('get_doc', {
    title: 'Get any doc',
    description: 'Return the full text of any doc by name — a skill ("gradients"), guide ("creative-arsenal"), meta ("AGENTS"), or package SKILL ("blender-shader-nodes" or "claude-skills/web3d/react-three-fiber/SKILL"). Use list_docs to discover names.',
    inputSchema: { name: z.string().describe('Doc name from list_docs (flexible: leaf names like "blender-shader-nodes" also resolve).') },
    annotations: RO
  }, async ({ name }) => {
    const d = resolveDoc(name);
    if (!d) return { content: [{ type: 'text', text: `_No doc "${name}". Use list_docs._` }], isError: true };
    const text = await readFile(join(libraryRoot, d.path), 'utf8');
    return { content: [{ type: 'text', text: `<!-- ${d.name} · ${d.kind} -->\n` + text }] };
  });

  // ---- list_skills (skill decision-trees — the hot path) ----
  server.registerTool('list_skills', {
    title: 'List skill docs',
    description: 'List the domain skill decision-trees — gradients, color, gsap, structure, dataviz, etc. Read the relevant one BEFORE generating in that territory.',
    inputSchema: {},
    outputSchema: { skills: z.array(z.object({ name: z.string(), title: z.string() })) },
    annotations: RO
  }, async () => {
    const skills = skillDocs.map((d) => ({ name: d.name, title: d.title }));
    return { content: [{ type: 'text', text: '# Skill docs\n' + skills.map((s) => `- \`${s.name}\` — ${s.title}`).join('\n') }], structuredContent: { skills } };
  });

  // ---- get_skill ----
  server.registerTool('get_skill', {
    title: 'Get skill doc',
    description: 'Return a domain skill decision-tree by name (e.g. "gradients", "color", "gsap", "structure", "dataviz"). Consult before generating in that area.',
    inputSchema: { name: z.string().describe('Skill name from list_skills, e.g. "gradients".') },
    annotations: RO
  }, async ({ name }) => {
    const d = resolveDoc(name, 'skill') || resolveDoc(name);
    if (!d) return { content: [{ type: 'text', text: `_No skill "${name}". Use list_skills._` }], isError: true };
    return { content: [{ type: 'text', text: await readFile(join(libraryRoot, d.path), 'utf8') }] };
  });

  // ---- list_palettes (structured color themes) ----
  server.registerTool('list_palettes', {
    title: 'List color palettes',
    description: 'List the vetted color themes from colors/palettes.css. Each re-themes a whole page via token CSS vars. Filter by mode (light/dark) or a keyword (industry/group/name).',
    inputSchema: {
      mode: z.enum(['light', 'dark']).optional(),
      query: z.string().optional().describe('Keyword over name + group, e.g. "finance", "luxury", "coffee".')
    },
    outputSchema: { total: z.number(), palettes: z.array(z.object({ name: z.string(), mode: z.string(), group: z.string(), accent: z.string().nullable(), bg: z.string().nullable() })) },
    annotations: RO
  }, async ({ mode, query }) => {
    let list = palettes.slice();
    if (mode) list = list.filter((p) => p.mode === mode);
    if (query) { const q = query.toLowerCase(); list = list.filter((p) => (p.name + ' ' + p.group).toLowerCase().includes(q)); }
    const out = list.map((p) => ({ name: p.name, mode: p.mode, group: p.group, accent: p.accent, bg: p.bg }));
    const text = ['# Palettes' + (mode ? ` (${mode})` : '') + (query ? ` matching "${query}"` : ''), `${out.length} of ${palettes.length}`, '',
      ...out.map((p) => `- \`pal-${p.name}\` (${p.mode}, ${p.group}) — accent ${p.accent}, bg ${p.bg}`)].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { total: out.length, palettes: out } };
  });

  // ---- get_palette (full token data + ready-to-use CSS) ----
  server.registerTool('get_palette', {
    title: 'Get color palette',
    description: 'Return a palette\'s full design tokens (bg, surface, fg, accent, semantic states) as structured data + a ready-to-paste CSS snippet. Apply `pal-<name>` to re-theme a page.',
    inputSchema: { name: z.string().describe('Palette name, with or without the "pal-" prefix, e.g. "fintech-navy" or "pal-midnight".') },
    outputSchema: { name: z.string(), mode: z.string(), group: z.string(), tokens: z.record(z.string()) },
    annotations: RO
  }, async ({ name }) => {
    const key = String(name).replace(/^\.?pal-/, '');
    const p = palByName.get(key);
    if (!p) return { content: [{ type: 'text', text: `_No palette "${name}". Use list_palettes._` }], isError: true };
    const cssVars = Object.entries(p.tokens).map(([k, v]) => `  --${k}: ${v};`).join('\n');
    const text = [`# pal-${p.name} (${p.mode}, ${p.group})`, '',
      'Apply by adding the class to any token-driven element:',
      '```html\n<body class="struct pal-' + p.name + '"> … </body>\n```', '',
      'Tokens:', '```css\n.pal-' + p.name + ' {\n' + cssVars + '\n}\n```'].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { name: p.name, mode: p.mode, group: p.group, tokens: p.tokens } };
  });

  // ---- design_system (generate a DESIGN.md from a palette) ----
  server.registerTool('design_system', {
    title: 'Generate a DESIGN.md',
    description: 'Generate a complete, agent-ready DESIGN.md (colors, typography, spacing, motion, component house-style) from a repo palette — the "design taste as a file" pattern (refero.design), realised with frontendmaxxing snippets. Drop the result in as context, then build. Omit palette to list options.',
    inputSchema: { palette: z.string().optional().describe('Palette name, e.g. "fintech-navy" or "linear-violet". Omit to list palettes.') },
    annotations: RO
  }, async ({ palette }) => {
    if (!palette) {
      return { content: [{ type: 'text', text: '# Palettes for design_system\n' + palettes.map((p) => `- ${p.name} (${p.mode}, ${p.group})`).join('\n') + '\n\nCall design_system("<name>") to generate its DESIGN.md.' }] };
    }
    const p = palByName.get(String(palette).replace(/^\.?pal-/, ''));
    if (!p) return { content: [{ type: 'text', text: `_No palette "${palette}". Call design_system() to list options._` }], isError: true };
    return { content: [{ type: 'text', text: buildDesignMd(p) }] };
  });

  // ---- apply_design_md (consume a DESIGN.md → matched palette + build plan) ----
  server.registerTool('apply_design_md', {
    title: 'Apply a DESIGN.md',
    description: 'Consume an external DESIGN.md (e.g. from refero.design) or any text containing color tokens, and return a build plan: the closest frontendmaxxing palette to its colours, the exact-hex override CSS, and a section-by-section snippet plan to realise it with the vault.',
    inputSchema: {
      design: z.string().describe('The DESIGN.md text, or any spec containing hex colors (accent/bg/fg).'),
      genre: z.string().optional().describe('Optional page genre for the section plan, e.g. "saas", "agency", "store".')
    },
    outputSchema: { matchedPalette: z.string().nullable(), accent: z.string().nullable(), bg: z.string().nullable(), score: z.number() },
    annotations: RO
  }, async ({ design, genre }) => {
    const tokens = extractDesignTokens(design || '');
    const { palette, score } = matchPalette(tokens, palettes);
    return {
      content: [{ type: 'text', text: buildApplyPlan(tokens, palette, genre) }],
      structuredContent: { matchedPalette: palette ? palette.name : null, accent: tokens.accent || null, bg: tokens.bg || null, score: Number.isFinite(score) ? score : -1 }
    };
  });

  // ===== Taste / composition tools =====

  // ---- list_taste_presets ----
  server.registerTool('list_taste_presets', {
    title: 'List taste presets',
    description: 'List the ready-made taste bundles (aesthetic + palette + font pairing + motion + density + a house component set). Optionally filter by aesthetic. Use one with get_taste_preset / compose_page. See get_skill("taste").',
    inputSchema: { aesthetic: z.enum(['minimal', 'editorial', 'energetic', 'luxury', 'playful', 'technical']).optional().describe('Filter to one aesthetic.') },
    outputSchema: { presets: z.array(z.object({ name: z.string(), label: z.string(), aesthetic: z.string(), palette: z.string(), fontPair: z.string(), motion: z.string(), density: z.string(), summary: z.string() })) },
    annotations: RO
  }, async ({ aesthetic }) => {
    if (!tastePresets) return { content: [{ type: 'text', text: '_Taste presets unavailable (taste/presets.js failed to load)._' }], isError: true };
    const list = tastePresets.list(aesthetic);
    const slim = list.map((p) => ({ name: p.name, label: p.label, aesthetic: p.aesthetic, palette: p.palette, fontPair: p.fontPair, motion: p.motion, density: p.density, summary: p.summary }));
    const text = '# Taste presets' + (aesthetic ? ` · ${aesthetic}` : '') + '\n\n' +
      slim.map((p) => `**${p.name}** — ${p.label}\n  ${p.summary}\n  \`${p.aesthetic}\` · \`pal-${p.palette}\` · \`${p.fontPair}\` · motion \`${p.motion}\` · density \`${p.density}\``).join('\n\n') +
      '\n\nget_taste_preset("<name>") for the full bundle, or compose_page("<genre>", preset:"<name>").';
    return { content: [{ type: 'text', text }], structuredContent: { presets: slim } };
  });

  // ---- get_taste_preset ----
  server.registerTool('get_taste_preset', {
    title: 'Get a taste preset',
    description: 'Resolve one taste preset to its full bundle: every axis, the resolved palette tokens, the house component map (which pack to use per slot), an `avoid` list, and a paste-ready <body>/<link>/<script> apply block.',
    inputSchema: { name: z.string().describe('Preset name, e.g. "luxury-noir", "calm-fintech", "dev-tool".') },
    outputSchema: {
      name: z.string(), label: z.string(), aesthetic: z.string(), palette: z.string(), fontPair: z.string(), motion: z.string(), density: z.string(),
      house: z.record(z.string()), avoid: z.array(z.string()), paletteTokens: z.record(z.string()).nullable(), apply: z.string()
    },
    annotations: RO
  }, async ({ name }) => {
    if (!tastePresets) return { content: [{ type: 'text', text: '_Taste presets unavailable._' }], isError: true };
    const p = tastePresets.get(name);
    if (!p) return { content: [{ type: 'text', text: `_No preset "${name}". Call list_taste_presets() for valid names._` }], isError: true };
    const pal = palByName.get(p.palette);
    const apply = [
      '<!-- in <head>, after structure.css + palettes.css -->',
      '<link rel="stylesheet" href="taste/aesthetic.css">',
      '<link rel="stylesheet" href="taste/density.css">',
      '<link rel="stylesheet" href="taste/motion.css">',
      '<link rel="stylesheet" href="taste/fonts.css">',
      '',
      `<body class="struct pal-${p.palette}" data-aesthetic="${p.aesthetic}" data-font-pair="${p.fontPair}" data-motion="${p.motion}" data-density="${p.density}">`,
      '',
      '<!-- optional JS side of motion -->',
      '<script src="taste/motion-profiles.js"></script>'
    ].join('\n');
    const houseRows = tastePresets.HOUSE_SLOTS.map((slot) => `| ${slot} | \`${p.house[slot]}\` |`).join('\n');
    const text = [
      `# ${p.label} (\`${p.name}\`)`,
      `> ${p.summary}`,
      '',
      `- **aesthetic** \`${p.aesthetic}\` · **palette** \`pal-${p.palette}\` · **font** \`${p.fontPair}\` · **motion** \`${p.motion}\` · **density** \`${p.density}\``,
      '',
      '## House components',
      '| Slot | Pack |', '|---|---|', houseRows,
      '',
      '## Avoid',
      ...p.avoid.map((a) => `- ${a}`),
      '',
      '## Apply',
      '```html', apply, '```',
      pal ? `\nResolved palette \`pal-${p.palette}\`: bg \`${pal.tokens.bg}\` · surface \`${pal.tokens.surface || ''}\` · fg \`${pal.tokens.fg}\` · accent \`${pal.tokens.accent}\`` : ''
    ].join('\n');
    return {
      content: [{ type: 'text', text }],
      structuredContent: { name: p.name, label: p.label, aesthetic: p.aesthetic, palette: p.palette, fontPair: p.fontPair, motion: p.motion, density: p.density, house: p.house, avoid: p.avoid, paletteTokens: pal ? pal.tokens : null, apply }
    };
  });

  // ---- compose_page ----
  server.registerTool('compose_page', {
    title: 'Compose a full page',
    description: 'THE headline tool. Assemble a full, renderable page scaffold for a genre using structure.css .s-* shells + a coordinated taste (palette/aesthetic/font/motion/density), and pick a real snippet per section slot. Pass a preset for instant taste, or set palette/aesthetic/etc directly. Change variety_seed to get a different valid pick per slot (diversity). Returns the HTML + a per-slot build manifest.',
    inputSchema: {
      genre: z.string().describe('Page genre: saas, agency, portfolio, ecommerce, restaurant, startup, blog, landing.'),
      preset: z.string().optional().describe('Taste preset name (list_taste_presets). Sets all axes at once.'),
      palette: z.string().optional().describe('Override palette (pal-* name).'),
      aesthetic: z.enum(['minimal', 'editorial', 'energetic', 'luxury', 'playful', 'technical']).optional(),
      density: z.enum(['compact', 'normal', 'airy']).optional(),
      motion: z.enum(['minimal', 'standard', 'playful']).optional(),
      font_pair: z.string().optional().describe('Override font pairing (data-font-pair value).'),
      variety_seed: z.number().int().optional().describe('Rotates the per-slot snippet pick for diversity (default 0).')
    },
    outputSchema: {
      genre: z.string(), preset: z.string().nullable(),
      theme: z.object({ palette: z.string(), aesthetic: z.string(), fontPair: z.string(), motion: z.string(), density: z.string() }),
      sections: z.array(z.object({ slot: z.string(), shell: z.string(), query: z.string(), snippet: z.string().nullable(), companions: z.array(z.string()) })),
      html: z.string(), warnings: z.array(z.string())
    },
    annotations: RO
  }, async ({ genre, preset, palette, aesthetic, density, motion, font_pair, variety_seed }) => {
    const res = composePage(genre, { preset, palette, aesthetic, density, motion, fontPair: font_pair, seed: variety_seed }, { presets: tastePresets, palByName, search, byPath, companions });
    const known = Object.keys(GENRE_SEQUENCES).join(', ');
    const manifest = res.sections.map((s) => `- **${s.slot}** → ${s.snippet ? '`' + s.snippet + '`' : '_(no match)_'}${s.companions.length ? ' + ' + s.companions.map((c) => '`' + c + '`').join(', ') : ''}`).join('\n');
    const text = [
      `# Composed page — ${res.genre}${res.preset ? ' · ' + res.preset : ''}`,
      `Theme: \`pal-${res.theme.palette}\` · aesthetic \`${res.theme.aesthetic}\` · font \`${res.theme.fontPair}\` · motion \`${res.theme.motion}\` · density \`${res.theme.density}\``,
      res.warnings.length ? `\n⚠ ${res.warnings.join(' · ')}` : '',
      !GENRE_SEQUENCES[res.genre] ? `\n(unknown genre — used "landing" sequence; known: ${known})` : '',
      '\n## Build manifest (drop a real snippet into each slot)',
      manifest,
      '\n## Page HTML',
      'Renders on-brand as-is (structure.css shells + palette + taste); wire the manifest snippets in next.',
      '```html', res.html, '```'
    ].filter(Boolean).join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { genre: res.genre, preset: res.preset, theme: res.theme, sections: res.sections, html: res.html, warnings: res.warnings } };
  });

  // ---- compose_app (mobile: a screen FLOW) ----
  server.registerTool('compose_app', {
    title: 'Compose a mobile app flow',
    description: 'The MOBILE peer of compose_page. Assemble a renderable APP SCREEN FLOW for a genre using structure/app-shell.css .scr-* screen shells (device frame, status bar, nav, safe areas, tab bar, list rows, sticky CTA) + a coordinated taste. Returns a multi-screen flow (each screen a phone) + a manifest naming the real mobile/ component to wire into each screen. Read get_skill("mobile-design") for HIG/flow rules.',
    inputSchema: {
      genre: z.string().describe('App genre: onboarding, social, commerce, health, finance, productivity, media, saas, app.'),
      preset: z.string().optional().describe('Taste preset name (list_taste_presets). Sets all axes at once.'),
      palette: z.string().optional().describe('Override palette (pal-* name).'),
      aesthetic: z.enum(['minimal', 'editorial', 'energetic', 'luxury', 'playful', 'technical']).optional(),
      density: z.enum(['compact', 'normal', 'airy']).optional(),
      motion: z.enum(['minimal', 'standard', 'playful']).optional(),
      font_pair: z.string().optional().describe('Override font pairing (data-font-pair value).'),
      variety_seed: z.number().int().optional().describe('Rotates the per-screen component pick (default 0).')
    },
    outputSchema: {
      genre: z.string(), platform: z.string(), preset: z.string().nullable(),
      theme: z.object({ palette: z.string(), aesthetic: z.string(), fontPair: z.string(), motion: z.string(), density: z.string() }),
      screens: z.array(z.object({ screen: z.string(), shell: z.string(), slot: z.string(), tab: z.number().optional(), component: z.string().nullable() })),
      html: z.string(), warnings: z.array(z.string())
    },
    annotations: RO
  }, async ({ genre, preset, palette, aesthetic, density, motion, font_pair, variety_seed }) => {
    const res = composeApp(genre, { preset, palette, aesthetic, density, motion, fontPair: font_pair, seed: variety_seed }, { presets: tastePresets, palByName });
    const known = Object.keys(MOBILE_FLOWS).join(', ');
    const manifest = res.screens.map((s) => `- **${s.screen}** (\`.scr\` ${s.shell}) → ${s.component ? '`' + s.component + '`' : '_(build from .scr-* shells)_'}`).join('\n');
    const text = [
      `# Composed app flow — ${res.genre}${res.preset ? ' · ' + res.preset : ''}  (${res.screens.length} screens)`,
      `Theme: \`pal-${res.theme.palette}\` · aesthetic \`${res.theme.aesthetic}\` · font \`${res.theme.fontPair}\` · motion \`${res.theme.motion}\` · density \`${res.theme.density}\``,
      res.warnings.length ? `\n⚠ ${res.warnings.join(' · ')}` : '',
      !MOBILE_FLOWS[res.genre] ? `\n(unknown genre — used "app" flow; known: ${known})` : '',
      '\n## Screen manifest (drop a real mobile/ component into each screen)',
      manifest,
      '\n## Flow HTML',
      'Renders on-brand as-is (app-shell .scr-* shells + palette + taste); wire the manifest components in next. Each screen is a phone at 390×844.',
      '```html', res.html, '```'
    ].filter(Boolean).join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { genre: res.genre, platform: res.platform, preset: res.preset, theme: res.theme, screens: res.screens, html: res.html, warnings: res.warnings } };
  });

  // ---- coherence_check ----
  server.registerTool('coherence_check', {
    title: 'Check page taste-cohesion',
    description: 'Score an HTML string for taste-cohesion (0–100) and list the AI-slop tells to fix: hardcoded hex (use palette tokens), unblessed transition durations, literal px border-radius, and scale(1.0x) slop hovers. Heuristic + advisory. Pairs with the same checks in the build audit.',
    inputSchema: { html: z.string().describe('The page/section HTML (with inline styles or <style>) to score.') },
    outputSchema: { score: z.number(), ok: z.boolean(), counts: z.record(z.number()), warnings: z.array(z.object({ type: z.string(), count: z.number(), sample: z.array(z.string()), hint: z.string() })) },
    annotations: RO
  }, async ({ html }) => {
    const r = checkCoherence(html);
    const lines = r.warnings.length
      ? r.warnings.map((w) => `- **${w.type}** ×${w.count} — ${w.hint}\n  e.g. ${w.sample.map((x) => '`' + x + '`').join(', ')}`).join('\n')
      : '_No slop tells found._';
    const text = `# Coherence score: ${r.score}/100 ${r.ok ? '✓' : '— room to tighten'}\n\n${lines}`;
    return { content: [{ type: 'text', text }], structuredContent: { score: r.score, ok: r.ok, counts: r.counts, warnings: r.warnings } };
  });

  // ---- get_agents_doc ----
  server.registerTool('get_agents_doc', {
    title: 'Get AGENTS.md',
    description: 'Return AGENTS.md — conventions for ADDING new snippets (JS/CSS templates, naming, indexing rules). Equivalent to get_doc("AGENTS").',
    inputSchema: {},
    annotations: RO
  }, async () => {
    const text = await readFile(join(libraryRoot, 'AGENTS.md'), 'utf8');
    return { content: [{ type: 'text', text }] };
  });

  // ===== Resources =====
  server.registerResource('index', 'frontendmaxxing://index',
    { title: 'INDEX.md', description: 'Tagged inventory of every snippet.', mimeType: 'text/markdown' },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: await readFile(join(libraryRoot, 'INDEX.md'), 'utf8') }] }));

  server.registerResource('agents', 'frontendmaxxing://agents',
    { title: 'AGENTS.md', description: 'Conventions for adding snippets.', mimeType: 'text/markdown' },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: await readFile(join(libraryRoot, 'AGENTS.md'), 'utf8') }] }));

  server.registerResource('doc', new ResourceTemplate('frontendmaxxing://doc/{+name}', {
    list: async () => ({ resources: docs.map((d) => ({ name: d.name, title: d.title, uri: 'frontendmaxxing://doc/' + d.name, mimeType: 'text/markdown' })) })
  }), { title: 'Docs', description: 'Any markdown doc (skill, guide, meta, package) by name.', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const d = resolveDoc(name);
      if (!d) throw new Error('Unknown doc: ' + name);
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: await readFile(join(libraryRoot, d.path), 'utf8') }] };
    });

  server.registerResource('palette', new ResourceTemplate('frontendmaxxing://palette/{name}', {
    list: async () => ({ resources: palettes.map((p) => ({ name: p.name, uri: 'frontendmaxxing://palette/' + p.name, mimeType: 'application/json' })) })
  }), { title: 'Color palettes', description: 'A palette\'s design tokens as JSON.', mimeType: 'application/json' },
    async (uri, { name }) => {
      const p = palByName.get(String(name).replace(/^\.?pal-/, ''));
      if (!p) throw new Error('Unknown palette: ' + name);
      return { contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(p, null, 2) }] };
    });

  server.registerResource('source', new ResourceTemplate('frontendmaxxing://source/{+path}', { list: undefined }),
    { title: 'Snippet source', description: 'Raw source of any snippet by folder/file path.', mimeType: 'text/plain' },
    async (uri, { path }) => {
      const clean = String(path).replace(/^\/+/, '').replace(/\\/g, '/');
      if (!byPath.has(clean)) throw new Error('Not in INDEX: ' + clean);
      const ext = extname(clean) === '.css' ? 'text/css' : 'text/javascript';
      return { contents: [{ uri: uri.href, mimeType: ext, text: await readFile(join(libraryRoot, clean), 'utf8') }] };
    });

  // ===== Prompts =====
  server.registerPrompt('scaffold-page', {
    title: 'Scaffold a page',
    description: 'Plan a full page for a given site genre using the structure skill + concrete snippets from the vault.',
    argsSchema: { genre: z.string().describe('Site genre, e.g. "SaaS landing", "agency", "restaurant", "portfolio", "e-commerce store".') }
  }, ({ genre }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `I'm building a "${genre}" page with frontendmaxxing (vanilla CSS+JS vault).\n\n` +
          `FAST PATH: call compose_page(genre: "${genre}") — optionally with a preset from list_taste_presets() and a variety_seed — for a full themed page scaffold with a real snippet picked per section; then wire each manifest snippet in via get_snippet.\n\n` +
          `MANUAL PATH (more control):\n` +
          `1. Call overview() to see what's available, then get_skill("structure") for the page-architecture decision tree — pick the section sequence for a ${genre}.\n` +
          `2. Call list_taste_presets() + get_taste_preset(name) to lock a coordinated taste (palette + font pair + motion + density + house packs), or list_palettes(query: "${genre}") for color only; apply the \`pal-*\` class + data-aesthetic attributes to the page root. get_skill("taste") has the anti-slop rules.\n` +
          `3. For each section, call search_components to find a snippet that fills it (hero, features, pricing, testimonials, footer, …) — prefer the preset's house packs.\n` +
          `4. For each chosen snippet, call get_snippet to get the paste-ready bundle (CSS+JS companion + usage).\n` +
          `5. Assemble into one page, wire any JS init calls, keep everything vanilla/zero-build; finish with coherence_check(html) and fix what it flags.\n\n` +
          `Start by outlining the section stack + taste for a ${genre}, then fetch and assemble.`
      }
    }]
  }));

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`[frontendmaxxing-mcp v2] ${libraryRoot} · ${entries.length} snippets · ${byFolder.size} folders · ${docs.length} docs · ${palettes.length} palettes\n`);
}

// Only start the server when run directly (so tests can import the pure helpers).
const invokedDirectly = process.argv[1] && (() => {
  try { return import.meta.url === pathToFileURL(process.argv[1]).href; } catch { return false; }
})();
if (invokedDirectly) {
  main().catch((err) => { process.stderr.write(`[frontendmaxxing-mcp] Fatal: ${err.stack || err.message}\n`); process.exit(1); });
}
