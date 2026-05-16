/* ============================================
   SCROLL SCRUB — Tween element properties via scroll position
   Inspired by GSAP ScrollTrigger scrub mode / Codrops scroll demos
   ============================================
   Usage:
     <div class="scrub-target" data-scrub
          data-scrub-from='{"opacity":0,"y":40,"scale":0.9}'
          data-scrub-to='{"opacity":1,"y":0,"scale":1}'
          data-scrub-start="0.1"
          data-scrub-end="0.6">…</div>
     ScrollScrub.init('[data-scrub]');

     // Or programmatically:
     ScrollScrub.init('.target', {
       from: { opacity: 0, y: 60 },
       to:   { opacity: 1, y: 0 },
       start: 0.0,           // fraction of viewport at which scrub begins
       end:   0.7,           // fraction at which scrub ends
       relativeTo: 'viewport' // 'viewport' or another element selector
     });

   Supported keys: opacity, x, y, scale, rotate, blur. Add CSS-var output
   via `cssVars: ['--p']` to expose progress as a custom property.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    from: null,
    to: null,
    start: 0.0,
    end: 1.0,
    relativeTo: 'viewport',
    cssVars: null      // array of var names to set to progress
  };

  var SUPPORTED = ['opacity', 'x', 'y', 'scale', 'rotate', 'blur'];

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function readDataObj(el, attr) {
    var v = el.getAttribute(attr);
    if (!v) return null;
    try { return JSON.parse(v); } catch (e) { return null; }
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function buildTransform(from, to, t) {
    var x = lerp(from.x || 0, to.x || 0, t);
    var y = lerp(from.y || 0, to.y || 0, t);
    var scale = lerp(from.scale != null ? from.scale : 1, to.scale != null ? to.scale : 1, t);
    var rot = lerp(from.rotate || 0, to.rotate || 0, t);
    return 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) ' +
           'scale(' + scale.toFixed(4) + ') ' +
           'rotate(' + rot.toFixed(3) + 'deg)';
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var from = o.from || readDataObj(el, 'data-scrub-from') || {};
    var to   = o.to   || readDataObj(el, 'data-scrub-to')   || {};
    var s = o.start != null ? o.start : parseFloat(el.getAttribute('data-scrub-start') || '0');
    var e = o.end   != null ? o.end   : parseFloat(el.getAttribute('data-scrub-end')   || '1');
    if (isNaN(s)) s = 0;
    if (isNaN(e)) e = 1;

    var raf = null, pending = false;

    function compute() {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // Progress 0 when element enters bottom of viewport, 1 when it leaves top
      var total = r.height + vh;
      var raw = (vh - r.top) / total;
      var t = clamp((raw - s) / (e - s), 0, 1);

      // Apply: split transform vs other props
      var hasTransform = ['x','y','scale','rotate'].some(function (k) { return from[k] != null || to[k] != null; });
      if (hasTransform) {
        el.style.transform = buildTransform(from, to, t);
      }
      if (from.opacity != null || to.opacity != null) {
        el.style.opacity = lerp(from.opacity != null ? from.opacity : 1, to.opacity != null ? to.opacity : 1, t);
      }
      if (from.blur != null || to.blur != null) {
        el.style.filter = 'blur(' + lerp(from.blur || 0, to.blur || 0, t).toFixed(2) + 'px)';
      }
      el.style.setProperty('--scrub-progress', t.toFixed(4));
      if (o.cssVars) o.cssVars.forEach(function (n) { el.style.setProperty(n, t.toFixed(4)); });
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(function () { pending = false; compute(); });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();

    function destroy() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
      el.style.opacity = '';
      el.style.filter = '';
      el.style.removeProperty('--scrub-progress');
    }

    return { el: el, destroy: destroy };
  }

  var ScrollScrub = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ScrollScrub;
  else root.ScrollScrub = ScrollScrub;
})(typeof window !== 'undefined' ? window : this);
