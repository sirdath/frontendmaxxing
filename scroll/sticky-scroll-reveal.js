/* ============================================
   STICKY SCROLL REVEAL — Switch the .ssr-visual based on which .ssr-panel is closest to viewport center
   Inspired by Aceternity UI
   ============================================
   Reads data-bg (CSS color/gradient) and data-src (image url) from each
   .ssr-panel and applies them to .ssr-visual as the active panel changes.

   Usage:
     StickyScrollReveal.init('.ssr-host');
   ============================================ */
(function (root) {
  'use strict';

  function create(host, opts) {
    opts = opts || {};
    var panels = Array.from(host.querySelectorAll('.ssr-panel'));
    var visual = host.querySelector('.ssr-visual');
    if (!panels.length || !visual) return null;

    var active = -1;

    function update() {
      var center = window.innerHeight / 2;
      var best = 0, bestDist = Infinity;
      panels.forEach(function (p, i) {
        var r = p.getBoundingClientRect();
        var d = Math.abs((r.top + r.bottom) / 2 - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best === active) return;
      active = best;
      panels.forEach(function (p, i) { p.classList.toggle('is-active', i === best); });

      var p = panels[best];
      var bg  = p.dataset.bg;
      var src = p.dataset.src;
      if (src) {
        visual.style.backgroundImage = "url('" + src.replace(/'/g, "\\'") + "')";
        visual.style.backgroundColor = bg || '';
      } else if (bg) {
        visual.style.backgroundImage = '';
        visual.style.background = bg;
      }

      if (typeof opts.onChange === 'function') opts.onChange(p, best);
    }

    var ticking = false;
    function tick() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    update();

    return { el: host, destroy: function () { window.removeEventListener('scroll', tick); window.removeEventListener('resize', tick); } };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var StickyScrollReveal = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = StickyScrollReveal;
  else root.StickyScrollReveal = StickyScrollReveal;
})(typeof window !== 'undefined' ? window : this);
