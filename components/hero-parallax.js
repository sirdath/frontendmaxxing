/* ============================================
   HERO PARALLAX — Scroll-driven multi-row drift
   Inspired by Aceternity UI
   ============================================
   Usage:
     HeroParallax.init('.hero-parallax');
     HeroParallax.init('.hero-parallax', {
       rowDriftX: [-300, 300, -200],  // px translate range per row
       rotateLift: true                // ease out perspective tilt at end
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    rowDriftX: [-320, 320, -240],
    rotateLift: true
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

    var rowsWrap = el.querySelector('.hero-parallax-rows');
    var rows = Array.prototype.slice.call(el.querySelectorAll('.hero-parallax-row'));
    if (!rowsWrap || !rows.length) return { el: el, destroy: function () {} };

    var baseXs = rows.map(function (_, i) {
      // Read pre-set --offset or fall back to alternating
      return (i % 2 === 0) ? -120 : 120;
    });

    var raf = null;
    var targetProgress = 0;
    var progress = 0;

    function compute() {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // 0 when top of section just enters viewport, 1 when section bottom reaches top
      var total = rect.height + vh;
      var t = clamp((vh - rect.top) / total, 0, 1);
      targetProgress = t;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      raf = null;
      progress += (targetProgress - progress) * 0.12;

      rows.forEach(function (row, i) {
        var drift = o.rowDriftX[i % o.rowDriftX.length];
        // Mid-progress = 0 offset, ends = ±drift
        var x = baseXs[i] + (progress - 0.5) * 2 * drift;
        row.style.transform = 'translate3d(' + x.toFixed(1) + 'px, 0, 0)';
      });

      if (o.rotateLift) {
        // Ease the tilt away near the end (more straight-on)
        var lift = clamp(progress * 1.3, 0, 1);
        var rx = (1 - lift) * 14;
        var rz = (1 - lift) * 12;
        var ry = (1 - lift) * -10;
        rowsWrap.style.transform =
          'rotateX(' + rx.toFixed(2) + 'deg) ' +
          'rotateZ(' + rz.toFixed(2) + 'deg) ' +
          'rotateY(' + ry.toFixed(2) + 'deg) ' +
          'translateY(' + (-progress * 240).toFixed(1) + 'px)';
      }

      if (Math.abs(targetProgress - progress) > 0.0005) {
        raf = requestAnimationFrame(tick);
      }
    }

    function onScroll() { compute(); }
    function onResize() { compute(); }

    window.addEventListener('scroll',  onScroll, { passive: true });
    window.addEventListener('resize',  onResize);
    compute();

    function destroy() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      rowsWrap.style.transform = '';
      rows.forEach(function (r) { r.style.transform = ''; });
    }

    return { el: el, destroy: destroy };
  }

  var HeroParallax = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = HeroParallax;
  else root.HeroParallax = HeroParallax;
})(typeof window !== 'undefined' ? window : this);
