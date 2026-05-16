/* ============================================
   DOCK — Mouse-tracked magnification on dock items
   Inspired by Magic UI / macOS Dock
   ============================================
   Usage:
     Dock.init('.dock');
     Dock.init('.dock', {
       baseSize: 48,
       magnification: 80,
       distance: 140,
       axis: 'x'           // 'x' or 'y' (for vertical dock)
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    baseSize: 48,
    magnification: 80,
    distance: 140,
    axis: 'x'
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

    // Sync CSS to JS base size
    el.style.setProperty('--dock-size', o.baseSize + 'px');

    var items = Array.prototype.slice.call(el.querySelectorAll('.dock-item'));
    if (!items.length) return { el: el, destroy: function () {} };

    var pointerPos = null;
    var raf = null;

    function onMove(e) {
      var rect = el.getBoundingClientRect();
      pointerPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      if (!raf) raf = requestAnimationFrame(update);
    }

    function onLeave() {
      pointerPos = null;
      if (!raf) raf = requestAnimationFrame(update);
    }

    function update() {
      raf = null;
      var rect = el.getBoundingClientRect();
      var range = o.magnification - o.baseSize;
      var dist = o.distance;

      items.forEach(function (item) {
        var ir = item.getBoundingClientRect();
        var cx = ir.left - rect.left + ir.width / 2;
        var cy = ir.top  - rect.top  + ir.height / 2;
        var scale = 0;
        if (pointerPos) {
          var d = o.axis === 'y'
            ? Math.abs(cy - pointerPos.y)
            : Math.abs(cx - pointerPos.x);
          scale = Math.max(0, 1 - d / dist);
          // Ease (cosine in/out for smooth bump)
          scale = 0.5 - Math.cos(scale * Math.PI) / 2;
        }
        var size = o.baseSize + range * scale;
        item.style.setProperty('--dock-w', size + 'px');
        item.style.setProperty('--dock-h', size + 'px');
      });

      // When pointer leaves and all back to base, stop animating
      var stillSettling = items.some(function (item) {
        var cur = parseFloat(item.style.getPropertyValue('--dock-w')) || o.baseSize;
        return Math.abs(cur - o.baseSize) > 0.5;
      });
      if (pointerPos || stillSettling) raf = requestAnimationFrame(update);
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    function destroy() {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      items.forEach(function (item) {
        item.style.removeProperty('--dock-w');
        item.style.removeProperty('--dock-h');
      });
    }

    return { el: el, items: items, destroy: destroy };
  }

  var Dock = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Dock;
  else root.Dock = Dock;
})(typeof window !== 'undefined' ? window : this);
