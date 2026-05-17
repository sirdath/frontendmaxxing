/* ============================================
   STEPPER PACK — Increment/decrement + long-press repeat + clamping
   ============================================
   Usage:
     Stepper.init('[data-stp]', {
       min: 0, max: 99, step: 1, value: 1,
       longPress: true, longPressDelay: 280, repeatInterval: 80,
       onChange: function (val) {}
     });

     // Programmatic
     instance.set(5); instance.get(); instance.inc(); instance.dec();
   ============================================ */
(function (root) {
  'use strict';
  var defaults = {
    min: -Infinity, max: Infinity, step: 1,
    value: 0,
    longPress: true, longPressDelay: 280, repeatInterval: 80,
    onChange: null
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
    var min = pickNumber(host.dataset.min, o.min);
    var max = pickNumber(host.dataset.max, o.max);
    var step = pickNumber(host.dataset.step, o.step);
    var value = pickNumber(host.dataset.value, o.value);

    var inputEl = host.querySelector('.stp-val');
    var plus = host.querySelector('.stp-plus');
    var minus = host.querySelector('.stp-minus');

    function render() {
      if (inputEl) inputEl.value = value;
      if (plus) plus.disabled = value >= max;
      if (minus) minus.disabled = value <= min;
    }
    function set(v) {
      var next = Math.max(min, Math.min(max, +v || 0));
      // Snap to step
      var snapped = Math.round((next - min) / step) * step + min;
      snapped = Math.max(min, Math.min(max, snapped));
      if (snapped === value) return;
      value = snapped;
      render();
      if (typeof o.onChange === 'function') o.onChange(value);
    }
    function inc() { set(value + step); }
    function dec() { set(value - step); }
    render();

    function bindBtn(btn, fn) {
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        if (e.detail === 0 || !o.longPress) fn();
      });
      if (!o.longPress) return;
      var holdTimer, repeatTimer;
      function start(e) {
        if (e.button && e.button !== 0) return;
        fn(); // immediate first step
        host.classList.add('is-busy');
        holdTimer = setTimeout(function () {
          repeatTimer = setInterval(fn, o.repeatInterval);
        }, o.longPressDelay);
      }
      function stop() {
        clearTimeout(holdTimer);
        clearInterval(repeatTimer);
        holdTimer = repeatTimer = null;
        host.classList.remove('is-busy');
      }
      btn.addEventListener('pointerdown', start);
      btn.addEventListener('pointerup', stop);
      btn.addEventListener('pointerleave', stop);
      btn.addEventListener('pointercancel', stop);
    }
    bindBtn(plus, inc);
    bindBtn(minus, dec);

    if (inputEl) {
      inputEl.addEventListener('change', function () {
        set(inputEl.value);
        if (inputEl.value !== String(value)) inputEl.value = value;
      });
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowUp') { e.preventDefault(); inc(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); dec(); }
      });
      inputEl.addEventListener('wheel', function (e) {
        if (document.activeElement !== inputEl) return;
        e.preventDefault();
        if (e.deltaY < 0) inc(); else dec();
      }, { passive: false });
    }

    return {
      el: host, set: set, get: function () { return value; },
      inc: inc, dec: dec
    };
  }

  function pickNumber(a, b) { var n = parseFloat(a); return isNaN(n) ? b : n; }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var Stepper = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = Stepper;
  else root.Stepper = Stepper;
})(typeof window !== 'undefined' ? window : this);
