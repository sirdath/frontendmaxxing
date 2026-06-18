/* ============================================
   DEVICE TILT — gyro/pointer parallax via --tilt-x / --tilt-y CSS vars
   Inspired by "living poster" device-orientation parallax (W3C DeviceOrientation)
   ============================================
   Browser-native, ZERO deps. Writes normalized (-1..1) `--tilt-x` / `--tilt-y`
   on the target from phone tilt (gamma/beta); falls back to pointer position on
   devices without a gyroscope. iOS 13+ asks permission on the first user gesture.
   Disabled under prefers-reduced-motion. Consume the vars in CSS, e.g.:
     .layer { transform: translate(calc(var(--tilt-x) * 18px), calc(var(--tilt-y) * 18px)); }
     .layer.deep { transform: translate(calc(var(--tilt-x) * 40px), calc(var(--tilt-y) * 40px)); }

   Usage:
     DeviceTilt.init('#poster', { max: 14, lerp: 0.12 });
     // returns { el, destroy }. Reads the gyroscope if present, else the pointer.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { varX: '--tilt-x', varY: '--tilt-y', max: 14, lerp: 0.12, pointerFallback: true };

  function init(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, gotGyro = false, usingPointer = false;

    function clamp(v) { return v < -1 ? -1 : v > 1 ? 1 : v; }
    function loop() {
      cx += (tx - cx) * o.lerp;
      cy += (ty - cy) * o.lerp;
      el.style.setProperty(o.varX, cx.toFixed(4));
      el.style.setProperty(o.varY, cy.toFixed(4));
      raf = requestAnimationFrame(loop);
    }

    function onOrient(e) {
      if (e.gamma == null && e.beta == null) return;
      gotGyro = true;                                  // gamma: L/R -90..90, beta: F/B (~45 neutral in-hand)
      tx = clamp((e.gamma || 0) / o.max);
      ty = clamp(((e.beta || 0) - 45) / o.max);
    }
    function onPointer(e) {
      var r = el.getBoundingClientRect();
      tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2);
      ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2);
    }
    function resetTarget() { tx = 0; ty = 0; }

    function startPointer() {
      if (usingPointer || !o.pointerFallback) return;
      usingPointer = true;
      el.addEventListener('pointermove', onPointer);
      el.addEventListener('pointerleave', resetTarget);
    }
    function attachGyro() {
      window.addEventListener('deviceorientation', onOrient);
      setTimeout(function () { if (!gotGyro) startPointer(); }, 1200);   // no sensor → pointer
    }
    function begin() {
      var DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        // iOS 13+: permission must be requested inside a user gesture
        var ask = function () {
          DOE.requestPermission()
            .then(function (state) { if (state === 'granted') attachGyro(); else startPointer(); })
            .catch(function () { startPointer(); });
        };
        window.addEventListener('pointerdown', ask, { once: true });
        startPointer();                                 // responsive before the tap, too
      } else if (DOE) {
        attachGyro();
      } else {
        startPointer();
      }
    }

    if (!reduce) { begin(); raf = requestAnimationFrame(loop); }

    return {
      el: el,
      destroy: function () {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('deviceorientation', onOrient);
        el.removeEventListener('pointermove', onPointer);
        el.removeEventListener('pointerleave', resetTarget);
      }
    };
  }

  var DeviceTilt = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = DeviceTilt;
  else root.DeviceTilt = DeviceTilt;
})(typeof window !== 'undefined' ? window : this);
