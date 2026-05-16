/* ============================================
   IMAGE COMPARE — Before/after slider behavior
   Inspired by Codrops image compare demos
   ============================================
   Usage:
     ImageCompare.init('[data-ic]');
     ImageCompare.init('[data-ic]', {
       start: 0.5,           // initial split position (0..1)
       axis: 'x',            // 'x' (default) or 'y'
       hoverPreview: false   // drag follows pointer on hover (no click)
     });

   Auto-detects .ic-vertical to set axis = 'y'.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    start: 0.5,
    axis: 'x',
    hoverPreview: false
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

    if (el.classList.contains('ic-vertical')) o.axis = 'y';

    if (!el.querySelector('.ic-handle')) {
      var h = document.createElement('span');
      h.className = 'ic-handle';
      el.appendChild(h);
    }

    set(o.start);
    var dragging = false;

    function set(pct) {
      pct = clamp(pct, 0, 1);
      el.style.setProperty('--ic-pos', (pct * 100).toFixed(3) + '%');
    }

    function posFromEvent(e) {
      var r = el.getBoundingClientRect();
      if (o.axis === 'y') return (e.clientY - r.top) / r.height;
      return (e.clientX - r.left) / r.width;
    }

    function onDown(e) {
      dragging = true;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      set(posFromEvent(e));
    }
    function onMove(e) {
      if (!dragging && !o.hoverPreview) return;
      set(posFromEvent(e));
    }
    function onUp() { dragging = false; }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerleave', onUp);

    // Keyboard: tabbable, arrow keys nudge
    el.setAttribute('tabindex', '0');
    function onKey(e) {
      var step = e.shiftKey ? 0.1 : 0.02;
      var cur = parseFloat(el.style.getPropertyValue('--ic-pos') || '50') / 100;
      if (o.axis === 'x') {
        if (e.key === 'ArrowLeft')  { set(cur - step); e.preventDefault(); }
        if (e.key === 'ArrowRight') { set(cur + step); e.preventDefault(); }
      } else {
        if (e.key === 'ArrowUp')    { set(cur - step); e.preventDefault(); }
        if (e.key === 'ArrowDown')  { set(cur + step); e.preventDefault(); }
      }
    }
    el.addEventListener('keydown', onKey);

    function destroy() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerleave', onUp);
      el.removeEventListener('keydown', onKey);
    }

    return { el: el, set: set, destroy: destroy };
  }

  var ImageCompare = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ImageCompare;
  else root.ImageCompare = ImageCompare;
})(typeof window !== 'undefined' ? window : this);
