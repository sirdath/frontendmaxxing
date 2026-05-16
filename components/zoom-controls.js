/* ============================================
   ZOOM CONTROLS — Wire +/- buttons + scroll-wheel
   ============================================
   Usage:
     ZoomControls.init('[data-zoom-controls]', {
       min: 25, max: 400, step: 25,
       value: 100,
       onChange: function (pct) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    min: 25,
    max: 400,
    step: 25,
    value: 100,
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

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var pct = o.value;
    var level = el.querySelector('[data-zoom-level]');

    function paint() {
      if (level) level.textContent = Math.round(pct) + '%';
    }
    function set(v) {
      pct = clamp(v, o.min, o.max);
      paint();
      if (typeof o.onChange === 'function') o.onChange(pct);
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      if (t.hasAttribute('data-zoom-in'))  set(pct + o.step);
      else if (t.hasAttribute('data-zoom-out')) set(pct - o.step);
      else if (t.hasAttribute('data-zoom-reset')) set(100);
      else if (t.hasAttribute('data-zoom-fit') && typeof opts.onFit === 'function') opts.onFit();
      else if (t === level && typeof opts.onLevelClick === 'function') opts.onLevelClick();
    });

    paint();
    return { el: el, set: set, get: function () { return pct; } };
  }

  var ZoomControls = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ZoomControls;
  else root.ZoomControls = ZoomControls;
})(typeof window !== 'undefined' ? window : this);
