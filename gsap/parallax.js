/* ============================================
   GSAP PARALLAX — Scroll-driven multi-layer parallax via data-speed
   Inspired by official GSAP ScrollTrigger / ScrollSmoother data-speed pattern
   ============================================
   Requires GSAP + ScrollTrigger from CDN.

   Markup — set a speed per layer (1 = normal, <1 slower, >1 faster):
     <div class="hero">
       <img class="layer" data-speed="0.5" src="bg.jpg">
       <img class="layer" data-speed="0.8" src="mid.png">
       <h1 class="layer" data-speed="1.2">Title</h1>
     </div>

   Usage:
     Parallax.init('[data-speed]');
     Parallax.init('.layer', { scrub: 1 });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { scrub: true, attr: 'data-speed' };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap || !root.ScrollTrigger) {
      console.warn('[Parallax] Requires GSAP + ScrollTrigger.');
      return null;
    }
    gsap.registerPlugin(root.ScrollTrigger);
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target));
    if (!els.length) return null;

    var tweens = els.map(function (el) {
      var speed = parseFloat(el.getAttribute(o.attr) || '1');
      // distance proportional to (1 - speed): slower layers drift up, faster drift down
      var shift = (1 - speed) * 100;
      return gsap.fromTo(el,
        { yPercent: -shift / 2 },
        {
          yPercent: shift / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('[data-parallax-host]') || el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: o.scrub,
            invalidateOnRefresh: true
          }
        }
      );
    });

    return {
      els: els,
      destroy: function () {
        tweens.forEach(function (t) { if (t.scrollTrigger) t.scrollTrigger.kill(); t.kill(); });
        gsap.set(els, { clearProps: 'all' });
      }
    };
  }

  var Parallax = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = Parallax;
  else root.Parallax = Parallax;
})(typeof window !== 'undefined' ? window : this);
