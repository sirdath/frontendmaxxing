#!/usr/bin/env node
/* ============================================
   frontendmaxxing MCP server
   ============================================
   Exposes the frontendmaxxing snippet library to MCP-compatible AI agents
   (Claude Desktop, Cursor, Claude Code, etc.).

   Tools:
     - list_components     — list all snippets (optionally filter by folder/kind)
     - search_components   — search by tag/synonym/description
     - get_source          — return the raw source file
     - recommend           — fuzzy "I need X" → top matches with rationale
     - get_examples        — extract the Usage block from a file header
     - list_categories     — list all folders with counts + descriptions
     - get_agents_doc      — return AGENTS.md (conventions for adding snippets)

   Resources:
     - frontendmaxxing://index    — INDEX.md
     - frontendmaxxing://agents   — AGENTS.md
     - frontendmaxxing://gradients — gradients.skill.md
   ============================================ */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// =====================================================
// Locate the library root
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resolveLibraryRoot() {
  // 1. Explicit env var
  if (process.env.FRONTENDMAXXING_PATH) {
    return resolve(process.env.FRONTENDMAXXING_PATH);
  }
  // 2. Parent dir of server.js (when run from inside the repo)
  const parentDir = resolve(__dirname, '..');
  try {
    await access(join(parentDir, 'INDEX.md'));
    return parentDir;
  } catch {}
  // 3. Same dir as server.js (when bundled flat in npm package)
  try {
    await access(join(__dirname, 'INDEX.md'));
    return __dirname;
  } catch {}
  // 4. CWD fallback
  try {
    await access(join(process.cwd(), 'INDEX.md'));
    return process.cwd();
  } catch {}
  throw new Error('Could not locate frontendmaxxing library. Set FRONTENDMAXXING_PATH env var to the library root.');
}

// =====================================================
// INDEX.md parser
// =====================================================

const ENTRY_RE = /^\*\*([\w\-\.]+\.(?:css|js|glsl\.js))\*\*\s+`([^`]+)`\s+\((CSS|JS)(?:,\s*global:\s*`([^`]+)`)?\)\s*[—-]\s*tags:\s*(.+)$/;

function parseIndex(text) {
  const entries = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(ENTRY_RE);
    if (!m) continue;
    const [, file, rawPath, kind, globalName, tags] = m;
    const path = rawPath.replace(/\\/g, '/');
    const folder = path.split('/')[0];
    const desc = (lines[i + 1] || '').trim();
    entries.push({
      file,
      path,
      folder,
      kind,                                // 'CSS' | 'JS'
      global: globalName || null,
      tags: tags.split(/\s+/).filter(Boolean),
      tagsText: tags.trim(),
      desc,
      key: folder + '/' + file
    });
  }
  return entries;
}

const FOLDER_DESCRIPTIONS = {
  '3d':          'Three.js scenes (requires THREE via CDN)',
  'ai':          'AI-native UI primitives — streaming text, tool calls, citations, voice input, etc.',
  'animations':  'Keyframes, springs, stagger, AOS-style scroll triggers',
  'backgrounds': 'Aurora, mesh gradients, orbs, world map, sky presets, particles',
  'blocks':      'Buttons, loaders, toasts, tooltips, badges, inputs, sliders',
  'borders':     'Animated/gradient borders',
  'components':  'Full UI components — heroes, navbars, cards, modals, kanban, calendar, infinite canvas',
  'data-viz':    'Charts (bar, line, pie, area, radar, funnel, sankey, treemap, network), sparklines, count-up',
  'effects':     'Gradients, glitch, parallax, cursors, holo, fire/smoke/water, caustics, watercolor',
  'feedback':    'Confetti, sparkles, success/error states, achievements, streak, score',
  'interactions':'Sortable, swipe, pinch-zoom, gravity physics, elastic line',
  'layout':      'Grids, masonry, container queries, sticky, aspect ratios',
  'media':       'Image compare, video player, audio waveform with regions, lightbox',
  'micro':       'Tiny micro-interactions (toggle, like, copy, counter)',
  'responsive':  'Breakpoints, dark mode, mobile patterns, skip-link',
  'scroll':      'Pin, scrub, snap, horizontal-pin, text-reveal',
  'shaders':     'Pure-WebGL fullscreen-quad shaders — voronoi, mesh, godrays, plasma, fluid',
  'svg':         'SVG animations, gradient definitions',
  'transitions': 'Page transitions: fade, curtain, morph, View Transitions API',
  'typography':  'Fluid type, variable fonts, gradient numbers, text effects',
  'utils':       'easing, lerp, dom helpers, performance, palette generator, gradient builder'
};

// =====================================================
// Search / ranking
// =====================================================

function tokenize(s) {
  return s.toLowerCase().split(/[\s\-_,.()/]+/).filter(Boolean);
}

function scoreEntry(entry, queryTokens) {
  let score = 0;
  const hay = (entry.tagsText + ' ' + entry.desc + ' ' + entry.file + ' ' + entry.folder + ' ' + (entry.global || '')).toLowerCase();
  for (const tok of queryTokens) {
    if (!tok) continue;
    if (entry.file.toLowerCase().includes(tok)) score += 8;
    if (entry.tags.includes(tok)) score += 5;
    if ((entry.global || '').toLowerCase().includes(tok)) score += 4;
    if (entry.folder === tok) score += 3;
    if (hay.includes(tok)) score += 1;
  }
  return score;
}

function search(entries, query, limit = 10) {
  const tokens = tokenize(query);
  return entries
    .map(e => ({ entry: e, score: scoreEntry(e, tokens) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// =====================================================
// Format helpers
// =====================================================

function formatEntry(e, opts = {}) {
  const parts = [];
  parts.push(`**${e.file}** \`${e.path}\``);
  parts.push(`  - Type: ${e.kind}${e.global ? `, global: \`${e.global}\`` : ''}`);
  if (e.desc) parts.push(`  - ${e.desc}`);
  if (opts.tags && e.tags.length) parts.push(`  - Tags: ${e.tags.slice(0, 8).join(', ')}`);
  return parts.join('\n');
}

function formatEntries(entries, opts = {}) {
  if (!entries.length) return '_No matches._';
  return entries.map(e => formatEntry(e, opts)).join('\n\n');
}

// Extract the Usage block from a file header (between "Usage:" line and the next blank line or "============================================")
function extractUsage(source) {
  const lines = source.split('\n');
  const usageStart = lines.findIndex(l => /^\s*Usage\s*:/i.test(l));
  if (usageStart === -1) return null;
  const out = [];
  for (let i = usageStart; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*=={5,}/.test(line)) break;
    if (/^\s*Variants\s*:/i.test(line) || /^\s*Modifiers\s*:/i.test(line) || /^\s*Methods\s*:/i.test(line) || /^\s*States\s*:/i.test(line)) break;
    // Strip leading "   " indentation that's part of the comment block
    out.push(line.replace(/^\s\s\s\s\s\s/, '').replace(/^\s\s\s\s/, '').replace(/^\s\s/, '').replace(/^\*\s?/, '').replace(/^\/\*\s?/, ''));
  }
  return out.join('\n').trim();
}

// =====================================================
// Server setup
// =====================================================

async function main() {
  const libraryRoot = await resolveLibraryRoot();
  const indexPath = join(libraryRoot, 'INDEX.md');
  const indexText = await readFile(indexPath, 'utf8');
  const entries = parseIndex(indexText);

  const byKey = new Map(entries.map(e => [e.key, e]));
  const byPath = new Map(entries.map(e => [e.path, e]));
  const byFolder = new Map();
  for (const e of entries) {
    if (!byFolder.has(e.folder)) byFolder.set(e.folder, []);
    byFolder.get(e.folder).push(e);
  }

  const server = new McpServer({
    name: 'frontendmaxxing',
    version: '1.0.0'
  });

  // ===== Tool: list_components =====
  server.tool(
    'list_components',
    'List components in the frontendmaxxing library. Optionally filter by folder or by kind (CSS/JS). Use this to browse the catalog.',
    {
      folder: z.string().optional().describe('Folder name to filter by, e.g. "components", "ai", "effects", "shaders". Omit to list all.'),
      kind: z.enum(['CSS', 'JS']).optional().describe('Filter to only CSS or JS files.'),
      limit: z.number().int().positive().max(500).optional().default(100).describe('Max entries to return.')
    },
    async ({ folder, kind, limit }) => {
      let list = entries.slice();
      if (folder) list = list.filter(e => e.folder === folder);
      if (kind) list = list.filter(e => e.kind === kind);
      const total = list.length;
      list = list.slice(0, limit);

      const text = [
        `# Components${folder ? ` in \`${folder}/\`` : ''}${kind ? ` (${kind})` : ''}`,
        `Showing ${list.length} of ${total} total (out of ${entries.length} in the library)`,
        '',
        formatEntries(list, { tags: false })
      ].join('\n');

      return { content: [{ type: 'text', text }] };
    }
  );

  // ===== Tool: search_components =====
  server.tool(
    'search_components',
    'Search the frontendmaxxing library by keywords. Searches tags, descriptions, file names, and synonyms. Returns ranked matches.',
    {
      query: z.string().describe('Keywords describing what you want. E.g. "streaming chat token-by-token" or "kanban drag drop" or "aurora hero background".'),
      limit: z.number().int().positive().max(50).optional().default(10).describe('Max results.')
    },
    async ({ query, limit }) => {
      const results = search(entries, query, limit);
      const text = [
        `# Search: "${query}"`,
        `${results.length} match${results.length === 1 ? '' : 'es'}`,
        '',
        results.length === 0
          ? '_No matches. Try different keywords or synonyms — the library has 481+ files so something likely fits._'
          : results.map(({ entry, score }) => `**${entry.file}** \`${entry.path}\` (score ${score})${entry.global ? ` · global: \`${entry.global}\`` : ''}\n  ${entry.desc}`).join('\n\n')
      ].join('\n');

      return { content: [{ type: 'text', text }] };
    }
  );

  // ===== Tool: get_source =====
  server.tool(
    'get_source',
    'Return the full source code of a snippet file. Use this after search_components or list_components when you want to copy/use the actual code.',
    {
      path: z.string().describe('Path within the library, e.g. "ai/streaming-text.css" or "components/triage-row.js".')
    },
    async ({ path }) => {
      const cleaned = path.replace(/^\/+/, '').replace(/\\/g, '/');
      const entry = byPath.get(cleaned);
      if (!entry) {
        return {
          content: [{ type: 'text', text: `_File not found in INDEX: \`${cleaned}\`. Use \`list_components\` or \`search_components\` to find valid paths._` }]
        };
      }
      const full = join(libraryRoot, cleaned);
      const source = await readFile(full, 'utf8');
      return {
        content: [{
          type: 'text',
          text: [
            `# ${entry.file}`,
            `Path: \`${entry.path}\` · Type: ${entry.kind}${entry.global ? ` · Global: \`${entry.global}\`` : ''}`,
            entry.desc ? `\n${entry.desc}\n` : '',
            '```' + (entry.kind === 'CSS' ? 'css' : 'js'),
            source,
            '```'
          ].join('\n')
        }]
      };
    }
  );

  // ===== Tool: get_examples =====
  server.tool(
    'get_examples',
    'Extract the Usage block from a snippet file header. Faster than get_source when you just need quick usage examples without the full implementation.',
    {
      path: z.string().describe('Path within the library, e.g. "ai/tool-call-card.js".')
    },
    async ({ path }) => {
      const cleaned = path.replace(/^\/+/, '').replace(/\\/g, '/');
      const entry = byPath.get(cleaned);
      if (!entry) {
        return { content: [{ type: 'text', text: `_File not found: \`${cleaned}\`._` }] };
      }
      const full = join(libraryRoot, cleaned);
      const source = await readFile(full, 'utf8');
      const usage = extractUsage(source);
      const text = [
        `# Usage: ${entry.file}`,
        `Path: \`${entry.path}\``,
        '',
        entry.desc,
        '',
        usage ? '```\n' + usage + '\n```' : '_No Usage block found in header. Run \`get_source\` for the full file._'
      ].join('\n');
      return { content: [{ type: 'text', text }] };
    }
  );

  // ===== Tool: recommend =====
  server.tool(
    'recommend',
    'Given a free-form description of what you\'re building or what you need, recommend up to 5 matching snippets from the library, with rationale for each pick.',
    {
      description: z.string().describe('Free-form description. E.g. "I need a chat input that supports file attachments and an auto-growing textarea" or "I want a glowing border around my logo".'),
      limit: z.number().int().positive().max(10).optional().default(5).describe('Max recommendations.')
    },
    async ({ description, limit }) => {
      const results = search(entries, description, limit);
      if (results.length === 0) {
        return { content: [{ type: 'text', text: `_No matches for "${description}". Try simpler keywords or browse with list_components._` }] };
      }
      const text = [
        `# Recommendations for: "${description}"`,
        '',
        ...results.map(({ entry, score }, i) => {
          const matchedTags = tokenize(description).filter(t => entry.tags.includes(t) || entry.file.toLowerCase().includes(t));
          return [
            `### ${i + 1}. \`${entry.path}\` · score ${score}`,
            entry.desc,
            entry.global ? `_Global: \`${entry.global}\`_` : '',
            matchedTags.length ? `_Matched on: ${matchedTags.join(', ')}_` : '',
            `→ Use \`get_examples("${entry.path}")\` or \`get_source("${entry.path}")\`.`
          ].filter(Boolean).join('\n');
        })
      ].join('\n\n');
      return { content: [{ type: 'text', text }] };
    }
  );

  // ===== Tool: list_categories =====
  server.tool(
    'list_categories',
    'List all 22 folders in the library with snippet counts and descriptions. Helps you decide which category to drill into.',
    {},
    async () => {
      const folders = Array.from(byFolder.keys()).sort();
      const text = [
        '# frontendmaxxing categories',
        `${entries.length} total snippets across ${folders.length} folders.`,
        '',
        ...folders.map(f => {
          const count = byFolder.get(f).length;
          const desc = FOLDER_DESCRIPTIONS[f] || '';
          return `**\`${f}/\`** · ${count} snippets\n  ${desc}`;
        })
      ].join('\n\n');
      return { content: [{ type: 'text', text }] };
    }
  );

  // ===== Tool: get_agents_doc =====
  server.tool(
    'get_agents_doc',
    'Return AGENTS.md — the conventions document. Read this if you want to ADD new snippets following the library\'s patterns (JS template, CSS template, naming rules, indexing rule).',
    {},
    async () => {
      const text = await readFile(join(libraryRoot, 'AGENTS.md'), 'utf8');
      return { content: [{ type: 'text', text }] };
    }
  );

  // ===== Resources =====
  server.resource(
    'index',
    'frontendmaxxing://index',
    { description: 'The full INDEX.md — tagged inventory of all 481 snippets.', mimeType: 'text/markdown' },
    async (uri) => {
      const text = await readFile(join(libraryRoot, 'INDEX.md'), 'utf8');
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] };
    }
  );
  server.resource(
    'agents',
    'frontendmaxxing://agents',
    { description: 'AGENTS.md — conventions for adding new snippets.', mimeType: 'text/markdown' },
    async (uri) => {
      const text = await readFile(join(libraryRoot, 'AGENTS.md'), 'utf8');
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] };
    }
  );
  server.resource(
    'gradients',
    'frontendmaxxing://gradients',
    { description: 'gradients.skill.md — decision tree for the gradient subsystem (32+ files).', mimeType: 'text/markdown' },
    async (uri) => {
      const text = await readFile(join(libraryRoot, 'gradients.skill.md'), 'utf8');
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] };
    }
  );

  // ===== Connect =====
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log startup to stderr (stdout is reserved for MCP protocol)
  process.stderr.write(`[frontendmaxxing-mcp] Library: ${libraryRoot} · Loaded ${entries.length} snippets across ${byFolder.size} folders.\n`);
}

main().catch((err) => {
  process.stderr.write(`[frontendmaxxing-mcp] Fatal error: ${err.stack || err.message}\n`);
  process.exit(1);
});
