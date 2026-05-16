/* ============================================
   TEXT FLIPPING BOARD — Animate split-flap cells to target text
   Inspired by airport displays, Aceternity TextFlippingBoard
   ============================================
   Usage:
     <div class="flap" data-flap>PARIS</div>

     // Build cells from existing text on init, then animate:
     var board = TextFlippingBoard.init('[data-flap]');
     board.setText('LONDON');
     board.setText('TOKYO', { stagger: 80 });

     // Cycling clock:
     setInterval(() => board.setText(new Date().toLocaleTimeString()), 1000);

     // Random scramble effect:
     board.scramble({ duration: 1500, target: 'HELLO' });

   Char-pool order matters — JS animates through it from current → target.
   ============================================ */
(function (root) {
  'use strict';

  var defaultChars = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:!?-_/&';

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(el, opts) {
    opts = opts || {};
    var chars = (el.dataset.flapChars || opts.chars || defaultChars).toUpperCase();
    var initialText = (el.dataset.flapText != null ? el.dataset.flapText : el.textContent.trim()).toUpperCase();

    // Build cells if not already present
    var cells = el.querySelectorAll('.flap-cell');
    if (cells.length === 0 || cells.length < initialText.length) {
      el.innerHTML = '';
      for (var i = 0; i < initialText.length; i++) {
        var c = document.createElement('span');
        c.className = 'flap-cell';
        c.textContent = initialText[i] || ' ';
        el.appendChild(c);
      }
      cells = el.querySelectorAll('.flap-cell');
    }

    var current = initialText.split('');

    function setText(text, options) {
      options = options || {};
      var target = text.toUpperCase();
      var stagger = options.stagger || 60;
      var perStep = options.perStep || 80;

      // Match length
      while (cells.length < target.length) {
        var c = document.createElement('span');
        c.className = 'flap-cell';
        c.textContent = ' ';
        el.appendChild(c);
        current.push(' ');
        cells = el.querySelectorAll('.flap-cell');
      }
      while (cells.length > target.length) {
        cells[cells.length - 1].remove();
        current.pop();
        cells = el.querySelectorAll('.flap-cell');
      }

      // Animate each cell
      Array.prototype.forEach.call(cells, function (cell, idx) {
        var from = current[idx] || ' ';
        var to = target[idx] || ' ';
        if (from === to) return;
        animateCell(cell, from, to, perStep, idx * stagger);
        current[idx] = to;
      });
    }

    function animateCell(cell, from, to, perStep, delay) {
      var fromIdx = chars.indexOf(from);
      var toIdx = chars.indexOf(to);
      if (fromIdx === -1) fromIdx = 0;
      if (toIdx === -1) toIdx = 0;
      var steps = (toIdx - fromIdx + chars.length) % chars.length;
      if (steps === 0) steps = chars.length;

      var i = 0;
      function step() {
        i++;
        var nextIdx = (fromIdx + i) % chars.length;
        var nextChar = chars[nextIdx];
        var displayed = chars[(fromIdx + i - 1) % chars.length];
        flipCell(cell, displayed, nextChar, perStep);
        if (i < steps) {
          setTimeout(step, perStep);
        } else {
          cell.textContent = to;
        }
      }
      setTimeout(step, delay || 0);
    }

    function flipCell(cell, from, to, duration) {
      // Build top + bottom halves with from→to char transition
      cell.innerHTML =
        '<div class="flap-half flap-half-top"><span>' + escape(from) + '</span></div>' +
        '<div class="flap-half flap-half-bottom"><span>' + escape(to) + '</span></div>';
      cell.classList.remove('is-flipping');
      void cell.offsetWidth;     // force reflow
      cell.classList.add('is-flipping');
      var actualDur = (duration || 80) - 4;
      cell.style.setProperty('--flap-dur', actualDur + 'ms');
      setTimeout(function () {
        cell.classList.remove('is-flipping');
        cell.innerHTML = '';
        cell.textContent = to;
      }, duration);
    }

    function scramble(options) {
      options = options || {};
      var duration = options.duration || 1500;
      var targetText = (options.target || current.join('')).toUpperCase();
      var t0 = Date.now();
      var iv = setInterval(function () {
        var p = (Date.now() - t0) / duration;
        if (p >= 1) {
          clearInterval(iv);
          setText(targetText, { stagger: 0, perStep: 40 });
          return;
        }
        Array.prototype.forEach.call(cells, function (cell, idx) {
          if (p < 0.7) {
            cell.textContent = chars[Math.floor(Math.random() * chars.length)];
          } else if (p < idx / cells.length + 0.4) {
            cell.textContent = chars[Math.floor(Math.random() * chars.length)];
          } else {
            cell.textContent = targetText[idx] || ' ';
            current[idx] = targetText[idx] || ' ';
          }
        });
      }, 50);
    }

    return {
      el: el,
      setText: setText,
      scramble: scramble,
      current: function () { return current.join(''); }
    };
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]);
    });
  }

  var TextFlippingBoard = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = TextFlippingBoard;
  else root.TextFlippingBoard = TextFlippingBoard;
})(typeof window !== 'undefined' ? window : this);
