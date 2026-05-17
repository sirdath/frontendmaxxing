/* ============================================
   EDITOR PACK — JS for find-replace + tab management + goto-line
   ============================================
   Usage:
     EditorPack.find('[data-ep-find]', {
       text: () => textareaEl.value,
       onMatch: function (idx, ranges) {},
       onReplace: function (n) {}
     });
     EditorPack.tabs('[data-ep-tabs]', {
       onSelect: function (id) {},
       onClose: function (id) {}
     });
     EditorPack.goto('[data-ep-goto]', { onSubmit: function (line) {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function find(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var input = host.querySelector('.ep-find-row .ep-find-input');
      var replaceInput = host.querySelectorAll('.ep-find-input')[1];
      var countEl = host.querySelector('.ep-find-count');
      var prev = host.querySelector('.ep-find-btn.prev');
      var next = host.querySelector('.ep-find-btn.next');
      var caseBtn = host.querySelector('.ep-find-btn.cs');
      var wholeBtn = host.querySelector('.ep-find-btn.whole');
      var regexBtn = host.querySelector('.ep-find-btn.regex');
      var replaceBtn = host.querySelector('.ep-find-actions .replace');
      var replaceAllBtn = host.querySelector('.ep-find-actions .replace-all');

      var matches = [], idx = -1;

      function build() {
        if (!input) return;
        var q = input.value;
        if (!q) { matches = []; idx = -1; render(); return; }
        var text = typeof opts.text === 'function' ? opts.text() : (opts.text || '');
        var flags = 'g' + (caseBtn && caseBtn.classList.contains('is-on') ? '' : 'i');
        var pattern = q;
        if (!(regexBtn && regexBtn.classList.contains('is-on'))) {
          pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        if (wholeBtn && wholeBtn.classList.contains('is-on')) pattern = '\\b' + pattern + '\\b';
        var re;
        try { re = new RegExp(pattern, flags); } catch (e) { matches = []; idx = -1; render(); return; }
        matches = [];
        var m;
        while ((m = re.exec(text)) !== null) {
          matches.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
          if (m.index === re.lastIndex) re.lastIndex++;
        }
        idx = matches.length ? 0 : -1;
        render();
      }
      function render() {
        if (countEl) countEl.textContent = matches.length === 0 ? 'No results' : (idx + 1) + ' of ' + matches.length;
        if (typeof opts.onMatch === 'function') opts.onMatch(idx, matches);
      }
      if (input) input.addEventListener('input', build);
      [caseBtn, wholeBtn, regexBtn].forEach(function (b) {
        if (b) b.addEventListener('click', function () { b.classList.toggle('is-on'); build(); });
      });
      if (prev) prev.addEventListener('click', function () { if (matches.length) { idx = (idx - 1 + matches.length) % matches.length; render(); } });
      if (next) next.addEventListener('click', function () { if (matches.length) { idx = (idx + 1) % matches.length; render(); } });
      if (replaceBtn) replaceBtn.addEventListener('click', function () {
        if (idx < 0 || !replaceInput) return;
        if (typeof opts.onReplace === 'function') opts.onReplace(1, matches[idx], replaceInput.value);
      });
      if (replaceAllBtn) replaceAllBtn.addEventListener('click', function () {
        if (!replaceInput) return;
        if (typeof opts.onReplace === 'function') opts.onReplace(matches.length, matches, replaceInput.value);
      });
      build();
    });
  }

  function tabs(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function (e) {
        var close = e.target.closest('.ep-tab-close');
        if (close) {
          var t = close.closest('.ep-tab');
          if (t && typeof opts.onClose === 'function') opts.onClose(t.dataset.id || t.textContent.trim(), t);
          e.stopPropagation();
          return;
        }
        var tab = e.target.closest('.ep-tab');
        if (tab) {
          host.querySelectorAll('.ep-tab.is-active').forEach(function (x) { x.classList.remove('is-active'); });
          tab.classList.add('is-active');
          if (typeof opts.onSelect === 'function') opts.onSelect(tab.dataset.id || tab.textContent.trim(), tab);
        }
      });
    });
  }

  function gotoBar(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var input = host.querySelector('.ep-goto-input');
      if (!input) return;
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var val = input.value.trim();
          if (typeof opts.onSubmit === 'function') opts.onSubmit(val);
        } else if (e.key === 'Escape') {
          if (typeof opts.onCancel === 'function') opts.onCancel();
        }
      });
    });
  }

  var EditorPack = { find: find, tabs: tabs, goto: gotoBar };
  if (typeof module !== 'undefined' && module.exports) module.exports = EditorPack;
  else root.EditorPack = EditorPack;
})(typeof window !== 'undefined' ? window : this);
