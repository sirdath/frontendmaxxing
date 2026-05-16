/* ============================================
   INLINE EDIT PACK — JS glue
   ============================================
   Usage:
     InlineEditPack.edit('[data-iep-edit]', { onCommit: function (val, el) {} });
     InlineEditPack.status('[data-iep-status]', { options: ['backlog','todo','doing','done'] });
     InlineEditPack.splitBtn('[data-iep-splitbtn]', { onMain: fn, onMenu: fn });
     InlineEditPack.labels('[data-iep-labels]', { onChange: function (picked) {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function edit(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.setAttribute('contenteditable', 'true');
      var original = host.textContent.trim();
      host.addEventListener('focus', function () { original = host.textContent.trim(); });
      host.addEventListener('blur', function () {
        var val = host.textContent.trim();
        if (val !== original && typeof opts.onCommit === 'function') opts.onCommit(val, host);
      });
      host.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); host.blur(); }
        if (e.key === 'Escape') { host.textContent = original; host.blur(); }
      });
    });
  }

  function status(target, opts) {
    opts = opts || {};
    var states = opts.options || ['backlog', 'todo', 'doing', 'done'];
    each(target, function (host) {
      host.addEventListener('click', function () {
        var cur = states.find(function (s) { return host.classList.contains('iep-status-' + s); }) || states[0];
        var nextIdx = (states.indexOf(cur) + 1) % states.length;
        states.forEach(function (s) { host.classList.remove('iep-status-' + s); });
        host.classList.add('iep-status-' + states[nextIdx]);
        var labelEl = host.querySelector('.iep-status-label');
        if (labelEl) labelEl.textContent = states[nextIdx];
        if (typeof opts.onChange === 'function') opts.onChange(states[nextIdx]);
      });
    });
  }

  function splitBtn(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var main = host.querySelector('.iep-splitbtn-main');
      var toggle = host.querySelector('.iep-splitbtn-toggle');
      if (main) main.addEventListener('click', function () { if (typeof opts.onMain === 'function') opts.onMain(host); });
      if (toggle) toggle.addEventListener('click', function () { if (typeof opts.onMenu === 'function') opts.onMenu(host); });
    });
  }

  function labels(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function (e) {
        var l = e.target.closest('.iep-label');
        if (!l) return;
        l.classList.toggle('is-picked');
        var picked = Array.from(host.querySelectorAll('.iep-label.is-picked')).map(function (el) { return el.textContent.trim(); });
        if (typeof opts.onChange === 'function') opts.onChange(picked);
      });
    });
  }

  var InlineEditPack = { edit: edit, status: status, splitBtn: splitBtn, labels: labels };
  if (typeof module !== 'undefined' && module.exports) module.exports = InlineEditPack;
  else root.InlineEditPack = InlineEditPack;
})(typeof window !== 'undefined' ? window : this);
