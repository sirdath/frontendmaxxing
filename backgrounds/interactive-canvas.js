/* ============================================
   INTERACTIVE CANVAS — cursor reactivity for interactive-canvas.css
   Inspired by particle-network heroes, cursor spotlights, aurora fields
   ============================================
   Wires the pointer to the CSS variants (--icv-x/--icv-y for light, --icv-px/py
   for aurora drift), draws the `network` particle web on a <canvas>, and rings
   out ripples on click.

   Usage:
     InteractiveCanvas.init('[data-canvas]');          // reads data-canvas="spotlight|dot-grid|aurora|network|ripple"
     InteractiveCanvas.init('.hero', { mode: 'network', count: 70, link: 130 });

   Methods: init(sel, opts) — returns instances with destroy().
   Options: mode · count (network particles) · link (link distance) · speed
   Respects prefers-reduced-motion (network draws one static frame; no drift).
   ============================================ */
(function (root) {
  'use strict';

  var REDUCED = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var defaults = { mode: 'spotlight', count: 0, link: 130, speed: 0.4, auroraPull: 40 };

  function readVar(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name).trim();
    return v || fallback;
  }

  function bind(el, opts) {
    opts = Object.assign({}, defaults, opts || {});
    var mode = el.getAttribute('data-canvas') || opts.mode;
    el.classList.add('icv', 'icv-' + mode);
    var raf = 0, rect = null, cleanup = [];

    function onMove(e) {
      if (!rect) rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (mode === 'aurora') {
        if (REDUCED) return;
        el.style.setProperty('--icv-px', ((x / rect.width - 0.5) * opts.auroraPull).toFixed(1));
        el.style.setProperty('--icv-py', ((y / rect.height - 0.5) * opts.auroraPull).toFixed(1));
      } else {
        el.style.setProperty('--icv-x', x + 'px');
        el.style.setProperty('--icv-y', y + 'px');
      }
    }
    function onEnter() { rect = el.getBoundingClientRect(); }

    // ---- ripple / confetti (click) ----
    if (mode === 'ripple' || mode === 'confetti' || opts.ripple) {
      var onClick = function (e) {
        var r = el.getBoundingClientRect();
        var cx = e.clientX - r.left, cy = e.clientY - r.top;
        if (mode === 'confetti') {
          if (REDUCED) return;
          var colors = [readVar(el, '--icv-c1', '#8b5cf6'), readVar(el, '--icv-c2', '#ec4899'), '#fbbf24', '#34d399', '#38bdf8'];
          for (var k = 0; k < 26; k++) {
            (function (color) {
              var piece = document.createElement('span');
              piece.className = 'icv-confetti';
              piece.style.left = cx + 'px'; piece.style.top = cy + 'px'; piece.style.background = color;
              el.appendChild(piece);
              var ang = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 130;
              var anim = piece.animate([
                { transform: 'translate(-50%,-50%) translate(0,0) rotate(0deg)', opacity: 1 },
                { transform: 'translate(-50%,-50%) translate(' + (Math.cos(ang) * dist).toFixed(1) + 'px,' + (Math.sin(ang) * dist + 100).toFixed(1) + 'px) rotate(' + (Math.random() * 720 - 360).toFixed(0) + 'deg)', opacity: 0 }
              ], { duration: 900 + Math.random() * 600, easing: 'cubic-bezier(0.2,0.7,0.3,1)' });
              anim.onfinish = function () { if (piece.parentNode) piece.parentNode.removeChild(piece); };
            })(colors[k % colors.length]);
          }
        } else {
          var size = Math.max(r.width, r.height) * 1.2;
          var dot = document.createElement('span');
          dot.className = 'icv-ripple-dot';
          dot.style.width = dot.style.height = size + 'px';
          dot.style.left = cx + 'px'; dot.style.top = cy + 'px';
          el.appendChild(dot);
          dot.addEventListener('animationend', function () { if (dot.parentNode) dot.parentNode.removeChild(dot); });
        }
      };
      el.addEventListener('click', onClick);
      cleanup.push(function () { el.removeEventListener('click', onClick); });
    }

    // ---- network / field (canvas) ----
    if (mode === 'network' || mode === 'field') {
      var canvas = document.createElement('canvas');
      canvas.className = 'icv-canvas';
      el.insertBefore(canvas, el.firstChild);
      var ctx = canvas.getContext('2d');
      var c1 = readVar(el, '--icv-c1', '#8b5cf6');
      var bg = readVar(el, '--icv-bg', '#0a0a12');
      var w = 0, h = 0, t = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
      var mouse = { x: -999, y: -999 };
      var pts = [];

      function resize() {
        var r = el.getBoundingClientRect();
        w = Math.max(1, r.width); h = Math.max(1, r.height);
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var dens = mode === 'field' ? 5500 : 11000;
        var target = opts.count || Math.min(mode === 'field' ? 180 : 90, Math.round((w * h) / dens));
        pts = [];
        for (var i = 0; i < target; i++) {
          pts.push({ x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * opts.speed, vy: (Math.random() - 0.5) * opts.speed });
        }
      }
      function hexA(hex, a) {
        var m = String(hex).replace('#', '');
        if (m.length === 3) m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2];
        if (m.length !== 6) return 'rgba(10,10,18,' + a + ')';
        var n = parseInt(m, 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
      }
      function frame(move) {
        if (mode === 'field') { ctx.fillStyle = hexA(bg, 0.10); ctx.fillRect(0, 0, w, h); }
        else { ctx.clearRect(0, 0, w, h); }
        if (move && mode === 'field') t++;
        var link = opts.link;
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          if (mode === 'field') {
            if (move) {
              var a = (Math.sin(p.x * 0.008) + Math.cos(p.y * 0.008)) * Math.PI + t * 0.01;
              p.x += Math.cos(a) * opts.speed * 4; p.y += Math.sin(a) * opts.speed * 4;
              var fdx = p.x - mouse.x, fdy = p.y - mouse.y, fd = Math.hypot(fdx, fdy);
              if (fd < 120 && fd > 0.1) { p.x += (fdx / fd) * (120 - fd) * 0.05; p.y += (fdy / fd) * (120 - fd) * 0.05; }
              if (p.x < 0) p.x += w; if (p.x > w) p.x -= w; if (p.y < 0) p.y += h; if (p.y > h) p.y -= h;
            }
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 6.283); ctx.fillStyle = hexA(c1, 0.85); ctx.fill();
          } else {
            if (move) {
              p.x += p.vx; p.y += p.vy;
              if (p.x < 0 || p.x > w) p.vx *= -1;
              if (p.y < 0 || p.y > h) p.vy *= -1;
            }
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fillStyle = hexA(c1, 0.8); ctx.fill();
            for (var j = i + 1; j < pts.length; j++) {
              var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, dist = Math.hypot(dx, dy);
              if (dist < link) { ctx.strokeStyle = hexA(c1, (1 - dist / link) * 0.35); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
            }
            var mdx = p.x - mouse.x, mdy = p.y - mouse.y, md = Math.hypot(mdx, mdy);
            if (md < link * 1.4) { ctx.strokeStyle = hexA(c1, (1 - md / (link * 1.4)) * 0.6); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
          }
        }
      }
      function loop() { frame(true); raf = requestAnimationFrame(loop); }
      var onMouse = function (e) { var r = el.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
      var onOut = function () { mouse.x = mouse.y = -999; };
      el.addEventListener('pointermove', onMouse);
      el.addEventListener('pointerleave', onOut);
      window.addEventListener('resize', resize);
      resize();
      if (REDUCED) frame(false); else loop();
      cleanup.push(function () {
        if (raf) cancelAnimationFrame(raf);
        el.removeEventListener('pointermove', onMouse);
        el.removeEventListener('pointerleave', onOut);
        window.removeEventListener('resize', resize);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      });
    } else if (mode === 'spotlight' || mode === 'dot-grid' || mode === 'aurora' || mode === 'mesh') {
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointermove', onMove);
      cleanup.push(function () {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
      });
    }

    return { el: el, destroy: function () { cleanup.forEach(function (fn) { fn(); }); } };
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return bind(el, opts); });
  }

  var InteractiveCanvas = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = InteractiveCanvas;
  else root.InteractiveCanvas = InteractiveCanvas;
})(typeof window !== 'undefined' ? window : this);
