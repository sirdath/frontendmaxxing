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
  function parseIndex(text) {
    var entries = [];
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^\*\*([\w\-\.]+\.(?:css|js|glsl\.js))\*\*\s+`([^`]+)`\s+\((CSS|JS)(?:,\s*global:\s*`([^`]+)`)?\)\s*[—-]\s*tags:\s*(.+)$/);
      if (!m) continue;
      var file = m[1];
      var rawPath = m[2].replace(/\\/g, '/');
      var kind = m[3];
      var globalName = m[4] || null;
      var tags = m[5].trim();
      var folder = rawPath.split('/')[0];
      var desc = (lines[i + 1] || '').trim();
      // Strip leading spaces from desc
      desc = desc.replace(/^\s+/, '');
      entries.push({
        folder: folder,
        file: file,
        path: rawPath,
        kind: kind,
        global: globalName,
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
    // 1. Use custom preview if registered
    var Previews = window.DemoPreviews || {};
    var fn = Previews[entry.folder + '/' + entry.file] || Previews[entry.file];
    if (fn) {
      try { fn(target, entry, opts); return; }
      catch (e) { console.warn('Preview error for', entry.path, e); }
    }
    // 2. Default preview
    renderGenericPreview(target, entry, opts);
  }

  function renderGenericPreview(target, entry, opts) {
    target.innerHTML =
      '<div style="text-align:center;color:rgba(255,255,255,0.65);padding:2rem 1rem;">' +
        '<div style="font-size:2rem;margin-bottom:0.4rem;">' + (FOLDER_DESCRIPTIONS[entry.folder] && FOLDER_DESCRIPTIONS[entry.folder].icon || '•') + '</div>' +
        '<div style="font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:0.85rem;font-weight:600;color:#fff;margin-bottom:0.35rem;">' + esc(entry.file) + '</div>' +
        '<div style="font-size:0.78rem;max-width:480px;margin:0 auto 0.8rem;line-height:1.5;">' + esc(entry.desc) + '</div>' +
        '<div style="font-size:0.72rem;color:rgba(255,255,255,0.45);">' +
          'Open <code style="background:rgba(255,255,255,0.06);padding:0.05rem 0.3rem;border-radius:3px;">' + esc(entry.path) + '</code> for usage examples in the file header.' +
        '</div>' +
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
