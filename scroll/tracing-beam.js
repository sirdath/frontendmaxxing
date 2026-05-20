/* ============================================
   TRACING BEAM — Drives the .tb-fill and .tb-dot from scroll progress
   Inspired by Aceternity UI
   ============================================
   Usage:
     TracingBeam.init('.tb-host', {
       startOffset: 80,   // px before host top that counts as 'started'
       endOffset:   80    // px before host bottom that counts as 'done'
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { startOffset: 80, endOffset: 80 };

  function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v;}

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var fill = host.querySelector('.tb-fill');
    var dot  = host.querySelector('.tb-dot');
    var rail = host.querySelector('.tb-rail');
    if (!fill || !dot || !rail) return null;

    function updateLengths() {
      // Match the SVG path length to the actual rail height so stroke-dashoffset is accurate.
      var h = rail.getBoundingClientRect().height;
      fill.setAttribute('y2', h);
      var track = host.querySelector('.tb-track');
      if (track) track.setAttribute('y2', h);
      fill.style.strokeDasharray = h;
      fill.style.strokeDashoffset = h;
    }

    function onScroll() {
      var rect = host.getBoundingClientRect();
      var vh = window.innerHeight;
      var center = vh / 2;
      // progress: 0 when viewport-center is at (host top + startOffset),
      // 1 when viewport-center is at (host bottom - endOffset)
      var start = rect.top + o.startOffset;
      var end   = rect.bottom - o.endOffset;
      var total = end - start;
      if (total <= 0) return;
      var p = clamp((center - start) / total, 0, 1);

      var h = rail.getBoundingClientRect().height;
      fill.style.strokeDashoffset = (h - h * p).toFixed(1);
      dot.style.top = (h * p).toFixed(1) + 'px';
    }

    var ticking = false;
    function tick() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }

    var ro = ('ResizeObserver' in window) ? new ResizeObserver(function () { updateLengths(); onScroll(); }) : null;
    if (ro) ro.observe(host);

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', function () { updateLengths(); tick(); });

    updateLengths();
    onScroll();

    return {
      el: host,
      destroy: function () {
        window.removeEventListener('scroll', tick);
        if (ro) ro.disconnect();
      }
    };
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

  var TracingBeam = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = TracingBeam;
  else root.TracingBeam = TracingBeam;
})(typeof window !== 'undefined' ? window : this);
