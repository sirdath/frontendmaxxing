/* ============================================
   COMMAND PALETTE — ⌘K spotlight launcher with fuzzy filter + keyboard nav
   Inspired by Raycast / Linear / Vercel
   ============================================
   Usage:
     CommandPalette.init('[data-command-palette]', {
       hotkey: 'mod+k',           // mod=⌘ on Mac, Ctrl on Win/Linux
       items: [
         { id: 'new-doc', title: 'New document', meta: 'File', icon: '📄', group: 'Files', shortcut: '⌘N', action: function(){…} },
         { id: 'settings', title: 'Open settings', meta: 'App', icon: '⚙', group: 'Workspace', action: function(){…} }
       ],
       onSelect: function (item) { … }   // fallback if item has no .action
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    items: [],
    hotkey: 'mod+k',
    placeholder: 'Search commands or files…',
    emptyText: 'No matches',
    onSelect: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fuzzyScore(haystack, needle) {
    if (!needle) return 1;
    haystack = haystack.toLowerCase();
    needle = needle.toLowerCase();
    var hi = 0, ni = 0, score = 0;
    while (hi < haystack.length && ni < needle.length) {
      if (haystack[hi] === needle[ni]) { score += 1; ni++; }
      hi++;
    }
    if (ni < needle.length) return 0;
    return score / haystack.length;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var input = el.querySelector('.cmdp-input');
    var list  = el.querySelector('.cmdp-list');
    var overlay = el.querySelector('.cmdp-overlay');

    if (input) input.placeholder = o.placeholder;

    function render(query) {
      var ranked = o.items
        .map(function (it) { return { it: it, score: fuzzyScore(it.title + ' ' + (it.meta || ''), query) }; })
        .filter(function (r) { return r.score > 0; })
        .sort(function (a, b) { return b.score - a.score; });

      if (!ranked.length) {
        list.innerHTML = '<div class="cmdp-empty">' + escape(o.emptyText) + '</div>';
        return;
      }
      var byGroup = {};
      var order = [];
      ranked.forEach(function (r) {
        var g = r.it.group || '';
        if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
        byGroup[g].push(r.it);
      });
      var html = '';
      order.forEach(function (g) {
        html += '<div class="cmdp-group"' + (g ? ' data-label="' + escape(g) + '"' : '') + '>';
        byGroup[g].forEach(function (it) {
          html +=
            '<div class="cmdp-item" data-id="' + escape(it.id || it.title) + '">' +
              (it.icon ? '<div class="cmdp-item-icon">' + escape(it.icon) + '</div>' : '') +
              '<div class="cmdp-item-body">' +
                '<div class="cmdp-item-title">' + escape(it.title) + '</div>' +
                (it.meta ? '<div class="cmdp-item-meta">' + escape(it.meta) + '</div>' : '') +
              '</div>' +
              (it.shortcut ? '<div class="cmdp-item-shortcut">' + escape(it.shortcut) + '</div>' : '') +
            '</div>';
        });
        html += '</div>';
      });
      list.innerHTML = html;
      var first = list.querySelector('.cmdp-item');
      if (first) first.classList.add('is-focused');
    }

    function open()  { el.classList.add('is-open'); input.value = ''; render(''); setTimeout(function () { input.focus(); }, 50); }
    function close() { el.classList.remove('is-open'); }
    function toggle(){ el.classList.contains('is-open') ? close() : open(); }

    function focusedEl() { return list.querySelector('.cmdp-item.is-focused'); }
    function items() { return Array.prototype.slice.call(list.querySelectorAll('.cmdp-item')); }
    function moveFocus(dir) {
      var all = items();
      if (!all.length) return;
      var current = focusedEl();
      var idx = current ? all.indexOf(current) : -1;
      idx = (idx + dir + all.length) % all.length;
      all.forEach(function (n) { n.classList.remove('is-focused'); });
      all[idx].classList.add('is-focused');
      all[idx].scrollIntoView({ block: 'nearest' });
    }
    function pick(node) {
      var id = node.getAttribute('data-id');
      var item = o.items.find(function (it) { return (it.id || it.title) === id; });
      if (!item) return;
      close();
      if (typeof item.action === 'function') item.action();
      else if (typeof o.onSelect === 'function') o.onSelect(item);
    }

    function onInput() { render(input.value); }
    function onKey(e) {
      if (!el.classList.contains('is-open')) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1); }
      else if (e.key === 'Enter') {
        var f = focusedEl();
        if (f) { e.preventDefault(); pick(f); }
      } else if (e.key === 'Escape') { close(); }
    }
    function onClick(e) {
      var item = e.target.closest('.cmdp-item');
      if (item) pick(item);
    }
    function onOverlay(e) {
      if (e.target === overlay) close();
    }
    function onGlobalKey(e) {
      var key = (o.hotkey || '').toLowerCase();
      var mod = key.indexOf('mod') !== -1;
      var keyChar = key.split('+').pop();
      var modPressed = mod && (e.metaKey || e.ctrlKey);
      if (modPressed && e.key.toLowerCase() === keyChar) {
        e.preventDefault();
        toggle();
      } else if (e.key === '/' && !el.classList.contains('is-open') && document.activeElement === document.body) {
        e.preventDefault(); open();
      }
    }

    if (input) input.addEventListener('input', onInput);
    el.addEventListener('keydown', onKey);
    list.addEventListener('click', onClick);
    if (overlay) overlay.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onGlobalKey);

    function destroy() {
      if (input) input.removeEventListener('input', onInput);
      el.removeEventListener('keydown', onKey);
      list.removeEventListener('click', onClick);
      if (overlay) overlay.removeEventListener('click', onOverlay);
      document.removeEventListener('keydown', onGlobalKey);
    }

    return {
      el: el, open: open, close: close, toggle: toggle, destroy: destroy,
      setItems: function (a) { o.items = a; if (el.classList.contains('is-open')) render(input.value); }
    };
  }

  var CommandPalette = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = CommandPalette;
  else root.CommandPalette = CommandPalette;
})(typeof window !== 'undefined' ? window : this);
