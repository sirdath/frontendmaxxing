/* ============================================
   QUANTITY STEPPER — Bind +/- buttons + min/max + onChange
   Inspired by Stripe / Shopify quantity inputs
   ============================================
   Usage:
     QuantityStepper.init('[data-qstep]', {
       min: 1, max: 99,
       onChange: function (value) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    min: 0,
    max: Infinity,
    step: 1,
    onChange: null
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

    var input = el.querySelector('input');
    var dec = el.querySelector('[data-qstep-dec]') || el.querySelectorAll('button')[0];
    var inc = el.querySelector('[data-qstep-inc]') || el.querySelectorAll('button')[1];

    var min = parseFloat(input.getAttribute('min'));
    var max = parseFloat(input.getAttribute('max'));
    if (!isNaN(min)) o.min = min;
    if (!isNaN(max)) o.max = max;

    function get() {
      var v = parseFloat(input.value);
      if (isNaN(v)) v = o.min;
      return v;
    }
    function set(v) {
      v = Math.max(o.min, Math.min(o.max, v));
      input.value = v;
      dec.disabled = v <= o.min;
      inc.disabled = v >= o.max;
      if (typeof o.onChange === 'function') o.onChange(v);
    }
    function onDec() { set(get() - o.step); }
    function onInc() { set(get() + o.step); }
    function onInput() { set(get()); }

    dec.addEventListener('click', onDec);
    inc.addEventListener('click', onInc);
    input.addEventListener('change', onInput);
    set(get());

    function destroy() {
      dec.removeEventListener('click', onDec);
      inc.removeEventListener('click', onInc);
      input.removeEventListener('change', onInput);
    }

    return { el: el, get: get, set: set, destroy: destroy };
  }

  var QuantityStepper = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = QuantityStepper;
  else root.QuantityStepper = QuantityStepper;
})(typeof window !== 'undefined' ? window : this);
