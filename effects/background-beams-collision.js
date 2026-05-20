/* ============================================
   BACKGROUND BEAMS COLLISION — Spawns falling beams + canvas explosion particles when they hit the floor
   Inspired by Aceternity UI
   ============================================
   Usage:
     BackgroundBeamsCollision.init('.bbc-host', {
       count: 12,           // simultaneous beams
       minDuration: 3,      // s
       maxDuration: 6,
       particles: 14        // particles per explosion
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { count: 12, minDuration: 3, maxDuration: 6, particles: 14 };

  function rand(a, b) { return a + Math.random() * (b - a); }

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    if (host._bbc) host._bbc.destroy();

    var canvas = document.createElement('canvas');
    canvas.className = 'bbc-canvas';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    function resize() {
      var r = host.getBoundingClientRect();
      canvas.width  = r.width  * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      canvas.style.width  = r.width  + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);

    // Falling beams
    var beams = [];
    function spawnBeam() {
      var b = document.createElement('div');
      b.className = 'bbc-beam';
      var r = host.getBoundingClientRect();
      var dur = rand(o.minDuration, o.maxDuration);
      var delay = -rand(0, dur);
      b.style.left   = rand(0, r.width).toFixed(0) + 'px';
      b.style.setProperty('--dur',    dur + 's');
      b.style.setProperty('--delay',  delay + 's');
      b.style.setProperty('--travel', (r.height + 200) + 'px');
      host.appendChild(b);
      beams.push(b);
      // schedule collision burst at end of each cycle
      var burstAt = (dur + delay) * 1000;
      var cycle = dur * 1000;
      function loop() {
        burst(parseFloat(b.style.left), r.height - 4);
        setTimeout(loop, cycle);
      }
      setTimeout(loop, Math.max(burstAt, 50));
    }
    for (var i = 0; i < o.count; i++) spawnBeam();

    // Burst particles (canvas)
    var parts = [];
    function burst(x, y) {
      var hue = Math.random() < 0.5 ? 280 : 320;
      for (var i = 0; i < o.particles; i++) {
        var a = -Math.PI / 2 + rand(-Math.PI / 2.2, Math.PI / 2.2);
        var s = rand(1.5, 4);
        parts.push({
          x: x, y: y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          decay: rand(0.012, 0.025),
          size: rand(1.2, 2.6),
          hue: hue
        });
      }
    }

    var raf;
    function frame() {
      var r = host.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vy += 0.04;            // gravity
        p.vx *= 0.985;
        p.x += p.vx; p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ',95%,65%,' + p.life.toFixed(2) + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    frame();

    var instance = {
      el: host,
      destroy: function () {
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        beams.forEach(function (b) { b.remove(); });
        canvas.remove();
        delete host._bbc;
      }
    };
    host._bbc = instance;
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

  var BackgroundBeamsCollision = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = BackgroundBeamsCollision;
  else root.BackgroundBeamsCollision = BackgroundBeamsCollision;
})(typeof window !== 'undefined' ? window : this);
