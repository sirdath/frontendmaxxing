/* ============================================
   CARD FX — cursor tracking for card-fx.css (the holo card)
   Inspired by holographic trading cards
   ============================================
   Only cfx-holo needs JS; the other card-fx variants are pure CSS.
   Writes --cfx-mx/--cfx-my (sheen + glare position) and --cfx-rx/--cfx-ry (tilt).

   Usage:
     CardFX.init('[data-card-fx]');     // reads data-card-fx="holo"
     CardFX.holo('.card', { max: 14 }); // max tilt degrees

   Methods: init(sel, opts) · holo(sel, opts) — return instances with destroy().
   Respects prefers-reduced-motion (skips tilt; sheen stays).
   ============================================ */
(function (root) {
  'use strict';

  var REDUCED = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var defaults = { effect: 'holo', max: 12 };

  function bind(el, opts) {
    opts = Object.assign({}, defaults, opts || {});
    el.classList.add('cfx', 'cfx-' + (el.getAttribute('data-card-fx') || opts.effect));
    var raf = 0, rect = null;

    function onEnter() { rect = el.getBoundingClientRect(); }
    function onMove(e) {
      if (!rect) rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        el.style.setProperty('--cfx-mx', (px * 100).toFixed(2) + '%');
        el.style.setProperty('--cfx-my', (py * 100).toFixed(2) + '%');
        if (!REDUCED) {
          el.style.setProperty('--cfx-ry', ((px - 0.5) * 2 * opts.max).toFixed(2) + 'deg');
          el.style.setProperty('--cfx-rx', ((0.5 - py) * 2 * opts.max).toFixed(2) + 'deg');
        }
      });
    }
    function onLeave() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      rect = null;
      el.style.setProperty('--cfx-mx', '50%'); el.style.setProperty('--cfx-my', '50%');
      el.style.removeProperty('--cfx-rx'); el.style.removeProperty('--cfx-ry');
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return {
      el: el,
      destroy: function () {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        onLeave();
      }
    };
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return bind(el, opts); });
  }

  var CardFX = { init: init, holo: function (t, o) { return init(t, Object.assign({}, o, { effect: 'holo' })); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = CardFX;
  else root.CardFX = CardFX;
})(typeof window !== 'undefined' ? window : this);
