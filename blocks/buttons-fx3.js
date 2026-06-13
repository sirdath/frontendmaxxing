/* ============================================
   BUTTONS FX 3 — hold-to-confirm controller for buttons-fx3.css
   Inspired by touch-and-hold confirm buttons (see README credits)
   ============================================
   Only bf3-hold needs JS. While the pointer is held, --bf3-hold fills 0→1;
   on completion the button flashes (.is-confirmed) and onConfirm(el) fires.
   Releasing early resets the fill.

   Usage:
     HoldConfirm.init('[data-hold]', { duration: 1200, onConfirm: function (el) {} });

   Methods: init(sel, opts) — returns instances with destroy().
   Options: duration (ms) · onConfirm(el)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { duration: 1200, onConfirm: null };
  function nowMs() { return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now(); }

  function bind(el, opts) {
    opts = Object.assign({}, defaults, opts || {});
    el.classList.add('bf3', 'bf3-hold');
    var raf = 0, start = 0, holding = false;
    function setHold(v) { el.style.setProperty('--bf3-hold', v); }

    function tick() {
      var t = Math.min(1, (nowMs() - start) / opts.duration);
      setHold(t.toFixed(3));
      if (t >= 1) { holding = false; raf = 0; complete(); return; }
      raf = requestAnimationFrame(tick);
    }
    function complete() {
      el.classList.add('is-confirmed');
      if (typeof opts.onConfirm === 'function') { try { opts.onConfirm(el); } catch (e) {} }
      setTimeout(function () { el.classList.remove('is-confirmed'); setHold(0); }, 600);
    }
    function down(e) {
      if (e.button) return;
      holding = true; start = nowMs();
      if (el.setPointerCapture && e.pointerId != null) { try { el.setPointerCapture(e.pointerId); } catch (err) {} }
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
    function up() {
      if (!holding) return;
      holding = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (!el.classList.contains('is-confirmed')) setHold(0);
    }

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('pointercancel', up);
    return {
      el: el,
      destroy: function () {
        el.removeEventListener('pointerdown', down); el.removeEventListener('pointerup', up);
        el.removeEventListener('pointerleave', up); el.removeEventListener('pointercancel', up);
        if (raf) cancelAnimationFrame(raf);
      }
    };
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return bind(el, opts); });
  }

  var HoldConfirm = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = HoldConfirm;
  else root.HoldConfirm = HoldConfirm;
})(typeof window !== 'undefined' ? window : this);
