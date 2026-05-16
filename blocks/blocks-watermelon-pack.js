/* ============================================
   BLOCKS WATERMELON PACK — JS glue for interactive variants
   ============================================
   Usage:
     BlocksWM.predict('[data-bw-predict]', { suggestions: ['frontend','frontendmaxxing','frontier'] });
     BlocksWM.freq('[data-bw-freq]', { onChange: function (opt) {} });
     BlocksWM.chip('[data-bw-chip]', { onChange: function (text) {}, onRemove: function () {} });
     BlocksWM.otp('[data-bw-otp]', { length: 6, onComplete: function (code) {} });
     BlocksWM.copy('[data-bw-copy]', { onCopy: function (text) {} });
     BlocksWM.piltabs('[data-bw-piltabs]', { onChange: function (i) {} });
     BlocksWM.dropbtn('[data-bw-dropbtn]', { onMenu: function () {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function predict(target, opts) {
    opts = opts || {};
    var sugg = opts.suggestions || [];
    each(target, function (host) {
      var input = host.querySelector('.bw-predict-input');
      var ghost = host.querySelector('.bw-predict-ghost');
      if (!input || !ghost) return;
      function update() {
        var v = input.value;
        if (!v) { ghost.innerHTML = ''; return; }
        var match = sugg.find(function (s) {
          return s.toLowerCase().startsWith(v.toLowerCase()) && s.length > v.length;
        });
        if (match) {
          ghost.innerHTML = '<span>' + escapeHtml(v) + '</span>' + escapeHtml(match.slice(v.length));
        } else { ghost.innerHTML = ''; }
      }
      input.addEventListener('input', update);
      input.addEventListener('keydown', function (e) {
        if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghost.textContent) {
          var rest = ghost.textContent;
          input.value = rest;
          ghost.innerHTML = '';
          e.preventDefault();
        }
      });
    });
  }
  function escapeHtml(s) { return s.replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  function freq(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.bw-freq-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          host.querySelectorAll('.bw-freq-opt').forEach(function (o) { o.classList.remove('is-active'); });
          b.classList.add('is-active');
          if (typeof opts.onChange === 'function') opts.onChange(b.textContent.trim());
        });
      });
    });
  }

  function chip(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('dblclick', function (e) {
        if (e.target.matches('.bw-chip-x')) return;
        host.setAttribute('contenteditable', 'true');
        host.focus();
      });
      host.addEventListener('blur', function () {
        host.removeAttribute('contenteditable');
        if (typeof opts.onChange === 'function') opts.onChange(host.textContent.trim());
      });
      host.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); host.blur(); }
      });
      var x = host.querySelector('.bw-chip-x');
      if (x) x.addEventListener('click', function (e) {
        e.stopPropagation();
        host.remove();
        if (typeof opts.onRemove === 'function') opts.onRemove();
      });
    });
  }

  function otp(target, opts) {
    opts = opts || {};
    var len = opts.length || 6;
    each(target, function (host) {
      var cells = host.querySelectorAll('.bw-otp-cell');
      cells.forEach(function (cell, i) {
        cell.maxLength = 1;
        cell.addEventListener('input', function () {
          if (cell.value) cell.classList.add('is-filled');
          else cell.classList.remove('is-filled');
          if (cell.value && i < cells.length - 1) cells[i + 1].focus();
          var code = Array.from(cells).map(function (c) { return c.value; }).join('');
          if (code.length === len && typeof opts.onComplete === 'function') opts.onComplete(code);
        });
        cell.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !cell.value && i > 0) cells[i - 1].focus();
        });
        cell.addEventListener('paste', function (e) {
          var data = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, len);
          cells.forEach(function (c, j) { c.value = data[j] || ''; if (data[j]) c.classList.add('is-filled'); });
          if (data.length === len && typeof opts.onComplete === 'function') opts.onComplete(data);
          e.preventDefault();
        });
      });
    });
  }

  function copy(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var btn = host.querySelector('.bw-copy-btn');
      var inp = host.querySelector('.bw-copy-input');
      if (!btn || !inp) return;
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(inp.value).then(function () {
          host.classList.add('is-copied');
          var original = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(function () { host.classList.remove('is-copied'); btn.textContent = original; }, 1400);
          if (typeof opts.onCopy === 'function') opts.onCopy(inp.value);
        });
      });
    });
  }

  function piltabs(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.bw-piltabs-opt').forEach(function (b, i) {
        b.addEventListener('click', function () {
          host.querySelectorAll('.bw-piltabs-opt').forEach(function (o) { o.classList.remove('is-active'); });
          b.classList.add('is-active');
          if (typeof opts.onChange === 'function') opts.onChange(i, b);
        });
      });
    });
  }

  function dropbtn(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var chev = host.querySelector('.bw-dropbtn-chev');
      if (chev) chev.addEventListener('click', function () { if (typeof opts.onMenu === 'function') opts.onMenu(host); });
    });
  }

  var BlocksWM = { predict: predict, freq: freq, chip: chip, otp: otp, copy: copy, piltabs: piltabs, dropbtn: dropbtn };
  if (typeof module !== 'undefined' && module.exports) module.exports = BlocksWM;
  else root.BlocksWM = BlocksWM;
})(typeof window !== 'undefined' ? window : this);
