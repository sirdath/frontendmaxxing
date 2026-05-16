/* ============================================
   CURSOR HUD — Live coordinates + crosshair tracker for any container
   ============================================
   Usage:
     CursorHud.init('[data-chud]', {
       showCoords: true,
       showCrosshair: true,
       format: '{x},{y}',     // or '({x}, {y})' or 'X:{x} Y:{y}'
       scale: 1,              // multiply coords by this (e.g. 0.5 for half-precision)
       precision: 0           // decimal places
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    showCoords: true,
    showCrosshair: true,
    format: '{x},{y}',
    scale: 1,
    precision: 0,
    snap: 0     // round to nearest N px when > 0
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    host.classList.add('chud');

    // Ensure structure
    if (o.showCrosshair && !host.querySelector('.chud-crosshair-x')) {
      var x = document.createElement('div');
      x.className = 'chud-crosshair-x';
      host.appendChild(x);
    }
    if (o.showCrosshair && !host.querySelector('.chud-crosshair-y')) {
      var y = document.createElement('div');
      y.className = 'chud-crosshair-y';
      host.appendChild(y);
    }
    var coordsEl = host.querySelector('.chud-coords');
    if (o.showCoords && !coordsEl) {
      coordsEl = document.createElement('div');
      coordsEl.className = 'chud-coords';
      coordsEl.textContent = '0, 0';
      host.appendChild(coordsEl);
    }
    var grid = host.querySelector('.chud-grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'chud-grid';
      host.appendChild(grid);
    }

    function onMove(e) {
      var r = host.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      if (o.snap > 0) {
        x = Math.round(x / o.snap) * o.snap;
        y = Math.round(y / o.snap) * o.snap;
      }
      host.style.setProperty('--x', x + 'px');
      host.style.setProperty('--y', y + 'px');
      if (coordsEl) {
        var sx = (x * o.scale).toFixed(o.precision);
        var sy = (y * o.scale).toFixed(o.precision);
        coordsEl.textContent = o.format.replace('{x}', sx).replace('{y}', sy);
      }
    }

    function onLeave() {
      if (coordsEl) coordsEl.textContent = '—';
    }

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    function destroy() {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    }

    return { el: host, destroy: destroy };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorHud = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorHud;
  else root.CursorHud = CursorHud;
})(typeof window !== 'undefined' ? window : this);
