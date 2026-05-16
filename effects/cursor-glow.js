/* ============================================
   CURSOR GLOW — Update CSS vars to follow the cursor
   Inspired by Linear / Vercel landing-page hovers
   ============================================
   Usage:
     CursorGlow.init('[data-cursor-glow]');
     CursorGlow.init('[data-cursor-glow]', { lerp: 0.25 });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    lerp: 0.25,        // ease factor per frame (1 = no smoothing)
    persistOnLeave: false
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

    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var raf = null;
    var hovering = false;

    function onMove(e) {
      var r = el.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onEnter() { hovering = true; el.classList.add('is-hover'); }
    function onLeave() {
      hovering = false;
      if (!o.persistOnLeave) el.classList.remove('is-hover');
    }

    function tick() {
      raf = null;
      current.x += (target.x - current.x) * o.lerp;
      current.y += (target.y - current.y) * o.lerp;
      el.style.setProperty('--cg-x', current.x.toFixed(2) + 'px');
      el.style.setProperty('--cg-y', current.y.toFixed(2) + 'px');
      if (Math.abs(target.x - current.x) > 0.2 || Math.abs(target.y - current.y) > 0.2 || hovering) {
        raf = requestAnimationFrame(tick);
      }
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    function destroy() {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.classList.remove('is-hover');
    }

    return { el: el, destroy: destroy };
  }

  var CursorGlow = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = CursorGlow;
  else root.CursorGlow = CursorGlow;
})(typeof window !== 'undefined' ? window : this);
