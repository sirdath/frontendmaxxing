/* ============================================
   GRADIENT PROGRESS — Controller for gprog & gpring elements
   ============================================
   Usage:
     GradientProgress.set('.gprog', 65);
     GradientProgress.animateTo(el, 80, { duration: 800 });
     GradientProgress.init('[data-gprog]');  // reads data-gprog-value
   ============================================ */
(function (root) {
  'use strict';

  function set(target, value) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var v = clamp(value, 0, 100);
    Array.prototype.forEach.call(els, function (el) {
      el.style.setProperty('--v', v);
      var label = el.querySelector('.gpring-label, .gprog-value');
      if (label) label.textContent = Math.round(v) + '%';
    });
  }

  function animateTo(target, value, opts) {
    opts = opts || {};
    var duration = opts.duration || 800;
    var easing = opts.easing || function (t) { return 1 - Math.pow(1 - t, 3); };
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);

    Array.prototype.forEach.call(els, function (el) {
      var from = parseFloat(getComputedStyle(el).getPropertyValue('--v')) || 0;
      var to = clamp(value, 0, 100);
      var t0 = null;
      function step(t) {
        if (t0 == null) t0 = t;
        var p = Math.min(1, (t - t0) / duration);
        var eased = easing(p);
        var current = from + (to - from) * eased;
        el.style.setProperty('--v', current.toFixed(2));
        var label = el.querySelector('.gpring-label, .gprog-value');
        if (label) label.textContent = Math.round(current) + '%';
        if (p < 1) requestAnimationFrame(step);
        else if (typeof opts.onDone === 'function') opts.onDone();
      }
      requestAnimationFrame(step);
    });
  }

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '[data-gprog]')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      var v = parseFloat(el.dataset.gprogValue || el.getAttribute('aria-valuenow') || '0');
      var auto = el.dataset.gprogAuto === 'true';
      if (auto) animateTo(el, v);
      else set(el, v);
    });
  }

  function clamp(v, a, b) { v = Number(v); return v < a ? a : (v > b ? b : v); }

  var GradientProgress = { set: set, animateTo: animateTo, init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = GradientProgress;
  else root.GradientProgress = GradientProgress;
})(typeof window !== 'undefined' ? window : this);
