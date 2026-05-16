/* ============================================
   CURSOR SPOTLIGHT — Mouse-tracked spotlight reveal controller
   ============================================
   Usage:
     <section class="cspot" data-cspot>...</section>

     CursorSpotlight.init('[data-cspot]', {
       lerp: 0.22,    // 0..1 — easing toward cursor (lower = smoother)
       radius: null   // override --cs-r dynamically (px or null = use CSS default)
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    lerp: 0.22,
    radius: null,
    persistOnLeave: false
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
    if (o.radius != null) host.style.setProperty('--cs-r', o.radius + 'px');

    var tx = 0.5, ty = 0.5, cx = 0.5, cy = 0.5;
    var rafId = null;
    var active = false;
    var rect;

    function updateRect() { rect = host.getBoundingClientRect(); }
    updateRect();
    window.addEventListener('resize', updateRect);

    function onMove(e) {
      updateRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      tx = Math.max(0, Math.min(1, x));
      ty = Math.max(0, Math.min(1, y));
      if (!rafId) tick();
    }
    function onLeave() {
      if (o.persistOnLeave) return;
      // Smoothly return to center
      tx = 0.5;
      ty = 0.5;
    }
    function tick() {
      cx += (tx - cx) * o.lerp;
      cy += (ty - cy) * o.lerp;
      host.style.setProperty('--mx', (cx * 100).toFixed(2) + '%');
      host.style.setProperty('--my', (cy * 100).toFixed(2) + '%');
      if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    function destroy() {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', updateRect);
      cancelAnimationFrame(rafId);
    }

    return { el: host, destroy: destroy };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorSpotlight = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorSpotlight;
  else root.CursorSpotlight = CursorSpotlight;
})(typeof window !== 'undefined' ? window : this);
