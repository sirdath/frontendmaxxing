/* ============================================
   GSAP SMOOTH SCROLL — Inertial smooth scrolling + anchor scroll-to
   Inspired by official GSAP ScrollSmoother / ScrollToPlugin pattern
   ============================================
   Prefers the official ScrollSmoother when present; otherwise falls back to a
   lightweight ScrollToPlugin-based anchor smooth-scroll (no smoothing of the
   page itself, but smooth jumps).

     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollToPlugin.min.js"></script>
     <!-- optional, best experience: -->
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"></script>
   ScrollSmoother needs:  <div id="smooth-wrapper"><div id="smooth-content"> … </div></div>

   Usage:
     SmoothScroll.init();                       // auto: ScrollSmoother if available
     SmoothScroll.init({ smooth: 1.2, effects: true });
     SmoothScroll.to('#section-3', { duration: 1 });   // animate scroll to target
   ============================================ */
(function (root) {
  'use strict';

  var smoother = null;

  function init(opts) {
    var gsap = root.gsap;
    if (!gsap) { console.warn('[SmoothScroll] Requires GSAP core.'); return null; }
    opts = opts || {};

    if (root.ScrollSmoother && root.ScrollTrigger &&
        document.getElementById('smooth-wrapper')) {
      gsap.registerPlugin(root.ScrollTrigger, root.ScrollSmoother);
      smoother = root.ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: opts.smooth != null ? opts.smooth : 1.2,
        effects: opts.effects !== false,   // honors data-speed / data-lag
        normalizeScroll: !!opts.normalizeScroll
      });
      bindAnchors(gsap);
      return { mode: 'scrollsmoother', smoother: smoother, to: to, destroy: destroy };
    }

    // Fallback: smooth anchor jumps only
    if (root.ScrollToPlugin) gsap.registerPlugin(root.ScrollToPlugin);
    bindAnchors(gsap);
    return { mode: 'anchor', to: to, destroy: destroy };
  }

  function to(targetSel, vars) {
    var gsap = root.gsap;
    if (!gsap) return;
    if (smoother) { smoother.scrollTo(targetSel, true, 'top top'); return; }
    if (!root.ScrollToPlugin) { gsap.registerPlugin(root.ScrollToPlugin || {}); }
    var v = { duration: 1, ease: 'power2.inOut' };
    if (vars) for (var k in vars) v[k] = vars[k];
    v.scrollTo = { y: targetSel, offsetY: (vars && vars.offsetY) || 0 };
    gsap.to(window, v);
  }

  var anchorHandler = null;
  function bindAnchors(gsap) {
    anchorHandler = function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      to(el);
    };
    document.addEventListener('click', anchorHandler);
  }

  function destroy() {
    if (smoother) { smoother.kill(); smoother = null; }
    if (anchorHandler) document.removeEventListener('click', anchorHandler);
  }

  var SmoothScroll = { init: init, to: to, destroy: destroy };
  if (typeof module !== 'undefined' && module.exports) module.exports = SmoothScroll;
  else root.SmoothScroll = SmoothScroll;
})(typeof window !== 'undefined' ? window : this);
