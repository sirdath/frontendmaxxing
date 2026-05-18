/* ============================================
   GSAP FLIP LAYOUT — Animate any layout change (reorder, grid↔list, expand) with FLIP
   Inspired by official GSAP Flip plugin pattern
   ============================================
   Requires GSAP + Flip from CDN:
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Flip.min.js"></script>

   Usage:
     var f = FlipLayout.init('.grid', { item: '.cell' });
     // mutate the DOM however you like, then:
     f.animate(function () {
       container.classList.toggle('is-list');     // or shuffle / filter / sort
     }, { duration: 0.6, ease: 'power2.inOut', stagger: 0.04 });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    var gsap = root.gsap, Flip = root.Flip;
    if (!gsap || !Flip) { console.warn('[FlipLayout] Requires GSAP + Flip plugin.'); return null; }
    gsap.registerPlugin(Flip);
    opts = opts || {};
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;

    function items() {
      return opts.item
        ? host.querySelectorAll(opts.item)
        : host.children;
    }

    function animate(mutate, flipVars) {
      var state = Flip.getState(items());
      if (typeof mutate === 'function') mutate();
      var v = { duration: 0.6, ease: 'power2.inOut', absolute: true };
      if (flipVars) for (var k in flipVars) v[k] = flipVars[k];
      return Flip.from(state, v);
    }

    return { host: host, animate: animate, getState: function () { return Flip.getState(items()); } };
  }

  var FlipLayout = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = FlipLayout;
  else root.FlipLayout = FlipLayout;
})(typeof window !== 'undefined' ? window : this);
