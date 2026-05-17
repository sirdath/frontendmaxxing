/* ============================================
   APP EMAIL VERIFY — Auto-advance OTP input + paste support
   ============================================
   Usage:
     AppOtp.init('[data-app-otp]', {
       onComplete: function (code) {},
       onChange:   function (partial) {}
     });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    Array.prototype.forEach.call(nodes, function (el) { bind(el, opts); });
  }

  function bind(group, opts) {
    if (group.dataset.apOtpBound) return;
    group.dataset.apOtpBound = '1';
    var inputs = Array.prototype.slice.call(group.querySelectorAll('input'));

    inputs.forEach(function (inp, i) {
      inp.addEventListener('input', function (e) {
        var v = inp.value.replace(/\D/g, '');
        inp.value = v.slice(-1);
        if (v && i < inputs.length - 1) inputs[i + 1].focus();
        notify();
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !inp.value && i > 0) {
          inputs[i - 1].focus();
          inputs[i - 1].value = '';
          notify();
        }
        if (e.key === 'ArrowLeft' && i > 0) inputs[i - 1].focus();
        if (e.key === 'ArrowRight' && i < inputs.length - 1) inputs[i + 1].focus();
      });
      inp.addEventListener('paste', function (e) {
        e.preventDefault();
        var txt = (e.clipboardData || window.clipboardData).getData('text');
        var digits = txt.replace(/\D/g, '').slice(0, inputs.length);
        digits.split('').forEach(function (d, j) { if (inputs[j]) inputs[j].value = d; });
        var nextIdx = Math.min(digits.length, inputs.length - 1);
        inputs[nextIdx].focus();
        notify();
      });
    });

    function notify() {
      var code = inputs.map(function (i) { return i.value; }).join('');
      if (typeof opts.onChange === 'function') opts.onChange(code);
      if (code.length === inputs.length && /^\d+$/.test(code)) {
        if (typeof opts.onComplete === 'function') opts.onComplete(code);
      }
    }
  }

  var AppOtp = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = AppOtp;
  else root.AppOtp = AppOtp;
})(typeof window !== 'undefined' ? window : this);
