/* ============================================
   GSAP HORIZONTAL SCROLL — Pin a section and scroll its track sideways with the wheel
   Inspired by official GSAP containerAnimation pattern
   ============================================
   Requires GSAP + ScrollTrigger from CDN.

   Markup:
     <section class="hscroll">
       <div class="hscroll-track">
         <div class="hscroll-panel">1</div>
         <div class="hscroll-panel">2</div>
         <div class="hscroll-panel">3</div>
         <div class="hscroll-panel">4</div>
       </div>
     </section>
   CSS: .hscroll-track { display:flex; } .hscroll-panel { flex:0 0 100vw; }

   Usage:
     HorizontalScroll.init('.hscroll');
     HorizontalScroll.init('.hscroll', { track: '.hscroll-track', panel: '.hscroll-panel', scrub: 1 });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    track: '.hscroll-track',
    panel: '.hscroll-panel',
    scrub: 1,
    endPad: 1   // multiply track scroll distance for pacing
  };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap || !root.ScrollTrigger) {
      console.warn('[HorizontalScroll] Requires GSAP + ScrollTrigger.');
      return null;
    }
    gsap.registerPlugin(root.ScrollTrigger);

    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var instances = [];
    Array.prototype.forEach.call(nodes, function (el) {
      var inst = create(el, opts, gsap);
      if (inst) instances.push(inst);
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(el, opts, gsap) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var track = el.querySelector(o.track);
    var panels = el.querySelectorAll(o.panel);
    if (!track || !panels.length) return null;

    var getDistance = function () { return track.scrollWidth - el.offsetWidth; };

    var tween = gsap.to(track, {
      x: function () { return -getDistance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: function () { return '+=' + getDistance() * o.endPad; },
        scrub: o.scrub,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    return {
      el: el,
      tween: tween,
      // expose so child elements can attach their own ScrollTriggers via containerAnimation
      containerAnimation: tween,
      destroy: function () {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'all' });
      }
    };
  }

  var HorizontalScroll = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = HorizontalScroll;
  else root.HorizontalScroll = HorizontalScroll;
})(typeof window !== 'undefined' ? window : this);
