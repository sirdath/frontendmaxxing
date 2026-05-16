/* ============================================
   CURSOR TRAIL — Spawn particles behind the cursor
   ============================================
   Usage:
     CursorTrail.init('body', {
       style: 'sparkle',           // 'dot', 'sparkle', 'neon', 'fire', 'snow',
                                   // 'bubble', 'comet', 'ribbon', 'heart',
                                   // 'star', 'pixel', 'glow', 'lightning'
       density: 12,                // px between spawns
       maxParticles: 60,           // hard cap on concurrent particles
       lifetime: 800,              // ms (matches CSS animation)
       jitter: 8                   // ±px random offset
     });

     CursorTrail.setStyle('fire');
     CursorTrail.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    style: 'sparkle',
    density: 12,
    maxParticles: 60,
    lifetime: 800,
    jitter: 6,
    activeOnly: null   // optional CSS selector — only trail when over matching elements
  };

  var state = {
    bound: false,
    style: 'sparkle',
    lastX: null,
    lastY: null,
    particles: [],
    opts: null
  };

  function init(target, opts) {
    state.opts = mergeOpts(opts);
    state.style = state.opts.style;
    if (state.bound) return state;

    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) host = document.body;

    host.addEventListener('pointermove', onMove);
    state.bound = true;
    state.host = host;
    return state;
  }

  function onMove(e) {
    if (state.opts.activeOnly && !e.target.matches(state.opts.activeOnly) && !e.target.closest(state.opts.activeOnly)) return;
    var x = e.clientX, y = e.clientY;
    if (state.lastX != null) {
      var dx = x - state.lastX;
      var dy = y - state.lastY;
      var d = Math.hypot(dx, dy);
      if (d < state.opts.density) return;
    }
    state.lastX = x;
    state.lastY = y;
    spawn(x, y);
  }

  function spawn(x, y) {
    if (state.particles.length >= state.opts.maxParticles) return;
    var p = document.createElement('div');
    var styleClass = 'ctrail-' + state.style;
    p.className = 'ctrail-particle ' + styleClass;
    var jx = (Math.random() - 0.5) * state.opts.jitter * 2;
    var jy = (Math.random() - 0.5) * state.opts.jitter * 2;
    p.style.left = (x + jx) + 'px';
    p.style.top = (y + jy) + 'px';
    document.body.appendChild(p);
    state.particles.push(p);

    setTimeout(function () {
      if (p.parentNode) p.parentNode.removeChild(p);
      state.particles = state.particles.filter(function (n) { return n !== p; });
    }, state.opts.lifetime);
  }

  function setStyle(style) {
    state.style = style;
    state.opts.style = style;
  }

  function destroy() {
    if (state.host) state.host.removeEventListener('pointermove', onMove);
    state.particles.forEach(function (p) { if (p.parentNode) p.parentNode.removeChild(p); });
    state.particles = [];
    state.bound = false;
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorTrail = { init: init, setStyle: setStyle, destroy: destroy };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorTrail;
  else root.CursorTrail = CursorTrail;
})(typeof window !== 'undefined' ? window : this);
