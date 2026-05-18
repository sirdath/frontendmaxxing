/* ============================================
   GSAP SCROLL REVEAL — Batched reveal-on-scroll (entrance as elements enter viewport)
   Inspired by official GSAP ScrollTrigger.batch() pattern
   ============================================
   Requires GSAP + ScrollTrigger from CDN:
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>

   Usage:
     ScrollReveal.init('.reveal');
     ScrollReveal.init('.card', {
       y: 60, opacity: 0, duration: 0.8, stagger: 0.12,
       ease: 'power3.out', start: 'top 85%', once: true
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 85%',
    once: true
  };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap || !root.ScrollTrigger) {
      console.warn('[ScrollReveal] Requires GSAP + ScrollTrigger (load from CDN).');
      return null;
    }
    gsap.registerPlugin(root.ScrollTrigger);
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var sel = typeof target === 'string' ? target : target;
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target));
    if (!els.length) return null;

    // Initial hidden state
    gsap.set(els, { y: o.y, autoAlpha: o.opacity === 0 ? 0 : 1 });

    var triggers = root.ScrollTrigger.batch(els, {
      start: o.start,
      once: o.once,
      onEnter: function (batch) {
        gsap.to(batch, {
          y: 0, autoAlpha: 1,
          duration: o.duration, stagger: o.stagger, ease: o.ease, overwrite: true
        });
      },
      onLeaveBack: o.once ? null : function (batch) {
        gsap.to(batch, { y: o.y, autoAlpha: 0, duration: o.duration * 0.6, overwrite: true });
      }
    });

    return {
      els: els,
      destroy: function () {
        triggers.forEach(function (t) { t.kill(); });
        gsap.set(els, { clearProps: 'all' });
      }
    };
  }

  var ScrollReveal = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ScrollReveal;
  else root.ScrollReveal = ScrollReveal;
})(typeof window !== 'undefined' ? window : this);
