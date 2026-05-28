/* ============================================
   MEDIA LIBRARY — selection, view toggle, search filter for the asset grid
   Inspired by Google Drive / Dropbox
   ============================================
   Usage:
     MediaLibrary.init('#lib', {
       multi: true,                 // multi-select (default true)
       onOpen: function (item) {},  // dbl-click / folder click
       onSelect: function (items) {}
     });
   Click selects (ctrl/cmd or .mlib-multi for multi); the .mlib-view buttons
   toggle grid/list; the .mlib-search filters by .mlib-name text.
   ============================================ */
(function (root) {
  'use strict';

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function create(host, opts) {
    opts = Object.assign({ multi: true }, opts || {});

    function selected() { return $all('.mlib-item.is-sel', host); }
    function refresh() {
      var n = selected().length;
      host.classList.toggle('has-sel', n > 0);
      var c = host.querySelector('.mlib-selcount'); if (c) c.textContent = n + ' selected';
      if (typeof opts.onSelect === 'function') opts.onSelect(selected());
    }

    host.addEventListener('click', function (e) {
      var view = e.target.closest('[data-view]');
      if (view) {
        host.classList.toggle('is-list', view.dataset.view === 'list');
        $all('.mlib-view button', host).forEach(function (b) { b.classList.toggle('is-on', b === view); });
        return;
      }
      var item = e.target.closest('.mlib-item');
      if (item) {
        var additive = opts.multi && (e.ctrlKey || e.metaKey || e.shiftKey);
        if (!additive) $all('.mlib-item.is-sel', host).forEach(function (i) { if (i !== item) i.classList.remove('is-sel'); });
        item.classList.toggle('is-sel');
        refresh();
        return;
      }
      // click empty space clears selection
      if (!e.target.closest('.mlib-selbar, .mlib-bar')) { $all('.mlib-item.is-sel', host).forEach(function (i) { i.classList.remove('is-sel'); }); refresh(); }
    });

    host.addEventListener('dblclick', function (e) {
      var item = e.target.closest('.mlib-item');
      if (item && typeof opts.onOpen === 'function') opts.onOpen(item);
    });

    var search = host.querySelector('.mlib-search');
    if (search) search.addEventListener('input', function () {
      var q = search.value.toLowerCase();
      $all('.mlib-item', host).forEach(function (i) {
        var name = (i.querySelector('.mlib-name') || {}).textContent || '';
        i.style.display = name.toLowerCase().indexOf(q) > -1 ? '' : 'none';
      });
    });

    return {
      el: host,
      selected: selected,
      clear: function () { $all('.mlib-item.is-sel', host).forEach(function (i) { i.classList.remove('is-sel'); }); refresh(); }
    };
  }

  function init(target, opts) {
    if (typeof target === 'string') { var n = document.querySelector(target); return n ? create(n, opts) : null; }
    return create(target, opts);
  }

  var MediaLibrary = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = MediaLibrary;
  else root.MediaLibrary = MediaLibrary;
})(typeof window !== 'undefined' ? window : this);
