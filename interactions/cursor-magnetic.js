/* ============================================
   CURSOR MAGNETIC — Targets get pulled toward the cursor when nearby
   Inspired by Codrops magnetic-button demos / Awwwards portfolios
   ============================================
   (Companion to effects/cursor-effects.js which has CursorFX.magnetic too;
    this is a leaner, target-focused version with spring smoothing.)

   Usage:
     CursorMagnetic.init('.magnetic');
     CursorMagnetic.init('.magnetic', {
       strength: 0.4,     // 0..1 — how strongly target follows
       radius: 140,       // px — activation distance
       smoothing: 0.18,   // ease factor per frame
       children: false    // also pull child elements with [data-magnetic-child]
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    strength: 0.35,
    radius: 140,
    smoothing: 0.18,
    children: false
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

    el.style.willChange = 'transform';
    var children = o.children
      ? Array.prototype.slice.call(el.querySelectorAll('[data-magnetic-child]'))
      : [];
    children.forEach(function (c) { c.style.willChange = 'transform'; });

    var targetX = 0, targetY = 0;
    var x = 0, y = 0;
    var raf = null;
    var hovering = false;

    function onMove(e) {
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top  + r.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.hypot(dx, dy);
      if (dist > o.radius) {
        targetX = 0; targetY = 0;
        return;
      }
      var k = (1 - dist / o.radius) * o.strength;
      targetX = dx * k;
      targetY = dy * k;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onLeave() {
      hovering = false;
      targetX = 0; targetY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onEnter() { hovering = true; }

    function tick() {
      raf = null;
      x += (targetX - x) * o.smoothing;
      y += (targetY - y) * o.smoothing;
      el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
      children.forEach(function (c) {
        var ds = c.getAttribute('data-magnetic-child');
        var mult = ds ? parseFloat(ds) : 0.5;
        c.style.transform = 'translate3d(' + (x * mult).toFixed(2) + 'px,' + (y * mult).toFixed(2) + 'px,0)';
      });
      if (Math.abs(targetX - x) > 0.05 || Math.abs(targetY - y) > 0.05 || hovering) {
        raf = requestAnimationFrame(tick);
      }
    }

    // Listen on document so the field is felt before pointer enters the element
    document.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    function destroy() {
      document.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
      children.forEach(function (c) { c.style.transform = ''; });
    }

    return { el: el, destroy: destroy };
  }

  var CursorMagnetic = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = CursorMagnetic;
  else root.CursorMagnetic = CursorMagnetic;
})(typeof window !== 'undefined' ? window : this);
