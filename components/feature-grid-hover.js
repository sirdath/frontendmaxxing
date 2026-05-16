/* ============================================
   FEATURE GRID HOVER — Track cursor on each cell for the spotlight gradient
   Inspired by Stripe / Linear / cult-ui
   ============================================
   Usage:
     FeatureGridHover.init('[data-fgh]');
   ============================================ */
(function (root) {
  'use strict';

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el) {
    function onMove(e) {
      var cell = e.target.closest('.fgh-cell');
      if (!cell) return;
      var r = cell.getBoundingClientRect();
      cell.style.setProperty('--cell-x', (e.clientX - r.left) + 'px');
      cell.style.setProperty('--cell-y', (e.clientY - r.top)  + 'px');
    }
    el.addEventListener('pointermove', onMove);
    function destroy() { el.removeEventListener('pointermove', onMove); }
    return { el: el, destroy: destroy };
  }

  var FeatureGridHover = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = FeatureGridHover;
  else root.FeatureGridHover = FeatureGridHover;
})(typeof window !== 'undefined' ? window : this);
