/* ============================================
   SCROLL PIN — Pin a section as page scrolls, expose progress
   Inspired by GSAP ScrollTrigger / Codrops scroll demos
   ============================================
   Usage (HTML):
     <section class="sp-section">
       <div class="sp-pin">…pinned content…</div>
       <div class="sp-spacer"></div>   <!-- gives extra scroll distance -->
     </section>

   Or simpler — let JS create the spacer:
     ScrollPin.init('.sp-section', {
       pinSelector: '.sp-pin',
       distance: 1.0,            // multiplier of viewport height
       onProgress: function (p, ctx) { ctx.el.style.setProperty('--p', p); },
       start: 'top top',         // 'top top' = pin when top hits top
       end: 'bottom bottom'      // 'bottom bottom' = unpin when bottom hits bottom
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    pinSelector: '.sp-pin',
    distance: 1.0,
    onProgress: null,
    onEnter: null,
    onLeave: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var pin = el.querySelector(o.pinSelector);
    if (!pin) return { el: el, destroy: function () {} };

    // Wrap pin in a sticky positioner; ensure section has enough height.
    var vh = window.innerHeight;
    var pinH = pin.offsetHeight || vh;
    var totalScroll = vh * (o.distance + 0); // extra distance after the pin appears
    el.style.position = 'relative';
    el.style.minHeight = (pinH + totalScroll) + 'px';

    pin.style.position = 'sticky';
    pin.style.top = '0';
    pin.style.maxHeight = '100vh';

    var active = false;
    var ctx = { el: el, pin: pin, progress: 0 };

    function compute() {
      var r = el.getBoundingClientRect();
      var range = el.offsetHeight - pinH; // total scrollable while pinned
      if (range <= 0) range = 1;
      var raw = (-r.top) / range; // 0 when section top hits top, 1 at end
      var p = clamp(raw, 0, 1);
      ctx.progress = p;

      if (p > 0 && p < 1 && !active) {
        active = true;
        if (typeof o.onEnter === 'function') o.onEnter(ctx);
      } else if ((p <= 0 || p >= 1) && active) {
        active = false;
        if (typeof o.onLeave === 'function') o.onLeave(ctx);
      }

      if (typeof o.onProgress === 'function') o.onProgress(p, ctx);
      // Also expose as --p custom property for CSS animations
      el.style.setProperty('--sp-progress', p.toFixed(4));
    }

    function onScroll() { compute(); }
    function onResize() {
      pinH = pin.offsetHeight || window.innerHeight;
      totalScroll = window.innerHeight * o.distance;
      el.style.minHeight = (pinH + totalScroll) + 'px';
      compute();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    compute();

    function destroy() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      pin.style.position = '';
      pin.style.top = '';
      pin.style.maxHeight = '';
      el.style.minHeight = '';
      el.style.removeProperty('--sp-progress');
    }

    return { el: el, pin: pin, get progress() { return ctx.progress; }, destroy: destroy };
  }

  var ScrollPin = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ScrollPin;
  else root.ScrollPin = ScrollPin;
})(typeof window !== 'undefined' ? window : this);
