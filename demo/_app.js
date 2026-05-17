/* ============================================
   DEMO APP — INDEX.md-driven single-page browser
   ============================================
   - Loads INDEX.md and parses entries
   - Builds sidebar nav grouped by folder
   - Hash routing: #/ (landing), #/<folder> (folder), #/<folder>/<file> (component)
   - Dynamically loads CSS/JS for the selected component
   - Renders preview using custom templates from Previews registry, or generic fallback
   ============================================ */
(function () {
  'use strict';

  // ===== Config =====
  var GITHUB_URL = 'https://github.com/sirdath/frontendmaxxing';
  var DOCS_AGENTS = '../AGENTS.md';
  var DOCS_INDEX = '../INDEX.md';
  var DOCS_GRADIENTS = '../gradients.skill.md';
  var FOLDER_DESCRIPTIONS = {
    '3d':          { icon: '🎲', desc: 'Three.js scenes — galaxy, wave plane, cube morph, raycast hover, postprocessing' },
    'ai':          { icon: '🤖', desc: 'AI-native UI — streaming text, tool calls, citations, agent traces, voice input' },
    'animations':  { icon: '⏱', desc: 'Keyframes, transitions, spring physics, stagger, scroll-triggered (AOS)' },
    'backgrounds': { icon: '🌌', desc: 'Aurora, mesh gradients, orbs, world map, sky presets, particles' },
    'blocks':      { icon: '🧩', desc: 'Buttons, loaders, toasts, tooltips, badges, inputs, sliders, JSON editor' },
    'borders':     { icon: '🔲', desc: 'Animated gradient borders' },
    'components':  { icon: '🎛', desc: 'Full UI: heroes, navbars, cards, modals, kanban, calendar, infinite canvas…' },
    'data-viz':    { icon: '📊', desc: 'Charts (bar, line, pie, area, radar, funnel, sankey, treemap, network), sparklines, count-up' },
    'effects':     { icon: '✨', desc: 'Gradients, glitch, parallax, cursors, holo, fire, smoke, caustics, watercolor…' },
    'feedback':    { icon: '🎯', desc: 'Confetti, sparkles, success/error states, achievements, streak, score' },
    'interactions':{ icon: '👆', desc: 'Sortable, swipe, pinch-zoom, gravity physics, elastic line' },
    'layout':      { icon: '📐', desc: 'Grids, masonry, container queries, sticky, aspect ratios' },
    'media':       { icon: '🎬', desc: 'Image compare, video player, audio waveform with regions, lightbox' },
    'micro':       { icon: '⚡', desc: 'Tiny micro-interactions (toggle, like, copy, counter)' },
    'responsive':  { icon: '📱', desc: 'Breakpoints, dark mode, mobile patterns, skip-link' },
    'scroll':      { icon: '📜', desc: 'Pin, scrub, snap, horizontal-pin, text-reveal' },
    'shaders':     { icon: '🌈', desc: 'Pure-WebGL fullscreen-quad shaders — voronoi, mesh, godrays, plasma, fluid' },
    'svg':         { icon: '✏️', desc: 'SVG animations, gradient definitions' },
    'transitions': { icon: '🎞', desc: 'Page transitions: fade, curtain, morph, View Transitions API' },
    'typography':  { icon: '🔤', desc: 'Fluid type, variable fonts, gradient numbers, text effects' },
    'utils':       { icon: '🛠', desc: 'easing, lerp, dom helpers, performance, palette generator, gradient builder' }
  };
  var FEATURED = [
    ['ai', 'streaming-text.js'],
    ['effects', 'gradient-text.css'],
    ['backgrounds', 'aurora-bg.css'],
    ['components', 'infinite-canvas.js'],
    ['shaders', 'mesh-gradient-wgl.glsl.js'],
    ['effects', 'logo-glow.css'],
    ['components', 'triage-row.js'],
    ['effects', 'fire.css']
  ];

  // ===== State =====
  var state = {
    entries: [],        // { folder, file, path, kind, global, tags, desc }
    byFolder: {},       // folder → array of entries
    byKey: {},          // "folder/file" → entry
    route: { type: 'landing' },
    loaded: { css: new Set(), js: new Set() },
    sourceCache: {}
  };

  // ===== INDEX.md parser =====
  // Permissive regex: capture meta block raw, then extract any backticked globals
  // so we handle (CSS) / (JS) / (JS, global: `A`) / (JS, global: `A`, `B`) / (JS, globals: `A`, `B`, `C`)
  function parseIndex(text) {
    var entries = [];
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^\*\*([\w\-\.]+\.(?:css|js|glsl\.js))\*\*\s+`([^`]+)`\s+\((CSS|JS)([^)]*)\)\s*[—-]\s*tags:\s*(.+)$/);
      if (!m) continue;
      var file = m[1];
      var rawPath = m[2].replace(/\\/g, '/');
      var kind = m[3];
      var meta = m[4] || '';
      var tags = m[5].trim();
      var folder = rawPath.split('/')[0];
      var desc = (lines[i + 1] || '').trim().replace(/^\s+/, '');
      // Extract any `Name` from meta as a global
      var globals = [];
      var gm;
      var rx = /`([^`]+)`/g;
      while ((gm = rx.exec(meta)) !== null) globals.push(gm[1]);
      entries.push({
        folder: folder,
        file: file,
        path: rawPath,
        kind: kind,
        global: globals[0] || null,
        globals: globals,
        tags: tags,
        desc: desc,
        key: folder + '/' + file
      });
    }
    return entries;
  }

  function loadIndex() {
    return fetch(DOCS_INDEX)
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var entries = parseIndex(text);
        state.entries = entries;
        // Group by folder
        var byFolder = {};
        var byKey = {};
        entries.forEach(function (e) {
          if (!byFolder[e.folder]) byFolder[e.folder] = [];
          byFolder[e.folder].push(e);
          byKey[e.key] = e;
        });
        // Sort within folder
        Object.keys(byFolder).forEach(function (f) {
          byFolder[f].sort(function (a, b) { return a.file.localeCompare(b.file); });
        });
        state.byFolder = byFolder;
        state.byKey = byKey;
      });
  }

  // ===== Routing =====
  function parseHash() {
    var h = (location.hash || '').replace(/^#\//, '');
    if (!h) return { type: 'landing' };
    var parts = h.split('/').filter(Boolean);
    if (parts.length === 1) return { type: 'folder', folder: parts[0] };
    return { type: 'component', folder: parts[0], file: parts.slice(1).join('/') };
  }

  function go(hash) { location.hash = hash; }

  function onRouteChange() {
    state.route = parseHash();
    render();
  }

  // ===== Dynamic loaders =====
  function loadCSS(path) {
    if (state.loaded.css.has(path)) return Promise.resolve();
    return new Promise(function (resolve) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '../' + path;
      link.onload = link.onerror = function () {
        state.loaded.css.add(path);
        resolve();
      };
      document.head.appendChild(link);
    });
  }
  function loadJS(path) {
    if (state.loaded.js.has(path)) return Promise.resolve();
    return new Promise(function (resolve) {
      var script = document.createElement('script');
      script.src = '../' + path;
      script.onload = script.onerror = function () {
        state.loaded.js.add(path);
        resolve();
      };
      document.head.appendChild(script);
    });
  }
  function loadSource(path) {
    if (state.sourceCache[path]) return Promise.resolve(state.sourceCache[path]);
    return fetch('../' + path).then(function (r) { return r.text(); })
      .then(function (t) { state.sourceCache[path] = t; return t; })
      .catch(function () { return null; });
  }

  // For each component, find both .css and .js companions in the same folder
  function companions(entry) {
    var base = entry.file.replace(/\.(css|js|glsl\.js)$/, '');
    var siblings = state.byFolder[entry.folder] || [];
    var matches = siblings.filter(function (s) {
      var sb = s.file.replace(/\.(css|js|glsl\.js)$/, '');
      return sb === base;
    });
    return matches;
  }

  // ===== Render =====
  var $content = null;
  var $crumbs = null;
  var $nav = null;

  function render() {
    if (state.route.type === 'landing') renderLanding();
    else if (state.route.type === 'folder') renderFolder(state.route.folder);
    else if (state.route.type === 'component') renderComponent(state.route.folder, state.route.file);
    renderSidebar();
    renderCrumbs();
    // Highlight active in sidebar
    document.querySelectorAll('.dapp-item').forEach(function (el) {
      var key = el.dataset.key;
      var active = state.route.type === 'component' && (state.route.folder + '/' + state.route.file) === key;
      el.classList.toggle('is-active', active);
    });
    window.scrollTo(0, 0);
  }

  function renderCrumbs() {
    if (!$crumbs) return;
    var html = '<a class="dapp-crumb-item" href="#/">frontendmaxxing</a>';
    if (state.route.type === 'folder') {
      html += '<span class="dapp-crumb-sep">/</span><span class="dapp-crumb-current">' + esc(state.route.folder) + '</span>';
    } else if (state.route.type === 'component') {
      html += '<span class="dapp-crumb-sep">/</span><a class="dapp-crumb-item" href="#/' + esc(state.route.folder) + '">' + esc(state.route.folder) + '</a>';
      html += '<span class="dapp-crumb-sep">/</span><span class="dapp-crumb-current">' + esc(state.route.file) + '</span>';
    }
    $crumbs.innerHTML = html;
  }

  function renderSidebar() {
    if (!$nav) return;
    var query = (document.getElementById('dapp-search-input').value || '').trim().toLowerCase();
    var folders = Object.keys(state.byFolder).sort();
    var html = '';
    folders.forEach(function (f) {
      var list = state.byFolder[f].filter(function (e) {
        if (!query) return true;
        return (e.file + ' ' + e.tags + ' ' + e.desc).toLowerCase().indexOf(query) !== -1;
      });
      if (!list.length) return;
      var meta = FOLDER_DESCRIPTIONS[f] || { icon: '•' };
      html += '<div class="dapp-group">' +
        '<span>' + meta.icon + '</span>' +
        '<span>' + esc(f) + '</span>' +
        '<span class="dapp-group-count">' + list.length + '</span>' +
      '</div>';
      list.forEach(function (e) {
        html += '<div class="dapp-item" data-key="' + esc(e.key) + '" onclick="location.hash=\'#/' + esc(e.folder) + '/' + esc(e.file) + '\'">' +
          '<span class="dapp-item-dot"></span>' +
          '<span class="dapp-item-name">' + esc(e.file) + '</span>' +
          (e.kind === 'JS' ? '<span class="dapp-item-tag">JS</span>' : '') +
        '</div>';
      });
    });
    if (!html) html = '<div class="dapp-empty" style="padding: 1rem 0.85rem;">No matches</div>';
    $nav.innerHTML = html;
    // Re-highlight active
    document.querySelectorAll('.dapp-item').forEach(function (el) {
      var key = el.dataset.key;
      var active = state.route.type === 'component' && (state.route.folder + '/' + state.route.file) === key;
      el.classList.toggle('is-active', active);
    });
  }

  function renderLanding() {
    var totalFiles = state.entries.length;
    var folders = Object.keys(state.byFolder).sort();
    var cats = folders.map(function (f) {
      var meta = FOLDER_DESCRIPTIONS[f] || { icon: '•', desc: '' };
      return '<a class="dapp-cat-card dapp-cat-' + esc(f) + '" href="#/' + esc(f) + '">' +
        '<div class="dapp-cat-icon">' + meta.icon + '</div>' +
        '<div class="dapp-cat-title">' + esc(f) + '/</div>' +
        '<div class="dapp-cat-count">' + state.byFolder[f].length + ' snippets</div>' +
        '<div class="dapp-cat-desc">' + esc(meta.desc) + '</div>' +
      '</a>';
    }).join('');

    var featured = FEATURED.map(function (pair) {
      var key = pair[0] + '/' + pair[1];
      var e = state.byKey[key];
      if (!e) return '';
      return '<a class="dapp-featured-card" href="#/' + esc(e.folder) + '/' + esc(e.file) + '">' +
        '<div class="dapp-featured-preview" data-featured="' + esc(key) + '"></div>' +
        '<div class="dapp-featured-body">' +
          '<div class="dapp-featured-name">' + esc(e.file) + '</div>' +
          '<div class="dapp-featured-desc">' + esc(e.desc) + '</div>' +
        '</div>' +
      '</a>';
    }).join('');

    $content.innerHTML =
      '<div class="dapp-landing">' +
        '<div class="dapp-landing-hero">' +
          '<h1>frontendmaxxing</h1>' +
          '<p>' + totalFiles + ' standalone CSS + JS snippets for frontend design. Vanilla. Zero build step. Zero dependencies.</p>' +
          '<div class="dapp-landing-ctas">' +
            '<a class="dapp-cta dapp-cta-primary" href="#/components">Browse ' + totalFiles + ' components →</a>' +
            '<a class="dapp-cta" href="' + GITHUB_URL + '" target="_blank" rel="noopener">' +
              '<svg class="dapp-cta-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>' +
              'GitHub' +
            '</a>' +
            '<a class="dapp-cta" href="' + DOCS_AGENTS + '" target="_blank">📖 AGENTS.md</a>' +
            '<a class="dapp-cta" href="' + DOCS_INDEX + '" target="_blank">📑 INDEX.md</a>' +
          '</div>' +
          '<div class="dapp-landing-stats">' +
            '<div class="dapp-stat"><div class="dapp-stat-num">' + totalFiles + '</div><div class="dapp-stat-label">snippets</div></div>' +
            '<div class="dapp-stat"><div class="dapp-stat-num">' + folders.length + '</div><div class="dapp-stat-label">categories</div></div>' +
            '<div class="dapp-stat"><div class="dapp-stat-num">0</div><div class="dapp-stat-label">dependencies</div></div>' +
            '<div class="dapp-stat"><div class="dapp-stat-num">MIT</div><div class="dapp-stat-label">license</div></div>' +
          '</div>' +
        '</div>' +

        '<div class="dapp-section-head">' +
          '<div>' +
            '<h2 class="dapp-section-title">Browse by category</h2>' +
            '<div class="dapp-section-sub">22 folders covering every layer of a frontend app.</div>' +
          '</div>' +
        '</div>' +
        '<div class="dapp-landing-grid">' + cats + '</div>' +

        '<div class="dapp-section-head">' +
          '<div>' +
            '<h2 class="dapp-section-title">Featured</h2>' +
            '<div class="dapp-section-sub">A taste of what\'s inside.</div>' +
          '</div>' +
        '</div>' +
        '<div class="dapp-featured">' + featured + '</div>' +
      '</div>';

    // Render featured previews
    document.querySelectorAll('[data-featured]').forEach(function (el) {
      var key = el.dataset.featured;
      var e = state.byKey[key];
      if (!e) return;
      renderPreviewInto(el, e, { isFeature: true });
    });
  }

  function renderFolder(folder) {
    var list = state.byFolder[folder];
    if (!list) {
      $content.innerHTML = '<div class="dapp-view"><div class="dapp-empty">Folder not found.<div class="dapp-empty-hint">' + esc(folder) + '/</div></div></div>';
      return;
    }
    var meta = FOLDER_DESCRIPTIONS[folder] || { icon: '📁', desc: '' };
    var cards = list.map(function (e) {
      var tags = e.tags.split(/\s+/).filter(Boolean).slice(0, 4).map(function (t) {
        return '<span class="dapp-tag">' + esc(t) + '</span>';
      }).join('');
      return '<a class="dapp-folder-card" href="#/' + esc(e.folder) + '/' + esc(e.file) + '">' +
        '<div class="dapp-folder-card-name">' + esc(e.file) + '</div>' +
        '<div class="dapp-folder-card-desc">' + esc(e.desc) + '</div>' +
        '<div class="dapp-folder-card-foot">' + tags + '</div>' +
      '</a>';
    }).join('');

    $content.innerHTML =
      '<div class="dapp-view">' +
        '<div class="dapp-view-head">' +
          '<h1 class="dapp-view-title">' + meta.icon + '  ' + esc(folder) + '/</h1>' +
          '<div class="dapp-view-meta">' +
            '<span>' + list.length + ' snippets</span>' +
          '</div>' +
          '<div class="dapp-view-desc">' + esc(meta.desc) + '</div>' +
        '</div>' +
        '<div class="dapp-folder-grid">' + cards + '</div>' +
      '</div>';
  }

  function renderComponent(folder, file) {
    var key = folder + '/' + file;
    var entry = state.byKey[key];
    if (!entry) {
      $content.innerHTML = '<div class="dapp-view"><div class="dapp-empty">Snippet not found.<div class="dapp-empty-hint">' + esc(key) + '</div></div></div>';
      return;
    }

    var comps = companions(entry);
    var tagsHtml = entry.tags.split(/\s+/).filter(Boolean).slice(0, 12).map(function (t) {
      return '<span class="dapp-tag">' + esc(t) + '</span>';
    }).join('');

    var compsHtml = comps.map(function (c) {
      return '<span class="dapp-view-path">' + esc(c.path) + '</span>';
    }).join(' ');

    $content.innerHTML =
      '<div class="dapp-view">' +
        '<div class="dapp-view-head">' +
          '<h1 class="dapp-view-title">' + esc(file) + '</h1>' +
          '<div class="dapp-view-meta">' +
            compsHtml +
            (entry.global ? '<span class="dapp-view-pill is-' + (entry.kind === 'JS' ? 'js' : 'css') + '">global: ' + esc(entry.global) + '</span>' : '') +
          '</div>' +
          '<div class="dapp-view-desc">' + esc(entry.desc) + '</div>' +
          '<div class="dapp-view-tags">' + tagsHtml + '</div>' +
        '</div>' +
        '<div class="dapp-preview">' +
          '<div class="dapp-preview-head">' +
            '<div class="dapp-preview-tabs">' +
              '<button class="dapp-preview-tab is-active" data-tab="preview">Preview</button>' +
              '<button class="dapp-preview-tab" data-tab="source">Source</button>' +
            '</div>' +
            '<div class="dapp-preview-actions">' +
              '<a class="dapp-btn" href="' + GITHUB_URL + '/blob/main/' + esc(entry.path) + '" target="_blank" rel="noopener">GitHub ↗</a>' +
              '<button class="dapp-btn" id="dapp-copy">Copy path</button>' +
            '</div>' +
          '</div>' +
          '<div class="dapp-preview-body" id="dapp-preview-body"></div>' +
          '<div class="dapp-source" id="dapp-source"><pre>Loading…</pre></div>' +
        '</div>' +
      '</div>';

    // Wire tabs
    document.querySelectorAll('.dapp-preview-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        document.querySelectorAll('.dapp-preview-tab').forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
        var which = t.dataset.tab;
        document.getElementById('dapp-preview-body').style.display = which === 'preview' ? '' : 'none';
        var src = document.getElementById('dapp-source');
        src.classList.toggle('is-open', which === 'source');
        if (which === 'source' && !src.dataset.loaded) {
          src.dataset.loaded = '1';
          loadSource(entry.path).then(function (txt) {
            src.querySelector('pre').textContent = txt || '(could not load source)';
          });
        }
      });
    });
    // Wire copy button
    var copyBtn = document.getElementById('dapp-copy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(entry.path);
      copyBtn.textContent = 'Copied ✓';
      setTimeout(function () { copyBtn.textContent = 'Copy path'; }, 1500);
    });

    // Load CSS + JS of all companions then render preview
    var toLoad = comps.map(function (c) {
      return c.kind === 'CSS' ? loadCSS(c.path) : loadJS(c.path);
    });
    Promise.all(toLoad).then(function () {
      var body = document.getElementById('dapp-preview-body');
      renderPreviewInto(body, entry, { comps: comps });
    });
  }

  function renderPreviewInto(target, entry, opts) {
    opts = opts || {};
    // 1. Use custom preview if registered (hand-crafted for ~40 high-impact files)
    var Previews = window.DemoPreviews || {};
    var fn = Previews[entry.folder + '/' + entry.file] || Previews[entry.file];
    if (fn) {
      try { fn(target, entry, opts); return; }
      catch (e) { console.warn('Preview error for', entry.path, e); }
    }
    // 2. Auto-preview: extract Usage block from header, render any HTML found,
    //    auto-init JS globals on the rendered markup.
    renderAutoPreview(target, entry, opts);
  }

  // Extract the Usage block from a source file's header comment.
  // Looks between `Usage:` and the next section heading (Variants/Modifiers/etc) or block close.
  function extractUsageBlock(source) {
    var lines = source.split('\n');
    var start = -1;
    for (var i = 0; i < Math.min(lines.length, 200); i++) {
      if (/^\s*(?:\*\s+)?Usage\s*:\s*$/i.test(lines[i])) { start = i + 1; break; }
    }
    if (start === -1) return null;
    var out = [];
    for (var j = start; j < lines.length; j++) {
      var line = lines[j];
      // Stop at next section heading or end of comment block
      if (/^\s*(?:\*\s+)?(?:Variants|Modifiers|Methods|States|Sizes|Shape|Behaviors|Modes|Color|Color modes|Frequencies|Color presets|Hooks|Color variants|Special|Decorations|Group|Color modes|Modifiers|Setup|Note|Notes|Params|Parameters|Options|Returns|Examples|Pre-set|Type|Type-based|Sizing|Shapes|Direction)\s*:/i.test(line)) break;
      if (/^\s*\*\/\s*$/.test(line)) break;
      if (/^\s*={5,}/.test(line)) break;
      // Strip "   * " comment prefix and leading "   " indentation (the 5-space block indent inside our comment template)
      var cleaned = line.replace(/^\s*\*\s?/, '').replace(/^\s{5}/, '').replace(/^\s{4}/, '').replace(/^\s{3}/, '').replace(/^\s{2}/, '');
      out.push(cleaned);
    }
    return out.join('\n').replace(/\s+$/, '');
  }

  // Find contiguous HTML blocks in extracted Usage text.
  // Heuristic: lines starting with `<` are HTML; continuation lines (indented or empty)
  // belong to the current block until a non-HTML line.
  function extractHtmlBlock(usageText) {
    if (!usageText) return null;
    var lines = usageText.split('\n');
    var blocks = [];
    var cur = [];
    var inBlock = false;
    var openTagsOpen = 0;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trimStart();
      // Require `<` followed by a tag letter or `!` (comment) — avoids matching JS `<` operators
      var startsTag = /^<[a-zA-Z!]/.test(trimmed);
      if (startsTag) {
        if (!inBlock) { inBlock = true; cur = []; }
        cur.push(line);
        // Track unclosed tags to detect multi-line elements
        openTagsOpen += (line.match(/<[a-zA-Z][^/>]*[^/>]>/g) || []).length;
        openTagsOpen -= (line.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
        openTagsOpen -= (line.match(/<[^>]*\/>/g) || []).length;
      } else if (inBlock && (openTagsOpen > 0 || /^\s+/.test(line))) {
        // Continuation (inside an open tag) or indented content
        cur.push(line);
      } else if (inBlock && line.trim() === '') {
        // Single blank line — keep adding (could be between siblings)
        cur.push(line);
        if (i + 1 < lines.length && !lines[i + 1].trimStart().startsWith('<') && openTagsOpen <= 0) {
          // End block
          blocks.push(cur.join('\n'));
          cur = [];
          inBlock = false;
          openTagsOpen = 0;
        }
      } else if (inBlock) {
        blocks.push(cur.join('\n'));
        cur = [];
        inBlock = false;
        openTagsOpen = 0;
      }
    }
    if (cur.length) blocks.push(cur.join('\n'));
    if (!blocks.length) return null;
    // Join all blocks with a separator (we'll render them all)
    return blocks.map(function (b) { return b.trim(); }).filter(Boolean).join('\n\n');
  }

  // Try to auto-init a JS module on the rendered preview.
  // Looks for the entry's global (from INDEX) and calls .init/.create/.bind on
  // the first selector mentioned in the Usage block, or on a child of target.
  function tryAutoInit(target, entry, usageText) {
    if (!entry.global || !window[entry.global]) return;
    var Module = window[entry.global];
    var methods = ['init', 'bind', 'create', 'attach', 'apply'];
    // Try to find a selector hint in the usage text — e.g. .init('.foo')
    var selectorMatch = usageText && usageText.match(/\.\s*(?:init|bind|create|attach)\s*\(\s*['"]([^'"]+)['"]/);
    var selector = selectorMatch ? selectorMatch[1] : null;
    var attempt = selector
      ? (function () { try { return target.querySelector(selector); } catch (e) { return null; } })()
      : target.firstElementChild;
    if (!attempt) return;
    for (var m = 0; m < methods.length; m++) {
      var fn = Module[methods[m]];
      if (typeof fn === 'function') {
        try { fn.call(Module, attempt); return; }
        catch (e) { /* try next */ }
      }
    }
  }

  function renderAutoPreview(target, entry, opts) {
    // Placeholder while loading
    target.innerHTML =
      '<div style="display:flex;align-items:center;gap:0.5rem;color:rgba(255,255,255,0.5);font-size:0.78rem;padding:1.5rem;">' +
        '<span class="dapp-spin"></span>' +
        '<span>Building preview from ' + esc(entry.path) + '…</span>' +
      '</div>';

    loadSource(entry.path).then(function (source) {
      if (!source) {
        return renderFallback(target, entry, null, null);
      }
      var usage = extractUsageBlock(source);
      var html = extractHtmlBlock(usage);

      if (!html) {
        // No HTML found — try class-variant preview tiles fallback
        return renderFallback(target, entry, usage, source);
      }

      // Render the HTML
      target.innerHTML =
        '<div class="dapp-auto-preview" style="width:100%;display:flex;flex-direction:column;align-items:center;gap:0.85rem;">' +
          '<div class="dapp-auto-stage" style="width:100%;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0.6rem;min-height:60px;">' +
            html +
          '</div>' +
          '<details style="width:100%;max-width:540px;font-size:0.7rem;color:rgba(255,255,255,0.45);">' +
            '<summary style="cursor:pointer;user-select:none;padding:0.25rem 0;">Show usage source</summary>' +
            '<pre style="margin:0.3rem 0 0;padding:0.6rem 0.75rem;background:rgba(0,0,0,0.4);border-radius:6px;font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:0.7rem;line-height:1.5;overflow-x:auto;color:#d4d4dc;">' + esc(usage || html) + '</pre>' +
          '</details>' +
        '</div>';

      // Try to auto-initialize the component on the rendered markup
      var stage = target.querySelector('.dapp-auto-stage');
      if (stage && entry.kind === 'JS') {
        // Brief delay to let CSS apply
        setTimeout(function () { tryAutoInit(stage, entry, usage); }, 30);
      }
    }).catch(function () {
      renderFallback(target, entry, null, null);
    });
  }

  function renderFallback(target, entry, usage, source) {
    var icon = (FOLDER_DESCRIPTIONS[entry.folder] && FOLDER_DESCRIPTIONS[entry.folder].icon) || '•';
    var hasUsage = usage && usage.trim().length;

    // If this is a CSS entry and we have the source, try class-variant preview tiles
    var variantPreview = '';
    if (entry.kind === 'CSS' && source) {
      variantPreview = buildVariantPreview(source);
    }

    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.85rem;padding:1.5rem 1rem;text-align:center;width:100%;">' +
        '<div style="font-size:1.8rem;">' + icon + '</div>' +
        '<div style="font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:0.85rem;font-weight:600;color:#fff;">' + esc(entry.file) + '</div>' +
        '<div style="font-size:0.78rem;color:rgba(255,255,255,0.65);max-width:580px;line-height:1.5;">' + esc(entry.desc) + '</div>' +
        variantPreview +
        (hasUsage
          ? '<details style="width:100%;max-width:580px;font-size:0.7rem;color:rgba(255,255,255,0.45);"><summary style="cursor:pointer;user-select:none;padding:0.25rem 0;">Show usage source</summary><pre style="margin:0.3rem 0 0;padding:0.6rem 0.75rem;background:rgba(0,0,0,0.4);border-radius:6px;font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:0.7rem;line-height:1.5;overflow-x:auto;color:#d4d4dc;white-space:pre-wrap;">' + esc(usage) + '</pre></details>'
          : '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);">Open the <b>Source</b> tab for the full file.</div>'
        ) +
      '</div>';
  }

  // Extract top-level class names from CSS source and group by prefix.
  // Then render a preview "wall" with one tile per variant.
  function buildVariantPreview(source) {
    // Strip /* … */ comments to avoid matching example markup inside header
    var clean = source.replace(/\/\*[\s\S]*?\*\//g, '');

    // Find class selectors used in rule heads (left-side, before {).
    // Capture all .name-foo style class identifiers across the file.
    var classes = {};
    var ruleHeads = clean.match(/^[^{}\n][^{}]*\{/gm) || [];
    ruleHeads.forEach(function (head) {
      // Skip @-rules and :where/:is/:has wrappers
      head = head.replace(/:where\([^)]*\)|:is\([^)]*\)|:has\([^)]*\)/g, '');
      var rx = /\.([a-z][a-z0-9_-]*)/gi;
      var m;
      while ((m = rx.exec(head)) !== null) {
        var n = m[1];
        // Skip overly long names, pseudo-state classes, modifier flags
        if (n.length < 2 || n.length > 50) continue;
        if (/^is-|^has-/.test(n)) continue;
        classes[n] = (classes[n] || 0) + 1;
      }
    });

    var names = Object.keys(classes);
    if (names.length < 2) return '';

    // Find common prefix(es). Group classes by their first hyphen-segment.
    var groups = {};
    names.forEach(function (n) {
      var parts = n.split('-');
      // Use 2-segment prefix for namespace-rich variants, else 1.
      var prefix = parts.length >= 2 ? parts[0] + '-' + parts[1] : parts[0];
      // If the single-segment prefix is a known root class (matches a standalone classname), use that instead.
      if (classes[parts[0]] && parts.length > 1) prefix = parts[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(n);
    });

    // Pick the largest variant group
    var bestKey = null, bestCount = 0;
    Object.keys(groups).forEach(function (k) {
      if (groups[k].length > bestCount) { bestCount = groups[k].length; bestKey = k; }
    });
    if (!bestKey || bestCount < 2) return '';
    var variants = groups[bestKey].slice(0, 24); // cap at 24 tiles

    // Determine if we have a "base" class (the root one without variant suffix)
    var baseGuess = bestKey;
    var hasBase = classes[baseGuess] && variants.indexOf(baseGuess) !== -1;
    var withoutBase = hasBase ? variants.filter(function (n) { return n !== baseGuess; }) : variants;

    if (withoutBase.length === 0) return '';

    // Render tiles
    var tiles = withoutBase.map(function (v) {
      var classes = hasBase ? baseGuess + ' ' + v : v;
      var label = v.replace(baseGuess + '-', '').replace(baseGuess, '') || v;
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.4rem;">' +
                '<div class="' + classes + '" style="min-width:64px;min-height:32px;display:grid;place-items:center;padding:0.4rem 0.7rem;">' +
                  '<span style="font-size:0.72rem;font-family:ui-monospace,monospace;opacity:0.85;">' + esc(label || '·') + '</span>' +
                '</div>' +
              '</div>';
    }).join('');

    return '<div style="margin:0.6rem 0 0.2rem;font-size:0.7rem;color:rgba(255,255,255,0.4);letter-spacing:0.06em;text-transform:uppercase;">' + esc(bestCount) + ' variant' + (bestCount > 1 ? 's' : '') + ' detected · prefix <code style="background:rgba(255,255,255,0.06);padding:0 4px;border-radius:3px;">' + esc(bestKey) + '</code></div>' +
           '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:center;max-width:720px;width:100%;padding:0.8rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">' +
             tiles +
           '</div>';
  }

  // ===== Utility =====
  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]);
    });
  }

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', function () {
    $content = document.getElementById('dapp-content');
    $crumbs = document.getElementById('dapp-crumbs');
    $nav = document.getElementById('dapp-nav');

    document.getElementById('dapp-search-input').addEventListener('input', renderSidebar);
    document.getElementById('dapp-mobile-toggle').addEventListener('click', function () {
      document.body.classList.toggle('is-sidebar-open');
    });

    window.addEventListener('hashchange', onRouteChange);

    loadIndex().then(function () {
      onRouteChange();
    }).catch(function (err) {
      $content.innerHTML = '<div class="dapp-view"><div class="dapp-empty">Could not load INDEX.md.<div class="dapp-empty-hint">' + esc(err.message || err) + '</div></div></div>';
    });
  });
})();
