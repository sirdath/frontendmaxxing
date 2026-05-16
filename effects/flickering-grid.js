/* ============================================
   FLICKERING GRID — Canvas grid with random cell flicker
   Inspired by Magic UI
   ============================================
   Usage:
     FlickeringGrid.init('.flickering-grid');
     FlickeringGrid.init('.flickering-grid', {
       squareSize: 4,
       gridGap: 6,
       flickerChance: 0.3,
       color: '#818cf8',
       maxOpacity: 0.4
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    color: '#ffffff',
    maxOpacity: 0.3
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function parseColor(hex) {
    var c = hex.trim();
    if (c[0] === '#') c = c.slice(1);
    if (c.length === 3) c = c.split('').map(function (x) { return x + x; }).join('');
    var n = parseInt(c, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var existing = el.querySelector('canvas');
    if (existing) existing.remove();

    var canvas = document.createElement('canvas');
    el.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var color = parseColor(o.color);

    var cols = 0, rows = 0, opacities = null;

    function resize() {
      var rect = el.getBoundingClientRect();
      canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width  = rect.width  + 'px';
      canvas.style.height = rect.height + 'px';

      var step = (o.squareSize + o.gridGap) * dpr;
      cols = Math.ceil(canvas.width  / step);
      rows = Math.ceil(canvas.height / step);
      opacities = new Float32Array(cols * rows);
      for (var i = 0; i < opacities.length; i++) {
        opacities[i] = Math.random() * o.maxOpacity;
      }
    }

    var raf = null;
    var lastT = performance.now();

    function frame(now) {
      var dt = (now - lastT) / 1000;
      lastT = now;
      var step = (o.squareSize + o.gridGap) * dpr;
      var sq = o.squareSize * dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < opacities.length; i++) {
        if (Math.random() < o.flickerChance * dt) {
          opacities[i] = Math.random() * o.maxOpacity;
        }
        var op = opacities[i];
        if (op < 0.01) continue;
        var cx = (i % cols) * step;
        var cy = Math.floor(i / cols) * step;
        ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + op + ')';
        ctx.fillRect(cx, cy, sq, sq);
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);

    var resizeObs = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(resize);
      resizeObs.observe(el);
    } else {
      window.addEventListener('resize', resize);
    }

    function destroy() {
      if (raf) cancelAnimationFrame(raf);
      if (resizeObs) resizeObs.disconnect();
      else window.removeEventListener('resize', resize);
      canvas.remove();
    }

    return { el: el, canvas: canvas, destroy: destroy };
  }

  var FlickeringGrid = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = FlickeringGrid;
  else root.FlickeringGrid = FlickeringGrid;
})(typeof window !== 'undefined' ? window : this);
