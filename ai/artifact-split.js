/* ============================================
   ARTIFACT SPLIT — Pane controller, version pager, tab switcher, splitter drag
   Inspired by Claude Artifacts, v0.dev, ChatGPT Canvas
   ============================================
   Usage:
     var artifact = ArtifactSplit.init('.afct', {
       versions: [
         { id: 'v1', label: 'Initial', html: '<h1>Hi</h1>', code: '<h1>Hi</h1>' },
         { id: 'v2', label: 'Added styles', html: '...', code: '...' }
       ],
       initialVersion: 0,
       initialTab: 'preview',
       onTabChange: function (tab) {},
       onVersionChange: function (index, version) {},
       onAction: function (action) {}        // 'open' | 'download' | 'close'
     });

     artifact.addVersion({ html, code });
     artifact.setVersion(index);
     artifact.setTab('preview' | 'code');
     artifact.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    versions: [],
    initialVersion: -1,        // -1 = last
    initialTab: 'preview',
    initialSplit: 50,
    minSplit: 20,
    maxSplit: 80,
    onTabChange: null,
    onVersionChange: null,
    onAction: null
  };

  function init(target, opts) {
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    var o = mergeOpts(opts);

    if (!host.classList.contains('afct')) host.classList.add('afct');
    if (!host.querySelector('.afct-pane')) buildMarkup(host);

    var state = {
      tab: o.initialTab,
      versions: o.versions.slice(),
      currentIdx: o.initialVersion < 0 ? Math.max(0, o.versions.length - 1) : o.initialVersion
    };

    var tabs = host.querySelectorAll('.afct-tab');
    var versionNum = host.querySelector('.afct-ver-num');
    var versionPrev = host.querySelector('.afct-ver-prev');
    var versionNext = host.querySelector('.afct-ver-next');
    var iframe = host.querySelector('.afct-iframe');
    var codeView = host.querySelector('.afct-view-code pre code');
    var splitter = host.querySelector('.afct-splitter');

    setTab(state.tab);
    if (state.versions.length) renderVersion();

    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        setTab(t.dataset.afctTab);
      });
    });
    if (versionPrev) versionPrev.addEventListener('click', function () { setVersion(state.currentIdx - 1); });
    if (versionNext) versionNext.addEventListener('click', function () { setVersion(state.currentIdx + 1); });

    host.querySelectorAll('.afct-action').forEach(function (b) {
      b.addEventListener('click', function () {
        var action = b.getAttribute('aria-label').toLowerCase();
        if (action === 'download') doDownload();
        else if (action === 'open') doOpen();
        if (typeof o.onAction === 'function') o.onAction(action);
      });
    });

    // Splitter drag
    if (splitter) {
      var dragging = false;
      splitter.addEventListener('pointerdown', function (e) {
        dragging = true;
        splitter.classList.add('is-dragging');
        try { splitter.setPointerCapture(e.pointerId); } catch (_) {}
      });
      window.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var rect = host.getBoundingClientRect();
        var pct = ((e.clientX - rect.left) / rect.width) * 100;
        pct = Math.max(o.minSplit, Math.min(o.maxSplit, pct));
        host.style.setProperty('--af-split', (100 - pct) + '%');
      });
      window.addEventListener('pointerup', function () {
        dragging = false;
        splitter.classList.remove('is-dragging');
      });
    }

    function setTab(tab) {
      state.tab = tab;
      tabs.forEach(function (t) { t.classList.toggle('is-active', t.dataset.afctTab === tab); });
      host.querySelectorAll('.afct-view').forEach(function (v) {
        v.classList.toggle('is-active', v.classList.contains('afct-view-' + tab));
      });
      if (typeof o.onTabChange === 'function') o.onTabChange(tab);
    }

    function setVersion(idx) {
      if (idx < 0 || idx >= state.versions.length) return;
      state.currentIdx = idx;
      renderVersion();
      if (typeof o.onVersionChange === 'function') o.onVersionChange(idx, state.versions[idx]);
    }

    function renderVersion() {
      var v = state.versions[state.currentIdx];
      if (!v) return;
      if (iframe) {
        if (v.url) iframe.src = v.url;
        else if (v.html != null) {
          var doc = iframe.contentDocument;
          if (doc) { doc.open(); doc.write(v.html); doc.close(); }
          else iframe.srcdoc = v.html;
        }
      }
      if (codeView) codeView.textContent = v.code || '';
      if (versionNum) {
        versionNum.textContent = (v.label ? v.label + ' · ' : '') + 'v' + (state.currentIdx + 1) + ' / ' + state.versions.length;
      }
      if (versionPrev) versionPrev.disabled = state.currentIdx === 0;
      if (versionNext) versionNext.disabled = state.currentIdx === state.versions.length - 1;
    }

    function addVersion(version) {
      state.versions.push(version);
      state.currentIdx = state.versions.length - 1;
      renderVersion();
    }

    function doDownload() {
      var v = state.versions[state.currentIdx];
      if (!v) return;
      var blob = new Blob([v.code || v.html || ''], { type: v.mime || 'text/html' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (v.filename || 'artifact-v' + (state.currentIdx + 1) + '.html');
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }
    function doOpen() {
      var v = state.versions[state.currentIdx];
      if (!v) return;
      if (v.url) window.open(v.url, '_blank');
      else {
        var blob = new Blob([v.html || v.code || ''], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      }
    }

    function destroy() {
      // Simple cleanup — listeners are removed by garbage collection when host is removed.
    }

    return {
      el: host,
      setTab: setTab,
      setVersion: setVersion,
      addVersion: addVersion,
      destroy: destroy
    };
  }

  function buildMarkup(host) {
    host.innerHTML =
      '<div class="afct-chat"></div>' +
      '<div class="afct-splitter"></div>' +
      '<div class="afct-pane">' +
        '<header class="afct-head">' +
          '<div class="afct-tabs">' +
            '<button class="afct-tab is-active" data-afct-tab="preview">Preview</button>' +
            '<button class="afct-tab" data-afct-tab="code">Code</button>' +
          '</div>' +
          '<div class="afct-version">' +
            '<button class="afct-ver-prev" aria-label="Previous version">‹</button>' +
            '<span class="afct-ver-num">v1 / 1</span>' +
            '<button class="afct-ver-next" aria-label="Next version">›</button>' +
          '</div>' +
          '<div class="afct-actions">' +
            '<button class="afct-action" aria-label="Open">↗</button>' +
            '<button class="afct-action" aria-label="Download">⬇</button>' +
            '<button class="afct-action" aria-label="Close">✕</button>' +
          '</div>' +
        '</header>' +
        '<div class="afct-views">' +
          '<div class="afct-view afct-view-preview is-active">' +
            '<iframe class="afct-iframe" src="about:blank" sandbox="allow-scripts allow-same-origin"></iframe>' +
          '</div>' +
          '<div class="afct-view afct-view-code"><pre><code></code></pre></div>' +
        '</div>' +
      '</div>';
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ArtifactSplit = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ArtifactSplit;
  else root.ArtifactSplit = ArtifactSplit;
})(typeof window !== 'undefined' ? window : this);
