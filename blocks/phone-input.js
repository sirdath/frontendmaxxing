/* ============================================
   PHONE INPUT — Country picker + national number with formatting
   Depends on: blocks/country-picker.js
   ============================================
   Usage:
     PhoneInput.init('[data-phone-input]', {
       value: '+1 555 1234',
       defaultCountry: 'US',
       onChange: function (e164, info) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    value: '',
    defaultCountry: 'US',
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

    if (!root.CountryPicker) {
      console.warn('[PhoneInput] Requires blocks/country-picker.js loaded first.');
      return null;
    }

    var countryEl = el.querySelector('[data-country-picker]');
    var input = el.querySelector('.phin-number');
    if (!countryEl || !input) return { el: el, destroy: function () {} };

    var current = null;

    // Initialize country picker
    var picker = root.CountryPicker.init(countryEl, {
      value: o.defaultCountry,
      onChange: function (c) {
        current = c;
        emit();
        input.focus();
      }
    });
    current = picker.getValue();

    // Parse pre-filled value if provided
    if (o.value) {
      var match = /^\+(\d+)\s?(.*)$/.exec(o.value.trim());
      if (match) {
        // Find country by dial code (best-effort first match)
        var dial = '+' + match[1];
        var hit = root.CountryPicker.COUNTRIES.find(function (c) { return c[2] === dial; });
        if (hit) picker.setValue(hit[0]);
        input.value = (match[2] || '').replace(/\D/g, '').replace(/(\d{3})(?=\d)/g, '$1 ');
      } else {
        input.value = o.value;
      }
    }

    function emit() {
      var natl = input.value.replace(/\D/g, '');
      var dial = current ? current.dial : '';
      var e164 = dial + natl;
      if (typeof o.onChange === 'function') o.onChange(e164, { country: current, national: natl });
    }

    function onInput() {
      // Group digits into trios for readability
      var raw = input.value.replace(/\D/g, '');
      var formatted = raw.replace(/(\d{3})(?=\d)/g, '$1 ');
      input.value = formatted;
      emit();
    }

    input.addEventListener('input', onInput);

    function destroy() {
      input.removeEventListener('input', onInput);
      picker.destroy && picker.destroy();
    }

    return { el: el, getValue: function () { var n = input.value.replace(/\D/g, ''); return (current && current.dial || '') + n; }, destroy: destroy };
  }

  var PhoneInput = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = PhoneInput;
  else root.PhoneInput = PhoneInput;
})(typeof window !== 'undefined' ? window : this);
