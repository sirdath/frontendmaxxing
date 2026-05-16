/* ============================================
   WAVY BACKGROUND — Multi-layer sin-noise waves on canvas
   Inspired by Aceternity UI
   ============================================
   Usage:
     WavyBackground.init('.wavy-bg');
     WavyBackground.init('.wavy-bg', {
       colors: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'],
       waveWidth: 50,
       speed: 'fast',     // 'slow' | 'fast'
       opacity: 0.5,
       amplitude: 100
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    colors: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#4ade80'],
    waveWidth: 50,
    speed: 'fast',
    opacity: 0.5,
    amplitude: 100,
    backgroundFill: null   // null = transparent canvas
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  // Tiny seeded-noise (no dependency on simplex-noise package)
  function noise1D(x) {
    // Smooth pseudo-noise: layered sin waves with irrationals so it
    // never repeats cleanly. Good enough for a background ribbon.
    return (
      Math.sin(x * 1.31)        * 0.45 +
      Math.sin(x * 2.7  + 0.7)  * 0.30 +
      Math.sin(x * 5.13 + 1.3)  * 0.18 +
      Math.sin(x * 9.7  + 2.1)  * 0.07
    );
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var canvas = el.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      el.insertBefore(canvas, el.firstChild);
    }
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w = 0, h = 0;

    function resize() {
      var r = el.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width  * dpr));
      h = Math.max(1, Math.floor(r.height * dpr));
      canvas.width = w; canvas.height = h;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
    }

    var speedFactor = o.speed === 'slow' ? 0.0008 : 0.002;
    var raf = null;
    var t0 = performance.now();

    function frame(now) {
      var t = (now - t0) * speedFactor;

      if (o.backgroundFill) {
        ctx.fillStyle = o.backgroundFill;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
      ctx.globalAlpha = o.opacity;
      ctx.lineWidth = o.waveWidth * dpr;
      ctx.lineCap = 'round';

      var n = o.colors.length;
      for (var li = 0; li < n; li++) {
        ctx.strokeStyle = o.colors[li];
        ctx.beginPath();
        var phase = li * 0.7 + t;
        for (var x = 0; x <= w; x += 5 * dpr) {
          var y = h / 2 +
                  noise1D(x / 250 + phase) * o.amplitude * dpr +
                  Math.sin(t * 0.6 + li) * 30 * dpr;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
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
    }

    return { el: el, canvas: canvas, destroy: destroy };
  }

  var WavyBackground = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = WavyBackground;
  else root.WavyBackground = WavyBackground;
})(typeof window !== 'undefined' ? window : this);
