/* ============================================
   SLIDERS — Sync the `--sld-progress` custom property and value bubble
   Inspired by uiverse.io / animata range slider patterns
   ============================================
   Usage:
     Sliders.init('[data-sld]');
     Sliders.init('[data-sld]', {
       formatValue: function (v) { return v + '%'; },
       onInput: function (v, input) { … }
     });

   Looks for a wrapper element with a child <input type="range"> and
   optional .sld-value element to display the current value.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    formatValue: function (v) { return v; },
    onInput: null,
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

    var input = el.matches && el.matches('input[type="range"]')
      ? el
      : el.querySelector('input[type="range"]');
    if (!input) return { el: el, destroy: function () {} };
    var value = el.querySelector('.sld-value');

    function update() {
      var min = parseFloat(input.min || '0');
      var max = parseFloat(input.max || '100');
      var v   = parseFloat(input.value);
      var pct = ((v - min) / (max - min)) * 100;
      input.style.setProperty('--sld-progress', pct.toFixed(2) + '%');
      if (value) value.textContent = o.formatValue(v);
    }
    function onInput() {
      update();
      if (typeof o.onInput === 'function') o.onInput(parseFloat(input.value), input);
    }
    function onChange() {
      if (typeof o.onChange === 'function') o.onChange(parseFloat(input.value), input);
    }

    input.addEventListener('input', onInput);
    input.addEventListener('change', onChange);
    update();

    function destroy() {
      input.removeEventListener('input', onInput);
      input.removeEventListener('change', onChange);
    }

    return { el: el, input: input, destroy: destroy };
  }

  var Sliders = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Sliders;
  else root.Sliders = Sliders;
})(typeof window !== 'undefined' ? window : this);
