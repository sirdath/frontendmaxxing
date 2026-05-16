/* ============================================
   KNOB SLIDER — Pointer-drag rotary knob controller
   Inspired by WatermelonUI knob-slider
   ============================================
   Usage:
     KnobSlider.init('[data-knob]', {
       sensitivity: 0.5,    // px per unit
       onChange: function (value) {},
       onCommit: function (value) {}
     });

     instance.set(75);
     instance.get();
     instance.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    sensitivity: 0.5,
    onChange: null,
    onCommit: null,
    wheel: true
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
    var min = parseFloat(host.dataset.min) || 0;
    var max = parseFloat(host.dataset.max) || 100;
    var value = parseFloat(host.dataset.value) || min;

    function update() {
      var pct = ((value - min) / (max - min)) * 100;
      host.style.setProperty('--kn-value', pct);
      var valueEl = host.querySelector('.knob-value');
      if (valueEl) valueEl.textContent = Math.round(value);
      if (typeof o.onChange === 'function') o.onChange(value);
    }
    update();

    var dragging = false;
    var startY = 0;
    var startVal = 0;

    host.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      dragging = true;
      startY = e.clientY;
      startVal = value;
      try { host.setPointerCapture(e.pointerId); } catch (_) {}
    });
    host.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dy = e.clientY - startY;     // dragging UP increases value
      value = clamp(startVal - dy * o.sensitivity, min, max);
      update();
    });
    host.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      try { host.releasePointerCapture(e.pointerId); } catch (_) {}
      if (typeof o.onCommit === 'function') o.onCommit(value);
    });
    host.addEventListener('pointercancel', function () { dragging = false; });

    if (o.wheel) {
      host.addEventListener('wheel', function (e) {
        e.preventDefault();
        value = clamp(value - e.deltaY * 0.05, min, max);
        update();
      }, { passive: false });
    }

    // Double-click resets to middle
    host.addEventListener('dblclick', function () {
      value = (min + max) / 2;
      update();
      if (typeof o.onCommit === 'function') o.onCommit(value);
    });

    function set(v) { value = clamp(v, min, max); update(); }
    function get() { return value; }
    function destroy() {}

    return { el: host, set: set, get: get, destroy: destroy };
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var KnobSlider = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = KnobSlider;
  else root.KnobSlider = KnobSlider;
})(typeof window !== 'undefined' ? window : this);
