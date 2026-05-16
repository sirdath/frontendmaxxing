/* ============================================
   MESH BG STRIPE — Programmatically build & animate mesh gradient backgrounds
   Inspired by whatamesh, Stripe homepage gradients
   ============================================
   Usage:
     MeshBg.init('.meshbg', { palette: 'stripe' });
     MeshBg.init('.meshbg', {
       blobs: 5,
       colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b'],
       animate: true, speed: 25, blur: 0
     });

     MeshBg.snapshot(el)  →  returns the current CSS background-image string
   ============================================ */
(function (root) {
  'use strict';

  var palettes = {
    stripe:    ['#9d4edd', '#22d3ee', '#ec4899', '#3b82f6', '#f59e0b'],
    vercel:    ['#ec4899', '#8b5cf6', '#22d3ee', '#3b82f6'],
    linear:    ['#5e6ad2', '#8b5cf6', '#06b6d4'],
    shopify:   ['#34d399', '#22d3ee', '#84cc16'],
    figma:     ['#f24e1e', '#a259ff', '#0acf83', '#1abcfe'],
    supabase:  ['#3ecf8e', '#249361'],
    arc:       ['#ff6b35', '#f7c59f', '#f72585', '#7209b7'],
    anthropic: ['#cc785c', '#d97757', '#8b4513'],
    cosmic:    ['#a855f7', '#ec4899', '#06b6d4', '#f59e0b'],
    pastel:    ['#c4b5fd', '#fbcfe8', '#a5f3fc', '#fde68a'],
    sunset:    ['#f97316', '#ec4899', '#f59e0b', '#ef4444'],
    ocean:     ['#0ea5e9', '#06b6d4', '#3b82f6', '#14b8a6']
  };

  var defaults = {
    palette: 'stripe',
    colors: null,
    blobs: 5,
    intensity: 0.55,      // alpha 0..1
    animate: true,
    speed: 25,
    blur: 0,
    background: null      // base bg color override
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var out = [];
    Array.prototype.forEach.call(els, function (el) { out.push(create(el, opts)); });
    return out.length === 1 ? out[0] : out;
  }

  function create(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    var colors = o.colors || palettes[o.palette] || palettes.stripe;

    var img = buildMesh(colors, o.blobs, o.intensity);
    el.style.backgroundImage = img;
    el.style.backgroundSize = '220% 220%';
    if (o.background) el.style.backgroundColor = o.background;
    if (o.blur > 0) el.style.filter = 'blur(' + o.blur + 'px)';

    var anim = null;
    if (o.animate) {
      anim = el.animate(
        [
          { backgroundPosition: '0% 0%' },
          { backgroundPosition: '100% 50%' },
          { backgroundPosition: '50% 100%' },
          { backgroundPosition: '0% 50%' },
          { backgroundPosition: '0% 0%' }
        ],
        { duration: o.speed * 1000, iterations: Infinity, easing: 'ease-in-out' }
      );
    }

    function regenerate(newColors, newBlobs) {
      var c = newColors || colors;
      var n = newBlobs || o.blobs;
      el.style.backgroundImage = buildMesh(c, n, o.intensity);
    }

    function destroy() {
      if (anim) anim.cancel();
    }

    return { el: el, regenerate: regenerate, destroy: destroy };
  }

  function buildMesh(colors, count, alpha) {
    var parts = [];
    for (var i = 0; i < count; i++) {
      var c = colors[i % colors.length];
      var x = (10 + Math.random() * 80).toFixed(0);
      var y = (10 + Math.random() * 80).toFixed(0);
      parts.push('radial-gradient(at ' + x + '% ' + y + '%, ' + hexToRgba(c, alpha) + ' 0px, transparent 50%)');
    }
    return parts.join(', ');
  }

  function snapshot(el) {
    return el ? getComputedStyle(el).backgroundImage : '';
  }

  function hexToRgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  var MeshBg = { init: init, snapshot: snapshot, palettes: palettes, buildMesh: buildMesh };
  if (typeof module !== 'undefined' && module.exports) module.exports = MeshBg;
  else root.MeshBg = MeshBg;
})(typeof window !== 'undefined' ? window : this);
