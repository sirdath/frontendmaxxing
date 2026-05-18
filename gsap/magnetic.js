/* ============================================
   GSAP MAGNETIC — Magnetic hover (element + optional inner label follow the cursor)
   Inspired by official GSAP quickTo() pointer-follow pattern
   ============================================
   Requires GSAP core from CDN.

   Usage:
     Magnetic.init('.magnetic-btn');
     Magnetic.init('.magnetic-btn', {
       strength: 0.4,     // 0..1 — how far it follows
       innerSelector: '.label', innerStrength: 0.7,
       ease: 'elastic.out(1,0.4)', release: 0.6
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    strength: 0.35,
    innerSelector: null,
    innerStrength: 0.6,
    ease: 'power3.out',
    speed: 0.4,
    release: 0.6
  };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap) { console.warn('[Magnetic] Requires GSAP core.'); return null; }
    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var instances = [];
    Array.prototype.forEach.call(nodes, function (el) { instances.push(create(el, opts, gsap)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(el, opts, gsap) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var xTo = gsap.quickTo(el, 'x', { duration: o.speed, ease: o.ease });
    var yTo = gsap.quickTo(el, 'y', { duration: o.speed, ease: o.ease });
    var inner = o.innerSelector ? el.querySelector(o.innerSelector) : null;
    var ixTo = inner ? gsap.quickTo(inner, 'x', { duration: o.speed, ease: o.ease }) : null;
    var iyTo = inner ? gsap.quickTo(inner, 'y', { duration: o.speed, ease: o.ease }) : null;

    function move(e) {
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * o.strength); yTo(dy * o.strength);
      if (ixTo) { ixTo(dx * o.innerStrength); iyTo(dy * o.innerStrength); }
    }
    function leave() {
      gsap.to(el, { x: 0, y: 0, duration: o.release, ease: 'elastic.out(1,0.4)' });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: o.release, ease: 'elastic.out(1,0.4)' });
    }

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);

    return {
      el: el,
      destroy: function () {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
        gsap.set([el, inner].filter(Boolean), { clearProps: 'all' });
      }
    };
  }

  var Magnetic = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = Magnetic;
  else root.Magnetic = Magnetic;
})(typeof window !== 'undefined' ? window : this);
