/* ============================================
   LONG PRESS — Fire callback after a sustained press
   Inspired by haptic-feel UI patterns / iOS gesture recognizers
   ============================================
   Usage:
     LongPress.init('.tile', {
       delay: 500,
       moveThreshold: 8,   // cancel if pointer moves more than N px
       onStart:    function (el, e) { …show progress ring… },
       onProgress: function (p, el)  { … },
       onLongPress: function (el, e)  { … },
       onCancel:   function (el)      { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    delay: 500,
    moveThreshold: 8,
    onStart: null,
    onProgress: null,
    onLongPress: null,
    onCancel: null
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
    var raf = null;
    var fired = false;
    var active = false;

    function tick() {
      if (!active) return;
      var elapsed = performance.now() - startT;
      var p = Math.min(1, elapsed / o.delay);
      if (typeof o.onProgress === 'function') o.onProgress(p, el);
      if (p >= 1 && !fired) {
        fired = true;
        if (typeof o.onLongPress === 'function') o.onLongPress(el, lastEvent);
      } else {
        raf = requestAnimationFrame(tick);
      }
    }

    var lastEvent = null;

    function onDown(e) {
      active = true;
      fired = false;
      startT = performance.now();
      startX = e.clientX; startY = e.clientY;
      lastEvent = e;
      if (typeof o.onStart === 'function') o.onStart(el, e);
      raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
      if (!active) return;
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > o.moveThreshold) cancel();
    }

    function onUp() { cancel(); }

    function cancel() {
      if (!active) return;
      active = false;
      if (raf) cancelAnimationFrame(raf);
      if (!fired && typeof o.onCancel === 'function') o.onCancel(el);
    }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('pointerleave', cancel);

    function destroy() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', cancel);
      el.removeEventListener('pointerleave', cancel);
      cancel();
    }

    return { el: el, destroy: destroy };
  }

  var LongPress = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = LongPress;
  else root.LongPress = LongPress;
})(typeof window !== 'undefined' ? window : this);
