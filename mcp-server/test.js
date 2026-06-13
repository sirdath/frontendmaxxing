#!/usr/bin/env node
/* ============================================
   frontendmaxxing-mcp tests — zero-dep (node:test)
   ============================================
   Run: node test.js   (or npm test)
   Exercises the pure search/parse/relation helpers against the real INDEX.md.
   ============================================ */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { parseIndex, buildSearchIndex, buildRelations, tokenize, SYNONYMS, parsePalettes, classifyDoc, docTitle, buildDesignMd, extractDesignTokens, matchPalette, buildApplyPlan, composePage, checkCoherence, GENRE_SEQUENCES } from './server.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const entries = parseIndex(readFileSync(join(root, 'INDEX.md'), 'utf8'));
const { search } = buildSearchIndex(entries);
const { companions } = buildRelations(entries);
const palettes = parsePalettes(readFileSync(join(root, 'colors/palettes.css'), 'utf8'));
const require = createRequire(import.meta.url);
const TastePresets = require('../taste/presets.js');
const byPath = new Map(entries.map((e) => [e.path, e]));
const palByName = new Map(palettes.map((p) => [p.name, p]));
const composeDeps = { presets: TastePresets, palByName, search, byPath, companions };

const paths = (q, n = 8) => search(q, n).map((r) => r.entry.path);

test('INDEX parses a substantial number of entries', () => {
  assert.ok(entries.length > 700, `expected >700 entries, got ${entries.length}`);
});

test('every entry has a folder, kind and tags', () => {
  for (const e of entries) {
    assert.ok(e.folder && e.path.startsWith(e.folder + '/'), `bad path ${e.path}`);
    assert.ok(e.kind === 'CSS' || e.kind === 'JS', `bad kind ${e.kind} for ${e.path}`);
    assert.ok(e.tags.length > 0, `no tags for ${e.path}`);
  }
});

test('search: literal feature query ranks the right file', () => {
  const r = paths('streaming chat token by token');
  assert.ok(r.some((p) => p.startsWith('ai/streaming-text')), `got ${r.join(', ')}`);
});

test('search: multi-word query (kanban drag drop)', () => {
  assert.ok(paths('kanban drag drop').includes('components/kanban-board.css'));
});

test('search: vibe query (aurora hero background)', () => {
  assert.ok(paths('aurora hero background').includes('backgrounds/aurora-bg.css'));
});

test('search: synonym expansion (popup → modal)', () => {
  assert.ok(SYNONYMS.popup.includes('modal'));
  const r = paths('popup dialog window');
  assert.ok(r.some((p) => /modal|dialog/.test(p)), `got ${r.join(', ')}`);
});

test('search: synonym (graph → chart/data-viz)', () => {
  const r = paths('graph');
  assert.ok(r.some((p) => p.startsWith('data-viz/')), `got ${r.join(', ')}`);
});

test('search: typo tolerance (buttn → buttons)', () => {
  const r = paths('buttn');
  assert.ok(r.some((p) => /button/.test(p)), `got ${r.join(', ')}`);
});

test('search: plural folds to singular (loaders → loader)', () => {
  const r = paths('loaders');
  assert.ok(r.some((p) => /load/.test(p)), `got ${r.join(', ')}`);
});

test('search: empty / stopword-only query returns nothing', () => {
  assert.equal(search('the a for of', 10).length, 0);
});

test('search: results are sorted by descending score', () => {
  const r = search('gradient text glow', 10);
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].score >= r[i].score);
});

test('companions: CSS/JS pair resolves both ways', () => {
  const js = entries.find((e) => e.path === 'ai/streaming-text.js');
  const comp = companions(js).map((c) => c.path);
  assert.ok(comp.includes('ai/streaming-text.css'), `got ${comp.join(', ')}`);
  const css = entries.find((e) => e.path === 'ai/streaming-text.css');
  assert.ok(companions(css).some((c) => c.path === 'ai/streaming-text.js'));
});

test('buildDesignMd generates a DESIGN.md from a palette', () => {
  const pal = palettes.find((p) => p.name === 'midnight');
  const md = buildDesignMd(pal);
  assert.match(md, /^# DESIGN\.md — midnight/);
  assert.ok(md.includes(pal.tokens.accent), 'includes the palette accent token');
  assert.ok(md.includes('pal-midnight'), 'tells the agent which class to apply');
  ['## Color', '## Typography', '## Motion', '## Components'].forEach((s) => assert.ok(md.includes(s), 'has section ' + s));
});

test('apply_design_md: extract tokens → match palette → build plan', () => {
  const md = '# DESIGN.md — Acme\n## Color\nbg #07060d · surface #16161f\nfg #f2f3f7 · accent #7c5cff · accent-2 #22d3ee\n';
  const tk = extractDesignTokens(md);
  assert.equal(tk.accent, '#7c5cff');
  assert.equal(tk.bg, '#07060d');
  const { palette, score } = matchPalette(tk, palettes);
  assert.ok(palette, 'matched a palette');
  assert.ok(score >= 0, 'has a numeric score');
  const plan = buildApplyPlan(tk, palette, 'saas');
  assert.match(plan, /Matched palette/);
  assert.ok(plan.includes('pal-' + palette.name), 'names the matched palette class');
  assert.ok(plan.includes('--accent: #7c5cff;'), 'offers exact-hex override');
  assert.ok(plan.includes('Section plan (saas)'), 'includes the section plan');
});

test('matchPalette returns null-safe result with no colors', () => {
  const { palette } = matchPalette(extractDesignTokens('no colors here'), palettes);
  // a bare string has no hexes → no accent → still may match on nothing; just must not throw
  assert.ok(palette === null || palette.name, 'no throw');
});

test('TastePresets: registry has bundles and get/list/names work', () => {
  assert.ok(TastePresets.presets.length >= 12, `expected ≥12 presets, got ${TastePresets.presets.length}`);
  assert.ok(TastePresets.get('luxury-noir'), 'get(luxury-noir) resolves');
  assert.equal(TastePresets.get('nope'), null, 'unknown name → null');
  assert.ok(TastePresets.list('minimal').every((p) => p.aesthetic === 'minimal'), 'list filters by aesthetic');
  assert.ok(TastePresets.names().includes('calm-fintech'));
});

test('TastePresets: every preset validates against real INDEX paths + palette names', () => {
  const paletteNames = new Set(palettes.map((p) => p.name));
  const indexPaths = new Set(entries.map((e) => e.path));
  for (const p of TastePresets.presets) {
    const { ok, errors } = TastePresets.validate(p, { paletteNames, indexPaths });
    assert.ok(ok, `${p.name} invalid: ${errors.join('; ')}`);
  }
});

test('TastePresets.validate: flags a bad palette and a missing house path', () => {
  const paletteNames = new Set(palettes.map((p) => p.name));
  const indexPaths = new Set(entries.map((e) => e.path));
  const bad = { ...TastePresets.get('clean-saas'), palette: 'not-a-palette', house: { ...TastePresets.get('clean-saas').house, button: 'blocks/does-not-exist.css' } };
  const { ok, errors } = TastePresets.validate(bad, { paletteNames, indexPaths });
  assert.equal(ok, false);
  assert.ok(errors.some((e) => /palette/.test(e)) && errors.some((e) => /house\.button/.test(e)), errors.join('; '));
});

test('composePage: builds a saas page from a preset with valid per-slot picks', () => {
  const r = composePage('saas', { preset: 'calm-fintech' }, composeDeps);
  assert.equal(r.theme.aesthetic, 'minimal');
  assert.equal(r.theme.palette, 'fintech-light');
  assert.ok(r.sections.length >= 6, 'has sections');
  for (const s of r.sections) {
    if (s.snippet) assert.ok(byPath.has(s.snippet), `picked path not in INDEX: ${s.snippet}`);
  }
  assert.match(r.html, /^<!doctype html>/);
  assert.ok(r.html.includes('pal-fintech-light') && r.html.includes('data-aesthetic="minimal"'), 'html carries the theme');
  assert.ok(r.html.includes('class="s-hero'), 'uses structure shells');
});

test('composePage: variety_seed changes at least one slot pick (diversity)', () => {
  const a = composePage('saas', { seed: 0 }, composeDeps);
  const b = composePage('saas', { seed: 1 }, composeDeps);
  const pa = a.sections.map((s) => s.snippet).join('|');
  const pb = b.sections.map((s) => s.snippet).join('|');
  assert.notEqual(pa, pb, 'seed 0 and seed 1 should differ on some slot');
});

test('composePage: unknown genre falls back to landing sequence', () => {
  const r = composePage('totally-unknown-genre', {}, composeDeps);
  assert.deepEqual(r.sections.map((s) => s.slot), GENRE_SEQUENCES.landing.map((s) => s.slot));
});

test('composePage: bad palette falls back with a warning', () => {
  const r = composePage('saas', { palette: 'not-a-real-palette' }, composeDeps);
  assert.ok(palByName.has(r.theme.palette), 'resolved to a real palette');
  assert.ok(r.warnings.some((w) => /not found/.test(w)), 'warns about the bad palette');
});

test('checkCoherence: flags hardcoded hex, passes token-only markup', () => {
  const bad = '<div style="color:#ff0066;border-radius:8px;transition:all 0.3s ease;"></div><a style="transform:scale(1.05)"></a>';
  const rb = checkCoherence(bad);
  assert.ok(rb.counts['hardcoded-hex'] >= 1, 'catches hex');
  assert.ok(rb.counts['px-radius'] >= 1, 'catches px radius');
  assert.ok(rb.counts['unblessed-duration'] >= 1, 'catches 300ms');
  assert.ok(rb.counts['slop-hover'] >= 1, 'catches scale(1.05)');
  assert.ok(rb.score < 80, `bad markup should score low, got ${rb.score}`);

  const good = '<div style="color:var(--accent);border-radius:var(--radius);transition:transform var(--m-dur) var(--m-ease);"></div>';
  const rg = checkCoherence(good);
  assert.equal(rg.warnings.length, 0, 'token-only markup is clean');
  assert.equal(rg.score, 100);
});

test('checkCoherence: a composed page scores high (cohesive by construction)', () => {
  const r = composePage('agency', { preset: 'bold-launch' }, composeDeps);
  const c = checkCoherence(r.html);
  assert.ok(c.score >= 90, `composed page should be cohesive, got ${c.score}: ${JSON.stringify(c.counts)}`);
});

test('tokenize splits on non-alphanumerics', () => {
  assert.deepEqual(tokenize('tool-call_card.js (v2)'), ['tool', 'call', 'card', 'js', 'v2']);
});

test('parsePalettes: extracts all themes with tokens, mode, group', () => {
  assert.ok(palettes.length >= 50, `expected ≥50 palettes, got ${palettes.length}`);
  const midnight = palettes.find((p) => p.name === 'midnight');
  assert.ok(midnight, 'midnight palette missing');
  assert.equal(midnight.mode, 'dark');
  assert.match(midnight.tokens.bg, /^#/);
  assert.ok(midnight.tokens.accent, 'accent token missing');
  const light = palettes.find((p) => p.name === 'clean-light');
  assert.equal(light.mode, 'light');
  assert.ok(palettes.some((p) => /FINANCE|FOUNDATIONS|LUXURY/.test(p.group)), 'no groups parsed');
});

test('classifyDoc: routes each markdown kind correctly', () => {
  assert.deepEqual(classifyDoc('gradients.skill.md'), { kind: 'skill', name: 'gradients' });
  assert.deepEqual(classifyDoc('creative-arsenal.md'), { kind: 'guide', name: 'creative-arsenal' });
  assert.deepEqual(classifyDoc('AGENTS.md'), { kind: 'meta', name: 'AGENTS' });
  assert.equal(classifyDoc('INDEX.md'), null);
  assert.equal(classifyDoc('mcp-server/README.md'), null);
  assert.equal(classifyDoc('claude-skills/blender/blender-shader-nodes/SKILL.md').kind, 'package');
});

test('docTitle: reads frontmatter description then H1', () => {
  assert.equal(docTitle('---\nname: x\ndescription: A vault doc.\n---\n# Title', 'fb'), 'A vault doc.');
  assert.equal(docTitle('# Just A Heading\n\ntext', 'fb'), 'Just A Heading');
  assert.equal(docTitle('no markers here', 'fallback'), 'fallback');
});
