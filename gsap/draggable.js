/* ============================================
   GSAP DRAGGABLE — Drag / throw with inertia + bounds + snap
   Inspired by official GSAP Draggable + InertiaPlugin pattern
   ============================================
   Requires GSAP + Draggable (+ optional InertiaPlugin) from CDN:
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Draggable.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/InertiaPlugin.min.js"></script>

   Usage:
     GsapDraggable.init('.box');
     GsapDraggable.init('.card', {
       type: 'x,y', bounds: '.area', inertia: true,
       snap: 50,                  // px grid, or function/array
       onDrag: function () {}, onThrowComplete: function () {}
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { type: 'x,y', inertia: true };

  function init(target, opts) {
    var gsap = root.gsap, Draggable = root.Draggable;
    if (!gsap || !Draggable) { console.warn('[GsapDraggable] Requires GSAP + Draggable plugin.'); return null; }
    var plugins = [Draggable];
    if (root.InertiaPlugin) plugins.push(root.InertiaPlugin);
    gsap.registerPlugin.apply(gsap, plugins);

    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    if (o.inertia && !root.InertiaPlugin) o.inertia = false; // graceful: drag without throw

    var cfg = {
      type: o.type,
      inertia: o.inertia,
      edgeResistance: o.edgeResistance != null ? o.edgeResistance : 0.65,
      dragResistance: o.dragResistance || 0
    };
    if (o.bounds) cfg.bounds = o.bounds;
    if (o.snap != null) {
      if (typeof o.snap === 'number') {
        var inc = o.snap;
        cfg.snap = function (v) { return Math.round(v / inc) * inc; };
      } else cfg.snap = o.snap;
    }
    ['onDrag', 'onPress', 'onRelease', 'onDragEnd', 'onThrowComplete', 'onClick'].forEach(function (cb) {
      if (typeof o[cb] === 'function') cfg[cb] = o[cb];
    });

    var instances = Draggable.create(target, cfg);

    return {
      instances: instances,
      destroy: function () { instances.forEach(function (d) { d.kill(); }); }
    };
  }

  var GsapDraggable = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = GsapDraggable;
  else root.GsapDraggable = GsapDraggable;
})(typeof window !== 'undefined' ? window : this);
