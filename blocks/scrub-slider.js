/* ============================================
   SCRUB SLIDER — Video-scrub style controller
   Inspired by WatermelonUI scrub-slider
   ============================================
   Usage:
     ScrubSlider.init('[data-scrub]', {
       tickCount: 32,
       snap: true,           // snap to ticks
       onChange: function (v) {},
       onCommit: function (v) {}
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { tickCount: 32, snap: true, onChange: null, onCommit: null };

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
    var min = parseFloat(host.dataset.min) || 0;
    var max = parseFloat(host.dataset.max) || 100;
    var value = parseFloat(host.dataset.value) || min;

    var valueEl = host.querySelector('.scrub-value');

    function render() {
      var pct = ((value - min) / (max - min)) * 100;
      host.style.setProperty('--sc-value-pct', pct);
      if (valueEl) valueEl.textContent = Math.round(value);
      if (typeof o.onChange === 'function') o.onChange(value);
    }
    render();

    var dragging = false;

    function pointToValue(clientX) {
      var rect = host.getBoundingClientRect();
      var pad = 16;
      var w = rect.width - pad * 2;
      var x = clientX - rect.left - pad;
      var pct = clamp(x / w, 0, 1);
      var raw = min + pct * (max - min);
      if (o.snap) {
        var step = (max - min) / (o.tickCount - 1);
        raw = Math.round(raw / step) * step;
      }
      return clamp(raw, min, max);
    }

    host.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      dragging = true;
      host.classList.add('is-dragging');
      try { host.setPointerCapture(e.pointerId); } catch (_) {}
      value = pointToValue(e.clientX);
      render();
    });
    host.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      value = pointToValue(e.clientX);
      render();
    });
    host.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      host.classList.remove('is-dragging');
      try { host.releasePointerCapture(e.pointerId); } catch (_) {}
      if (typeof o.onCommit === 'function') o.onCommit(value);
    });

    function set(v) { value = clamp(v, min, max); render(); }
    function get() { return value; }

    return { el: host, set: set, get: get };
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ScrubSlider = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ScrubSlider;
  else root.ScrubSlider = ScrubSlider;
})(typeof window !== 'undefined' ? window : this);
