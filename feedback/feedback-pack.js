/* ============================================
   FEEDBACK PACK — JS glue (snackbar host, timed-undo, coin-flip, reveal-copy, qr-display)
   ============================================
   Usage:
     FeedbackPack.snack('Saved to favorites', { type: 'success', duration: 3000 });
     FeedbackPack.undo('Email moved to Trash', { duration: 5000, onUndo: function () {} });
     FeedbackPack.coinFlip('[data-fbk-coin]', { onResult: function (side) {} });
     FeedbackPack.revealCopy('[data-fbk-revcopy]');
     FeedbackPack.qr('[data-fbk-qr]', { text: 'https://...' });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function getSnackHost() {
    var host = document.querySelector('.fbk-snack-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'fbk-snack-host';
      document.body.appendChild(host);
    }
    return host;
  }

  function snack(msg, opts) {
    opts = opts || {};
    var host = getSnackHost();
    var el = document.createElement('div');
    el.className = 'fbk-snack' + (opts.type ? ' fbk-snack-' + opts.type : '');
    var icon = ({ success: '✓', error: '!', warn: '⚠', info: 'i' })[opts.type] || '·';
    el.innerHTML = '<span class="fbk-snack-icon">' + icon + '</span><span class="fbk-snack-msg"></span>';
    el.querySelector('.fbk-snack-msg').textContent = msg;
    host.appendChild(el);
    var dur = opts.duration || 3000;
    setTimeout(function () {
      el.classList.add('is-leaving');
      el.addEventListener('animationend', function () { el.remove(); });
    }, dur);
    return el;
  }

  function undo(msg, opts) {
    opts = opts || {};
    var host = getSnackHost();
    var el = document.createElement('div');
    el.className = 'fbk-snack fbk-undo';
    var dur = opts.duration || 5000;
    el.style.setProperty('--fbk-undo-dur', dur + 'ms');
    el.innerHTML = '<span class="fbk-undo-msg"></span><button class="fbk-undo-btn">Undo</button>';
    el.querySelector('.fbk-undo-msg').textContent = msg;
    var btn = el.querySelector('.fbk-undo-btn');
    var done = false;
    btn.addEventListener('click', function () {
      done = true;
      el.classList.add('is-leaving');
      if (typeof opts.onUndo === 'function') opts.onUndo();
      el.addEventListener('animationend', function () { el.remove(); });
    });
    host.appendChild(el);
    setTimeout(function () {
      if (done) return;
      el.classList.add('is-leaving');
      if (typeof opts.onTimeout === 'function') opts.onTimeout();
      el.addEventListener('animationend', function () { el.remove(); });
    }, dur);
    return el;
  }

  function coinFlip(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      if (!host.querySelector('.fbk-coin-inner')) {
        host.innerHTML = '<div class="fbk-coin-inner"><div class="fbk-coin-face">H</div><div class="fbk-coin-face fbk-coin-back">T</div></div>';
      }
      host.classList.add('is-heads');
      host.addEventListener('click', function () {
        var result = Math.random() < 0.5 ? 'heads' : 'tails';
        host.classList.remove('is-heads', 'is-tails');
        host.classList.add('is-flipping');
        setTimeout(function () {
          host.classList.remove('is-flipping');
          host.classList.add('is-' + result);
          if (typeof opts.onResult === 'function') opts.onResult(result);
        }, 1500);
      });
    });
  }

  function revealCopy(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function () {
        host.classList.add('is-revealed');
        var val = host.querySelector('.fbk-revcopy-val');
        if (!val) return;
        navigator.clipboard.writeText(val.textContent.trim()).then(function () {
          host.classList.add('is-copied');
          var hint = host.querySelector('.fbk-revcopy-hint');
          if (hint) {
            var original = hint.textContent;
            hint.textContent = 'Copied!';
            setTimeout(function () { host.classList.remove('is-copied'); hint.textContent = original; }, 1400);
          }
          if (typeof opts.onCopy === 'function') opts.onCopy(val.textContent.trim());
        });
      });
    });
  }

  // Tiny QR generator (basic — produces a low-density code; for real-world use, swap with a library)
  function qr(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var text = opts.text || host.dataset.text || 'frontendmaxxing';
      var size = opts.size || 200;
      var n = 21; // 21x21 grid (version 1 style for visual)
      // Simple hashed pseudo-pattern (NOT a real QR encoding — purely decorative).
      // For production, hook a real lib here.
      var canvas = host.querySelector('canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        var label = host.querySelector('.fbk-qr-label');
        host.insertBefore(canvas, label || null);
      }
      canvas.width = size; canvas.height = size;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = opts.background || '#fff';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = opts.foreground || '#0a0a14';
      var cell = size / n;
      var seed = 0;
      for (var i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) | 0;
      function rand(i, j) {
        var v = (seed * (i + 1) * 137 + j * 73) | 0;
        return ((v ^ (v >>> 7)) & 1) === 0;
      }
      for (var y = 0; y < n; y++) {
        for (var x = 0; x < n; x++) {
          if (rand(x, y)) ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
      // Finder squares (top-left, top-right, bottom-left)
      function finder(x, y) {
        ctx.fillStyle = opts.foreground || '#0a0a14';
        ctx.fillRect(x * cell, y * cell, 7 * cell, 7 * cell);
        ctx.fillStyle = opts.background || '#fff';
        ctx.fillRect((x + 1) * cell, (y + 1) * cell, 5 * cell, 5 * cell);
        ctx.fillStyle = opts.foreground || '#0a0a14';
        ctx.fillRect((x + 2) * cell, (y + 2) * cell, 3 * cell, 3 * cell);
      }
      finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
      var bg = host.querySelector('.fbk-qr-canvas');
      if (bg) bg.remove();
    });
  }

  var FeedbackPack = { snack: snack, undo: undo, coinFlip: coinFlip, revealCopy: revealCopy, qr: qr };
  if (typeof module !== 'undefined' && module.exports) module.exports = FeedbackPack;
  else root.FeedbackPack = FeedbackPack;
})(typeof window !== 'undefined' ? window : this);
