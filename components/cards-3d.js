/* ============================================
   CARDS 3D — Mouse-tilt card with layered depth
   Inspired by Aceternity UI
   ============================================
   Usage:
     Cards3D.init('[data-card3d]');
     Cards3D.init('[data-card3d]', {
       maxTilt: 15,
       perspective: 1000,
       scale: 1.02
     });

   Layer parallax: any descendant with [data-card3d-depth="N"] is pushed
   `N` pixels along the Z axis (and shifted proportionally on tilt).
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    maxTilt: 15,
    perspective: 1000,
    scale: 1.02
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

    el.style.perspective = o.perspective + 'px';
    var body = el.querySelector('.card3d-body');
    if (!body) return { el: el, destroy: function () {} };

    var layers = Array.prototype.slice.call(el.querySelectorAll('[data-card3d-depth]'));
    var tx = 0, ty = 0, scale = 1;
    var targetTx = 0, targetTy = 0, targetScale = 1;
    var raf = null;
    var hovering = false;

    function onMove(e) {
      var rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;   // 0..1
      var py = (e.clientY - rect.top)  / rect.height;  // 0..1
      targetTy = (px - 0.5) * 2 * o.maxTilt;           // rotateY
      targetTx = -(py - 0.5) * 2 * o.maxTilt;          // rotateX
      targetScale = o.scale;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function onEnter() { hovering = true; }
    function onLeave() {
      hovering = false;
      targetTx = 0; targetTy = 0; targetScale = 1;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function loop() {
      raf = null;
      tx    += (targetTx    - tx)    * 0.18;
      ty    += (targetTy    - ty)    * 0.18;
      scale += (targetScale - scale) * 0.18;

      body.style.transform =
        'rotateX(' + tx.toFixed(2) + 'deg) ' +
        'rotateY(' + ty.toFixed(2) + 'deg) ' +
        'scale(' + scale.toFixed(3) + ')';

      layers.forEach(function (l) {
        var depth = parseFloat(l.getAttribute('data-card3d-depth')) || 0;
        // Push along Z, plus tiny x/y shift proportional to tilt
        var shiftX = -ty * depth * 0.02;
        var shiftY =  tx * depth * 0.02;
        l.style.transform =
          'translate3d(' + shiftX.toFixed(2) + 'px,' + shiftY.toFixed(2) + 'px,' + depth + 'px)';
      });

      var settling = Math.abs(tx - targetTx) > 0.01 ||
                     Math.abs(ty - targetTy) > 0.01 ||
                     Math.abs(scale - targetScale) > 0.001;
      if (hovering || settling) raf = requestAnimationFrame(loop);
    }

    el.addEventListener('pointermove',  onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    function destroy() {
      el.removeEventListener('pointermove',  onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      body.style.transform = '';
      layers.forEach(function (l) { l.style.transform = ''; });
    }

    return { el: el, destroy: destroy };
  }

  var Cards3D = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Cards3D;
  else root.Cards3D = Cards3D;
})(typeof window !== 'undefined' ? window : this);
