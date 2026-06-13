/* ============================================
   CANVAS FX — matrix code rain + gooey metaballs (canvas)
   Inspired by The Matrix title sequence, classic metaball demos
   ============================================
   Renders generative canvas backgrounds for canvas-fx.css.

   Usage:
     CanvasFX.init('[data-canvas-fx]');                 // reads data-canvas-fx="matrix|metaballs"
     CanvasFX.init('.hero', { mode: 'matrix', font: 16 });
     CanvasFX.init('.hero', { mode: 'metaballs', count: 12 });

   Methods: init(sel, opts) — returns instances with destroy().
   Options: mode · font (matrix glyph px) · count (metaball blobs) · speed
   Respects prefers-reduced-motion (draws one static frame; no loop).
   ============================================ */
(function (root) {
  'use strict';

  var REDUCED = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var defaults = { mode: 'matrix', font: 15, count: 0, speed: 1 };
  var GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾋﾌﾍﾎ0123456789'.split('');

  function readVar(el, name, fb) { var v = getComputedStyle(el).getPropertyValue(name).trim(); return v || fb; }
  function hexA(hex, a) {
    var m = String(hex).replace('#', '');
    if (m.length === 3) m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2];
    if (m.length !== 6) return 'rgba(52,211,153,' + a + ')';
    var n = parseInt(m, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function bind(el, opts) {
    opts = Object.assign({}, defaults, opts || {});
    var mode = el.getAttribute('data-canvas-fx') || opts.mode;
    el.classList.add('cvfx', 'cvfx-' + mode);
    var canvas = document.createElement('canvas');
    canvas.className = 'cvfx-canvas';
    el.insertBefore(canvas, el.firstChild);
    var ctx = canvas.getContext('2d');
    var c1 = readVar(el, '--cvfx-c1', mode === 'metaballs' ? '#8b5cf6' : '#34d399');
    var bg = readVar(el, '--cvfx-bg', '#05060a');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, raf = 0;
    var drops = [], blobs = [];
    var mouse = { x: -999, y: -999 };

    function resize() {
      var r = el.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (mode === 'matrix') {
        var cols = Math.ceil(w / opts.font);
        drops = [];
        for (var i = 0; i < cols; i++) drops.push(Math.floor(Math.random() * -h / opts.font));
      } else {
        var n = opts.count || Math.max(6, Math.min(16, Math.round((w * h) / 26000)));
        blobs = [];
        for (var k = 0; k < n; k++) {
          blobs.push({ x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * opts.speed, vy: (Math.random() - 0.5) * opts.speed,
            r: 26 + Math.random() * 40 });
        }
      }
    }

    function matrixFrame(move) {
      ctx.fillStyle = hexA(bg, 0.08); ctx.fillRect(0, 0, w, h);
      ctx.font = opts.font + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        var x = i * opts.font, y = drops[i] * opts.font;
        var ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        ctx.fillStyle = '#dffff0'; ctx.fillText(ch, x, y);                // bright lead glyph
        ctx.fillStyle = hexA(c1, 0.85); ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - opts.font);
        if (move) {
          if (y > h && Math.random() > 0.975) drops[i] = 0;
          else drops[i] += 1;
        }
      }
    }
    function metaFrame(move) {
      ctx.clearRect(0, 0, w, h);
      var draw = function (bx, by, br) {
        var g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, hexA(c1, 1)); g.addColorStop(0.7, hexA(c1, 0.8)); g.addColorStop(1, hexA(c1, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, br, 0, 6.283); ctx.fill();
      };
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        if (move) {
          b.x += b.vx; b.y += b.vy;
          if (b.x < b.r || b.x > w - b.r) b.vx *= -1;
          if (b.y < b.r || b.y > h - b.r) b.vy *= -1;
        }
        draw(b.x, b.y, b.r);
      }
      if (mouse.x > -100) draw(mouse.x, mouse.y, 46);                     // cursor blob
    }

    var frame = mode === 'matrix' ? matrixFrame : metaFrame;
    function loop() { frame(true); raf = requestAnimationFrame(loop); }
    var onMouse = function (e) { var r = el.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    var onOut = function () { mouse.x = mouse.y = -999; };
    if (mode === 'metaballs') { el.addEventListener('pointermove', onMouse); el.addEventListener('pointerleave', onOut); }
    window.addEventListener('resize', resize);
    resize();
    if (REDUCED) frame(false); else loop();

    return {
      el: el, canvas: canvas,
      destroy: function () {
        if (raf) cancelAnimationFrame(raf);
        el.removeEventListener('pointermove', onMouse);
        el.removeEventListener('pointerleave', onOut);
        window.removeEventListener('resize', resize);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return bind(el, opts); });
  }

  var CanvasFX = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CanvasFX;
  else root.CanvasFX = CanvasFX;
})(typeof window !== 'undefined' ? window : this);
