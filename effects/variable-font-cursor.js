/* ============================================
   VARIABLE FONT CURSOR — Lerp per-glyph weight/width by cursor distance
   Inspired by Fancy Components, Kinetic Text demos
   ============================================
   Usage:
     <h1 class="vfc" data-vfc>This reacts to your cursor</h1>

     VariableFontCursor.init('[data-vfc]', {
       minWeight: 200, maxWeight: 900,
       minWidth: 75,   maxWidth: 125,
       radius: 220,            // px — falloff distance
       smoothing: 0.18,        // 0..1 — lerp factor (lower = smoother)
       useSlnt: false,         // if true, slant glyphs near cursor
       maxSlant: -10           // slant range (Recursive uses -15..0)
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    minWeight: 200,
    maxWeight: 900,
    minWidth: 75,
    maxWidth: 125,
    radius: 220,
    smoothing: 0.18,
    useSlnt: false,
    maxSlant: -10,
    splitMode: 'char'      // 'char' | 'word'
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(el, opts) {
    var o = mergeOpts(opts);

    // Split into per-char spans (preserving whitespace)
    var text = el.textContent;
    el.textContent = '';
    var spans = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      var span = document.createElement('span');
      span.className = 'vfc-char';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.setProperty('--w', String(o.minWeight + (o.maxWeight - o.minWeight) * 0.4));
      span.style.setProperty('--wd', String((o.minWidth + o.maxWidth) / 2));
      span.style.setProperty('--sl', '0');
      el.appendChild(span);
      spans.push({ el: span, w: o.minWeight + (o.maxWeight - o.minWeight) * 0.4, wd: (o.minWidth + o.maxWidth) / 2, sl: 0 });
    }

    var mouseX = -9999, mouseY = -9999;
    function onMove(e) { mouseX = e.clientX; mouseY = e.clientY; }
    function onLeave() { mouseX = -9999; mouseY = -9999; }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);

    var rafId = null;
    function tick() {
      spans.forEach(function (s) {
        var r = s.el.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dx = mouseX - cx;
        var dy = mouseY - cy;
        var d = Math.sqrt(dx * dx + dy * dy);
        // Falloff curve: 1 at cursor, 0 at radius
        var t = Math.max(0, 1 - d / o.radius);
        var targetW  = o.minWeight + (o.maxWeight - o.minWeight) * t;
        var targetWd = o.minWidth  + (o.maxWidth  - o.minWidth)  * t;
        // Lerp toward target
        s.w  += (targetW  - s.w)  * o.smoothing;
        s.wd += (targetWd - s.wd) * o.smoothing;
        s.el.style.setProperty('--w', s.w.toFixed(0));
        s.el.style.setProperty('--wd', s.wd.toFixed(1));
        if (o.useSlnt) {
          var targetSl = o.maxSlant * t;
          s.sl += (targetSl - s.sl) * o.smoothing;
          s.el.style.setProperty('--sl', s.sl.toFixed(2));
        }
      });
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    function destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      el.textContent = text;
    }

    return { el: el, destroy: destroy };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var VariableFontCursor = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = VariableFontCursor;
  else root.VariableFontCursor = VariableFontCursor;
})(typeof window !== 'undefined' ? window : this);
