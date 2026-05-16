/* ============================================
   SWIPE — Detect left/right/up/down swipes with thresholds
   Inspired by hammer.js / common touch-handler patterns
   ============================================
   Usage:
     Swipe.init('.card', {
       threshold: 50,       // min px to count as swipe
       velocity:  0.3,      // min px/ms for fast-flick detection
       directions: 'all',   // 'all' | 'horizontal' | 'vertical'
       onSwipe: function (dir, info, el) { console.log(dir); },
       onLeft:  function (info, el) {},
       onRight: function (info, el) {},
       onUp:    function (info, el) {},
       onDown:  function (info, el) {}
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    threshold: 50,
    velocity: 0.3,
    directions: 'all',
    onSwipe: null,
    onLeft: null, onRight: null, onUp: null, onDown: null
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

    var startX = 0, startY = 0, startT = 0;
    var trackingId = null;

    function onDown(e) {
      if (trackingId !== null) return;
      trackingId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startT = performance.now();
    }

    function onUp(e) {
      if (e.pointerId !== trackingId) return;
      trackingId = null;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      var dt = Math.max(1, performance.now() - startT);
      var ax = Math.abs(dx), ay = Math.abs(dy);
      var v = Math.max(ax, ay) / dt;
      if (ax < o.threshold && ay < o.threshold && v < o.velocity) return;

      var dir = null;
      if (ax > ay) {
        if (o.directions === 'vertical') return;
        dir = dx > 0 ? 'right' : 'left';
      } else {
        if (o.directions === 'horizontal') return;
        dir = dy > 0 ? 'down' : 'up';
      }
      var info = { dx: dx, dy: dy, dt: dt, velocity: v };
      if (typeof o.onSwipe === 'function') o.onSwipe(dir, info, el);
      var cb = o['on' + dir[0].toUpperCase() + dir.slice(1)];
      if (typeof cb === 'function') cb(info, el);
    }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', function () { trackingId = null; });

    function destroy() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
    }

    return { el: el, destroy: destroy };
  }

  var Swipe = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Swipe;
  else root.Swipe = Swipe;
})(typeof window !== 'undefined' ? window : this);
