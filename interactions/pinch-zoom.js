/* ============================================
   PINCH ZOOM — Pinch to zoom + pan within a container
   Inspired by panzoom / iOS pinch gesture
   ============================================
   Usage:
     <div class="pz-container">
       <img class="pz-target" src="big.jpg">
     </div>
     PinchZoom.init('.pz-container', {
       targetSelector: '.pz-target',
       minScale: 1,
       maxScale: 5,
       bounds:   true        // clamp pan so target can't be dragged out of view
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    targetSelector: null,
    minScale: 1,
    maxScale: 5,
    bounds: true,
    doubleTapToggle: true
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var target = o.targetSelector ? el.querySelector(o.targetSelector) : el.firstElementChild;
    if (!target) return { el: el, destroy: function () {} };

    el.style.touchAction = 'none';
    el.style.overflow = 'hidden';
    target.style.transformOrigin = '0 0';
    target.style.willChange = 'transform';

    var scale = 1, x = 0, y = 0;
    var pointers = new Map();
    var startDist = 0, startScale = 1, startMid = { x: 0, y: 0 }, startTransX = 0, startTransY = 0;
    var lastTap = 0;

    function apply() {
      target.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
    }

    function clampBounds() {
      if (!o.bounds) return;
      var r = el.getBoundingClientRect();
      var tw = target.offsetWidth  * scale;
      var th = target.offsetHeight * scale;
      var maxX = Math.max(0, tw - r.width);
      var maxY = Math.max(0, th - r.height);
      x = clamp(x, -maxX, 0);
      y = clamp(y, -maxY, 0);
    }

    function distance(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }
    function midpoint(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }

    function onDown(e) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        startDist = distance(pts[0], pts[1]);
        startMid = midpoint(pts[0], pts[1]);
        startScale = scale;
        startTransX = x; startTransY = y;
      } else if (pointers.size === 1 && o.doubleTapToggle) {
        var now = performance.now();
        if (now - lastTap < 300) {
          // Double-tap: toggle zoom
          if (scale > 1.01) { scale = 1; x = 0; y = 0; }
          else { scale = 2; }
          clampBounds(); apply();
        }
        lastTap = now;
      }
    }

    function onMove(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      var pts = Array.from(pointers.values());

      if (pointers.size === 2) {
        var d = distance(pts[0], pts[1]);
        var m = midpoint(pts[0], pts[1]);
        scale = clamp(startScale * (d / startDist), o.minScale, o.maxScale);
        var rect = el.getBoundingClientRect();
        // Pan so midpoint follows finger
        var dx = m.x - startMid.x;
        var dy = m.y - startMid.y;
        x = startTransX + dx;
        y = startTransY + dy;
        clampBounds();
        apply();
      } else if (pointers.size === 1 && scale > 1.01) {
        var p = pts[0];
        // Pan
        x += e.movementX || 0;
        y += e.movementY || 0;
        clampBounds();
        apply();
      }
    }

    function onUp(e) {
      pointers.delete(e.pointerId);
      el.releasePointerCapture && el.releasePointerCapture(e.pointerId);
    }

    function onWheel(e) {
      e.preventDefault();
      var rect = el.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      var prev = scale;
      var next = clamp(scale * (e.deltaY < 0 ? 1.12 : 0.89), o.minScale, o.maxScale);
      // Zoom toward cursor
      var k = next / prev;
      x = mx - (mx - x) * k;
      y = my - (my - y) * k;
      scale = next;
      clampBounds();
      apply();
    }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    apply();

    function destroy() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      target.style.transform = '';
      target.style.willChange = '';
      target.style.transformOrigin = '';
    }

    return {
      el: el,
      reset: function () { scale = 1; x = 0; y = 0; apply(); },
      destroy: destroy
    };
  }

  var PinchZoom = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = PinchZoom;
  else root.PinchZoom = PinchZoom;
})(typeof window !== 'undefined' ? window : this);
