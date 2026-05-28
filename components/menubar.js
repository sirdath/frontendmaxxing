/* ============================================
   MENUBAR — Open/switch/close + keyboard nav for the app menu bar
   Inspired by macOS menu bar / Radix Menubar
   ============================================
   Usage:
     Menubar.init('.mbar', { onSelect: function (label, item) { … } });

   Behavior:
     • Click a top-level trigger to open its dropdown.
     • While any menu is open, hovering a sibling trigger switches to it.
     • ←/→ move between top menus, ↑/↓ move items, Enter selects, Esc closes.
     • Click outside closes. Items with .mbar-disabled are skipped.
   ============================================ */
(function (root) {
  'use strict';

  function create(bar, opts) {
    opts = opts || {};
    var menus = Array.prototype.slice.call(bar.querySelectorAll(':scope > .mbar-menu'));
    var openIdx = -1;

    function items(menu) {
      return Array.prototype.slice.call(
        menu.querySelectorAll(':scope > .mbar-dropdown > .mbar-item:not(.mbar-disabled)')
      );
    }
    function clearFocus() { bar.querySelectorAll('.mbar-item.is-focus').forEach(function (i) { i.classList.remove('is-focus'); }); }

    function openMenu(i) {
      menus.forEach(function (m, idx) { m.classList.toggle('is-open', idx === i); });
      openIdx = i; clearFocus();
    }
    function closeAll() { menus.forEach(function (m) { m.classList.remove('is-open'); }); openIdx = -1; clearFocus(); }

    menus.forEach(function (menu, i) {
      var trigger = menu.querySelector('.mbar-trigger');
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (openIdx === i) closeAll(); else openMenu(i);
      });
      trigger.addEventListener('mouseenter', function () { if (openIdx !== -1 && openIdx !== i) openMenu(i); });

      menu.addEventListener('click', function (e) {
        var item = e.target.closest('.mbar-item');
        if (!item || item.classList.contains('mbar-disabled') || item.classList.contains('mbar-submenu')) return;
        if (item.classList.contains('mbar-checked') || item.dataset.toggle != null) item.classList.toggle('mbar-checked');
        if (typeof opts.onSelect === 'function') opts.onSelect(item.textContent.trim().replace(/\s+/g, ' '), item);
        closeAll();
      });
    });

    document.addEventListener('click', function (e) { if (!bar.contains(e.target)) closeAll(); });

    document.addEventListener('keydown', function (e) {
      if (openIdx === -1) return;
      var menu = menus[openIdx];
      var its = items(menu);
      var cur = its.indexOf(menu.querySelector('.mbar-item.is-focus'));

      if (e.key === 'Escape') { e.preventDefault(); var t = menu.querySelector('.mbar-trigger'); closeAll(); if (t) t.focus(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); openMenu((openIdx + 1) % menus.length); }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); openMenu((openIdx - 1 + menus.length) % menus.length); }
      else if (e.key === 'ArrowDown')  { e.preventDefault(); clearFocus(); var n = its[(cur + 1) % its.length]; if (n) n.classList.add('is-focus'), n.focus(); }
      else if (e.key === 'ArrowUp')    { e.preventDefault(); clearFocus(); var p = its[(cur - 1 + its.length) % its.length]; if (p) p.classList.add('is-focus'), p.focus(); }
      else if (e.key === 'Enter') { var f = menu.querySelector('.mbar-item.is-focus'); if (f) { e.preventDefault(); f.click(); } }
    });

    return { el: bar, open: openMenu, close: closeAll };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var node = document.querySelector(target);
      return node ? create(node, opts) : null;
    }
    return create(target, opts);
  }

  var Menubar = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = Menubar;
  else root.Menubar = Menubar;
})(typeof window !== 'undefined' ? window : this);
