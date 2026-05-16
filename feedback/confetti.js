/* ============================================
   CONFETTI — Canvas confetti burst with shape/color options
   Inspired by catdad/canvas-confetti (much smaller surface)
   ============================================
   Usage:
     Confetti.burst();                        // default centered burst
     Confetti.burst({                         // configured
       x: 0.5, y: 0.6,                        // origin (0..1)
       count: 120,
       spread: 70,                            // angle spread in degrees
       startVelocity: 45,
       gravity: 1.0,
       drift: 0,
       ticks: 200,                            // lifespan in frames
       colors: ['#c084fc','#38bdf8','#f472b6','#fbbf24','#4ade80'],
       shapes: ['square', 'circle', 'ribbon']
     });

     Confetti.cannon('left');   // shorthand: 'left'|'right'|'top'|'center'
   ============================================ */
(function (root) {
  'use strict';

  var SHAPES = ['square', 'circle', 'ribbon'];
  var DEFAULT_COLORS = ['#c084fc','#38bdf8','#f472b6','#fbbf24','#4ade80','#f87171','#a78bfa'];

  var canvas = null;
  var ctx = null;
  var particles = [];
  var raf = null;
  var dpr = window.devicePixelRatio || 1;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function spawn(opts) {
    ensureCanvas();
    opts = opts || {};
    var x = (opts.x != null ? opts.x : 0.5) * window.innerWidth * dpr;
    var y = (opts.y != null ? opts.y : 0.5) * window.innerHeight * dpr;
    var n = opts.count || 100;
    var spread = (opts.spread || 70) * Math.PI / 180;
    var dir = (opts.angle != null ? opts.angle * Math.PI / 180 : -Math.PI / 2); // up
    var startV = (opts.startVelocity || 45) * dpr / 16;
    var g = (opts.gravity || 1.0) * 0.4 * dpr / 16;
    var drift = (opts.drift || 0) * 0.05;
    var ticks = opts.ticks || 200;
    var colors = opts.colors || DEFAULT_COLORS;
    var shapes = opts.shapes || SHAPES;

    for (var i = 0; i < n; i++) {
      var a = dir + (Math.random() - 0.5) * spread;
      var v = startV * (0.7 + Math.random() * 0.6);
      particles.push({
        x: x, y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        g: g,
        drift: drift,
        ttl: ticks * (0.7 + Math.random() * 0.6),
        age: 0,
        rot: rand(0, Math.PI * 2),
        vrot: rand(-0.2, 0.2),
        size: rand(4, 9) * dpr,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        wob: rand(0, Math.PI * 2)
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.age++;
      p.vy += p.g;
      p.vx += p.drift;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.wob += 0.1;
      var fade = Math.max(0, 1 - p.age / p.ttl);
      if (p.age > p.ttl || p.y > canvas.height + 40) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ribbon') {
        // wobbly ribbon
        var w = p.size * 0.8;
        var h = p.size * 2.2;
        ctx.fillRect(-w / 2, -h / 2, w, h);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }
    if (particles.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  function cannon(side) {
    if (side === 'left')  return spawn({ x: 0.05, y: 0.7, angle: -60, count: 80, spread: 50, startVelocity: 60 });
    if (side === 'right') return spawn({ x: 0.95, y: 0.7, angle: -120, count: 80, spread: 50, startVelocity: 60 });
    if (side === 'top')   return spawn({ x: 0.5, y: 0.0, angle: 90, count: 120, spread: 100, startVelocity: 30, gravity: 0.7 });
    return spawn({ count: 140, spread: 100, startVelocity: 50 });
  }

  function clear() {
    particles = [];
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  var Confetti = { burst: spawn, cannon: cannon, clear: clear };

  if (typeof module !== 'undefined' && module.exports) module.exports = Confetti;
  else root.Confetti = Confetti;
})(typeof window !== 'undefined' ? window : this);
