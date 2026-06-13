/* ============================================
   CSS 3D — coverflow tilt controller for css-3d.css
   Inspired by Apple coverflow
   ============================================
   Only c3d-coverflow needs JS (the cube/flip/stack/wall are pure CSS). As the
   row scrolls, each card tilts toward the centre in 3D.

   Usage:
     CSS3D.init('[data-c3d]');          // reads data-c3d="coverflow"
     CSS3D.coverflow('.c3d-coverflow');

   Methods: init(sel) · coverflow(sel) — return instances with destroy().
   ============================================ */
(function (root) {
  'use strict';

  function coverflow(el) {
    var items = Array.prototype.slice.call(el.querySelectorAll('.c3d-cf-item'));
    var raf = 0;
    function update() {
      raf = 0;
      var cRect = el.getBoundingClientRect();
      var center = cRect.left + cRect.width / 2;
      var half = cRect.width / 2 || 1;
      items.forEach(function (it) {
        var r = it.getBoundingClientRect();
        var ic = r.left + r.width / 2;
        var d = Math.max(-1.6, Math.min(1.6, (ic - center) / half));
        var rot = d * -48;
        var tz = -Math.abs(d) * 90;
        var sc = 1 - Math.min(0.34, Math.abs(d) * 0.26);
        it.style.transform = 'translateZ(' + tz.toFixed(1) + 'px) rotateY(' + rot.toFixed(1) + 'deg) scale(' + sc.toFixed(3) + ')';
        it.style.zIndex = String(100 - Math.round(Math.abs(d) * 50));
        it.style.opacity = (1 - Math.min(0.5, Math.abs(d) * 0.32)).toFixed(2);
      });
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // centre the middle item, then paint
    requestAnimationFrame(function () {
      var mid = items[Math.floor(items.length / 2)];
      if (mid) el.scrollLeft = mid.offsetLeft - (el.clientWidth - mid.clientWidth) / 2;
      update();
    });
    return { el: el, destroy: function () { if (raf) cancelAnimationFrame(raf); el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); } };
  }

  function init(target) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return coverflow(el); });
  }

  var CSS3D = { init: init, coverflow: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CSS3D;
  else root.CSS3D = CSS3D;
})(typeof window !== 'undefined' ? window : this);
