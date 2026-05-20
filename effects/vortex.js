/* ============================================
   VORTEX — Canvas particle vortex with curl-noise drift
   Inspired by Aceternity UI
   ============================================
   Usage:
     Vortex.init('.vtx-host', {
       count: 600,             // particle count
       baseSpeed: 0.18,
       hueA: 270, hueB: 320,   // color range (HSL)
       backgroundFade: 0.06    // 0 = trails, 1 = no trails (default 0.06 = smooth)
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    count: 600,
    baseSpeed: 0.18,
    hueA: 270, hueB: 320,
    backgroundFade: 0.06
  };

  // Tiny 2D simplex-ish noise (cheap pseudo-noise for curl flow)
  function noise(x, y, t) {
    return Math.sin(x * 0.8 + t) * Math.cos(y * 0.8 - t * 0.7) +
           Math.sin((x + y) * 0.5 + t * 0.4) * 0.5;
  }

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    if (host._vtx) host._vtx.destroy();

    var canvas = document.createElement('canvas');
    canvas.className = 'vtx-canvas';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var W = 0, H = 0;
    function resize() {
      var r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      seed();
    }
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);

    var parts = [];
    function seed() {
      parts = [];
      for (var i = 0; i < o.count; i++) {
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          h: o.hueA + Math.random() * (o.hueB - o.hueA),
          a: 0.3 + Math.random() * 0.6
        });
      }
    }
    resize();

    var t = 0, raf;
    function frame() {
      t += 0.008;
      // Fade trail
      ctx.fillStyle = 'rgba(5,5,16,' + o.backgroundFade + ')';
      ctx.fillRect(0, 0, W, H);

      var cx = W / 2, cy = H / 2;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var nx = (p.x - cx) * 0.01;
        var ny = (p.y - cy) * 0.01;
        var n = noise(nx, ny, t);
        // Tangential push around center + curl wobble
        var dx = p.x - cx, dy = p.y - cy;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var tx = -dy / len, ty = dx / len;     // perpendicular
        p.x += tx * o.baseSpeed * (1 + n * 0.6);
        p.y += ty * o.baseSpeed * (1 + n * 0.6);
        // small inward drift so they don't all spiral out
        p.x -= dx * 0.0006;
        p.y -= dy * 0.0006;
        // Wrap
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
        ctx.fillStyle = 'hsla(' + p.h.toFixed(0) + ',92%,62%,' + p.a + ')';
        ctx.fillRect(p.x, p.y, 1.2, 1.2);
      }
      raf = requestAnimationFrame(frame);
    }
    frame();

    var instance = {
      el: host,
      destroy: function () {
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        canvas.remove();
        delete host._vtx;
      }
    };
    host._vtx = instance;
    return instance;
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var Vortex = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = Vortex;
  else root.Vortex = Vortex;
})(typeof window !== 'undefined' ? window : this);
