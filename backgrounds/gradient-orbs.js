/* ============================================
   GRADIENT ORBS — Dynamic orb generation & physics
   Inspired by Vercel hero gradients
   ============================================
   Usage:
     GradientOrbs.init('.orbsbg', { count: 5, palette: 'vercel' });
     GradientOrbs.init('.orbsbg', {
       count: 4,
       colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b'],
       minSize: 30, maxSize: 70,   // percent of container width
       blur: 90,
       opacity: 0.7,
       drift: true,
       parallax: true              // orbs follow pointer
     });
   ============================================ */
(function (root) {
  'use strict';

  var palettes = {
    vercel:   ['#ec4899', '#8b5cf6', '#06b6d4', '#6366f1'],
    linear:   ['#5e6ad2', '#8b5cf6', '#06b6d4', '#a855f7'],
    aurora:   ['#a855f7', '#ec4899', '#06b6d4', '#f59e0b'],
    sunset:   ['#f97316', '#ec4899', '#f59e0b', '#ef4444'],
    ocean:    ['#0ea5e9', '#06b6d4', '#3b82f6', '#14b8a6'],
    cosmic:   ['#6d28d9', '#db2777', '#0891b2', '#d97706'],
    cyber:    ['#00ffff', '#ff00ff', '#00ff7f', '#ffff00'],
    pastel:   ['#c4b5fd', '#fbcfe8', '#a5f3fc', '#fde68a'],
    mono:     ['#475569', '#64748b', '#334155', '#94a3b8'],
    rose:     ['#fb7185', '#f43f5e', '#ec4899', '#c084fc']
  };

  var defaults = {
    count: 4,
    palette: 'aurora',
    colors: null,
    minSize: 30,
    maxSize: 60,
    blur: 80,
    opacity: 0.7,
    drift: true,
    speed: 18,
    parallax: false,
    parallaxStrength: 30
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

    var colors = o.colors || palettes[o.palette] || palettes.aurora;

    el.querySelectorAll(':scope > .orb-gen').forEach(function (n) { n.remove(); });
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = el.style.overflow || 'hidden';

    var orbs = [];
    for (var i = 0; i < o.count; i++) {
      var orb = document.createElement('span');
      orb.className = 'orb-gen';
      var sz = rand(o.minSize, o.maxSize);
      var c = colors[i % colors.length];
      var x = rand(-10, 90);
      var y = rand(-10, 90);
      orb.style.cssText =
        'position:absolute;border-radius:50%;pointer-events:none;z-index:0;' +
        'width:' + sz + '%;aspect-ratio:1;' +
        'top:' + y + '%;left:' + x + '%;' +
        'background:radial-gradient(circle,' + c + ',transparent 70%);' +
        'filter:blur(' + o.blur + 'px);opacity:' + o.opacity + ';' +
        'will-change:transform;';
      if (o.drift) {
        var dur = (o.speed * (0.7 + Math.random() * 0.8)).toFixed(1);
        orb.animate(
          [
            { transform: 'translate3d(0,0,0) scale(1)' },
            { transform: 'translate3d(' + rand(-12, 12) + '%,' + rand(-10, 10) + '%,0) scale(' + (0.85 + Math.random() * 0.3).toFixed(2) + ')' },
            { transform: 'translate3d(' + rand(-10, 10) + '%,' + rand(-12, 12) + '%,0) scale(1)' }
          ],
          { duration: dur * 1000, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }
        );
      }
      el.insertBefore(orb, el.firstChild);
      orbs.push(orb);
    }

    var pmHandler = null;
    if (o.parallax) {
      pmHandler = function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        orbs.forEach(function (orb, i) {
          var depth = ((i % 3) + 1) / 3 * o.parallaxStrength;
          orb.style.translate = (px * depth).toFixed(1) + 'px ' + (py * depth).toFixed(1) + 'px';
        });
      };
      el.addEventListener('pointermove', pmHandler);
    }

    function destroy() {
      if (pmHandler) el.removeEventListener('pointermove', pmHandler);
      orbs.forEach(function (n) { n.remove(); });
    }

    return { el: el, orbs: orbs, destroy: destroy };
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  var GradientOrbs = { init: init, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = GradientOrbs;
  else root.GradientOrbs = GradientOrbs;
})(typeof window !== 'undefined' ? window : this);
