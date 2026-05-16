/* ============================================
   ANIMATED GRID PATTERN — Random cells pulse highlight on a grid
   Inspired by Magic UI
   ============================================
   Usage:
     AnimatedGridPattern.init('.animated-grid-pattern');
     AnimatedGridPattern.init('.animated-grid-pattern', {
       numSquares: 50,
       cellSize: 36,
       duration: 4,
       repeatDelay: 0.5
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var defaults = {
    numSquares: 50,
    cellSize: 36,        // must match CSS --agp-cell
    duration: 4,         // seconds per highlight cycle
    repeatDelay: 0.5,
    maxOpacity: 0.5
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var existing = el.querySelector('svg.agp-svg');
    if (existing) existing.remove();

    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'agp-svg');
    el.appendChild(svg);

    var cols = 0, rows = 0;
    var squares = [];

    function rebuild() {
      var rect = el.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
      cols = Math.max(1, Math.floor(rect.width  / o.cellSize));
      rows = Math.max(1, Math.floor(rect.height / o.cellSize));

      while (svg.firstChild) svg.removeChild(svg.firstChild);
      squares = [];
      for (var i = 0; i < o.numSquares; i++) {
        var r = document.createElementNS(SVGNS, 'rect');
        r.setAttribute('width', o.cellSize - 1);
        r.setAttribute('height', o.cellSize - 1);
        r.setAttribute('fill', 'currentColor');
        r.setAttribute('opacity', 0);
        svg.appendChild(r);
        squares.push({ el: r, cycleEnd: 0, alive: false });
        schedule(squares[i], i * 0.05);
      }
    }

    function schedule(sq, delay) {
      sq.cycleEnd = performance.now() + (delay + Math.random() * o.repeatDelay) * 1000;
      sq.alive = false;
    }

    function pickCell(sq) {
      var c = Math.floor(Math.random() * cols);
      var r = Math.floor(Math.random() * rows);
      sq.el.setAttribute('x', c * o.cellSize);
      sq.el.setAttribute('y', r * o.cellSize);
    }

    var raf = null;
    function frame(now) {
      for (var i = 0; i < squares.length; i++) {
        var sq = squares[i];
        if (!sq.alive && now >= sq.cycleEnd) {
          pickCell(sq);
          sq.alive = true;
          sq.start = now;
        }
        if (sq.alive) {
          var t = (now - sq.start) / (o.duration * 1000);
          if (t >= 1) {
            sq.el.setAttribute('opacity', 0);
            schedule(sq, 0);
          } else {
            // fade in then out: triangular envelope
            var env = t < 0.5 ? (t * 2) : (1 - (t - 0.5) * 2);
            sq.el.setAttribute('opacity', (env * o.maxOpacity).toFixed(3));
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    rebuild();
    raf = requestAnimationFrame(frame);

    var resizeObs = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(rebuild);
      resizeObs.observe(el);
    } else {
      window.addEventListener('resize', rebuild);
    }

    function destroy() {
      if (raf) cancelAnimationFrame(raf);
      if (resizeObs) resizeObs.disconnect();
      else window.removeEventListener('resize', rebuild);
      svg.remove();
    }

    return { el: el, svg: svg, destroy: destroy };
  }

  var AnimatedGridPattern = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = AnimatedGridPattern;
  else root.AnimatedGridPattern = AnimatedGridPattern;
})(typeof window !== 'undefined' ? window : this);
